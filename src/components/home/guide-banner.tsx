import { Check, ChevronRight, Star } from "lucide-react"

const GuideBanner = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-red-500 to-red-700">
      <div className="max-w-6xl mx-auto grid grid-cols-2 items-center">
        <div className="text-white space-y-6">
          <div className="inline-flex items-center gap-2">
            <Star size={20} />
            Expert Local Guides
          </div>

          <h1 className="text-5xl font-bold tracking-tight leading-tight mb-6">
            Book your official <br /><span className="">Machu Picchu Guide</span>
          </h1>

          <p>
            Make your visit unforgettable with a professional English-speaking guide.
            Learn the history, secrets, and stories behind the Lost City of the Incas.
          </p>

          <a
            className="cursor-pointer hover:brightness-90 bg-white text-black flex items-center gap-2 w-fit px-5 py-3 rounded-lg text-sm font-medium"
          >
            Book Your Guide Now
            <ChevronRight size={16} />
          </a>

          {/* Trust Bar */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 mt-12 text-sm">
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
        <div className="mt-20">
          <img src="/images/guide-mpbt.webp" alt="Guide" />
        </div>
      </div>
    </section>
  )
}

export default GuideBanner