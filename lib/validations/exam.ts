import { z } from "zod";

export const examSchema = z.object({
  patient_id: z.string().uuid("Paciente invalido"),
  exam_type: z.string().min(2, "Tipo de exame obrigatorio"),
  exam_date: z.string().min(1, "Data obrigatoria"),
  status: z.enum(["pending", "completed"]),
  notes: z.string().optional(),
});
