const AboutUs = () => {
  return (
    <section id="about-us" className="py-24 max-md:py-20 border-y">
      <div className="max-w-6xl mx-auto max-md:px-5 grid md:grid-cols-2 gap-10 items-center max-md:gap-20">
        <div className="relative grid place-items-center h-100 max-md:w-full">
          <div className="bg-muted absolute z-5 aspect-3/4 rounded-xl overflow-hidden w-100 max-md:w-3/5 shadow-2xl -rotate-5 translate-y-15 -translate-x-15 hover:rotate-0 hover:scale-95 duration-300">
            <img src="https://images.unsplash.com/photo-1772931165114-a282293a8b7b?q=80&w=700&auto=format&fit=crop" alt="Aguas Calientes" className="w-full h-full object-cover" />
          </div>
          <div className="bg-muted absolute z-0 aspect-3/4 rounded-xl overflow-hidden w-100 max-md:w-3/5 shadow-2xl rotate-5 -translate-y-15 translate-x-15 hover:rotate-0 hover:scale-95 hover:z-10 duration-300">
            <img src="https://images.unsplash.com/photo-1532996152552-eaffc4edfc1a?q=80&w=700&auto=format&fit=crop" alt="Machu Picchu" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="space-y-5">
          <h2 className="text-3xl font-semibold tracking-tight">Tu plataforma de confianza para comprar boletos de autobús a Machu Picchu.</h2>
          <p className="leading-relaxed">
            Machu Picchu Bus Ticket ayuda a los viajeros a reservar su transporte en autobús entre Aguas Calientes y la entrada a Machu Picchu de forma rápida, segura y sin complicaciones innecesarias.</p>
          <p className="leading-relaxed">Ofrecemos una experiencia de reserva sencilla con billetes digitales, opciones de viaje flexibles y asistencia para que disfrute con total tranquilidad de uno de los destinos más emblemáticos del mundo.
          </p>
        </div>
      </div>
    </section>
  )
}

export default AboutUs