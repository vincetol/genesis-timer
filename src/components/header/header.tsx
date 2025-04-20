import { Link } from "@tanstack/react-router";
import styles from "./header.module.css";
import ThemeToggle from "./themeToggle";
import { useTimerStore } from "../../stores/timerStore";

export default function Header() {
  const handleSettings = useTimerStore((state) => state.handleSettings);
  return (
    <header className={styles.Header}>
      <Link to="/" className={styles.Header__Logo}>
        <span>GENESIS</span>
        <span>TIMER</span>
      </Link>
      <nav className={styles.Header__Nav}>
        <ThemeToggle />
        <button onClick={handleSettings} aria-label="Oben Settings Drawer">
          Settings
        </button>
      </nav>
    </header>
  );
}
