import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { resume } from "../../data/resume";
import { profile } from "../../data/profile";
import { useBlip } from "../../hooks/useBlip";
import { useLenis } from "../../hooks/lenis";

// Command-panel viewer for the resume. The PixelPet courier opens it by
// dispatching pet:resume-open; the panel replays the document as terminal
// output line by line instead of popping the raw PDF.
const REVEAL_MS = 26;

type Row = ReactNode;

function buildRows(): Row[] {
  const rows: Row[] = [];
  const push = (el: ReactNode) => rows.push(el);

  const header = (label: string) => {
    push(
      <span className="res-term-section text-accent">
        <span className="text-fog">──</span> {label}{" "}
        <span className="text-fog">{"─".repeat(Math.max(4, 28 - label.length))}</span>
      </span>,
    );
  };
  const blank = () => push(<span>&nbsp;</span>);

  push(
    <span className="text-paper">
      <span className="text-fog">pet@aman-os:~$</span> open resume.pdf{" "}
      <span className="text-fog">--style=panel</span>
    </span>,
  );
  push(<span className="text-mist">decrypting document stream ....... OK</span>);
  push(<span className="text-mist">rendering ansi layout ............ OK</span>);
  blank();

  push(<span className="res-term-name text-glow">{resume.name}</span>);
  push(<span className="text-accent-3">{resume.role}</span>);
  push(<span className="text-fog">{resume.contacts.join("  ·  ")}</span>);
  blank();

  header("EXECUTIVE SUMMARY");
  push(<span className="res-term-p text-mist">{resume.summary}</span>);
  blank();

  header("EXPERIENCE");
  resume.experience.forEach((e) => {
    push(
      <span className="res-term-entry">
        <span className="text-paper">
          <span className="text-accent">▸</span> {e.org} <span className="text-fog">—</span>{" "}
          {e.role}
        </span>
        <span className="res-term-meta text-fog">
          {e.period} · {e.place}
        </span>
      </span>,
    );
    push(<span className="res-term-p res-term-indent text-mist">{e.desc}</span>);
  });
  blank();

  header("EDUCATION");
  resume.education.forEach((e) => {
    push(
      <span className="res-term-entry">
        <span className="text-paper">
          <span className="text-accent">▸</span> {e.school} <span className="text-fog">—</span>{" "}
          {e.degree}
        </span>
        <span className="res-term-meta text-fog">
          {e.period} · {e.place}
        </span>
      </span>,
    );
  });
  blank();

  header("SKILLS");
  push(
    <span className="res-term-chips">
      {resume.skills.map((s) => (
        <span key={s} className="res-term-chip">
          {s}
        </span>
      ))}
    </span>,
  );
  blank();

  header("PROJECTS");
  resume.projects.forEach((p) => {
    push(
      <span className="res-term-entry">
        <span className="text-paper">
          <span className="text-accent">▸</span> {p.name}
        </span>
        <span className="res-term-meta text-fog">{p.sub}</span>
      </span>,
    );
    push(<span className="res-term-p res-term-indent text-mist">{p.desc}</span>);
  });
  blank();

  header("LANGUAGES");
  push(<span className="text-mist">{resume.languages.join(" · ")}</span>);

  return rows;
}

export function ResumeTerminal() {
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef(false);
  const blip = useBlip();
  const lenis = useLenis();

  const rows = useMemo(buildRows, []);
  const done = revealed >= rows.length;

  const close = () => {
    blip("tap");
    setOpen(false);
  };

  useEffect(() => {
    const onOpen = () => {
      skipRef.current = false;
      setRevealed(0);
      setOpen(true);
    };
    window.addEventListener("pet:resume-open", onOpen);
    return () => window.removeEventListener("pet:resume-open", onOpen);
  }, []);

  // replay the document line by line, tailing the output like a real
  // terminal, then ease back to the top so reading starts at the header
  useEffect(() => {
    if (!open) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      if (skipRef.current) return; // fast-forwarded by a click
      const n = Math.min(rows.length, Math.floor((now - start) / REVEAL_MS) + 1);
      setRevealed(n);
      const body = bodyRef.current;
      if (body) body.scrollTop = body.scrollHeight;
      if (n < rows.length) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => {
          bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        }, 350);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, rows.length]);

  // freeze the page behind the panel and take the keyboard
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
      lenis?.start();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, lenis]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="res-term-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            ref={panelRef}
            className="res-term-panel term-window brackets"
            role="dialog"
            aria-modal="true"
            aria-label="Resume — command panel"
            tabIndex={-1}
            initial={{ scaleY: 0.02, scaleX: 0.7, opacity: 0.6 }}
            animate={{ scaleY: 1, scaleX: 1, opacity: 1 }}
            exit={{ scaleY: 0.02, scaleX: 0.4, opacity: 0 }}
            transition={{
              scaleY: { duration: 0.24, ease: [0.83, 0, 0.17, 1] as const },
              scaleX: { duration: 0.16, delay: 0.1, ease: [0.83, 0, 0.17, 1] as const },
              opacity: { duration: 0.12 },
            }}
            onClick={() => {
              // impatient reader: any click fast-forwards the replay
              if (!done) {
                skipRef.current = true;
                setRevealed(rows.length);
                bodyRef.current?.scrollTo({ top: 0 });
              }
            }}
          >
            <div className="term-titlebar">
              <span className="term-dots">
                <i />
                <i />
                <i />
              </span>
              <span>courier.exe — resume.pdf</span>
              <button
                type="button"
                className="res-term-close"
                data-cursor-hover
                onClick={close}
                aria-label="Close resume panel"
              >
                ✕
              </button>
            </div>

            <div ref={bodyRef} className="res-term-body" data-lenis-prevent>
              {rows.slice(0, revealed).map((row, i) => (
                <div key={i} className="res-term-line">
                  {row}
                </div>
              ))}
              <div className="res-term-line text-accent">
                <span className="text-fog">&gt;</span> {done ? "eof " : ""}
                <span className="blink">█</span>
              </div>
            </div>

            <div className="res-term-footer">
              <a
                href={profile.resumeHref}
                download="AmanRaoM-resume.pdf"
                data-cursor-hover
                className="res-term-action"
                onClick={() => blip("tap")}
              >
                [↓] download .pdf
              </a>
              <span className="font-pixel text-[8px] tracking-[0.2em] text-fog uppercase">
                esc to close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
