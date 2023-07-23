
import { Show } from "solid-js";
import { Role } from "~/common/types";
import Button from "./Button";
import { Transition } from "solid-transition-group";
import "./Menu.css";

export default function Menu(p: {
  nicknames: string[],
  role: Role,
  nickname: string,
  onResetGame: () => void,
  onSwitchSides: () => void,
  onUpdateNickname: () => void,
}) {

  // <span style="font-size: 8px;padding-left: 8px;">
  //   {p.nicknames.join(', ')}
  // </span>
  return <div class="menu">
    <div class="player-count">
      Players: {p.nicknames.length}
    </div>
    <Transition name="fade">
      <Show when={p.role !== 'none'}>
        <Button color="yellow" onClick={p.onSwitchSides}> Switch Sides </Button>
      </Show>
    </Transition>
    <Button color="yellow" onClick={p.onResetGame}> Reset Game </Button>
    <Button color="yellow" onClick={p.onUpdateNickname}> {p.nickname} </Button>
  </div>;
}
