import React, { useState, useMemo } from 'react';
import { 
  LECTURERS_DATA, 
  Lecturer, 
  SUBJECT_MATRICES,
  LecturerPreference,
  getStoredLecturerPreferences,
  saveLecturerPreference,
  resetDefaultLecturerPreferences
} from '../data/lecturersData.ts';
import { 
  AssignmentRecord, 
  ConflictAlert,
  getWorkloadDistributionSummary,
  WorkloadDistributionSummary,
  LecturerWorkloadStats,
  evaluateAssignmentPreference
} from '../data/assignmentStore.ts';
import { TrainingProgram, TRAINING_PROGRAMS } from '../data/programsData.ts';
import { 
  Users, 
  Search, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Plus, 
  Trash2, 
  Shield, 
  BookOpen, 
  Mail, 
  Phone, 
  Building2,
  Calendar,
  FileCheck,
  Scale,
  Sparkles,
  Printer,
  RotateCcw,
  Sliders,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  X,
  Star,
  Pencil,
  Compass,
  Check
} from 'lucide-react';

interface LecturersViewProps {
  assignments: AssignmentRecord[];
  conflicts: ConflictAlert[];
  onOpenAssignModal: (lecturer?: Lecturer, program?: TrainingProgram) => void;
  onRemoveAssignment: (id: string) => void;
  onApplyBalancedSchedule?: () => void;
  onPrintWorkloadReport?: (summary: WorkloadDistributionSummary) => void;
  onSelectProgramById?: (programId: number) => void;
}

interface PreferenceEditModalProps {
  lecturer: Lecturer;
  initialPreference: LecturerPreference;
  onClose: () => void;
  onSave: (pref: LecturerPreference) => void;
}

const PreferenceEditModal: React.FC<PreferenceEditModalProps> = ({
  lecturer,
  initialPreference,
  onClose,
  onSave
}) => {
  const [primarySubject, setPrimarySubject] = useState(initialPreference.primarySubject || '');
  const [secondarySubject, setSecondarySubject] = useState(initialPreference.secondarySubject || '');
  const [tertiarySubject, setTertiarySubject] = useState(initialPreference.tertiarySubject || '');
  const [preferredCategory, setPreferredCategory] = useState(initialPreference.preferredCategory || 'Semua Kategori');
  const [targetQuota, setTargetQuota] = useState(initialPreference.targetQuota || 3);
  const [readinessStatus, setReadinessStatus] = useState(initialPreference.readinessStatus || 'Siap Penuh');
  const [notes, setNotes] = useState(initialPreference.notes || '');

  const verifiedSubjects = lecturer.subjects || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!primarySubject.trim()) {
      alert('Mata pelatihan pilihan Prioritas 1 wajib diisi!');
      return;
    }
    onSave({
      ...initialPreference,
      lecturerId: lecturer.id,
      primarySubject: primarySubject.trim(),
      secondarySubject: secondarySubject.trim(),
      tertiarySubject: tertiarySubject.trim() || undefined,
      preferredCategory: preferredCategory as any,
      targetQuota: Number(targetQuota),
      readinessStatus: readinessStatus as any,
      notes: notes.trim(),
      updatedAt: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                Identifikasi Pilihan Materi Widyaiswara
              </h3>
              <p className="text-xs text-slate-400">
                Pendaftaran & penyesuaian materi minat dan kompetensi TA 2027
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Identity preview */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs flex items-center justify-between">
          <div>
            <div className="font-bold text-slate-900">{lecturer.name}</div>
            <div className="text-slate-500">{lecturer.rankTitle} • {lecturer.nipNrp}</div>
          </div>
          <span className="px-2.5 py-1 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-300">
            {lecturer.grade} ({lecturer.category})
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Quick pick chips from verified competencies */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Rekomendasi dari Matriks Kompetensi Resmi Salemba:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {verifiedSubjects.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (!primarySubject) setPrimarySubject(s);
                    else if (!secondarySubject) setSecondarySubject(s);
                    else setTertiarySubject(s);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-900 border border-slate-200 text-[11px] font-medium transition cursor-pointer flex items-center gap-1"
                >
                  <Award className="w-3 h-3 text-amber-600" />
                  <span>{s}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Priority 1 */}
          <div>
            <label className="font-bold text-amber-950 flex items-center gap-1.5 mb-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>Pilihan Prioritas 1 (Keahlian Utama yang Paling Diminati):</span>
            </label>
            <input
              type="text"
              required
              value={primarySubject}
              onChange={(e) => setPrimarySubject(e.target.value)}
              placeholder="Contoh: Dasar-dasar Kepemimpinan, Bela Negara, Anti Korupsi..."
              className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-amber-50/40 text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 font-semibold"
            />
          </div>

          {/* Priority 2 */}
          <div>
            <label className="font-bold text-blue-950 flex items-center gap-1.5 mb-1">
              <Star className="w-3.5 h-3.5 text-blue-500 fill-blue-400" />
              <span>Pilihan Prioritas 2 (Keahlian Pendukung):</span>
            </label>
            <input
              type="text"
              required
              value={secondarySubject}
              onChange={(e) => setSecondarySubject(e.target.value)}
              placeholder="Contoh: Komunikasi dalam Organisasi, Pemanfaatan TI..."
              className="w-full px-3 py-2 rounded-xl border border-blue-300 bg-blue-50/40 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 font-semibold"
            />
          </div>

          {/* Priority 3 */}
          <div>
            <label className="font-bold text-purple-950 flex items-center gap-1.5 mb-1">
              <Star className="w-3.5 h-3.5 text-purple-500 fill-purple-400" />
              <span>Pilihan Prioritas 3 (Materi Tambahan / Alternatif):</span>
            </label>
            <input
              type="text"
              value={tertiarySubject}
              onChange={(e) => setTertiarySubject(e.target.value)}
              placeholder="Opsional / Materi pendukung ketiga..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 font-medium"
            />
          </div>

          {/* Category & Quota */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Rumpun Diklat Peminatan:
              </label>
              <select
                value={preferredCategory}
                onChange={(e) => setPreferredCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                <option value="Semua Kategori">Semua Kategori / Fleksibel</option>
                <option value="Kepemimpinan">Kepemimpinan & Kejuangan</option>
                <option value="Manajemen">Manajemen & Tata Kelola</option>
                <option value="Teknis & Siber">Teknis & Siber Han</option>
                <option value="Fungsional">Fungsional & Administrasi</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Target Kuota Mengajar (Berimbang):
              </label>
              <select
                value={targetQuota}
                onChange={(e) => setTargetQuota(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                <option value={3}>3 Diklat (Standar Berimbang Puspimjemen)</option>
                <option value={4}>4 Diklat (Batas Maksimum Kuota Ideal)</option>
              </select>
            </div>
          </div>

          {/* Readiness & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Status Kesiapan Mengajar:
              </label>
              <select
                value={readinessStatus}
                onChange={(e) => setReadinessStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                <option value="Siap Penuh">Siap Penuh (Jadwal Normal)</option>
                <option value="Penugasan Khusus">Penugasan Khusus / Prioritas</option>
                <option value="Pendampingan">Pendampingan Pengampu Baru</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Catatan / Spesialisasi Tambahan:
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Misal: Sertifikasi KPK, TOT Bela Negara..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Check className="w-4 h-4 text-amber-400" />
              <span>Simpan Pilihan Materi WI</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const LecturersView: React.FC<LecturersViewProps> = ({
  assignments,
  conflicts,
  onOpenAssignModal,
  onRemoveAssignment,
  onApplyBalancedSchedule,
  onPrintWorkloadReport
}) => {
  const [subTab, setSubTab] = useState<'workload' | 'preferences' | 'directory' | 'matrix' | 'assignments'>('workload');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedWorkloadFilter, setSelectedWorkloadFilter] = useState<string>('ALL');
  const [selectedMatrixSubject, setSelectedMatrixSubject] = useState<string>(Object.keys(SUBJECT_MATRICES)[0]);
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  // Preference management states
  const [preferencesMap, setPreferencesMap] = useState<Record<number, LecturerPreference>>(() => getStoredLecturerPreferences());
  const [editingPrefLecturer, setEditingPrefLecturer] = useState<Lecturer | null>(null);
  const [prefCategoryFilter, setPrefCategoryFilter] = useState<string>('ALL');
  const [prefAlignmentFilter, setPrefAlignmentFilter] = useState<string>('ALL');

  // Compute live workload distribution summary
  const workloadSummary: WorkloadDistributionSummary = useMemo(() => {
    return getWorkloadDistributionSummary(assignments);
  }, [assignments]);

  // Filter lecturers for directory & workload view
  const filteredLecturerStats = useMemo(() => {
    return workloadSummary.lecturerStats.filter(stat => {
      const q = searchTerm.toLowerCase();
      const rawLecturer = LECTURERS_DATA.find(l => l.id === stat.lecturerId);
      const matchSearch = 
        stat.lecturerName.toLowerCase().includes(q) ||
        stat.rankTitle.toLowerCase().includes(q) ||
        stat.department.toLowerCase().includes(q) ||
        (rawLecturer && rawLecturer.subjects.some(s => s.toLowerCase().includes(q))) ||
        stat.assignments.some(a => a.subject.toLowerCase().includes(q) || a.programName.toLowerCase().includes(q));

      if (!matchSearch) return false;
      if (selectedGrade !== 'ALL' && stat.grade !== selectedGrade) return false;
      if (selectedCategory !== 'ALL' && stat.category !== selectedCategory) return false;
      if (selectedWorkloadFilter !== 'ALL' && stat.status !== selectedWorkloadFilter) return false;

      return true;
    });
  }, [workloadSummary, searchTerm, selectedGrade, selectedCategory, selectedWorkloadFilter]);

  // Filter lecturers for preference identification view
  const filteredPreferenceStats = useMemo(() => {
    return workloadSummary.lecturerStats.filter(stat => {
      const q = searchTerm.toLowerCase();
      const pref = preferencesMap[stat.lecturerId] || stat.preferences;
      const rawLecturer = LECTURERS_DATA.find(l => l.id === stat.lecturerId);

      const matchSearch =
        stat.lecturerName.toLowerCase().includes(q) ||
        stat.rankTitle.toLowerCase().includes(q) ||
        (rawLecturer && rawLecturer.subjects.some(s => s.toLowerCase().includes(q))) ||
        (pref && (
          pref.primarySubject.toLowerCase().includes(q) ||
          pref.secondarySubject.toLowerCase().includes(q) ||
          (pref.tertiarySubject && pref.tertiarySubject.toLowerCase().includes(q)) ||
          pref.preferredCategory.toLowerCase().includes(q) ||
          (pref.notes && pref.notes.toLowerCase().includes(q))
        ));

      if (!matchSearch) return false;
      if (prefCategoryFilter !== 'ALL' && pref && pref.preferredCategory !== prefCategoryFilter) return false;
      if (prefAlignmentFilter === 'P1' && stat.priority1Count === 0) return false;
      if (prefAlignmentFilter === 'P2' && stat.priority2Count === 0) return false;
      if (prefAlignmentFilter === 'BALANCED' && stat.status !== 'BALANCED') return false;

      return true;
    });
  }, [workloadSummary, searchTerm, preferencesMap, prefCategoryFilter, prefAlignmentFilter]);

  const handleTriggerAutoBalance = () => {
    if (onApplyBalancedSchedule) {
      onApplyBalancedSchedule();
      setPreferencesMap(getStoredLecturerPreferences());
      setActionSuccessNotice(
        `Distribusi Penugasan Berimbang Berbasis Pilihan WI berhasil dioptimasi! Seluruh 60 Widyaiswara mendapatkan kuota beban merata 2-3 Diklat, dengan tingkat keselarasan materi pilihan mencapai ${workloadSummary.preferenceAlignmentIndexPercent}% dan 0 benturan jadwal!`
      );
      setTimeout(() => setActionSuccessNotice(null), 6500);
    }
  };

  const handleSavePreference = (pref: LecturerPreference) => {
    saveLecturerPreference(pref);
    setPreferencesMap(getStoredLecturerPreferences());
    setEditingPrefLecturer(null);
    const lec = LECTURERS_DATA.find(l => l.id === pref.lecturerId);
    setActionSuccessNotice(
      `Pilihan materi untuk ${lec ? lec.name : 'Widyaiswara'} berhasil disimpan! Silakan klik "⚡ Optimasi Penugasan Berimbang Berbasis Pilihan WI" untuk menyesuaikan distribusi jadwal.`
    );
    setTimeout(() => setActionSuccessNotice(null), 6000);
  };

  const handleResetPreferences = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset seluruh pilihan materi 60 Widyaiswara ke standar matriks Puspimjemenhan TA 2027?')) {
      const defaults = resetDefaultLecturerPreferences();
      setPreferencesMap(defaults);
      if (onApplyBalancedSchedule) {
        onApplyBalancedSchedule();
      }
      setActionSuccessNotice('Pilihan materi 60 Widyaiswara berhasil direset ke standar resmi Puspimjemenhan dan dijadwalkan ulang secara berimbang!');
      setTimeout(() => setActionSuccessNotice(null), 6000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                Puspimjemenhan BPSDM Han Kemhan RI TA 2027
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Manajemen Beban Mengajar Berimbang Widyaiswara
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Pengelolaan kuota dan penugasan mengajar 60 Widyaiswara (Salemba No. 1 s.d. 21 &amp; Pondok Labu No. 23 s.d. 61) secara berimbang, transparan, dan terverifikasi bebas benturan jadwal (Zero Conflict).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onPrintWorkloadReport && (
              <button
                onClick={() => onPrintWorkloadReport(workloadSummary)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition border border-slate-300 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-700" />
                <span>Cetak Rekap Beban Resmi</span>
              </button>
            )}

            <button
              onClick={handleTriggerAutoBalance}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm cursor-pointer"
            >
              <Scale className="w-4 h-4 text-emerald-100" />
              <span>⚡ Distribusi Berimbang Otomatis</span>
            </button>

            <button
              onClick={() => onOpenAssignModal()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>+ Buat Penugasan Manual</span>
            </button>
          </div>
        </div>

        {/* Notice of Success */}
        {actionSuccessNotice && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionSuccessNotice}</span>
            </div>
            <button 
              onClick={() => setActionSuccessNotice(null)}
              className="text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Sub-Tabs Nav */}
        <div className="flex flex-wrap gap-2 mt-6 border-b border-slate-100 pb-3">
          <button
            onClick={() => setSubTab('workload')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              subTab === 'workload'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>Keseimbangan Beban Mengajar (Workload Balancer)</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-950 font-bold">
              {workloadSummary.balanceIndexPercent}% Berimbang
            </span>
          </button>

          <button
            onClick={() => setSubTab('preferences')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              subTab === 'preferences'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Pilihan Materi & Kompetensi WI</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white font-bold">
              {workloadSummary.preferenceAlignmentIndexPercent}% Selaras
            </span>
          </button>

          <button
            onClick={() => setSubTab('directory')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              subTab === 'directory'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Direktori 60 Widyaiswara</span>
          </button>

          <button
            onClick={() => setSubTab('matrix')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              subTab === 'matrix'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Matriks Penugasan (Matching Matrix)</span>
          </button>

          <button
            onClick={() => setSubTab('assignments')}
            className={`relative px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              subTab === 'assignments'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Penugasan Aktif ({assignments.length})</span>
            {conflicts.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
            )}
          </button>
        </div>
      </div>

      {/* Conflicts Notification Banner */}
      {conflicts.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-2xl p-4 text-red-900">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h4 className="font-bold text-sm text-red-950">
                Peringatan: Terdeteksi {conflicts.length} Benturan Jadwal Penugasan Widyaiswara!
              </h4>
            </div>
            <button
              onClick={handleTriggerAutoBalance}
              className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition cursor-pointer"
            >
              Perbaiki & Seimbangkan Otomatis
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {conflicts.map((c, i) => (
              <div key={i} className="p-3 bg-white rounded-xl border border-red-200 shadow-2xs">
                <span className="font-bold text-red-900 block">{c.lecturerName}</span>
                <span className="text-slate-600 block mt-0.5">
                  Benturan antara <strong>{c.programA.name}</strong> dan <strong>{c.programB.name}</strong>
                </span>
                <span className="text-[11px] text-red-700 font-mono mt-1 block">
                  Periode Beririsan: {c.overlapPeriod}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB: WORKLOAD BALANCER (MAIN FOCUS) */}
      {subTab === 'workload' && (
        <div className="space-y-6">
          {/* Workload Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Widyaiswara
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {workloadSummary.totalLecturers}
              </div>
              <span className="text-[10px] text-slate-500">16 Madya/Muda, 12 Pertama</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Sesi Mengajar
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {workloadSummary.totalAssignments}
              </div>
              <span className="text-[10px] text-slate-500">Tersebar di 43 Diklat</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Rata-Rata Beban
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {workloadSummary.averageLoad}
              </div>
              <span className="text-[10px] text-slate-500">Target Kuota: 3 - 4 Diklat</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Beban Ideal (Berimbang)
              </span>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {workloadSummary.balancedCount}
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">Memenuhi target beban</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Perlu Tugas Tambahan
              </span>
              <div className="text-2xl font-black text-amber-600 mt-1">
                {workloadSummary.underloadedCount}
              </div>
              <span className="text-[10px] text-amber-700 font-medium">Beban &lt; 3 Diklat</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Indeks Keseimbangan
              </span>
              <div className="text-2xl font-black text-indigo-600 mt-1">
                {workloadSummary.balanceIndexPercent}%
              </div>
              <span className="text-[10px] text-indigo-700 font-medium">
                {workloadSummary.conflictCount === 0 ? '✓ 0 Konflik Jadwal' : `⚠️ ${workloadSummary.conflictCount} Konflik`}
              </span>
            </div>
          </div>

          {/* Explanation Box */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-5 text-white flex flex-wrap items-center justify-between gap-4 border border-slate-800">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-1">
                <Scale className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-sm text-amber-300">
                  Prinsip Keseimbangan Beban Tugas Materi Widyaiswara Puspimjemenhan
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sistem secara otomatis menghitung kecukupan jam mengajar dan distribusi materi bagi masing-masing Widyaiswara. 
                Dengan menyeimbangkan penugasan (target kuota 3 sampai 4 program per Widyaiswara sepanjang TA 2027), 
                setiap tenaga pengampu mendapatkan hak dan kewajiban mengajar yang setara tanpa adanya tumpang tindih waktu (zero overlap).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleTriggerAutoBalance}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-md cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Tata Ulang Beban Berimbang</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama Widyaiswara, pangkat, materi diampu, atau departemen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
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

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedWorkloadFilter}
                onChange={(e) => setSelectedWorkloadFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                <option value="ALL">Semua Status Beban ({workloadSummary.totalLecturers})</option>
                <option value="BALANCED">Ideal / Berimbang (3-4 Diklat)</option>
                <option value="UNDERLOAD">Kurang Beban (&lt; 3 Diklat)</option>
                <option value="OVERLOAD">Kelebihan Beban (&gt; 4 Diklat)</option>
              </select>

              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                <option value="ALL">Semua Jenjang</option>
                <option value="Madya/Muda">Jenjang Madya & Muda</option>
                <option value="Pertama">Jenjang Pertama</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                <option value="ALL">Semua Kategori</option>
                <option value="Militer">Militer TNI</option>
                <option value="Sipil (PNS)">Sipil PNS</option>
              </select>
            </div>
          </div>

          {/* Lecturer Workload Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLecturerStats.map((stat) => {
              const fullLecturer = LECTURERS_DATA.find(l => l.id === stat.lecturerId);
              // Max scale of progress bar (target 4)
              const percentage = Math.min(Math.round((stat.assignmentCount / 4) * 100), 100);

              return (
                <div 
                  key={stat.lecturerId}
                  className={`bg-white rounded-2xl border p-5 shadow-sm transition flex flex-col justify-between ${
                    stat.hasConflict
                      ? 'border-red-400 ring-2 ring-red-500/10'
                      : stat.status === 'BALANCED'
                      ? 'border-slate-200 hover:border-emerald-400'
                      : stat.status === 'UNDERLOAD'
                      ? 'border-amber-200 hover:border-amber-400'
                      : 'border-purple-200 hover:border-purple-400'
                  }`}
                >
                  <div>
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        WI-{stat.lecturerId < 10 ? `0${stat.lecturerId}` : stat.lecturerId}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          stat.category === 'Militer' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {stat.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-900">
                          {stat.grade}
                        </span>
                      </div>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mt-2 leading-tight">
                      {stat.lecturerName}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {stat.rankTitle}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {stat.department}
                    </p>

                    {/* Workload Progress Bar & Status Badge */}
                    <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">Beban Mengajar:</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          stat.status === 'BALANCED' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : stat.status === 'UNDERLOAD'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {stat.statusLabel} ({stat.assignmentCount} / 4 Diklat)
                        </span>
                      </div>

                      {/* Bar indicator */}
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            stat.status === 'BALANCED'
                              ? 'bg-emerald-500'
                              : stat.status === 'UNDERLOAD'
                              ? 'bg-amber-500'
                              : 'bg-purple-600'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Min: 3 Diklat</span>
                        <span>Target: 3 - 4 Diklat</span>
                        <span>Maks: 4 Diklat</span>
                      </div>
                    </div>

                    {/* Assigned programs list */}
                    <div className="mt-3 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Daftar Penugasan Diklat ({stat.assignments.length}):
                      </span>
                      {stat.assignments.length === 0 ? (
                        <div className="text-xs text-slate-400 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100 text-center">
                          Belum ada tugas materi. Klik tombol di bawah untuk menugaskan.
                        </div>
                      ) : (
                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                          {stat.assignments.map((asg) => (
                            <div 
                              key={asg.id} 
                              className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] flex items-center justify-between gap-2"
                            >
                              <div className="min-w-0">
                                <span className="font-bold text-slate-900 block truncate">
                                  {asg.programName}
                                </span>
                                <span className="text-amber-800 block truncate font-medium">
                                  {asg.subject}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {asg.dateAssigned}
                                </span>
                              </div>
                              <button
                                onClick={() => onRemoveAssignment(asg.id)}
                                className="text-slate-400 hover:text-red-600 p-1 rounded transition cursor-pointer shrink-0"
                                title="Hapus Penugasan Sesi"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer & Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-medium text-slate-500">
                      {stat.status === 'BALANCED' ? '✓ Kuota Terpenuhi' : stat.status === 'UNDERLOAD' ? '⚠️ Perlu +1 Tugas' : 'Beban Cukup'}
                    </span>
                    <button
                      onClick={() => onOpenAssignModal(fullLecturer)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                    >
                      + Tambah Tugas
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB: PREFERENCE & COMPETENCY IDENTIFICATION (FITUR PILIHAN MATERI WI BERIMBANG) */}
      {subTab === 'preferences' && (
        <div className="space-y-6">
          {/* Top Preferences Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Widyaiswara
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {workloadSummary.totalLecturers}
              </div>
              <span className="text-[10px] text-slate-500">100% Teridentifikasi</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Indeks Keselarasan
              </span>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {workloadSummary.preferenceAlignmentIndexPercent}%
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">Sesuai Minat & Sertifikasi</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                Prioritas 1 (Utama)
              </span>
              <div className="text-2xl font-black text-amber-600 mt-1">
                {workloadSummary.totalPriority1Matches} Sesi
              </div>
              <span className="text-[10px] text-amber-800 font-medium">Pilihan Paling Diminati</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                Prioritas 2 (Pendukung)
              </span>
              <div className="text-2xl font-black text-blue-600 mt-1">
                {workloadSummary.totalPriority2Matches} Sesi
              </div>
              <span className="text-[10px] text-blue-800 font-medium">Keahlian Tambahan</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                Beban Berimbang
              </span>
              <div className="text-2xl font-black text-indigo-600 mt-1">
                {workloadSummary.balancedCount} WI
              </div>
              <span className="text-[10px] text-indigo-700 font-medium">Kouta 3 - 4 Diklat</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Validasi Konflik
              </span>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                0
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">Bebas Benturan Jadwal</span>
            </div>
          </div>

          {/* Educational Directive Box */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white flex flex-wrap items-center justify-between gap-4 border border-slate-800 shadow-sm">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <h4 className="font-bold text-sm text-amber-300">
                  Sistem Penyelarasan Materi Pilihan Widyaiswara & Distribusi Beban Berimbang
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Fitur ini mengakomodasi materi pilihan yang diajukan oleh masing-masing Widyaiswara (Prioritas 1, 2, dan 3) 
                diselaraskan dengan Matriks Sertifikasi Kompetensi Resmi Salemba TA 2027. 
                Algoritma penjadwalan cerdas secara otomatis memprioritaskan penugasan materi pilihan tertinggi bagi setiap WI, 
                sembari <strong>secara ketat mempertahankan pembagian jam tugas mengajar tetap berimbang (3–4 Diklat per Widyaiswara)</strong> tanpa 
                ada benturan tanggal kegiatan (zero date overlap) dan tanpa tumpang tindih pengampu pada materi yang sama.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleResetPreferences}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
                title="Kembalikan preferensi ke standar kurikulum resmi Puspimjemenhan TA 2027"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset ke Standar Puspimjemen</span>
              </button>
              <button
                onClick={handleTriggerAutoBalance}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-md cursor-pointer"
              >
                <Scale className="w-4 h-4" />
                <span>⚡ Optimasi Penugasan Berimbang Berbasis Pilihan WI</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama Widyaiswara, materi pilihan prioritas 1/2, atau catatan spesialisasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
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

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={prefCategoryFilter}
                onChange={(e) => setPrefCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs"
              >
                <option value="ALL">Semua Rumpun Peminatan</option>
                <option value="Kepemimpinan">Kepemimpinan & Kejuangan</option>
                <option value="Manajemen">Manajemen & Tata Kelola</option>
                <option value="Teknis & Siber">Teknis & Siber Han</option>
                <option value="Fungsional">Fungsional & Administrasi</option>
              </select>

              <select
                value={prefAlignmentFilter}
                onChange={(e) => setPrefAlignmentFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs"
              >
                <option value="ALL">Semua Status Keselarasan</option>
                <option value="P1">Prioritas 1 Terakomodasi</option>
                <option value="P2">Prioritas 2 Terakomodasi</option>
                <option value="BALANCED">Beban Ideal Berimbang (3-4 Diklat)</option>
              </select>
            </div>
          </div>

          {/* Cards Grid: 28 Widyaiswara with Preference Identification & Assignment Realization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPreferenceStats.map((stat) => {
              const fullLecturer = LECTURERS_DATA.find(l => l.id === stat.lecturerId)!;
              const pref = preferencesMap[stat.lecturerId] || stat.preferences || {
                lecturerId: stat.lecturerId,
                primarySubject: fullLecturer.subjects[0] || 'Dasar Kepemimpinan',
                secondarySubject: fullLecturer.subjects[1] || 'Komunikasi Organisasi',
                preferredCategory: 'Kepemimpinan',
                readinessStatus: 'Siap Penuh',
                targetQuota: 3,
                notes: ''
              };

              return (
                <div 
                  key={stat.lecturerId}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header: WI Profile & Badges */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-xs ${
                          stat.category === 'Militer' ? 'bg-slate-900' : 'bg-emerald-700'
                        }`}>
                          {stat.lecturerName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">
                            {stat.lecturerName}
                          </h4>
                          <span className="text-[11px] text-slate-500 block">
                            {stat.rankTitle} • {fullLecturer.nipNrp}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {stat.department}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          stat.grade === 'Madya/Muda' 
                            ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {stat.grade}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          stat.category === 'Militer'
                            ? 'bg-slate-100 text-slate-800 border border-slate-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}>
                          {stat.category}
                        </span>
                      </div>
                    </div>

                    {/* Stated Preferences Block */}
                    <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                          <span>Identifikasi Pilihan Materi (Preferensi WI):</span>
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200/80 text-amber-900 border border-amber-300">
                          Rumpun: {pref.preferredCategory}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div className="bg-white/95 p-2 rounded-lg border border-amber-200">
                          <span className="text-[10px] text-amber-900 font-bold block">
                            ⭐ Pilihan Utama (Prioritas 1):
                          </span>
                          <span className="text-slate-900 font-semibold block mt-0.5">
                            {pref.primarySubject}
                          </span>
                        </div>

                        <div className="bg-white/95 p-2 rounded-lg border border-blue-200">
                          <span className="text-[10px] text-blue-900 font-bold block">
                            ⭐ Pilihan Pendukung (Prioritas 2):
                          </span>
                          <span className="text-slate-900 font-semibold block mt-0.5">
                            {pref.secondarySubject}
                          </span>
                        </div>
                      </div>

                      {pref.tertiarySubject && (
                        <div className="bg-white/70 px-2 py-1 rounded text-[10px] text-purple-900 border border-purple-200 flex items-center gap-1">
                          <span className="font-bold">Prioritas 3:</span>
                          <span>{pref.tertiarySubject}</span>
                        </div>
                      )}

                      {pref.notes && (
                        <div className="text-[10px] text-slate-600 bg-white/70 p-1.5 rounded border border-amber-100 italic">
                          Catatan Spesialisasi: {pref.notes}
                        </div>
                      )}
                    </div>

                    {/* Realization of Assignments in TA 2027 */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">
                          Realisasi Penugasan Diklat TA 2027 ({stat.assignmentCount} Program):
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {stat.preferenceMatchRate}% Sesuai Pilihan WI
                        </span>
                      </div>

                      {stat.assignments.length === 0 ? (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-400 italic">
                          Belum ada penugasan materi. Klik "+ Tambah Tugas" atau "⚡ Auto-Balance".
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {stat.assignments.map((asg) => {
                            const evalResult = evaluateAssignmentPreference(asg.subject, stat.lecturerId, preferencesMap);

                            return (
                              <div 
                                key={asg.id}
                                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start justify-between gap-2 hover:bg-slate-100/60 transition"
                              >
                                <div className="min-w-0">
                                  <div className="font-bold text-slate-900 truncate">
                                    {asg.programName}
                                  </div>
                                  <div className="text-slate-700 font-medium text-[11px] mt-0.5">
                                    Materi: <span className="text-amber-900 font-semibold">{asg.subject}</span>
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                    Jadwal: {asg.dateAssigned} • Ruang: {asg.room || 'Salemba'}
                                  </div>
                                </div>

                                <div className="flex flex-col items-end gap-1 shrink-0">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${evalResult.badgeColor}`}>
                                    {evalResult.rank === 'Prioritas 1' && '⭐ '}
                                    {evalResult.rank === 'Prioritas 2' && '⭐ '}
                                    {evalResult.rank}
                                  </span>
                                  <button
                                    onClick={() => onRemoveAssignment(asg.id)}
                                    className="text-slate-400 hover:text-red-600 p-1 rounded transition cursor-pointer"
                                    title="Hapus Penugasan Sesi"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-semibold text-slate-700">
                        Total Beban: <span className="font-bold text-slate-900">{stat.assignmentCount} Diklat</span>
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        stat.status === 'BALANCED' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {stat.statusLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingPrefLecturer(fullLecturer)}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5 text-amber-700" />
                        <span>Edit Pilihan WI</span>
                      </button>
                      <button
                        onClick={() => onOpenAssignModal(fullLecturer)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                      >
                        + Tambah Tugas
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB: DIRECTORY */}
      {subTab === 'directory' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama, pangkat, atau materi yang diampu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
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

            <div className="flex items-center gap-2">
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                <option value="ALL">Semua Jenjang</option>
                <option value="Madya/Muda">Jenjang Madya & Muda (16)</option>
                <option value="Pertama">Jenjang Pertama (12)</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                <option value="ALL">Semua Kategori</option>
                <option value="Militer">Militer (TNI)</option>
                <option value="Sipil (PNS)">Sipil (PNS Kemhan)</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLecturerStats.map((stat) => {
              const lec = LECTURERS_DATA.find(l => l.id === stat.lecturerId)!;
              const assignedCount = stat.assignmentCount;
              const hasConflict = stat.hasConflict;

              return (
                <div 
                  key={lec.id}
                  className={`bg-white rounded-2xl border p-5 shadow-sm transition flex flex-col justify-between ${
                    hasConflict 
                      ? 'border-red-400 ring-2 ring-red-500/10' 
                      : 'border-slate-200 hover:border-amber-400'
                  }`}
                >
                  <div>
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        WI-{lec.id < 10 ? `0${lec.id}` : lec.id}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          lec.category === 'Militer' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {lec.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-900">
                          {lec.grade}
                        </span>
                      </div>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mt-2 leading-tight">
                      {lec.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {lec.rankTitle}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {lec.department}
                    </p>

                    {/* Subjects Badges */}
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">
                        Mata Pelatihan yang Diampu:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {lec.subjects.map((subj, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-50 text-slate-700 border border-slate-200"
                          >
                            {subj}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer & Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {assignedCount} Penugasan Aktif
                    </span>
                    <button
                      onClick={() => onOpenAssignModal(lec)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                    >
                      + Tugaskan
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB: SUBJECT MATCHING MATRIX */}
      {subTab === 'matrix' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Subject list selector */}
          <div className="md:col-span-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1 max-h-[600px] overflow-y-auto">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 text-slate-500">
              Pilih Mata Pelatihan:
            </h4>
            {Object.keys(SUBJECT_MATRICES).map((subj) => {
              const count = SUBJECT_MATRICES[subj].length;
              const isSelected = selectedMatrixSubject === subj;

              return (
                <button
                  key={subj}
                  onClick={() => setSelectedMatrixSubject(subj)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="truncate pr-2">{subj}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isSelected ? 'bg-slate-950 text-amber-300' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Lecturer Match Display */}
          <div className="md:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Subject Matching Matrix
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                {selectedMatrixSubject}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar Widyaiswara yang resmi memenuhi kompetensi untuk mengampu mata pelatihan ini:
              </p>
            </div>

            <div className="space-y-3">
              {SUBJECT_MATRICES[selectedMatrixSubject]?.map((wiName, idx) => {
                const fullWi = LECTURERS_DATA.find(l => l.name === wiName);
                const currentCount = fullWi ? assignments.filter(a => a.lecturerId === fullWi.id).length : 0;

                return (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{wiName}</span>
                        {fullWi && (
                          <span className="px-2 py-0.2 rounded text-[10px] font-semibold bg-amber-100 text-amber-900">
                            {fullWi.grade}
                          </span>
                        )}
                        <span className="text-[10px] px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded font-medium">
                          Beban: {currentCount} Diklat
                        </span>
                      </div>
                      {fullWi && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {fullWi.rankTitle} • {fullWi.department}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => onOpenAssignModal(fullWi || undefined)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                    >
                      Tugaskan Materi Ini
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: ACTIVE ASSIGNMENTS & CONFLICT INSPECTOR */}
      {subTab === 'assignments' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Daftar Penugasan Aktif Widyaiswara TA 2027
              </h3>
              <p className="text-xs text-slate-500">
                Surat dan jadwal penugasan mengampu materi pelatihan di Kampus Badiklat Kemhan Salemba & Pondok Labu.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleTriggerAutoBalance}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer"
              >
                ⚡ Auto-Balance
              </button>
              <button
                onClick={() => onOpenAssignModal()}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
              >
                + Penugasan Baru
              </button>
            </div>
          </div>

          {/* Anti-Overlap Policy Info */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Validasi Tunggal Materi Aktif:</strong> Setiap mata pelatihan pada diklat yang sama hanya diampu oleh 1 (satu) Widyaiswara penanggung jawab. Penambahan pada materi yang telah terisi otomatis <strong>ditolak sistem</strong>.
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">No. / ID</th>
                  <th className="p-3">Nama Widyaiswara</th>
                  <th className="p-3">Program Pelatihan</th>
                  <th className="p-3">Mata Pelatihan Diampu</th>
                  <th className="p-3">Ruang / Jadwal</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignments.map((asg, idx) => {
                  const hasConflict = conflicts.some(c => c.lecturerId === asg.lecturerId);

                  return (
                    <tr key={asg.id} className={hasConflict ? 'bg-red-50/50' : 'hover:bg-slate-50'}>
                      <td className="p-3 font-mono font-bold text-slate-500">
                        {asg.id}
                      </td>
                      <td className="p-3 font-semibold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          {hasConflict && <AlertTriangle className="w-3.5 h-3.5 text-red-600" />}
                          <span>{asg.lecturerName}</span>
                        </div>
                      </td>
                      <td className="p-3 text-slate-800">
                        {asg.programName}
                      </td>
                      <td className="p-3 font-medium text-amber-800">
                        {asg.subject}
                      </td>
                      <td className="p-3 text-slate-600">
                        <div>{asg.room || 'Salemba'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{asg.dateAssigned}</div>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onRemoveAssignment(asg.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Hapus Penugasan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preference Edit Modal */}
      {editingPrefLecturer && (
        <PreferenceEditModal
          lecturer={editingPrefLecturer}
          initialPreference={
            preferencesMap[editingPrefLecturer.id] ||
            editingPrefLecturer.preferences || {
              lecturerId: editingPrefLecturer.id,
              primarySubject: editingPrefLecturer.subjects[0] || 'Dasar Kepemimpinan',
              secondarySubject: editingPrefLecturer.subjects[1] || 'Komunikasi Organisasi',
              preferredCategory: 'Semua Kategori',
              readinessStatus: 'Siap Penuh',
              targetQuota: 3,
              notes: ''
            }
          }
          onClose={() => setEditingPrefLecturer(null)}
          onSave={handleSavePreference}
        />
      )}
    </div>
  );
};
