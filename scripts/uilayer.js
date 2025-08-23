import Globals from "./globals.js";
import Sequencer from "./sequencer.js";

let g_runtime = null;

runOnStartup(runtime => {
  g_runtime = runtime;

  // Lazy grab objects
  const stepButtons = runtime.objects.stepbutton.getAllInstances();
  const stepLEDs = runtime.objects.stepLED.getAllInstances();
  const playButton = runtime.objects.playbutton.getFirstInstance();

  // --------------------
  // Step button clicks
  // --------------------
  runtime.addEventListener("mousedown", () => {
    const [mx, my] = runtime.mouse.getMousePosition();
    for (const btn of stepButtons) {
      if (btn.containsPoint(mx, my)) {
        const i = btn.instanceVars.instrumentIndex;
        const s = btn.instanceVars.stepIndex;

        // Toggle step state
        Globals.sequencerState[i][s] = !Globals.sequencerState[i][s];

        // Optionally update LED immediately
        const led = stepLEDs.find(l => l.instanceVars.stepIndex === s);
        if (led) led.opacity = Globals.sequencerState[i][s] ? 1 : 0.2;
      }
    }
  });

  // --------------------
  // Play / Stop button
  // --------------------
  runtime.addEventListener("mousedown", () => {
    const [mx, my] = runtime.mouse.getMousePosition();
    if (playButton.containsPoint(mx, my)) {
      if (Sequencer.getPlayhead() === null || !Sequencer.isPlaying) {
        Sequencer.start((stepIndex, pattern, time) => {
          // Update LEDs
          stepLEDs.forEach(led => {
            led.opacity = led.instanceVars.stepIndex === stepIndex ? 1 : 0.2;
          });
        });
      } else {
        Sequencer.stop();
        stepLEDs.forEach(led => led.opacity = 0.2);
      }
    }
  });

  // --------------------
  // Optional: Update LEDs continuously
  // --------------------
  runtime.addEventListener("tick", () => {
    const currentStep = Sequencer.getPlayhead();
    if (currentStep === null) return;

    stepLEDs.forEach(led => {
      led.opacity = led.instanceVars.stepIndex === currentStep ? 1 : 0.2;
    });
  });
});
