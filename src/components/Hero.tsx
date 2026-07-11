import { useRef } from "react";
import { motion } from "framer-motion";
import { HeroCanvas } from "./scene/HeroCanvas";
import { GundamScrollCanvas } from "./GundamScrollCanvas";
import { MagneticButton } from "./ui/MagneticButton";
import { GlitchText } from "./ui/GlitchText";
import { profile } from "../data/profile";
import { useScrollTo } from "../hooks/lenis";
import { useBlip } from "../hooks/useBlip";
import { useTypewriter } from "../hooks/useTypewriter";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Hero({ isMobile }: { isMobile: boolean }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const scrollTo = useScrollTo();
  const blip = useBlip();
  const { typed, done } = useTypewriter(profile.tagline, { delay: 1100, speed: 22 });

  return (
    <section ref={sectionRef} id="top" className="relative h-[280svh] w-full">
      <div className="sticky top-0 flex h-[100svh] min-h-[640px] w-full items-center overflow-hidden">
        <div className="absolute inset-0">
          <HeroCanvas isMobile={isMobile} />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[60svh] md:inset-y-0 md:left-auto md:right-0 md:h-auto md:w-1/2">
          <GundamScrollCanvas containerRef={sectionRef} className="mix-blend-screen" />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-ink/10 via-transparent to-ink" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.1}
            className="font-pixel text-[9px] tracking-[0.15em] text-accent uppercase text-glow"
          >
            <span className="text-fog">&gt;</span> {profile.role} <span className="text-accent-2">//</span>{" "}
            {profile.location} <span className="text-accent-3">[ONLINE]</span>
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.22}
            className="font-display mt-6 max-w-4xl text-[16vw] leading-[0.9] font-normal tracking-wide text-paper uppercase sm:text-7xl md:text-8xl lg:text-9xl"
          >
            Hi, I'm <GlitchText text={profile.name} className="text-gradient" />
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.36}
            className="mt-8 min-h-[3.5rem] max-w-xl font-mono text-sm leading-relaxed text-mist md:text-base"
          >
            {typed}
            <span className={`text-accent ${done ? "blink" : ""}`}>█</span>
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.5}
            className="mt-10 flex flex-wrap items-center gap-5"
          >
            <MagneticButton
              as="button"
              onMouseEnter={() => blip("hover")}
              onClick={() => {
                blip("tap");
                scrollTo("#projects");
              }}
              className="pixel-shadow cursor-pointer bg-accent px-7 py-3.5 font-pixel text-[9px] tracking-wider text-ink uppercase hover:bg-accent"
            >
              ▶ View my work
            </MagneticButton>
            <MagneticButton
              as="button"
              onMouseEnter={() => blip("hover")}
              onClick={() => {
                blip("tap");
                scrollTo("#contact");
              }}
              className="cursor-pointer border border-line px-7 py-3.5 font-pixel text-[9px] tracking-wider text-paper uppercase hover:border-accent-2 hover:text-accent-2"
            >
              Get in touch
            </MagneticButton>
          </motion.div>
        </div>

        <motion.button
          data-cursor-hover
          onClick={() => scrollTo("#about")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute bottom-9 left-1/2 z-10 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-2"
          aria-label="Scroll to about section"
        >
          <span className="font-pixel text-[8px] tracking-[0.2em] text-fog uppercase">Scroll</span>
          <span className="font-pixel text-[10px] text-accent blink">▼</span>
        </motion.button>
      </div>
    </section>
  );
}
