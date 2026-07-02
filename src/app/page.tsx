import AboutUs from "@/components/home/about-us";
import CallToAction from "@/components/home/call-to-action";
import FAQs from "@/components/home/faqs";
import Hero from "@/components/home/hero";
import Pricing from "@/components/home/pricing";
import Reviews from "@/components/home/reviews";

export default function Home() {
  return (
    <main>
      <Hero />
      <Pricing />
      <AboutUs />
      <Reviews />
      <FAQs />
      <CallToAction />
    </main>
  );
}
