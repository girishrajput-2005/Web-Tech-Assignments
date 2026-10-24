import { useState, useMemo } from "react";
import { useDiagram } from "../../store/diagramStore";
import { generateJavaFiles } from "../../utils/javaCodeGen";
import "./CodePanel.css";

export default function CodePanel() {
  const { state } = useDiagram();
  const { classes, relationships } = state.present;
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);

  const files = useMemo(
    () => generateJavaFiles(classes, relationships),
    [classes, relationships]
  );

  if (files.length === 0) {
    return (
      <div className="code-panel empty">
        <span className="code-empty-icon">☕</span>
        <p>Add classes to generate Java code</p>
      </div>
    );
  }

  const current = files[Math.min(activeFile, files.length - 1)];

  const copyAll = async () => {
    const all = files.map(f => `// === ${f.filename} ===\n${f.code}`).join("\n\n");
    await navigator.clipboard.writeText(all);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadZip = async () => {
    // Simple: download each file separately
    files.forEach(f => {
      const blob = new Blob([f.code], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = f.filename;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="code-panel">
      {/* Header */}
      <div className="code-panel-header">
        <span className="code-panel-title">☕ Java Code</span>
        <div className="code-actions">
          <button className="code-btn" onClick={copyAll} title="Copy all">
            {copied ? "✓ Copied!" : "📋 Copy All"}
          </button>
          <button className="code-btn" onClick={downloadZip} title="Download files">
            📦 Download
          </button>
        </div>
      </div>

      {/* File tabs */}
      <div className="file-tabs">
        {files.map((f, i) => (
          <button
            key={f.filename}
            className={`file-tab ${i === activeFile ? "active" : ""}`}
            onClick={() => setActiveFile(i)}
          >
            {f.filename}
          </button>
        ))}
      </div>

      {/* Code */}
      <div className="code-scroll">
        <pre className="code-block">
          <code>{highlightJava(current?.code || "")}</code>
        </pre>
      </div>
    </div>
  );
}

// ── Simple Java syntax highlighter (returns React elements) ───────────────
const KW = ["public","private","protected","class","abstract","interface","enum",
            "extends","implements","new","return","void","static","final","this",
            "null","true","false","int","long","double","float","boolean","String"];
const KW_SET = new Set(KW);

function highlightJava(code) {
  const lines = code.split("\n");
  return lines.map((line, li) => (
    <span key={li} className="code-line">
      <span className="line-num">{li + 1}</span>
      {tokenizeLine(line)}
      {"\n"}
    </span>
  ));
}

function tokenizeLine(line) {
  // Quick regex-based tokenizer
  const tokens = [];
  const re = /("(?:[^"\\]|\\.)*")|(\b(?:public|private|protected|class|abstract|interface|enum|extends|implements|new|return|void|static|final|this|null|true|false|int|long|double|float|boolean|String)\b)|(\/\/.*$)|(@\w+)|(\b[A-Z][a-zA-Z0-9_]*\b)|(\b\d+\b)|([\w]+)/g;
  let last = 0;
  let m;
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) tokens.push(<span key={last}>{line.slice(last, m.index)}</span>);
    const [full, str, kw, comment, ann, type, num] = m;
    if (str)     tokens.push(<span key={m.index} className="token-str">{full}</span>);
    else if (kw) tokens.push(<span key={m.index} className="token-kw">{full}</span>);
    else if (comment) tokens.push(<span key={m.index} className="token-comment">{full}</span>);
    else if (ann) tokens.push(<span key={m.index} className="token-ann">{full}</span>);
    else if (type) tokens.push(<span key={m.index} className="token-type">{full}</span>);
    else if (num) tokens.push(<span key={m.index} className="token-num">{full}</span>);
    else tokens.push(<span key={m.index}>{full}</span>);
    last = m.index + full.length;
  }
  if (last < line.length) tokens.push(<span key={last}>{line.slice(last)}</span>);
  return tokens;
}
