import { createServerSupabaseClient } from "@/lib/supabase/server";

type AuditInput = {
  actorId?: string | null;
  actorRole?: string | null;
  action: string;
  tableName: string;
  recordId?: string | null;
  meta?: Record<string, unknown>;
  ipAddress?: string | null;
};

export async function registerAuditLog(input: AuditInput) {
  const supabase = await createServerSupabaseClient();
  await supabase.from("audit_logs").insert({
    actor_id: input.actorId ?? null,
    actor_role: input.actorRole ?? null,
    action: input.action,
    table_name: input.tableName,
    record_id: input.recordId ?? null,
    meta: input.meta ?? {},
    ip_address: input.ipAddress ?? null,
  });
}
