import type { Metadata } from "next";
import { MapPin, MessageCircle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LAB_INFO } from "@/lib/lab-info";

export const metadata: Metadata = {
  title: "Unidades",
  description: "Unidades Centro e Bom Pastor em Alta Floresta - MT.",
};

export default function UnidadesPage() {
  return (
    <Container className="space-y-8 py-16">
      <h1 className="font-display text-5xl">Unidades</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {LAB_INFO.units.map((unit) => (
          <Card key={unit.id}>
            <CardHeader>
              <CardTitle>{unit.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-[var(--brand)]" />
                <span>{unit.addressLine1}</span>
              </p>
              <p>{unit.reference}</p>
              <p>{unit.city}</p>
              <a
                href={`https://wa.me/${unit.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[var(--brand-strong)]"
              >
                <MessageCircle className="h-4 w-4" />
                {unit.whatsappDisplay}
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
