import { createContext, useContext, useReducer, useCallback } from "react";
import { genId } from "../utils/idGen";

// ─── Initial State ───────────────────────────────────────────────────────
const INITIAL_DIAGRAM = {
  classes: [],
  relationships: [],
};

const initialState = {
  past: [],
  present: INITIAL_DIAGRAM,
  future: [],
  selected: { id: null, type: null },
  tool: "select",
  relationshipType: "inheritance",
  drawingRelation: null,
  viewport: { x: 0, y: 0, scale: 1 },
};

// ─── Reducer ─────────────────────────────────────────────────────────────
function pushHistory(state) {
  return {
    past: [...state.past.slice(-49), state.present],
    future: [],
  };
}

function reducer(state, action) {
  switch (action.type) {
    // ── Viewport ──────────────────────────────────────────────────────────
    case "SET_VIEWPORT":
      return { ...state, viewport: action.payload };

    // ── Tool ──────────────────────────────────────────────────────────────
    case "SET_TOOL":
      return { ...state, tool: action.payload, drawingRelation: null };

    case "SET_REL_TYPE":
      return { ...state, relationshipType: action.payload };

    case "SET_DRAWING_RELATION":
      return { ...state, drawingRelation: action.payload };

    // ── Selection ─────────────────────────────────────────────────────────
    case "SET_SELECTED":
      return { ...state, selected: action.payload };

    // ── Classes ───────────────────────────────────────────────────────────
    case "ADD_CLASS": {
      const cls = {
        id: genId(),
        name: "NewClass",
        stereotype: "class",
        position: action.payload || { x: 200, y: 150 },
        fields: [],
        methods: [],
      };
      const newPresent = {
        ...state.present,
        classes: [...state.present.classes, cls],
      };
      return {
        ...state,
        ...pushHistory(state),
        present: newPresent,
        selected: { id: cls.id, type: "class" },
      };
    }

    case "UPDATE_CLASS": {
      const newPresent = {
        ...state.present,
        classes: state.present.classes.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload.updates } : c
        ),
      };
      return { ...state, ...pushHistory(state), present: newPresent };
    }

    case "MOVE_CLASS": {
      // No history push for moves (too noisy); commit on mouseUp
      const newPresent = {
        ...state.present,
        classes: state.present.classes.map(c =>
          c.id === action.payload.id
            ? { ...c, position: action.payload.position }
            : c
        ),
      };
      return { ...state, present: newPresent };
    }

    case "COMMIT_MOVE": {
      // Push history after drag ends
      return { ...state, ...pushHistory(state) };
    }

    case "DELETE_CLASS": {
      const id = action.payload;
      const newPresent = {
        classes: state.present.classes.filter(c => c.id !== id),
        relationships: state.present.relationships.filter(
          r => r.sourceId !== id && r.targetId !== id
        ),
      };
      return {
        ...state,
        ...pushHistory(state),
        present: newPresent,
        selected: { id: null, type: null },
      };
    }

    // ── Relationships ─────────────────────────────────────────────────────
    case "ADD_RELATIONSHIP": {
      const rel = {
        id: genId(),
        ...action.payload,
      };
      const newPresent = {
        ...state.present,
        relationships: [...state.present.relationships, rel],
      };
      return {
        ...state,
        ...pushHistory(state),
        present: newPresent,
        selected: { id: rel.id, type: "relationship" },
      };
    }

    case "UPDATE_RELATIONSHIP": {
      const newPresent = {
        ...state.present,
        relationships: state.present.relationships.map(r =>
          r.id === action.payload.id ? { ...r, ...action.payload.updates } : r
        ),
      };
      return { ...state, ...pushHistory(state), present: newPresent };
    }

    case "DELETE_RELATIONSHIP": {
      const newPresent = {
        ...state.present,
        relationships: state.present.relationships.filter(
          r => r.id !== action.payload
        ),
      };
      return {
        ...state,
        ...pushHistory(state),
        present: newPresent,
        selected: { id: null, type: null },
      };
    }

    // ── Undo / Redo ───────────────────────────────────────────────────────
    case "UNDO": {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      return {
        ...state,
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future.slice(0, 49)],
        selected: { id: null, type: null },
      };
    }

    case "REDO": {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return {
        ...state,
        past: [...state.past, state.present],
        present: next,
        future: state.future.slice(1),
        selected: { id: null, type: null },
      };
    }

    // ── Save / Load ───────────────────────────────────────────────────────
    case "SAVE": {
      localStorage.setItem("uml_diagram", JSON.stringify(state.present));
      return state;
    }

    case "LOAD": {
      try {
        const data = JSON.parse(localStorage.getItem("uml_diagram") || "{}");
        if (!data.classes) return state;
        return {
          ...state,
          ...pushHistory(state),
          present: data,
          selected: { id: null, type: null },
        };
      } catch { return state; }
    }

    case "LOAD_PARSED": {
      // Directly load parsed Java data (classes + relationships)
      return {
        ...state,
        ...pushHistory(state),
        present: action.payload,
        selected: { id: null, type: null },
      };
    }

    case "CLEAR": {
      return {
        ...state,
        ...pushHistory(state),
        present: { classes: [], relationships: [] },
        selected: { id: null, type: null },
      };
    }

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────
const DiagramContext = createContext(null);

export function DiagramProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const act = useCallback((type, payload) => dispatch({ type, payload }), []);
  return (
    <DiagramContext.Provider value={{ state, dispatch, act }}>
      {children}
    </DiagramContext.Provider>
  );
}

export function useDiagram() {
  const ctx = useContext(DiagramContext);
  if (!ctx) throw new Error("useDiagram must be used inside DiagramProvider");
  return ctx;
}
