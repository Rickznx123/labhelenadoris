import { redirect } from "next/navigation";
import { loginRequired } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function requireAdminSession() {
  if (!loginRequired) {
    const supabase = getSupabaseAdmin();
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, full_name, role, is_active")
      .eq("role", "admin")
      .eq("is_active", true)
      .limit(1)
      .single();

    if (error || !profile) {
      throw new Error("Modo administrativo simples ativo, mas nenhum perfil admin ativo foi encontrado.");
    }

    return {
      user: { id: profile.id },
      profile,
      supabase,
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role, is_active")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.is_active) {
    redirect("/admin/login");
  }

  return {
    user,
    profile,
    supabase,
  };
}
