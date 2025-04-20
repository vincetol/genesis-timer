import { formatTime } from "../../../hooks/useTimer/useTimer";
import { useTimerStore } from "../../../stores/timerStore";
import styles from "./timerDisplay.module.css";
export default function TimerDisplay() {
  const timeLeft = useTimerStore((state) => state.timeLeft);
  const formattedTime = formatTime(timeLeft);
  return <h1>{formattedTime}</h1>;
}
