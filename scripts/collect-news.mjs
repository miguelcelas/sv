import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import Parser from 'rss-parser';

const START_DATE = '2026-01-01';
const parser = new Parser({ timeout: 15000 });
const sourcesPath = new URL('../data/sources.json', import.meta.url);
const newsPath = new URL('../data/news.json', import.meta.url);

const keywords = [
  'semiárido', 'semiarido', 'sertão', 'sertao', 'seca', 'estiagem', 'chuva', 'inmet',
  'caatinga', 'agricultura familiar', 'cisterna', 'água', 'agua', 'convivência',
  'convivencia', 'povos tradicionais', 'quilombola', 'indígena', 'indigena', 'rural',
  'irrigação', 'irrigacao', 'clima', 'desertificação', 'desertificacao'
];

const themeRules = {
  'clima': ['clima', 'chuva', 'seca', 'estiagem', 'inmet', 'calor'],
  'convivência com o semiárido': ['semiárido', 'semiarido', 'convivência', 'convivencia', 'cisterna'],
  'recursos hídricos': ['água', 'agua', 'açude', 'acude', 'rio', 'barragem', 'irrigação'],
  'agricultura familiar': ['agricultura familiar', 'safra', 'plantio', 'rural', 'campon'],
  'segurança alimentar': ['fome', 'segurança alimentar', 'alimento'],
  'políticas públicas': ['governo', 'programa', 'política pública', 'sudene', 'lei'],
  'povos tradicionais': ['quilombola', 'indígena', 'indigena', 'povos tradicionais'],
  'meio ambiente': ['caatinga', 'desmatamento', 'desertificação', 'desertificacao', 'biodiversidade']
};

function cleanText(text = '') {
  return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function normalizeDate(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
}

function buildId(sourceName, title, link) {
  return crypto.createHash('sha1').update(`${sourceName}|${title}|${link}`).digest('hex').slice(0, 16);
}

function inferThemes(text) {
  const haystack = text.toLowerCase();
  const themes = Object.entries(themeRules)
    .filter(([, words]) => words.some((word) => haystack.includes(word)))
    .map(([theme]) => theme);
  return themes.length ? themes : ['políticas públicas'];
}

function isRelevant(text) {
  const haystack = text.toLowerCase();
  return keywords.some((word) => haystack.includes(word));
}

function score(text) {
  const haystack = text.toLowerCase();
  const hits = keywords.filter((word) => haystack.includes(word)).length;
  return Math.min(5, Math.max(1, hits));
}

async function collectFromRss(source) {
  if (!source.rss) return [];
  try {
    const feed = await parser.parseURL(source.rss);
    return feed.items
      .map((item) => {
        const title = cleanText(item.title);
        const url = item.link || source.url;
        const date = normalizeDate(item.isoDate || item.pubDate);
        const text = cleanText(`${title} ${item.contentSnippet || item.content || ''}`);
        const summary = cleanText(item.contentSnippet || item.content || title).slice(0, 180);
        return {
          id: buildId(source.name, title, url),
          title,
          summary,
          outlet: source.name,
          url,
          paywall: false,
          state: source.state,
          date,
          themes: inferThemes(text),
          relevance: score(text),
          sourceType: source.type
        };
      })
      .filter((item) => item.date >= START_DATE)
      .filter((item) => isRelevant(`${item.title} ${item.summary} ${item.themes.join(' ')}`));
  } catch (error) {
    console.warn(`Falha ao coletar ${source.name}: ${error.message}`);
    return [];
  }
}

async function main() {
  const sources = JSON.parse(await fs.readFile(sourcesPath, 'utf8'));
  const current = JSON.parse(await fs.readFile(newsPath, 'utf8'));
  const collected = [];

  for (const source of sources.filter((s) => s.enabled && s.rss)) {
    const items = await collectFromRss(source);
    collected.push(...items);
  }

  const byId = new Map(current.map((item) => [item.id, item]));
  for (const item of collected) byId.set(item.id, { ...byId.get(item.id), ...item });

  const merged = Array.from(byId.values())
    .filter((item) => item.date >= START_DATE)
    .sort((a, b) => b.date.localeCompare(a.date) || b.relevance - a.relevance);

  await fs.writeFile(newsPath, JSON.stringify(merged, null, 2) + '\n');
  console.log(`Coleta finalizada: ${collected.length} novas/atualizadas; ${merged.length} no banco.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
