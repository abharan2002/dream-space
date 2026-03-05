"use client";

export default function Footer() {
  return (
    <footer id="connect" className="relative z-10 flex min-h-[65vh] w-full flex-col justify-between border-t border-foreground/10 px-6 pb-10 pt-24 md:px-10 md:pt-28">
      <div className="mx-auto mb-20 flex w-full max-w-[90rem] flex-grow items-center justify-center">
        <div className="panel w-full max-w-4xl rounded-3xl px-8 py-14 text-center md:px-14 md:py-20">
          <span className="mb-8 block text-[10px] uppercase tracking-[0.5em] text-muted">Connect</span>
          <h2 className="mb-10 text-5xl leading-[0.95] md:text-8xl">
            Curating the <span className="text-gradient">extraordinary</span>
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-muted md:text-base">
            Commission requests, archive access, or partnerships for special automotive projects.
          </p>
          <a
            href="mailto:archive@dreamspace.com"
            className="inline-block border-b border-foreground/30 pb-1 text-xl text-foreground/90 hover:border-highlight hover:text-highlight md:text-3xl"
          >
            archive@dreamspace.com
          </a>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-8 border-t border-foreground/10 pt-10 text-[10px] uppercase tracking-[0.24em] text-muted md:flex-row md:items-end md:justify-between md:tracking-[0.36em]">
        <div className="flex flex-col gap-4 md:flex-row md:gap-10">
          <span>© 2026 DreamSpace Collection</span>
          <span>Private Archive Registry</span>
        </div>
        <div className="flex gap-6 md:gap-8">
          <a href="#" className="hover:text-foreground">Instagram</a>
          <a href="#" className="hover:text-foreground">Journal</a>
        </div>
      </div>
    </footer>
  );
}
