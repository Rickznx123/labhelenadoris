import { MessageCircle } from "lucide-react";
import { LAB_INFO } from "@/lib/lab-info";

export function FloatingWhatsapp() {
  return (
    <a
      href={`https://wa.me/${LAB_INFO.whatsappMain}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand)] text-white shadow-[0_12px_30px_rgba(43,167,69,0.45)] transition-transform hover:scale-105"
      aria-label="Agendar pelo WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
