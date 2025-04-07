import styles from "./waveVisual.module.css";

export default function WaveVisual({
  frequency,
  isPlaying,
}: {
  frequency: number;
  isPlaying: boolean;
}) {
  return <div className={styles.Visual}>Visual</div>;
}
