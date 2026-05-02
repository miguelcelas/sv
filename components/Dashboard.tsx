'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { NewsItem } from '@/lib/types';
import { NewsCard } from './NewsCard';

export function Dashboard({ news, states, themes }: { news: NewsItem[]; states: string[]; themes: string[] }) {
  const [query, setQuery] = useState('');
  const [state, setState] = useState('todos');
  const [theme, setTheme] = useState('todos');
  const [from, setFrom] = useState('2026-01-01');
  const [to, setTo] = useState('');

  const filtered = useMemo(() => {
    return news.filter((item) => {
      const matchesQuery = [item.title, item.summary, item.outlet].join(' ').toLowerCase().includes(query.toLowerCase());
      const matchesState = state === 'todos' || item.state === state;
      const matchesTheme = theme === 'todos' || item.themes.includes(theme);
      const matchesFrom = !from || item.date >= from;
      const matchesTo = !to || item.date <= to;
      return matchesQuery && matchesState && matchesTheme && matchesFrom && matchesTo;
    });
  }, [news, query, state, theme, from, to]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-8">
      <section className="rounded-[2rem] bg-carvao p-8 text-areia shadow-xl">
        <p className="text-sm uppercase tracking-[0.25em] text-areia/70">Semiárido Vivo</p>
        <h1 className="mt-4 max-w-4xl font-titulo text-6xl leading-[0.85] md:text-8xl">
          Curadoria viva de notícias do Semiárido brasileiro
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-areia/85">
          Conteúdos publicados desde 01/01/2026, organizados por data, estado e tema para apoiar a newsletter do Semiárido Vivo.
        </p>
      </section>

      <section className="sticky top-0 z-10 mt-6 rounded-2xl border border-carvao/10 bg-[#F7EED8]/90 p-4 shadow-sm backdrop-blur">
        <div className="grid gap-3 md:grid-cols-5">
          <label className="relative md:col-span-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-carvao/50" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar" className="w-full rounded-xl border border-carvao/10 bg-white/80 py-2 pl-9 pr-3" />
          </label>
          <select value={state} onChange={(e) => setState(e.target.value)} className="rounded-xl border border-carvao/10 bg-white/80 px-3 py-2">
            <option value="todos">Todos os estados</option>
            {states.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={theme} onChange={(e) => setTheme(e.target.value)} className="rounded-xl border border-carvao/10 bg-white/80 px-3 py-2">
            <option value="todos">Todos os temas</option>
            {themes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input type="date" value={from} min="2026-01-01" onChange={(e) => setFrom(e.target.value)} className="rounded-xl border border-carvao/10 bg-white/80 px-3 py-2" />
          <input type="date" value={to} min="2026-01-01" onChange={(e) => setTo(e.target.value)} className="rounded-xl border border-carvao/10 bg-white/80 px-3 py-2" />
        </div>
        <p className="mt-3 text-sm text-carvao/70">{filtered.length} entrada(s) encontradas.</p>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {filtered.map((item) => <NewsCard key={item.id} item={item} />)}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-carvao/20 bg-white/50 p-8 text-carvao/70">
            Nenhuma notícia encontrada. Rode <code>npm run collect</code> ou cadastre entradas manualmente em <code>data/news.json</code>.
          </div>
        )}
      </section>
    </main>
  );
}
