// playsample.js
import Globals from "./globals.js";

/**
 * Plays an audio sample by calling a numbered function in the event sheet.
 * This approach avoids using parameters and relies on a simple naming convention.
 *
 * You must create a function for each track, named sequentially like "play_0",
 * "play_1", "play_2", etc. Each function should have no parameters and contain
 * the action to play the corresponding audio file.
 *
 * @param {number} trackIndex The index of the audio sample, used to construct the function name.
 */
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

  // Construct the function name based on the track index, e.g., "play_0", "play_1".
  const functionName = `play_${trackIndex}`;

  try {
    // Call the dedicated function for this track index. No parameters are needed.
    runtime.callFunction(functionName);
  } catch (e) {
    console.error(`Error calling function "${functionName}": ${e.message}. Make sure the function exists in your event sheet and has no parameters.`);
  }
};
