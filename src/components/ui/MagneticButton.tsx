import {
  createElement,
  useRef,
  type ReactNode,
  type ElementType,
  type ComponentPropsWithoutRef,
  type MouseEvent,
} from "react";

type MagneticButtonProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function MagneticButton<T extends ElementType = "button">({
  as,
  children,
  className = "",
  ...rest
}: MagneticButtonProps<T>) {
  const ref = useRef<HTMLElement>(null);
  const Component = as ?? "button";

  const onMouseMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0px, 0px)";
  };

  return createElement(
    Component,
    {
      ref,
      "data-cursor-hover": true,
      onMouseMove,
      onMouseLeave,
      className: `inline-flex items-center justify-center transition-transform duration-200 ease-out ${className}`,
      ...rest,
    },
    children,
  );
}
