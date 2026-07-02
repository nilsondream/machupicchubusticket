"use client";

import ReservationSummary from "./reservation-summary";
import PaymentMethod from "./payment-method";
import PaymentModal from "./payment-modal";
import { useState } from "react";
import { useReservationStore } from "@/store/reservation.store";

export default function PaymentCard() {
  const { paymentMethod, paymentAmountType } = useReservationStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canProceed = paymentMethod !== "none" && paymentAmountType !== "none";

  const handleOpenModal = () => {
    if (canProceed) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <aside className="space-y-5 col-span-2 max-md:col-span-1">
      <PaymentMethod />
      <ReservationSummary openModal={handleOpenModal} proceed={canProceed} />
      <PaymentModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </aside>
  );
}