import { DEFAULT_SETTINGS, TIMER_STATES, useTimer } from "../../hooks/useTimer";

export default function Timer() {
  const {
    isRunning,
    breakCount,
    startTimer,
    resetTimer,
    timerState,
    skipBreak,
    pauseTimer,
    formattedTime,
  } = useTimer();

  return (
    <>
      <section>
        <div>
          <h1>{formattedTime}</h1>
          <input
            type="range"
            min={DEFAULT_SETTINGS.min}
            max={DEFAULT_SETTINGS.max}
          />
        </div>
        {!isRunning ? (
          <button onClick={startTimer} aria-label="Start Timer">
            Start
          </button>
        ) : (
          <button onClick={pauseTimer} aria-label="Pause Timer">
            Pause
          </button>
        )}
        {timerState === TIMER_STATES.break ? (
          <button onClick={skipBreak} aria-label="Skip Break">
            Skip
          </button>
        ) : null}
        {timerState !== TIMER_STATES.running ? (
          <button onClick={resetTimer} aria-label="Reset Timer">
            Reset
          </button>
        ) : null}
      </section>
      <section>
        <div>state: {timerState}</div>
        <div>count: {breakCount}</div>
      </section>
    </>
  );
}
