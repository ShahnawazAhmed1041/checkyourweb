'use client';

import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

export default function ScanProgressModal({ progress, currentStep, steps, targetDomain }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md px-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-6 sm:p-8 overflow-hidden">
        
        {/* Top ambient glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl" />

        {/* Header */}
        <div className="relative text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            Analyzing Across 7 Perspectives
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Mirroring <span className="text-blue-600 font-mono text-lg">{targetDomain || 'Website'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Running simulated heuristics. This takes just a few seconds...
          </p>
        </div>

        {/* Large Progress Bar & Percentage */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
            <span>{currentStep?.label || 'Initializing engine...'}</span>
            <span className="font-mono text-blue-600">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/70">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 rounded-full transition-all duration-300 ease-out shadow-xs"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Live Step Checklist */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 space-y-2.5 max-h-56 overflow-y-auto">
          {steps.map((s, index) => {
            const isCompleted = progress >= s.threshold;
            const isCurrent = !isCompleted && (index === 0 || progress >= steps[index - 1]?.threshold);

            return (
              <div
                key={s.id}
                className={`flex items-center justify-between text-xs px-2 py-1 rounded-lg transition-all ${
                  isCurrent ? 'bg-white shadow-xs font-medium text-slate-900' : 'text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0" />
                  )}
                  <span className={isCompleted ? 'text-slate-700' : isCurrent ? 'text-blue-700 font-semibold' : 'text-slate-400'}>
                    {s.title}
                  </span>
                </div>

                <span className={`text-[10px] font-mono uppercase tracking-wider ${
                  isCompleted ? 'text-emerald-600 font-semibold' : isCurrent ? 'text-blue-600 animate-pulse' : 'text-slate-400'
                }`}>
                  {isCompleted ? 'Ready' : isCurrent ? 'Inspecting' : 'Queued'}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}