export type ExperienceItem = {
  period: string;
  role: string;
  org: string;
  summary: string;
  highlights: string[];
};

export const experience: ExperienceItem[] = [
  {
    period: "2023 — Present",
    role: "Senior Full-Stack Engineer",
    org: "Northwind Labs",
    summary: "Leading a small team building the core product platform end to end.",
    highlights: [
      "Re-architected the API layer, cutting p95 latency from 480ms to 110ms.",
      "Introduced a CI/CD pipeline that reduced deploy time from 25 min to 4 min.",
      "Mentored three engineers from mid-level to senior.",
    ],
  },
  {
    period: "2021 — 2023",
    role: "Full-Stack Engineer",
    org: "Cascade Systems",
    summary: "Owned the customer-facing dashboard and its supporting services.",
    highlights: [
      "Built a realtime notification system handling 500K+ daily messages.",
      "Migrated legacy REST endpoints to a typed GraphQL layer.",
      "Drove adoption of automated testing, raising coverage from 34% to 82%.",
    ],
  },
  {
    period: "2019 — 2021",
    role: "Software Engineer",
    org: "Fieldstone Digital",
    summary: "Full-stack contributor on a fast-moving product team.",
    highlights: [
      "Shipped the first version of the company's mobile-first admin console.",
      "Optimized the checkout flow, lifting conversion by 14%.",
    ],
  },
];
