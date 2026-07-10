import { useEffect, useState } from "react";

export function useTypewriter(text: string, { delay = 0, speed = 28 }: { delay?: number; speed?: number } = {}) {
  const [length, setLength] = useState(0);

  useEffect(() => {
    setLength(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLength(text.length);
      return;
    }

    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setLength((l) => {
          if (l >= text.length) {
            clearInterval(interval);
            return l;
          }
          return l + 1;
        });
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, delay, speed]);

  return { typed: text.slice(0, length), done: length >= text.length };
}
