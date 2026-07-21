import { z } from "zod";

export const patientSchema = z.object({
  full_name: z.string().min(3, "Nome obrigatório"),
  cpf: z.string().regex(/^\d{11}$/, "CPF deve conter 11 dígitos"),
  birth_date: z.string().min(1, "Data de nascimento obrigatória"),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  sex: z.enum(["M", "F", "O"]),
  notes: z.string().optional(),
});

export const portalLookupSchema = z.object({
  cpf: z.string().regex(/^\d{11}$/, "CPF inválido"),
  birth_date: z.string().min(1, "Data de nascimento obrigatória"),
});
