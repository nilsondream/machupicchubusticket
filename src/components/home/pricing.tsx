const Pricing = () => {
  return (
    <section className="py-24 max-md:py-20">
      <div className="max-w-6xl mx-auto max-md:px-5">
        <div className="text mb-10">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">
            Machu Picchu Bus Ticket Prices
          </h2>
          <p className="text-muted-foreground text-lg">
            Find the current ticket prices for the bus between Aguas Calientes (Machu Picchu Pueblo) and the entrance to Machu Picchu.
          </p>
        </div>
        <div className="w-full border rounded-2xl overflow-hidden bg-card">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-6 py-4 text-left font-medium border-r">Service/Passenger</th>
                <th className="px-6 py-4 font-medium border-r">Foreign Adult</th>
                <th className="px-6 py-4 font-medium border-r">Foreign Child</th>
                <th className="px-6 py-4 font-medium border-r">Peruvian Adult</th>
                <th className="px-6 py-4 font-medium">Peruvian Child</th>
              </tr>
            </thead>
            <tbody className="divide-y border-t text-muted-foreground">
              <tr className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-medium border-r">Round Trip</td>
                <td className="px-6 py-4 text-center font-medium border-r">34 USD</td>
                <td className="px-6 py-4 text-center font-medium border-r">18 USD</td>
                <td className="px-6 py-4 text-center font-medium border-r">22 USD</td>
                <td className="px-6 py-4 text-center font-medium">13 USD</td>
              </tr>
              <tr className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-medium border-r">Uphill Only</td>
                <td className="px-6 py-4 text-center font-medium border-r">19 USD</td>
                <td className="px-6 py-4 text-center font-medium border-r">13 USD</td>
                <td className="px-6 py-4 text-center font-medium border-r">14 USD</td>
                <td className="px-6 py-4 text-center font-medium">13 USD</td>
              </tr>
              <tr className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-medium border-r">Downhill Only</td>
                <td className="px-6 py-4 text-center font-medium border-r">19 USD</td>
                <td className="px-6 py-4 text-center font-medium border-r">13 USD</td>
                <td className="px-6 py-4 text-center font-medium border-r">14 USD</td>
                <td className="px-6 py-4 text-center font-medium">13 USD</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default Pricing