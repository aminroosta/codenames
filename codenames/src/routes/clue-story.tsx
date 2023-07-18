import { Style } from "solid-start";
import Clue from "~/components/Clue";

export default function Home() {
  <Style>{`

  `}</Style>
  return (
    <div class="clue-story">
      <Clue onDone={clue => console.log(clue)} />
    </div>
  );
}
