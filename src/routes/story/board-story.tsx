import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { generateCards } from "~/common/gen-cards";
import Board from "~/components/Board";

export default function RoomStory() {
  const cards = generateCards().map(c => ({ ...c, face: Math.random() > 0.95 ? 'up' : 'down' }));
  const clue = { word: 'test', count: 1, votes: [['Amin', 'Negar'], ['Amin']] };

  const [state, setState] = createStore({ cards, clue, status: 'red-operator', role: 'red-operator' });

  (window as any).state = state;
  (window as any).setState = setState;

  createEffect(() => {
    console.log(JSON.parse(JSON.stringify(state)));
  });

  return (
    <div class="room-story">
      <Board {...state} />
    </div>
  );
}
