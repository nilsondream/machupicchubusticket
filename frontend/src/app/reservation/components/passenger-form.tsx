"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reservationSchema, ReservationForm } from "@/lib/validations/reservation";
import { useReservationStore } from "@/store/reservation-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo } from "react";
import { busTicketData } from "@/data/bus-ticket-data";

export default function PassengerForm() {
  const { passengers, travelType, nationality } = useReservationStore();

  const totalPassengers = passengers.adults + passengers.children;

  const form = useForm<ReservationForm>({
    resolver: zodResolver(reservationSchema),

    defaultValues: {
      email: "",
      phone: "",

      leadPassenger: {
        fullName: "",
        documentType: "passport",
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

  const ticket = useMemo(() => {
    return busTicketData.find(
      t => t.typeTravel === travelType
    );
  }, [travelType]);

  return (
    <div className="col-span-3">
      <div className="space-y-5">
        <div className="rounded-2xl border p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">
              Passenger 1
            </h4>
            <div className="flex items-center gap-2 font-medium select-none">
              <span className="text-xs px-2 py-1 rounded-md bg-orange-500 text-white">
                Principal Traveler
              </span>
              <span className="text-xs px-2 py-1 rounded-md bg-muted">
                Adult
              </span>
              <span className="text-xs px-2 py-1 rounded-md bg-muted">
                Foreign
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
              <Label>Document type</Label>
              <div className="rounded-lg h-9 border w-full pr-2 overflow-hidden text-sm dark:bg-input/30">
                <select
                  {...form.register("leadPassenger.documentType")}
                  className="h-full w-full outline-none pl-2"
                >
                  <option value="passport" className="bg-background">Passport</option>
                  <option value="dni" className="bg-background">DNI</option>
                </select>
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Document</Label>
              <Input
                placeholder="Passport / DNI"
                {...form.register("leadPassenger.document")}
              />
            </div>
          </div>
        </div>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-2xl border p-5 space-y-4"
          >
            <h4 className="font-semibold mb-4">
              Passenger {index + 2}
              <span className="ml-2 text-sm text-muted-foreground">
                (optional)
              </span>
            </h4>
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
        ))}
      </div>
    </div>
  );
}