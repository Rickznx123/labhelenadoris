"use client";

import { Fragment, useMemo, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteExamResultAction, updateExamResultAction } from "@/features/admin/results/actions";
import { NewResultForm } from "@/features/admin/results/new-result-form";
import { formatCpf, onlyDigits } from "@/lib/utils";

type ResultRecord = {
  id: string;
  patient_name: string;
  patient_cpf: string;
  birth_date: string;
  exam_name: string;
  exam_date: string;
  pdf_path: string;
  created_at: string;
};

type ResultsManagerProps = {
  initialResults: ResultRecord[];
};

const MAX_PDF_SIZE_BYTES = 20 * 1024 * 1024;

export function ResultsManager({ initialResults }: ResultsManagerProps) {
  const router = useRouter();
  const [results, setResults] = useState(initialResults);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isMutating, startTransition] = useTransition();

  const filteredResults = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return results;
    }

    const termDigits = onlyDigits(term);
    return results.filter((result) => {
      const byName = result.patient_name.toLowerCase().includes(term);
      const byCpf = onlyDigits(result.patient_cpf).includes(termDigits || term);
      return byName || byCpf;
    });
  }, [results, search]);

  function handleCreated(createdResult: ResultRecord) {
    setResults((prev) => [createdResult, ...prev.filter((item) => item.id !== createdResult.id)]);
    router.refresh();
  }

  function handleDelete(result: ResultRecord) {
    if (isMutating) {
      return;
    }

    const confirmed = window.confirm(`Deseja realmente excluir o resultado de ${result.patient_name}?`);
    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteExamResultAction(result.id);
        setResults((prev) => prev.filter((item) => item.id !== result.id));
        setEditingId((current) => (current === result.id ? null : current));
        toast.success("Resultado excluído com sucesso.");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Não foi possível excluir o resultado.");
      }
    });
  }

  function handleEditSubmit(event: FormEvent<HTMLFormElement>, resultId: string) {
    event.preventDefault();
    if (isMutating) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const cpf = onlyDigits(String(formData.get("patient_cpf") || ""));
    formData.set("patient_cpf", cpf);

    const pdf = formData.get("pdf");
    if (pdf instanceof File && pdf.size > 0) {
      const extension = pdf.name.split(".").pop()?.toLowerCase();
      if (extension !== "pdf") {
        toast.error("Selecione um arquivo PDF válido.");
        return;
      }
      if (pdf.size > MAX_PDF_SIZE_BYTES) {
        toast.error("O PDF deve ter no máximo 20 MB.");
        return;
      }
    }

    startTransition(async () => {
      try {
        const updated = await updateExamResultAction(formData);
        setResults((prev) => prev.map((item) => (item.id === resultId ? updated : item)));
        setEditingId(null);
        toast.success("Resultado atualizado com sucesso.");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Não foi possível atualizar o resultado.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <NewResultForm onCreated={handleCreated} />

      <Card>
        <CardHeader className="space-y-3">
          <CardTitle>Lista de resultados</CardTitle>
          <div className="max-w-sm">
            <Label htmlFor="search-results">Buscar por paciente ou CPF</Label>
            <Input
              id="search-results"
              placeholder="Digite nome ou CPF"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredResults.length === 0 ? (
            <p className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
              {results.length === 0 && !search.trim()
                ? "Nenhum resultado enviado ainda."
                : "Nenhum resultado encontrado para a busca informada."}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Exame</TableHead>
                  <TableHead>Data do exame</TableHead>
                  <TableHead>Enviado em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result) => {
                  const isEditing = editingId === result.id;

                  return (
                    <Fragment key={result.id}>
                      <TableRow>
                        <TableCell>{result.patient_name}</TableCell>
                        <TableCell>{formatCpf(result.patient_cpf)}</TableCell>
                        <TableCell>{result.exam_name}</TableCell>
                        <TableCell>{new Date(result.exam_date).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>{new Date(result.created_at).toLocaleString("pt-BR")}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingId((current) => (current === result.id ? null : result.id))}
                              disabled={isMutating}
                            >
                              {isEditing ? "Cancelar" : "Editar"}
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(result)}
                              disabled={isMutating}
                            >
                              Excluir
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {isEditing ? (
                        <TableRow>
                          <TableCell colSpan={6}>
                            <form
                              className="grid gap-4 rounded-xl border bg-muted/30 p-4 md:grid-cols-2"
                              onSubmit={(event) => handleEditSubmit(event, result.id)}
                            >
                              <input type="hidden" name="id" value={result.id} />
                              <div className="space-y-2 md:col-span-2">
                                <Label htmlFor={`patient_name-${result.id}`}>Nome do paciente</Label>
                                <Input id={`patient_name-${result.id}`} name="patient_name" defaultValue={result.patient_name} required />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`patient_cpf-${result.id}`}>CPF</Label>
                                <Input
                                  id={`patient_cpf-${result.id}`}
                                  name="patient_cpf"
                                  defaultValue={formatCpf(result.patient_cpf)}
                                  onChange={(event) => {
                                    event.currentTarget.value = formatCpf(event.currentTarget.value);
                                  }}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`birth_date-${result.id}`}>Data de nascimento</Label>
                                <Input id={`birth_date-${result.id}`} name="birth_date" type="date" defaultValue={result.birth_date} required />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`exam_name-${result.id}`}>Nome do exame</Label>
                                <Input id={`exam_name-${result.id}`} name="exam_name" defaultValue={result.exam_name} required />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`exam_date-${result.id}`}>Data do exame</Label>
                                <Input id={`exam_date-${result.id}`} name="exam_date" type="date" defaultValue={result.exam_date} required />
                              </div>
                              <div className="space-y-2 md:col-span-2">
                                <Label htmlFor={`pdf-${result.id}`}>Novo PDF (opcional)</Label>
                                <Input id={`pdf-${result.id}`} name="pdf" type="file" accept="application/pdf" />
                              </div>
                              <div className="md:col-span-2 flex gap-2">
                                <Button type="submit" disabled={isMutating}>
                                  {isMutating ? "Salvando..." : "Salvar alterações"}
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={isMutating}
                                  onClick={() => setEditingId(null)}
                                >
                                  Cancelar
                                </Button>
                              </div>
                            </form>
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
