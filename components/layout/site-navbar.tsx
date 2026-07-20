import Link from "next/link";
import { Container } from "@/components/layout/container";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import { LAB_INFO } from "@/lib/lab-info";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/sobre", label: "Sobre" },
  { href: "/exames", label: "Exames" },
  { href: "/convenios", label: "Convenios" },
  { href: "/unidades", label: "Unidades" },
  { href: "/contato", label: "Contato" },
  { href: "/resultados", label: "Resultados" },
];

export function SiteNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-background/85 backdrop-blur-xl">
      <Container className="flex h-20 items-center justify-between gap-4">
        <BrandLogo size="sm" />
        <nav className="hidden items-center gap-5 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-[var(--brand-strong)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden md:inline-flex">
            <a href={`https://wa.me/${LAB_INFO.whatsappMain}`} target="_blank" rel="noreferrer">
              Agendar pelo WhatsApp
            </a>
          </Button>
        </div>
      </Container>
    </header>
  );
}
