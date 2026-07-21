"use client";

import { CheckCircle } from "lucide-react";

const Recommendations = () => {
  return (
    <section className="py-24 max-md:py-20">
      <div className="max-w-6xl mx-auto max-md:px-5 grid grid-cols-3 max-md:grid-cols-1 gap-10 items-start">
        <div className="space-y-6 col-span-1">          
          <h2 className="text-3xl font-semibold tracking-tight leading-tight">
            Your trusted platform for <span className="text-orange-500">bus tickets to Machu Picchu</span>
          </h2>
          
          <p className="leading-relaxed">
            Machu Picchu Bus Ticket is the most reliable way to book bus transportation 
            from <strong>Aguas Calientes</strong> to the <strong>Machu Picchu entrance</strong>. 
            Fast, secure, and hassle-free booking with real-time schedules.
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-3 pt-4">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="size-4 text-green-500" />
              Book in under 2 minutes
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="size-4 text-green-500" />
              24/7 English support
            </div>
          </div>
        </div>

        <div className="w-full border rounded-2xl overflow-hidden bg-card col-span-2 max-md:col-span-1">
          <div className="bg-muted/80 px-6 py-4 border-b">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              Recommended Bus Schedule to Machu Picchu
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              From Aguas Calientes to Machu Picchu Entrance
            </p>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-6 py-4 text-left font-medium border-r">Machu Picchu Entrance</th>
                <th className="px-6 py-4 text-left font-medium">Recommended Bus</th>
              </tr>
            </thead>
            <tbody className="divide-y border-t text-muted-foreground">
              <tr className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-medium border-r">06:00</td>
                <td className="px-6 py-4 font-medium">05:00 - 05:15</td>
              </tr>
              <tr className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-medium border-r">07:00</td>
                <td className="px-6 py-4 font-medium">06:00 - 06:15</td>
              </tr>
              <tr className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-medium border-r">08:00</td>
                <td className="px-6 py-4 font-medium">07:00 - 07:15</td>
              </tr>
            </tbody>
          </table>

          <div className="px-6 py-4 text-xs text-muted-foreground border-t">
            We recommend taking the bus 45-60 minutes early. Schedules are subject to change.
          </div>
        </div>
      </div>
    </section>
  );
};

export default Recommendations;