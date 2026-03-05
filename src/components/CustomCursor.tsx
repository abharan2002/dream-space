"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    const xMoveCursor = gsap.quickTo(cursor, "x", { duration: 0.6, ease: "power3.out" });
    const yMoveCursor = gsap.quickTo(cursor, "y", { duration: 0.6, ease: "power3.out" });

    const xMoveDot = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
    const yMoveDot = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });

    gsap.set([cursor, dot], { xPercent: -50, yPercent: -50 });

    const handleMouseMove = (e: MouseEvent) => {
      xMoveCursor(e.clientX);
      yMoveCursor(e.clientY);
      xMoveDot(e.clientX);
      yMoveDot(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive =
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button");

      if (interactive) {
        gsap.to(cursor, { width: 44, height: 44, backgroundColor: "rgba(245,242,234,0.95)", borderColor: "transparent", duration: 0.24 });
        gsap.to(dot, { width: 0, height: 0, duration: 0.22 });
      } else {
        gsap.to(cursor, { width: 24, height: 24, backgroundColor: "transparent", borderColor: "rgba(245,242,234,0.45)", duration: 0.24 });
        gsap.to(dot, { width: 4, height: 4, duration: 0.22 });
      }
    };

    gsap.set(cursor, { width: 24, height: 24, borderColor: "rgba(245,242,234,0.45)", backgroundColor: "transparent" });
    gsap.set(dot, { width: 4, height: 4, backgroundColor: "rgba(245,242,234,0.95)" });

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <div style={{ pointerEvents: "none", userSelect: "none" }} role="presentation" aria-hidden="true">
      <div
        ref={cursorRef}
        className="fixed left-0 top-0 z-[9999] hidden rounded-full border pointer-events-none mix-blend-difference md:block"
      />
      <div
        ref={dotRef}
        className="fixed left-0 top-0 z-[9999] hidden rounded-full pointer-events-none mix-blend-difference md:block"
      />
    </div>
  );
}
