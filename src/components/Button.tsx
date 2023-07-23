import { Ref } from "solid-js";
import "./Button.css";

export default function Button(p: {
  class?: string;
  color: 'yellow' | 'green' | 'blue'
  onClick?: () => void;
  children?: any;
  disabled?: boolean;
  ref?: Ref<HTMLButtonElement>;
}) {
  return (
    <div>
      <button
        class={`button ${p.color} ${p.class || ''}`}
        onClick={p.onClick}
        disabled={p.disabled}
        ref={p.ref}
      >
        {p.children}
      </button>
    </div>
  );
}
