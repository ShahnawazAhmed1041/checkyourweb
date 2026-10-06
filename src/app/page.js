// src/app/page.js
'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WaitingPlaceholder from '@/components/WaitingPlaceholder';
import ScanProgressModal from '@/components/ScanProgressModal';
import InfoDrawer from '@/components/InfoDrawer';
import { analyzeWebsiteUrl } from '@/lib/analyzer';
import { generateReportPDF } from '@/lib/pdfGenerator';
import { 
  Search, Eye, Bot, Compass, HelpCircle, 
  Briefcase, CheckCircle2, AlertTriangle, Loader2, 
  Sparkles, ShieldCheck, ArrowRight, 
  Check, Globe, Download, Users, BriefcaseBusiness,
  Monitor, Tablet, Smartphone, MessageSquare, Zap, X
} from 'lucide-react';

const scanSteps = [
  { id: 1, title: 'Connecting to website...', threshold: 18, label: 'Accessing public pages' },
  { id: 2, title: 'Testing Desktop, Tablet & Mobile speed...', threshold: 35, label: 'Running multi-device benchmarks' },
  { id: 3, title: 'Checking Google search signboard...', threshold: 52, label: 'Evaluating index and visibility signals' },
  { id: 4, title: 'Simulating first-time human visitor...', threshold: 68, label: 'Checking 5-second clarity' },
  { id: 5, title: 'Auditing AI & machine readability...', threshold: 84, label: 'Extracting business profile tags' },
  { id: 6, title: 'Writing simple team action tasks...', threshold: 99, label: 'Finalizing 60+ department checklists' },
];

export default function Home() {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('mobile');

  // Drawer state for footer links
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeDrawerTab, setActiveDrawerTab] = useState('privacy');

  // 2-Step Ad Monetization State for PDF
  const [adModalOpen, setAdModalOpen] = useState(false);
  const [adWatched, setAdWatched] = useState(false);

  const handleOpenDrawer = (tabName) => {
    setActiveDrawerTab(tabName);
    setDrawerOpen(true);
  };

  const handleAnalyze = async (e, directUrl = null) => {
    if (e) e.preventDefault();
    const target = directUrl || url;
    if (!target.trim()) return;

    if (directUrl) setUrl(directUrl);

    setIsScanning(true);
    setScanProgress(8);
    setError('');

    try {
      const progressInterval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 92) return prev;
          const next = prev + Math.floor(Math.random() * 9) + 4;
          return Math.min(next, 92);
        });
      }, 160);

      const result = await analyzeWebsiteUrl(target);

      clearInterval(progressInterval);
      setScanProgress(100);

      setTimeout(() => {
        setData(result);
        setIsScanning(false);
        setAdWatched(false); // Reset ad status for new scan
        document.getElementById('business-overview')?.scrollIntoView({ behavior: 'smooth' });
      }, 400);

    } catch (err) {
      setIsScanning(false);
      setError(err.message || 'Could not analyze website. Please check the URL.');
    }
  };

  // 2-Step PDF Logic: 1st Click opens Ad, 2nd Click downloads
  const handlePdfAction = () => {
    if (!data) return;

    if (!adWatched) {
      // Step 1: Trigger Ad Modal
      setAdModalOpen(true);
    } else {
      // Step 2: Download PDF directly
      executePdfDownload();
    }
  };

  const handleAdFinishedAndDownload = () => {
    setAdModalOpen(false);
    setAdWatched(true);
    executePdfDownload();
  };

  const executePdfDownload = async () => {
    setIsExportingPdf(true);
    try {
      await generateReportPDF(data);
    } catch (err) {
      alert('Could not generate PDF: ' + err.message);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const scrollToDownloadSection = () => {
    document.getElementById('download-pdf-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const getBadgeStyle = (team) => {
    switch (team) {
      case 'Development Team': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'SEO Team': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Designer Team': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'Content Team': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Marketing Team': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const RenderActionChecklist = ({ items }) => (
    <div className="mt-8 border-t border-slate-200/80 pt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Action Tasks For Your Team
          </span>
          <p className="text-[11px] text-slate-400">Written in plain language so anyone can understand</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Users className="w-4 h-4 text-slate-400" />
          <span>{items.length} Tasks</span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Everything looks clean here. No major bottleneck found!</span>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs text-xs sm:text-sm transition-all hover:border-slate-300">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${getBadgeStyle(item.team)}`}>
                  {item.team}
                </span>
                <span className="text-[11px] font-mono text-slate-500 font-semibold uppercase">
                  Subject: <strong className="text-slate-800">{item.keyword}</strong>
                </span>
              </div>

              <div className="space-y-1.5 mt-2">
                <div className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold flex-shrink-0">Problem:</span>
                  <span className="text-slate-800 font-medium">{item.problem}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold flex-shrink-0">How to Fix:</span>
                  <span className="text-slate-600">{item.solution}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      
      <Header />

      {/* Slide-over Drawer for Legal/Info Pages */}
      <InfoDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeTab={activeDrawerTab}
      />

      {/* Ad Modal for 1st Click on PDF */}
      {adModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 text-center">
            
            <button
              onClick={() => setAdModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">
              Sponsored Advertisement
            </span>

            {/* Ad Container Space for Google AdSense */}
            <div className="my-4 min-h-[250px] w-full rounded-2xl bg-slate-100 border border-dashed border-slate-300 flex flex-col items-center justify-center p-4 text-slate-400 text-xs">
              <span className="font-mono text-slate-500 font-semibold mb-1">Google AdSense Space</span>
              <span>(Display / Interstitial Ad Unit)</span>
            </div>

            <p className="text-xs text-slate-500 mb-5">
              Your free comprehensive report is compiled. Tap below to unlock instant PDF export.
            </p>

            <button
              onClick={handleAdFinishedAndDownload}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Continue & Download Report</span>
            </button>

          </div>
        </div>
      )}

      {isScanning && (
        <ScanProgressModal
          progress={scanProgress}
          currentStep={scanSteps.find(s => scanProgress < s.threshold) || scanSteps[scanSteps.length - 1]}
          steps={scanSteps}
          targetDomain={url.replace(/https?:\/\//i, '').split('/')[0]}
        />
      )}

      <main className="flex-1 space-y-28 pb-16">
        
        {/* SECTION 1: Hero */}
        <section id="analyze-website" className="relative pt-24 pb-20 px-4 sm:px-6 max-w-4xl mx-auto text-center scroll-mt-28">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            CheckYourWeb — Open Book Website Audit for Everyone.
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-950 mb-6 leading-[1.12]">
            See Your Website Through <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Different Eyes.
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
            A complete open book inspection of your entire website. Understand what Google, human visitors, and AI bots see in language so simple a 10-year-old child and a 60-year-old business owner can both take action.
          </p>

          <form onSubmit={handleAnalyze} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80">
            <div className="flex-1 flex items-center px-4 py-2">
              <Globe className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Enter any website (e.g. https://sewpatches.com/)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:outline-none font-medium"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isScanning}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer flex-shrink-0"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Auditing Website...</span>
                </>
              ) : (
                <>
                  <span>Audit Website</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          

          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Multi-Device Speed Benchmarks (Mobile, Tablet, Desktop) with 60+ department checklists.</span>
          </div>

          {error && (
            <div className="mt-5 text-xs text-rose-700 bg-rose-50 border border-rose-200 px-4 py-3 rounded-xl max-w-md mx-auto flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}
        </section>

        {/* EXECUTIVE BUSINESS OVERVIEW & 3-DEVICE SPEED CONSOLE */}
        {data && (
          <section id="business-overview" className="max-w-5xl mx-auto px-4 sm:px-6 scroll-mt-28 space-y-6">
            
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 text-white shadow-xl border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2">
                    <BriefcaseBusiness className="w-3.5 h-3.5" />
                    Executive Leadership Dashboard
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">Website Health & Speed Intelligence</h2>
                  <p className="text-xs text-slate-400 mt-1">Real-time status for business owners to direct their Web, SEO, and Marketing teams.</p>
                </div>
                
                <button
                  onClick={handlePdfAction}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer w-fit"
                >
                  <Download className="w-4 h-4" />
                  {adWatched ? 'Download PDF' : 'Download PDF (Free)'}
                </button>
              </div>

              {/* 3-DEVICE PAGE SPEED SELECTOR */}
              <div className="mt-6 p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Multi-Device Loading Speed
                    </span>
                  </div>

                  {/* Device Tabs */}
                  <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setSelectedDevice('mobile')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedDevice === 'mobile' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      Mobile Phone
                    </button>
                    <button
                      onClick={() => setSelectedDevice('tablet')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedDevice === 'tablet' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Tablet className="w-3.5 h-3.5" />
                      Tablet
                    </button>
                    <button
                      onClick={() => setSelectedDevice('desktop')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedDevice === 'desktop' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      Desktop PC
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block">Device Mode</span>
                    <span className="text-base font-bold text-white capitalize mt-1 block">{selectedDevice}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block">Opening Speed</span>
                    <span className="text-lg font-bold text-amber-400 mt-1 block">
                      {selectedDevice === 'mobile' ? data.stats.mobileSeconds : selectedDevice === 'tablet' ? data.stats.tabletSeconds : data.stats.desktopSeconds}s
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block">Speed Score</span>
                    <span className="text-lg font-bold text-emerald-400 mt-1 block">
                      {selectedDevice === 'mobile' ? data.stats.mobileScore : selectedDevice === 'tablet' ? data.stats.tabletScore : data.stats.desktopScore}/100
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block">Network Tested</span>
                    <span className="text-xs font-bold text-blue-300 mt-2 block">
                      {selectedDevice === 'mobile' ? '4G Mobile Data' : selectedDevice === 'tablet' ? 'Wi-Fi Network' : 'Fiber Broadband'}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-3 italic text-center">
                  *If mobile takes more than 3 seconds to open, 40% of impatient customers press back and visit your competitor.
                </p>
              </div>

              {/* 3 Core Business Benchmarks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Search Engine Visibility</span>
                  <span className="text-base font-bold text-amber-400 block">{data.stats.visibilityStatus}</span>
                  <span className="text-[11px] text-slate-400 block mt-1">{data.stats.visibilityNote}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Technical SEO Score</span>
                  <span className="text-lg font-bold text-emerald-400 block">{data.seoView.score}/100</span>
                  <span className="text-[11px] text-slate-400 block mt-1">~{data.wordCount} words on page</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Customer Actions (CTAs)</span>
                  <span className="text-lg font-bold text-purple-400 block">{data.visitorView.primaryActions.length} Buttons Found</span>
                  <span className="text-[11px] text-slate-400 block mt-1">{data.stats.hasPhone ? 'Phone call linked' : 'No 1-tap phone link'}</span>
                </div>
              </div>

            </div>

            {/* EXECUTIVE FAQ CONSOLE */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Top 5 Questions Every Website Owner Asks</h3>
                  <p className="text-xs text-slate-500">Straightforward answers in plain English without any confusing technical words.</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {data.ownerFaqs.map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 text-xs sm:text-sm">
                    <h4 className="font-bold text-slate-900 flex items-start gap-2 mb-1.5">
                      <span className="text-blue-600 font-mono font-bold">Q{idx + 1}:</span>
                      <span>{faq.q}</span>
                    </h4>
                    <p className="text-slate-600 leading-relaxed pl-6">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </section>
        )}

        {/* SECTION 2: Google View */}
        <section id="google-view" className="max-w-5xl mx-auto px-4 sm:px-6 scroll-mt-28">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-blue-500 text-white rounded-2xl shadow-md shadow-blue-500/20">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">Perspective 01</div>
                <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">Google View</h2>
                <p className="text-xs sm:text-sm text-slate-500">How your business signboard and summary card appear on Google Search.</p>
              </div>
            </div>

            {data && (
              <button
                onClick={handlePdfAction}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                {adWatched ? 'Download PDF' : 'Download PDF (Free)'}
              </button>
            )}
          </div>

          {!data ? (
            <WaitingPlaceholder
              perspectiveName="Google View"
              perspectiveDescription="See an estimated Google search snippet, indexing status, and title/meta signals."
            />
          ) : (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/70 text-xs sm:text-sm text-blue-900">
                <strong>Plain English Summary: </strong>{data.googleView.ownerSummary}
              </div>

              {/* SERP preview */}
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 max-w-2xl font-sans">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Live Google Search Preview</span>
                <span className="text-xs text-slate-500 truncate block">{data.url}</span>
                <h3 className="text-blue-800 text-lg sm:text-xl font-medium hover:underline cursor-pointer leading-snug mt-1">
                  {data.googleView.searchTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {data.googleView.searchSnippet}
                </p>
              </div>

              <div className="grid sm:grid-cols-4 gap-4">
                {data.googleView.signals.map((sig, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50/60 border border-slate-200/70">
                    <div className="text-xs text-slate-500 font-medium">{sig.label}</div>
                    <div className="text-sm sm:text-base font-bold text-slate-900 mt-1 truncate">{sig.value}</div>
                    <div className={`mt-2 text-xs font-semibold flex items-center gap-1.5 ${sig.pass ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {sig.pass ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                      {sig.status}
                    </div>
                  </div>
                ))}
              </div>

              <RenderActionChecklist items={data.googleView.checklist} />
            </div>
          )}
        </section>

        {/* SECTION 3: Visitor View */}
        <section id="visitor-view" className="max-w-5xl mx-auto px-4 sm:px-6 scroll-mt-28">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-indigo-500 text-white rounded-2xl shadow-md shadow-indigo-500/20">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest">Perspective 02</div>
                <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">Visitor View</h2>
                <p className="text-xs sm:text-sm text-slate-500">What a new customer notices in their first 5 seconds: are they impressed or confused?</p>
              </div>
            </div>

            {data && (
              <button
                onClick={handlePdfAction}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                {adWatched ? 'Download PDF' : 'Download PDF (Free)'}
              </button>
            )}
          </div>

          {!data ? (
            <WaitingPlaceholder
              perspectiveName="Visitor View"
              perspectiveDescription="See an estimation of hero clarity, visual scannability, primary calls-to-action, and trust anchors."
            />
          ) : (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/70 text-xs sm:text-sm text-indigo-900">
                <strong>Plain English Summary: </strong>{data.visitorView.ownerSummary}
              </div>

              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                <span className="text-xs font-semibold text-slate-500 block mb-1">First statement seen when opening the page:</span>
                <p className="text-base sm:lg font-bold text-slate-900">{data.visitorView.headlineClarity}</p>
              </div>

              <RenderActionChecklist items={data.visitorView.checklist} />
            </div>
          )}
        </section>

        {/* SECTION 4: AI Bot View */}
        <section id="ai-bot-view" className="max-w-5xl mx-auto px-4 sm:px-6 scroll-mt-28">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-purple-600 text-white rounded-2xl shadow-md shadow-purple-600/20">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-purple-600 uppercase tracking-widest">Perspective 03</div>
                <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">AI Bot View</h2>
                <p className="text-xs sm:text-sm text-slate-500">How modern AI tools (ChatGPT, Claude, Gemini) understand your business.</p>
              </div>
            </div>

            {data && (
              <button
                onClick={handlePdfAction}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                {adWatched ? 'Download PDF' : 'Download PDF (Free)'}
              </button>
            )}
          </div>

          {!data ? (
            <WaitingPlaceholder
              perspectiveName="AI Bot View"
              perspectiveDescription="See how machine models evaluate structured entities, semantic landmark tags, and context density."
            />
          ) : (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/70 text-xs sm:text-sm text-purple-900">
                <strong>Plain English Summary: </strong>{data.aiBotView.ownerSummary}
              </div>

              <RenderActionChecklist items={data.aiBotView.checklist} />
            </div>
          )}
        </section>

        {/* SECTION 5: SEO View */}
        <section id="seo-view" className="max-w-5xl mx-auto px-4 sm:px-6 scroll-mt-28">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-md shadow-emerald-600/20">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">Perspective 04</div>
                <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">SEO View</h2>
                <p className="text-xs sm:text-sm text-slate-500">The technical foundation scorecard: are you climbing or falling on Google?</p>
              </div>
            </div>

            {data && (
              <button
                onClick={handlePdfAction}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                {adWatched ? 'Download PDF' : 'Download PDF (Free)'}
              </button>
            )}
          </div>

          {!data ? (
            <WaitingPlaceholder
              perspectiveName="SEO View"
              perspectiveDescription="See an estimated foundation score, friction points, and actionable optimization steps."
            />
          ) : (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 text-xs sm:text-sm text-emerald-900">
                <strong>Plain English Summary: </strong>{data.seoView.ownerSummary}
              </div>

              <RenderActionChecklist items={data.seoView.checklist} />
            </div>
          )}
        </section>

        {/* SECTION 6: AEO View */}
        <section id="aeo-view" className="max-w-5xl mx-auto px-4 sm:px-6 scroll-mt-28">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-md shadow-amber-500/20">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">Perspective 05</div>
                <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">AEO View</h2>
                <p className="text-xs sm:text-sm text-slate-500">Can conversational AI answer engines (ChatGPT, Perplexity) quote your answers?</p>
              </div>
            </div>

            {data && (
              <button
                onClick={handlePdfAction}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                {adWatched ? 'Download PDF' : 'Download PDF (Free)'}
              </button>
            )}
          </div>

          {!data ? (
            <WaitingPlaceholder
              perspectiveName="AEO View"
              perspectiveDescription="See question extraction readiness, FAQ patterns, and recommendations for AI answer engines."
            />
          ) : (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-xs sm:text-sm text-amber-900">
                <strong>Plain English Summary: </strong>{data.aeoView.ownerSummary}
              </div>

              <RenderActionChecklist items={data.aeoView.checklist} />
            </div>
          )}
        </section>

        {/* SECTION 7: Business View */}
        <section id="business-view" className="max-w-5xl mx-auto px-4 sm:px-6 scroll-mt-28">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-cyan-600 text-white rounded-2xl shadow-md shadow-cyan-600/20">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-cyan-600 uppercase tracking-widest">Perspective 06</div>
                <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">Business View</h2>
                <p className="text-xs sm:text-sm text-slate-500">The commercial conversion test: is this site turning visitors into revenue?</p>
              </div>
            </div>

            {data && (
              <button
                onClick={handlePdfAction}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                {adWatched ? 'Download PDF' : 'Download PDF (Free)'}
              </button>
            )}
          </div>

          {!data ? (
            <WaitingPlaceholder
              perspectiveName="Business View"
              perspectiveDescription="See core commercial promises, conversion prompts, objection detection, and credibility signals."
            />
          ) : (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200/70 text-xs sm:text-sm text-cyan-900">
                <strong>Plain English Summary: </strong>{data.businessView.ownerSummary}
              </div>

              <RenderActionChecklist items={data.businessView.checklist} />
            </div>
          )}
        </section>

        {/* DEDICATED PDF EXPORT SECTION */}
        {data && (
          <section id="download-pdf-section" className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 scroll-mt-28">
            <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 sm:p-12 text-white border border-slate-800 shadow-2xl">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-4">
                  <Download className="w-3.5 h-3.5" />
                  CheckYourWeb Executive Audit Export
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
                  Download Complete Team Action Report
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-300 mb-8 leading-relaxed">
                  Download an executive PDF audit for <span className="text-blue-400 font-mono font-semibold">{data.domain}</span> containing Desktop/Tablet/Mobile speed ratings, realistic Google Search Visibility, owner FAQs, and all 60+ department tasks.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <button
                    onClick={handlePdfAction}
                    disabled={isExportingPdf}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 cursor-pointer"
                  >
                    {isExportingPdf ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>{adWatched ? 'Download Complete PDF Report' : 'Download Complete PDF (Free)'}</span>
                      </>
                    )}
                  </button>

                  <div className="text-xs text-slate-400 flex items-center gap-1.5 justify-center sm:justify-start">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Includes 3-Device Speed Benchmarks & 60+ Checklists</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

      </main>

      <Footer onOpenDrawer={handleOpenDrawer} />
    </div>
  );
}
