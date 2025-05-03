import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export type User = {
  id: number;
  username: string;
  full_name: string;
  email: string;
  avatar_url: string;
  google_id: string;
  role: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export const CreateUserRequest = {
  username: toTypedSchema(z.string().min(3).max(50)),
  full_name: toTypedSchema(z.string().min(3).max(100)),
  email: toTypedSchema(z.string().email()),
  google_id: toTypedSchema(z.string()),
};

export const UpdateUserRequest = {
  username: toTypedSchema(z.string().min(3).max(50)),
  full_name: toTypedSchema(z.string().min(3).max(100)),
};
