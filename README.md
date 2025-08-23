# Erictakt-1

This started as a quick toy sample step sequencer built in Construct 3.  
At first, the plan was to just use Construct’s built-in timing.  
That kind of “game-loop” timing is fine for visuals but not accurate enough to actually make music.  
Because the speed of sound is both fast and slow... and you have to have it right.

The current design uses the Web Audio API directly.  
Samples are scheduled against the AudioContext clock, which means playback is sample-accurate and multiple sounds line up perfectly in time.  

## Current pieces
- **globals.js** → holds BPM, sequencer state, and other global data.  
- **sequencer.js** → handles timing and scheduling steps.  
- **playsample.js** → plays audio samples at exact times.  
- **uilayer.js** → connects UI (buttons, LEDs, knob, etc.) to the sequencer.  
- **main.js** → existing working UI logic for BPM knob and display.  

## Layout objects in Construct
- `stepbutton` → step toggles for each instrument (instance vars: instrumentIndex, stepIndex).  
- `stepLED` → LEDs showing playhead position (instance var: stepIndex).  
- `playbutton` → start/stop.  
- `controlknob` → sets BPM.  
- `displaytext` → shows BPM.  

## Next steps
- Support multiple patterns.  
- Add swing and retrigger features.  
- Stay modular: UI, sequencer, and audio playback stay separate.
