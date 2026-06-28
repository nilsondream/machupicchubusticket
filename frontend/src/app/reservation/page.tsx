"use client";

import { useRouter } from "next/navigation";
import { useReservationStore } from "@/store/reservation-store";

import PassengerForm from "./components/passenger-form";
import PaymentCard from "./components/payment-card";
import { format, parseISO } from "date-fns";
import { enUS, es } from "date-fns/locale"

export default function ReservationPage() {
    const router = useRouter();
    const { travelType, travelDate, passengers } = useReservationStore();

    // Si entran directamente sin pasar por el Home
    if (!travelType || !travelDate) {
        router.replace("/");
        return null;
    }

    return (
        <main>
            <div className="fixed top-18 border-b w-full py-5 bg-background z-40">
                <div className="max-w-6xl mx-auto">
                    <span className="font-medium">Modifica tu reserva</span>
                    <div className="grid grid-cols-3 gap-5 mt-2.5">
                        <div className="rounded-2xl border p-4 space-y-1 cursor-pointer bg-card hover:border-primary/50">
                            <p className="text-sm text-muted-foreground">Tipo de viaje</p>
                            <p className="font-semibold text-foreground">
                                {travelType ?? ""}
                            </p>
                        </div>
                        <div className="rounded-2xl border p-4 space-y-1 cursor-pointer bg-card hover:border-primary/50">
                            <p className="text-sm text-muted-foreground">Fecha de salida</p>
                            <p className="font-semibold text-foreground">
                                {travelDate ? format(parseISO(travelDate), "EEEE dd, MMMM", { locale: enUS }) : "—"}
                            </p>
                        </div>
                        <div className="rounded-2xl border p-4 space-y-1 cursor-pointer bg-card hover:border-primary/50">
                            <p className="text-sm text-muted-foreground">Cantidad de pasajeros</p>
                            <p className="font-semibold text-foreground">{passengers.adults + passengers.children}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-6xl mx-auto py-20 mt-42">
                <div className="grid gap-5 grid-cols-5 items-start">
                    <PassengerForm />
                    <PaymentCard />
                </div>
            </div>
        </main>
    );
}