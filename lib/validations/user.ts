import { z } from "zod";

export const adminUserSchema = z.object({
  full_name: z.string().min(3, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  role: z.enum(["admin", "staff"]),
  phone: z.string().optional(),
  password: z.string().min(6, "Senha mínima de 6 caracteres").optional(),
});
