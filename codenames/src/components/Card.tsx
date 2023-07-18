import { createSignal, For, Show } from "solid-js";
import { Style } from "solid-start";

export default function Card(p: {
  image: string;
  color: 'red' | 'blue' | 'neutral' | 'black';
  face: 'up' | 'down';
  index: number;
  votes: string[];
  children?: any;
}) {

  const hueDeg = () => p.face == 'down' ? 0 : p.color == 'blue' ? 120 : p.color == 'red' ? 320 : 0;
  const hueSat = () => p.face == 'down' ? 0 : 150;
  return (
    <>
      <Style>{`
        .card {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          cursor: pointer;
        }
        .card img {
          width:100%;
          height:100%;
        }
        .face-up {
          position: absolute;
          width:100%;
          height:90%;
          bottom: 0;
          background-size: cover;
          background-position-x: 0px;
        }
        .votes {
          position: absolute;
          left: 5%;
          top: 3.5vw;
          display: flex;
          gap: 2px;
          flex-wrap: wrap;
          font-size: 2vw;
          text-wrap: nowrap;
          overflow: hidden;
        }
        .card:hover .votes .vote {
          opacity: 1;
        }
        .votes .vote {
          opacity: 0;
          background-color: blue;
          color: white;
          padding: 2px 4px;
          line-height: 1;
          text-overflow: ellipsis;
        }
        .vote-count {
          position: absolute;
          left: 2%;
          top: 2%;
          border: 1px solid blue;
          border-radius: 50%;
          width: 2.5vw;
          height: 2.5vw;
          text-align: center;
          line-height: 2.5vw;
        }
      `}</Style>

      <div class="card">
        <img src={'/cards/' + p.image} alt={p.image} style={`
          filter: hue-rotate(${hueDeg()}deg) saturate(${hueSat()}%);
        `} />
        <Show when={p.face === 'up'}>
          <div class="face-up" style={`
            background-position-y: calc(12.5% * ${p.index});
            background-image: url(/docs/${p.color}.png);
          `} />
        </Show>
        <Show when={p.votes.length}>
          <div class="vote-count">{p.votes.length}</div>
          <div class="votes" style={`color: ${p.color};`}>
            <For each={p.votes}>
              {(v) => <div class="vote">{v}</div>}
            </For>
          </div>
        </Show>
      </div>
    </>
  );
}
