import { useEffect, useRef, useState } from "react";
import { BusFront, ChevronDown } from "lucide-react";
import { useReservationStore } from "@/store/reservation.store";
import { cn } from "@/lib/utils";
import { TripType } from "@/lib/pricing";
import { TRIP_TYPE_LABELS } from "@/data/tickets.data";

const TravelType = ({ edit }: { edit?: boolean }) => {
  const { tripType, setTripType } = useReservationStore();

  const typeRef = useRef<HTMLDivElement>(null);
  const [openType, setOpenType] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openType && typeRef.current && !typeRef.current.contains(event.target as Node)) {
        setOpenType(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openType]);

  return (
    <div className="relative" ref={typeRef}>
      <div
        onClick={() => setOpenType(!openType)}
        className={cn(
          "cursor-pointer flex flex-col justify-between h-full",
          openType ?
            edit ? "bg-muted dark:bg-card" : "bg-muted dark:bg-background/50" :
            edit ? "bg-card hover:border-primary/50" : "hover:bg-muted dark:hover:bg-background/50"
          ,
          edit ? "rounded-2xl border p-4 max-md:py-2 max-md:px-3 gap-1" : "py-3 px-8 rounded-full max-md:rounded-2xl gap-2"
        )}
      >
        <p className="text-muted-foreground text-sm max-md:text-xs mt-1">
          Trip type
        </p>
        <div className="cursor-pointer w-full font-semibold flex items-center justify-between">
          <div className="flex items-center gap-3 max-md:gap-2">
            {!edit && <BusFront className="size-5 max-md:size-4" />}
            <span className={cn("line-clamp-1", edit ? "text-base" : "text-lg max-md:text-base")}>
              {TRIP_TYPE_LABELS[tripType] ?? "Select trip type"}
            </span>
          </div>
          <ChevronDown className={cn("size-5 transition-transform md:hidden max-md:size-4 shrink-0", openType && "rotate-180")} />
        </div>
      </div>

      {openType && (
        <div className="absolute top-full left-0 w-full mt-1 z-50 max-md:w-50">
          <div className="rounded-3xl p-2 border overflow-hidden bg-background dark:bg-muted shadow-xl space-y-1">
            {Object.entries(TRIP_TYPE_LABELS).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setTripType(key as TripType);
                  setOpenType(false);
                }}
                className={cn("cursor-pointer w-full px-3 py-2 text-left rounded-xl font-medium",
                  tripType === key ? "bg-orange-500 text-white" : "hover:bg-muted dark:hover:bg-background"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TravelType