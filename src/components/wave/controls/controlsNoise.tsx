export default function NoiseControls({ audio }: { audio: any }) {
  const { handleVolumeInput, volume } = audio;
  return (
    <>
      <div>
        Noise <input type="checkbox" name="toggleNoise" id="toggleNoise" />
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
