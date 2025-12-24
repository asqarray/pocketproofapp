
import React, { useEffect, useState } from 'react';
import { Plus, FileText, ShieldCheck, ChevronRight, Loader2, Zap, History, Target, HelpCircle, CheckCircle, TrendingUp, Clock, CreditCard, ArrowUpRight, Landmark, Lock } from 'lucide-react';
import { Button, Card, Badge, SectionHeader } from './UI';
import { AnalysisResult } from '../types';
import { getPatientBills } from '../services/integrationService';

export const PatientDashboard = ({ 
  onScanNew, 
  onViewBill 
}: { 
  onScanNew: () => void;
  onViewBill: (billId: string) => void;
}) => {
  const [bills, setBills] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
        try {
            const data = await getPatientBills();
            setBills(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error("Failed to load bills", e);
            setBills([]);
        } finally {
            setLoading(false);
        }
    };
    fetchBills();
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  const totalSavings = bills.reduce((acc, b) => acc + (b.totalErrors || 0) + (b.totalAid || 0), 0);
  const totalBillValue = bills.reduce((acc, b) => acc + (b.totalBill || 0), 0);
  const totalErrorsCount = bills.reduce((acc, b) => acc + (b.errors?.length || 0), 0);
  const activeAudits = bills.length;
  
  const healthScore = totalBillValue > 0 ? Math.round(((totalBillValue - totalSavings) / totalBillValue) * 100) : 100;

  if (loading) {
      return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center bg-brand-bg">
              <Loader2 className="w-16 h-16 text-teal-600 animate-spin mb-8" />
              <p className="text-[12px] font-black uppercase tracking-[0.6em] text-slate-300 italic animate-pulse">Decrypting Audit Vault...</p>
          </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-48 animate-fade-in pb-72 bg-brand-bg">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-12">
        <div className="flex-1">
          <SectionHeader 
            centered={false}
            badge="Clinical Portfolio"
            title={<>Recovery <br className="md:hidden"/><span className="text-teal-600">Command.</span></>}
            subtitle={`You have ${activeAudits} medical statements under forensic verification.`}
          />
        </div>
        <div className="w-full lg:w-auto">
            <Button onClick={onScanNew} variant="teal" className="h-20 md:h-24 px-12 md:px-16 text-lg md:text-xl font-black shadow-[0_30px_60px_rgba(20,184,166,0.15)] w-full lg:w-auto italic tracking-tighter hover:scale-105 transition-transform">
              <Plus className="w-6 h-6 md:w-8 md:h-8 mr-3" /> Audit Bill
            </Button>
        </div>
      </div>

      {/* ANALYTICS BENTO GRID - FIXED CRUSHING ISSUE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
        {/* CARD 1: VERIFIED SAVINGS */}
        <Card className="bg-[#0F172A] border-none p-10 md:p-12 min-h-[320px] flex flex-col justify-between relative overflow-hidden group shadow-2xl rounded-[2.5rem]">
          <div className="absolute top-[-20%] right-[-10%] p-10 opacity-5 pointer-events-none transform group-hover:scale-110 transition-transform rotate-12">
            <Target className="w-64 h-64 text-white" />
          </div>
          
          <div className="relative z-10">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] mb-4 italic">Verified Savings</p>
            <p className="text-6xl lg:text-7xl font-black text-white tracking-tighter leading-none italic break-all">
              {fmt(totalSavings)}
            </p>
          </div>

          <div className="relative z-10 mt-8">
            <div className="flex items-center gap-3 text-[9px] font-black text-teal-400 uppercase tracking-[0.3em] bg-white/5 py-3 px-6 rounded-full w-fit backdrop-blur-md border border-white/10 italic">
              <Zap size={14} className="fill-current" /> Clinical Recoup Ready
            </div>
          </div>
        </Card>

        {/* CARD 2: INTEGRITY INDEX */}
        <Card className="p-10 md:p-12 min-h-[320px] flex flex-col justify-between border-slate-100 shadow-xl rounded-[2.5rem] group bg-white">
            <div className="flex justify-between items-start">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] italic">Integrity Index</p>
                <TrendingUp size={28} className="text-emerald-500 group-hover:-translate-y-2 transition-transform" />
            </div>
            
            <div className="my-6">
                <div className="flex items-baseline gap-3">
                    <p className="text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-none italic">{healthScore}%</p>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Safe</span>
                </div>
            </div>

            <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-50 relative">
                <div className="bg-emerald-500 h-full transition-all duration-[2000ms] shadow-[0_0_20px_rgba(16,185,129,0.2)]" style={{width: `${healthScore}%`}} />
            </div>
        </Card>

        {/* CARD 3: AUDIT METRICS */}
        <Card className="p-10 md:p-12 min-h-[320px] flex flex-col justify-between border-slate-100 shadow-xl rounded-[2.5rem] relative overflow-hidden group bg-white md:col-span-2 lg:col-span-1">
             <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:scale-105 transition-transform">
               <CreditCard size={180} />
             </div>
             
             <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] mb-8 italic">Audit Metrics</p>
                <div className="space-y-6 relative z-10">
                    <div className="flex items-end justify-between border-b border-slate-50 pb-4">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">Statements</span>
                        <span className="text-3xl font-black text-slate-900 leading-none italic">{activeAudits}</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">Citations</span>
                        <span className="text-3xl font-black text-rose-600 leading-none italic">{totalErrorsCount}</span>
                    </div>
                </div>
             </div>

             <div className="mt-8 pt-4 border-t border-slate-50">
                <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.4em] italic leading-none">Continuous Monitoring Active</p>
             </div>
        </Card>
      </div>

      {/* CORE PORTFOLIO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 md:gap-24">
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between border-b border-slate-100 pb-8">
             <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4 italic">
                <History className="text-teal-600 w-8 h-8" /> Portfolio Audit Trail
             </h2>
             <button className="text-[10px] font-black text-teal-600 uppercase tracking-[0.4em] hover:text-teal-700 transition-colors flex items-center gap-2 italic">
                Export <ArrowUpRight size={14} />
             </button>
          </div>

          <div className="space-y-6">
            {bills.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-[3rem] p-24 text-center shadow-lg">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-slate-200">
                        <HelpCircle size={40} />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 uppercase italic">Vault Empty</h3>
                    <p className="text-slate-500 text-lg font-medium max-w-xs mx-auto mb-12 italic">"The hospital counts on your silence. Verify your first statement now."</p>
                    <Button onClick={onScanNew} variant="primary" className="h-16 px-12 text-sm">START VERIFICATION</Button>
                </div>
            ) : (
                bills.map((bill, index) => {
                    const savings = (bill.totalErrors || 0) + (bill.totalAid || 0);
                    const isViolation = savings > 0;

                    return (
                      <div 
                        key={bill.billId || index} 
                        className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-10 hover:border-teal-400 hover:shadow-2xl transition-all cursor-pointer group grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-8 items-center relative overflow-hidden"
                        onClick={() => bill.billId && onViewBill(bill.billId)}
                      >
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-6">
                                <Badge color={isViolation ? 'red' : 'green'} className="px-4 py-1.5 text-[9px]">{isViolation ? 'SAVINGS TARGETED' : 'CLEAR AUDIT'}</Badge>
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] italic leading-none">NODE_{bill.billId?.slice(-6).toUpperCase() || '---'}</span>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black text-slate-900 group-hover:text-teal-600 transition-colors tracking-tighter mb-4 leading-none uppercase italic">
                                {bill.hospitalName || "Unverified Facility"}
                            </h3>
                            <div className="flex flex-wrap items-center gap-8 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] italic">
                                <span className="flex items-center gap-2"><Clock size={14} className="text-teal-600" /> {new Date().toLocaleDateString()}</span>
                                <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-teal-600" /> Clinical Node Certified</span>
                            </div>
                        </div>

                        <div className="text-left md:text-right md:pl-10 md:border-l border-slate-100 flex flex-col justify-center">
                          <p className={`text-4xl md:text-5xl font-black tracking-tighter leading-none mb-2 italic ${isViolation ? 'text-teal-600' : 'text-slate-100'}`}>
                            {fmt(savings)}
                          </p>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] italic">Forensic Recoupable</p>
                        </div>

                        <div className="shrink-0 hidden md:block opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                            <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
                                <ChevronRight size={24} />
                            </div>
                        </div>
                      </div>
                    );
                })
            )}
          </div>
        </div>

        {/* SIDEBAR COMMANDS */}
        <div className="space-y-12">
          <Card className="bg-slate-950 p-10 md:p-12 border-none shadow-2xl relative overflow-hidden group rounded-[2.5rem]">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform"><ShieldCheck size={140} /></div>
            <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                <ShieldCheck className="text-white w-8 h-8" />
            </div>
            <h3 className="font-black text-white text-3xl mb-6 tracking-tighter uppercase italic leading-none">Deploy Advocate.</h3>
            <p className="text-base text-slate-400 mb-10 font-medium leading-relaxed italic">
              "Force compliance immediately. Our advocates use this audit to reclaim every dollar."
            </p>
            <Button fullWidth variant="teal" className="h-16 font-black text-lg tracking-tighter uppercase italic" onClick={() => {}}>
              DEPLOY NOW
            </Button>
            <p className="text-[9px] text-center text-slate-600 font-black uppercase tracking-[0.4em] mt-8 italic">Performance Based • No Upfront Fee</p>
          </Card>

          <Card className="p-10 md:p-12 border border-slate-100 shadow-lg rounded-[2.5rem] bg-white">
            <h4 className="font-black text-slate-300 text-[9px] uppercase tracking-[0.6em] mb-10 italic">Clinical Resources</h4>
            <div className="space-y-6">
                {[
                    { title: "501(r) Mandates", desc: "Non-profit charity guide.", icon: Landmark },
                    { title: "No Surprises Act", desc: "Federal billing laws.", icon: Lock },
                    { title: "Dispute Package", desc: "DIY Forensic tools.", icon: FileText }
                ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                    <button key={i} className="w-full p-6 rounded-2xl bg-slate-50 border border-transparent hover:border-teal-500/20 hover:bg-white transition-all text-left group/btn flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm text-slate-300 group-hover/btn:text-teal-600 transition-colors">
                            <Icon size={18} />
                        </div>
                        <div>
                            <span className="text-[10px] block font-black text-slate-900 uppercase tracking-widest mb-1 group-hover/btn:text-teal-600 transition-colors italic">{item.title}</span>
                            <p className="text-[9px] text-slate-400 font-bold leading-tight uppercase italic">{item.desc}</p>
                        </div>
                    </button>
                )})}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
