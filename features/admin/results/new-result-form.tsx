"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCpf, onlyDigits } from "@/lib/utils";
import { createExamResultAction } from "@/features/admin/results/actions";

const MAX_PDF_SIZE_BYTES = 20 * 1024 * 1024;

type NewResultFormProps = {
  onCreated?: (createdResult: {
    id: string;
    patient_name: string;
    patient_cpf: string;
    birth_date: string;
    exam_name: string;
    exam_date: string;
    pdf_path: string;
    created_at: string;
  }) => void;
};

export function NewResultForm({ onCreated }: NewResultFormProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Resultados enviados</CardTitle>
        <Button type="button" onClick={() => setOpen((state) => !state)}>
          {open ? "Fechar" : "Novo resultado"}
        </Button>
      </CardHeader>
      {open ? (
        <CardContent>
          <form
            className="grid gap-4 md:grid-cols-2"
            action={(formData) => {
              if (pending) {
                return;
              }
              formData.set("patient_cpf", onlyDigits(String(formData.get("patient_cpf") || "")));
              startTransition(async () => {
                try {
                  const createdResult = await createExamResultAction(formData);
                  toast.success("Resultado cadastrado com sucesso.");
                  setOpen(false);
                  onCreated?.(createdResult);
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "Erro ao cadastrar resultado.");
                }
              });
            }}
          >
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="patient_name">Nome do paciente</Label>
              <Input id="patient_name" name="patient_name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient_cpf">CPF</Label>
              <Input
                id="patient_cpf"
                name="patient_cpf"
                placeholder="000.000.000-00"
                onChange={(event) => {
                  event.currentTarget.value = formatCpf(event.currentTarget.value);
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birth_date">Data de nascimento</Label>
              <Input id="birth_date" name="birth_date" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exam_name">Nome do exame</Label>
              <Input id="exam_name" name="exam_name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exam_date">Data do exame</Label>
              <Input id="exam_date" name="exam_date" type="date" required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="pdf">Arquivo PDF</Label>
              <Input
                id="pdf"
                name="pdf"
                type="file"
                accept="application/pdf"
                required
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  if (!file) {
                    return;
                  }
                  const extension = file.name.split(".").pop()?.toLowerCase();
                  if (extension !== "pdf") {
                    toast.error("Selecione um arquivo PDF válido.");
                    event.currentTarget.value = "";
                    return;
                  }
                  if (file.size > MAX_PDF_SIZE_BYTES) {
                    toast.error("O PDF deve ter no máximo 20 MB.");
                    event.currentTarget.value = "";
                  }
                }}
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={pending}>
                {pending ? "Enviando..." : "Salvar resultado"}
              </Button>
            </div>
          </form>
        </CardContent>
      ) : null}
    </Card>
  );
}
