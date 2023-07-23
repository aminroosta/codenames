import { Style } from "solid-start";
import Clue from "~/components/Clue";

export default function Home() {
  <Style>{`
    .clue-story {
      background-color: brown;
      height: 100vh;
    }
    .container {
      width: 400px;
      margin: auto;
      padding-top: 40%;
    }
  `}</Style>;
  return (
    <div class="clue-story">
      <div class="container">
        <Clue onDone={(clue) => console.log(clue)} />
      </div>
    </div>
  );
}
