import { createEffect, createSignal, For, Show } from "solid-js";
import { RoomStatus, Role } from "~/common/types";
import Tooltip from './Tooltip';
import './Card.css';
import './Tooltip.css';

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
    if (!tint()) return '';
    if (p.color == 'blue') return 'filter: hue-rotate(120deg) saturate(250%)';
    if (p.color == 'red') return 'filter: hue-rotate(220deg) saturate(250%)';
    if (p.color == 'black') return "filter: invert(1)";

    return 'none';
  }

  const yCalc = () => {
    const step = p.color == 'blue' || p.color == 'red' ? 100 / 8.0
      : p.color == 'neutral' ? 100 / 5.0 : 0;
      return `calc(${step.toFixed(2)}% * ${p.index} -${p.color != 'black' ? 2 : 0}px)`;
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
        style={cssFilter()} />
      <Show when={p.face === 'up'}>
        <div class="face-up" style={`
            background-position-y: ${yCalc()};
            background-image: url(/docs/${p.color}.png);
            background-repeat: no-repeat;
            background-position-x: ${p.color == 'black' ? '50%' : 0};
            height: ${p.color == 'black' ? '100%' : '90%'};
          `} />
      </Show>
      <Show when={isOperator() && p.votes.length > 0}>
        <Tooltip
          label={p.votes.length.toString()}
          class="vote-count"
          position="bottom"
        >
          {p.votes.join(', ')}
        </Tooltip>
      </Show>
      <Show when={canVote()}>
        <button class="tap-card" onClick={p.onShowCard} />
      </Show>
    </div>
  );
}
