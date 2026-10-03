import { ArrowUpCircle, Sparkles } from 'lucide-react';

export default function WaitingPlaceholder({ perspectiveName, perspectiveDescription }) {
  const scrollToTop = () => {
    document.getElementById('analyze-website')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 sm:p-12 text-center transition-all hover:border-blue-300">
      {/* Background Animated Pulse Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/50 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />

      <div className="relative z-10 max-w-md mx-auto flex flex-col items-center">
        {/* Pulsing Icon Bubble */}
        <div className="relative mb-4 flex items-center justify-center">
          <div className="absolute h-14 w-14 rounded-full bg-blue-100 animate-ping opacity-75" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 border border-blue-200 text-blue-600 shadow-xs">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>

        <h3 className="text-base font-semibold text-slate-900 mb-1">
          Waiting for your website URL
        </h3>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          {perspectiveDescription} Enter your URL at the top to unlock this perspective.
        </p>

        <button
          onClick={scrollToTop}
          type="button"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
        >
          <ArrowUpCircle className="w-4 h-4" />
          Enter URL Above
        </button>
      </div>
    </div>
  );
}