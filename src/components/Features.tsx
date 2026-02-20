'use client';

import { Globe, BarChart3, Lightbulb, ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Globe,
    title: '自動情報蒐集',
    desc: '過去要花半天手動搜尋的公司資料，現在全程自動。AI 爬取官網內容、搜尋公開品牌資訊，幾分鐘內建立完整企業情報，讓你在見客戶前就充分了解對方。',
    large: true,
    tags: ['官網', '搜尋引擎', '品牌資訊', '產業新聞'],
  },
  {
    icon: BarChart3,
    title: '品牌深度分析',
    desc: 'SWOT 分析、行銷痛點診斷、競品差異化——以前要委託顧問才做得到的分析，現在 AI 自動幫你完成，結果清楚、有條理、可直接引用。',
    large: false,
  },
  {
    icon: Lightbulb,
    title: '可執行的策略建議',
    desc: '不只給你分析結論，還附上具體的行銷策略方向、KPI 目標設定，讓你拿到報告就能開始行動，不用再額外花時間翻譯成計畫。',
    large: false,
  },
  {
    icon: ImageIcon,
    title: '品牌意象圖生成（即將推出）',
    desc: '分析完成後，AI 將根據品牌調性自動生成視覺概念圖，包含官網改版方向、產品攝影風格與社群素材範例。讓客戶在看提案的同時，就能感受到合作後的樣貌。',
    large: true,
    visuals: ['官網改版方向', '產品攝影風格', '社群素材範例'],
  },
];

export default function Features() {
  return (
    <section id="features" className="relative pt-16 pb-32">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm text-indigo-400 font-medium tracking-wider uppercase">
            核心功能
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4">
            從資料蒐集到提案完成，<span className="text-gradient">一步到位</span>
          </h2>
          <p className="text-zinc-400 mt-4 text-lg">
            以前要花好幾天的準備工作，現在 5 分鐘內全部搞定
          </p>
        </div>

        {/* Bento grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeOut' as const }}
              className={`glass rounded-2xl p-8 hover:border-white/[0.15] transition-all group cursor-pointer ${
                f.large ? 'md:col-span-2' : ''
              }`}
            >
              <div className={`${f.large ? 'flex flex-col md:flex-row md:items-start md:gap-10' : ''}`}>
                <div className={f.large ? 'flex-1' : ''}>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center">
                    <f.icon className="w-6 h-6 text-indigo-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mt-5">{f.title}</h3>
                  <p className="text-zinc-400 mt-3 leading-relaxed">{f.desc}</p>
                </div>

                {/* Large card extras */}
                {f.tags && (
                  <div className="flex flex-wrap gap-2 mt-6 md:mt-0 md:pt-2">
                    {f.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {f.visuals && (
                  <div className="grid grid-cols-3 gap-3 mt-6 md:mt-0 md:w-72">
                    {f.visuals.map((v) => (
                      <div
                        key={v}
                        className="aspect-square rounded-xl bg-white/[0.03] border border-dashed border-white/[0.08] flex items-center justify-center"
                      >
                        <span className="text-[10px] text-zinc-500">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
