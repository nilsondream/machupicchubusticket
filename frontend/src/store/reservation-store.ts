import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TravelType = "roundtrip" | "oneway-go" | "oneway-return";

export type Nationality = "foreign" | "national";


const initialState = {
    travelType: null as TravelType | null,
    travelDate: null as string | null,
    nationality: "foreign" as Nationality,

    passengers: {
        adults: 1,
        children: 0,
    },

    paymentMethod: null as "card" | "paypal" | "transfer" | null,
    paymentPercentage: null as 100 | 50 | null,
    //paymentTaxes: null as 0.05 | 0.1 | 0 | null,
};

type ReservationStore = {
    // State
    travelType: TravelType | null;
    travelDate: string | null;
    nationality: Nationality;
    passengers: {
        adults: number;
        children: number;
    };
    paymentMethod: "card" | "paypal" | "transfer" | null;
    paymentPercentage: 100 | 50 | null;

    // Actions
    setTravelType: (travelType: TravelType) => void;
    setTravelDate: (date: string) => void;
    setNationality: (nationality: Nationality) => void;
    setPassengers: (passengers: { adults: number; children: number }) => void;
    setPaymentMethod: (method: "card" | "paypal" | "transfer") => void;
    setPaymentPercentage: (percentage: 100 | 50) => void;

    increaseAdults: () => void;
    decreaseAdults: () => void;
    increaseChildren: () => void;
    decreaseChildren: () => void;

    reset: () => void;
};

export const useReservationStore = create<ReservationStore>()(
    persist(
        (set) => ({
            ...initialState,

            // Actions
            setTravelType: (travelType) => set({ travelType }),
            setTravelDate: (travelDate) => set({ travelDate }),
            setNationality: (nationality) => set({ nationality }),
            setPassengers: (passengers) => set({ passengers }),
            setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
            setPaymentPercentage: (paymentPercentage) => set({ paymentPercentage }),

            increaseAdults: () =>
                set((state) => ({
                    passengers: {
                        ...state.passengers,
                        adults: state.passengers.adults + 1,
                    },
                })),

            decreaseAdults: () =>
                set((state) => ({
                    passengers: {
                        ...state.passengers,
                        adults: Math.max(1, state.passengers.adults - 1),
                    },
                })),

            increaseChildren: () =>
                set((state) => ({
                    passengers: {
                        ...state.passengers,
                        children: state.passengers.children + 1,
                    },
                })),

            decreaseChildren: () =>
                set((state) => ({
                    passengers: {
                        ...state.passengers,
                        children: Math.max(0, state.passengers.children - 1),
                    },
                })),

            reset: () => set(initialState),
        }),
        {
            name: "reservation-store",
        }
    )
);