'use client';

import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: 'easeOut' as const },
  }),
};

const analysisItems = [
  { label: '品牌定位分析', done: true },
  { label: '目標客群描繪', done: true },
  { label: '競品差異化策略', done: true },
  { label: '意象圖生成中...', done: false },
];

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden">
      {/* Mesh gradient background */}
      <div className="mesh-gradient">
        <div className="mesh-blob-3" />
      </div>
      <div className="grid-overlay" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-5 gap-16 items-center">
          {/* Left — text (3 cols) */}
          <div className="lg:col-span-3">
            <motion.p
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-sm tracking-widest uppercase text-indigo-400 font-medium"
            >
              為中小企業主打造的 AI 提案工具
            </motion.p>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-6 text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1]"
            >
              <span className="text-white">交出讓客戶點頭的</span>
              <br />
              <span className="text-gradient">專業行銷提案</span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-6 text-lg md:text-xl text-zinc-400 max-w-lg leading-relaxed"
            >
              輸入任何公司名稱或官網網址，AI 自動完成品牌分析、SWOT 診斷、行銷策略與 KPI 規劃——5 分鐘產出，不需要行銷部門。
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all cursor-pointer"
              >
                開始免費試用
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl glass text-white font-medium hover:bg-white/10 transition-all cursor-pointer"
              >
                觀看 Demo
              </a>
            </motion.div>

            <motion.p
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-6 text-sm text-zinc-500"
            >
              不需信用卡 · 每月免費 1 份報告 · 5 分鐘上手
            </motion.p>
          </div>

          {/* Right — floating mockup card (2 cols) */}
          <motion.div
            className="lg:col-span-2 hidden lg:block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' as const }}
          >
            <div className="animate-float">
              <div className="glass rounded-2xl p-6 glow-indigo">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-3 h-3 rounded-full bg-red-400/60" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400/60" />
                  <span className="w-3 h-3 rounded-full bg-green-400/60" />
                  <span className="ml-3 text-xs text-zinc-500 bg-white/5 px-3 py-1 rounded-md flex-1">
                    proposalai.com/analysis
                  </span>
                </div>

                <p className="text-sm font-semibold text-white mb-1">好日子咖啡 — 行銷提案</p>
                <p className="text-xs text-zinc-500 mb-4">分析進度</p>

                <div className="space-y-3">
                  {analysisItems.map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      {item.done ? (
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <Check className="w-3 h-3 text-emerald-400" />
                        </span>
                      ) : (
                        <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                      )}
                      <span className={`text-sm ${item.done ? 'text-zinc-300' : 'text-indigo-300'}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="mt-5 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500" />
                </div>
                <p className="text-xs text-zinc-500 mt-2 text-right">75% 完成</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
