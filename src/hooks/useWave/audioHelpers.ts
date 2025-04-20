export const formattedFrequency = (freq: number) => Number(freq).toFixed(1);
export const formattedGain = (gain: number): string => gain.toFixed(1); // Format EQ gain
export const formattedVolume = (vol: number): string => (vol * 100).toFixed(0); // Format Volume %

// TODO: Fix and Implement multi ref clear..
export const clearRefs = (refs: any) => {
  console.log("runs", refs);
  for (let i = 0; i < refs.length; i++) {
    const ref = refs[i];
    if (ref.current) {
      console.log(typeof ref.current.stop());
      console.log(typeof ref.current.disconnect());
    }
    ref.current = null;
  }
};
