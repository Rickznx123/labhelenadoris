import { Container } from "@/components/layout/container";
import { ResultsManager } from "@/features/admin/results/results-manager";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminResultadosPage() {
  const supabase = getSupabaseAdmin();
  const { data: results } = await supabase
    .from("exam_results")
    .select("id, patient_name, patient_cpf, birth_date, exam_name, exam_date, pdf_path, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <Container className="space-y-6 py-10">
      <header>
        <h1 className="font-display text-4xl text-gray-700">Portal de Resultados</h1>
        <p className="mt-2 text-muted-foreground">Upload manual e listagem de resultados em PDF.</p>
      </header>
      <ResultsManager initialResults={results ?? []} />
    </Container>
  );
}
