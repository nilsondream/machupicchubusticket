"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CreditCard, DollarSign, Zap, Lock, Check, Landmark,
  User, Mail, Phone, Calendar as CalendarIcon, Users, BusFront,
  ChevronLeft, ArrowRight, BadgeCheck,
} from "lucide-react"
import { format, parseISO, addDays, addMonths } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { BookingData } from "@/providers/bus-ticket"
import { ProductFullFromApi } from "@/lib/api"

type Passenger = { name: string; email: string; phone: string; ticketType: string }
type Step = "details" | "passengers" | "payment" | "success"
type PaymentMethod = "izipay" | "paypal" | "wetravel" | "cash"

interface CheckoutFormProps {
  booking: BookingData
  product: ProductFullFromApi
  onUpdate: (updates: Partial<BookingData>) => void
  onReset?: () => void
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const isValidPassenger = (p?: Passenger) =>
  !!p && p.name.trim().length > 1 && emailRegex.test(p.email) && p.phone.trim().length >= 6

const travelTypeLabels: Record<string, string> = {
  "oneway-go": "Solo ida",
  "roundtrip": "Ida y vuelta",
  "oneway-return": "Solo retorno",
}

// Mapeo de nombres de tipos de ticket
const getTicketTypeLabel = (code: string): string => {
  const labels: Record<string, string> = {
    ADULT: "Adulto",
    CHILD: "Niño",
    SENIOR: "Adulto Mayor",
    STUDENT: "Estudiante",
  }
  return labels[code] || code
}

const paymentMethods: Array<{
  id: PaymentMethod
  name: string
  taxes: string
  image: string
  icon: typeof CreditCard
  show: boolean
}> = [
  { id: "izipay", name: "Izipay", taxes: "5%", image: "https://www.izipay.pe/_next/image/?url=https%3A%2F%2Fcdnwebb.izipay.pe%2Frsrc%2F_next%2Fstatic%2Fmedia%2FLogo.d654b6dd.png&w=256&q=75", icon: CreditCard, show: false },
  { id: "paypal", name: "PayPal", taxes: "7% + $0.3", image: "https://www.paypalobjects.com/marketing/web/logos/paypal-mark-color_new.svg", icon: DollarSign, show: true },
  { id: "wetravel", name: "We Travel", taxes: "0.0%", image: "https://cdn.wetravel.com/assets/logo-blue.png", icon: Zap, show: true },
  { id: "cash", name: "Transferencia", taxes: "Sin comisión", image: "", icon: Landmark, show: false },
]

// Reconstruir conteo de tipos de ticket desde pasajeros existentes
const getInitialTicketCounts = (booking: BookingData, product: ProductFullFromApi) => {
  const counts: Record<string, number> = {}
  
  // Contar desde passengerDetails si existen y tienen ticketType
  if (booking.passengerDetails?.length) {
    booking.passengerDetails.forEach((p: any) => {
      if (p.ticketType) {
        counts[p.ticketType] = (counts[p.ticketType] || 0) + 1
      }
    })
  }
  
  // Usar ticketCounts si está disponible
  if (booking.ticketCounts && Object.keys(booking.ticketCounts).length > 0) {
    return booking.ticketCounts
  }
  
  // Sino, inicializar con 1 para el primer tipo activo y 0 para los demás
  product.ticket_types.forEach((tt, idx) => {
    if (tt.active) {
      counts[tt.code] = counts[tt.code] || (idx === 0 ? 1 : 0)
    }
  })
  
  return counts
}

// Construir lista de pasajeros desde conteo de tipos de ticket
const buildPassengers = (ticketCounts: Record<string, number>, booking: BookingData, product: ProductFullFromApi): Passenger[] => {
  const passengers: Passenger[] = []
  
  product.ticket_types.forEach((ticketType) => {
    if (!ticketType.active) return
    
    const count = ticketCounts[ticketType.code] || 0
    for (let i = 0; i < count; i++) {
      // Buscar pasajero existente del mismo tipo
      const existingPassenger = (booking.passengerDetails as any[] || []).find(
        (p: any) => p.ticketType === ticketType.code && !passengers.some(pass => pass.email === p.email)
      )
      
      passengers.push(
        existingPassenger || {
          name: "",
          email: "",
          phone: "",
          ticketType: ticketType.code,
        }
      )
    }
  })
  
  return passengers
}

const sumTicketCounts = (counts: Record<string, number>): number =>
  Object.values(counts).reduce((sum, val) => sum + val, 0)

export function CheckoutForm({ booking, product, onUpdate, onReset }: CheckoutFormProps) {
  const router = useRouter()
  const [step, setStep] = useState<Step>("details")
  
  // Inicializar conteos de tipos de ticket
  const [ticketCounts, setTicketCounts] = useState<Record<string, number>>(() =>
    getInitialTicketCounts(booking, product)
  )
  
  // Construir pasajeros desde conteos
  const [passengers, setPassengers] = useState<Passenger[]>(() =>
    buildPassengers(getInitialTicketCounts(booking, product), booking, product)
  )
  
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Sincronizar cuando cambie el producto o booking
  useEffect(() => {
    const nextCounts = getInitialTicketCounts(booking, product)
    setTicketCounts(nextCounts)
    setPassengers(buildPassengers(nextCounts, booking, product))
  }, [booking.ticketCounts, booking.passengerDetails, product])

  // Tipos de ticket activos con información de precio
  const ticketTypes = product.ticket_types
    .filter((tt) => tt.active)
    .map((tt) => {
      const activePrice = tt.prices.find((p) => p.active)
      return {
        code: tt.code,
        label: getTicketTypeLabel(tt.code),
        description: tt.translations?.[0]?.description || "",
        price: Number(activePrice?.price || 0),
        currencySymbol: activePrice?.currency?.symbol || "S/",
      }
    })

  const totalPassengers = sumTicketCounts(ticketCounts)
  
  // Calcular subtotal: suma de (precio_tipo * cantidad) para cada tipo activo
  const subtotal = ticketTypes.reduce(
    (sum, tt) => sum + tt.price * (ticketCounts[tt.code] || 0),
    0
  )
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const minDate = format(addDays(new Date(), 1), "yyyy-MM-dd")
  const maxDate = format(addMonths(new Date(), 6), "yyyy-MM-dd")

  const formatLongDate = (dateStr: string | null) => {
    if (!dateStr) return "Selecciona una fecha"
    try {
      return format(parseISO(dateStr), "EEEE dd 'de' MMMM, yyyy", { locale: es })
    } catch {
      return dateStr
    }
  }

  // Actualizar conteo de tipos de ticket
  const updateTicketCounts = (newCounts: Record<string, number>) => {
    setTicketCounts(newCounts)
    const newPassengers = buildPassengers(newCounts, booking, product)
    setPassengers(newPassengers)
    onUpdate({
      ticketCounts: newCounts,
      passengers: sumTicketCounts(newCounts),
      passengerDetails: newPassengers as any,
    })
  }

  const handleTypeChange = (value: string) => {
    onUpdate({ travelType: value as BookingData["travelType"] })
  }

  const handleDateChange = (value: string) => {
    onUpdate({ departureDate: value })
  }

  const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
    setPassengers((prev) => {
      const next = prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
      onUpdate({ passengerDetails: next as any })
      return next
    })
  }

  const goToPassengers = () => {
    if (!booking.departureDate) {
      toast.warning("Selecciona la fecha de viaje")
      return
    }
    if (totalPassengers <= 0) {
      toast.warning("Selecciona al menos un pasajero")
      return
    }
    if (!isValidPassenger(passengers[0])) {
      toast.warning("Completa los datos del viajero principal")
      return
    }

    onUpdate({
      ticketCounts,
      passengers: totalPassengers,
      passengerDetails: passengers as any,
    })
    setStep(totalPassengers > 1 ? "passengers" : "payment")
  }

  const goToPayment = () => {
    if (!passengers.slice(1).every(isValidPassenger)) {
      toast.warning("Completa los datos de todos los pasajeros")
      return
    }

    onUpdate({
      ticketCounts,
      passengers: totalPassengers,
      passengerDetails: passengers as any,
    })
    setStep("payment")
  }

  const handlePay = () => {
    if (!selectedPayment) {
      toast.warning("Selecciona un método de pago")
      return
    }
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setStep("success")
      toast.success("¡Pago procesado con éxito!")
    }, 1800)
  }

  const flow: Step[] = totalPassengers > 1 ? ["details", "passengers", "payment"] : ["details", "payment"]
  const stepLabels: Record<Step, string> = {
    details: "Viaje",
    passengers: "Pasajeros",
    payment: "Pago",
    success: "Listo",
  }
  const currentIndex = flow.indexOf(step)

  const priceSummary = (
    <div className="border rounded-xl overflow-hidden">
      <div className="px-6 py-4 bg-muted font-semibold">Resumen de reserva</div>
      <div className="p-6 space-y-4 text-sm">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-muted-foreground"><BusFront className="size-4" /> Producto</span>
            <span className="font-medium text-right">{product.translations?.[0]?.name || product.code}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-muted-foreground"><BusFront className="size-4" /> Tipo de viaje</span>
            <span className="font-medium text-right">{travelTypeLabels[booking.travelType ?? ""] ?? "—"}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-muted-foreground"><CalendarIcon className="size-4" /> Fecha</span>
            <span className="font-medium text-right capitalize">{formatLongDate(booking.departureDate)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-muted-foreground"><Users className="size-4" /> Pasajeros</span>
            <span className="font-medium">{totalPassengers}</span>
          </div>
        </div>
        <hr />
        <div className="space-y-2">
          {ticketTypes.map((tt) => {
            const count = ticketCounts[tt.code] || 0
            if (count === 0) return null
            return (
              <div key={tt.code} className="flex justify-between text-sm">
                <span>{tt.label} x {count}</span>
                <span>{tt.currencySymbol}{(tt.price * count).toFixed(2)}</span>
              </div>
            )
          })}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>{ticketTypes[0]?.currencySymbol || "S/"}{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Impuestos (10%)</span>
            <span>{ticketTypes[0]?.currencySymbol || "S/"}{tax.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between text-lg font-bold text-primary">
            <span>Total</span>
            <span>{ticketTypes[0]?.currencySymbol || "S/"}{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )

  // --- Paso de confirmación ---
  if (step === "success") {
    return (
      <div className="max-w-xl mx-auto text-center border rounded-2xl p-10 space-y-6">
        <div className="mx-auto size-16 rounded-full bg-green-100 dark:bg-green-500/15 grid place-items-center">
          <BadgeCheck className="size-8 text-green-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">¡Reserva confirmada!</h2>
          <p className="text-muted-foreground">
            Enviamos los detalles del viaje al correo de{" "}
            <span className="font-medium text-foreground">{passengers[0]?.name || "tu viajero principal"}</span>.
          </p>
        </div>
        <div className="rounded-xl border p-5 text-left space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Producto</span><span className="font-medium">{product.translations?.[0]?.name || product.code}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Viaje</span><span className="font-medium">{travelTypeLabels[booking.travelType ?? ""] ?? "—"}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Fecha</span><span className="font-medium capitalize">{formatLongDate(booking.departureDate)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Pasajeros</span><span className="font-medium">{totalPassengers}</span></div>
          <div className="flex justify-between border-t pt-2"><span className="text-muted-foreground">Total pagado</span><span className="font-bold text-primary">{ticketTypes[0]?.currencySymbol || "S/"}{total.toFixed(2)}</span></div>
        </div>
        <Button
          size="lg"
          className="w-full"
          onClick={() => {
            onReset?.()
            router.push("/")
          }}
        >
          Volver al inicio
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Indicador de pasos */}
      <div className="flex items-center gap-2 flex-wrap">
        {flow.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                i === currentIndex
                  ? "bg-primary text-primary-foreground"
                  : i < currentIndex
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
              )}
            >
              <span className="grid place-items-center size-5 rounded-full border border-current/30 text-xs">
                {i < currentIndex ? <Check className="size-3" /> : i + 1}
              </span>
              {stepLabels[s]}
            </div>
            {i < flow.length - 1 && <div className="w-6 h-px bg-border" />}
          </div>
        ))}
      </div>

      {/* PASO 1: Datos del viaje (editables) + tipos de ticket */}
      {step === "details" && (
        <div className="grid grid-cols-3 gap-5 items-start max-lg:grid-cols-1">
          <div className="col-span-2 space-y-5 max-lg:col-span-1">
            {/* Datos del viaje editables */}
            <div className="border rounded-xl overflow-hidden">
              <div className="px-6 py-4 bg-muted font-semibold">1. Detalles del viaje</div>
              <div className="p-6 grid grid-cols-3 gap-5 max-md:grid-cols-1">
                <div className="space-y-2">
                  <Label htmlFor="travel-type">Tipo de viaje</Label>
                  <Select value={booking.travelType ?? "roundtrip"} onValueChange={handleTypeChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oneway-go">Solo ida</SelectItem>
                      <SelectItem value="roundtrip">Ida y vuelta</SelectItem>
                      <SelectItem value="oneway-return">Solo retorno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departure">Fecha de viaje</Label>
                  <Input
                    id="departure"
                    type="date"
                    min={minDate}
                    max={maxDate}
                    value={booking.departureDate ?? ""}
                    onChange={(e) => handleDateChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pasajeros</Label>
                  <div className="rounded-lg border bg-muted/70 px-2.5 py-1 h-8 text-sm flex items-center">
                    <p>{totalPassengers}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seleccionar tipos de ticket */}
            <div className="border rounded-xl overflow-hidden">
              <div className="px-6 py-4 bg-muted font-semibold">2. Selecciona los tipos de ticket</div>
              <div className="p-6 space-y-4">
                {ticketTypes.map((tt, index) => (
                  <div key={tt.code} className="rounded-3xl border p-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{tt.label}</p>
                          <p className="text-sm text-muted-foreground">{tt.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">{tt.currencySymbol}{tt.price.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">por pasajero</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 justify-between md:justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="rounded-full h-9 w-9"
                        onClick={() => {
                          const current = ticketCounts[tt.code] || 0
                          const min = index === 0 ? 1 : 0
                          if (current > min) {
                            updateTicketCounts({ ...ticketCounts, [tt.code]: current - 1 })
                          }
                        }}
                        disabled={(ticketCounts[tt.code] || 0) <= (index === 0 ? 1 : 0)}
                      >
                        −
                      </Button>
                      <div className="text-lg font-semibold w-8 text-center">{ticketCounts[tt.code] || 0}</div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => {
                          const current = ticketCounts[tt.code] || 0
                          if (current < 9) {
                            updateTicketCounts({ ...ticketCounts, [tt.code]: current + 1 })
                          }
                        }}
                        disabled={(ticketCounts[tt.code] || 0) >= 9}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button size="lg" className="w-full" onClick={goToPassengers}>
              {totalPassengers > 1 ? "Continuar con los pasajeros" : "Continuar al pago"}
              <ArrowRight />
            </Button>
          </div>

          <aside className="space-y-5 sticky top-24 max-lg:static">{priceSummary}</aside>
        </div>
      )}

      {/* PASO 2: Demás pasajeros */}
      {step === "passengers" && (
        <div className="grid grid-cols-3 gap-5 items-start max-lg:grid-cols-1">
          <div className="col-span-2 space-y-5 max-lg:col-span-1">
            <div className="border rounded-xl overflow-hidden">
              <div className="px-6 py-4 bg-muted font-semibold">Datos de los pasajeros</div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
                  <BadgeCheck className="size-5 text-green-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {passengers[0]?.name || "Viajero principal"}
                      <span className="ml-2 text-xs text-muted-foreground">({getTicketTypeLabel(passengers[0]?.ticketType || "")})</span>
                    </p>
                    <p className="text-sm text-muted-foreground truncate">{passengers[0]?.email}</p>
                  </div>
                </div>

                {passengers.slice(1).map((passenger, i) => {
                  const index = i + 1
                  return (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">Pasajero {index + 1}</p>
                        <span className="text-xs bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">
                          {getTicketTypeLabel(passenger.ticketType || "")}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                        <div className="space-y-2">
                          <Label htmlFor={`name-${index}`} className="flex items-center gap-2"><User className="size-4" /> Nombre completo</Label>
                          <Input
                            id={`name-${index}`}
                            placeholder="Juan Pérez"
                            value={passenger.name}
                            onChange={(e) => updatePassenger(index, "name", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`email-${index}`} className="flex items-center gap-2"><Mail className="size-4" /> Email</Label>
                          <Input
                            id={`email-${index}`}
                            type="email"
                            placeholder="correo@email.com"
                            value={passenger.email}
                            onChange={(e) => updatePassenger(index, "email", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 col-span-2 max-md:col-span-1">
                          <Label htmlFor={`phone-${index}`} className="flex items-center gap-2"><Phone className="size-4" /> Teléfono</Label>
                          <Input
                            id={`phone-${index}`}
                            type="tel"
                            placeholder="+51 987654321"
                            value={passenger.phone}
                            onChange={(e) => updatePassenger(index, "phone", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex gap-3 max-md:flex-col">
              <Button variant="outline" size="lg" onClick={() => setStep("details")}>
                <ChevronLeft />
                Volver
              </Button>
              <Button size="lg" className="flex-1" onClick={goToPayment}>
                Continuar al pago
                <ArrowRight />
              </Button>
            </div>
          </div>

          <aside className="space-y-5 sticky top-24 max-lg:static">{priceSummary}</aside>
        </div>
      )}

      {/* PASO 3: Pago */}
      {step === "payment" && (
        <div className="grid grid-cols-3 gap-5 items-start max-lg:grid-cols-1">
          <div className="col-span-2 space-y-5 max-lg:col-span-1">
            <div className="border rounded-xl overflow-hidden">
              <div className="px-6 py-4 bg-muted font-semibold">Método de pago</div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedPayment(method.id)}
                      className={cn(
                        "cursor-pointer p-4 rounded-lg border-2 transition-all relative",
                        selectedPayment === method.id ? "border-green-500" : "hover:border-primary/50"
                      )}
                    >
                      <div className="flex flex-col gap-2.5 items-center">
                        {method.show ? (
                          <div className="w-full h-7 grid place-items-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={method.image} alt={method.name} className="h-7 object-cover" />
                          </div>
                        ) : (
                          <method.icon />
                        )}
                        <div>
                          <p className="font-semibold text-sm">{method.name}</p>
                          <span className="text-xs text-muted-foreground">{method.taxes}</span>
                        </div>
                      </div>
                      {selectedPayment === method.id && (
                        <Check size={20} className="absolute top-0 right-0 m-1 bg-green-500 text-white rounded-full p-1" />
                      )}
                    </button>
                  ))}
                </div>

                {selectedPayment === "paypal" && (
                  <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
                    Serás redirigido a PayPal para completar el pago de forma segura.
                  </div>
                )}
                {selectedPayment === "wetravel" && (
                  <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
                    Completa tu pago rápido y seguro con We Travel.
                  </div>
                )}
                {selectedPayment === "izipay" && (
                  <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
                    Ingresarás los datos de tu tarjeta en la pasarela segura de Izipay.
                  </div>
                )}
                {selectedPayment === "cash" && (
                  <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
                    Te enviaremos los datos bancarios para completar la transferencia.
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 max-md:flex-col">
              <Button variant="outline" size="lg" onClick={() => setStep(totalPassengers > 1 ? "passengers" : "details")}>
                <ChevronLeft />
                Volver
              </Button>
              <Button size="lg" className="flex-1" onClick={handlePay} disabled={isProcessing}>
                <Lock className="size-4" />
                {isProcessing ? "Procesando pago..." : `Confirmar y pagar ${ticketTypes[0]?.currencySymbol || "S/"} ${total.toFixed(2)}`}
              </Button>
            </div>
          </div>

          <aside className="space-y-5 sticky top-24 max-lg:static">
            {priceSummary}
            <div className="border rounded-xl overflow-hidden">
              <div className="px-6 py-4 bg-muted font-semibold">Pasajeros</div>
              <div className="p-6 space-y-3">
                {passengers.map((passenger, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="grid place-items-center size-7 rounded-full bg-muted text-xs font-semibold shrink-0">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{passenger.name || `Pasajero ${i + 1}`}</p>
                      <p className="text-xs text-muted-foreground truncate">{getTicketTypeLabel(passenger.ticketType || "")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}