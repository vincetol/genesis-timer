import { Link } from "@tanstack/react-router";
import styles from "./header.module.css";
import ThemeToggle from "./themeToggle";
export default function Header() {
  return (
    <header className={styles.Header}>
      <Link to="/" className={styles.Header__Logo}>
        <span>GENESIS</span>
        <span>TIMER</span>
      </Link>
      <nav className={styles.Header__Nav}>
        <ThemeToggle />
        <button>Settings</button>
      </nav>
    </header>
  );
}
