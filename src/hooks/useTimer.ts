import { useCallback, useEffect, useRef, useState } from "react";

export enum TIMER_STATES {
  running = "running",
  paused = "paused",
  break = "break",
  stopped = "stopped",
  skipped = "skipped",
}

export enum PHASES {
  work = "work",
  break = "break",
}

export const DEFAULT_SETTINGS = {
  state: TIMER_STATES.stopped,
  running: false,
  min: 1 * 60,
  max: 60 * 60,
  timer: 12 * 60,
  timeLeft: 12 * 60,
  breakLengthShort: 5 * 60,
  breakLengthLong: 10 * 60,
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

export function useTimer() {
  const [timerState, setTimerState] = useState<string>(DEFAULT_SETTINGS.state);
  const [phase, setPhase] = useState<string>(PHASES.work);
  const [isRunning, setisRunning] = useState<boolean>(DEFAULT_SETTINGS.running);
  const [timer, setTimer] = useState<number>(DEFAULT_SETTINGS.timer);
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_SETTINGS.timeLeft);
  const [breakCount, setBreakCount] = useState<number>(0);
  const [breakLength, setBreakLength] = useState(
    DEFAULT_SETTINGS.breakLengthShort
  );

  const timerRef = useRef<number | null>(null);

  const startTimer = useCallback(() => {
    setTimerState(TIMER_STATES.running);
    setisRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setTimerState(TIMER_STATES.paused);
    setisRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setPhase(PHASES.work);
    setTimerState(TIMER_STATES.stopped);
    setisRunning(false);
    setTimeLeft(timer);
    setBreakCount(0);
  }, [timeLeft]);

  const skip = useCallback(() => {
    if (phase === PHASES.work) {
      setPhase(PHASES.break);
      setTimeLeft(breakLength);
    } else if (phase === PHASES.break) {
      setPhase(PHASES.work);
      setTimeLeft(timer);
    }
    setTimerState(TIMER_STATES.skipped);
    setisRunning(false);
  }, [timerState, phase]);

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
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          if (timerState === TIMER_STATES.running) {
            setTimerState(TIMER_STATES.paused);
            setPhase(PHASES.break);
            setisRunning(true);
            setBreakCount((breakCount + 1) % 4);
            return breakCount === 3 ? breakLength * 2 : breakLength;
          } else {
            setTimerState(TIMER_STATES.running);
            setPhase(PHASES.work);
            setisRunning(true);
            return timer;
          }
        } else {
          return prevTime - 1;
        }
      });
    }, 1000);

    return () => {
      clearRef(timerRef);
    };
  }, [isRunning, timerState]);

  const value = {
    isRunning,
    phase,
    pauseTimer,
    resetTimer,
    skip,
    startTimer,
    timerState,
    timeLeft,
    breakCount,
  };

  return {
    ...value,
    formattedTime: formatTime(timeLeft),
    debug: {
      ...value,
    },
  };
}
