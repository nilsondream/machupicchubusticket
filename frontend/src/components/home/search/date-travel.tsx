import { useEffect, useRef, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { addDays, format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useReservationStore } from "@/store/reservation.store";

const DateTravel = () => {
  const { travelDate, setTravelDate } = useReservationStore();

  const calendarRef = useRef<HTMLDivElement>(null);
  const [openCalendar, setOpenCalendar] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openCalendar && calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setOpenCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openCalendar]);

  return (
    <div className="relative" ref={calendarRef}>
      <div
        className={cn("py-2 px-8 rounded-full max-md:rounded-2xl max-md:px-4 cursor-pointer",
          openCalendar ? "bg-muted dark:bg-background/50" : "hover:bg-muted dark:hover:bg-background/50"
        )}
        onClick={() => setOpenCalendar(!openCalendar)}
      >
        <label className="uppercase text-xs max-md:text-[10px] tracking-widest text-muted-foreground text-nowrap">
          Travel Date
        </label>
        <div className="cursor-pointer w-full font-semibold mt-2 max-md:mt-0 flex items-center justify-between">
          <div className="flex items-center gap-3 max-md:gap-2 text-nowrap text-lg max-md:text-base">
            <CalendarIcon className="size-5 max-md:size-4" />
            <span className="line-clamp-1">
              {travelDate
                ? format(parseISO(travelDate), "EEEE dd, MMMM", { locale: enUS })
                : "Select a date"}
            </span>
          </div>
          <ChevronDown size={20} className={cn("opacity-0 max-md:opacity-100", openCalendar && "rotate-180")} />
        </div>
      </div>

      {openCalendar && (
        <div className="absolute top-full left-0 w-full mt-1 z-50">
          <div className="">
            <Calendar
              className="w-full rounded-3xl border shadow-xl"
              mode="single"
              locale={enUS}
              selected={travelDate ? parseISO(travelDate) : undefined}
              onSelect={(date) => {
                if (date) {
                  setTravelDate(format(date, "yyyy-MM-dd"));
                  setOpenCalendar(false);
                }
              }}
              disabled={(date) => date <= addDays(new Date(), 0)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default DateTravel