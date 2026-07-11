export type ExperienceItem = {
  period: string;
  role: string;
  org: string;
  summary: string;
  highlights: string[];
};

export const experience: ExperienceItem[] = [
  {
    period: "Jan 2026 — Present",
    role: "Co-Founder",
    org: "Shiktra Technologies",
    summary: "Co-founded CodeBud and lead its end-to-end development — technical execution and product direction.",
    highlights: [
      "Designed and developed the platform's core features and managed the full development lifecycle.",
      "Collaborated with stakeholders and mentored team members while keeping delivery on schedule.",
      "Drive strategic planning and product innovation across the initiative.",
    ],
  },
  {
    period: "Sep 2025 — Present",
    role: "Co-Founder",
    org: "Doqtra",
    summary: "Built and grew a freelance software agency delivering custom full-stack applications and modern websites.",
    highlights: [
      "Manage client relationships end to end, from first consultation to deployment.",
      "Scope technical solutions tailored to each client's needs and coordinate project execution.",
      "Balance functionality, performance, and user experience while meeting delivery timelines.",
    ],
  },
  {
    period: "Feb 2026 — May 2026",
    role: "Android Developer Intern",
    org: "MindMatrtix.io",
    summary: "Contributed to AI-powered Android applications on a remote development team.",
    highlights: [
      "Implemented features, integrated APIs, and debugged issues across the app.",
      "Optimized application performance for user-friendly mobile experiences.",
      "Gained hands-on experience combining Android development with AI integration.",
    ],
  },
];
