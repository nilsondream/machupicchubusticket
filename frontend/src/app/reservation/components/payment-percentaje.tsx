"use client";

import { cn } from "@/lib/utils";
import { useReservationStore } from "@/store/reservation-store";
import { Check } from "lucide-react";

const paymentParts = [
  { percent: 50, label: "Half", },
  { percent: 100, label: "Total", },
]

export default function PaymentPercentage() {
  const {
    paymentPercentage,
    setPaymentPercentage,
  } = useReservationStore();

  return (
    <div className="grid grid-cols-2 gap-3">
      {paymentParts.map((item) => (
        <button
          key={item.percent}
          onClick={() => setPaymentPercentage(item.percent as 100 | 50)}
          className={cn("rounded-xl border p-4 cursor-pointer relative text-left", paymentPercentage === item.percent ? "border-foreground" : "hover:border-primary/50")}
        >
          <p className="text-sm">{item.label}</p>
          <p className="mt-2 text-lg font-semibold">{item.percent}%</p>
          {paymentPercentage === item.percent && (
            <Check size={20} className="absolute top-0 right-0 m-2 bg-foreground text-background rounded-full p-1" />
          )}
        </button>
      ))}
    </div>
  );
}