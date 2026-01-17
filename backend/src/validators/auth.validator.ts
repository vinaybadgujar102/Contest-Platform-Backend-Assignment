import z from "zod";
import { UserRole } from "../types/UserRoles.type";

export const signupSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(UserRole),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
