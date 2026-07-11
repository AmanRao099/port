import { useEffect, useRef } from "react";
import { createTetrisSim } from "./tetris";

// Element-scale build-in: tetrominoes rain into the host element's box and
// pack it solid, flash, then dissolve. Render inside a `relative` container;
// keep the real content invisible until onFilled fires.

const CELL = 20;

export function TetrisBuild({
  onFilled,
  onDone,
  delay = 0,
}: {
  onFilled: () => void;
  onDone: () => void;
  delay?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onFilledRef = useRef(onFilled);
  const onDoneRef = useRef(onDone);
  onFilledRef.current = onFilled;
  onDoneRef.current = onDone;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const host = canvas?.parentElement;
    if (!canvas || !ctx || !host) return;

    const rect = host.getBoundingClientRect();
    const W = Math.max(1, Math.round(rect.width));
    const H = Math.max(1, Math.round(rect.height));
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const sim = createTetrisSim(Math.ceil(W / CELL), Math.ceil(H / CELL), 1.5);
    let phase: "fill" | "flash" = "fill";
    let flashAt = 0;
    let t0 = 0;
    let last = 0;
    let raf = 0;
    let doneTimer = 0;

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (phase === "fill") {
        sim.update(dt);
        if (now - t0 > 1800) sim.plugHoles();
        if (sim.filled()) {
          sim.plugHoles();
          phase = "flash";
          flashAt = now;
          onFilledRef.current();
        }
      }

      ctx.clearRect(0, 0, W, H);
      sim.draw(ctx, CELL);

      if (phase === "flash") {
        const t = (now - flashAt) / 260;
        if (Math.floor(t * 6) % 2 === 0) {
          ctx.fillStyle = "rgba(255,255,255,0.35)";
          ctx.fillRect(0, 0, W, H);
        }
        if (t >= 1) {
          canvas.style.transition = "opacity 0.25s steps(4)";
          canvas.style.opacity = "0";
          doneTimer = window.setTimeout(() => onDoneRef.current(), 280);
          cancelAnimationFrame(raf);
          return;
        }
      }

      raf = requestAnimationFrame(step);
    };

    const startTimer = window.setTimeout(() => {
      t0 = performance.now();
      last = t0;
      raf = requestAnimationFrame(step);
    }, delay);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(doneTimer);
      cancelAnimationFrame(raf);
    };
  }, [delay]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      aria-hidden
    />
  );
}
