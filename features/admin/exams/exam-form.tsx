"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Exam, Patient } from "@/types/domain";
import { upsertExamAction } from "@/features/admin/exams/actions";

type ExamFormProps = {
  exam?: Exam;
  patients: Pick<Patient, "id" | "full_name">[];
};

export function ExamForm({ exam, patients }: ExamFormProps) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-3 rounded-2xl border bg-card p-4 md:grid-cols-3"
      action={(formData) => {
        startTransition(async () => {
          try {
            await upsertExamAction(formData);
            toast.success(exam ? "Exame atualizado." : "Exame cadastrado.");
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Erro ao salvar exame.");
          }
        });
      }}
    >
      <input type="hidden" name="id" defaultValue={exam?.id ?? ""} />
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="exam_type">Tipo de exame</Label>
        <Input id="exam_type" name="exam_type" defaultValue={exam?.exam_type} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          defaultValue={exam?.status ?? "pending"}
          className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
        >
          <option value="pending">Pendente</option>
          <option value="completed">Concluído</option>
        </select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="patient_id">Paciente</Label>
        <select
          id="patient_id"
          name="patient_id"
          defaultValue={exam?.patient_id}
          className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
          required
        >
          <option value="">Selecione...</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>{patient.full_name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="exam_date">Data do exame</Label>
        <Input id="exam_date" name="exam_date" type="date" defaultValue={exam?.exam_date} required />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="pdf">PDF do exame</Label>
        <Input id="pdf" name="pdf" type="file" accept="application/pdf" />
      </div>
      <div className="space-y-2 md:col-span-3">
        <Label htmlFor="notes">Observações</Label>
        <Textarea id="notes" name="notes" defaultValue={exam?.notes ?? ""} />
      </div>
      <div className="md:col-span-3">
        <Button type="submit" disabled={pending}>{exam ? "Salvar alterações" : "Cadastrar exame"}</Button>
      </div>
    </form>
  );
}
