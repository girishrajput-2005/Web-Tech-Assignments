import React, { useEffect, useState } from "react";

function AnalogClock() {

  const [time, setTime] = useState(new Date());

  useEffect(() => {

    const interval = setInterval(() => {

      setTime(new Date());

    }, 1000);

    return () => clearInterval(interval);

  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  return (

    <div className="card">

      <h2>🕰 Analog Clock</h2>

      <div className="clock">

        <div
          className="hand hour"
          style={{
            transform: `translateX(-50%) rotate(${hourDeg}deg)`
          }}
        ></div>

        <div
          className="hand minute"
          style={{
            transform: `translateX(-50%) rotate(${minuteDeg}deg)`
          }}
        ></div>

        <div
          className="hand second"
          style={{
            transform: `translateX(-50%) rotate(${secondDeg}deg)`
          }}
        ></div>

        <div className="center-dot"></div>

        <span className="number n12">12</span>
        <span className="number n3">3</span>
        <span className="number n6">6</span>
        <span className="number n9">9</span>

      </div>

    </div>

  );

}

export default AnalogClock;