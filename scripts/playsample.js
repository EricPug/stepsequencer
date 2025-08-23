import Globals from "./globals.js";

// Map track index → AudioBuffer
const samples = [];

// Initialize with preloaded AudioBuffers
export const initSamples = (audioBuffers) => {
  samples.length = 0;
  for (let buf of audioBuffers) samples.push(buf);
};

let audioCtx = null;

export const playSample = (trackIndex, when = 0) => {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const buffer = samples[trackIndex];
  if (!buffer) return;

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);

  // 'when' is in seconds relative to AudioContext.currentTime
  source.start(when || audioCtx.currentTime);
};
