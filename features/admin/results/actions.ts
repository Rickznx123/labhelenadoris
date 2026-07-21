"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { onlyDigits } from "@/lib/utils";
import { examResultCreateSchema } from "@/lib/validations/exam-result";

const MAX_PDF_SIZE_BYTES = 20 * 1024 * 1024;

type ResultRecord = {
  id: string;
  patient_name: string;
  patient_cpf: string;
  birth_date: string;
  exam_name: string;
  exam_date: string;
  pdf_path: string;
  created_at: string;
};

function validatePdfFile(pdf: File, required = true) {
  if (!(pdf instanceof File) || pdf.size === 0) {
    if (required) {
      throw new Error("Selecione um arquivo PDF.");
    }
    return;
  }

  const extension = pdf.name.split(".").pop()?.toLowerCase();
  const isPdfMime = pdf.type === "application/pdf" || pdf.type === "";
  if (extension !== "pdf" || !isPdfMime) {
    throw new Error("Apenas arquivos PDF são permitidos.");
  }

  if (pdf.size > MAX_PDF_SIZE_BYTES) {
    throw new Error("O arquivo PDF deve ter no máximo 20 MB.");
  }
}

async function uploadPdf(cpf: string, pdf: File) {
  const supabase = getSupabaseAdmin();
  const path = `${cpf}/${crypto.randomUUID()}.pdf`;
  const arrayBuffer = await pdf.arrayBuffer();

  const upload = await supabase.storage.from("exam-results").upload(path, arrayBuffer, {
    contentType: "application/pdf",
    upsert: false,
  });

  if (upload.error) {
    throw new Error("Não foi possível enviar o PDF. Tente novamente.");
  }

  return path;
}

export async function createExamResultAction(formData: FormData) {
  const supabase = getSupabaseAdmin();

  const payload = {
    patient_name: String(formData.get("patient_name") || ""),
    patient_cpf: onlyDigits(String(formData.get("patient_cpf") || "")),
    birth_date: String(formData.get("birth_date") || ""),
    exam_name: String(formData.get("exam_name") || ""),
    exam_date: String(formData.get("exam_date") || ""),
  };

  const parsed = examResultCreateSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos");
  }

  const pdf = formData.get("pdf");
  if (!(pdf instanceof File)) {
    throw new Error("Selecione um arquivo PDF.");
  }
  validatePdfFile(pdf, true);

  const path = await uploadPdf(parsed.data.patient_cpf, pdf);

  const inserted = await supabase
    .from("exam_results")
    .insert({
      patient_name: parsed.data.patient_name,
      patient_cpf: parsed.data.patient_cpf,
      birth_date: parsed.data.birth_date,
      exam_name: parsed.data.exam_name,
      exam_date: parsed.data.exam_date,
      pdf_path: path,
    })
    .select("id, patient_name, patient_cpf, birth_date, exam_name, exam_date, pdf_path, created_at")
    .single<ResultRecord>();

  if (inserted.error || !inserted.data) {
    await supabase.storage.from("exam-results").remove([path]);
    throw new Error(inserted.error?.message ?? "Não foi possível cadastrar o resultado.");
  }

  revalidatePath("/admin/resultados");
  return inserted.data;
}

export async function updateExamResultAction(formData: FormData) {
  const supabase = getSupabaseAdmin();
  const id = String(formData.get("id") || "");

  if (!id) {
    throw new Error("Resultado inválido para edição.");
  }

  const payload = {
    patient_name: String(formData.get("patient_name") || ""),
    patient_cpf: onlyDigits(String(formData.get("patient_cpf") || "")),
    birth_date: String(formData.get("birth_date") || ""),
    exam_name: String(formData.get("exam_name") || ""),
    exam_date: String(formData.get("exam_date") || ""),
  };

  const parsed = examResultCreateSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos");
  }

  const current = await supabase.from("exam_results").select("id, pdf_path").eq("id", id).single();
  if (current.error || !current.data) {
    throw new Error("Resultado não encontrado.");
  }

  const pdf = formData.get("pdf");
  const hasNewPdf = pdf instanceof File && pdf.size > 0;

  let nextPdfPath = current.data.pdf_path;
  let uploadedNewPdfPath: string | null = null;

  if (hasNewPdf && pdf instanceof File) {
    validatePdfFile(pdf, false);
    uploadedNewPdfPath = await uploadPdf(parsed.data.patient_cpf, pdf);
    nextPdfPath = uploadedNewPdfPath;
  }

  const updated = await supabase
    .from("exam_results")
    .update({
      patient_name: parsed.data.patient_name,
      patient_cpf: parsed.data.patient_cpf,
      birth_date: parsed.data.birth_date,
      exam_name: parsed.data.exam_name,
      exam_date: parsed.data.exam_date,
      pdf_path: nextPdfPath,
    })
    .eq("id", id)
    .select("id, patient_name, patient_cpf, birth_date, exam_name, exam_date, pdf_path, created_at")
    .single<ResultRecord>();

  if (updated.error || !updated.data) {
    if (uploadedNewPdfPath) {
      await supabase.storage.from("exam-results").remove([uploadedNewPdfPath]);
    }
    throw new Error(updated.error?.message ?? "Não foi possível atualizar o resultado.");
  }

  if (uploadedNewPdfPath && current.data.pdf_path) {
    const removedOld = await supabase.storage.from("exam-results").remove([current.data.pdf_path]);
    if (removedOld.error) {
      // Best effort rollback to avoid orphaning the old file reference.
      await supabase
        .from("exam_results")
        .update({ pdf_path: current.data.pdf_path })
        .eq("id", id);
      await supabase.storage.from("exam-results").remove([uploadedNewPdfPath]);
      throw new Error("Não foi possível substituir o PDF antigo. Tente novamente.");
    }
  }

  revalidatePath("/admin/resultados");
  return updated.data;
}

export async function deleteExamResultAction(id: string) {
  const supabase = getSupabaseAdmin();

  if (!id) {
    throw new Error("Resultado inválido para exclusão.");
  }

  const current = await supabase
    .from("exam_results")
    .select("id, pdf_path")
    .eq("id", id)
    .single();

  if (current.error || !current.data) {
    throw new Error("Resultado não encontrado.");
  }

  const deleted = await supabase.from("exam_results").delete().eq("id", id);
  if (deleted.error) {
    throw new Error("Não foi possível excluir o resultado.");
  }

  const removedPdf = await supabase.storage.from("exam-results").remove([current.data.pdf_path]);
  if (removedPdf.error) {
    throw new Error("Resultado removido, mas houve falha ao excluir o PDF do bucket.");
  }

  revalidatePath("/admin/resultados");
}
