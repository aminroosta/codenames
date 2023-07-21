import { Show } from "solid-js";
import { createStore } from "solid-js/store";
import { createRouteData, useLocation, useRouteData } from "solid-start";
import Board from "~/components/Board";
import type { UserRole, Room } from "~/common/types";
import Team from "~/components/Team";
import "./room.css";
import Clue from "~/components/Clue";

export function routeData() {
  return createRouteData(async () => {
    const location = useLocation();
    const name = location.pathname.split('/').pop();
    return await fetch(`/api/room?name=${name}`).then(r => r.json());
  });
}

export default function Room() {
  const room = useRouteData() as any;
  return <Show
    when={room()}
    fallback={<div>loading ...</div>}
  >
    <RoomImpl room={room()} />
  </Show>
}

function RoomImpl(p: { room: Room }) {
  const [state, setState] = createStore({
    clue: { word: '', count: 0, votes: [] },
    role: 'red-spymaster' as UserRole,
    cards: p.room.cards.map(c => ({ ...c, face: 'down' })),
    status: p.room.status,
  });

  const cardCount = (color: 'red' | 'blue') => state.cards.filter(c => c.color === color).length;
  const onClue = (clue: { word: string, count: number }) => {
    console.log(clue);
  };

  return <div class='room'>
    <TeamImpl color="red" cardCount={cardCount('red')} />
    <div class="board-wrapper">
      <div class='status'> {state.status} </div>
      <Board {...state} />
      <Show when={state.role.includes('spymaster')}>
        <Clue onDone={onClue} />
      </Show>
    </div>
    <TeamImpl color="blue" cardCount={cardCount('blue')} />
  </div>;
}

function TeamImpl(p: { color: "red" | "blue", cardCount: number }) {
  const [state, setState] = createStore({
    spymasters: [],
    operatives: [],
    cardCount: p.cardCount,
    role: "none" as "none" | "operator" | "spymaster",
    onJoin: (role: "operator" | "spymaster") => {
      setState("role", role);
    },
  });

  return <Team {...state} color={p.color} />
}
