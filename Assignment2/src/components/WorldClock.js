import React, { useState, useEffect } from "react";

function WorldClock() {

  const [time, setTime] = useState(new Date());

  useEffect(() => {

    const interval = setInterval(() => {

      setTime(new Date());

    }, 1000);

    return () => clearInterval(interval);

  }, []);

  const getTime = (zone) => {

    return time.toLocaleTimeString("en-US", {

      timeZone: zone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"

    });

  };

  return (

    <div className="card">

      <h2>🌍 World Clock</h2>

      <table className="world-table">

        <thead>

          <tr>

            <th>Country</th>

            <th>Time</th>

          </tr>

        </thead>

        <tbody>

          <tr>

            <td>🇮🇳 India</td>

            <td>{getTime("Asia/Kolkata")}</td>

          </tr>

          <tr>

            <td>🇺🇸 New York</td>

            <td>{getTime("America/New_York")}</td>

          </tr>

          <tr>

            <td>🇬🇧 London</td>

            <td>{getTime("Europe/London")}</td>

          </tr>

          <tr>

            <td>🇯🇵 Tokyo</td>

            <td>{getTime("Asia/Tokyo")}</td>

          </tr>

          <tr>

            <td>🇦🇺 Sydney</td>

            <td>{getTime("Australia/Sydney")}</td>

          </tr>

        </tbody>

      </table>

    </div>

  );

}

export default WorldClock;