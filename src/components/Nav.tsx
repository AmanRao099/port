import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useScrollTo } from "../hooks/lenis";
import { useBlip } from "../hooks/useBlip";
import { MagneticButton } from "./ui/MagneticButton";
import { GlitchText } from "./ui/GlitchText";

const links = [
  { label: "About", target: "#about" },
  { label: "Skills", target: "#skills" },
  { label: "Work", target: "#projects" },
  { label: "Experience", target: "#experience" },
  { label: "Contact", target: "#contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollTo = useScrollTo();
  const blip = useBlip();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNav = (target: string) => {
    blip("tap");
    setMenuOpen(false);
    scrollTo(target);
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
        scrolled ? "border-b border-line bg-ink/80 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
        <button
          data-cursor-hover
          onClick={() => handleNav("#top")}
          className="cursor-pointer font-pixel text-[11px] text-paper"
        >
          <GlitchText text="A.RAO" mode="hover" />
          <span className="ml-2 text-[8px] text-fog">v5.0</span>
        </button>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <button
              key={link.target}
              data-cursor-hover
              onMouseEnter={() => blip("hover")}
              onClick={() => handleNav(link.target)}
              className="cursor-pointer font-pixel text-[9px] text-mist uppercase transition-colors hover:text-accent"
            >
              <span className="text-fog">[</span>
              {link.label}
              <span className="text-fog">]</span>
            </button>
          ))}
        </nav>

        <MagneticButton
          as="button"
          onMouseEnter={() => blip("hover")}
          onClick={() => handleNav("#contact")}
          className="hidden cursor-pointer border border-accent/50 px-5 py-2 font-pixel text-[8px] tracking-wider text-accent uppercase hover:bg-accent/10 md:inline-flex"
        >
          Let's talk<span className="blink">_</span>
        </MagneticButton>

        <button
          data-cursor-hover
          className="relative z-[60] flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
          onClick={() => {
            blip("tap");
            setMenuOpen((v) => !v);
          }}
        >
          <span
            className={`h-px w-6 bg-accent transition-transform ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`h-px w-6 bg-accent transition-transform ${menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] as const }}
            className="fixed inset-0 top-0 flex flex-col justify-center bg-ink md:hidden"
          >
            <div className="flex flex-col px-8">
              {links.map((link, i) => (
                <motion.button
                  key={link.target}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.08 + i * 0.05 }}
                  onClick={() => handleNav(link.target)}
                  className="cursor-pointer border-b border-line/40 py-5 text-left font-pixel text-base text-mist uppercase last:border-none hover:text-accent"
                >
                  <span className="mr-3 text-[10px] text-accent-2">{String(i + 1).padStart(2, "0")}</span>
                  {link.label}
                </motion.button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
