"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Profile } from "@/types/domain";
import { upsertUserAction } from "@/features/admin/users/actions";

type UserFormProps = {
  user?: Profile;
};

export function UserForm({ user }: UserFormProps) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-3 rounded-2xl border bg-card p-4 md:grid-cols-2"
      action={(formData) => {
        startTransition(async () => {
          try {
            await upsertUserAction(formData);
            toast.success(user ? "Usuário atualizado." : "Usuário criado.");
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Erro ao salvar usuário.");
          }
        });
      }}
    >
      <input type="hidden" name="id" defaultValue={user?.id ?? ""} />
      <div className="space-y-2">
        <Label htmlFor="full_name">Nome</Label>
        <Input id="full_name" name="full_name" defaultValue={user?.full_name} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input id="phone" name="phone" defaultValue={user?.phone ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Permissao</Label>
        <select
          id="role"
          name="role"
          defaultValue={user?.role ?? "staff"}
          className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
        >
          <option value="admin">Administrador</option>
          <option value="staff">Funcionario</option>
        </select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="password">Senha {user ? "(opcional para alterar)" : ""}</Label>
        <Input id="password" name="password" type="password" />
      </div>
      <div className="md:col-span-2">
        <Button type="submit" disabled={pending}>{user ? "Salvar alterações" : "Criar usuário"}</Button>
      </div>
    </form>
  );
}
