import { createSignal, For, Show } from "solid-js";
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
}) {
  const isSpymaster = () => ['red-spymaster', 'blue-spymaster'].includes(p.role);
  const isOperator = () => ['red-operator', 'blue-operator'].includes(p.status);
  const canVote = () => isOperator() && p.status == p.role;
  const tint = () => !(p.face == 'up' || isSpymaster()) || p.role == 'none';

  const hueDeg = () => tint() ? 0 : p.color == 'blue' ? 120 : p.color == 'red' ? 220 : 0;
  const hueSat = () => tint() ? 100 : 250;

  const yCalc = () => {
    const step = p.color == 'blue' || p.color == 'red' ? 100 / 8.0
      : p.color == 'neutral' ? 100 / 5.0 : 0;
    return `calc(${step.toFixed(2)}% * ${p.index} - 2px)`;
  }

  return (
    <div
      class="card"
      style={`cursor: ${canVote() ? 'pointer' : 'default'};`}
    >
      <img
        class="card-image"
        src={'/cards/' + p.image}
        alt={p.image}
        style={`
          filter: hue-rotate(${hueDeg()}deg) saturate(${hueSat()}%);
        `} />
      <Show when={p.face === 'up'}>
        <div class="face-up" style={`
            background-position-y: ${yCalc()};
            background-image: url(/docs/${p.color}.png);
          `} />
      </Show>
      <Show when={isOperator() && p.votes.length > 0}>
        <div class="vote-count">{p.votes.length}</div>
        <div class="votes">{p.votes.join(', ')}</div>
      </Show>
      <Show when={isOperator() && p.status == p.role && p.face == 'down'}>
        <button class="tap-card" />
      </Show>
    </div>
  );
}
