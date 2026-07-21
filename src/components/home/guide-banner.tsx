import { Check, ChevronRight, Star } from "lucide-react"

const GuideBanner = () => {
  return (
    <section className="max-md:px-5 py-20">
      <div className="max-w-6xl mx-auto grid grid-cols-5 items-center max-md:grid-cols-1 pr-10 pl-16 max-md:px-0 relative overflow-hidden rounded-3xl bg-linear-to-br from-orange-500 to-orange-700">
        <div className="col-span-3 text-white space-y-4 max-md:px-5 max-md:pt-5">
          <div className="inline-flex items-center gap-2 text-sm">
            <Star size={16} />
            Expert Local Guides
          </div>
          <h2 className="text-4xl font-bold tracking-tight leading-tight">
            Book your official <br /><span className="">Machu Picchu Guide</span>
          </h2>
          <p>
            Make your visit unforgettable with a professional English-speaking guide.
            Learn the history, secrets, and stories behind the Lost City of the Incas.
          </p>
          <a className="cursor-pointer hover:brightness-90 bg-white text-black flex items-center gap-2 w-fit px-5 py-3 rounded-lg text-sm font-medium">
            Book Your Guide Now
            <ChevronRight size={16} />
          </a>

          {/* Trust Bar */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 mt-8 text-sm">
            <div className="flex items-center gap-2">
              <Check size={14} />
              Certified Guides
            </div>
            <div className="flex items-center gap-2">
              <Check size={14} />
              Small Groups (Max 8)
            </div>
            <div className="flex items-center gap-2">
              <Check size={14} />
              100% Satisfaction
            </div>
          </div>
        </div>
        <div className="translate-y-10 max-md:px-5 max-md:mt-0 col-span-2">
          <img src="/images/guide-mpbt.webp" alt="Guide" />
        </div>
      </div>
    </section>
  )
}

export default GuideBanner