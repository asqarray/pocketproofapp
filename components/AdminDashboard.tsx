
import React, { useState, useEffect, useMemo } from 'react';
import { 
    Activity, Shield, Users, DollarSign, TrendingUp, BarChart3, AlertTriangle, 
    Zap, Globe, Search, RefreshCw, Landmark, ShieldAlert, Target, Info, ArrowUpRight, ArrowRight,
    CheckCircle, List, ShieldCheck, Database, Cpu, MessageSquare, ChevronRight, Clock, Award, Rocket, Heart,
    Server, Activity as PulseIcon, Key, Network, Filter, Eye, FileText, ChevronDown, Trash2, X
} from 'lucide-react';
import { Button, Card, Badge } from './UI';
import { getGlobalPlatformStats, getAdvocateLeads, checkSystemIntegrity, getBillDetails, updateCaseStatus } from '../services/integrationService';
import { PlatformStats, AdvocateViewLead, AnalysisResult } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminDashboard = () => {
    const [stats, setStats] = useState<PlatformStats | null>(null);
    const [leads, setLeads] = useState<AdvocateViewLead[]>([]);
    const [loading, setLoading] = useState(true);
    const [accessGranted, setAccessGranted] = useState(false);
    const [accessCode, setAccessCode] = useState('');
    const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'integrity'>('overview');
    const [health, setHealth] = useState<any>(null);
    
    // Search and Filter State
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [selectedBill, setSelectedBill] = useState<AnalysisResult | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsData, leadsData, healthData] = await Promise.all([
                getGlobalPlatformStats(),
                getAdvocateLeads(),
                checkSystemIntegrity()
            ]);
            setStats(statsData);
            setLeads(leadsData);
            setHealth(healthData);
        } catch (e) {
            console.error("Admin sync failed", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (accessGranted) fetchData();
    }, [accessGranted]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (accessCode.toUpperCase() === "ADMIN_PLATFORM_V1") setAccessGranted(true);
        else alert("Unauthorized. Master Key Required.");
    };

    const handleViewBill = async (billId: string) => {
        const details = await getBillDetails(billId);
        setSelectedBill(details);
    };

    const handleDeleteLead = async (id: string) => {
        if(confirm("Permanently purge this clinical lead? This action is IRREVERSIBLE.")) {
            // In a real app, you'd call a delete service. For now, we update status to 'Closed'
            await updateCaseStatus(id, 'Closed');
            fetchData();
        }
    };

    // Computed Values
    const filteredLeads = useMemo(() => {
        return leads.filter(l => {
            const matchesSearch = 
                l.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                l.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                l.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                l.id.includes(searchTerm);
            
            const matchesStatus = statusFilter === "ALL" || l.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
    }, [leads, searchTerm, statusFilter]);

    const projectedFees = useMemo(() => {
        if (!stats) return 0;
        return stats.totalSavingsFound * 0.20; // 20% platform cut
    }, [stats]);

    if (!accessGranted) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.05)_0%,transparent_70%)]" />
                <Card className="max-w-md w-full p-12 bg-slate-900/50 border-rose-500/20 backdrop-blur-3xl shadow-[0_0_100px_rgba(239,68,68,0.1)] rounded-[3rem] text-center relative z-10">
                    <div className="w-24 h-24 bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-rose-500/20 shadow-inner">
                        <ShieldAlert className="text-rose-500 w-12 h-12 animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Vanguard Access</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-12 italic">Platform Authorization Required</p>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="relative">
                            <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                            <input 
                                autoFocus
                                type="password"
                                placeholder="MASTER KEY"
                                className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl p-6 pl-16 text-center text-white font-black tracking-[0.6em] outline-none focus:border-rose-500 transition-all text-sm"
                                value={accessCode}
                                onChange={e => setAccessCode(e.target.value)}
                            />
                        </div>
                        <Button fullWidth variant="danger" type="submit" className="h-20 shadow-2xl shadow-rose-500/20">AUTHORIZE ACCESS</Button>
                    </form>
                    <p className="mt-8 text-[9px] font-black uppercase text-slate-800 tracking-widest italic leading-none">V1.0.4-PROD • forensic_node_auth</p>
                </Card>
            </div>
        );
    }

    if (loading || !stats) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
                <div className="relative w-24 h-24 mb-12">
                    <div className="absolute inset-0 border-4 border-rose-500/10 rounded-full animate-ping" />
                    <div className="absolute inset-0 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Target className="text-rose-500 w-8 h-8" />
                    </div>
                </div>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.8em] italic animate-pulse">Syncing Network Nodes...</p>
            </div>
        );
    }

    const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-rose-500/20 pb-32 overflow-x-hidden">
            <div className="absolute top-0 left-0 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.05)_0%,transparent_70%)] pointer-events-none" />

            {/* TACTICAL HEADER */}
            <header className="h-28 bg-slate-950/80 backdrop-blur-3xl border-b border-white/5 px-10 flex items-center justify-between sticky top-0 z-[100] shadow-2xl">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-rose-600 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.3)] border border-rose-400/20">
                        <Target size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none mb-1">Vanguard <span className="text-rose-500">Command</span></h1>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em] italic leading-none">Node: {health?.env || "STABLE"} • {new Date().toLocaleTimeString()}</span>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-2 bg-slate-900 border border-white/10 p-1.5 rounded-3xl shadow-inner">
                    {[
                        { id: 'overview', label: 'Overview', icon: BarChart3 },
                        { id: 'leads', label: 'Pipeline', icon: Users },
                        { id: 'integrity', label: 'Integrity', icon: ShieldCheck }
                    ].map((t) => (
                        <button 
                            key={t.id}
                            onClick={() => setActiveTab(t.id as any)}
                            className={`px-10 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest italic transition-all flex items-center gap-3 ${activeTab === t.id ? 'bg-rose-600 text-white shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                        >
                            <t.icon size={16} />
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-6">
                    <Button variant="ghost" onClick={fetchData} className="w-14 h-14 bg-white/5 rounded-2xl border border-white/10 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all">
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </Button>
                    <div className="h-14 w-14 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center font-black text-xl italic">A</div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-8 py-16">
                
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="space-y-12 animate-fade-in">
                        {/* KPI GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { label: "Total Identified Capital", val: fmt(stats.totalSavingsFound), icon: DollarSign, color: "text-emerald-400" },
                                { label: "Projected Platform Fees", val: fmt(projectedFees), icon: TrendingUp, color: "text-cyan-400" },
                                { label: "Forensic Audit Success", val: `${Math.round(stats.avgConfidence)}%`, icon: Award, color: "text-rose-400" },
                                { label: "Active Advocacy Rate", val: `${Math.round(stats.conversionRate)}%`, icon: Users, color: "text-purple-400" }
                            ].map((s, i) => {
                                const Icon = s.icon;
                                return (
                                    <Card key={i} className="bg-slate-900/40 border-white/5 p-12 flex flex-col justify-between h-72 rounded-[3rem] shadow-2xl relative group overflow-hidden hover:border-white/20 transition-all">
                                        <div className={`absolute -top-10 -right-10 p-12 opacity-[0.03] group-hover:scale-110 transition-transform ${s.color}`}><Icon size={220} /></div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-8 italic leading-none">{s.label}</p>
                                            <p className="text-5xl font-black text-white italic tracking-tighter leading-none">{s.val}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full animate-pulse ${i === 0 ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                                            <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] italic leading-none">Live Metric Sync</span>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>

                        {/* CHARTS AND LISTS */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            <Card className="lg:col-span-8 bg-slate-900/20 border-white/5 p-12 rounded-[4rem] shadow-3xl min-h-[550px] flex flex-col">
                                <div className="flex justify-between items-start mb-16">
                                    <div>
                                        <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Recovery Throughput</h3>
                                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] italic">Forensic Accuracy vs Volume (30D)</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <Badge color="red" className="px-6 py-2">Node_01</Badge>
                                        <Badge color="navy" className="px-6 py-2 bg-slate-950 border-white/5">AES-256</Badge>
                                    </div>
                                </div>
                                <div className="flex-1 w-full -ml-8">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={[
                                            { name: 'D1', val: 42000, acc: 88 },
                                            { name: 'D5', val: 38000, acc: 92 },
                                            { name: 'D10', val: 65000, acc: 84 },
                                            { name: 'D15', val: 72000, acc: 95 },
                                            { name: 'D20', val: 89000, acc: 91 },
                                            { name: 'D25', val: 125000, acc: 98 },
                                            { name: 'D30', val: 148000, acc: 99 },
                                        ]}>
                                            <defs>
                                                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                                                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                                                </linearGradient>
                                                <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.2}/>
                                                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} strokeOpacity={0.3} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 900}} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 900}} tickFormatter={(v) => `$${v/1000}k`} />
                                            <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '1.5rem', fontFamily: 'Inter', fontSize: '12px', color: '#fff' }} itemStyle={{ color: '#fff', fontWeight: 900 }} />
                                            <Area type="monotone" dataKey="val" stroke="#EF4444" strokeWidth={6} fillOpacity={1} fill="url(#colorVal)" name="Savings Found" />
                                            <Area type="monotone" dataKey="acc" stroke="#06B6D4" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" name="Accuracy Index" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            <Card className="lg:col-span-4 bg-slate-900/20 border-white/5 p-12 rounded-[4rem] shadow-3xl min-h-[550px] flex flex-col">
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-12 flex items-center gap-4">
                                    <AlertTriangle className="text-rose-500" size={24} /> 
                                    Top Violators
                                </h3>
                                <div className="space-y-10 flex-1 overflow-y-auto pr-4 scrollbar-hide">
                                    {stats.topOffendingHospitals.map((h, i) => (
                                        <div key={i} className="flex justify-between items-center group cursor-pointer border-b border-white/5 pb-8">
                                            <div className="flex-1 mr-6">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">{h.violations} Audits</span>
                                                </div>
                                                <h4 className="font-black text-base uppercase italic tracking-tight group-hover:text-rose-500 transition-colors leading-tight">{h.name}</h4>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-2xl font-black text-white italic block leading-none mb-1">{fmt(h.value)}</span>
                                                <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em] italic">Net Overcharge</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 pt-8 border-t border-white/5">
                                    <Button variant="outline" fullWidth className="h-16 border-white/10 text-slate-500 hover:text-white rounded-2xl">Download Violator Report</Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* PIPELINE / LEADS TAB */}
                {activeTab === 'leads' && (
                    <div className="animate-fade-in space-y-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
                            <div className="space-y-4">
                                <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.85]">Forensic <br/><span className="text-rose-500">Pipeline.</span></h2>
                                <p className="text-slate-500 text-xl italic font-medium max-w-2xl">High-value representation queue. Vetted leads requiring deployment.</p>
                            </div>
                            
                            <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
                                <div className="relative w-full md:w-96 group">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-rose-500 transition-colors" size={20} />
                                    <input 
                                        type="text" 
                                        placeholder="Search cases, hospital, or patients..." 
                                        className="w-full bg-slate-900 border-2 border-slate-800 rounded-3xl p-5 pl-16 text-sm font-black italic text-white outline-none focus:border-rose-500 transition-all placeholder:text-slate-700"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select 
                                    className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-5 px-10 text-[10px] font-black uppercase italic tracking-widest text-white outline-none focus:border-rose-500 transition-all appearance-none cursor-pointer"
                                    value={statusFilter}
                                    onChange={e => setStatusFilter(e.target.value)}
                                >
                                    <option value="ALL">All Status</option>
                                    <option value="New">Unclaimed</option>
                                    <option value="In Progress">Active</option>
                                    <option value="Closed">Recovered</option>
                                </select>
                            </div>
                        </div>

                        <Card className="bg-slate-900/40 border-white/10 p-0 rounded-[4rem] overflow-hidden shadow-[0_64px_120px_rgba(0,0,0,0.5)]">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-950/90 border-b border-white/10">
                                        <tr>
                                            <th className="p-12 pl-16 text-[10px] font-black uppercase tracking-[0.6em] italic text-slate-500">Subject Identity</th>
                                            <th className="p-12 text-[10px] font-black uppercase tracking-[0.6em] italic text-slate-500">Audit Status</th>
                                            <th className="p-12 text-[10px] font-black uppercase tracking-[0.6em] italic text-slate-500">Clinical Value</th>
                                            <th className="p-12 pr-16 text-right text-[10px] font-black uppercase tracking-[0.6em] italic text-slate-500">Command</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredLeads.length > 0 ? filteredLeads.map(l => (
                                            <tr key={l.id} className="hover:bg-rose-500/[0.03] transition-all group">
                                                <td className="p-12 pl-16">
                                                    <div className="flex items-center gap-8">
                                                        <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center font-black italic text-white text-2xl border border-white/10 shadow-inner group-hover:border-rose-500/30 transition-all">{l.firstName[0]}</div>
                                                        <div>
                                                            <h4 className="font-black text-white text-3xl italic uppercase tracking-tighter group-hover:text-rose-500 transition-colors leading-none mb-2">{l.firstName} {l.lastName}</h4>
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-[10px] text-slate-600 font-black uppercase italic tracking-widest">{l.state || 'US'}</span>
                                                                <div className="w-1 h-1 bg-slate-800 rounded-full" />
                                                                <span className="text-[10px] text-slate-600 font-mono italic">REF_{l.id.slice(-6).toUpperCase()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-12">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-3 h-3 rounded-full ${l.status === 'New' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`} />
                                                            <span className="text-[11px] font-black uppercase italic tracking-widest text-slate-300">{l.status.toUpperCase()}</span>
                                                        </div>
                                                        <Badge color="navy" className="bg-slate-950 border-white/5 px-3 py-1 text-[8px] italic tracking-[0.2em]">{l.hospitalName || "UNSPECIFIED PROVIDER"}</Badge>
                                                    </div>
                                                </td>
                                                <td className="p-12">
                                                    <div className="flex flex-col">
                                                        <span className="text-4xl font-black text-white italic tracking-tighter leading-none mb-2">${l.billValue.toLocaleString()}</span>
                                                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest italic">Gross Claim Value</span>
                                                    </div>
                                                </td>
                                                <td className="p-12 pr-16 text-right">
                                                    <div className="flex items-center justify-end gap-4">
                                                        <button 
                                                            onClick={() => handleViewBill(l.linkId)} 
                                                            className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/10 hover:text-cyan-400 transition-all"
                                                            title="View Audit Details"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteLead(l.id)} 
                                                            className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:bg-rose-500/20 hover:text-rose-500 transition-all"
                                                            title="Purge Lead"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                        <Button variant="ghost" className="h-16 px-10 text-[11px] font-black uppercase italic tracking-widest bg-white/5 border border-white/10 group-hover:bg-rose-600 group-hover:text-white transition-all rounded-2xl">
                                                            DEPLOY COMMAND <ChevronRight className="ml-2 w-5 h-5" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={4} className="p-40 text-center">
                                                    <div className="flex flex-col items-center gap-6 opacity-20">
                                                        <Network size={64} className="animate-pulse" />
                                                        <p className="text-2xl font-black uppercase italic tracking-tighter">No Active Signals Detected</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                )}

                {/* SYSTEM INTEGRITY TAB */}
                {activeTab === 'integrity' && (
                    <div className="animate-fade-in space-y-12">
                         <div className="flex flex-col md:flex-row justify-between items-end gap-12">
                            <div className="space-y-4">
                                <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.85]">Health <br/><span className="text-emerald-500">Monitor.</span></h2>
                                <p className="text-slate-500 text-xl italic font-medium max-w-2xl">Real-time validation of Gemini reasoning engine and Firebase data nodes.</p>
                            </div>
                            <Badge color="green" className="px-8 py-3 italic font-black text-sm">UPTIME: 99.998%</Badge>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* GEMINI NODE */}
                            <Card className="p-12 border-white/5 bg-slate-900/20 rounded-[4rem] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform"><Cpu size={200} /></div>
                                <div className="relative z-10">
                                    <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-10 border border-emerald-500/20">
                                        <Cpu className="text-emerald-500" size={40} />
                                    </div>
                                    <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Gemini-3 Pro</h3>
                                    <p className="text-slate-500 text-sm font-medium italic mb-12">Core forensic reasoning engine. Processes multi-modal clinical audits with 24k thinking budget.</p>
                                    
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center bg-slate-950 p-6 rounded-2xl border border-white/5">
                                            <span className="text-[10px] font-black uppercase italic text-slate-400">Status</span>
                                            <span className="text-[11px] font-black uppercase text-emerald-500 tracking-widest italic">Node_Responsive</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-slate-950 p-6 rounded-2xl border border-white/5">
                                            <span className="text-[10px] font-black uppercase italic text-slate-400">Latency</span>
                                            <span className="text-[11px] font-black uppercase text-emerald-500 tracking-widest italic">1.2s avg</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* FIREBASE NODE */}
                            <Card className="p-12 border-white/5 bg-slate-900/20 rounded-[4rem] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform"><Database size={200} /></div>
                                <div className="relative z-10">
                                    <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center mb-10 border border-cyan-500/20">
                                        <Database className="text-cyan-400" size={40} />
                                    </div>
                                    <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Cloud Persistence</h3>
                                    <p className="text-slate-500 text-sm font-medium italic mb-12">Distributed Firestore storage for anonymized clinical audits and advocate lead streams.</p>
                                    
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center bg-slate-950 p-6 rounded-2xl border border-white/5">
                                            <span className="text-[10px] font-black uppercase italic text-slate-400">Connection</span>
                                            <span className="text-[11px] font-black uppercase text-emerald-500 tracking-widest italic">Encrypted_TLS_1.3</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-slate-950 p-6 rounded-2xl border border-white/5">
                                            <span className="text-[10px] font-black uppercase italic text-slate-400">Sync Rate</span>
                                            <span className="text-[11px] font-black uppercase text-emerald-500 tracking-widest italic">Real-time Push</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* SECURITY AUDIT */}
                            <Card className="p-12 border-white/5 bg-slate-900/20 rounded-[4rem] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform"><ShieldCheck size={200} /></div>
                                <div className="relative z-10">
                                    <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mb-10 border border-rose-500/20">
                                        <ShieldCheck className="text-rose-500" size={40} />
                                    </div>
                                    <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">HIPAA Compliance</h3>
                                    <p className="text-slate-500 text-sm font-medium italic mb-12">Automated PII/PHI sanitization protocols. Deterministic regex-based masking logic.</p>
                                    
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center bg-slate-950 p-6 rounded-2xl border border-white/5">
                                            <span className="text-[10px] font-black uppercase italic text-slate-400">Sanitization</span>
                                            <span className="text-[11px] font-black uppercase text-emerald-500 tracking-widest italic">Active_Mandatory</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-slate-950 p-6 rounded-2xl border border-white/5">
                                            <span className="text-[10px] font-black uppercase italic text-slate-400">Audit Logs</span>
                                            <span className="text-[11px] font-black uppercase text-emerald-500 tracking-widest italic">Worm_Persistence</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
            </div>

            {/* BILL MODAL OVERLAY */}
            {selectedBill && (
                <div className="fixed inset-0 z-[200] bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center p-6 md:p-12 animate-fade-in overflow-y-auto">
                    <Card className="max-w-4xl w-full bg-slate-900 border-white/10 p-12 md:p-20 rounded-[4rem] relative shadow-3xl h-auto my-auto">
                        <button onClick={() => setSelectedBill(null)} className="absolute top-12 right-12 p-4 bg-white/5 rounded-2xl hover:bg-rose-500 transition-all text-white"><X size={32} /></button>
                        
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-16 border-b border-white/10 pb-16">
                            <div className="space-y-4">
                                <Badge color="red" className="px-6 py-2">Forensic Artifact</Badge>
                                <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">{selectedBill.hospitalName}</h2>
                                <p className="text-slate-500 text-lg font-black italic uppercase tracking-widest">Audit Ref: {selectedBill.billId}</p>
                            </div>
                            <div className="text-left md:text-right">
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1 italic">Total Billed</span>
                                <span className="text-6xl font-black italic">${selectedBill.totalBill.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-10">
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-6 italic">Forensic Summary</h4>
                                    <p className="text-2xl font-black text-white italic leading-tight tracking-tight border-l-4 border-rose-500 pl-8 opacity-90">"{selectedBill.summary}"</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-6 italic">Recovery Potential</h4>
                                    <p className="text-5xl font-black text-emerald-400 italic tracking-tighter">${(selectedBill.totalErrors + selectedBill.totalAid).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="bg-slate-950 p-10 rounded-[3rem] border border-white/5 space-y-6">
                                <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Internal Reasoning Node</h4>
                                <div className="space-y-4">
                                    {selectedBill.errors.map((e, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-xs border-b border-white/5 pb-4">
                                            <span className="text-slate-500 italic font-bold">{e.code} - {e.description.slice(0, 20)}...</span>
                                            <span className="text-rose-500 font-black">${(e.amount - e.marketPrice).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-16 flex justify-end">
                            <Button variant="teal" onClick={() => window.print()} className="h-20 px-16 text-xl">Print Forensic Evidence</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};
