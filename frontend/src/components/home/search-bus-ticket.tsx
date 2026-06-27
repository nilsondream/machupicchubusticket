"use client"

import { useBooking } from "@/providers/bus-ticket"
import { BusFront, Calendar, ChevronDown, Minus, Plus, UserRound } from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { addDays, addMonths, format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { TicketType } from "@/types/tickets"

const DEFAULT_PRODUCT_CODE = "BUS-MACHUPICCHU"

const SearchBusTicket = () => {
  const { updateBooking } = useBooking()
  const [travelType, setTravelType] = useState<string>("") // id del ticket seleccionado
  const [departureDate, setDepartureDate] = useState("")
  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState<TicketType[]>([])

  // Passenger counts por tipo de pasajero (más flexible)
  const [passengerCounts, setPassengerCounts] = useState<Record<string, number>>({
    ADULT: 1,
    CHILD: 0,
  })

  const router = useRouter()

  // Cargar tickets
  useEffect(() => {
    async function loadTickets() {
      try {
        const response = await fetch("/api/tickets");
        const data: TicketType[] = await response.json();
        setTickets(data);

        // Seleccionar el primero por defecto si no hay selección
        if (data.length > 0 && !travelType) {
          setTravelType(data[0].id);
        }
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar los tipos de tickets");
      } finally {
        setLoading(false);
      }
    }
    loadTickets();
  }, []);

  const selectedTicket = tickets.find(t => t.id === travelType);

  const totalPassengers = Object.values(passengerCounts).reduce((a, b) => a + b, 0);

  // Refs y estados de dropdowns...
  const typeRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const passengerRef = useRef<HTMLDivElement>(null);

  const [openType, setOpenType] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openPassenger, setOpenPassenger] = useState(false);

  // Click outside logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openType && typeRef.current && !typeRef.current.contains(event.target as Node)) {
        setOpenType(false);
      }
      if (openCalendar && calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setOpenCalendar(false);
      }
      if (openPassenger && passengerRef.current && !passengerRef.current.contains(event.target as Node)) {
        setOpenPassenger(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openType, openCalendar, openPassenger]);

  const updateCount = (type: string, delta: number) => {
    setPassengerCounts((prev) => {
      const min = type === "ADULT" ? 1 : 0;
      const next = Math.max(min, Math.min(9, (prev[type] ?? 0) + delta));
      return { ...prev, [type]: next };
    });
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!travelType || !departureDate) {
      toast.warning("Por favor completa todos los campos");
      return;
    }
    if (totalPassengers < 1) {
      toast.warning("Debe haber al menos un pasajero");
      return;
    }

    updateBooking({
      travelType: travelType as "roundtrip" | "oneway-go" | "oneway-return",
      departureDate,
      returnDate: null,
      passengers: totalPassengers,
      productCode: DEFAULT_PRODUCT_CODE,
      ticketTypeId: travelType,
      ticketCounts: passengerCounts,
      passengerDetails: [],
    });

    router.push("/reservation");
  };

  return (
    <div className="-mt-14 absolute z-20 w-full max-md:px-4 max-md:-mt-37">
      <form onSubmit={handleSearch}>
        <div className="bg-background dark:bg-muted rounded-full max-md:rounded-3xl p-4 shadow-2xl max-md:shadow-xl max-w-6xl mx-auto flex max-md:flex-col items-center gap-4 max-md:p-2">
          <div className="grid grid-cols-3 items-center gap-4 max-md:gap-0 w-full max-md:grid-cols-1">

            {/* TIPO DE VIAJE / TICKET */}
            <div className="relative" ref={typeRef}>
              <div
                className={cn("py-2 px-8 rounded-full cursor-pointer max-md:rounded-2xl max-md:px-4",
                  openType ? "bg-muted dark:bg-background/50" : "hover:bg-muted dark:hover:bg-background/50"
                )}
                onClick={() => setOpenType(!openType)}
              >
                <label className="uppercase text-xs max-md:text-[10px] tracking-widest text-muted-foreground">
                  Tipo de ticket
                </label>
                <div className="cursor-pointer w-full font-semibold mt-2 max-md:mt-0 flex items-center justify-between">
                  <div className="flex items-center gap-3 max-md:gap-2 text-nowrap text-lg max-md:text-base">
                    <BusFront className="size-5 max-md:size-4" />
                    <span className="line-clamp-1">
                      {selectedTicket?.name ?? "Selecciona ticket"}
                    </span>
                  </div>
                  <ChevronDown size={20} className={cn("transition-transform md:hidden", openType && "rotate-180")} />
                </div>
              </div>

              {openType && (
                <div className="absolute top-full left-0 w-full mt-1 z-50">
                  <div className="rounded-3xl p-2 border overflow-hidden bg-background dark:bg-muted shadow-xl space-y-1">
                    {tickets.map((ticket) => (
                      <button
                        key={ticket.id}
                        type="button"
                        onClick={() => {
                          setTravelType(ticket.id);
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

            {/* === FECHA === */}
            <div className="relative" ref={calendarRef}>
              <div
                className={cn("py-2 px-8 rounded-full max-md:rounded-2xl max-md:px-4 cursor-pointer",
                  openCalendar ? "bg-muted dark:bg-background/50" : "hover:bg-muted dark:hover:bg-background/50"
                )}
                onClick={() => setOpenCalendar(!openCalendar)}
              >
                <label className="uppercase text-xs max-md:text-[10px] tracking-widest text-muted-foreground text-nowrap">
                  Fecha de viaje
                </label>
                <div className="cursor-pointer w-full font-semibold mt-2 max-md:mt-0 flex items-center justify-between">
                  <div className="flex items-center gap-3 max-md:gap-2 text-nowrap text-lg max-md:text-base">
                    <Calendar className="size-5 max-md:size-4" />
                    <span className="line-clamp-1">
                      {departureDate
                        ? format(parseISO(departureDate), "EEE dd, MMMM", { locale: es })
                        : "Selecciona una fecha"}
                    </span>
                  </div>
                  <ChevronDown size={20} className={cn("opacity-0 max-md:opacity-100", openCalendar && "rotate-180")} />
                </div>
              </div>

              {openCalendar && (
                <div className="absolute top-full left-0 w-full mt-1 z-50">
                  <div className="">
                    <CalendarComponent
                      className="w-full rounded-3xl border shadow-xl"
                      mode="single"
                      locale={es}
                      selected={departureDate ? parseISO(departureDate) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          setDepartureDate(format(date, "yyyy-MM-dd"));
                          setOpenCalendar(false);
                        }
                      }}
                      disabled={(date) => date <= addDays(new Date(), 0) || date > addMonths(new Date(), 6)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* PASAJEROS */}
            <div className="relative" ref={passengerRef}>
              <div
                className={cn("py-2 px-8 rounded-full max-md:rounded-2xl max-md:px-4 cursor-pointer",
                  openPassenger ? "bg-muted dark:bg-background/50" : "hover:bg-muted dark:hover:bg-background/50"
                )}
                onClick={() => setOpenPassenger(!openPassenger)}
              >
                <label className="uppercase text-xs max-md:text-[10px] tracking-widest text-muted-foreground text-nowrap">
                  Pasajeros
                </label>
                <div className="cursor-pointer w-full font-semibold mt-2 max-md:mt-0 flex items-center justify-between">
                  <div className="flex items-center gap-3 max-md:gap-2 text-nowrap text-lg max-md:text-base">
                    <UserRound className="size-5 max-md:size-4" />
                    <span>{totalPassengers} {totalPassengers === 1 ? "Pasajero" : "Pasajeros"}</span>
                  </div>
                  <ChevronDown size={20} className={cn("transition-transform md:hidden", openPassenger && "rotate-180")} />
                </div>
              </div>

              {openPassenger && selectedTicket && (
                <div className="absolute top-full left-0 w-full mt-1 z-50">
                  <div className="rounded-3xl p-2 border overflow-hidden bg-background dark:bg-muted shadow-xl space-y-0">
                    {Object.entries(selectedTicket.prices).map(([passengerKey]) => {
                      const count = passengerCounts[passengerKey.toUpperCase()] ?? 0;

                      return (
                        <div
                          key={passengerKey}
                          className="w-full px-3 py-2 flex items-center justify-between border-b last:border-none"
                        >
                          <div className="flex flex-col gap-1">
                            <p className="font-semibold capitalize">{passengerKey}</p>
                          </div>

                          <div className="flex items-center gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon-sm"
                              className="rounded-full"
                              disabled={count <= (passengerKey === "adult" ? 1 : 0)}
                              onClick={() => updateCount(passengerKey.toUpperCase(), -1)}
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
                              onClick={() => updateCount(passengerKey.toUpperCase(), 1)}
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
          </div>

          <Button variant="search" size="big-search" type="submit" disabled={!selectedTicket}>
            Reservar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchBusTicket;