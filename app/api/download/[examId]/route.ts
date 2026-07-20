import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { portalLookupSchema } from "@/lib/validations/patient";

type Params = {
  params: Promise<{
    examId: string;
  }>;
};

export async function POST(request: Request, { params }: Params) {
  const { examId } = await params;
  const supabaseAdmin = getSupabaseAdmin();
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for") || requestHeaders.get("x-real-ip");
  const userAgent = requestHeaders.get("user-agent");

  const { data: exam } = await supabaseAdmin
    .from("exams")
    .select("id, patient_id, pdf_path")
    .eq("id", examId)
    .single();

  if (!exam || !exam.pdf_path) {
    return NextResponse.json({ error: "Arquivo nao encontrado" }, { status: 404 });
  }

  let requestedByCpf: string | null = null;
  let allowed = false;

  if (user) {
    allowed = true;
  } else {
    const body = await request.json();
    const parsed = portalLookupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados invalidos" }, { status: 400 });
    }

    const patient = await supabaseAdmin
      .from("patients")
      .select("id, cpf, birth_date")
      .eq("id", exam.patient_id)
      .eq("cpf", parsed.data.cpf)
      .eq("birth_date", parsed.data.birth_date)
      .single();

    if (patient.data) {
      requestedByCpf = parsed.data.cpf;
      allowed = true;
    }
  }

  if (!allowed) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const signed = await supabaseAdmin.storage
    .from("exam-pdfs")
    .createSignedUrl(exam.pdf_path, 60 * 3);

  if (!signed.data?.signedUrl) {
    return NextResponse.json({ error: "Falha ao gerar URL" }, { status: 500 });
  }

  await supabaseAdmin.from("download_logs").insert({
    exam_id: exam.id,
    ip_address: ip,
    user_agent: userAgent,
    downloaded_by: user?.id ?? null,
    requested_by_cpf: requestedByCpf,
  });

  return NextResponse.json({ url: signed.data.signedUrl });
}
