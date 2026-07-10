import { SectionHeading } from "./ui/SectionHeading";
import { ProjectCard } from "./ProjectCard";
import { projects } from "../data/projects";

export function Projects() {
  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-6 py-28 md:px-10 md:py-36">
      <SectionHeading kicker="Selected Work" title="Products I've taken from idea to production." />

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
