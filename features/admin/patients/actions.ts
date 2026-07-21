"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth";
import { patientSchema } from "@/lib/validations/patient";
import { registerAuditLog } from "@/services/repositories/audit-repository";

export async function upsertPatientAction(formData: FormData) {
  const { supabase, user, profile } = await requireAdminSession();
  const id = String(formData.get("id") || "");

  const parsed = patientSchema.safeParse({
    full_name: formData.get("full_name"),
    cpf: formData.get("cpf"),
    birth_date: formData.get("birth_date"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    sex: formData.get("sex"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Erro de validação");
  }

  if (id) {
    const { error } = await supabase.from("patients").update(parsed.data).eq("id", id);
    if (error) throw new Error(error.message);
    await registerAuditLog({
      actorId: user.id,
      actorRole: profile.role,
      action: "UPDATE_PATIENT",
      tableName: "patients",
      recordId: id,
      meta: parsed.data,
    });
  } else {
    const { data, error } = await supabase.from("patients").insert(parsed.data).select("id").single();
    if (error) throw new Error(error.message);
    await registerAuditLog({
      actorId: user.id,
      actorRole: profile.role,
      action: "CREATE_PATIENT",
      tableName: "patients",
      recordId: data?.id,
      meta: parsed.data,
    });
  }

  revalidatePath("/admin/pacientes");
}

export async function deletePatientAction(formData: FormData) {
  const { supabase, user, profile } = await requireAdminSession();
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("ID inválido");

  const { error } = await supabase.from("patients").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await registerAuditLog({
    actorId: user.id,
    actorRole: profile.role,
    action: "DELETE_PATIENT",
    tableName: "patients",
    recordId: id,
  });

  revalidatePath("/admin/pacientes");
}
