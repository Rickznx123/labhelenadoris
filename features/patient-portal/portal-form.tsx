"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, FileText, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { portalLookupSchema } from "@/lib/validations/patient";
import { formatCpf, onlyDigits, statusLabel } from "@/lib/utils";

type LookupFormData = {
  cpf: string;
  birth_date: string;
};

type PortalExam = {
  id: string;
  exam_type: string;
  exam_date: string;
  status: "pending" | "completed";
  pdf_path: string | null;
};

type LookupResponse = {
  patientName: string | null;
  exams: PortalExam[];
};

export function PortalForm() {
  const [result, setResult] = useState<LookupResponse | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LookupFormData>({
    resolver: zodResolver(portalLookupSchema),
    defaultValues: {
      cpf: "",
      birth_date: "",
    },
  });
  const cpfRegister = form.register("cpf");

  async function onSubmit(values: LookupFormData) {
    startTransition(async () => {
      const response = await fetch("/api/portal/lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cpf: onlyDigits(values.cpf),
          birth_date: values.birth_date,
        }),
      });

      if (!response.ok) {
        toast.error("Nao foi possivel consultar seus exames.");
        return;
      }

      const data = (await response.json()) as LookupResponse;
      setResult(data);
    });
  }

  async function handleDownload(examId: string) {
    const cpf = onlyDigits(form.getValues("cpf"));
    const birthDate = form.getValues("birth_date");

    const response = await fetch(`/api/download/${examId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cpf, birth_date: birthDate }),
    });

    if (!response.ok) {
      toast.error("Download indisponivel no momento.");
      return;
    }

    const data = (await response.json()) as { url: string };
    window.open(data.url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="grid gap-6">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-display">Consulte seus resultados</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="mx-auto grid max-w-3xl gap-4 md:grid-cols-3" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                {...cpfRegister}
                onChange={(event) => {
                  cpfRegister.onChange(event);
                  form.setValue("cpf", formatCpf(event.target.value), { shouldValidate: true });
                }}
              />
              <p className="text-xs text-destructive">{form.formState.errors.cpf?.message}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="birth_date">Data de nascimento</Label>
              <Input id="birth_date" type="date" {...form.register("birth_date")} />
              <p className="text-xs text-destructive">{form.formState.errors.birth_date?.message}</p>
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full" disabled={isPending}>
                <Search className="mr-2 h-4 w-4" />
                Consultar exames
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isPending ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Buscando resultados...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ) : null}

      {result && !isPending ? (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>
              {result.patientName ? `Resultados de ${result.patientName}` : "Nenhum exame encontrado"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.exams.length === 0 ? (
              <p className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
                Nao encontramos exames para os dados informados. Verifique e tente novamente.
              </p>
            ) : (
              <div className="space-y-3">
                {result.exams.map((exam) => (
                  <div
                    key={exam.id}
                    className="flex flex-col gap-3 rounded-xl border bg-card p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{exam.exam_type}</p>
                      <p className="text-sm text-muted-foreground">
                        Data: {new Date(exam.exam_date).toLocaleDateString("pt-BR")} | Situacao: {statusLabel(exam.status)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={!exam.pdf_path}
                      onClick={() => handleDownload(exam.id)}
                    >
                      {exam.pdf_path ? <Download className="mr-2 h-4 w-4" /> : <FileText className="mr-2 h-4 w-4" />}
                      {exam.pdf_path ? "Baixar PDF" : "PDF indisponivel"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
