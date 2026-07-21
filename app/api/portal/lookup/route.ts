import { NextResponse } from "next/server";
import { findPatientExamsByIdentity } from "@/services/repositories/patient-portal-repository";
import { portalLookupSchema } from "@/lib/validations/patient";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = portalLookupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const result = await findPatientExamsByIdentity(parsed.data.cpf, parsed.data.birth_date);

  return NextResponse.json({
    patientName: result.patient?.full_name ?? null,
    exams: result.exams,
  });
}
