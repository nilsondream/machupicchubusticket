"use client";

import { useReservationStore } from "@/store/reservation.store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PASSENGER_TYPE_LABELS } from "@/data/tickets.data";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function PassengerForm() {
  const passengers = useReservationStore((s) => s.passengers);
  const updatePassengerField = useReservationStore((s) => s.updatePassengerField);

  return (
    <div className="col-span-3 max-md:col-span-1 space-y-5">
      {passengers.map((p, idx) => {
        const isPrimary = p.isPrimary;
        return (
          <div key={p.id} className="border bg-card rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <p className="font-semibold">
                {PASSENGER_TYPE_LABELS[p.type].title} Passenger
                {!isPrimary && <span className="text-muted-foreground text-sm font-normal ml-2">(optional)</span>}
              </p>
              {idx === 0 && (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-md text-xs bg-muted border text-muted-foreground">
                    Principal Traveler
                  </span>
                  <span className="px-2 py-1 rounded-md text-xs bg-orange-500 text-white">
                    Required
                  </span>
                </div>
              )}
              {!isPrimary && (
                <span className="px-2 py-1 rounded-md text-xs bg-muted border text-muted-foreground">
                  Can be completed later
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-5">
              <div className={cn("col-span-3 grid gap-5", isPrimary ? "grid-cols-2" : "grid-cols-1")}>
                <div className="space-y-2">
                  <Label>Full Name {isPrimary && "*"}</Label>
                  <Input
                    placeholder="John Doe"
                    value={p.fullName}
                    onChange={(e) => updatePassengerField(p.id, "fullName", e.target.value)}
                    required={isPrimary}
                  />
                </div>
                {isPrimary && (
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={p.email}
                      onChange={(e) => updatePassengerField(p.id, "email", e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>
              {isPrimary && (
                <div className="space-y-2">
                  <Label>Phone {isPrimary && "*"}</Label>
                  <Input
                    type="tel"
                    placeholder="+1 234 567 890"
                    value={p.phone}
                    onChange={(e) => updatePassengerField(p.id, "phone", e.target.value)}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>Document type {isPrimary && "*"}</Label>
                <select
                  value={p.documentType}
                  onChange={(e) => updatePassengerField(p.id, "documentType", e.target.value)}
                  className="w-full outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 border border-input rounded-md px-3 py-2 text-sm"
                  required={isPrimary}
                >
                  <option className="bg-background" value="DNI">DNI</option>
                  <option className="bg-background" value="Passport">Passport</option>
                  <option className="bg-background" value="CE">Foreigner's ID card</option>
                </select>
              </div>
              <div className={cn("space-y-2", !isPrimary && "col-span-2")}>
                <Label>Document number {isPrimary && "*"}</Label>
                <Input
                  placeholder="ABC12345678"
                  value={p.documentNumber}
                  onChange={(e) => updatePassengerField(p.id, "documentNumber", e.target.value)}
                  required={isPrimary}
                />
              </div>
              {isPrimary && (
                <div className="space-y-2 col-span-3">
                  <Label>Additional information</Label>
                  <Textarea
                    placeholder="Any special requests..."
                    value={p.notes}
                    onChange={(e) => updatePassengerField(p.id, "notes", e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}

      <p className="text-xs text-muted-foreground text-center px-5">
        Only the primary traveler information is required to complete the reservation.
        Other passengers can be added later from the ticket page.
      </p>
    </div>
  );
}
