import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "./ui/SectionHeading";
import { MagneticButton } from "./ui/MagneticButton";
import { ContactForm } from "./ContactForm";
import { TetrisTransition } from "./ui/TetrisTransition";
import { profile } from "../data/profile";
import { useBlip } from "../hooks/useBlip";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [playing, setPlaying] = useState(false);
  const blip = useBlip();

  const letsTalk = () => {
    blip("tap");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShowForm(true);
      return;
    }
    setPlaying(true);
  };

  const copyEmail = async () => {
    blip("tap");
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className="relative mx-auto max-w-6xl px-6 py-28 md:px-10 md:py-40">
      <SectionHeading kicker="Contact" title="Let's build something worth shipping." align="center" />

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mx-auto mt-6 max-w-xl text-center font-mono text-sm text-mist md:text-base"
      >
        <span className="text-accent">$</span> ./contact --open-to full-stack-roles contract-work
        hard-problems
        <br />
        <span className="text-fog">Response time: within a day or two.</span>
      </motion.p>

      {showForm ? (
        <ContactForm />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 flex justify-center"
        >
          <MagneticButton
            as="button"
            onMouseEnter={() => blip("hover")}
            onClick={letsTalk}
            className="pixel-shadow cursor-pointer bg-accent-2 px-10 py-5 font-pixel text-[11px] tracking-wider text-ink uppercase hover:bg-accent-2"
          >
            ▶ Let's talk
          </MagneticButton>
        </motion.div>
      )}

      {playing && (
        <TetrisTransition
          onFilled={() => setShowForm(true)}
          onDone={() => setPlaying(false)}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-14 flex flex-col items-center gap-8"
      >
        <span className="font-pixel text-[8px] tracking-[0.2em] text-fog uppercase">
          or email directly
        </span>
        <MagneticButton
          as="button"
          onMouseEnter={() => blip("hover")}
          onClick={copyEmail}
          className="pixel-shadow cursor-pointer bg-accent px-8 py-4 font-pixel text-[10px] tracking-wide text-ink uppercase hover:bg-accent"
        >
          {copied ? "▓ Copied to clipboard ▓" : profile.email}
        </MagneticButton>

        <div className="flex items-center gap-6">
          {profile.socials.map((social) => (
            <a
              key={social.label}
              data-cursor-hover
              onMouseEnter={() => blip("hover")}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="font-pixel text-[9px] tracking-wider text-fog uppercase transition-colors hover:text-accent"
            >
              [{social.label}]
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
