import ProjectGallery from "@/components/ProjectGallery";
import Footer from "@/components/Footer";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";

export default function CollectionPage() {
  return (
    <main className="min-h-screen text-foreground">
       <nav className="fixed left-0 top-0 z-50 flex w-full items-start justify-between p-6 md:p-10">
        <Link href="/" className="font-serif text-2xl tracking-[0.3em] md:text-3xl">
          DreamSpace
        </Link>
        <SiteNav connectHref="/#connect" links={[{ label: "Archive", href: "/archive" }]} />
      </nav>

      <section className="px-6 pt-32 md:px-10 md:pt-44">
        <div className="mx-auto max-w-[90rem]">
          <p className="mb-4 text-[10px] uppercase tracking-[0.5em] text-muted">Collection</p>
          <h1 className="max-w-5xl text-5xl leading-[1.02] md:text-7xl">
            Significant machines, maintained for <span className="text-gradient">generational value</span>
          </h1>
        </div>
      </section>

      <div>
        <ProjectGallery />
      </div>
      <Footer />
    </main>
  );
}
