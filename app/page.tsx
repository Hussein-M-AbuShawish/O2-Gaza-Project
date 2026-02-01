import { Navbar } from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ServicesSection } from "@/components/services-section";
import { ReviewsSection } from "@/components/reviews-section";
// import { StatsSection } from "@/components/stats-section";
// import { GallerySection } from "@/components/gallery-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ReviewsSection />
      {/* <StatsSection /> */}
      {/* <GallerySection /> */}
      <ContactSection />
      <Footer />
    </main>
  );
}
