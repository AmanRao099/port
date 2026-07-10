import { motion } from "framer-motion";
import { SectionHeading } from "./ui/SectionHeading";
import { skillGroups } from "../data/skills";

const BAR_SEGMENTS = 24;

function SegmentBar({ level, delay }: { level: number; delay: number }) {
  const filled = Math.round((level / 100) * BAR_SEGMENTS);
  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: BAR_SEGMENTS }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.05, delay: delay + i * 0.02 }}
          className={`h-3 flex-1 ${
            i < filled ? (i >= filled - 2 ? "bg-accent-2" : "bg-accent") : "bg-line"
          }`}
          style={i < filled && i < filled - 2 ? { boxShadow: "0 0 5px rgba(0,255,159,0.4)" } : undefined}
        />
      ))}
    </div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="relative mx-auto max-w-6xl px-6 py-28 md:px-10 md:py-36">
      <SectionHeading kicker="Skills" title="A full-stack toolkit, sharpened by use." />

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
        {skillGroups.map((group, gi) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: gi * 0.08 }}
            className="term-window group"
          >
            <div className="term-titlebar">
              <span className="term-dots"><i /><i /><i /></span>
              <span>{group.title}.sys</span>
              <span className="text-accent">[OK]</span>
            </div>

            <div className="p-7">
              <h3 className="font-display text-2xl tracking-wide text-paper uppercase">{group.title}</h3>
              <p className="mt-1 font-mono text-xs text-fog">{group.blurb}</p>

              <div className="mt-6 space-y-4">
                {group.skills.map((skill, si) => (
                  <div key={skill.name}>
                    <div className="mb-1.5 flex items-center justify-between font-mono">
                      <span className="text-sm text-mist">
                        <span className="text-fog">&gt;</span> {skill.name}
                      </span>
                      <span className="text-xs text-accent">{skill.level}%</span>
                    </div>
                    <SegmentBar level={skill.level} delay={0.1 + si * 0.12} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
