'use client';

import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface Plan {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    name: '免費體驗',
    price: 'NT$0',
    period: '',
    features: ['每月 1 份報告', '基礎分析功能', '含浮水印', 'Email 支援'],
    cta: '開始體驗',
  },
  {
    name: '基本方案',
    price: 'NT$990',
    period: '/月',
    features: ['每月 10 份報告', '完整分析功能', '無浮水印', '優先支援'],
    cta: '選擇方案',
  },
  {
    name: '專業方案',
    price: 'NT$2,990',
    period: '/月',
    features: ['無限報告', '意象圖生成', '自訂品牌模板', '專屬客服'],
    cta: '立即訂閱',
    popular: true,
  },
  {
    name: '企業方案',
    price: '客製報價',
    period: '',
    features: ['API 串接', '團隊帳號', '白牌客製', '專屬顧問'],
    cta: '聯繫我們',
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center">
          <p className="text-sm text-indigo-400 font-medium tracking-wider uppercase">
            方案定價
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4">
            選擇適合您的方案
          </h2>
          <p className="text-zinc-400 mt-4 text-lg">
            一般行銷顧問開立一份提案收費 NT$8,000 起——用 Proposal AI，每月費用不到一份的零頭
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const }}
              className={`relative rounded-2xl p-8 transition-all ${
                plan.popular
                  ? 'bg-gradient-to-b from-indigo-500/10 to-transparent border-2 border-indigo-500/40 glow-indigo'
                  : 'glass'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-medium">
                  熱門
                </span>
              )}

              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <div className="mt-4">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                {plan.period && <span className="text-sm text-zinc-400">{plan.period}</span>}
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`mt-8 w-full py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  plan.popular
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-black shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40'
                    : 'glass text-white hover:bg-white/10'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
