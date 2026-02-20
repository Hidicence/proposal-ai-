const footerLinks = [
  {
    title: '產品',
    links: [
      { label: '功能介紹', href: '#features' },
      { label: '方案定價', href: '#pricing' },
      { label: 'API 文件', href: '#' },
    ],
  },
  {
    title: '公司',
    links: [
      { label: '關於我們', href: '#' },
      { label: '部落格', href: '#' },
      { label: '聯繫我們', href: '#' },
    ],
  },
  {
    title: '法律',
    links: [
      { label: '隱私政策', href: '#' },
      { label: '服務條款', href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span className="font-heading text-lg font-bold text-white">Proposal AI</span>
            </div>
            <p className="text-sm text-zinc-500 mt-3 leading-relaxed">
              AI 驅動的行銷提案<br />自動化平台
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                {col.title}
              </p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.05] mt-12 pt-6">
          <p className="text-xs text-zinc-600">
            &copy; 2026 Proposal AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
