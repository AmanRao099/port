import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionHeading } from "./ui/SectionHeading";
import { experience } from "../data/experience";

export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 60%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="relative mx-auto max-w-6xl px-6 py-28 md:px-10 md:py-36">
      <SectionHeading kicker="Experience" title="Where I've built things that shipped." />

      <div ref={containerRef} className="relative mt-16">
        <div className="absolute top-0 bottom-0 left-[7px] w-px bg-line md:left-[9px]" />
        <motion.div
          style={{ height: lineHeight, boxShadow: "0 0 8px rgba(0,255,159,0.5)" }}
          className="absolute top-0 left-[7px] w-px bg-linear-to-b from-accent to-accent-3 md:left-[9px]"
        />

        <div className="space-y-14">
          {experience.map((item, i) => (
            <motion.div
              key={item.role + item.org}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="relative pl-10 md:pl-12"
            >
              <span className="absolute top-1.5 left-0 h-[15px] w-[15px] border-2 border-accent bg-ink md:h-[19px] md:w-[19px]" />

              <span className="font-pixel text-[8px] tracking-wider text-accent-3 uppercase">
                [{item.period}]
              </span>
              <h3 className="font-display mt-2 text-2xl tracking-wide text-paper uppercase md:text-3xl">
                {item.role} <span className="text-fog normal-case">@ {item.org}</span>
              </h3>
              <p className="mt-2 font-mono text-sm text-mist md:text-base">{item.summary}</p>

              <ul className="mt-4 space-y-2">
                {item.highlights.map((h) => (
                  <li key={h} className="flex gap-3 font-mono text-sm text-mist">
                    <span className="mt-0.5 shrink-0 text-accent-2">▸</span>
                    {h}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
