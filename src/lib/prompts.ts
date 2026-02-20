/**
 * Proposal AI — Prompt Templates (extracted from Apify Skills methodology)
 *
 * 這些 prompt 等同於 SKILL.md 的角色，
 * 作為 LLM API 的 system prompt 驅動分析流程。
 *
 * 注意：輸出格式由 Vercel AI SDK 的 Zod Schema 自動控制，
 * system prompt 只需專注在「分析方法論」即可。
 */

export const BRAND_ANALYSIS_SYSTEM_PROMPT = `你是一位擁有 15 年經驗的資深行銷策略顧問，專精於品牌分析與數位行銷策略規劃。

你將收到一家公司的公開網路資料（官網內容、社群媒體資訊、搜尋結果等）。
請根據這些資料，產出一份完整的品牌分析報告。

## 分析框架

### 1. 公司概況
- 公司名稱（中英文）
- 所屬產業與細分領域
- 成立時間（如可推斷）
- 主要產品或服務
- 目標市場與據點
- 品牌定位描述（一句話）

### 2. SWOT 分析
從行銷角度進行 SWOT 分析：
- **Strengths（優勢）**：品牌在市場上的獨特賣點、現有資源優勢（至少 2 點）
- **Weaknesses（劣勢）**：目前行銷或營運上的不足之處（至少 2 點）
- **Opportunities（機會）**：市場趨勢、未開發的潛在機會（至少 2 點）
- **Threats（威脅）**：來自競品、市場環境的潛在威脅（至少 2 點）

### 3. 行銷痛點診斷
找出該公司目前在行銷上最迫切需要解決的問題（至少 3 點）。
每個痛點請說明現象描述與可能的影響。

### 4. 推薦行銷策略
提出客製化的行銷策略建議（至少 4 條）。
每條策略包含策略名稱、具體作法描述、預期效益。

### 5. KPI 建議
設定可衡量的行銷 KPI（至少 3 項）。
每項 KPI 包含指標名稱、目前估計值、建議目標值、達成時間框架、進度百分比。

## 重要規則

1. 所有分析必須基於提供的實際資料，不要憑空捏造事實。
2. 如果資料不足以判斷某項，請根據產業常識進行合理推斷，並保持保守。
3. 策略建議必須具體可執行，不要空泛。
4. KPI 的 progressPct 是目前值佔目標值的百分比（0-100 整數）。
5. 所有文字使用繁體中文。`;

/**
 * 將爬取到的資料格式化為 user message
 */
export function buildUserMessage(input: {
  url: string;
  websiteContent: string;
  searchResults?: string;
}): string {
  let message = `請分析以下公司：\n\n`;
  message += `## 官網網址\n${input.url}\n\n`;
  message += `## 官網內容\n${input.websiteContent}\n\n`;

  if (input.searchResults) {
    message += `## 搜尋引擎結果\n${input.searchResults}\n\n`;
  }

  message += `請根據以上資料產出完整的品牌分析報告。`;
  return message;
}

/**
 * 分析結果的 TypeScript 型別
 * （與 route.ts 中的 Zod Schema 對應）
 */
export interface AnalysisResult {
  company: {
    name: string;
    nameEn: string;
    industry: string;
    founded: string;
    products: string;
    location: string;
    positioning: string;
  };
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  painPoints: Array<{
    issue: string;
    impact: string;
  }>;
  strategies: Array<{
    name: string;
    description: string;
    benefit: string;
  }>;
  kpis: Array<{
    name: string;
    current: string;
    target: string;
    timeframe: string;
    progressPct: number;
  }>;
}
