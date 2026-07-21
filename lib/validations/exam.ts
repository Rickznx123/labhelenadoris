import { z } from "zod";

export const examSchema = z.object({
  patient_id: z.string().uuid("Paciente inválido"),
  exam_type: z.string().min(2, "Tipo de exame obrigatório"),
  exam_date: z.string().min(1, "Data obrigatória"),
  status: z.enum(["pending", "completed"]),
  notes: z.string().optional(),
});
