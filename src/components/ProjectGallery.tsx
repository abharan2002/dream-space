"use client";

import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "1967 Mustang Fastback",
    description: "Midnight Black. Full restoration. 427 Shelby engine.",
    category: "Classic American",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "992 Porsche 911 GT3",
    description: "Shark Blue. Manual transmission. Carbon bucket seats.",
    category: "Modern Performance",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Ducati Panigale V4R",
    description: "Competition livery. Titanium exhaust. Pure adrenaline.",
    category: "Two-Wheel Art",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1000"
  }
];

export default function ProjectGallery() {
  useEffect(() => {
    const cards = gsap.utils.toArray(".project-card");
    
    cards.forEach((card: unknown) => {
      const element = card as HTMLElement;
      gsap.fromTo(element, 
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }, []);

  return (
    <section id="collection" className="px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[90rem]">
        <div className="mb-20 flex flex-col gap-12 md:mb-24 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-6 block text-[10px] uppercase tracking-[0.5em] text-muted">02 — Collection Highlights</span>
            <h2 className="text-5xl leading-none md:text-7xl lg:text-8xl">
              Curated <span className="text-gradient">Assets</span>
            </h2>
          </div>
          <p className="max-w-md border-l border-foreground/15 pl-6 text-sm leading-relaxed text-muted">
            A meticulously maintained selection of automotive history. Rare, significant, and preserved to the highest standard.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {projects.map((project, index) => (
            <article
              key={index} 
              className="project-card group panel relative aspect-[3/4] overflow-hidden rounded-3xl"
            >
              <div className="absolute inset-0 z-0 transition-transform duration-[1.3s] ease-out group-hover:scale-105">
                <Image
                  src={project.image} 
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="h-full w-full object-cover opacity-65 grayscale-[30%] transition-all duration-1000 group-hover:grayscale-0 group-hover:opacity-100"
                />
              </div>

              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/45 to-black/5 opacity-80 transition-opacity duration-700 group-hover:opacity-95" />

              <div className="absolute bottom-0 left-0 z-20 flex h-full w-full flex-col justify-end p-8 md:p-10">
                <div className="translate-y-6 transform transition-transform duration-700 ease-out group-hover:translate-y-0">
                  <span className="mb-4 block text-[10px] uppercase tracking-[0.4em] text-foreground/70">{project.category}</span>
                  <h3 className="mb-4 text-3xl leading-tight md:text-4xl">{project.title}</h3>
                  <p className="text-sm leading-relaxed text-foreground/75 opacity-100 transition-opacity duration-700 delay-100 md:opacity-0 md:group-hover:opacity-100">
                    {project.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
