import { z } from "zod";
import type { Parking, ParkingSlot } from "./parking";
import type { User } from "./user";
import { toTypedSchema } from "@vee-validate/zod";

export type Booking = {
  id: number;
  user_id: number;
  user: User;
  parking_id: number;
  parking: Parking;
  slot_id: number;
  slot: ParkingSlot;
  plate_number: string;
  start_at: string;
  end_at: string;
  total_hours: number;
  total_fee: number;
  payment_reference: string;
  payment_link: string;
  payment_expired_at: string;
  status: "UNPAID" | "PAID" | "CANCELLED" | "EXPIRED" | "COMPLETED";
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export const CreateBookingRequest = {
  parking_id: toTypedSchema(z.number()),
  slot_id: toTypedSchema(z.number()),
  plate_number: toTypedSchema(z.string().min(3).max(16)),
  start_at: toTypedSchema(z.string().datetime({ offset: false })),
  end_at: toTypedSchema(z.string().datetime({ offset: false })),
};

export const UpdateBookingRequest = {
  plate_number: toTypedSchema(z.string().min(3).max(16)),
  start_at: toTypedSchema(z.string().datetime({ offset: false })),
  end_at: toTypedSchema(z.string().datetime({ offset: false })),
  status: toTypedSchema(
    z.nativeEnum({
      UNPAID: "UNPAID",
      PAID: "PAID",
      CANCELED: "CANCELLED",
      EXPIRED: "EXPIRED",
      COMPLETED: "COMPLETED",
    })
  ),
};
