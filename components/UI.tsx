
import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

export const LegalDisclaimer = () => (
  <div className="bg-slate-900/50 border-t border-white/5 py-12 px-6">
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6 items-start opacity-40 hover:opacity-100 transition-opacity">
      <AlertCircle className="shrink-0 text-slate-500" size={20} />
      <p className="text-[10px] font-medium leading-relaxed text-slate-400 uppercase tracking-wider italic">
        DISCLAIMER: POCKETPROOF IS A FINANCIAL AUDITING TOOL AND DOES NOT PROVIDE MEDICAL, LEGAL, OR TAX ADVICE. 
        AUDIT RESULTS ARE ESTIMATIONS BASED ON AI ANALYSIS OF PROVIDED BILLING DATA. 
        ALWAYS CONSULT WITH A LICENSED PROFESSIONAL BEFORE TAKING LEGAL ACTION OR WITHHOLDING PAYMENT. 
        WE ARE NOT AFFILIATED WITH THE CENTERS FOR MEDICARE & MEDICAID SERVICES (CMS).
      </p>
    </div>
  </div>
);

export const BrandLogo = ({ size = 'md', className = '', glow = false }: { size?: 'sm' | 'md' | 'lg' | 'xl', className?: string, glow?: boolean }) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24 md:h-32 md:w-32'
  };

  return (
    <div className={`relative flex items-center justify-center ${sizes[size]} ${className}`}>
      {glow && (
        <div className="absolute inset-0 bg-teal-500/30 blur-[40px] rounded-full animate-pulse-soft" />
      )}
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-full transform hover:scale-110 transition-transform duration-700 cursor-pointer"
      >
        <path 
          d="M50 5L15 20V45C15 67.5 30 88.5 50 95C70 88.5 85 67.5 85 45V20L50 5Z" 
          className="fill-slate-950 stroke-teal-500/20"
          strokeWidth="2"
        />
        <path 
          d="M36 28V72" 
          stroke="url(#logo-gradient)" 
          strokeWidth="7" 
          strokeLinecap="round" 
          className="animate-draw"
        />
        <path 
          d="M36 28H52C62 28 68 34 68 42C68 50 62 56 52 56H36" 
          stroke="url(#logo-gradient)" 
          strokeWidth="7" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="animate-draw"
        />
        <g className="animate-fade-in" style={{ animationDelay: '1s', opacity: 0 }}>
          <path 
            d="M44 42C44 38 52 38 60 42C52 46 44 46 44 42Z" 
            fill="url(#logo-gradient)" 
            fillOpacity="0.2" 
          />
          <circle cx="52" cy="42" r="3.5" fill="url(#logo-gradient)" className="animate-pulse-soft" />
          <circle cx="53.5" cy="40.5" r="1" fill="white" fillOpacity="0.8" />
        </g>
        <path 
          d="M56 60L63 67L79 51" 
          stroke="url(#logo-gradient)" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="animate-draw"
          style={{ animationDelay: '0.5s' }}
        />
        <defs>
          <linearGradient id="logo-gradient" x1="15" y1="5" x2="85" y2="95" gradientUnits="userSpaceOnUse">
            <stop stopColor="#14B8A6" />
            <stop offset="1" stopColor="#0EA5E9" />
          </linearGradient>
          <style>{`
            @keyframes draw {
              0% { stroke-dasharray: 0 300; opacity: 0; }
              100% { stroke-dasharray: 300 0; opacity: 1; }
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.8); }
              to { opacity: 1; transform: scale(1); }
            }
            .animate-draw {
              animation: draw 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .animate-fade-in {
              animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>
        </defs>
      </svg>
    </div>
  );
};

export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  fullWidth = false,
  type = 'button',
  loading = false,
  glow = false
}: { 
  children?: React.ReactNode; 
  onClick?: React.MouseEventHandler<HTMLButtonElement>; 
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'teal' | 'navy'; 
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  glow?: boolean;
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-black uppercase italic transition-all duration-500 active:scale-[0.96] disabled:opacity-40 disabled:cursor-not-allowed tracking-[0.15em] relative overflow-hidden px-10 py-5 md:px-14 md:py-7";
  
  const defaultFontSize = className.includes('text-') ? '' : 'text-[11px] md:text-sm';

  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-2xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:-translate-y-1",
    secondary: "bg-white text-slate-950 hover:bg-slate-50 border border-slate-200 shadow-sm",
    outline: "bg-transparent border-2 border-slate-300 hover:border-slate-900 text-slate-600 hover:text-slate-900",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-lg",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-900 px-6 py-3",
    teal: "bg-teal-600 hover:bg-teal-700 text-white shadow-2xl shadow-teal-600/20 hover:shadow-teal-600/30 hover:-translate-y-1",
    navy: "bg-[#0F172A] text-white hover:bg-[#1E293B] shadow-2xl shadow-slate-900/20"
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${defaultFontSize} ${fullWidth ? 'w-full' : ''} ${className} ${glow ? 'shadow-[0_0_50px_rgba(6,182,212,0.4)] hover:shadow-[0_0_70px_rgba(6,182,212,0.6)]' : ''}`}
    >
      {loading && <Loader2 className="w-4 h-4 mr-3 animate-spin" />}
      {children}
    </button>
  );
};

// Fixed Card component to accept an optional onClick handler and pass it to the root div
export const Card = ({ children, className = '', onClick, key }: { children?: React.ReactNode; className?: string; onClick?: React.MouseEventHandler<HTMLDivElement>; key?: React.Key }) => (
  <div key={key} onClick={onClick} className={`bg-white border border-slate-200 rounded-[3rem] md:rounded-[4rem] p-8 md:p-16 shadow-[0_32px_80px_rgba(0,0,0,0.03)] transition-all duration-700 hover:shadow-[0_48px_120px_rgba(0,0,0,0.05)] ${className}`}>
    {children}
  </div>
);

export const Badge = ({ children, color = 'gray', className = '' }: { children?: React.ReactNode; color?: 'red' | 'amber' | 'white' | 'gray' | 'green' | 'teal' | 'purple' | 'navy'; className?: string }) => {
  const colors = {
    red: "bg-rose-500 text-white border-rose-600 font-black",
    amber: "bg-amber-500 text-slate-950 border-amber-600 font-black",
    white: "bg-white text-slate-900 border-slate-300 font-black",
    gray: "bg-slate-200 text-slate-950 border-slate-400 font-black",
    green: "bg-emerald-500 text-slate-950 border-emerald-600 font-black",
    teal: "bg-teal-400 text-slate-950 border-teal-500 font-black",
    purple: "bg-purple-500 text-white border-purple-600 font-black",
    navy: "bg-slate-900 text-white border-slate-700 font-black"
  };
  
  return (
    <span className={`inline-flex items-center px-5 py-2 rounded-full text-[9px] md:text-[10px] uppercase tracking-[0.3em] border italic leading-none ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

export const SectionHeader = ({ badge, title, subtitle, centered = true, titleClassName = "" }: { badge?: string, title: React.ReactNode, subtitle?: string, centered?: boolean, titleClassName?: string }) => (
    <div className={`mb-16 md:mb-24 ${centered ? 'text-center' : 'text-left'}`}>
        {badge && <Badge color="red" className="mb-8">{badge}</Badge>}
        <h2 className={`text-4xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.9] mb-8 ${titleClassName}`}>
            {title}
        </h2>
        {subtitle && <p className="text-lg md:text-2xl text-slate-200 font-medium italic max-w-3xl mx-auto leading-relaxed opacity-100">{subtitle}</p>}
    </div>
);
