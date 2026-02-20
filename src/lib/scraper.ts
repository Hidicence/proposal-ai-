/**
 * 網頁爬取模組 — 使用 Jina AI Reader API 將網頁轉為 LLM-ready Markdown
 *
 * 升級自 cheerio 靜態爬取：
 * - r.jina.ai：任何 URL → 乾淨 Markdown（支援 JS 渲染）
 * - s.jina.ai：搜尋引擎 → 結構化搜尋結果
 * - 免費額度：無 key 20 RPM，有 key 500 RPM
 */

interface JinaReaderResult {
  url: string;
  title: string;
  content: string;
}

interface JinaSearchResultItem {
  title: string;
  url: string;
  content: string;
}

/**
 * 使用 Jina AI Reader 將網頁轉為乾淨 Markdown
 * https://jina.ai/reader/
 */
export async function scrapeWebsite(url: string): Promise<string> {
  // 確保 URL 有 protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  const jinaUrl = `https://r.jina.ai/${url}`;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'X-No-Cache': 'true',
  };

  // 如果有設定 Jina API Key，加入 header 提升額度
  const jinaKey = process.env.JINA_API_KEY;
  if (jinaKey) {
    headers['Authorization'] = `Bearer ${jinaKey}`;
  }

  const response = await fetch(jinaUrl, {
    headers,
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    throw new Error(`Jina Reader 無法擷取 ${url}: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as { data: JinaReaderResult };
  const result = data.data;

  // 組裝格式化內容
  let output = '';
  output += `## 網站標題\n${result.title}\n\n`;
  output += `## 網站網址\n${result.url}\n\n`;

  // 限制內容長度避免 token 爆炸（約 10000 字元）
  const content = result.content?.slice(0, 10000) || '（無法提取內容）';
  output += `## 網頁內容\n${content}\n`;

  return output;
}

/**
 * 使用 Jina AI Search 搜尋公司公開資訊
 * https://s.jina.ai/
 */
export async function searchCompanyInfo(companyName: string): Promise<string> {
  try {
    const query = encodeURIComponent(`${companyName} 公司 品牌 介紹 產品 服務`);
    const jinaUrl = `https://s.jina.ai/${query}`;

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    const jinaKey = process.env.JINA_API_KEY;
    if (jinaKey) {
      headers['Authorization'] = `Bearer ${jinaKey}`;
    }

    const response = await fetch(jinaUrl, {
      headers,
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) return await fallbackSearch(companyName);

    const data = (await response.json()) as { data: JinaSearchResultItem[] };
    const results = data.data;

    if (!results || results.length === 0) return await fallbackSearch(companyName);

    // 取前 5 筆結果
    return results
      .slice(0, 5)
      .map((r) => {
        const snippet = r.content?.slice(0, 500) || '';
        return `### ${r.title}\n${r.url}\n${snippet}`;
      })
      .join('\n\n');
  } catch {
    // Jina Search 失敗時 fallback 到 DuckDuckGo
    return await fallbackSearch(companyName);
  }
}

/**
 * Fallback：DuckDuckGo HTML 搜尋（無需 API key）
 */
async function fallbackSearch(companyName: string): Promise<string> {
  try {
    const { load } = await import('cheerio');
    const query = encodeURIComponent(`${companyName} 公司 品牌 介紹`);
    const response = await fetch(`https://html.duckduckgo.com/html/?q=${query}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return '';

    const html = await response.text();
    const $ = load(html);

    const results: string[] = [];
    $('.result').each((i, el) => {
      if (i >= 5) return false;
      const title = $(el).find('.result__title').text().trim();
      const snippet = $(el).find('.result__snippet').text().trim();
      if (title && snippet) {
        results.push(`${title}\n${snippet}`);
      }
    });

    return results.join('\n\n');
  } catch {
    return '';
  }
}
