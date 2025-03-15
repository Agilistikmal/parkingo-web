import { z } from "zod";
import type { User } from "./user";

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

export const CreateParkingRequest = z.object({
  slug: z.string().min(3).max(255),
  name: z.string().min(3).max(255),
  address: z.string().min(3).max(255),
  latitude: z.number(),
  longitude: z.number(),
  layout: z.array(z.array(z.string())),
});

export const UpdateParkingRequest = z.object({
  slug: z.string().min(3).max(255),
  name: z.string().min(3).max(255),
  address: z.string().min(3).max(255),
  latitude: z.number(),
  longitude: z.number(),
  layout: z.array(z.array(z.string())),
});

export const CreateParkingSlotRequest = z.object({
  parking_id: z.number(),
  name: z.string().min(1).max(8),
  fee: z.number().min(0),
  row: z.number(),
  col: z.number(),
});

export const UpdateParkingSlotRequest = z.object({
  name: z.string().min(1).max(8),
  status: z.nativeEnum({
    AVAILABLE: "AVAILABLE",
    BOOKED: "BOOKED",
    OCCUPIED: "OCCUPIED",
  }),
  fee: z.number().min(0),
  row: z.number(),
  col: z.number(),
});
