import styles from "./controls.module.css";
import { handleToggle } from "../../../utils/utils";
import IconNoise from "../../icons/iconNoise";

export default function NoiseControls({ audio }: { audio: any }) {
  const {
    handleAmDepthInput,
    handleNoiseVolumeInput,
    handleNoiseFilterFreqInput,
    noiseEnabled,
    noiseFilterFreq,
    setNoiseEnabled,
    noiseVolume,
    amDepth,
    selectedNoiseType,
    setNoiseType,
    minFilterFreq,
    maxFilterFreq,
  } = audio;

  return (
    <>
      <div className={styles.Header}>
        <IconNoise />
        <label className={styles.Header}>
          <div>Noise</div>
          <input
            type="checkbox"
            name="toggleNoise"
            id="toggleNoise"
            checked={noiseEnabled}
            onChange={() => handleToggle(setNoiseEnabled)}
            value={noiseEnabled}
          />
        </label>
      </div>
      <div>
        <label>Type</label>
        <div className={styles.InputRadioWrapper}>
          <label>
            <input
              type="radio"
              name="noise"
              id="brown"
              value="brown"
              checked={selectedNoiseType === "brown"}
              onChange={(e) => setNoiseType(e.target.value)}
            />
            <span>brown</span>
          </label>
          <label>
            <input
              type="radio"
              name="noise"
              id="pink"
              value="pink"
              checked={selectedNoiseType === "pink"}
              onChange={(e) => setNoiseType(e.target.value)}
            />
            <span>pink</span>
          </label>
          <label>
            <input
              type="radio"
              name="noise"
              id="white"
              value="white"
              checked={selectedNoiseType === "white"}
              onChange={(e) => setNoiseType(e.target.value)}
            />
            <span>white</span>
          </label>
        </div>
      </div>
      <label>
        <input
          type="range"
          min={0}
          max={1}
          step=".01"
          value={amDepth}
          onChange={handleAmDepthInput}
        />
        <div>Depth: {amDepth}</div>
      </label>
      <label>
        <input
          type="range"
          min={minFilterFreq}
          max={maxFilterFreq}
          step="1"
          value={noiseFilterFreq}
          onChange={handleNoiseFilterFreqInput}
        />
        <div>Noise Freq: {noiseFilterFreq}</div>
      </label>
      <label>
        <input
          type="range"
          min={0}
          max={1}
          step=".01"
          value={noiseVolume}
          onChange={handleNoiseVolumeInput}
        />
        <div>Vol: {noiseVolume}</div>
      </label>
    </>
  );
}
