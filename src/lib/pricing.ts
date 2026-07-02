export type PassengerType = "adult" | "child" ;
export type PaymentMethod = "paypal" | "card" | "transfer" | "none";
export type PaymentAmountType = "total" | "half" | "none";
export type TripType = "round_trip" | "one_way" | "return_only";

// Tarifa base por tipo de viaje y tipo de pasajero (ajustar según tus tarifas reales).
export const PASSENGER_PRICING: Record<TripType, Record<PassengerType, number>> = {
  round_trip: { adult: 34, child: 18 },     // ida + vuelta
  one_way: { adult: 19, child: 13 },        // solo ida
  return_only: { adult: 19, child: 13 },    // solo retorno
};

// Comisión por método de pago, como porcentaje del monto que se cobra
export const COMMISSION_RATES: Record<PaymentMethod, number> = {
  paypal: 0.07,   // 7%
  card: 0.05,     // 5%
  transfer: 0,    // sin comisión, validación manual
  none: 0         // inicial
};

export function calculateSubtotal(tripType: TripType, passengerTypes: PassengerType[]): number {
  const pricing = PASSENGER_PRICING[tripType];
  return passengerTypes.reduce((sum, type) => sum + pricing[type], 0);
}

export function calculateAmountBase(subtotal: number, amountType: PaymentAmountType): number {
  if (amountType === "none") return 0;
  return amountType === "total" ? subtotal : subtotal / 2;
}

export function calculateCommission(amountBase: number, method: PaymentMethod): number {
  if (method === "none") return 0;
  return Number((amountBase * COMMISSION_RATES[method]).toFixed(2));
}

export function calculateTotalToPay(amountBase: number, commission: number): number {
  return Number((amountBase + commission).toFixed(2));
}