import "./Button.css";

export default function Button(p: {
  class?: string;
  color: 'yellow' | 'green' | 'blue'
  onClick?: () => void;
  children?: any;
  disabled?: boolean;
}) {
  return (
    <button
      class={`button ${p.color} ${p.class || ''}`}
      onClick={p.onClick}
      disabled={p.disabled}
    >
      {p.children}
    </button>
  );
}
