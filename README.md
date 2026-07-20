# Helena Doris - Sistema de Laboratorio

Projeto completo em Next.js 16 com:
- Site institucional
- Pagina institucional de resultados

## Stack
- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- UI estilo shadcn
- Lucide React

## Como executar
1. Instale dependencias:

```bash
npm install
```

2. Copie variaveis de ambiente:

```bash
cp .env.example .env.local
```

3. Preencha no `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Rode em desenvolvimento:

```bash
npm run dev
```

5. Validacao de qualidade:

```bash
npm run lint
npm run build
```

## Funcionalidades
- Site institucional com SEO, OpenGraph, sitemap e robots
- Home premium com imagens modernas
- Pagina de resultados institucional com CTA para WhatsApp
- Paginas de Sobre, Exames, Convenios, Unidades e Contato
- Camada de integracao preparada em `services/integrations`

## Observacao sobre Next.js 16
- Rotas internas estao reservadas para segunda fase.
- Em versoes futuras, pode ser migrado para `proxy.ts` conforme recomendacao do framework.
