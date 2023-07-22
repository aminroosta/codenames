import { createSignal, onMount } from "solid-js";
import Button from "./Button";
import "./RoomSetup.css";

export default function RoomSetup(p: {
  nickname: string;
  onClick: ({ nickname }: { nickname: string }) => void;
  buttonLabel: string;
}) {
  const [nickname, setNickname] = createSignal(p.nickname || '');

  let input: HTMLInputElement;
  onMount(() => {
    input.focus();
  });

  return <div class="room-setup">
    <h3> Welcome to Codename Pictures </h3>

    <p> To enter the room, choose a nickname. </p>
    <input
      ref={input}
      value={nickname()}
      placeholder="Nickname"
      type="text"
      onInput={(e) => {
        const value = e.target.value;
        setNickname(value);
      }}
      onKeyPress={(e) => {
        if (e.key === 'Enter' && nickname()) {
          p.onClick({ nickname: nickname() });
        }
      }}
    />

    <Button color="yellow" onClick={() => {
      if (nickname()) {
        p.onClick({ nickname: nickname() });
      }
    }}> {p.buttonLabel} </Button>
  </div>;
}
