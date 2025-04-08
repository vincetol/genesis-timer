import { THEMES } from "../../consts/themes";
import { useTheme } from "../../context/themeContext";
import styles from "./themeToggle.module.css";
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={styles.ThemeToggle} aria-label="Show themes">
      Theme
      <div className={styles.Themes}>
        {THEMES.map((item, index) => {
          const { title } = item;
          return (
            <button
              key={`${item}${index}`}
              className={`${styles.Theme} ${title === theme ? styles.Active : ""}`}
              aria-label={`Switch to theme: ${title}`}
              onClick={() => toggleTheme(title)}
              data-theme={item?.title}
            ></button>
          );
        })}
      </div>
    </nav>
  );
}
