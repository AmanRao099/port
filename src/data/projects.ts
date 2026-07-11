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
    title: "Nyrosphere — Autonomous AI Robot",
    description:
      "A real-time multimodal AI robot with voice interaction, gesture recognition, and embedded hardware control — a FastAPI backend orchestrating VOSK, Piper, Ollama, MediaPipe, and ESP32 for speech, vision, and autonomous movement.",
    tags: ["FastAPI", "Ollama", "MediaPipe", "ESP32"],
    gradient: ["#00ff9f", "#00e5ff"],
    href: "https://github.com/AmanRao099/nyrosphere_main",
    metric: "Voice + vision + control, realtime",
  },
  {
    title: "ITourister — Travel Recommendation App",
    description:
      "A full-stack travel platform that delivers personalized destination suggestions from location data and user preferences, with Google Maps integration, realtime recommendations, and a scalable backend for trip planning.",
    tags: ["Google Maps", "Location Services", "Full-Stack", "Realtime"],
    gradient: ["#ff2975", "#00ff9f"],
    href: "https://github.com/AmanRao099/ITourister-Application",
    metric: "Personalized, location-aware picks",
  },
  {
    title: "GBDDoner — Restaurant Chain Platform",
    description:
      "A freelance-delivered full-stack website for a restaurant chain — modern responsive experience with Sanity CMS behind it, so the client updates menus, locations, and promotions without touching code.",
    tags: ["Sanity CMS", "Full-Stack", "Responsive UI", "Freelance"],
    gradient: ["#00e5ff", "#ff2975"],
    href: "https://gbddoner.com",
    metric: "100% client-editable content",
  },
  {
    title: "This Site — Retro Interactive Portfolio",
    description:
      "The page you're on: a retro-terminal portfolio with a WebGL scene, a 240-frame scroll-driven Gundam sequence on canvas, smooth scrolling, and a pixel companion with its own physics.",
    tags: ["React 19", "Three.js", "Framer Motion", "Canvas"],
    gradient: ["#00ff9f", "#ff2975"],
    href: "#top",
    metric: "240-frame scroll sequence",
  },
];
