import { ExternalLink, Lock } from 'lucide-react';
import { NewsItem } from '@/lib/types';

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="rounded-2xl border border-carvao/10 bg-white/75 p-5 shadow-sm backdrop-blur">
      <div className="mb-3 flex flex-wrap gap-2 text-xs uppercase tracking-wide">
        <span className="rounded-full bg-terracota px-3 py-1 font-bold text-white">{item.state}</span>
        {item.themes.slice(0, 2).map((theme) => (
          <span key={theme} className="rounded-full bg-areia px-3 py-1 text-carvao">{theme}</span>
        ))}
      </div>
      <h3 className="font-titulo text-3xl leading-none text-carvao">{item.title}</h3>
      <p className="mt-3 text-base leading-snug text-carvao/80">{item.summary}</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-carvao/70">
        <span>📰 {item.outlet} · {new Date(item.date + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
        <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-barro hover:underline">
          Link {item.paywall && <Lock size={14} aria-label="paywall" />} <ExternalLink size={14} />
        </a>
      </div>
    </article>
  );
}
