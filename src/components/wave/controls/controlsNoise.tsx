import { handleCheckbox } from "../../../hooks/useWave/audioHelpers";

export default function NoiseControls({ audio }: { audio: any }) {
  const { handleNoiseVolumeInput, noiseEnabled, setNoiseEnabled, noiseVolume } =
    audio;
  return (
    <>
      <div>
        <div>Noise</div>
        <input
          type="checkbox"
          name="toggleNoise"
          id="toggleNoise"
          checked={noiseEnabled}
          onChange={() => handleCheckbox(setNoiseEnabled)}
          value={noiseEnabled}
        />
      </div>
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
      <div>Type</div>
      <label>
        <input type="radio" name="noise" id="white" />
        white
      </label>
      <label>
        <input type="radio" name="noise" id="brown" />
        brown
      </label>
      <label>
        <input type="radio" name="noise" id="pink" />
        pink
      </label>
    </>
  );
}
