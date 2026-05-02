import fs from 'node:fs/promises';

const newsPath = new URL('../data/news.json', import.meta.url);
const outputPath = new URL('../public/newsletter.md', import.meta.url);

function line(item) {
  const lock = item.paywall ? ' 🔒' : '';
  return `✏️ ${item.title}\n👉🏾 ${item.summary.slice(0, 180)}\n📰 ${item.outlet}\n🔗 ${item.url}${lock}`;
}

const news = JSON.parse(await fs.readFile(newsPath, 'utf8'));
const grouped = news.reduce((acc, item) => {
  const theme = item.themes?.[0] || 'geral';
  acc[theme] ||= [];
  acc[theme].push(item);
  return acc;
}, {});

let md = `# Newsletter Semiárido Vivo\n\nGerada a partir do banco de notícias do dashboard.\n\n`;
for (const [theme, items] of Object.entries(grouped)) {
  md += `## ${theme}\n\n`;
  md += items.slice(0, 10).map(line).join('\n\n') + '\n\n';
}

await fs.writeFile(outputPath, md);
console.log(`Newsletter gerada em public/newsletter.md`);
