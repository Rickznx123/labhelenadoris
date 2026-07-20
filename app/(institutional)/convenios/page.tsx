import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LAB_INFO } from "@/lib/lab-info";

export const metadata: Metadata = {
  title: "Convenios",
  description: "Atendimento particular e convenio Ampla+.",
};

export default function ConveniosPage() {
  return (
    <Container className="space-y-8 py-16">
      <h1 className="font-display text-5xl">Convenios</h1>
      <p className="text-muted-foreground">Atendimento particular e convenio Ampla+.</p>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Convenio atendido</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[140px_1fr] md:items-center">
          <div className="flex h-20 items-center justify-center rounded-2xl border bg-secondary text-2xl font-bold text-secondary-foreground">
            {LAB_INFO.insurance}
          </div>
          <p className="text-muted-foreground">Nossa equipe esta pronta para orientar sobre cobertura, preparo e prazos de entrega dos exames.</p>
        </CardContent>
      </Card>
    </Container>
  );
}
