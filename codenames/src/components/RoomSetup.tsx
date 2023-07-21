import { createSignal } from "solid-js";
import Button from "./Button";
import "./RoomSetup.css";

export default function RoomSetup(p: {
  nickname: string;
  onClick: ({ nickname }: { nickname: string }) => void;
}) {
  const [nickname, setNickname] = createSignal(p.nickname || '');

  return <div class="room-setup">
    <h3> Welcome to Codename Pictures </h3>

    <p> To enter a room choose a nickname </p>
    <input
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
    }}> Create a room </Button>
  </div>;
}
