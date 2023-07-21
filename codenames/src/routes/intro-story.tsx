import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import Intro from "~/components/Intro";

export default function IntroStory() {
  const [state, setState] = createStore({
    onClick: () => {
      console.log("clicked");
    }
  });

  createEffect(() => {
    console.log(JSON.parse(JSON.stringify(state)));
  });

  return <Intro {...state} />;
}
