import { Database } from "@/types/database";

export type Patient = Database["public"]["Tables"]["patients"]["Row"];
export type Exam = Database["public"]["Tables"]["exams"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Setting = Database["public"]["Tables"]["settings"]["Row"];

export type ExamWithPatient = Exam & {
  patient: Pick<Patient, "id" | "full_name" | "cpf">;
};
