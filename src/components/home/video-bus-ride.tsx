import { Play } from "lucide-react"

const VideoBusRide = () => {
  return (
    <section className="py-24 max-md:py-20">
      <div className="max-w-6xl mx-auto max-md:px-5 flex flex-col items-center gap-10">
        <h2 className="text-3xl font-semibold">
          What to expect during the bus ride to Machu Picchu?
        </h2>
        <div className="aspect-video w-full bg-muted rounded-3xl grid place-items-center relative overflow-hidden">
          <img src="https://images.unsplash.com/photo-1740470144178-5af4e972dcf7?q=80&w=1500&auto=format&fit=crop" alt="Video" className="absolute w-full h-full object-cover" />
          <div className="size-15 rounded-full grid place-items-center absolute bg-orange-500 text-white cursor-pointer hover:scale-105 transition-transform">
            <Play fill="currentColor" />
          </div>
        </div>
        <p className="w-4/5 text-center max-md:w-full">
          Watch what your journey to <b>Machu Picchu</b> looks like before you travel. This short video takes
          you through the boarding area in <b>Aguas Calientes (Machu Picchu Pueblo)</b>, the scenic drive
          along the Hiram Bingham Road, and the arrival at the entrance to the Historic Sanctuary of
          Machu Picchu.
        </p>
      </div>
    </section>
  )
}

export default VideoBusRide