
import { createEffect, For, onCleanup } from "solid-js";
import Card from "~/components/Card";
import "./Room.css";

export default function Home(p: {
  userRole: 'red-operator'
  | 'blue-operator'
  | 'red-spymaster'
  | 'blue-spymaster';
  cards: {
    image: string,
    color: 'red' | 'blue' | 'black' | 'neutral',
    face: 'up' | 'down',
  }[];
  status: 'lobby'
  | 'red-operator'
  | 'blue-operator'
  | 'red-spymaster'
  | 'blue-spymaster'
  | 'blue-won'
  | 'red-won';
  clue?: {
    word: string;
    count: number;
    votes: string[][];
  }
}) {
  return (
    <div class="room">
      <For each={p.cards}>
        {(card, i) => {
          const index = p.cards.filter(c => c.color === card.color).indexOf(card);
          const votes = p.clue?.votes[i()] || [];
          return <Card
            image={`card-${i()}.svg`}
            color={card.color}
            face={card.face}
            index={index}
            votes={votes}
            votable={p.userRole == p.status && card.face == 'down'}
          />
        }}
      </For>
    </div>
  );
}
