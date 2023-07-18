import { createSignal, For, Show } from "solid-js";
import './Clue.css';

export default function Clue(p: {
  onDone: (_: { word: string; count: number}) => void;
}) {
  return (
    <div class="clue">
      Clue ...
    </div>
  );
}
