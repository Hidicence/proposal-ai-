import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="bg-[#09090B] min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative glass rounded-3xl p-12 md:p-16 text-center overflow-hidden glow-indigo">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/10 blur-[100px]" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="text-white">準備好做出一份</span>
                <br />
                <span className="text-gradient">讓客戶刮目相看的提案？</span>
              </h2>
              <p className="text-zinc-400 mt-4 text-lg">
                免費開始，無需信用卡，5 分鐘內看到完整的分析結果。
              </p>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center mt-8 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all cursor-pointer"
              >
                立即免費開始
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
