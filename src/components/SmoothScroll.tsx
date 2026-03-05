"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lenisRef = useRef<any>(null);

  const lenisOptions = useMemo(() => {
    if (typeof window === "undefined") {
      return {
        lerp: 0.065,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 0.75,
      };
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) {
      return {
        lerp: 0.05,
        duration: 1.5,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 0.68,
      };
    }

    return {
      lerp: 0.065,
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 0.75,
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      autoRaf={false}
      options={lenisOptions}
    >
      {children}
    </ReactLenis>
  );
}
