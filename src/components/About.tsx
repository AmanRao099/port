import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { SectionHeading } from "./ui/SectionHeading";
import { ResumeFolder } from "./ui/ResumeFolder";
import { profile } from "../data/profile";

function StatCard({ value, suffix, label, index }: { value: number; suffix: string; label: string; index: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.6,
      delay: 0.2 + index * 0.08,
      ease: [0.16, 1, 0.3, 1] as const,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toString();
      },
    });
    return () => controls.stop();
  }, [motionValue, value, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="term-window p-6"
    >
      <div className="font-display text-5xl text-accent text-glow">
        <span ref={ref}>0</span>
        {suffix}
      </div>
      <p className="mt-2 font-mono text-xs leading-relaxed text-fog">{label}</p>
    </motion.div>
  );
}

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 py-28 md:px-10 md:py-36">
      <SectionHeading kicker="About" title="Engineering with both ends in mind." />

      <ResumeFolder />

      <div className="mt-14 grid grid-cols-1 gap-16 md:grid-cols-5">
        <div className="md:col-span-3">
          <div className="term-window brackets">
            <div className="term-titlebar">
              <span className="term-dots"><i /><i /><i /></span>
              <span>cat about.txt</span>
              <span className="text-fog">~/aman</span>
            </div>
            <div className="p-7">
              {profile.bio.map((paragraph, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  className="mb-5 font-mono text-sm leading-relaxed text-mist last:mb-0 md:text-base"
                >
                  <span className="mr-2 text-accent-2">&gt;</span>
                  {paragraph}
                </motion.p>
              ))}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-5 font-mono text-sm text-accent"
              >
                <span className="text-fog">$</span> <span className="blink">█</span>
              </motion.p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:col-span-2">
          {profile.stats.map((stat, i) => (
            <StatCard key={stat.label} index={i} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
