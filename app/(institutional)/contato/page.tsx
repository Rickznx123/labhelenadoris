import type { Metadata } from "next";
import { Clock3, MapPin, MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LAB_INFO } from "@/lib/lab-info";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com o Helena Doris por WhatsApp, telefone ou formulario.",
};

export default function ContatoPage() {
  return (
    <Container className="space-y-8 py-16">
      <h1 className="font-display text-5xl">Contato</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Central de atendimento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-[var(--brand)]" /> {LAB_INFO.phoneMainDisplay}</p>
            <a href={`https://wa.me/${LAB_INFO.whatsappMain}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[var(--brand-strong)]"><MessageCircle className="h-4 w-4" /> Agendar pelo WhatsApp</a>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Horario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[var(--brand)]" /> {LAB_INFO.hours.weekdays}</p>
            <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[var(--brand)]" /> {LAB_INFO.hours.saturday}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Unidades</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {LAB_INFO.units.map((unit) => (
              <div key={unit.id} className="rounded-xl border bg-muted/40 p-3">
                <p className="font-medium text-foreground">{unit.name}</p>
                <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-[var(--brand)]" /> {unit.addressLine1}</p>
                <p>{unit.reference}</p>
                <p>{unit.city}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Formulario</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Seu nome" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="(66) 99999-9999" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea id="message" placeholder="Como podemos ajudar?" />
              </div>
              <Button type="button" className="w-full">Enviar mensagem</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Mapa</CardTitle></CardHeader>
        <CardContent>
          <iframe
            title="Mapa da unidade Centro"
            className="h-80 w-full rounded-2xl border"
            loading="lazy"
            src="https://www.google.com/maps?q=-9.8758,-56.0861&z=14&output=embed"
          />
        </CardContent>
      </Card>
    </Container>
  );
}
