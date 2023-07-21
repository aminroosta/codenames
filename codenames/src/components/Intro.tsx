import Button from "./Button";
import "./Intro.css";

export default function Intro(p: { onClick: () => void }) {
  return <div class="intro">
    <h1>Codenames<br />Pictures</h1>
    <h2> Play with your friends </h2>
    <ul>
      <li> Codenames Pictures: a game of clues, images and spies. </li>
      <li> Two teams, each with a spymaster who knows the secret agents. </li>
      <li> Spymasters give one-word hints to their teammates.</li>
      <li> Find your agents before the other team, but avoid the assassin.</li>
      <li> Click on create room button and share the link with your friends.</li>
      <li> Have fun!</li>
    </ul>

    <Button color="yellow" onClick={p.onClick}> Create a room </Button>
  </div>;
}
