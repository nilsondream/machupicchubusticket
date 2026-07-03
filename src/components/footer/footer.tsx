import Link from "next/link"
import Icons from "@/components/ui/icons"
import { Button } from "@/components/ui/button"

const Footer = () => {
  return (
    <footer className="bg-foreground text-background dark:bg-background dark:text-foreground">
      <div className="max-w-6xl mx-auto max-md:px-5 py-16">
        <div className="grid grid-cols-5 gap-20 mb-40 max-md:mb-20 max-md:grid-cols-1">
          <div className="col-span-2">
            <Link href={"/"} className="w-fit flex items-center gap-5 font-semibold text-2xl">
              machupicchubusticket.com
            </Link>
            <p className="leading-relaxed mt-5 text-sm">
              Book your bus tickets to Machu Picchu quickly and securely.
            </p>
          </div>

          <div className="text-sm">
            <h3 className="font-semibold mb-6">Our Services</h3>
            <ul className="space-y-2 [&_a]:hover:text-orange-500">
              <li><Link href="#">Book Your Bus Ticket</Link></li>
              <li><Link href="#">Search Ticket</Link></li>
              <li><Link href="#">One-Way Ticket</Link></li>
              <li><Link href="#">Uphill Bus</Link></li>
              <li><Link href="#">Sales</Link></li>
              <li><Link href="#">Rentals</Link></li>
            </ul>
          </div>

          <div className="max-md:mr-10 text-sm">
            <h3 className="font-semibold mb-6">Company</h3>
            <ul className="space-y-2 [&_a]:hover:text-orange-500">
              <li><Link href="#">About Us</Link></li>
              <li><Link href="#">Contact</Link></li>
              <li><Link href="#">Blog</Link></li>
            </ul>
          </div>

          <div className="text-sm">
            <h3 className="font-semibold mb-6">Follow Us</h3>
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

        <div className="pt-8 border-t border-white/25 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Machu Picchu Bus Ticket. All rights reserved.</p>
          <div className="flex gap-8 max-md:inline-block max-md:space-x-5 [&_a]:hover:text-orange-500">
            <Link href="/terms">Terms and Conditions</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="#">Legal Information</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer