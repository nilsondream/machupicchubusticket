"use client"

import { useRouter } from "next/navigation"
import { FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { useReservationStore } from "@/store/reservation.store"
import { toast } from "sonner"
import TravelDate from "./travel-date"
import TravelType from "./travel-type"
import TravelPassenger from "./travel-passenger"

const SearchReservation = () => {
  const router = useRouter();
  const { tripType, departureDate } = useReservationStore();

  function handleContinue(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!tripType) {
      toast.warning("Select a ticket type");
      return;
    }

    if (!departureDate) {
      toast.warning("Select a date");
      return;
    }

    router.push("/reservation");
  }

  return (
    <div className="-mt-14 absolute z-20 w-full max-md:px-4 max-md:-mt-34">
      <form onSubmit={handleContinue}>
        <div className="bg-background dark:bg-muted rounded-full max-md:rounded-3xl p-4 shadow-xl max-md:shadow-lg max-w-6xl mx-auto flex max-md:flex-col items-center gap-4 max-md:p-2">
          <div className="grid grid-cols-3 items-center gap-4 max-md:gap-0 w-full max-md:grid-cols-1">
            <TravelType />
            <TravelDate />
            <TravelPassenger />
          </div>

          <Button variant="search" size="big-search" type="submit" disabled={!tripType}>
            Book Now
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchReservation;