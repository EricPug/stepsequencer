/// sequencer.js


import Globals from "./globals.js";
import { playSample } from "./playsample.js";

const Sequencer = (() => {
  let isPlaying = false;
  let playhead = 0;
  let stepCallback = null; // called for LED/UI updates
  let pattern = Globals.sequencerState;

  let audioCtx = null;
  let nextStepTime = 0;
  const lookahead = 0.1; // seconds to schedule ahead
  let schedulerId = null;

  const getStepDuration = () => 60 / Globals.bpm / 4; // 16th notes

  // Schedule one step
  const scheduleStep = (stepIndex, time) => {
    // Call UI callback
    if (stepCallback) stepCallback(stepIndex, pattern, time);

    // Trigger samples for active instruments
    for (let i = 0; i < Globals.instrumentCount; i++) {
      if (pattern[i][stepIndex]) {
        playSample(i, time); // time in AudioContext seconds
      }
    }
  };

  // Scheduler loop
  const scheduler = () => {
    while (nextStepTime < audioCtx.currentTime + lookahead) {
      scheduleStep(playhead, nextStepTime);
      nextStepTime += getStepDuration();
      playhead = (playhead + 1) % Globals.stepsPerInstrument;
    }
    schedulerId = requestAnimationFrame(scheduler);
  };

  // Start sequencer
  const start = (callback) => {
    if (isPlaying) return;
    isPlaying = true;
    stepCallback = callback;

    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    playhead = 0;
    nextStepTime = audioCtx.currentTime + 0.05; // small offset
    schedulerId = requestAnimationFrame(scheduler);
  };

  // Stop sequencer
  const stop = () => {
    if (!isPlaying) return;
    isPlaying = false;
    cancelAnimationFrame(schedulerId);
    schedulerId = null;
  };

return {
  start,
  stop,
  getPlayhead: () => playhead,
  isPlaying: () => isPlaying
};
})();

export default Sequencer;
