import { PassengerType, PaymentMethod, TripType } from "@/lib/pricing";

export const TRIP_TYPE_LABELS: Record<TripType, string> = {
  round_trip: "Round trip",
  one_way: "Outward journey",
  return_only: "Return journey",
};
 
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  paypal: "PayPal",
  card: "Tarjeta",
  transfer: "Transferencia",
  none: ""
};
 
export const PASSENGER_TYPE_LABELS: Record<PassengerType, { title: string; subtitle: string }> = {
  adult: { title: "Adult", subtitle: "12+ años" },
  child: { title: "Child", subtitle: "5-11 años" },
  adultForeign: { title: "Foreign dult", subtitle: "12+ años" },
  childForeign: { title: "Foreign child", subtitle: "5-11 años" },
};