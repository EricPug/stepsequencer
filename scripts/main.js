import Globals from "./globals.js";  // Changed this line
import "./sequencer.js";
import "./uilayer.js";
import "./playsample.js";

let g_runtime = null;

// load and initialize samples
async function loadSamples(runtime) {
  const sampleFiles = [
    "808bass.webm",
    "808CHH.webm", 
    "808claves.webm",
    "808cow.webm",
    "808maracas.webm",
    "808rim.webm",
    "808snare.webm",
    "808OHH.webm"
  ];
  
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const audioBuffers = [];
  
  for (const filename of sampleFiles) {
    try {
      // Load file from Construct 3's file system using the correct API
      const arrayBuffer = await runtime.assets.fetchArrayBuffer(filename);
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      audioBuffers.push(audioBuffer);
      console.log(`[audio] Loaded ${filename}, duration: ${audioBuffer.duration}s`);
    } catch (error) {
      console.error(`[audio] Failed to load ${filename}:`, error);
    }
  }
  
  // Initialize the samples array
  initSamples(audioBuffers);
  console.log(`[audio] Initialized ${audioBuffers.length} samples`);
}

runOnStartup(async runtime => {
  g_runtime = runtime;

  // Load samples first, but continue even if it fails
  try {
    await loadSamples(runtime);
  } catch (err) {
    console.error("Error loading samples:", err);
  }

});