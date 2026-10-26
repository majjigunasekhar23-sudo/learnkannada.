import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Github, Globe, QrCode, Mail, Sparkles } from 'lucide-react';
import config from '@/data/siteConfig.json';
import { FEATURES, COMPARISON, PROPOSED_METRICS, LEARNING_LOOP, TARGET_USERS } from '@/data/content';
import StatusBadge from '@/components/StatusBadge';

function SectionTitle({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="max-w-2xl mb-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-saffron-500 mb-1.5">{kicker}</p>
      <h2 className="text-2xl sm:text-3xl text-ink-500">{title}</h2>
      {sub && <p className="text-ink-400 mt-2">{sub}</p>}
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-neutraltint-50 text-ink-500">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-neutraltint-50/85 backdrop-blur border-b border-neutraltint-200">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-serif font-semibold text-brand-700">
            <span className="kannada text-xl text-saffron-500">ನ</span>
            <span>NammaKannada</span>
            <span className="text-ink-300 font-sans font-normal text-sm hidden sm:inline">— Kannada for Everyone</span>
          </div>
          <nav className="hidden sm:flex items-center gap-4 text-sm text-ink-400">
            <a href="#how" className="hover:text-brand-600">How it works</a>
            <a href="#features" className="hover:text-brand-600">Features</a>
            <a href="#team" className="hover:text-brand-600">Team</a>
            <Link to="/appendix" className="hover:text-brand-600">Sources</Link>
          </nav>
          <Link to="/app" className="btn-primary !py-2 !px-4 text-sm">
            Try the demo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50 via-neutraltint-50 to-neutraltint-50" aria-hidden="true" />
        <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-saffron-100/60 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-4 pt-14 pb-16 sm:pt-20 sm:pb-24">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-saffron-500" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-widest text-saffron-600">Hackathon project</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl text-ink-500 leading-tight max-w-3xl">
            Learn Kannada.<br />
            <span className="text-brand-500">Speak Confidently.</span><br />
            Connect Naturally.
          </h1>
          <p className="mt-5 text-lg text-ink-400 max-w-xl">
            A real-life Kannada conversation coach for newcomers to Bengaluru — from knowing words to holding everyday conversations.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link to="/app" className="btn-primary text-base">
              Try the demo <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#how" className="btn-secondary text-base">See how it works</a>
          </div>
          <p className="mt-4 text-sm text-ink-300 flex items-center gap-1.5">
            <Compass className="w-4 h-4" aria-hidden="true" />
            Works offline after first load. Your progress stays on your device.
          </p>
        </div>
      </section>

      {/* Problem statement */}
      <section className="bg-white border-y border-neutraltint-200">
        <div className="max-w-3xl mx-auto px-4 py-14">
          <SectionTitle kicker="The problem" title="Official problem statement" />
          <blockquote className="border-l-4 border-brand-500 pl-5 py-2 text-lg text-ink-500 italic">
            {config.problemStatementCorrected}
          </blockquote>
          <p className="mt-6 text-ink-400">
            Knowing a word is not the same as asking for it politely. Most learners freeze not because they lack vocabulary, but because they have never rehearsed the moment. NammaKannada is built around that gap: real situations, real replies, gentle practice.
          </p>
        </div>
      </section>

      {/* Target users */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <SectionTitle kicker="Who it's for" title="Made for Bengaluru newcomers" />
        <div className="grid sm:grid-cols-3 gap-4">
          {TARGET_USERS.map((u) => (
            <div key={u.title} className="card p-5">
              <h3 className="text-lg text-ink-500 mb-1">{u.title}</h3>
              <p className="text-sm text-ink-400">{u.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works — 7 step loop */}
      <section id="how" className="bg-white border-y border-neutraltint-200">
        <div className="max-w-5xl mx-auto px-4 py-14">
          <SectionTitle kicker="How it works" title="The 7-step learning loop" sub="A simple cycle: choose, learn, listen, speak, practise, get feedback, revise." />
          <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none">
            {LEARNING_LOOP.map((s) => (
              <li key={s.n} className="card p-5 relative animate-fade-in" style={{ animationDelay: `${s.n * 40}ms` }}>
                <span className="absolute -top-3 -left-3 w-9 h-9 rounded-full bg-brand-500 text-white grid place-items-center font-serif font-semibold shadow-soft">
                  {s.n}
                </span>
                <h3 className="text-base text-ink-500 mb-1 mt-1">{s.title}</h3>
                <p className="text-sm text-ink-400">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-5xl mx-auto px-4 py-14">
        <SectionTitle kicker="Features" title="What's in the demo" sub="Each feature is labelled honestly: what's working now, what's planned, and what's future." />
        <div className="grid sm:grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-base text-ink-500">{f.title}</h3>
                <StatusBadge status={f.status} />
              </div>
              <p className="text-sm text-ink-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-white border-y border-neutraltint-200">
        <div className="max-w-4xl mx-auto px-4 py-14">
          <SectionTitle kicker="Hypothesis" title="Where we fit" sub="This is a hypothesis, to be validated — not a measured comparison." />
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutraltint-100 text-ink-400">
                <tr>
                  <th className="text-left p-3 font-semibold">Capability</th>
                  <th className="p-3 font-semibold">Textbook</th>
                  <th className="p-3 font-semibold">Flashcard app</th>
                  <th className="p-3 font-semibold text-brand-700">NammaKannada</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.capability} className="border-t border-neutraltint-200">
                    <td className="p-3 text-ink-500">{row.capability}</td>
                    <td className="p-3 text-center">{row.textbook === 'no' ? <span className="text-ink-300">—</span> : <StatusBadge status={row.textbook} />}</td>
                    <td className="p-3 text-center">{row.flashcardApp === 'no' ? <span className="text-ink-300">—</span> : <StatusBadge status={row.flashcardApp} />}</td>
                    <td className="p-3 text-center">{row.namma === 'no' ? <span className="text-ink-300">—</span> : <StatusBadge status={row.namma} />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-ink-300 mt-3 italic">Competitor limitations are hypotheses, not tested claims.</p>
        </div>
      </section>

      {/* Impact metrics */}
      <section className="max-w-4xl mx-auto px-4 py-14">
        <SectionTitle kicker="Proposed" title="Impact we'd like to measure" sub="Proposed targets — TBD after a pilot. These are not measured results." />
        <div className="grid sm:grid-cols-2 gap-4">
          {PROPOSED_METRICS.map((m) => (
            <div key={m.label} className="card p-5">
              <p className="text-sm text-ink-400">{m.label}</p>
              <p className="text-xl text-brand-700 font-serif mt-1">{m.target}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section id="team" className="bg-white border-y border-neutraltint-200">
        <div className="max-w-4xl mx-auto px-4 py-14">
          <SectionTitle kicker="Team" title="Who's building this" />
          <div className="flex justify-center w-full mt-6">
            {config.team.map((t) => (
              <div key={t.role} className="card p-5 text-center w-64 mx-auto">
                <h3 className="text-base text-ink-500">{t.name}</h3>
                <p className="text-sm text-ink-400">{t.role}</p>
                {t.placeholder && (
                  <span className="chip bg-saffron-50 text-saffron-600 mt-2">Placeholder — edit in config</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-900 text-brand-50">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex flex-col sm:flex-row gap-8 justify-between">
            <div className="max-w-sm">
              <div className="flex items-center gap-2 font-serif font-semibold text-xl mb-2">
                <span className="kannada text-saffron-400">ನ</span>
                NammaKannada
              </div>
              <p className="text-sm text-brand-100/80">{config.project.closingLine}</p>
              <p className="text-sm text-brand-100/80 mt-1">{config.project.tagline}</p>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <a href={config.links.github} className="flex items-center gap-2 hover:text-saffron-300">
                <Github className="w-4 h-4" /> GitHub repo
              </a>
              <a href={config.links.live} className="flex items-center gap-2 hover:text-saffron-300">
                <Globe className="w-4 h-4" /> Live demo
              </a>
              {config.links.qr && (
                <span className="flex items-center gap-2">
                  <QrCode className="w-4 h-4" /> QR placeholder
                </span>
              )}
              <a href={`mailto:${config.links.contact}`} className="flex items-center gap-2 hover:text-saffron-300">
                <Mail className="w-4 h-4" /> Contact
              </a>
              <Link to="/appendix" className="flex items-center gap-2 hover:text-saffron-300">
                <ArrowRight className="w-4 h-4" /> Sources & to-verify
              </Link>
            </div>
          </div>
          <p className="text-xs text-brand-100/60 mt-8 border-t border-brand-800 pt-4">
            Hackathon prototype. All team names, links, QR, and contact are placeholders — edit{' '}
            <code className="font-mono">src/data/siteConfig.json</code>. No stock photos, fake testimonials, or invented statistics were used.
          </p>
        </div>
      </footer>
    </div>
  );
}
