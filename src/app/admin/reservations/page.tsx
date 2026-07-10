"use client"

import { useEffect, useState, useMemo, Fragment } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { format, parseISO } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Search, X, ChevronDown, ChevronUp } from "lucide-react"
import { TRIP_TYPE_LABELS, PASSENGER_TYPE_LABELS } from "@/data/tickets.data"

const PAYMENT_TYPE_LABELS: Record<string, string> = {
  total: "100% (complete)",
  half: "50% (partial)",
}

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
  passengers: Array<{
    id: string
    type: string
    fullName: string
    documentType: string
    documentNumber: string
  }>
  payment: { method: string; amount: string; status: string } | null
}

const AdminReservationsPage = () => {
  const { user, status } = useAuth()
  const router = useRouter()

  const [reservations, setReservations] = useState<AdminReservation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [paymentFilter, setPaymentFilter] = useState<string>("")
  const [expandedId, setExpandedId] = useState<string | null>(null)

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
      setLoading(true)
      const res = await fetch("/api/reservations?admin=true")
      if (!res.ok) throw new Error("Failed to fetch reservations")
      const data = await res.json()
      setReservations(data.reservations || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredReservations = useMemo(() => {
    let result = [...reservations]

    if (statusFilter) {
      result = result.filter((r) => r.status === statusFilter)
    }

    if (paymentFilter) {
      result = result.filter((r) => r.paymentType === paymentFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim()
      result = result.filter((r) => {
        return (
          r.id.toLowerCase().includes(q) ||
          r.user?.name?.toLowerCase().includes(q) ||
          r.user?.email?.toLowerCase().includes(q) ||
          r.passengers.some((p) => p.fullName.toLowerCase().includes(q))
        )
      })
    }

    return result
  }, [reservations, search, statusFilter, paymentFilter])

  const totalAmount = useMemo(() => {
    return filteredReservations.reduce((sum, r) => {
      return sum + (parseFloat(r.amountPaid) || 0)
    }, 0)
  }, [filteredReservations])

  // Pending payments alert
  const pendingInfo = useMemo(() => {
    const pending = reservations.filter((r) => r.paymentType === "half")
    if (pending.length === 0) return null

    const pendingTotal = pending.reduce((sum, r) => {
      return sum + (parseFloat(r.subtotal) - parseFloat(r.amountPaid) || 0)
    }, 0)

    return { count: pending.length, total: pendingTotal }
  }, [reservations])

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="size-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Todas las reservas</h1>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm px-3 py-1">
            {filteredReservations.length} reservas
            {reservations.length !== filteredReservations.length &&
              ` / ${reservations.length} total`}
          </Badge>
          <div className="text-sm text-muted-foreground">
            Total pagado:{" "}
            <span className="font-semibold text-foreground">
              ${totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative max-w-sm flex-1 min-w-70">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID, nombre, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          {["", "confirmed", "cancelled"].map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="lg"
              onClick={() => setStatusFilter(s)}
            >
              {s === "" ? "Todos" : s === "confirmed" ? "Confirmadas" : "Canceladas"}
            </Button>
          ))}
          {statusFilter && (
            <Button
              variant="ghost"
              size="icon-lg"
              onClick={() => setStatusFilter("")}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Payment Filter */}
        <div className="flex gap-2">
          {["", "total", "half"].map((p) => (
            <Button
              key={p}
              variant={paymentFilter === p ? "default" : "outline"}
              size="lg"
              onClick={() => setPaymentFilter(p)}
            >
              {p === ""
                ? "Todos los pagos"
                : p === "total"
                  ? "100% pagado"
                  : "50% (pendiente)"}
            </Button>
          ))}
          {paymentFilter && (
            <Button
              variant="ghost"
              size="icon-lg"
              onClick={() => setPaymentFilter("")}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Alert de pagos pendientes */}
      {pendingInfo && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3 mb-6 flex items-center gap-3 text-sm">
          <div className="size-2 rounded-full bg-amber-500 shrink-0" />
          <span className="text-amber-800 dark:text-amber-200">
            <strong>{pendingInfo.count} reserva{pendingInfo.count !== 1 ? "s" : ""}</strong> con pago parcial —
            saldo pendiente total: <strong>${pendingInfo.total.toFixed(2)}</strong>
          </span>
        </div>
      )}

      {filteredReservations.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center">
          {search || statusFilter || paymentFilter
            ? "No hay reservas que coincidan con los filtros."
            : "No hay reservas aún."}
        </p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-left py-3 px-4 font-medium w-8"></th>
                <th className="text-left py-3 px-4 font-medium">ID</th>
                <th className="text-left py-3 px-4 font-medium">Viaje</th>
                <th className="text-left py-3 px-4 font-medium">Cliente</th>
                <th className="text-left py-3 px-4 font-medium">Salida</th>
                <th className="text-left py-3 px-4 font-medium">Pagado</th>
                <th className="text-left py-3 px-4 font-medium">Tipo pago</th>
                <th className="text-left py-3 px-4 font-medium">Saldo</th>
                <th className="text-left py-3 px-4 font-medium">Estado</th>
                <th className="text-left py-3 px-4 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((r) => (
                <Fragment key={r.id}>
                  <tr className="border-b last:border-none hover:bg-muted/30">
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="size-6 p-0"
                        onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                      >
                        {expandedId === r.id ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                      </Button>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs">{r.id}</td>
                    <td className="py-3 px-4">
                      {TRIP_TYPE_LABELS[r.tripType as keyof typeof TRIP_TYPE_LABELS] || r.tripType}
                    </td>
                    <td className="py-3 px-4">
                      {r.user ? (
                        <div>
                          <p>{r.user.name}</p>
                          <p className="text-xs text-muted-foreground">{r.user.email}</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Invitado</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {r.departureDate
                        ? format(parseISO(r.departureDate), "MMM dd, yyyy")
                        : "-"}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      ${parseFloat(r.amountPaid || "0").toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={r.paymentType === "half" ? "secondary" : "outline"}>
                        {PAYMENT_TYPE_LABELS[r.paymentType] || r.paymentType}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {r.paymentType === "half" ? (
                        <span className="text-amber-600 dark:text-amber-400 font-medium">
                          ${(parseFloat(r.subtotal || "0") - parseFloat(r.amountPaid || "0")).toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={r.status === "confirmed" ? "default" : "destructive"}>
                        {r.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">
                      {format(parseISO(r.createdAt), "MMM dd, yyyy")}
                    </td>
                  </tr>

                  {/* Expanded Row */}
                  {expandedId === r.id && (
                    <tr className="border-b last:border-none">
                      <td colSpan={10} className="p-0">
                        <div className="bg-muted/20 px-4 py-4">
                          <div className="grid grid-cols-2 gap-6 text-sm">
                            {/* Pasajeros */}
                            <div>
                              <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">
                                Pasajeros ({r.passengers.length})
                              </p>
                              <div className="space-y-1.5">
                                {r.passengers.map((p) => (
                                  <div key={p.id} className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {PASSENGER_TYPE_LABELS[p.type as keyof typeof PASSENGER_TYPE_LABELS]?.title || p.type}
                                    </Badge>
                                    <span>{p.fullName}</span>
                                    <span className="text-muted-foreground text-xs">
                                      {p.documentType}: {p.documentNumber}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Detalles financieros */}
                            <div>
                              <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">
                                Detalles
                              </p>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Subtotal</span>
                                  <span>${parseFloat(r.subtotal || "0").toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Comisión</span>
                                  <span>${parseFloat(r.commissionAmount || "0").toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Tipo de pago</span>
                                  <Badge variant={r.paymentType === "half" ? "secondary" : "outline"} className="text-xs">
                                    {PAYMENT_TYPE_LABELS[r.paymentType] || r.paymentType}
                                  </Badge>
                                </div>
                                {r.payment && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Estado del pago</span>
                                    <span>{r.payment.status}</span>
                                  </div>
                                )}
                                <div className="flex justify-between font-medium pt-1 border-t">
                                  <span>Total pagado</span>
                                  <span>${parseFloat(r.amountPaid || "0").toFixed(2)}</span>
                                </div>
                                {r.paymentType === "half" && (
                                  <div className="flex justify-between text-amber-600 dark:text-amber-400 font-medium">
                                    <span>Saldo pendiente</span>
                                    <span>
                                      ${(parseFloat(r.subtotal || "0") - parseFloat(r.amountPaid || "0")).toFixed(2)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminReservationsPage