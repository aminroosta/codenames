import { onCleanup } from "solid-js";

export function clickOutside(el: HTMLElement, accessor: Function) {
  const onClick = (e: any) => !el.contains(e.target) && accessor()?.();
  document.body.addEventListener("click", onClick);

  onCleanup(() => document.body.removeEventListener("click", onClick));
}
