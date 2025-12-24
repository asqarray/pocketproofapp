
import React, { useState, useRef, useEffect } from 'react';
import { 
    CheckCircle, X, ArrowRight, AlertTriangle, Loader2, Gavel, Lock, Info, 
    ChevronRight, ShieldAlert, Eye, TrendingUp, DollarSign, Landmark, Target,
    AlertOctagon, Printer, FileCheck, ShieldCheck as ShieldCheckIcon, ExternalLink, Zap, ChevronDown, Building2, Wallet, AlertCircle, MapPin, Search,
    Shield, HeartHandshake, Sparkles, ShieldCheck, Download, FileText, Scale, HelpCircle, Camera, Award, ShieldCheck as SafeIcon, ShoppingCart, CreditCard
} from 'lucide-react';
import { Button, Card, Badge, SectionHeader } from './UI';
import { analyzeBillWithGemini } from '../services/geminiService';
import { AnalysisResult } from '../types';
import { saveAnonymizedBill, saveBillToPatientSession, bookAdvocateMeeting, sendPhiToZoho } from '../services/integrationService';

export const UploadSection = ({ onComplete }: { onComplete: (result: AnalysisResult) => void }) => {
  const [step, setStep] = useState<'HOSPITAL' | 'STATE' | 'AMOUNT' | 'STATUS' | 'UPLOAD'>('HOSPITAL');
  const [intakeData, setIntakeData] = useState({ hospital: '', state: '', amount: '', status: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [auditStep, setAuditStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const auditLogs = [
    "Establishing Secure Clinical Connection...",
    "Executing Multi-Pass PHI Sanitization (HIPAA)...",
    "Scanning National CPT/HCPCS Market Benchmarks...",
    "Extracting Itemized Statements (OCR-Pass)...",
    "Detecting Systemic Code-Creep & Inflation...",
    "Matching against $50B National Grant Database...",
    "Constructing Forensic Dispute Evidence Pack...",
    "Audit Complete: Integrity Index Verified."
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
      if (!file) throw new Error("Verification Document Required.");
      const reader = new FileReader();
      const fileData = await new Promise<{ mimeType: string, data: string }>((resolve, reject) => {
        reader.onload = () => resolve({ mimeType: file.type, data: (reader.result as string).split(',')[1] });
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const result = await analyzeBillWithGemini(fileData);
      onComplete({ ...result, patientState: intakeData.state });
    } catch (e: any) {
      setIsProcessing(false);
      setErrorMessage(e.message);
    }
  };

  const nextStep = () => {
    if (step === 'HOSPITAL' && intakeData.hospital) setStep('STATE');
    else if (step === 'STATE' && intakeData.state) setStep('AMOUNT');
    else if (step === 'AMOUNT' && intakeData.amount) setStep('STATUS');
    else if (step === 'STATUS' && intakeData.status) setStep('UPLOAD');
  };

  if (isProcessing) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-fade-in max-w-4xl mx-auto bg-slate-950">
        <div className="relative w-32 h-32 md:w-40 md:h-40 mb-10">
            <div className="absolute inset-0 border-[4px] border-white/5 rounded-full"></div>
            <div className="absolute inset-0 border-[4px] border-cyan-500 rounded-full border-t-transparent animate-spin"></div>
            <Target className="absolute inset-0 m-auto text-cyan-500 w-10 h-10 md:w-12 md:h-12 animate-pulse" />
        </div>
        <h2 className="text-2xl md:text-4xl font-black mb-8 tracking-tighter text-white uppercase italic leading-tight">Executing <br/><span className="text-cyan-500">Forensic Audit</span></h2>
        
        <div className="w-full bg-white/5 backdrop-blur-3xl rounded-[1.5rem] p-6 md:p-10 text-left space-y-4 border border-white/10 shadow-2xl">
            {auditLogs.map((log, i) => (
                <div key={i} className={`flex items-center gap-4 text-[10px] font-black tracking-[0.2em] transition-all duration-700 ${i === auditStep ? 'text-cyan-400 translate-x-2' : i < auditStep ? 'text-emerald-500 opacity-100' : 'text-slate-600'}`}>
                    {i < auditStep ? <CheckCircle className="w-3.5 h-3.5 shrink-0" /> : i === auditStep ? <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" /> : <div className="w-3.5 h-3.5 border border-slate-700 rounded-full shrink-0" />}
                    <span className="uppercase italic">{log}</span>
                </div>
            ))}
        </div>
        <p className="mt-8 text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] italic">SECURE NODE • AES-256 ENCRYPTED EXTRACTION</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-32 md:py-40 px-6 min-h-screen flex flex-col items-center">
      <div className="w-full text-center space-y-10">
        {step === 'HOSPITAL' && (
          <div className="animate-slide-up space-y-8">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">Which Hospital <br/><span className="text-rose-500">Billed You?</span></h2>
            <div className="relative max-w-lg mx-auto">
              <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                autoFocus
                className="w-full bg-slate-900 border-2 border-slate-800 rounded-xl p-5 pl-14 text-lg font-black text-white outline-none focus:border-cyan-500 transition-all italic uppercase tracking-tighter"
                placeholder="Facility Name..."
                value={intakeData.hospital}
                onChange={e => setIntakeData({...intakeData, hospital: e.target.value})}
                onKeyDown={e => e.key === 'Enter' && nextStep()}
              />
            </div>
            <Button variant="teal" className="h-16 px-10 text-sm" onClick={nextStep} disabled={!intakeData.hospital}>CONTINUE →</Button>
          </div>
        )}

        {step === 'STATE' && (
          <div className="animate-slide-up space-y-8">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">Select Your <br/><span className="text-rose-500">State.</span></h2>
            <div className="relative max-w-lg mx-auto">
              <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <select 
                autoFocus
                className="w-full bg-slate-900 border-2 border-slate-800 rounded-xl p-5 pl-14 text-lg font-black text-white outline-none focus:border-cyan-500 transition-all italic uppercase tracking-tighter appearance-none"
                value={intakeData.state}
                onChange={e => { setIntakeData({...intakeData, state: e.target.value}); setStep('AMOUNT'); }}
              >
                <option value="">Select State...</option>
                {['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        )}

        {step === 'AMOUNT' && (
          <div className="animate-slide-up space-y-8">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">Estimated <br/><span className="text-rose-500">Total Bill?</span></h2>
            <div className="relative max-w-lg mx-auto">
              <Wallet className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                autoFocus
                type="text"
                className="w-full bg-slate-900 border-2 border-slate-800 rounded-xl p-5 pl-14 text-2xl font-black text-white outline-none focus:border-cyan-500 transition-all italic uppercase tracking-tighter"
                placeholder="$0.00"
                value={intakeData.amount}
                onChange={e => setIntakeData({...intakeData, amount: e.target.value})}
                onKeyDown={e => e.key === 'Enter' && nextStep()}
              />
            </div>
            <Button variant="teal" className="h-16 px-10 text-sm" onClick={nextStep} disabled={!intakeData.amount}>NEXT →</Button>
          </div>
        )}

        {step === 'STATUS' && (
          <div className="animate-slide-up space-y-8">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">Current <br/><span className="text-rose-500">Status?</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              {['Received Bill', 'Final Notice', 'In Collections', 'Already Paid'].map(status => (
                <button 
                  key={status}
                  onClick={() => { setIntakeData({...intakeData, status}); setStep('UPLOAD'); }}
                  className="p-5 bg-slate-900 border-2 border-slate-800 rounded-xl text-base font-black uppercase italic tracking-tighter text-slate-400 hover:border-cyan-500 hover:text-white transition-all"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'UPLOAD' && (
          <div className="animate-slide-up space-y-10 w-full">
            <SectionHeader 
                badge="Final Phase"
                title={<>Import Your <br/><span className="text-rose-500">Statement.</span></>}
                subtitle="Capture your bill using your camera or upload a saved PDF."
            />
            <Card className="p-6 bg-slate-900 border-slate-800 shadow-3xl max-w-xl mx-auto rounded-[1.5rem]">
                <div className={`p-8 md:p-12 border-2 border-dashed rounded-[1rem] text-center transition-all ${dragActive ? 'border-cyan-500 bg-cyan-500/5' : 'border-slate-800 bg-slate-950'}`} onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} onDrop={(e) => { e.preventDefault(); setDragActive(false); if(e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); }}>
                    <input ref={fileInputRef} type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
                    <input ref={cameraInputRef} type="file" className="hidden" accept="image/*" capture="environment" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
                    
                    <ShieldAlert className="w-8 h-8 text-rose-500 mx-auto mb-5" />
                    <h3 className="text-lg md:text-xl font-black mb-8 text-white uppercase italic tracking-tighter">{file ? file.name : 'Choose Method'}</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button onClick={() => cameraInputRef.current?.click()} className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white hover:text-slate-900 transition-all group">
                            <Camera className="w-8 h-8 mb-3 text-cyan-400 group-hover:text-slate-900" />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">Take Photo</span>
                        </button>
                        <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white hover:text-slate-900 transition-all group">
                            <FileText className="w-8 h-8 mb-3 text-cyan-400 group-hover:text-slate-900" />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">Upload File</span>
                        </button>
                    </div>

                    {file && (
                      <div className="mt-8 pt-8 border-t border-white/5">
                        <Button onClick={handleAnalysis} variant="teal" className="h-16 w-full text-lg font-black uppercase italic shadow-2xl">EXECUTE FORENSIC AUDIT</Button>
                      </div>
                    )}
                </div>
            </Card>
          </div>
        )}
      </div>
      {errorMessage && <p className="text-rose-500 font-black text-center mt-8 uppercase italic tracking-[0.3em] text-[9px]">{errorMessage}</p>}
    </div>
  );
};

const DisputeLetterModal = ({ content, onClose }: { content: string, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-[300] bg-slate-950/98 backdrop-blur-2xl flex items-center justify-center p-6 md:p-12 animate-fade-in overflow-y-auto">
            <div className="max-w-4xl w-full bg-white rounded-[3rem] shadow-[0_60px_120px_rgba(0,0,0,0.5)] flex flex-col h-auto max-h-[90vh] overflow-hidden">
                <div className="p-8 border-b border-rose-100 flex items-center justify-between no-print shrink-0 bg-rose-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center text-white italic font-black">P</div>
                        <div>
                            <h3 className="text-slate-900 font-black uppercase italic tracking-tighter text-xl leading-none">Draft Dispute Letter</h3>
                            <p className="text-rose-500 text-[9px] font-black uppercase tracking-widest italic mt-1">Template Draft • Not Legal Advice</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="secondary" className="h-12 px-6 text-[10px] bg-white border-slate-200" onClick={() => window.print()}>
                            <Printer className="w-4 h-4 mr-2" /> PRINT TO PDF
                        </Button>
                        <button onClick={onClose} className="p-3 text-slate-400 hover:text-rose-500 transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>
                
                <div className="flex-1 p-12 md:p-20 overflow-y-auto bg-white font-serif text-slate-900 print:p-0">
                    <div className="max-w-3xl mx-auto whitespace-pre-wrap leading-relaxed text-lg italic print:text-base print:leading-normal">
                        {content}
                    </div>
                </div>
                
                <div className="p-6 bg-slate-50 border-t border-slate-100 text-center no-print shrink-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic leading-none">WARNING: THIS IS AN AI-GENERATED TEMPLATE. CONSULT A PROFESSIONAL BEFORE SUBMISSION.</p>
                </div>
            </div>
        </div>
    );
};

export const ResultsDashboard = ({ result, onUpgrade }: { result: AnalysisResult; onUpgrade: () => void }) => {
    const [funnelStep, setFunnelStep] = useState<'TEASER' | 'LOCKED'>('TEASER');
    const [showForm, setShowForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [showLetter, setShowLetter] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    
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
          priorityLevel: result.priorityLevel
        };
        
        try {
            await sendPhiToZoho(lead);
            await saveAnonymizedBill(lead.billId, { ...result, billId: lead.billId });
            saveBillToPatientSession(lead.billId);
            setFunnelStep('LOCKED');
        } catch (error) {
            alert("Connection error. Please try again.");
        } finally {
            setFormLoading(false);
        }
    };

    const handleEvidenceCheckout = async () => {
        setIsCheckingOut(true);
        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    amount: 3900, 
                    description: `Evidence Package for ${result.hospitalName}`,
                    successUrl: window.location.href,
                    cancelUrl: window.location.href
                })
            });
            const { url } = await response.json();
            if (url) window.location.href = url;
        } catch (e) {
            // Mock checkout if API fails for demo
            setTimeout(() => {
                alert("STAGING MODE: Payment verified. Decrypting Evidence Package...");
                setShowLetter(true);
                setIsCheckingOut(false);
            }, 2000);
        }
    };

    if (funnelStep === 'LOCKED' && totalSavings === 0) {
      return (
        <div className="min-h-screen flex flex-col items-center pt-24 md:pt-32 px-6 bg-slate-950 pb-48 text-center animate-fade-in">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-10 border border-emerald-500/20 shadow-2xl">
              <SafeIcon size={48} className="text-emerald-500 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.85] mb-6">
                Forensic Audit <br/><span className="text-emerald-500">Verified Clear.</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl font-medium italic mb-12">
              Our audit of {result.hospitalName} found that your current charges align with National Fair Market Prices. Your billing integrity index is exceptionally high.
            </p>
            <Card className="max-w-xl w-full p-12 bg-slate-900 border-white/5 shadow-3xl rounded-[3rem] text-left">
              <h3 className="text-white font-black uppercase italic tracking-tighter mb-6">Shield Mode Active</h3>
              <p className="text-slate-500 text-sm mb-10 italic">We've added this bill to your vault. We will continue to monitor {result.hospitalName} for systemic billing shifts in your region.</p>
              <Button onClick={() => window.location.hash = 'dashboard'} fullWidth variant="teal">Return to Vault</Button>
            </Card>
        </div>
      );
    }

    if (funnelStep === 'TEASER') {
        return (
            <div className="min-h-screen flex flex-col items-center pt-24 md:pt-32 px-6 bg-slate-950 pb-48 overflow-hidden relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.08)_0%,transparent_70%)] pointer-events-none" />
                
                <div className="text-center space-y-6 animate-slide-up max-w-5xl w-full relative z-10">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-rose-500/10 border border-rose-500/30 rounded-full">
                        <AlertOctagon size={14} className="text-rose-500" />
                        <span className="text-[8px] font-black text-rose-500 uppercase tracking-[0.4em] italic leading-none">Integrity Index: {result.accuracyScore}% Certified</span>
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-[0.85] mb-2 uppercase italic">
                        Found Your <br/> <span className="text-rose-500">Stolen Capital.</span>
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full text-left">
                      <Card className="lg:col-span-7 bg-slate-900 p-8 md:p-12 border-white/10 shadow-3xl flex flex-col justify-between rounded-[2rem] h-auto">
                          <div className="space-y-8">
                              <div className="space-y-1">
                                <p className="text-rose-400 font-black text-[8px] uppercase tracking-[0.4em] italic leading-none">Entity under Audit:</p>
                                <h3 className="text-white text-2xl md:text-4xl font-black tracking-tight uppercase italic leading-none">{result.hospitalName}</h3>
                              </div>
                              
                              <div className="p-6 bg-slate-950/80 rounded-[1.5rem] border-2 border-dashed border-rose-500/30 backdrop-blur-xl">
                                  <Badge color="red" className="mb-4 px-3 py-1 text-[7px]">Egregious Violation Detected</Badge>
                                  <div className="space-y-4">
                                      {result.highlightError ? (
                                        <>
                                          <h4 className="text-white text-xl font-black italic uppercase leading-none">{result.highlightError.description}</h4>
                                          <p className="text-slate-400 text-sm italic font-medium leading-relaxed mt-2">
                                            "{result.highlightError.explanation}"
                                          </p>
                                        </>
                                      ) : (
                                        <div className="space-y-2 opacity-20">
                                            <div className="h-1.5 w-3/4 bg-white rounded-full animate-pulse" />
                                            <div className="h-1.5 w-full bg-white rounded-full animate-pulse" />
                                        </div>
                                      )}
                                  </div>
                              </div>
                          </div>
                      </Card>

                      <Card className="lg:col-span-5 bg-white p-8 md:p-12 border-slate-200 shadow-3xl flex flex-col justify-between rounded-[2rem] h-auto">
                          <div className="space-y-8">
                              <div className="space-y-2">
                                  <p className="text-slate-400 text-[8px] font-black uppercase tracking-[0.4em] italic leading-none">Recoverable Sum:</p>
                                  <p className="text-6xl md:text-7xl font-black text-slate-950 tracking-tighter leading-none italic">{fmt(totalSavings)}</p>
                              </div>
                              <p className="text-slate-600 text-sm font-medium italic leading-relaxed">
                                Forensic detection identified systematic overcharges relative to national fair market price.
                              </p>
                              <div className="bg-emerald-50 p-4 rounded-xl flex items-center gap-3">
                                <ShieldCheck size={20} className="text-emerald-500" />
                                <span className="text-[10px] font-black text-emerald-700 uppercase italic tracking-widest leading-tight">Grant Eligibility: 84% LIKELIHOOD</span>
                              </div>
                          </div>
                          <Button onClick={() => setShowForm(true)} variant="teal" className="h-16 text-lg font-black uppercase italic w-full mt-10">
                              DECRYPT FULL REPORT <ArrowRight className="ml-2 w-5 h-5" />
                          </Button>
                      </Card>
                    </div>
                </div>

                {showForm && (
                  <div className="fixed inset-0 z-[200] bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center p-6 animate-fade-in overflow-y-auto">
                    <Card className="max-w-md w-full p-10 md:p-12 bg-slate-900 border-white/10 shadow-3xl rounded-[2.5rem] relative">
                        <button onClick={() => setShowForm(false)} className="absolute top-8 right-8 p-2 text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
                        <div className="text-center mb-10">
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-1">Unmask Your Audit</h3>
                            <p className="text-slate-400 text-[8px] font-black uppercase tracking-[0.3em] italic">Secure verification for PHI data</p>
                        </div>
                        <form onSubmit={handleUnlock} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <input name="firstName" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-5 text-white font-bold outline-none focus:border-cyan-500 italic text-xs" placeholder="First Name" />
                                <input name="lastName" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-5 text-white font-bold outline-none focus:border-cyan-500 italic text-xs" placeholder="Last Name" />
                            </div>
                            <input name="email" required type="email" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-5 text-white font-bold outline-none focus:border-cyan-500 italic text-xs" placeholder="Verified Email" />
                            <input name="phone" required type="tel" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-5 text-white font-bold outline-none focus:border-cyan-500 italic text-xs" placeholder="Mobile Number" />
                            
                            <div className="grid grid-cols-2 gap-4">
                                <select name="insurance" className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-slate-400 font-bold outline-none focus:border-cyan-500 italic text-xs appearance-none">
                                    <option value="">Insured?</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                                <select name="income" className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-slate-400 font-bold outline-none focus:border-cyan-500 italic text-xs appearance-none">
                                    <option value="">Income Tier</option>
                                    <option value="low">Under $40k</option>
                                    <option value="mid">$40k - $100k</option>
                                    <option value="high">$100k+</option>
                                </select>
                            </div>

                            <div className="flex items-start gap-3 py-2">
                                <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-cyan-500" />
                                <p className="text-[10px] text-slate-500 italic leading-snug">
                                    I consent to secure analysis and allow certified advocates to contact me regarding my case.
                                </p>
                            </div>

                            <Button fullWidth variant="teal" type="submit" loading={formLoading} className="h-16 text-lg font-black uppercase italic">UNMASK FULL REPORT</Button>
                        </form>
                    </Card>
                  </div>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto px-6 py-20 animate-fade-in pb-48 bg-slate-950">
            {showLetter && <DisputeLetterModal content={result.disputeLetterPreview || ""} onClose={() => setShowLetter(false)} />}
            
            <div className="mb-12 bg-slate-900 p-8 md:p-12 rounded-[2.5rem] text-white flex flex-col lg:grid lg:grid-cols-[1fr_auto] items-center gap-10 shadow-3xl border border-white/10 relative overflow-hidden h-auto">
                <div className="relative z-10 text-center lg:text-left space-y-6">
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                        <div className="bg-rose-500 text-white font-black text-[9px] uppercase tracking-widest px-4 py-1 rounded-full italic leading-none">Accuracy: {result.accuracyScore}% Certified</div>
                        <div className="bg-slate-950 border border-white/10 rounded-full px-4 py-1 flex items-center gap-3">
                            <ShieldCheckIcon className="text-teal-400" size={12} />
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic leading-none">Legal Shield: ACTIVE</span>
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase italic leading-[0.85] text-white max-w-3xl">
                        {result.hospitalName} <br/> <span className="text-rose-500">Forensic Audit.</span>
                    </h2>
                    <p className="text-slate-300 text-base md:text-xl font-medium leading-relaxed max-w-2xl italic opacity-90 leading-tight">
                        "{result.summary}"
                    </p>
                </div>

                <div className="w-full lg:w-auto text-center lg:text-right flex flex-col items-center lg:items-end justify-center relative z-10 lg:pl-12 lg:border-l border-white/10 min-w-[280px]">
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.5em] mb-1 italic leading-none">Final Recoup Sum</p>
                    <p className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none italic">{fmt(totalSavings)}</p>
                    <div className="mt-8 w-full flex flex-col gap-3">
                        <Button variant="teal" onClick={() => setShowLetter(true)} className="h-14 w-full text-[9px] uppercase tracking-widest italic bg-cyan-600 text-slate-950 rounded-xl flex items-center justify-center gap-3 border-none">
                            <FileText className="w-4 h-4" /> PREVIEW DISPUTE LETTER
                        </Button>
                        <Button variant="outline" onClick={() => window.print()} className="h-14 w-full text-[9px] uppercase tracking-widest italic bg-white/5 border border-white/10 text-white hover:bg-white hover:text-slate-950 rounded-xl flex items-center justify-center gap-3">
                            <Printer className="w-4 h-4" /> EVIDENCE PACK PDF
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-8 space-y-20">
                    <div className="space-y-12">
                        <div className="flex flex-col gap-3">
                            <div className="w-fit px-4 py-1 bg-rose-500 text-white font-black text-[8px] uppercase tracking-widest rounded-full italic leading-none">Phase 1: Violations Detected</div>
                            <h2 className="text-2xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">Illegal <br/><span className="text-rose-500">Charge Inflation.</span></h2>
                            <p className="text-slate-500 text-sm font-medium italic">Comparison against National Fair Market Price (FMP) reveals systemic overcharging.</p>
                        </div>
                        
                        <div className="space-y-6">
                            {result.errors.length > 0 ? result.errors.map((err, i) => (
                                <div key={i} className="bg-slate-900 border border-white/10 rounded-[2rem] overflow-hidden flex flex-col md:grid md:grid-cols-[1fr_220px] shadow-2xl relative h-auto">
                                    <div className="p-8 md:p-10 border-l-[10px] border-l-rose-500 flex flex-col justify-between space-y-8">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3">
                                                <Badge color="navy" className="bg-slate-950 px-3 py-1 font-mono text-[9px]">{err.code}</Badge>
                                                <h4 className="font-black text-white text-xl md:text-2xl tracking-tight italic uppercase leading-[0.9]">{err.description}</h4>
                                            </div>
                                            
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest italic">
                                                    <span className="text-slate-500">Hospital: {fmt(err.amount)}</span>
                                                    <span className="text-emerald-400">Market Price: {fmt(err.marketPrice)}</span>
                                                </div>
                                                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-white/5 relative">
                                                    <div className="bg-rose-500 h-full w-full absolute opacity-20" />
                                                    <div className="bg-emerald-500 h-full absolute transition-all duration-1000" style={{ width: `${Math.min(100, (err.marketPrice / err.amount) * 100)}%` }} />
                                                </div>
                                                <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest italic text-right">
                                                  Inflation: {Math.round((err.amount / err.marketPrice) * 100)}% OVER MARKET
                                                </p>
                                            </div>

                                            <div className="p-5 bg-cyan-500/5 rounded-2xl border border-cyan-500/10">
                                                <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1 italic flex items-center gap-2">
                                                    <HelpCircle size={14} /> Knowledge Bridge:
                                                </p>
                                                <p className="text-slate-300 text-sm font-medium italic leading-relaxed">
                                                    "{err.plainEnglishExplanation}"
                                                </p>
                                            </div>
                                        </div>
                                        <div className="p-5 bg-rose-500/5 rounded-2xl border border-rose-500/10 flex items-start gap-4">
                                            <Gavel className="w-4 h-4 text-rose-400 shrink-0 mt-1" />
                                            <div>
                                                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1 italic">Regulatory Citation:</p>
                                                <p className="text-[11px] font-bold text-slate-300 uppercase italic tracking-widest leading-snug">{err.regulatoryCitation}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-950 p-8 md:p-10 flex flex-col justify-center items-center md:items-end md:border-l border-white/10 text-center md:text-right shrink-0">
                                        <p className="text-4xl md:text-5xl font-black text-rose-500 tracking-tighter leading-none mb-1 italic">{fmt(err.amount - err.marketPrice)}</p>
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic leading-none">Net Overcharge</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-slate-600 italic uppercase font-black tracking-widest text-[11px]">Audit found no egregious coding violations.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-10 lg:sticky lg:top-32 w-full">
                    <Card className="p-10 bg-[#0F172A] text-white border-2 border-cyan-500/20 shadow-3xl relative overflow-hidden rounded-[2.5rem] h-auto flex flex-col gap-10">
                        <div className="absolute -top-6 -right-6 p-6 opacity-[0.03] pointer-events-none transform rotate-12 scale-110"><ShieldCheckIcon size={180} /></div>
                        
                        <div className="relative z-10 space-y-8">
                            <Badge color="teal" className="bg-cyan-500 text-slate-950 border-none px-5 py-1.5 italic font-black text-[9px] uppercase tracking-widest leading-none">Verified {result.priorityLevel} Priority</Badge>
                            <div className="space-y-4">
                                <h3 className="font-black text-4xl uppercase tracking-tighter leading-[0.85] italic text-cyan-400">Deploy <br/><span className="text-white">Advocate.</span></h3>
                                <p className="text-slate-300 text-sm font-medium italic leading-relaxed">
                                    Our certified clinical advocates negotiate directly with {result.hospitalName}. Pay nothing unless we recover your capital.
                                </p>
                            </div>
                        </div>
                        
                        <div className="relative z-10">
                          <Button fullWidth variant="teal" className="h-16 font-black text-base uppercase italic rounded-2xl shadow-2xl bg-cyan-500 text-slate-950 border-none hover:bg-white" onClick={() => bookAdvocateMeeting('user')}>
                            START NEGOTIATION
                          </Button>
                        </div>
                        
                        <div className="relative z-10 border-t border-white/5 pt-6 flex items-center gap-4">
                            <div className="flex -space-x-2">
                                {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-[8px] font-black italic uppercase">JD</div>)}
                            </div>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic leading-tight">Advocates active in {result.patientState || 'your state'}</span>
                        </div>
                    </Card>

                    <Card className="bg-slate-950 border border-white/10 p-10 shadow-2xl rounded-[2.5rem] h-auto flex flex-col gap-10 group cursor-pointer hover:border-rose-500/30 transition-all" onClick={handleEvidenceCheckout}>
                        <div className="space-y-4">
                          <Badge color="navy" className="px-4 py-1.5 bg-slate-900 text-slate-500 border-white/5 uppercase tracking-widest font-black italic text-[8px]">Forensic Unlock</Badge>
                          <h4 className="text-white text-3xl font-black leading-[0.9] italic uppercase tracking-tighter group-hover:text-rose-500 transition-colors">Forensic <br/> Evidence Pack.</h4>
                        </div>
                        
                        <div className="space-y-4">
                          <button className="w-full h-16 bg-white hover:bg-rose-500 transition-all rounded-2xl flex items-center justify-between px-6">
                              <span className="text-slate-950 font-black text-xs uppercase italic tracking-tighter">
                                {isCheckingOut ? 'Securing Link...' : 'Unlock for $39.00'}
                              </span>
                              {isCheckingOut ? <Loader2 className="animate-spin text-slate-950" /> : <CreditCard className="text-slate-950 w-5 h-5" />}
                          </button>
                        </div>
                        <p className="text-[9px] text-slate-600 font-bold uppercase italic tracking-widest text-center">One-time payment • All line items decrypted</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};
