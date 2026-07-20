import { z } from "zod";

export const settingsSchema = z.object({
  lab_name: z.string().min(3, "Nome do laboratorio obrigatorio"),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  logo_url: z.string().url("URL invalida").optional().or(z.literal("")),
  instagram: z.string().url("URL invalida").optional().or(z.literal("")),
  facebook: z.string().url("URL invalida").optional().or(z.literal("")),
  linkedin: z.string().url("URL invalida").optional().or(z.literal("")),
});
