import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { Role } from "~/common/types";
import Team from "~/components/Team";

export default function TeamStory() {
  const [state, setState] = createStore({
    spymasters: ["Amin", "Negar"],
    operatives: [],
    cardCount: 9,
    role: "none" as Role,
    onJoin: (role: Role) => {
      setState("role", role);
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
