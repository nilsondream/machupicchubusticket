import { z } from "zod";

export const passengerSchema = z.object({
  fullName: z.string().min(10, "Required"),
  document: z.string().min(8, "Required"),
});

export const reservationSchema = z.object({
  email: z.email("Invalid email"),
  phone: z.string().min(8),

  leadPassenger: passengerSchema,

  passengers: z.array(
    passengerSchema.partial()
  ),
});

export type ReservationForm = z.infer<
  typeof reservationSchema
>;