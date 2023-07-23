import { createEffect, createSignal, For, Show } from "solid-js";
import { RoomStatus, Role } from "~/common/types";
import './Card.css';

export default function Card(p: {
  image: string;
  color: 'red' | 'blue' | 'neutral' | 'black';
  face: 'up' | 'down';
  index: number;
  votes: string[];
  status: RoomStatus;
  role: Role;
  onToggleVote: () => void;
  onShowCard: () => void;
}) {
  const isSpymaster = () => ['red-spymaster', 'blue-spymaster'].includes(p.role);
  const isOperator = () => ['red-operator', 'blue-operator'].includes(p.status);
  const canVote = () => isOperator() && p.status == p.role && p.face == 'down';
  const tint = () => (p.face == 'up' || isSpymaster() || p.status.endsWith('-won')) && p.status !== 'lobby';

  const cssFilter = () => {
    const deg = !tint() ? 0 : p.color == 'blue' ? 120 : p.color == 'red' ? 220 : 0;
    const sat = !tint() ? 100 : 250;
    return `hue-rotate(${deg}deg) saturate(${sat}%)`;
  }

  const yCalc = () => {
    const step = p.color == 'blue' || p.color == 'red' ? 100 / 8.0
      : p.color == 'neutral' ? 100 / 5.0 : 0;
    return `calc(${step.toFixed(2)}% * ${p.index} - ${p.color != 'black' ? 2 : 0}px)`;
  }

  const onToggleVote = () => {
    if (canVote()) {
      p.onToggleVote();
    }
  };

  return (
    <div
      class="card"
      style={`cursor: ${canVote() ? 'pointer' : 'default'};`}
    >
      <img
        class="card-image"
        src={'/cards/' + p.image}
        alt={p.image}
        onClick={onToggleVote}
        style={`
          filter: ${cssFilter()};
        `} />
      <Show when={p.face === 'up' || (isSpymaster() && p.color === 'black')}>
        <div class="face-up" style={`
            background-position-y: ${yCalc()};
            background-image: url(/docs/${p.color}.png);
            background-repeat: no-repeat;
            background-position-x: ${p.color == 'black' ? '50%' : 0};
            height: ${p.color == 'black' ? '100%' : '90%'};
          `} />
      </Show>
      <Show when={isOperator() && p.votes.length > 0}>
        <div class="vote-count">{p.votes.length}</div>
        <div class="votes">{p.votes.join(', ')}</div>
      </Show>
      <Show when={canVote()}>
        <button class="tap-card" onClick={p.onShowCard} />
      </Show>
    </div>
  );
}
