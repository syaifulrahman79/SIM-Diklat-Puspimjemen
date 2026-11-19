import React from 'react';
import { TrainingProgram } from '../data/programsData.ts';
import { LECTURERS_DATA, SUBJECT_MATRICES } from '../data/lecturersData.ts';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  UserCheck, 
  Clock, 
  Calendar, 
  Users, 
  Building2, 
  BookOpen, 
  Target, 
  GraduationCap, 
  FileCheck,
  Shield,
  ShieldAlert,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { 
  getStoredAssignments, 
  getProgramTniSipilBalance 
} from '../data/assignmentStore.ts';

interface ProgramDetailModalProps {
  program: TrainingProgram | null;
  onClose: () => void;
  onCheckEligibility: (program: TrainingProgram) => void;
  onOpenAssignLecturer: (program: TrainingProgram) => void;
  onPrintSyllabus: (program: TrainingProgram) => void;
}

export const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({
  program,
  onClose,
  onCheckEligibility,
  onOpenAssignLecturer,
  onPrintSyllabus
}) => {
  if (!program) return null;

  // Find relevant Widyaiswara for this program
  const relevantLecturers = LECTURERS_DATA.filter(lecturer => {
    return lecturer.subjects.some(subj => {
      // Check if any core or basic or supporting curriculum mentions this subject
      const allCurriculum = [
        ...program.curriculum.basic,
        ...program.curriculum.core,
        ...program.curriculum.supporting
      ].join(' ').toLowerCase();

      return allCurriculum.includes(subj.toLowerCase()) || 
        subj.toLowerCase().includes('bela negara') && allCurriculum.includes('bela negara') ||
        subj.toLowerCase().includes('anti korupsi') && allCurriculum.includes('korupsi') ||
        subj.toLowerCase().includes('ti') && (allCurriculum.includes('teknologi') || allCurriculum.includes('ti')) ||
        subj.toLowerCase().includes('minu') && allCurriculum.includes('naskah');
    });
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {program.code}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                {program.category}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                program.method === 'Klasikal' 
                  ? 'bg-blue-600 text-white' 
                  : program.method === 'Blended Learning' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-emerald-600 text-white'
              }`}>
                {program.method}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white leading-tight">
              {program.name}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Pusat Kepemimpinan dan Manajemen Pertahanan • Tahun Anggaran 2027
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Scrollable */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto text-slate-800 text-xs sm:text-sm">
          {/* Quick Summary Pill Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Pelaksanaan</span>
              <span className="font-bold text-slate-900 text-xs mt-0.5 block">{program.durationLabel}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Tanggal</span>
              <span className="font-bold text-slate-900 text-xs mt-0.5 block">{program.displayDate}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Alokasi Kuota</span>
              <span className="font-bold text-slate-900 text-xs mt-0.5 block">{program.capacity} Peserta</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Akomodasi</span>
              <span className="font-bold text-amber-800 text-xs mt-0.5 block">{program.boarding}</span>
            </div>
          </div>

          {/* Deskripsi Singkat */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 uppercase tracking-wider text-slate-700 mb-1.5">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>Deskripsi Singkat Program</span>
            </h4>
            <p className="text-slate-600 leading-relaxed text-xs sm:text-sm bg-slate-50/50 p-3.5 rounded-xl border border-slate-200/80">
              {program.shortDescription}
            </p>
          </div>

          {/* Kompetensi & Tujuan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200">
              <h4 className="font-bold text-blue-950 text-xs sm:text-sm flex items-center gap-1.5 mb-2">
                <Target className="w-4 h-4 text-blue-700" />
                <span>Tujuan Kurikuler Umum (TKU)</span>
              </h4>
              <p className="text-xs text-blue-900 leading-relaxed">
                {program.objectives.general}
              </p>
              
              <h5 className="font-bold text-blue-950 text-xs mt-3 mb-1.5">Kompetensi Dasar Lulusan:</h5>
              <p className="text-xs text-blue-800/90 leading-relaxed italic">
                "{program.competency}"
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
              <h4 className="font-bold text-amber-950 text-xs sm:text-sm flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700" />
                <span>Tujuan Kurikuler Khusus (TKK)</span>
              </h4>
              <ul className="text-xs text-amber-950 space-y-1.5 list-disc list-inside leading-relaxed">
                {program.objectives.specific.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Silabus Kurikulum Lengkap */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 uppercase tracking-wider text-slate-700 mb-2">
              <GraduationCap className="w-4 h-4 text-amber-600" />
              <span>Struktur Kurikulum & Mata Pelatihan</span>
            </h4>

            <div className="space-y-3">
              {/* Bidang Studi Dasar */}
              {program.curriculum.basic.length > 0 && (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 px-3.5 py-1.5 font-bold text-xs text-slate-800">
                    A. Bidang Studi Dasar
                  </div>
                  <div className="p-3 bg-white grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {program.curriculum.basic.map((m, i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bidang Studi Inti */}
              <div className="border border-amber-300 rounded-xl overflow-hidden">
                <div className="bg-amber-100/70 px-3.5 py-1.5 font-bold text-xs text-amber-900">
                  B. Bidang Studi Inti (Substansi Utama)
                </div>
                <div className="p-3 bg-white grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {program.curriculum.core.map((m, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0"></span>
                      <span className="font-medium">{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bidang Studi Pendukung */}
              {program.curriculum.supporting.length > 0 && (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 px-3.5 py-1.5 font-bold text-xs text-slate-800">
                    C. Bidang Studi Pendukung / Lain-lain
                  </div>
                  <div className="p-3 bg-white grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {program.curriculum.supporting.map((m, i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Persyaratan Peserta */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 uppercase tracking-wider text-slate-700">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Persyaratan Peserta Pelatihan</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="font-bold text-slate-700 block mb-1">Sasaran Pangkat / Golongan:</span>
                {program.targetParticipants.tni && (
                  <p className="text-slate-600"><strong>TNI:</strong> {program.targetParticipants.tni}</p>
                )}
                {program.targetParticipants.pns && (
                  <p className="text-slate-600"><strong>PNS:</strong> {program.targetParticipants.pns}</p>
                )}
                {program.targetParticipants.pppk && (
                  <p className="text-slate-600"><strong>PPPK:</strong> {program.targetParticipants.pppk}</p>
                )}
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Pendidikan Minimal:</span>
                <p className="text-slate-600">{program.targetParticipants.minEducation}</p>
                {program.targetParticipants.maxAge && (
                  <p className="text-slate-600 mt-1"><strong>Batas Usia:</strong> Maksimal {program.targetParticipants.maxAge} Tahun</p>
                )}
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Syarat Tambahan / Khusus:</span>
                {program.targetParticipants.specialRequirements?.map((r, i) => (
                  <p key={i} className="text-slate-600 leading-snug mb-1">• {r}</p>
                )) || <p className="text-slate-500">Sesuai penugasan resmi Kasatker</p>}
              </div>
            </div>
          </div>

          {/* Widyaiswara Pengampu (Matching Matrix) */}
          {/* Tim Widyaiswara Pengampu Resmi TA 2027 (Azas Keberimbangan TNI - Sipil) */}
          {(() => {
            const storedAssignments = getStoredAssignments();
            const bal = getProgramTniSipilBalance(program.id, storedAssignments);

            return (
              <div className="p-4 sm:p-5 rounded-xl bg-slate-900 text-white space-y-4 border border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-400" />
                      <span>Tim Pengampu Resmi TA 2027 (Azas Keberimbangan TNI & Sipil)</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Kolaborasi instruktur Militer (TNI) & Sipil (PNS Kemhan) sesuai arahan Plt. Kapuspimjemenhan
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{bal.statusLabel}</span>
                    </span>
                    <button
                      onClick={() => onOpenAssignLecturer(program)}
                      className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                    >
                      + Kelola Penugasan
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Kolom Pengampu TNI */}
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-700/80">
                      <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                        Unsur Militer (TNI): {bal.tniCount} Orang
                      </span>
                      <span className="text-[10px] text-blue-200/70 font-mono">Kepemimpinan & Doktrin Pertahanan</span>
                    </div>

                    {bal.tniInstructors.length > 0 ? (
                      <div className="space-y-2">
                        {bal.tniInstructors.map((ins, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-xs space-y-0.5">
                            <div className="flex items-start justify-between gap-1">
                              <span className="font-bold text-white leading-tight">{ins.name}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-900/50 text-blue-300 border border-blue-700/50 shrink-0 font-medium">TNI</span>
                            </div>
                            <div className="text-[11px] text-slate-400">{ins.rankTitle}</div>
                            <div className="text-[11px] text-amber-300 font-medium pt-1 border-t border-slate-800/80 mt-1 flex items-center gap-1">
                              <BookOpen className="w-3 h-3 text-amber-400 shrink-0" />
                              <span className="line-clamp-1">{ins.subject}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-amber-400 italic py-2">Belum ada pengampu unsur TNI.</p>
                    )}
                  </div>

                  {/* Kolom Pengampu Sipil (PNS Kemhan) */}
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-700/80">
                      <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        Unsur Sipil (PNS Kemhan): {bal.sipilCount} Orang
                      </span>
                      <span className="text-[10px] text-emerald-200/70 font-mono">Manajemen & Regulasi ASN</span>
                    </div>

                    {bal.sipilInstructors.length > 0 ? (
                      <div className="space-y-2">
                        {bal.sipilInstructors.map((ins, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-xs space-y-0.5">
                            <div className="flex items-start justify-between gap-1">
                              <span className="font-bold text-white leading-tight">{ins.name}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-900/50 text-emerald-300 border border-emerald-700/50 shrink-0 font-medium">PNS</span>
                            </div>
                            <div className="text-[11px] text-slate-400">{ins.rankTitle}</div>
                            <div className="text-[11px] text-emerald-300 font-medium pt-1 border-t border-slate-800/80 mt-1 flex items-center gap-1">
                              <BookOpen className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span className="line-clamp-1">{ins.subject}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-amber-400 italic py-2">Belum ada pengampu unsur Sipil PNS.</p>
                    )}
                  </div>
                </div>

                {/* Additional relevant candidates */}
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
                  <span>Widyaiswara cadangan/kompeten lainnya: {relevantLecturers.slice(0, 3).map(w => w.name).join(', ')}</span>
                  <span className="text-slate-500 font-mono">Standar Diklat Salemba & Pondok Labu</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrintSyllabus(program)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Silabus Resmi</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onCheckEligibility(program);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Cek Kelayakan Saya untuk Diklat Ini</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
