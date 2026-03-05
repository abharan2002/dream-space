import Footer from "@/components/Footer";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";

export default function ArchivePage() {
  return (
    <main className="min-h-screen text-foreground">
      <nav className="fixed left-0 top-0 z-50 flex w-full items-start justify-between p-6 md:p-10">
        <Link href="/" className="font-serif text-2xl tracking-[0.3em] md:text-3xl">
          DreamSpace
        </Link>
        <SiteNav connectHref="/#connect" links={[{ label: "Collection", href: "/collection" }]} />
      </nav>

      <section className="relative flex min-h-screen items-center px-6 py-36 md:px-10 md:py-56">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-start">
            <div className="flex-1">
              <span className="mb-10 block text-[10px] uppercase tracking-[0.5em] text-muted">01 — Philosophy</span>
              <h1 className="text-5xl leading-[1.06] md:text-7xl lg:text-8xl">
                A pursuit of automotive <br/><span className="text-gradient">purity</span> and preservation.
              </h1>
            </div>
            <div className="flex-1 lg:pt-16">
              <p className="mb-16 max-w-lg text-base leading-relaxed text-muted md:text-xl">
                DreamSpace is an intimate curation of mechanical milestones. Each vehicle is selected for its contribution to automotive history, engineering excellence, and aesthetic soul. A private archive dedicated to the golden eras of motoring.
              </p>
              <div className="panel grid grid-cols-2 gap-x-8 gap-y-12 rounded-2xl p-8 md:gap-x-12 md:p-10">
                <StatItem label="Established" value="2018" />
                <StatItem label="Total Assets" value="12" />
                <StatItem label="Preservation" value="100%" />
                <StatItem label="Drive Time" value="Weekly" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <span className="mb-3 block text-[10px] uppercase tracking-[0.3em] text-muted">{label}</span>
      <span className="text-3xl tracking-tight text-foreground">{value}</span>
    </div>
  );
}
