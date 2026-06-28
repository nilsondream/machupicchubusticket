"use client";

import { Button } from "@/components/ui/button";
import ReservationSummary from "./reservation-summary";
import PaymentMethod from "./payment-method";

export default function PaymentCard() {
  async function handlePayment() {
    console.log("Create reservation");
    // Aquí después llamaremos al endpoint
    // POST /api/reservation

  }

  return (
    <aside className="space-y-5 col-span-2">
      <PaymentMethod />
      <ReservationSummary />
      <Button
        className="mt-8 w-full"
        onClick={handlePayment}
      >
        Continue to payment
      </Button>
    </aside>

  );

}