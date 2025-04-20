import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./timerVisual.module.css";
import { PHASES, TIMER_STATES } from "../../hooks/useTimer/timerConsts";
import { useTimerStore } from "../../stores/timerStore";

export default function TimerVisual({}: {}) {
  const isRunning = useTimerStore((state) => state.isRunning);
  const timeLeft = useTimerStore((state) => state.timeLeft);
  const timerState = useTimerStore((state) => state.timerState);
  const currentPhase = useTimerStore((state) => state.currentPhase);

  const [rotation, setRotation] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const clearRef = useCallback(
    (ref: React.RefObject<number | null>) => {
      if (ref.current !== null) {
        clearInterval(ref.current);
        ref.current = null;
      }
    },
    [intervalRef]
  );

  useEffect(() => {
    if (!isRunning && (rotation <= 0 || timerState === TIMER_STATES.paused)) {
      clearRef(intervalRef);
      return;
    }

    intervalRef.current = setInterval(() => {
      setRotation((prevRotation) => {
        if (timeLeft === 0) {
          return 0;
        }
        if (timerState === TIMER_STATES.skipped) {
          if (prevRotation + 6 >= 360) {
            clearRef(intervalRef);
            return 0;
          }
          return prevRotation + 6;
        }

        if (isRunning && currentPhase === PHASES.work) {
          return 180 + ((prevRotation + 0.5) % 180);
        } else if (isRunning && currentPhase === PHASES.break) {
          return 180 + ((prevRotation + 0.125) % 180);
        } else if (timerState === TIMER_STATES.stopped) {
          if (prevRotation - 6 <= 0) {
            return 0;
          }
          return prevRotation - 6;
        } else {
          return prevRotation;
        }
      });
    }, 1000 / 180);

    return () => {
      if (intervalRef.current) {
        clearRef(intervalRef);
      }
    };
  }, [isRunning, timerState]);

  return (
    <div className={styles.VisualWrapper}>
      <div
        className={`${styles.Visual}`}
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <div
          className={`${styles.Breaki} ${currentPhase === PHASES.break ? styles.Active : ""}`}
        >
          <div></div>
          <div></div>
        </div>
      </div>

      <div className={styles.Phase}>
        {currentPhase === PHASES.break ? PHASES.break : PHASES.work}
      </div>
      <div className={`${styles.Break} ${styles.Active}`}>
        {currentPhase === PHASES.break ? <div>B</div> : <div>W</div>}
      </div>
    </div>
  );
}
