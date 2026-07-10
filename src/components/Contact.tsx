import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "./ui/SectionHeading";
import { MagneticButton } from "./ui/MagneticButton";
import { profile } from "../data/profile";
import { useBlip } from "../hooks/useBlip";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const blip = useBlip();

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

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-12 flex flex-col items-center gap-8"
      >
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
