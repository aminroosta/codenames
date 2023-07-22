import { createEffect, For } from "solid-js";
import { RoomStatus, Role } from "~/common/types";
import Card from "~/components/Card";
import "./Board.css";

export default function Board(p: {
  role: Role;
  cards: {
    image: string,
    color: 'red' | 'blue' | 'black' | 'neutral',
    face: 'up' | 'down',
  }[];
  status: RoomStatus;
  clue?: {
    word: string;
    count: number;
    votes: string[][];
  }
}) {
  return (
    <div class="board">
      <For each={p.cards}>
        {(card, i) => {
          const index = p.cards.filter(c => c.color === card.color).indexOf(card);
          const votes = p.clue?.votes[i()] || [];
          return <Card
            image={card.image}
            color={card.color}
            face={card.face}
            index={index}
            votes={votes}
            role={p.role}
            status={p.status}
          />
        }}
      </For>
    </div>
  );
}
