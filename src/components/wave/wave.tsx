import styles from "./wave.module.css";
import { useState } from "react";
import { useWave } from "../../hooks/useWave/useWave";
import Controls from "./controls/controls";
import { handleToggle } from "../../utils/utils";

export default function Wave() {
  const [expanded, setExpanded] = useState(true);

  const audio = useWave();

  const { isPlaying, startAudio, stopAudio } = audio;

  return (
    <>
      <button onClick={!isPlaying ? startAudio : stopAudio}>
        {!isPlaying ? "start" : "stop"}
      </button>
      <section
        aria-expanded={expanded ? "true" : "false"}
        className={`${styles.Wave} ${expanded ? styles.Expanded : ""}`}
      >
        <nav>
          <button onClick={() => handleToggle(setExpanded)}>+</button>
        </nav>
        <Controls audio={audio} expanded={expanded} />
      </section>
    </>
  );
}
