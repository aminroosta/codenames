import { createSignal, For, Show, createEffect } from "solid-js";
import "./Clue.css";

export default function Clue(p: {
  onDone: (_: { word: string; count: number }) => void;
}) {
  const { onDone } = p;

  const [clue, setClue] = createSignal({
    word: "",
    count: undefined,
  });

  const [showCount, setShowCount] = createSignal(false);

  return (
    <div class="clue flex">
      <input
        placeholder="Type your clue here"
        type="text"
        class="word margin-r-5 border-r-5 box-shadow-bottom"
        onInput={(e) => {
          const uppercaseValue = e.target.value.toUpperCase();
          e.target.value = uppercaseValue;
          setClue({ ...clue(), word: uppercaseValue });
        }}
      />
      <button
        class="count margin-r-5 border-r-5 box-shadow-bottom"
        onClick={() => setShowCount(true)}
      >
        {clue().count ?? "-"}

        {showCount() && (
          <div class="flex number-container border-r-5">
            {Array.from(Array(10).keys()).map((num) => (
              <div
                class="flex number border-r-5 box-shadow-bottom"
                key={num}
                onClick={() => {
                  setClue({ ...clue(), count: num });
                  setShowCount(false);
                }}
              >
                {num}
              </div>
            ))}
          </div>
        )}
      </button>
      <button
        class="submit border-r-5 box-shadow-bottom"
        onClick={() => {
          const { word, count } = clue();
          onDone({ word, count });
        }}
        disabled={clue().word.length === 0 || clue().count === 0}
      >
        Give Clue
      </button>
    </div>
  );
}
