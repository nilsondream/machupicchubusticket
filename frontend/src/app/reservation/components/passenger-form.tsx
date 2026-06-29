"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reservationSchema, ReservationForm } from "@/lib/validations/reservation";
import { useReservationStore } from "@/store/reservation.store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PassengerForm() {
  const { passengers, pricingType } = useReservationStore();
  const totalPassengers = passengers.adults + passengers.children;

  const passengerManifest = [
    ...Array.from({ length: passengers.adults }, (_, index) => ({
      type: "adult" as const,
      pricingType,
      isLead: index === 0,
    })),

    ...Array.from({ length: passengers.children }, () => ({
      type: "child" as const,
      pricingType,
      isLead: false,
    })),
  ];

  const leadPassenger = passengerManifest[0];

  const form = useForm<ReservationForm>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      email: "",
      phone: "",
      leadPassenger: {
        fullName: "",
        document: "",
      },
      passengers: Array.from({
        length: totalPassengers - 1,
      }).map(() => ({
        fullName: "",
        documentType: "",
        document: "",
      })),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "passengers",
  });

  return (
    <div className="col-span-3">
      <div className="space-y-5">
        <div className="rounded-2xl border p-5 space-y-5 bg-card">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">
              Passenger 1
            </h4>
            <div className="flex items-center gap-2 font-medium select-none text-xs">
              <span className="px-2 py-1 rounded-md bg-orange-500 text-white">
                Principal Traveler
              </span>
              <span className="px-2 py-1 rounded-md bg-muted">
                {leadPassenger.type === "adult" ? "Adult" : "Child"}
              </span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                placeholder="John Doe"
                {...form.register("leadPassenger.fullName")}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                placeholder="john@doe.com"
                {...form.register("email")}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                placeholder="+51 987 654 321"
                {...form.register("phone")}
              />
            </div>
            <div className="space-y-2">
              <Label>Document</Label>
              <Input
                placeholder="Passport / DNI"
                {...form.register("leadPassenger.document")}
              />
            </div>
          </div>
        </div>

        {fields.map((field, index) => {
          const passenger = passengerManifest[index + 1];

          return (
            <div
              key={field.id}
              className="rounded-2xl border p-5 space-y-5 bg-card"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">
                  Passenger {index + 2}
                  <span className="ml-2 text-sm text-muted-foreground">
                    (optional)
                  </span>
                </h4>
                <div className="flex items-center gap-2 font-medium select-none">
                  <span className="text-xs px-2 py-1 rounded-md bg-muted">
                    {passenger.type === "adult" ? "Adult" : "Child"}
                  </span>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full name</Label>
                  <Input
                    placeholder={`Name of passenger ${index + 2}`}
                    {...form.register(`passengers.${index}.fullName`)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Document</Label>
                  <Input
                    placeholder="Passport / DNI"
                    {...form.register(`passengers.${index}.document`)}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}