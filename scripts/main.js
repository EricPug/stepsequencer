import Globals from "./globals.js";  // Changed this line
import "./sequencer.js";
import "./uilayer.js";
import "./playsample.js";
//import { runOnStartup } from "./c2runtime.js";


let isDragging = false;
let startY = 0;
let lastBpm = Globals.bpm;
let g_runtime = null;
let myTextObject2 = null;

// Add this function to load and initialize samples
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

  // Initialize display text after layout starts
  runtime.addEventListener("afterlayoutstart", () => {
    myTextObject2 = runtime.objects.displaytext.getFirstInstance();

    if (myTextObject2) {
      myTextObject2.text = String(Math.round(Globals.bpm));
      console.log("Display text initialized with BPM:", Globals.bpm);
    } else {
      console.error("Could not find displaytext object in layout");
    }
  });

  // Mouse down: check if knob is clicked
  runtime.addEventListener("mousedown", () => {
    const [mx, my] = runtime.mouse.getMousePosition();
    const knob = runtime.objects.controlknob.getFirstInstance();
    if (knob && knob.containsPoint(mx, my)) {
      isDragging = true;
      startY = my;
    }
  });

  // Mouse move: update BPM while dragging
  runtime.addEventListener("tick", () => {
    if (!isDragging) return;

    const [, currentY] = runtime.mouse.getMousePosition();
    let newBpm = Globals.bpm + (startY - currentY) * Globals.controlknobSpeed;

    // Clamp BPM
    newBpm = Math.min(Globals.maxBpm, Math.max(Globals.minBpm, newBpm));

    // Update BPM if it changed
    if (Math.round(newBpm) !== Math.round(Globals.bpm)) {
      Globals.setBpm(Math.round(newBpm));
      lastBpm = Globals.bpm;
    }

    // Lazy fetch and update display text
    if (!myTextObject2) {
      myTextObject2 = runtime.objects.displaytext.getFirstInstance();
    }
    if (myTextObject2) {
      myTextObject2.text = Math.round(Globals.bpm).toString();
    }

    startY = currentY;
  });

  // Mouse up: stop dragging
  runtime.addEventListener("mouseup", () => {
    isDragging = false;
    //console.log("Mouse released. BPM:", Globals.bpm.toString());
  });
});