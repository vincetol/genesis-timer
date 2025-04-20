import IconSettings from "../../icons/iconSettings";
import styles from "./controls.module.css";

export default function BasicsControl({ audio }: { audio: any }) {
  const {
    bassGain,
    handleBassGainInput,
    masterVolume,
    handleMasterVolumeInput,
    trebleGain,
    handleTrebleGainInput,
    minEqGain,
    maxEqGain,
  } = audio;

  return (
    <>
      <div className={styles.Header}>
        <IconSettings />
        <label className={styles.Header}>
          <div>Master</div>
        </label>
      </div>
      <label>
        <input
          type="range"
          min={minEqGain}
          max={maxEqGain}
          step=".01"
          value={bassGain}
          onChange={handleBassGainInput}
        />
        <div>Bass: {bassGain}</div>
      </label>
      <label>
        <input
          type="range"
          min={minEqGain}
          max={maxEqGain}
          step=".01"
          value={trebleGain}
          onChange={handleTrebleGainInput}
        />
        <div>Treble: {trebleGain}</div>
      </label>
      <label>
        <input
          type="range"
          min={0}
          max={1}
          step=".01"
          value={masterVolume}
          onChange={handleMasterVolumeInput}
        />
        <div>Master Vol: {masterVolume}</div>
      </label>
    </>
  );
}
