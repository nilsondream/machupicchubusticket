"use client";

import { useMemo } from "react";
import { busTicketData } from "@/data/bus-ticket-data";
import { useReservationStore } from "@/store/reservation-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import PaymentPercentage from "./payment-percentaje";
import { ShieldCheck } from "lucide-react";

export default function ReservationSummary() {
  const {
    travelType,
    travelDate,
    nationality,
    passengers,
    paymentPercentage,
    paymentMethod
  } = useReservationStore();

  const ticket = useMemo(() => {
    return busTicketData.find(
      t => t.typeTravel === travelType
    );
  }, [travelType]);

  if (!ticket) return null;

  const adultTotal = passengers.adults * ticket.prices.adult[nationality];
  const childTotal = passengers.children * ticket.prices.child[nationality];
  const subtotal = adultTotal + childTotal;
  const taxes = subtotal * 0.05;
  const total = subtotal + taxes;
  const amount = paymentPercentage === 50 ? total / 2 : total;
  const pending = total - amount;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reservation Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PaymentPercentage />
        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-muted-foreground">Ticket</p>
            <span>{ticket.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span>{format(parseISO(travelDate as string), "EEEE dd, MMMM", { locale: enUS })}</span>
          </div>
          <div className="flex justify-between" >
            <div className="text-muted-foreground flex gap-2">
              <p>{passengers.adults === 1 ? "Adult" : "Adults"}</p>
              {passengers.adults !== 1 && <span>x{passengers.adults}</span>}
            </div>
            <p><span className="text-muted-foreground">({ticket.prices.adult[nationality]} x {passengers.adults})</span> $ {adultTotal.toFixed(2)}</p>
          </div>
          {passengers.children !== 0 && (
            <div className="flex justify-between" >
              <div className="text-muted-foreground flex gap-2">
                <p>{passengers.children === 1 ? "Child" : "Children"}</p>
                {passengers.children !== 1 && <span>x{passengers.children}</span>}
              </div>
              <p><span className="text-muted-foreground">({ticket.prices.child[nationality]} x {passengers.children})</span> $ {childTotal.toFixed(2)}</p>
            </div>
          )}
        </div>

        <hr />

        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-muted-foreground">Subtotal</p>
            <span>$ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Taxes</span>
            <span>$ {taxes.toFixed(2)}</span>
          </div>
        </div>

        <hr />

        <div className="flex justify-between font-bold text-lg" >
          <span>Total </span>
          <span>$ {total.toFixed(2)}</span>
        </div>
        {paymentPercentage === 50 && (
          <div className="border rounded-xl">
            <div className="flex justify-between items-center font-semibold px-3 py-2" >
              <span>Pay now</span>
              <span>$ {amount.toFixed(2)}</span>
            </div>
            <hr />
            <div className="flex items-center justify-between text-muted-foreground px-3 py-2">
              <span>Pending</span>
              <span>$ {pending.toFixed(2)}</span>
            </div>
          </div>
        )}
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <ShieldCheck size={14} />
          By continuing you accept Terms and Privacy Policy
        </div>
      </CardContent>
    </Card>
  );
}