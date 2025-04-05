import { RefObject, useCallback, useEffect, useRef, useState } from "react";

// states
///////////////
// playing
// paused
// break
// stopped

// functions
///////////////
// play
// reset
// stop
// pause
// break
// set Time
// set break Length

export const TIMER_STATES = {
  running: "running",
  paused: "paused",
  break: "break",
  stopped: "stopped",
};

export const DEFAULT_SETTINGS = {
  state: TIMER_STATES.stopped,
  running: false,
  min: 1 * 60,
  max: 60 * 60,
  timer: 1 * 6,
  timeLeft: 1 * 6,
  breakLengthShort: 5 * 6,
  breakLengthLong: 10 * 6,
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

export function useTimer() {
  const [timerState, setTimerState] = useState(DEFAULT_SETTINGS.state);
  const [isRunning, setisRunning] = useState(DEFAULT_SETTINGS.running);
  const [timer, setTimer] = useState(DEFAULT_SETTINGS.timer);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.timeLeft);
  const [breakCount, setBreakCount] = useState(0);
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
    setTimerState(TIMER_STATES.stopped);
    setisRunning(false);
    setTimeLeft(timer);
    setBreakCount(0);
  }, [timeLeft]);

  const skipBreak = useCallback(() => {
    setTimerState(TIMER_STATES.running);
    setisRunning(true);
    setTimeLeft(timer);
  }, []);

  const onTimerEnd = useCallback(() => {
    setTimerState(TIMER_STATES.break);
    setisRunning(true);
    setTimeLeft(breakLength);
  }, []);

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
            setTimerState(TIMER_STATES.break);
            setisRunning(true);
            setBreakCount((breakCount + 1) % 4);
            return breakCount === 3 ? breakLength * 2 : breakLength;
          } else {
            setTimerState(TIMER_STATES.running);
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

  return {
    isRunning,
    pauseTimer,
    resetTimer,
    skipBreak,
    startTimer,
    timerState,
    timeLeft,
    breakCount,
    formattedTime: formatTime(timeLeft),
  };
}
