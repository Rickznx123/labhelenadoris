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
  console.log("[LOOKUP] início da requisição");

  try {
    const body = await request.json();
    const cpf = String(body?.cpf || "").replace(/\D/g, "");
    const birthDate = normalizeDate(String(body?.birthDate || ""));

    console.log("[LOOKUP] CPF recebido", cpf);
    console.log("[LOOKUP] data normalizada", birthDate);

    const parsed = examResultLookupApiSchema.safeParse({
      cpf,
      birthDate,
    });

    if (!parsed.success) {
      console.log("[LOOKUP] validação falhou", parsed.error.issues);
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    console.log("[LOOKUP] getSupabaseAdmin() criado com sucesso");
    console.log("[LOOKUP] NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 30) ?? "<undefined>");
    console.log("[LOOKUP] SUPABASE_SERVICE_ROLE_KEY presente", Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY));

    console.log("[LOOKUP] antes da consulta .from('exam_results')");
    const { data, error } = await supabase
      .from("exam_results")
      .select("*")
      .eq("patient_cpf", cpf)
      .eq("birth_date", birthDate)
      .order("exam_date", { ascending: false });

    console.log("[LOOKUP] depois da consulta", { dataLength: data?.length ?? 0, hasError: Boolean(error) });

    if (error) {
      console.error("[LOOKUP] erro retornado pelo Supabase", error);
      console.error("[LOOKUP] objeto error completo", JSON.stringify(error, null, 2));
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ results: data ?? [] });
  } catch (error) {
    console.error("[LOOKUP ERROR]", error);
    console.error("[LOOKUP ERROR STACK]", error instanceof Error ? error.stack : error);
    return NextResponse.json({ error: "Erro interno ao consultar resultados" }, { status: 500 });
  }
}
