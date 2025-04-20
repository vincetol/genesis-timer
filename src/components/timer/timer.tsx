import styles from "./timer.module.css";
import { useTimer } from "../../hooks/useTimer/useTimer";
import TimerVisual from "./timerVisual";
import TimerDisplay from "./timerDisplay/timerDisplay";
import { useState } from "react";
import TimerSettings from "./timerSettings";
import { useTimerStore } from "../../stores/timerStore";
import TimerDebug from "./timerDebug";

export default function Timer() {
  const isRunning = useTimerStore((state) => state.isRunning);
  const handleStart = useTimerStore((state) => state.handleStart);
  const handlePause = useTimerStore((state) => state.handlePause);
  const handleSkip = useTimerStore((state) => state.handleSkip);
  const handleReset = useTimerStore((state) => state.handleReset);
  useTimer();

  return (
    <>
      <section className={styles.Timer}>
        <TimerVisual />
        <TimerDisplay />
        <nav>
          {!isRunning ? (
            <button onClick={handleStart} aria-label="Start Timer">
              Start
            </button>
          ) : (
            <button onClick={handlePause} aria-label="Pause Timer">
              Pause
            </button>
          )}
          <button onClick={handleSkip} aria-label="Skip Break">
            Skip
          </button>
          <button onClick={handleReset} aria-label="Reset Timer">
            Reset
          </button>
        </nav>
      </section>
      <TimerSettings />
      <TimerDebug />
    </>
  );
}
