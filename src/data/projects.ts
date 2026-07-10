export type Project = {
  title: string;
  description: string;
  tags: string[];
  gradient: [string, string];
  href: string;
  repo?: string;
  metric: string;
};

export const projects: Project[] = [
  {
    title: "Orbit — Realtime Ops Dashboard",
    description:
      "A multi-tenant analytics platform streaming millions of events per day into sub-second dashboards, built with Next.js, WebSockets, and a ClickHouse pipeline.",
    tags: ["Next.js", "TypeScript", "ClickHouse", "WebSockets"],
    gradient: ["#00ff9f", "#00e5ff"],
    href: "#",
    repo: "#",
    metric: "2.1M events/day",
  },
  {
    title: "Ledgerline — Payments Reconciliation",
    description:
      "A financial reconciliation engine that matches transactions across three payment providers with 99.99% accuracy, cutting manual review time by 80%.",
    tags: ["Node.js", "PostgreSQL", "AWS Lambda", "Stripe API"],
    gradient: ["#ff2975", "#00ff9f"],
    href: "#",
    repo: "#",
    metric: "80% faster reconciliation",
  },
  {
    title: "Fieldnote — Offline-first Mobile CMS",
    description:
      "A content platform for field teams working with unreliable connectivity — local-first sync engine, conflict resolution, and a lightweight admin console.",
    tags: ["React Native", "CRDT", "FastAPI", "Redis"],
    gradient: ["#00e5ff", "#ff2975"],
    href: "#",
    repo: "#",
    metric: "100% offline reliability",
  },
  {
    title: "Prism — Design System & Component Kit",
    description:
      "An internal design system shared across five product teams, with themeable primitives, accessibility baked in, and a Storybook-driven contribution workflow.",
    tags: ["React", "Radix", "Storybook", "Accessibility"],
    gradient: ["#00ff9f", "#ff2975"],
    href: "#",
    repo: "#",
    metric: "5 teams, 1 system",
  },
];
