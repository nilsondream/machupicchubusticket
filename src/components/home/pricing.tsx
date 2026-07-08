"use client";

import { useState } from "react";
import { BusFront, ArrowRight, ArrowLeftRight } from "lucide-react";

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
};

const Pricing = () => {
  const [activeTab, setActiveTab] = useState<"foreigners" | "peruvians">("foreigners");
  const currentPrices = prices[activeTab];

  return (
    <section className="border-b py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto space-y-12 max-md:px-5">
        {/* Header */}
        <div className="text-center space-y-5">
          <h2 className="text-3xl font-semibold tracking-tight">
            Bus Fares to Machu Picchu
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Official prices • Instant confirmation • Prices in USD
          </p>
        </div>

        {/* Nationality Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-full bg-background border p-1">
            <button
              onClick={() => setActiveTab("foreigners")}
              className={`px-8 py-3 rounded-full font-medium transition-all ${activeTab === "foreigners"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-muted"
                }`}
            >
              🌍 Foreigners
            </button>
            <button
              onClick={() => setActiveTab("peruvians")}
              className={`px-8 py-3 rounded-full font-medium transition-all ${activeTab === "peruvians"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-muted"
                }`}
            >
              🇵🇪 Peruvians
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Round Trip */}
          <div className="bg-background border rounded-3xl p-8 relative overflow-hidden group space-y-10">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold">Round Trip</h3>
              <ArrowLeftRight className="size-7 text-green-600" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Adult</p>
                <p className="text-5xl font-bold tracking-tighter">
                  ${currentPrices.roundTrip.adult}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Child</p>
                <p className="text-5xl font-bold tracking-tighter text-muted-foreground">
                  ${currentPrices.roundTrip.child}
                </p>
              </div>
            </div>
          </div>

          {/* Upward Trip */}
          <div className="bg-background border rounded-3xl p-8 flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Upward Trip</h3>
              <ArrowRight className="w-6 h-6 text-emerald-600" />
            </div>

            <div className="mt-auto space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Adult</p>
                <p className="text-5xl font-bold tracking-tighter">
                  ${currentPrices.upward.adult}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Child</p>
                <p className="text-4xl font-bold tracking-tighter text-muted-foreground">
                  ${currentPrices.upward.child}
                </p>
              </div>
            </div>
          </div>

          {/* Downward Trip */}
          <div className="bg-background border rounded-3xl p-8 flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Downward Trip</h3>
              <ArrowRight className="w-6 h-6 rotate-180 text-orange-600" />
            </div>

            <div className="mt-auto space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Adult</p>
                <p className="text-5xl font-bold tracking-tighter">
                  ${currentPrices.downward.adult}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Child</p>
                <p className="text-4xl font-bold tracking-tighter text-muted-foreground">
                  ${currentPrices.downward.child}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        <p className="text-center text-sm text-muted-foreground">
          Prices are subject to change. Child fares apply to ages 3-11 years old.
        </p>
      </div>
    </section>
  );
};

export default Pricing;