"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Setting } from "@/types/domain";
import { saveSettingsAction } from "@/features/admin/settings/actions";

type SettingsFormProps = {
  settings?: Setting;
};

export function SettingsForm({ settings }: SettingsFormProps) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-4 rounded-2xl border bg-card p-4 md:grid-cols-2"
      action={(formData) => {
        startTransition(async () => {
          try {
            await saveSettingsAction(formData);
            toast.success("Configurações salvas com sucesso.");
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Falha ao salvar configurações.");
          }
        });
      }}
    >
      <input type="hidden" name="id" defaultValue={settings?.id ?? ""} />
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="lab_name">Nome do laboratório</Label>
        <Input id="lab_name" name="lab_name" defaultValue={settings?.lab_name} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input id="phone" name="phone" defaultValue={settings?.phone ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="whatsapp">WhatsApp</Label>
        <Input id="whatsapp" name="whatsapp" defaultValue={settings?.whatsapp ?? ""} />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="address">Endereço</Label>
        <Input id="address" name="address" defaultValue={settings?.address ?? ""} />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="logo_url">Logo URL</Label>
        <Input id="logo_url" name="logo_url" defaultValue={settings?.logo_url ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="instagram">Instagram</Label>
        <Input id="instagram" name="instagram" defaultValue={settings?.instagram ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="facebook">Facebook</Label>
        <Input id="facebook" name="facebook" defaultValue={settings?.facebook ?? ""} />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="linkedin">Linkedin</Label>
        <Input id="linkedin" name="linkedin" defaultValue={settings?.linkedin ?? ""} />
      </div>
      <div className="md:col-span-2">
        <Button type="submit" disabled={pending}>Salvar configurações</Button>
      </div>
    </form>
  );
}
