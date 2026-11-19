import React from 'react';
import { 
  TRAINING_PROGRAMS, 
  TrainingProgram 
} from '../data/programsData.ts';
import { LECTURERS_DATA } from '../data/lecturersData.ts';
import { 
  Shield, 
  BookOpen, 
  Users, 
  Calendar, 
  Award, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  ArrowRight, 
  CheckCircle,
  FileSpreadsheet,
  Cpu,
  Building,
  Target,
  ClipboardList,
  Printer
} from 'lucide-react';
import { ActiveTab } from './Header.tsx';

interface DashboardViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onSelectProgram: (prog: TrainingProgram) => void;
  conflictCount: number;
  onOpenPrintRecap?: (docType?: 'workload-report' | 'program-recap' | 'comprehensive-recap') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  setActiveTab, 
  onSelectProgram,
  conflictCount,
  onOpenPrintRecap 
}) => {
  // Compute analytics
  const totalPrograms = TRAINING_PROGRAMS.length;
  const totalLecturers = LECTURERS_DATA.length;
  const totalCapacity = TRAINING_PROGRAMS.reduce((acc, curr) => acc + (curr.capacity || 0), 0);

  const klasikalCount = TRAINING_PROGRAMS.filter(p => p.method === 'Klasikal').length;
  const blendedCount = TRAINING_PROGRAMS.filter(p => p.method === 'Blended Learning').length;
  const daringCount = TRAINING_PROGRAMS.filter(p => p.method === 'Daring (PJJ)').length;

  const diasramakanCount = TRAINING_PROGRAMS.filter(p => p.boarding === 'Diasramakan').length;
  const tidakDiasramakanCount = TRAINING_PROGRAMS.filter(p => p.boarding === 'Tidak Diasramakan').length;
  const onlineCount = TRAINING_PROGRAMS.filter(p => p.boarding.includes('Daring')).length;

  // Upcoming in Q1 (Jan - Mar 2027)
  const q1Programs = TRAINING_PROGRAMS.filter(p => {
    const month = parseInt(p.startDate.split('-')[1]);
    return month >= 1 && month <= 3;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Official Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 border border-slate-700/60 shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-4 border border-amber-500/40">
            <Shield className="w-3.5 h-3.5" />
            <span>Katalog Resmi Tahun Anggaran 2027</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Sistem Informasi Manajemen Diklat <br />
            <span className="text-amber-400 font-serif">PUSPIMJEMENHAN BADIKLAT KEMHAN RI</span>
          </h2>
          
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Pusat Kepemimpinan dan Manajemen Pertahanan bertugas menyelenggarakan pendidikan dan pelatihan strategis 
            di bidang kepemimpinan, manajemen, siber, fungsional, dan pertahanan negara guna mewujudkan aparatur pertahanan yang tangguh, 
            profesional, dan berintegritas tinggi.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('wi-form')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <ClipboardList className="w-4 h-4 text-slate-950" />
              <span>Form Identifikasi 60 WI</span>
            </button>
            {onOpenPrintRecap && (
              <button
                onClick={() => onOpenPrintRecap('workload-report')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm transition shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-950" />
                <span>Cetak Rekap Laporan TA 2027</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('eligibility')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-semibold text-sm transition cursor-pointer"
            >
              <CheckCircle className="w-4 h-4 text-amber-400" />
              <span>Cek Kelayakan Personel (Eligibility)</span>
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-semibold text-sm transition cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Jelajahi 43 Katalog Diklat</span>
            </button>
            <button
              onClick={() => setActiveTab('ai-assistant')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-900/50 hover:bg-blue-800/60 text-blue-200 border border-blue-500/40 font-semibold text-sm transition cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>Tanya AI Puspimjemen</span>
            </button>
          </div>
        </div>

        {/* Badges strip on bottom */}
        <div className="mt-8 pt-4 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Lokasi Diklat:</span>
            <span>Kampus Salemba (Jakarta Pusat) & Kampus Pondok Labu (Jakarta Selatan)</span>
          </div>
          <div className="flex items-center gap-4 text-amber-300 font-medium">
            <span>• Terakreditasi LAN RI</span>
            <span>• Standar Mutu Badiklat Kemhan</span>
          </div>
        </div>
      </div>

      {/* Conflicts Banner Alert if exists */}
      {conflictCount > 0 && (
        <div className="bg-red-950/60 border border-red-700/60 rounded-xl p-4 text-red-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-900/60 text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-red-300">Terdeteksi {conflictCount} Potensi Benturan Jadwal Widyaiswara</h4>
              <p className="text-xs text-red-300/80 mt-0.5">
                Terdapat Widyaiswara yang ditugaskan pada program klasikal dengan tanggal pelaksanaan yang beririsan.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('lecturers')}
            className="px-3.5 py-1.5 bg-red-800 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition"
          >
            Tinjau & Resolusi
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Program Diklat</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900">{totalPrograms}</span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">Program</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1">
            <span className="text-emerald-700 font-bold">100% Terpetakan</span> dalam TA 2027
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Widyaiswara Puspimjemen</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900">{totalLecturers}</span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">Personel</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1">
            <span className="text-amber-800 font-bold">41 Militer (TNI)</span> • 26 Sipil (PNS)
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Alokasi Peserta</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900">{totalCapacity.toLocaleString()}</span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">Peserta</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1">
            TNI, ASN PNS, dan PPPK Kemhan
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Ragam Pembelajaran</span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900">3</span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">Metode Pelaksanaan</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1">
            Klasikal, Blended, & Daring
          </div>
        </div>
      </div>

      {/* Workload Balancer Spotlight Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-slate-700/80 shadow-lg flex flex-wrap items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Beban Berimbang & Sinergi TNI-Sipil (100% Terpenuhi)</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Award className="w-3.5 h-3.5" />
              <span>Plt. Kapuspimjemenhan: Laksma TNI Anis Rusdiyono</span>
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">
            Distribusi Tugas Mengajar Berimbang 60 Widyaiswara TA 2027
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Seluruh 60 Widyaiswara (40 Ahli Madya, 11 Ahli Muda, 9 Ahli Pertama • 39 Militer TNI &amp; 21 Sipil PNS Kemhan) 
            telah terdistribusi secara merata (rata-rata 2–3 diklat/orang) dengan menerapkan <strong>Azas Keberimbangan antara TNI dan Sipil</strong> 
            pada setiap program diklat (100% program melibatkan perwira TNI dan PNS Kemhan secara kolaboratif, zero clash schedule).
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              ✓ 100% (43/43 Diklat) Sinergi Berimbang TNI - Sipil
            </span>
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              ✓ Beban Merata 60 WI: 39 TNI &amp; 21 PNS (Avg 2.4 Diklat)
            </span>
            <span className="flex items-center gap-1 text-blue-300 font-semibold">
              ✓ Bebas Tumpang Tindih &amp; Zero Benturan Waktu
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {onOpenPrintRecap && (
            <button
              onClick={() => onOpenPrintRecap('workload-report')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>Cetak Rekap Beban 60 WI</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab('wi-form')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-600 transition cursor-pointer"
          >
            <span>Form Identifikasi 60 WI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Methods & Boarding Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Distribusi Metode Pelatihan */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>Distribusi Berdasarkan Metode Pembelajaran</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Komposisi pendekatan diklat klasikal (tatap muka penuh), blended learning, dan daring (PJJ).
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Metode Klasikal (Tatap Muka Penuh)</span>
                <span className="text-slate-900 font-bold">{klasikalCount} Diklat ({Math.round(klasikalCount / totalPrograms * 100)}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(klasikalCount / totalPrograms) * 100}%` }}></div>
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Di antaranya: Berpikir Kreatif, Komunikasi Efektif, Suskatjemen Eksekutif, Cyber Defence, dll.</span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Blended Learning (Kombinasi Daring & Tatap Muka)</span>
                <span className="text-slate-900 font-bold">{blendedCount} Diklat ({Math.round(blendedCount / totalPrograms * 100)}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(blendedCount / totalPrograms) * 100}%` }}></div>
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Di antaranya: PKA, PKP, Susjemen Litbang Han, Susjemen Kepemimpinan Tk II, Alih Golongan, dll.</span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Daring PJJ (Pelatihan Jarak Jauh via Zoom/LMS)</span>
                <span className="text-slate-900 font-bold">{daringCount} Diklat ({Math.round(daringCount / totalPrograms * 100)}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${(daringCount / totalPrograms) * 100}%` }}></div>
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Di antaranya: PJJ Agile Change, PJJ Mastering Effective Comm, PJJ Strategic Management, dll.</span>
            </div>
          </div>
        </div>

        {/* Card 2: Penginapan & Asrama */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-600" />
            <span>Fasilitas Asrama & Penyelenggaraan</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Status akomodasi peserta selama mengikuti kegiatan pendidikan dan pelatihan di kampus Badiklat.
          </p>

          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-2xl font-black text-amber-700 block">{diasramakanCount}</span>
              <span className="text-xs font-semibold text-slate-700 mt-1 block">Diasramakan</span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Fasilitas barak/wisma</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-2xl font-black text-blue-700 block">{tidakDiasramakanCount}</span>
              <span className="text-xs font-semibold text-slate-700 mt-1 block">Tidak Diasramakan</span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Pendidikan harian</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-2xl font-black text-emerald-700 block">{onlineCount}</span>
              <span className="text-xs font-semibold text-slate-700 mt-1 block">Online / PJJ</span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Tanpa asrama fisik</span>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900">
            <strong>Catatan Satker:</strong> Peserta diklat berstatus diasramakan mendapatkan akomodasi kamar wisma, konsumsi 3x sehari, 
            serta sarana olahraga dan perpustakaan di lingkungan Badiklat Kemhan (Salemba atau Pondok Labu).
          </div>
        </div>
      </div>

      {/* Upcoming Programs Highlights (Q1 2027) */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Program Diklat Mendatang: Triwulan I (Januari - Maret 2027)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Terdapat {q1Programs.length} program pelatihan prioritas yang siap dimulai pada awal Tahun Anggaran 2027.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('schedule')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat Semua Kalender 2027</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {q1Programs.slice(0, 6).map((prog) => (
            <div
              key={prog.id}
              onClick={() => onSelectProgram(prog)}
              className="group p-4 rounded-xl border border-slate-200 hover:border-amber-400/80 bg-white hover:bg-amber-50/20 transition cursor-pointer shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {prog.code}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                    prog.method === 'Klasikal' 
                      ? 'bg-blue-100 text-blue-800' 
                      : prog.method === 'Blended Learning' 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {prog.method}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-amber-700 transition">
                  {prog.name}
                </h4>

                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {prog.shortDescription}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {prog.displayDate.split('|')[0]}
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {prog.capacity} Org
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
