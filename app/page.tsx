import { Dashboard } from '@/components/Dashboard';
import { getFilters, getNews } from '@/lib/news';

export default function Page() {
  const news = getNews();
  const { states, themes } = getFilters();
  return <Dashboard news={news} states={states} themes={themes} />;
}
