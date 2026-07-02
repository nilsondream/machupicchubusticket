import { useEffect, useRef, useState } from "react";
import { ChevronDown, Minus, Plus, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useReservationStore } from "@/store/reservation.store";
import { PassengerType } from "@/lib/pricing";

const PASSENGER_TYPE_LABELS: Record<PassengerType, { title: string; subtitle?: string }> = {
  adult: { title: "Adult" },
  child: { title: "Child", subtitle: "Age 3 to 11 years" },
};

function Counter({ type }: { type: PassengerType }) {
  const count = useReservationStore((s) => s.getCountByType(type));
  const increment = useReservationStore((s) => s.incrementPassenger);
  const decrement = useReservationStore((s) => s.decrementPassenger);
  const { title, subtitle } = PASSENGER_TYPE_LABELS[type];

  return (
    <div className="flex items-center justify-between p-2">
      <div>
        <p className="font-medium">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground">({subtitle})</p>}
      </div>
      <div className="flex items-center">
        <Button variant="outline" size="icon" className="rounded-full" onClick={() => decrement(type)} disabled={count === 0}>
          <Minus size={16} />
        </Button>
        <span className="w-8 text-center font-medium">{count}</span>
        <Button variant="outline" size="icon" className="rounded-full" onClick={() => increment(type)} disabled={count === 5}>
          <Plus size={16} />
        </Button>
      </div>
    </div>
  );
}

const TravelPassenger = ({ edit }: { edit?: boolean }) => {
  const totalPassengers = useReservationStore((s) => s.getTotalPassengers());

  const passengerRef = useRef<HTMLDivElement>(null);
  const [openPassenger, setOpenPassenger] = useState(false)
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

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

  const displayCount = mounted ? totalPassengers : 1;

  return (
    <div className="h-full relative" ref={passengerRef}>
      <div
        onClick={() => setOpenPassenger(!openPassenger)}
        className={cn(
          "cursor-pointer flex flex-col justify-between h-full",
          openPassenger ?
            edit ? "bg-muted dark:bg-card" : "bg-muted dark:bg-background/50" :
            edit ? "bg-card hover:border-primary/50" : "hover:bg-muted dark:hover:bg-background/50"
          ,
          edit ? "rounded-2xl border p-4 gap-1 max-md:py-2 max-md:px-3" : "py-3 px-8 max-md:px-3 max-md:py-2 rounded-full max-md:rounded-2xl gap-2 max-md:gap-1"
        )}
      >
        <p className="text-muted-foreground text-sm">
          Passengers
        </p>
        <div className="cursor-pointer w-full font-semibold flex items-center justify-between">
          <div className="flex items-center gap-3 max-md:gap-2">
            {!edit && <UserRound className="size-5 max-md:size-4" />}
            <span className={cn("line-clamp-1", edit ? "text-base" : "text-lg max-md:text-base")}>
              {displayCount} {displayCount === 1 ? "Passenger" : "Passengers"}
            </span>
          </div>
          <ChevronDown className={cn("size-5 transition-transform md:hidden max-md:size-4 shrink-0", openPassenger && "rotate-180")} />
        </div>
      </div>

      {openPassenger && (
        <div className="absolute top-full left-0 w-full mt-1 z-50 max-md:w-60 max-md:right-0 max-md:left-auto">
          <div className="rounded-3xl p-2 border overflow-hidden bg-background dark:bg-muted shadow-xl space-y-0">
            <Counter type="adult" />
            <hr />
            <Counter type="child" />
          </div>
        </div>
      )}
    </div>
  )
}

export default TravelPassenger