
import React, { useState, useEffect } from 'react';
import { Terminal, TrendingUp, Shield, FileCheck, Zap, ArrowRight, CheckCircle, Lock, BarChart3, Users, DollarSign, Activity, Star, Rocket, ShieldCheck, AlertOctagon } from 'lucide-react';
import { Button, Card, Badge } from './UI';

// --- 1. LIVE OPPORTUNITY TERMINAL ---
const LiveOpportunityTerminal = () => {
  const [cases, setCases] = useState([
    { time: 'Just now', type: 'Oncology Audit', value: '$42,500', status: 'NEW' },
    { time: '2m ago', type: 'ER Dispute', value: '$8,200', status: 'CLAIMED' },
    { time: '5m ago', type: 'Surgery Review', value: '$125,000', status: 'NEW' },
    { time: '8m ago', type: 'ICU Stay', value: '$68,000', status: 'CLAIMED' },
    { time: '12m ago', type: 'Lab Coding', value: '$3,400', status: 'NEW' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newCase = {
        time: 'Just now',
        type: ['NICU Stay', 'Cardiology', 'Ortho Surgery', 'Emergency', 'Radiology'][Math.floor(Math.random() * 5)],
        value: `$${(Math.floor(Math.random() * 80) + 5).toLocaleString()},000`,
        status: 'NEW'
      };
      setCases(prev => [newCase, ...prev.slice(0, 4)]);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-[0_48px_100px_rgba(0,0,0,0.4)] animate-slide-up">
      {/* Terminal Header */}
      <div className="bg-slate-800 px-6 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>
          <span className="ml-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">forensic_live_feed.sh</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
            <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest italic leading-none">NODE_ACTIVE</span>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-6 font-mono text-sm h-72 overflow-hidden relative">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none z-10" />
        <div className="space-y-4">
          {cases.map((c, i) => (
            <div key={i} className={`flex items-center justify-between border-b border-white/5 pb-3 transition-all duration-1000 ${i === 0 ? 'text-white translate-x-0 opacity-100 scale-100' : 'text-slate-500 opacity-60 scale-95 origin-top'}`}>
              <div className="flex gap-6 items-center">
                <span className="text-[10px] font-black text-slate-700 w-16 italic">{c.time}</span>
                <span className={`uppercase italic tracking-tight font-black ${i === 0 ? 'text-cyan-400' : ''}`}>{c.type}</span>
              </div>
              <div className="flex gap-6 items-center">
                <span className={`font-black italic ${i === 0 ? 'text-emerald-400 shadow-emerald-400/20 drop-shadow-sm' : ''}`}>{c.value}</span>
                <Badge color={c.status === 'NEW' ? 'red' : 'navy'} className="px-3 py-0.5 text-[8px]">{c.status}</Badge>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-rose-500 animate-pulse">
            {/* Fixed: AlertOctagon is now imported from lucide-react */}
            <AlertOctagon size={12} />
            <span className="text-[9px] font-black uppercase tracking-[0.5em] italic">Last Error Detected: $12,840 (Cedar Sinai)</span>
        </div>
      </div>
    </div>
  );
};

// --- 2. VALUE BENTO GRID ---
const ValueBento = () => {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-24">
        <Badge color="teal" className="mb-8 px-6 py-2 italic font-black text-[11px] uppercase tracking-widest leading-none">Advocate OS 2026</Badge>
        <h2 className="text-5xl md:text-7xl font-black mb-8 italic uppercase tracking-tighter leading-[0.85]">The OS for <br/><span className="text-cyan-400">Modern Advocacy.</span></h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-xl italic font-medium leading-relaxed">
          Stop chasing leads and manual coding. We provide the forensic auditing, the clinical verification, and the pre-vetted cases. You provide the negotiation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Large Card: AI Analysis */}
        <div className="md:col-span-2 bg-[#0F172A] border border-white/10 rounded-[3rem] p-12 hover:bg-slate-900 transition-all group overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] -mr-20 -mt-20 group-hover:bg-cyan-500/10 transition-all" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
                <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                <Zap className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 uppercase italic tracking-tighter">Instant Clinical Audits</h3>
                <p className="text-slate-400 text-lg italic leading-relaxed max-w-lg">
                Upload a 50-page clinical statement and get a line-by-line violation report in 45 seconds. Powered by Gemini 3 Pro reasoning.
                </p>
            </div>
            <div className="mt-12 flex flex-wrap gap-4">
                <div className="px-5 py-2 bg-slate-950 rounded-xl text-[10px] font-black italic uppercase tracking-[0.3em] text-rose-500 border border-rose-500/20">Upcoding Detected (99285)</div>
                <div className="px-5 py-2 bg-slate-950 rounded-xl text-[10px] font-black italic uppercase tracking-[0.3em] text-emerald-400 border border-emerald-500/20">Recoup Sum: $2,840.00</div>
            </div>
          </div>
        </div>

        {/* Card: ROI */}
        <div className="bg-slate-900/50 border border-white/10 rounded-[3rem] p-12 hover:border-emerald-500/20 transition-all group flex flex-col justify-between shadow-2xl">
            <div>
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                <TrendingUp className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 uppercase italic tracking-tighter">150% ROI Lift</h3>
                <p className="text-slate-400 text-lg italic leading-relaxed">
                Partners average $15k/mo in additional revenue by automating intake and initial auditing.
                </p>
            </div>
            
            <div className="flex items-end gap-3 h-32 mt-12 border-b border-white/5 pb-3">
                <div className="w-1/4 bg-slate-800 h-[40%] rounded-lg" />
                <div className="w-1/4 bg-slate-700 h-[60%] rounded-lg" />
                <div className="w-1/4 bg-emerald-900 h-[80%] rounded-lg" />
                <div className="w-1/4 bg-emerald-500 h-full rounded-lg shadow-[0_0_30px_rgba(16,185,129,0.3)]" />
            </div>
        </div>

        {/* Card: Docs */}
        <div className="bg-slate-900/50 border border-white/10 rounded-[3rem] p-12 hover:border-teal-500/20 transition-all flex flex-col justify-between h-auto shadow-2xl group">
             <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <FileCheck className="w-8 h-8 text-purple-400" />
            </div>
            <div>
                <h3 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">1-Click Appeals</h3>
                <p className="text-slate-400 text-base italic leading-relaxed">
                Generate rigorous dispute letters citing specific federal coding guidelines automatically.
                </p>
            </div>
        </div>

        {/* Card: Leads */}
        <div className="bg-slate-900/50 border border-white/10 rounded-[3rem] p-12 hover:border-rose-500/20 transition-all flex flex-col justify-between h-auto shadow-2xl group">
             <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Rocket className="w-8 h-8 text-rose-500" />
            </div>
            <div>
                <h3 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">Zero-Cost Leads</h3>
                <p className="text-slate-400 text-base italic leading-relaxed">
                Stop chasing clients. We send pre-audited, high-value cases directly to your practitioner inbox.
                </p>
            </div>
        </div>

        {/* Card: Security */}
        <div className="bg-[#0F172A] border border-white/10 rounded-[3rem] p-12 hover:border-white/20 transition-all flex flex-col justify-between h-auto shadow-2xl group">
             <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
                <h3 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">HIPAA Vault</h3>
                <p className="text-slate-400 text-base italic leading-relaxed">
                Bank-grade encryption. SOC-2 compliant pipeline. BAA included for all enterprise partners.
                </p>
            </div>
        </div>
      </div>
    </section>
  );
};

// --- 3. SOCIAL PROOF (WALL OF LOVE) ---
const AdvocateStories = () => {
    const stories = [
        { name: "Sarah J.", role: "Independent Advocate", growth: "+$8,400/mo", quote: "I was burned out from hospital paperwork. Now I close 12 cases a week from my laptop. $40k recoveries last month.", initial: "S" },
        { name: "MediHelp Group", role: "Agency (5 Staff)", growth: "2.4x Volume", quote: "The AI catches errors our senior auditors miss. It's like having a clinical coder on staff 24/7. Game changer.", initial: "M" },
        { name: "Dr. Mark T.", role: "Consultant", growth: "92% Success", quote: "The accuracy of the CPT matching is terrifyingly good. Hospitals don't stand a chance. ROI is instant.", initial: "T" }
    ];

    return (
        <section className="py-32 bg-slate-900/40 border-y border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(6,182,212,0.05)_0%,transparent_50%)]" />
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8 text-center md:text-left">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none mb-4">Trusted by Top <br/><span className="text-cyan-400">1% Advocates.</span></h2>
                        <p className="text-slate-500 font-medium italic">Verified practitioner results • Clinical grade auditing</p>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-6">
                         <div className="flex -space-x-4">
                            {[1,2,3,4,5].map(i => (
                                <div key={i} className="w-14 h-14 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center text-xs font-black text-white italic shadow-lg">
                                    {String.fromCharCode(64+i)}
                                </div>
                            ))}
                        </div>
                        <div className="text-center md:text-right">
                            <span className="text-white font-black text-lg uppercase italic tracking-tighter block leading-none mb-2">500+ Active Partners</span>
                            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] italic">Risk-Free Pilot Available</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stories.map((s, i) => (
                        <div key={i} className="bg-slate-950 p-10 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all duration-500 flex flex-col justify-between shadow-3xl hover:-translate-y-2 group">
                            <div className="mb-8">
                                <div className="flex items-center gap-1 mb-6">
                                    {[1,2,3,4,5].map(star => <Star key={star} size={14} className="text-amber-500 fill-amber-500" />)}
                                </div>
                                <p className="text-slate-300 text-lg italic leading-relaxed font-medium">"{s.quote}"</p>
                            </div>
                            <div className="flex justify-between items-end border-t border-white/5 pt-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center font-black text-white italic shadow-inner group-hover:bg-cyan-600 transition-colors">{s.initial}</div>
                                    <div>
                                        <h4 className="font-black text-white uppercase italic tracking-tight">{s.name}</h4>
                                        <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{s.role}</p>
                                    </div>
                                </div>
                                <Badge color="green" className="bg-emerald-500/10 border-none text-emerald-400 font-black italic">{s.growth}</Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- MAIN PAGE COMPONENT ---
export const AdvocateLanding = ({ onLogin }: { onLogin: () => void }) => {
    
    const handleApply = () => {
        const APPLY_LINK = "https://calendly.com/"; 
        window.open(APPLY_LINK, '_blank');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
            
            {/* HERO SECTION */}
            <section className="relative pt-48 pb-24 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1)_0%,transparent_70%)] -z-10" />

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <Badge color="red" className="mb-8 px-6 py-2 italic font-black text-[11px] animate-pulse">Waitlist Open: Joining 50 New Advocates Weekly</Badge>
                    <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter mb-8 leading-[0.85] uppercase italic text-white">
                        Scale Your Practice <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">On Autopilot.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto italic font-medium leading-relaxed">
                        From 15% closes to 60% — without the manual grind. Get clinical-grade audits and pre-vetted cases delivered to your practitioner vault.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                        <Button onClick={handleApply} glow className="h-28 px-14 text-2xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all italic uppercase tracking-tighter">
                            Start My Pilot Pilot
                        </Button>
                        <Button variant="ghost" onClick={onLogin} className="h-20 px-10 text-lg font-black text-slate-400 hover:text-white uppercase italic tracking-widest">
                            Practitioner Login
                        </Button>
                    </div>

                    <div className="mt-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] italic animate-pulse">
                        Risk-Free Pilot: Get 10 Pre-Audited Leads Today
                    </div>

                    <LiveOpportunityTerminal />
                </div>
            </section>

            {/* TRUST TICKER */}
            <div className="bg-slate-900/80 backdrop-blur-3xl border-y border-white/5 py-6 overflow-hidden">
                <div className="flex items-center gap-16 animate-marquee whitespace-nowrap opacity-40 max-w-7xl mx-auto px-6">
                    <span className="flex items-center gap-3 font-black uppercase italic tracking-[0.4em] text-sm"><Lock className="w-5 h-5 text-cyan-400" /> SOC-2 COMPLIANT</span>
                    <span className="flex items-center gap-3 font-black uppercase italic tracking-[0.4em] text-sm"><CheckCircle className="w-5 h-5 text-emerald-400" /> 94% AUDIT ACCURACY</span>
                    <span className="flex items-center gap-3 font-black uppercase italic tracking-[0.4em] text-sm"><Activity className="w-5 h-5 text-rose-500" /> $12M+ RECOVERED</span>
                    <span className="flex items-center gap-3 font-black uppercase italic tracking-[0.4em] text-sm"><Users className="w-5 h-5 text-teal-400" /> 500+ ACTIVE PARTNERS</span>
                    <span className="flex items-center gap-3 font-black uppercase italic tracking-[0.4em] text-sm"><Lock className="w-5 h-5 text-cyan-400" /> SOC-2 COMPLIANT</span>
                    <span className="flex items-center gap-3 font-black uppercase italic tracking-[0.4em] text-sm"><CheckCircle className="w-5 h-5 text-emerald-400" /> 94% AUDIT ACCURACY</span>
                </div>
            </div>

            <ValueBento />
            
            <AdvocateStories />

            {/* FINAL CTA SECTION */}
            <section className="py-48 px-6 text-center relative overflow-hidden bg-slate-950">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.1)_0%,transparent_60%)] pointer-events-none" />
                <div className="max-w-4xl mx-auto relative z-10 space-y-12">
                    <h2 className="text-5xl md:text-8xl font-black mb-8 uppercase italic tracking-tighter leading-[0.85]">Ready to Maximize <br/><span className="text-cyan-400">Billable Hours?</span></h2>
                    <p className="text-slate-400 text-xl md:text-2xl italic font-medium leading-relaxed max-w-2xl mx-auto">
                        Stop formatting PDFs and start winning. We onboarding 50 practitioners per week to maintain marketplace quality.
                    </p>
                    <div className="pt-10 flex flex-col items-center gap-8">
                        <Button onClick={handleApply} glow className="h-28 px-16 text-2xl font-black shadow-2xl hover:scale-105 transition-all italic uppercase tracking-tighter">
                            Get 10 Free Leads Pilot <ArrowRight className="ml-3 w-8 h-8" />
                        </Button>
                        <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.8em] italic">No credit card required for initial pilot program.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};
