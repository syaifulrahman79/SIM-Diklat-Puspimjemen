import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TRAINING_PROGRAMS, TrainingProgram } from '../data/programsData.ts';
import { LECTURERS_DATA, Lecturer, SUBJECT_MATRICES } from '../data/lecturersData.ts';
import { 
  Search, 
  X, 
  BookOpen, 
  Users, 
  Layers, 
  Calendar, 
  ArrowRight, 
  ChevronRight,
  Shield,
  Clock,
  Building2,
  Tag,
  Sparkles,
  Command
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProgram: (prog: TrainingProgram) => void;
  onNavigateToTab: (tab: 'dashboard' | 'catalog' | 'eligibility' | 'lecturers' | 'schedule' | 'ai-assistant' | 'registration', extra?: any) => void;
}

export type SearchCategoryFilter = 'ALL' | 'PROGRAMS' | 'LECTURERS' | 'SUBJECTS';

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProgram,
  onNavigateToTab
}) => {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<SearchCategoryFilter>('ALL');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setCategoryFilter('ALL');
    }
  }, [isOpen]);

  // Keyboard navigation & ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Search Results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        programs: [],
        lecturers: [],
        subjects: [],
        totalCount: 0
      };
    }

    // 1. Search Programs
    const matchedPrograms = TRAINING_PROGRAMS.filter(p => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.method.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.competency.toLowerCase().includes(q) ||
        (p.targetParticipants.tni && p.targetParticipants.tni.toLowerCase().includes(q)) ||
        (p.targetParticipants.pns && p.targetParticipants.pns.toLowerCase().includes(q)) ||
        p.curriculum.basic.some(b => b.toLowerCase().includes(q)) ||
        p.curriculum.core.some(c => c.toLowerCase().includes(q)) ||
        p.curriculum.supporting.some(s => s.toLowerCase().includes(q))
      );
    });

    // 2. Search Lecturers
    const matchedLecturers = LECTURERS_DATA.filter(l => {
      return (
        l.name.toLowerCase().includes(q) ||
        l.rankTitle.toLowerCase().includes(q) ||
        l.department.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        l.grade.toLowerCase().includes(q) ||
        l.nipNrp.toLowerCase().includes(q) ||
        l.subjects.some(s => s.toLowerCase().includes(q))
      );
    });

    // 3. Search Subjects & Subject Matrices
    const matchedSubjects: { subject: string; lecturers: string[]; programCount: number }[] = [];
    for (const [subj, lecs] of Object.entries(SUBJECT_MATRICES)) {
      if (subj.toLowerCase().includes(q) || lecs.some(l => l.toLowerCase().includes(q))) {
        // Count how many programs have this subject
        const progCount = TRAINING_PROGRAMS.filter(p => 
          p.curriculum.basic.some(b => b.toLowerCase().includes(subj.toLowerCase())) ||
          p.curriculum.core.some(c => c.toLowerCase().includes(subj.toLowerCase())) ||
          p.curriculum.supporting.some(s => s.toLowerCase().includes(subj.toLowerCase()))
        ).length;

        matchedSubjects.push({
          subject: subj,
          lecturers: lecs,
          programCount: progCount
        });
      }
    }

    const totalCount = matchedPrograms.length + matchedLecturers.length + matchedSubjects.length;

    return {
      programs: matchedPrograms,
      lecturers: matchedLecturers,
      subjects: matchedSubjects,
      totalCount
    };
  }, [query]);

  if (!isOpen) return null;

  const popularSearches = [
    'Cyber Defence',
    'Kepemimpinan (PKA/PKP)',
    'Pengadaan Barang/Jasa (PBJ)',
    'Bela Negara & Sishanneg',
    'Administrasi Umum (Minu)',
    'Syamsul Hilal',
    'Sasaran Kinerja Pegawai (SKP)',
    'Pelatihan Jarak Jauh (PJJ)'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-20 bg-slate-950/80 backdrop-blur-xs">
      <div 
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 bg-white border-b border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-600">
            <Search className="w-5 h-5 text-amber-600" />
          </div>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Cari program diklat, widyaiswara, materi, jadwal, atau kode diklat..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-sm sm:text-base bg-transparent border-0 focus:outline-none text-slate-900 placeholder:text-slate-400 font-medium pr-8"
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            title="Tutup (ESC)"
          >
            <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-slate-100 border border-slate-200 hidden sm:inline">
              ESC
            </span>
            <X className="w-5 h-5 sm:hidden" />
          </button>
        </div>

        {/* Category Filter Pills (if query active) */}
        {query && (
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs overflow-x-auto gap-2">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-slate-500 font-medium">Kategori:</span>
              <button
                onClick={() => setCategoryFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  categoryFilter === 'ALL'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Semua ({results.totalCount})
              </button>
              <button
                onClick={() => setCategoryFilter('PROGRAMS')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  categoryFilter === 'PROGRAMS'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Diklat ({results.programs.length})</span>
              </button>
              <button
                onClick={() => setCategoryFilter('LECTURERS')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  categoryFilter === 'LECTURERS'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Widyaiswara ({results.lecturers.length})</span>
              </button>
              <button
                onClick={() => setCategoryFilter('SUBJECTS')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  categoryFilter === 'SUBJECTS'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Mata Pelatihan ({results.subjects.length})</span>
              </button>
            </div>

            <span className="text-[11px] text-slate-500 font-medium shrink-0">
              {results.totalCount} hasil pencarian
            </span>
          </div>
        )}

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {/* Empty State: Suggestions */}
          {!query && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Pencarian Populer & Rekomendasi</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 hover:text-amber-900 hover:border-amber-300 text-slate-700 border border-slate-200 text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div 
                  onClick={() => { onClose(); onNavigateToTab('catalog'); }}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/20 transition cursor-pointer flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0">
                    43
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Katalog Pelatihan</h5>
                    <p className="text-[10px] text-slate-500">Jelajahi 43 program diklat</p>
                  </div>
                </div>

                <div 
                  onClick={() => { onClose(); onNavigateToTab('lecturers'); }}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/20 transition cursor-pointer flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                    28
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Direktori Widyaiswara</h5>
                    <p className="text-[10px] text-slate-500">Pengampu materi Salemba</p>
                  </div>
                </div>

                <div 
                  onClick={() => { onClose(); onNavigateToTab('schedule'); }}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/20 transition cursor-pointer flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                    TA
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Kalender Diklat 2027</h5>
                    <p className="text-[10px] text-slate-500">Jadwal Triwulan I - IV</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results: No Match */}
          {query && results.totalCount === 0 && (
            <div className="text-center py-10 space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                Tidak ditemukan hasil untuk "{query}"
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Coba gunakan kata kunci lain seperti nama diklat, kode (misal DIKLAT-01), nama widyaiswara, atau materi pokok.
              </p>
            </div>
          )}

          {/* SECTION 1: PROGRAMS */}
          {query && (categoryFilter === 'ALL' || categoryFilter === 'PROGRAMS') && results.programs.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>Program Pelatihan ({results.programs.length})</span>
                </span>
                <button
                  onClick={() => { onClose(); onNavigateToTab('catalog'); }}
                  className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>Buka di Katalog</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2">
                {results.programs.map((prog) => (
                  <div
                    key={prog.id}
                    onClick={() => {
                      onClose();
                      onSelectProgram(prog);
                    }}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/20 transition cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                          {prog.code}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800">
                          {prog.method}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {prog.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-amber-800 transition truncate">
                        {prog.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {prog.shortDescription}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1 font-mono">
                        <span>{prog.displayDate}</span>
                        <span>•</span>
                        <span>{prog.location.split(';')[0]}</span>
                        <span>•</span>
                        <span>{prog.capacity} Peserta</span>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 2: LECTURERS */}
          {query && (categoryFilter === 'ALL' || categoryFilter === 'LECTURERS') && results.lecturers.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  <span>Widyaiswara Salemba ({results.lecturers.length})</span>
                </span>
                <button
                  onClick={() => { onClose(); onNavigateToTab('lecturers'); }}
                  className="text-[11px] font-semibold text-amber-700 hover:underline flex items-center gap-1"
                >
                  <span>Buka Direktori</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {results.lecturers.map((lec) => (
                  <div
                    key={lec.id}
                    onClick={() => {
                      onClose();
                      onNavigateToTab('lecturers');
                    }}
                    className="p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-slate-50 transition cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          WI-{lec.id < 10 ? `0${lec.id}` : lec.id}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-900">
                            {lec.grade}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                            {lec.category}
                          </span>
                        </div>
                      </div>

                      <h5 className="font-bold text-slate-900 text-xs truncate">
                        {lec.name}
                      </h5>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {lec.rankTitle}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {lec.department}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                      {lec.subjects.slice(0, 2).map((s, i) => (
                        <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 truncate max-w-[150px]">
                          {s}
                        </span>
                      ))}
                      {lec.subjects.length > 2 && (
                        <span className="text-[9px] text-slate-400 self-center">
                          +{lec.subjects.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: SUBJECT MATRICES */}
          {query && (categoryFilter === 'ALL' || categoryFilter === 'SUBJECTS') && results.subjects.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Mata Pelatihan & Rumpun Kompetensi ({results.subjects.length})</span>
                </span>
                <button
                  onClick={() => { onClose(); onNavigateToTab('lecturers'); }}
                  className="text-[11px] font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <span>Buka Matriks</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2">
                {results.subjects.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      onClose();
                      onNavigateToTab('lecturers');
                    }}
                    className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 transition cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div>
                      <h5 className="font-bold text-slate-900 text-xs">
                        {item.subject}
                      </h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Pengampu resmi: {item.lecturers.join(', ')}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-600 shrink-0">
                      {item.lecturers.length} Pengampu
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <Command className="w-3.5 h-3.5 text-slate-400" />
            <span>Pencarian Cerdas SIM-DIKLAT Puspimjemenhan TA 2027</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span>ESC untuk tutup</span>
            <span>•</span>
            <span>ENTER untuk pilih</span>
          </div>
        </div>
      </div>
    </div>
  );
};
