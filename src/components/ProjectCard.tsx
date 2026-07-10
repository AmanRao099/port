import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Project } from "../data/projects";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 });
  const glowX = useTransform(x, (v) => `${v * 100}%`);
  const glowY = useTransform(y, (v) => `${v * 100}%`);

  const onMouseMove = (e: MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const onMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: (index % 2) * 0.1 }}
      style={{ perspective: 1200 }}
    >
      <motion.div
        ref={ref}
        data-cursor-hover
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="term-window group relative overflow-hidden"
      >
        <div className="term-titlebar">
          <span className="term-dots"><i /><i /><i /></span>
          <span className="truncate">proc_{String(index + 1).padStart(2, "0")}.exe</span>
          <span className="shrink-0 text-accent">RUNNING</span>
        </div>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([gx, gy]) => `radial-gradient(320px circle at ${gx} ${gy}, ${project.gradient[0]}26, transparent 70%)`,
            ),
          }}
        />

        <div className="p-8">
          <div className="relative flex items-start justify-between gap-4">
            <span
              className="h-12 w-12 shrink-0"
              style={{
                background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`,
                boxShadow: `4px 4px 0 0 #020403, 4px 4px 0 1px ${project.gradient[0]}66`,
                imageRendering: "pixelated",
              }}
            />
            <span className="font-pixel text-[9px] text-accent-2">#{String(index + 1).padStart(2, "0")}</span>
          </div>

          <h3 className="font-display relative mt-6 text-3xl tracking-wide text-paper uppercase rgb-fringe">
            {project.title}
          </h3>
          <p className="relative mt-3 font-mono text-sm leading-relaxed text-mist">{project.description}</p>

          <div className="relative mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="border border-line px-3 py-1 font-mono text-[11px] text-fog">
                [{tag}]
              </span>
            ))}
          </div>

          <div className="relative mt-7 flex items-center justify-between border-t border-line pt-5">
            <span className="font-mono text-xs text-accent text-glow">▸ {project.metric}</span>
            <div className="flex items-center gap-4">
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="font-pixel text-[8px] tracking-wide text-mist uppercase hover:text-accent-3"
                >
                  [src]
                </a>
              )}
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="font-pixel text-[8px] tracking-wide text-paper uppercase underline decoration-accent-2/70 underline-offset-4 hover:text-accent-2"
              >
                [run]
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
