import { profile } from "../data/profile";

export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-8 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 font-mono text-xs text-fog md:flex-row">
        <span>
          © {new Date().getFullYear()} {profile.name} <span className="text-accent-2">//</span> all rights
          reserved
        </span>
        <span className="font-pixel text-[8px] tracking-wider uppercase">
          ▓▒░ signal terminated ░▒▓
        </span>
        <span>react + three.js + framer motion</span>
      </div>
    </footer>
  );
}
