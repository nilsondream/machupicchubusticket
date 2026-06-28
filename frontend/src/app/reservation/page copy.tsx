"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { ReactNode, useEffect, useState } from "react"
import { toast } from "sonner"
import { CreditCard, Check, Landmark, } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import Icons from "@/components/ui/icons"
import { useBooking } from "@/providers/bus-ticket"
import { busTicketData } from "@/data/bus-ticket-data"
import { useReservationStore } from "@/store/reservation-store"

type PaymentMethod = "izipay" | "paypal" | "cash"

interface PassengerForm {
    name: string
    email: string
    phone: string
    ticketType: string
    documentType: "dni" | "passport"
    documentNumber: string
    nationality: "foreign" | "national"
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
    const router = useRouter()
    const {
        travelType,
        travelDate,
        passengers,

        setTravelType,
        setTravelDate,

        increaseAdults,
        decreaseAdults,
        increaseChildren,
        decreaseChildren,
    } = useReservationStore();

    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null)

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

    return (
        <main>
            <div className="fixed top-18 border-b w-full py-5 bg-background z-40">
                <div className="max-w-6xl mx-auto">
                    <span className="font-medium">Modifica tu reserva</span>
                    <div className="grid grid-cols-3 gap-5 mt-2.5">
                        <div className="rounded-2xl border p-4 space-y-1 cursor-pointer bg-card hover:border-primary/50">
                            <p className="text-sm text-muted-foreground">Tipo de viaje</p>
                            <p className="font-semibold text-foreground">
                                {travelType ?? ""}
                            </p>
                        </div>
                        <div className="rounded-2xl border p-4 space-y-1 cursor-pointer bg-card hover:border-primary/50">
                            <p className="text-sm text-muted-foreground">Fecha de salida</p>
                            <p className="font-semibold text-foreground">
                                {travelDate ? format(parseISO(travelDate), "EEEE dd, MMMM", { locale: es }) : "—"}
                            </p>
                        </div>
                        <div className="rounded-2xl border p-4 space-y-1 cursor-pointer bg-card hover:border-primary/50">
                            <p className="text-sm text-muted-foreground">Cantidad de pasajeros</p>
                            <p className="font-semibold text-foreground">{passengers.adults + passengers.children}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto py-20 mt-45">

                <div className="grid gap-5 grid-cols-5 items-start">
                    {/* COLUMNA PRINCIPAL */}
                    <section className="space-y-6 col-span-3">
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
                                                            passenger.documentType === "dni" ? "12345678" : "AB123456"
                                                        }
                                                        value={passenger.documentNumber}
                                                        onChange={(e) => updatePassenger(index, "documentNumber", e.target.value)}
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        {passenger.documentType === "dni"
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
                                            className={cn("rounded-2xl border p-4 cursor-pointer relative text-left", paymentPart === item.id ? "border-foreground" : "hover:border-primary/50")}
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
                                    {paymentPart === "total" ? <span>S/ {total.toFixed(2)}</span> : <span>S/ {(total / 2).toFixed(2)}</span>}
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
                    </aside>
                </div>
            </div>
        </main>
    )
}

export default ReservationPage