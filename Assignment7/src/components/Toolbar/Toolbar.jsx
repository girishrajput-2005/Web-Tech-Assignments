import { useDiagram } from "../../store/diagramStore";
import "./Toolbar.css";

const TOOLS = [
  { id: "select", icon: "↖", label: "Select (V)" },
  { id: "addRelation", icon: "↗", label: "Draw Relation (R)" },
];

const REL_TYPES = [
  { id: "inheritance",    label: "Inheritance",    symbol: "—▷" },
  { id: "implementation", label: "Implementation", symbol: "- -▷" },
  { id: "association",    label: "Association",    symbol: "——→" },
  { id: "aggregation",    label: "Aggregation",    symbol: "——◇" },
  { id: "composition",    label: "Composition",    symbol: "——◆" },
  { id: "dependency",     label: "Dependency",     symbol: "- -→" },
];

// ── Sample "Animal Kingdom" diagram ──────────────────────────────────────────
const SAMPLE = {
  classes: [
    {
      id: "c1", name: "Speakable", stereotype: "interface",
      position: { x: 340, y: 30 },
      fields: [],
      methods: [
        { id: "m1a", visibility: "public", name: "speak", params: [], returnType: "String", isAbstract: false },
        { id: "m1b", visibility: "public", name: "getSound", params: [], returnType: "String", isAbstract: false },
      ],
    },
    {
      id: "c2", name: "Animal", stereotype: "abstract",
      position: { x: 310, y: 170 },
      fields: [
        { id: "f2a", visibility: "private", name: "name",    type: "String",  defaultValue: "" },
        { id: "f2b", visibility: "private", name: "age",     type: "int",     defaultValue: "0" },
        { id: "f2c", visibility: "protected", name: "alive", type: "boolean", defaultValue: "true" },
      ],
      methods: [
        { id: "m2a", visibility: "public",    name: "getName",  params: [],                                            returnType: "String",  isAbstract: false },
        { id: "m2b", visibility: "public",    name: "getAge",   params: [],                                            returnType: "int",     isAbstract: false },
        { id: "m2c", visibility: "public",    name: "eat",      params: [{ id: "p1", name: "food", type: "String" }],  returnType: "void",   isAbstract: false },
        { id: "m2d", visibility: "public",    name: "speak",    params: [],                                            returnType: "String",  isAbstract: true  },
      ],
    },
    {
      id: "c3", name: "Dog", stereotype: "class",
      position: { x: 80, y: 380 },
      fields: [
        { id: "f3a", visibility: "private", name: "breed", type: "String", defaultValue: "" },
        { id: "f3b", visibility: "private", name: "trained", type: "boolean", defaultValue: "false" },
      ],
      methods: [
        { id: "m3a", visibility: "public", name: "speak",   params: [],                                             returnType: "String", isAbstract: false },
        { id: "m3b", visibility: "public", name: "getSound",params: [],                                             returnType: "String", isAbstract: false },
        { id: "m3c", visibility: "public", name: "fetch",   params: [{ id: "p2", name: "item", type: "String" }],   returnType: "void",   isAbstract: false },
      ],
    },
    {
      id: "c4", name: "Cat", stereotype: "class",
      position: { x: 560, y: 380 },
      fields: [
        { id: "f4a", visibility: "private", name: "indoor", type: "boolean", defaultValue: "true" },
        { id: "f4b", visibility: "private", name: "lives",  type: "int",     defaultValue: "9" },
      ],
      methods: [
        { id: "m4a", visibility: "public", name: "speak",    params: [], returnType: "String", isAbstract: false },
        { id: "m4b", visibility: "public", name: "getSound", params: [], returnType: "String", isAbstract: false },
        { id: "m4c", visibility: "public", name: "purr",     params: [], returnType: "void",   isAbstract: false },
      ],
    },
    {
      id: "c5", name: "AnimalShelter", stereotype: "class",
      position: { x: 820, y: 170 },
      fields: [
        { id: "f5a", visibility: "private", name: "shelterName", type: "String", defaultValue: "" },
        { id: "f5b", visibility: "private", name: "capacity",    type: "int",    defaultValue: "50" },
      ],
      methods: [
        { id: "m5a", visibility: "public", name: "admit",   params: [{ id: "p3", name: "animal", type: "Animal" }],  returnType: "void",   isAbstract: false },
        { id: "m5b", visibility: "public", name: "release", params: [{ id: "p4", name: "animal", type: "Animal" }],  returnType: "boolean", isAbstract: false },
        { id: "m5c", visibility: "public", name: "getCount",params: [],                                               returnType: "int",    isAbstract: false },
      ],
    },
    {
      id: "c6", name: "VetRecord", stereotype: "enum",
      position: { x: 820, y: 400 },
      fields: [
        { id: "f6a", visibility: "public", name: "HEALTHY",  type: "", defaultValue: "" },
        { id: "f6b", visibility: "public", name: "SICK",     type: "", defaultValue: "" },
        { id: "f6c", visibility: "public", name: "CRITICAL", type: "", defaultValue: "" },
      ],
      methods: [],
    },
  ],
  relationships: [
    // Animal implements Speakable
    { id: "r1", type: "implementation", sourceId: "c2", targetId: "c1", label: "", sourceMultiplicity: "", targetMultiplicity: "" },
    // Dog extends Animal
    { id: "r2", type: "inheritance",    sourceId: "c3", targetId: "c2", label: "", sourceMultiplicity: "", targetMultiplicity: "" },
    // Cat extends Animal
    { id: "r3", type: "inheritance",    sourceId: "c4", targetId: "c2", label: "", sourceMultiplicity: "", targetMultiplicity: "" },
    // Dog implements Speakable
    { id: "r4", type: "implementation", sourceId: "c3", targetId: "c1", label: "", sourceMultiplicity: "", targetMultiplicity: "" },
    // Cat implements Speakable
    { id: "r5", type: "implementation", sourceId: "c4", targetId: "c1", label: "", sourceMultiplicity: "", targetMultiplicity: "" },
    // AnimalShelter has composition with Animal
    { id: "r6", type: "composition",    sourceId: "c5", targetId: "c2", label: "houses", sourceMultiplicity: "1", targetMultiplicity: "0..*" },
    // AnimalShelter depends on VetRecord
    { id: "r7", type: "dependency",     sourceId: "c5", targetId: "c6", label: "uses", sourceMultiplicity: "", targetMultiplicity: "" },
    // Association: Dog — Cat (they coexist in shelter)
    { id: "r8", type: "association",    sourceId: "c3", targetId: "c4", label: "coexists", sourceMultiplicity: "", targetMultiplicity: "" },
  ],
};

export default function Toolbar({ onImport }) {
  const { state, act, dispatch } = useDiagram();
  const { tool, relationshipType } = state;

  const loadSample = () => {
    localStorage.setItem("uml_diagram", JSON.stringify(SAMPLE));
    act("LOAD");
  };

  return (
    <div className="toolbar">
      {/* Brand */}
      <div className="toolbar-brand">
        <span className="brand-icon">◈</span>
        <span className="brand-text">UML Designer</span>
      </div>

      <div className="toolbar-divider" />

      {/* Add Class */}
      <button
        className="toolbar-btn primary"
        onClick={() => {
          const x = 80 + Math.random() * 300;
          const y = 80 + Math.random() * 200;
          act("ADD_CLASS", { x, y });
          act("SET_TOOL", "select");
        }}
        title="Add Class (A)"
      >
        <span>＋</span> Add Class
      </button>

      {/* Load Sample */}
      <button
        className="toolbar-btn sample"
        onClick={loadSample}
        title="Load Animal Kingdom sample diagram"
      >
        🐾 Sample
      </button>

      {/* Import Java */}
      <button
        className="toolbar-btn import"
        onClick={onImport}
        title="Import Java code → UML Diagram"
      >
        📥 Import Java
      </button>

      <div className="toolbar-divider" />

      {/* Tools */}
      <div className="toolbar-group">
        {TOOLS.map(t => (
          <button
            key={t.id}
            className={`toolbar-btn icon-btn ${tool === t.id ? "active" : ""}`}
            onClick={() => act("SET_TOOL", t.id)}
            title={t.label}
          >
            {t.icon}
          </button>
        ))}
      </div>

      {/* Relationship type selector (visible when addRelation active) */}
      {tool === "addRelation" && (
        <select
          className="rel-type-select"
          value={relationshipType}
          onChange={e => act("SET_REL_TYPE", e.target.value)}
        >
          {REL_TYPES.map(rt => (
            <option key={rt.id} value={rt.id}>
              {rt.symbol} {rt.label}
            </option>
          ))}
        </select>
      )}

      <div className="toolbar-divider" />

      {/* Undo / Redo */}
      <button
        className="toolbar-btn icon-btn"
        onClick={() => act("UNDO")}
        disabled={state.past.length === 0}
        title="Undo (Ctrl+Z)"
      >↩</button>
      <button
        className="toolbar-btn icon-btn"
        onClick={() => act("REDO")}
        disabled={state.future.length === 0}
        title="Redo (Ctrl+Y)"
      >↪</button>

      <div className="toolbar-divider" />

      {/* Save / Load / Clear */}
      <button className="toolbar-btn" onClick={() => act("SAVE")} title="Save to browser">💾 Save</button>
      <button className="toolbar-btn" onClick={() => act("LOAD")} title="Load from browser">📂 Load</button>
      <button className="toolbar-btn danger" onClick={() => { if(window.confirm("Clear all?")) act("CLEAR"); }} title="Clear canvas">🗑 Clear</button>

      {/* Delete selected */}
      {state.selected.id && (
        <>
          <div className="toolbar-divider" />
          <button
            className="toolbar-btn danger"
            onClick={() => {
              if (state.selected.type === "class") act("DELETE_CLASS", state.selected.id);
              else act("DELETE_RELATIONSHIP", state.selected.id);
            }}
          >
            ✕ Delete
          </button>
        </>
      )}
    </div>
  );
}
