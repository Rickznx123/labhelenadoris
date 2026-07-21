import Link from "next/link";
import { LayoutDashboard, FileCheck2, Users, UserRound, Settings2, LogOut } from "lucide-react";
import { logoutAction } from "@/features/admin/auth/actions";
import { BrandLogo } from "@/components/brand-logo";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pacientes", label: "Pacientes", icon: Users },
  { href: "/admin/exames", label: "Exames", icon: FileCheck2 },
  { href: "/admin/usuarios", label: "Usuários", icon: UserRound },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings2 },
];

type AdminSidebarProps = {
  userName: string;
  role: string;
};

export function AdminSidebar({ userName, role }: AdminSidebarProps) {
  return (
    <aside className="w-full border-r bg-card/90 backdrop-blur md:w-72">
      <div className="border-b p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Painel</p>
        <div className="mt-2">
          <BrandLogo size="sm" href="/admin/dashboard" />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{userName}</p>
        <p className="text-xs text-muted-foreground">Perfil: {role}</p>
      </div>
      <nav className="space-y-1 p-3">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3">
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
