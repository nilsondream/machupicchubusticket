"use client";

import { useReservationStore } from "@/store/reservation.store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PASSENGER_TYPE_LABELS } from "@/data/tickets.data";

export default function PassengerForm() {
  const passengers = useReservationStore((s) => s.passengers);
  const updatePassengerField = useReservationStore((s) => s.updatePassengerField);

  return (
    <div className="col-span-3 max-md:col-span-1">
      <div className="space-y-5">
        {passengers.map((p, idx) => (
          <div key={p.id} className="border bg-card rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <p className="font-semibold">
                {PASSENGER_TYPE_LABELS[p.type].title} Passenger
              </p>
              {idx === 0 && (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-md text-xs bg-muted">
                    Principal Traveler
                  </span>
                  {p.isPrimary && (
                    <span className="px-2 py-1 rounded-md text-xs bg-orange-500 text-white">
                      Required
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-2 sm:col-span-3">
                <Label>Full Name</Label>
                <Input
                  placeholder="John Doe"
                  value={p.fullName}
                  onChange={(e) => updatePassengerField(p.id, "fullName", e.target.value)}
                  required={p.isPrimary}
                />
              </div>
              <div className="space-y-2">
                <Label>Document type</Label>
                <select
                  value={p.documentType}
                  onChange={(e) => updatePassengerField(p.id, "documentType", e.target.value)}
                  className="w-full outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 border border-input rounded-md px-3 py-2 text-sm"
                  required={p.isPrimary}
                >
                  <option className="bg-background" value="DNI">DNI</option>
                  <option className="bg-background" value="Passport">Passport</option>
                  <option className="bg-background" value="CE">Foreigner's ID card</option>
                </select>
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>Number</Label>
                <Input
                  placeholder="ABC12345678"
                  value={p.documentNumber}
                  onChange={(e) => updatePassengerField(p.id, "documentNumber", e.target.value)}
                  required={p.isPrimary}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}