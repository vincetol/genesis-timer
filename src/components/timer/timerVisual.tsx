import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./timerVisual.module.css";
import { PHASES, TIMER_STATES } from "../../hooks/useTimer";

export default function TimerVisual({
  isRunning,
  phase,
  timerState,
}: {
  isRunning: boolean;
  phase: string;
  timerState: string;
}) {
  const [rotation, setRotation] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const clearRef = (ref: React.RefObject<number | null>) => {
    if (ref.current !== null) {
      clearInterval(ref.current);
      ref.current = null;
    }
  };

  useEffect(() => {
    if (!isRunning && (rotation <= 0 || timerState === TIMER_STATES.paused)) {
      clearRef(intervalRef);
      return;
    }

    intervalRef.current = setInterval(() => {
      setRotation((prevRotation) => {
        if (timerState === TIMER_STATES.skipped) {
          if (prevRotation + 6 >= 360) {
            clearRef(intervalRef);
            return 0;
          }
          return prevRotation + 6;
        }

        if (isRunning && phase === PHASES.work) {
          return 180 + ((prevRotation + 0.5) % 180);
        } else if (isRunning && phase === PHASES.break) {
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
          className={`${styles.Breaki} ${phase === PHASES.break ? styles.Active : ""}`}
        >
          <div></div>
          <div></div>
        </div>
      </div>

      <div className={styles.Phase}>
        {phase === PHASES.break ? PHASES.break : PHASES.work}
      </div>
      <div
        className={`${styles.Break} ${phase === PHASES.break ? styles.Active : ""}`}
      >
        <div>B</div>
      </div>
    </div>
  );
}
