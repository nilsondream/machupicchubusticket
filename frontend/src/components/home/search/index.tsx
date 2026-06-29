"use client"

import { BusFront, Calendar, ChevronDown, Minus, Plus, UserRound } from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState, useRef, useMemo } from "react"
import { cn } from "@/lib/utils"
import { addDays, format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { busTicketData } from "@/data/tickets.data"
import { useReservationStore } from "@/store/reservation.store"
import TypeTravel from "./type-travel"
import DateTravel from "./date-travel"
import PassengerTravel from "./passenger-travel"

const SearchReservation = () => {
  const router = useRouter();

  const { travelType, travelDate } = useReservationStore();

  function handleContinue(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!travelType) {
      toast.error("Selecciona un tipo de ticket");
      return;
    }

    if (!travelDate) {
      toast.error("Selecciona una fecha");
      return;
    }

    router.push("/reservation");
  }

  return (
    <div className="-mt-14 absolute z-20 w-full max-md:px-4 max-md:-mt-37">
      <form onSubmit={handleContinue}>
        <div className="bg-background dark:bg-muted rounded-full max-md:rounded-3xl p-4 shadow-2xl max-md:shadow-xl max-w-6xl mx-auto flex max-md:flex-col items-center gap-4 max-md:p-2">
          <div className="grid grid-cols-3 items-center gap-4 max-md:gap-0 w-full max-md:grid-cols-1">
            <TypeTravel />
            <DateTravel />
            <PassengerTravel />
          </div>

          <Button variant="search" size="big-search" type="submit" disabled={!travelDate || !travelDate}>
            Book Now
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchReservation;