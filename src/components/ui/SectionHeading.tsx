import { motion } from "framer-motion";
import { GlitchText } from "./GlitchText";

export function SectionHeading({
  kicker,
  title,
  align = "left",
}: {
  kicker: string;
  title: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="font-pixel text-[9px] tracking-[0.2em] text-accent uppercase text-glow"
      >
        <span className="text-accent-2">//</span> {kicker}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.08 }}
        className="font-display mt-3 text-4xl font-normal tracking-wide text-paper uppercase sm:text-5xl md:text-6xl"
      >
        <GlitchText text={title} mode="hover" className="rgb-fringe" />
      </motion.h2>
    </div>
  );
}
