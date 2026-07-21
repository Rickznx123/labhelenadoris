import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LAB_INFO } from "@/lib/lab-info";

export const metadata: Metadata = {
  title: "Sobre",
  description: `Conheça o ${LAB_INFO.shortName}, laboratório com foco em qualidade, confiança e precisão.`,
};

export default function SobrePage() {
  return (
    <Container className="space-y-10 py-16">
      <h1 className="font-display text-5xl">Sobre o {LAB_INFO.shortName}</h1>
      <p className="max-w-4xl text-muted-foreground">
        No Helena Doris Laboratório de Análises Clínicas, unimos qualidade, confiança e precisão para oferecer uma experiência de saúde completa.
        Nosso atendimento humanizado e nossa estrutura tecnológica garantem exames confiáveis e suporte acolhedor para cada paciente.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <Image
          src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
          alt="Profissional em laboratório"
          width={900}
          height={600}
          className="h-72 w-full rounded-3xl object-cover"
        />
        <Image
          src="https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&w=1200&q=80"
          alt="Equipamentos laboratoriais"
          width={900}
          height={600}
          className="h-72 w-full rounded-3xl object-cover"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Qualidade</CardTitle>
          </CardHeader>
          <CardContent>Protocolos rigorosos e monitoramento contínuo para garantir excelência em cada análise.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Confiança e precisão</CardTitle>
          </CardHeader>
          <CardContent>Resultados consistentes, rastreáveis e seguros, apoiando decisões médicas com clareza.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Atendimento humanizado</CardTitle>
          </CardHeader>
          <CardContent>Escuta ativa, acolhimento e compromisso com o bem-estar de cada familia atendida.</CardContent>
        </Card>
      </div>
    </Container>
  );
}
