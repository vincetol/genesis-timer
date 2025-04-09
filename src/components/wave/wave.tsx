import styles from "./wave.module.css";
import { useState } from "react";
import { useWave } from "../../hooks/useWave/useWave";
import WaveVisual from "./waveVisual";
import OscillatorControls from "./controls/controlsOscillators";
import NoiseControls from "./controls/controlsNoise";

export default function Wave() {
  const [expaned, setExpanded] = useState(true);

  const audio = useWave();
  const { frequency, isPlaying, startAudio, stopAudio } = audio;

  return (
    <section
      aria-expanded={expaned ? "true" : "false"}
      className={`${styles.Wave} ${expaned ? styles.Expanded : ""}`}
    >
      <nav>
        <div>
          <WaveVisual isPlaying={isPlaying} frequency={frequency} />
        </div>
        <OscillatorControls audio={audio} />
        <hr />
        <NoiseControls audio={audio} />
      </nav>
      {!isPlaying ? (
        <button onClick={startAudio}>start</button>
      ) : (
        <button onClick={stopAudio}>stop</button>
      )}
    </section>
  );
}
