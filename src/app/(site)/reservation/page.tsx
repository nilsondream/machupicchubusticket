"use client";

import { useRouter } from "next/navigation";
import PassengerForm from "./components/passenger-form";
import PaymentCard from "./components/payment-card";
import ReservationModify from "./components/reservation-modify";
import { useReservationStore } from "@/store/reservation.store";
import { useEffect, useState } from "react";

export default function ReservationPage() {
    const router = useRouter();
    const { tripType, departureDate } = useReservationStore();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Pequeño delay para dar tiempo a que el store se hidrate
        const timer = setTimeout(() => {
            if (!tripType || !departureDate) {
                router.replace("/");
            } else {
                setIsLoading(false);
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [tripType, departureDate, router]);

    // Mostrar loader mientras verificamos
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Cargando reserva...</p>
                </div>
            </div>
        );
    }

    // Si después de verificar no hay datos → redirigir (protección)
    if (!tripType || !departureDate) {
        return null;
    }

    return (
        <main>
            <div className="fixed top-18 border-b w-full py-5 max-md:py-0 bg-background z-20">
                <ReservationModify />
            </div>
            <div className="max-w-6xl mx-auto py-20 mt-42 max-md:mt-38 max-md:px-4">
                <div className="grid gap-5 grid-cols-5 items-start max-md:grid-cols-1">
                    <PassengerForm />
                    <PaymentCard />
                </div>
            </div>
        </main>
    );
}