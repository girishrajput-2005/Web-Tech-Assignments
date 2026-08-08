import React, { useState, useEffect } from "react";

function DigitalClock() {

    const [time, setTime] = useState(new Date());

    useEffect(() => {

        const timer = setInterval(() => {

            setTime(new Date());

        }, 1000);

        return () => clearInterval(timer);

    }, []);

    return (

        <div className="card digital-clock">

            <h2>🕒 Digital Clock</h2>

            <h1 className="digital-time">
                {time.toLocaleTimeString()}
            </h1>

            <h3 className="digital-date">
                {time.toDateString()}
            </h3>

        </div>

    );

}

export default DigitalClock;