import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function findPatientExamsByIdentity(cpf: string, birthDate: string) {
  const supabase = await createServerSupabaseClient();
  const { data: patient } = await supabase
    .from("patients")
    .select("id, full_name")
    .eq("cpf", cpf)
    .eq("birth_date", birthDate)
    .single();

  if (!patient) {
    return { patient: null, exams: [] };
  }

  const { data: exams } = await supabase
    .from("exams")
    .select("id, exam_type, exam_date, status, pdf_path")
    .eq("patient_id", patient.id)
    .order("exam_date", { ascending: false });

  return {
    patient,
    exams: exams ?? [],
  };
}
