import { useEffect, useRef } from "react";
import { useTimerStore } from "../../stores/timerStore";
import { TIMER_STATES } from "./timerConsts";

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

export function useTimer() {
  const timerRef = useRef<number | null>(null);
  const timerState = useTimerStore((state) => state.timerState);
  const currentPhase = useTimerStore((state) => state.currentPhase);
  const isRunning = useTimerStore((state) => state.isRunning);
  const timeLeft = useTimerStore((state) => state.timeLeft);
  const handleTimer = useTimerStore((state) => state.handleTimer);

  const clearRef = (ref: React.RefObject<number | null>) => {
    if (ref.current !== null) {
      clearInterval(ref.current);
      ref.current = null;
    }
  };

  useEffect(() => {
    if (
      !isRunning ||
      (timerState !== TIMER_STATES.running && timerState !== TIMER_STATES.break)
    ) {
      clearRef(timerRef);
      return;
    }

    timerRef.current = setInterval(() => {
      handleTimer();
    }, 1000);

    return () => {
      clearRef(timerRef);
    };
  }, [isRunning, currentPhase, timerState, handleTimer]);

  const value = {
    isRunning,
    timerState,
    timeLeft,
  };

  return {
    ...value,
    formattedTime: formatTime(timeLeft),
    debug: {
      ...value,
    },
  };
}
