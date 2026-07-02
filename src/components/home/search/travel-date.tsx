import { useEffect, useRef, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { addDays, format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useReservationStore } from "@/store/reservation.store";

const TravelDate = ({ edit }: { edit?: boolean }) => {
  const { departureDate, setDepartureDate } = useReservationStore();

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
        onClick={() => setOpenCalendar(!openCalendar)}
        className={cn(
          "cursor-pointer flex flex-col justify-between h-full",
          openCalendar ?
            edit ? "bg-muted dark:bg-card" : "bg-muted dark:bg-background/50" :
            edit ? "bg-card hover:border-primary/50" : "hover:bg-muted dark:hover:bg-background/50"
          ,
          edit ? "rounded-2xl border p-4 gap-1 max-md:py-2 max-md:px-3" : "py-3 px-8 max-md:px-3 max-md:py-2 rounded-full max-md:rounded-2xl gap-2 max-md:gap-1"
        )}
      >
        <p className="text-muted-foreground text-sm">
          Travel Date
        </p>
        <div className="cursor-pointer w-full font-semibold max-md:mt-0 flex items-center justify-between">
          <div className="flex items-center gap-3 max-md:gap-2">
            {!edit && <CalendarIcon className="size-5 max-md:size-4" />}
            <span className={cn("line-clamp-1", edit ? "text-base" : "text-lg max-md:text-base")}>
              {departureDate
                ? format(parseISO(departureDate), "EEEE dd, MMMM", { locale: enUS })
                : "Select a date"}
            </span>
          </div>
          <ChevronDown className={cn("size-5 max-md:size-4 transition-transform md:hidden shrink-0", openCalendar && "rotate-180")} />
        </div>
      </div>

      {openCalendar && (
        <div className="absolute top-full left-0 w-full mt-1 z-30">
          <div className="">
            <Calendar
              className="w-full rounded-3xl border shadow-xl"
              mode="single"
              locale={enUS}
              selected={departureDate ? parseISO(departureDate) : undefined}
              onSelect={(date) => {
                if (date) {
                  setDepartureDate(format(date, "yyyy-MM-dd"));
                  setOpenCalendar(false);
                }
              }}
              disabled={(date) => date <= addDays(new Date(), 2)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default TravelDate