import React, { useState, useMemo } from 'react';
import { TrainingProgram, TRAINING_PROGRAMS } from '../data/programsData.ts';
import { Lecturer, LECTURERS_DATA } from '../data/lecturersData.ts';
import { 
  AssignmentRecord, 
  checkDateOverlap, 
  checkSubjectTaken,
  getProgramAssignedSubjects,
  getStoredAssignments,
  evaluateAssignmentPreference
} from '../data/assignmentStore.ts';
import { getStoredLecturerPreferences } from '../data/lecturersData.ts';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  UserCheck, 
  Calendar, 
  Building2, 
  Clock, 
  Ban, 
  XCircle, 
  AlertOctagon, 
  ArrowRight, 
  RotateCcw, 
  ShieldAlert, 
  Info,
  Star,
  Award
} from 'lucide-react';

interface AssignmentModalProps {
  initialProgram?: TrainingProgram | null;
  initialLecturer?: Lecturer | null;
  onClose: () => void;
  onSaveAssignment: (newRecord: AssignmentRecord) => void;
  onReassignAssignment?: (existingAssignmentId: string, newRecord: AssignmentRecord) => void;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  initialProgram,
  initialLecturer,
  onClose,
  onSaveAssignment,
  onReassignAssignment
}) => {
  const [selectedProgramId, setSelectedProgramId] = useState<number>(
    initialProgram ? initialProgram.id : TRAINING_PROGRAMS[0].id
  );
  const [selectedLecturerId, setSelectedLecturerId] = useState<number>(
    initialLecturer ? initialLecturer.id : LECTURERS_DATA[0].id
  );
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [room, setRoom] = useState<string>('Ruang Kelas Puspimjemenhan Salemba');
  const [notes, setNotes] = useState<string>('');

  const currentProgram = TRAINING_PROGRAMS.find(p => p.id === selectedProgramId) || TRAINING_PROGRAMS[0];
  const currentLecturer = LECTURERS_DATA.find(l => l.id === selectedLecturerId) || LECTURERS_DATA[0];

  // All existing assignments
  const existingAssignments = getStoredAssignments();

  // All combined candidate subjects: lecturer's competencies + program's curriculum
  const candidateSubjects = useMemo(() => {
    const list: string[] = [];
    const seen = new Set<string>();

    const addSubj = (s?: string) => {
      if (!s) return;
      const clean = s.trim();
      const norm = clean.toLowerCase();
      if (!seen.has(norm)) {
        seen.add(norm);
        list.push(clean);
      }
    };

    // Prioritize current lecturer's qualified subjects
    currentLecturer.subjects?.forEach(addSubj);

    // Add program core and basic curriculum
    currentProgram.curriculum.basic?.forEach(addSubj);
    currentProgram.curriculum.core?.forEach(addSubj);
    currentProgram.curriculum.supporting?.forEach(addSubj);

    return list;
  }, [currentProgram, currentLecturer]);

  // Set default subject if empty
  const activeSubject = selectedSubject || candidateSubjects[0] || "Bela Negara dalam Perspektif Sishanneg";

  // Map of taken subjects for the selected program
  const programAssignedMap = useMemo(() => {
    return getProgramAssignedSubjects(currentProgram.id, existingAssignments);
  }, [currentProgram.id, existingAssignments]);

  // Check 1: Duplicate Subject Overlap Check (Tertolak jika sudah terisi)
  const subjectTakenStatus = useMemo(() => {
    return checkSubjectTaken(
      currentProgram.id, 
      activeSubject, 
      existingAssignments, 
      currentLecturer.id
    );
  }, [currentProgram.id, activeSubject, existingAssignments, currentLecturer.id]);

  // Check 2: Date Overlap Conflict Check
  const conflictingAssignment = existingAssignments.find(asg => {
    if (asg.lecturerId !== currentLecturer.id) return false;
    if (asg.programId === currentProgram.id) return false; // same program checked above

    const otherProgram = TRAINING_PROGRAMS.find(p => p.id === asg.programId);
    if (!otherProgram) return false;

    return checkDateOverlap(currentProgram.startDate, currentProgram.endDate, otherProgram.startDate, otherProgram.endDate);
  });

  // Vacant subjects in this program
  const vacantSubjects = candidateSubjects.filter(s => !programAssignedMap.has(s.trim().toLowerCase()));

  const preferencesMap = useMemo(() => getStoredLecturerPreferences(), []);
  const currentPref = preferencesMap[currentLecturer.id];

  const handleSave = () => {
    // Hard guard: cannot save if subject is already taken
    if (subjectTakenStatus.isTaken) {
      alert(`PENUGASAN DITOLAK!\n\nMata pelatihan "${activeSubject}" pada program "${currentProgram.name}" sudah terisi oleh ${subjectTakenStatus.assignedRecord?.lecturerName}.\n\nSilakan pilih mata pelatihan lain yang masih tersedia.`);
      return;
    }

    const evalResult = evaluateAssignmentPreference(activeSubject, currentLecturer.id, preferencesMap);

    const newRecord: AssignmentRecord = {
      id: `ASG-${Date.now().toString().slice(-4)}`,
      lecturerId: currentLecturer.id,
      lecturerName: currentLecturer.name,
      programId: currentProgram.id,
      programName: currentProgram.name,
      subject: activeSubject,
      dateAssigned: currentProgram.startDate,
      room,
      sessionNotes: notes || `Penugasan Mengajar resmi pada mata diklat ${activeSubject}`,
      preferenceRank: evalResult.rank,
      isPreferenceMatch: evalResult.isMatch
    };

    onSaveAssignment(newRecord);
    onClose();
  };

  const handleTakeover = () => {
    if (!subjectTakenStatus.assignedRecord) return;
    const confirmTransfer = window.confirm(
      `Konfirmasi Pengalihan Penugasan:\n\nApakah Anda yakin ingin mengalihkan materi "${activeSubject}" dari ${subjectTakenStatus.assignedRecord.lecturerName} kepada ${currentLecturer.name}?`
    );
    if (!confirmTransfer) return;

    const evalResult = evaluateAssignmentPreference(activeSubject, currentLecturer.id, preferencesMap);

    const newRecord: AssignmentRecord = {
      id: subjectTakenStatus.assignedRecord.id, // keep id or generate new
      lecturerId: currentLecturer.id,
      lecturerName: currentLecturer.name,
      programId: currentProgram.id,
      programName: currentProgram.name,
      subject: activeSubject,
      dateAssigned: currentProgram.startDate,
      room,
      sessionNotes: notes || `Pengalihan tugas materi dari ${subjectTakenStatus.assignedRecord.lecturerName}`,
      preferenceRank: evalResult.rank,
      isPreferenceMatch: evalResult.isMatch
    };

    if (onReassignAssignment) {
      onReassignAssignment(subjectTakenStatus.assignedRecord.id, newRecord);
    } else {
      onSaveAssignment(newRecord);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <UserCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Form Penugasan Mengajar Widyaiswara TA 2027
              </h3>
              <p className="text-xs text-slate-400">
                Pusat Kepemimpinan dan Manajemen Pertahanan • Validasi Anti Tumpang Tindih Materi
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

        {/* Body */}
        <div className="p-6 space-y-4 text-xs sm:text-sm overflow-y-auto flex-1">
          {/* CRITICAL REJECTION ALERT BANNER (IF SUBJECT ALREADY TAKEN) */}
          {subjectTakenStatus.isTaken && (
            <div className="p-4 rounded-xl bg-red-50 border-2 border-red-500 text-red-950 space-y-2.5 shadow-sm animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-red-800 font-extrabold text-xs sm:text-sm uppercase tracking-wide">
                  <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>NOTIFIKASI: PENUGASAN DITOLAK (MATERI SUDAH TERISI)</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-600 text-white">
                  TERTOLAK
                </span>
              </div>

              <p className="text-xs text-red-900 leading-relaxed">
                Mata pelatihan <strong>"{activeSubject}"</strong> pada program <strong>"{currentProgram.code} - {currentProgram.name}"</strong> sudah terisi dan resmi ditugaskan kepada:
              </p>

              <div className="p-3 rounded-lg bg-white border border-red-200 text-xs text-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-red-950 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span>{subjectTakenStatus.assignedRecord?.lecturerName}</span>
                  </div>
                  <span className="text-slate-500 block text-[11px] mt-0.5">
                    Lokasi: {subjectTakenStatus.assignedRecord?.room || 'Salemba'} • Tanggal: {subjectTakenStatus.assignedRecord?.dateAssigned}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleTakeover}
                  className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition cursor-pointer"
                >
                  Alihkan ke {currentLecturer.name.split(',')[0]}
                </button>
              </div>

              <div className="text-[11px] text-red-800 bg-red-100/70 p-2 rounded-lg border border-red-200 leading-relaxed">
                <strong>Aturan Validasi Kemhan:</strong> Satu materi pada diklat yang sama tidak boleh memiliki pengampu ganda guna mencegah tumpang tindih kurikulum. Silakan pilih materi yang masih tersedia di bawah ini.
              </div>

              {/* Vacant subjects suggestions */}
              {vacantSubjects.length > 0 && (
                <div className="pt-1">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                    Materi yang Masih Kosong / Tersedia di Diklat Ini:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {vacantSubjects.map((vs, vidx) => (
                      <button
                        key={vidx}
                        type="button"
                        onClick={() => setSelectedSubject(vs)}
                        className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-medium transition cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{vs}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Date Conflict Alert (If Lecturer has another program on same date) */}
          {conflictingAssignment && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-amber-950">
                  Peringatan Irisan Tanggal Kegiatan (Schedule Date Overlap)
                </h4>
                <p className="text-xs text-amber-900 mt-1">
                  <strong>{currentLecturer.name}</strong> sudah tercatat mengajar pada program:{' '}
                  <strong>{conflictingAssignment.programName}</strong> pada rentang tanggal yang berdekatan/beririsan.
                </p>
              </div>
            </div>
          )}

          {/* Select Lecturer */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Pilih Widyaiswara Pengampu (Direktori Salemba):
            </label>
            <select
              value={selectedLecturerId}
              onChange={(e) => {
                const id = parseInt(e.target.value);
                setSelectedLecturerId(id);
                const l = LECTURERS_DATA.find(x => x.id === id);
                if (l && l.subjects[0]) setSelectedSubject(l.subjects[0]);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium"
            >
              {LECTURERS_DATA.map(lec => (
                <option key={lec.id} value={lec.id}>
                  {lec.name} ({lec.rankTitle} - {lec.grade})
                </option>
              ))}
            </select>
          </div>

          {/* Lecturer Stated Preference Card */}
          {currentPref && (
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  Identifikasi Pilihan Materi Widyaiswara:
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300">
                  Rumpun: {currentPref.preferredCategory}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="bg-white/90 p-2 rounded-lg border border-amber-200">
                  <span className="text-[10px] text-amber-900 font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                    Pilihan Utama (Prioritas 1):
                  </span>
                  <span className="text-slate-900 font-semibold block mt-0.5">{currentPref.primarySubject}</span>
                </div>
                <div className="bg-white/90 p-2 rounded-lg border border-blue-200">
                  <span className="text-[10px] text-blue-900 font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 text-blue-500 fill-blue-400" />
                    Pilihan Pendukung (Prioritas 2):
                  </span>
                  <span className="text-slate-900 font-semibold block mt-0.5">{currentPref.secondarySubject}</span>
                </div>
              </div>
              {currentPref.notes && (
                <div className="text-[10px] text-slate-600 bg-white/60 p-1.5 rounded border border-amber-100 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Catatan Spesialisasi: {currentPref.notes}</span>
                </div>
              )}
            </div>
          )}

          {/* Select Program */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Program Pelatihan Puspimjemenhan TA 2027:
            </label>
            <select
              value={selectedProgramId}
              onChange={(e) => {
                const newProgId = parseInt(e.target.value);
                setSelectedProgramId(newProgId);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium"
            >
              {TRAINING_PROGRAMS.map(prog => (
                <option key={prog.id} value={prog.id}>
                  {prog.code} - {prog.name} ({prog.displayDate})
                </option>
              ))}
            </select>
          </div>

          {/* Select Subject with Status & Preference Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Mata Pelatihan yang Diampu:
                </label>
                <span className="text-[10px] text-slate-500 font-medium">
                  {candidateSubjects.length} Pilihan
                </span>
              </div>

              <select
                value={activeSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border font-medium transition ${
                  subjectTakenStatus.isTaken
                    ? 'border-red-500 bg-red-50/50 text-red-900 focus:ring-red-500'
                    : 'border-slate-200 bg-slate-50 focus:border-amber-500'
                }`}
              >
                {candidateSubjects.map((s, i) => {
                  const takenRec = programAssignedMap.get(s.trim().toLowerCase());
                  const isTaken = !!takenRec;
                  const prefEval = evaluateAssignmentPreference(s, currentLecturer.id, preferencesMap);
                  const prefTag = prefEval.rank === 'Prioritas 1' 
                    ? '⭐[P1 WI]' 
                    : prefEval.rank === 'Prioritas 2' 
                    ? '⭐[P2 WI]' 
                    : prefEval.isMatch 
                    ? '🎓[Kompetensi]' 
                    : '';

                  const labelPrefix = isTaken 
                    ? `[TERISI: ${takenRec.lecturerName.split(',')[0]}]` 
                    : `[TERSEDIA] ${prefTag}`;

                  return (
                    <option key={i} value={s}>
                      {labelPrefix} {s}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Ruang Kelas / Laboratorium:
              </label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
          </div>

          {/* Status Mapping Matrix Pills in this Program */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-700 text-[11px] block">
              Status Ketersediaan Materi pada {currentProgram.code}:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              {candidateSubjects.slice(0, 6).map((subj, idx) => {
                const taken = programAssignedMap.get(subj.trim().toLowerCase());
                const isSelected = activeSubject.trim().toLowerCase() === subj.trim().toLowerCase();

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedSubject(subj)}
                    className={`p-2 rounded-lg border text-left flex items-start justify-between gap-1.5 transition cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-amber-500 bg-amber-50 border-amber-300'
                        : taken
                        ? 'bg-red-50/40 border-red-200 text-red-900'
                        : 'bg-white border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold block truncate">{subj}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {taken ? `Diampu: ${taken.lecturerName}` : 'Status: Tersedia / Kosong'}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {taken ? (
                        <span className="text-[9px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                          Terisi
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                          Kosong
                        </span>
                      )}
                      {(() => {
                        const evalPref = evaluateAssignmentPreference(subj, currentLecturer.id, preferencesMap);
                        if (evalPref.rank === 'Prioritas 1') {
                          return <span className="text-[8px] font-bold text-amber-800 bg-amber-100 px-1 py-0.2 rounded border border-amber-300">⭐ P1 WI</span>;
                        } else if (evalPref.rank === 'Prioritas 2') {
                          return <span className="text-[8px] font-bold text-blue-800 bg-blue-100 px-1 py-0.2 rounded border border-blue-300">⭐ P2 WI</span>;
                        } else if (evalPref.isMatch) {
                          return <span className="text-[8px] font-bold text-emerald-800 bg-emerald-100 px-1 py-0.2 rounded border border-emerald-300">🎓 Sesuai</span>;
                        }
                        return null;
                      })()}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Catatan / Arahan Penugasan Sesi:
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: Pembekalan awal modul 1 & 2, simulasi studi kasus pertahanan..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>

          {/* Info pill */}
          <div className="p-3 rounded-xl bg-slate-100 text-slate-700 text-xs flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Jadwal Pelatihan: <strong>{currentProgram.displayDate}</strong> ({currentProgram.durationLabel})</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            Batal
          </button>

          {subjectTakenStatus.isTaken ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-700 font-bold hidden sm:inline">
                ⚠️ Penambahan Ditolak (Sudah Terisi)
              </span>
              <button
                disabled={true}
                className="px-4 py-2 rounded-xl bg-red-200 text-red-700 font-bold text-xs flex items-center gap-1.5 cursor-not-allowed border border-red-300 opacity-80"
                title="Penambahan ditolak karena materi ini telah diampu oleh Widyaiswara lain"
              >
                <Ban className="w-4 h-4 text-red-600" />
                <span>Penugasan Ditolak</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Simpan Surat Penugasan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
