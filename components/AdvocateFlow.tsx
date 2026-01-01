
import React, { useState, useEffect } from 'react';
import { 
    Users, Briefcase, FileText, Lock, ShieldCheck, Plus, ArrowLeft, Printer, Mail, 
    Download, X, Search, Filter, MoreHorizontal, Clock, DollarSign, CheckCircle2, 
    AlertOctagon, TrendingUp, Calendar, FileCode, MessageSquare, Trash2, ArrowRight, 
    ThumbsUp, ThumbsDown, Send, Loader2, Zap, LogOut, RefreshCw, Activity, ShieldAlert,
    Gavel, Award, CheckCircle, BarChart3, ChevronRight, UserPlus
} from 'lucide-react';
import { Button, Card, Badge } from './UI';
import { AdvocateViewLead, AnalysisResult, BillError } from '../types';
import { getAdvocateLeads, getBillDetails, updateCaseStatus } from '../services/integrationService';

export const AdvocateLogin = ({ onLogin }: { onLogin: () => void }) => {
    const [accessCode, setAccessCode] = useState('');
    const [showOnboarding, setShowOnboarding] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (accessCode.toUpperCase() === "JUSTICE") onLogin();
        else alert("Invalid Code. Use 'JUSTICE' for Demo.");
    };

    if (showOnboarding) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6 bg-[#020617]">
                <Card className="max-w-md w-full p-12 bg-slate-900 border-slate-800 shadow-2xl rounded-[3.5rem]">
                    <button onClick={() => setShowOnboarding(false)} className="mb-8 text-slate-500 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase italic tracking-widest transition-all"><ArrowLeft size={14}/> Back to Login</button>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Practitioner Onboarding</h2>
                    <p className="text-slate-500 text-sm italic mb-10 leading-relaxed font-medium">Join the network. Verified clinical advocates only. 48hr credentialing required.</p>
                    <form className="space-y-6">
                        <input required type="text" placeholder="Full Name" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-white outline-none focus:border-cyan-500 transition-all italic text-xs font-bold" />
                        <input required type="email" placeholder="Clinical Email" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-white outline-none focus:border-cyan-500 transition-all italic text-xs font-bold" />
                        <input required type="text" placeholder="License / Certification #" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-white outline-none focus:border-cyan-500 transition-all italic text-xs font-bold" />
                        <Button fullWidth onClick={() => alert("Credentials sent for manual review.")} variant="teal" className="h-16">Request Entry</Button>
                    </form>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-[#020617]">
            <Card className="max-w-md w-full p-12 text-center bg-slate-900 border-slate-800 shadow-3xl rounded-[3.5rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform"><Gavel size={120} className="text-white" /></div>
                <div className="w-20 h-20 bg-cyan-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-cyan-500/20 shadow-inner group-hover:scale-110 transition-transform">
                    <Lock className="w-10 h-10 text-cyan-500" />
                </div>
                
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">Advocate Portal</h2>
                <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em] mb-12 italic">Secure Node Access Required</p>
                <form onSubmit={handleLogin} className="space-y-6">
                    <input 
                        type="password" 
                        required 
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-white text-center tracking-[0.6em] focus:border-cyan-500 outline-none transition-all italic text-sm font-black" 
                        placeholder="••••••" 
                        value={accessCode} 
                        onChange={e => setAccessCode(e.target.value)} 
                    />
                    <Button fullWidth type="submit" variant="teal" className="h-20 text-lg shadow-2xl shadow-cyan-500/20">AUTHORIZE SESSION</Button>
                </form>
                <div className="mt-10 text-[9px] font-black uppercase text-slate-800 italic tracking-[0.6em]">Demo Bypass: JUSTICE</div>
            </Card>
        </div>
    );
};

const CaseCommandCenter = ({ lead, onClose }: { lead: AdvocateViewLead; onClose: () => void }) => {
    const [details, setDetails] = useState<AnalysisResult | null>(null);
    const [activeTab, setActiveTab] = useState<'audit' | 'notes' | 'letter'>('audit');
    const [messages, setMessages] = useState<{sender: string, text: string, time: string}[]>([
        { sender: 'System', text: 'Case opened. Triple-Pass AI Audit complete. High confidence findings available.', time: '10:00 AM' }
    ]);
    const [newMessage, setNewMessage] = useState("");
    const [currentStatus, setCurrentStatus] = useState(lead.status);

    useEffect(() => {
        if(lead.linkId) getBillDetails(lead.linkId).then(setDetails);
    }, [lead]);

    const handleStatusChange = async (newStatus: any) => {
        setCurrentStatus(newStatus);
        await updateCaseStatus(lead.id, newStatus);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        setMessages([...messages, { sender: 'Advocate', text: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setNewMessage("");
    };

    if(!details) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-400">
            <Loader2 className="w-16 h-16 animate-spin mb-8 text-cyan-500" />
            <p className="font-black text-[10px] uppercase tracking-[0.8em] italic animate-pulse">Decrypting Clinical Vault...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans animate-fade-in pb-48 pt-40">
             <div className="bg-slate-900 border-b border-white/10 p-10 fixed top-0 left-0 w-full z-[120] shadow-2xl">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-8">
                        <Button variant="ghost" onClick={onClose} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all"><ArrowLeft size={24} /></Button>
                        <div>
                            <div className="flex items-center gap-4 mb-1">
                                <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">{lead.firstName} {lead.lastName}</h2>
                                <Badge color={lead.billValue > 5000 ? 'red' : 'navy'} className="px-4 py-1.5">{lead.billValue > 5000 ? 'HIGH VALUE' : 'STANDARD'}</Badge>
                            </div>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] italic leading-none">FORENSIC_REF: {lead.id.slice(-8).toUpperCase()} • {lead.state || 'US'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end mr-6">
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic mb-1">Current State</span>
                            <select 
                                value={currentStatus} 
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="bg-slate-950 border border-white/10 rounded-xl px-6 py-3 text-[11px] font-black uppercase italic text-white outline-none focus:border-cyan-500 transition-all appearance-none cursor-pointer"
                            >
                                <option value="New">Unclaimed</option>
                                <option value="In Progress">Active Representation</option>
                                <option value="Closed">Capital Recovered</option>
                            </select>
                        </div>
                        <Button variant="teal" className="h-16 px-10 shadow-2xl" onClick={() => window.print()}><Printer className="mr-3" /> PRINT PACK</Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-4 gap-12 pt-20">
                <div className="space-y-6">
                    <div className="p-10 bg-slate-900 border border-white/5 rounded-[3rem] shadow-2xl">
                        <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] mb-10 italic">Case Overview</h4>
                        <div className="space-y-8">
                            <div className="flex justify-between items-end border-b border-white/5 pb-6">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Gross Billed</span>
                                <span className="text-3xl font-black text-white italic">${details.totalBill.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-white/5 pb-6">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Recoupable</span>
                                <span className="text-3xl font-black text-rose-500 italic">${details.totalErrors.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Earned Fee (20%)</span>
                                <span className="text-3xl font-black text-emerald-400 italic">${Math.round(details.totalErrors * 0.2).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {[
                            { id: 'audit', label: 'Clinical Audit', icon: ShieldCheck, count: details.errors.length },
                            { id: 'notes', label: 'Vault Comms', icon: MessageSquare, count: messages.length },
                            { id: 'letter', label: 'Legal Evidence', icon: Gavel }
                        ].map((tab) => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`w-full flex items-center justify-between px-8 py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-widest italic transition-all ${activeTab === tab.id ? 'bg-cyan-500 text-slate-950 shadow-2xl' : 'bg-slate-900/40 text-slate-500 hover:bg-slate-900'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <tab.icon size={20} />
                                    {tab.label}
                                </div>
                                {tab.count !== undefined && <span className="text-[9px] opacity-60">({tab.count})</span>}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-3">
                    {activeTab === 'audit' && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card className="p-10 bg-slate-900/60 border-white/5 rounded-[3rem]">
                                    <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.5em] mb-6 italic">Hospital Provider</h4>
                                    <p className="text-3xl font-black text-white uppercase italic tracking-tighter">{details.hospitalName}</p>
                                </Card>
                                <Card className="p-10 bg-slate-900/60 border-white/5 rounded-[3rem]">
                                    <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.5em] mb-6 italic">Audit Confidence</h4>
                                    <p className="text-3xl font-black text-white italic tracking-tighter">{details.accuracyScore}% Precision</p>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                {details.errors.map((err, i) => (
                                    <Card key={i} className="p-10 bg-slate-900/40 border-white/5 rounded-[3.5rem] grid grid-cols-1 md:grid-cols-[1fr_200px] gap-10 items-center">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                <Badge color="navy" className="px-4 py-1.5 font-mono text-[10px]">{err.code}</Badge>
                                                <h4 className="text-2xl font-black text-white uppercase italic tracking-tight">{err.description}</h4>
                                            </div>
                                            <p className="text-slate-400 text-lg italic leading-relaxed bg-black/20 p-8 rounded-3xl border border-white/5">
                                                "{err.reason}"
                                            </p>
                                            <div className="flex items-center gap-4 text-[10px] font-black text-cyan-400 uppercase tracking-widest italic">
                                                <AlertOctagon size={14} /> Violation: {err.regulatoryCitation}
                                            </div>
                                        </div>
                                        <div className="text-center md:text-right border-t md:border-t-0 md:border-l border-white/10 pt-10 md:pt-0 md:pl-10">
                                            <span className="text-5xl font-black text-rose-500 italic tracking-tighter block mb-2">${(err.amount - err.marketPrice).toLocaleString()}</span>
                                            <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest italic">Audit Delta</span>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'notes' && (
                        <div className="animate-fade-in bg-slate-900/40 border border-white/5 rounded-[4rem] h-[700px] flex flex-col overflow-hidden shadow-3xl">
                            <div className="flex-1 overflow-y-auto p-12 space-y-8 scrollbar-hide">
                                {messages.map((m, i) => (
                                    <div key={i} className={`flex flex-col ${m.sender === 'Advocate' ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-md p-8 rounded-[2.5rem] text-sm italic font-medium leading-relaxed ${m.sender === 'Advocate' ? 'bg-cyan-600 text-slate-950 rounded-tr-none' : 'bg-slate-800 text-slate-300 rounded-tl-none'}`}>
                                            {m.text}
                                        </div>
                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] italic mt-4">{m.sender} • {m.time}</span>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleSendMessage} className="p-8 bg-black/40 border-t border-white/5 flex gap-6">
                                <input className="flex-1 bg-slate-900 border border-white/10 rounded-2xl px-8 py-5 text-sm text-white focus:border-cyan-500 outline-none italic font-bold" placeholder="Secure clinical message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} />
                                <Button type="submit" variant="teal" className="w-20 h-20 p-0 rounded-2xl shrink-0"><Send /></Button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'letter' && (
                        <div className="animate-fade-in bg-white text-slate-950 p-24 rounded-[4rem] font-serif shadow-3xl relative overflow-hidden min-h-[900px]">
                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-12"><Gavel size={200} /></div>
                            <div className="relative z-10 whitespace-pre-wrap leading-relaxed text-xl italic pr-12">
                                {details.disputeLetterPreview}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const AdvocateDashboard = () => {
    const [leads, setLeads] = useState<AdvocateViewLead[]>([]);
    const [selectedLead, setSelectedLead] = useState<AdvocateViewLead | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await getAdvocateLeads();
            setLeads(data);
        } catch (e) {}
        setIsLoading(false);
    };

    const handleClaimCase = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await updateCaseStatus(id, 'In Progress');
        fetchData();
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredLeads = leads.filter(lead => {
        const query = searchTerm.toLowerCase();
        return (
            lead.firstName.toLowerCase().includes(query) ||
            lead.lastName.toLowerCase().includes(query) ||
            lead.id.toLowerCase().includes(query) ||
            lead.hospitalName?.toLowerCase().includes(query)
        );
    });

    const totalPotentialEarnings = leads.reduce((acc, lead) => acc + (lead.billValue * 0.2), 0);

    if(selectedLead) return <CaseCommandCenter lead={selectedLead} onClose={() => setSelectedLead(null)} />;

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans pt-48 pb-48 animate-fade-in relative overflow-x-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.1)_0%,transparent_70%)] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-8 relative z-10">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-12">
                    <div>
                        <div className="flex items-center gap-6 mb-4">
                            <div className="w-16 h-16 bg-cyan-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-cyan-600/20">
                                <TrendingUp className="text-white w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-2">Forensic <br/><span className="text-cyan-500">Pipeline.</span></h1>
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Node: Practitioner_A_01</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 w-full lg:w-auto">
                        <div className="relative group w-full md:w-96">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" size={22} />
                            <input 
                                type="text" 
                                placeholder="Search repository..." 
                                className="w-full bg-slate-900/50 backdrop-blur-3xl border-2 border-slate-800 rounded-3xl py-6 pl-16 pr-8 text-sm text-white font-black italic outline-none focus:border-cyan-500 transition-all placeholder:text-slate-700"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="h-20 border-white/10 text-slate-500 hover:text-white rounded-3xl" onClick={() => window.location.hash = ''}>
                            <LogOut className="mr-3" /> DISCONNECT
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
                    {[
                        { label: "Active Audits", val: leads.length, icon: Activity, color: "text-cyan-400" },
                        { label: "Unclaimed Assets", val: leads.filter(l => l.status === 'New').length, icon: ShieldAlert, color: "text-rose-500" },
                        { label: "Pipeline Value", val: `$${Math.round(leads.reduce((s,l) => s + l.billValue, 0)/1000)}k`, icon: DollarSign, color: "text-emerald-400" },
                        { label: "Potential Fees", val: `$${Math.round(totalPotentialEarnings/1000)}k`, icon: Award, color: "text-purple-400" }
                    ].map((m, i) => (
                        <Card key={i} className="bg-slate-900/40 border-white/5 p-10 rounded-[2.5rem] flex items-center gap-8 shadow-2xl backdrop-blur-xl">
                            <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center ${m.color}`}><m.icon size={28} /></div>
                            <div>
                                <p className="text-5xl font-black italic tracking-tighter leading-none mb-1">{m.val}</p>
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] italic leading-none">{m.label}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                <Card className="bg-slate-900/40 border-white/10 rounded-[4rem] overflow-hidden shadow-[0_64px_120px_rgba(0,0,0,0.5)] p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-950/90 text-slate-600 text-[10px] uppercase font-black tracking-[0.5em] italic border-b border-white/5">
                                <tr>
                                    <th className="p-12 pl-16">Patient Profile</th>
                                    <th className="p-12">Clinical Condition</th>
                                    <th className="p-12">Billed Value</th>
                                    <th className="p-12">Pipeline Status</th>
                                    <th className="p-12 pr-16 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="p-60 text-center">
                                            <div className="relative w-24 h-24 mx-auto mb-10">
                                                <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full animate-ping" />
                                                <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                                            </div>
                                            <p className="text-[12px] font-black uppercase text-slate-500 tracking-[0.8em] italic animate-pulse">Syncing Case Stream...</p>
                                        </td>
                                    </tr>
                                ) : filteredLeads.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-40 text-center">
                                            <p className="text-2xl font-black text-slate-700 uppercase italic tracking-tighter">No Active Matches Found</p>
                                        </td>
                                    </tr>
                                ) : filteredLeads.map(lead => (
                                    <tr key={lead.id} className="group hover:bg-cyan-500/[0.03] transition-all cursor-pointer border-l-[6px] border-l-transparent hover:border-l-cyan-500" onClick={() => setSelectedLead(lead)}>
                                        <td className="p-12 pl-16">
                                            <div className="font-black text-white text-3xl italic uppercase group-hover:text-cyan-400 tracking-tight leading-none mb-2 transition-colors">{lead.firstName} {lead.lastName}</div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] text-slate-600 font-black uppercase italic tracking-widest">{lead.state || 'US'}</span>
                                                <div className="w-1 h-1 bg-slate-800 rounded-full" />
                                                <span className="text-[10px] text-slate-600 font-mono italic">#{lead.id.slice(-8).toUpperCase()}</span>
                                            </div>
                                        </td>
                                        <td className="p-12">
                                            <Badge color="navy" className="bg-slate-950 border-none px-4 py-2 font-black italic uppercase text-[10px] tracking-widest">{lead.condition}</Badge>
                                        </td>
                                        <td className="p-12">
                                            <div className={`text-4xl font-black italic tracking-tighter ${lead.billValue > 10000 ? 'text-rose-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'text-white'}`}>
                                                ${lead.billValue.toLocaleString()}
                                            </div>
                                            <p className="text-[9px] text-slate-700 font-black uppercase italic mt-1 leading-none">Gross Clinical Claim</p>
                                        </td>
                                        <td className="p-12">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-3.5 h-3.5 rounded-full ${lead.status === 'New' ? 'bg-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]'}`} />
                                                <span className="text-[11px] font-black uppercase text-slate-300 italic tracking-[0.2em]">{lead.status === 'New' ? 'UNCLAIMED' : lead.status.toUpperCase()}</span>
                                            </div>
                                        </td>
                                        <td className="p-12 pr-16 text-right">
                                            <div className="flex items-center justify-end gap-4">
                                                {lead.status === 'New' && (
                                                    <Button 
                                                        variant="teal" 
                                                        className="h-14 px-6 text-[9px] rounded-xl"
                                                        onClick={(e) => handleClaimCase(lead.id, e)}
                                                    >
                                                        <UserPlus size={14} className="mr-2" /> CLAIM CASE
                                                    </Button>
                                                )}
                                                <Button variant="ghost" className="h-16 px-10 text-[11px] font-black italic uppercase tracking-[0.2em] group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all rounded-2xl">
                                                    DEPLOY AUDIT <ChevronRight className="ml-2 w-5 h-5" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};
