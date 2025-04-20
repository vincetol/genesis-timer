import { create } from "zustand";
import {
  PHASES,
  TIMER_DEFAULT_SETTINGS,
  TIMER_STATES,
} from "../hooks/useTimer/timerConsts";
import { ChangeEvent } from "react";

type TimerStore = {
  handleFocusLength: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBreakLengthShort: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBreakLengthLong: (e: ChangeEvent<HTMLInputElement>) => void;
  handleStart: () => void;
  handlePause: () => void;
  handleReset: () => void;
  handleSkip: () => void;
  handleTimer: () => void;
  handleSettings: () => void;
  resetSettings: () => void;
  isRunning: boolean;
  timeLeft: number;
  currentPhase: PHASES;
  nextPhase: PHASES;
  cycles: number;
  maxCycles: number;
  focusLength: number;
  breakLengthShort: number;
  breakLengthLong: number;
  timerState: TIMER_STATES;
  currentPhaseLength: number;
  isSettingsOpen: boolean;
};

const getBreakLength = (state: TimerStore) => {
  return state.cycles < state.maxCycles - 1
    ? state.breakLengthShort
    : state.breakLengthLong;
};

export const useTimerStore = create<TimerStore>((set) => ({
  handleFocusLength: (e) => {
    const { value } = e.target;
    set((state) => {
      return {
        focusLength: parseInt(value),
        timeLeft:
          state.timeLeft === state.currentPhaseLength ? parseInt(value) : 0,
      };
    });
  },
  handleBreakLengthShort: (e) => {
    const { value } = e.target;
    set(() => ({ breakLengthShort: parseInt(value) }));
  },
  handleBreakLengthLong: (e) => {
    const { value } = e.target;
    set(() => ({ breakLengthLong: parseInt(value) }));
  },
  handleStart: () => {
    set(() => ({
      isRunning: true,
      timerState: TIMER_STATES.running,
    }));
  },
  handlePause: () => {
    set(() => ({
      isRunning: false,
      timerState: TIMER_STATES.paused,
    }));
  },
  handleReset: () => {
    set((state) => ({
      isRunning: false,
      currentPhase: PHASES.work,
      nextPhase: PHASES.break,
      timerState: TIMER_STATES.stopped,
      timeLeft: state.focusLength,
      currentPhaseLength: state.focusLength,
      cycles: 0,
    }));
  },
  handleSkip: () => {
    set((state) => ({
      isRunning: false,
      currentPhase:
        state.currentPhase === PHASES.break ? PHASES.work : PHASES.break,
      nextPhase:
        state.currentPhase === PHASES.break ? PHASES.break : PHASES.work,
      currentPhaseLength:
        state.currentPhase === PHASES.break
          ? state.focusLength
          : getBreakLength(state),
      timeLeft:
        state.currentPhase === PHASES.break
          ? state.focusLength
          : getBreakLength(state),
      cycles:
        state.currentPhase === PHASES.break
          ? (state.cycles + 1) % state.maxCycles
          : state.cycles,
      timerState: TIMER_STATES.skipped,
    }));
  },
  handleTimer: () => {
    set((state) => {
      if (state.timeLeft <= 1) {
        if (state.currentPhase === PHASES.work) {
          return {
            timerState: TIMER_STATES.paused,
            currentPhase: PHASES.break,
            nextPhase: PHASES.work,
            isRunning: false,
            currentPhaseLength: getBreakLength(state),
            timeLeft: getBreakLength(state),
          };
        } else {
          return {
            isRunning: false,
            cycles: (state.cycles + 1) % state.maxCycles,
            timerState: TIMER_STATES.running,
            currentPhase: PHASES.work,
            nextPhase: PHASES.break,
            timeLeft: state.focusLength,
            currentPhaseLength: state.focusLength,
          };
        }
      } else {
        return {
          timeLeft: state.timeLeft - 1,
        };
      }
    });
  },
  handleSettings: () => {
    set((state) => ({
      isSettingsOpen: !state.isSettingsOpen,
    }));
  },
  resetSettings: () => {
    set({
      focusLength: TIMER_DEFAULT_SETTINGS.focusLength,
      breakLengthShort: TIMER_DEFAULT_SETTINGS.breakLengthShort,
      breakLengthLong: TIMER_DEFAULT_SETTINGS.breakLengthLong,
    });
  },
  isRunning: false,
  timeLeft: TIMER_DEFAULT_SETTINGS.focusLength,
  currentPhase: PHASES.work,
  nextPhase: PHASES.break,
  cycles: 0,
  focusLength: TIMER_DEFAULT_SETTINGS.focusLength,
  breakLengthShort: TIMER_DEFAULT_SETTINGS.breakLengthShort,
  breakLengthLong: TIMER_DEFAULT_SETTINGS.breakLengthLong,
  currentPhaseLength: TIMER_DEFAULT_SETTINGS.focusLength,
  timerState: TIMER_STATES.stopped,
  maxCycles: TIMER_DEFAULT_SETTINGS.maxCycles,
  isSettingsOpen: false,
}));
