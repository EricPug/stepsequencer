// playsample.js
import Globals from "./globals.js";

export const playSample = (trackIndex) => {
  const runtime = Globals.runtime;
  if (!runtime) {
    console.error("Runtime not available in Globals.");
    return;
  }

  if (typeof runtime.callFunction !== "function") {
    console.error("Functions plugin is not available. Please add it to your project.");
    return;
  }

  // function name based on the track index, e.g., "play_0", "play_1".
  const functionName = `play_${trackIndex}`;

  try {
    // Call the dedicated function for this track index.
    runtime.callFunction(functionName);
  } catch (e) {
    console.error(`Error calling function "${functionName}": ${e.message}. Make sure the function exists in your event sheet and has no parameters.`);
  }
};
