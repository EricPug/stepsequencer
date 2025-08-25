import Globals from "./globals.js";
import "./sequencer.js";
import "./uilayer.js";
import "./playsample.js";

runOnStartup(async runtime => {

  Globals.runtime = runtime;
  
  if (!runtime.objects.Audio) {
    console.error("[main] No Audio object found in project!!");
    return;
  }
  
  console.log(`[main] Initialized with ${Globals.signalNames.length} audio samples`);
});