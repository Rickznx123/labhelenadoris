"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ResetData = { password: string; confirmPassword: string };

export function ResetForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<ResetData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(values: ResetData) {
    const supabase = createClient();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: values.password });
    setLoading(false);
    if (error) {
      toast.error("Falha ao redefinir senha.");
      return;
    }
    toast.success("Senha redefinida com sucesso.");
    router.push("/admin/login");
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="password">Nova senha</Label>
        <Input id="password" type="password" {...form.register("password")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar senha</Label>
        <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        Atualizar senha
      </Button>
    </form>
  );
}
