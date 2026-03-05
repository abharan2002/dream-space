"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const overlay = overlayRef.current;
    if (!wrapper || !overlay) return;

    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    timeline
      .set(overlay, { autoAlpha: 1, yPercent: 100 })
      .to(overlay, { yPercent: 0, duration: 0.24, ease: "power2.inOut" })
      .fromTo(wrapper, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.45 }, "-=0.04")
      .to(overlay, { yPercent: -100, duration: 0.35, ease: "power2.inOut" }, "+=0.02")
      .set(overlay, { autoAlpha: 0, yPercent: 100 });

    return () => {
      timeline.kill();
    };
  }, [pathname]);

  return (
    <div className="relative" ref={wrapperRef}>
      <div ref={overlayRef} className="pointer-events-none fixed inset-0 z-[120] bg-base" />
      {children}
    </div>
  );
}
