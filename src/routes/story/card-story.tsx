import { createEffect, For, onCleanup } from "solid-js";
import { Style } from "solid-start";
import Card from "~/components/Card";

export default function Home() {
  <Style>{`
    .card-story {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-column-gap: 1vw;
      grid-row-gap: calc(24px + 1vw);
    }
    .card-story > div {
      aspect-ratio: 1;
    }
  `}</Style>
  const votes = ['Amin', 'Negar', 'Masood'];
  return (
    <div class="card-story">
      <Card image="card-0.svg" color="black" face="up" index={0} votes={[]} status='red-operator' role='red-operator' />

      <For each={[0, 1, 2, 3, 4, 6, 7, 8]}>
        {(i) => <Card image={`card-${i}.svg`} color="red" face="down" index={i} votes={[]} status='lobby' role='red-operator' />}
      </For>
      <For each={[6, 7, 8]}>
        {(i) => <Card image={`card-${i}.svg`} color="red" face="up" index={i} votes={[]} status='lobby' role='red-operator' />}
      </For>
      <For each={[50, 60, 70, 80]}>
        {(i) => <Card image={`card-${i}.svg`} color="blue" face="down" index={i} votes={[...votes]} status='red-operator' role='red-operator' />}
      </For>
      <For each={[5, 6, 7, 8]}>
        {(i) => <Card image="card-1.svg" color="blue" face="up" index={i} votes={[]}  status='lobby' role='red-operator' />}
      </For>

    </div>
  );
}
