import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const exams = [
  "Hematologia",
  "Bioquimica",
  "Urinalise",
  "Parasitologia",
  "Hormonios",
  "Microbiologia",
];

export const metadata: Metadata = {
  title: "Exames",
  description: "Conheca as principais areas de exames laboratoriais do Helena Doris.",
};

export default function ExamesPage() {
  return (
    <Container className="space-y-8 py-16">
      <h1 className="font-display text-5xl">Areas de exames</h1>
      <p className="max-w-3xl text-muted-foreground">
        Estrutura tecnica para atender desde exames de rotina ate analises especializadas com precisao e seguranca.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {exams.map((exam) => (
          <Card key={exam} className="transition-transform hover:-translate-y-0.5">
            <CardHeader>
              <CardTitle className="text-base">{exam}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Processamento em equipamentos modernos com controle de qualidade laboratorial.
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
