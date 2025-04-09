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
    volume,
  } = audio || {};

  return (
    <>
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
    </>
  );
}
