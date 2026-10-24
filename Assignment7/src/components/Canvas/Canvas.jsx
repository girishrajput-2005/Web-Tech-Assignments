import { useRef, useState, useEffect, useCallback } from "react";
import { useDiagram } from "../../store/diagramStore";
import ClassNode from "./ClassNode";
import RelationshipLine, { SvgDefs } from "./RelationshipLine";
import "./Canvas.css";

const GRID_SIZE = 20;

export default function Canvas() {
  const { state, act } = useDiagram();
  const { present, viewport, tool, relationshipType, selected } = state;
  const { classes, relationships } = present;
  const svgRef = useRef(null);

  // ── Drawing a relationship ────────────────────────────────────────────
  const [drawSrc, setDrawSrc] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const svgPoint = useCallback((clientX, clientY) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      x: (clientX - rect.left - viewport.x) / viewport.scale,
      y: (clientY - rect.top  - viewport.y) / viewport.scale,
    };
  }, [viewport]);

  const handleRelationFrom = (classId) => {
    if (!drawSrc) {
      setDrawSrc(classId);
    } else {
      if (drawSrc !== classId) {
        act("ADD_RELATIONSHIP", {
          type: relationshipType,
          sourceId: drawSrc,
          targetId: classId,
          label: "",
          sourceMultiplicity: "",
          targetMultiplicity: "",
        });
      }
      setDrawSrc(null);
    }
  };

  // ── Pan ────────────────────────────────────────────────────────────────
  const panRef = useRef(null);

  const handleBgMouseDown = (e) => {
    if (tool !== "select") return;
    if (e.button !== 0) return;
    act("SET_SELECTED", { id: null, type: null });
    panRef.current = { startX: e.clientX, startY: e.clientY, ox: viewport.x, oy: viewport.y };
    const onMove = (me) => {
      if (!panRef.current) return;
      act("SET_VIEWPORT", {
        ...viewport,
        x: panRef.current.ox + me.clientX - panRef.current.startX,
        y: panRef.current.oy + me.clientY - panRef.current.startY,
      });
    };
    const onUp = () => {
      panRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // ── Zoom ───────────────────────────────────────────────────────────────
  const handleWheel = (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.91;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const newScale = Math.min(3, Math.max(0.2, viewport.scale * factor));
    act("SET_VIEWPORT", {
      scale: newScale,
      x: cx - (cx - viewport.x) * (newScale / viewport.scale),
      y: cy - (cy - viewport.y) * (newScale / viewport.scale),
    });
  };

  // ── Mouse move for preview relation line ───────────────────────────────
  const handleMouseMove = (e) => {
    if (drawSrc) setMousePos(svgPoint(e.clientX, e.clientY));
  };

  // ── Cancel draw on Escape ─────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") { setDrawSrc(null); act("SET_TOOL", "select"); }
      if ((e.ctrlKey || e.metaKey) && e.key === "z") { act("UNDO"); }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.shiftKey && e.key === "z"))) { act("REDO"); }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (document.activeElement === document.body) {
          if (state.selected.type === "class") act("DELETE_CLASS", state.selected.id);
          if (state.selected.type === "relationship") act("DELETE_RELATIONSHIP", state.selected.id);
        }
      }
      if (e.key === "v" || e.key === "V") act("SET_TOOL", "select");
      if (e.key === "r" || e.key === "R") act("SET_TOOL", "addRelation");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state.selected, act]);

  // Preview line source
  const srcClass = drawSrc ? classes.find(c => c.id === drawSrc) : null;
  const srcCenter = srcClass
    ? { x: srcClass.position.x + 100, y: srcClass.position.y + 30 }
    : null;

  return (
    <div className="canvas-container">
      <svg
        ref={svgRef}
        className={`canvas-svg ${tool === "addRelation" ? "mode-draw" : ""}`}
        onMouseDown={handleBgMouseDown}
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
      >
        <SvgDefs />

        {/* Grid background */}
        <defs>
          <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse"
            patternTransform={`translate(${viewport.x % GRID_SIZE},${viewport.y % GRID_SIZE})`}>
            <path d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`} fill="none" stroke="#1f1f35" strokeWidth="0.7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        <g transform={`translate(${viewport.x},${viewport.y}) scale(${viewport.scale})`}>
          {/* Relationships */}
          {relationships.map(rel => (
            <RelationshipLine
              key={rel.id}
              rel={rel}
              srcCls={classes.find(c => c.id === rel.sourceId)}
              tgtCls={classes.find(c => c.id === rel.targetId)}
            />
          ))}

          {/* Preview line while drawing */}
          {drawSrc && srcCenter && (
            <line
              x1={srcCenter.x} y1={srcCenter.y}
              x2={mousePos.x} y2={mousePos.y}
              stroke="#4f46e5" strokeWidth={1.5} strokeDasharray="6,3"
              pointerEvents="none"
            />
          )}

          {/* Classes */}
          {classes.map(cls => (
            <ClassNode
              key={cls.id}
              cls={cls}
              onDrawRelationFrom={handleRelationFrom}
            />
          ))}
        </g>
      </svg>

      {/* Zoom indicator */}
      <div className="zoom-indicator">{Math.round(viewport.scale * 100)}%</div>

      {/* Draw-mode overlay badge */}
      {tool === "addRelation" && (
        <div className="draw-mode-badge">
          {drawSrc
            ? "Now click the TARGET class"
            : "Click the SOURCE class to start drawing"}
          <button onClick={() => { setDrawSrc(null); act("SET_TOOL", "select"); }}>✕ Cancel</button>
        </div>
      )}
    </div>
  );
}
