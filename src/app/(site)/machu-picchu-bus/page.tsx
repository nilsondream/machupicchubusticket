import type { Metadata } from "next"
import { Bus, Calendar, Clock, Route, ShieldCheck, MapPin, Camera, Sun, Wifi, CheckCircle, XCircle, ChevronRight, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import Gallery from "./gallery"
import FAQs from "./faqs"
import PriceSidebar from "./price-sidebar"
import PricingSection from "./pricing-section"

export const metadata: Metadata = {
  title: "Bus Tickets to Machu Picchu | Official Shuttle from Aguas Calientes",
  description: "Book your official bus tickets from Aguas Calientes to Machu Picchu. Round trip, one way or downward tickets. Secure online booking with instant confirmation.",
}

const specs = [
  { title: "Travel Time", icon: Clock, description: "25 - 30 minutes", color: "text-blue-500" },
  { title: "Operating Hours", icon: Bus, description: "05:30 am - 05:30 pm", color: "text-green-500" },
  { title: "Route", icon: Route, description: "Aguas Calientes ⇄ Machu Picchu Entrance", color: "text-orange-500" },
  { title: "Availability", icon: Calendar, description: "Every day of the year", color: "text-indigo-500" },
]

const features = [
  { title: "Instant Confirmation", description: "Receive your digital ticket immediately after booking via email.", icon: ShieldCheck },
  { title: "Flexible Schedule", description: "Buses depart every 10-15 minutes during operating hours.", icon: Clock },
  { title: "Mobile Ticket", description: "Show your ticket on your phone — no printing required.", icon: Camera },
  { title: "Best Price Guarantee", description: "Official fares with no hidden charges or booking fees.", icon: Sun },
  { title: "24/7 Support", description: "English-speaking customer support available anytime.", icon: Wifi },
  { title: "Secure Payment", description: "Pay safely with PayPal, credit card, or bank transfer.", icon: ShieldCheck },
]

const included = [
  "Bus ticket from Aguas Calientes to Machu Picchu",
  "Instant digital ticket sent to your email",
  "Free changes up to 24 hours before departure",
  "24/7 customer support in English",
]
const notIncluded = [
  "Machu Picchu entrance ticket",
  "Professional tour guide",
  "Hotel pickup or drop-off",
  "Personal travel insurance",
]

const itinerary = [
  { time: "05:00 - 05:15", title: "First Departure", description: "Early bird buses start from Aguas Calientes station.", icon: Sun },
  { time: "25 - 30 min", title: "Scenic Ride", description: "Enjoy the lush cloud forest as you ascend the winding mountain road.", icon: Route },
  { time: "Arrival", title: "Machu Picchu Entrance", description: "Drop-off at the control gate, just steps from the UNESCO site entrance.", icon: MapPin },
  { time: "Return", title: "Return to Aguas Calientes", description: "Buses run downhill continuously until 5:30 pm from the same stop.", icon: Bus },
]

const BusServicePage = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="h-[70vh] relative w-full grid place-items-center max-md:h-[80vh]">
          <img
            src="https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=2000&auto=format&fit=crop"
            alt="Machu Picchu bus"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/80 to-black/20" />
          <div className="absolute text-white max-w-6xl w-full max-md:px-5">
            <div className="flex items-center gap-3 text-sm py-2 px-4 rounded-full bg-white/15 backdrop-blur-lg w-fit mb-6">
              <Bus className="text-orange-500 size-4" />
              <span>Official bus service to Machu Picchu</span>
            </div>
            <h1 className="text-5xl font-bold mb-5 max-md:text-4xl">
              Bus from Aguas Calientes<br />
              <span className="text-orange-400">to Machu Picchu</span>
            </h1>
            <p className="text-lg max-w-xl max-md:text-base">
              Book your official shuttle between Aguas Calientes (Machu Picchu Pueblo) and
              the entrance of Machu Picchu. Fast, secure, instant confirmation.
            </p>
            <div className="flex gap-4 mt-8">
              <a href="#pricing">
                <Button variant="hero" size="lg" className="font-semibold">
                  See Prices & Book
                  <ChevronRight size={16} />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Content + Sidebar Layout */}
      <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 py-12 pb-28 lg:pb-12">
        {/* Main Content */}
        <div>
          {/* Gallery */}
          <Gallery />

          {/* Specs */}
          <section className="py-16 max-md:py-12">
            <div className="space-y-8">
              <h2 className="text-3xl font-semibold tracking-tight">
                Bus Service Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {specs.map((item, index) => (
                  <div key={index} className="bg-card border rounded-2xl p-5 flex items-center gap-4">
                    <item.icon className="size-10 shrink-0 text-orange-500" />
                    <div className="flex flex-col gap-1">
                      <h3 className="text-muted-foreground text-sm">{item.title}</h3>
                      <p className="font-semibold text-base">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Overview */}
          <section className="py-16 max-md:py-12 border-t">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground">
                  <ShieldCheck size={17} />
                  Official Transport Service
                </p>
                <h2 className="text-3xl font-semibold tracking-tight leading-tight">
                  The fastest way to reach{" "}
                  <span className="text-orange-500">Machu Picchu</span>
                </h2>
                <p className="leading-relaxed text-muted-foreground">
                  The bus from Aguas Calientes (Machu Picchu Pueblo) to the entrance of
                  Machu Picchu is the only public transport option available. The journey
                  takes approximately <strong>25-30 minutes</strong> through a stunning
                  cloud forest landscape.
                </p>
                <p className="leading-relaxed text-muted-foreground">
                  Buses operate daily from <strong>5:30 am to 5:30 pm</strong> with
                  departures every 10-15 minutes. No advance seat assignment — simply
                  board the next available bus with your digital ticket.
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-3 pt-4">
                  {["Book in under 2 minutes", "Instant email confirmation", "Free cancellation"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="size-4 text-green-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="border rounded-2xl overflow-hidden bg-card">
                <div className="bg-muted/80 px-6 py-4 border-b">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    Recommended Schedule
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    From Aguas Calientes to Machu Picchu Entrance
                  </p>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-6 py-4 text-left font-medium border-r">Machu Picchu Entry Time</th>
                      <th className="px-6 py-4 text-left font-medium">Recommended Bus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-t text-muted-foreground">
                    {[
                      { entry: "06:00", bus: "05:00 - 05:15" },
                      { entry: "07:00", bus: "06:00 - 06:15" },
                      { entry: "08:00", bus: "07:00 - 07:15" },
                    ].map((row) => (
                      <tr key={row.entry} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-medium border-r">{row.entry}</td>
                        <td className="px-6 py-4 font-medium">{row.bus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-6 py-4 text-xs text-muted-foreground border-t">
                  We recommend taking the bus 45-60 minutes early. Schedules subject to change.
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="py-16 max-md:py-12 border-t">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold tracking-tight mb-4">
                Why book with us?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Everything you need for a smooth and hassle-free experience.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {features.map((feature, index) => (
                <div key={index} className="bg-card border rounded-2xl p-6 space-y-4">
                  <feature.icon className="size-8 text-orange-500" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Itinerary */}
          <section className="py-16 max-md:py-12 border-t">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold tracking-tight mb-4">
                Your Journey Step by Step
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                From Aguas Calientes to the Lost City of the Incas.
              </p>
            </div>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-border hidden md:block" />
              <div className="space-y-8">
                {itinerary.map((step, index) => (
                  <div key={index} className="relative flex gap-6 items-start">
                    <div className="hidden md:flex size-16 shrink-0 rounded-full bg-orange-500/10 border-2 border-orange-500 items-center justify-center z-10">
                      <step.icon className="size-6 text-orange-500" />
                    </div>
                    <div className="bg-card border rounded-2xl p-6 flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full">
                          {step.time}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg">{step.title}</h3>
                      <p className="text-muted-foreground mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Prices */}
          <PricingSection />

          {/* What's Included */}
          <section className="py-16 max-md:py-12 border-t">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold tracking-tight mb-4">
                What's Included
              </h2>
              <p className="text-muted-foreground text-lg">
                Everything you get with your bus ticket.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card border rounded-2xl p-8">
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-6">
                  <CheckCircle className="size-5 text-green-500" />
                  Included
                </h3>
                <ul className="space-y-4">
                  {included.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="size-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card border rounded-2xl p-8">
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-6">
                  <XCircle className="size-5 text-red-500" />
                  Not Included
                </h3>
                <ul className="space-y-4">
                  {notIncluded.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <XCircle className="size-5 text-red-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Meeting Point */}
          <section className="py-16 max-md:py-12 border-t" id="meeting-point">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold tracking-tight mb-4">
                Meeting Point
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Buses depart from the official station in the center of Aguas Calientes.
              </p>
            </div>
            <div className="bg-card border rounded-2xl overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <div className="text-center space-y-4">
                  <MapPin className="size-12 text-orange-500 mx-auto" />
                  <div>
                    <p className="font-semibold text-lg">Bus Station Aguas Calientes</p>
                    <p className="text-muted-foreground">
                      Av. Imperio de los Incas s/n, Aguas Calientes
                    </p>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Aguas+Calientes+Bus+Station+Machu+Picchu"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      <Navigation size={14} />
                      Open in Google Maps
                    </Button>
                  </a>
                </div>
              </div>
              <div className="p-6 border-t">
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Address</span>
                    <p className="font-medium">Av. Imperio de los Incas, Aguas Calientes</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Distance from Train Station</span>
                    <p className="font-medium">5-minute walk</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Walking distance to hotels</span>
                    <p className="font-medium">2-10 minutes from most hotels</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <FAQs />
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <PriceSidebar />
          </div>
        </aside>
      </div>
    </>
  )
}

export default BusServicePage
