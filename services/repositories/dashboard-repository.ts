import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getDashboardSummary() {
  const supabase = await createServerSupabaseClient();

  const [patientsCount, examsCount, completedCount, pendingCount, recentUploads, recentLogs] =
    await Promise.all([
      supabase.from("patients").select("id", { count: "exact", head: true }),
      supabase.from("exams").select("id", { count: "exact", head: true }),
      supabase
        .from("exams")
        .select("id", { count: "exact", head: true })
        .eq("status", "completed"),
      supabase
        .from("exams")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("exams")
        .select("id, exam_type, exam_date, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("download_logs")
        .select("id, created_at, ip_address, requested_by_cpf, exam_id")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const monthlySeries = await supabase
    .from("exams")
    .select("exam_date, status")
    .gte(
      "exam_date",
      new Date(new Date().setMonth(new Date().getMonth() - 5))
        .toISOString()
        .slice(0, 10),
    )
    .order("exam_date", { ascending: true });

  return {
    totalPatients: patientsCount.count ?? 0,
    totalExams: examsCount.count ?? 0,
    completedExams: completedCount.count ?? 0,
    pendingExams: pendingCount.count ?? 0,
    recentUploads: recentUploads.data ?? [],
    recentLogs: recentLogs.data ?? [],
    monthlySeries: monthlySeries.data ?? [],
  };
}
