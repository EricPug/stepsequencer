import Globals from "./globals.js";

export const playSample = (trackIndex) => {
  if (trackIndex < 0 || trackIndex >= Globals.signalNames.length) {
    console.warn(`[audio] Invalid track index: ${trackIndex}`);
    return;
  }

  const signalName = Globals.signalNames[trackIndex];
  console.log(`[audio] Sending signal: ${signalName} (track ${trackIndex})`);

  try {
    // Assuming you have runtime available here:
    Globals.runtime.signal(signalName);
  } catch (err) {
    console.error("[audio] Error sending signal:", err);
  }
};
