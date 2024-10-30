"use client"
// src/Timer.jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Timer = () => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(10); // Set initial time here
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let interval = null;

    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes > 0) {
            setMinutes((prevMinutes) => prevMinutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }
      }, 1000);
    } else if (isActive && minutes === 0 && seconds === 0) {
      // Timer finished, redirect to another page
      router.push('/completed');
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, router]);

  const handleStart = () => setIsActive(true);
  const handlePause = () => setIsActive(false);
  const handleReset = () => {
    setIsActive(false);
    setMinutes(0);
    setSeconds(10); // Reset to initial time
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Timer</h2>
      <div>
        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          placeholder="Minutes"
        />
        <input
          type="number"
          value={seconds}
          onChange={(e) => setSeconds(Number(e.target.value))}
          placeholder="Seconds"
        />
      </div>
      <h3>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </h3>
      <button onClick={handleStart}>Start</button>
      <button onClick={handlePause}>Pause</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};

export default Timer;

