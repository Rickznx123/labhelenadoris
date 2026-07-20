import { z } from "zod";

export const adminUserSchema = z.object({
  full_name: z.string().min(3, "Nome obrigatorio"),
  email: z.string().email("Email invalido"),
  role: z.enum(["admin", "staff"]),
  phone: z.string().optional(),
  password: z.string().min(6, "Senha minima de 6 caracteres").optional(),
});
