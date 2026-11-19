import React, { useState, useMemo } from 'react';
import { 
  TRAINING_PROGRAMS, 
  TrainingProgram 
} from '../data/programsData.ts';
import { 
  getStoredAssignments, 
  getProgramTniSipilBalance, 
  ProgramTniSipilBalance 
} from '../data/assignmentStore.ts';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Calendar, 
  Clock, 
  Users, 
  Shield, 
  CheckCircle2, 
  Download, 
  Building2, 
  ExternalLink,
  ChevronRight,
  Layers,
  X,
  Tag
} from 'lucide-react';

interface CatalogViewProps {
  onSelectProgram: (prog: TrainingProgram) => void;
  onCheckEligibilityForProgram: (prog: TrainingProgram) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ 
  onSelectProgram, 
  onCheckEligibilityForProgram 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedMethod, setSelectedMethod] = useState<string>('ALL');
  const [selectedTarget, setSelectedTarget] = useState<string>('ALL');
  const [selectedBoarding, setSelectedBoarding] = useState<string>('ALL');

  const categories = ['ALL', 'Kepemimpinan', 'Manajemen', 'Fungsional', 'Teknis & Siber', 'Kesehatan', 'Workshop & TOT'];
  const methods = ['ALL', 'Klasikal', 'Blended Learning', 'Daring (PJJ)'];
  const targets = ['ALL', 'TNI', 'PNS', 'PPPK'];
  const boardingOptions = ['ALL', 'Diasramakan', 'Tidak Diasramakan', 'Daring / Online (Zoom)'];

  const assignments = useMemo(() => getStoredAssignments(), []);
  const programBalancesMap = useMemo(() => {
    const map = new Map<number, ProgramTniSipilBalance>();
    TRAINING_PROGRAMS.forEach(p => {
      map.set(p.id, getProgramTniSipilBalance(p.id, assignments));
    });
    return map;
  }, [assignments]);

  const filteredPrograms = useMemo(() => {
    return TRAINING_PROGRAMS.filter(prog => {
      // Search text match
      const query = searchTerm.toLowerCase();
      const matchesSearch = 
        prog.name.toLowerCase().includes(query) ||
        prog.code.toLowerCase().includes(query) ||
        prog.shortDescription.toLowerCase().includes(query) ||
        prog.category.toLowerCase().includes(query) ||
        prog.competency.toLowerCase().includes(query) ||
        prog.curriculum.core.some(m => m.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      // Category filter
      if (selectedCategory !== 'ALL' && prog.category !== selectedCategory) {
        return false;
      }

      // Method filter
      if (selectedMethod !== 'ALL' && prog.method !== selectedMethod) {
        return false;
      }

      // Target filter
      if (selectedTarget === 'TNI' && !prog.targetParticipants.tni) return false;
      if (selectedTarget === 'PNS' && !prog.targetParticipants.pns) return false;
      if (selectedTarget === 'PPPK' && !prog.targetParticipants.pppk) return false;

      // Boarding filter
      if (selectedBoarding !== 'ALL') {
        if (selectedBoarding === 'Diasramakan' && prog.boarding !== 'Diasramakan') return false;
        if (selectedBoarding === 'Tidak Diasramakan' && prog.boarding !== 'Tidak Diasramakan') return false;
        if (selectedBoarding === 'Daring / Online (Zoom)' && !prog.boarding.includes('Daring')) return false;
      }

      return true;
    });
  }, [searchTerm, selectedCategory, selectedMethod, selectedTarget, selectedBoarding]);

  const exportAsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredPrograms, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Katalog_Puspimjemenhan_TA2027_${filteredPrograms.length}_diklat.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                Dokumen Resmi
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Katalog 43 Program Pelatihan Puspimjemenhan TA 2027
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Daftar lengkap program pendidikan dan pelatihan kepemimpinan, manajemen, fungsional, siber, dan teknis pertahanan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportAsJSON}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor JSON ({filteredPrograms.length})</span>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search box */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari diklat, kode (misal DIKLAT-01), materi, atau kata kunci..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
            >
              <option value="ALL">Semua Kategori</option>
              {categories.filter(c => c !== 'ALL').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Method Dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
            >
              <option value="ALL">Semua Metode</option>
              {methods.filter(m => m !== 'ALL').map(met => (
                <option key={met} value={met}>{met}</option>
              ))}
            </select>
          </div>

          {/* Target Peserta */}
          <div className="md:col-span-2">
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
            >
              <option value="ALL">Semua Sasaran (TNI/PNS/PPPK)</option>
              <option value="TNI">Khusus Ada Alokasi TNI</option>
              <option value="PNS">Khusus Ada Alokasi PNS</option>
              <option value="PPPK">Khusus Ada Alokasi PPPK</option>
            </select>
          </div>

          {/* Boarding */}
          <div className="md:col-span-2">
            <select
              value={selectedBoarding}
              onChange={(e) => setSelectedBoarding(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
            >
              <option value="ALL">Semua Fasilitas Asrama</option>
              <option value="Diasramakan">Diasramakan (Wisma/Barak)</option>
              <option value="Tidak Diasramakan">Tidak Diasramakan</option>
              <option value="Daring / Online (Zoom)">Daring (Online)</option>
            </select>
          </div>
        </div>

        {/* Quick Search Chips */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1 text-[11px]">
            <Tag className="w-3 h-3 text-slate-400" />
            <span>Pencarian Cepat:</span>
          </span>
          {['Cyber Defence', 'PKA & PKP', 'PBJ', 'Bela Negara', 'Minu Han', 'Big Data', 'Rengar Han', 'Salemba', 'Pondok Labu'].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => setSearchTerm(chip === searchTerm ? '' : chip)}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition cursor-pointer border ${
                searchTerm.toLowerCase() === chip.toLowerCase()
                  ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-900'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Filter Badges Summary */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Menampilkan <strong className="text-slate-900 font-bold">{filteredPrograms.length}</strong> dari {TRAINING_PROGRAMS.length} program pelatihan
          </span>
          {(searchTerm || selectedCategory !== 'ALL' || selectedMethod !== 'ALL' || selectedTarget !== 'ALL' || selectedBoarding !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('ALL');
                setSelectedMethod('ALL');
                setSelectedTarget('ALL');
                setSelectedBoarding('ALL');
              }}
              className="text-amber-700 hover:text-amber-900 font-semibold cursor-pointer"
            >
              Reset Semua Filter ({filteredPrograms.length} hasil)
            </button>
          )}
        </div>
      </div>

      {/* Empty Search Result State */}
      {filteredPrograms.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">
            Tidak ditemukan program diklat yang sesuai dengan pencarian
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchTerm ? `Tidak ada program yang cocok dengan kata kunci "${searchTerm}".` : 'Tidak ada program yang memenuhi kriteria filter terpilih.'}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('ALL');
              setSelectedMethod('ALL');
              setSelectedTarget('ALL');
              setSelectedBoarding('ALL');
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
          >
            Tampilkan Semua 43 Diklat
          </button>
        </div>
      )}

      {/* Program Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPrograms.map((prog) => {
          const isDaring = prog.method.includes('Daring');
          const isBlended = prog.method.includes('Blended');

          return (
            <div 
              key={prog.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header Strip */}
              <div className="p-5 pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {prog.code}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isDaring 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : isBlended 
                        ? 'bg-amber-100 text-amber-900' 
                        : 'bg-blue-100 text-blue-900'
                    }`}>
                      {prog.method}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                      {prog.category}
                    </span>
                  </div>
                </div>

                <h3 
                  onClick={() => onSelectProgram(prog)}
                  className="font-black text-slate-900 text-base leading-snug group-hover:text-amber-600 transition cursor-pointer"
                >
                  {prog.name}
                </h3>

                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {prog.shortDescription}
                </p>
              </div>

              {/* Card Meta Info */}
              <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 space-y-2 text-xs">
                {/* Jadwal */}
                <div className="flex items-start gap-2 text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <span className="line-clamp-1 font-medium">{prog.displayDate}</span>
                </div>

                {/* Durasi & Alokasi */}
                <div className="flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{prog.durationLabel}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    <span>{prog.capacity} Peserta</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      ({prog.boarding === 'Diasramakan' ? 'Asrama' : prog.boarding.includes('Daring') ? 'Online' : 'Non-Asrama'})
                    </span>
                  </div>
                </div>

                {/* Target Pangkat */}
                <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 space-y-0.5">
                  {prog.targetParticipants.tni && (
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-slate-700">TNI:</span>
                      <span className="text-slate-600">{prog.targetParticipants.tni}</span>
                    </div>
                  )}
                  {prog.targetParticipants.pns && (
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-slate-700">PNS:</span>
                      <span className="text-slate-600">{prog.targetParticipants.pns}</span>
                    </div>
                  )}
                  {prog.targetParticipants.pppk && (
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-slate-700">PPPK:</span>
                      <span className="text-slate-600">{prog.targetParticipants.pppk}</span>
                    </div>
                  )}
                </div>

                {/* Sinergi Pengampu TNI - Sipil */}
                {(() => {
                  const bal = programBalancesMap.get(prog.id);
                  if (!bal) return null;
                  return (
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Pengampu Diklat:</span>
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                        <Shield className="w-3 h-3 text-emerald-600" />
                        <span>{bal.tniCount} TNI • {bal.sipilCount} PNS ({bal.totalInstructors} WI)</span>
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 pt-3 bg-white border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onCheckEligibilityForProgram(prog)}
                  className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>Uji Syarat</span>
                </button>
                <button
                  onClick={() => onSelectProgram(prog)}
                  className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Silabus & Materi</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPrograms.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-800">Tidak ada program pelatihan yang sesuai filter</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Coba ubah kata kunci pencarian atau reset filter kategori/metode untuk melihat seluruh 43 katalog program diklat.
          </p>
        </div>
      )}
    </div>
  );
};
