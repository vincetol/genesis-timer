import styles from "./wave.module.css";
import { useState } from "react";
import { useWave } from "../../hooks/useWave";
import WaveVisual from "./waveVisual";

export default function Wave() {
  const [expaned, setExpanded] = useState(true);

  const {
    baseFrequency,
    frequency,
    formattedFrequency,
    formattedBaseFrequency,
    handleBaseFrequencyInput,
    handleFrequencyInput,
    handleVolumeInput,
    isPlaying,
    minFrequency,
    maxFrequency,
    minBaseFrequency,
    maxBaseFrequency,
    startAudio,
    stopAudio,
    volume,
  } = useWave();

  return (
    <section
      aria-expanded={expaned ? "true" : "false"}
      className={`${styles.Wave} ${expaned ? styles.Expanded : ""}`}
    >
      <nav>
        <div>
          <WaveVisual isPlaying={isPlaying} frequency={frequency} />
        </div>
        <label>
          <input
            type="range"
            min={0}
            max={1}
            step=".01"
            value={volume}
            onChange={handleVolumeInput}
          />
          <div>Vol: {volume}</div>
        </label>
        <label>
          <input
            type="range"
            min={minFrequency}
            max={maxFrequency}
            step=".5"
            value={frequency}
            onChange={handleFrequencyInput}
          />
          <div>Freq: {formattedFrequency} hz</div>
        </label>
        <label>
          <input
            type="range"
            min={minBaseFrequency}
            max={maxBaseFrequency}
            step=".5"
            value={baseFrequency}
            onChange={handleBaseFrequencyInput}
          />
          <div>Base: {formattedBaseFrequency} hz</div>
        </label>
      </nav>
      {!isPlaying ? (
        <button onClick={startAudio}>start</button>
      ) : (
        <button onClick={stopAudio}>stop</button>
      )}
    </section>
  );
}
