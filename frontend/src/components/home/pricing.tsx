const prices = [
  {
    title: "Ida y vuelta",
    price: "$34",
    popular: true,
    description: "La opción más elegida para disfrutar un viaje completo y sin preocupaciones."
  },
  {
    title: "Solo subida",
    price: "$19",
    popular: false,
    description: "Viaje desde Aguas Calientes hasta la entrada de Machu Picchu."
  },
  {
    title: "Solo bajada",
    price: "$19",
    popular: false,
    description: "Regresa cómodamente a Aguas Calientes después de tu visita."
  },
]

const Pricing = () => {
  return (
    <section className="bg-muted py-36 dark:bg-muted/50">
      <div className="max-w-6xl mx-auto space-y-10 max-md:p-5">
        <div className="space-y-5">
          <h2 className="text-3xl font-semibold tracking-tight">
            Vive un viaje legendario en bus hacia Machu Picchu
          </h2>
          <p className="w-3/4 max-md:w-full">
            Viaja con comodidad entre Aguas Calientes y la ciudadela de Machu Picchu. Reserva tus boletos de bus en línea y disfruta de un proceso rápido, seguro y con confirmación digital inmediata.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1 max-md:gap-3">
          {prices.map((item, index) => (
            <div
              key={index}
              className="bg-background border rounded-2xl p-6 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-semibold">
                  {item.title}
                </span>

                {item.popular && (
                  <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-xs">
                    Popular
                  </span>
                )}
              </div>
              <div className="flex items-end gap-2">
                <h4 className="font-semibold text-3xl">
                  {item.price}
                </h4>
                <p className="text-sm text-muted-foreground mb-1">por persona</p>
              </div>
              <p className="text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing