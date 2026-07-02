import { Button } from "@/components/ui/button"

const CallToAction = () => {
  return (
    <section className="py-24 max-md:py-20 relative h-220 overflow-hidden grid place-items-center">
      <img src="https://images.unsplash.com/photo-1525915818695-5b1a033247f1?q=80&w=1500&auto=format&fit=crop" alt="Machu Picchu" className="absolute w-full h-full object-cover" />
      <div className="inset-0 bg-linear-to-b from-background via-transparent to-foreground dark:to-background absolute"></div>
      <div className="max-w-6xl mx-auto max-md:px-5 text-center absolute top-30 space-y-6">
        <h2 className="text-3xl font-semibold tracking-tight">
          Ready to Machu Picchu?
        </h2>
        <p className="text-lg w-3/5 mx-auto max-md:w-full">
          Join thousands of satisfied travelers who have discovered the magic of Cusco with Machu Picchu Bus Ticket.
        </p>
        <div className="flex flex-row justify-center gap-3">
          <Button size={"lg"}>
            Make Reservation
          </Button>
          <Button size="lg" variant="outline">
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  )
}

export default CallToAction