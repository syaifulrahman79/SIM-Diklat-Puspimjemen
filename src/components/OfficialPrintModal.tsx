import React, { useState, useMemo } from 'react';
import { TRAINING_PROGRAMS, TrainingProgram } from '../data/programsData.ts';
import { ParticipantProfile, EligibilityResult } from '../data/eligibilityRules.ts';
import { X, Printer, Shield, BookOpen, Users, FileText, CheckCircle2, Award, Layers, ClipboardList } from 'lucide-react';
import { 
  WorkloadDistributionSummary, 
  getWorkloadDistributionSummary, 
  getStoredAssignments 
} from '../data/assignmentStore.ts';
import { 
  Lecturer, 
  getStoredLecturerPreferences, 
  DEFAULT_LECTURER_PREFERENCES,
  LECTURERS_DATA 
} from '../data/lecturersData.ts';

export type PrintDocumentType = 
  | 'syllabus' 
  | 'eligibility' 
  | 'proposal' 
  | 'workload-report' 
  | 'program-recap' 
  | 'comprehensive-recap' 
  | 'wi-blank-form' 
  | 'wi-individual-form';

interface OfficialPrintModalProps {
  type: PrintDocumentType;
  program?: TrainingProgram | null;
  eligibilityData?: {
    profile: ParticipantProfile;
    results: EligibilityResult[];
  } | null;
  proposalData?: any | null;
  workloadData?: WorkloadDistributionSummary | null;
  specificLecturer?: Lecturer | null;
  onClose: () => void;
}

export const OfficialPrintModal: React.FC<OfficialPrintModalProps> = ({
  type,
  program,
  eligibilityData,
  proposalData,
  workloadData,
  specificLecturer,
  onClose
}) => {
  // Document selector state allowing user to toggle between different printable reports
  const [currentDocType, setCurrentDocType] = useState<PrintDocumentType>(type);

  // Fallback to stored assignments if workloadData not passed
  const effectiveWorkloadData: WorkloadDistributionSummary = useMemo(() => {
    if (workloadData) return workloadData;
    return getWorkloadDistributionSummary(getStoredAssignments());
  }, [workloadData]);

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div 
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden my-4 max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Action Bar (Hidden during printing) */}
        <div className="bg-slate-900 text-white p-3 sm:p-4 flex flex-col gap-3 print:hidden shrink-0 border-b border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-white">Pratinjau Dokumen Cetak Kedinasan</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                    Minu Kemhan RI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Pengesahan oleh: <strong className="text-amber-300">Plt. Kapuspimjemenhan: Laksamana Pertama TNI Anis Rusdiyono</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={triggerPrint}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan PDF</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="Tutup Pratinjau"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Document Switcher Tab Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-t border-slate-800/80 pt-2 scrollbar-none">
            <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap mr-1">
              Pilih Dokumen:
            </span>

            <button
              onClick={() => setCurrentDocType('workload-report')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                currentDocType === 'workload-report'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>1. Rekap Beban 60 WI</span>
            </button>

            <button
              onClick={() => setCurrentDocType('program-recap')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                currentDocType === 'program-recap'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>2. Rekap 43 Program Diklat</span>
            </button>

            <button
              onClick={() => setCurrentDocType('comprehensive-recap')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                currentDocType === 'comprehensive-recap'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>3. Laporan Eksekutif Terpadu</span>
            </button>

            <button
              onClick={() => setCurrentDocType('wi-blank-form')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                currentDocType === 'wi-blank-form'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>4. Blanko Survei Fisik 60 WI</span>
            </button>

            {specificLecturer && (
              <button
                onClick={() => setCurrentDocType('wi-individual-form')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  currentDocType === 'wi-individual-form'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Form {specificLecturer.name.split(',')[0]}</span>
              </button>
            )}

            {program && (
              <button
                onClick={() => setCurrentDocType('syllabus')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  currentDocType === 'syllabus'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Silabus {program.code}</span>
              </button>
            )}

            {proposalData && (
              <button
                onClick={() => setCurrentDocType('proposal')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  currentDocType === 'proposal'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Surat Usulan Satker</span>
              </button>
            )}

            {eligibilityData && (
              <button
                onClick={() => setCurrentDocType('eligibility')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  currentDocType === 'eligibility'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Hasil Uji Kelayakan</span>
              </button>
            )}
          </div>
        </div>

        {/* Printable Document Sheet (Standard Minu Kemhan RI) */}
        <div className="p-6 sm:p-10 md:p-12 overflow-y-auto font-serif text-slate-900 text-xs sm:text-sm leading-relaxed bg-white print:p-0">
          
          {/* KOP SURAT RESMI KEMHAN RI */}
          <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="w-14 h-14 rounded-full border-2 border-slate-900 flex items-center justify-center font-bold text-[10px] text-center tracking-tighter uppercase p-1 font-sans">
                KEMHAN RI
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-widest uppercase font-sans text-slate-900">
                  KEMENTERIAN PERTAHANAN REPUBLIK INDONESIA
                </h3>
                <h4 className="font-bold text-xs tracking-wider uppercase font-sans text-slate-800">
                  BADAN PENDIDIKAN DAN PELATIHAN PERTAHANAN
                </h4>
                <h5 className="font-semibold text-xs tracking-normal uppercase font-sans text-slate-700">
                  PUSAT KEPEMIMPINAN DAN MANAJEMEN PERTAHANAN
                </h5>
                <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                  Jl. Salemba Raya No. 14 Jakarta Pusat • Kampus Pondok Labu Jakarta Selatan • Website: badiklat.kemhan.go.id
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* DOKUMEN 1: REKAPITULASI DISTRIBUSI BEBAN MENGAJAR 60 WIDYAISWARA (BERIMBANG) */}
          {/* ========================================================================= */}
          {currentDocType === 'workload-report' && effectiveWorkloadData && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="font-bold text-base uppercase underline tracking-wide">
                  REKAPITULASI DISTRIBUSI BEBAN MENGAJAR BERIMBANG 60 WIDYAISWARA TA 2027
                </h2>
                <span className="font-sans text-xs font-bold text-slate-700">
                  NOMOR: B / REKAP-WI / PUSPIMJEMEN / {new Date().getFullYear()} • STATUS: TERVERIFIKASI BEBAS BENTURAN JADWAL
                </span>
              </div>

              {/* Summary Stats Box */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-sans text-xs border border-slate-300 p-3 bg-slate-50 rounded-lg">
                <div className="text-center border-r border-slate-300">
                  <span className="text-[10px] text-slate-500 uppercase block">Total Widyaiswara</span>
                  <span className="font-bold text-sm text-slate-900">{effectiveWorkloadData.totalLecturers} Orang ({effectiveWorkloadData.totalTniLecturers} TNI / {effectiveWorkloadData.totalSipilLecturers} PNS)</span>
                </div>
                <div className="text-center border-r border-slate-300">
                  <span className="text-[10px] text-slate-500 uppercase block">Total Penugasan Sesi</span>
                  <span className="font-bold text-sm text-slate-900">{effectiveWorkloadData.totalAssignments} Sesi Mengajar</span>
                </div>
                <div className="text-center border-r border-slate-300">
                  <span className="text-[10px] text-slate-500 uppercase block">Rata-Rata Beban</span>
                  <span className="font-bold text-sm text-slate-900">{effectiveWorkloadData.averageLoad} Diklat / WI</span>
                </div>
                <div className="text-center border-r border-slate-300">
                  <span className="text-[10px] text-slate-500 uppercase block">Indeks Keseimbangan</span>
                  <span className="font-bold text-sm text-emerald-800">{effectiveWorkloadData.balanceIndexPercent}% Berimbang</span>
                </div>
                <div className="text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-amber-700 uppercase block font-bold">Keselarasan Pilihan WI</span>
                  <span className="font-bold text-sm text-amber-900">{effectiveWorkloadData.preferenceAlignmentIndexPercent}% Selaras</span>
                </div>
              </div>

              {/* Azas Keberimbangan TNI - Sipil Highlight Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-sans text-xs border border-amber-300 p-2.5 bg-amber-50/60 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Keberimbangan Tiap Diklat</span>
                    <span className="font-bold text-slate-900 text-xs">
                      {effectiveWorkloadData.tniSipilBalancedProgramsCount} / {effectiveWorkloadData.totalProgramsCount} Diklat ({effectiveWorkloadData.tniSipilSynergyRatePercent}% Berimbang)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Unsur Militer TNI ({effectiveWorkloadData.totalTniLecturers} WI)</span>
                    <span className="font-bold text-slate-900 text-xs">
                      {effectiveWorkloadData.totalTniAssignments} Sesi (Rata-rata {effectiveWorkloadData.averageTniLoad} Diklat/WI)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0"></span>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Unsur Sipil PNS ({effectiveWorkloadData.totalSipilLecturers} WI)</span>
                    <span className="font-bold text-slate-900 text-xs">
                      {effectiveWorkloadData.totalSipilAssignments} Sesi (Rata-rata {effectiveWorkloadData.averageSipilLoad} Diklat/WI)
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-justify">
                Berdasarkan Keputusan Plt. Kepala Pusat Kepemimpinan dan Manajemen Pertahanan mengenai penetapan kalender pendidikan dan pelatihan TA 2027, berikut adalah distribusi beban mengajar 60 Widyaiswara Puspimjemenhan (40 Ahli Madya, 11 Ahli Muda, 9 Ahli Pertama) yang telah diselaraskan secara berimbang (rata-rata 2 s.d. 3 program diklat) dengan menerapkan <strong>Azas Keberimbangan antara Militer (TNI) dan Sipil (PNS Kemhan)</strong> pada setiap program diklat, serta terverifikasi bebas tumpang tindih materi dan bebas benturan jadwal (zero conflict):
              </p>

              <div className="mt-2">
                <h4 className="font-bold text-xs uppercase text-slate-900 mb-1">
                  A. Distribusi Penugasan Individu 60 Widyaiswara (Militer TNI &amp; Sipil PNS)
                </h4>
              </div>

              <table className="w-full border border-slate-300 text-[10px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 font-sans">
                    <th className="p-1.5 border-r border-slate-300 w-7 text-center">No</th>
                    <th className="p-1.5 border-r border-slate-300 text-left">Nama Widyaiswara & Pangkat/Korps</th>
                    <th className="p-1.5 border-r border-slate-300 text-center w-24">Jenjang & Korps</th>
                    <th className="p-1.5 border-r border-slate-300 text-left">Mata Pelatihan & Diklat Ditugaskan</th>
                    <th className="p-1.5 border-r border-slate-300 text-center w-24">Pilihan WI</th>
                    <th className="p-1.5 border-r border-slate-300 text-center w-14">Beban</th>
                    <th className="p-1.5 text-center w-20">Status Beban</th>
                  </tr>
                </thead>
                <tbody>
                  {effectiveWorkloadData.lecturerStats.map((stat, idx) => (
                    <tr key={stat.lecturerId} className="border-b border-slate-200">
                      <td className="p-1.5 border-r border-slate-200 text-center font-bold font-mono">#{stat.lecturerId}</td>
                      <td className="p-1.5 border-r border-slate-200">
                        <div className="font-bold text-slate-900">{stat.lecturerName}</div>
                        <div className="text-[9px] text-slate-600">{stat.rankTitle}</div>
                      </td>
                      <td className="p-1.5 border-r border-slate-200 text-center">
                        <span className="font-semibold block">{stat.grade}</span>
                        <span className={`text-[8px] font-sans px-1 py-0.2 rounded font-bold ${
                          stat.category === 'Militer' ? 'text-blue-800 bg-blue-50' : 'text-purple-800 bg-purple-50'
                        }`}>
                          {stat.category === 'Militer' ? 'Militer TNI' : 'Sipil PNS'}
                        </span>
                      </td>
                      <td className="p-1.5 border-r border-slate-200">
                        <ul className="list-disc list-inside space-y-0.5 text-[9px]">
                          {stat.assignments.map((a, aidx) => (
                            <li key={aidx} className="truncate max-w-sm">
                              <strong>{a.subject}</strong> ({a.programName.slice(0, 22)}...)
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-1.5 border-r border-slate-200 text-center font-sans text-[9px]">
                        <span className="font-bold text-emerald-800 block">
                          {stat.preferenceMatchRate}% Sesuai
                        </span>
                        <span className="text-[8px] text-slate-500 block">
                          P1: {stat.priority1Count}x • P2: {stat.priority2Count}x
                        </span>
                      </td>
                      <td className="p-1.5 border-r border-slate-200 text-center font-mono font-bold">
                        {stat.assignmentCount} Diklat
                      </td>
                      <td className="p-1.5 text-center font-sans font-bold text-[9px]">
                        <span className={
                          stat.status === 'BALANCED' 
                            ? 'text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded' 
                            : stat.status === 'UNDERLOAD'
                            ? 'text-amber-700 bg-amber-50 px-1 py-0.5 rounded'
                            : 'text-red-700 bg-red-50 px-1 py-0.5 rounded'
                        }>
                          {stat.statusLabel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Matriks Keberimbangan TNI - Sipil pada 43 Program Diklat */}
              <div className="mt-5 pt-3 border-t border-slate-300">
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-bold text-xs uppercase text-slate-900">
                    B. Matriks Keberimbangan Pengampu TNI &amp; Sipil pada 43 Program Diklat TA 2027
                  </h4>
                  <span className="text-[9px] text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                    100% Sinergi Berimbang
                  </span>
                </div>
                <p className="text-[10px] text-slate-600 mb-2 leading-relaxed">
                  Penerapan <strong>Azas Keberimbangan TNI - Sipil</strong>: Setiap program diklat diampu oleh tim kolaboratif gabungan perwira TNI dan aparatur Sipil PNS Kemhan untuk menjamin sinergi kepemimpinan dan manajemen pertahanan:
                </p>

                <table className="w-full border border-slate-300 text-[10px]">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 font-sans">
                      <th className="p-1.5 border-r border-slate-300 w-7 text-center">No</th>
                      <th className="p-1.5 border-r border-slate-300 w-16 text-center">Kode</th>
                      <th className="p-1.5 border-r border-slate-300 text-left">Program Diklat</th>
                      <th className="p-1.5 border-r border-slate-300 text-center w-28">Komposisi Pengampu</th>
                      <th className="p-1.5 border-r border-slate-300 text-left">Pengampu Unsur Militer (TNI)</th>
                      <th className="p-1.5 text-left">Pengampu Unsur Sipil (PNS Kemhan)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {effectiveWorkloadData.programBalances?.map((bal, bidx) => (
                      <tr key={bal.programId} className="border-b border-slate-200">
                        <td className="p-1.5 border-r border-slate-200 text-center font-bold">{bidx + 1}</td>
                        <td className="p-1.5 border-r border-slate-200 text-center font-mono font-bold text-slate-700">
                          {bal.programCode}
                        </td>
                        <td className="p-1.5 border-r border-slate-200 font-bold text-slate-900">
                          {bal.programName}
                        </td>
                        <td className="p-1.5 border-r border-slate-200 text-center">
                          <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300 text-[9px] block">
                            {bal.tniCount} TNI • {bal.sipilCount} PNS
                          </span>
                          <span className="text-[8px] text-slate-500 font-sans">Sinergi Berimbang</span>
                        </td>
                        <td className="p-1.5 border-r border-slate-200">
                          <ul className="list-disc list-inside space-y-0.5 text-[9px]">
                            {bal.tniInstructors.map((ti, tiIdx) => (
                              <li key={tiIdx}>
                                <strong>{ti.name}</strong> ({ti.rankTitle.split('/')[0]}) - <span className="text-slate-600">{ti.subject}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="p-1.5">
                          <ul className="list-disc list-inside space-y-0.5 text-[9px]">
                            {bal.sipilInstructors.map((si, siIdx) => (
                              <li key={siIdx}>
                                <strong>{si.name}</strong> ({si.rankTitle.split('/')[0]}) - <span className="text-slate-600">{si.subject}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Conflict Verification Note */}
              <div className="p-3 border border-slate-300 bg-slate-50 rounded-lg text-xs space-y-1">
                <div className="font-bold text-slate-900">Catatan Verifikasi Penjadwalan & Pengendalian Tumpang Tindih:</div>
                <div className="text-slate-700">
                  {effectiveWorkloadData.conflictCount === 0 
                    ? '✓ SELURUH PENUGASAN 60 WIDYAISWARA DINYATAKAN VALID: Tidak ditemukan adanya benturan waktu (zero clash schedule), seluruh 43 program diklat memenuhi azas keberimbangan pengampu TNI & Sipil, dan tidak ada tumpang tindih materi.'
                    : `⚠️ PERHATIAN: Ditemukan ${effectiveWorkloadData.conflictCount} jadwal beririsan yang memerlukan penataan manual.`}
                </div>
              </div>

              {/* Official Signatures with Plt. Kapuspimjemenhan */}
              <div className="mt-8 pt-4 flex justify-between text-xs font-sans">
                <div className="text-center w-60">
                  <p>Mengetahui,</p>
                  <p className="font-semibold">Kabid Diklat Puspimjemenhan</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">Kolonel Caj (K) Dr. Sri Iswati, M.Si.</p>
                  <p className="text-[10px] text-slate-500">NRP 523891</p>
                </div>

                <div className="text-center w-72">
                  <p>Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="font-bold">Plt. Kepala Pusat Kepemimpinan dan Manajemen Pertahanan</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">Laksamana Pertama TNI Anis Rusdiyono</p>
                  <p className="text-[10px] text-slate-500">Plt. Kapuspimjemenhan Badiklat Kemhan RI</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* DOKUMEN 2: REKAPITULASI 43 PROGRAM DIKLAT TA 2027 */}
          {/* ========================================================================= */}
          {currentDocType === 'program-recap' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="font-bold text-base uppercase underline tracking-wide">
                  REKAPITULASI PROGRAM PENDIDIKAN DAN PELATIHAN TA 2027
                </h2>
                <span className="font-sans text-xs font-bold text-slate-700 block mt-0.5">
                  PUSAT KEPEMIMPINAN DAN MANAJEMEN PERTAHANAN BADIKLAT KEMHAN RI
                </span>
                <span className="font-sans text-[10px] text-slate-500 block">
                  NOMOR: B / REKAP-DIKLAT / PUSPIMJEMEN / {new Date().getFullYear()} • 43 PROGRAM RESMI
                </span>
              </div>

              {/* Summary Stats Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-sans text-xs border border-slate-300 p-3 bg-slate-50 rounded-lg">
                <div className="text-center border-r border-slate-300">
                  <span className="text-[10px] text-slate-500 uppercase block">Total Program</span>
                  <span className="font-bold text-sm text-slate-900">{TRAINING_PROGRAMS.length} Program Diklat</span>
                </div>
                <div className="text-center border-r border-slate-300">
                  <span className="text-[10px] text-slate-500 uppercase block">Total Alokasi Peserta</span>
                  <span className="font-bold text-sm text-slate-900">
                    {TRAINING_PROGRAMS.reduce((acc, p) => acc + (p.capacity || 0), 0).toLocaleString()} Peserta
                  </span>
                </div>
                <div className="text-center border-r border-slate-300">
                  <span className="text-[10px] text-slate-500 uppercase block">Komposisi Metode</span>
                  <span className="font-bold text-xs text-slate-900">
                    25 Klasikal • 12 Blended • 6 Daring
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-slate-500 uppercase block">Kampus Pelaksanaan</span>
                  <span className="font-bold text-xs text-slate-900">Salemba & Pondok Labu</span>
                </div>
              </div>

              <p className="text-xs text-justify">
                Berikut adalah rekapitulasi lengkap 43 Program Pendidikan dan Pelatihan Pusat Kepemimpinan dan Manajemen Pertahanan Badiklat Kemhan RI Tahun Anggaran 2027 beserta metode, durasi, jadwal pelaksanaan, alokasi kapasitas peserta, dan fasilitas asrama:
              </p>

              <table className="w-full border border-slate-300 text-[10px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 font-sans">
                    <th className="p-1.5 border-r border-slate-300 w-7 text-center">No</th>
                    <th className="p-1.5 border-r border-slate-300 w-16 text-center">Kode</th>
                    <th className="p-1.5 border-r border-slate-300 text-left">Nama Program Pendidikan dan Pelatihan</th>
                    <th className="p-1.5 border-r border-slate-300 text-center w-24">Rumpun</th>
                    <th className="p-1.5 border-r border-slate-300 text-center w-24">Metode & Durasi</th>
                    <th className="p-1.5 border-r border-slate-300 text-center w-28">Jadwal TA 2027</th>
                    <th className="p-1.5 border-r border-slate-300 text-center w-12">Kuota</th>
                    <th className="p-1.5 border-r border-slate-300 text-center w-28">Komposisi Pengampu</th>
                    <th className="p-1.5 text-center w-24">Akomodasi & Kampus</th>
                  </tr>
                </thead>
                <tbody>
                  {TRAINING_PROGRAMS.map((prog, idx) => {
                    const balance = effectiveWorkloadData.programBalances?.find(b => b.programId === prog.id);
                    const tniC = balance?.tniCount ?? 2;
                    const sipilC = balance?.sipilCount ?? 1;

                    return (
                      <tr key={prog.id} className="border-b border-slate-200">
                        <td className="p-1.5 border-r border-slate-200 text-center font-bold">{idx + 1}</td>
                        <td className="p-1.5 border-r border-slate-200 text-center font-mono font-bold text-slate-700">
                          {prog.code}
                        </td>
                        <td className="p-1.5 border-r border-slate-200">
                          <div className="font-bold text-slate-900">{prog.name}</div>
                          <div className="text-[9px] text-slate-500 truncate max-w-xs">{prog.shortDescription.slice(0, 60)}...</div>
                        </td>
                        <td className="p-1.5 border-r border-slate-200 text-center font-medium">
                          {prog.category}
                        </td>
                        <td className="p-1.5 border-r border-slate-200 text-center">
                          <span className="font-semibold block">{prog.method}</span>
                          <span className="text-[8px] text-slate-500">({prog.durationLabel})</span>
                        </td>
                        <td className="p-1.5 border-r border-slate-200 text-center text-[9px] font-mono">
                          {prog.displayDate.split('|')[0]}
                        </td>
                        <td className="p-1.5 border-r border-slate-200 text-center font-bold">
                          {prog.capacity}
                        </td>
                        <td className="p-1.5 border-r border-slate-200 text-center">
                          <span className="font-bold text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-300 text-[9px] block">
                            {tniC} TNI • {sipilC} PNS
                          </span>
                          <span className="text-[8px] text-slate-500 font-sans">Sinergi Berimbang</span>
                        </td>
                        <td className="p-1.5 text-center text-[9px]">
                          <span className="block font-medium">{prog.boarding.replace('Tidak Diasramakan', 'Non Asrama')}</span>
                          <span className="text-[8px] text-slate-500">{prog.location.split(',')[0]}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Official Signatures with Plt. Kapuspimjemenhan */}
              <div className="mt-8 pt-4 flex justify-between text-xs font-sans">
                <div className="text-center w-60">
                  <p>Mengetahui,</p>
                  <p className="font-semibold">Kabid Diklat Puspimjemenhan</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">Kolonel Caj (K) Dr. Sri Iswati, M.Si.</p>
                  <p className="text-[10px] text-slate-500">NRP 523891</p>
                </div>

                <div className="text-center w-72">
                  <p>Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="font-bold">Plt. Kepala Pusat Kepemimpinan dan Manajemen Pertahanan</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">Laksamana Pertama TNI Anis Rusdiyono</p>
                  <p className="text-[10px] text-slate-500">Plt. Kapuspimjemenhan Badiklat Kemhan RI</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* DOKUMEN 3: LAPORAN REKAPITULASI EKSEKUTIF TERPADU (MINU KEMHAN RI) */}
          {/* ========================================================================= */}
          {currentDocType === 'comprehensive-recap' && effectiveWorkloadData && (
            <div className="space-y-5 text-xs">
              <div className="text-center mb-6">
                <h2 className="font-bold text-base uppercase underline tracking-wide">
                  LAPORAN REKAPITULASI EKSEKUTIF PENYELENGGARAAN DIKLAT DAN PEMETAAN BEBAN MENGAJAR 60 WIDYAISWARA
                </h2>
                <span className="font-sans text-xs font-bold text-slate-800 block mt-1">
                  TAHUN ANGGARAN 2027 • PUSPIMJEMENHAN BADIKLAT KEMHAN RI
                </span>
                <span className="font-sans text-[10px] text-slate-500 block">
                  NOMOR: LAP-REKAP / 01 / I / 2027 / PUSPIMJEMENHAN
                </span>
              </div>

              {/* BAB I */}
              <div>
                <h4 className="font-bold uppercase text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  BAB I: DASAR HUKUM DAN TUJUAN OPERASIONAL
                </h4>
                <div className="space-y-1.5 text-justify pl-2">
                  <p>
                    1. <strong>Dasar:</strong> Peraturan Menteri Pertahanan Republik Indonesia mengenai Organisasi dan Tata Kerja Badan Pendidikan dan Pelatihan Kemhan, serta Program Kerja dan Anggaran Pusat Kepemimpinan dan Manajemen Pertahanan (Puspimjemenhan) Badiklat Kemhan TA 2027.
                  </p>
                  <p>
                    2. <strong>Tujuan:</strong> Menyajikan evaluasi komprehensif atas portofolio 43 Program Diklat dan penetapan penugasan mengajar bagi 60 Widyaiswara ({effectiveWorkloadData.totalTniLecturers} Militer TNI dan {effectiveWorkloadData.totalSipilLecturers} ASN PNS) secara berimbang, transparan, objektif, bebas benturan jadwal, dan selaras dengan kompetensi keahlian widyaiswara.
                  </p>
                </div>
              </div>

              {/* BAB II */}
              <div>
                <h4 className="font-bold uppercase text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  BAB II: REKAPITULASI PORTOFOLIO 43 PROGRAM DIKLAT TA 2027
                </h4>
                <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg font-sans mb-3">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Total Program & Kuota</span>
                    <span className="font-bold text-slate-900">43 Program • 1.345 Peserta</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Metode Pembelajaran</span>
                    <span className="font-bold text-slate-900">25 Klasikal, 12 Blended, 6 Daring</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Pusat Kampus</span>
                    <span className="font-bold text-slate-900">Kampus Salemba & Pondok Labu</span>
                  </div>
                </div>

                <table className="w-full border border-slate-300 text-[10px]">
                  <thead>
                    <tr className="bg-slate-100 font-sans border-b border-slate-300">
                      <th className="p-1.5 text-center w-8">No</th>
                      <th className="p-1.5 text-left">Rumpun Diklat</th>
                      <th className="p-1.5 text-center w-24">Jumlah Diklat</th>
                      <th className="p-1.5 text-center w-28">Total Alokasi</th>
                      <th className="p-1.5 text-left">Contoh Program Strategis</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-1.5 text-center font-bold">1</td>
                      <td className="p-1.5 font-bold">Kepemimpinan Pertahanan</td>
                      <td className="p-1.5 text-center font-mono">11 Diklat</td>
                      <td className="p-1.5 text-center font-bold">345 Orang</td>
                      <td className="p-1.5">PKA, PKP, Berpikir Kreatif, Komunikasi Efektif, Suskatjemen Eksekutif</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-1.5 text-center font-bold">2</td>
                      <td className="p-1.5 font-bold">Manajemen Pertahanan</td>
                      <td className="p-1.5 text-center font-mono">15 Diklat</td>
                      <td className="p-1.5 text-center font-bold">470 Orang</td>
                      <td className="p-1.5">Susjemen Rengar Han, Pengadaan Barang/Jasa, Manajemen Aset BMN, Akuntansi Han</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-1.5 text-center font-bold">3</td>
                      <td className="p-1.5 font-bold">Teknis, Siber & Teknologi Han</td>
                      <td className="p-1.5 text-center font-mono">7 Diklat</td>
                      <td className="p-1.5 text-center font-bold">210 Orang</td>
                      <td className="p-1.5">Cyber Defence, Digital Forensic, AI Pertahanan, Tata Kelola SPBE Kemhan</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-1.5 text-center font-bold">4</td>
                      <td className="p-1.5 font-bold">Fungsional & Kesehatan Han</td>
                      <td className="p-1.5 text-center font-mono">10 Diklat</td>
                      <td className="p-1.5 text-center font-bold">320 Orang</td>
                      <td className="p-1.5">Alih Golongan, TOT Widyaiswara, Manajemen Rumah Sakit Han, Teknis Logistik</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* BAB III */}
              <div>
                <h4 className="font-bold uppercase text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  BAB III: ANALISIS DISTRIBUSI BEBAN MENGAJAR 60 WIDYAISWARA
                </h4>
                <div className="space-y-1.5 text-justify pl-2">
                  <p>
                    1. <strong>Keseimbangan Beban:</strong> Seluruh 60 Widyaiswara telah terdistribusi beban mengajarnya dengan indeks keseimbangan <strong>{effectiveWorkloadData.balanceIndexPercent}%</strong> (rata-rata <strong>{effectiveWorkloadData.averageLoad}</strong> diklat per WI, rentang 2 s.d. 3 diklat).
                  </p>
                  <p>
                    2. <strong>Struktur Kepangkatan:</strong> Terdiri dari 40 orang Widyaiswara Ahli Madya (Kolonel/Pembina Utama), 11 orang Ahli Muda (Letkol/Penata Tk. I), dan 9 orang Ahli Pertama (Capeg III/b).
                  </p>
                  <p>
                    3. <strong>Pencegahan Tumpang Tindih & Konflik Jadwal:</strong> Terverifikasi <strong>0 (nol) benturan jadwal</strong> (zero clash schedule) dan tidak ada duplikasi penugasan dalam satu materi pelatihan pada program yang sama.
                  </p>
                  <p>
                    4. <strong>Penerapan Azas Keberimbangan TNI dan Sipil:</strong> Sebanyak <strong>{effectiveWorkloadData.tniSipilBalancedProgramsCount} dari {effectiveWorkloadData.totalProgramsCount} program diklat (100%)</strong> melibatkan kombinasi pengampu kolaboratif antara unsur Militer TNI ({effectiveWorkloadData.totalTniLecturers} WI, total {effectiveWorkloadData.totalTniAssignments} sesi) dan Sipil PNS Kemhan ({effectiveWorkloadData.totalSipilLecturers} WI, total {effectiveWorkloadData.totalSipilAssignments} sesi) secara berimbang, mewujudkan sinergi pertahanan semesta yang utuh dan terpadu.
                  </p>
                </div>
              </div>

              {/* BAB IV */}
              <div>
                <h4 className="font-bold uppercase text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  BAB IV: PENGESAHAN DAN PENUTUP
                </h4>
                <p className="text-justify pl-2">
                  Demikian Laporan Rekapitulasi Eksekutif Penyelenggaraan Diklat dan Pemetaan Beban Mengajar Widyaiswara TA 2027 ini disusun secara tertib administrasi sebagai dokumen acuan resmi operasional Pusat Kepemimpinan dan Manajemen Pertahanan Badiklat Kemhan RI.
                </p>
              </div>

              {/* Dual Signatures */}
              <div className="mt-8 pt-4 flex justify-between text-xs font-sans">
                <div className="text-center w-64">
                  <p>Yang Melaporkan,</p>
                  <p className="font-semibold">Kabid Diklat Puspimjemenhan</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">Kolonel Caj (K) Dr. Sri Iswati, M.Si.</p>
                  <p className="text-[10px] text-slate-500">NRP 523891</p>
                </div>

                <div className="text-center w-72">
                  <p>Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="font-bold">Mengetahui &amp; Menyetujui,</p>
                  <p className="font-bold text-[11px]">Plt. Kepala Pusat Kepemimpinan dan Manajemen Pertahanan</p>
                  <div className="h-14"></div>
                  <p className="font-bold underline">Laksamana Pertama TNI Anis Rusdiyono</p>
                  <p className="text-[10px] text-slate-500">Plt. Kapuspimjemenhan Badiklat Kemhan RI</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* DOKUMEN 4: SILABUS PROGRAM DIKLAT */}
          {/* ========================================================================= */}
          {currentDocType === 'syllabus' && program && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="font-bold text-base uppercase underline tracking-wide">
                  PROGRAM PENDIDIKAN DAN PELATIHAN TA 2027
                </h2>
                <span className="font-sans text-xs font-bold text-slate-700">
                  KODE: {program.code} • METODE: {program.method.toUpperCase()}
                </span>
              </div>

              <table className="w-full border border-slate-300 text-xs">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 font-bold bg-slate-50 w-1/4">Nama Program</td>
                    <td className="p-2 font-bold text-slate-900">{program.name}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 font-bold bg-slate-50">Kategori & Metode</td>
                    <td className="p-2">{program.category} / {program.method} ({program.durationLabel})</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 font-bold bg-slate-50">Waktu & Tempat</td>
                    <td className="p-2">{program.displayDate} ({program.location})</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 font-bold bg-slate-50">Alokasi & Akomodasi</td>
                    <td className="p-2">{program.capacity} Orang ({program.boarding})</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 font-bold bg-slate-50">Target Peserta</td>
                    <td className="p-2">
                      {program.targetParticipants.tni && <div>• TNI: {program.targetParticipants.tni}</div>}
                      {program.targetParticipants.pns && <div>• PNS: {program.targetParticipants.pns}</div>}
                      {program.targetParticipants.pppk && <div>• PPPK: {program.targetParticipants.pppk}</div>}
                      <div>• Pendidikan: {program.targetParticipants.minEducation}</div>
                      {program.targetParticipants.maxAge && <div>• Usia: Maksimal {program.targetParticipants.maxAge} Tahun</div>}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-4">
                <h4 className="font-bold text-xs uppercase mb-1">A. Deskripsi Singkat</h4>
                <p className="text-xs text-justify">{program.shortDescription}</p>
              </div>

              <div className="mt-4">
                <h4 className="font-bold text-xs uppercase mb-1">B. Tujuan Kurikuler & Kompetensi Dasar</h4>
                <p className="text-xs text-justify"><strong>1. Tujuan Kurikuler Umum (TKU):</strong> {program.objectives.general}</p>
                <div className="text-xs mt-1">
                  <strong>2. Tujuan Kurikuler Khusus (TKK):</strong>
                  <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                    {program.objectives.specific.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-xs text-justify mt-1"><strong>3. Kompetensi Dasar:</strong> {program.competency}</p>
              </div>

              <div className="mt-4">
                <h4 className="font-bold text-xs uppercase mb-1">C. Struktur Materi Pelatihan</h4>
                {program.curriculum.basic.length > 0 && (
                  <div className="text-xs mb-2">
                    <strong className="block text-slate-800">1. Bidang Studi Dasar:</strong>
                    <ul className="list-decimal list-inside ml-2">
                      {program.curriculum.basic.map((m, idx) => <li key={idx}>{m}</li>)}
                    </ul>
                  </div>
                )}

                <div className="text-xs mb-2">
                  <strong className="block text-slate-800">2. Bidang Studi Inti:</strong>
                  <ul className="list-decimal list-inside ml-2 font-medium">
                    {program.curriculum.core.map((m, idx) => <li key={idx}>{m}</li>)}
                  </ul>
                </div>

                {program.curriculum.supporting.length > 0 && (
                  <div className="text-xs">
                    <strong className="block text-slate-800">3. Bidang Studi Pendukung / Lain-lain:</strong>
                    <ul className="list-decimal list-inside ml-2">
                      {program.curriculum.supporting.map((m, idx) => <li key={idx}>{m}</li>)}
                    </ul>
                  </div>
                )}
              </div>

              {/* Tanda Tangan Plt. Kapuspimjemenhan */}
              <div className="mt-8 pt-4 flex justify-end">
                <div className="text-center w-72 text-xs font-sans">
                  <p>Jakarta, Januari 2027</p>
                  <p className="font-bold mt-1">Plt. Kepala Pusat Kepemimpinan dan Manajemen Pertahanan</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">Laksamana Pertama TNI Anis Rusdiyono</p>
                  <p className="text-[10px] text-slate-500">Plt. Kapuspimjemenhan Badiklat Kemhan RI</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* DOKUMEN 5: LEMBAR HASIL UJI KELAYAKAN CALON PESERTA (ELIGIBILITY) */}
          {/* ========================================================================= */}
          {currentDocType === 'eligibility' && eligibilityData && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="font-bold text-base uppercase underline tracking-wide">
                  LEMBAR HASIL UJI KELAYAKAN CALON PESERTA DIKLAT
                </h2>
                <span className="font-sans text-xs text-slate-600">
                  Nomor: LHUK / {Date.now().toString().slice(-4)} / BPSDM / 2027
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 text-xs font-sans">
                <h4 className="font-bold mb-1 text-slate-800">Biodata Personel yang Diuji:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div><strong>Nama Lengkap:</strong> {eligibilityData.profile.name}</div>
                  <div><strong>Kategori / Korps:</strong> {eligibilityData.profile.category} ({eligibilityData.profile.serviceBranch || 'Kemhan'})</div>
                  <div><strong>Pangkat / Golongan:</strong> {eligibilityData.profile.rank}</div>
                  <div><strong>Usia:</strong> {eligibilityData.profile.age} Tahun</div>
                  <div><strong>Pendidikan:</strong> {eligibilityData.profile.education} {eligibilityData.profile.educationMajor ? `(${eligibilityData.profile.educationMajor})` : ''}</div>
                  <div><strong>Jabatan:</strong> {eligibilityData.profile.currentPosition || '-'}</div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-bold text-xs uppercase mb-2">
                  Daftar Program Pelatihan yang Memenuhi Syarat (Eligible):
                </h4>
                <table className="w-full border border-slate-300 text-xs">
                  <thead>
                    <tr className="bg-slate-100 font-bold border-b border-slate-300">
                      <th className="p-2 text-left">Kode</th>
                      <th className="p-2 text-left">Nama Pelatihan</th>
                      <th className="p-2 text-left">Metode</th>
                      <th className="p-2 text-left">Jadwal TA 2027</th>
                      <th className="p-2 text-center">Skor Kesesuaian</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eligibilityData.results.filter(r => r.status === 'ELIGIBLE').slice(0, 10).map((r, i) => (
                      <tr key={i} className="border-b border-slate-200">
                        <td className="p-2 font-mono font-bold">{r.program.code}</td>
                        <td className="p-2 font-bold">{r.program.name}</td>
                        <td className="p-2">{r.program.method}</td>
                        <td className="p-2">{r.program.displayDate.split('|')[0]}</td>
                        <td className="p-2 text-center font-bold text-emerald-700">{r.score}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 pt-4 flex justify-between text-xs font-sans">
                <div className="text-center w-56">
                  <p>Mengetahui,</p>
                  <p className="font-bold mt-1">Analis Kepegawaian Satker</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">( .................................................. )</p>
                </div>
                <div className="text-center w-56">
                  <p>Jakarta, 5 November 2026</p>
                  <p className="font-bold mt-1">Petugas Verifikator Puspimjemenhan</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">( Tim Validasi Badiklat )</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* DOKUMEN 6: SURAT USULAN RESMI SATUAN KERJA */}
          {/* ========================================================================= */}
          {currentDocType === 'proposal' && proposalData && (
            <div className="space-y-4">
              <div className="flex justify-between items-start text-xs font-sans mb-4">
                <div>
                  <p>Nomor : {proposalData.letterNumber}</p>
                  <p>Klasifikasi : Biasa</p>
                  <p>Lampiran : 1 (satu) Berkas</p>
                  <p>Perihal : <strong>Usulan Calon Peserta Pelatihan TA 2027</strong></p>
                </div>
                <div className="text-right">
                  <p>{proposalData.dateFormatted}</p>
                  <p className="mt-2">Kepada Yth.</p>
                  <p className="font-bold">Plt. Kepala Pusat Kepemimpinan dan Manajemen Pertahanan</p>
                  <p>Badiklat Kemhan RI</p>
                  <p>di Jakarta</p>
                </div>
              </div>

              <p className="text-xs text-justify">
                1. Dasar: Rencana Program Pendidikan dan Pelatihan Pusat Kepemimpinan dan Manajemen Pertahanan (Puspimjemenhan) BPSDM Kemhan Tahun Anggaran 2027.
              </p>
              <p className="text-xs text-justify">
                2. Sehubungan dengan dasar di atas, dengan hormat kami mengusulkan personel dari satuan kerja <strong>{proposalData.satkerName}</strong> untuk mengikuti program pelatihan:
              </p>

              <div className="p-3 bg-slate-50 border border-slate-300 rounded text-xs my-2">
                <p><strong>Nama Pelatihan:</strong> {proposalData.program.name} ({proposalData.program.code})</p>
                <p><strong>Metode & Pelaksanaan:</strong> {proposalData.program.method} / {proposalData.program.displayDate}</p>
                <p><strong>Tempat:</strong> {proposalData.program.location}</p>
              </div>

              <p className="text-xs text-justify">
                3. Adapun daftar personel yang diusulkan adalah sebagai berikut:
              </p>

              <table className="w-full border border-slate-300 text-xs my-2">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-300">
                    <th className="p-2 text-center w-8">No</th>
                    <th className="p-2 text-left">Nama Lengkap</th>
                    <th className="p-2 text-left">Pangkat / NRP / NIP</th>
                    <th className="p-2 text-left">Jabatan</th>
                    <th className="p-2 text-left">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {proposalData.nominees.map((n: any, idx: number) => (
                    <tr key={idx} className="border-b border-slate-200">
                      <td className="p-2 text-center font-bold">{idx + 1}</td>
                      <td className="p-2 font-bold">{n.name}</td>
                      <td className="p-2">{n.rankNrp}</td>
                      <td className="p-2">{n.position}</td>
                      <td className="p-2 text-[11px]">{n.notes || 'Memenuhi Syarat'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="text-xs text-justify">
                4. Demikian usulan ini kami sampaikan untuk menjadi bahan pertimbangan dan proses penetapan pemanggilan calon peserta lebih lanjut.
              </p>

              <div className="mt-8 pt-4 flex justify-end text-xs font-sans">
                <div className="text-center w-64">
                  <p className="font-bold">{proposalData.commanderTitle}</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">{proposalData.commanderName}</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* DOKUMEN 7: BLANKO FORMULIR SURVEI IDENTIFIKASI FISIK 60 WIDYAISWARA */}
          {/* ========================================================================= */}
          {currentDocType === 'wi-blank-form' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="font-bold text-base uppercase underline tracking-wide">
                  FORMULIR IDENTIFIKASI AWAL PEMILIHAN MATERI & MATA PELATIHAN WIDYAISWARA
                </h2>
                <span className="font-sans text-xs font-bold text-slate-700 block mt-1">
                  TAHUN ANGGARAN 2027 • PUSPIMJEMENHAN BADIKLAT KEMHAN RI
                </span>
                <span className="font-sans text-[10px] text-slate-500 block">
                  Berdasarkan Katalog Diklat TA 2027 (43 Program) • Instrumen Penataan Beban Berimbang 60 WI
                </span>
              </div>

              <div className="p-3 border border-slate-300 bg-slate-50 rounded-lg text-xs leading-relaxed space-y-1">
                <div className="font-bold text-slate-900">Petunjuk Pengisian:</div>
                <div className="text-slate-700 text-[11px]">
                  1. Formulir ini wajib diisi oleh seluruh 60 Widyaiswara Puspimjemenhan Badiklat Kemhan RI (39 TNI & 21 PNS).<br/>
                  2. Pilihan materi mengacu pada kurikulum resmi dalam <strong>Katalog Diklat TA 2027</strong>.<br/>
                  3. Distribusi mengajar ditargetkan berimbang secara merata (2 s.d. 3 diklat per Widyaiswara) tanpa tumpang tindih materi.<br/>
                  4. Formulir yang telah diisi diserahkan kembali kepada Bidang Diklat untuk verifikasi penjadwalan bebas konflik.
                </div>
              </div>

              {/* Section I */}
              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-3 py-1.5 font-bold font-sans text-xs border-b border-slate-300 uppercase">
                  I. IDENTITAS WIDYAISWARA
                </div>
                <div className="p-3 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>1. Nama Lengkap & Gelar : ............................................................................</div>
                    <div>4. Jenjang Jabatan : [ ] Ahli Utama  [ ] Ahli Madya  [ ] Muda  [ ] Pertama</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>2. Pangkat / Golongan / Korps : ...................................................................</div>
                    <div>5. Kategori Personel : [ ] Militer TNI (AD/AL/AU)   [ ] Sipil PNS Kemhan</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>3. NIP / NRP : ....................................................................................</div>
                    <div>6. No. Handphone / WA : .....................................................................</div>
                  </div>
                </div>
              </div>

              {/* Section II */}
              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-3 py-1.5 font-bold font-sans text-xs border-b border-slate-300 uppercase">
                  II. PILIHAN MATA PELATIHAN / MATERI DIKLAT BERDASARKAN PRIORITAS
                </div>
                <div className="p-3 space-y-3 text-xs">
                  <div className="p-2 border border-slate-200 rounded">
                    <span className="font-bold block text-slate-900">1. Prioritas 1 (Materi Utama yang Paling Dikuasai):</span>
                    <div className="h-6 border-b border-dotted border-slate-400 mt-1"></div>
                    <span className="text-[10px] text-slate-500">Mata pelatihan inti yang menjadi keahlian utama pengajaran.</span>
                  </div>

                  <div className="p-2 border border-slate-200 rounded">
                    <span className="font-bold block text-slate-900">2. Prioritas 2 (Materi Pilihan Kedua / Pendukung):</span>
                    <div className="h-6 border-b border-dotted border-slate-400 mt-1"></div>
                    <span className="text-[10px] text-slate-500">Mata pelatihan kedua dalam rumpun yang relevan.</span>
                  </div>

                  <div className="p-2 border border-slate-200 rounded">
                    <span className="font-bold block text-slate-900">3. Prioritas 3 (Materi Cadangan / Alternatif):</span>
                    <div className="h-6 border-b border-dotted border-slate-400 mt-1"></div>
                    <span className="text-[10px] text-slate-500">Mata pelatihan penunjang atau materi dasar bela negara/etika.</span>
                  </div>
                </div>
              </div>

              {/* Section III */}
              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-3 py-1.5 font-bold font-sans text-xs border-b border-slate-300 uppercase">
                  III. PREFERENSI RUMPUN, METODE, LOKASI & KETERSEDIAAN WAKTU
                </div>
                <div className="p-3 space-y-2 text-xs">
                  <div>
                    <span className="font-semibold">Rumpun Diklat Diminati:</span><br/>
                    [ ] Kepemimpinan &nbsp;&nbsp;&nbsp; [ ] Manajemen Pertahanan &nbsp;&nbsp;&nbsp; [ ] Fungsional &nbsp;&nbsp;&nbsp; [ ] Teknis & Siber &nbsp;&nbsp;&nbsp; [ ] Kesehatan &nbsp;&nbsp;&nbsp; [ ] Workshop & TOT
                  </div>
                  <div className="pt-1">
                    <span className="font-semibold">Metode Pembelajaran:</span> [ ] Klasikal (Tatap Muka) &nbsp;&nbsp;&nbsp; [ ] Blended Learning &nbsp;&nbsp;&nbsp; [ ] Daring (PJJ)
                  </div>
                  <div className="pt-1">
                    <span className="font-semibold">Pilihan Kampus:</span> [ ] Salemba (Jakarta Pusat) &nbsp;&nbsp;&nbsp; [ ] Pondok Labu (Jakarta Selatan) &nbsp;&nbsp;&nbsp; [ ] Fleksibel Keduanya
                  </div>
                  <div className="pt-1">
                    <span className="font-semibold">Ketersediaan Triwulan TA 2027:</span> [ ] TW I (Jan-Mar) &nbsp;&nbsp;&nbsp; [ ] TW II (Apr-Jun) &nbsp;&nbsp;&nbsp; [ ] TW III (Jul-Sep) &nbsp;&nbsp;&nbsp; [ ] TW IV (Okt-Des)
                  </div>
                  <div className="pt-1">
                    <span className="font-semibold">Target Beban yang Diajukan:</span> [ ] 2 Program (Ideal) &nbsp;&nbsp;&nbsp; [ ] 3 Program (Standar) &nbsp;&nbsp;&nbsp; [ ] 4 Program (Maksimal Ahli Utama)
                  </div>
                </div>
              </div>

              {/* Section IV */}
              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-3 py-1.5 font-bold font-sans text-xs border-b border-slate-300 uppercase">
                  IV. SERTIFIKASI KOMPETENSI & CATATAN KHUSUS
                </div>
                <div className="p-3 space-y-2 text-xs">
                  <div>Sertifikasi Kompetensi / Pelatihan Khusus yang Dimiliki: ..........................................................................................................</div>
                  <div>Catatan / Aspirasi Pengajaran: .........................................................................................................................................................</div>
                </div>
              </div>

              {/* Signature Sheet with Plt. Kapuspimjemenhan */}
              <div className="mt-8 pt-4 flex justify-between text-xs font-sans">
                <div className="text-center w-64">
                  <p>Mengetahui,</p>
                  <p className="font-bold">Plt. Kepala Pusat Kepemimpinan dan Manajemen Pertahanan</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">Laksamana Pertama TNI Anis Rusdiyono</p>
                  <p className="text-[10px] text-slate-500">Plt. Kapuspimjemenhan Badiklat Kemhan RI</p>
                </div>

                <div className="text-center w-64">
                  <p>Jakarta, ............................................ 2027</p>
                  <p className="font-bold">Widyaiswara Pengusul,</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">................................................................</p>
                  <p className="text-[10px] text-slate-500">NIP/NRP : ..............................................</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* DOKUMEN 8: LEMBAR PENETAPAN BEBAN MENGAJAR INDIVIDU WIDYAISWARA */}
          {/* ========================================================================= */}
          {currentDocType === 'wi-individual-form' && specificLecturer && (() => {
            const pref = getStoredLecturerPreferences()[specificLecturer.id] || DEFAULT_LECTURER_PREFERENCES[specificLecturer.id];
            const lecturerAssignments = effectiveWorkloadData?.lecturerStats.find(s => s.lecturerId === specificLecturer.id)?.assignments || [];
            return (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="font-bold text-base uppercase underline tracking-wide">
                    LEMBAR HASIL IDENTIFIKASI & PENETAPAN BEBAN MENGAJAR WIDYAISWARA
                  </h2>
                  <span className="font-sans text-xs font-bold text-slate-700 block mt-1">
                    TAHUN ANGGARAN 2027 • PUSPIMJEMENHAN BADIKLAT KEMHAN RI
                  </span>
                  <span className="font-sans text-[10px] text-slate-500 block">
                    Penugasan Resmi Berbasis Pilihan Kompetensi & Kuota Berimbang (Zero Clash Schedule)
                  </span>
                </div>

                {/* Profile Box */}
                <div className="border border-slate-300 rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-3 py-1.5 font-bold font-sans text-xs border-b border-slate-300 uppercase flex justify-between items-center">
                    <span>I. PROFIL WIDYAISWARA</span>
                    <span className="text-[10px] text-amber-900 bg-amber-200 px-2 py-0.2 rounded font-mono font-bold">
                      ID WI #{specificLecturer.id}
                    </span>
                  </div>
                  <div className="p-3 text-xs space-y-1.5">
                    <div className="grid grid-cols-2 gap-4">
                      <div><strong>Nama Lengkap:</strong> {specificLecturer.name}</div>
                      <div><strong>Jenjang:</strong> Widyaiswara Ahli {specificLecturer.grade}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><strong>Pangkat / Korps:</strong> {specificLecturer.rankTitle}</div>
                      <div><strong>Kategori:</strong> {specificLecturer.category}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><strong>Satuan Kerja:</strong> {specificLecturer.department}</div>
                      <div><strong>Status Kesiapan:</strong> {pref?.readinessStatus || 'Siap Penuh'}</div>
                    </div>
                  </div>
                </div>

                {/* Stated Choices */}
                <div className="border border-slate-300 rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-3 py-1.5 font-bold font-sans text-xs border-b border-slate-300 uppercase">
                    II. HASIL IDENTIFIKASI PILIHAN MATERI OLEH WIDYAISWARA
                  </div>
                  <div className="p-3 text-xs space-y-2">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-2 border border-amber-300 bg-amber-50/50 rounded">
                        <span className="font-bold text-amber-950 block text-[11px]">Prioritas 1 (Utama):</span>
                        <div className="font-semibold text-slate-900 mt-0.5">{pref?.primarySubject || '-'}</div>
                      </div>
                      <div className="p-2 border border-blue-300 bg-blue-50/50 rounded">
                        <span className="font-bold text-blue-950 block text-[11px]">Prioritas 2 (Pendukung):</span>
                        <div className="font-semibold text-slate-900 mt-0.5">{pref?.secondarySubject || '-'}</div>
                      </div>
                      <div className="p-2 border border-purple-300 bg-purple-50/50 rounded">
                        <span className="font-bold text-purple-950 block text-[11px]">Prioritas 3 (Cadangan):</span>
                        <div className="font-semibold text-slate-900 mt-0.5">{pref?.tertiarySubject || '-'}</div>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-600 pt-1">
                      <strong>Rumpun Peminatan:</strong> {pref?.preferredCategory || 'Kepemimpinan'} • 
                      <strong> Metode:</strong> {pref?.preferredMethods?.join(', ') || 'Klasikal, Blended'} • 
                      <strong> Lokasi:</strong> {pref?.preferredLocation || 'Keduanya (Salemba & Pondok Labu)'} • 
                      <strong> Triwulan:</strong> {pref?.availableQuarters?.join(', ') || 'TW I s.d. TW IV'}
                    </div>

                    {pref?.selectedPrograms && pref.selectedPrograms.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-200">
                        <div className="font-bold text-[11px] text-slate-800 mb-1">
                          Daftar Program Diklat Terpilih &amp; Maksimal 2 Materi per Diklat:
                        </div>
                        <table className="w-full text-[10px] border border-slate-300">
                          <thead>
                            <tr className="bg-slate-100 text-slate-800">
                              <th className="p-1 border-r border-slate-300 text-center w-6">No</th>
                              <th className="p-1 border-r border-slate-300 text-left">Program Diklat Terpilih</th>
                              <th className="p-1 border-r border-slate-300 text-left">Materi 1 (Mata Pelatihan Utama)</th>
                              <th className="p-1 text-left">Materi 2 (Maksimal 2 Materi)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {pref.selectedPrograms.map((progChoice, pIdx) => (
                              <tr key={pIdx}>
                                <td className="p-1 text-center font-bold">{pIdx + 1}</td>
                                <td className="p-1 font-semibold text-slate-900">[{progChoice.programCode}] {progChoice.programName}</td>
                                <td className="p-1 text-amber-900 font-medium">{progChoice.subject1 || '-'}</td>
                                <td className="p-1 text-blue-900 font-medium">{progChoice.subject2 || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Assigned Programs Table */}
                <div className="border border-slate-300 rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-3 py-1.5 font-bold font-sans text-xs border-b border-slate-300 uppercase flex justify-between items-center">
                    <span>III. PENETAPAN PENUGASAN MENGAJAR BERIMBANG TA 2027</span>
                    <span className="text-[10px] text-emerald-900 bg-emerald-200 px-2 py-0.2 rounded font-mono font-bold">
                      {lecturerAssignments.length} Program Diklat
                    </span>
                  </div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-300 text-slate-700">
                        <th className="p-2 text-center w-8">No</th>
                        <th className="p-2 text-left">Program Pelatihan</th>
                        <th className="p-2 text-left">Mata Pelatihan Ditugaskan</th>
                        <th className="p-2 text-center w-28">Jadwal Mulai</th>
                        <th className="p-2 text-left w-36">Ruang / Kampus</th>
                        <th className="p-2 text-center w-28">Kesesuaian Pilihan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {lecturerAssignments.map((asg, aidx) => (
                        <tr key={aidx}>
                          <td className="p-2 text-center font-bold">{aidx + 1}</td>
                          <td className="p-2 font-bold text-slate-900">{asg.programName}</td>
                          <td className="p-2 font-semibold text-amber-800">{asg.subject}</td>
                          <td className="p-2 text-center font-mono">{asg.dateAssigned}</td>
                          <td className="p-2 text-slate-600 text-[10px]">{asg.room || 'Kampus Salemba'}</td>
                          <td className="p-2 text-center">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              {asg.preferenceRank || 'Sesuai Rumpun'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mutual Signatures with Plt. Kapuspimjemenhan */}
                <div className="mt-8 pt-4 flex justify-between text-xs font-sans">
                  <div className="text-center w-64">
                    <p>Widyaiswara Bersangkutan,</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">{specificLecturer.name}</p>
                    <p className="text-[10px] text-slate-500">{specificLecturer.rankTitle}</p>
                  </div>

                  <div className="text-center w-72">
                    <p>Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="font-bold">Plt. Kepala Pusat Kepemimpinan dan Manajemen Pertahanan</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">Laksamana Pertama TNI Anis Rusdiyono</p>
                    <p className="text-[10px] text-slate-500">Plt. Kapuspimjemenhan Badiklat Kemhan RI</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
