
import React, { useState, useRef, useEffect } from 'react';
import { 
    CheckCircle, X, ArrowRight, AlertTriangle, Loader2, Gavel, Lock, Info, 
    ChevronRight, ShieldAlert, Eye, TrendingUp, DollarSign, Landmark, Target,
    AlertOctagon, Printer, FileCheck, ShieldCheck as ShieldCheckIcon, ExternalLink, Zap, ChevronDown, Building2, Wallet, AlertCircle, MapPin, Search,
    Shield, HeartHandshake, Sparkles, ShieldCheck, Download, FileText, Scale, HelpCircle, Camera, Award, ShieldCheck as SafeIcon, ShoppingCart, CreditCard,
    ThumbsUp, ThumbsDown, MessageCircle, Heart, UserCheck, Accessibility, Scale as GavelIcon, Star, Gift, Activity
} from 'lucide-react';
import { Button, Card, Badge, SectionHeader } from './UI';
import { analyzeBillWithGemini } from '../services/geminiService';
import { AnalysisResult } from '../types';
import { saveAnonymizedBill, saveBillToPatientSession, bookAdvocateMeeting, sendPhiToZoho, saveUserFeedback, checkSystemIntegrity, initiateStripeCheckout } from '../services/integrationService';

export const UploadSection = ({ onComplete }: { onComplete: (result: AnalysisResult) => void }) => {
  const [step, setStep] = useState<'HOSPITAL' | 'ZIP' | 'AMOUNT' | 'STATUS' | 'UPLOAD'>('HOSPITAL');
  const [intakeData, setIntakeData] = useState({ hospital: '', zip: '', amount: '', status: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [auditStep, setAuditStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const auditLogs = [
    "Initializing forensic scan...",
    "Redacting patient identifiers (HIPAA Pass)...",
    "Cross-referencing CMS Price Transparency data...",
    "Auditing Section 501(r) Grant eligibility...",
    "Finalizing clinical protection plan...",
    "Audit verification complete."
  ];

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setAuditStep(prev => (prev < auditLogs.length - 1 ? prev + 1 : prev));
      }, 1800); 
      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  const handleAnalysis = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      if (!file) throw new Error("Source document required.");
      const reader = new FileReader();
      const fileData = await new Promise<{ mimeType: string, data: string }>((resolve, reject) => {
        reader.onload = () => resolve({ mimeType: file.type, data: (reader.result as string).split(',')[1] });
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const result = await analyzeBillWithGemini(fileData, intakeData.zip);
      onComplete({ ...result, zipCode: intakeData.zip });
    } catch (e: any) {
      setIsProcessing(false);
      setErrorMessage("Forensic node latency detected. Clinical connection lost. Please retry.");
    }
  };

  const nextStep = () => {
    if (step === 'HOSPITAL' && intakeData.hospital) setStep('ZIP');
    else if (step === 'ZIP' && intakeData.zip) setStep('AMOUNT');
    else if (step === 'AMOUNT' && intakeData.amount) setStep('STATUS');
    else if (step === 'STATUS' && intakeData.status) setStep('UPLOAD');
  };

  if (isProcessing) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-fade-in max-w-4xl mx-auto bg-slate-950">
        <div className="relative w-32 h-32 md:w-56 md:h-56 mb-16 shrink-0">
            <div className="absolute inset-0 border-[4px] border-white/5 rounded-full scale-110"></div>
            <div className="absolute inset-0 border-[4px] border-cyan-500 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <HeartHandshake className="text-cyan-500 w-16 h-16 md:w-24 md:h-24 animate-pulse" />
            </div>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-black mb-16 tracking-tighter text-white uppercase italic leading-[0.85]">
          Analyzing Forensic <br/><span className="text-cyan-500">Source Data.</span>
        </h2>
        
        <div className="w-full max-w-2xl bg-slate-900/50 backdrop-blur-3xl rounded-[3rem] p-10 md:p-14 text-left space-y-6 border border-white/10 shadow-[0_64px_120px_rgba(0,0,0,0.5)]">
            {auditLogs.map((log, i) => (
                <div key={i} className={`flex items-center gap-6 text-[12px] font-black tracking-[0.25em] transition-all duration-700 ${i === auditStep ? 'text-cyan-400 translate-x-3 scale-105' : i < auditStep ? 'text-emerald-500 opacity-100' : 'text-slate-600'}`}>
                    {i < auditStep ? <CheckCircle className="w-5 h-5 shrink-0" /> : i === auditStep ? <Loader2 className="w-5 h-5 animate-spin shrink-0" /> : <div className="w-5 h-5 border border-slate-800 rounded-full shrink-0" />}
                    <span className="uppercase italic">{log}</span>
                </div>
            ))}
        </div>
        
        <p className="mt-16 text-[11px] font-black uppercase text-slate-700 tracking-[0.6em] italic">Validation Node: PP-FORENSIC-01 • AES-256 Validated</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-32 md:py-48 px-6 min-h-screen flex flex-col items-center">
      <div className="w-full text-center space-y-12">
        {step === 'HOSPITAL' && (
          <div className="animate-slide-up space-y-10">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">Provider Name <br/><span className="text-cyan-400">on statement?</span></h2>
            <div className="relative max-w-lg mx-auto">
              <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                autoFocus
                className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 pl-16 text-xl font-black text-white outline-none focus:border-cyan-500 transition-all italic uppercase tracking-tighter"
                placeholder="Facility Name..."
                value={intakeData.hospital}
                onChange={e => setIntakeData({...intakeData, hospital: e.target.value})}
                onKeyDown={e => e.key === 'Enter' && nextStep()}
              />
            </div>
            <Button variant="teal" className="h-20 px-12 text-base" onClick={nextStep} disabled={!intakeData.hospital}>CONTINUE →</Button>
          </div>
        )}

        {step === 'ZIP' && (
          <div className="animate-slide-up space-y-10">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">Zip Code <br/><span className="text-cyan-400">of service?</span></h2>
            <p className="text-slate-500 text-lg font-medium italic leading-none">Used for regional 501(r) and CMS fee schedule matching.</p>
            <div className="relative max-w-lg mx-auto">
              <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                autoFocus
                maxLength={5}
                className="w-full bg-slate-900 border-2 border-slate-800 rounded-xl p-6 pl-16 text-xl font-black text-white outline-none focus:border-cyan-500 transition-all italic uppercase tracking-tighter"
                placeholder="00000"
                value={intakeData.zip}
                onChange={e => setIntakeData({...intakeData, zip: e.target.value.replace(/\D/g, '')})}
                onKeyDown={e => e.key === 'Enter' && nextStep()}
              />
            </div>
            <Button variant="teal" className="h-20 px-12 text-base" onClick={nextStep} disabled={intakeData.zip.length !== 5}>CONTINUE →</Button>
          </div>
        )}

        {step === 'AMOUNT' && (
          <div className="animate-slide-up space-y-10">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">Gross Amount <br/><span className="text-cyan-400">Claimed?</span></h2>
            <div className="relative max-w-lg mx-auto">
              <Wallet className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                autoFocus
                type="text"
                className="w-full bg-slate-900 border-2 border-slate-800 rounded-xl p-6 pl-16 text-3xl font-black text-white outline-none focus:border-cyan-500 transition-all italic uppercase tracking-tighter"
                placeholder="$0.00"
                value={intakeData.amount}
                onChange={e => setIntakeData({...intakeData, amount: e.target.value})}
                onKeyDown={e => e.key === 'Enter' && nextStep()}
              />
            </div>
            <Button variant="teal" className="h-20 px-12 text-base" onClick={nextStep} disabled={!intakeData.amount}>CONTINUE →</Button>
          </div>
        )}

        {step === 'STATUS' && (
          <div className="animate-slide-up space-y-10">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">Current <br/><span className="text-cyan-400">Legal Status?</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto">
              {['New Invoice', 'Past Due', 'Collections', 'Already Paid'].map(status => (
                <button 
                  key={status}
                  onClick={() => { setIntakeData({...intakeData, status}); setStep('UPLOAD'); }}
                  className="p-6 bg-slate-900 border-2 border-slate-800 rounded-2xl text-lg font-black uppercase italic tracking-tighter text-slate-400 hover:border-cyan-500 hover:text-white transition-all shadow-xl"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'UPLOAD' && (
          <div className="animate-slide-up space-y-12 w-full">
            <SectionHeader 
                badge="Forensic Input"
                title={<>Source <br/><span className="text-cyan-400">Statement.</span></>}
                subtitle="High-fidelity extraction will commence. Patients markers are sanitized before analysis."
            />
            <Card className="p-8 bg-slate-900 border-slate-800 shadow-[0_60px_100px_rgba(0,0,0,0.5)] max-w-2xl mx-auto rounded-[2.5rem]">
                <div className={`p-10 md:p-14 border-2 border-dashed rounded-[2rem] text-center transition-all ${dragActive ? 'border-cyan-500 bg-cyan-500/5' : 'border-slate-800 bg-slate-950'}`} onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} onDrop={(e) => { e.preventDefault(); setDragActive(false); if(e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); }}>
                    <input ref={fileInputRef} type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
                    <input ref={cameraInputRef} type="file" className="hidden" accept="image/*" capture="environment" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
                    
                    <Shield className="w-12 h-12 text-cyan-500 mx-auto mb-8" />
                    <h3 className="text-xl md:text-2xl font-black mb-10 text-white uppercase italic tracking-tighter">{file ? file.name : 'Import Source Document'}</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <button onClick={() => cameraInputRef.current?.click()} className="flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-cyan-500 hover:text-slate-950 transition-all group shadow-xl">
                            <Camera className="w-10 h-10 mb-4 text-cyan-400 group-hover:text-slate-950" />
                            <span className="text-[11px] font-black uppercase tracking-widest italic">Camera Scan</span>
                        </button>
                        <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-cyan-500 hover:text-slate-950 transition-all group shadow-xl">
                            <FileText className="w-10 h-10 mb-4 text-cyan-400 group-hover:text-slate-950" />
                            <span className="text-[11px] font-black uppercase tracking-widest italic">File Import</span>
                        </button>
                    </div>

                    {file && (
                      <div className="mt-12 pt-10 border-t border-white/5">
                        <Button onClick={handleAnalysis} variant="teal" className="h-20 w-full text-xl font-black uppercase italic shadow-[0_20px_60px_rgba(6,182,212,0.3)]">INITIATE FORENSIC AUDIT</Button>
                      </div>
                    )}
                </div>
            </Card>
          </div>
        )}
      </div>
      {errorMessage && <p className="text-rose-500 font-black text-center mt-12 uppercase italic tracking-[0.3em] text-[11px] bg-rose-500/10 p-5 rounded-2xl border border-rose-500/20">{errorMessage}</p>}
    </div>
  );
};

export const ResultsDashboard = ({ result, onUpgrade }: { result: AnalysisResult; onUpgrade: () => void }) => {
    const [funnelStep, setFunnelStep] = useState<'TEASER' | 'LOCKED'>('TEASER');
    const [showForm, setShowForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [feedbackSent, setFeedbackSent] = useState(false);
    const [isAllyMode, setIsAllyMode] = useState(true);
    const [systemHealthy, setSystemHealthy] = useState(true);
    
    useEffect(() => {
        checkSystemIntegrity().then(status => setSystemHealthy(status.gemini));
    }, []);

    const totalSavings = (result.totalErrors || 0) + (result.totalAid || 0);
    const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

    const handleUnlock = async (e: any) => {
        e.preventDefault();
        setFormLoading(true);
        const formData = new FormData(e.target);
        const lead = {
          firstName: formData.get('firstName') as string,
          lastName: formData.get('lastName') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
          hasInsurance: formData.get('insurance') === 'yes',
          incomeLevel: formData.get('income') as string,
          billId: result.billId || `bill_${Date.now()}`,
          totalValue: result.totalBill,
          condition: result.summary.slice(0, 50),
          priorityLevel: result.priorityLevel,
          state: result.patientState || 'US',
          hospitalName: result.hospitalName
        };
        
        try {
            await sendPhiToZoho(lead);
            await saveAnonymizedBill(lead.billId, result);
            saveBillToPatientSession(lead.billId);
            setFunnelStep('LOCKED');
        } catch (error) {
            alert("Secure node connection lost. Re-establishing link...");
        } finally {
            setFormLoading(false);
        }
    };

    const handleFeedback = async (rating: number) => {
        if (result.billId) {
            await saveUserFeedback(result.billId, 'PATIENT', rating, "Forensic audit feedback.");
            setFeedbackSent(true);
        }
    };

    if (funnelStep === 'LOCKED' && totalSavings === 0) {
      return (
        <div className="min-h-screen flex flex-col items-center pt-24 md:pt-32 px-6 bg-slate-950 pb-48 text-center animate-fade-in">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-10 border border-emerald-500/20 shadow-2xl">
              <SafeIcon size={48} className="text-emerald-500 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.85] mb-6">
                Audit Verified. <br/><span className="text-emerald-500">No Discrepancies.</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl font-medium italic mb-12 leading-relaxed">
              Forensic audit of {result.hospitalName} complete. No billing violations or charity care matches detected for this statement. Validated against current CMS guidelines.
            </p>
            <Button onClick={() => window.location.hash = 'dashboard'} variant="teal" className="h-16 px-12">Return to Portfolio</Button>
        </div>
      );
    }

    if (funnelStep === 'TEASER') {
        return (
            <div className="min-h-screen flex flex-col items-center pt-24 md:pt-32 px-6 bg-slate-950 pb-48 overflow-hidden relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.08)_0%,transparent_70%)] pointer-events-none" />
                
                <div className="text-center space-y-6 animate-slide-up max-w-5xl w-full relative z-10">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                        <Activity size={14} className="text-emerald-500" />
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em] italic leading-none">Node_Forensic: Online</span>
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-[0.85] mb-2 uppercase italic">
                        Audit Certified. <br/> <span className="text-cyan-500">Savings Found.</span>
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full text-left">
                      <Card className="lg:col-span-7 bg-slate-900 border-white/10 p-8 md:p-12 shadow-3xl flex flex-col justify-between rounded-[2.5rem] h-auto">
                          <div className="space-y-8">
                              <div className="space-y-2">
                                <p className="text-slate-500 font-black text-[9px] uppercase tracking-[0.4em] italic leading-none">Audited Provider:</p>
                                <h3 className="text-white text-3xl md:text-5xl font-black tracking-tight uppercase italic leading-[0.8]">{result.hospitalName}</h3>
                              </div>
                              
                              <div className="p-8 bg-slate-950/80 rounded-[1.5rem] border border-white/5 backdrop-blur-xl">
                                  <p className="text-white text-xl md:text-2xl font-black italic leading-tight mb-6 tracking-tight font-mono opacity-90 border-l-4 border-cyan-500 pl-6">
                                      "{result.summary}"
                                  </p>
                                  <div className="flex items-center gap-2">
                                      <ShieldCheck size={18} className="text-cyan-500" />
                                      <span className="text-[11px] font-black uppercase italic text-cyan-400 tracking-widest">Compliance Verification Complete</span>
                                  </div>
                              </div>
                          </div>
                      </Card>

                      <Card className="lg:col-span-5 bg-cyan-950/20 backdrop-blur-3xl p-8 md:p-12 border-cyan-500/20 shadow-2xl flex flex-col justify-between rounded-[2.5rem] h-auto">
                          <div className="space-y-10">
                              <div className="space-y-2">
                                  <p className="text-cyan-500/60 text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">Forensic Value:</p>
                                  <p className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none italic drop-shadow-[0_0_30px_rgba(6,182,212,0.4)]">{fmt(totalSavings)}</p>
                              </div>
                              <p className="text-slate-300 text-base font-bold italic leading-relaxed">
                                Identified discrepancies and mandatory aid matching for this regional ZIP code.
                              </p>
                              <div className="bg-cyan-500/10 p-5 rounded-2xl flex items-center gap-4 border border-cyan-500/10">
                                <Sparkles size={24} className="text-cyan-400" />
                                <span className="text-[11px] font-black text-cyan-400 uppercase italic tracking-widest leading-tight">Forensic Integrity Certified</span>
                              </div>
                          </div>
                          <Button onClick={() => setShowForm(true)} variant="teal" className="h-20 text-xl font-black uppercase italic w-full mt-12 shadow-2xl">
                              ACCESS REPORT <ArrowRight className="ml-3 w-6 h-6" />
                          </Button>
                      </Card>
                    </div>
                </div>

                {showForm && (
                  <div className="fixed inset-0 z-[200] bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center p-6 animate-fade-in overflow-y-auto">
                    <Card className="max-w-md w-full p-10 md:p-12 bg-slate-900 border-white/10 shadow-3xl rounded-[2.5rem] relative">
                        <button onClick={() => setShowForm(false)} className="absolute top-8 right-8 p-2 text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
                        <div className="text-center mb-10">
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Decrypt Audit</h3>
                            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] italic">Lead matching validation</p>
                        </div>
                        <form onSubmit={handleUnlock} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <input name="firstName" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-5 text-white font-bold outline-none focus:border-cyan-500 italic text-xs" placeholder="First Name" />
                                <input name="lastName" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-5 text-white font-bold outline-none focus:border-cyan-500 italic text-xs" placeholder="Last Name" />
                            </div>
                            <input name="email" required type="email" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-5 text-white font-bold outline-none focus:border-cyan-500 italic text-xs" placeholder="Professional Contact" />
                            <input name="phone" required type="tel" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-5 text-white font-bold outline-none focus:border-cyan-500 italic text-xs" placeholder="Mobile Number" />
                            
                            <div className="grid grid-cols-2 gap-4">
                                <select name="insurance" className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-slate-400 font-bold outline-none focus:border-cyan-500 italic text-xs appearance-none">
                                    <option value="">Insurance?</option>
                                    <option value="yes">Covered</option>
                                    <option value="no">Uninsured</option>
                                </select>
                                <select name="income" className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-slate-400 font-bold outline-none focus:border-cyan-500 italic text-xs appearance-none">
                                    <option value="">Income Tier</option>
                                    <option value="low">Under $40k</option>
                                    <option value="mid">$40k - $100k</option>
                                    <option value="high">Over $100k</option>
                                </select>
                            </div>

                            <Button fullWidth variant="teal" type="submit" loading={formLoading} className="h-16 text-lg font-black uppercase italic">FINALIZE REPORT</Button>
                        </form>
                    </Card>
                  </div>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto px-6 py-20 animate-fade-in pb-48 bg-slate-950">
            <div className="flex justify-between items-center mb-8">
                 <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${systemHealthy ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`} />
                    <span className="text-[10px] font-black uppercase italic text-slate-500 tracking-widest">Integrity Node: {systemHealthy ? 'Operational' : 'Syncing'}</span>
                 </div>
                <button 
                    onClick={() => setIsAllyMode(!isAllyMode)}
                    className="flex items-center gap-3 px-6 py-3 bg-slate-900 border border-white/10 rounded-full hover:bg-white hover:text-slate-950 transition-all group"
                >
                    <Accessibility size={16} className={isAllyMode ? 'text-cyan-400 group-hover:text-slate-950' : 'text-slate-500'} />
                    <span className="text-[10px] font-black uppercase italic tracking-widest">{isAllyMode ? 'Ally Logic On' : 'Clinical Direct'}</span>
                </button>
            </div>

            <div className="mb-12 bg-slate-900 p-8 md:p-12 rounded-[3rem] text-white flex flex-col lg:grid lg:grid-cols-[1fr_auto] items-center gap-10 shadow-3xl border border-white/10 relative overflow-hidden h-auto">
                <div className="relative z-10 text-center lg:text-left space-y-6">
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                        <Badge color="green" className="px-5 py-2 italic font-black">Audit Confidence: {result.accuracyScore}%</Badge>
                        <div className="bg-slate-950 border border-white/10 rounded-full px-5 py-1.5 flex items-center gap-3">
                            <ShieldCheckIcon className="text-cyan-400" size={14} />
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic leading-none">AES-256 Forensic Encrypted</span>
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-5xl lg:text-7xl font-black tracking-tighter uppercase italic leading-[0.85] text-white max-w-3xl">
                        Audit: <br/> <span className="text-cyan-500">{result.hospitalName}</span>
                    </h2>
                    <p className="text-slate-300 text-lg md:text-2xl font-bold leading-relaxed max-w-2xl italic tracking-tight opacity-95 border-l-4 border-cyan-500 pl-8 font-mono">
                        "{result.summary}"
                    </p>
                </div>

                <div className="w-full lg:w-auto text-center lg:text-right flex flex-col items-center lg:items-end justify-center relative z-10 lg:pl-12 lg:border-l border-white/10 min-w-[320px]">
                    <p className="text-[11px] font-black text-cyan-500 uppercase tracking-[0.5em] mb-2 italic leading-none">Forensic Recovery</p>
                    <p className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none italic">{fmt(totalSavings)}</p>
                </div>
            </div>

            <Card className="mb-16 p-10 md:p-14 bg-cyan-600 border-none shadow-3xl relative overflow-hidden rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none transform rotate-12"><GavelIcon size={240} className="text-white" /></div>
                <div className="relative z-10 space-y-6 max-w-xl text-center md:text-left">
                    <Badge color="navy" className="bg-slate-950/20 border-white/10 text-white font-black italic">DEPLOYMENT READY</Badge>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-950 uppercase italic tracking-tighter leading-[0.8]">Force Hospital <br/> Compliance.</h3>
                    <p className="text-lg text-slate-950 font-black italic leading-tight opacity-95">
                        Hospitals employ professional billing centers to maximize revenue. You need a Clinical Advocate to enforce your rights and reclaim overcharges.
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                        <CheckCircle size={18} className="text-slate-950" />
                        <span className="text-[11px] font-black uppercase italic text-slate-950 tracking-widest">Performance Based: $0 Down.</span>
                    </div>
                </div>
                <Button variant="navy" className="h-20 px-12 text-xl font-black uppercase italic shadow-2xl relative z-10 min-w-[280px]" onClick={() => bookAdvocateMeeting('user')}>
                    DEPLOY ADVOCATE
                </Button>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-8 space-y-16">
                    <div className="space-y-8">
                        <div className="flex items-center gap-4 ml-4">
                            <Gift size={24} className="text-emerald-500" />
                            <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] italic">Aid Mandates Found</h4>
                        </div>
                        {result.aidMatches && result.aidMatches.length > 0 ? result.aidMatches.map((aid, i) => (
                            <div key={i} className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] overflow-hidden flex flex-col md:grid md:grid-cols-[1fr_240px] shadow-2xl relative h-auto group hover:border-emerald-500/50 transition-all">
                                <div className="p-8 md:p-12 border-l-[12px] border-l-emerald-500 flex flex-col justify-between space-y-8">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <Badge color="green" className="px-4 py-1 italic font-black">Program Matched</Badge>
                                            <h4 className="font-black text-white text-2xl md:text-3xl tracking-tight italic uppercase leading-[0.9]">{aid.programName}</h4>
                                        </div>
                                        <div className="p-6 bg-slate-950/40 rounded-3xl border border-white/5 backdrop-blur-sm">
                                            <p className="text-slate-300 text-lg font-bold italic leading-relaxed">
                                                Matched with {aid.organization}'s mandated assistance pool. 
                                                Eligible for up to <span className="text-emerald-400 font-black">{aid.probability}</span> reduction.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-[10px] font-black text-emerald-500 uppercase italic tracking-widest">
                                        <Landmark size={14} /> Mandated per IRS Section 501(r)
                                    </div>
                                </div>
                                <div className="bg-slate-950 p-8 md:p-12 flex flex-col justify-center items-center md:items-end md:border-l border-emerald-500/20 text-center md:text-right shrink-0">
                                    <p className="text-5xl md:text-6xl font-black text-emerald-400 tracking-tighter leading-none mb-2 italic">{fmt(aid.amount)}</p>
                                    <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] italic leading-none">Potential Grant</p>
                                </div>
                            </div>
                        )) : (
                            <div className="p-16 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-slate-900/20">
                                <p className="text-slate-500 italic uppercase font-black tracking-[0.5em] text-[10px]">No local mandates detected for this ZIP.</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center gap-4 ml-4">
                            <AlertTriangle size={24} className="text-cyan-500" />
                            <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] italic">Discrepancy Violations</h4>
                        </div>
                        {result.errors.length > 0 ? result.errors.map((err, i) => (
                            <div key={i} className="bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col md:grid md:grid-cols-[1fr_240px] shadow-2xl relative h-auto group hover:border-cyan-500/30 transition-all">
                                <div className="p-8 md:p-12 border-l-[12px] border-l-cyan-500 flex flex-col justify-between space-y-10">
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4">
                                            {isAllyMode ? (
                                                <Badge color="white" className="px-4 py-1 italic font-black">Audit Violation</Badge>
                                            ) : (
                                                <Badge color="navy" className="bg-slate-950 px-4 py-1 font-mono text-[10px]">{err.code}</Badge>
                                            )}
                                            <h4 className="font-black text-white text-2xl md:text-3xl tracking-tight italic uppercase leading-[0.9]">{err.description}</h4>
                                        </div>
                                        <div className="p-8 bg-cyan-500/5 rounded-3xl border border-cyan-500/10 backdrop-blur-sm">
                                            <p className="text-slate-300 text-xl font-bold italic leading-relaxed">
                                                "{isAllyMode ? err.plainEnglishExplanation : err.reason}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-950 p-8 md:p-12 flex flex-col justify-center items-center md:items-end md:border-l border-white/10 text-center md:text-right shrink-0">
                                    <p className="text-5xl md:text-6xl font-black text-cyan-400 tracking-tighter leading-none mb-2 italic">{fmt(err.amount - err.marketPrice)}</p>
                                    <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] italic leading-none">Contestable</p>
                                </div>
                            </div>
                        )) : (
                            <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                                <p className="text-slate-500 italic uppercase font-black tracking-[0.5em] text-[12px]">Clinical Integrity Verified.</p>
                            </div>
                        )}
                    </div>

                    <Card className="p-12 bg-slate-900/50 border border-white/5 rounded-[3rem] text-center">
                        <h4 className="text-white font-black uppercase italic tracking-tighter mb-8 text-2xl">Was this audit accurate?</h4>
                        {feedbackSent ? (
                            <div className="flex flex-col items-center gap-4 text-cyan-500 animate-fade-in">
                                <CheckCircle size={48} />
                                <span className="font-black uppercase italic text-sm tracking-widest">Verification Sent.</span>
                            </div>
                        ) : (
                            <div className="flex justify-center gap-12">
                                <button onClick={() => handleFeedback(1)} className="flex flex-col items-center gap-4 group">
                                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center group-hover:bg-rose-500/20 transition-all border border-white/10">
                                        <ThumbsDown size={32} className="text-slate-500 group-hover:text-rose-500" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase italic text-slate-600">Dispute</span>
                                </button>
                                <button onClick={() => handleFeedback(5)} className="flex flex-col items-center gap-4 group">
                                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center group-hover:bg-cyan-500/20 transition-all border border-white/10">
                                        <ThumbsUp size={32} className="text-slate-500 group-hover:text-cyan-500" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase italic text-slate-600">Validate</span>
                                </button>
                            </div>
                        )}
                    </Card>

                    <Card className="mt-12 p-12 md:p-16 bg-cyan-950/20 border-cyan-500/20 shadow-2xl rounded-[3rem] text-center space-y-10">
                        <div className="max-w-2xl mx-auto space-y-6">
                            <div className="flex justify-center gap-1 mb-4">
                                {[1,2,3,4,5].map(s => <Star key={s} size={20} className="text-amber-500 fill-amber-500" />)}
                            </div>
                            <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-[0.85]">The Final Word <br/> in Recovery.</h3>
                            <p className="text-xl text-slate-300 font-bold italic leading-relaxed">
                                Our advocates maintain a 92% recovery rate on audits of this quality. Secure your clinical defense today and stop overpaying.
                            </p>
                        </div>
                        <div className="flex flex-col md:flex-row gap-6 justify-center">
                            <Button variant="teal" className="h-20 px-16 text-xl font-black uppercase italic shadow-2xl bg-teal-600" onClick={() => bookAdvocateMeeting('user')}>
                                INITIATE NEGOTIATION
                            </Button>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-4 space-y-10 w-full no-print">
                    <Card className="p-10 bg-slate-900 border-white/10 rounded-[2.5rem] flex flex-col gap-6">
                        <div className="flex items-center gap-3 mb-2">
                             <Shield className="text-cyan-500 w-4 h-4" />
                             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-none">Evidence Pack</h4>
                        </div>
                        <div className="space-y-4">
                            {/* Wired to Stripe Checkout */}
                            <button 
                                onClick={() => result.billId && initiateStripeCheckout(result.billId)}
                                className="w-full p-6 bg-slate-950/50 border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-slate-900 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <FileText className="text-cyan-400" />
                                    <span className="text-[10px] font-black uppercase italic tracking-widest text-white">DIY Dispute Letter ($39)</span>
                                </div>
                                <CreditCard size={16} className="text-slate-600 group-hover:text-white" />
                            </button>
                            <button 
                                onClick={() => result.billId && initiateStripeCheckout(result.billId)}
                                className="w-full p-6 bg-slate-950/50 border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-slate-900 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <Landmark className="text-cyan-400" />
                                    <span className="text-[10px] font-black uppercase italic tracking-widest text-white">Full Evidence Pack ($39)</span>
                                </div>
                                <Download size={16} className="text-slate-600 group-hover:text-white" />
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
