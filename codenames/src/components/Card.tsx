import { createSignal, For, Show } from "solid-js";
import './Card.css';

export default function Card(p: {
  image: string;
  color: 'red' | 'blue' | 'neutral' | 'black';
  face: 'up' | 'down';
  index: number;
  votes: string[];
  votable?: boolean;
}) {

  const hueDeg = () => p.face == 'down' ? 0 : p.color == 'blue' ? 120 : p.color == 'red' ? 300 : 0;
  const hueSat = () => p.face == 'down' ? 100 : 250;
  const yCalc = () => {
    const step = p.color == 'blue' || p.color == 'red' ? 100 / 8.0
      : p.color == 'neutral' ? 100 / 5.0 : 0;
    return `calc(${step.toFixed(2)}% * ${p.index} - 2px)`;
  }

  return (
    <div class="card">
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
      <Show when={p.votable}>
        <div class="vote-count">{p.votes.length}</div>
        <div class="votes">{p.votes.join(', ')}</div>
        <button class="tap-card" />
      </Show>
    </div>
  );
}
