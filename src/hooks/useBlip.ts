import { useRef, useCallback } from "react";

type BlipKind = "tap" | "hover";

export function useBlip() {
  const ctxRef = useRef<AudioContext | null>(null);

  return useCallback((kind: BlipKind = "tap") => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx = ctxRef.current;
    if (!ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      ctx = new AudioCtx();
      ctxRef.current = ctx;
    }
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";

    const now = ctx.currentTime;
    const freq = kind === "tap" ? 320 : 520;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * (kind === "tap" ? 1.8 : 1.2), now + 0.07);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }, []);
}
