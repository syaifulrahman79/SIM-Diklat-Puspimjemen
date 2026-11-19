import React, { useState, useMemo } from 'react';
import { TRAINING_PROGRAMS, TrainingProgram } from '../data/programsData.ts';
import { 
  Building2, 
  UserPlus, 
  Printer, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  Shield,
  Send,
  Plus,
  Search,
  X
} from 'lucide-react';

interface Nominee {
  id: string;
  name: string;
  category: 'TNI' | 'PNS' | 'PPPK';
  rankNrp: string;
  position: string;
  education: string;
  phone: string;
  notes?: string;
}

interface RegistrationSimViewProps {
  onPrintOfficialProposal: (letterData: any) => void;
}

export const RegistrationSimView: React.FC<RegistrationSimViewProps> = ({
  onPrintOfficialProposal
}) => {
  const [selectedProgramId, setSelectedProgramId] = useState<number>(TRAINING_PROGRAMS[0].id);
  const [satkerName, setSatkerName] = useState<string>('Biro Kepegawaian Setjen Kemhan');
  const [letterNumber, setLetterNumber] = useState<string>('B/342/XI/2026/ROPEG');
  const [commanderTitle, setCommanderTitle] = useState<string>('Kepala Biro Kepegawaian Setjen Kemhan');
  const [commanderName, setCommanderName] = useState<string>('Brigadir Jenderal TNI Ahmad Fadli, S.Sos.');
  const [programSearch, setProgramSearch] = useState<string>('');

  const selectablePrograms = useMemo(() => {
    if (!programSearch.trim()) return TRAINING_PROGRAMS;
    const q = programSearch.toLowerCase();
    return TRAINING_PROGRAMS.filter(p => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q));
  }, [programSearch]);

  const [nominees, setNominees] = useState<Nominee[]>([
    {
      id: "NOM-1",
      name: "Mayor Cku Dedi Kurniawan, S.E.",
      category: "TNI",
      rankNrp: "Mayor Cku / NRP 538192",
      position: "Kasi Verifikasi Keuangan Satker",
      education: "S1 Akuntansi Pertahanan",
      phone: "0812-4411-2233",
      notes: "Diusulkan untuk pemenuhan sertifikasi"
    },
    {
      id: "NOM-2",
      name: "Agus Prasetyo, S.AP.",
      category: "PNS",
      rankNrp: "Penata (III/c) / NIP 198205122008011002",
      position: "Pengelola Program dan Anggaran",
      education: "S1 Administrasi Publik",
      phone: "0813-8899-7711",
      notes: "Telah memenuhi masa kerja dalam pangkat"
    }
  ]);

  // Form for new nominee
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'TNI' | 'PNS' | 'PPPK'>('TNI');
  const [newRankNrp, setNewRankNrp] = useState('');
  const [newPosition, setNewPosition] = useState('');
  const [newEducation, setNewEducation] = useState('S1');
  const [newPhone, setNewPhone] = useState('');

  const currentProgram = TRAINING_PROGRAMS.find(p => p.id === selectedProgramId) || TRAINING_PROGRAMS[0];

  const handleAddNominee = () => {
    if (!newName.trim()) return;

    const newNominee: Nominee = {
      id: `NOM-${Date.now().toString().slice(-4)}`,
      name: newName,
      category: newCategory,
      rankNrp: newRankNrp || (newCategory === 'TNI' ? 'Mayor / NRP ...' : 'Penata III/c / NIP ...'),
      position: newPosition || 'Staf Satker',
      education: newEducation,
      phone: newPhone || '0812-xxxx-xxxx'
    };

    setNominees([...nominees, newNominee]);
    setNewName('');
    setNewRankNrp('');
    setNewPosition('');
    setNewPhone('');
  };

  const handleRemoveNominee = (id: string) => {
    setNominees(nominees.filter(n => n.id !== id));
  };

  const handlePrint = () => {
    const letterPayload = {
      program: currentProgram,
      satkerName,
      letterNumber,
      commanderTitle,
      commanderName,
      nominees,
      dateFormatted: "Jakarta, 5 November 2026"
    };

    onPrintOfficialProposal(letterPayload);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
              Layanan Satker
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Simulasi Usulan Calon Peserta Diklat dari Satuan Kerja
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Penyiapan Surat Pengusulan Calon Peserta Diklat kepada Plt. Kapuspimjemenhan (Laksamana Pertama TNI Anis Rusdiyono) / Kabadiklat Kemhan RI TA 2027.
          </p>
        </div>

        <button
          onClick={handlePrint}
          disabled={nominees.length === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <Printer className="w-4 h-4 text-amber-400" />
          <span>Cetak Format Surat Usulan Resmi ({nominees.length} Peserta)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Satker & Program Config */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-amber-600" />
            <span>Identitas Satker Pengusul & Program Diklat</span>
          </h3>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Program Pelatihan yang Dituju:
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {selectablePrograms.length} Diklat
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari program diklat tujuan..."
                  value={programSearch}
                  onChange={(e) => setProgramSearch(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                {programSearch && (
                  <button
                    onClick={() => setProgramSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <select
                value={selectedProgramId}
                onChange={(e) => setSelectedProgramId(parseInt(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
              >
                {selectablePrograms.map(prog => (
                  <option key={prog.id} value={prog.id}>
                    {prog.code} - {prog.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Program Quick Specs */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1">
            <div className="flex justify-between">
              <span className="font-semibold">Metode & Durasi:</span>
              <span>{currentProgram.method} ({currentProgram.durationLabel})</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Pelaksanaan:</span>
              <span>{currentProgram.displayDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Sasaran Pangkat:</span>
              <span>{currentProgram.targetParticipants.tni || currentProgram.targetParticipants.pns}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Satker / Kotama Pengusul:</label>
              <input
                type="text"
                value={satkerName}
                onChange={(e) => setSatkerName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Nomor Surat Dinas:</label>
              <input
                type="text"
                value={letterNumber}
                onChange={(e) => setLetterNumber(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Jabatan Penandatangan:</label>
              <input
                type="text"
                value={commanderTitle}
                onChange={(e) => setCommanderTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Nama & Pangkat Kasatker:</label>
              <input
                type="text"
                value={commanderName}
                onChange={(e) => setCommanderName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
          </div>

          {/* Add Nominee Subform */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <span className="text-xs font-bold text-slate-800 block flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-emerald-600" />
              <span>Tambah Personel Calon Peserta:</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Nama Lengkap & Gelar..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50"
              />

              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                <option value="TNI">TNI</option>
                <option value="PNS">PNS Kemhan</option>
                <option value="PPPK">PPPK</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Pangkat & NRP / NIP..."
                value={newRankNrp}
                onChange={(e) => setNewRankNrp(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50"
              />

              <input
                type="text"
                placeholder="Jabatan saat ini..."
                value={newPosition}
                onChange={(e) => setNewPosition(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="No. Telp / HP WhatsApp..."
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50"
              />
              <button
                type="button"
                onClick={handleAddNominee}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer transition shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Table: Nominees List */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Daftar Calon Peserta yang Diusulkan ({nominees.length} Personel)
              </h3>
              <p className="text-xs text-slate-500">
                Data ini akan dicetak ke dalam Lampiran Surat Usulan Resmi Satker Kemhan.
              </p>
            </div>
          </div>

          {nominees.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-2.5">No</th>
                    <th className="p-2.5">Nama & Pangkat/NRP/NIP</th>
                    <th className="p-2.5">Jabatan & Satker</th>
                    <th className="p-2.5">Status Syarat</th>
                    <th className="p-2.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {nominees.map((nom, idx) => (
                    <tr key={nom.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-2.5">
                        <span className="font-bold text-slate-900 block">{nom.name}</span>
                        <span className="text-[11px] text-slate-500 block">{nom.rankNrp}</span>
                      </td>
                      <td className="p-2.5 text-slate-700">
                        <span>{nom.position}</span>
                        <span className="text-[10px] text-slate-400 block">{nom.phone}</span>
                      </td>
                      <td className="p-2.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Siap Diuji</span>
                        </span>
                      </td>
                      <td className="p-2.5 text-right">
                        <button
                          onClick={() => handleRemoveNominee(nom.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Belum ada calon peserta yang ditambahkan ke dalam daftar usulan.
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <p>
              Format dokumen mengacu pada standar Minu Kemhan RI untuk diteruskan kepada 
              <strong> Biro Kepegawaian Setjen Kemhan</strong> dan <strong>Puspimjemenhan Badiklat Kemhan</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
