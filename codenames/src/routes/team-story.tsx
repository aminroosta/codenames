import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import Team from "~/components/Team";

export default function TeamStory() {
  const [state, setState] = createStore({
    spymasters: ['Amin', 'Negar'],
    operatives: [],
    cardCount: 9,
    role: 'none',
    onJoin: (role: 'operator' | 'spymaster') => {
      setState('role', role);
    },
  });

  createEffect(() => {
    console.log(JSON.parse(JSON.stringify(state)));
  });

  return (
    <div style="display: flex; gap: 20px;">
      <Team {...state} color="red" />

      <Team {...state} color="blue" />
    </div>
  );
}
