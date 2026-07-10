import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SEGMENTS = 20;

const BOOT_LINES = [
  "AMAN.RAO BIOS v5.0 — PHOSPHOR EDITION",
  "MEMORY CHECK ............... 640K OK",
  "MOUNTING /dev/portfolio ......... OK",
  "LOADING SHADERS [three.js] ...... OK",
  "CALIBRATING CRT BEAM ............ OK",
  "INJECTING GLITCH DAEMON ..... ARMED",
];

export function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [lines, setLines] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const duration = 1900;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      setLines(Math.min(BOOT_LINES.length, Math.floor((elapsed / duration) * (BOOT_LINES.length + 1))));
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setVisible(false), 350);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const filled = Math.round((progress / 100) * SEGMENTS);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
          exit={{ scaleY: 0.004, scaleX: 0, opacity: 0 }}
          transition={{
            scaleY: { duration: 0.22, ease: [0.83, 0, 0.17, 1] as const },
            scaleX: { duration: 0.18, delay: 0.2, ease: [0.83, 0, 0.17, 1] as const },
            opacity: { duration: 0.1, delay: 0.34 },
          }}
          style={{ transformOrigin: "50% 50%" }}
        >
          <div className="w-[min(90vw,480px)]">
            <div className="term-window brackets">
              <div className="term-titlebar">
                <span className="term-dots"><i /><i /><i /></span>
                <span>boot.log</span>
                <span className="text-accent">{progress}%</span>
              </div>

              <div className="flex flex-col gap-1.5 p-5 font-mono text-[11px] leading-relaxed tracking-wide md:text-xs">
                {BOOT_LINES.slice(0, lines).map((line, i) => (
                  <span key={line} className={i === BOOT_LINES.length - 1 ? "text-accent-2" : "text-mist"}>
                    <span className="text-fog">&gt;</span> {line}
                  </span>
                ))}
                <span className="text-accent">
                  <span className="text-fog">&gt;</span> _<span className="blink">█</span>
                </span>
              </div>

              <div className="flex items-center gap-3 border-t border-line px-5 py-4">
                <div className="flex flex-1 gap-[3px]">
                  {Array.from({ length: SEGMENTS }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-3.5 flex-1 ${i < filled ? "bg-accent" : "bg-line"}`}
                      style={i < filled ? { boxShadow: "0 0 6px rgba(0,255,159,0.5)" } : undefined}
                    />
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-4 text-center font-pixel text-[8px] tracking-[0.25em] text-fog uppercase">
              {progress < 100 ? "Booting system" : "Signal locked"}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
