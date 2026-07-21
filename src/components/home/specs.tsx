import { cn } from "@/lib/utils";
import { Bus, BusFront, Calendar, Clock, Route } from "lucide-react"

const specs = [
  {
    title: "Travel Time",
    icon: Clock,
    description: "25 - 30 minutes",
    color: "text-blue-500"
  },
  {
    title: "Operating Hours",
    icon: BusFront,
    description: "05:30 am - 05:30 pm",
    color: "text-green-500"
  },
  {
    title: "Departure Frequency",
    icon: Bus,
    description: "Every 15 minutes",
    color: "text-orange-500"
  },
  {
    title: "Availability",
    icon: Calendar,
    description: "Every day",
    color: "text-indigo-500"
  },
];

const Specs = () => {
  return (
    <section className="bg-muted pt-36 pb-24 dark:bg-muted/50 border-b">
      <div className="max-w-6xl mx-auto space-y-10 max-md:px-5">
        <div className="space-y-5">
          <h2 className="text-3xl font-semibold max-md:mt-10">
            Bus from Aguas Calientes to Machu Picchu: Schedule, Route and Travel Time
          </h2>
          <p className="w-3/4 max-md:w-full">
            The bus from Aguas Calientes (Machu Picchu Pueblo) to the entrance of Machu Picchu is
            the fastest and most convenient way to reach the archaeological site. Buses operate every
            day with frequent departures, making it easy to match your shuttle with your train arrival and
            entrance ticket.
          </p>
        </div>

        <div className="grid grid-cols-4 items-center gap-5 max-md:grid-cols-1 max-md:gap-3">
          {specs.map((item, index) => (
            <div
              key={index}
              className="bg-background border rounded-2xl p-5 flex items-center gap-4"
            >
              <item.icon className={cn("size-10 shrink-0 text-orange-500")} />
              <div className="flex flex-col gap-1">
                <h3 className="text-muted-foreground text-sm">
                  {item.title}
                </h3>
                <p className="font-semibold text-base">
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