import { Show } from "solid-js";
import { createStore } from "solid-js/store";
import { createRouteData, useLocation, useRouteData } from "solid-start";
import type { UserRole, Room } from "~/common/types";
import Board from "~/components/Board";

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
    role: 'none' as UserRole,
    cards: p.room.cards.map(c => ({ ...c, face: 'down' })),
    status: p.room.status,
  });

  return <div>
    <Board {...state} />
  </div>;
}
