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

export const TIMER_DEFAULT_SETTINGS = {
  state: TIMER_STATES.stopped,
  running: false,
  minFocusLength: 1 * 60,
  maxFocusLength: 120 * 60,
  minBreakLength: 1 * 60,
  maxBreakLength: 60 * 60,
  maxCycles: 4,
  timer: 25 * 60,
  focusLength: 25 * 60,
  timeLeft: 25 * 60,
  breakLengthShort: 5 * 60,
  breakLengthLong: 10 * 60,
};
