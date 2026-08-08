import React, { useState } from "react";
import "./App.css";

import Header from "./components/Header";
import AnalogClock from "./components/AnalogClock";
import DigitalClock from "./components/DigitalClock";
import WorldClock from "./components/WorldClock";
import Alarm from "./components/Alarm";
import ThemeToggle from "./components/ThemeToggle";

function App() {

  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "app dark" : "app"}>

      <Header />

      <ThemeToggle
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <div className="dashboard">

        <div className="left-panel">

          <AnalogClock />

        </div>

        <div className="right-panel">

          <DigitalClock />

          <WorldClock />

          <Alarm />

        </div>

      </div>

    </div>
  );
}

export default App;