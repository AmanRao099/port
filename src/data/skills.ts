export type Skill = { name: string; level: number };
export type SkillGroup = { title: string; blurb: string; skills: Skill[] };

export const skillGroups: SkillGroup[] = [
  {
    title: "Applied AI",
    blurb: "Intelligence wired into real products, not just notebooks.",
    skills: [
      { name: "AI Integration (Ollama / LLMs)", level: 90 },
      { name: "Computer Vision (MediaPipe)", level: 82 },
      { name: "Voice Interfaces (VOSK / Piper)", level: 84 },
      { name: "AI-powered Automation", level: 88 },
    ],
  },
  {
    title: "Frontend",
    blurb: "Interfaces that feel instant and hold up under real usage.",
    skills: [
      { name: "React / Next.js", level: 92 },
      { name: "TypeScript", level: 88 },
      { name: "React Native", level: 84 },
      { name: "HTML / CSS / Tailwind", level: 90 },
    ],
  },
  {
    title: "Backend",
    blurb: "APIs and services designed to be correct first, fast second.",
    skills: [
      { name: "Python / FastAPI", level: 91 },
      { name: "WebSockets & Realtime", level: 87 },
      { name: "Node.js / REST design", level: 85 },
      { name: "MongoDB / SQL", level: 86 },
    ],
  },
  {
    title: "Beyond the Stack",
    blurb: "The rest of what it takes to ship a real product.",
    skills: [
      { name: "Android Development", level: 78 },
      { name: "Embedded / ESP32", level: 74 },
      { name: "Client & Product Delivery", level: 89 },
      { name: "Team Leadership & Mentoring", level: 83 },
    ],
  },
];
