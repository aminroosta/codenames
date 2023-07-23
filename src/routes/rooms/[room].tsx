import type { Role, Room, User, UserRole, Clue as ClueType, RoomStatus, Vote } from "~/common/types";
import { createEffect, createResource, createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { useLocation } from "solid-start";
import Board from "~/components/Board";
import Team from "~/components/Team";
import Clue from "~/components/Clue";
import "./room.css";
import RoomSetup from "~/components/RoomSetup";
import Menu from "~/components/Menu";
import BoardTitle from "~/components/BoardStatus";
import ClueDisplay from "~/components/ClueDisplay";
import Button from "~/components/Button";

export default function Room() {
  const { epochs, wsSend } = liveEpochs();

  const location = useLocation();
  const [room] = createResource(
    () => epochs().room,
    (_) => {
      const name = location.pathname.split('/').pop();
      return fetch(`/api/room?name=${name}`).then(r => r.json());
    }
  );
  const [roles] = createResource(
    () => epochs().roles,
    () => {
      const name = location.pathname.split('/').pop();
      return fetch(`/api/room/role?name=${name}`).then(r => r.json());
    }
  );
  const [clues] = createResource(
    () => epochs().clues,
    () => {
      const name = location.pathname.split('/').pop();
      return fetch(`/api/room/clue?name=${name}`).then(r => r.json());
    },
  );
  const [user, userHandle] = createResource(
    () => epochs().user,
    () => fetch(`/api/user`).then(r => r.json())
  );

  const [votes] = createResource(
    () => clues.latest && epochs().votes,
    () => {
      if (!clues.latest.length) return [];
      const clue_id = clues.latest[clues.latest.length - 1].clue_id;
      return fetch(`/api/vote?clue_id=${clue_id}`).then(r => r.json());
    }
  );

  const onJoinRoom = async ({ nickname }: { nickname: string }) => {
    const user = await fetch(
      '/api/user', {
      method: 'PUT',
      body: JSON.stringify({ nickname })
    }).then(r => r.json());
    userHandle.mutate(user);
  };

  return <Show
    when={user.latest && user.latest.nickname}
    fallback={
      <RoomSetup
        nickname=''
        onClick={onJoinRoom}
        buttonLabel="Join Room"
      />
    }
  >
    <Show
      when={room.latest && roles.latest && user.latest && clues.latest}
      fallback={<div>loading ...</div>}
    >
      <RoomImpl
        room={room.latest}
        roles={roles.latest}
        user={user.latest}
        clues={clues.latest}
        wsSend={wsSend}
        votes={votes.latest || []}
        cards={cards.latest || []}
      />
    </Show>
  </Show>
}

function RoomImpl(p: {
  room: Room,
  roles: UserRole[],
  user: User,
  clues: ClueType[],
  votes: Vote[],
  wsSend: (type: string, data: any) => void,
}) {
  p.wsSend('join', { room_id: p.room.room_id });

  const status = () => {
    if (p.room.status !== 'lobby') {
      return p.room.status;
    }
    const turns: RoomStatus[] = [
      'red-spymaster',
      'red-operator',
      'blue-spymaster',
      'blue-operator'
    ];
    const redCardCount = p.room.cards.filter(c => c.color == 'red').length;
    const blueCardCount = p.room.cards.filter(c => c.color == 'blue').length;
    let turnIndex = redCardCount > blueCardCount ? 0 : 2;
    if (p.clues.length === 0) {
      return turns[turnIndex];
    };
    turnIndex += p.clues
      .map(c => c.status === 'active' ? 1 : 2)
      .reduce((a, b) => a + b, 0);

    return turns[turnIndex % turns.length];
  };

  const cards = () => p.room.cards;
  const role = () => p.roles.find(r => r.user_id === p.user.user_id)?.role || 'none';
  const clue = () => p.clues.filter(c => c.status == 'active')[0] || { word: '', count: 0 };

  const onClue = (clue: { word: string, count: number }) => {
    fetch("/api/room/clue", {
      method: "POST",
      body: JSON.stringify({ ...clue, room_id: p.room.room_id }),
    });
  };
  const onResetGame = () => fetch("/api/room", {
    method: "PATCH",
    body: JSON.stringify({ room_id: p.room.room_id }),
  });
  const onSwitchSides = () => fetch("/api/room/role", {
    method: "POST",
    body: JSON.stringify({ role: 'none', room_id: p.room.room_id }),
  });
  const onUpdateNickname = () => fetch(
    '/api/user', {
    method: 'PUT',
    body: JSON.stringify({ nickname: '', room_id: p.room.room_id })
  });

  const onToggleVote = (card_idx: number) => {
    fetch("/api/vote", {
      method: "POST",
      body: JSON.stringify({ clue_id: clue().clue_id, card_idx }),
    });
  };
  const onShowCard = (card_idx: number) => {
    fetch("/api/card", {
      method: "POST",
      body: JSON.stringify({ clue_id: clue().clue_id, card_idx }),
    });
  };
  const onEndGuessing = () => {
    fetch("/api/room/clue", {
      method: "PUT",
      body: JSON.stringify({ clue_id: clue().clue_id, room_id: p.room.room_id }),
    });
  };

  return <div>
    <Menu
      nicknames={p.roles.map(r => r.nickname)}
      role={role()}
      nickname={p.user.nickname}
      onResetGame={onResetGame}
      onSwitchSides={onSwitchSides}
      onUpdateNickname={onUpdateNickname}
    />
    <div class='room'>
      <TeamImpl color="red" room={p.room} roles={p.roles} user={p.user} />
      <div class="board-wrapper">
        <BoardTitle status={status()} role={role()} />
        <Board
          status={status()}
          cards={cards()}
          role={role()}
          clue={clue()}
          votes={p.votes}
          onToggleVote={onToggleVote}
          onShowCard={onShowCard}
        />
        <Show when={role().includes('spymaster') && role() == status()}>
          <Clue onDone={onClue} />
        </Show>
        <Show when={clue()?.status === "active"}>
          <ClueDisplay
            word={clue().word}
            count={clue().count}
            belongsToTeam={status().includes("blue") ? "blue" : "red"}
          />
        </Show>
        <Show when={
          clue()?.status === "active" &&
          role() == status() &&
          role().endsWith('-operator')
        }>
          <Button
            class="end-guessing"
            color="yellow"
            onClick={onEndGuessing}
          >End Guessing</Button>
        </Show>
      </div>
      <TeamImpl color="blue" room={p.room} roles={p.roles} user={p.user} />
    </div>;
  </div>
}

function TeamImpl(p: {
  color: "red" | "blue",
  room: Room,
  roles: UserRole[],
  user: User
}) {
  const spymasters = () => p.roles
    .filter(r => r.role == `${p.color}-spymaster`)
    .map(r => r.nickname)
    .sort();
  const operatives = () => p.roles
    .filter(r => r.role == `${p.color}-operator`)
    .map(r => r.nickname)
    .sort();

  const cardCount = () => p.room.cards.filter(
    c => c.color === p.color && c.face === 'down'
  ).length;
  const role = () => {
    const user_id = p.user.user_id;
    return p.roles.find(r => r.user_id == user_id)?.role || 'none';
  };
  const onJoin = async (role: Role) => {
    await fetch("/api/room/role", {
      method: "POST",
      body: JSON.stringify({ role, room_id: p.room.room_id }),
    });
  };

  return <Team
    role={role()}
    color={p.color}
    cardCount={cardCount()}
    onJoin={onJoin}
    spymasters={spymasters()}
    operatives={operatives()}
  />
}

function liveEpochs() {
  const [epochs, setEpochs] = createSignal({
    room: 0,
    roles: 0,
    user: 0,
    clues: 0,
    votes: 0,
  });

  let promise: Promise<WebSocket> = fetch('/api/ws')
    .then(r => r.json())
    .then(({ port }) => new Promise(
      resolve => {
        const { hostname } = window.location;
        const ws = new WebSocket(
          port == 80 ?
            `wss://${hostname}` :
            `ws://${hostname}:${port}`
        );
        ws.onopen = () => resolve(ws);

        ws.onmessage = event => {
          const { type, data } = JSON.parse(event.data);

          if (type == 'epoch') {
            setEpochs({ ...epochs(), ...data });
          }
        };

        ws.onclose = _e => {
          window.alert("websocket closed");
        };

      })
    );

  const wsSend = (type: string, data: any) => {
    promise = promise.then((ws) => {
      ws.send(JSON.stringify({ type, data }));
      return ws;
    });
  };

  return { epochs, wsSend };
}
