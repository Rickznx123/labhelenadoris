"use client";

import { useState, useTransition } from "react";
import { Download, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { examResultLookupSchema } from "@/lib/validations/exam-result";
import { formatCpf, onlyDigits } from "@/lib/utils";

type LookupFormData = {
  cpf: string;
  birth_date: string;
};

type ResultItem = {
  id: string;
  exam_name: string;
  exam_date: string;
  patient_name: string;
};

export function ResultLookupForm() {
  const [results, setResults] = useState<ResultItem[] | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<LookupFormData>({
    resolver: zodResolver(examResultLookupSchema),
    defaultValues: {
      cpf: "",
      birth_date: "",
    },
  });

  const cpfField = form.register("cpf");

  function onSubmit(values: LookupFormData) {
    startTransition(async () => {
      const response = await fetch("/api/results/lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cpf: onlyDigits(values.cpf),
          birthDate: values.birth_date,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const message =
          typeof errorBody?.error === "string"
            ? errorBody.error
            : errorBody?.error?.message || "Não foi possível consultar os resultados.";
        toast.error(message);
        return;
      }

      const data = (await response.json()) as { results: ResultItem[] };
      setResults(data.results);
    });
  }

  async function handleDownload(id: string) {
    const response = await fetch(`/api/results/download/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cpf: onlyDigits(form.getValues("cpf")),
        birthDate: form.getValues("birth_date"),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const message =
        typeof errorBody?.error === "string"
          ? errorBody.error
          : errorBody?.error?.message || "Não foi possível baixar este resultado.";
      toast.error(message);
      return;
    }

    const data = (await response.json()) as { url: string };
    window.open(data.url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Consulta de resultados</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-3" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                {...cpfField}
                onChange={(event) => {
                  cpfField.onChange(event);
                  form.setValue("cpf", formatCpf(event.target.value), {
                    shouldValidate: true,
                  });
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
                Consultar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isPending ? (
        <Card>
          <CardContent className="space-y-3 pt-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      ) : null}

      {results && !isPending ? (
        <Card>
          <CardHeader>
            <CardTitle>{results.length ? `Exames encontrados: ${results.length}` : "Nenhum exame encontrado"}</CardTitle>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <p className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground">
                Não localizamos resultados para os dados informados.
              </p>
            ) : (
              <div className="space-y-3">
                {results.map((item) => (
                  <div key={item.id} className="flex flex-col gap-3 rounded-2xl border bg-card p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-medium text-gray-700">{item.exam_name}</p>
                      <p className="text-sm text-muted-foreground">Data: {new Date(item.exam_date).toLocaleDateString("pt-BR")}</p>
                    </div>
                    <Button type="button" variant="outline" onClick={() => handleDownload(item.id)}>
                      <Download className="mr-2 h-4 w-4" />
                      Baixar Resultado
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
