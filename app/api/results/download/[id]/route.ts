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

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const cpf = String(body?.cpf || "").replace(/\D/g, "");
  const birthDate = normalizeDate(String(body?.birthDate || ""));

  const parsed = examResultLookupApiSchema.safeParse({
    cpf,
    birthDate,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const record = await supabase
    .from("exam_results")
    .select("id, pdf_path")
    .eq("id", id)
    .eq("patient_cpf", cpf)
    .eq("birth_date", birthDate)
    .single();

  if (record.error || !record.data?.pdf_path) {
    return NextResponse.json({ error: "Resultado não encontrado" }, { status: 404 });
  }

  const signed = await supabase.storage
    .from("exam-results")
    .createSignedUrl(record.data.pdf_path, 60 * 5);

  if (!signed.data?.signedUrl) {
    return NextResponse.json({ error: "Falha ao gerar link" }, { status: 500 });
  }

  return NextResponse.json({ url: signed.data.signedUrl });
}
