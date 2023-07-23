import { createEffect, For, Index } from "solid-js";
import { RoomStatus, Role, Clue, Vote } from "~/common/types";
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
  clue?: Clue;
  votes: Vote[];
  onToggleVote: (card_idx: number) => void;
  onShowCard: (card_idx: number) => void;
}) {
  return (
    <div class="board">
      <Index each={p.cards}>
        {(card, i) => {
          const index = () => p.cards.filter(c => c.color === card().color).indexOf(card());
          const votes = () => p.votes.find(v => v.card_idx === i)?.nicknames ?? [];
          return <Card
            image={card().image}
            color={card().color}
            face={card().face}
            index={index()}
            votes={votes()}
            role={p.role}
            status={p.status}
            onToggleVote={() => p.onToggleVote(i)}
            onShowCard={() => p.onShowCard(i)}
          />
        }}
      </Index>
    </div>
  );
}
