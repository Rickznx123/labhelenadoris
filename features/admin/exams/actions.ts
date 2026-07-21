"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { examSchema } from "@/lib/validations/exam";
import { registerAuditLog } from "@/services/repositories/audit-repository";

async function uploadPdf(file: File, patientId: string) {
  const supabaseAdmin = getSupabaseAdmin();
  const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
  const path = `${patientId}/${crypto.randomUUID()}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();
  const { error } = await supabaseAdmin.storage
    .from("exam-pdfs")
    .upload(path, arrayBuffer, {
      contentType: file.type || "application/pdf",
      upsert: false,
    });
  if (error) throw new Error(error.message);
  return path;
}

export async function upsertExamAction(formData: FormData) {
  const supabaseAdmin = getSupabaseAdmin();
  const { supabase, user, profile } = await requireAdminSession();
  const id = String(formData.get("id") || "");

  const parsed = examSchema.safeParse({
    patient_id: formData.get("patient_id"),
    exam_type: formData.get("exam_type"),
    exam_date: formData.get("exam_date"),
    status: formData.get("status"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Erro de validação");
  }

  let pdfPath: string | undefined;
  const pdf = formData.get("pdf");
  if (pdf instanceof File && pdf.size > 0) {
    pdfPath = await uploadPdf(pdf, parsed.data.patient_id);
  }

  if (id) {
    const { data: current } = await supabase
      .from("exams")
      .select("pdf_path")
      .eq("id", id)
      .single();

    const { error } = await supabase
      .from("exams")
      .update({
        ...parsed.data,
        pdf_path: pdfPath ?? undefined,
        changed_by: user.id,
      })
      .eq("id", id);

    if (error) throw new Error(error.message);

    if (pdfPath && current?.pdf_path) {
      await supabaseAdmin.storage.from("exam-pdfs").remove([current.pdf_path]);
    }

    await registerAuditLog({
      actorId: user.id,
      actorRole: profile.role,
      action: "UPDATE_EXAM",
      tableName: "exams",
      recordId: id,
      meta: { ...parsed.data, uploadedPdf: Boolean(pdfPath) },
    });
  } else {
    const { data, error } = await supabase
      .from("exams")
      .insert({
        ...parsed.data,
        pdf_path: pdfPath ?? null,
        uploaded_by: user.id,
        changed_by: user.id,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    await registerAuditLog({
      actorId: user.id,
      actorRole: profile.role,
      action: "CREATE_EXAM",
      tableName: "exams",
      recordId: data?.id,
      meta: { ...parsed.data, uploadedPdf: Boolean(pdfPath) },
    });
  }

  revalidatePath("/admin/exames");
}

export async function deleteExamAction(formData: FormData) {
  const supabaseAdmin = getSupabaseAdmin();
  const { supabase, user, profile } = await requireAdminSession();
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("ID inválido");

  const { data: exam } = await supabase
    .from("exams")
    .select("pdf_path")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("exams").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (exam?.pdf_path) {
    await supabaseAdmin.storage.from("exam-pdfs").remove([exam.pdf_path]);
  }

  await registerAuditLog({
    actorId: user.id,
    actorRole: profile.role,
    action: "DELETE_EXAM",
    tableName: "exams",
    recordId: id,
  });

  revalidatePath("/admin/exames");
}
