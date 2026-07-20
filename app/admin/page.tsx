import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminRootPage() {
  return (
    <Container className="py-20">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center font-display text-3xl">Area interna em desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">Esta area sera disponibilizada em uma segunda fase do projeto.</p>
          <Button asChild className="mt-6">
            <Link href="/">Voltar para o site</Link>
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
