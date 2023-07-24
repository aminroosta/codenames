import "./Tooltip.css";

export default function Tooltip(p: {
  class?: string;
  children: any;
  hasArrow?: boolean;
  label: string;
  position: "bottom" | "top";
}) {
  return (
    <div class={`tooltip ${p.class || 'relative'}`}>
      {p.label}
      <div class={`tooltip-text ${p.position} ${!p.hasArrow && "no-arrow"}`}>
        {p.children}
      </div>
    </div>
  );
}
