import { useState } from "react";
import { useDiagram } from "../../store/diagramStore";
import { genId } from "../../utils/idGen";
import "./ClassEditor.css";

const VISIBILITIES = ["public", "private", "protected", "package"];
const STEREOTYPES  = ["class", "abstract", "interface", "enum"];
const COMMON_TYPES = ["String", "int", "long", "double", "float", "boolean", "void", "Object", "List", "Map"];

function emptyField() {
  return { id: genId(), visibility: "private", name: "", type: "String", defaultValue: "" };
}
function emptyMethod() {
  return { id: genId(), visibility: "public", name: "", params: [], returnType: "void", isAbstract: false };
}
function emptyParam() {
  return { id: genId(), name: "", type: "String" };
}

export default function ClassEditor() {
  const { state, act } = useDiagram();
  const { selected, present } = state;

  const cls = selected.type === "class"
    ? present.classes.find(c => c.id === selected.id)
    : null;

  const rel = selected.type === "relationship"
    ? present.relationships.find(r => r.id === selected.id)
    : null;

  if (!cls && !rel) {
    return (
      <div className="class-editor empty-state">
        <div className="empty-icon">◈</div>
        <p>Select a class or relationship<br/>on the canvas to edit it</p>
        <div className="tips">
          <div className="tip"><kbd>V</kbd> Select tool</div>
          <div className="tip"><kbd>R</kbd> Draw relation</div>
          <div className="tip"><kbd>Del</kbd> Delete selected</div>
          <div className="tip"><kbd>Ctrl+Z</kbd> Undo</div>
        </div>
      </div>
    );
  }

  if (rel) return <RelEditor rel={rel} />;
  return <ClsEditor cls={cls} act={act} />;
}

// ── Class Editor ──────────────────────────────────────────────────────────
function ClsEditor({ cls, act }) {
  const [expandedMethod, setExpandedMethod] = useState(null);

  const update = (updates) => act("UPDATE_CLASS", { id: cls.id, updates });

  const addField = () => {
    const f = emptyField();
    update({ fields: [...cls.fields, f] });
  };
  const updateField = (fid, changes) => {
    update({ fields: cls.fields.map(f => f.id === fid ? { ...f, ...changes } : f) });
  };
  const removeField = (fid) => update({ fields: cls.fields.filter(f => f.id !== fid) });

  const addMethod = () => {
    const m = emptyMethod();
    update({ methods: [...cls.methods, m] });
  };
  const updateMethod = (mid, changes) => {
    update({ methods: cls.methods.map(m => m.id === mid ? { ...m, ...changes } : m) });
  };
  const removeMethod = (mid) => {
    update({ methods: cls.methods.filter(m => m.id !== mid) });
    if (expandedMethod === mid) setExpandedMethod(null);
  };
  const addParam = (mid) => {
    updateMethod(mid, {
      params: [...(cls.methods.find(m => m.id === mid)?.params || []), emptyParam()],
    });
  };
  const updateParam = (mid, pid, changes) => {
    const method = cls.methods.find(m => m.id === mid);
    updateMethod(mid, { params: method.params.map(p => p.id === pid ? { ...p, ...changes } : p) });
  };
  const removeParam = (mid, pid) => {
    const method = cls.methods.find(m => m.id === mid);
    updateMethod(mid, { params: method.params.filter(p => p.id !== pid) });
  };

  return (
    <div className="class-editor">
      <div className="editor-header">
        <span className="editor-icon">✏️</span>
        <span>Class Editor</span>
      </div>

      {/* Class Name */}
      <section className="editor-section">
        <label className="field-label">Class Name</label>
        <input
          className="editor-input"
          value={cls.name}
          onChange={e => update({ name: e.target.value })}
          placeholder="ClassName"
        />
      </section>

      {/* Stereotype */}
      <section className="editor-section">
        <label className="field-label">Stereotype</label>
        <div className="btn-group">
          {STEREOTYPES.map(s => (
            <button
              key={s}
              className={`btn-group-btn ${cls.stereotype === s ? "active" : ""}`}
              onClick={() => update({ stereotype: s })}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      {/* Fields */}
      <section className="editor-section">
        <div className="section-header">
          <label className="field-label">Fields</label>
          <button className="add-btn" onClick={addField}>＋ Add</button>
        </div>
        {cls.fields.length === 0 && <p className="empty-hint">No fields yet</p>}
        {cls.fields.map(f => (
          <div key={f.id} className="member-row">
            <select
              className="vis-select"
              value={f.visibility}
              onChange={e => updateField(f.id, { visibility: e.target.value })}
            >
              {VISIBILITIES.map(v => <option key={v} value={v}>{v[0].toUpperCase()}</option>)}
            </select>
            <input
              className="editor-input flex1"
              placeholder="fieldName"
              value={f.name}
              onChange={e => updateField(f.id, { name: e.target.value })}
            />
            <input
              className="editor-input w80"
              placeholder="Type"
              value={f.type}
              list="type-list"
              onChange={e => updateField(f.id, { type: e.target.value })}
            />
            <input
              className="editor-input w70"
              placeholder="= val"
              value={f.defaultValue}
              onChange={e => updateField(f.id, { defaultValue: e.target.value })}
            />
            <button className="remove-btn" onClick={() => removeField(f.id)}>✕</button>
          </div>
        ))}
        <datalist id="type-list">
          {COMMON_TYPES.map(t => <option key={t} value={t} />)}
        </datalist>
      </section>

      {/* Methods */}
      <section className="editor-section">
        <div className="section-header">
          <label className="field-label">Methods</label>
          <button className="add-btn" onClick={addMethod}>＋ Add</button>
        </div>
        {cls.methods.length === 0 && <p className="empty-hint">No methods yet</p>}
        {cls.methods.map(m => (
          <div key={m.id} className="method-block">
            <div className="member-row">
              <select
                className="vis-select"
                value={m.visibility}
                onChange={e => updateMethod(m.id, { visibility: e.target.value })}
              >
                {VISIBILITIES.map(v => <option key={v} value={v}>{v[0].toUpperCase()}</option>)}
              </select>
              <input
                className="editor-input flex1"
                placeholder="methodName"
                value={m.name}
                onChange={e => updateMethod(m.id, { name: e.target.value })}
              />
              <input
                className="editor-input w80"
                placeholder="returnType"
                value={m.returnType}
                list="type-list"
                onChange={e => updateMethod(m.id, { returnType: e.target.value })}
              />
              <button
                className={`abs-btn ${m.isAbstract ? "active" : ""}`}
                title="Abstract"
                onClick={() => updateMethod(m.id, { isAbstract: !m.isAbstract })}
              >abs</button>
              <button
                className="icon-btn-sm"
                title="Params"
                onClick={() => setExpandedMethod(expandedMethod === m.id ? null : m.id)}
              >{expandedMethod === m.id ? "▲" : "▼"}</button>
              <button className="remove-btn" onClick={() => removeMethod(m.id)}>✕</button>
            </div>
            {expandedMethod === m.id && (
              <div className="params-section">
                <div className="params-header">
                  <span>Parameters</span>
                  <button className="add-btn small" onClick={() => addParam(m.id)}>＋ Param</button>
                </div>
                {(m.params || []).map(p => (
                  <div key={p.id} className="member-row">
                    <input
                      className="editor-input flex1"
                      placeholder="paramName"
                      value={p.name}
                      onChange={e => updateParam(m.id, p.id, { name: e.target.value })}
                    />
                    <input
                      className="editor-input w80"
                      placeholder="Type"
                      value={p.type}
                      list="type-list"
                      onChange={e => updateParam(m.id, p.id, { type: e.target.value })}
                    />
                    <button className="remove-btn" onClick={() => removeParam(m.id, p.id)}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

// ── Relationship Editor ───────────────────────────────────────────────────
const REL_TYPES = [
  "inheritance", "implementation", "association", "aggregation", "composition", "dependency"
];

function RelEditor({ rel }) {
  const { act } = useDiagram();
  const update = (updates) => act("UPDATE_RELATIONSHIP", { id: rel.id, updates });
  return (
    <div className="class-editor">
      <div className="editor-header"><span>🔗</span><span>Relationship Editor</span></div>
      <section className="editor-section">
        <label className="field-label">Type</label>
        <div className="btn-group" style={{ flexWrap: "wrap" }}>
          {REL_TYPES.map(t => (
            <button
              key={t}
              className={`btn-group-btn ${rel.type === t ? "active" : ""}`}
              onClick={() => update({ type: t })}
            >{t}</button>
          ))}
        </div>
      </section>
      <section className="editor-section">
        <label className="field-label">Label</label>
        <input className="editor-input" value={rel.label || ""} onChange={e => update({ label: e.target.value })} placeholder="e.g. uses" />
      </section>
      <section className="editor-section">
        <label className="field-label">Source Multiplicity</label>
        <input className="editor-input" value={rel.sourceMultiplicity || ""} onChange={e => update({ sourceMultiplicity: e.target.value })} placeholder="e.g. 1" />
      </section>
      <section className="editor-section">
        <label className="field-label">Target Multiplicity</label>
        <input className="editor-input" value={rel.targetMultiplicity || ""} onChange={e => update({ targetMultiplicity: e.target.value })} placeholder="e.g. 0..*" />
      </section>
    </div>
  );
}
