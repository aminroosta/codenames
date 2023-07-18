import { Style } from "solid-start";
import { generateCards } from "~/common/gen-cards";
import Room from "~/components/Room";

export default function Home() {
  <Style>{` .room-story { width: 900px; margin: 0 auto; } `}</Style>
  const cards = generateCards().map(c => ({ ...c, face: Math.random() > 0.5 ? 'up' : 'down' }));
  const clue = { word: 'test', count: 1, votes: [['Amin', 'Negar'], ['Amin']] };

  return (
    <div class="room-story">
      <Room cards={cards} status='red-operator' userRole='red-operator' clue={clue} />
    </div>
  );
}
