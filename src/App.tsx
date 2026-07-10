import { useState } from "react";
import { LenisProvider } from "./hooks/lenis";
import { useIsMobile } from "./hooks/useIsMobile";
import { Loader } from "./components/ui/Loader";
import { Cursor } from "./components/ui/Cursor";
import { PixelPet } from "./components/ui/PixelPet";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Skills } from "./components/Skills";
import { Projects } from "./components/Projects";
import { Experience } from "./components/Experience";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

function App() {
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  return (
    <LenisProvider>
      {loading && <Loader onDone={() => setLoading(false)} />}
      <Cursor />

      {/* CRT overlay stack */}
      <div className="noise-layer" />
      <div className="scanlines" />
      <div className="crt-sweep" />
      <div className="crt-flicker" />
      <div className="glitch-tear" />
      <div className="vignette" />

      <Nav />
      <main>
        <Hero isMobile={isMobile} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <PixelPet />
    </LenisProvider>
  );
}

export default App;
