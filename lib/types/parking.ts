import { z } from "zod";
import type { User } from "./user";
import { toTypedSchema } from "@vee-validate/zod";

export type Parking = {
  id: number;
  author_id: number;
  author: User;
  slug: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  layout: any[][];
  slots: ParkingSlot[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type ParkingSlot = {
  id: number;
  parking_id: number;
  parking: Parking;
  name: string;
  status: "AVAILABLE" | "BOOKED" | "OCCUPIED";
  fee: number;
  row: number;
  col: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export const CreateParkingRequest = {
  slug: toTypedSchema(z.string().min(3).max(255)),
  name: toTypedSchema(z.string().min(3).max(255)),
  address: toTypedSchema(z.string().min(3).max(255)),
  latitude: toTypedSchema(z.number()),
  longitude: toTypedSchema(z.number()),
  layout: toTypedSchema(z.array(z.array(z.string()))),
};

export const UpdateParkingRequest = {
  slug: toTypedSchema(z.string().min(3).max(255)),
  name: toTypedSchema(z.string().min(3).max(255)),
  address: toTypedSchema(z.string().min(3).max(255)),
  latitude: toTypedSchema(z.number()),
  longitude: toTypedSchema(z.number()),
  layout: toTypedSchema(z.array(z.array(z.string()))),
};

export const CreateParkingSlotRequest = {
  parking_id: toTypedSchema(z.number()),
  name: toTypedSchema(z.string().min(1).max(8)),
  fee: toTypedSchema(z.number().min(0)),
  row: toTypedSchema(z.number()),
  col: toTypedSchema(z.number()),
};

export const UpdateParkingSlotRequest = {
  name: toTypedSchema(z.string().min(1).max(8)),
  status: toTypedSchema(
    z.nativeEnum({
      AVAILABLE: "AVAILABLE",
      BOOKED: "BOOKED",
      OCCUPIED: "OCCUPIED",
    })
  ),
  fee: toTypedSchema(z.number().min(0)),
  row: toTypedSchema(z.number()),
  col: toTypedSchema(z.number()),
};
