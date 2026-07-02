import Link from "next/link"
import Icons from "../ui/icons"
import { Button } from "../ui/button"

const Footer = () => {
  return (
    <footer className="bg-foreground text-background dark:bg-background dark:text-foreground">
      <div className="max-w-6xl mx-auto max-md:px-5 py-16">
        <div className="grid grid-cols-5 gap-20 mb-40 max-md:mb-20 max-md:grid-cols-1">
          <div className="col-span-2">
            <Link href={"/"} className="w-fit flex items-center gap-5 font-semibold text-2xl">
              machupicchubusticket.com
            </Link>
            <p className="leading-relaxed mt-5">
              Reserva tus boletos de bus a Machu Picchu de forma rápida y segura.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6">Nuestros Servicios</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Reserva tu Bus</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Bus de Ida</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Bus de Subida</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Venta</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Alquiler</Link></li>
            </ul>
          </div>

          <div className="max-md:mr-10">
            <h3 className="font-semibold text-lg mb-6">Empresa</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Sobre Nosotros</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Contacto</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6">Síguenos</h3>
            <div className="flex gap-2">
              <Button size={"icon"} variant={"hero-outline"}>
                <Icons.Facebok />
              </Button>
              <Button size={"icon"} variant={"hero-outline"}>
                <Icons.TikTok />
              </Button>
              <Button size={"icon"} variant={"hero-outline"}>
                <Icons.Instagram />
              </Button>
              <Button size={"icon"} variant={"hero-outline"}>
                <Icons.TripAdvisorIcon />
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/25 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Machu Picchu Bus Ticket. Todos los derechos reservados.</p>
          <div className="flex gap-8 max-md:inline-block max-md:space-x-5">
            <Link href="#" className="hover:text-orange-500 transition-colors">Términos y Condiciones</Link>
            <Link href="#" className="hover:text-orange-500 transition-colors">Política de Privacidad</Link>
            <Link href="#" className="hover:text-orange-500 transition-colors">Información Legal</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer