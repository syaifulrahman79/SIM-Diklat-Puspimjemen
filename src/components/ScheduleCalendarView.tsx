import React, { useState, useMemo } from 'react';
import { TRAINING_PROGRAMS, TrainingProgram } from '../data/programsData.ts';
import { 
  Calendar, 
  Clock, 
  Users, 
  Building2, 
  Filter, 
  ChevronRight, 
  Layers, 
  Download,
  CalendarDays,
  Sparkles,
  Search,
  X
} from 'lucide-react';

interface ScheduleCalendarViewProps {
  onSelectProgram: (prog: TrainingProgram) => void;
}

const MONTHS_2027 = [
  { id: 1, name: "Januari", q: 1 },
  { id: 2, name: "Februari", q: 1 },
  { id: 3, name: "Maret", q: 1 },
  { id: 4, name: "April", q: 2 },
  { id: 5, name: "Mei", q: 2 },
  { id: 6, name: "Juni", q: 2 },
  { id: 7, name: "Juli", q: 3 },
  { id: 8, name: "Agustus", q: 3 },
  { id: 9, name: "September", q: 3 },
  { id: 10, name: "Oktober", q: 4 },
  { id: 11, name: "November", q: 4 },
  { id: 12, name: "Desember", q: 4 }
];

export const ScheduleCalendarView: React.FC<ScheduleCalendarViewProps> = ({
  onSelectProgram
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState<number | 'ALL'>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<number | 'ALL'>('ALL');
  const [selectedMethod, setSelectedMethod] = useState<string>('ALL');

  // Filter programs based on search term, quarter / month / method
  const filteredPrograms = useMemo(() => {
    return TRAINING_PROGRAMS.filter(prog => {
      // Keyword search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesQuery = 
          prog.name.toLowerCase().includes(q) ||
          prog.code.toLowerCase().includes(q) ||
          prog.shortDescription.toLowerCase().includes(q) ||
          prog.location.toLowerCase().includes(q) ||
          prog.category.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      if (selectedMethod !== 'ALL' && prog.method !== selectedMethod) return false;

      const startMonth = parseInt(prog.startDate.split('-')[1]);
      const endMonth = parseInt(prog.endDate.split('-')[1]);

      if (selectedMonth !== 'ALL') {
        const targetM = selectedMonth as number;
        // Check if target month falls within startMonth and endMonth
        const activeInMonth = targetM >= startMonth && targetM <= endMonth;
        if (!activeInMonth) return false;
      }

      if (selectedQuarter !== 'ALL') {
        const q = selectedQuarter as number;
        const qStartMonth = (q - 1) * 3 + 1;
        const qEndMonth = q * 3;
        // Check overlap with quarter months
        const overlapsQuarter = (startMonth <= qEndMonth) && (endMonth >= qStartMonth);
        if (!overlapsQuarter) return false;
      }

      return true;
    });
  }, [searchTerm, selectedQuarter, selectedMonth, selectedMethod]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                Timeline Pendidikan
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Kalender Jadwal Pelatihan Puspimjemenhan TA 2027
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Rencana operasional penyelenggaraan 43 diklat sepanjang Januari hingga Desember 2027 (Klasikal, Blended, & Daring).
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama diklat, kode (mis. DIKLAT-01), atau lokasi dalam jadwal kalender..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <span className="text-xs text-slate-500 font-medium shrink-0">
            Ditemukan: <strong>{filteredPrograms.length}</strong> jadwal
          </span>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100 text-xs">
          {/* Quarter filter buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => { setSelectedQuarter('ALL'); setSelectedMonth('ALL'); }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                selectedQuarter === 'ALL' && selectedMonth === 'ALL' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Triwulan (1 Tahun Penuh)
            </button>
            <button
              onClick={() => { setSelectedQuarter(1); setSelectedMonth('ALL'); }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                selectedQuarter === 1 ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              TW I (Jan-Mar)
            </button>
            <button
              onClick={() => { setSelectedQuarter(2); setSelectedMonth('ALL'); }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                selectedQuarter === 2 ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              TW II (Apr-Jun)
            </button>
            <button
              onClick={() => { setSelectedQuarter(3); setSelectedMonth('ALL'); }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                selectedQuarter === 3 ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              TW III (Jul-Sep)
            </button>
            <button
              onClick={() => { setSelectedQuarter(4); setSelectedMonth('ALL'); }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                selectedQuarter === 4 ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              TW IV (Okt-Des)
            </button>
          </div>

          {/* Method selector */}
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium ml-auto"
          >
            <option value="ALL">Semua Metode Pembelajaran</option>
            <option value="Klasikal">Klasikal (Tatap Muka)</option>
            <option value="Blended Learning">Blended Learning</option>
            <option value="Daring (PJJ)">Daring (PJJ Zoom)</option>
          </select>
        </div>
      </div>

      {/* Month Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 text-xs">
        {MONTHS_2027.map((m) => {
          const isSelected = selectedMonth === m.id;
          const monthCount = TRAINING_PROGRAMS.filter(p => {
            const sm = parseInt(p.startDate.split('-')[1]);
            const em = parseInt(p.endDate.split('-')[1]);
            return m.id >= sm && m.id <= em;
          }).length;

          return (
            <button
              key={m.id}
              onClick={() => {
                setSelectedMonth(m.id);
                setSelectedQuarter('ALL');
              }}
              className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white font-bold border-slate-900 shadow-xs'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span className="block font-medium truncate">{m.name}</span>
              <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
                {monthCount} Diklat
              </span>
            </button>
          );
        })}
      </div>

      {/* Program Schedule List */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
          <span className="text-slate-500">
            Ditemukan <strong className="text-slate-900 font-bold">{filteredPrograms.length}</strong> program pada rentang jadwal yang dipilih
          </span>
          <span className="text-[11px] text-slate-400">Klik program untuk memeriksa silabus kurikulum</span>
        </div>

        <div className="space-y-3">
          {filteredPrograms.map((prog) => {
            return (
              <div
                key={prog.id}
                onClick={() => onSelectProgram(prog)}
                className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/20 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {prog.code}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      prog.method === 'Klasikal' 
                        ? 'bg-blue-100 text-blue-800' 
                        : prog.method === 'Blended Learning' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {prog.method}
                    </span>
                    <span className="text-xs text-slate-500">
                      {prog.category}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm hover:text-amber-700 transition">
                    {prog.name}
                  </h4>

                  {/* Multi wave breakdown if available */}
                  {prog.waves && prog.waves.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {prog.waves.map((w, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                          {w.name}: <strong>{w.displayDate}</strong>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 shrink-0 text-xs">
                  <div className="flex items-center gap-1 font-semibold text-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>{prog.displayDate.split('|')[0]}</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {prog.durationLabel}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-slate-900">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {prog.capacity} Org
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
