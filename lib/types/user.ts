import { z } from "zod";

export type User = {
  id: number;
  username: string;
  full_name: string;
  email: string;
  google_id: string;
  role: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

const CreateUserRequest = z.object({
  username: z.string().min(3).max(50),
  full_name: z.string().min(3).max(100),
  email: z.string().email(),
  google_id: z.string(),
});

const UpdateUserRequest = z.object({
  username: z.string().min(3).max(50),
  full_name: z.string().min(3).max(100),
});
