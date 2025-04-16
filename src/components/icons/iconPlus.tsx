import styles from "./icon.module.css";
export default function IconPlus() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
      <line
        vectorEffect="non-scaling-stroke"
        className={styles.cls1}
        x1="1.05"
        y1="15.05"
        x2="29.05"
        y2="15.05"
      />
      <line
        vectorEffect="non-scaling-stroke"
        className={styles.cls1}
        x1="15.05"
        y1="1.05"
        x2="15.05"
        y2="29.05"
      />
    </svg>
  );
}
