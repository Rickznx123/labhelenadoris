import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, MapPin, MessageCircle, ShieldCheck, Sparkles, Timer } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionTitle } from "@/features/institutional/section-title";
import { LAB_INFO } from "@/lib/lab-info";

const differentials = [
  {
    title: "Seguranca e confiabilidade",
    description: "Processos rastreaveis e controle rigoroso de qualidade em todas as etapas.",
    icon: ShieldCheck,
  },
  {
    title: "Resultados rapidos",
    description: "Fluxo moderno de analises para entregar laudos com agilidade e precisao.",
    icon: Timer,
  },
  {
    title: "Profissionais qualificados",
    description: "Equipe treinada para atendimento acolhedor e suporte tecnico especializado.",
    icon: Sparkles,
  },
];

const examAreas = ["Hematologia", "Bioquimica", "Urinalise", "Parasitologia", "Hormonios", "Microbiologia"];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden py-12 md:py-20">
        <Container className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="stagger-enter space-y-6">
            <Badge className="w-fit bg-secondary text-secondary-foreground">Helena Doris Laboratorio</Badge>
            <h1 className="font-display text-4xl leading-tight text-gray-700 md:text-6xl">
              Cuidado e precisao para a sua saude.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Exames laboratoriais com qualidade, agilidade e seguranca para voce e sua familia.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href={`https://wa.me/${LAB_INFO.whatsappMain}`} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Agendar pelo WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/exames">
                  Ver exames
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-2 pt-2 text-sm md:grid-cols-3">
              <p className="flex items-center gap-2 rounded-xl border bg-card px-3 py-2"><CheckCircle2 className="h-4 w-4 text-[var(--brand)]" /> Seguranca e confiabilidade</p>
              <p className="flex items-center gap-2 rounded-xl border bg-card px-3 py-2"><CheckCircle2 className="h-4 w-4 text-[var(--brand)]" /> Resultados rapidos</p>
              <p className="flex items-center gap-2 rounded-xl border bg-card px-3 py-2"><CheckCircle2 className="h-4 w-4 text-[var(--brand)]" /> Profissionais qualificados</p>
            </div>
          </div>
          <div className="glass-panel overflow-hidden rounded-3xl border p-2 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
            <Image
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=80"
              alt="Laboratorio moderno"
              width={900}
              height={700}
              className="h-[420px] w-full rounded-2xl object-cover"
            />
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="space-y-10">
          <SectionTitle eyebrow="Diferenciais" title="Experiencia premium em analises clinicas" />
          <div className="grid gap-4 md:grid-cols-3">
            {differentials.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="soft-lift">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                        <Icon className="h-4 w-4" />
                      </span>
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {item.description}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="space-y-10">
          <SectionTitle eyebrow="Areas de exames" title="Especialidades com controle de qualidade" />
          <div className="grid gap-3 md:grid-cols-3">
            {examAreas.map((area) => (
              <Card key={area} className="soft-lift">
                <CardContent className="flex items-center gap-3 pt-6">
                  <CheckCircle2 className="h-5 w-5 text-[var(--brand)]" />
                  <span className="font-medium">{area}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="space-y-6">
          <SectionTitle
            eyebrow="Resultados"
            title="Como consultar resultados"
            description="Acesse a area de resultados, informe CPF e data de nascimento, e baixe seu exame em PDF com seguranca."
          />
          <div className="mx-auto grid max-w-5xl gap-4 rounded-3xl border bg-card p-5 md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <p className="text-muted-foreground">Resultado disponivel para download seguro com link temporario.</p>
            <Button asChild size="lg">
              <Link href="/resultados">Consultar resultados</Link>
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="font-display text-3xl">Horario de atendimento</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-muted-foreground md:grid-cols-2">
              <p className="flex items-center gap-2 rounded-xl bg-muted px-4 py-3"><Clock3 className="h-4 w-4 text-[var(--brand)]" /> {LAB_INFO.hours.weekdays}</p>
              <p className="flex items-center gap-2 rounded-xl bg-muted px-4 py-3"><Clock3 className="h-4 w-4 text-[var(--brand)]" /> {LAB_INFO.hours.saturday}</p>
            </CardContent>
          </Card>
        </Container>
      </section>

      <section className="py-16">
        <Container className="space-y-10">
          <SectionTitle eyebrow="Unidades" title="Estamos perto de voce em Alta Floresta - MT" />
          <div className="grid gap-4 md:grid-cols-2">
            {LAB_INFO.units.map((unit) => (
              <Card key={unit.id} className="soft-lift">
                <CardHeader>
                  <CardTitle>{unit.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 text-[var(--brand)]" /> {unit.addressLine1}</p>
                  <p>{unit.reference}</p>
                  <p>{unit.city}</p>
                  <a href={`https://wa.me/${unit.whatsapp}`} target="_blank" rel="noreferrer" className="text-[var(--brand-strong)]">
                    WhatsApp: {unit.whatsappDisplay}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-3xl">Convenios</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-[160px_1fr] md:items-center">
              <div className="flex h-24 w-full items-center justify-center rounded-2xl border bg-secondary text-2xl font-bold text-secondary-foreground">
                {LAB_INFO.insurance}
              </div>
              <p className="text-muted-foreground">Atendimento particular e convenio Ampla+.</p>
            </CardContent>
          </Card>
        </Container>
      </section>

      <section className="pb-20 pt-8">
        <Container>
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
              <h3 className="font-display text-3xl">Precisa agendar seus exames?</h3>
              <p className="max-w-2xl text-muted-foreground">Fale com nossa equipe e agende pelo WhatsApp em poucos segundos.</p>
              <Button asChild size="lg">
                <a href={`https://wa.me/${LAB_INFO.whatsappMain}`} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Agendar pelo WhatsApp
                </a>
              </Button>
            </CardContent>
          </Card>
        </Container>
      </section>
    </>
  );
}
