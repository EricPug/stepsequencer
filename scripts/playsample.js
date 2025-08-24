/// playsample.js

import Globals from "./globals.js";

export const playSample = (trackIndex, when = 0) => {
  // Ensure valid trackIndex
  if (trackIndex < 0 || trackIndex >= Globals.sampleFiles.length) {
    console.warn(`[audio] Invalid track index: ${trackIndex}`);
    return;
  }

  const runtime = Globals.runtime;
  if (!runtime) {
    console.error("[audio] Runtime not available");
    return;
  }

  const audio = runtime.objects.Audio;
  if (!audio) {
    console.error("[audio] Audio object not found");
    return;
  }

  const filename = Globals.sampleFiles[trackIndex];
  console.log(`[audio] Playing sample ${filename} (track ${trackIndex})`);
  
  // Play the audio file using Construct's Audio object
  // Note: Construct will handle the audio loading and playback
  audio.play(filename);
};