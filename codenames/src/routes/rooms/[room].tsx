import type { Role, Room, User, UserRole, Clue as ClueType } from "~/common/types";
import { createEffect, createResource, createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { useLocation } from "solid-start";
import Board from "~/components/Board";
import Team from "~/components/Team";
import Clue from "~/components/Clue";
import "./room.css";
import RoomSetup from "~/components/RoomSetup";

export default function Room() {
  const epochs = liveEpochs();
  createEffect(() => {
    console.log(epochs());
  });

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


  const onClick = async ({ nickname }: { nickname: string }) => {
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
        onClick={onClick}
        buttonLabel="Join Room"
      />
    }
  >
    <Show
      when={room.latest && roles.latest && user.latest && clues.latest}
      fallback={<div>loading ...</div>}
    >
      <RoomImpl room={room.latest} roles={roles.latest} user={user.latest} clues={clues.latest} />
    </Show>
  </Show>
}

function RoomImpl(p: { room: Room, roles: UserRole[], user: User, clues: ClueType[] }) {
  const [state, setState] = createStore({
    cards: p.room.cards.map(c => ({ ...c, face: 'down' })),
    status: p.room.status,
  });

  const role = () => p.roles.find(r => r.user_id === p.user.user_id)?.role || 'none';
  const clue = () => p.clues[p.clues.length - 1] || { word: '', count: 0, votes: [] };
  createEffect(() => { console.log({ role: role() }) });

  const onClue = (clue: { word: string, count: number }) => {
    console.log(clue);
  };

  return <div class='room'>
    <TeamImpl color="red" room={p.room} roles={p.roles} user={p.user} />
    <div class="board-wrapper">
      <div class='status'> {state.status} </div>
      <Board
        {...state}
        role={role()}
        clue={clue()}
      />
      <Show when={role().includes('spymaster')}>
        <Clue onDone={onClue} />
      </Show>
    </div>
    <TeamImpl color="blue" room={p.room} roles={p.roles} user={p.user} />
  </div>;
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

  const cardCount = () => p.room.cards.filter(c => c.color === p.color).length;
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
  const [epochs, setEpochs] = createSignal({ room: 0, roles: 0, user: 0, clues: 0 });

  fetch('/api/ws')
    .then(r => r.json())
    .then(({ port }) => {
      const { hostname } = window.location;
      const websocket = new WebSocket(`ws://${hostname}:${port}`);

      websocket.onmessage = event => {
        const { type, data } = JSON.parse(event.data);

        if (type == 'epoch') {
          setEpochs({ ...epochs(), ...data });
        }
      };

      websocket.onclose = _e => {
        window.alert("websocket closed");
      };
    });

  return epochs;
}
