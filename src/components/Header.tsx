import React from 'react';
import { 
  Shield, 
  BookOpen, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Bot, 
  FileText,
  Building2,
  Award,
  Sparkles,
  Search,
  ClipboardList,
  Printer
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'catalog' | 'eligibility' | 'wi-form' | 'lecturers' | 'schedule' | 'ai-assistant' | 'registration';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  conflictCount: number;
  onOpenSearch?: () => void;
  onOpenPrintRecap?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  conflictCount, 
  onOpenSearch,
  onOpenPrintRecap
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-xl">
      {/* Top Bar with Ministry Identity & Leadership */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 px-4 py-2 text-xs border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 font-medium tracking-wide text-slate-300">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>KEMENTERIAN PERTAHANAN REPUBLIK INDONESIA</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400 font-semibold">BPSDM PERTAHANAN</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-slate-400 text-[11px]">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
              <Award className="w-3 h-3 text-amber-400" />
              <span>Plt. Kapuspimjemenhan: <strong className="text-white font-semibold">Laksma TNI Anis Rusdiyono</strong></span>
            </div>
            <span className="hidden md:flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-amber-400" /> Salemba & Pondok Labu
            </span>
            <span className="bg-slate-800 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-mono">
              TA 2027
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar Branding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  SIM-DIKLAT <span className="text-amber-400 font-extrabold">PUSPIMJEMENHAN</span>
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-500/10 text-amber-300 rounded border border-amber-500/30">
                  Resmi TA 2027
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pusat Kepemimpinan dan Manajemen Pertahanan • 43 Program Pelatihan & 60 Widyaiswara
              </p>
            </div>
          </div>

          {/* Print Recap, Search Trigger, AI & Conflict Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            {onOpenPrintRecap && (
              <button
                onClick={onOpenPrintRecap}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-md shadow-amber-500/20 cursor-pointer"
                title="Cetak Rekapitulasi Laporan Resmi (Standar Minu Kemhan RI)"
              >
                <Printer className="w-3.5 h-3.5 text-slate-950" />
                <span className="hidden sm:inline">Cetak Rekap Laporan</span>
                <span className="sm:hidden">Cetak</span>
              </button>
            )}

            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/90 border border-slate-700 text-slate-300 text-xs transition group cursor-pointer shadow-xs"
                title="Pencarian Cerdas (Ctrl + K)"
              >
                <Search className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition" />
                <span className="hidden md:inline text-slate-300 group-hover:text-white">Cari diklat, widyaiswara...</span>
                <span className="md:hidden">Cari</span>
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-700 text-slate-400 font-mono">
                  Ctrl K
                </kbd>
              </button>
            )}

            {conflictCount > 0 && (
              <button 
                onClick={() => setActiveTab('lecturers')}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-950/70 border border-red-700/50 text-red-300 text-xs hover:bg-red-900/60 transition shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                <span>{conflictCount} Konflik Jadwal WI</span>
              </button>
            )}
            
            <button
              onClick={() => setActiveTab('ai-assistant')}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-blue-500/20 border border-amber-500/40 text-amber-300 hover:text-white hover:border-amber-400 text-xs font-medium transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Asisten AI</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 mt-3.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('wi-form')}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'wi-form'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ClipboardList className="w-4 h-4 text-amber-400" />
            <span>Form Identifikasi 60 WI</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold">
              TA 2027
            </span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'catalog'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Katalog 43 Diklat</span>
          </button>

          <button
            onClick={() => setActiveTab('eligibility')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'eligibility'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Uji Kelayakan (Eligibility)</span>
          </button>

          <button
            onClick={() => setActiveTab('lecturers')}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'lecturers'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Direktori Widyaiswara (Salemba)</span>
            {conflictCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'schedule'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Jadwal & Kalender 2027</span>
          </button>

          <button
            onClick={() => setActiveTab('registration')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'registration'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Simulasi Usulan Satker</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-assistant')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'ai-assistant'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bot className="w-4 h-4 text-amber-400" />
            <span>Asisten AI Kemhan</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
