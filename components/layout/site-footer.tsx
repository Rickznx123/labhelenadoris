import Link from "next/link";
import { Clock3, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { BrandLogo } from "@/components/brand-logo";
import { LAB_INFO } from "@/lib/lab-info";

const links = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/exames", label: "Exames" },
  { href: "/convenios", label: "Convênios" },
  { href: "/unidades", label: "Unidades" },
  { href: "/contato", label: "Contato" },
  { href: "/resultados", label: "Resultados" },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-white text-foreground">
      <Container className="grid gap-8 py-14 md:grid-cols-5">
        <div>
          <BrandLogo size="sm" href="/" />
          <p className="mt-2 text-sm text-muted-foreground">
            Cuidado e precisão para a sua saúde com atendimento humanizado e estrutura moderna.
          </p>
        </div>
        <div>
          <h4 className="font-medium">Menu</h4>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {links.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-[var(--brand-strong)]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-medium">Horários</h4>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><Clock3 className="h-4 w-4 text-[var(--brand)]" /> {LAB_INFO.hours.weekdays}</p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground"><Clock3 className="h-4 w-4 text-[var(--brand)]" /> {LAB_INFO.hours.saturday}</p>
        </div>
        <div>
          <h4 className="font-medium">Contatos</h4>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4 text-[var(--brand)]" /> {LAB_INFO.phoneMainDisplay}</p>
          <a
            href={`https://wa.me/${LAB_INFO.whatsappMain}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-[var(--brand-strong)] hover:text-[var(--brand)]"
          >
            Agendar pelo WhatsApp
          </a>
        </div>
        <div>
          <h4 className="font-medium">Unidades</h4>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            {LAB_INFO.units.map((unit) => (
              <li key={unit.id} className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-[var(--brand)]" />
                <span>{unit.name} - {unit.city}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {LAB_INFO.name}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
