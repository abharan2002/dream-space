import ScrollSequence from "@/components/ScrollSequence";
import ProjectGallery from "@/components/ProjectGallery";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <ScrollSequence />
      <ProjectGallery />
      <Footer />
    </main>
  );
}
