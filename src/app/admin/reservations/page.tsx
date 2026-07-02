"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { format, parseISO } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { TRIP_TYPE_LABELS, PAYMENT_METHOD_LABELS, PASSENGER_TYPE_LABELS } from "@/data/tickets.data"

type AdminReservation = {
  id: string
  tripType: string
  departureDate: string | null
  returnDate: string | null
  status: string
  subtotal: string
  commissionAmount: string
  amountPaid: string
  paymentType: string
  createdAt: string
  user: { name: string; email: string } | null
  passengers: { id: string; type: string; fullName: string; documentType: string; documentNumber: string }[]
  payment: { method: string; amount: string; status: string } | null
}

const AdminReservationsPage = () => {
  const { user, status } = useAuth()
  const router = useRouter()
  const [reservations, setReservations] = useState<AdminReservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    if (status === "authenticated" && user?.role !== "admin") {
      router.push("/")
      return
    }
    if (status === "authenticated" && user?.role === "admin") {
      fetchReservations()
    }
  }, [status, user, router])

  const fetchReservations = async () => {
    try {
      const res = await fetch("/api/reservations?admin=true")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setReservations(data.reservations)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="size-8 animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-8">All Reservations</h1>
        {reservations.length === 0 ? (
          <p className="text-muted-foreground">No reservations found.</p>
        ) : (
          <div className="space-y-4">
            {reservations.map((r) => (
              <Card key={r.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-mono">
                      {r.id}
                    </CardTitle>
                    <Badge variant={r.status === "confirmed" ? "default" : "destructive"}>
                      {r.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <p className="text-muted-foreground text-xs">Trip</p>
                      <p>{TRIP_TYPE_LABELS[r.tripType as keyof typeof TRIP_TYPE_LABELS]}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Departure</p>
                      <p>{r.departureDate ? format(parseISO(r.departureDate), "MMM dd, yyyy") : "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Payment</p>
                      <p>{r.payment ? PAYMENT_METHOD_LABELS[r.payment.method as keyof typeof PAYMENT_METHOD_LABELS] : "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Amount</p>
                      <p>${parseFloat(r.amountPaid).toFixed(2)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">User</p>
                    <p>{r.user ? `${r.user.name} (${r.user.email})` : "Guest"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Passengers</p>
                    <div className="flex flex-wrap gap-2">
                      {r.passengers.map((p) => (
                        <Badge key={p.id} variant="outline" className="text-xs">
                          {p.fullName} - {PASSENGER_TYPE_LABELS[p.type as keyof typeof PASSENGER_TYPE_LABELS]?.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Created: {format(parseISO(r.createdAt), "MMM dd, yyyy HH:mm")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default AdminReservationsPage
