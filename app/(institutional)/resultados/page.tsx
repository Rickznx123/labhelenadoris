import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { ResultLookupForm } from "@/features/patient-portal/result-lookup-form";

export const metadata: Metadata = {
  title: "Resultados",
  description: "Consulte resultados por CPF e data de nascimento de forma simples e segura.",
};

export default function ResultadosPage() {
  return (
    <Container className="space-y-8 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-5xl">Consulte seus resultados</h1>
        <p className="mt-3 text-muted-foreground">
          Informe CPF e data de nascimento para visualizar os exames disponiveis.
        </p>
      </div>
      <div className="mx-auto max-w-5xl">
        <ResultLookupForm />
      </div>
    </Container>
  );
}
