import { useEffect, useMemo, useRef, useState } from "react";
import { BusFront, ChevronDown } from "lucide-react";
import { useReservationStore } from "@/store/reservation.store";
import { cn } from "@/lib/utils";
import { busTicketData } from "@/data/tickets.data";

const TypeTravel = () => {
  const { travelType, setTravelType } = useReservationStore();

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

  const selectedTicket = useMemo(() =>
    busTicketData.find((ticket) => ticket.typeTravel === travelType),
    [travelType]
  );

  return (
    <div className="relative" ref={typeRef}>
      <div
        className={cn("py-2 px-8 rounded-full cursor-pointer max-md:rounded-2xl max-md:px-4",
          openType ? "bg-muted dark:bg-background/50" : "hover:bg-muted dark:hover:bg-background/50"
        )}
        onClick={() => setOpenType(!openType)}
      >
        <label className="uppercase text-xs max-md:text-[10px] tracking-widest text-muted-foreground">
          Trip Type
        </label>
        <div className="cursor-pointer w-full font-semibold mt-2 max-md:mt-0 flex items-center justify-between">
          <div className="flex items-center gap-3 max-md:gap-2 text-nowrap text-lg max-md:text-base">
            <BusFront className="size-5 max-md:size-4" />
            <span className="line-clamp-1">
              {selectedTicket?.name ?? "Select trip type"}
            </span>
          </div>
          <ChevronDown size={20} className={cn("transition-transform md:hidden", openType && "rotate-180")} />
        </div>
      </div>

      {openType && (
        <div className="absolute top-full left-0 w-full mt-1 z-50">
          <div className="rounded-3xl p-2 border overflow-hidden bg-background dark:bg-muted shadow-xl space-y-1">
            {busTicketData.map((ticket) => (
              <button
                key={ticket.id}
                type="button"
                onClick={() => {
                  setTravelType(ticket.typeTravel);
                  setOpenType(false);
                }}
                className={cn("cursor-pointer w-full px-3 py-2 text-left rounded-xl font-medium",
                  travelType === ticket.id ? "bg-orange-500 text-white" : "hover:bg-muted dark:hover:bg-background"
                )}
              >
                {ticket.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TypeTravel