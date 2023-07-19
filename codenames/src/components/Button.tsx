import "./Button.css";

export default function Button(p: {
  color: 'yellow' | 'green' | 'blue'
  onClick?: () => void;
  children?: any;
  disabled?: boolean;
}) {
  return (
    <button
      class={`button ${p.color}`}
      onClick={p.onClick}
      disabled={p.disabled}
    >
      {p.children}
    </button>
  );
}
