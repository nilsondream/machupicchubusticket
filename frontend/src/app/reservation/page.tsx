"use client"

import { useBooking } from "@/context/bus-ticket"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { ReactNode, useEffect, useState } from "react"
import { toast } from "sonner"
import {
    CreditCard, DollarSign, Zap, Lock, Check, Landmark,
    ChevronLeft, ArrowRight, BadgeCheck,
    Calendar as CalendarIcon, FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import Icons from "@/components/ui/icons"
import { paymentsPart } from "./data"

const travelTypeLabel: Record<string, string> = {
    "oneway-go": "Solo ida",
    "roundtrip": "Ida y vuelta",
    "oneway-return": "Solo retorno",
}

type Step = "passengers" | "payment" | "success"
type PaymentMethod = "izipay" | "paypal" | "cash"
type PaymentPart = "total" | "half"

interface PriceData {
    adult: { foreign: number; national: number }
    child: { foreign: number; national: number }
}

interface TicketData {
    id: string
    name: string
    prices: PriceData
}

interface PassengerForm {
    name: string
    email: string
    phone: string
    ticketType: string
    documentType: "dni" | "passport" | "ce"
    documentNumber: string
    nationality: "foreign" | "national"
}

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
    dni: "DNI",
    passport: "Pasaporte",
    ce: "Carné de Extranjería",
}

const getPassengerTypeLabel = (code: string): string => {
    const labels: Record<string, string> = {
        ADULT: "Adulto",
        CHILD: "Niño",
    }
    return labels[code] || code
}

const paymentMethods: Array<{
    id: PaymentMethod
    name: string
    taxes: string
    icon: | ReactNode
}> = [
        { id: "izipay", name: "Izipay", taxes: "5%", icon: <CreditCard /> },
        { id: "paypal", name: "PayPal", taxes: "7% + $0.3", icon: <Icons.PayPal /> },
        { id: "cash", name: "Transferencia", taxes: "Sin comisión", icon: <Landmark /> },
    ]

const ReservationPage = () => {
    const { booking, updateBooking, resetBooking } = useBooking()
    const router = useRouter()
    const [step, setStep] = useState<Step>("passengers")
    const [tickets, setTickets] = useState<TicketData[]>([])
    const [loadingTickets, setLoadingTickets] = useState(true)
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [paymentResult, setPaymentResult] = useState<any>(null)
    const [paymentPart, setPaymentPart] = useState<PaymentPart | null | string >("total")

    const passengerCount = booking.ticketCounts
        ? Object.values(booking.ticketCounts).reduce((sum, value) => sum + value, 0)
        : booking.passengers

    // Inicializar pasajeros con datos existentes
    const [passengers, setPassengers] = useState<PassengerForm[]>([])

    // Cargar tickets desde API
    useEffect(() => {
        async function loadTickets() {
            try {
                const response = await fetch("/api/tickets")
                const data: TicketData[] = await response.json()
                setTickets(data)
            } catch (error) {
                console.error(error)
                toast.error("Error al cargar precios")
            } finally {
                setLoadingTickets(false)
            }
        }
        loadTickets()
    }, [])

    // Inicializar formulario de pasajeros
    useEffect(() => {
        if (passengers.length > 0 || !booking.ticketCounts) return

        const newPassengers: PassengerForm[] = []
        const ticketCounts = booking.ticketCounts || { ADULT: 1, CHILD: 0 }
        const existingDetails = booking.passengerDetails || []

        Object.entries(ticketCounts).forEach(([type, count]: [string, number]) => {
            for (let i = 0; i < count; i++) {
                const existing = existingDetails.find(
                    (p: any) => p.ticketType === type && !newPassengers.some(np => np.email === p.email)
                )

                // Determinar nacionalidad desde documento existente
                let docType: "dni" | "passport" | "ce" = "dni"
                let nationality: "foreign" | "national" = "national"

                if (existing?.documentType) {
                    docType = existing.documentType as "dni" | "passport" | "ce"
                    nationality = existing.nationality as "foreign" | "national" ||
                        (docType === "dni" || docType === "ce" ? "national" : "foreign")
                }

                newPassengers.push(existing ? {
                    name: existing.name || "",
                    email: existing.email || "",
                    phone: existing.phone || "",
                    ticketType: type,
                    documentType: docType,
                    documentNumber: existing.documentNumber || "",
                    nationality,
                } : {
                    name: "",
                    email: "",
                    phone: "",
                    ticketType: type,
                    documentType: "dni",
                    documentNumber: "",
                    nationality: "national",
                })
            }
        })

        setPassengers(newPassengers)
    }, [booking.ticketCounts, booking.passengerDetails])

    const updatePassenger = (index: number, field: keyof PassengerForm, value: string) => {
        setPassengers(prev => {
            const next = [...prev]
            next[index] = { ...next[index], [field]: value }

            // Si cambia el tipo de documento, actualizar nacionalidad automáticamente
            if (field === "documentType") {
                const docType = value as "dni" | "passport" | "ce"
                next[index].nationality = (docType === "dni" || docType === "ce") ? "national" : "foreign"
            }

            return next
        })
    }

    // Encontrar el ticket seleccionado
    const selectedTicket = tickets.find(
        t => t.id === (booking.ticketTypeId || booking.travelType)
    )

    // Calcular precio por pasajero individual
    const getPassengerPrice = (passenger: PassengerForm): number => {
        if (!selectedTicket) return 0
        const passengerType = passenger.ticketType?.toLowerCase() || "adult"
        const nationality = passenger.nationality || "national"

        if (passengerType === "child") {
            return Number(selectedTicket.prices.child[nationality] || 0)
        }
        return Number(selectedTicket.prices.adult[nationality] || 0)
    }

    // Calcular totales
    const passengerPrices = passengers.map(getPassengerPrice)
    const subtotal = passengerPrices.reduce((sum, price) => sum + price, 0)
    const tax = subtotal * 0.05
    const total = subtotal + tax

    const hasReservation = Boolean(
        booking.travelType && booking.departureDate && passengerCount > 0
    )

    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    const isPassengerValid = (p: PassengerForm) =>
        p.name.trim().length > 1 &&
        isValidEmail(p.email) &&
        p.phone.trim().length >= 6 &&
        p.documentNumber.trim().length >= 6

    const goToPayment = () => {
        // Validar todos los pasajeros
        const invalidIndex = passengers.findIndex(p => !isPassengerValid(p))
        if (invalidIndex >= 0) {
            toast.warning(`Completa los datos del pasajero ${invalidIndex + 1}`)
            return
        }

        // Guardar datos de pasajeros en booking
        updateBooking({
            passengerDetails: passengers.map(p => ({
                name: p.name,
                email: p.email,
                phone: p.phone,
                ticketType: p.ticketType,
                documentType: p.documentType,
                documentNumber: p.documentNumber,
                nationality: p.nationality,
            })),
            passengers: passengerCount,
        })

        setStep("payment")
    }

    const handlePay = async () => {
        if (!selectedPayment) {
            toast.warning("Selecciona un método de pago")
            return
        }

        setIsProcessing(true)

        try {
            const response = await fetch("/api/payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    booking: {
                        ...booking,
                        passengerDetails: passengers.map(p => ({
                            name: p.name,
                            email: p.email,
                            phone: p.phone,
                            ticketType: p.ticketType,
                            documentType: p.documentType,
                            documentNumber: p.documentNumber,
                            nationality: p.nationality,
                        })),
                    },
                    paymentMethod: selectedPayment,
                }),
            })

            const result = await response.json()

            if (result.success) {
                setPaymentResult(result)
                setStep("success")
                toast.success("¡Pago procesado con éxito!")
            } else {
                toast.error(result.error || "Error al procesar el pago")
            }
        } catch (error) {
            console.error("Payment error:", error)
            toast.error("Error de conexión al procesar el pago")
        } finally {
            setIsProcessing(false)
        }
    }

    const handleReset = () => {
        resetBooking()
        router.push("/")
    }

    if (!hasReservation) {
        return (
            <main className="max-w-6xl mx-auto py-10">
                <div className="mb-8 space-y-3 mt-20">
                    <h1 className="text-3xl font-semibold">Resumen de tu reserva</h1>
                </div>
                <Card>
                    <CardContent className="py-8">
                        <p className="text-base text-muted-foreground">
                            No hay una reserva activa. Completa la selección en la página principal.
                        </p>
                    </CardContent>
                </Card>
            </main>
        )
    }

    // --- PANTALLA DE ÉXITO ---
    if (step === "success") {
        return (
            <main className="max-w-6xl mx-auto py-10">
                <div className="max-w-xl mx-auto text-center border rounded-2xl p-10 space-y-6 mt-20">
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

                    {paymentResult && (
                        <div className="rounded-xl border p-5 text-left space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Transacción</span>
                                <span className="font-medium">{paymentResult.transactionId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Producto</span>
                                <span className="font-medium">{selectedTicket?.name || "Bus Machu Picchu"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Viaje</span>
                                <span className="font-medium">{travelTypeLabel[booking.travelType ?? ""] || "—"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Fecha</span>
                                <span className="font-medium capitalize">
                                    {booking.departureDate
                                        ? format(parseISO(booking.departureDate), "EEEE dd, MMMM", { locale: es })
                                        : "—"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Pasajeros</span>
                                <span className="font-medium">{passengerCount}</span>
                            </div>
                            <div className="flex justify-between border-t pt-2">
                                <span className="text-muted-foreground">Total pagado</span>
                                <span className="font-bold">S/ {total.toFixed(2)}</span>
                            </div>
                        </div>
                    )}

                    <Button size="lg" className="w-full" onClick={handleReset}>
                        Volver al inicio
                    </Button>
                </div>
            </main>
        )
    }

    return (
        <main>
            <div className="fixed top-18 border-b w-full py-5 bg-background z-40">
                <div className="max-w-6xl mx-auto">
                    <span className="font-medium">Modifica tu reserva</span>
                    <div className="grid grid-cols-3 gap-5 mt-2.5">
                        <div className="rounded-2xl border p-4 space-y-1 cursor-pointer bg-card hover:border-primary/50">
                            <p className="text-sm text-muted-foreground">Tipo de viaje</p>
                            <p className="font-semibold text-foreground">
                                {travelTypeLabel[booking.travelType ?? ""]}
                            </p>
                        </div>
                        <div className="rounded-2xl border p-4 space-y-1 cursor-pointer bg-card hover:border-primary/50">
                            <p className="text-sm text-muted-foreground">Fecha de salida</p>
                            <p className="font-semibold text-foreground">
                                {booking.departureDate
                                    ? format(parseISO(booking.departureDate), "EEEE dd, MMMM", { locale: es })
                                    : "—"}
                            </p>
                        </div>
                        <div className="rounded-2xl border p-4 space-y-1 cursor-pointer bg-card hover:border-primary/50">
                            <p className="text-sm text-muted-foreground">Cantidad de pasajeros</p>
                            <p className="font-semibold text-foreground">{passengerCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto py-20 mt-45">

                <div className="grid gap-5 grid-cols-5 items-start">
                    {/* COLUMNA PRINCIPAL */}
                    <section className="space-y-6 col-span-3">
                        {/* PASO 1: Datos de pasajeros */}
                        {step === "passengers" && (
                            <>
                                {/* Formulario de pasajeros */}
                                <div>
                                    <div className="space-y-6">
                                        {passengers.map((passenger, index) => {
                                            const passengerPrice = getPassengerPrice(passenger)
                                            return (
                                                <div
                                                    key={index}
                                                    className="rounded-2xl border p-5 space-y-4"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="grid place-items-center size-7 rounded-full bg-muted text-xs font-semibold">
                                                                {index + 1}
                                                            </span>
                                                            <span className="font-semibold">
                                                                {getPassengerTypeLabel(passenger.ticketType)}
                                                            </span>
                                                            {index === 0 && (
                                                                <span className="text-xs px-1.5 py-0.5 rounded-md bg-muted">
                                                                    Principal Traveler
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-sm font-semibold">
                                                            S/ {passengerPrice.toFixed(2)}
                                                        </span>
                                                    </div>

                                                    <div className="grid gap-4 sm:grid-cols-2">
                                                        <div className="space-y-2">
                                                            <Label htmlFor={`name-${index}`}>
                                                                Nombre completo
                                                            </Label>
                                                            <Input
                                                                id={`name-${index}`}
                                                                placeholder="John Doe"
                                                                value={passenger.name}
                                                                onChange={(e) => updatePassenger(index, "name", e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor={`email-${index}`}>
                                                                Correo electrónico
                                                            </Label>
                                                            <Input
                                                                id={`email-${index}`}
                                                                type="email"
                                                                placeholder="john@doe.com"
                                                                value={passenger.email}
                                                                onChange={(e) => updatePassenger(index, "email", e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor={`phone-${index}`}>
                                                                Teléfono
                                                            </Label>
                                                            <Input
                                                                id={`phone-${index}`}
                                                                type="tel"
                                                                placeholder="+51 987654321"
                                                                value={passenger.phone}
                                                                onChange={(e) => updatePassenger(index, "phone", e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor={`docType-${index}`}>
                                                                Tipo de documento
                                                            </Label>
                                                            <Select
                                                                value={passenger.documentType}
                                                                onValueChange={(value: string | null) => updatePassenger(index, "documentType", value as "dni" | "passport" | "ce")}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="dni">DNI</SelectItem>
                                                                    <SelectItem value="ce">Carné de Extranjería</SelectItem>
                                                                    <SelectItem value="passport">Pasaporte</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="space-y-2 sm:col-span-2">
                                                            <Label htmlFor={`docNumber-${index}`}>
                                                                Número de documento
                                                            </Label>
                                                            <Input
                                                                id={`docNumber-${index}`}
                                                                placeholder={
                                                                    passenger.documentType === "dni"
                                                                        ? "12345678"
                                                                        : passenger.documentType === "ce"
                                                                            ? "123456789"
                                                                            : "AB123456"
                                                                }
                                                                value={passenger.documentNumber}
                                                                onChange={(e) => updatePassenger(index, "documentNumber", e.target.value)}
                                                            />
                                                            <p className="text-xs text-muted-foreground">
                                                                {passenger.documentType === "dni" || passenger.documentType === "ce"
                                                                    ? "Pasajero nacional"
                                                                    : "Pasajero extranjero"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                    </section>
                    {/* SIDEBAR - RESUMEN DE PRECIOS */}
                    <aside className="space-y-6 col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Método de pago</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-3">
                                    {paymentMethods.map((method) => (
                                        <button
                                            key={method.id}
                                            type="button"
                                            onClick={() => setSelectedPayment(method.id)}
                                            className={cn(
                                                "cursor-pointer px-4 py-2.5 rounded-2xl border transition-all relative",
                                                selectedPayment === method.id ? "border-foreground" : "hover:border-primary/50"
                                            )}
                                        >
                                            <div className="flex flex-col gap-2 items-center">
                                                {method.icon}
                                                <div>
                                                    <p className="font-medium text-sm">{method.name}</p>
                                                    <span className="text-xs text-muted-foreground">{method.taxes}</span>
                                                </div>
                                            </div>
                                            {selectedPayment === method.id && (
                                                <Check size={20} className="absolute top-0 right-0 m-2 bg-foreground text-background rounded-full p-1" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Resumen de precios</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    {paymentsPart.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setPaymentPart(item.id)}
                                            className={cn("rounded-2xl border p-4 cursor-pointer relative text-left",paymentPart === item.id ? "border-foreground" : "hover:border-primary/50")}
                                        >
                                            <p className="text-sm">{item.name}</p>
                                            <p className="mt-2 text-lg font-semibold">{item.desc}</p>
                                            {paymentPart === item.id && (
                                                <Check size={20} className="absolute top-0 right-0 m-2 bg-foreground text-background rounded-full p-1" />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Detalle por pasajero */}
                                <div className="space-y-3">
                                    {passengers.map((passenger, index) => {
                                        const price = getPassengerPrice(passenger)
                                        return (
                                            <div key={index} className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground flex gap-2 items-center">
                                                    <span>{getPassengerTypeLabel(passenger.ticketType)}</span>
                                                    <span className={cn(
                                                        "text-xs px-1.5 py-0.5 rounded-md",
                                                        passenger.nationality === "foreign"
                                                            ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                                                            : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                                                    )}>
                                                        {passenger.nationality === "foreign" ? "Foreign" : "National"}
                                                    </span>
                                                </span>
                                                <span className="font-medium">S/ {price.toFixed(2)}</span>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="space-y-3 pt-2 border-t">
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <span>Subtotal</span>
                                        <span>S/ {subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <span>Impuestos</span>
                                        <span>S/ {tax.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="border-t pt-4 text-lg font-semibold flex items-center justify-between">
                                    <span>Total</span>
                                    {paymentPart === "total" ? <span>S/ {total.toFixed(2)}</span> : <span>S/ {(total/2).toFixed(2)}</span>}
                                </div>
                            </CardContent>
                        </Card>

                        {selectedPayment === "paypal" && (
                            <div className="rounded-2xl border p-4 text-sm text-muted-foreground">
                                Serás redirigido a PayPal para completar el pago de forma segura.
                            </div>
                        )}
                        {selectedPayment === "izipay" && (
                            <div className="rounded-2xl border p-4 text-sm text-muted-foreground">
                                Ingresarás los datos de tu tarjeta en la pasarela segura de Izipay.
                            </div>
                        )}
                        {selectedPayment === "cash" && (
                            <div className="rounded-2xl border p-4 text-sm text-muted-foreground">
                                Te enviaremos los datos bancarios para completar la transferencia.
                            </div>
                        )}

                        {/* Lista de pasajeros */}
                        {step === "payment" && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Pasajeros</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {passengers.map((passenger, i) => (
                                        <div key={i} className="flex items-center gap-3 rounded-2xl border p-3">
                                            <span className="grid place-items-center size-7 rounded-full bg-muted text-xs font-semibold shrink-0">
                                                {i + 1}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium truncate">{passenger.name || `Pasajero ${i + 1}`}</p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span>{getPassengerTypeLabel(passenger.ticketType)}</span>
                                                    <span>•</span>
                                                    <span className={cn(
                                                        "px-1 py-0.5 rounded",
                                                        passenger.nationality === "foreign"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-green-100 text-green-700"
                                                    )}>
                                                        {passenger.nationality === "foreign" ? "Extranjero" : "Nacional"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </aside>
                </div>
            </div>
        </main>
    )
}

export default ReservationPage