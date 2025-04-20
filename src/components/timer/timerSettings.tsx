import { useCallback, useEffect } from "react";
import { TIMER_DEFAULT_SETTINGS } from "../../hooks/useTimer/timerConsts";
import { secondsToNumbers } from "../../hooks/useTimer/timerHelpers";
import { useTimerStore } from "../../stores/timerStore";
import styles from "./timerSettings.module.css";

export default function TimerSettings() {
  const isOpen = useTimerStore((state) => state.isSettingsOpen);
  const focusLength = useTimerStore((state) => state.focusLength);
  const breakLengthShort = useTimerStore((state) => state.breakLengthShort);
  const breakLengthLong = useTimerStore((state) => state.breakLengthLong);
  const handleFocusLength = useTimerStore((state) => state.handleFocusLength);
  const handleBreakShort = useTimerStore(
    (state) => state.handleBreakLengthShort
  );
  const handleBreakLong = useTimerStore((state) => state.handleBreakLengthLong);
  const resetSettings = useTimerStore((state) => state.resetSettings);

  const closeSettings = () => {
    useTimerStore.setState({ isSettingsOpen: false });
  };

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") useTimerStore.setState({ isSettingsOpen: false });
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    } else {
      document.removeEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div
      className={`${styles.SettingsContainer} ${isOpen ? styles.IsOpen : ""}`}
      aria-hidden={isOpen ? "true" : "false"}
    >
      <div className={styles.SettingsWrapper}>
        <header>
          Timer Settings
          <button onClick={closeSettings} aria-label="Close Settings Panel">
            x
          </button>
        </header>
        <div className={styles.Settings}>
          <label>
            <div>Focus duration</div>
            <span>{secondsToNumbers(focusLength)} min</span>
            <div className={styles.Slider}>
              <span>
                {secondsToNumbers(TIMER_DEFAULT_SETTINGS.minFocusLength)}
              </span>
              <input
                type="range"
                min={TIMER_DEFAULT_SETTINGS.minFocusLength}
                max={TIMER_DEFAULT_SETTINGS.maxFocusLength}
                step="60"
                value={focusLength}
                onChange={handleFocusLength}
              />
              <span>
                {secondsToNumbers(TIMER_DEFAULT_SETTINGS.maxFocusLength)}
              </span>
            </div>
          </label>
          <label>
            <div>Short break duration</div>
            <span>{secondsToNumbers(breakLengthShort)} min</span>
            <div className={styles.Slider}>
              <span>
                {secondsToNumbers(TIMER_DEFAULT_SETTINGS.minBreakLength)}
              </span>
              <input
                type="range"
                min={TIMER_DEFAULT_SETTINGS.minBreakLength}
                max={breakLengthLong}
                step="60"
                value={breakLengthShort}
                onChange={handleBreakShort}
              />
              <span>{secondsToNumbers(breakLengthLong)}</span>
            </div>
          </label>
          <label>
            <div>Long break duration</div>
            <span>{secondsToNumbers(breakLengthLong)} min</span>
            <div className={styles.Slider}>
              <span>{secondsToNumbers(breakLengthShort)}</span>
              <input
                type="range"
                min={breakLengthShort}
                max={TIMER_DEFAULT_SETTINGS.maxBreakLength}
                step="60"
                value={breakLengthLong}
                onChange={handleBreakLong}
              />
              <span>
                {secondsToNumbers(TIMER_DEFAULT_SETTINGS.maxBreakLength)}
              </span>
            </div>
          </label>
        </div>
        <button aria-label="Reset Settings to default" onClick={resetSettings}>
          Reset Settings
        </button>
      </div>
    </div>
  );
}
