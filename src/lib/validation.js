import { z } from "zod";

export const userSchema = z.object({
  firstName: z.string().min(3).max(20),
  lastName: z.string().min(3).max(40),
  userName: z.string().min(4).max(23),
  password: z.string().min(4).max(16),
});
