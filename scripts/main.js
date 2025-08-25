import Globals from "./globals.js";  // Changed this line
import "./sequencer.js";
import "./uilayer.js";
import "./playsample.js";

let g_runtime = null;

// Define available samples
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

function initAudio(runtime) {
  // Verify Audio object exists
  const audio = runtime.objects.Audio;
  if (!audio) {
    console.error("[audio] No Audio object found in project");
    return false;
  }
  else
  {
        console.log("[audio] Audio object found in project");
  }

  // Store the sample names in Globals for use by other modules
  Globals.sampleFiles = sampleFiles;
  Globals.runtime = runtime;  // We'll need this for playing sounds

  console.log(`[audio] Initialized ${sampleFiles.length} samples`);
  return true;
}

runOnStartup(async runtime => {
  g_runtime = runtime;

  // Initialize audio system
  if (!initAudio(runtime)) {
    console.error("[audio] Failed to initialize audio system");
    return;
  }
});