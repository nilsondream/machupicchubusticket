"use client";

import { cn } from "@/lib/utils";
import { useReservationStore } from "@/store/reservation.store";
import { Check } from "lucide-react";

const paymentParts = [
  { percent: 50, label: "half", },
  { percent: 100, label: "total", },
];

export default function PaymentPercentage() {
  const { paymentAmountType, setPaymentAmountType } = useReservationStore();

  return (
    <div className="grid grid-cols-2 gap-3">
      {paymentParts.map((item) => (
        <button
          key={item.percent}
          onClick={() => setPaymentAmountType(item.label as "none" | "half" | "total")}
          className={cn(
            "rounded-xl border p-4 cursor-pointer relative text-left",
            paymentAmountType === item.label ? "border-primary/50 bg-input/25" : "hover:border-primary/50",
            item.label === "none" && "opacity-50 cursor-default bg-muted/50"
          )}
          disabled={item.label === "none"}
        >
          <p className="text-sm capitalize">{item.label}</p>
          <p className="mt-2 text-lg font-semibold">{item.percent}%</p>
          {paymentAmountType === item.label && (
            <Check size={20} className="absolute top-0 right-0 m-2 bg-primary text-background rounded-full p-1" />
          )}
        </button>
      ))}
    </div>
  );
}