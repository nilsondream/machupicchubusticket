import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Minus, Plus, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { busTicketData } from "@/data/tickets.data";
import { useReservationStore } from "@/store/reservation.store";

const PassengerTravel = () => {
  const {
    travelType,
    passengers,

    increaseAdults,
    decreaseAdults,
    increaseChildren,
    decreaseChildren,
  } = useReservationStore();

  const selectedTicket = useMemo(() =>
    busTicketData.find((ticket) => ticket.typeTravel === travelType),
    [travelType]
  );

  const totalPassengers = passengers.adults + passengers.children;

  const passengerRef = useRef<HTMLDivElement>(null);
  const [openPassenger, setOpenPassenger] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openPassenger && passengerRef.current && !passengerRef.current.contains(event.target as Node)) {
        setOpenPassenger(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openPassenger]);

  return (
    <div className="relative" ref={passengerRef}>
      <div
        className={cn("py-2 px-8 rounded-full max-md:rounded-2xl max-md:px-4 cursor-pointer",
          openPassenger ? "bg-muted dark:bg-background/50" : "hover:bg-muted dark:hover:bg-background/50"
        )}
        onClick={() => setOpenPassenger(!openPassenger)}
      >
        <label className="uppercase text-xs max-md:text-[10px] tracking-widest text-muted-foreground text-nowrap">
          Passengers
        </label>
        <div className="cursor-pointer w-full font-semibold mt-2 max-md:mt-0 flex items-center justify-between">
          <div className="flex items-center gap-3 max-md:gap-2 text-nowrap text-lg max-md:text-base">
            <UserRound className="size-5 max-md:size-4" />
            <span>{totalPassengers} {totalPassengers === 1 ? "Passenger" : "Passengers"}</span>
          </div>
          <ChevronDown size={20} className={cn("transition-transform md:hidden", openPassenger && "rotate-180")} />
        </div>
      </div>

      {openPassenger && selectedTicket && (
        <div className="absolute top-full left-0 w-full mt-1 z-50">
          <div className="rounded-3xl p-2 border overflow-hidden bg-background dark:bg-muted shadow-xl space-y-0">
            {Object.entries(selectedTicket.prices).map(([passengerKey]) => {
              const count = passengerKey === "adult" ? passengers.adults : passengers.children;

              return (
                <div
                  key={passengerKey}
                  className="w-full px-3 py-2 flex items-center justify-between border-b last:border-none"
                >
                  <div className="flex flex-col gap-0.5">
                    <p className="font-semibold capitalize">{passengerKey}</p>
                    {passengerKey === "child" && <span className="text-xs text-muted-foreground">({selectedTicket.prices.child.description})</span>}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      className="rounded-full"
                      disabled={passengerKey === "adult" ? passengers.adults <= 1 : passengers.children <= 0}
                      onClick={() => {
                        passengerKey === "adult" ? decreaseAdults() : decreaseChildren();
                      }}
                    >
                      <Minus />
                    </Button>
                    <p className="w-5 text-center font-semibold">{count}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      className="rounded-full"
                      disabled={count >= 5}
                      onClick={() => {
                        passengerKey === "adult" ? increaseAdults() : increaseChildren();
                      }}
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default PassengerTravel