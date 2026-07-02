import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
    PassengerType,
    PaymentMethod,
    PaymentAmountType,
    TripType,
    calculateSubtotal,
    calculateAmountBase,
    calculateCommission,
    calculateTotalToPay,
} from "@/lib/pricing";

export interface PassengerDetail {
    id: string;
    type: PassengerType;
    fullName: string;
    documentType: string;
    documentNumber: string;
    isPrimary: boolean;
}

const MIN_ADULTS = 1;

function createPassenger(type: PassengerType, isPrimary: boolean = false): PassengerDetail {
    return {
        id: crypto.randomUUID(),
        type,
        fullName: "",
        documentType: "Passport",
        documentNumber: "",
        isPrimary,
    };
}

interface ReservationStore {
    tripType: TripType;
    departureDate: string | null; // ISO yyyy-mm-dd (viene de <input type="date">)
    returnDate: string | null;

    passengers: PassengerDetail[];

    paymentMethod: PaymentMethod;
    paymentAmountType: PaymentAmountType;

    // actions
    setTripType: (type: TripType) => void;
    setDepartureDate: (date: string | null) => void;
    setReturnDate: (date: string | null) => void;
    incrementPassenger: (type: PassengerType) => void;
    decrementPassenger: (type: PassengerType) => void;
    updatePassengerField: (
        id: string,
        field: "fullName" | "documentType" | "documentNumber",
        value: string
    ) => void;
    setPaymentMethod: (method: PaymentMethod) => void;
    setPaymentAmountType: (type: PaymentAmountType) => void;
    resetForm: () => void;

    // selectors
    getCountByType: (type: PassengerType) => number;
    getTotalPassengers: () => number;
    getSubtotal: () => number;
    getAmountBase: () => number;
    getCommission: () => number;
    getTotalToPay: () => number;
}

export const useReservationStore = create<ReservationStore>()(
    persist(
        (set, get) => ({
            tripType: "round_trip",
            departureDate: null,
            returnDate: null,
            passengers: [createPassenger("adult", true)], // arranca con 1 adulto obligatorio y principal
            paymentMethod: "none", // ningún método de pago seleccionado al inicio
            paymentAmountType: "none", // ningún porcentaje de pago seleccionado al inicio

            setTripType: (type) => set({ tripType: type }),
            setDepartureDate: (date) => set({ departureDate: date }),
            setReturnDate: (date) => set({ returnDate: date }),

            incrementPassenger: (type) =>
                set((state) => ({
                    passengers: [...state.passengers, createPassenger(type)],
                })),

            decrementPassenger: (type) =>
                set((state) => {
                    const ofType = state.passengers.filter((p) => p.type === type);
                    if (type === "adult" && ofType.length <= MIN_ADULTS) return state; // mínimo 1 adulto
                    if (ofType.length === 0) return state;
                    const lastIndex = state.passengers.lastIndexOf(ofType[ofType.length - 1]);
                    const next = [...state.passengers];
                    next.splice(lastIndex, 1);
                    return { passengers: next };
                }),

            updatePassengerField: (id, field, value) =>
                set((state) => ({
                    passengers: state.passengers.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
                })),

            setPaymentMethod: (method) => set({ paymentMethod: method }),
            setPaymentAmountType: (type) => set({ paymentAmountType: type }),

            resetForm: () =>
                set({
                    tripType: "round_trip",
                    departureDate: null,
                    returnDate: null,
                    passengers: [createPassenger("adult", true)],
                    paymentMethod: "none", // ningún método de pago seleccionado al inicio
                    paymentAmountType: "none", // ningún porcentaje de pago seleccionado al inicio
                }),

            getCountByType: (type) => get().passengers.filter((p) => p.type === type).length,
            getTotalPassengers: () => get().passengers.length,
            getSubtotal: () => calculateSubtotal(get().tripType, get().passengers.map((p) => p.type)),
            getAmountBase: () => calculateAmountBase(get().getSubtotal(), get().paymentAmountType),
            getCommission: () => calculateCommission(get().getSubtotal(), get().paymentMethod), // Comisión sobre el subtotal completo, no sobre amountBase
            getTotalToPay: () => {
                const amountBase = get().getAmountBase();
                const commission = get().getCommission();
                if (get().paymentAmountType === "half") {
                    return calculateTotalToPay(amountBase, commission / 2);
                }
                return calculateTotalToPay(amountBase, commission);
            },
        }),
        {
            name: "reservation-store",
            /*partialize: (state) => ({
                selectedTravelType: state.tripType,
                selectedDateOutbound: state.departureDate,
                passengers: state.passengers,
            }),*/
        }
    )
);