
import React, { useState } from 'react';
import { Users, Briefcase, FileText, Lock, ShieldCheck, Plus, ArrowLeft, Printer, Mail, Download, X, Search, Filter, MoreHorizontal, Clock, DollarSign, CheckCircle2, AlertOctagon, TrendingUp, Calendar, FileCode, MessageSquare, Trash2, ArrowRight, ThumbsUp, ThumbsDown, Send, Loader2, Zap, LogOut, RefreshCw } from 'lucide-react';
import { Button, Card, Badge } from './UI';
import { AdvocateViewLead, AnalysisResult, BillError } from '../types';
import { getAdvocateLeads, getBillDetails, updateCaseStatus } from '../services/integrationService';

export const AdvocateLogin = ({ onLogin }: { onLogin: () => void }) => {
    const [accessCode, setAccessCode] = useState('');
    const [isResetMode, setIsResetMode] = useState(false);
    const [email, setEmail] = useState('');
    const [resetSent, setResetSent] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (accessCode.toUpperCase() === "JUSTICE") onLogin();
        else alert("Invalid Code. Use 'JUSTICE' for Demo.");
    };

    const handleDemoAccess = () => onLogin();

    if (resetSent) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <Card className="max-w-md w-full p-12 text-center bg-slate-900 border-slate-800 shadow-2xl rounded-[3rem]">
                    <div className="w-16 h-16 bg-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="text-teal-500 w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">Request Received</h2>
                    <p className="text-slate-500 text-sm italic mb-10 leading-relaxed">Verification link sent to practitioner database.</p>
                    <Button fullWidth onClick={() => { setResetSent(false); }}>Back to Login</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <Card className="max-w-md w-full p-12 text-center bg-slate-900 border-slate-800 shadow-2xl rounded-[3rem]">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-8">
                    <Lock className="w-8 h-8 text-teal-500" />
                </div>
                
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">Advocate Portal</h2>
                <p className="text-slate-500 text-sm italic mb-10 leading-relaxed">Enter secure practitioner access code.</p>
                <form onSubmit={handleLogin} className="space-y-6">
                    <input 
                        type="password" 
                        required 
                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white focus:border-teal-500 outline-none transition-all italic text-sm" 
                        placeholder="Access Code" 
                        value={accessCode} 
                        onChange={e => setAccessCode(e.target.value)} 
                    />
                    <Button fullWidth type="submit">Sign In to Vault</Button>
                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                        <div className="relative flex justify-center text-[10px] uppercase font-black italic tracking-widest bg-slate-900 px-4 text-slate-700">or</div>
                    </div>
                    <Button fullWidth variant="outline" className="border-teal-500/30 text-teal-500 hover:bg-teal-500/10" onClick={handleDemoAccess}>
                        <Zap className="w-4 h-4 mr-2 fill-current" /> Instant Demo Access
                    </Button>
                </form>
            </Card>
        </div>
    );
};

const CaseCommandCenter = ({ lead, onClose }: { lead: AdvocateViewLead; onClose: () => void }) => {
    const [details, setDetails] = useState<AnalysisResult | null>(null);
    const [activeTab, setActiveTab] = useState<'audit' | 'notes' | 'letter'>('audit');
    const [messages, setMessages] = useState<{sender: string, text: string, time: string}[]>([
        { sender: 'System', text: 'Case opened. Triple-Pass AI Audit complete.', time: '10:00 AM' }
    ]);
    const [newMessage, setNewMessage] = useState("");
    const [currentStatus, setCurrentStatus] = useState(lead.status);

    React.useEffect(() => {
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
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-teal-500" />
            <p className="font-mono text-sm uppercase tracking-widest">Decrypting Case File...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans animate-fade-in pb-20">
             <div className="bg-slate-900/80 backdrop-blur-md p-4 border-b border-slate-800 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={onClose} className="p-2"><ArrowLeft /></Button>
                    <div>
                        <h2 className="text-xl font-bold">{lead.firstName} {lead.lastName}</h2>
                        <p className="text-[10px] text-slate-500 font-mono">REF: {lead.id} • {lead.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <select 
                        value={currentStatus} 
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold text-white outline-none focus:border-teal-500"
                    >
                        <option value="New">Status: New</option>
                        <option value="In Progress">Status: In Progress</option>
                        <option value="Closed">Status: Resolved</option>
                    </select>
                    <Button variant="outline" className="h-9 text-xs" onClick={() => window.print()}><Printer className="w-3 h-3 mr-2" /> Print Case</Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-8 px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="space-y-2">
                    <button onClick={() => setActiveTab('audit')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'audit' ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20' : 'text-slate-400 hover:bg-slate-900'}`}>
                        <div className="flex items-center gap-3"><ShieldCheck className="w-4 h-4" /> Clinical Audit</div>
                        <Badge color="white" className="px-1.5 py-0.5 text-[8px] opacity-50">{details.errors.length}</Badge>
                    </button>
                    <button onClick={() => setActiveTab('notes')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'notes' ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20' : 'text-slate-400 hover:bg-slate-900'}`}>
                        <MessageSquare className="w-4 h-4" /> Patient Comms
                    </button>
                    <button onClick={() => setActiveTab('letter')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'letter' ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20' : 'text-slate-400 hover:bg-slate-900'}`}>
                        <FileCode className="w-4 h-4" /> Evidence Pack
                    </button>
                </div>

                <div className="lg:col-span-3 space-y-8">
                    {activeTab === 'audit' && (
                        <div className="animate-fade-in space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="bg-slate-900 border-slate-800 p-6 md:p-8 rounded-3xl">
                                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] mb-2 italic">Gross Statement</p>
                                    <p className="text-3xl font-black text-white italic">${details.totalBill.toLocaleString()}</p>
                                </Card>
                                <Card className="bg-slate-900 border-slate-800 p-6 md:p-8 rounded-3xl">
                                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] mb-2 italic">Contestable Sum</p>
                                    <p className="text-3xl font-black text-rose-500 italic">-${details.totalErrors.toLocaleString()}</p>
                                </Card>
                                <Card className="bg-slate-900 border-slate-800 p-6 md:p-8 rounded-3xl">
                                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] mb-2 italic">Audit Integrity</p>
                                    <p className="text-3xl font-black text-teal-400 italic">{details.accuracyScore}%</p>
                                </Card>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-black uppercase italic tracking-tighter">Verified Citations</h3>
                                {details.errors.map((err, i) => (
                                    <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 flex flex-col md:grid md:grid-cols-[1fr_200px] gap-8 hover:bg-slate-900 transition-colors">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Badge color="navy" className="bg-slate-950 px-3 py-1 font-mono text-[9px]">{err.code}</Badge>
                                                <h4 className="font-black text-white text-xl italic uppercase tracking-tight">{err.description}</h4>
                                            </div>
                                            <p className="text-slate-400 text-sm italic leading-relaxed">{err.reason}</p>
                                            <div className="flex items-center gap-3">
                                                <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[9px] text-teal-500 font-mono flex items-center gap-2">
                                                    <ShieldCheck size={12} /> CITATION: {err.regulatoryCitation}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:border-l border-slate-800 md:pl-8 flex flex-col justify-center items-center md:items-end">
                                            <span className="text-3xl font-black text-rose-500 italic">${err.amount.toLocaleString()}</span>
                                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1 italic">Recoupable</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'notes' && (
                        <div className="animate-fade-in flex flex-col h-[600px] bg-slate-900 rounded-[3rem] border border-slate-800 overflow-hidden shadow-2xl">
                            <div className="flex-1 overflow-y-auto p-10 space-y-6">
                                {messages.map((m, i) => (
                                    <div key={i} className={`flex flex-col ${m.sender === 'Advocate' ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-md p-5 rounded-[1.5rem] text-sm italic ${m.sender === 'Advocate' ? 'bg-teal-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-300 rounded-tl-none shadow-lg'}`}>
                                            {m.text}
                                        </div>
                                        <span className="text-[9px] text-slate-600 mt-2 font-black uppercase tracking-[0.2em] italic">{m.sender} • {m.time}</span>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleSendMessage} className="p-6 bg-slate-950 border-t border-slate-800 flex gap-4">
                                <input className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-teal-500 outline-none italic" placeholder="Secure clinical message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} />
                                <Button type="submit" className="p-4 w-16 h-16 rounded-2xl"><Send className="w-5 h-5" /></Button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'letter' && (
                        <div className="animate-fade-in bg-white text-slate-900 p-16 rounded-[3rem] font-serif shadow-2xl relative">
                            <div className="absolute top-10 right-10 flex gap-2 no-print">
                                <Button variant="secondary" className="h-10 px-4 text-[9px]" onClick={() => window.print()}><Printer size={14} className="mr-2"/>Print</Button>
                                <Button variant="teal" className="h-10 px-4 text-[9px]"><Download size={14} className="mr-2"/>Export PDF</Button>
                            </div>
                            <div className="whitespace-pre-wrap leading-relaxed text-base italic">
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
        const data = await getAdvocateLeads();
        setLeads(data);
        setIsLoading(false);
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const filteredLeads = leads.filter(lead => {
        const query = searchTerm.toLowerCase();
        return (
            lead.firstName.toLowerCase().includes(query) ||
            lead.lastName.toLowerCase().includes(query) ||
            lead.email.toLowerCase().includes(query) ||
            lead.id.toLowerCase().includes(query)
        );
    });

    if(selectedLead) return <CaseCommandCenter lead={selectedLead} onClose={() => setSelectedLead(null)} />;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 animate-fade-in bg-slate-950 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
                <div>
                    <h2 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase italic">Forensic Pipeline</h2>
                    <p className="text-slate-500 font-medium italic opacity-70">Authenticated practitioner access • {leads.length} Active Cases</p>
                </div>
                
                {/* FORENSIC SEARCH BAR */}
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-500 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search Name, Email, or Case ID..." 
                        className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl py-5 pl-16 pr-6 text-sm text-white font-bold italic outline-none focus:border-teal-500/50 transition-all placeholder:text-slate-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-4">
                    <Button variant="ghost" className="text-slate-500" onClick={fetchData}><RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /></Button>
                    <Button variant="outline" className="border-slate-800 text-slate-400" onClick={() => window.location.hash = ''}>
                        <LogOut className="w-4 h-4 mr-2" /> Disconnect
                    </Button>
                </div>
            </div>

            <Card className="bg-slate-900/40 border border-slate-800 rounded-[3rem] overflow-hidden shadow-3xl p-0">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-950/90 text-slate-500 text-[10px] uppercase font-black tracking-[0.4em] italic border-b border-slate-800">
                        <tr>
                            <th className="p-10">Patient Profile</th>
                            <th className="p-10">Audit Scope</th>
                            <th className="p-10">Bill Value</th>
                            <th className="p-10">Priority Status</th>
                            <th className="p-10 text-right">Verification</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                        {isLoading ? (
                             <tr>
                                <td colSpan={5} className="p-32 text-center">
                                    <Loader2 className="w-16 h-16 animate-spin mx-auto text-teal-500" />
                                    <p className="mt-6 text-[10px] font-black uppercase text-slate-600 tracking-[0.4em] italic">Syncing HIPAA Vault...</p>
                                </td>
                             </tr>
                        ) : filteredLeads.length === 0 ? (
                             <tr>
                                <td colSpan={5} className="p-32 text-center">
                                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-500">
                                        <Search size={32} />
                                    </div>
                                    <p className="text-[10px] font-black uppercase text-slate-600 tracking-[0.4em] italic">No Matches Found in Repository</p>
                                </td>
                             </tr>
                        ) : filteredLeads.map(lead => (
                            <tr key={lead.id} className="group hover:bg-teal-500/[0.03] transition-all cursor-pointer" onClick={() => setSelectedLead(lead)}>
                                <td className="p-10">
                                    <div className="font-black text-white text-2xl italic uppercase group-hover:text-teal-400 tracking-tight leading-none mb-1">{lead.firstName} {lead.lastName}</div>
                                    <div className="text-[10px] text-slate-500 font-mono">{lead.email}</div>
                                </td>
                                <td className="p-10">
                                    <Badge color="purple" className="py-2 px-5 font-black bg-purple-500/10 border-none text-purple-400">{lead.condition}</Badge>
                                </td>
                                <td className="p-10">
                                    <div className={`text-2xl font-black italic tracking-tighter ${lead.billValue > 50000 ? 'text-rose-500 animate-pulse' : 'text-slate-200'}`}>
                                        ${lead.billValue.toLocaleString()}
                                    </div>
                                    <p className="text-[9px] text-slate-600 font-black uppercase mt-1 italic">Gross Balance</p>
                                </td>
                                <td className="p-10">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-3 h-3 rounded-full ${lead.status === 'New' ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]' : lead.status === 'Closed' ? 'bg-slate-600' : 'bg-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.5)]'}`} />
                                        <span className="text-[11px] font-black uppercase text-slate-300 italic tracking-widest">{lead.status}</span>
                                    </div>
                                </td>
                                <td className="p-10 text-right">
                                    <Button variant="ghost" className="text-teal-400 hover:text-white group-hover:translate-x-3 transition-all h-14">
                                        Review Audit <ArrowRight className="ml-3 w-5 h-5" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};
