"use client";

import { useReservationStore } from "@/store/reservation.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import { ShieldCheck } from "lucide-react";
import { PASSENGER_PRICING, TripType } from "@/lib/pricing";
import { PAYMENT_METHOD_LABELS, TRIP_TYPE_LABELS } from "@/data/tickets.data";
import { COMMISSION_RATES } from "@/lib/pricing";
import PaymentPercentage from "./payment-percentaje";
import Link from "next/link";

export default function ReservationSummary({ openModal, proceed }: { openModal: () => void; proceed: boolean }) {
  const {
    tripType,
    departureDate,
    paymentAmountType,
    paymentMethod,
    getTotalToPay
  } = useReservationStore();

  const subtotal = useReservationStore((s) => s.getSubtotal());
  const commission = useReservationStore((s) => s.getCommission());
  const getCountByType = useReservationStore((s) => s.getCountByType);
  const totalToPay = getTotalToPay();

  const adultCount = getCountByType("adult");
  const childCount = getCountByType("child");
  const tripTypeName = TRIP_TYPE_LABELS[tripType as TripType];
  const adultPrice = PASSENGER_PRICING[tripType as TripType].adult;
  const childPrice = PASSENGER_PRICING[tripType as TripType].child;
  const adultTotal = adultCount * adultPrice;
  const childTotal = childCount * childPrice;

  const total = subtotal + commission;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Reservation Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PaymentPercentage />
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-muted-foreground">Ticket</p>
              <span>{tripTypeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span>{format(parseISO(departureDate as string), "EEEE dd, MMMM", { locale: enUS })}</span>
            </div>
            <div className="flex justify-between" >
              <div className="text-muted-foreground flex gap-1">
                <p>{adultCount === 1 ? "Adult" : "Adults"}</p>
                {adultCount !== 1 && <span>x{adultCount}</span>}
              </div>
              <p>{adultCount !== 1 && <span className="text-muted-foreground">({adultCount} x ${adultPrice})</span>} ${adultTotal.toFixed(2)}</p>
            </div>
            {childCount !== 0 && (
              <div className="flex justify-between" >
                <div className="text-muted-foreground flex gap-1">
                  <p>{childCount === 1 ? "Child" : "Children"}</p>
                  {childCount !== 1 && <span>x{childCount}</span>}
                </div>
                <p>{childCount !== 1 && <span className="text-muted-foreground">({childCount} x ${childPrice})</span>} ${childTotal.toFixed(2)}</p>
              </div>
            )}
          </div>
          <hr />
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-muted-foreground">Subtotal</p>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {paymentMethod !== "none" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Taxes: {PAYMENT_METHOD_LABELS[paymentMethod]} ({(COMMISSION_RATES[paymentMethod] * 100).toFixed(1)}%)
                </span>
                <span>${commission.toFixed(2)}</span>
              </div>
            )}
          </div>
          <hr />
          <div className="flex justify-between font-bold text-lg" >
            <span>Total </span>
            <span>${total.toFixed(2)}</span>
          </div>
          {paymentAmountType === "half" && (
            <div className="border rounded-xl bg-muted/50 dark:bg-background">
              <div className="flex justify-between items-center font-semibold px-4 py-3" >
                <span>Pay now</span>
                <span className="text-base">${(total / 2).toFixed(2)}</span>
              </div>
              <hr />
              <div className="flex items-center justify-between text-muted-foreground px-4 py-3">
                <span>Pending</span>
                <span className="text-base">${(total / 2).toFixed(2)}</span>
              </div>
            </div>
          )}
          <button
            onClick={openModal}
            disabled={!proceed}
            className="w-full bg-foreground text-background cursor-pointer rounded-xl py-3 font-semibold hover:bg-orange-500 hover:text-white disabled:opacity-50 disabled:pointer-events-none disabled:select-none"
          >
            Confirm and pay (${totalToPay.toFixed(2)})
          </button>
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground [&_a]:text-foreground [&_a]:hover:underline [&_a]:hover:text-orange-500">
            <ShieldCheck size={14} />
            <p>By continuing you accept <Link href={"/terms"}>Terms</Link> and <Link href={"/privacy"}>Privacy Policy</Link></p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}