import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { generateCards } from "~/common/gen-cards";
import Room from "~/components/Room";

export default function RoomStory() {
  const cards = generateCards().map(c => ({ ...c, face: Math.random() > 0.5 ? 'up' : 'down' }));
  const clue = { word: 'test', count: 1, votes: [['Amin', 'Negar'], ['Amin']] };

  const [state, setState] = createStore({ cards, clue, status: 'red-operator', role: 'red-operator' });

  (window as any).state = state;
  (window as any).setState = setState;

  createEffect(() => {
    console.log(JSON.parse(JSON.stringify(state)));
  });

  return (
    <div class="room-story">
      <Room {...state} />
    </div>
  );
}
