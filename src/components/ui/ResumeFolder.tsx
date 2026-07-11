import { useEffect, useRef, useState } from "react";
import { useBlip } from "../../hooks/useBlip";

// Desktop-style folder that dispatches a fetch errand to the PixelPet:
// pet:fetch-resume (out, with document coords) → pet:resume-picked when the
// pet grabs the paper → pet:resume-done when delivered, cancelled or expired.
type FolderState = "idle" | "waiting" | "empty";

export function ResumeFolder() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [state, setState] = useState<FolderState>("idle");
  const blip = useBlip();

  useEffect(() => {
    const onPicked = () => setState("empty");
    const onDone = () => {
      if (timer.current) clearTimeout(timer.current);
      setState("idle");
    };
    window.addEventListener("pet:resume-picked", onPicked);
    window.addEventListener("pet:resume-done", onDone);
    return () => {
      window.removeEventListener("pet:resume-picked", onPicked);
      window.removeEventListener("pet:resume-done", onDone);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const onClick = () => {
    if (state !== "idle") return;
    const el = btnRef.current;
    if (!el) return;
    blip("tap");
    setState("waiting");
    const r = el.getBoundingClientRect();
    window.dispatchEvent(
      new CustomEvent("pet:fetch-resume", {
        detail: {
          x: r.left + r.width / 2 + window.scrollX,
          y: r.top + r.height / 2 + window.scrollY,
        },
      }),
    );
    // safety: never leave the folder stuck if the courier bails
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 30000);
  };

  return (
    <button
      ref={btnRef}
      type="button"
      data-cursor-hover
      onClick={onClick}
      onMouseEnter={() => blip("hover")}
      className={`res-folder ${state !== "idle" ? `res-folder--${state}` : ""}`}
      aria-label="Resume folder — click it and the pixel companion fetches the file"
      title="resume/"
    >
      <span className="res-folder-icon">
        <span className="res-folder-paper" />
      </span>
      <span className="font-pixel text-[8px] tracking-[0.2em] text-fog uppercase">
        {state === "empty" ? "resume (out)" : "resume"}
      </span>
    </button>
  );
}
