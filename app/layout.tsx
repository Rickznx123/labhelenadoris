import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { env } from "@/lib/env";
import { FloatingWhatsapp } from "@/components/floating-whatsapp";
import { LAB_INFO } from "@/lib/lab-info";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: `${LAB_INFO.shortName} | Analises Clinicas`,
    template: `%s | ${LAB_INFO.shortName}`,
  },
  description:
    "Cuidado e precisao para a sua saude. Exames laboratoriais com qualidade, agilidade e seguranca para voce e sua familia.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    type: "website",
    title: `${LAB_INFO.shortName} | Analises Clinicas`,
    description:
      "Atendimento particular e convenio Ampla+. Resultados online com seguranca.",
    url: env.siteUrl,
    siteName: LAB_INFO.shortName,
    images: [
      {
        url: "/helena-doris-logo.svg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${LAB_INFO.shortName} | Analises Clinicas`,
    description:
      "Exames laboratoriais com qualidade, agilidade e seguranca.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${manrope.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
          <FloatingWhatsapp />
        </Providers>
      </body>
    </html>
  );
}

