const prices = [
  { 
    title: "Round trip", 
    price: "$34", 
    popular: true, 
    description: "The most popular choice for enjoying a complete, worry-free trip." 
  },
  { 
    title: "Upward only", 
    price: "$19", 
    popular: false, 
    description: "Travel from Aguas Calientes to the Machu Picchu entrance." 
  },
  { 
    title: "Downward only", 
    price: "$19", 
    popular: false, 
    description: "Return comfortably to Aguas Calientes after your visit." 
  },
]

const Pricing = () => {
  return (
    <section className="bg-muted pt-36 pb-24 dark:bg-muted/50">
      <div className="max-w-6xl mx-auto space-y-10 max-md:px-5">
        <div className="space-y-5">
          <h2 className="text-3xl font-semibold tracking-tight max-md:mt-10">
            Experience a legendary bus journey to Machu Picchu
          </h2>
          <p className="w-3/4 max-md:w-full">
            Travel in comfort between Aguas Calientes and the Machu Picchu citadel. Book your bus tickets online and enjoy a fast, secure process with immediate digital confirmation.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1 max-md:gap-3">
          {prices.map((item, index) => (
            <div
              key={index}
              className="bg-background border rounded-2xl p-6 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
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
                <p className="text-sm text-muted-foreground mb-1">per person</p>
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