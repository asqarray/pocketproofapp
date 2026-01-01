
import React from 'react';
import { 
  ShieldCheck, Lock, Eye, Database, Globe, Scale, HelpCircle, 
  MessageSquare, Terminal, UserCheck, ShieldAlert, Cpu, CheckCircle 
} from 'lucide-react';
import { Card, Badge, SectionHeader, Button } from './UI';

export const CompliancePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-8 py-48 animate-fade-in bg-[#0F172A]">
      <SectionHeader 
        badge="Trust Stack v1.0"
        title={<>Clinical Data <br/><span className="text-cyan-500">Integrity & Safety.</span></>}
        subtitle="PocketProof operates on a hybrid privacy model designed to exceed HIPAA and SOC-2 Type II standards."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
        <Card className="p-12 border-emerald-500/20 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8">
            <ShieldCheck className="text-emerald-500" size={32} />
          </div>
          <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-6">HIPAA Safety Protocols</h3>
          <div className="space-y-6 text-slate-400 font-medium italic leading-relaxed">
            <p>Our "Sanitization Pass" uses deterministic regex and NER (Named Entity Recognition) to redact PHI before it ever reaches our reasoning nodes.</p>
            <ul className="space-y-4">
              <li className="flex gap-4"><CheckCircle size={18} className="text-emerald-500 shrink-0" /> AES-256 At-Rest Encryption</li>
              <li className="flex gap-4"><CheckCircle size={18} className="text-emerald-500 shrink-0" /> TLS 1.3 In-Transit Protection</li>
              <li className="flex gap-4"><CheckCircle size={18} className="text-emerald-500 shrink-0" /> Automated PII Scrubbing (maskPHI)</li>
            </ul>
          </div>
        </Card>

        <Card className="p-12 border-cyan-500/20 shadow-2xl">
          <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-8">
            <Lock className="text-cyan-400" size={32} />
          </div>
          <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-6">SOC-2 Type II Controls</h3>
          <div className="space-y-6 text-slate-400 font-medium italic leading-relaxed">
            <p>We undergo annual independent audits of our security, availability, and confidentiality controls.</p>
            <ul className="space-y-4">
              <li className="flex gap-4"><CheckCircle size={18} className="text-cyan-400 shrink-0" /> Zero-Trust Internal Access</li>
              <li className="flex gap-4"><CheckCircle size={18} className="text-cyan-400 shrink-0" /> Continuous Threat Monitoring</li>
              <li className="flex gap-4"><CheckCircle size={18} className="text-cyan-400 shrink-0" /> Disaster Recovery Drills</li>
            </ul>
          </div>
        </Card>
      </div>

      <div className="space-y-12">
        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Privacy Framework</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: <Eye />, 
              title: "Hybrid Data Storage", 
              desc: "Medical data is anonymized. Personal identifiers are sent directly to advocate webhooks via secure tunnels." 
            },
            { 
              icon: <Database />, 
              title: "Data Sovereignty", 
              desc: "Patients own their audit history. We provide one-click 'Nuclear Reset' to wipe your entire forensic portfolio." 
            },
            { 
              icon: <Scale />, 
              title: "Legal Transparency", 
              desc: "We strictly follow the No Surprises Act. Our AI is a neutral auditor—it cannot be paid to 'hide' a fair bill." 
            }
          ].map((item, i) => (
            <Card key={i} className="p-10 bg-slate-900/40 border-white/5 shadow-xl group hover:border-white/20 transition-all">
              <div className="text-slate-500 mb-6 group-hover:text-cyan-500 transition-colors">{item.icon}</div>
              <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">{item.title}</h4>
              <p className="text-sm text-slate-500 italic leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SupportPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-8 py-48 animate-fade-in bg-[#0F172A]">
      <SectionHeader 
        badge="Global Command"
        title={<>Deployment <br/><span className="text-rose-500">Support & Help.</span></>}
        subtitle="Need tactical assistance with a billing dispute or clinical integration?"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-32">
        <Card className="p-12 border-rose-500/20 shadow-2xl flex flex-col justify-between">
          <div>
            <HelpCircle className="text-rose-500 mb-8" size={48} />
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-6">Expert Help</h3>
            <p className="text-slate-400 italic font-medium leading-relaxed mb-10">
              Not sure how to interpret your audit? Our senior clinical analysts are available for deep-dive consultations.
            </p>
          </div>
          <Button variant="danger" fullWidth onClick={() => window.location.hash = 'advocates'}>CONTACT ANALYST</Button>
        </Card>

        <Card className="p-12 border-white/10 shadow-2xl flex flex-col justify-between">
          <div>
            <Globe className="text-white mb-8" size={48} />
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-6">Case Tracking</h3>
            <p className="text-slate-400 italic font-medium leading-relaxed mb-10">
              Follow every stage of your recovery. From initial forensic scan to final hospital settlement.
            </p>
          </div>
          <Button variant="teal" fullWidth onClick={() => window.location.hash = 'dashboard'}>OPEN VAULT</Button>
        </Card>

        <Card className="p-12 border-cyan-500/20 shadow-2xl flex flex-col justify-between bg-slate-950">
          <div>
            <Terminal className="text-cyan-400 mb-8" size={48} />
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-6">API Access</h3>
            <p className="text-slate-400 italic font-medium leading-relaxed mb-10">
              Institutional scale? Connect your law firm or hospital system directly to our auditing nodes.
            </p>
          </div>
          <Button variant="outline" className="border-cyan-500/30 text-cyan-400" fullWidth>VIEW DOCS</Button>
        </Card>
      </div>

      <Card className="p-16 border-white/5 bg-slate-900/50 rounded-[4rem]">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-32 h-32 bg-slate-950 rounded-full flex items-center justify-center shrink-0 border border-white/10">
            <MessageSquare className="text-cyan-500 animate-pulse" size={64} />
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">Direct Communication Link</h4>
            <p className="text-xl text-slate-500 italic font-medium max-w-2xl mb-8">
              "Support isn't just a ticket. For complex clinical cases, we provide a direct line to our medical director for peer-to-peer review."
            </p>
            <div className="flex flex-wrap gap-10">
              <div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-2">EMAIL COMMAND</span>
                <span className="text-lg font-black italic text-white">ops@pocketproof.ai</span>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-2">TELEPHONE SECURE</span>
                <span className="text-lg font-black italic text-white">1-800-RECOUP</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
