import React, { useState, useEffect } from "react";

function Alarm() {

    const [alarmTime, setAlarmTime] = useState("");
    const [alarmOn, setAlarmOn] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {

        const timer = setInterval(() => {

            if (!alarmOn || alarmTime === "") return;

            const now = new Date();

            const current =
                String(now.getHours()).padStart(2, "0") +
                ":" +
                String(now.getMinutes()).padStart(2, "0");

            if (current === alarmTime) {

                alert("⏰ Alarm Time Reached!");

                setMessage("Alarm Triggered");

                setAlarmOn(false);

            }

        }, 1000);

        return () => clearInterval(timer);

    }, [alarmTime, alarmOn]);

    const setAlarm = () => {

        if (alarmTime === "") {

            alert("Please Select Alarm Time");

            return;

        }

        setAlarmOn(true);

        setMessage("Alarm Set Successfully");

    };

    const stopAlarm = () => {

        setAlarmOn(false);

        setMessage("Alarm Stopped");

    };

    return (

        <div className="card">

            <h2>⏰ Alarm</h2>

            <input

                type="time"

                value={alarmTime}

                onChange={(e) => setAlarmTime(e.target.value)}

            />

            <br /><br />

            <button onClick={setAlarm}>
                Set Alarm
            </button>

            <button onClick={stopAlarm}>
                Stop Alarm
            </button>

            <p>{message}</p>

        </div>

    );

}

export default Alarm;