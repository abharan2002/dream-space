"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type NavLink = {
  label: string;
  href: string;
};

export default function SiteNav({
  links,
  connectHref,
}: {
  links: NavLink[];
  connectHref: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav className="panel panel-strong flex items-center gap-6 rounded-full px-5 py-2 text-[10px] uppercase tracking-[0.3em] text-muted max-md:hidden md:gap-10 md:px-8 md:py-3 md:tracking-[0.35em]">
        {links.map((link) => (
          <Link key={link.label} href={link.href} className="hover:text-foreground">
            {link.label}
          </Link>
        ))}
        <Link href={connectHref} className="hover:text-foreground">
          Connect
        </Link>
      </nav>

      <button
        type="button"
        aria-label="Toggle navigation menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="panel panel-strong flex h-11 w-11 items-center justify-center rounded-full text-foreground md:hidden"
      >
        <span className="sr-only">Menu</span>
        <div className="flex w-5 flex-col gap-1.5">
          <span className={`h-px bg-current transition-all ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`h-px bg-current transition-all ${open ? "opacity-0" : "opacity-100"}`} />
          <span className={`h-px bg-current transition-all ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </div>
      </button>

      <div
        className={`fixed inset-0 z-[140] bg-black/65 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      >
        <div
          className={`panel panel-strong absolute left-4 right-4 top-20 rounded-3xl px-6 py-8 transition-all duration-300 ${
            open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-4 text-[10px] uppercase tracking-[0.45em] text-muted">Navigate</div>
          <div className="flex flex-col gap-4 text-lg text-foreground">
            {links.map((link) => (
              <Link key={link.label} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href={connectHref} onClick={() => setOpen(false)}>
              Connect
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
