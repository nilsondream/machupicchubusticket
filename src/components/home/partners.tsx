import Icons from "../ui/icons"

const Partners = () => {
  return (
    <section>
      <div className="max-w-6xl mx-auto max-md:px-5 py-20">
        <div className="flex items-center justify-between gap-10 max-md:gap-5 w-full max-md:flex-wrap max-md:items-stretch">
          <Icons.Viator className="w-24 max-md:w-20" />
          <Icons.SafeTravels className="w-16 max-md:w-12" />
          <Icons.TripAdvisor className="w-40 max-md:w-32" />
          <Icons.Choise className="w-16" />
          <Icons.Agencia className="w-40 max-md:w-32" />
          <Icons.PeruLogo className="w-20" />
          <Icons.GetYourGuide className="w-40" />
        </div>
      </div>
    </section>
  )
}

export default Partners