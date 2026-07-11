import { useState } from "react";
import { motion } from "framer-motion";
import { TetrisBuild } from "./ui/TetrisBuild";
import { profile } from "../data/profile";
import { useBlip } from "../hooks/useBlip";

type Status = "idle" | "sending" | "sent" | "error";

const STATUS_LINE: Record<Status, string> = {
  idle: "> awaiting input _",
  sending: "> transmitting packet...",
  sent: "▓ message sent — expect a reply within a day or two ▓",
  error: "! transmission failed — try again or use the email below",
};

const inputClasses =
  "w-full border border-line bg-transparent px-4 py-3 font-mono text-sm text-paper placeholder:text-fog/60 outline-none transition-colors focus:border-accent";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  // build-in starts covered unless the user prefers reduced motion
  const [covered, setCovered] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [building, setBuilding] = useState(covered);
  const blip = useBlip();

  const onSubmit = async (form: HTMLFormElement) => {
    if (status === "sending") return;
    const data = new FormData(form);
    if (data.get("_honey")) return; // bot filled the hidden trap field

    setStatus("sending");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${profile.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          _subject: `Portfolio contact from ${data.get("name")}`,
          _template: "table",
          _captcha: "false",
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      blip("tap");
      setStatus("sent");
      window.setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="term-window relative mx-auto mt-12 w-full max-w-2xl overflow-hidden"
    >
      {building && (
        <TetrisBuild
          delay={500}
          onFilled={() => setCovered(false)}
          onDone={() => setBuilding(false)}
        />
      )}

      <div className={covered ? "invisible" : undefined}>
      <div className="term-titlebar">
        <span className="term-dots"><i /><i /><i /></span>
        <span className="truncate">send_message.exe</span>
        <span className="shrink-0 text-accent">SMTP</span>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void onSubmit(e.currentTarget);
        }}
        className="p-6 md:p-8"
      >
        <input
          type="text"
          name="_honey"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block font-pixel text-[8px] tracking-[0.2em] text-fog uppercase">
              Name
            </span>
            <input
              type="text"
              name="name"
              required
              maxLength={120}
              placeholder="Ada Lovelace"
              className={inputClasses}
            />
          </label>
          <label className="block">
            <span className="mb-2 block font-pixel text-[8px] tracking-[0.2em] text-fog uppercase">
              Email
            </span>
            <input
              type="email"
              name="email"
              required
              maxLength={200}
              placeholder="you@domain.com"
              className={inputClasses}
            />
          </label>
        </div>

        <label className="mt-5 block">
          <span className="mb-2 block font-pixel text-[8px] tracking-[0.2em] text-fog uppercase">
            Message
          </span>
          <textarea
            name="message"
            required
            maxLength={4000}
            rows={5}
            placeholder="What are we building?"
            className={`${inputClasses} resize-y`}
          />
        </label>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <span
            className={`font-mono text-xs ${
              status === "sent"
                ? "text-accent"
                : status === "error"
                  ? "text-accent-3"
                  : "text-fog"
            }`}
            aria-live="polite"
          >
            {STATUS_LINE[status]}
          </span>
          <button
            type="submit"
            disabled={status === "sending"}
            data-cursor-hover
            onMouseEnter={() => blip("hover")}
            className="pixel-shadow cursor-pointer bg-accent px-7 py-3.5 font-pixel text-[9px] tracking-wider text-ink uppercase disabled:cursor-wait disabled:opacity-60"
          >
            {status === "sending" ? "Sending..." : "▶ Send message"}
          </button>
        </div>
      </form>
      </div>
    </motion.div>
  );
}
