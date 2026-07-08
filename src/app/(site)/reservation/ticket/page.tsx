"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Loader2, Check, X, Search } from "lucide-react";
import {
  COMMISSION_RATES,
} from "@/lib/pricing";
import {
  TRIP_TYPE_LABELS,
  PAYMENT_METHOD_LABELS,
  PASSENGER_TYPE_LABELS,
} from "@/data/tickets.data";

type Passenger = {
  id: string;
  type: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  documentType: string;
  documentNumber: string;
  isPrimary: boolean;
};

type ReservationResponse = {
  id: string;
  tripType: string;
  departureDate: string | null;
  returnDate: string | null;
  status: string;
  subtotal: string;
  commissionAmount: string;
  amountPaid: string;
  paymentType: string;
  createdAt: string;
  passengers: Passenger[];
  payment: {
    method: string;
    amount: string;
    status: string;
    externalId: string | null;
  } | null;
};

function EditablePassengerCard({ passenger, onSave }: { passenger: Passenger; onSave: (p: Passenger) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState(passenger.fullName);
  const [email, setEmail] = useState(passenger.email ?? "");
  const [phone, setPhone] = useState(passenger.phone ?? "");
  const [notes, setNotes] = useState(passenger.notes ?? "");
  const [documentType, setDocumentType] = useState(passenger.documentType);
  const [documentNumber, setDocumentNumber] = useState(passenger.documentNumber);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ ...passenger, fullName, email, phone, notes, documentType, documentNumber });
      setEditing(false);
      toast.success("Passenger updated");
    } catch {
      toast.error("Failed to update passenger");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFullName(passenger.fullName);
    setEmail(passenger.email ?? "");
    setPhone(passenger.phone ?? "");
    setNotes(passenger.notes ?? "");
    setDocumentType(passenger.documentType);
    setDocumentNumber(passenger.documentNumber);
    setEditing(false);
  };

  return (
    <div className="border rounded-xl p-4 bg-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 justify-between w-full">
          <p className="font-semibold">
            {PASSENGER_TYPE_LABELS[passenger.type as keyof typeof PASSENGER_TYPE_LABELS]?.title ?? passenger.type} Passenger
          </p>
          {passenger.isPrimary && (
            <span className="px-2 py-1 rounded-md text-xs bg-muted border">
              Primary Traveler
            </span>
          )}
          {!passenger.isPrimary && !editing && (
            <Button
              variant={"outline"}
              size={"xs"}
              onClick={() => setEditing(true)}
            >
              <Pencil />
              Edit
            </Button>
          )}
        </div>
        {editing && (
          <div className="flex items-center gap-1">
            <Button
              size={"icon-xs"}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? <Loader2 className="animate-spin" /> : <Check />}
            </Button>
            <Button
              variant={"outline"}
              size={"icon-xs"}
              onClick={handleCancel}
            >
              <X className="size-3" />
            </Button>
          </div>
        )}
      </div>
      <div className={`grid gap-3 max-md:grid-cols-1 ${editing && !passenger.isPrimary ? "grid-cols-3" : "grid-cols-2"}`}>
        {editing && !passenger.isPrimary ? (
          <>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Full Name</span>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-8 text-sm"
                placeholder="Full name"
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Document</span>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full h-8 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 border border-input rounded-md px-2"
              >
                <option className="bg-background" value="DNI">DNI</option>
                <option className="bg-background" value="Passport">Passport</option>
                <option className="bg-background" value="CE">Foreigner's ID card</option>
              </select>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Number</span>
              <Input
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                className="h-8 text-sm"
                placeholder="Document number"
              />
            </div>
          </>
        ) : passenger.isPrimary ? (
          <>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Full Name</span>
              <p className="text-sm font-medium">{passenger.fullName || "-"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Document</span>
              <p className="text-sm font-medium">{passenger.documentType} {passenger.documentNumber}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Email</span>
              <p className="text-sm font-medium">{passenger.email || "-"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Phone</span>
              <p className="text-sm font-medium">{passenger.phone || "-"}</p>
            </div>
            {passenger.notes && (
              <div className="col-span-2 space-y-1">
                <span className="text-xs text-muted-foreground">Notes</span>
                <p className="text-sm font-medium">{passenger.notes}</p>
              </div>
            )}
          </>
        ) : (
          <div className="col-span-2 space-y-1">
            <span className="text-xs text-muted-foreground">Full Name</span>
            <p className="text-sm font-medium">{passenger.fullName || "-"}</p>
            {passenger.documentType && (
              <p className="text-xs text-muted-foreground mt-1">{passenger.documentType}: {passenger.documentNumber}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PassengerList({ passengers, onSave }: { passengers: Passenger[]; onSave: (p: Passenger) => Promise<void> }) {
  return (
    <div className="grid gap-4">
      {passengers.map((p) => (
        <EditablePassengerCard key={p.id} passenger={p} onSave={onSave} />
      ))}
    </div>
  );
}

const MyTicketPage = () => {
  const searchParams = useSearchParams()
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [reservation, setReservation] = useState<ReservationResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const id = searchParams.get("id")
    if (id) {
      setSearchId(id)
      const doSearch = async () => {
        setLoading(true)
        try {
          const res = await fetch(`/api/reservations/${encodeURIComponent(id)}`)
          const data = await res.json()
          if (res.ok) {
            setReservation(data.reservation)
          } else {
            setErrorMessage(data.error ?? "Ticket not found")
          }
        } catch {
          setErrorMessage("Unable to connect.")
        } finally {
          setLoading(false)
        }
      }
      doSearch()
    }
  }, [searchParams])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchId.trim();
    if (!trimmed) {
      toast.warning("Enter a ticket ID");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setReservation(null);

    try {
      const res = await fetch(`/api/reservations/${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error ?? "Ticket not found");
        return;
      }

      setReservation(data.reservation);
    } catch {
      setErrorMessage("Unable to connect. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassenger = async (updated: Passenger): Promise<void> => {
    if (!reservation) return;

    const res = await fetch(`/api/reservations/${encodeURIComponent(reservation.id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        passengers: [updated],
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update");
    }

    const data = await res.json();
    setReservation(data.reservation);
  };

  const tripLabel = reservation
    ? TRIP_TYPE_LABELS[reservation.tripType as keyof typeof TRIP_TYPE_LABELS]
    : "";

  const subtotal = reservation ? parseFloat(reservation.subtotal) : 0;
  const commission = reservation ? parseFloat(reservation.commissionAmount) : 0;
  const amountPaid = reservation ? parseFloat(reservation.amountPaid) : 0;
  const total = subtotal + commission;

  const paymentMethodLabel = reservation?.payment
    ? PAYMENT_METHOD_LABELS[reservation.payment.method as keyof typeof PAYMENT_METHOD_LABELS]
    : "";

  const paymentMethodRate = reservation?.payment
    ? COMMISSION_RATES[reservation.payment.method as keyof typeof COMMISSION_RATES]
    : null;

  const pendingAmount = reservation && reservation.paymentType === "half"
    ? total / 2
    : 0;

  return (
    <main>
      <div className="max-w-6xl mx-auto max-md:px-5 py-24 space-y-5 min-h-screen">
        <div className="mt-10">
          <h1 className="text-3xl font-semibold">Search ticket</h1>
          <p className="text-muted-foreground">Enter your ticket ID to view your reservation.</p>
        </div>

        <form className="flex gap-3 max-md:flex-col items-center" onSubmit={handleSearch}>
          <Input
            placeholder="Enter ticket ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <Button type="submit" disabled={loading} className="h-10 w-40">
            {loading ? <Loader2 className="animate-spin" /> : <Search />}
            Search
          </Button>
        </form>

        {errorMessage && (
          <div className="border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-300">
            <p className="font-medium">Error</p>
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}

        {loading && (
          <div className="space-y-4">
            <div className="h-48 rounded-xl bg-muted animate-pulse" />
          </div>
        )}

        {reservation && (
          <div className="grid grid-cols-5 gap-5 max-md:grid-cols-1 items-start">
            <Card className="col-span-3 max-md:col-span-1">
              <CardHeader>
                <CardTitle>Reservation #{reservation.id}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ticket</span>
                    <span>{tripLabel}</span>
                  </div>
                  {reservation.departureDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Departure</span>
                      <span>
                        {format(parseISO(reservation.departureDate), "EEEE dd, MMMM", { locale: enUS })}
                      </span>
                    </div>
                  )}
                  {reservation.returnDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Return</span>
                      <span>
                        {format(parseISO(reservation.returnDate), "EEEE dd, MMMM", { locale: enUS })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span>
                      {format(parseISO(reservation.createdAt), "EEEE dd, MMMM", { locale: enUS })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 capitalize">
                      {reservation.status}
                    </span>
                  </div>
                </div>

                <hr />

                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Passengers ({reservation.passengers.length})
                  </p>
                  <PassengerList passengers={reservation.passengers} onSave={handleSavePassenger} />
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2 max-md:col-span-1">
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {reservation.payment && paymentMethodRate !== null && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Fee: {paymentMethodLabel} ({(paymentMethodRate * 100).toFixed(1)}%)
                      </span>
                      <span>${commission.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                {reservation.paymentType === "half" && (
                  <div className="border rounded-xl bg-muted/50 dark:bg-background">
                    <div className="flex justify-between items-center font-semibold px-4 py-3">
                      <span>Paid (50%)</span>
                      <span className="text-base">${amountPaid.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="flex items-center justify-between text-muted-foreground px-4 py-3">
                      <span>Pending</span>
                      <span className="text-base">${pendingAmount.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {reservation.paymentType !== "half" && (
                  <div className="flex justify-between font-semibold">
                    <span>Paid</span>
                    <span>${amountPaid.toFixed(2)}</span>
                  </div>
                )}

                {reservation.payment && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment method</span>
                      <span>{paymentMethodLabel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment status</span>
                      <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 capitalize">
                        {reservation.payment.status}
                      </span>
                    </div>
                    {reservation.payment.externalId && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transaction</span>
                        <span className="text-xs font-mono truncate max-w-40">
                          {reservation.payment.externalId}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
};

export default function TicketPageWrapper() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 size={24} className="animate-spin" />
      </div>
    }>
      <MyTicketPage />
    </Suspense>
  );
}
