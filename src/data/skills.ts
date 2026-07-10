export type Skill = { name: string; level: number };
export type SkillGroup = { title: string; blurb: string; skills: Skill[] };

export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend",
    blurb: "Interfaces that feel instant and hold up under real usage.",
    skills: [
      { name: "React / Next.js", level: 95 },
      { name: "TypeScript", level: 92 },
      { name: "Three.js / WebGL", level: 78 },
      { name: "Tailwind / CSS Architecture", level: 90 },
    ],
  },
  {
    title: "Backend",
    blurb: "APIs and services designed to be correct first, fast second.",
    skills: [
      { name: "Node.js / Express / Nest", level: 93 },
      { name: "Python / FastAPI", level: 85 },
      { name: "PostgreSQL / Redis", level: 88 },
      { name: "GraphQL / REST design", level: 87 },
    ],
  },
  {
    title: "Cloud & DevOps",
    blurb: "Shipping pipelines and infra that don't page you at 3am.",
    skills: [
      { name: "AWS (ECS, Lambda, RDS)", level: 82 },
      { name: "Docker / Kubernetes", level: 80 },
      { name: "CI/CD (GitHub Actions)", level: 88 },
      { name: "Terraform", level: 70 },
    ],
  },
  {
    title: "Practices",
    blurb: "The habits that keep a codebase healthy after year one.",
    skills: [
      { name: "System Design", level: 89 },
      { name: "Testing & TDD", level: 84 },
      { name: "Performance Profiling", level: 86 },
      { name: "Technical Leadership", level: 81 },
    ],
  },
];
