import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Info } from 'lucide-react';
import sourcesData from '@/data/sources.json';

const TO_VERIFY: { item: string; why: string }[] = [
  { item: 'All Kannada phrases, transliterations, and Telugu meanings', why: 'Must be validated by a fluent Kannada speaker before any public release.' },
  { item: 'Citations (South First, Onmanorama, Roediger & Karpicke, Cepeda)', why: 'Marked "verify citation" — confirm authors, dates, and exact references.' },
  { item: 'Audio quality of the browser speech engine for Kannada', why: 'Accuracy and naturalness vary across OS/browser voice packs. Test on target devices.' },
  { item: 'Speech-to-text (kn-IN) accuracy on learner speech', why: 'Listed as supported by Google Cloud, but untested by us. Keep the feature flag off by default.' },
  { item: 'Comparison table claims about textbooks / flashcard apps', why: 'These are hypotheses, not measured competitor analysis.' },
];

export default function Appendix() {
  return (
    <div className="min-h-screen bg-neutraltint-50">
      <header className="sticky top-0 z-30 bg-neutraltint-50/85 backdrop-blur border-b border-neutraltint-200">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-serif font-semibold text-brand-700">
            <span className="kannada text-xl text-saffron-500">ನ</span>
            NammaKannada
          </Link>
          <Link to="/" className="btn-ghost !py-2 text-sm">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <div>
          <p className="text-xs text-saffron-600 font-semibold uppercase tracking-widest mb-1">Appendix</p>
          <h1 className="text-2xl text-ink-500">Sources & to-verify</h1>
          <p className="text-sm text-ink-400 mt-2">
            Honesty matters more than polish. These are the only sources we cite, and each is flagged with what still needs checking. We do not claim AI conversation, speech recognition, or pronunciation scoring works.
          </p>
        </div>

        <section>
          <h2 className="text-lg text-ink-500 mb-3">Cited sources</h2>
          <ul className="space-y-3 list-none">
            {sourcesData.map((s) => (
              <li key={s.id} className="card p-4">
                <p className="text-sm font-medium text-ink-500">{s.citation}</p>
                <p className="text-sm text-ink-400 mt-1">{s.summary}</p>
                <p className="text-xs text-terracotta-500 mt-2 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  {s.verify}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg text-ink-500 mb-3">To verify before presenting</h2>
          <ul className="space-y-2 list-none">
            {TO_VERIFY.map((t) => (
              <li key={t.item} className="card p-4">
                <p className="text-sm text-ink-500 flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-saffron-100 text-saffron-600 grid place-items-center text-xs font-semibold shrink-0 mt-0.5">!</span>
                  {t.item}
                </p>
                <p className="text-xs text-ink-400 mt-1 pl-7">{t.why}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-4 bg-neutraltint-50 border-neutraltint-200">
          <p className="text-xs text-ink-400 flex items-start gap-2">
            <ExternalLink className="w-4 h-4 shrink-0 mt-0.5 text-ink-300" />
            We have not invented links, QR codes, statistics, testimonials, or competitor performance claims. All team names, GitHub URL, live URL, QR, and contact are editable placeholders in <code className="font-mono">src/data/siteConfig.json</code>.
          </p>
        </section>
      </main>
    </div>
  );
}
