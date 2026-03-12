import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | TSC',
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-[3px] uppercase text-[#E1FF00]">TSC</span>
            <span className="text-white/20">/</span>
            <span className="text-sm text-[#d1d1c6]">Dashboard</span>
          </div>
          <a
            href="/api/dashboard/logout"
            className="text-xs text-[#6D6D69] hover:text-white transition-colors"
          >
            Sign out
          </a>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
