import type { Role, Room, User, UserRole } from "~/common/types";
import { createEffect, createResource, createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { useLocation } from "solid-start";
import Board from "~/components/Board";
import Team from "~/components/Team";
import Clue from "~/components/Clue";
import "./room.css";

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
    },
    { deferStream: true }
  );
  const [roles] = createResource(
    () => epochs().roles,
    () => {
      const name = location.pathname.split('/').pop();
      return fetch(`/api/room/role?name=${name}`).then(r => r.json());
    },
    { deferStream: true }
  );
  const [user] = createResource(
    () => epochs().user,
    () => fetch(`/api/user`).then(r => r.json())
  );

  return <Show
    when={room() && roles() && user()}
    fallback={<div>loading ...</div>}
  >
    <RoomImpl room={room()} roles={roles()} user={user()} />
  </Show>
}

function RoomImpl(p: { room: Room, roles: UserRole[], user: User }) {
  const [state, setState] = createStore({
    clue: { word: '', count: 0, votes: [] },
    role: 'red-spymaster' as Role,
    cards: p.room.cards.map(c => ({ ...c, face: 'down' })),
    status: p.room.status,
  });

  const onClue = (clue: { word: string, count: number }) => {
    console.log(clue);
  };

  return <div class='room'>
    <TeamImpl color="red" room={p.room} roles={p.roles} user={p.user} />
    <div class="board-wrapper">
      <div class='status'> {state.status} </div>
      <Board {...state} />
      <Show when={state.role.includes('spymaster')}>
        <Clue onDone={onClue} />
      </Show>
    </div>
    <TeamImpl color="blue" room={p.room} roles={p.roles} user={p.user} />
  </div>;
}

function TeamImpl(p: { color: "red" | "blue", room: Room, roles: UserRole[], user: User }) {
  const [state, setState] = createStore({
    role: "none" as Role,
    onJoin: (role: Role) => {
      setState("role", role);
    },
  });

  const spymasters = () => p.roles
    .filter(r => r.role == `${p.color}-spymaster`)
    .map(r => r.nickname)
    .sort();
  const operatives = () => p.roles
    .filter(r => r.role == `${p.color}-operator`)
    .map(r => r.nickname)
    .sort();

  const cardCount = () => p.room.cards.filter(c => c.color === p.color).length;
  const onJoin = async (role: Role) => {
    await fetch("/api/room/role", {
      method: "POST",
      body: JSON.stringify({ role, room_id: p.room.room_id }),
    });
  };

  return <Team
    {...state}
    color={p.color}
    cardCount={cardCount()}
    onJoin={onJoin}
    spymasters={spymasters()}
    operatives={operatives()}
  />
}

function liveEpochs() {
  const [epochs, setEpochs] = createSignal({ room: 0, roles: 0, user: 0 });

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
