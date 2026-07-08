import { BusFront, Clock, Headset, ShieldCheck } from "lucide-react"

const specs = [
  {
    title: "Frequent Departures",
    icon: Clock,
    description: "Buses every 15 minutes with more than 60 daily schedules starting at 5:30 AM",
  },
  {
    title: "Authorized Eco Buses",
    icon: ShieldCheck,
    description: "Service operated by an authorized company with modern, eco-friendly buses and official routes",
  },
  {
    title: "Scenic & Comfortable Journey",
    icon: BusFront,
    description: "Enjoy a safe and comfortable ride through breathtaking tropical landscapes",
  },
  {
    title: "24/7 Personal Support",
    icon: Headset,
    description: "We're always here for you — expert assistance available every day of the week",
  },
];

const Specs = () => {
  return (
    <section className="bg-muted pt-36 pb-24 dark:bg-muted/50">
      <div className="max-w-6xl mx-auto space-y-10 max-md:px-5">
        <div className="space-y-5">
          <h2 className="text-3xl font-semibold tracking-tight max-md:mt-10">
            Experience a Legendary Bus Journey to Machu Picchu
          </h2>
          <p className="w-3/4 max-md:w-full">
            Travel comfortably between Aguas Calientes and the Machu Picchu citadel. 
            Book your tickets online with instant confirmation and enjoy a fast, secure experience.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-5 max-md:grid-cols-1 max-md:gap-3">
          {specs.map((item, index) => (
            <div
              key={index}
              className="bg-background border rounded-2xl p-5 flex flex-col gap-4"
            >
              <item.icon className="size-8 shrink-0" />
              <div className="flex flex-col gap-1">
                <h3 className="font-medium">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Specs