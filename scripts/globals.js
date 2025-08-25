/// globals.js

const Globals = {
  bpm: 110,
  maxBpm: 300,
  minBpm: 30,
  controlknobSpeed: 0.5,
  runtime: null,
  signalNames: [
    "808bass",
    "808chh",
    "808claves",
    "808cow",
    "808maracas",
    "808ohh",
    "808rim",
    "808snare"
  ],

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