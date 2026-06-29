"use client";

import { cn } from "@/lib/utils";
import { useReservationStore } from "@/store/reservation.store";
import { Check, CreditCard, Landmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icons from "@/components/ui/icons";

const paymentMethods = [
  { id: "card", name: "Izipay", taxes: "5%", icon: <CreditCard /> },
  { id: "paypal", name: "PayPal", taxes: "7% + $0.3", icon: <Icons.PayPal /> },
  { id: "cash", name: "Transferencia", taxes: "Sin comisión", icon: <Landmark /> },
]

export default function PaymentMethod() {
  const { paymentMethod, setPaymentMethod, } = useReservationStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Método de pago</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setPaymentMethod(method.id as "card" | "paypal" | "transfer")}
              className={cn(
                "cursor-pointer px-4 py-2.5 rounded-xl border transition-all relative",
                paymentMethod === method.id ? "border-primary/50 bg-input/25" : "hover:border-primary/50"
              )}
            >
              <div className="flex flex-col gap-2 items-center">
                {method.icon}
                <div>
                  <p className="font-medium text-sm">{method.name}</p>
                  <span className="text-xs text-muted-foreground">{method.taxes}</span>
                </div>
              </div>
              {paymentMethod === method.id && (
                <Check size={20} className="absolute top-0 right-0 m-2 bg-primary text-background rounded-full p-1" />
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}