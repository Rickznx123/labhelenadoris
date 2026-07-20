import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { examResultLookupApiSchema } from "@/lib/validations/exam-result";

function normalizeDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return parsed.toISOString().slice(0, 10);
}

export async function POST(request: Request) {
  const body = await request.json();
  const cpf = String(body?.cpf || "").replace(/\D/g, "");
  const birthDate = normalizeDate(String(body?.birthDate || ""));

  const parsed = examResultLookupApiSchema.safeParse({
    cpf,
    birthDate,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dados invalidos" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("exam_results")
    .select("*")
    .eq("patient_cpf", cpf)
    .eq("birth_date", birthDate)
    .order("exam_date", { ascending: false });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ results: data ?? [] });
}
