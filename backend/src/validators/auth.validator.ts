import z from "zod";
import { UserRole } from "../types/UserRoles.type";

export const signupSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(UserRole),
});
