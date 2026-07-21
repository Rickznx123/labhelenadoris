import { AlertCircle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ResultsManager } from "@/features/admin/results/results-manager";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

type ResultRecord = {
  id: string;
  patient_name: string;
  patient_cpf: string;
  birth_date: string;
  exam_name: string;
  exam_date: string;
  pdf_path: string;
  created_at: string;
};

export const dynamic = "force-dynamic";

export default async function AdminResultadosPage() {
  let results: ResultRecord[] = [];
  let errorMessage: string | null = null;

  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("exam_results")
      .select("id, patient_name, patient_cpf, birth_date, exam_name, exam_date, pdf_path, created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    results = (data ?? []) as ResultRecord[];
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Não foi possível carregar os resultados.";
    console.error("Failed to load admin results:", error);
  }

  return (
    <Container className="space-y-6 py-10">
      <header>
        <h1 className="font-display text-4xl text-gray-700">Portal de Resultados</h1>
        <p className="mt-2 text-muted-foreground">Upload manual e listagem de resultados em PDF.</p>
      </header>
      {errorMessage ? (
        <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <p className="font-medium">Não foi possível carregar os resultados.</p>
          </div>
          <p className="mt-1">{errorMessage}</p>
        </div>
      ) : null}
      <ResultsManager initialResults={results} />
    </Container>
  );
}
