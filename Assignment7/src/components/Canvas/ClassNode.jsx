import { useRef, useState } from "react";
import { useDiagram } from "../../store/diagramStore";
import { calcNodeHeight, NODE_WIDTH, VISIBILITY_SYMBOL, stereotypeLabel, getAnchors } from "../../utils/svgHelpers";

const STEREOTYPE_COLORS = {
  class: "#4f46e5",
  abstract: "#7c3aed",
  interface: "#0891b2",
  enum: "#059669",
};

export default function ClassNode({ cls, onDrawRelationFrom }) {
  const { state, act } = useDiagram();
  const isSelected = state.selected.id === cls.id;
  const isDrawing = state.tool === "addRelation";

  const dragRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const { headerH, fieldsH, methodsH, total } = calcNodeHeight(cls);
  const { x, y } = cls.position;
  const w = NODE_WIDTH;
  const hasStereotype = cls.stereotype && cls.stereotype !== "class";
  const stereotypeText = stereotypeLabel(cls.stereotype);
  const headerColor = STEREOTYPE_COLORS[cls.stereotype] || STEREOTYPE_COLORS.class;

  // ── Drag to move ──────────────────────────────────────────────────────
  const handleMouseDown = (e) => {
    if (isDrawing) return;
    if (e.button !== 0) return;
    e.stopPropagation();

    act("SET_SELECTED", { id: cls.id, type: "class" });

    const startX = e.clientX;
    const startY = e.clientY;
    const origX = cls.position.x;
    const origY = cls.position.y;
    const scale = state.viewport.scale;

    const onMove = (me) => {
      const dx = (me.clientX - startX) / scale;
      const dy = (me.clientY - startY) / scale;
      act("MOVE_CLASS", { id: cls.id, position: { x: origX + dx, y: origY + dy } });
    };
    const onUp = () => {
      act("COMMIT_MOVE");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // ── Click to draw relation ────────────────────────────────────────────
  const handleClick = (e) => {
    if (isDrawing) {
      e.stopPropagation();
      onDrawRelationFrom(cls.id);
    }
  };

  // ── Anchor dots ────────────────────────────────────────────────────────
  const anchors = getAnchors(cls);

  const ROW = 22;
  const PAD = 8;
  const FONT = 12.5;

  return (
    <g
      transform={`translate(${x},${y})`}
      style={{ cursor: isDrawing ? "crosshair" : "move" }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Drop shadow */}
      <rect x={3} y={3} width={w} height={total} rx={6} fill="rgba(0,0,0,0.25)" />

      {/* Header */}
      <rect width={w} height={headerH} rx={6} fill={headerColor} />
      {/* Clip bottom corners of header */}
      <rect x={0} y={headerH - 6} width={w} height={6} fill={headerColor} />

      {hasStereotype && (
        <text x={w / 2} y={18} textAnchor="middle" fontSize={10} fill="rgba(255,255,255,0.75)" fontStyle="italic">
          {stereotypeText}
        </text>
      )}
      <text
        x={w / 2}
        y={hasStereotype ? headerH - 10 : headerH / 2 + 6}
        textAnchor="middle"
        fontSize={14}
        fontWeight="700"
        fill="#fff"
        fontStyle={cls.stereotype === "abstract" ? "italic" : "normal"}
      >
        {cls.name || "Unnamed"}
      </text>

      {/* Fields section */}
      <rect y={headerH} width={w} height={fieldsH} fill="#1e1e2e" />
      <line x1={0} y1={headerH} x2={w} y2={headerH} stroke="#313145" strokeWidth={1} />
      {cls.fields.length === 0 ? (
        <text x={w / 2} y={headerH + fieldsH / 2 + 4} textAnchor="middle" fontSize={10} fill="#444460" fontStyle="italic">
          (no fields)
        </text>
      ) : cls.fields.map((f, i) => (
        <text key={f.id} x={PAD} y={headerH + PAD + 14 + i * ROW} fontSize={FONT} fill="#c8c8e0">
          <tspan fill="#94a3b8">{VISIBILITY_SYMBOL[f.visibility] || "-"} </tspan>
          <tspan>{f.name}</tspan>
          {f.type && <tspan fill="#7dd3fc">: {f.type}</tspan>}
          {f.defaultValue && <tspan fill="#86efac"> = {f.defaultValue}</tspan>}
        </text>
      ))}

      {/* Methods section */}
      <rect y={headerH + fieldsH} width={w} height={methodsH} fill="#16162a" rx={0} />
      <rect x={0} y={headerH + fieldsH + methodsH - 6} width={w} height={6} fill="#16162a" rx={0} />
      {/* Round bottom corners */}
      <rect x={0} y={headerH + fieldsH + methodsH - 6} width={6} height={6} rx={3} fill="#16162a" />
      <rect x={w - 6} y={headerH + fieldsH + methodsH - 6} width={6} height={6} rx={3} fill="#16162a" />
      <line x1={0} y1={headerH + fieldsH} x2={w} y2={headerH + fieldsH} stroke="#313145" strokeWidth={1} />
      {cls.methods.length === 0 ? (
        <text x={w / 2} y={headerH + fieldsH + methodsH / 2 + 4} textAnchor="middle" fontSize={10} fill="#444460" fontStyle="italic">
          (no methods)
        </text>
      ) : cls.methods.map((m, i) => (
        <text key={m.id} x={PAD} y={headerH + fieldsH + PAD + 14 + i * ROW} fontSize={FONT} fill="#c8c8e0">
          <tspan fill="#94a3b8">{VISIBILITY_SYMBOL[m.visibility] || "+"} </tspan>
          <tspan fill="#fbbf24">{m.name}</tspan>
          <tspan fill="#94a3b8">(</tspan>
          <tspan fill="#c8c8e0">{(m.params||[]).map(p => `${p.name}:${p.type}`).join(", ")}</tspan>
          <tspan fill="#94a3b8">)</tspan>
          {m.returnType && <tspan fill="#7dd3fc">: {m.returnType}</tspan>}
          {m.isAbstract && <tspan fill="#f97316"> {"{abstract}"}</tspan>}
        </text>
      ))}

      {/* Border */}
      <rect
        width={w}
        height={total}
        rx={6}
        fill="none"
        stroke={isSelected ? "#f59e0b" : (hovered ? "#6366f1" : "#313145")}
        strokeWidth={isSelected ? 2.5 : 1.5}
      />

      {/* Anchor dots on hover or when drawing */}
      {(hovered || isDrawing) && Object.entries(anchors).map(([side, anchor]) => (
        <circle
          key={side}
          cx={anchor.x - x}
          cy={anchor.y - y}
          r={5}
          fill={isDrawing ? "#4f46e5" : "#7c6af7"}
          stroke="white"
          strokeWidth={1.5}
          style={{ cursor: "crosshair" }}
        />
      ))}
    </g>
  );
}
