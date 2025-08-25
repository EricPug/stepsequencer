/// uilayer.js

import Globals from "./globals.js";
import Sequencer from "./sequencer.js";

let playButton = null;
let stepButtons = [];
let stepLEDs = [];
let inited = false;

// LED management
function updateLED(led, isActive) {
  if (!led.instVars || typeof led.instVars.stepIndex === 'undefined') {
    return; // Skip LEDs without stepIndex
  }
  
  if (typeof led.animationFrame === "number") {
    led.animationFrame = isActive ? 1 : 0;
  } else {
    led.opacity = isActive ? 1 : 0.2;
  }
}

function updateAllLEDs(activeStep = null) {
  for (const led of stepLEDs) {
    const isActive = activeStep !== null && led.instVars && led.instVars.stepIndex === activeStep;
    updateLED(led, isActive);
  }
}

function clearAllLEDs() {
  for (const led of stepLEDs) {
    updateLED(led, false);
  }
}

// Button validation
function hasValidInstanceVars(obj) {
  return obj.instVars && 
         typeof obj.instVars.instrumentIndex !== 'undefined' && 
         typeof obj.instVars.stepIndex !== 'undefined';
}

function validateButtonIndices(instrumentIndex, stepIndex) {
  return instrumentIndex >= 0 && instrumentIndex < 8 && 
         stepIndex >= 0 && stepIndex < 16;
}

function initObjects(runtime) {
  if (inited) return;
  try {
    playButton  = runtime.objects.playbutton?.getFirstInstance() ?? null;
    stepButtons = runtime.objects.stepbutton?.getAllInstances() ?? [];
    stepLEDs    = runtime.objects.stepLED?.getAllInstances() ?? [];

    console.log(
      `[ui] init OK. playButton=${!!playButton} buttons=${stepButtons.length} leds=${stepLEDs.length}`
    );
    
    // Check all buttons for missing instance variables
    let missingVars = 0;
    for (const btn of stepButtons) {
      if (!hasValidInstanceVars(btn)) {
        missingVars++;
      }
    }
    if (missingVars > 0) {
      console.warn(`[ui] Found ${missingVars} buttons with missing instance variables out of ${stepButtons.length} total`);
    } else {
      console.log(`[ui] All ${stepButtons.length} buttons have proper instance variables!`);
    }
    
    inited = true;
  } catch (e) {
    console.error("[ui] init error:", e);
  }
}

runOnStartup(async runtime => {
  // --- Control Knob UI Logic ---
  let isDraggingKnob = false;
  let startYKnob = 0;
  let knobTextObject = null;
  let knobTextInitialized = false;

  // BPM text management functions
  function initBPMText() {
    if (!knobTextInitialized && runtime.objects.displaytext) {
      knobTextObject = runtime.objects.displaytext.getFirstInstance();
      if (knobTextObject) {
        knobTextObject.text = Math.round(Globals.bpm).toString();
        knobTextInitialized = true;
      }
    }
  }

  function updateBPMText() {
    if (!knobTextObject) {
      knobTextObject = runtime.objects.displaytext.getFirstInstance();
    }
    if (knobTextObject) {
      knobTextObject.text = Math.round(Globals.bpm).toString();
    }
  }

  function handleKnobDragging() {
    if (!isDraggingKnob) return false;
    
    const [, currentY] = runtime.mouse.getMousePosition();
    let newBpm = Globals.bpm + (startYKnob - currentY) * Globals.controlknobSpeed;
    newBpm = Math.min(Globals.maxBpm, Math.max(Globals.minBpm, newBpm));
    
    if (Math.round(newBpm) !== Math.round(Globals.bpm)) {
      Globals.setBpm(Math.round(newBpm));
    }
    
    updateBPMText();
    startYKnob = currentY;
    return true; // Handled - skip other tick processing
  }

  // Mouse interaction handlers
  function handleKnobClick(mx, my) {
    const knob = runtime.objects.controlknob.getFirstInstance();
    if (knob && knob.containsPoint(mx, my)) {
      isDraggingKnob = true;
      startYKnob = my;
      return true; // Handled - don't process other UI elements
    }
    return false;
  }

  function handlePlayButtonClick(mx, my) {
    if (playButton && playButton.containsPoint(mx, my)) {
      console.log("[ui] Play button clicked!");
      if (!Sequencer.isPlaying()) {
        Sequencer.start((stepIndex /*, pattern, time */) => {
          updateAllLEDs(stepIndex);
        });
      } else {
        Sequencer.stop();
        clearAllLEDs();
      }
      return true; // Handled - don't process step buttons
    }
    return false;
  }

  function handleStepButtonClick(mx, my) {
    if (!stepButtons.length) return false;

    for (const btn of stepButtons) {
      if (btn.containsPoint(mx, my)) {
        // Validate instance variables
        if (!hasValidInstanceVars(btn)) {
          console.warn('[ui] Button missing instance variables. Has instVars:', !!btn.instVars);
          continue;
        }

        const i = btn.instVars.instrumentIndex | 0;
        const s = btn.instVars.stepIndex | 0;

        // Validate indices are within expected ranges
        if (!validateButtonIndices(i, s)) {
          console.warn('[ui] Button has invalid indices. instrumentIndex:', i, 'stepIndex:', s);
          continue;
        }

        Globals.sequencerState[i][s] = !Globals.sequencerState[i][s];

        // Optional instant visual on the button itself
        if (typeof btn.animationFrame === "number") {
          btn.animationFrame = Globals.sequencerState[i][s] ? 1 : 0;
        }
        console.log(`[ui] toggle inst=${i} step=${s} -> ${Globals.sequencerState[i][s]}`);
        return true; // Handled
      }
    }
    return false;
  }

  // mouse down handler
  runtime.addEventListener("mousedown", () => {
    // Lazy init if needed
    if (!inited) initObjects(runtime);

    const [mx, my] = runtime.mouse.getMousePosition();
    console.log("[ui] mousedown", mx, my);

    // Handle interactions in priority order
    if (handleKnobClick(mx, my)) return;
    if (handlePlayButtonClick(mx, my)) return;
    handleStepButtonClick(mx, my);
  });

  // Mouse up
  runtime.addEventListener("mouseup", () => {
    isDraggingKnob = false;
  });

  // Handle knob dragging and LED sync
  runtime.addEventListener("tick", () => {
    // Initialize BPM text display once
    initBPMText();

    // Handle knob dragging (skip LED updates if dragging)
    if (handleKnobDragging()) return;

    // Keep LEDs in sync during playback
    const step = Sequencer.getPlayhead();
    if (step != null && stepLEDs.length) {
      updateAllLEDs(step);
    }
  });

  // Wait until layout instances exist.
  runtime.addEventListener("afterlayoutstart", () => initObjects(runtime));
});