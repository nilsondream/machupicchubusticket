"use client"

import { useState } from "react"
import { ShieldCheck, ArrowRight, ArrowLeftRight, Bus, CheckCircle } from "lucide-react"
import Link from "next/link"

const prices = {
  foreigners: {
    roundTrip: { adult: 34, child: 18 },
    upward: { adult: 19, child: 13 },
    downward: { adult: 19, child: 13 },
  },
  peruvians: {
    roundTrip: { adult: 22, child: 13 },
    upward: { adult: 14, child: 13 },
    downward: { adult: 14, child: 13 },
  },
}

const PriceSidebar = () => {
  const [activeTab, setActiveTab] = useState<"foreigners" | "peruvians">("foreigners")
  const currentPrices = prices[activeTab]

  return (
    <>
    <div className="bg-card border rounded-2xl overflow-hidden sticky top-24">
      <div className="bg-foreground text-background p-6 text-center">
        <Bus className="size-6 mx-auto mb-2" />
        <h3 className="font-semibold text-lg">Machu Picchu Bus</h3>
        <p className="text-sm opacity-80">Official shuttle service</p>
      </div>

      <div className="p-5">
        <div className="flex rounded-full bg-muted p-1 mb-6">
          <button
            onClick={() => setActiveTab("foreigners")}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-all text-center ${activeTab === "foreigners" ? "bg-background shadow-sm" : "hover:bg-muted/50"}`}
          >
            🌍 Foreigners
          </button>
          <button
            onClick={() => setActiveTab("peruvians")}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-all text-center ${activeTab === "peruvians" ? "bg-background shadow-sm" : "hover:bg-muted/50"}`}
          >
            🇵🇪 Peruvians
          </button>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="size-4 text-green-600" />
              <span className="text-sm font-medium">Round Trip</span>
            </div>
            <span className="font-bold">${currentPrices.roundTrip.adult}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
            <div className="flex items-center gap-2">
              <ArrowRight className="size-4 text-emerald-600" />
              <span className="text-sm font-medium">Upward</span>
            </div>
            <span className="font-bold">${currentPrices.upward.adult}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
            <div className="flex items-center gap-2">
              <ArrowRight className="size-4 rotate-180 text-orange-600" />
              <span className="text-sm font-medium">Downward</span>
            </div>
            <span className="font-bold">${currentPrices.downward.adult}</span>
          </div>
        </div>

        <Link href="/reservation">
          <button className="w-full bg-foreground text-background cursor-pointer rounded-xl py-3 font-semibold hover:bg-orange-500 hover:text-white transition-colors">
            Book Now
          </button>
        </Link>

        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-4">
          <ShieldCheck size={14} />
          <span>Secure checkout • Instant confirmation</span>
        </div>

        <div className="mt-6 space-y-2 text-xs text-muted-foreground">
          {["Digital ticket via email", "Free changes up to 24h", "24/7 support"].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle className="size-3 text-green-500" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

      {/* Mobile sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-3 flex items-center justify-between z-50 lg:hidden shadow-lg">
        <div>
          <p className="text-xs text-muted-foreground">From</p>
          <p className="font-bold text-lg">${currentPrices.roundTrip.adult}</p>
        </div>
        <Link href="/reservation">
          <button className="bg-foreground text-background cursor-pointer rounded-xl px-8 py-3 font-semibold hover:bg-orange-500 hover:text-white transition-colors">
            Book Now
          </button>
        </Link>
      </div>
    </>
  )
}

export default PriceSidebar
