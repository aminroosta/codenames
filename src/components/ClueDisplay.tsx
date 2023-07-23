import { createSignal } from "solid-js";
import "./ClueDisplay.css";

export default function ClueDisplay(p: {
  word: string;
  count: number;
  belongsToTeam: "red" | "blue";
}) {
  const [transform, setTransform] = createSignal("translate(0, -40vw)");
  const [fontSize, setFontSize] = createSignal("40px");

  setTimeout(() => {
    setTransform("translate(0, 0)");
    setFontSize("24px");
  }, 2000);

  return (
    <div
      class={`clue-display flex ${p.belongsToTeam}`}
      style={`transform: ${transform()}`}
    >
      <div style={`font-size: ${fontSize()}`}>{p.word}</div>
      <div style={`font-size: ${fontSize()}`}>{p.count}</div>
    </div>
  );
}
