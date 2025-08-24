/// uilayer.js

import Globals from "./globals.js";
import Sequencer from "./sequencer.js";

let g_runtime = null;
let playButton = null;
let stepButtons = [];
let stepLEDs = [];
let inited = false;

function initObjects(runtime) {
  if (inited) return;
  try {
    playButton  = runtime.objects.playbutton?.getFirstInstance() ?? null;
    stepButtons = runtime.objects.stepbutton?.getAllInstances() ?? [];
    stepLEDs    = runtime.objects.stepLED?.getAllInstances() ?? [];

    console.log(
      `[ui] init OK. playButton=${!!playButton} buttons=${stepButtons.length} leds=${stepLEDs.length}`
    );
    
    // Diagnostic: Check all buttons for missing instance variables
    let missingVars = 0;
    for (const btn of stepButtons) {
      if (!btn.instVars || typeof btn.instVars.instrumentIndex === 'undefined' || typeof btn.instVars.stepIndex === 'undefined') {
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
  g_runtime = runtime;

  // Wait until layout instances exist.
  // Using both events so it works like your main.js and also matches docs.
  runtime.addEventListener("afterlayoutstart", () => initObjects(runtime));
  runtime.addEventListener("afteranylayoutstart", () => initObjects(runtime));

  // One mouse handler for both play and step buttons
  runtime.addEventListener("mousedown", () => {
    // Lazy init if needed
    if (!inited) initObjects(runtime);

    const [mx, my] = runtime.mouse.getMousePosition();
    console.log("[ui] mousedown", mx, my);

    // Play/Stop
    if (playButton && playButton.containsPoint(mx, my)) {
      console.log("[ui] Play button clicked!");
      if (!Sequencer.isPlaying()) {
        Sequencer.start((stepIndex /*, pattern, time */) => {
          // LED highlight per step.
          for (const led of stepLEDs) {
            if (!led.instVars || typeof led.instVars.stepIndex === 'undefined') {
              continue; // Skip LEDs without stepIndex
            }
            
            if (typeof led.animationFrame === "number") {
              led.animationFrame = led.instVars.stepIndex === stepIndex ? 1 : 0;
            } else {
              led.opacity = led.instVars.stepIndex === stepIndex ? 1 : 0.2;
            }
          }
        });
      } else {
        Sequencer.stop();
        for (const led of stepLEDs) {
          if (typeof led.animationFrame === "number") led.animationFrame = 0;
          else led.opacity = 0.2;
        }
      }
      return; // do not also toggle a step on the same click
    }

    // Step toggles
    if (stepButtons.length) {
      for (const btn of stepButtons) {
        if (btn.containsPoint(mx, my)) {
          // Access instance variables through instVars property
          if (!btn.instVars || typeof btn.instVars.instrumentIndex === 'undefined' || typeof btn.instVars.stepIndex === 'undefined') {
            console.warn('[ui] Button missing instance variables. Has instVars:', !!btn.instVars);
            continue;
          }

          const i = btn.instVars.instrumentIndex | 0;
          const s = btn.instVars.stepIndex | 0;

          // Extra validation
          if (i < 0 || i >= 8 || s < 0 || s >= 16) {
            console.warn('[ui] Button has invalid indices. instrumentIndex:', i, 'stepIndex:', s);
            continue;
          }

          Globals.sequencerState[i][s] = !Globals.sequencerState[i][s];

          // Optional instant visual on the button itself
          if (typeof btn.animationFrame === "number") {
            btn.animationFrame = Globals.sequencerState[i][s] ? 1 : 0;
          }
          console.log(`[ui] toggle inst=${i} step=${s} -> ${Globals.sequencerState[i][s]}`);
          return;
        }
      }
    }
  });

  // Keep LEDs in sync during playback
  runtime.addEventListener("tick", () => {
    const step = Sequencer.getPlayhead();
    if (step == null || !stepLEDs.length) return;

    for (const led of stepLEDs) {
      if (!led.instVars || typeof led.instVars.stepIndex === 'undefined') {
        continue; // Skip LEDs without stepIndex
      }

      if (typeof led.animationFrame === "number") {
        led.animationFrame = led.instVars.stepIndex === step ? 1 : 0;
      } else {
        led.opacity = led.instVars.stepIndex === step ? 1 : 0.2;
      }
    }
  });
});