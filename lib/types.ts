export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  outlet: string;
  url: string;
  paywall: boolean;
  state: string;
  date: string;
  themes: string[];
  relevance: number;
  sourceType?: string;
};
