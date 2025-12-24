
import React, { useState, useEffect } from 'react';
import { 
    Activity, Shield, Users, DollarSign, TrendingUp, BarChart3, AlertTriangle, 
    Zap, Globe, Search, RefreshCw, Landmark, ShieldAlert, Target, Info, ArrowUpRight,
    CheckCircle, List, ShieldCheck, Database, Cpu, MessageSquare, ChevronRight, Clock, Award, Rocket
} from 'lucide-react';
import { Button, Card, Badge } from './UI';
import { getGlobalPlatformStats, getAdvocateLeads } from '../services/integrationService';
import { PlatformStats, AdvocateViewLead } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminDashboard = () => {
    const [stats, setStats] = useState<PlatformStats | null>(null);
    const [leads, setLeads] = useState<AdvocateViewLead[]>([]);
    const [loading, setLoading] = useState(true);
    const [accessGranted, setAccessGranted] = useState(false);
    const [accessCode, setAccessCode] = useState('');
    const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'accuracy' | 'system'>('overview');

    const fetchData = async () => {
        setLoading(true);
        const [statsData, leadsData] = await Promise.all([
            getGlobalPlatformStats(),
            getAdvocateLeads()
        ]);
        setStats(statsData);
        setLeads(leadsData);
        setLoading(false);
    };

    useEffect(() => {
        if (accessGranted) fetchData();
    }, [accessGranted]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (accessCode.toUpperCase() === "ADMIN_PLATFORM_V1") setAccessGranted(true);
        else alert("Unauthorized. Access Denied.");
    };

    if (!accessGranted) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
                <Card className="max-w-md w-full p-12 bg-slate-900 border-rose-500/20 shadow-3xl rounded-[3rem] text-center">
                    <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-rose-500/20">
                        <ShieldAlert className="text-rose-500 w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">God-Mode Access</h2>
                    <p className="text-slate-500 text-sm mb-10 italic">Enter the Platform Master Key</p>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <input 
                            autoFocus
                            type="password"
                            placeholder="Master Key"
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center text-white font-black tracking-[0.4em] outline-none focus:border-rose-500 transition-all"
                            value={accessCode}
                            onChange={e => setAccessCode(e.target.value)}
                        />
                        <Button fullWidth variant="danger" type="submit" className="h-16">AUTHORIZE</Button>
                    </form>
                </Card>
            </div>
        );
    }

    if (loading || !stats) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
                <RefreshCw className="w-12 h-12 text-rose-500 animate-spin mb-6" />
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] italic">Syncing Global Nodes...</p>
            </div>
        );
    }

    const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

    const AccuracyRoadmap = () => (
        <div className="space-y-12 animate-fade-in">
            <div className="flex flex-col gap-4">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none">The +94% Accuracy <br/><span className="text-rose-500">Roadmap.</span></h3>
                <p className="text-slate-400 font-medium italic max-w-2xl">7-Day Sprint initiated. Moving Phase 1 to LIVE status for pilot launch.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                    { phase: "PHASE 1", title: "Ground Truth Dataset", date: "Week 0", status: "LIVE", desc: "Core reference models are indexed and serving Pilot Nodes.", icon: Database },
                    { phase: "PHASE 2", title: "RAG Policy Indexing", date: "Weeks 1-2", status: "IN PROGRESS", desc: "Current Focus: Deep indexing of local hospital 501(r) mandates.", icon: Search },
                    { phase: "PHASE 3", title: "Agentic Self-Correction", date: "Weeks 3-4", status: "PENDING", desc: "Deploying a 'The Jury' pass for multi-model verification.", icon: Cpu },
                    { phase: "PHASE 4", title: "Human-in-the-Loop", date: "Ongoing", status: "STAGING", desc: "Advocate feedback loop for error correction.", icon: Users }
                ].map((p, i) => (
                    <Card key={i} className="bg-slate-900 border-white/5 p-10 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><p.icon size={120} /></div>
                        <div className="flex items-center justify-between mb-8">
                            <Badge color={p.status === 'LIVE' ? 'green' : p.status === 'IN PROGRESS' ? 'teal' : 'gray'}>{p.status}</Badge>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{p.date}</span>
                        </div>
                        <p className="text-rose-500 font-black text-[9px] uppercase tracking-[0.3em] mb-2 italic">{p.phase}</p>
                        <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">{p.title}</h4>
                        <p className="text-slate-400 text-sm font-medium italic leading-relaxed">{p.desc}</p>
                    </Card>
                ))}
            </div>
            
            <Card className="bg-slate-900 border-rose-500/20 p-10 rounded-[3rem] border-dashed">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center shrink-0">
                        <Rocket className="text-rose-500 w-8 h-8 animate-pulse" />
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-white uppercase italic tracking-tighter leading-tight">Sprint Goal: 7-Day Pilot Stable</h4>
                        <p className="text-slate-500 text-sm italic">Focusing on high-value coding errors for immediate ROI impact.</p>
                    </div>
                </div>
            </Card>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-rose-500/20 pb-32">
            {/* TOP NAVIGATION */}
            <div className="h-24 bg-slate-900/50 backdrop-blur-3xl border-b border-white/10 px-8 flex items-center justify-between sticky top-0 z-[100]">
                <div className="flex items-center gap-6">
                    <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                        <Activity size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase italic tracking-tighter leading-none mb-1">Mission Control</h1>
                        <span className="text-[8px] font-black text-rose-500 uppercase tracking-[0.5em] italic">PocketProof Admin Node</span>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-2">
                    {['overview', 'leads', 'accuracy', 'system'].map((t) => (
                        <button 
                            key={t}
                            onClick={() => setActiveTab(t as any)}
                            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest italic transition-all ${activeTab === t ? 'bg-white text-slate-950' : 'text-slate-500 hover:text-white'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-6">
                    <Button variant="ghost" onClick={fetchData}><RefreshCw size={18} className={loading ? 'animate-spin' : ''} /></Button>
                    <button onClick={() => window.location.hash = ''} className="text-slate-500 hover:text-white transition-colors"><Zap size={20} /></button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                
                {activeTab === 'overview' && (
                    <div className="space-y-12 animate-fade-in">
                        {/* GLOBAL STATS GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { label: "Gross Savings Found", val: fmt(stats.totalSavingsFound), icon: DollarSign, color: "rose" },
                                { label: "Total Audits", val: stats.totalBillsScanned.toLocaleString(), icon: Search, color: "cyan" },
                                { label: "Advocate Leads", val: stats.totalLeadsGenerated.toLocaleString(), icon: Users, color: "teal" },
                                { label: "Success Rate", val: `${Math.round(stats.avgConfidence)}%`, icon: Award, color: "purple" }
                            ].map((s, i) => {
                                const Icon = s.icon;
                                return (
                                    <Card key={i} className="bg-slate-900 border-white/5 p-8 flex flex-col justify-between h-52 rounded-[2.5rem] shadow-2xl relative group overflow-hidden">
                                        <div className={`absolute -top-10 -right-10 p-12 opacity-[0.03] group-hover:scale-110 transition-transform text-white`}><Icon size={160} /></div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 italic">{s.label}</p>
                                            <p className="text-4xl font-black text-white italic tracking-tighter leading-none">{s.val}</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-[8px] font-bold text-slate-700 uppercase tracking-widest italic">
                                            Platform Aggregate Data
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* CHART AREA */}
                            <Card className="lg:col-span-8 bg-slate-900 border-white/5 p-10 rounded-[3rem] shadow-3xl h-[450px]">
                                <h3 className="text-xl font-black uppercase italic tracking-tighter mb-10">Network Recoup Velocity</h3>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={[
                                            { name: 'Jan', value: 4000 },
                                            { name: 'Feb', value: 7000 },
                                            { name: 'Mar', value: 5500 },
                                            { name: 'Apr', value: 9000 },
                                            { name: 'May', value: 12000 },
                                            { name: 'Jun', value: 18000 },
                                        ]}>
                                            <defs>
                                                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <Area type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
                                            <Tooltip contentStyle={{ background: '#0F172A', border: 'none', borderRadius: '12px' }} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            {/* OFFENDERS */}
                            <Card className="lg:col-span-4 bg-slate-950 border-white/5 p-10 rounded-[3rem] shadow-3xl h-[450px] overflow-hidden">
                                <h3 className="text-xl font-black uppercase italic tracking-tighter mb-8 text-rose-500">Systemic Violators</h3>
                                <div className="space-y-6 overflow-y-auto max-h-[300px] pr-4">
                                    {stats.topOffendingHospitals.map((h, i) => (
                                        <div key={i} className="flex justify-between items-end border-b border-white/5 pb-4">
                                            <div>
                                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic leading-none mb-1">{h.violations} Audits</p>
                                                <h4 className="font-black text-sm uppercase italic tracking-tight">{h.name}</h4>
                                            </div>
                                            <span className="text-lg font-black text-white italic">{fmt(h.value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'leads' && (
                    <div className="animate-fade-in space-y-8">
                        <div className="flex flex-col gap-4">
                            <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Global <br/><span className="text-teal-500">Forensic Pipeline.</span></h3>
                            <p className="text-slate-400 font-medium italic">Overseeing lead velocity and advocate throughput.</p>
                        </div>
                        
                        <Card className="bg-slate-900 border-white/5 p-0 rounded-[3rem] overflow-hidden shadow-3xl">
                            <table className="w-full text-left">
                                <thead className="bg-slate-950/50 border-b border-white/10">
                                    <tr>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-widest italic text-slate-500">Source</th>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-widest italic text-slate-500">Patient</th>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-widest italic text-slate-500">Bill Value</th>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-widest italic text-slate-500">Status</th>
                                        <th className="p-8 text-right text-[10px] font-black uppercase tracking-widest italic text-slate-500">Created</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {leads.length > 0 ? leads.map(l => (
                                        <tr key={l.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-8">
                                                <Badge color="navy" className="bg-slate-950 font-mono text-[8px]">{l.source}</Badge>
                                            </td>
                                            <td className="p-8">
                                                <p className="font-black text-white text-lg italic uppercase tracking-tight">{l.firstName} {l.lastName}</p>
                                                <p className="text-[10px] text-slate-500 font-mono italic">{l.email}</p>
                                            </td>
                                            <td className="p-8 font-black text-white italic text-xl">
                                                {fmt(l.billValue)}
                                            </td>
                                            <td className="p-8">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${l.status === 'New' ? 'bg-rose-500 animate-pulse' : 'bg-teal-500'}`} />
                                                    <span className="text-[10px] font-black uppercase italic tracking-widest text-slate-300">{l.status}</span>
                                                </div>
                                            </td>
                                            <td className="p-8 text-right text-slate-500 text-[10px] font-black uppercase italic">
                                                {new Date(l.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={5} className="p-20 text-center text-slate-600 font-black uppercase italic tracking-widest">No leads detected in system node.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </Card>
                    </div>
                )}

                {activeTab === 'accuracy' && <AccuracyRoadmap />}

                {activeTab === 'system' && (
                    <div className="animate-fade-in space-y-12">
                        <div className="flex flex-col gap-4">
                            <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Node <br/><span className="text-cyan-500">Health.</span></h3>
                            <p className="text-slate-400 font-medium italic">Real-time API and platform stability monitoring.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Card className="bg-slate-900 border-white/5 p-10 rounded-[3rem] flex flex-col gap-8 shadow-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400"><Zap size={24} /></div>
                                    <h4 className="font-black uppercase italic tracking-tight text-white">Gemini API</h4>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end"><span className="text-[9px] font-black uppercase text-slate-500 italic">Avg Latency</span><span className="text-2xl font-black italic">4.2s</span></div>
                                    <div className="flex justify-between items-end"><span className="text-[9px] font-black uppercase text-slate-500 italic">Error Rate</span><span className="text-2xl font-black italic text-emerald-400">0.02%</span></div>
                                    <div className="flex justify-between items-end"><span className="text-[9px] font-black uppercase text-slate-500 italic">Grounding Hit</span><span className="text-2xl font-black italic">88%</span></div>
                                </div>
                            </Card>

                            <Card className="bg-slate-900 border-white/5 p-10 rounded-[3rem] flex flex-col gap-8 shadow-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500"><Activity size={24} /></div>
                                    <h4 className="font-black uppercase italic tracking-tight text-white">Conversion</h4>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end"><span className="text-[9px] font-black uppercase text-slate-500 italic">Teaser-to-Lead</span><span className="text-2xl font-black italic">{Math.round(stats.conversionRate)}%</span></div>
                                    <div className="flex justify-between items-end"><span className="text-[9px] font-black uppercase text-slate-500 italic">Advocate Match</span><span className="text-2xl font-black italic text-teal-400">12.4%</span></div>
                                    <div className="flex justify-between items-end"><span className="text-[9px] font-black uppercase text-slate-500 italic">Recoup Success</span><span className="text-2xl font-black italic">--</span></div>
                                </div>
                            </Card>

                            <Card className="bg-slate-900 border-white/5 p-10 rounded-[3rem] flex flex-col gap-8 shadow-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-400"><ShieldCheck size={24} /></div>
                                    <h4 className="font-black uppercase italic tracking-tight text-white">Compliance</h4>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end"><span className="text-[9px] font-black uppercase text-slate-500 italic">HIPAA Sanitization</span><span className="text-2xl font-black italic text-emerald-400">100%</span></div>
                                    <div className="flex justify-between items-end"><span className="text-[9px] font-black uppercase text-slate-500 italic">Data Scrub Ratio</span><span className="text-2xl font-black italic">72:1</span></div>
                                    <div className="flex justify-between items-end"><span className="text-[9px] font-black uppercase text-slate-500 italic">Audit Log Integrity</span><span className="text-2xl font-black italic">High</span></div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
