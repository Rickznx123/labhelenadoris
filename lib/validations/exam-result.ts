import { z } from "zod";

const cpfWithElevenDigitsSchema = z
  .string()
  .refine((value) => value.replace(/\D/g, "").length === 11, "CPF deve conter 11 digitos");

export const examResultCreateSchema = z.object({
  patient_name: z.string().min(3, "Nome do paciente obrigatorio"),
  patient_cpf: cpfWithElevenDigitsSchema,
  birth_date: z.string().min(1, "Data de nascimento obrigatoria"),
  exam_name: z.string().min(2, "Nome do exame obrigatorio"),
  exam_date: z.string().min(1, "Data do exame obrigatoria"),
});

export const examResultLookupSchema = z.object({
  cpf: cpfWithElevenDigitsSchema,
  birth_date: z.string().min(1, "Data de nascimento obrigatoria"),
});

export const examResultLookupApiSchema = z.object({
  cpf: z.string().regex(/^\d{11}$/, "CPF invalido"),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data de nascimento invalida"),
});
