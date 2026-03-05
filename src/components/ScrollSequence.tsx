"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SiteNav from "@/components/SiteNav";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_SOURCE_FRAMES = 192;

function framePathFromIndex(index: number, frameCount: number) {
  const ratio = frameCount <= 1 ? 0 : index / (frameCount - 1);
  const sourceFrame = Math.round(ratio * (TOTAL_SOURCE_FRAMES - 1)) + 1;
  return `/frames/frame_${sourceFrame.toString().padStart(4, "0")}.jpg`;
}

function detectFrameCount() {
  if (typeof window === "undefined") return 120;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return 1;
  if (window.innerWidth < 640) return 84;
  if (window.innerWidth < 1024) return 128;
  return 164;
}

function loadImage(imageUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = imageUrl;
  });
}

export default function ScrollSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const insightRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<Record<number, HTMLImageElement | null>>({});
  const loadingRef = useRef<Set<number>>(new Set());
  const currentFrameRef = useRef(0);
  const activePanelRef = useRef(0);
  const scrollRafRef = useRef<number | null>(null);
  const latestProgressRef = useRef(0);

  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activePanel, setActivePanel] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const frameCount = useMemo(() => detectFrameCount(), []);
  const hasFinePointer = useMemo(
    () => (typeof window !== "undefined" ? window.matchMedia("(pointer: fine)").matches : false),
    [],
  );
  const calculatedScrollDistance = frameCount <= 1 ? 1200 : hasFinePointer ? 5600 : 4600;
  const totalScrollDistance = isMounted ? calculatedScrollDistance : 4600;
  const insights = useMemo(
    () => [
      {
        title: "Sourcing Quality",
        body: "Each machine is selected through provenance, originality, and maintenance history.",
      },
      {
        title: "Mechanical Integrity",
        body: "Every acquisition receives deep service validation before entering the archive rotation.",
      },
      {
        title: "Driving Value",
        body: "Assets are exercised with controlled mileage to preserve condition and character.",
      },
    ],
    [],
  );
  const milestones = useMemo(
    () => [
      { label: "Curated", point: 0.12 },
      { label: "Preserved", point: 0.48 },
      { label: "Discover", point: 0.8 },
    ],
    [],
  );

  const CRITICAL_PRELOAD = 14;
  const AHEAD_PRELOAD = hasFinePointer ? 12 : 8;
  const BEHIND_PRELOAD = hasFinePointer ? 7 : 5;
  const CACHE_WINDOW = hasFinePointer ? 52 : 34;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    let isMounted = true;

    const render = () => {
      let image = imagesRef.current[currentFrameRef.current];
      if (!image) {
        for (let offset = 1; offset < 10 && !image; offset += 1) {
          image =
            imagesRef.current[currentFrameRef.current - offset] ??
            imagesRef.current[currentFrameRef.current + offset] ??
            null;
        }
      }
      if (!image || !isMounted) return;

      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth * dpr;
      const height = window.innerHeight * dpr;
      const hRatio = width / image.width;
      const vRatio = height / image.height;
      const ratio = Math.max(hRatio, vRatio);
      const x = (width - image.width * ratio) / 2;
      const y = (height - image.height * ratio) / 2;

      context.clearRect(0, 0, width, height);
      context.drawImage(image, 0, 0, image.width, image.height, x, y, image.width * ratio, image.height * ratio);
    };

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      render();
    };

    const ensureFrameLoaded = async (index: number) => {
      if (index < 0 || index >= frameCount) return;
      if (imagesRef.current[index] !== undefined || loadingRef.current.has(index)) return;

      loadingRef.current.add(index);
      try {
        const image = await loadImage(framePathFromIndex(index, frameCount));
        imagesRef.current[index] = image;

        if (index === currentFrameRef.current) {
          requestAnimationFrame(render);
        }
      } catch {
        imagesRef.current[index] = null;
      } finally {
        loadingRef.current.delete(index);
      }
    };

    const trimCache = (centerFrame: number) => {
      const keepStart = Math.max(0, centerFrame - CACHE_WINDOW);
      const keepEnd = Math.min(frameCount - 1, centerFrame + CACHE_WINDOW);

      Object.keys(imagesRef.current).forEach((key) => {
        const frameIndex = Number(key);
        const isPinned = frameIndex === 0 || frameIndex === frameCount - 1;
        if (!isPinned && (frameIndex < keepStart || frameIndex > keepEnd)) {
          delete imagesRef.current[frameIndex];
        }
      });
    };

    const queueNearbyFrames = (centerFrame: number) => {
      const tasks: Promise<void>[] = [];

      for (let offset = 0; offset <= AHEAD_PRELOAD; offset += 1) {
        tasks.push(ensureFrameLoaded(centerFrame + offset));
      }
      for (let offset = 1; offset <= BEHIND_PRELOAD; offset += 1) {
        tasks.push(ensureFrameLoaded(centerFrame - offset));
      }

      void Promise.all(tasks);
      trimCache(centerFrame);
    };

    const preload = async () => {
      const firstBatch = Math.min(CRITICAL_PRELOAD, frameCount);
      let loadedCount = 0;

      await Promise.all(
        Array.from({ length: firstBatch }, (_, i) =>
          ensureFrameLoaded(i).finally(() => {
            loadedCount += 1;
            setProgress(Math.floor((loadedCount / firstBatch) * 100));
          }),
        ),
      );

      if (!isMounted) return;

      setIsLoaded(true);
      render();
      queueNearbyFrames(currentFrameRef.current);
    };

    resizeCanvas();
    void preload();

    const onResize = () => resizeCanvas();
    window.addEventListener("resize", onResize);

    const sequenceTrigger = ScrollTrigger.create({
      id: "scroll-sequence",
      trigger: containerRef.current,
      start: "top top",
      end: `+=${totalScrollDistance}`,
      scrub: frameCount <= 1 ? false : hasFinePointer ? 0.62 : 0.5,
      onUpdate: ({ progress: sequenceProgress }) => {
        if (frameCount > 1) {
          const targetFrame = Math.min(frameCount - 1, Math.floor(sequenceProgress * (frameCount - 1)));
          if (targetFrame !== currentFrameRef.current) {
            currentFrameRef.current = targetFrame;
            queueNearbyFrames(targetFrame);
            requestAnimationFrame(render);
          }
        }

        latestProgressRef.current = sequenceProgress;
        if (!scrollRafRef.current) {
          scrollRafRef.current = window.requestAnimationFrame(() => {
            setScrollProgress(latestProgressRef.current);
            scrollRafRef.current = null;
          });
        }

        const nextPanel = Math.min(insights.length - 1, Math.floor(sequenceProgress * insights.length));
        if (nextPanel !== activePanelRef.current) {
          activePanelRef.current = nextPanel;
          setActivePanel(nextPanel);
        }
      },
    });

    const textBlocks = gsap.utils.toArray<HTMLElement>(".floating-text", containerRef.current);
    textBlocks.forEach((block) => {
      const lines = block.querySelectorAll<HTMLElement>(".line-reveal");

      gsap.fromTo(
        block,
        { autoAlpha: 0, y: 54, scale: 0.96, filter: "blur(10px)" },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          ease: "power3.out",
          scrollTrigger: {
            trigger: block,
            start: "top 85%",
            end: "top 42%",
            scrub: 1,
          },
        },
      );

      gsap.to(block, {
        autoAlpha: 0,
        y: -48,
        scale: 0.985,
        filter: "blur(7px)",
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: block,
          start: "top 6%",
          end: "top -26%",
          scrub: 1,
        },
      });

      gsap.fromTo(
        lines,
        { yPercent: 120, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: block,
            start: "top 82%",
            end: "top 50%",
            scrub: 0.65,
          },
        },
      );
    });

    gsap.fromTo(
      insightRef.current,
      { autoAlpha: 0, y: 12 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        delay: 0.8,
      },
    );

    const onPointerMove = (event: PointerEvent) => {
      const xPercent = (event.clientX / window.innerWidth - 0.5) * 12;
      const yPercent = (event.clientY / window.innerHeight - 0.5) * 12;
      gsap.to(".floating-panel", {
        xPercent,
        yPercent,
        duration: 0.8,
        overwrite: "auto",
        ease: "power2.out",
      });
    };

    if (hasFinePointer) {
      window.addEventListener("pointermove", onPointerMove);
    }

    return () => {
      isMounted = false;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      if (scrollRafRef.current) {
        window.cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
      sequenceTrigger.kill();
    };
  }, [AHEAD_PRELOAD, BEHIND_PRELOAD, CACHE_WINDOW, CRITICAL_PRELOAD, frameCount, hasFinePointer, insights, milestones, totalScrollDistance]);

  useEffect(() => {
    if (!insightRef.current) return;
    gsap.fromTo(insightRef.current, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" });
  }, [activePanel]);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: `${totalScrollDistance}px` }}>
      <div className="grain-overlay sticky top-0 h-screen w-full overflow-hidden bg-base">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-cover will-change-transform" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/75" />

        <header className="absolute left-0 top-0 z-50 flex w-full items-start justify-between p-6 md:p-10 lg:p-12">
          <div>
            <p className="font-serif text-2xl tracking-[0.25em] text-foreground/95 md:text-3xl">DreamSpace</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.45em] text-muted">Private Automotive Archive</p>
          </div>
          <SiteNav
            connectHref="#connect"
            links={[
              { label: "Archive", href: "/archive" },
              { label: "Collection", href: "/collection" },
            ]}
          />
        </header>

        <div
          className={`absolute inset-0 z-[90] flex flex-col items-center justify-center bg-base transition-opacity duration-700 ${
            isLoaded ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <p className="mb-8 text-[11px] uppercase tracking-[0.55em] text-muted">Preparing visual stream</p>
          <p className="font-serif text-7xl tracking-tight text-foreground md:text-8xl">{progress.toString().padStart(3, "0")}</p>
          <div className="mt-8 h-px w-44 bg-foreground/20">
            <div className="h-full bg-highlight transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <aside
          ref={insightRef}
          className="panel panel-strong pointer-events-none absolute bottom-6 left-1/2 z-20 w-[calc(100%-3rem)] max-w-sm -translate-x-1/2 rounded-2xl p-5 md:bottom-8 md:left-6 md:translate-x-0"
        >
          <p className="mb-2 text-[10px] uppercase tracking-[0.45em] text-muted">Live insight</p>
          <p className="font-serif text-2xl leading-tight text-foreground">{insights[activePanel]?.title}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{insights[activePanel]?.body}</p>
        </aside>

        <aside className="panel panel-strong pointer-events-none absolute right-6 top-1/2 z-20 hidden w-36 -translate-y-1/2 rounded-2xl p-4 md:block">
          <p className="mb-4 text-[10px] uppercase tracking-[0.45em] text-muted">Progress</p>
          <div className="relative ml-1 h-44 w-px bg-foreground/20">
            <div className="absolute left-0 top-0 w-px bg-highlight transition-all duration-150" style={{ height: `${Math.max(4, scrollProgress * 176)}px` }} />
            {milestones.map((milestone) => (
              <div key={milestone.label} className="absolute -left-1" style={{ top: `${milestone.point * 176}px` }}>
                <div className={`h-[7px] w-[7px] rounded-full border ${scrollProgress >= milestone.point ? "border-highlight bg-highlight" : "border-foreground/45 bg-base"}`} />
                <p className={`absolute left-4 top-[-5px] text-[9px] uppercase tracking-[0.25em] ${scrollProgress >= milestone.point ? "text-foreground" : "text-muted"}`}>
                  {milestone.label}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="pointer-events-none absolute left-0 top-0 flex w-full flex-col justify-between pt-[100vh] pb-[50vh]" style={{ height: `${totalScrollDistance}px` }}>
        <section className="floating-text w-full px-6 opacity-0 md:px-20">
          <div className="floating-panel panel panel-strong max-w-xl rounded-2xl p-7 md:p-10">
            <p className="mb-3 text-[10px] uppercase tracking-[0.45em] text-muted">01 — Curated Machines</p>
            <h2 className="text-5xl leading-[0.95] md:text-7xl">
              <span className="block overflow-hidden"><span className="line-reveal block">Engineered</span></span>
              <span className="block overflow-hidden"><span className="line-reveal block">Legacy.</span></span>
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted md:text-base">
              Every acquisition enters through provenance checks, mechanical audit, and historical relevance.
            </p>
          </div>
        </section>

        <section className="floating-text w-full px-6 opacity-0 md:px-20">
          <div className="floating-panel panel panel-strong ml-auto max-w-xl rounded-2xl p-7 text-right md:p-10">
            <p className="mb-3 text-[10px] uppercase tracking-[0.45em] text-muted">02 — Preserved Condition</p>
            <h2 className="text-5xl leading-[0.95] md:text-7xl">
              <span className="block overflow-hidden"><span className="line-reveal block">Driven, Not</span></span>
              <span className="block overflow-hidden"><span className="line-reveal block">Displayed.</span></span>
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted md:text-base">
              Controlled mileage and factory-spec care keep each vehicle true to the experience it was built to deliver.
            </p>
          </div>
        </section>

        <section className="floating-text flex w-full flex-col items-center px-6 text-center opacity-0 md:px-20">
          <p className="mb-4 text-[10px] uppercase tracking-[0.55em] text-muted">03 — Discover</p>
          <h2 className="text-5xl leading-none md:text-7xl">
            <span className="block overflow-hidden"><span className="line-reveal block">Explore the</span></span>
            <span className="block overflow-hidden"><span className="line-reveal block text-gradient">Archive</span></span>
          </h2>
          <Link
            href="/archive"
            className="pointer-events-auto mt-9 rounded-full border border-foreground/20 bg-black/25 px-10 py-4 text-[11px] uppercase tracking-[0.38em] text-foreground hover:border-highlight/80 hover:text-highlight"
          >
            Enter Collection
          </Link>
        </section>
      </div>
    </div>
  );
}
