import { useState } from "react";
import { DiagramProvider } from "./store/diagramStore";
import Toolbar from "./components/Toolbar/Toolbar";
import Canvas from "./components/Canvas/Canvas";
import ClassEditor from "./components/ClassEditor/ClassEditor";
import CodePanel from "./components/CodePanel/CodePanel";
import JavaImport from "./components/JavaImport/JavaImport";
import "./App.css";

export default function App() {
  const [showImport, setShowImport] = useState(false);

  return (
    <DiagramProvider>
      <div className="app-shell">
        {/* Top toolbar */}
        <Toolbar onImport={() => setShowImport(true)} />

        {/* Main workspace */}
        <div className="app-body">
          {/* Center: Canvas */}
          <div className="canvas-area">
            <Canvas />
          </div>

          {/* Right panel: Editor + Code */}
          <div className="right-panel">
            <div className="editor-pane">
              <ClassEditor />
            </div>
            <div className="code-pane">
              <CodePanel />
            </div>
          </div>
        </div>
      </div>

      {/* Java Import Modal */}
      {showImport && <JavaImport onClose={() => setShowImport(false)} />}
    </DiagramProvider>
  );
}
