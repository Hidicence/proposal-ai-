'use client';

import { useState, useEffect, useRef } from 'react';
import {
  FilePlus, FileText, LayoutTemplate, Settings, CreditCard,
  Sparkles, Building2, Grid2X2, AlertTriangle, CheckCircle2,
  TrendingUp, ImageIcon, Download, PenLine, Loader2, Search,
  Globe, SearchIcon, Brain, Check,
} from 'lucide-react';
import type { AnalysisResult } from '@/lib/prompts';

/* ---- Sidebar data ---- */

const workNav = [
  { icon: FilePlus, label: '新增提案', active: true },
  { icon: FileText, label: '我的提案', active: false },
  { icon: LayoutTemplate, label: '範本管理', active: false },
];

const settingsNav = [
  { icon: Settings, label: '帳號設定' },
  { icon: CreditCard, label: '方案與帳單' },
];

const chipLabels = ['官網分析', '社群媒體', '競品分析'];
const brandLabels = ['官網重構概念', '產品攝影風格', '社群素材設計'];

/* ---- Sub-components ---- */

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.12] transition-colors ${className}`}>
      {children}
    </div>
  );
}

function CardHead({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="w-4 h-4 text-zinc-500" />
      <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
    </div>
  );
}

/* ---- SWOT color mapping ---- */

/* ---- Step Progress ---- */

const analysisSteps = [
  { icon: Globe, label: '爬取官網多頁內容', desc: '自動探索首頁、關於、服務、作品集等頁面', duration: 15000 },
  { icon: SearchIcon, label: '搜尋公開資訊', desc: '搜尋引擎蒐集品牌相關資料', duration: 6000 },
  { icon: Brain, label: 'AI 深度分析', desc: 'AI 正在進行 SWOT、痛點、策略分析', duration: 30000 },
];

function StepProgress({ loading }: { loading: boolean }) {
  const [activeStep, setActiveStep] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!loading) {
      setActiveStep(0);
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    setActiveStep(0);

    // step 0 → 1
    timerRef.current = setTimeout(() => {
      setActiveStep(1);
      // step 1 → 2
      timerRef.current = setTimeout(() => {
        setActiveStep(2);
      }, analysisSteps[1].duration);
    }, analysisSteps[0].duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [loading]);

  if (!loading) return null;

  return (
    <div className="mt-8">
      <Card className="!p-6">
        <div className="space-y-4">
          {analysisSteps.map((step, i) => {
            const isDone = i < activeStep;
            const isActive = i === activeStep;

            return (
              <div key={step.label} className={`flex items-center gap-4 transition-opacity duration-300 ${i > activeStep ? 'opacity-30' : 'opacity-100'}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-500 ${
                  isDone ? 'bg-emerald-500/15 border border-emerald-500/30' :
                  isActive ? 'bg-indigo-500/15 border border-indigo-500/30' :
                  'bg-white/[0.03] border border-white/[0.06]'
                }`}>
                  {isDone ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : isActive ? (
                    <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                  ) : (
                    <step.icon className="w-4 h-4 text-zinc-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isDone ? 'text-emerald-300' : isActive ? 'text-white' : 'text-zinc-600'}`}>
                    {step.label}
                    {isDone && <span className="text-emerald-500 text-xs ml-2">完成</span>}
                  </p>
                  <p className={`text-xs mt-0.5 ${isActive ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {step.desc}
                  </p>
                </div>
                {isActive && (
                  <div className="w-16 h-1 rounded-full bg-white/[0.05] overflow-hidden">
                    <div className="h-full rounded-full bg-indigo-500 animate-pulse" style={{ width: '60%' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-zinc-600 mt-5 text-center">分析通常需要 30-60 秒，請耐心等候</p>
      </Card>
    </div>
  );
}

const swotConfig = {
  strengths: { key: 'S', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', color: 'text-emerald-300' },
  weaknesses: { key: 'W', bg: 'bg-amber-500/10', border: 'border-amber-500/20', color: 'text-amber-300' },
  opportunities: { key: 'O', bg: 'bg-blue-500/10', border: 'border-blue-500/20', color: 'text-blue-300' },
  threats: { key: 'T', bg: 'bg-red-500/10', border: 'border-red-500/20', color: 'text-red-300' },
};

/* ---- Page ---- */

export default function DashboardPage() {
  const [inputValue, setInputValue] = useState('');
  const [chips, setChips] = useState<Record<string, boolean>>({
    '官網分析': true,
    '社群媒體': false,
    '競品分析': false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!inputValue.trim()) {
      setError('請輸入公司名稱或官網網址');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const isUrl = inputValue.includes('.') && !inputValue.includes(' ');
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isUrl
            ? { url: inputValue.trim() }
            : { companyName: inputValue.trim(), url: '' }
        ),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '分析失敗');
        return;
      }

      setResult(data.analysis);
    } catch {
      setError('網路錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#09090B]">
      {/* ── Sidebar ── */}
      <aside className="w-64 fixed inset-y-0 left-0 bg-black/40 backdrop-blur-xl border-r border-white/[0.06] flex flex-col">
        <div className="px-6 pt-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          <span className="font-heading text-lg font-bold text-white">Proposal AI</span>
        </div>

        <nav className="mt-10 flex-1">
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] px-6 mb-3">工作區</p>
          {workNav.map((n) => (
            <button
              key={n.label}
              className={`flex items-center gap-3 w-[calc(100%-24px)] mx-3 px-3 py-2.5 rounded-xl text-sm transition-colors cursor-pointer ${
                n.active ? 'bg-white/[0.08] text-white font-medium' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              <n.icon className="w-4 h-4" />
              {n.label}
            </button>
          ))}

          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] px-6 mb-3 mt-8">設定</p>
          {settingsNav.map((n) => (
            <button
              key={n.label}
              className="flex items-center gap-3 w-[calc(100%-24px)] mx-3 px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <n.icon className="w-4 h-4" />
              {n.label}
            </button>
          ))}
        </nav>

        <div className="px-4 pb-6 mt-auto">
          <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl p-4">
            <p className="text-sm text-white font-medium">升級專業方案</p>
            <p className="text-xs text-zinc-400 mt-1">解鎖意象圖生成功能</p>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 mt-3 cursor-pointer">
              查看方案 &rarr;
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="ml-64 flex-1 min-h-screen overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-[#09090B]/80 backdrop-blur-lg border-b border-white/[0.04] px-8 py-4 flex items-center justify-between">
          <h1 className="font-heading text-lg font-semibold text-white">新增提案</h1>
          <div className="flex items-center gap-3">
            <button className="text-sm text-zinc-400 hover:text-white border border-white/10 px-4 py-2 rounded-lg transition-colors cursor-pointer">
              匯出
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500" />
          </div>
        </div>

        <div className="p-8">
          {/* Demo banner */}
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-5 py-3 mb-8 flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-sm text-indigo-300">
              輸入任意公司網址或名稱，AI 將自動分析並產出行銷提案
            </span>
          </div>

          {/* Input section */}
          <Card className="!p-8">
            <label className="text-sm font-medium text-zinc-300">目標公司</label>
            <div className="relative mt-3">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && handleAnalyze()}
                placeholder="輸入公司名稱或官網網址，例如：www.example.com"
                disabled={loading}
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl py-4 pl-12 pr-5 text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 outline-none transition text-base disabled:opacity-50"
              />
            </div>

            <div className="mt-4 flex gap-2">
              {chipLabels.map((label) => (
                <button
                  key={label}
                  onClick={() => setChips((p) => ({ ...p, [label]: !p[label] }))}
                  className={`text-xs px-4 py-2 rounded-full border cursor-pointer transition-all ${
                    chips[label]
                      ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                      : 'bg-white/[0.03] border-white/[0.06] text-zinc-500 hover:border-white/[0.12]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  AI 分析中，請稍候...
                </>
              ) : (
                '開始 AI 分析'
              )}
            </button>
          </Card>

          {/* Error */}
          {error && (
            <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Step-by-step loading progress */}
          <StepProgress loading={loading} />

          {/* ── Results ── */}
          {result && !loading && (
            <>
              <div className="border-t border-dashed border-white/[0.06] my-10" />

              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="font-heading text-lg font-semibold text-white">分析結果</h2>
                <span className="h-4 w-px bg-white/10" />
                <span className="text-sm text-zinc-400">
                  {result.company.name} {result.company.nameEn && result.company.nameEn !== result.company.name ? result.company.nameEn : ''}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  分析完成
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {/* 公司概況 */}
                <Card>
                  <CardHead icon={Building2} title="公司概況" />
                  <div className="mt-4 space-y-3">
                    {[
                      { k: '公司名稱', v: `${result.company.name}${result.company.nameEn ? ` (${result.company.nameEn})` : ''}` },
                      { k: '產業', v: result.company.industry },
                      { k: '成立', v: result.company.founded },
                      { k: '產品/服務', v: result.company.products },
                      { k: '據點', v: result.company.location },
                      { k: '品牌定位', v: result.company.positioning },
                    ].map((r) => (
                      <div key={r.k} className="flex items-start justify-between gap-4 text-sm">
                        <span className="text-zinc-500 text-xs shrink-0">{r.k}</span>
                        <span className="text-zinc-200 text-right">{r.v}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* SWOT */}
                <Card>
                  <CardHead icon={Grid2X2} title="SWOT 分析" />
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {(Object.keys(swotConfig) as Array<keyof typeof swotConfig>).map((field) => {
                      const cfg = swotConfig[field];
                      const items = result.swot[field];
                      return (
                        <div key={cfg.key} className={`${cfg.bg} border ${cfg.border} p-3 rounded-xl`}>
                          <span className={`text-xs font-bold ${cfg.color}`}>{cfg.key}</span>
                          {items.map((item, i) => (
                            <p key={i} className="text-xs text-zinc-300 mt-1 leading-snug">{item}</p>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* 行銷痛點 */}
                <Card>
                  <CardHead icon={AlertTriangle} title="行銷痛點" />
                  <div className="mt-4 space-y-3">
                    {result.painPoints.map((p, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                        <div>
                          <p className="text-zinc-200">{p.issue}</p>
                          <p className="text-zinc-500 text-xs mt-0.5">{p.impact}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* 推薦策略 */}
                <Card>
                  <CardHead icon={CheckCircle2} title="推薦策略" />
                  <div className="mt-4 space-y-3">
                    {result.strategies.map((s, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-zinc-200 font-medium">{s.name}</p>
                          <p className="text-zinc-400 text-xs mt-0.5">{s.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* KPI */}
                <Card>
                  <CardHead icon={TrendingUp} title="KPI 目標" />
                  <div className="mt-4 space-y-5">
                    {result.kpis.map((kpi) => (
                      <div key={kpi.name}>
                        <p className="text-sm font-medium text-zinc-200">{kpi.name}</p>
                        <p className="text-xs text-zinc-500 mt-1">
                          {kpi.current} &rarr; {kpi.target}（{kpi.timeframe}）
                        </p>
                        <div className="mt-2 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-500"
                            style={{ width: `${kpi.progressPct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* 品牌意象圖 */}
                <Card className="xl:col-span-3 lg:col-span-2">
                  <CardHead icon={ImageIcon} title="品牌意象圖" />
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {brandLabels.map((label) => (
                      <div key={label}>
                        <div className="aspect-video bg-white/[0.02] border border-dashed border-white/[0.08] rounded-xl flex flex-col items-center justify-center gap-2 hover:border-indigo-500/30 transition-colors cursor-pointer">
                          <ImageIcon className="w-6 h-6 text-zinc-600" />
                          <span className="text-xs text-zinc-600">點擊生成</span>
                        </div>
                        <p className="text-xs text-zinc-500 text-center mt-2">{label}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Actions */}
              <div className="mt-8 flex gap-3">
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-400 text-white font-medium text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer">
                  <Download className="w-4 h-4" />
                  下載完整提案簡報
                </button>
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-zinc-300 text-sm hover:bg-white/5 transition-all cursor-pointer">
                  <PenLine className="w-4 h-4" />
                  編輯提案內容
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
