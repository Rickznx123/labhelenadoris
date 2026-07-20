"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCpf, formatPhone, onlyDigits } from "@/lib/utils";
import { upsertPatientAction } from "@/features/admin/patients/actions";
import { Patient } from "@/types/domain";

type PatientFormProps = {
  patient?: Patient;
};

export function PatientForm({ patient }: PatientFormProps) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-3 rounded-2xl border bg-card p-4 md:grid-cols-3"
      action={(formData) => {
        formData.set("cpf", onlyDigits(String(formData.get("cpf") ?? "")));
        startTransition(async () => {
          try {
            await upsertPatientAction(formData);
            toast.success(patient ? "Paciente atualizado." : "Paciente cadastrado.");
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Falha ao salvar.");
          }
        });
      }}
    >
      <input type="hidden" name="id" defaultValue={patient?.id ?? ""} />
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="full_name">Nome</Label>
        <Input id="full_name" name="full_name" defaultValue={patient?.full_name} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cpf">CPF</Label>
        <Input
          id="cpf"
          name="cpf"
          defaultValue={patient?.cpf ? formatCpf(patient.cpf) : ""}
          onChange={(event) => {
            event.currentTarget.value = formatCpf(event.currentTarget.value);
          }}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="birth_date">Nascimento</Label>
        <Input id="birth_date" name="birth_date" type="date" defaultValue={patient?.birth_date} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          name="phone"
          defaultValue={patient?.phone ?? ""}
          onChange={(event) => {
            event.currentTarget.value = formatPhone(event.currentTarget.value);
          }}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={patient?.email ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sex">Sexo</Label>
        <select
          id="sex"
          name="sex"
          defaultValue={patient?.sex ?? "M"}
          className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
        >
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
          <option value="O">Outro</option>
        </select>
      </div>
      <div className="space-y-2 md:col-span-3">
        <Label htmlFor="notes">Observacoes</Label>
        <Textarea id="notes" name="notes" defaultValue={patient?.notes ?? ""} />
      </div>
      <div className="md:col-span-3">
        <Button type="submit" disabled={pending}>{patient ? "Salvar alteracoes" : "Cadastrar paciente"}</Button>
      </div>
    </form>
  );
}
