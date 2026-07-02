import Icons from "@/components/ui/icons"
import SearchReservation from "./search"

const Hero = () => {
  return (
    <section>
      <div className="h-[50vh] relative w-full grid place-items-center max-md:h-[75vh]">
        <img src="https://images.unsplash.com/photo-1723134084358-20a2dc177ff1?q=80&w=2000&auto=format&fit=crop" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-r from-black/50 to-transparent"></div>
        <div className="absolute text-white max-w-6xl w-full max-md:px-5">
          <h1 className="text-5xl font-bold mb-4 max-md:text-4xl">
            Book your bus to<br />{" "}
            <span className="inline-block relative">
              Machu Picchu
              <Icons.Underline className="text-orange-500 absolute left-0 w-full" />
            </span>{" "}
            in minutes.
          </h1>
          <p className="text-xl mt-7 w-1/2 max-md:w-full max-md:text-lg">
            Find and book bus tickets through a simple, secure process designed for travelers from around the world.
          </p>
        </div>
      </div>
      <SearchReservation />
    </section>
  )
}

export default Hero