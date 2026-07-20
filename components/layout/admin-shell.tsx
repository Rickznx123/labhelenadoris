import { AdminSidebar } from "@/components/layout/admin-sidebar";

type AdminShellProps = {
  userName: string;
  role: string;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function AdminShell({ userName, role, title, description, children }: AdminShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <AdminSidebar userName={userName} role={role} />
      <main className="flex-1 p-6 md:p-10">
        <header className="mb-8 rounded-2xl border bg-card/70 p-6 shadow-sm">
          <h1 className="font-display text-4xl">{title}</h1>
          {description ? <p className="mt-2 text-muted-foreground">{description}</p> : null}
        </header>
        {children}
      </main>
    </div>
  );
}
