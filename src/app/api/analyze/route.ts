import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { z } from 'zod';
import { scrapeMultiplePages, searchCompanyInfo } from '@/lib/scraper';
import { BRAND_ANALYSIS_SYSTEM_PROMPT, buildUserMessage } from '@/lib/prompts';

export const maxDuration = 120; // 多頁爬取需要更長時間

// 定義分析結果的 Zod Schema — 確保 LLM 輸出型別安全
const AnalysisSchema = z.object({
  company: z.object({
    name: z.string().describe('公司名稱（中文）'),
    nameEn: z.string().describe('公司英文名稱'),
    industry: z.string().describe('產業 / 細分領域'),
    founded: z.string().describe('成立年份或「未知」'),
    products: z.string().describe('主要產品或服務'),
    location: z.string().describe('據點'),
    positioning: z.string().describe('品牌定位一句話'),
  }),
  swot: z.object({
    strengths: z.array(z.string()).describe('優勢（至少 2 點）'),
    weaknesses: z.array(z.string()).describe('劣勢（至少 2 點）'),
    opportunities: z.array(z.string()).describe('機會（至少 2 點）'),
    threats: z.array(z.string()).describe('威脅（至少 2 點）'),
  }),
  painPoints: z.array(
    z.object({
      issue: z.string().describe('痛點描述'),
      impact: z.string().describe('影響說明'),
    })
  ).describe('行銷痛點診斷（至少 3 點）'),
  strategies: z.array(
    z.object({
      name: z.string().describe('策略名稱'),
      description: z.string().describe('具體作法'),
      benefit: z.string().describe('預期效益'),
    })
  ).describe('推薦行銷策略（至少 4 條）'),
  kpis: z.array(
    z.object({
      name: z.string().describe('指標名稱'),
      current: z.string().describe('目前估計值'),
      target: z.string().describe('目標值'),
      timeframe: z.string().describe('達成時間'),
      progressPct: z.number().min(0).max(100).describe('進度百分比'),
    })
  ).describe('KPI 建議（至少 3 項）'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, companyName } = body as { url?: string; companyName?: string };

    if (!url && !companyName) {
      return NextResponse.json(
        { error: '請提供公司網址或公司名稱' },
        { status: 400 }
      );
    }

    const apiKey = process.env.KIMI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'KIMI_API_KEY 未設定' },
        { status: 500 }
      );
    }

    // Step 1: 使用 Jina AI Reader 爬取官網多個頁面（首頁 + about / service / portfolio 等）
    let websiteContent = '';
    const targetUrl = url || '';

    if (targetUrl) {
      try {
        websiteContent = await scrapeMultiplePages(targetUrl);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        websiteContent = `無法爬取網站 ${targetUrl}: ${message}`;
      }
    }

    // Step 2: 使用 Jina AI Search 搜尋公司公開資訊（fallback: DuckDuckGo）
    const searchQuery = companyName || targetUrl;
    let searchResults = '';
    if (searchQuery) {
      searchResults = await searchCompanyInfo(searchQuery);
    }

    // Step 3: 使用 Vercel AI SDK + Kimi 2.5 進行結構化分析
    const kimi = createOpenAICompatible({
      name: 'kimi',
      baseURL: 'https://api.moonshot.cn/v1',
      apiKey,
    });

    const userMessage = buildUserMessage({
      url: targetUrl,
      websiteContent: websiteContent || '（未提供官網內容）',
      searchResults: searchResults || undefined,
    });

    const { object: analysis } = await generateObject({
      model: kimi.chatModel('kimi-k2-0711'),
      schema: AnalysisSchema,
      system: BRAND_ANALYSIS_SYSTEM_PROMPT,
      prompt: userMessage,
    });

    return NextResponse.json({
      success: true,
      analysis,
      meta: {
        url: targetUrl,
        companyName: searchQuery,
        analyzedAt: new Date().toISOString(),
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json(
      { error: `分析過程發生錯誤: ${message}` },
      { status: 500 }
    );
  }
}
