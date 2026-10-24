import { useState, useRef } from "react";
import { useDiagram } from "../../store/diagramStore";
import { parseJavaCode } from "../../utils/javaParser";
import "./JavaImport.css";

const PLACEHOLDER = `// Paste one or more Java classes here, e.g.:

public abstract class Animal {
    private String name;
    private int age;

    public Animal(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() { return name; }
    public abstract String speak();
}

public class Dog extends Animal implements Speakable {
    private String breed;

    public Dog(String name, int age, String breed) {
        super(name, age);
        this.breed = breed;
    }

    @Override
    public String speak() { return "Woof!"; }

    public String getSound() { return "Woof"; }
}

public interface Speakable {
    String speak();
    String getSound();
}`;

export default function JavaImport({ onClose }) {
  const { act } = useDiagram();
  const [code, setCode]     = useState("");
  const [error, setError]   = useState(null);
  const [preview, setPreview] = useState(null);
  const textRef = useRef(null);

  const handleParse = () => {
    setError(null);
    setPreview(null);
    try {
      const result = parseJavaCode(code);
      setPreview(result);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleImport = () => {
    if (!preview) return;
    // Dispatch a LOAD with the parsed data
    act("LOAD_PARSED", preview);
    onClose();
  };

  const classCount = preview?.classes?.length ?? 0;
  const relCount   = preview?.relationships?.length ?? 0;

  return (
    <div className="ji-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ji-modal">
        {/* Header */}
        <div className="ji-header">
          <span>📥 Import Java Code → UML Diagram</span>
          <button className="ji-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="ji-body">
          <div className="ji-left">
            <div className="ji-label">
              Paste Java source code below (one or more classes / interfaces / enums):
            </div>
            <textarea
              ref={textRef}
              className="ji-textarea"
              value={code}
              onChange={e => { setCode(e.target.value); setPreview(null); setError(null); }}
              placeholder={PLACEHOLDER}
              spellCheck={false}
            />
            <div className="ji-actions">
              <button
                className="ji-btn primary"
                onClick={handleParse}
                disabled={!code.trim()}
              >
                🔍 Parse & Preview
              </button>
              {preview && (
                <button className="ji-btn success" onClick={handleImport}>
                  ✅ Import to Canvas
                </button>
              )}
              <button className="ji-btn ghost" onClick={onClose}>Cancel</button>
            </div>
          </div>

          {/* Preview panel */}
          <div className="ji-right">
            <div className="ji-label">Preview</div>
            {error && (
              <div className="ji-error">
                <span>⚠</span> {error}
              </div>
            )}
            {!preview && !error && (
              <div className="ji-empty">
                Click <strong>Parse & Preview</strong> to see what will be imported
              </div>
            )}
            {preview && (
              <div className="ji-preview">
                <div className="ji-summary">
                  Found <strong>{classCount}</strong> class{classCount !== 1 ? "es" : ""}
                  &nbsp;and <strong>{relCount}</strong> relationship{relCount !== 1 ? "s" : ""}
                </div>
                <div className="ji-class-list">
                  {preview.classes.map(cls => (
                    <div key={cls.id} className="ji-class-item">
                      <div className="ji-class-header">
                        <span className={`ji-badge ${cls.stereotype}`}>{cls.stereotype}</span>
                        <span className="ji-class-name">{cls.name}</span>
                      </div>
                      {cls.fields.length > 0 && (
                        <div className="ji-members">
                          {cls.fields.map(f => (
                            <div key={f.id} className="ji-member field">
                              <span className="vis">{visSymbol(f.visibility)}</span>
                              <span>{f.name}</span>
                              {f.type && <span className="type">: {f.type}</span>}
                            </div>
                          ))}
                        </div>
                      )}
                      {cls.methods.length > 0 && (
                        <div className="ji-members">
                          {cls.methods.map(m => (
                            <div key={m.id} className="ji-member method">
                              <span className="vis">{visSymbol(m.visibility)}</span>
                              <span className="mname">{m.name}</span>
                              <span className="type">()</span>
                              {m.returnType && <span className="type">: {m.returnType}</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {preview.relationships.length > 0 && (
                  <div className="ji-rels">
                    <div className="ji-rels-title">Relationships detected:</div>
                    {preview.relationships.map(r => {
                      const src = preview.classes.find(c => c.id === r.sourceId)?.name;
                      const tgt = preview.classes.find(c => c.id === r.targetId)?.name;
                      return (
                        <div key={r.id} className="ji-rel-row">
                          <span className={`ji-rel-type ${r.type}`}>{r.type}</span>
                          <span>{src} → {tgt}</span>
                          {r.label && <span className="ji-rel-label">"{r.label}"</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function visSymbol(v) {
  return { public: "+", private: "-", protected: "#", package: "~" }[v] ?? "~";
}
