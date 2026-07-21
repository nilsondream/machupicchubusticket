import Blogs from "@/components/home/blogs";
import CallToAction from "@/components/home/call-to-action";
import FAQs from "@/components/home/faqs";
import GuideBanner from "@/components/home/guide-banner";
import Hero from "@/components/home/hero";
import Pricing from "@/components/home/pricing";
import Recommendations from "@/components/home/recommendations";
import Reviews from "@/components/home/reviews";
import Specs from "@/components/home/specs";
import Ubication from "@/components/home/ubication";
import VideoBusRide from "@/components/home/video-bus-ride";
import WhyChoose from "@/components/home/why-choose";

export default function Home() {
  return (
    <main>
      <Hero />
      <Specs />
      <VideoBusRide />
      <WhyChoose />
      <GuideBanner />
      <Ubication />
      <Pricing />
      <Recommendations />
      <Reviews />
      <Blogs />
      <FAQs />
      <CallToAction />
    </main>
  );
}
