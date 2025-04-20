function createWhiteNoise(
  audioContext: AudioContext,
  bufferSize: number
): AudioBuffer {
  const buffer = audioContext.createBuffer(
    1,
    bufferSize,
    audioContext.sampleRate
  );
  const output = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function createPinkNoise(
  audioContext: AudioContext,
  bufferSize: number
): AudioBuffer {
  const buffer = audioContext.createBuffer(
    1,
    bufferSize,
    audioContext.sampleRate
  );
  const output = buffer.getChannelData(0);
  let b0 = 0,
    b1 = 0,
    b2 = 0,
    b3 = 0,
    b4 = 0,
    b5 = 0,
    b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
    b6 = white * 0.115926;
  }
  let max = 0;
  for (let i = 0; i < bufferSize; i++) max = Math.max(max, Math.abs(output[i]));
  if (max > 0) for (let i = 0; i < bufferSize; i++) output[i] /= max;
  return buffer;
}

function createBrownNoise(
  audioContext: AudioContext,
  bufferSize: number
): AudioBuffer {
  const buffer = audioContext.createBuffer(
    1,
    bufferSize,
    audioContext.sampleRate
  );
  const output = buffer.getChannelData(0);
  let lastOut = 0.0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    output[i] = (lastOut + 0.02 * white) / 1.02;
    lastOut = output[i];
    output[i] *= 3.5;
    if (output[i] > 1.0) output[i] = 1.0;
    if (output[i] < -1.0) output[i] = -1.0;
  }
  return buffer;
}
export { createBrownNoise, createPinkNoise, createWhiteNoise };
