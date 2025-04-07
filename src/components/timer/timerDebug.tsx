import { useState } from "react";
import styles from "./timerDebug.module.css";
export default function TimerDebug({ debug }: { debug: any }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.Debug}>
      <button onClick={handleOpen}>{!isOpen ? "o" : "x"}</button>
      <section className={`${styles.Infos} ${isOpen ? styles.Open : ""}`}>
        {Object.keys(debug).map((item, index) => {
          if (typeof debug[item] === "function") {
            return;
          }
          return (
            <div key={`${item}${index}`}>
              {item}: {JSON.stringify(debug[item])}
            </div>
          );
        })}
      </section>
    </div>
  );
}
