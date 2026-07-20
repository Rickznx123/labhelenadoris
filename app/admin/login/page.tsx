import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <Container className="py-20">
      <Card className="mx-auto w-full max-w-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
        <CardHeader>
          <CardTitle className="text-center font-display text-3xl">Modulo interno em desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">O acesso administrativo sera implementado na proxima fase.</p>
          <Button asChild className="mt-6">
            <Link href="/">Ir para Home</Link>
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
