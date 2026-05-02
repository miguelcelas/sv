import news from '@/data/news.json';
import sources from '@/data/sources.json';
import themes from '@/data/themes.json';
import { NewsItem } from './types';

export const START_DATE = '2026-01-01';

export function getNews(): NewsItem[] {
  return (news as NewsItem[])
    .filter((item) => item.date >= START_DATE)
    .sort((a, b) => b.date.localeCompare(a.date) || b.relevance - a.relevance);
}

export function getFilters() {
  const items = getNews();
  const states = Array.from(new Set([...items.map((item) => item.state), ...(sources as any[]).map((s) => s.state)])).filter(Boolean).sort();
  return { states, themes: themes as string[] };
}
