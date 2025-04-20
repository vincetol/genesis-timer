import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { handleInput } from "../../utils/utils";
import {
  formattedFrequency,
  formattedGain,
  formattedVolume,
} from "./audioHelpers";
import {
  createBrownNoise,
  createPinkNoise,
  createWhiteNoise,
} from "./noiseBuffers";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

type NoiseType = "brown" | "pink" | "white";

const DEFAULT_NOISE_TYPE: NoiseType = "brown";

const BASE_SETTINGS: { [key: string]: number } = {
  amDepth: 0.5,
  bufferSize: 45,
  baseVolume: 0.25,
  defaultBaseFrequency: 110,
  defaultFrequency: 20,
  factor: 2,
  masterVolume: 0.5,
  minBaseFrequency: 75,
  minFrequency: 0.5,
  maxBaseFrequency: 150,
  maxFrequency: 40,
  noiseVolume: 0.1,
  noiseFilterFreq: 8000,
  bassGain: 0,
  trebleGain: 0,
};

const MAX_FILTER_FREQ = 20000;
const MIN_FILTER_FREQ = 20;
const BASS_FREQ_HZ = 250; // Cutoff for lowshelf filter
const TREBLE_FREQ_HZ = 4000; // Cutoff for highshelf filter
const MIN_EQ_GAIN = -15;
const MAX_EQ_GAIN = 15; // dB range for EQ

export function useWave() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [oscEnabled, setOscEnabled] = useState<boolean>(false);
  const [noiseEnabled, setNoiseEnabled] = useState<boolean>(true);

  const [selectedNoiseType, setSelectedNoiseType] =
    useState<NoiseType>(DEFAULT_NOISE_TYPE);
  const [frequency, setFrequency] = useState(BASE_SETTINGS.defaultFrequency);
  const [baseFrequency, setBaseFrequency] = useState(
    BASE_SETTINGS.defaultBaseFrequency
  );
  const [compressorEnabled, setCompressorEnabled] = useState(false);
  const [oscVolume, setOscVolume] = useState(BASE_SETTINGS.baseVolume);
  const [noiseVolume, setNoiseVolume] = useState(BASE_SETTINGS.noiseVolume);
  const [masterVolume, setMasterVolume] = useState(BASE_SETTINGS.masterVolume); // Added Master Volume state
  const [amDepth, setAmDepth] = useState(BASE_SETTINGS.amDepth);
  const [noiseFilterFreq, setNoiseFilterFreq] = useState(
    BASE_SETTINGS.noiseFilterFreq
  );
  const [bassGain, setBassGain] = useState(BASE_SETTINGS.bassGain);
  const [trebleGain, setTrebleGain] = useState(BASE_SETTINGS.trebleGain);

  // --- Refs ---
  // Context & Output
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputNodeRef = useRef<AudioNode | null>(null); // Points to Compressor or MasterGain
  const compressorNodeRef = useRef<DynamicsCompressorNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null); // Added Master Gain Ref
  // Main Oscillators Path
  const oscillatorLeftRef = useRef<OscillatorNode | null>(null);
  const oscillatorRightRef = useRef<OscillatorNode | null>(null);
  const pannerLeftRef = useRef<StereoPannerNode | null>(null);
  const pannerRightRef = useRef<StereoPannerNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  // Noise Path
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const noiseGainNodeRef = useRef<GainNode | null>(null);
  const noiseFilterNodeRef = useRef<BiquadFilterNode | null>(null);
  const noisePannerLeftRef = useRef<StereoPannerNode | null>(null);
  const noisePannerRightRef = useRef<StereoPannerNode | null>(null);
  // AM Modulation Path
  const lfoLeftRef = useRef<OscillatorNode | null>(null);
  const lfoRightRef = useRef<OscillatorNode | null>(null);
  const depthGainLeftRef = useRef<GainNode | null>(null);
  const depthGainRightRef = useRef<GainNode | null>(null);
  const modGainLeftRef = useRef<GainNode | null>(null);
  const modGainRightRef = useRef<GainNode | null>(null);
  // EQ Path
  const preEQGainRef = useRef<GainNode | null>(null);
  const bassFilterRef = useRef<BiquadFilterNode | null>(null);
  const trebleFilterRef = useRef<BiquadFilterNode | null>(null);

  // --- Helper: Initialize Audio Context & Core Nodes ---
  const ensureAudioContext = useCallback((): AudioContext | null => {
    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        console.error("Web Audio API not supported.");
        return null;
      }
      const context = new AudioContextClass();
      audioContextRef.current = context;

      // --- Create Nodes ---
      gainNodeRef.current = context.createGain();
      noiseGainNodeRef.current = context.createGain();
      preEQGainRef.current = context.createGain();
      noiseFilterNodeRef.current = context.createBiquadFilter();
      bassFilterRef.current = context.createBiquadFilter();
      trebleFilterRef.current = context.createBiquadFilter();
      pannerLeftRef.current = context.createStereoPanner();
      pannerRightRef.current = context.createStereoPanner();
      noisePannerLeftRef.current = context.createStereoPanner();
      noisePannerRightRef.current = context.createStereoPanner();
      modGainLeftRef.current = context.createGain();
      modGainRightRef.current = context.createGain();
      lfoLeftRef.current = context.createOscillator();
      lfoRightRef.current = context.createOscillator();
      depthGainLeftRef.current = context.createGain();
      depthGainRightRef.current = context.createGain();
      compressorNodeRef.current = context.createDynamicsCompressor();
      masterGainRef.current = context.createGain(); // Create Master Gain

      // --- Configure Nodes ---
      gainNodeRef.current.gain.value = oscVolume;
      noiseGainNodeRef.current.gain.value = noiseVolume;
      masterGainRef.current.gain.value = masterVolume; // Set initial master volume
      preEQGainRef.current.gain.value = 1.0;
      // Noise Filter
      noiseFilterNodeRef.current.type = "lowpass";
      noiseFilterNodeRef.current.frequency.value = noiseFilterFreq;
      noiseFilterNodeRef.current.Q.value = 1;
      // EQ Filters
      bassFilterRef.current.type = "lowshelf";
      bassFilterRef.current.frequency.value = BASS_FREQ_HZ;
      bassFilterRef.current.gain.value = bassGain;
      trebleFilterRef.current.type = "highshelf";
      trebleFilterRef.current.frequency.value = TREBLE_FREQ_HZ;
      trebleFilterRef.current.gain.value = trebleGain;
      // Panners
      pannerLeftRef.current.pan.value = -1;
      pannerRightRef.current.pan.value = 1;
      noisePannerLeftRef.current.pan.value = -1;
      noisePannerRightRef.current.pan.value = 1;
      // LFOs
      lfoLeftRef.current.frequency.value = baseFrequency;
      lfoRightRef.current.frequency.value =
        baseFrequency + frequency * BASE_SETTINGS.factor;
      lfoLeftRef.current.type = "sine";
      lfoRightRef.current.type = "sine";
      // AM Depth
      const baseModGain = Math.max(0, 1.0 - amDepth / 2.0);
      const depthGainVal = Math.max(0, amDepth / 2.0);
      modGainLeftRef.current.gain.value = baseModGain;
      modGainRightRef.current.gain.value = baseModGain;
      depthGainLeftRef.current.gain.value = depthGainVal;
      depthGainRightRef.current.gain.value = depthGainVal;

      // Compressor
      compressorNodeRef.current.threshold.value = -24;
      compressorNodeRef.current.knee.value = 30;
      compressorNodeRef.current.ratio.value = 6;
      compressorNodeRef.current.attack.value = 0.003;
      compressorNodeRef.current.release.value = 0.25;

      masterGainRef.current.connect(context.destination); // Master -> Destination
      bassFilterRef.current.connect(trebleFilterRef.current); // Bass -> Treble
      preEQGainRef.current.connect(bassFilterRef.current); // PreEQ -> Bass
      gainNodeRef.current.connect(preEQGainRef.current); // Osc Gain -> PreEQ
      modGainLeftRef.current.connect(preEQGainRef.current); // Mod Noise L -> PreEQ
      modGainRightRef.current.connect(preEQGainRef.current); // Mod Noise R -> PreEQ
      noisePannerLeftRef.current.connect(modGainLeftRef.current); // Noise Panner L -> Mod L
      noisePannerRightRef.current.connect(modGainRightRef.current); // Noise Panner R -> Mod R
      noiseFilterNodeRef.current.connect(noisePannerLeftRef.current); // Filter -> Panner L
      noiseFilterNodeRef.current.connect(noisePannerRightRef.current); // Filter -> Panner R
      noiseGainNodeRef.current.connect(noiseFilterNodeRef.current); // Noise Gain -> Filter
      // AM Path
      lfoLeftRef.current.connect(depthGainLeftRef.current);
      depthGainLeftRef.current.connect(modGainLeftRef.current.gain);
      lfoRightRef.current.connect(depthGainRightRef.current);
      depthGainRightRef.current.connect(modGainRightRef.current.gain);

      // --- Connect Compressor/Bypass based on initial state ---
      // (This logic is now identical to handleCompressorToggle)
      const masterGain = masterGainRef.current;
      const compressor = compressorNodeRef.current;
      const trebleFilter = trebleFilterRef.current;

      if (compressorEnabled) {
        // Connect Treble -> Compressor -> Master Gain
        console.log(
          "Initial setup: Compressor enabled. Connecting Treble -> Compressor -> Master Gain."
        );
        trebleFilter.connect(compressor);
        compressor.connect(masterGain);
      } else {
        // Connect Treble -> Master Gain (Bypass Compressor)
        console.log(
          "Initial setup: Compressor disabled. Connecting Treble -> Master Gain."
        );
        trebleFilter.connect(masterGain);
      }

      // --- Start LFOs ---
      lfoLeftRef.current.start();
      lfoRightRef.current.start();

      console.log(
        `AudioContext initialized. Compressor initially ${compressorEnabled ? "enabled" : "disabled"}.`
      );
    } else if (audioContextRef.current.state === "suspended") {
      audioContextRef.current
        .resume()
        .catch((e) => console.error("Error resuming AudioContext:", e));
    }
    return audioContextRef.current;
  }, [
    oscVolume,
    noiseVolume,
    masterVolume,
    compressorEnabled,
    baseFrequency,
    frequency,
    amDepth,
    noiseFilterFreq,
    bassGain,
    trebleGain,
  ]);

  // --- Internal Helper: Start/Stop Oscillators (Full) ---
  const _startOscillatorsInternal = useCallback(() => {
    const audioContext = audioContextRef.current;
    if (
      !audioContext ||
      !pannerLeftRef.current ||
      !pannerRightRef.current ||
      !gainNodeRef.current ||
      oscillatorLeftRef.current
    ) {
      if (
        !audioContext ||
        !pannerLeftRef.current ||
        !pannerRightRef.current ||
        !gainNodeRef.current
      )
        console.error("Cannot start oscillators: Context or nodes not ready.");
      return;
    }
    console.log("Internal: Starting oscillators.");
    oscillatorLeftRef.current = audioContext.createOscillator();
    oscillatorRightRef.current = audioContext.createOscillator();
    oscillatorLeftRef.current.frequency.setValueAtTime(
      baseFrequency,
      audioContext.currentTime
    );
    oscillatorRightRef.current.frequency.setValueAtTime(
      baseFrequency + frequency * BASE_SETTINGS.factor,
      audioContext.currentTime
    );
    oscillatorLeftRef.current.connect(pannerLeftRef.current);
    oscillatorRightRef.current.connect(pannerRightRef.current);
    pannerLeftRef.current.connect(gainNodeRef.current);
    pannerRightRef.current.connect(gainNodeRef.current);
    oscillatorLeftRef.current.start();
    oscillatorRightRef.current.start();
  }, [baseFrequency, frequency]);

  const _stopOscillatorsInternal = useCallback(() => {
    console.log("Internal: Stopping oscillators.");
    if (oscillatorLeftRef.current) {
      try {
        oscillatorLeftRef.current.stop();
        oscillatorLeftRef.current.disconnect();
      } catch (e) {}
      oscillatorLeftRef.current = null;
    }
    if (oscillatorRightRef.current) {
      try {
        oscillatorRightRef.current.stop();
        oscillatorRightRef.current.disconnect();
      } catch (e) {}
      oscillatorRightRef.current = null;
    }
  }, []);

  // --- Internal Helper: Start/Stop Noise Source (Full) ---
  const _startNoiseInternal = useCallback((type: NoiseType) => {
    const audioContext = audioContextRef.current;
    if (!audioContext || !noiseGainNodeRef.current || noiseNodeRef.current) {
      if (!audioContext || !noiseGainNodeRef.current)
        console.error(
          "Cannot start noise: Context or noise gain node not ready."
        );
      return;
    }
    console.log(`Internal: Starting ${type} noise source.`);
    const bufferSize = audioContext.sampleRate * BASE_SETTINGS.bufferSize;
    let noiseBuffer: AudioBuffer;
    switch (type) {
      case "white":
        noiseBuffer = createWhiteNoise(audioContext, bufferSize);
        break;
      case "pink":
        noiseBuffer = createPinkNoise(audioContext, bufferSize);
        break;
      case "brown":
        noiseBuffer = createBrownNoise(audioContext, bufferSize);
        break;
      default:
        console.error(`Unknown noise type: ${type}`);
        return;
    }
    noiseNodeRef.current = audioContext.createBufferSource();
    noiseNodeRef.current.buffer = noiseBuffer;
    noiseNodeRef.current.loop = true;
    noiseNodeRef.current.connect(noiseGainNodeRef.current);
    noiseNodeRef.current.start();
  }, []);

  const _stopNoiseInternal = useCallback(() => {
    if (noiseNodeRef.current) {
      console.log("Internal: Stopping noise source.");
      try {
        noiseNodeRef.current.stop();
        noiseNodeRef.current.disconnect();
      } catch (e) {
        console.warn("Error stopping noise node:", e);
      }
      noiseNodeRef.current = null;
    }
  }, []);

  const startAudio = useCallback(() => {
    ensureAudioContext();
    if (isPlaying) return;
    console.log("startAudio called.");
    setIsPlaying(true);
  }, [ensureAudioContext, isPlaying]);

  const stopAudio = useCallback(() => {
    if (!isPlaying) return;
    console.log("stopAudio called.");
    _stopOscillatorsInternal();
    _stopNoiseInternal();
    setIsPlaying(false);
  }, [isPlaying, _stopOscillatorsInternal, _stopNoiseInternal]);

  const toggleOscillators = useCallback(() => {
    setOscEnabled((prev) => !prev);
  }, []);
  const toggleNoise = useCallback(() => {
    setNoiseEnabled((prev) => !prev);
  }, []);
  const setNoiseType = useCallback((type: NoiseType) => {
    setSelectedNoiseType(type);
  }, []);
  const handleAmDepthInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    handleInput(e, setAmDepth);
  }, []);
  const handleNoiseFilterFreqInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      handleInput(e, setNoiseFilterFreq);
    },
    []
  );
  const handleBassGainInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      handleInput(e, setBassGain);
    },
    []
  );
  const handleTrebleGainInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      handleInput(e, setTrebleGain);
    },
    []
  );
  const handleMasterVolumeInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      // Added Master Volume handler
      handleInput(e, setMasterVolume);
    },
    []
  );

  // --- Effects ---
  useEffect(() => {
    if (!isPlaying) {
      _stopOscillatorsInternal();
      return;
    }
    if (oscEnabled) {
      _startOscillatorsInternal();
    } else {
      _stopOscillatorsInternal();
    }
    return () => {
      _stopOscillatorsInternal();
    };
  }, [
    isPlaying,
    oscEnabled,
    _startOscillatorsInternal,
    _stopOscillatorsInternal,
  ]);

  useEffect(() => {
    if (!isPlaying) {
      _stopNoiseInternal();
      return;
    }
    if (noiseEnabled) {
      _stopNoiseInternal();
      _startNoiseInternal(selectedNoiseType);
    } else {
      _stopNoiseInternal();
    }
    return () => {
      _stopNoiseInternal();
    };
  }, [
    isPlaying,
    noiseEnabled,
    selectedNoiseType,
    _startNoiseInternal,
    _stopNoiseInternal,
  ]);

  // --- Compact Cleanup Full Logic ---
  useEffect(() => {
    const contextRef = audioContextRef;
    const nodeRefs = [
      oscillatorLeftRef,
      oscillatorRightRef,
      pannerLeftRef,
      pannerRightRef,
      gainNodeRef,
      noiseNodeRef,
      noiseGainNodeRef,
      noiseFilterNodeRef,
      noisePannerLeftRef,
      noisePannerRightRef,
      lfoLeftRef,
      lfoRightRef,
      depthGainLeftRef,
      depthGainRightRef,
      modGainLeftRef,
      modGainRightRef,
      preEQGainRef,
      bassFilterRef,
      trebleFilterRef,
      compressorNodeRef,
      masterGainRef, // Added master gain
    ];
    return () => {
      console.log("Running compact cleanup effect on unmount");
      nodeRefs.forEach((nodeRef) => {
        const node = nodeRef.current;
        if (node) {
          try {
            if (typeof (node as any).stop === "function") {
              (node as any).stop();
            }
            node.disconnect();
          } catch (e) {
            console.warn("Error during node cleanup:", e);
          }
        }
      });
      const context = contextRef.current;
      if (context && context.state !== "closed") {
        context
          .close()
          .catch((e) => console.error("Error closing context on unmount:", e));
      }
      nodeRefs.forEach((ref) => {
        ref.current = null;
      });
      contextRef.current = null;
      outputNodeRef.current = null;
    };
  }, []);

  // --- Parameter Update Effects (Full) ---
  useEffect(() => {
    if (isPlaying && noiseEnabled && audioContextRef.current) {
      const currentTime = audioContextRef.current.currentTime;
      const freqL = baseFrequency;
      const freqR = baseFrequency + frequency * BASE_SETTINGS.factor;
      if (lfoLeftRef.current) {
        lfoLeftRef.current.frequency.setTargetAtTime(freqL, currentTime, 0.015);
      }
      if (lfoRightRef.current) {
        lfoRightRef.current.frequency.setTargetAtTime(
          freqR,
          currentTime,
          0.015
        );
      }
    }
  }, [isPlaying, noiseEnabled, baseFrequency, frequency]);

  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(
        oscVolume,
        audioContextRef.current.currentTime,
        0.015
      );
    }
  }, [oscVolume]);

  useEffect(() => {
    if (noiseGainNodeRef.current && audioContextRef.current) {
      noiseGainNodeRef.current.gain.setTargetAtTime(
        noiseVolume,
        audioContextRef.current.currentTime,
        0.015
      );
    }
  }, [noiseVolume]);

  useEffect(() => {
    if (
      audioContextRef.current &&
      modGainLeftRef.current &&
      modGainRightRef.current &&
      depthGainLeftRef.current &&
      depthGainRightRef.current
    ) {
      const baseModGain = Math.max(0, 1.0 - amDepth / 2.0);
      const depthGainVal = Math.max(0, amDepth / 2.0);
      const currentTime = audioContextRef.current.currentTime;
      modGainLeftRef.current.gain.setTargetAtTime(
        baseModGain,
        currentTime,
        0.015
      );
      modGainRightRef.current.gain.setTargetAtTime(
        baseModGain,
        currentTime,
        0.015
      );
      depthGainLeftRef.current.gain.setTargetAtTime(
        depthGainVal,
        currentTime,
        0.015
      );
      depthGainRightRef.current.gain.setTargetAtTime(
        depthGainVal,
        currentTime,
        0.015
      );
    }
  }, [amDepth]);

  useEffect(() => {
    if (noiseFilterNodeRef.current && audioContextRef.current) {
      noiseFilterNodeRef.current.frequency.setTargetAtTime(
        noiseFilterFreq,
        audioContextRef.current.currentTime,
        0.015
      );
    }
  }, [noiseFilterFreq]);

  useEffect(() => {
    if (bassFilterRef.current && audioContextRef.current) {
      bassFilterRef.current.gain.setTargetAtTime(
        bassGain,
        audioContextRef.current.currentTime,
        0.02
      );
    }
  }, [bassGain]);

  useEffect(() => {
    if (trebleFilterRef.current && audioContextRef.current) {
      trebleFilterRef.current.gain.setTargetAtTime(
        trebleGain,
        audioContextRef.current.currentTime,
        0.02
      );
    }
  }, [trebleGain]);

  // Update Master Volume
  useEffect(() => {
    if (masterGainRef.current && audioContextRef.current) {
      masterGainRef.current.gain.setTargetAtTime(
        masterVolume,
        audioContextRef.current.currentTime,
        0.015
      );
    }
  }, [masterVolume]); // Added effect for master volume

  // Handle compressor toggling and rerouting audio graph
  const handleCompressorToggle = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const enabled = e.target.checked;
      setCompressorEnabled(enabled);
      // Ensure context and required nodes exist before rerouting
      if (
        !audioContextRef.current ||
        !trebleFilterRef.current ||
        !compressorNodeRef.current ||
        !masterGainRef.current
      ) {
        console.warn("Audio context not ready for compressor toggle.");
        return;
      }
      const masterGain = masterGainRef.current;
      const compressor = compressorNodeRef.current;
      const trebleFilter = trebleFilterRef.current;

      // --- Disconnect previous paths safely ---
      // Disconnect treble output from wherever it currently goes (master or compressor)
      try {
        trebleFilter.disconnect();
      } catch (err) {
        console.warn("Error disconnecting treble filter:", err);
      }
      // Disconnect compressor output from master gain (in case it was connected)
      try {
        compressor.disconnect(masterGain);
      } catch (err) {
        /* This might error if not connected, safe to ignore */
      }

      // --- Connect new path based on 'enabled' state ---
      if (enabled) {
        // Connect Treble -> Compressor -> Master Gain
        trebleFilter.connect(compressor);
        compressor.connect(masterGain);
        console.log(
          "Compressor Enabled: Routing Treble -> Compressor -> Master Gain"
        );
      } else {
        // Connect Treble -> Master Gain
        trebleFilter.connect(masterGain);
        console.log("Compressor Disabled: Routing Treble -> Master Gain");
      }
    },
    []
  ); // Dependencies: refs are stable

  return {
    amDepth,
    isPlaying,
    baseFrequency,
    compressorEnabled,
    handleCompressorToggle,
    frequency,
    formattedBaseFrequency: formattedFrequency(baseFrequency),
    formattedFrequency: formattedFrequency(frequency),
    formattedNoiseFilterFreq: formattedFrequency(noiseFilterFreq),
    formattedBassGain: formattedGain(bassGain),
    formattedTrebleGain: formattedGain(trebleGain),
    formattedMasterVolume: formattedVolume(masterVolume),
    handleBaseFrequencyInput: (e: ChangeEvent<HTMLInputElement>) =>
      handleInput(e, setBaseFrequency),
    handleFrequencyInput: (e: ChangeEvent<HTMLInputElement>) =>
      handleInput(e, setFrequency),
    handleVolumeInput: (e: ChangeEvent<HTMLInputElement>) =>
      handleInput(e, setOscVolume),
    handleMasterVolumeInput, // Added master volume handler
    handleAmDepthInput,
    handleNoiseFilterFreqInput,
    handleBassGainInput,
    handleTrebleGainInput,
    minBaseFrequency: BASE_SETTINGS.minBaseFrequency,
    minFrequency: BASE_SETTINGS.minFrequency,
    maxBaseFrequency: BASE_SETTINGS.maxBaseFrequency,
    maxFrequency: BASE_SETTINGS.maxFrequency,
    minFilterFreq: MIN_FILTER_FREQ,
    maxFilterFreq: MAX_FILTER_FREQ,
    minEqGain: MIN_EQ_GAIN,
    maxEqGain: MAX_EQ_GAIN,
    startAudio,
    stopAudio,
    oscVolume,
    oscEnabled,
    masterVolume,
    setMasterVolume,
    setOscEnabled,
    noiseEnabled,
    setNoiseEnabled,
    noiseVolume,
    selectedNoiseType,
    setSelectedNoiseType,
    setNoiseType,
    toggleNoise,
    toggleOscillators,
    noiseFilterFreq,
    setNoiseFilterFreq,
    bassGain,
    setBassGain,
    trebleGain,
    setTrebleGain,
    handleNoiseVolumeInput: (e: ChangeEvent<HTMLInputElement>) =>
      handleInput(e, setNoiseVolume),
  };
}
