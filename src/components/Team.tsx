import { Show } from "solid-js";
import { Transition } from "solid-transition-group";
import { Role } from "~/common/types";
import Button from "./Button";
import Card from "./Card";
import "./Team.css";

export default function Team(p: {
  color: 'red' | 'blue';
  spymasters: string[];
  operatives: string[];
  cardCount: number;
  role: Role;
  onJoin: (role: Role) => void;
}) {
  return (
    <div class={`team ${p.color}`}>
      <div class="header">
        <div class="count">{p.cardCount}</div>
        <Card
          image={`back-${p.color}.svg`}
          color={p.color}
          face='up'
          index={1}
          status='lobby'
          role="none"
          votes={[]}
        />
      </div>
      <div class="section">
        <div>Operative(s)</div>
        <div>{p.operatives.join(", ") || "-"}</div>
      </div>
      <Show when={p.role == 'none'}>
        <Button
          color="yellow"
          onClick={() => p.onJoin(`${p.color}-operator`)}
        >Join as Operative</Button>
      </Show>
      <div class="section">
        <div>Spymaster(s)</div>
        <div>{p.spymasters.join(", ") || "-"}</div>
      </div>
      <Show when={p.role == 'none'}>
        <Button
          color="yellow"
          onClick={() => p.onJoin(`${p.color}-spymaster`)}
        >Join as Spymaster</Button>
      </Show>
    </div>
  );
}
