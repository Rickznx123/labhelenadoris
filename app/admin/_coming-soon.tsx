import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ComingSoonAdminProps = {
  title: string;
};

export function ComingSoonAdmin({ title }: ComingSoonAdminProps) {
  return (
    <Container className="py-20">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle className="text-center font-display text-3xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Esta funcionalidade interna será disponibilizada em uma segunda fase do projeto.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Voltar para o site</Link>
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
