import Icons from "@/components/ui/icons"
import SearchReservation from "./search"
import { Sparkles } from "lucide-react"

const Hero = () => {
  return (
    <section>
      <div className="h-[60vh] relative w-full grid place-items-center max-md:h-[75vh]">
        <img src="https://images.unsplash.com/photo-1723134084358-20a2dc177ff1?q=80&w=2000&auto=format&fit=crop" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-r from-black/75 to-transparent"></div>
        <div className="absolute text-white max-w-6xl w-full max-md:px-5 max-md:-translate-y-10">
          <div className="flex items-center gap-3 text-sm max-md:text-xs py-2 px-4 rounded-full bg-orange-500/20 backdrop-blur-lg text-white w-fit">
            <Sparkles className="text-orange-500 size-4" />
            <span>Your journey inspires us. We help you get there</span>
          </div>
          <h1 className="text-5xl font-bold my-5">
            <span className="inline-block relative">
              Machu Picchu
              <Icons.Underline className="text-orange-500 absolute left-0 w-full -mt-2" />
            </span> Bus Tickets<br />{" "}
            Online Reservation.
          </h1>
          <p className="text-lg mt-7 max-md:mt-4 w-3/4 max-md:w-full max-md:text-base">
            Book your Machu Picchu bus tickets online for the official shuttle between <strong>Aguas Calientes (Machu Picchu Pueblo)</strong> and the entrance to <strong>Machu Picchu</strong>. Enjoy a simple booking process, email confirmation, and personalized assistance before your visit.
          </p>
        </div>
      </div>
      <SearchReservation />
    </section>
  )
}

export default Hero