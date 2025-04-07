import styles from "./timer.module.css";
import { DEFAULT_SETTINGS, useTimer } from "../../hooks/useTimer";
import TimerDebug from "./timerDebug";
import TimerVisual from "./timerVisual";

export default function Timer() {
  const {
    isRunning,
    debug,
    startTimer,
    resetTimer,
    timerState,
    phase,
    skip,
    pauseTimer,
    formattedTime,
  } = useTimer();

  return (
    <>
      <section className={styles.Timer}>
        <TimerVisual
          phase={phase}
          isRunning={isRunning}
          timerState={timerState}
        />
        <div>
          <h1>{formattedTime}</h1>
          <input
            type="range"
            min={DEFAULT_SETTINGS.min}
            max={DEFAULT_SETTINGS.max}
          />
        </div>
        <nav>
          {!isRunning ? (
            <button onClick={startTimer} aria-label="Start Timer">
              Start
            </button>
          ) : (
            <button onClick={pauseTimer} aria-label="Pause Timer">
              Pause
            </button>
          )}
          <button onClick={skip} aria-label="Skip Break">
            Skip
          </button>
          <button onClick={resetTimer} aria-label="Reset Timer">
            Reset
          </button>
        </nav>
      </section>
      <TimerDebug debug={debug} />
    </>
  );
}
