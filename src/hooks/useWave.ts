import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

const BASE_SETTINGS: { [key: string]: number } = {
  minFrequency: 0.5,
  maxFrequency: 40,
  baseVolume: 0.25,
  defaultFrequency: 20,
  minBaseFrequency: 75,
  maxBaseFrequency: 150,
  baseFrequency: 110,
};

export function useWave() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState(BASE_SETTINGS.defaultFrequency);
  const [baseFrequency, setBasefrequency] = useState(
    BASE_SETTINGS.baseFrequency
  );
  const [compressorEnabled, setCompressorEnabled] = useState(false);
  const [volume, setVolume] = useState(BASE_SETTINGS.baseVolume);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorLeftRef = useRef<OscillatorNode | null>(null);
  const oscillatorRightRef = useRef<OscillatorNode | null>(null);
  const pannerLeftRef = useRef<StereoPannerNode | null>(null);
  const pannerRightRef = useRef<StereoPannerNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const compressorNodeRef = useRef<DynamicsCompressorNode | null>(null);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (oscillatorLeftRef.current) {
        oscillatorLeftRef.current.stop();
      }
      if (oscillatorRightRef.current) {
        oscillatorRightRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      audioContextRef.current = null;
      oscillatorLeftRef.current = null;
      oscillatorRightRef.current = null;
      gainNodeRef.current = null;
    };
  }, []);

  const factor = 2;

  // update noise on frequency Change.
  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    if (oscillatorLeftRef.current) {
      oscillatorLeftRef.current.frequency.value = baseFrequency;
    }
    if (oscillatorRightRef.current) {
      oscillatorRightRef.current.frequency.value =
        baseFrequency + frequency * factor;
    }
  }, [isPlaying, baseFrequency, frequency]);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  const startAudio = useCallback(() => {
    if (!audioContextRef.current) {
      // create Context
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext ||
        (window as any).mozAudioContext ||
        (window as any).oAudioContext ||
        (window as any).msAudioContext)();

      // create oscillators
      oscillatorLeftRef.current = audioContextRef.current.createOscillator();
      oscillatorRightRef.current = audioContextRef.current.createOscillator();

      // create gainnode for volume control
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.value = volume;

      if (compressorEnabled) {
        // create compressor node
        compressorNodeRef.current =
          audioContextRef.current.createDynamicsCompressor();
      }

      if (compressorNodeRef.current) {
        compressorNodeRef.current.threshold.value = -60; // Very low threshold
        compressorNodeRef.current.ratio.value = 20; // Very high ratio
        compressorNodeRef.current.attack.value = 0.01;
        compressorNodeRef.current.release.value = 0.1;
      }

      // Set oscillator frequencies
      oscillatorLeftRef.current.frequency.value = baseFrequency;
      oscillatorRightRef.current.frequency.value =
        baseFrequency + frequency * factor;

      // Create stereo panners
      pannerLeftRef.current = audioContextRef.current.createStereoPanner();
      pannerRightRef.current = audioContextRef.current.createStereoPanner();

      // Set panning for each ear (-1 is left, 1 is right)
      pannerLeftRef.current.pan.value = -1;
      pannerRightRef.current.pan.value = 1;

      // Connect nodes
      oscillatorLeftRef.current.connect(pannerLeftRef.current);
      oscillatorRightRef.current.connect(pannerRightRef.current);
      pannerLeftRef.current.connect(gainNodeRef.current);
      pannerRightRef.current.connect(gainNodeRef.current);
      if (compressorEnabled && compressorNodeRef.current) {
        gainNodeRef.current.connect(compressorNodeRef.current);
        compressorNodeRef.current.connect(audioContextRef.current.destination);
      } else {
        gainNodeRef.current.connect(audioContextRef.current.destination);
        if (compressorNodeRef.current) {
          compressorNodeRef.current.disconnect();
        }
      }

      // Start oscillators
      oscillatorLeftRef.current.start();
      oscillatorRightRef.current.start();
    } else if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }

    setIsPlaying(true);
  }, [baseFrequency, compressorEnabled, factor, frequency, volume]);

  const stopAudio = useCallback(() => {
    if (oscillatorLeftRef.current) oscillatorLeftRef.current.stop();
    if (oscillatorRightRef.current) oscillatorRightRef.current.stop();
    if (gainNodeRef.current) gainNodeRef.current.disconnect();
    if (audioContextRef.current) audioContextRef.current.close();
    if (compressorNodeRef.current) compressorNodeRef.current.disconnect();
    audioContextRef.current = null;
    oscillatorLeftRef.current = null;
    oscillatorRightRef.current = null;
    gainNodeRef.current = null;
    compressorNodeRef.current = null;
    setIsPlaying(false);
  }, []);

  const formattedFrequency = (frequency: number) => {
    return Number(frequency).toFixed(1);
  };

  const handleInput = (
    e: ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (!e.target) {
      return;
    }
    const { value } = e.target;
    setValue(Number(value));
  };

  const handleCompressorToggle = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setCompressorEnabled(e.target.checked);
      // Re-establish audio connections if playing to reflect compressor state
      if (isPlaying && audioContextRef.current && gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        if (e.target.checked && compressorNodeRef.current) {
          gainNodeRef.current.connect(compressorNodeRef.current);
          compressorNodeRef.current.connect(
            audioContextRef.current.destination
          );
        } else {
          gainNodeRef.current.connect(audioContextRef.current.destination);
          if (compressorNodeRef.current) {
            compressorNodeRef.current.disconnect();
          }
        }
      }
    },
    [isPlaying, compressorNodeRef, audioContextRef, gainNodeRef]
  );

  return {
    isPlaying,
    baseFrequency,
    frequency,
    formattedFrequency: formattedFrequency(frequency),
    formattedBaseFrequency: formattedFrequency(baseFrequency),
    handleBaseFrequencyInput: (e: ChangeEvent<HTMLInputElement>) =>
      handleInput(e, setBasefrequency),
    handleFrequencyInput: (e: ChangeEvent<HTMLInputElement>) =>
      handleInput(e, setFrequency),
    handleVolumeInput: (e: ChangeEvent<HTMLInputElement>) =>
      handleInput(e, setVolume),
    minFrequency: BASE_SETTINGS.minFrequency,
    maxFrequency: BASE_SETTINGS.maxFrequency,
    minBaseFrequency: BASE_SETTINGS.minBaseFrequency,
    maxBaseFrequency: BASE_SETTINGS.maxBaseFrequency,
    startAudio,
    stopAudio,
    volume,
    compressorEnabled,
    handleCompressorToggle,
  };
}
