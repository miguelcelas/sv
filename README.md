# Semiárido Vivo — Dashboard de Curadoria

Dashboard interativo para curadoria de notícias do Semiárido brasileiro, com coleta diária, filtros por data, estado e tema, e saída editorial pronta para newsletter.

## O que vem pronto

- Next.js + Tailwind
- Fontes Adobe via Typekit: `https://use.typekit.net/rjs6bjw.css`
- Banco de notícias em `data/news.json`
- Cadastro modular de fontes em `data/sources.json`
- Coleta diária via GitHub Actions
- Export estático para GitHub Pages
- Gerador de newsletter em Markdown

## Requisitos

- Node.js 20+
- Conta GitHub
- Adobe Fonts ativo para o domínio onde o projeto será publicado

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Coletar notícias

```bash
npm run collect
```

O script coleta fontes com RSS, descarta conteúdos anteriores a `2026-01-01`, filtra por palavras-chave ligadas ao Semiárido e atualiza `data/news.json`.

## Gerar newsletter

```bash
npm run newsletter
```

Saída em:

```bash
public/newsletter.md
```

Formato editorial:

```txt
✏️ título/manchete
👉🏾 resumo de até 180 caracteres.
📰 nome do veículo
🔗 link da matéria + 🔒 caso tenha paywall
```

## Como adicionar uma nova fonte

Edite `data/sources.json`:

```json
{
  "name": "Nome do veículo",
  "state": "PE",
  "region": "Sertão de Pernambuco",
  "url": "https://exemplo.com.br/",
  "rss": "https://exemplo.com.br/feed/",
  "type": "independent_media",
  "enabled": true
}
```

Se a fonte não tiver RSS, deixe `rss: null`. Ela fica cadastrada para coleta manual ou futura implementação de scraping específico.

## Como cadastrar uma notícia manualmente

Edite `data/news.json`:

```json
{
  "id": "identificador-unico",
  "title": "Título da matéria",
  "summary": "Resumo com até 180 caracteres.",
  "outlet": "Nome do veículo",
  "url": "https://...",
  "paywall": false,
  "state": "PE",
  "date": "2026-05-02",
  "themes": ["clima", "agricultura familiar"],
  "relevance": 4
}
```

## Temas disponíveis

Edite `data/themes.json` para incluir ou remover categorias.

## GitHub Pages

1. Suba este projeto para um repositório no GitHub.
2. Vá em `Settings > Pages`.
3. Em `Build and deployment`, selecione `GitHub Actions`.
4. Rode manualmente o workflow `Publicar no GitHub Pages` ou faça push na branch `main`.

## Domínio semiáridovivo.com

Depois de ativar o GitHub Pages:

1. Em `Settings > Pages`, adicione `semiáridovivo.com` como custom domain.
2. No DNS do domínio, crie os registros indicados pelo GitHub Pages.
3. Ative `Enforce HTTPS` quando disponível.

## Adobe Fonts

O link já está no layout:

```html
<link rel="stylesheet" href="https://use.typekit.net/rjs6bjw.css">
```

No painel da Adobe Fonts, inclua os domínios autorizados:

- `localhost`, para teste local se desejar
- domínio do GitHub Pages
- `semiáridovivo.com`

## Observações importantes

- Muitos sites independentes não têm RSS. A versão inicial usa RSS quando disponível e mantém os demais cadastrados.
- Para scraping de sites sem RSS, crie coletores específicos por fonte dentro de `scripts/collect-news.mjs`.
- A curadoria humana continua recomendada antes de publicar a newsletter.
