"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { format, parseISO } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search } from "lucide-react"
import Link from "next/link"
import { TRIP_TYPE_LABELS } from "@/data/tickets.data"

type UserReservation = {
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
  passengers: { id: string; type: string; fullName: string; documentType: string; documentNumber: string }[]
  payment: { method: string; amount: string; status: string; externalId: string | null } | null
}

const MyReservationsPage = () => {
  const router = useRouter()
  const { status } = useAuth()
  const [reservations, setReservations] = useState<UserReservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    if (status === "authenticated") {
      fetchReservations()
    }
  }, [status, router])

  const fetchReservations = async () => {
    try {
      const res = await fetch("/api/reservations")
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold">My Reservations</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {reservations.length} reservation{reservations.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href="/reservation/ticket"
            className="inline-flex items-center justify-center h-8 gap-1.5 px-3 rounded-lg border border-border bg-background hover:bg-muted hover:text-foreground text-sm font-medium transition-all"
          >
            <Search className="size-4" />
            Search by ID
          </Link>
        </div>

        {reservations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">You have no reservations yet.</p>
              <Link
                href="/"
                className="inline-flex items-center justify-center h-8 gap-1.5 px-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 text-sm font-medium transition-all"
              >
                Book a ticket
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reservations.map((r) => (
              <Card key={r.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-mono">
                      #{r.id.slice(0, 8)}...
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
                      <p className="text-muted-foreground text-xs">Date</p>
                      <p>{r.departureDate ? format(parseISO(r.departureDate), "MMM dd, yyyy") : "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Paid</p>
                      <p>${parseFloat(r.amountPaid).toFixed(2)}</p>
                      {r.paymentType === "half" && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 mt-0.5">
                          50% paid - Pending
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Passengers</p>
                      <p>{r.passengers.length}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {r.passengers.map((p) => (
                      <Badge key={p.id} variant="outline" className="text-xs">
                        {p.fullName}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(r.createdAt), "MMM dd, yyyy HH:mm")}
                    </p>
                    <div className="flex items-center gap-3">
                      {r.paymentType === "half" && (
                        <Link
                          href={`/reservation/ticket?id=${r.id}`}
                          className="text-sm font-medium text-orange-600 dark:text-orange-400 underline-offset-4 hover:underline"
                        >
                          Complete payment
                        </Link>
                      )}
                      <Link
                        href={`/reservation/ticket?id=${r.id}`}
                        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default MyReservationsPage
