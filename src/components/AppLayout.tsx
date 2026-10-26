import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { BarChart3, Home, Repeat } from 'lucide-react';

const NAV = [
  { to: '/app', label: 'Home', icon: Home, end: true },
  { to: '/app/progress', label: 'Progress', icon: BarChart3 },
  { to: '/app/revision', label: 'Revision', icon: Repeat },
];

export default function AppLayout() {
  const loc = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-neutraltint-50">
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-neutraltint-200">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <NavLink to="/app" className="flex items-center gap-2 font-serif font-semibold text-brand-700">
            <span className="kannada text-xl text-saffron-500">ನ</span>
            <span>NammaKannada</span>
          </NavLink>
          <nav className="flex items-center gap-1" aria-label="Primary">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                aria-label={n.label}
                className={({ isActive }) =>
                  `tap px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-400 hover:bg-neutraltint-100'
                  }`
                }
              >
                <n.icon className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
                <span className="sr-only">{n.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main key={loc.pathname} className="flex-1 max-w-2xl w-full mx-auto px-4 py-5 animate-fade-in">
        <Outlet />
      </main>

      <footer className="border-t border-neutraltint-200 bg-white">
        <div className="max-w-2xl mx-auto px-4 py-4 text-xs text-ink-300 flex items-center justify-between">
          <span>NammaKannada · hackathon prototype</span>
          <NavLink to="/appendix" className="underline hover:text-brand-600">Sources</NavLink>
        </div>
      </footer>
    </div>
  );
}
