/// playsample.js

// Map track index → AudioBuffer
const samples = [];

// Initialize with preloaded AudioBuffers
export const initSamples = (audioBuffers) => {
  samples.length = 0;
  for (let buf of audioBuffers) samples.push(buf);
};

let audioCtx = null;

export const playSample = (trackIndex, when = 0) => {
  console.log(`[audio] Attempting to play sample ${trackIndex}, when=${when}`);
  
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    console.log(`[audio] Created AudioContext, state: ${audioCtx.state}`);
  }
  
  const buffer = samples[trackIndex];
  if (!buffer) {
    console.warn(`[audio] No buffer found for track ${trackIndex}. Available samples:`, samples.length);
    return;
  }
  
  console.log(`[audio] Playing buffer for track ${trackIndex}, duration: ${buffer.duration}s`);
  
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.start(when || audioCtx.currentTime);
  
  console.log(`[audio] Sample ${trackIndex} started at ${audioCtx.currentTime}`);
};