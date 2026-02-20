'use client';

import { Search, Cpu, PenLine, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  { icon: Search, num: '01', title: '輸入公司資訊', desc: '輸入目標公司名稱或官網網址，其餘交給 AI' },
  { icon: Cpu, num: '02', title: 'AI 自動分析', desc: 'AI 蒐集資料、完成品牌分析，約 3–5 分鐘' },
  { icon: PenLine, num: '03', title: '預覽與微調', desc: '確認分析結果，依需求補充或修改內容' },
  { icon: Download, num: '04', title: '匯出提案簡報', desc: 'PPTX / PDF 一鍵下載，直接帶去見客戶' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center">
          <p className="text-sm text-indigo-400 font-medium tracking-wider uppercase">
            運作方式
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            <span className="text-gradient">四個步驟</span>
            <span className="text-white">，完成一份專業提案</span>
          </h2>
        </div>

        <div className="mt-20 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-px bg-gradient-to-r from-indigo-500/40 via-violet-500/40 to-cyan-500/40" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.15, duration: 0.5, ease: 'easeOut' as const }}
                className="text-center relative"
              >
                {/* Number badge */}
                <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <step.icon className="w-7 h-7 text-white" />
                </div>

                <p className="text-xs text-indigo-400 font-mono mt-5 tracking-wider">{step.num}</p>
                <h3 className="text-lg font-semibold text-white mt-2">{step.title}</h3>
                <p className="text-sm text-zinc-400 mt-1">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
