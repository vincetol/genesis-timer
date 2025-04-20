import { handleToggle } from "../../../utils/utils";
import IconOscillator from "../../icons/iconOscillator";
import styles from "./controls.module.css";

export default function OscillatorControls({ audio }: { audio: any }) {
  const {
    baseFrequency,
    frequency,
    formattedFrequency,
    formattedBaseFrequency,
    handleBaseFrequencyInput,
    handleFrequencyInput,
    handleVolumeInput,
    minFrequency,
    maxFrequency,
    minBaseFrequency,
    maxBaseFrequency,
    oscVolume,
    oscEnabled,
    setOscEnabled,
  } = audio || {};

  return (
    <>
      <div className={styles.Header}>
        <IconOscillator />
        <label className={styles.Header}>
          <div>Oscillator</div>
          <input
            type="checkbox"
            name="toggleNoise"
            id="toggleNoise"
            checked={oscEnabled}
            onChange={() => handleToggle(setOscEnabled)}
            value={oscEnabled}
          />
        </label>
      </div>
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
      <label>
        <input
          type="range"
          min={0}
          max={1}
          step=".01"
          value={oscVolume}
          onChange={handleVolumeInput}
        />
        <div>Vol: {oscVolume}</div>
      </label>
    </>
  );
}
