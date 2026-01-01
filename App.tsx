
import React, { useState, useEffect, useRef } from 'react';
import { AppView, AnalysisResult } from './types';
import { Button, Badge, Card, BrandLogo, LegalDisclaimer } from './components/UI';
import { UploadSection, ResultsDashboard } from './components/PatientFlow';
import { PatientDashboard, PatientLogin } from './components/PatientDashboard';
import { AdvocateDashboard, AdvocateLogin } from './components/AdvocateFlow';
import { AdvocateLanding } from './components/AdvocateLanding';
import { AdminDashboard } from './components/AdminDashboard';
import { CompliancePage, SupportPage } from './components/ComplianceSupport';
import { saveAnonymizedBill, saveBillToPatientSession, checkSystemIntegrity, getBillDetails } from './services/integrationService';
import { 
  ArrowRight, ShieldCheck, Menu, X, 
  Check, Star, Shield, Lock, Users, Search, Target, AlertOctagon, HelpCircle, ChevronDown, Zap,
  Landmark, Scale, Quote, MessageSquare, AlertCircle, TrendingUp, Award, FileText, ChevronRight, Activity, Cpu
} from 'lucide-react';

const App = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [systemStatus, setSystemStatus] = useState("PRODUCTION_SYNCING");
  
  const lastScrollY = useRef(0);
  const scrollTicking = useRef(false);

  useEffect(() => {
    checkSystemIntegrity().then(status => {
        setSystemStatus(status.env);
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollTicking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
            setIsHeaderVisible(false);
          } else {
            setIsHeaderVisible(true);
          }
          setIsScrolled(currentScrollY > 50);
          lastScrollY.current = currentScrollY;
          scrollTicking.current = false;
        });
        scrollTicking.current = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleHash = () => {
        const hash = window.location.hash.replace('#', '');
        setIsMobileMenuOpen(false);
        if (hash === 'scan') setView(AppView.UPLOAD);
        else if (hash === 'report') setView(AppView.RESULTS);
        else if (hash === 'dashboard') setView(AppView.PATIENT_LOGIN);
        else if (hash === 'dashboard/portal') setView(AppView.PATIENT_DASHBOARD);
        else if (hash === 'advocates') setView(AppView.ADVOCATE_LANDING);
        else if (hash === 'advocates/login') setView(AppView.ADVOCATE_LOGIN);
        else if (hash === 'advocates/portal') setView(AppView.ADVOCATE_DASHBOARD);
        else if (hash === 'admin') setView(AppView.ADMIN_DASHBOARD);
        else if (['privacy', 'compliance', 'security', 'hipaa', 'soc2'].includes(hash)) setView(AppView.COMPLIANCE);
        else if (['support', 'help', 'api'].includes(hash)) setView(AppView.SUPPORT);
        else setView(AppView.LANDING);
        
        window.scrollTo(0, 0);
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleAnalysisComplete = async (result: AnalysisResult) => {
    const billId = result.billId || `bill_${Date.now()}`;
    const resultWithId = { ...result, billId };
    setAnalysisResult(resultWithId);
    saveBillToPatientSession(billId);
    await saveAnonymizedBill(billId, resultWithId);
    window.location.hash = 'report';
  };

  const handleViewHistoricalBill = async (billId: string) => {
    const details = await getBillDetails(billId);
    if (details) {
        setAnalysisResult(details);
        window.location.hash = 'report';
    } else {
        alert("Clinical record not found in this node.");
    }
  };

  const isDashboardView = [
    AppView.ADVOCATE_DASHBOARD, 
    AppView.ADMIN_DASHBOARD, 
    AppView.PATIENT_DASHBOARD, 
    AppView.PATIENT_LOGIN, 
    AppView.ADVOCATE_LOGIN
  ].includes(view);

  const LandingPage = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
      <div className="animate-fade-in bg-[#0F172A] text-white overflow-x-hidden selection:bg-cyan-500/30">
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-48 pb-40 px-6 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1000px] bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.08)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <div className="flex flex-col items-center space-y-12 animate-slide-up">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <span className={`w-2 h-2 ${systemStatus === 'ACTIVE_TEST_NODE' ? 'bg-emerald-500' : 'bg-rose-500'} rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.4)]`} />
                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-emerald-500 italic">Global Recovery Node: {systemStatus === 'ACTIVE_TEST_NODE' ? 'LIVE' : 'INITIALIZING'}</span>
              </div>

              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[8.5rem] font-black tracking-tighter leading-[0.85] uppercase italic text-white drop-shadow-2xl">
                I Know How <br/> <span className="text-rose-500">Terrifying</span> <br/> That Hospital Bill Feels.
              </h1>

              <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto font-medium italic leading-relaxed opacity-90">
                You're not alone. Hospitals are robbing <span className="text-white font-bold italic">8 out of 10 Americans</span> — $1,844 in fake charges + $20k in hidden aid they hope you never find.
              </p>

              <div className="flex flex-col items-center gap-8 pt-8">
                <Button 
                  variant="teal" 
                  glow 
                  className="h-28 px-24 text-2xl font-black italic uppercase shadow-[0_30px_90px_rgba(6,182,212,0.3)] hover:scale-105 transition-transform bg-[#06B6D4] text-white rounded-[2.5rem]" 
                  onClick={() => { window.location.hash = 'scan'; }}
                >
                  Scan My Bill Free →
                </Button>
                <div className="text-[12px] font-black uppercase tracking-[0.2em] italic text-slate-500">
                  100% HIPAA-Secure Extraction • AES-256 Encrypted
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-[#1E293B]/50 border-y border-white/5 py-8 overflow-hidden">
            <div className="flex items-center gap-16 animate-marquee whitespace-nowrap">
                {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-slate-400 italic">
                        <Zap size={14} className="text-cyan-400" /> RECOVERED $12,840 (ST. DAVIDS) • RECOVERED $4,200 (CEDARS-SINAI) • RECOVERED $890 (ER-VISIT)
                    </div>
                ))}
            </div>
        </div>

        <section className="py-40 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <Badge color="red" className="mb-10 px-8 py-3">The Forensic OS</Badge>
              <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">
                  We Find What They <br/> <span className="text-cyan-400">Hide—Every Time.</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                  { icon: <ShieldCheck size={32} className="text-rose-500" />, title: "Forensic Audit", desc: "Line-by-line comparison against Fair Market Prices using real-time grounding." },
                  { icon: <Landmark size={32} className="text-emerald-500" />, title: "Charity Care", desc: "Automated matching with mandatory non-profit hospital aid grants (501r)." },
                  { icon: <Target size={32} className="text-cyan-400" />, title: "Upcoding Detection", desc: "Machine-learning detection of inflated E&M levels and unbundled surgical codes." },
                  { icon: <Scale size={32} className="text-teal-400" />, title: "Expert Advocate", desc: "Instant deployment of certified clinical advocates to negotiate directly on your behalf." }
              ].map((card, i) => (
                  <Card key={i} className="p-12 py-16 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-500 bg-slate-900/40 border-white/5 shadow-2xl">
                      <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mb-8 border border-white/5">{card.icon}</div>
                      <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">{card.title}</h3>
                      <p className="text-slate-400 text-sm font-medium italic leading-relaxed">{card.desc}</p>
                  </Card>
              ))}
            </div>
        </section>

        <section className="py-40 px-6 bg-[#0F172A] border-y border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
              <div className="text-left">
                <Badge color="teal" className="mb-8 px-6 py-2">Success Metrics</Badge>
                <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">
                  Real Patients. <br/> <span className="text-rose-500">Real Capital Recovered.</span>
                </h2>
              </div>
              <div className="flex gap-12">
                <div className="text-right">
                  <p className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">$12M+</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic mt-1 leading-none">Total Recovered</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">84%</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic mt-1 leading-none">Audit Win-Rate</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Jessica R.", location: "Austin, TX", recovered: "$4,240", story: "My ER visit for a broken wrist was $8,000. PocketProof found that the hospital upcoded my level 5 visit. They handled the dispute and saved me half the bill.", rating: 5 },
                { name: "Marcus T.", location: "Chicago, IL", recovered: "$12,800", story: "Hospital wouldn't tell me about charity care. This tool matched me with a grant I qualified for within 20 seconds. My bill was completely wiped.", rating: 5 },
                { name: "David L.", location: "Miami, FL", recovered: "$1,890", story: "Unbundled surgical codes were hidden in my bill. The AI caught it immediately. Don't pay until you scan it first.", rating: 5 }
              ].map((review, i) => (
                <Card key={i} className="p-10 md:p-12 relative flex flex-col justify-between h-auto hover:-translate-y-2 transition-all duration-500 shadow-3xl bg-slate-900/40 border-white/5">
                  <div>
                    <div className="flex items-center gap-1 mb-8">
                      {[1,2,3,4,5].map(s => <Star key={s} size={16} className="text-amber-500 fill-amber-500" />)}
                    </div>
                    <p className="text-white text-xl italic leading-relaxed font-bold mb-12">
                      "{review.story}"
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-950 rounded-[1.25rem] flex items-center justify-center font-black italic text-white text-xl leading-none border border-white/10"> {review.name[0]} </div>
                      <div>
                        <p className="font-black text-white uppercase italic tracking-tighter text-lg leading-tight">{review.name}</p>
                        <p className="text-[10px] text-slate-500 font-black uppercase italic tracking-widest mt-1 leading-none">{review.location}</p>
                      </div>
                    </div>
                    <div className="bg-rose-500/10 px-5 py-2.5 rounded-2xl border border-rose-500/20">
                      <span className="text-rose-500 font-black uppercase italic tracking-widest text-[10px] leading-none">Saved {review.recovered}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-40 px-6 max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <Badge color="white" className="mb-8">The Truth Deck</Badge>
            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">
              Hard Questions. <br/> <span className="text-cyan-400">Honest Answers.</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { q: "Is this legal?", a: "Absolutely. Federal laws like the No Surprises Act and Section 501(r) of the IRS code mandate that hospitals provide transparent pricing and financial assistance. We simply use AI to enforce these laws for you." },
              { q: "Will this hurt my credit score?", a: "No. In fact, disputing a bill stops the collection clock in many states. Our goal is to resolve the dispute before it ever touches your credit report." },
              { q: "How secure is my medical data (PHI)?", a: "We are SOC-2 compliant. Your data is encrypted with AES-256. Before our AI analyzes the bill, it runs a 'Sanitization Pass' to mask your SSN and other direct identifiers." },
              { q: "Can the hospital retaliate against me?", a: "Hospitals are legally barred from denying emergency care or retaliating against patients for exercising their consumer rights. We work within established regulatory frameworks." },
              { q: "What if the audit finds no errors?", a: "That's a win. You'll get a 'Clinical Integrity Certificate' confirming your bill is fair and market-rate. We don't charge anything for clean audits." }
            ].map((faq, i) => (
              <div key={i} className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-3xl overflow-hidden transition-all">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-8 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-lg font-black uppercase italic tracking-tighter text-white">{faq.q}</span>
                  <ChevronDown className={`w-6 h-6 transition-transform duration-500 ${openFaq === i ? 'rotate-180 text-cyan-400' : 'text-slate-500'}`} />
                </button>
                <div className={`transition-all duration-500 overflow-hidden ${openFaq === i ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-8 pt-0 text-slate-400 text-base italic leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-rose-600 py-48 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_70%)] pointer-events-none" />
          <div className="max-w-4xl mx-auto relative z-10 space-y-12">
            <h2 className="text-6xl md:text-[8rem] font-black text-white tracking-tighter leading-[0.8] uppercase italic drop-shadow-2xl">
              Take Back Your <br/> Money.
            </h2>
            <div className="flex flex-col items-center gap-8">
              <Button 
                    variant="teal" 
                    glow
                    className="h-28 px-24 text-2xl font-black italic uppercase shadow-3xl bg-cyan-400 text-slate-950 hover:bg-white hover:text-rose-600 transition-all rounded-[2.5rem]" 
                    onClick={() => { window.location.hash = 'scan'; }}
                >
                  Start Forensic Audit Now
                </Button>
              <p className="text-[11px] font-black text-white/50 uppercase tracking-[0.5em] italic">No credit card required for initial scan</p>
            </div>
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen font-sans bg-[#0F172A] relative selection:bg-cyan-500 selection:text-white">
      {!isDashboardView && (
        <header 
          className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 pointer-events-none
            ${isHeaderVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
          `}
        >
          <div className={`px-6 transition-all duration-700 ${isScrolled ? 'pt-6' : 'pt-10'}`}>
              <nav className={`mx-auto max-w-7xl grid grid-cols-2 lg:grid-cols-3 items-center pointer-events-auto transition-all duration-700
              ${isScrolled 
                  ? 'h-20 bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] px-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
                  : 'h-24 bg-transparent border-none px-0'}
              `}>
                  <div 
                      className="flex items-center gap-4 cursor-pointer group" 
                      onClick={() => { window.location.hash = ''; }}
                  >
                      <div className="relative">
                          <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                          <BrandLogo size={isScrolled ? "sm" : "md"} className="relative z-10" />
                      </div>
                      <div className="flex flex-col">
                          <span className={`font-black tracking-tighter text-white uppercase italic leading-none transition-all
                              ${isScrolled ? 'text-xl' : 'text-2xl md:text-3xl'}
                          `}>
                              Pocket<span className="text-cyan-400">proof</span>
                          </span>
                      </div>
                  </div>

                  <div className="hidden lg:flex justify-center">
                      <Button 
                          onClick={() => { window.location.hash = 'scan'; }} 
                          variant="teal"
                          glow
                          className={`font-black italic uppercase transition-all duration-700 rounded-full ${isScrolled ? 'h-12 px-10 text-[10px]' : 'h-14 px-12 text-[11px] shadow-[0_0_30px_rgba(6,182,212,0.3)]'}`}
                      >
                          Audit Bill Now
                      </Button>
                  </div>

                  <div className="flex justify-end">
                      <button 
                          className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 border border-white/10 text-white transition-all hover:bg-white/10 shadow-xl relative z-[210]
                          ${isScrolled ? 'scale-90' : 'scale-100'}
                          `} 
                          onClick={(e) => {
                              e.preventDefault();
                              setIsMobileMenuOpen(!isMobileMenuOpen);
                          }}
                      >
                          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                      </button>
                  </div>
              </nav>
          </div>
        </header>
      )}

      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 z-[200] bg-slate-950/98 backdrop-blur-3xl flex flex-col items-center justify-center p-12 animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
        >
            <div className="relative z-10 flex flex-col items-center gap-10 text-center w-full max-w-4xl" onClick={e => e.stopPropagation()}>
                <BrandLogo size="lg" glow className="mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    {[
                      { label: "My Secure Vault", href: "dashboard", desc: "Access history", icon: Lock },
                      { label: "Clinical Network", href: "advocates", desc: "For experts", icon: Users },
                      { label: "Compliance Hub", href: "compliance", desc: "Regulatory data", icon: ShieldCheck },
                      { label: "Support Node", href: "support", desc: "Need assistance?", icon: HelpCircle }
                    ].map((item, i) => (
                      <button 
                        key={i}
                        className="animate-slide-up group bg-slate-900/50 border border-white/5 p-10 rounded-[2.5rem] hover:bg-white transition-all text-left flex gap-6 items-start shadow-2xl"
                        onClick={() => { if(item.href) window.location.hash = item.href; setIsMobileMenuOpen(false); }}
                      >
                        <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-slate-100 transition-colors">
                           {item.icon && <item.icon className="text-cyan-500 group-hover:text-slate-950" size={24} />}
                        </div>
                        <div>
                            <span className="text-2xl font-black italic uppercase tracking-tighter text-white group-hover:text-slate-950 transition-colors block mb-2">{item.label}</span>
                            <p className="text-slate-400 group-hover:text-slate-600 text-sm italic font-medium leading-relaxed">{item.desc}</p>
                        </div>
                      </button>
                    ))}
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="mt-16 p-6 rounded-full bg-white/5 text-slate-500 hover:text-white transition-all"><X size={32} /></button>
            </div>
        </div>
      )}
      
      <main className="min-h-screen">
        {view === AppView.LANDING ? <LandingPage /> : 
         view === AppView.UPLOAD ? <UploadSection onComplete={handleAnalysisComplete} /> : 
         view === AppView.RESULTS && analysisResult ? <ResultsDashboard result={analysisResult} onUpgrade={() => {}} /> :
         view === AppView.PATIENT_LOGIN ? <PatientLogin onLogin={() => { window.location.hash = 'dashboard/portal'; }} /> :
         view === AppView.PATIENT_DASHBOARD ? <PatientDashboard onScanNew={() => { window.location.hash = 'scan'; }} onViewBill={handleViewHistoricalBill} /> :
         view === AppView.ADVOCATE_LANDING ? <AdvocateLanding onLogin={() => { window.location.hash = 'advocates/login'; }} /> :
         view === AppView.ADVOCATE_LOGIN ? <AdvocateLogin onLogin={() => { window.location.hash = 'advocates/portal'; }} /> :
         view === AppView.ADVOCATE_DASHBOARD ? <AdvocateDashboard /> : 
         view === AppView.COMPLIANCE ? <CompliancePage /> :
         view === AppView.SUPPORT ? <SupportPage /> :
         view === AppView.ADMIN_DASHBOARD ? <AdminDashboard /> : null}
      </main>

      <footer className="bg-[#0F172A] pt-40 pb-20 border-t border-white/10 px-8 text-center">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 mb-24">
             <div className="flex flex-col items-center md:items-start gap-4">
                <div className="flex items-center gap-4">
                    <BrandLogo size="md" />
                    <span className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">Pocket<span className="text-cyan-400">proof</span></span>
                </div>
                <p className="text-slate-500 text-sm italic font-medium max-w-xs text-center md:text-left">The clinical-grade operating system for medical bill verification.</p>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-16 text-left">
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-white uppercase tracking-widest italic">Platform</h4>
                   <ul className="space-y-2 text-sm text-slate-500 italic">
                      <li className="hover:text-cyan-400 cursor-pointer" onClick={() => window.location.hash = 'scan'}>Patient Audit</li>
                      <li className="hover:text-cyan-400 cursor-pointer" onClick={() => window.location.hash = 'advocates'}>Advocate Portal</li>
                      <li className="hover:text-cyan-400 cursor-pointer" onClick={() => window.location.hash = 'admin'}>Admin Console</li>
                   </ul>
                </div>
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-white uppercase tracking-widest italic">Compliance</h4>
                   <ul className="space-y-2 text-sm text-slate-500 italic">
                      <li className="hover:text-cyan-400 cursor-pointer" onClick={() => window.location.hash = 'compliance'}>HIPAA Safety</li>
                      <li className="hover:text-cyan-400 cursor-pointer" onClick={() => window.location.hash = 'compliance'}>SOC-2 Verified</li>
                      <li className="hover:text-cyan-400 cursor-pointer" onClick={() => window.location.hash = 'compliance'}>Privacy</li>
                   </ul>
                </div>
                <div className="space-y-4 hidden md:block">
                   <h4 className="text-[10px] font-black text-white uppercase tracking-widest italic">Support</h4>
                   <ul className="space-y-2 text-sm text-slate-500 italic">
                      <li className="hover:text-cyan-400 cursor-pointer" onClick={() => window.location.hash = 'support'}>Case Tracking</li>
                      <li className="hover:text-cyan-400 cursor-pointer" onClick={() => window.location.hash = 'support'}>Expert Help</li>
                      <li className="hover:text-cyan-400 cursor-pointer" onClick={() => window.location.hash = 'support'}>API Access</li>
                   </ul>
                </div>
             </div>
          </div>
          <LegalDisclaimer />
      </footer>
    </div>
  );
};

export default App;
