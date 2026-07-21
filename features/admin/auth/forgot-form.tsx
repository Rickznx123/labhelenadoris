"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { recoverPasswordSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type RecoverData = { email: string };

export function ForgotForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm<RecoverData>({
    resolver: zodResolver(recoverPasswordSchema),
  });

  async function onSubmit(values: RecoverData) {
    const supabase = createClient();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    setLoading(false);

    if (error) {
      toast.error("Não foi possível enviar o e-mail.");
      return;
    }
    toast.success("E-mail de recuperação enviado.");
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...form.register("email")} />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        Enviar
      </Button>
    </form>
  );
}
