import BasicsControl from "./controlsBasics";
import CompressorControls from "./controlsCompressor";
import NoiseControls from "./controlsNoise";
import OscillatorControls from "./controlsOscillators";
import styles from "./controls.module.css";
import WaveVisual from "../waveVisual";

export default function Controls({
  expanded = false,
  audio,
}: {
  expanded?: boolean;
  audio: any;
}) {
  const components = [
    OscillatorControls,
    CompressorControls,
    NoiseControls,
    BasicsControl,
  ];

  const { isPlaying, startAudio, stopAudio, frequency } = audio;

  return (
    <div className={`${styles.Controls} ${expanded ? styles.IsOpen : ""}`}>
      <WaveVisual isPlaying={isPlaying} frequency={frequency} />
      <div className={styles.ControlsContainer}>
        {components.map((Component, index) => {
          return (
            <div key={index} className={styles.ControlsWrapper}>
              <Component audio={audio} />
            </div>
          );
        })}
      </div>
      <button onClick={!isPlaying ? startAudio : stopAudio}>
        {!isPlaying ? "start" : "stop"}
      </button>
    </div>
  );
}
