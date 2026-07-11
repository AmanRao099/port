import { useEffect, useRef } from "react";
import { createTetrisSim } from "./tetris";

// Full-screen transition: tetrominoes rain over the visible page and stack
// into a solid wall, flash like a line clear, then the wall slides up.
// onFilled fires the moment the screen is fully covered — swap the content
// underneath then; onDone fires when the slide finishes.

const CELL = 28;

export function TetrisTransition({
  onFilled,
  onDone,
}: {
  onFilled: () => void;
  onDone: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onFilledRef = useRef(onFilled);
  const onDoneRef = useRef(onDone);
  onFilledRef.current = onFilled;
  onDoneRef.current = onDone;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const sim = createTetrisSim(Math.ceil(W / CELL), Math.ceil(H / CELL));
    let phase: "fill" | "flash" | "slide" = "fill";
    let flashAt = 0;
    let doneTimer = 0;
    let raf = 0;
    const t0 = performance.now();
    let last = t0;

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (phase === "fill") {
        sim.update(dt);
        // hard cap so a stubborn column can't stall the transition
        if (now - t0 > 2600) sim.plugHoles();
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
        const t = (now - flashAt) / 320;
        if (Math.floor(t * 6) % 2 === 0) {
          ctx.fillStyle = "rgba(255,255,255,0.35)";
          ctx.fillRect(0, 0, W, H);
        }
        if (t >= 1) {
          phase = "slide";
          wrap.style.transition = "transform 0.5s cubic-bezier(0.7, 0, 0.84, 0)";
          wrap.style.transform = "translateY(-100%)";
          doneTimer = window.setTimeout(() => onDoneRef.current(), 560);
        }
      }

      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(doneTimer);
    };
  }, []);

  return (
    <div ref={wrapRef} className="fixed inset-0 z-[200]" aria-hidden>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
