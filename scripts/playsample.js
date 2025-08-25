// playsample.js
import Globals from "./globals.js";

export const playSample = (trackIndex) => {
  const rt = Globals.runtime;
  if (!rt) { console.error("No runtime"); return; }

  const name = Globals.signalNames[trackIndex];
  console.log(`[audio] Sending signal: ${name} (track ${trackIndex})`);
  rt.signal(name);               // this triggers System "On signal <name>"
};
