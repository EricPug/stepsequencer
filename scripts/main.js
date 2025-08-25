import Globals from "./globals.js";  // Changed this line
import "./sequencer.js";
import "./uilayer.js";
import "./playsample.js";

let g_runtime = null;

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

  // Set runtime in Globals
  Globals.runtime = runtime;  // We'll need this for playing sounds

  console.log(`[audio] Initialized ${Globals.signalNames.length} samples`);
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