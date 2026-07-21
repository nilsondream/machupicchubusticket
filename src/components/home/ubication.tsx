import { Clock, Footprints, Mail, MapPin } from "lucide-react";

const ubicationSpecs = [
  {
    icon: MapPin,
    title: "Boarding Station",
    description: "Machu Picchu Station (Aguas Calientes) - Av. Hermanos Ayar s/n, Machu Picchu Pueblo"
  },
  {
    icon: Footprints,
    title: "Walking Distance",
    description: "10-15 minutes walking from Machu Picchu Station to the bus stop for the citadel"
  },
  {
    icon: Clock,
    title: "Arrival Recommendation",
    description: "Arrive at the station 30-45 minutes before your train departure"
  },
  {
    icon: Mail,
    title: "Email Confirmation",
    description: "Receive your booking details and e-tickets directly in your inbox instantly after purchase"
  },
];

const Ubication = () => {
  return (
    <section className="py-24 max-md:py-20">
      <div className="max-w-6xl mx-auto max-md:px-5 flex flex-col items-center gap-10">
        <h2 className="text-3xl font-semibold w-1/2 text-center max-md:w-full">
          Where do I take the Bus from Aguas Calientes to Machu Picchu?
        </h2>
        <div className="grid grid-cols-3 gap-10 w-full max-md:grid-cols-1">
          <div className="col-span-2 max-md:col-span-1 bg-muted rounded-3xl overflow-hidden">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1155.0508251405201!2d-72.52501972042845!3d-13.155309879282939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x916d9b2d10a47677%3A0xdbed25f27eb635d2!2sConsettur%20Bus%20Ticket!5e0!3m2!1ses-419!2spe!4v1784588119965!5m2!1ses-419!2spe" width="100%" height="100%" loading="lazy" referrerPolicy="strict-origin-when-cross-origin"></iframe>
          </div>
          <div className="col-span-1 space-y-10 py-5">
            {ubicationSpecs.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="size-12 bg-orange-500 text-white rounded-xl flex items-center justify-center shrink-0">
                  <item.icon />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
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
      </div>
    </section>
  )
}

export default Ubication