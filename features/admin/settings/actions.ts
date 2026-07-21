"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth";
import { settingsSchema } from "@/lib/validations/settings";
import { registerAuditLog } from "@/services/repositories/audit-repository";

export async function saveSettingsAction(formData: FormData) {
  const { supabase, user, profile } = await requireAdminSession();

  const parsed = settingsSchema.safeParse({
    lab_name: formData.get("lab_name"),
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp"),
    address: formData.get("address"),
    logo_url: formData.get("logo_url"),
    instagram: formData.get("instagram"),
    facebook: formData.get("facebook"),
    linkedin: formData.get("linkedin"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Erro de validação");
  }

  const settingsId = String(formData.get("id") || "");

  if (settingsId) {
    const { error } = await supabase.from("settings").update(parsed.data).eq("id", settingsId);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("settings").insert(parsed.data);
    if (error) throw new Error(error.message);
  }

  await registerAuditLog({
    actorId: user.id,
    actorRole: profile.role,
    action: "UPSERT_SETTINGS",
    tableName: "settings",
    recordId: settingsId || null,
    meta: parsed.data,
  });

  revalidatePath("/admin/configuracoes");
}
