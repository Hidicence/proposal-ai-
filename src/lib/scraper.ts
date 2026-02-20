/**
 * 網頁爬取模組 — 使用 Jina AI Reader API 將網頁轉為 LLM-ready Markdown
 *
 * - r.jina.ai：任何 URL → 乾淨 Markdown（支援 JS 渲染）
 * - s.jina.ai：搜尋引擎 → 結構化搜尋結果
 * - 免費額度：無 key 20 RPM，有 key 500 RPM
 *
 * v2：自動爬取多個子頁面（about / service / portfolio / contact 等）
 */

interface JinaReaderResult {
  url: string;
  title: string;
  content: string;
  links?: Array<{ url: string; title: string }>;
}

interface JinaSearchResultItem {
  title: string;
  url: string;
  content: string;
}

// 常見重要子頁面路徑（依重要性排序）
const SUBPAGE_CANDIDATES = [
  'about', 'about-us', 'about_us', 'aboutus', 'our-story', 'company',
  'service', 'services', 'our-services', 'what-we-do',
  'portfolio', 'work', 'works', 'projects', 'case-studies', 'cases',
  'product', 'products',
  'team', 'our-team',
  'contact', 'contact-us',
  'pricing', 'plans',
  'blog', 'news',
];

/**
 * 標準化 base URL（去掉尾端 slash、fragment）
 */
function normalizeBase(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}`;
  } catch {
    return url.replace(/\/$/, '');
  }
}

/**
 * 使用 Jina AI Reader 爬取單一頁面，失敗回傳 null
 */
async function fetchOnePage(
  url: string,
  maxChars: number,
  timeoutMs: number
): Promise<{ title: string; url: string; content: string } | null> {
  try {
    const jinaUrl = `https://r.jina.ai/${url}`;

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'X-No-Cache': 'true',
    };
    const jinaKey = process.env.JINA_API_KEY;
    if (jinaKey) headers['Authorization'] = `Bearer ${jinaKey}`;

    const res = await fetch(jinaUrl, {
      headers,
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as { data: JinaReaderResult };
    const result = data.data;
    if (!result?.content || result.content.length < 100) return null;

    return {
      title: result.title || url,
      url: result.url || url,
      content: result.content.slice(0, maxChars),
    };
  } catch {
    return null;
  }
}

/**
 * 爬取主頁 + 自動探索重要子頁面，回傳彙整後的完整內容
 *
 * 策略：
 * 1. 先爬主頁（取前 8000 字）
 * 2. 並發嘗試所有 SUBPAGE_CANDIDATES（每頁最多 3000 字，timeout 8s）
 * 3. 成功的子頁面依序加入，直到總字數達 30000 字上限
 */
export async function scrapeMultiplePages(url: string): Promise<string> {
  const base = normalizeBase(url);

  // Step 1：先爬主頁
  const mainPage = await fetchOnePage(url.startsWith('http') ? url : 'https://' + url, 8000, 20000);

  const sections: string[] = [];

  if (mainPage) {
    sections.push(`## 首頁\n**標題：** ${mainPage.title}\n**網址：** ${mainPage.url}\n\n${mainPage.content}`);
  }

  // Step 2：並發嘗試所有子頁面
  const subpageUrls = SUBPAGE_CANDIDATES.map((path) => `${base}/${path}`);

  const results = await Promise.allSettled(
    subpageUrls.map((subUrl) => fetchOnePage(subUrl, 3000, 8000))
  );

  let totalChars = sections.join('').length;
  const MAX_TOTAL = 30000;

  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (r.status !== 'fulfilled' || !r.value) continue;

    const page = r.value;

    // 避免重複爬到同一頁（例如 /about 和 /about-us 都指向同一內容）
    const isDuplicate = sections.some((s) => s.includes(page.content.slice(0, 100)));
    if (isDuplicate) continue;

    const pathLabel = SUBPAGE_CANDIDATES[i];
    const section = `## ${pathLabel} 頁面\n**標題：** ${page.title}\n**網址：** ${page.url}\n\n${page.content}`;

    if (totalChars + section.length > MAX_TOTAL) break;

    sections.push(section);
    totalChars += section.length;
  }

  if (sections.length === 0) {
    return `（無法爬取 ${url} 的任何頁面）`;
  }

  const pageCount = sections.length;
  return `# 網站內容（共爬取 ${pageCount} 個頁面）\n\n${sections.join('\n\n---\n\n')}`;
}

/**
 * 舊介面保留：單頁爬取（供向下相容或直接使用）
 */
export async function scrapeWebsite(url: string): Promise<string> {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  const page = await fetchOnePage(url, 10000, 20000);
  if (!page) throw new Error(`無法爬取 ${url}`);

  return `## 網站標題\n${page.title}\n\n## 網站網址\n${page.url}\n\n## 網頁內容\n${page.content}`;
}

/**
 * 使用 Jina AI Search 搜尋公司公開資訊
 */
export async function searchCompanyInfo(companyName: string): Promise<string> {
  try {
    const query = encodeURIComponent(`${companyName} 公司 品牌 介紹 產品 服務`);
    const jinaUrl = `https://s.jina.ai/${query}`;

    const headers: Record<string, string> = { Accept: 'application/json' };
    const jinaKey = process.env.JINA_API_KEY;
    if (jinaKey) headers['Authorization'] = `Bearer ${jinaKey}`;

    const res = await fetch(jinaUrl, {
      headers,
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) return await fallbackSearch(companyName);

    const data = (await res.json()) as { data: JinaSearchResultItem[] };
    const results = data.data;

    if (!results || results.length === 0) return await fallbackSearch(companyName);

    return results
      .slice(0, 5)
      .map((r) => `### ${r.title}\n${r.url}\n${r.content?.slice(0, 500) || ''}`)
      .join('\n\n');
  } catch {
    return await fallbackSearch(companyName);
  }
}

/**
 * Fallback：DuckDuckGo HTML 搜尋
 */
async function fallbackSearch(companyName: string): Promise<string> {
  try {
    const { load } = await import('cheerio');
    const query = encodeURIComponent(`${companyName} 公司 品牌 介紹`);
    const res = await fetch(`https://html.duckduckgo.com/html/?q=${query}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return '';

    const html = await res.text();
    const $ = load(html);
    const results: string[] = [];

    $('.result').each((i, el) => {
      if (i >= 5) return false;
      const title = $(el).find('.result__title').text().trim();
      const snippet = $(el).find('.result__snippet').text().trim();
      if (title && snippet) results.push(`${title}\n${snippet}`);
    });

    return results.join('\n\n');
  } catch {
    return '';
  }
}
