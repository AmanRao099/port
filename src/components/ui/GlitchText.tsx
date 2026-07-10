import type { ElementType, ReactNode } from "react";
import { createElement } from "react";

/**
 * Text with RGB-split glitch slices. `mode="always"` loops on an interval,
 * `mode="hover"` only glitches while hovered. Children must be a plain
 * string — the effect duplicates it into ::before/::after via data-text.
 */
export function GlitchText({
  as = "span",
  text,
  mode = "always",
  className = "",
}: {
  as?: ElementType;
  text: string;
  mode?: "always" | "hover";
  className?: string;
}) {
  return createElement(
    as,
    {
      "data-text": text,
      className: `${mode === "always" ? "glitch" : "glitch-hover"} ${className}`,
    },
    text as ReactNode,
  );
}
