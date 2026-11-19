import React, { useState, useMemo } from 'react';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  Sparkles, 
  Printer, 
  BookOpen, 
  Calendar, 
  Building2, 
  Layers, 
  Award, 
  Save, 
  RotateCcw, 
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet,
  Check,
  ChevronDown,
  Shield,
  Plus,
  Trash2
} from 'lucide-react';
import { 
  LECTURERS_DATA, 
  Lecturer, 
  LecturerPreference, 
  ProgramSubjectChoice,
  getProgramSubjects,
  getStoredLecturerPreferences, 
  saveLecturerPreference,
  DEFAULT_LECTURER_PREFERENCES
} from '../data/lecturersData.ts';
import { 
  AssignmentRecord, 
  WorkloadDistributionSummary, 
  getWorkloadDistributionSummary,
  generateBalancedAssignments,
  saveAssignments
} from '../data/assignmentStore.ts';
import { TRAINING_PROGRAMS, TrainingProgram } from '../data/programsData.ts';

interface WiIdentificationFormViewProps {
  assignments: AssignmentRecord[];
  onAssignmentsUpdated: (newAssignments: AssignmentRecord[]) => void;
  onOpenPrintModal: (type: 'workload-report' | 'program-recap' | 'comprehensive-recap' | 'wi-blank-form' | 'wi-individual-form', specificLecturer?: Lecturer) => void;
  onSelectProgram?: (program: TrainingProgram) => void;
}

export const WiIdentificationFormView: React.FC<WiIdentificationFormViewProps> = ({
  assignments,
  onAssignmentsUpdated,
  onOpenPrintModal,
  onSelectProgram
}) => {
  // Navigation tabs within this view
  const [activeSubTab, setActiveSubTab] = useState<'form' | 'recap' | 'synergy-matrix' | 'catalog'>('form');

  // Currently selected lecturer for the individual intake form (Default: WI #1)
  const [selectedLecturerId, setSelectedLecturerId] = useState<number>(1);

  // Stored preferences state
  const [preferencesMap, setPreferencesMap] = useState<Record<number, LecturerPreference>>(() => getStoredLecturerPreferences());

  // Current selected lecturer object
  const currentLecturer = useMemo(() => {
    return LECTURERS_DATA.find(l => l.id === selectedLecturerId) || LECTURERS_DATA[0];
  }, [selectedLecturerId]);

  // Current form input state initialized from stored preferences or defaults
  const currentPref = preferencesMap[selectedLecturerId] || DEFAULT_LECTURER_PREFERENCES[selectedLecturerId] || {
    lecturerId: selectedLecturerId,
    selectedPrograms: [
      {
        programId: 1,
        programCode: 'DIKLAT-01',
        programName: 'Pelatihan Berpikir Kreatif dan Inovatif',
        subject1: 'Membangun Creative Mindset',
        subject2: 'Melihat Masalah Secara Kreatif'
      },
      {
        programId: 2,
        programCode: 'DIKLAT-02',
        programName: 'Kursus Singkat Manajemen Pertahanan Negara (Suskatjemen Hanneg) untuk Eksekutif',
        subject1: 'Peran Sinergitas Pentahelix & Aksi Nasional Bela Negara',
        subject2: 'Geopolitik Global, Kawasan Indo-Pasifik & Maritim Indonesia'
      }
    ],
    primarySubject: currentLecturer.subjects[0] || 'Manajemen Strategis Pertahanan',
    secondarySubject: currentLecturer.subjects[1] || 'Kepemimpinan Visioner',
    tertiarySubject: 'Etika Pemerintahan & Bela Negara',
    preferredCategory: 'Kepemimpinan',
    readinessStatus: 'Siap Penuh',
    targetQuota: 2,
    notes: 'Kesiapan mengajar sesuai kurikulum Puspimjemenhan TA 2027.',
    preferredPrograms: [],
    preferredMethods: ['Klasikal', 'Blended Learning'],
    preferredLocation: 'Keduanya (Salemba & Pondok Labu)',
    availableQuarters: ['TW I', 'TW II', 'TW III', 'TW IV'],
    certifications: 'Sertifikasi Widyaiswara Badiklat Kemhan',
    submissionSource: 'Mandiri WI'
  };

  const [formData, setFormData] = useState<LecturerPreference>({ ...currentPref });

  // Update formData when selectedLecturerId changes
  React.useEffect(() => {
    const existing = preferencesMap[selectedLecturerId] || DEFAULT_LECTURER_PREFERENCES[selectedLecturerId];
    if (existing) {
      setFormData({ 
        ...existing,
        selectedPrograms: existing.selectedPrograms && existing.selectedPrograms.length > 0
          ? existing.selectedPrograms
          : [
              {
                programId: 1,
                programCode: 'DIKLAT-01',
                programName: 'Pelatihan Berpikir Kreatif dan Inovatif',
                subject1: 'Membangun Creative Mindset',
                subject2: 'Melihat Masalah Secara Kreatif'
              },
              {
                programId: 2,
                programCode: 'DIKLAT-02',
                programName: 'Kursus Singkat Manajemen Pertahanan Negara (Suskatjemen Hanneg) untuk Eksekutif',
                subject1: 'Peran Sinergitas Pentahelix & Aksi Nasional Bela Negara',
                subject2: 'Geopolitik Global, Kawasan Indo-Pasifik & Maritim Indonesia'
              }
            ],
        preferredPrograms: existing.preferredPrograms || [],
        preferredMethods: existing.preferredMethods || ['Klasikal', 'Blended Learning'],
        preferredLocation: existing.preferredLocation || 'Keduanya (Salemba & Pondok Labu)',
        availableQuarters: existing.availableQuarters || ['TW I', 'TW II', 'TW III', 'TW IV'],
        certifications: existing.certifications || 'Sertifikasi Pengampu Badiklat Kemhan',
        submissionSource: existing.submissionSource || 'Mandiri WI'
      });
    }
  }, [selectedLecturerId, preferencesMap]);

  // Notification state
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Workload summary across all 60 Widyaiswara
  const summary: WorkloadDistributionSummary = useMemo(() => {
    return getWorkloadDistributionSummary(assignments);
  }, [assignments]);

  // Lecturer search and filter state for recap table
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState<'all' | 'Utama' | 'Madya' | 'Muda' | 'Pertama'>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | 'Militer' | 'Sipil (PNS)'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'BALANCED' | 'UNDERLOAD' | 'OVERLOAD'>('all');

  // Synergy matrix filter state
  const [synergySearch, setSynergySearch] = useState('');
  const [synergyCategoryFilter, setSynergyCategoryFilter] = useState<'ALL' | string>('ALL');

  const filteredSynergyBalances = useMemo(() => {
    return (summary.programBalances || []).filter(bal => {
      const prog = TRAINING_PROGRAMS.find(p => p.id === bal.programId);
      const matchSearch = 
        bal.programName.toLowerCase().includes(synergySearch.toLowerCase()) ||
        bal.programCode.toLowerCase().includes(synergySearch.toLowerCase()) ||
        bal.tniInstructors.some(t => t.name.toLowerCase().includes(synergySearch.toLowerCase()) || t.subject.toLowerCase().includes(synergySearch.toLowerCase())) ||
        bal.sipilInstructors.some(s => s.name.toLowerCase().includes(synergySearch.toLowerCase()) || s.subject.toLowerCase().includes(synergySearch.toLowerCase()));

      const matchCategory = synergyCategoryFilter === 'ALL' || prog?.category === synergyCategoryFilter;
      return matchSearch && matchCategory;
    });
  }, [summary.programBalances, synergySearch, synergyCategoryFilter]);

  // Filtered lecturers in recap
  const filteredLecturerStats = useMemo(() => {
    return summary.lecturerStats.filter(stat => {
      const matchSearch = 
        stat.lecturerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stat.rankTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stat.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stat.assignments.some(a => a.subject.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchGrade = filterGrade === 'all' 
        ? true 
        : filterGrade === 'Madya' 
        ? (stat.grade === 'Madya' || stat.grade === 'Madya/Muda') 
        : stat.grade === filterGrade;

      const matchCategory = filterCategory === 'all' ? true : stat.category === filterCategory;
      const matchStatus = filterStatus === 'all' ? true : stat.status === filterStatus;

      return matchSearch && matchGrade && matchCategory && matchStatus;
    });
  }, [summary, searchTerm, filterGrade, filterCategory, filterStatus]);

  // Extract all distinct subjects available across all 43 programs in Katalog 2027
  const allCatalogSubjects = useMemo(() => {
    const set = new Set<string>();
    TRAINING_PROGRAMS.forEach(prog => {
      prog.curriculum.basic?.forEach(s => set.add(s));
      prog.curriculum.core?.forEach(s => set.add(s));
      prog.curriculum.supporting?.forEach(s => set.add(s));
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, []);

  // Handler for adding a new program choice (allows choosing > 2 Diklat)
  const handleAddProgramChoice = () => {
    const current = formData.selectedPrograms || [];
    // Pick first program not yet selected, or default to first
    const unselectedProg = TRAINING_PROGRAMS.find(p => !current.some(c => c.programId === p.id)) || TRAINING_PROGRAMS[0];
    const subjs = getProgramSubjects(unselectedProg);
    const newChoice: ProgramSubjectChoice = {
      programId: unselectedProg.id,
      programCode: unselectedProg.code,
      programName: unselectedProg.name,
      subject1: subjs[0] || 'Materi Utama Diklat',
      subject2: subjs.length > 1 ? subjs[1] : undefined
    };

    const nextSelected = [...current, newChoice];
    setFormData({
      ...formData,
      selectedPrograms: nextSelected,
      primarySubject: nextSelected[0]?.subject1 || formData.primarySubject,
      secondarySubject: nextSelected[0]?.subject2 || nextSelected[1]?.subject1 || formData.secondarySubject
    });
    showNotification(`+ Pilihan Diklat ke-${nextSelected.length} berhasil ditambahkan! Anda dapat memilih mata pelatihan melalui dropdown.`, 'info');
  };

  // Handler for removing a program choice
  const handleRemoveProgramChoice = (indexToRemove: number) => {
    const current = formData.selectedPrograms || [];
    if (current.length <= 1) {
      showNotification('Widyaiswara minimal memilih 1 Program Diklat.', 'error');
      return;
    }
    const nextSelected = current.filter((_, idx) => idx !== indexToRemove);
    setFormData({
      ...formData,
      selectedPrograms: nextSelected,
      primarySubject: nextSelected[0]?.subject1 || formData.primarySubject,
      secondarySubject: nextSelected[0]?.subject2 || nextSelected[1]?.subject1 || formData.secondarySubject
    });
  };

  // Handler for changing chosen program dropdown
  const handleProgramDropdownChange = (index: number, newProgramId: number) => {
    const current = [...(formData.selectedPrograms || [])];
    const newProg = TRAINING_PROGRAMS.find(p => p.id === newProgramId);
    if (!newProg) return;

    const availableSubjs = getProgramSubjects(newProg);
    current[index] = {
      programId: newProg.id,
      programCode: newProg.code,
      programName: newProg.name,
      subject1: availableSubjs[0] || 'Materi Utama Diklat',
      subject2: availableSubjs.length > 1 ? availableSubjs[1] : undefined
    };

    setFormData({
      ...formData,
      selectedPrograms: current,
      primarySubject: current[0]?.subject1 || formData.primarySubject,
      secondarySubject: current[0]?.subject2 || current[1]?.subject1 || formData.secondarySubject
    });
  };

  // Handler for changing subject dropdown (subject1 or subject2, strictly capped at max 2)
  const handleSubjectDropdownChange = (index: number, slot: 'subject1' | 'subject2', newSubject: string) => {
    const current = [...(formData.selectedPrograms || [])];
    if (!current[index]) return;

    if (slot === 'subject1') {
      current[index] = {
        ...current[index],
        subject1: newSubject,
        // If subject2 happens to be the same, reset subject2
        subject2: current[index].subject2 === newSubject ? undefined : current[index].subject2
      };
    } else {
      current[index] = {
        ...current[index],
        subject2: newSubject ? newSubject : undefined
      };
    }

    setFormData({
      ...formData,
      selectedPrograms: current,
      primarySubject: current[0]?.subject1 || formData.primarySubject,
      secondarySubject: current[0]?.subject2 || current[1]?.subject1 || formData.secondarySubject
    });
  };

  // Save handler for current lecturer preferences
  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    const currentProgs = formData.selectedPrograms || [];
    const updatedPref: LecturerPreference = {
      ...formData,
      lecturerId: selectedLecturerId,
      selectedPrograms: currentProgs,
      primarySubject: currentProgs[0]?.subject1 || formData.primarySubject || 'Kepemimpinan Strategis Pertahanan',
      secondarySubject: currentProgs[0]?.subject2 || currentProgs[1]?.subject1 || formData.secondarySubject || 'Bela Negara dalam Perspektif Sishanneg',
      preferredPrograms: currentProgs.map(cp => cp.programCode || `DIKLAT-${cp.programId}`),
      updatedAt: new Date().toISOString().split('T')[0]
    };

    saveLecturerPreference(updatedPref);
    setPreferencesMap(getStoredLecturerPreferences());
    showNotification(`✓ Preferensi & identifikasi materi untuk ${currentLecturer.name} (${currentProgs.length} Diklat terpilih, maks 2 materi/diklat) berhasil disimpan ke sistem!`, 'success');
  };

  // Re-run the balanced workload engine for all 60 Widyaiswara
  const handleExecuteBalancedOptimization = () => {
    const balanced = generateBalancedAssignments();
    saveAssignments(balanced);
    onAssignmentsUpdated(balanced);
    showNotification('⚡ Optimasi beban berimbang untuk 60 Widyaiswara berhasil dijalankan! Semua 60 WI terdistribusi (2-3 diklat) tanpa tumpang tindih.', 'success');
  };

  // Toggle quarter selection
  const handleQuarterToggle = (q: 'TW I' | 'TW II' | 'TW III' | 'TW IV') => {
    const current = formData.availableQuarters || ['TW I', 'TW II', 'TW III', 'TW IV'];
    if (current.includes(q)) {
      if (current.length > 1) {
        setFormData({ ...formData, availableQuarters: current.filter(item => item !== q) });
      }
    } else {
      setFormData({ ...formData, availableQuarters: [...current, q] });
    }
  };

  // Toggle method selection
  const handleMethodToggle = (method: 'Klasikal' | 'Blended Learning' | 'Daring') => {
    const current = formData.preferredMethods || ['Klasikal', 'Blended Learning'];
    if (current.includes(method)) {
      if (current.length > 1) {
        setFormData({ ...formData, preferredMethods: current.filter(m => m !== method) });
      }
    } else {
      setFormData({ ...formData, preferredMethods: [...current, method] });
    }
  };

  // Get current lecturer's assignments
  const currentLecturerAssignments = useMemo(() => {
    return assignments.filter(a => a.lecturerId === selectedLecturerId);
  }, [assignments, selectedLecturerId]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className={`p-4 rounded-xl border text-sm flex items-center justify-between shadow-lg transition-all animate-in fade-in slide-in-from-top-2 duration-300 ${
          notification.type === 'success' 
            ? 'bg-emerald-950/90 text-emerald-200 border-emerald-600/60 shadow-emerald-950/40' 
            : notification.type === 'error'
            ? 'bg-red-950/90 text-red-200 border-red-600/60 shadow-red-950/40'
            : 'bg-blue-950/90 text-blue-200 border-blue-600/60 shadow-blue-950/40'
        }`}>
          <div className="flex items-center gap-2.5 font-medium">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="text-xs opacity-75 hover:opacity-100 font-mono px-2 py-0.5 rounded bg-black/20"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Main Header Card with Kemhan Badiklat Identity */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-amber-950/60 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-xl text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-xs font-bold tracking-wide flex items-center gap-1.5">
                <ClipboardList className="w-3.5 h-3.5" />
                INSTRUMEN IDENTIFIKASI AWAL TA 2027
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold">
                60 Widyaiswara & APN Puspimjemenhan
              </span>
              <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Plt. Kapuspimjemenhan: Laksma TNI Anis Rusdiyono
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-700/60 text-xs font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> 100% Kuota Berimbang Terpenuhi
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
              Formulir Identifikasi Awal Pemilihan Materi & Mata Diklat WI
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Instrumen resmi penyerapan aspirasi dan pemetaan kompetensi 60 Widyaiswara (39 TNI & 21 PNS Kemhan) 
              berdasarkan <strong>Katalog Diklat TA 2027 (43 Program)</strong>. Menjamin kesesuaian keahlian, pemerataan 
              beban mengajar ideal (2–3 diklat/WI), serta pencegahan tumpang tindih dan bentrok jadwal.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <button
              onClick={handleExecuteBalancedOptimization}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-amber-500/20 cursor-pointer"
              title="Jalankan otomatisasi distribusi berimbang 60 WI"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>⚡ Optimasi Beban Berimbang</span>
            </button>

            <button
              onClick={() => onOpenPrintModal('workload-report')}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-md shadow-amber-500/20 cursor-pointer"
              title="Cetak rekapitulasi penetapan beban 60 WI format Minu Kemhan"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>Cetak Rekap Beban 60 WI</span>
            </button>

            <button
              onClick={() => onOpenPrintModal('program-recap')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-semibold text-xs flex items-center gap-2 transition cursor-pointer"
              title="Cetak rekapitulasi lengkap 43 Program Diklat TA 2027"
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Cetak Rekap 43 Diklat</span>
            </button>

            <button
              onClick={() => onOpenPrintModal('comprehensive-recap')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-semibold text-xs flex items-center gap-2 transition cursor-pointer"
              title="Cetak Laporan Eksekutif Terpadu Minu Kemhan RI"
            >
              <Award className="w-4 h-4 text-purple-400" />
              <span>Cetak Laporan Terpadu</span>
            </button>

            <button
              onClick={() => onOpenPrintModal('wi-blank-form')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-semibold text-xs flex items-center gap-2 transition cursor-pointer"
              title="Cetak formulir fisik kosong untuk survei 60 Widyaiswara"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Cetak Blanko Survei 60 WI</span>
            </button>
          </div>
        </div>

        {/* 60-WI Balance Status Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-400">Total Widyaiswara Terdata:</div>
            <div className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5 mt-0.5">
              <span>60 Personel</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">100%</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Salemba: 21 WI • Pondok Labu: 39 WI (39 TNI & 21 PNS)</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-400">Alokasi Beban Mengajar:</div>
            <div className="text-base sm:text-lg font-bold text-amber-400 flex items-center gap-1.5 mt-0.5">
              <span>{summary.totalAssignments} Sesi Mengajar</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Rata-rata: {summary.averageLoad} diklat/personel</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-400">Pemerataan & Keseimbangan:</div>
            <div className="text-base sm:text-lg font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <span>{summary.balanceIndexPercent}% Berimbang</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Min: {summary.minLoad} • Max: {summary.maxLoad} Diklat</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-400">Sinergi Pengampu TNI - Sipil:</div>
            <div className="text-base sm:text-lg font-bold text-amber-400 flex items-center gap-1.5 mt-0.5">
              <span>{summary.tniSipilBalancedProgramsCount} / {summary.totalProgramsCount} Diklat</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">100%</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">39 TNI (Avg {summary.averageTniLoad}) • 21 PNS (Avg {summary.averageSipilLoad})</div>
          </div>
        </div>
      </div>

      {/* Mode SubTab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab('form')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'form'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardList className="w-4 h-4 text-amber-600" />
            <span>Formulir Pengisian Mandiri WI</span>
          </button>

          <button
            onClick={() => setActiveSubTab('recap')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'recap'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Rekapitulasi 60 WI</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-mono">60</span>
          </button>

          <button
            onClick={() => setActiveSubTab('synergy-matrix')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'synergy-matrix'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4 text-amber-600" />
            <span>Matriks Sinergi TNI - Sipil (43 Diklat)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-mono font-bold">100% Berimbang</span>
          </button>

          <button
            onClick={() => setActiveSubTab('catalog')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'catalog'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Katalog Materi 43 Diklat</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Tahun Anggaran: <span className="font-bold text-slate-800">2027</span> • Puspimjemenhan Badiklat Kemhan
        </div>
      </div>

      {/* SUBTAB 1: FORMULIR IDENTIFIKASI MANDIRI PER WI */}
      {activeSubTab === 'form' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Quick WI Selector & Profile Card */}
          <div className="lg:col-span-4 space-y-5">
            {/* WI Selector Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pilih Widyaiswara (60 Personel: Salemba No. 1 s.d. 21 &amp; Pondok Labu No. 23 s.d. 61)
                </label>
                <div className="relative">
                  <select
                    value={selectedLecturerId}
                    onChange={(e) => setSelectedLecturerId(Number(e.target.value))}
                    className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    <optgroup label="Wilayah Salemba (21 Widyaiswara: No. 1 s.d. 21)">
                      {LECTURERS_DATA.filter(l => l.id <= 21).map((lec) => {
                        const lecAssignments = assignments.filter(a => a.lecturerId === lec.id);
                        return (
                          <option key={lec.id} value={lec.id}>
                            No. {lec.id} • {lec.name} ({lec.rankTitle}) [{lecAssignments.length} Diklat]
                          </option>
                        );
                      })}
                    </optgroup>
                    <optgroup label="Wilayah Pondok Labu (39 Widyaiswara: No. 23 s.d. 61)">
                      {LECTURERS_DATA.filter(l => l.id > 21).map((lec) => {
                        const lecAssignments = assignments.filter(a => a.lecturerId === lec.id);
                        return (
                          <option key={lec.id} value={lec.id}>
                            No. {lec.id} • {lec.name} ({lec.rankTitle}) [{lecAssignments.length} Diklat]
                          </option>
                        );
                      })}
                    </optgroup>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Pilih personel untuk melihat dan memperbarui identifikasi materi & beban mengajar.
                </p>
              </div>

              {/* Profile Overview */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-md shrink-0">
                    WI-{currentLecturer.id}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">
                      {currentLecturer.name}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      {currentLecturer.rankTitle}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300">
                        {currentLecturer.grade}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-medium">
                        {currentLecturer.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Satker / Unit:</span>
                    <span className="font-semibold text-slate-800 text-right">{currentLecturer.department}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Jenjang Jabatan:</span>
                    <span className="font-bold text-amber-800">Widyaiswara Ahli {currentLecturer.grade}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Status Beban Saat Ini:</span>
                    <span className={`font-bold px-1.5 py-0.2 rounded text-[11px] ${
                      currentLecturerAssignments.length >= 2 && currentLecturerAssignments.length <= 3
                        ? 'bg-emerald-100 text-emerald-800'
                        : currentLecturerAssignments.length < 2
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {currentLecturerAssignments.length} Diklat ({
                        currentLecturerAssignments.length >= 2 && currentLecturerAssignments.length <= 3 
                          ? 'Ideal' 
                          : currentLecturerAssignments.length < 2 ? 'Kurang' : 'Kelebihan'
                      })
                    </span>
                  </div>
                </div>

                {/* Verified Competencies */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Kompetensi Bersertifikat (Salemba):
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {currentLecturer.subjects.map((s, idx) => (
                      <span key={idx} className="text-[10px] bg-white border border-slate-300 text-slate-700 px-2 py-0.5 rounded font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Current Active Assignments */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Program yang Ditugaskan:</span>
                    <span className="font-mono text-amber-700 font-bold">{currentLecturerAssignments.length} Diklat</span>
                  </div>
                  {currentLecturerAssignments.length === 0 ? (
                    <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                      Belum ada penugasan materi. Klik tombol Optimasi untuk memberikan penugasan.
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {currentLecturerAssignments.map((asg, aidx) => (
                        <div key={aidx} className="bg-white p-2 rounded-lg border border-slate-200 text-xs">
                          <div className="font-bold text-slate-900 leading-tight">
                            {asg.subject}
                          </div>
                          <div className="text-[10px] text-slate-600 mt-0.5 truncate">
                            {asg.programName}
                          </div>
                          <div className="flex items-center justify-between mt-1 text-[9px] text-slate-500">
                            <span>{asg.dateAssigned}</span>
                            <span className="font-semibold text-emerald-700">{asg.preferenceRank}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Print Individual WI Button */}
                <button
                  type="button"
                  onClick={() => onOpenPrintModal('wi-individual-form', currentLecturer)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cetak Form Individu ({currentLecturer.name.split(' ')[0]})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Input Form */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSavePreferences} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Formulir Pemilihan Materi & Peminatan Mata Diklat
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pengisian mandiri/verifikasi admin untuk Widyaiswara: <strong>{currentLecturer.name}</strong>
                    </p>
                  </div>
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-300">
                    ID #{currentLecturer.id}
                  </span>
                </div>
              </div>

              {/* Section A: Multi-Diklat Selection with Dropdowns (Max 2 subjects per Diklat) */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>A. Pilihan Program Diklat & Materi Pengampu (Dropdown)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Setiap Widyaiswara dapat <strong>memilih lebih dari 2 Diklat</strong>. Masing-masing Diklat <strong>dibatasi maksimal 2 materi pengampu</strong>.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddProgramChoice}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tambah Pilihan Diklat</span>
                  </button>
                </div>

                {/* List of Chosen Programs with Dropdowns */}
                <div className="space-y-3.5">
                  {(formData.selectedPrograms || []).map((choice, index) => {
                    const selectedProg = TRAINING_PROGRAMS.find(p => p.id === choice.programId) || TRAINING_PROGRAMS[0];
                    const availableSubjects = getProgramSubjects(selectedProg);

                    return (
                      <div 
                        key={index} 
                        className={`p-4 rounded-xl border transition space-y-3 relative ${
                          index === 0 
                            ? 'bg-amber-50/50 border-amber-300' 
                            : index === 1 
                            ? 'bg-blue-50/40 border-blue-200' 
                            : 'bg-slate-50/70 border-slate-300'
                        }`}
                      >
                        {/* Card Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] ${
                              index === 0 ? 'bg-amber-500 text-slate-950' : index === 1 ? 'bg-blue-500 text-white' : 'bg-slate-800 text-white'
                            }`}>
                              {index + 1}
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              Pilihan Diklat #{index + 1} {index === 0 ? '(Prioritas Utama)' : index === 1 ? '(Prioritas Kedua)' : `(Pilihan Tambahan ke-${index - 1})`}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-white text-slate-700 border border-slate-300 shadow-2xs">
                              {selectedProg.category}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {selectedProg.durationLabel} • {selectedProg.location.includes('Salemba') ? 'Kampus Salemba' : 'Kampus Pondok Labu'}
                            </span>
                          </div>

                          {(formData.selectedPrograms || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveProgramChoice(index)}
                              className="text-xs text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer"
                              title="Hapus pilihan diklat ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus</span>
                            </button>
                          )}
                        </div>

                        {/* Dropdown 1: Pilih Program Diklat */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                            <span>Pilih Program Diklat (Katalog 43 Diklat TA 2027) *</span>
                            <span className="font-mono text-[10px] text-amber-800 bg-amber-100/80 px-1.5 py-0.2 rounded font-bold">
                              {selectedProg.code}
                            </span>
                          </label>
                          <select
                            value={choice.programId}
                            onChange={(e) => handleProgramDropdownChange(index, Number(e.target.value))}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-2xs"
                          >
                            {TRAINING_PROGRAMS.map((prog) => (
                              <option key={prog.id} value={prog.id}>
                                [{prog.code}] {prog.name} — {prog.category} ({prog.durationLabel}, {prog.location.includes('Salemba') ? 'Salemba' : 'Pondok Labu'})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Dropdowns for Subjects (Strictly Max 2 Subjects per Diklat) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-200/80">
                          {/* Materi 1 */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                              <span>Materi 1 (Mata Pelatihan Utama) *</span>
                              <span className="text-[9px] text-emerald-800 font-semibold bg-emerald-100 px-1.5 py-0.2 rounded">
                                Materi Wajib
                              </span>
                            </label>
                            <select
                              value={choice.subject1}
                              onChange={(e) => handleSubjectDropdownChange(index, 'subject1', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-2xs"
                            >
                              <option value="">-- Pilih Materi 1 dari Silabus Diklat --</option>
                              {availableSubjects.map((sub, sIdx) => (
                                <option key={sIdx} value={sub}>
                                  {sub}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Materi 2 (Max 2 subjects) */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                              <span>Materi 2 (Maksimal 2 Materi dalam 1 Diklat)</span>
                              <span className="text-[9px] text-blue-800 font-semibold bg-blue-100 px-1.5 py-0.2 rounded">
                                Batas Maksimal
                              </span>
                            </label>
                            <select
                              value={choice.subject2 || ''}
                              onChange={(e) => handleSubjectDropdownChange(index, 'subject2', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-2xs"
                            >
                              <option value="">-- Tidak Ada Materi Kedua (Hanya 1 Materi) --</option>
                              {availableSubjects
                                .filter(sub => sub !== choice.subject1)
                                .map((sub, sIdx) => (
                                  <option key={sIdx} value={sub}>
                                    {sub}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>

                        {/* Subject limit notice badge */}
                        <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 pt-1">
                          <span>Silabus: {availableSubjects.length} mata pelatihan tersedia di {selectedProg.code}</span>
                          <span className={`font-semibold px-2 py-0.5 rounded ${
                            choice.subject2 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                              : choice.subject1 
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {choice.subject2 
                              ? '✓ 2 dari 2 Materi Terpilih (Maksimal Terpenuhi)' 
                              : choice.subject1 
                              ? '1 dari 2 Materi Terpilih' 
                              : 'Belum memilih mata pelatihan'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Info Box: Bebas Bentrok & Kuota Berimbang */}
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <strong>Ketentuan Pemilihan Materi & Diklat:</strong> Widyaiswara dapat memilih lebih dari 2 Diklat sebagai peminatan mengajar. 
                    Setiap Diklat dibatasi maksimal 2 materi pengampu guna mencegah monopoli materi dan menjamin azas keberimbangan instruktur Militer (TNI) & Sipil (PNS Kemhan).
                  </div>
                </div>
              </div>

              {/* Cluster, Quota & Readiness */}
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                  <span>B. Rumpun Diklat, Kuota Beban & Kesiapan</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Preferred Cluster */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Rumpun Diklat Utama
                    </label>
                    <select
                      value={formData.preferredCategory}
                      onChange={(e) => setFormData({ ...formData, preferredCategory: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    >
                      <option value="Kepemimpinan">Kepemimpinan</option>
                      <option value="Manajemen">Manajemen</option>
                      <option value="Fungsional">Fungsional</option>
                      <option value="Teknis & Siber">Teknis & Siber</option>
                      <option value="Kesehatan">Kesehatan</option>
                      <option value="Workshop & TOT">Workshop & TOT</option>
                    </select>
                  </div>

                  {/* Target Teaching Quota */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Target Beban Mengajar (Diklat)
                    </label>
                    <select
                      value={formData.targetQuota}
                      onChange={(e) => setFormData({ ...formData, targetQuota: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    >
                      <option value={2}>2 Program Diklat (Standar Ideal 60 WI)</option>
                      <option value={3}>3 Program Diklat (Standar Berimbang)</option>
                      <option value={4}>4 Program Diklat (Batas Maksimal)</option>
                    </select>
                  </div>

                  {/* Readiness Status */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Status Kesiapan Personel
                    </label>
                    <select
                      value={formData.readinessStatus}
                      onChange={(e) => setFormData({ ...formData, readinessStatus: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    >
                      <option value="Siap Penuh">Siap Penuh (Mandiri)</option>
                      <option value="Siap Bersyarat">Siap Bersyarat (Team Teaching)</option>
                      <option value="Perlu Pendampingan">Perlu Pendampingan</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Methods, Locations & Quarters */}
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span>C. Preferensi Metode, Lokasi & Ketersediaan Waktu (TW)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Delivery Methods */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Metode Pembelajaran yang Diminati:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(['Klasikal', 'Blended Learning', 'Daring'] as const).map((method) => {
                        const isSelected = formData.preferredMethods?.includes(method);
                        return (
                          <button
                            key={method}
                            type="button"
                            onClick={() => handleMethodToggle(method)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                                : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                            <span>{method}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Preferred Location */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Lokasi Kampus Badiklat:
                    </label>
                    <select
                      value={formData.preferredLocation || 'Keduanya (Salemba & Pondok Labu)'}
                      onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    >
                      <option value="Kampus Badiklat Salemba">Kampus Badiklat Salemba (Jakarta Pusat)</option>
                      <option value="Kampus Pondok Labu">Kampus Pondok Labu (Jakarta Selatan)</option>
                      <option value="Keduanya (Salemba & Pondok Labu)">Keduanya (Salemba & Pondok Labu - Fleksibel)</option>
                    </select>
                  </div>
                </div>

                {/* Available Quarters */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Ketersediaan Triwulan Pelaksanaan (TA 2027):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { code: 'TW I', label: 'TW I (Jan - Mar 2027)' },
                      { code: 'TW II', label: 'TW II (Apr - Jun 2027)' },
                      { code: 'TW III', label: 'TW III (Jul - Sep 2027)' },
                      { code: 'TW IV', label: 'TW IV (Okt - Des 2027)' }
                    ].map((quarter) => {
                      const isSelected = formData.availableQuarters?.includes(quarter.code as any);
                      return (
                        <button
                          key={quarter.code}
                          type="button"
                          onClick={() => handleQuarterToggle(quarter.code as any)}
                          className={`p-2.5 rounded-xl text-xs font-semibold border text-center transition cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-400 font-bold'
                              : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1">
                            {isSelected ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-slate-300"></div>
                            )}
                            <span>{quarter.code}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{quarter.label.split('(')[1]?.replace(')', '')}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Certifications and Notes */}
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>D. Sertifikasi Kompetensi & Catatan Tambahan</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Sertifikasi Kompetensi / Pelatihan Khusus yang Dimiliki:
                    </label>
                    <input
                      type="text"
                      value={formData.certifications || ''}
                      onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                      placeholder="Contoh: ToT Metodologi Pelatihan, BNSP Asesor, Lemhannas, Diklat Fungsional WI Utama..."
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Catatan / Keterangan Tambahan:
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Catatan aspirasi, preferensi silabus khusus, atau jadwal dinas luar..."
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <div className="text-[11px] text-slate-500">
                  Data terakhir diperbarui: <span className="font-mono font-bold text-slate-700">{formData.updatedAt || '2027-01-10'}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      const resetVal = DEFAULT_LECTURER_PREFERENCES[selectedLecturerId];
                      if (resetVal) setFormData({ ...resetVal });
                      showNotification('Data formulir dikembalikan ke nilai default standar.', 'info');
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Default</span>
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition shadow-md shadow-amber-500/20 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan & Terapkan Preferensi</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBTAB 2: REKAPITULASI PEMETAAN 60 WIDYAISWARA */}
      {activeSubTab === 'recap' && (
        <div className="space-y-5">
          {/* Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama WI, pangkat, NIP/NRP, atau mata pelatihan..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Filter Dropdowns */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Grade */}
                <select
                  value={filterGrade}
                  onChange={(e) => setFilterGrade(e.target.value as any)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 cursor-pointer"
                >
                  <option value="all">Semua Jenjang</option>
                  <option value="Madya">Ahli Madya ({summary.lecturerStats.filter(s => s.grade === 'Madya').length})</option>
                  <option value="Muda">Ahli Muda ({summary.lecturerStats.filter(s => s.grade === 'Muda').length})</option>
                  <option value="Pertama">Ahli Pertama ({summary.lecturerStats.filter(s => s.grade === 'Pertama').length})</option>
                </select>

                {/* Category */}
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as any)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 cursor-pointer"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="Militer">Militer ({summary.totalTniLecturers} TNI)</option>
                  <option value="Sipil (PNS)">Sipil ({summary.totalSipilLecturers} PNS Kemhan)</option>
                </select>

                {/* Status */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 cursor-pointer"
                >
                  <option value="all">Semua Status Beban</option>
                  <option value="BALANCED">Ideal / Berimbang (2-3 Diklat)</option>
                  <option value="UNDERLOAD">Kurang Beban (&lt; 2 Diklat)</option>
                  <option value="OVERLOAD">Kelebihan Beban (&gt; 3 Diklat)</option>
                </select>

                {(searchTerm || filterGrade !== 'all' || filterCategory !== 'all' || filterStatus !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterGrade('all');
                      setFilterCategory('all');
                      setFilterStatus('all');
                    }}
                    className="px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg font-medium transition cursor-pointer"
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div>
                Menampilkan <strong>{filteredLecturerStats.length}</strong> dari <strong>{summary.totalLecturers}</strong> Widyaiswara Puspimjemenhan
              </div>
              <div className="flex items-center gap-3 font-medium">
                <span className="flex items-center gap-1 text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {summary.balancedCount} Ideal / Berimbang
                </span>
                <span className="flex items-center gap-1 text-blue-700">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> {summary.conflictCount} Bentrok Jadwal
                </span>
              </div>
            </div>
          </div>

          {/* Master 60 WI Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-3 text-center w-12">No</th>
                    <th className="py-3.5 px-4 min-w-[200px]">Nama & Pangkat Widyaiswara</th>
                    <th className="py-3.5 px-3 text-center w-28">Jenjang & Korp</th>
                    <th className="py-3.5 px-4 min-w-[220px]">Pilihan Materi Utama (P1 & P2)</th>
                    <th className="py-3.5 px-4 min-w-[240px]">Penugasan Diklat TA 2027</th>
                    <th className="py-3.5 px-3 text-center w-24">Beban</th>
                    <th className="py-3.5 px-3 text-center w-28">Status</th>
                    <th className="py-3.5 px-3 text-center w-28">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredLecturerStats.map((stat, idx) => {
                    const pref = preferencesMap[stat.lecturerId] || DEFAULT_LECTURER_PREFERENCES[stat.lecturerId];
                    return (
                      <tr 
                        key={stat.lecturerId}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          selectedLecturerId === stat.lecturerId ? 'bg-amber-50/50' : ''
                        }`}
                      >
                        {/* Number */}
                        <td className="py-3 px-3 text-center font-bold text-slate-500">
                          {stat.lecturerId}
                        </td>

                        {/* Name & Rank */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            <span>{stat.lecturerName}</span>
                            {selectedLecturerId === stat.lecturerId && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-600 font-medium">
                            {stat.rankTitle}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {stat.department}
                          </div>
                        </td>

                        {/* Grade & Category */}
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            stat.grade === 'Utama'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : stat.grade === 'Madya' || stat.grade === 'Madya/Muda'
                              ? 'bg-blue-100 text-blue-900 border border-blue-300'
                              : 'bg-slate-100 text-slate-800 border border-slate-300'
                          }`}>
                            {stat.grade}
                          </span>
                          <span className="block text-[10px] text-slate-500 mt-0.5 font-medium">
                            {stat.category === 'Militer' ? 'TNI' : 'PNS'}
                          </span>
                        </td>

                        {/* Stated Preferences */}
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <span className="w-4 h-4 rounded bg-amber-500 text-slate-950 font-black text-[9px] flex items-center justify-center shrink-0">1</span>
                              <span className="font-bold text-slate-800 line-clamp-1" title={pref?.primarySubject}>
                                {pref?.primarySubject || '-'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                              <span className="w-4 h-4 rounded bg-blue-500 text-white font-black text-[9px] flex items-center justify-center shrink-0">2</span>
                              <span className="font-medium line-clamp-1" title={pref?.secondarySubject}>
                                {pref?.secondarySubject || '-'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Active Program Assignments */}
                        <td className="py-3 px-4">
                          {stat.assignments.length === 0 ? (
                            <span className="text-[11px] text-slate-400 italic">Belum ada tugas</span>
                          ) : (
                            <div className="space-y-1">
                              {stat.assignments.map((asg, aidx) => (
                                <div key={aidx} className="flex items-start gap-1 text-[11px]">
                                  <span className="text-amber-500 font-bold">•</span>
                                  <div>
                                    <strong className="text-slate-900">{asg.subject}</strong>
                                    <span className="text-[10px] text-slate-500 block truncate max-w-[200px]">
                                      {asg.programName}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>

                        {/* Assignment Count */}
                        <td className="py-3 px-3 text-center">
                          <span className="font-mono font-extrabold text-sm text-slate-900 block">
                            {stat.assignmentCount}
                          </span>
                          <span className="text-[9px] text-slate-400 font-medium">Diklat</span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            stat.status === 'BALANCED'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : stat.status === 'UNDERLOAD'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-red-100 text-red-800 border border-red-300'
                          }`}>
                            {stat.status === 'BALANCED' ? 'Ideal (Berimbang)' : stat.statusLabel}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => {
                                setSelectedLecturerId(stat.lecturerId);
                                setActiveSubTab('form');
                              }}
                              className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] rounded transition cursor-pointer"
                              title="Buka dan edit formulir pilihan WI ini"
                            >
                              Edit Form
                            </button>
                            <button
                              onClick={() => {
                                const lec = LECTURERS_DATA.find(l => l.id === stat.lecturerId);
                                if (lec) onOpenPrintModal('wi-individual-form', lec);
                              }}
                              className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition cursor-pointer"
                              title="Cetak lembar identifikasi WI ini"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: MATRIKS SINERGI TNI - SIPIL (43 PROGRAM DIKLAT) */}
      {activeSubTab === 'synergy-matrix' && (
        <div className="space-y-5">
          {/* Header Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    Azas Keberimbangan TNI - Sipil
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    100% Sinergis Terpenuhi
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  Matriks Sinergi &amp; Keberimbangan Pengampu TNI - Sipil pada 43 Program Diklat
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
                  Penerapan ketat <strong>Azas Keberimbangan antara Militer (TNI) dan Sipil (PNS Kemhan)</strong> dalam setiap program pelatihan di Puspimjemenhan Badiklat Kemhan TA 2027. Setiap diklat dipandu oleh kolaborasi terpadu antara perwira TNI dan aparatur Sipil PNS guna menyatukan doktrin kepemimpinan pertahanan dan keahlian manajemen birokrasi negara tanpa adanya diklat yang timpang.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onOpenPrintModal('workload-report')}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-950" />
                  <span>Cetak Rekap Matriks TNI-Sipil</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200">
                <span className="text-[10px] text-amber-800 uppercase block font-semibold">Tingkat Keberimbangan</span>
                <span className="text-lg font-black text-amber-950">{summary.tniSipilBalancedProgramsCount} / {summary.totalProgramsCount} Diklat</span>
                <span className="text-[10px] text-emerald-700 block font-bold">100% Sinergi Kolaboratif</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200">
                <span className="text-[10px] text-blue-800 uppercase block font-semibold">Pengampu Militer TNI</span>
                <span className="text-lg font-black text-blue-950">{summary.totalTniAssignments} Sesi Mengajar</span>
                <span className="text-[10px] text-blue-700 block">41 Personel (Avg {summary.averageTniLoad} Diklat)</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200">
                <span className="text-[10px] text-purple-800 uppercase block font-semibold">Pengampu Sipil PNS</span>
                <span className="text-lg font-black text-purple-950">{summary.totalSipilAssignments} Sesi Mengajar</span>
                <span className="text-[10px] text-purple-700 block">26 Personel (Avg {summary.averageSipilLoad} Diklat)</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                <span className="text-[10px] text-emerald-800 uppercase block font-semibold">Pencegahan Tumpang Tindih</span>
                <span className="text-lg font-black text-emerald-950">0 Duplikasi</span>
                <span className="text-[10px] text-emerald-700 block">100% Bebas Benturan Waktu</span>
              </div>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari diklat atau nama pengampu TNI/PNS..."
                value={synergySearch}
                onChange={(e) => setSynergySearch(e.target.value)}
                className="w-full pl-8 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Rumpun:</span>
              <select
                value={synergyCategoryFilter}
                onChange={(e) => setSynergyCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-800 text-xs"
              >
                <option value="ALL">Semua Rumpun (43 Diklat)</option>
                <option value="Kepemimpinan">Kepemimpinan</option>
                <option value="Manajemen">Manajemen Pertahanan</option>
                <option value="Teknis & Siber">Teknis & Siber</option>
                <option value="Fungsional">Fungsional</option>
                <option value="Kesehatan">Kesehatan</option>
                <option value="Workshop & TOT">Workshop & TOT</option>
              </select>
            </div>
          </div>

          {/* 43 Program Synergy Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSynergyBalances.map((bal) => {
              const prog = TRAINING_PROGRAMS.find(p => p.id === bal.programId);
              if (!prog) return null;

              return (
                <div 
                  key={bal.programId}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-amber-400 hover:shadow-md transition-all p-5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Program Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                            {prog.code}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-600 px-2 py-0.5 rounded bg-slate-100">
                            {prog.category}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {prog.method}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 leading-snug">
                          {prog.name}
                        </h4>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 block">
                          {bal.tniCount} TNI • {bal.sipilCount} PNS
                        </span>
                        <span className="text-[9px] text-emerald-700 font-semibold mt-0.5 block">
                          Sinergi Berimbang
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-3 pt-1 border-t border-slate-100">
                      <span>Jadwal: <strong>{prog.displayDate.split('|')[0]}</strong></span>
                      <span>Kampus: <strong>{prog.location.split(',')[0]}</strong></span>
                      <span>Kapasitas: <strong>{prog.capacity} Peserta</strong></span>
                    </div>

                    {/* Dual Columns: TNI vs Sipil Pengampu */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {/* Kolom Militer (TNI) */}
                      <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-xs space-y-2">
                        <div className="flex items-center justify-between pb-1.5 border-b border-blue-200/80">
                          <span className="font-bold text-blue-950 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                            <span>Pengampu Militer (TNI)</span>
                          </span>
                          <span className="text-[10px] font-mono font-bold text-blue-800 bg-blue-100 px-1.5 py-0.2 rounded">
                            {bal.tniCount} WI
                          </span>
                        </div>

                        <div className="space-y-2">
                          {bal.tniInstructors.map((ti, tiIdx) => (
                            <div key={tiIdx} className="bg-white/80 p-2 rounded-lg border border-blue-200/60">
                              <span className="font-bold text-slate-900 block text-[11px]">{ti.name}</span>
                              <span className="text-[10px] text-slate-500 block">{ti.rankTitle}</span>
                              <span className="text-[10px] font-medium text-amber-800 block mt-0.5">
                                Materi: <em>{ti.subject}</em>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Kolom Sipil (PNS Kemhan) */}
                      <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200 text-xs space-y-2">
                        <div className="flex items-center justify-between pb-1.5 border-b border-purple-200/80">
                          <span className="font-bold text-purple-950 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                            <span>Pengampu Sipil (PNS)</span>
                          </span>
                          <span className="text-[10px] font-mono font-bold text-purple-800 bg-purple-100 px-1.5 py-0.2 rounded">
                            {bal.sipilCount} WI
                          </span>
                        </div>

                        <div className="space-y-2">
                          {bal.sipilInstructors.map((si, siIdx) => (
                            <div key={siIdx} className="bg-white/80 p-2 rounded-lg border border-purple-200/60">
                              <span className="font-bold text-slate-900 block text-[11px]">{si.name}</span>
                              <span className="text-[10px] text-slate-500 block">{si.rankTitle}</span>
                              <span className="text-[10px] font-medium text-amber-800 block mt-0.5">
                                Materi: <em>{si.subject}</em>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Total {bal.totalInstructors} Pengampu Materi
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectProgram?.(prog)}
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition cursor-pointer"
                    >
                      <span>Lihat Silabus Lengkap</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 3: KATALOG MATERI 43 DIKLAT (REFERENSI RESMI TA 2027) */}
      {activeSubTab === 'catalog' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Katalog Materi & Mata Pelatihan TA 2027 (43 Program Diklat)
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Daftar seluruh kurikulum mata pelatihan (Materi Dasar, Inti, dan Penunjang) dari 43 program pelatihan 
              Puspimjemenhan Badiklat Kemhan TA 2027 sebagai rujukan pengisian instrumen identifikasi Widyaiswara.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TRAINING_PROGRAMS.map((prog) => (
                <div 
                  key={prog.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                        {prog.code}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {prog.durationLabel} • {prog.method}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 leading-snug">
                      {prog.name}
                    </h4>

                    <div className="pt-2 border-t border-slate-200 space-y-1.5 text-[11px]">
                      <div>
                        <span className="font-bold text-slate-700">Materi Inti:</span>
                        <ul className="list-disc list-inside text-slate-600 text-[10px] space-y-0.5 mt-0.5">
                          {prog.curriculum.core.map((c, i) => (
                            <li key={i} className="truncate" title={c}>{c}</li>
                          ))}
                        </ul>
                      </div>

                      {prog.curriculum.basic && prog.curriculum.basic.length > 0 && (
                        <div>
                          <span className="font-bold text-slate-700">Materi Dasar:</span>
                          <p className="text-[10px] text-slate-600 truncate">{prog.curriculum.basic.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">{prog.displayDate}</span>
                    <button
                      type="button"
                      onClick={() => onSelectProgram?.(prog)}
                      className="text-amber-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Detail Diklat <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
