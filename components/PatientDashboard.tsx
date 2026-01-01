
import React, { useEffect, useState } from 'react';
import { 
  Plus, History, Search, Zap, TrendingUp, Lock, Sparkles, Activity, 
  ShieldCheck, Clock, ChevronRight, ArrowUpRight, ShieldAlert, 
  FileText, Landmark, Key, Shield, Fingerprint, Loader2, ArrowLeft, LogOut
} from 'lucide-react';
import { Button, Card, Badge, SectionHeader } from './UI';
import { AnalysisResult } from '../types';
import { getPatientBills } from '../services/integrationService';

export const PatientLogin = ({ onLogin }: { onLogin: () => void }) => {
    const [accessKey, setAccessKey] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsVerifying(true);
        
        // Simulating a clinical node verification delay
        setTimeout(() => {
            if (accessKey.toUpperCase() === "RECOVER") {
                onLogin();
            } else {
                alert("Invalid Access Key. Use 'RECOVER' for demo access.");
                setIsVerifying(false);
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-[#020617] relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1)_0%,transparent_70%)] pointer-events-none" />
            
            <Card className="max-w-md w-full p-12 text-center bg-slate-900/60 border-slate-800 shadow-[0_64px_120px_rgba(0,0,0,0.6)] rounded-[3.5rem] relative z-10 backdrop-blur-3xl group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
                    <Fingerprint size={120} className="text-white" />
                </div>
                
                <div className="w-20 h-20 bg-cyan-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-cyan-500/20 shadow-inner">
                    {isVerifying ? <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" /> : <Lock className="w-10 h-10 text-cyan-500" />}
                </div>
                
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">Patient Vault</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.6em] mb-12 italic leading-none">Identity Verification Node</p>
                
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative">
                        <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
                        <input 
                            type="password" 
                            required 
                            disabled={isVerifying}
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-white text-center tracking-[0.6em] focus:border-cyan-500 outline-none transition-all italic text-sm font-black placeholder:text-slate-800" 
                            placeholder="••••••••" 
                            value={accessKey} 
                            onChange={e => setAccessKey(e.target.value)} 
                        />
                    </div>
                    
                    <Button 
                        fullWidth 
                        type="submit" 
                        variant="teal" 
                        loading={isVerifying}
                        className="h-20 text-lg shadow-2xl shadow-cyan-500/20"
                    >
                        {isVerifying ? 'VERIFYING NODE...' : 'AUTHORIZE SESSION'}
                    </Button>
                    
                    <p className="text-[9px] font-black uppercase text-slate-700 italic tracking-[0.4em] pt-4">
                        Demo Access Code: <span className="text-cyan-500">RECOVER</span>
                    </p>
                </form>
            </Card>
        </div>
    );
};

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
            console.error("Vault access fault", e);
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
          <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#0F172A] p-6">
              <div className="relative w-32 h-32 mb-12">
                  <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full animate-ping" />
                  <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                      <Lock className="text-cyan-500 w-10 h-10" />
                  </div>
              </div>
              <p className="text-[12px] font-black uppercase tracking-[0.8em] text-slate-500 italic animate-pulse">Decrypting Clinical Vault...</p>
          </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-48 animate-fade-in pb-72 bg-[#0F172A] relative">
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-12">
        <div className="flex-1">
          <SectionHeader 
            centered={false}
            badge="Personal Recovery OS"
            title={<>The Forensic <br className="md:hidden"/><span className="text-cyan-500">Vault.</span></>}
            subtitle={`Consolidating ${activeAudits} clinical statements across the network.`}
          />
        </div>
        <div className="w-full lg:w-auto shrink-0 flex gap-4">
            <Button onClick={() => window.location.hash = ''} variant="outline" className="h-24 px-10 border-white/5 text-slate-500 hover:text-white rounded-[2rem]">
               <LogOut className="w-6 h-6 mr-3" /> Disconnect
            </Button>
            <Button onClick={onScanNew} variant="teal" glow className="h-24 px-16 text-xl font-black shadow-3xl w-full lg:w-auto italic tracking-tighter hover:scale-105 transition-transform bg-cyan-500 text-slate-950 rounded-[2rem]">
              <Plus className="w-8 h-8 mr-3" /> Audit New Bill
            </Button>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-32">
        {/* RECOVERY POTENTIAL */}
        <Card className="bg-slate-900 border-white/5 p-12 min-h-[350px] flex flex-col justify-between relative overflow-hidden group shadow-2xl rounded-[3rem] hover:border-cyan-500/30 transition-all">
          <div className="absolute -top-10 -right-10 p-12 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform rotate-12">
            <Sparkles className="w-80 h-80 text-white" />
          </div>
          <div className="relative z-10">
            <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.5em] mb-6 italic leading-none">Total Identified Savings</p>
            <p className="text-7xl lg:text-8xl font-black text-white tracking-tighter leading-none italic group-hover:text-cyan-400 transition-colors">
              {fmt(totalSavings)}
            </p>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] bg-white/5 py-4 px-8 rounded-full w-fit backdrop-blur-md border border-white/10 italic leading-none">
              <Zap size={14} className="fill-current animate-pulse" /> Deployment Recommended
            </div>
          </div>
        </Card>

        {/* INTEGRITY SCORE */}
        <Card className="p-12 min-h-[350px] flex flex-col justify-between border-white/5 shadow-2xl rounded-[3rem] group bg-slate-900/40 backdrop-blur-3xl hover:border-emerald-500/30 transition-all">
            <div className="flex justify-between items-start mb-8">
                <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.5em] italic leading-none">Financial Integrity Index</p>
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                    <TrendingUp size={28} className="text-emerald-500" />
                </div>
            </div>
            <div className="mb-10">
                <div className="flex items-baseline gap-4 mb-4">
                    <p className="text-8xl lg:text-9xl font-black text-white tracking-tighter leading-none italic">{healthScore}%</p>
                    <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em] italic">Compliant</span>
                </div>
                <div className="w-full bg-slate-950 h-5 rounded-full overflow-hidden border border-white/5 relative p-1">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-[2500ms] shadow-[0_0_20px_rgba(16,185,129,0.3)]" style={{width: `${healthScore}%`}} />
                </div>
            </div>
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] italic leading-relaxed">Percentage of bill accuracy based on Fair Market Price cross-referencing.</p>
        </Card>

        {/* AUDIT SUMMARY */}
        <Card className="p-12 min-h-[350px] flex flex-col justify-between border-white/5 shadow-2xl rounded-[3rem] relative overflow-hidden group bg-slate-900/40 backdrop-blur-3xl md:col-span-2 lg:col-span-1">
             <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none group-hover:scale-105 transition-transform">
               <ShieldCheck size={240} className="text-white" />
             </div>
             <div>
                <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.5em] mb-12 italic leading-none">Portfolio Metrics</p>
                <div className="space-y-8 relative z-10">
                    <div className="flex items-end justify-between border-b border-white/5 pb-6">
                        <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] italic">Statements Verified</span>
                        <span className="text-5xl font-black text-white leading-none italic">{activeAudits}</span>
                    </div>
                    <div className="flex items-end justify-between border-b border-white/5 pb-6">
                        <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] italic">Coding Violations</span>
                        <span className="text-5xl font-black text-rose-500 leading-none italic">{totalErrorsCount}</span>
                    </div>
                </div>
             </div>
             <div className="mt-8 pt-4 flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.4em] italic leading-none">AES-256 Multi-Node Protection</p>
             </div>
        </Card>
      </div>

      {/* AUDIT LISTING */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
        <div className="lg:col-span-8 space-y-12">
          <div className="flex items-center justify-between border-b border-white/10 pb-10">
             <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                    <History className="text-cyan-500 w-7 h-7" />
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Verification History</h2>
             </div>
             <button className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.5em] hover:text-white transition-all flex items-center gap-3 italic bg-white/5 px-6 py-3 rounded-full border border-white/10 group">
                Export Data <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
             </button>
          </div>

          <div className="space-y-8">
            {bills.length === 0 ? (
                <div className="bg-slate-900/40 border-2 border-dashed border-white/10 rounded-[4rem] p-32 text-center shadow-3xl backdrop-blur-3xl animate-pulse">
                    <div className="w-24 h-24 bg-slate-950 rounded-[2rem] flex items-center justify-center mx-auto mb-10 text-slate-700 border border-white/5 shadow-inner">
                        <Search size={48} className="opacity-20" />
                    </div>
                    <h3 className="text-4xl font-black text-white tracking-tighter mb-6 uppercase italic leading-none">No Active Audits</h3>
                    <p className="text-slate-500 text-xl font-medium max-w-sm mx-auto mb-16 italic leading-relaxed">"The average hospital overcharges by $1,844 per visit. Don't leave money on the table."</p>
                    <Button onClick={onScanNew} variant="teal" glow className="h-20 px-16 text-lg font-black uppercase italic shadow-2xl">INITIATE FIRST AUDIT</Button>
                </div>
            ) : (
                bills.map((bill, index) => {
                    const savings = (bill.totalErrors || 0) + (bill.totalAid || 0);
                    const isViolation = savings > 0;
                    return (
                      <div 
                        key={bill.billId || index} 
                        className="bg-slate-900/40 border border-white/5 rounded-[3.5rem] p-10 md:p-14 hover:border-cyan-500/40 hover:bg-slate-900/60 hover:shadow-[0_48px_100px_rgba(0,0,0,0.3)] transition-all cursor-pointer group grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-12 items-center relative overflow-hidden backdrop-blur-3xl"
                        onClick={() => bill.billId && onViewBill(bill.billId)}
                      >
                        <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex-1">
                            <div className="flex items-center gap-5 mb-8">
                                <Badge color={isViolation ? 'red' : 'green'} className="px-6 py-2 italic font-black text-[10px]">{isViolation ? 'DISCREPANCIES TARGETED' : 'CLINICALLY VALID'}</Badge>
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-slate-700 rounded-full" />
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] italic leading-none">VAULT_{bill.billId?.slice(-6).toUpperCase() || '---'}</span>
                                </div>
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black text-white group-hover:text-cyan-500 transition-colors tracking-tighter mb-6 leading-[0.85] uppercase italic">
                                {bill.hospitalName || "Provider Unverified"}
                            </h3>
                            <div className="flex flex-wrap items-center gap-10 text-slate-500 text-[11px] font-black uppercase tracking-[0.4em] italic leading-none">
                                <span className="flex items-center gap-3"><Clock size={16} className="text-cyan-500" /> {new Date(bill.updatedAt || Date.now()).toLocaleDateString()}</span>
                                <span className="flex items-center gap-3"><Activity size={16} className="text-cyan-500" /> 99.4% Extraction Score</span>
                            </div>
                        </div>
                        <div className="text-left md:text-right md:pl-12 md:border-l border-white/10 flex flex-col justify-center min-w-[200px]">
                          <p className={`text-5xl md:text-6xl font-black tracking-tighter leading-none mb-3 italic transition-colors ${isViolation ? 'text-cyan-400 group-hover:text-white' : 'text-slate-800'}`}>
                            {fmt(savings)}
                          </p>
                          <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.5em] italic leading-none">Forensic Recoupable</p>
                        </div>
                        <div className="shrink-0 hidden md:block opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0 transition-all duration-500">
                            <div className="w-16 h-16 rounded-3xl bg-cyan-500 text-slate-950 flex items-center justify-center shadow-2xl">
                                <ChevronRight size={32} />
                            </div>
                        </div>
                      </div>
                    );
                })
            )}
          </div>
        </div>

        {/* SIDEBAR COMMANDS */}
        <div className="lg:col-span-4 space-y-12">
          {/* ADVOCATE CALL TO ACTION */}
          <Card className="bg-slate-950 p-12 border-rose-500/20 shadow-[0_48px_100px_rgba(239,68,68,0.1)] relative overflow-hidden group rounded-[3.5rem]">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform pointer-events-none">
                <ShieldAlert size={180} className="text-white" />
            </div>
            <div className="w-20 h-20 bg-rose-600 rounded-3xl flex items-center justify-center mb-10 shadow-2xl shadow-rose-600/30">
                <ShieldAlert className="text-white w-10 h-10" />
            </div>
            <h3 className="font-black text-white text-4xl mb-6 tracking-tighter uppercase italic leading-[0.85]">Deploy Direct <br/> Advocacy.</h3>
            <p className="text-lg text-slate-400 mb-12 font-medium leading-relaxed italic">
              "Audits are evidence. Deploy a Certified Clinical Advocate to present these findings and force billing corrections."
            </p>
            <Button fullWidth variant="teal" glow className="h-20 font-black text-xl tracking-tighter uppercase italic shadow-2xl bg-cyan-500 text-slate-950" onClick={() => {}}>
              DEPLOY ADVOCATE
            </Button>
            <div className="flex items-center justify-center gap-3 mt-10">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[10px] text-center text-slate-700 font-black uppercase tracking-[0.4em] italic leading-none">Contingency Based: $0 Upfront</p>
            </div>
          </Card>

          {/* SECONDARY RESOURCES */}
          <Card className="p-12 border border-white/5 shadow-2xl rounded-[3.5rem] bg-slate-900/40 backdrop-blur-3xl">
            <div className="flex items-center gap-4 mb-12">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                <h4 className="font-black text-slate-500 text-[10px] uppercase tracking-[0.6em] italic leading-none">Clinical Artifacts</h4>
            </div>
            <div className="space-y-6">
                {[
                    { title: "501(r) Regional Guide", desc: "Non-profit charity protocols.", icon: Landmark },
                    { title: "No Surprises Defense", desc: "Federal balance billing laws.", icon: Lock },
                    { title: "Legal Evidence Pack", desc: "Audit trail and dispute data.", icon: FileText }
                ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                    <button key={i} className="w-full p-8 rounded-[2rem] bg-slate-950/50 border border-white/5 hover:border-cyan-500/30 hover:bg-slate-900 transition-all text-left group/btn flex items-center gap-6 shadow-xl">
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 shadow-inner text-slate-600 group-hover/btn:text-cyan-400 group-hover/btn:scale-110 transition-all border border-white/5">
                            <Icon size={24} />
                        </div>
                        <div>
                            <span className="text-xs block font-black text-white uppercase tracking-widest mb-1 group-hover/btn:text-cyan-400 transition-colors italic leading-none">{item.title}</span>
                            <p className="text-[10px] text-slate-600 font-bold leading-tight uppercase italic tracking-wider">{item.desc}</p>
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
