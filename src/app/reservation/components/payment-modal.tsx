"use client";

import { Button } from "@/components/ui/button";
import { useReservationStore } from "@/store/reservation.store";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Landmark, Lock, X } from "lucide-react";
import { toast } from "sonner";
import Icons from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const router = useRouter();
  const store = useReservationStore();

  const {
    tripType,
    departureDate,
    returnDate,
    passengers,
    paymentMethod,
    paymentAmountType,
    getTotalToPay,
    getSubtotal,
    getCommission,
    resetForm,
  } = store;

  const total = getTotalToPay();
  const subtotal = getSubtotal();
  const commission = getCommission();

  const reservationData = {
    tripType,
    departureDate,
    returnDate,
    passengers: passengers.map((p) => ({
      type: p.type,
      fullName: p.fullName,
      documentType: p.documentType,
      documentNumber: p.documentNumber,
      isPrimary: p.isPrimary,
    })),
    paymentMethod,
    paymentAmountType,
    subtotal,
    commissionAmount: commission,
    amountPaid: total,
  };

  const handleSuccess = () => {
    resetForm();
    toast.success("Payment successful! Your reservation is confirmed.");
    onClose();
    router.push("/");
  };

  const renderPayPalButton = () => (
    <PayPalButtons
      createOrder={async () => {
        const res = await fetch("/api/payments/paypal/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total }),
        });
        if (!res.ok) throw new Error("Failed to create PayPal order");
        const data = await res.json();
        return data.orderId;
      }}
      onApprove={async (data) => {
        const res = await fetch("/api/payments/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: data.orderID, reservationData }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to capture payment");
        }
        handleSuccess();
      }}
      onError={(err) => {
        console.error("PayPal error:", err);
        toast.error("Payment failed. Please try again.");
      }}
    />
  );

  const renderPaymentContent = () => {
    switch (paymentMethod) {
      case "paypal":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full">
                <Icons.PayPal />
              </div>
              <p className="text-lg font-semibold">PayPal</p>
              <p className="text-sm text-muted-foreground">Pay securely with your PayPal account.</p>
            </div>
            {renderPayPalButton()}
          </div>
        );

      case "card":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full">
                <CreditCard />
              </div>
              <p className="text-lg font-semibold">Credit Card (IziPay)</p>
              <p className="text-sm text-muted-foreground">Secure payment via Izipay. You'll be redirected to complete your purchase.</p>
            </div>
          </div>
        );

      case "transfer":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full">
                <Landmark />
              </div>
              <p className="text-lg font-semibold">Bank Transfer</p>
              <p className="text-sm text-muted-foreground">Please complete your payment via bank transfer. Details will be provided after confirmation.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background dark:bg-popover border rounded-3xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Payment Details</h2>
            <Button variant="outline" size={"icon-lg"} className="rounded-full" onClick={onClose}>
              <X />
            </Button>
          </div>

          <div className="space-y-6">
            <div className={cn("grid gap-3", paymentAmountType === "half" ? "grid-cols-4 max-md:grid-cols-2" : "grid-cols-3")}>
              <div className="rounded-2xl border p-4 dark:bg-background/50">
                <p className="text-sm text-muted-foreground">Subtotal</p>
                <p className="font-medium">${subtotal.toFixed(2)}</p>
              </div>
              <div className="rounded-2xl border p-4 dark:bg-background/50">
                <p className="text-sm text-muted-foreground">Commission</p>
                <p className="font-medium">${commission.toFixed(2)}</p>
              </div>
              <div className="rounded-2xl border p-4 dark:bg-background/50">
                <p className="text-sm text-muted-foreground">Total to pay</p>
                <p className="font-medium">${total.toFixed(2)}</p>
              </div>
              {paymentAmountType === "half" && (
                <div className="rounded-2xl border p-4 dark:bg-background/50 relative">
                  <p className="text-sm text-muted-foreground flex gap-1">Pending</p>
                  <p className="font-medium">${(total).toFixed(2)}</p>
                  <span className="absolute top-0 right-0 m-3 size-2 animate-pulse rounded-full bg-orange-600 block"></span>
                </div>
              )}
            </div>

            <div className="border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={"secondary"} className="capitalize">
                  {paymentMethod}
                </Badge>
                <Badge variant={"secondary"} className="capitalize">
                  {paymentAmountType}
                </Badge>
              </div>

              {renderPaymentContent()}
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Lock size={16} />
              <span>Your payment information is secure and encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
