/// globals.js

const Globals = {
  bpm: 110,
  maxBpm: 300,
  minBpm: 30,
  controlknobSpeed: 0.5,
  runtime: null, // store runtime reference

  // Call this once at startup
  init(runtimeInstance) {
    this.runtime = runtimeInstance;
  },

  setBpm(newBpm) {
    this.bpm = newBpm;
  },

  // Sequencer data
  stepsPerInstrument: 16,
  instrumentCount: 8,
  sequencerState: Array.from({ length: 8 }, () =>
    Array(16).fill(false)
  )
};

export default Globals;