import styles from "./header.module.css";
export default function Header() {
  return (
    <header className={styles.Header}>
      <div className={styles.Header__Logo}>
        <span>GENESIS</span>
        <span>TIMER</span>
      </div>
      <nav className={styles.Header__Nav}>
        <button>Theme</button>
        <button>Settings</button>
      </nav>
    </header>
  );
}
