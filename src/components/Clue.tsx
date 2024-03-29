import { createSignal, For, Show, createEffect } from "solid-js";
import { clickOutside } from "~/common/directives";
import Button from "./Button";
import "./Clue.css";
import Tooltip from "./Tooltip";

export default function Clue(p: {
  onDone: (_: { word: string; count: number }) => void;
}) {
  const outsideClick = clickOutside;

  const [showCount, setShowCount] = createSignal(false);
  const [clue, setClue] = createSignal({
    word: "",
    count: null as any as number,
  });

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

        <div
          use:outsideClick={() => setShowCount(false)}
          class="flex number-container border-r-5"
          style={`opacity: ${showCount() ? 1 : 0}; pointer-events: ${showCount() ? 'default' : 'none'};`}>
          <For each={Array.from(Array(10).keys())}>
            {(num) => (
              <div
                class="flex number border-r-5 box-shadow-bottom"
                onClick={(e) => {
                  e.stopPropagation();
                  setClue({ ...clue(), count: num });
                  setShowCount(false);
                }}
              >
                {num}
              </div>
            )}
          </For>
        </div>
      </button>

      <Button
        color="green"
        onClick={() => {
          const { word, count } = clue();
          p.onDone({ word, count });
        }}
        disabled={clue().word.length === 0 || clue().count === null}
      >
        <Show when={clue().word.length === 0 || clue().count === null} fallback="Give Clue">
          <Tooltip label="Give Clue" position="top" hasArrow>
            Type your clue and select a count
          </Tooltip>
        </Show>
      </Button>
    </div>
  );
}
