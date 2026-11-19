import type { TrainingProgram } from './programsData.ts';
import { TRAINING_PROGRAMS } from './programsData.ts';

export interface ProgramSubjectChoice {
  programId: number; // Selected TrainingProgram ID
  programCode?: string;
  programName?: string;
  subject1: string; // Materi 1 (Maksimal 2 materi dalam satu diklat)
  subject2?: string; // Materi 2 (Opsional, batas maksimal 2 materi dalam satu diklat)
}

export interface LecturerPreference {
  lecturerId: number;
  // Pilihan program diklat mandiri (Bisa memilih lebih dari 2 diklat, masing-masing maks 2 materi)
  selectedPrograms: ProgramSubjectChoice[];
  primarySubject: string; // Pilihan Prioritas 1 (Keahlian Utama)
  secondarySubject: string; // Pilihan Prioritas 2 (Keahlian Pendukung)
  tertiarySubject?: string; // Pilihan Prioritas 3 (Alternatif)
  preferredCategory: 'Kepemimpinan' | 'Manajemen' | 'Teknis & Siber' | 'Fungsional' | 'Kesehatan' | 'Workshop & TOT' | 'Semua Kategori';
  preferredPrograms?: string[]; // Program Diklat Spesifik yang Diminati dari Katalog 2027
  preferredMethods?: ('Klasikal' | 'Blended Learning' | 'Daring' | 'Daring (PJJ)')[];
  preferredLocation?: 'Salemba' | 'Pondok Labu' | 'Fleksibel' | 'Keduanya (Salemba & Pondok Labu)' | string;
  availableQuarters?: ('TW I' | 'TW II' | 'TW III' | 'TW IV')[];
  readinessStatus: 'Siap Penuh' | 'Siap Bersyarat' | 'Penugasan Khusus' | 'Pendampingan' | 'Perlu Pendampingan';
  targetQuota: number; // 2, 3, atau 4 diklat
  certifications?: string[] | string;
  notes?: string;
  updatedAt?: string;
  submissionSource?: 'Mandiri (Online Form)' | 'Mandiri WI' | 'Administrasi Puspimjemen' | 'Matriks Salemba';
}

export interface Lecturer {
  id: number;
  name: string;
  rankTitle: string;
  category: 'Militer' | 'Sipil (PNS)';
  grade: 'Utama' | 'Madya/Muda' | 'Pertama' | 'Madya' | 'Muda';
  positionTitle?: string;
  location?: 'Wilayah Salemba' | 'Wilayah Pondok Labu';
  subjects: string[];
  department: string;
  nipNrp: string;
  phone: string;
  email: string;
  assignedProgramsCount?: number;
  preferences?: LecturerPreference;
}

// Helper untuk mengambil seluruh mata pelatihan dalam suatu program diklat
export function getProgramSubjects(program: TrainingProgram): string[] {
  const list: string[] = [];
  const add = (items?: string[]) => {
    if (items && Array.isArray(items)) {
      items.forEach(item => {
        const clean = item.trim();
        if (clean && !list.includes(clean)) {
          list.push(clean);
        }
      });
    }
  };
  add(program.curriculum.core);
  add(program.curriculum.basic);
  add(program.curriculum.supporting);
  add(program.curriculum.others);
  return list;
}

// 60 Widyaiswara & APN Puspimjemenhan BPSDM Han Kemhan (Official Update 2026/2027)
// Terdiri dari: 21 Wilayah Salemba & 39 Wilayah Pondok Labu (39 TNI Militer & 21 Sipil PNS)
export const LECTURERS_DATA: Lecturer[] = [
  // ================= WILAYAH SALEMBA (1 - 21) =================
  {
    id: 1,
    name: "Kolonel Arh R. Novi Setiana, S.I.P",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Salemba",
    rankTitle: "Kolonel Arh (TNI AD)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Kepemimpinan & Strategi",
    nipNrp: "NRP 523101",
    phone: "0812-1001-0001",
    email: "novi.setiana@kemhan.go.id",
    subjects: ["Kepemimpinan Strategis Pertahanan", "Wawasan Kebangsaan", "Manajemen Strategis", "Bela Negara dalam Perspektif Sishanneg"]
  },
  {
    id: 2,
    name: "Kolonel Inf Dra. Toto G, M.Han",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Salemba",
    rankTitle: "Kolonel Inf (TNI AD)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Kepemimpinan Pertahanan",
    nipNrp: "NRP 523102",
    phone: "0812-1001-0002",
    email: "toto.gunarto@kemhan.go.id",
    subjects: ["Kepemimpinan Visioner", "Studi Pertahanan", "Ketahanan Nasional", "Bela Negara dalam Perspektif Sishanneg"]
  },
  {
    id: 3,
    name: "Kolonel Arh A. Saiful W, S.IP.",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Salemba",
    rankTitle: "Kolonel Arh (TNI AD)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Taktik & Doktrin Pertahanan",
    nipNrp: "NRP 523103",
    phone: "0812-1001-0003",
    email: "saiful.widjawanto@kemhan.go.id",
    subjects: ["Doktrin Pertahanan Negara", "Taktik Strategis", "Kepemimpinan Strategis Pertahanan", "Studi Lapangan / PKL"]
  },
  {
    id: 4,
    name: "Kolonel Inf Ady Surya",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Salemba",
    rankTitle: "Kolonel Inf (TNI AD)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Kejuangan & Bela Negara",
    nipNrp: "NRP 523104",
    phone: "0812-1001-0004",
    email: "ady.surya@kemhan.go.id",
    subjects: ["Bela Negara dalam Perspektif Sishanneg", "Kepemimpinan Lapangan", "Wawasan Kebangsaan", "Dinamika Kelompok (DK) / Outbound"]
  },
  {
    id: 5,
    name: "Kolonel Pas Syamsul Hilal, S.Pd., M.Han",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Salemba",
    rankTitle: "Kolonel Pas (TNI AU)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Pertahanan Udara & Operasi",
    nipNrp: "NRP 523105",
    phone: "0812-1001-0005",
    email: "syamsul.hilal@kemhan.go.id",
    subjects: ["Operasi Gabungan & Taktik Pertahanan", "Manajemen Konflik Pertahanan", "Kepemimpinan Transformatif", "Bela Negara dalam Perspektif Sishanneg"]
  },
  {
    id: 6,
    name: "Kolonel Sus H. M. Taufik, S.Kom., M.Si.",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Salemba",
    rankTitle: "Kolonel Sus (TNI AU)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Teknologi & Siber Pertahanan",
    nipNrp: "NRP 523106",
    phone: "0812-1001-0006",
    email: "taufik.sus@kemhan.go.id",
    subjects: ["Teknologi Informasi & Komunikasi Pertahanan", "Keamanan Siber Pertahanan", "Transformasi Digital Sektor Publik", "Pemanfaatan TI"]
  },
  {
    id: 7,
    name: "Kolonel Laut (S) Dawinto",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Salemba",
    rankTitle: "Kolonel Laut (S) (TNI AL)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Logistik & Keuangan Matra Laut",
    nipNrp: "NRP 523107",
    phone: "0812-1001-0007",
    email: "dawinto.al@kemhan.go.id",
    subjects: ["Manajemen Logistik Pertahanan", "Pengelolaan BMN Pertahanan", "Manajemen Pengadaan Barang/Jasa Kemhan", "Akuntabilitas Kinerja"]
  },
  {
    id: 8,
    name: "Kolonel Cke Dwi Agus",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Salemba",
    rankTitle: "Kolonel Cke (TNI AD)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Komunikasi & Elektronika Pertahanan",
    nipNrp: "NRP 523108",
    phone: "0812-1001-0008",
    email: "dwi.agus@kemhan.go.id",
    subjects: ["Komunikasi Pertahanan", "Jaringan & Sandi Pertahanan", "Pemanfaatan TI", "Manajemen Operasional Komunikasi"]
  },
  {
    id: 9,
    name: "Kolonel Laut (KH) Donny G P, S.Pi., M.Tr Hanla., M.M",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Salemba",
    rankTitle: "Kolonel Laut (KH) (TNI AL)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Khusus Maritim & Hukum Laut",
    nipNrp: "NRP 523109",
    phone: "0812-1001-0009",
    email: "donny.george@kemhan.go.id",
    subjects: ["Hukum Maritim & Pertahanan Laut", "Kepemimpinan Strategis Pertahanan", "Manajemen Sumber Daya Maritim", "Wawasan Kebangsaan"]
  },
  {
    id: 10,
    name: "Kolonel Laut (S/W) Dwi Soesi, S.E., M.A.P.",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Salemba",
    rankTitle: "Kolonel Laut (S/W) (TNI AL)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Administrasi Keuangan",
    nipNrp: "NRP 523110",
    phone: "0812-1001-0010",
    email: "dwi.soesilawati@kemhan.go.id",
    subjects: ["Akuntansi Pemerintah & Pelaporan Keuangan", "Sistem Perbendaharaan Negara", "Perencanaan Penganggaran Pertahanan", "Manajemen Keuangan Pertahanan"]
  },
  {
    id: 11,
    name: "Kolonel Caj (K) Dr. Sri Iswati, S.Pd., M.Si.",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Salemba",
    rankTitle: "Kolonel Caj (K) (TNI AD)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Ajudan Jenderal & Personel",
    nipNrp: "NRP 523111",
    phone: "0812-1001-0011",
    email: "sri.iswati@kemhan.go.id",
    subjects: ["Manajemen SDM Pertahanan", "Pengembangan Kompetensi ASN & Militer", "Penilaian Kinerja Pegawai", "Psikologi Kepemimpinan"]
  },
  {
    id: 12,
    name: "Kolonel Cba (K) L Febriyanty, S.Pd., M.M.",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Salemba",
    rankTitle: "Kolonel Cba (K) (TNI AD)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Pembekalan & Angkutan",
    nipNrp: "NRP 523112",
    phone: "0812-1001-0012",
    email: "lili.febriyanty@kemhan.go.id",
    subjects: ["Manajemen Rantai Pasok Pertahanan", "Pengendalian Logistik Kemhan", "Manajemen Sarana Prasarana", "Manajemen Pelayanan Publik"]
  },
  {
    id: 13,
    name: "Kolonel Cke Arif Yudi Sachariyanto",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Salemba",
    rankTitle: "Kolonel Cke (TNI AD)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Peperangan Elektronika & Komunikasi",
    nipNrp: "NRP 523113",
    phone: "0812-1001-0013",
    email: "arif.yudi@kemhan.go.id",
    subjects: ["Pemanfaatan TI", "Perang Elektronika & Siber", "Infrastruktur Jaringan Komunikasi Pertahanan", "Manajemen Operasional"]
  },
  {
    id: 14,
    name: "Kolonel Laut Dr. R. Suryoko H, S.T., M.M., M.Tr Hanla.",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Salemba",
    rankTitle: "Kolonel Laut (S) (TNI AL)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Riset Manajemen Pertahanan",
    nipNrp: "NRP 523114",
    phone: "0812-1001-0014",
    email: "rademtus.suryoko@kemhan.go.id",
    subjects: ["Manajemen Risiko Pertahanan", "Perencanaan Strategis Jangka Panjang", "Metodologi Penelitian Manajemen", "Akuntabilitas Kinerja"]
  },
  {
    id: 15,
    name: "Pembina Muda Tk. IV/c Suhendra, S.I.P., M.M.",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Salemba",
    rankTitle: "Pembina Muda Tk. IV/c (PNS Kemhan)",
    category: "Sipil (PNS)",
    grade: "Madya",
    department: "Departemen Kebijakan Publik & Reformasi Birokrasi",
    nipNrp: "NIP 196805121994031001",
    phone: "0812-1001-0015",
    email: "suhendra@kemhan.go.id",
    subjects: ["Reformasi Birokrasi Kemhan & TNI", "Kebijakan Publik Pertahanan", "Etika Pemerintahan & Integritas", "Manajemen Perubahan Sektor Publik"]
  },
  {
    id: 16,
    name: "Pembina Tk. IV/a Hari Widodo, S.Pd., M.Si.",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Salemba",
    rankTitle: "Pembina Tk. IV/a (PNS Kemhan)",
    category: "Sipil (PNS)",
    grade: "Madya",
    department: "Departemen Metodologi Pembelajaran & TOT",
    nipNrp: "NIP 197108151996031002",
    phone: "0812-1001-0016",
    email: "hari.widodo@kemhan.go.id",
    subjects: ["Metodologi Pembelajaran Orang Dewasa (Andragogi)", "Desain Kurikulum & Silabus Pelatihan", "Evaluasi Pembelajaran Berbasis Kompetensi", "Teknik Presentasi & Fasilitasi"]
  },
  {
    id: 17,
    name: "Penata Tk I-III/d Sutikno S.A.P., M.A.P.",
    positionTitle: "Widyaiswara Ahli Muda",
    location: "Wilayah Salemba",
    rankTitle: "Penata Tk. I - III/d (PNS Kemhan)",
    category: "Sipil (PNS)",
    grade: "Muda",
    department: "Departemen Manajemen Kepegawaian ASN",
    nipNrp: "NIP 197904122002121003",
    phone: "0812-1001-0017",
    email: "sutikno@kemhan.go.id",
    subjects: ["Sistem Merit & Manajemen ASN", "Penyusunan Analisis Jabatan & ABK", "Standar Kompetensi Jabatan", "Pelayanan Publik Prima"]
  },
  {
    id: 18,
    name: "Penata Tk I-III/d Afri S.Kom., M.M.",
    positionTitle: "Widyaiswara Ahli Muda",
    location: "Wilayah Salemba",
    rankTitle: "Penata Tk. I - III/d (PNS Kemhan)",
    category: "Sipil (PNS)",
    grade: "Muda",
    department: "Departemen Sistem Informasi Manajemen",
    nipNrp: "NIP 198207182006041004",
    phone: "0812-1001-0018",
    email: "afriyanto@kemhan.go.id",
    subjects: ["Sistem Informasi Manajemen Kepegawaian (SIMPEG)", "Tata Kelola SPBE Kemhan", "Literasi Digital ASN Pertahanan", "Pemanfaatan TI"]
  },
  {
    id: 19,
    name: "Penata Tk I-III/d Asep Ridwan, S.AP., M.A.P.",
    positionTitle: "Widyaiswara Ahli Muda",
    location: "Wilayah Salemba",
    rankTitle: "Penata Tk. I - III/d (PNS Kemhan)",
    category: "Sipil (PNS)",
    grade: "Muda",
    department: "Departemen Akuntabilitas & Kinerja Instansi",
    nipNrp: "NIP 198103252005011005",
    phone: "0812-1001-0019",
    email: "asep.ridwan@kemhan.go.id",
    subjects: ["Penyusunan SAKIP & LAKIP", "Indikator Kinerja Utama (IKU)", "Perjanjian Kinerja Sektor Pertahanan", "Pengawasan & Evaluasi Program"]
  },
  {
    id: 20,
    name: "Penata Tk I III/d Lamsari Intan Margaretha, S.E.,M.M.",
    positionTitle: "Widyaiswara Ahli Muda",
    location: "Wilayah Salemba",
    rankTitle: "Penata Tk. I - III/d (PNS Kemhan)",
    category: "Sipil (PNS)",
    grade: "Muda",
    department: "Departemen Pengelolaan Keuangan & Aset",
    nipNrp: "NIP 198402142008122006",
    phone: "0812-1001-0020",
    email: "lamsari.intan@kemhan.go.id",
    subjects: ["Pengelolaan BMN Berbasis Aplikasi", "Pertanggungjawaban Keuangan Negara", "Pengendalian Internal Pemerintah (SPIP)", "Manajemen Keuangan Pertahanan"]
  },
  {
    id: 21,
    name: "Penata Tk I-III/d Dr. Juwita, S.H., M.H.",
    positionTitle: "Widyaiswara Ahli Muda",
    location: "Wilayah Salemba",
    rankTitle: "Penata Tk. I - III/d (PNS Kemhan)",
    category: "Sipil (PNS)",
    grade: "Muda",
    department: "Departemen Hukum & Regulasi Pertahanan",
    nipNrp: "NIP 198011202005022007",
    phone: "0812-1001-0021",
    email: "juwita.hukum@kemhan.go.id",
    subjects: ["Hukum Administrasi Negara & Disiplin PNS", "Penyusunan Peraturan Perundang-undangan (Legal Drafting)", "Pencegahan Korupsi & Gratifikasi", "Anti Korupsi & Good Governance"]
  },

  // ================= WILAYAH PONDOK LABU (No. 23 - 61 Sesuai Dokumen Resmi BPSDM Han Kemhan) =================
  {
    id: 23,
    name: "Kolonel Cpl Alexander, A.Md.",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Pondok Labu",
    rankTitle: "Kolonel Cpl (TNI AD)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Peralatan & Pemeliharaan Alutsista",
    nipNrp: "NRP 523123",
    phone: "0812-1002-0023",
    email: "alexander.cpl@kemhan.go.id",
    subjects: ["Pemeliharaan & Kesiapan Alutsista", "Manajemen Pergudangan Amunisi", "Logistik Peralatan Militer", "Standar Mutu Peralatan Pertahanan"]
  },
  {
    id: 24,
    name: "Kolonel Sus Juni Kurniawati, S. Sos., M.I.Kom., M. Han",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Pondok Labu",
    rankTitle: "Kolonel Sus (TNI AU)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Komunikasi Publik Pertahanan",
    nipNrp: "NRP 523124",
    phone: "0812-1002-0024",
    email: "juni.kurniawati@kemhan.go.id",
    subjects: ["Manajemen Komunikasi Publik & Media Relations", "Komunikasi Krisis Pertahanan", "Public Speaking Kepemimpinan", "Kepemimpinan Transformatif"]
  },
  {
    id: 25,
    name: "Kolonel Caj A. Sodiq, S.Ag.",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Pondok Labu",
    rankTitle: "Kolonel Caj (TNI AD)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Mental Spiritual & Ideologi",
    nipNrp: "NRP 523125",
    phone: "0812-1002-0025",
    email: "ahmad.sodiq@kemhan.go.id",
    subjects: ["Pembinaan Mental Ideologi & Karakter Prajurit", "Etika Kepemimpinan Berbasis Nilai Moral", "Wawasan Kebangsaan & Moderasi", "Bela Negara dalam Perspektif Sishanneg"]
  },
  {
    id: 26,
    name: "Kolonel Inf Pilon Simanjorang",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Pondok Labu",
    rankTitle: "Kolonel Inf (TNI AD)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Strategi & Operasi Darat",
    nipNrp: "NRP 523126",
    phone: "0812-1002-0026",
    email: "pilon.simanjorang@kemhan.go.id",
    subjects: ["Strategi Pertahanan Matra Darat", "Manajemen Krisis & Kontinjensi", "Kepemimpinan Taktis Lapangan", "Bela Negara dalam Perspektif Sishanneg"]
  },
  {
    id: 27,
    name: "Kolonel Laut (S) Yocke M T, S.T., M.Tr Hanla",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Pondok Labu",
    rankTitle: "Kolonel Laut (S) (TNI AL)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Suplai & Perbekalan Laut",
    nipNrp: "NRP 523127",
    phone: "0812-1002-0027",
    email: "yocke.tondeas@kemhan.go.id",
    subjects: ["Logistik Maritim Terintegrasi", "Pengendalian Anggaran Pertahanan Laut", "Manajemen Kontrak Pertahanan", "Akuntabilitas Kinerja"]
  },
  {
    id: 28,
    name: "Kolonel Inf Agus, S.I.P., M.si.",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Pondok Labu",
    rankTitle: "Kolonel Inf (TNI AD)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Pengkajian Doktrin Kejuangan",
    nipNrp: "NRP 523128",
    phone: "0812-1002-0028",
    email: "agus.inf@kemhan.go.id",
    subjects: ["Sejarah Perjuangan Bangsa & Sishanneg", "Kepemimpinan Nilai-nilai Kejuangan", "Ketahanan Wilayah Pertahanan", "Wawasan Kebangsaan"]
  },
  {
    id: 29,
    name: "Kolonel Kal Hasan Bisri, S.E.",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Pondok Labu",
    rankTitle: "Kolonel Kal (TNI AU)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Pembekalan Udara & Material",
    nipNrp: "NRP 523129",
    phone: "0812-1002-0029",
    email: "hasan.bisri@kemhan.go.id",
    subjects: ["Manajemen Aset Penerbangan & Logistik", "Pengadaan Material Alpalhankam", "Pengawasan Fisik Pergudangan Kemhan", "Manajemen Logistik Pertahanan"]
  },
  {
    id: 30,
    name: "Kolonel Cke Henri Panggabean S.Pd., M.M.",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Pondok Labu",
    rankTitle: "Kolonel Cke (TNI AD)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Komunikasi Taktis & Siber",
    nipNrp: "NRP 523130",
    phone: "0812-1002-0030",
    email: "henri.panggabean@kemhan.go.id",
    subjects: ["Pemanfaatan TI", "Keamanan Jaringan Komunikasi Terpadu", "Manajemen Komunikasi", "Teknik Siber & Sandi"]
  },
  {
    id: 31,
    name: "Kolonel Inf Triono Prijo P., M.Han.",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Pondok Labu",
    rankTitle: "Kolonel Inf (TNI AD)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Kepemimpinan Teritorial",
    nipNrp: "NRP 523131",
    phone: "0812-1002-0031",
    email: "triono.prijo@kemhan.go.id",
    subjects: ["Kepemimpinan Lapangan & Teritorial", "Pemberdayaan Wilayah Pertahanan", "Manajemen Konflik Sosial", "Bela Negara dalam Perspektif Sishanneg"]
  },
  {
    id: 32,
    name: "Kolonel Inf Cok Harwinto",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Pondok Labu",
    rankTitle: "Kolonel Inf (TNI AD)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Pembinaan Jiwa Korsa & Disiplin",
    nipNrp: "NRP 523132",
    phone: "0812-1002-0032",
    email: "cok.harwinto@kemhan.go.id",
    subjects: ["Bela Negara dalam Perspektif Sishanneg", "Kepemimpinan Strategis Pertahanan", "Dinamika Kelompok (DK) / Outbound", "Wawasan Kebangsaan"]
  },
  {
    id: 33,
    name: "Kolonel Inf Sugeng, S.Sos., M.A.P.",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Pondok Labu",
    rankTitle: "Kolonel Inf (TNI AD)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Tata Pamong Administrasi Militer",
    nipNrp: "NRP 523133",
    phone: "0812-1002-0033",
    email: "sugeng.purwiyono@kemhan.go.id",
    subjects: ["Minu TNI & Tata Naskah Dinas Kemhan", "Kepemimpinan Pelayanan Administrasi", "Pengawasan Melekat Sektor Pertahanan", "Etika Pemerintahan & Integritas"]
  },
  {
    id: 34,
    name: "Kolonel Laut (KH/W) Niken S, S.T., M.Tr Hanla., M.M.",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Pondok Labu",
    rankTitle: "Kolonel Laut (KH/W) (TNI AL)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Khusus Hidro-Oseanografi & TI",
    nipNrp: "NRP 523134",
    phone: "0812-1002-0034",
    email: "niken.saraswati@kemhan.go.id",
    subjects: ["Sistem Informasi Geografis (SIG) Pertahanan", "Teknologi Kelautan & Keamanan Pesisir", "Pemanfaatan TI", "Manajemen Proyek Teknologi Pertahanan"]
  },
  {
    id: 35,
    name: "Kolonel Caj M. Abdusy S, M.Han.",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Pondok Labu",
    rankTitle: "Kolonel Caj (TNI AD)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Pembinaan Personel & Karier",
    nipNrp: "NRP 523135",
    phone: "0812-1002-0035",
    email: "abdusy.syukur@kemhan.go.id",
    subjects: ["Manajemen Pola Karier Pertahanan", "Administrasi Personel Terpadu", "Kepemimpinan Beretika", "Etika Profesi ASN"]
  },
  {
    id: 36,
    name: "Kolonel Lek Henri Fahrizal, S.E.",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Pondok Labu",
    rankTitle: "Kolonel Lek (TNI AU)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Radar & Penginderaan Udara",
    nipNrp: "NRP 523136",
    phone: "0812-1002-0036",
    email: "henri.farizal@kemhan.go.id",
    subjects: ["Pemanfaatan TI", "Teknologi Pertahanan", "Manajemen Siber", "Sistem Navigasi & Penginderaan Jauh"]
  },
  {
    id: 37,
    name: "Kolonel Kal Tjandra A, S.E., M.Han",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Pondok Labu",
    rankTitle: "Kolonel Kal (TNI AU)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Manajemen Anggaran & Pengendalian",
    nipNrp: "NRP 523137",
    phone: "0812-1002-0037",
    email: "tjandra.ariwibowo@kemhan.go.id",
    subjects: ["Manajemen Logistik Pertahanan", "Akuntabilitas Kinerja", "Perencanaan Logistik Wilayah", "Pengelolaan Pengadaan Pertahanan"]
  },
  {
    id: 38,
    name: "Kolonel Sus Dr. Abdurrahim, M.Han.",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Pondok Labu",
    rankTitle: "Kolonel Sus (TNI AU)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Manajemen Strategis & Mutu",
    nipNrp: "NRP 523138",
    phone: "0812-1002-0038",
    email: "abdur.rahim@kemhan.go.id",
    subjects: ["Manajemen Strategis", "Akuntabilitas Kinerja", "Wawasan Kebangsaan", "Evaluasi Kinerja Organisasi Pertahanan"]
  },
  {
    id: 39,
    name: "Kolonel Kav Dr. Janpristiwandi, S.Sos., M.Han",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Pondok Labu",
    rankTitle: "Kolonel Kav (TNI AD)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Doktrin Kavaleri & Manuver",
    nipNrp: "NRP 523139",
    phone: "0812-1002-0039",
    email: "janpristiwandi@kemhan.go.id",
    subjects: ["Kepemimpinan Transformatif", "Bela Negara dalam Perspektif Sishanneg", "Manajemen Operasi Tempur & Latihan", "Studi Strategis Kawasan"]
  },
  {
    id: 40,
    name: "Kolonel Inf Suparman, S.Pd., M.I.P",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Pondok Labu",
    rankTitle: "Kolonel Inf (TNI AD)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Kebijakan Strategis Pertahanan",
    nipNrp: "NRP 523140",
    phone: "0812-1002-0040",
    email: "suparman.inf@kemhan.go.id",
    subjects: ["Analisis Kebijakan Pertahanan", "Ketahanan Sosial & Wilayah", "Kepemimpinan Strategis Pertahanan", "Wawasan Kebangsaan"]
  },
  {
    id: 41,
    name: "Kolonel Cke Ade J, S.Sos., M.M",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Pondok Labu",
    rankTitle: "Kolonel Cke (TNI AD)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Komunikasi & Jaringan Pertahanan",
    nipNrp: "NRP 523141",
    phone: "0812-1002-0041",
    email: "ade.jaelani@kemhan.go.id",
    subjects: ["Komunikasi Pertahanan", "Pemanfaatan TI", "Manajemen Operasional", "Pengamanan Informasi Rahasia Negara"]
  },
  {
    id: 42,
    name: "Kolonel Cku (K) Leni H, S.E., M.M.",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Pondok Labu",
    rankTitle: "Kolonel Cku (K) (TNI AD)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Keuangan Angkatan Darat & Kemhan",
    nipNrp: "NRP 523142",
    phone: "0812-1002-0042",
    email: "leni.hendriani@kemhan.go.id",
    subjects: ["Perbendaharaan Militer", "Akuntansi Biaya Pertahanan", "Audit Kepatuhan Anggaran Kemhan", "Manajemen Keuangan Pertahanan"]
  },
  {
    id: 43,
    name: "Kolonel Caj (K) Dr. Muliani, S.Pd., M.Pd.",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Pondok Labu",
    rankTitle: "Kolonel Caj (K) (TNI AD)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Kurikulum Pendidikan Militer",
    nipNrp: "NRP 523143",
    phone: "0812-1002-0043",
    email: "muliani.caj@kemhan.go.id",
    subjects: ["Pengembangan Bahan Ajar & Kurikulum", "Inovasi Pembelajaran Aparatur", "Evaluasi Program Pelatihan", "Manajemen SDM Pertahanan"]
  },
  {
    id: 44,
    name: "Kolonel Laut (T) Erick Hendro",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Pondok Labu",
    rankTitle: "Kolonel Laut (T) (TNI AL)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Teknik Perkapalan & Alutsista Laut",
    nipNrp: "NRP 523144",
    phone: "0812-1002-0044",
    email: "erick.hendro@kemhan.go.id",
    subjects: ["Manajemen Pemeliharaan Kapal Perang (KRI)", "Teknologi Material Pertahanan Laut", "Keselamatan Kerja Bengkel & Fasilitas", "Manajemen Sarana Prasarana"]
  },
  {
    id: 45,
    name: "Letkol Cku Andi Sunra, S.E, Ak.",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Pondok Labu",
    rankTitle: "Letkol Cku (TNI AD)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Akuntansi & Pengawasan Keuangan",
    nipNrp: "NRP 523145",
    phone: "0812-1002-0045",
    email: "andi.sunra@kemhan.go.id",
    subjects: ["Akuntansi Pemerintahan Akrual", "Pemeriksaan Keuangan Intern (APIP)", "Pengelolaan Kas Negara", "Manajemen Keuangan Pertahanan"]
  },
  {
    id: 46,
    name: "Letkol Inf Dedi H, S.E., M.Ak.",
    positionTitle: "Widyaiswara Ahli Madya",
    location: "Wilayah Pondok Labu",
    rankTitle: "Letkol Inf (TNI AD)",
    category: "Militer",
    grade: "Madya",
    department: "Departemen Akuntabilitas Kinerja Satuan",
    nipNrp: "NRP 523146",
    phone: "0812-1002-0046",
    email: "dedi.haryanto@kemhan.go.id",
    subjects: ["Penyusunan Anggaran Berbasis Kinerja", "Analisis Biaya Satuan Pertahanan", "Pengawasan Intern Satker Kemhan", "Akuntabilitas Kinerja"]
  },
  {
    id: 47,
    name: "Letkol Inf Darmaji, S.T., S.H.",
    positionTitle: "Widyaiswara Ahli Muda",
    location: "Wilayah Pondok Labu",
    rankTitle: "Letkol Inf (TNI AD)",
    category: "Militer",
    grade: "Muda",
    department: "Departemen Hukum & Taktik Infanteri",
    nipNrp: "NRP 523147",
    phone: "0812-1002-0047",
    email: "darmaji.inf@kemhan.go.id",
    subjects: ["Hukum Humaniter & HAM dalam Operasi", "Disiplin Prajurit & Hukum Militer", "Kepemimpinan Taktis Lapangan", "Bela Negara dalam Perspektif Sishanneg"]
  },
  {
    id: 48,
    name: "Pembina Tk. IV/b Rochman, S.E., M.M",
    positionTitle: "APN Ahli Muda",
    location: "Wilayah Pondok Labu",
    rankTitle: "Pembina Tk. IV/b (PNS Kemhan)",
    category: "Sipil (PNS)",
    grade: "Muda",
    department: "Departemen Pengadaan Barang/Jasa Pemerintah",
    nipNrp: "NIP 197405101999031008",
    phone: "0812-1002-0048",
    email: "rochman.apn@kemhan.go.id",
    subjects: ["Pengadaan Barang dan Jasa Pemerintah (PBJ)", "Tata Kelola Pengadaan Khusus Alpalhankam", "Manajemen Kontrak Konstruksi & Logistik", "Pengelolaan BMN"]
  },
  {
    id: 49,
    name: "Pembina Tk. IV/b Sapto M., S.H., M.H.",
    positionTitle: "APN Ahli Muda",
    location: "Wilayah Pondok Labu",
    rankTitle: "Pembina Tk. IV/b (PNS Kemhan)",
    category: "Sipil (PNS)",
    grade: "Muda",
    department: "Departemen Regulasi Kontrak & Arbitrase PBJ",
    nipNrp: "NIP 197509122000031009",
    phone: "0812-1002-0049",
    email: "sapto.m@kemhan.go.id",
    subjects: ["Mitigasi Risiko Hukum Pengadaan Barang/Jasa", "Penyusunan Dokumen Pemilihan & Kontrak", "Etika & Anti Fraud dalam PBJ", "Anti Korupsi & Good Governance"]
  },
  {
    id: 50,
    name: "Pembina Tk. IV/a M. Ikhsan, S.H, M.M.",
    positionTitle: "Widyaiswara Ahli Muda",
    location: "Wilayah Pondok Labu",
    rankTitle: "Pembina Tk. IV/a (PNS Kemhan)",
    category: "Sipil (PNS)",
    grade: "Muda",
    department: "Departemen Hukum Administrasi Negara & ASN",
    nipNrp: "NIP 197608242001121010",
    phone: "0812-1002-0050",
    email: "ikhsan.hukum@kemhan.go.id",
    subjects: ["Advokasi Hukum & Sengketa Tata Usaha Negara", "Regulasi Pengelolaan Kepegawaian", "Etika Aparatur Pertahanan", "Penyusunan SOP & Tata Kerja"]
  },
  {
    id: 51,
    name: "Penda TK I III/b Vidia Ulfa Mareta, M.Pd.",
    positionTitle: "Widyaiswara Ahli Pertama",
    location: "Wilayah Pondok Labu",
    rankTitle: "Penda Tk. I - III/b (PNS Kemhan)",
    category: "Sipil (PNS)",
    grade: "Pertama",
    department: "Departemen Bahasa & Komunikasi Internasional",
    nipNrp: "NIP 199303122020122011",
    phone: "0812-1002-0051",
    email: "vidia.ulfa@kemhan.go.id",
    subjects: ["Bahasa Inggris Militer & Diplomasi Pertahanan", "Teknik Penulisan Naskah Akademis", "Komunikasi Antar Budaya Pertahanan", "Metode Pengajaran Bahasa Asing"]
  },
  {
    id: 52,
    name: "Penda TK I III/b Riani Tustia Dewi, M.Pd.",
    positionTitle: "Widyaiswara Ahli Pertama",
    location: "Wilayah Pondok Labu",
    rankTitle: "Penda Tk. I - III/b (PNS Kemhan)",
    category: "Sipil (PNS)",
    grade: "Pertama",
    department: "Departemen Teknologi Pendidikan Terpadu",
    nipNrp: "NIP 199205162020122012",
    phone: "0812-1002-0052",
    email: "riani.tustia@kemhan.go.id",
    subjects: ["Pengembangan Media Pembelajaran Digital", "Pemanfaatan Learning Management System (LMS)", "Microlearning untuk Pelatihan Pertahanan", "Pemanfaatan TI"]
  },
  {
    id: 53,
    name: "Penda TK I III/b Stefanis A, M.Pd.",
    positionTitle: "Widyaiswara Ahli Pertama",
    location: "Wilayah Pondok Labu",
    rankTitle: "Penda Tk. I - III/b (PNS Kemhan)",
    category: "Sipil (PNS)",
    grade: "Pertama",
    department: "Departemen Desain Instruksional & Asesmen",
    nipNrp: "NIP 199401182020122013",
    phone: "0812-1002-0053",
    email: "stefanis.anggelia@kemhan.go.id",
    subjects: ["Penyusunan Instrumen Evaluasi Pembelajaran", "Desain Pengalaman Belajar Interaktif", "Fasilitasi Diskusi Kasus & Roleplay", "Metodologi Pembelajaran Orang Dewasa (Andragogi)"]
  },
  {
    id: 54,
    name: "Penda TK I III/b Hanum Midya Syahrina M.Psi.",
    positionTitle: "Widyaiswara Ahli Pertama",
    location: "Wilayah Pondok Labu",
    rankTitle: "Penda Tk. I - III/b (PNS Kemhan)",
    category: "Sipil (PNS)",
    grade: "Pertama",
    department: "Departemen Psikologi Terapan & Perilaku",
    nipNrp: "NIP 199507202020122014",
    phone: "0812-1002-0054",
    email: "hanum.midya@kemhan.go.id",
    subjects: ["Psikologi Organisasi & Dinamika Kelompok", "Manajemen Stres & Ketahanan Mental Aparatur", "Asesmen Kompetensi Kepribadian", "Dinamika Kelompok (DK) / Outbound"]
  },
  {
    id: 55,
    name: "Penda TK I III/b Hendra Komara, M.Pd.",
    positionTitle: "Widyaiswara Ahli Pertama",
    location: "Wilayah Pondok Labu",
    rankTitle: "Penda Tk. I - III/b (PNS Kemhan)",
    category: "Sipil (PNS)",
    grade: "Pertama",
    department: "Departemen Pembelajaran Blended Learning",
    nipNrp: "NIP 199109042020121015",
    phone: "0812-1002-0055",
    email: "hendra.komara@kemhan.go.id",
    subjects: ["Pengelolaan Kelas Daring & Blended Learning", "Teknik Fasilitasi Pelatihan Jarak Jauh", "Pemanfaatan AI dalam Pembelajaran", "Pemanfaatan TI"]
  },
  {
    id: 56,
    name: "Penda TK I III/b Imtiyaz Fawa’ida, M.Pd.",
    positionTitle: "Widyaiswara Ahli Pertama",
    location: "Wilayah Pondok Labu",
    rankTitle: "Penda Tk. I - III/b (PNS Kemhan)",
    category: "Sipil (PNS)",
    grade: "Pertama",
    department: "Departemen Evaluasi & Pengukuran Hasil Belajar",
    nipNrp: "NIP 199602282020122016",
    phone: "0812-1002-0056",
    email: "imtiyaz.fawaida@kemhan.go.id",
    subjects: ["Pengukuran Efektivitas Diklat (Kirkpatrick Model)", "Penyusunan Rubrik Penilaian Kinerja Peserta", "Analisis Kebutuhan Pelatihan (AKP/TNA)", "Desain Kurikulum & Silabus Pelatihan"]
  },
  {
    id: 57,
    name: "Penda TK I III/b Novinda Parantika, S.Tr.Sn., M.Pd.",
    positionTitle: "Widyaiswara Ahli Pertama",
    location: "Wilayah Pondok Labu",
    rankTitle: "Penda Tk. I - III/b (PNS Kemhan)",
    category: "Sipil (PNS)",
    grade: "Pertama",
    department: "Departemen Media Kreatif & Infografis",
    nipNrp: "NIP 199511102020122017",
    phone: "0812-1002-0057",
    email: "novinda.parantika@kemhan.go.id",
    subjects: ["Desain Komunikasi Visual untuk Materi Diklat", "Pembuatan Modul Interaktif & Infografis", "Branding & Publikasi Lembaga Diklat", "Teknik Presentasi & Fasilitasi"]
  },
  {
    id: 58,
    name: "Penda TK I III/b Aulia Febliana Chaniago M.Pd",
    positionTitle: "Widyaiswara Ahli Pertama",
    location: "Wilayah Pondok Labu",
    rankTitle: "Penda Tk. I - III/b (PNS Kemhan)",
    category: "Sipil (PNS)",
    grade: "Pertama",
    department: "Departemen Tata Kelola Penyelenggaraan Pelatihan",
    nipNrp: "NIP 199408152020122018",
    phone: "0812-1002-0058",
    email: "aulia.febliana@kemhan.go.id",
    subjects: ["Manajemen Mutu Pelatihan Aparatur (ISO 9001)", "Administrasi Akademik Diklat", "Standar Akreditasi Lembaga Pelatihan", "Manajemen Pelayanan Publik"]
  },
  {
    id: 59,
    name: "Penda TK 1 III/b Wela Hasmaida, S.Pd, M.Ed",
    positionTitle: "Widyaiswara Ahli Pertama",
    location: "Wilayah Pondok Labu",
    rankTitle: "Penda Tk. I - III/b (PNS Kemhan)",
    category: "Sipil (PNS)",
    grade: "Pertama",
    department: "Departemen Pendidikan Lanjutan & Inovasi",
    nipNrp: "NIP 199312052020122019",
    phone: "0812-1002-0059",
    email: "wela.hasmaida@kemhan.go.id",
    subjects: ["Komparasi Sistem Diklat Pertahanan Internasional", "Inovasi Metodologi Pengajaran Terapan", "Literasi Akademik & Publikasi Ilmiah", "Metodologi Pembelajaran Orang Dewasa (Andragogi)"]
  },
  {
    id: 60,
    name: "Penda TK I III/b Eko Wahyono Tikno M.Pd.",
    positionTitle: "Widyaiswara Ahli Pertama",
    location: "Wilayah Pondok Labu",
    rankTitle: "Penda Tk. I - III/b (PNS Kemhan)",
    category: "Sipil (PNS)",
    grade: "Pertama",
    department: "Departemen Multimedia & Edukasi Digital",
    nipNrp: "NIP 199208222020121020",
    phone: "0812-1002-0060",
    email: "eko.wahyono@kemhan.go.id",
    subjects: ["Produksi Video Pembelajaran Diklat", "Gamifikasi & Kuis Interaktif Pelatihan", "Pengelolaan Studio Rekaman Badiklat", "Pemanfaatan TI"]
  },
  {
    id: 61,
    name: "Penda TK I III/b Daiatul Istiqomah M.Pd.",
    positionTitle: "Widyaiswara Ahli Pertama",
    location: "Wilayah Pondok Labu",
    rankTitle: "Penda Tk. I - III/b (PNS Kemhan)",
    category: "Sipil (PNS)",
    grade: "Pertama",
    department: "Departemen Etika Profesi & Kepribadian ASN",
    nipNrp: "NIP 199504192020122021",
    phone: "0812-1002-0061",
    email: "daiatul.istiqomah@kemhan.go.id",
    subjects: ["Etika Profesi ASN & Core Values BerAKHLAK", "Pelayanan Publik Inklusif & Ramah Pengguna", "Karakter & Disiplin Aparatur Sipil", "Anti Korupsi & Good Governance"]
  }
];

// Matriks Keterkaitan Mata Kuliah / Pelatihan ke Nama Pengampu
export const SUBJECT_MATRICES: Record<string, string[]> = (() => {
  const map: Record<string, string[]> = {};
  LECTURERS_DATA.forEach(lec => {
    lec.subjects.forEach(subj => {
      if (!map[subj]) map[subj] = [];
      if (!map[subj].includes(lec.name)) map[subj].push(lec.name);
    });
  });
  return map;
})();

// Helper to construct realistic initial preferences with dynamic selectedPrograms for each WI across all 43 programs
function createInitialDefaultPreferences(): Record<number, LecturerPreference> {
  const prefs: Record<number, LecturerPreference> = {};
  const tni = LECTURERS_DATA.filter(l => l.category === 'Militer');
  const sipil = LECTURERS_DATA.filter(l => l.category === 'Sipil (PNS)');
  const pCount = TRAINING_PROGRAMS.length; // 43 programs

  // Militer / TNI (39 Widyaiswara): distribute 2-3 program choices evenly across 43 programs
  tni.forEach((lec, idx) => {
    const isSalemba = lec.location === 'Wilayah Salemba';
    const quota = (idx % 3 === 0 || lec.grade === 'Utama') ? 3 : 2;
    const chosenProgs: TrainingProgram[] = [];

    for (let k = 0; k < quota; k++) {
      const pIdx = (idx * 2 + k * 14 + (isSalemba ? 0 : 5)) % pCount;
      chosenProgs.push(TRAINING_PROGRAMS[pIdx]);
    }

    const selectedPrograms: ProgramSubjectChoice[] = chosenProgs.map((prog, pIdx) => {
      const allSubjs = getProgramSubjects(prog);
      const s1 = allSubjs[pIdx % Math.min(2, allSubjs.length)] || allSubjs[0] || 'Materi Utama Diklat';
      const s2 = allSubjs.length > 1 ? allSubjs[(pIdx + 1) % allSubjs.length] : undefined;
      return {
        programId: prog.id,
        programCode: prog.code,
        programName: prog.name,
        subject1: s1,
        subject2: s2
      };
    });

    prefs[lec.id] = {
      lecturerId: lec.id,
      selectedPrograms,
      primarySubject: selectedPrograms[0]?.subject1 || lec.subjects[0] || 'Kepemimpinan Strategis Pertahanan',
      secondarySubject: selectedPrograms[0]?.subject2 || selectedPrograms[1]?.subject1 || lec.subjects[1] || 'Bela Negara Pertahanan',
      tertiarySubject: lec.subjects[2] || 'Etika Profesi Pertahanan',
      preferredCategory: 'Kepemimpinan',
      preferredPrograms: selectedPrograms.map(sp => sp.programCode || `DIKLAT-${sp.programId}`),
      preferredMethods: ['Klasikal', 'Blended Learning'],
      preferredLocation: isSalemba ? 'Kampus Badiklat Salemba' : 'Kampus Pondok Labu',
      availableQuarters: ['TW I', 'TW II', 'TW III', 'TW IV'],
      readinessStatus: 'Siap Penuh',
      targetQuota: quota,
      notes: `Kesiapan pengampu materi resmi Puspimjemenhan TA 2027 (${lec.location}).`,
      certifications: ['ToT Widyaiswara Badiklat Kemhan', 'Sertifikasi Lemhannas / Sesko'],
      submissionSource: 'Mandiri WI',
      updatedAt: '2027-01-15'
    };
  });

  // Sipil / PNS Kemhan (21 Widyaiswara): distribute 2-3 program choices evenly across 43 programs
  sipil.forEach((lec, idx) => {
    const isSalemba = lec.location === 'Wilayah Salemba';
    const quota = (idx % 2 === 0 || lec.grade === 'Utama') ? 3 : 2;
    const chosenProgs: TrainingProgram[] = [];

    for (let k = 0; k < quota; k++) {
      const pIdx = (idx * 2 + k * 16 + (isSalemba ? 1 : 7)) % pCount;
      chosenProgs.push(TRAINING_PROGRAMS[pIdx]);
    }

    const selectedPrograms: ProgramSubjectChoice[] = chosenProgs.map((prog, pIdx) => {
      const allSubjs = getProgramSubjects(prog);
      const subIdx = Math.min(allSubjs.length - 1, 1 + (pIdx % 2));
      const s1 = allSubjs[subIdx] || allSubjs[0] || 'Materi Manajemen Pertahanan';
      const s2 = allSubjs.length > 2 ? allSubjs[allSubjs.length - 1] : undefined;
      return {
        programId: prog.id,
        programCode: prog.code,
        programName: prog.name,
        subject1: s1,
        subject2: s2
      };
    });

    prefs[lec.id] = {
      lecturerId: lec.id,
      selectedPrograms,
      primarySubject: selectedPrograms[0]?.subject1 || lec.subjects[0] || 'Manajemen Pelayanan Publik Pertahanan',
      secondarySubject: selectedPrograms[0]?.subject2 || selectedPrograms[1]?.subject1 || lec.subjects[1] || 'Tata Kelola & Akuntabilitas ASN',
      tertiarySubject: lec.subjects[2] || 'Etika Profesi ASN & Core Values BerAKHLAK',
      preferredCategory: lec.grade === 'Pertama' ? 'Workshop & TOT' : 'Manajemen',
      preferredPrograms: selectedPrograms.map(sp => sp.programCode || `DIKLAT-${sp.programId}`),
      preferredMethods: ['Klasikal', 'Blended Learning'],
      preferredLocation: isSalemba ? 'Kampus Badiklat Salemba' : 'Kampus Pondok Labu',
      availableQuarters: ['TW I', 'TW II', 'TW III', 'TW IV'],
      readinessStatus: 'Siap Penuh',
      targetQuota: quota,
      notes: `Kesiapan pengampu materi resmi Puspimjemenhan TA 2027 (${lec.location}).`,
      certifications: ['ToT Metodologi Pelatihan BNSP', 'Sertifikasi Pengampu Kompetensi ASN'],
      submissionSource: 'Mandiri WI',
      updatedAt: '2027-01-15'
    };
  });

  return prefs;
}

export const DEFAULT_LECTURER_PREFERENCES: Record<number, LecturerPreference> = createInitialDefaultPreferences();

const STORAGE_KEY_PREFERENCES = 'sim_diklat_lecturer_preferences_v8';

export function getStoredLecturerPreferences(): Record<number, LecturerPreference> {
  if (typeof window === 'undefined') return DEFAULT_LECTURER_PREFERENCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFERENCES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PREFERENCES, JSON.stringify(DEFAULT_LECTURER_PREFERENCES));
      return DEFAULT_LECTURER_PREFERENCES;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_LECTURER_PREFERENCES, ...parsed };
  } catch (e) {
    console.error('Failed to read preferences from storage', e);
    return DEFAULT_LECTURER_PREFERENCES;
  }
}

export function saveLecturerPreference(pref: LecturerPreference): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredLecturerPreferences();
    current[pref.lecturerId] = {
      ...pref,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem(STORAGE_KEY_PREFERENCES, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to write preference to storage', e);
  }
}

export function resetDefaultLecturerPreferences(): Record<number, LecturerPreference> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_PREFERENCES, JSON.stringify(DEFAULT_LECTURER_PREFERENCES));
  }
  return DEFAULT_LECTURER_PREFERENCES;
}
