import React, { useState, useMemo } from 'react';
import { 
  ParticipantProfile, 
  evaluateEligibility, 
  EligibilityResult 
} from '../data/eligibilityRules.ts';
import { TrainingProgram } from '../data/programsData.ts';
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  UserCheck, 
  Shield, 
  RotateCcw, 
  Printer, 
  ChevronRight, 
  SlidersHorizontal,
  ArrowRight,
  Info,
  Award,
  Sparkles,
  Search,
  X
} from 'lucide-react';

interface EligibilityEngineViewProps {
  onSelectProgram: (prog: TrainingProgram) => void;
  presetProgram?: TrainingProgram | null;
  onPrintOfficialRecommendation: (profile: ParticipantProfile, results: EligibilityResult[]) => void;
}

export const EligibilityEngineView: React.FC<EligibilityEngineViewProps> = ({
  onSelectProgram,
  presetProgram,
  onPrintOfficialRecommendation
}) => {
  // Sample Preset Profiles for 1-click test
  const PRESET_PROFILES: { label: string; profile: ParticipantProfile }[] = [
    {
      label: "Mayor TNI AD (Usia 42, S1, Diklapa II)",
      profile: {
        name: "Mayor Inf. Tri Wicaksono",
        category: "TNI",
        serviceBranch: "TNI AD",
        rank: "Mayor",
        education: "S1/D4",
        educationMajor: "Ilmu Pemerintahan",
        militaryEducation: "Diklapa II",
        age: 42,
        currentPosition: "Kasi Perencanaan Program Korem",
        hasMedicalSTR: false,
        hasUjianDinas: true,
        hasSusgadik: true,
        hasDiklatWI: false,
        hasPKA: false,
        hasPKP: true
      }
    },
    {
      label: "PNS Penata III/c (Usia 39, S1, Pengelola Kepegawaian)",
      profile: {
        name: "Rina Setyowati, S.AP.",
        category: "PNS",
        serviceBranch: "Kemhan RI",
        rank: "Penata (III/c)",
        education: "S1/D4",
        educationMajor: "Administrasi Publik",
        age: 39,
        yearsInRank: 4,
        currentPosition: "Analis Kepegawaian Muda Biro Kepegawaian",
        hasMedicalSTR: false,
        hasUjianDinas: true,
        hasSusgadik: false,
        hasDiklatWI: false,
        hasPKA: false,
        hasPKP: true
      }
    },
    {
      label: "Kolonel TNI AL (Usia 52, S2, Sesko TNI)",
      profile: {
        name: "Kolonel Laut (P) Hendro Sasongko, M.Tr.Opsla.",
        category: "TNI",
        serviceBranch: "TNI AL",
        rank: "Kolonel",
        education: "S2",
        educationMajor: "Strategi Pertahanan Laut",
        militaryEducation: "Sesko TNI",
        age: 52,
        currentPosition: "Paban Perencanaan Mabesal",
        hasMedicalSTR: false,
        hasUjianDinas: true,
        hasSusgadik: true,
        hasDiklatWI: false,
        hasPKA: true,
        hasPKP: true
      }
    },
    {
      label: "PNS Pengatur II/c (Usia 29, D3 Keperawatan, STR Aktif)",
      profile: {
        name: "Siti Rahmawati, A.Md.Kep.",
        category: "PNS",
        serviceBranch: "Kemhan RI",
        rank: "Pengatur (II/c)",
        education: "D3",
        educationMajor: "Keperawatan Medikal Bedah",
        age: 29,
        currentPosition: "Perawat Pelaksana IGD RSPAD Gatot Soebroto",
        hasMedicalSTR: true,
        hasUjianDinas: false,
        hasSusgadik: false,
        hasDiklatWI: false,
        hasPKA: false,
        hasPKP: false
      }
    },
    {
      label: "Bintara Serda TNI AU (Usia 27, D3 TI, Staf Komputer)",
      profile: {
        name: "Serda Dian Pratama",
        category: "TNI",
        serviceBranch: "TNI AU",
        rank: "Serda",
        education: "D3",
        educationMajor: "Teknik Informatika / Jaringan",
        militaryEducation: "Secaba PK",
        age: 27,
        currentPosition: "Bintara Operator Jaringan Disinfolahta",
        hasMedicalSTR: false,
        hasUjianDinas: false,
        hasSusgadik: false,
        hasDiklatWI: false,
        hasPKA: false,
        hasPKP: false
      }
    }
  ];

  // Active form state
  const [profile, setProfile] = useState<ParticipantProfile>(PRESET_PROFILES[0].profile);
  const [filterResultStatus, setFilterResultStatus] = useState<string>('ALL');
  const [filterTargetDiklat, setFilterTargetDiklat] = useState<number | 'ALL'>(presetProgram ? presetProgram.id : 'ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Compute evaluation
  const evaluationResults = useMemo(() => {
    return evaluateEligibility(profile);
  }, [profile]);

  const eligibleCount = evaluationResults.filter(r => r.status === 'ELIGIBLE').length;
  const considerationCount = evaluationResults.filter(r => r.status === 'CONSIDERATION').length;
  const ineligibleCount = evaluationResults.filter(r => r.status === 'INELIGIBLE').length;

  const filteredResults = useMemo(() => {
    return evaluationResults.filter(item => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQ = 
          item.program.name.toLowerCase().includes(q) ||
          item.program.code.toLowerCase().includes(q) ||
          item.program.category.toLowerCase().includes(q) ||
          item.program.shortDescription.toLowerCase().includes(q) ||
          item.reasons.some(r => r.toLowerCase().includes(q));
        if (!matchesQ) return false;
      }
      if (filterTargetDiklat !== 'ALL' && item.program.id !== filterTargetDiklat) {
        return false;
      }
      if (filterResultStatus !== 'ALL' && item.status !== filterResultStatus) {
        return false;
      }
      return true;
    });
  }, [evaluationResults, filterResultStatus, filterTargetDiklat, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* Title Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Eligibility Engine v2.4</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Uji Kelayakan Calon Peserta Diklat Puspimjemenhan
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Verifikasi kelayakan otomatis berdasarkan matriks kepangkatan TNI/PNS/PPPK, batas usia, jenjang pendidikan, dan kualifikasi satker TA 2027.
            </p>
          </div>

          <button
            onClick={() => onPrintOfficialRecommendation(profile, evaluationResults)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Cetak Lembar Hasil Uji Kelayakan</span>
          </button>
        </div>

        {/* 1-Click Profile Presets */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-700 block mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Pilih Profil Simulasi Cepat:</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_PROFILES.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setProfile(preset.profile)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                  profile.name === preset.profile.name
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Form Input vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Profile Input (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-600" />
              <span>Data Profil Personel</span>
            </h3>
            <span className="text-[11px] text-slate-500">Form Interaktif</span>
          </div>

          {/* Nama Personel */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Nama Lengkap & Gelar</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Kategori & Korps */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Status Kepegawaian</label>
              <select
                value={profile.category}
                onChange={(e) => {
                  const cat = e.target.value as any;
                  setProfile({
                    ...profile,
                    category: cat,
                    rank: cat === 'TNI' ? 'Mayor' : cat === 'PNS' ? 'Penata (III/c)' : 'Golongan VII'
                  });
                }}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                <option value="TNI">TNI</option>
                <option value="PNS">ASN PNS</option>
                <option value="PPPK">ASN PPPK</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Instansi / Matra</label>
              <select
                value={profile.serviceBranch || 'Kemhan RI'}
                onChange={(e) => setProfile({ ...profile, serviceBranch: e.target.value as any })}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                <option value="Kemhan RI">Kemhan RI</option>
                <option value="Mabes TNI">Mabes TNI</option>
                <option value="TNI AD">TNI AD</option>
                <option value="TNI AL">TNI AL</option>
                <option value="TNI AU">TNI AU</option>
                <option value="Polri">Polri</option>
                <option value="Kementerian / Lembaga">K/L Terkait</option>
              </select>
            </div>
          </div>

          {/* Pangkat / Golongan */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Pangkat / Golongan Ruang</label>
            {profile.category === 'TNI' && (
              <select
                value={profile.rank}
                onChange={(e) => setProfile({ ...profile, rank: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                <optgroup label="Perwira Menengah (Pamen)">
                  <option value="Kolonel">Kolonel</option>
                  <option value="Letkol">Letkol</option>
                  <option value="Mayor">Mayor</option>
                </optgroup>
                <optgroup label="Perwira Pertama (Pama)">
                  <option value="Kapten">Kapten</option>
                  <option value="Lettu">Lettu</option>
                  <option value="Letda">Letda</option>
                </optgroup>
                <optgroup label="Bintara">
                  <option value="Pelda/Peltu">Pelda / Peltu</option>
                  <option value="Serka/Serma">Serka / Serma</option>
                  <option value="Sertu">Sertu</option>
                  <option value="Serda">Serda</option>
                </optgroup>
                <optgroup label="Tamtama">
                  <option value="Tamtama">Kopka / Kopda / Praka / Prada</option>
                </optgroup>
              </select>
            )}

            {profile.category === 'PNS' && (
              <select
                value={profile.rank}
                onChange={(e) => setProfile({ ...profile, rank: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                <optgroup label="Golongan IV (Pembina)">
                  <option value="Pembina Utama (IV/e)">Pembina Utama (IV/e)</option>
                  <option value="Pembina Utama Madya (IV/d)">Pembina Utama Madya (IV/d)</option>
                  <option value="Pembina Utama Muda (IV/c)">Pembina Utama Muda (IV/c)</option>
                  <option value="Pembina Tk. I (IV/b)">Pembina Tk. I (IV/b)</option>
                  <option value="Pembina (IV/a)">Pembina (IV/a)</option>
                </optgroup>
                <optgroup label="Golongan III (Penata)">
                  <option value="Penata Tk. I (III/d)">Penata Tk. I (III/d)</option>
                  <option value="Penata (III/c)">Penata (III/c)</option>
                  <option value="Penata Muda Tk. I (III/b)">Penata Muda Tk. I (III/b)</option>
                  <option value="Penata Muda (III/a)">Penata Muda (III/a)</option>
                </optgroup>
                <optgroup label="Golongan II (Pengatur)">
                  <option value="Pengatur Tk. I (II/d)">Pengatur Tk. I (II/d)</option>
                  <option value="Pengatur (II/c)">Pengatur (II/c)</option>
                  <option value="Pengatur Muda Tk. I (II/b)">Pengatur Muda Tk. I (II/b)</option>
                  <option value="Pengatur Muda (II/a)">Pengatur Muda (II/a)</option>
                </optgroup>
              </select>
            )}

            {profile.category === 'PPPK' && (
              <select
                value={profile.rank}
                onChange={(e) => setProfile({ ...profile, rank: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                <option value="Golongan V">Golongan V</option>
                <option value="Golongan VI">Golongan VI</option>
                <option value="Golongan VII">Golongan VII</option>
                <option value="Golongan VIII">Golongan VIII</option>
                <option value="Golongan IX">Golongan IX</option>
                <option value="Golongan X">Golongan X</option>
              </select>
            )}
          </div>

          {/* Usia & Pendidikan */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Usia Saat Ini (Thn)</label>
              <input
                type="number"
                min={20}
                max={60}
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 30 })}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Pendidikan Umum</label>
              <select
                value={profile.education}
                onChange={(e) => setProfile({ ...profile, education: e.target.value as any })}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                <option value="SLTA/Sederajat">SLTA / SMA / SMK</option>
                <option value="D3">Diploma III (D3)</option>
                <option value="S1/D4">Strata 1 / D4 (S1)</option>
                <option value="S2">Magister / S2</option>
                <option value="S3">Doktor / S3</option>
              </select>
            </div>
          </div>

          {/* Jabatan & Bidang */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Jabatan / Penugasan Satker</label>
            <input
              type="text"
              placeholder="Contoh: Kasi Rengar / Perawat / Analis TIK"
              value={profile.currentPosition || ''}
              onChange={(e) => setProfile({ ...profile, currentPosition: e.target.value })}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>

          {/* Checkboxes Syarat Khusus */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-700 block mb-1">Kualifikasi Khusus / Sertifikat:</span>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={!!profile.hasMedicalSTR}
                onChange={(e) => setProfile({ ...profile, hasMedicalSTR: e.target.checked })}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span>Memiliki STR Tenaga Medis/Perawat Aktif</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={!!profile.hasUjianDinas}
                onChange={(e) => setProfile({ ...profile, hasUjianDinas: e.target.checked })}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span>Lulus Ujian Dinas Tk. I / UPKP</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={!!profile.hasSusgadik}
                onChange={(e) => setProfile({ ...profile, hasSusgadik: e.target.checked })}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span>Telah Mengikuti Susgadik (Tenaga Pengajar TNI)</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={!!profile.hasDiklatWI}
                onChange={(e) => setProfile({ ...profile, hasDiklatWI: e.target.checked })}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span>Lulus Diklat Pembentukan Calon WI</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={!!profile.hasPKP}
                onChange={(e) => setProfile({ ...profile, hasPKP: e.target.checked })}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span>Alumni Diklat Kepemimpinan Pengawas (PKP)</span>
            </label>
          </div>
        </div>

        {/* Right Output: Evaluation Results (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Summary Metric Ribbon */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setFilterResultStatus('ELIGIBLE')}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                filterResultStatus === 'ELIGIBLE' 
                  ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20' 
                  : 'bg-white border-slate-200 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">Memenuhi Syarat</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-2xl font-black text-emerald-700 mt-1 block">{eligibleCount}</span>
              <span className="text-[10px] text-emerald-600">Dapat langsung diusulkan</span>
            </button>

            <button
              onClick={() => setFilterResultStatus('CONSIDERATION')}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                filterResultStatus === 'CONSIDERATION' 
                  ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-500/20' 
                  : 'bg-white border-slate-200 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800">Pertimbangan</span>
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-2xl font-black text-amber-700 mt-1 block">{considerationCount}</span>
              <span className="text-[10px] text-amber-600">Perlu rekomendasi satker</span>
            </button>

            <button
              onClick={() => setFilterResultStatus('INELIGIBLE')}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                filterResultStatus === 'INELIGIBLE' 
                  ? 'bg-red-50 border-red-400 ring-2 ring-red-500/20' 
                  : 'bg-white border-slate-200 hover:border-red-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-800">Belum Memenuhi</span>
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-2xl font-black text-red-700 mt-1 block">{ineligibleCount}</span>
              <span className="text-[10px] text-red-600">Pangkat/pendidikan belum cukup</span>
            </button>
          </div>

          {/* Filter Sub-Bar */}
          <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Filter Hasil:</span>
              <button
                onClick={() => setFilterResultStatus('ALL')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
                  filterResultStatus === 'ALL' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua ({evaluationResults.length})
              </button>
              <button
                onClick={() => setFilterResultStatus('ELIGIBLE')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
                  filterResultStatus === 'ELIGIBLE' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Eligible Saja ({eligibleCount})
              </button>
            </div>

            <div className="flex items-center gap-2 flex-1 justify-end">
              <div className="relative min-w-[160px] max-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari dalam hasil..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-6 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <select
                value={filterTargetDiklat}
                onChange={(e) => setFilterTargetDiklat(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value))}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium max-w-[170px] truncate"
              >
                <option value="ALL">Semua 43 Diklat</option>
                {evaluationResults.map(r => (
                  <option key={r.program.id} value={r.program.id}>
                    {r.program.code} - {r.program.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {filteredResults.map((result) => {
              const prog = result.program;
              const isEligible = result.status === 'ELIGIBLE';
              const isConsideration = result.status === 'CONSIDERATION';

              return (
                <div
                  key={prog.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isEligible 
                      ? 'bg-white border-emerald-200 hover:border-emerald-400 shadow-xs' 
                      : isConsideration 
                      ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300' 
                      : 'bg-slate-50/80 border-slate-200 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {prog.code}
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isEligible 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : isConsideration 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {isEligible && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {isConsideration && <AlertCircle className="w-3 h-3 text-amber-600" />}
                          {!isEligible && !isConsideration && <XCircle className="w-3 h-3 text-red-600" />}
                          <span>
                            {isEligible ? 'Memenuhi Syarat' : isConsideration ? 'Perlu Pertimbangan' : 'Belum Memenuhi Syarat'}
                          </span>
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Kesesuaian: <strong>{result.score}%</strong>
                        </span>
                      </div>

                      <h4 
                        onClick={() => onSelectProgram(prog)}
                        className="font-bold text-slate-900 text-sm hover:text-amber-700 cursor-pointer transition"
                      >
                        {prog.name}
                      </h4>

                      <div className="mt-2 text-xs space-y-1">
                        {result.reasons.map((r, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-slate-600">
                            <span className="text-slate-400 mt-0.5">•</span>
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>

                      {result.recommendations.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-amber-900 font-medium flex items-center gap-1">
                          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{result.recommendations[0]}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <button
                        onClick={() => onSelectProgram(prog)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                      >
                        <span>Silabus</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
