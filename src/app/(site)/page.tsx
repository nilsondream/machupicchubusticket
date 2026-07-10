import AboutUs from "@/components/home/about-us";
import Blogs from "@/components/home/blogs";
import CallToAction from "@/components/home/call-to-action";
import FAQs from "@/components/home/faqs";
import GuideBanner from "@/components/home/guide-banner";
import Hero from "@/components/home/hero";
import Reviews from "@/components/home/reviews";
import Specs from "@/components/home/specs";

export default function Home() {
  return (
    <main>
      <Hero />
      <Specs />
      <AboutUs />
      <GuideBanner />
      <Reviews />
      <Blogs />
      <FAQs />
      <CallToAction />
    </main>
  );
}
