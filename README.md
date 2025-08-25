# Erictakt-1

Sample step sequencer built in Construct 3.  

1. Audio Context Timing (Not Frame Timing)
Uses audioCtx.currentTime - this is hardware audio clock time Runs at audio sample rate (typically 44.1kHz or 48kHz)
Completely independent of screen refresh rate

2. Lookahead Scheduling
Samples are scheduled in advance by 100ms
Even if framerate drops to 10fps, audio keeps playing smoothly
The scheduler runs ahead of real-time

3. Mathematical Timing Precision
Step timing calculated mathematically from BPM
No accumulation of frame-based timing errors
Sample-accurate precision

the same pattern found in Ableton Live, Pro Tools, etc
