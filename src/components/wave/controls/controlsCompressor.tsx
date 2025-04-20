import IconCompressor from "../../icons/iconCompressor";
import styles from "./controls.module.css";
export default function CompressorControls({ audio }: { audio: any }) {
  const { compressorEnabled, handleCompressorToggle } = audio;
  return (
    <>
      <div className={styles.Header}>
        <IconCompressor />
        <label className={styles.Header}>
          <div>Compressor</div>
          <input
            type="checkbox"
            name="toggleCompressor"
            id="toggleCompressor"
            checked={compressorEnabled}
            onChange={handleCompressorToggle}
            value={compressorEnabled}
          />
        </label>
      </div>
    </>
  );
}
