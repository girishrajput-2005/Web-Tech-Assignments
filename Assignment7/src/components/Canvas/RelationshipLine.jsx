import { getBestAnchors, buildPath } from "../../utils/svgHelpers";
import { useDiagram } from "../../store/diagramStore";

// Marker IDs per relationship type
const MARKER_CONFIG = {
  inheritance:    { end: "arrow-hollow-tri",    dashed: false },
  implementation: { end: "arrow-hollow-tri",    dashed: true  },
  association:    { end: "arrow-open",          dashed: false },
  aggregation:    { end: "diamond-hollow",      dashed: false },
  composition:    { end: "diamond-filled",      dashed: false },
  dependency:     { end: "arrow-open",          dashed: true  },
};

const REL_COLORS = {
  inheritance: "#6366f1",
  implementation: "#8b5cf6",
  association: "#64748b",
  aggregation: "#06b6d4",
  composition: "#0284c7",
  dependency: "#94a3b8",
};

export default function RelationshipLine({ rel, srcCls, tgtCls }) {
  const { state, act } = useDiagram();
  const isSelected = state.selected.id === rel.id;

  if (!srcCls || !tgtCls) return null;

  const { s, t } = getBestAnchors(srcCls, tgtCls) || {};
  if (!s || !t) return null;

  const d = buildPath(s, t);
  const config = MARKER_CONFIG[rel.type] || MARKER_CONFIG.association;
  const color = REL_COLORS[rel.type] || "#64748b";
  const strokeDash = config.dashed ? "6,4" : undefined;

  const midX = (s.x + t.x) / 2;
  const midY = (s.y + t.y) / 2;

  return (
    <g
      onClick={e => {
        e.stopPropagation();
        act("SET_SELECTED", { id: rel.id, type: "relationship" });
      }}
    >
      {/* Wider invisible hit area */}
      <path
        d={d}
        fill="none"
        stroke="transparent"
        strokeWidth={14}
        style={{ cursor: "pointer" }}
      />
      {/* Visible line */}
      <path
        d={d}
        fill="none"
        stroke={isSelected ? "#f59e0b" : color}
        strokeWidth={isSelected ? 2.5 : 1.8}
        strokeDasharray={strokeDash}
        markerEnd={`url(#${config.end})`}
        style={{ cursor: "pointer" }}
      />
      {/* Labels */}
      {rel.label && (
        <text x={midX} y={midY - 8} textAnchor="middle" fontSize={11} fill="#94a3b8">{rel.label}</text>
      )}
      {rel.sourceMultiplicity && (
        <text x={s.x + 10} y={s.y - 5} fontSize={10} fill="#64748b">{rel.sourceMultiplicity}</text>
      )}
      {rel.targetMultiplicity && (
        <text x={t.x - 18} y={t.y - 5} fontSize={10} fill="#64748b">{rel.targetMultiplicity}</text>
      )}
    </g>
  );
}

export function SvgDefs() {
  return (
    <defs>
      {/* Open arrow (association, dependency) */}
      <marker id="arrow-open" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polyline points="0 0, 9 3.5, 0 7" fill="none" stroke="#64748b" strokeWidth="1.5" />
      </marker>

      {/* Hollow triangle (inheritance, implementation) */}
      <marker id="arrow-hollow-tri" markerWidth="12" markerHeight="9" refX="11" refY="4.5" orient="auto">
        <polygon points="0 0, 11 4.5, 0 9" fill="white" stroke="#6366f1" strokeWidth="1.5" />
      </marker>

      {/* Hollow diamond (aggregation) */}
      <marker id="diamond-hollow" markerWidth="14" markerHeight="8" refX="13" refY="4" orient="auto">
        <polygon points="0 4, 6 0, 12 4, 6 8" fill="white" stroke="#06b6d4" strokeWidth="1.5" />
      </marker>

      {/* Filled diamond (composition) */}
      <marker id="diamond-filled" markerWidth="14" markerHeight="8" refX="13" refY="4" orient="auto">
        <polygon points="0 4, 6 0, 12 4, 6 8" fill="#0284c7" stroke="#0284c7" strokeWidth="1.5" />
      </marker>
    </defs>
  );
}
