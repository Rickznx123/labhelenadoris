"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { adminUserSchema } from "@/lib/validations/user";
import { registerAuditLog } from "@/services/repositories/audit-repository";

export async function upsertUserAction(formData: FormData) {
  const supabaseAdmin = getSupabaseAdmin();
  const { user, profile } = await requireAdminSession();
  if (profile.role !== "admin") {
    throw new Error("Apenas administradores podem gerenciar usuarios.");
  }

  const id = String(formData.get("id") || "");
  const parsed = adminUserSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    role: formData.get("role"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Erro de validacao");
  }

  if (!id) {
    if (!parsed.data.password) {
      throw new Error("Senha obrigatoria para novo usuario.");
    }

    const created = await supabaseAdmin.auth.admin.createUser({
      email: parsed.data.email,
      password: parsed.data.password,
      email_confirm: true,
      user_metadata: {
        full_name: parsed.data.full_name,
      },
    });

    if (created.error || !created.data.user) {
      throw new Error(created.error?.message ?? "Falha ao criar usuario");
    }

    const userId = created.data.user.id;

    await supabaseAdmin.from("profiles").insert({
      id: userId,
      full_name: parsed.data.full_name,
      role: parsed.data.role,
      phone: parsed.data.phone || null,
      is_active: true,
    });

    await supabaseAdmin.from("users").insert({
      id: userId,
      email: parsed.data.email,
      role: parsed.data.role,
      is_active: true,
    });

    await registerAuditLog({
      actorId: user.id,
      actorRole: profile.role,
      action: "CREATE_USER",
      tableName: "profiles",
      recordId: userId,
      meta: { email: parsed.data.email, role: parsed.data.role },
    });
  } else {
    await supabaseAdmin
      .from("profiles")
      .update({
        full_name: parsed.data.full_name,
        role: parsed.data.role,
        phone: parsed.data.phone || null,
      })
      .eq("id", id);

    await supabaseAdmin
      .from("users")
      .update({
        email: parsed.data.email,
        role: parsed.data.role,
      })
      .eq("id", id);

    if (parsed.data.password) {
      await supabaseAdmin.auth.admin.updateUserById(id, {
        password: parsed.data.password,
      });
    }

    await registerAuditLog({
      actorId: user.id,
      actorRole: profile.role,
      action: "UPDATE_USER",
      tableName: "profiles",
      recordId: id,
      meta: { email: parsed.data.email, role: parsed.data.role },
    });
  }

  revalidatePath("/admin/usuarios");
}

export async function deleteUserAction(formData: FormData) {
  const supabaseAdmin = getSupabaseAdmin();
  const { user, profile } = await requireAdminSession();
  if (profile.role !== "admin") {
    throw new Error("Apenas administradores podem excluir usuarios.");
  }

  const id = String(formData.get("id") || "");
  if (!id || id === user.id) {
    throw new Error("Operacao invalida.");
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (error) throw new Error(error.message);

  await registerAuditLog({
    actorId: user.id,
    actorRole: profile.role,
    action: "DELETE_USER",
    tableName: "profiles",
    recordId: id,
  });

  revalidatePath("/admin/usuarios");
}
