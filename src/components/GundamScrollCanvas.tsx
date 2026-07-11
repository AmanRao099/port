import { useCallback, useEffect, useRef, type RefObject } from "react";
import { useMotionValueEvent, useScroll, useTransform } from "framer-motion";

const FRAME_COUNT = 240;

const frameSrc = (index: number) =>
  `/images/gundam-sequence/ezgif-frame-${String(index + 1).padStart(3, "0")}.jpg`;

type ScrollOffset = NonNullable<NonNullable<Parameters<typeof useScroll>[0]>["offset"]>;

interface GundamScrollCanvasProps {
  /** Banner section whose scroll progress drives the sequence; window scroll when omitted. */
  containerRef?: RefObject<HTMLElement | null>;
  /** Scroll range mapped to the sequence; defaults to the container's full scroll span. */
  offset?: ScrollOffset;
  className?: string;
}

export function GundamScrollCanvas({
  containerRef,
  offset = ["start start", "end end"],
  className,
}: GundamScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const cssSizeRef = useRef({ width: 0, height: 0 });
  const rafRef = useRef(0);

  const { scrollYProgress } = useScroll(
    containerRef ? { target: containerRef, offset } : undefined,
  );

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1], {
    clamp: true,
  });

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Fall back to the nearest already-decoded frame so fast scrolling
    // mid-preload never blanks the canvas.
    let img: HTMLImageElement | undefined;
    for (let i = index; i >= 0; i--) {
      const candidate = imagesRef.current[i];
      if (candidate && candidate.complete && candidate.naturalWidth > 0) {
        img = candidate;
        break;
      }
    }
    if (!img) return;

    const { width, height } = cssSizeRef.current;
    if (width === 0 || height === 0) return;

    // object-fit: contain — letterbox the frame inside the canvas box.
    const scale = Math.min(width / img.naturalWidth, height / img.naturalHeight);
    const drawWidth = img.naturalWidth * scale;
    const drawHeight = img.naturalHeight * scale;

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(
      img,
      (width - drawWidth) / 2,
      (height - drawHeight) / 2,
      drawWidth,
      drawHeight,
    );
  }, []);

  const scheduleDraw = useCallback(
    (index: number) => {
      currentFrameRef.current = index;
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        drawFrame(currentFrameRef.current);
      });
    },
    [drawFrame],
  );

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { width, height } = canvas.getBoundingClientRect();
    if (width === 0 || height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    cssSizeRef.current = { width, height };
    // setTransform, not scale(): repeated resizes must not compound the DPR factor.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  useMotionValueEvent(frameIndex, "change", (latest) => {
    const index = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(latest)));
    if (index !== currentFrameRef.current) scheduleDraw(index);
  });

  useEffect(() => {
    currentFrameRef.current = Math.min(
      FRAME_COUNT - 1,
      Math.max(0, Math.round(frameIndex.get())),
    );

    const images: HTMLImageElement[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        // Repaint as frames at or before the current position arrive, so the
        // visible frame sharpens progressively instead of popping in at the end.
        if (i <= currentFrameRef.current) scheduleDraw(currentFrameRef.current);
      };
      img.src = frameSrc(i);
      images.push(img);
    }
    imagesRef.current = images;

    return () => {
      for (const img of images) {
        img.onload = null;
        // Empty src aborts in-flight requests and lets decode buffers be collected.
        img.src = "";
      }
      imagesRef.current = [];
    };
  }, [frameIndex, scheduleDraw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    resizeCanvas();

    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(canvas);
    // ResizeObserver misses devicePixelRatio changes (browser zoom, dragging
    // between monitors) when the CSS box size stays the same.
    window.addEventListener("resize", resizeCanvas);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [resizeCanvas]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
      role="img"
      aria-label="Gundam head scroll animation"
    />
  );
}
