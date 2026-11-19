export interface WaveSchedule {
  wave: number;
  name: string;
  startDate: string;
  endDate: string;
  displayDate: string;
}

export interface TrainingProgram {
  id: number;
  code: string;
  name: string;
  shortDescription: string;
  category: 'Kepemimpinan' | 'Manajemen' | 'Fungsional' | 'Teknis & Siber' | 'Kesehatan' | 'Workshop & TOT';
  method: 'Klasikal' | 'Blended Learning' | 'Daring (PJJ)';
  durationDays: number;
  durationLabel: string;
  startDate: string; // ISO date for sorting
  endDate: string;
  displayDate: string;
  waves?: WaveSchedule[];
  capacity: number;
  boarding: 'Diasramakan' | 'Tidak Diasramakan' | 'Daring / Online (Zoom)';
  location: string;
  targetParticipants: {
    tni?: string;
    pns?: string;
    pppk?: string;
    rankTni?: string;
    rankPns?: string;
    rankPppk?: string;
    minEducation: string;
    maxAge?: number;
    specialRequirements?: string[];
  };
  objectives: {
    general: string;
    specific: string[];
  };
  competency: string;
  curriculum: {
    basic: string[];
    core: string[];
    supporting: string[];
    others?: string[];
  };
}

export const TRAINING_PROGRAMS: TrainingProgram[] = [
  {
    id: 1,
    code: "DIKLAT-01",
    name: "Pelatihan Berpikir Kreatif dan Inovatif",
    shortDescription: "Pelatihan yang dirancang untuk meningkatkan kemampuan personel Kemhan dan TNI dalam berpikir kreatif, mengidentifikasi permasalahan, menghasilkan gagasan, serta mengembangkan solusi dan perilaku inovatif.",
    category: "Kepemimpinan",
    method: "Klasikal",
    durationDays: 5,
    durationLabel: "5 Hari",
    startDate: "2027-01-18",
    endDate: "2027-01-22",
    displayDate: "18 s.d. 22 Januari 2027",
    capacity: 30,
    boarding: "Tidak Diasramakan",
    location: "Kampus Puspimjemenhan Badiklat Kemhan, Salemba / Pondok Labu",
    targetParticipants: {
      tni: "Mayor s.d. Letkol",
      pns: "Penata III/a s.d. Penata Tk. I III/d",
      rankTni: "Mayor - Letkol",
      rankPns: "III/a - III/d",
      minEducation: "TNI: Diklapa I/Setingkat | PNS: S1",
      maxAge: 55,
      specialRequirements: ["Personel dari lingkungan Kemhan, TNI, Polri dan K/L"]
    },
    objectives: {
      general: "Setelah mengikuti pelatihan ini, peserta mampu menerapkan kreativitas dan inovasi dalam pelaksanaan tugas melalui pengembangan gagasan kreatif menjadi solusi dan perilaku kerja inovatif.",
      specific: [
        "Menerapkan pola pikir kreatif dalam mengidentifikasi permasalahan dan peluang perbaikan.",
        "Menganalisis permasalahan dan peluang perbaikan untuk menentukan kebutuhan solusi yang relevan.",
        "Mengkreasikan berbagai alternatif gagasan sebagai solusi kreatif.",
        "Menyeleksi gagasan kreatif berdasarkan relevansi dan potensi penerapan tugas.",
        "Mengembangkan gagasan terpilih menjadi solusi dan perilaku kerja inovatif."
      ]
    },
    competency: "Peserta mampu memahami dan menerapkan teknik berpikir kreatif dan inovatif untuk mengidentifikasi masalah, menghasilkan ide, serta mengembangkan solusi efektif guna meningkatkan kinerja dan kualitas pelayanan organisasi.",
    curriculum: {
      basic: [
        "01_01 - Membangun Creative Mindset",
        "01_02 - Melihat Masalah Secara Kreatif"
      ],
      core: [
        "01_03 - Menghasilkan Gagasan Kreatif & Inovatif",
        "01_04 - Pengembangan Solusi dan Perilaku Kerja Inovatif",
        "01_05 - Mengubah Ide Menjadi Solusi"
      ],
      supporting: [      ]
    }
  },
  {
    id: 2,
    code: "DIKLAT-02",
    name: "Kursus Singkat Manajemen Pertahanan Negara (Suskatjemen Hanneg) untuk Eksekutif",
    shortDescription: "Penyegaran wawasan dan pengetahuan tentang Wawasan Kebangsaan, Geopolitik dan Ketahanan Nasional, serta Kepemimpinan strategis bagi Pejabat Eselon III/setingkat.",
    category: "Kepemimpinan",
    method: "Klasikal",
    durationDays: 15,
    durationLabel: "3 Gelombang @ 5 Hari",
    startDate: "2027-01-25",
    endDate: "2027-11-19",
    displayDate: "Gel I (25-29 Jan), Gel II (23-27 Agt), Gel III (15-19 Nov 2027)",
    waves: [
      { wave: 1, name: "Tema Wawasan Kebangsaan", startDate: "2027-01-25", endDate: "2027-01-29", displayDate: "25 s.d. 29 Januari 2027" },
      { wave: 2, name: "Tema Geopolitik & Ketahanan Nasional", startDate: "2027-08-23", endDate: "2027-08-27", displayDate: "23 s.d. 27 Agustus 2027" },
      { wave: 3, name: "Tema Kepemimpinan", startDate: "2027-11-15", endDate: "2027-11-19", displayDate: "15 s.d. 19 November 2027" }
    ],
    capacity: 90,
    boarding: "Diasramakan",
    location: "Pusdiklat Badiklat Kemhan RI",
    targetParticipants: {
      tni: "Kolonel / Kombes",
      pns: "Pembina IV/a atau setara",
      rankTni: "Kolonel",
      rankPns: "IV/a ke atas",
      minEducation: "TNI/Polri: Sesko Angkatan/setara | PNS: S2",
      maxAge: 57,
      specialRequirements: ["Pejabat Struktural dan Fungsional level Jabatan Eselon III atau setingkat"]
    },
    objectives: {
      general: "Memberikan penyegaran wawasan kepemimpinan, geopolitik, dan nasionalisme dalam mendukung pembangunan nasional serta membangun daya tangkal pertahanan negara.",
      specific: [
        "Memahami sinergitas pentahelix dan kepemimpinan dalam aksi bela negara.",
        "Menguasai dinamika geopolitik global, regional, maritim dan Indo-Pasifik.",
        "Mewujudkan good governance, reformasi birokrasi, dan kepemimpinan berkarakter."
      ]
    },
    competency: "Peserta memiliki semangat nasionalisme bela negara yang tangguh, kemampuan analisis lingkungan strategis geopolitik, serta kapasitas kepemimpinan transformasional.",
    curriculum: {
      basic: [
        "02_01 - [Tema Wawasan Kebangsaan] Peran Sinergitas Pentahelix dan Kepemimpinan dalam Aksi Nasional Bela Negara",
        "02_02 - [Tema Wawasan Kebangsaan] Peran dan Tanggung Jawab Pemerintah Daerah Perwujudan Wawasan Kebangsaan Perspektif Kesejahteraan Masyarakat",
        "02_03 - [Tema Wawasan Kebangsaan] Optimalisasi Wawasan Kebangsaan Guna Mendukung Pertahanan Negara yang Tangguh",
        "02_04 - [Tema Wawasan Kebangsaan] Pemberdayaan Sumber Daya Manusia Pertahanan Guna Meningkatkan Wawasan Kebangsaan di Lingkungan Kemhan dan TNI",
        "02_05 - [Tema Wawasan Kebangsaan] Perwujudan Kesadaran Wawasan Kebangsaan Guna Mendukung Pertahanan Negara yang Tangguh"
      ],
      core: [
        "02_06 - [Tema Geopolitik & Tannas] Konsep Dasar dan Teori Geopolitik",
        "02_07 - [Tema Geopolitik & Tannas] Geopolitik Indonesia",
        "02_08 - [Tema Geopolitik & Tannas] Dinamika Geopolitik Global dan Regional",
        "02_09 - [Tema Geopolitik & Tannas] Persaingan Kekuatan Besar dan Dinamika Kawasan Indo-Pasifik",
        "02_10 - [Tema Geopolitik & Tannas] Geopolitik Maritim dan Kepentingan Nasional Indonesia",
        "02_11 - [Tema Geopolitik & Tannas] Implikasi Geopolitik terhadap Ketahanan dan Pertahanan Negara"
      ],
      supporting: [
        "02_12 - [Tema Kepemimpinan] Kompetensi Kepemimpinan dan Kepemimpinan yang Berkarakter",
        "02_13 - [Tema Kepemimpinan] Good Governance dan Perkembangan Lingkungan Strategis",
        "02_14 - [Tema Kepemimpinan] Budaya Organisasi dan Tantangan Perubahan",
        "02_15 - [Tema Kepemimpinan] Kepemimpinan dalam Reformasi Birokrasi",
        "02_16 - [Tema Kepemimpinan] Aktualisasi Kapasitas dan Karakter Pemimpin dalam Pelayanan Publik"
      ]
    }
  },
  {
    id: 3,
    code: "DIKLAT-03",
    name: "Pelatihan Komunikasi Efektif",
    shortDescription: "Membekali aparatur kemampuan komunikasi efektif, profesional, etis, asertif, dan kolaboratif guna memperlancar koordinasi dan pengambilan keputusan kedinasan.",
    category: "Manajemen",
    method: "Klasikal",
    durationDays: 5,
    durationLabel: "5 Hari",
    startDate: "2027-01-25",
    endDate: "2027-01-29",
    displayDate: "25 s.d. 29 Januari 2027",
    capacity: 30,
    boarding: "Tidak Diasramakan",
    location: "Kampus Puspimjemenhan Salemba",
    targetParticipants: {
      tni: "Mayor s.d. Letkol",
      pns: "Penata III/a s.d. Penata Tk. I III/d",
      rankTni: "Mayor - Letkol",
      rankPns: "III/a - III/d",
      minEducation: "TNI/Polri: Diklapa I/Setingkat | PNS: S1",
      maxAge: 55,
      specialRequirements: ["Personel dari lingkungan Kemhan, TNI, Polri dan K/L"]
    },
    objectives: {
      general: "Menghasilkan SDM yang kompeten dalam menerapkan komunikasi efektif, profesional, etis, asertif, dan konstruktif dalam pelaksanaan tugas kedinasan.",
      specific: [
        "Menerapkan prinsip pengantar komunikasi efektif dan etika komunikasi organisasi.",
        "Menerapkan keterampilan mendengarkan dan pengelolaan emosi kerja.",
        "Menerapkan teknik komunikasi asertif, kolaboratif, dan terstruktur untuk keputusan."
      ]
    },
    competency: "Mampu menerapkan prinsip dan teknik komunikasi efektif secara jelas, asertif, dan kolaboratif untuk membangun pemahaman, mengelola konflik, dan mendukung keputusan organisasi.",
    curriculum: {
      basic: [
        "03_01 - Pengantar Komunikasi Efektif",
        "03_02 - Etika dan Dinamika Komunikasi Organisasi"
      ],
      core: [
        "03_03 - Keterampilan Mendengarkan dan Membangun Pemahaman",
        "03_04 - Komunikasi Verbal, Nonverbal, dan Pengelolaan Emosi",
        "03_05 - Komunikasi Asertif dan Kolaboratif",
        "03_06 - Komunikasi Terstruktur dan Pengambilan Keputusan"
      ],
      supporting: [
        "03_07 - Komunikasi, Konflik, dan Umpan Balik",
        "03_08 - Simulasi Terpadu dan Rencana Aksi"
      ]
    }
  },
  {
    id: 4,
    code: "DIKLAT-04",
    name: "Pelatihan Basic Neuro Life Support (BNLS) bagi Perawat di Rumah Sakit",
    shortDescription: "Peningkatan kompetensi perawat di lingkungan Kemhan dan TNI dalam pengenalan dini dan penanganan awal kegawatdaruratan neurologis (stroke, cidera kepala, trauma medula spinalis).",
    category: "Kesehatan",
    method: "Klasikal",
    durationDays: 14,
    durationLabel: "14 Hari",
    startDate: "2027-02-01",
    endDate: "2027-02-18",
    displayDate: "1 s.d. 18 Februari 2027",
    capacity: 25,
    boarding: "Diasramakan",
    location: "RSPAD Gatot Soebroto / Fasilitas Kesehatan Kemhan",
    targetParticipants: {
      tni: "Minimal Bintara",
      pns: "Minimal Pengatur II/c",
      pppk: "Minimal Golongan VII",
      rankTni: "Bintara - Pama",
      rankPns: "II/c ke atas",
      rankPppk: "Golongan VII ke atas",
      minEducation: "Minimal D3 Keperawatan",
      maxAge: 50,
      specialRequirements: ["Memiliki STR (Surat Tanda Registrasi) Profesi Perawat yang masih aktif", "Bertugas di unit gawat darurat/rawat inap rumah sakit Kemhan/TNI"]
    },
    objectives: {
      general: "Peserta mampu memberikan tatalaksana kedaruratan neurologi dengan tepat, cepat, dan sesuai SOP medis pertahanan.",
      specific: [
        "Melakukan pengkajian keperawatan neurologi secara komprehensif.",
        "Melakukan tatalaksana kedaruratan pada pasien stroke, cidera kepala, dan trauma medula spinalis.",
        "Mengelola peningkatan tekanan intrakranial, kegawatdaruratan kejang, serta terapi cairan & elektrolit."
      ]
    },
    competency: "Mampu mengenali tanda kegawatdaruratan neurologis secara dini, melakukan stabilisasi awal, dan berkolaborasi dengan tim medis penyelamatan pasien.",
    curriculum: {
      basic: [
        "04_01 - [Bidang Studi Dasar] Etikolegal Keperawatan",
        "04_02 - [Bidang Studi Dasar] Komunikasi Efektif",
        "04_03 - [Bidang Studi Dasar] Review Anatomi dan Fisiologi Sistem Saraf",
        "04_04 - [Bidang Studi Dasar] Pemeriksaan Penunjang pada Kedaruratan Kasus Neurologi"
      ],
      core: [
        "04_05 - [Bidang Studi Inti] Pengkajian Keperawatan Neurologi",
        "04_06 - [Bidang Studi Inti] Tatalaksana Kedaruratan pada Pasien Stroke",
        "04_07 - [Bidang Studi Inti] Tatalaksana Kedaruratan pada Pasien Cidera Kepala",
        "04_08 - [Bidang Studi Inti] Tatalaksana Kedaruratan pada Pasien Trauma Medula Spinalis",
        "04_09 - [Bidang Studi Inti] Tatalaksana Kedaruratan pada Pasien Infeksi Saraf Pusat",
        "04_10 - [Bidang Studi Inti] Tatalaksana Peningkatan Tekanan Intrakranial",
        "04_11 - [Bidang Studi Inti] Tatalaksana Kedaruratan pada Pasien Guillain-Barre Syndrome dan Myasthenia Gravis",
        "04_12 - [Bidang Studi Inti] Tatalaksana Kedaruratan pada Pasien Kejang",
        "04_13 - [Bidang Studi Inti] Terapi Cairan dan Elektrolit pada Kedaruratan Neurologi"
      ],
      supporting: [
        "04_14 - [Bidang Studi Pendukung] Building Learning Commitment",
        "04_15 - [Bidang Studi Pendukung] Anti Korupsi",
        "04_16 - [Bidang Studi Pendukung] Evaluasi dan Rencana Tindak Lanjut"
      ]
    }
  },
  {
    id: 5,
    code: "DIKLAT-05",
    name: "Pelatihan Jarak Jauh Manajemen Agile Change Management",
    shortDescription: "Pelatihan daring interaktif untuk mengelola perubahan organisasi pertahanan secara adaptif, responsif, dan kolaboratif menggunakan prinsip Agile.",
    category: "Manajemen",
    method: "Daring (PJJ)",
    durationDays: 4,
    durationLabel: "4 Hari",
    startDate: "2027-02-01",
    endDate: "2027-02-04",
    displayDate: "1 s.d. 4 Februari 2027",
    capacity: 100,
    boarding: "Daring / Online (Zoom)",
    location: "Virtual Learning Environment / Zoom Puspimjemenhan",
    targetParticipants: {
      tni: "Serda s.d. Mayor",
      pns: "Pengatur Muda II/a s.d. Penata Tk. I III/d",
      pppk: "Golongan VI s.d. X",
      rankTni: "Serda - Mayor",
      rankPns: "II/a - III/d",
      rankPppk: "VI - X",
      minEducation: "SLTA / D3 / S1",
      maxAge: 55,
      specialRequirements: ["Memiliki akses laptop/kamera dan jaringan internet stabil untuk kelas Zoom"]
    },
    objectives: {
      general: "Peserta mampu memahami dan mengimplementasikan metode Agile Change Management dalam mengelola dinamika perubahan di unit kerja.",
      specific: [
        "Menjelaskan konsep dasar dan urgensi Agile Change Management di era disrupsi.",
        "Menguasai model, framework, serta tools praktis Agile dalam perubahan.",
        "Mengelola resistensi pegawai terhadap inovasi dan perubahan kebijakan organisasi."
      ]
    },
    competency: "Mampu beradaptasi terhadap perubahan secara cepat dan efektif di lingkungan tugas Kemhan/TNI guna mencapai target kinerja modern.",
    curriculum: {
      basic: [
        "05_01 - Konsep Dasar Agile Change Management"
      ],
      core: [
        "05_02 - Prinsip-Prinsip, Model dan Framework Agile Change Management",
        "05_03 - Tools & Praktik Agile untuk Mengelola Perubahan",
        "05_04 - Pengelolaan Resistensi terhadap Perubahan"
      ],
      supporting: [
        "05_05 - Studi Kasus dan Tren Masa Depan dalam Agile Change Management"
      ]
    }
  },
  {
    id: 6,
    code: "DIKLAT-06",
    name: "Kursus Singkat Manajemen Kepegawaian",
    shortDescription: "Pembekalan personel pengelola kepegawaian tentang regulasi ASN, pembinaan karier PNS/TNI, SIMPEG, penyusunan SKP, dan Assessment Center.",
    category: "Manajemen",
    method: "Klasikal",
    durationDays: 10,
    durationLabel: "10 Hari",
    startDate: "2027-02-08",
    endDate: "2027-02-19",
    displayDate: "8 s.d. 19 Februari 2027",
    capacity: 30,
    boarding: "Tidak Diasramakan",
    location: "Puspimjemenhan Salemba Jakarta",
    targetParticipants: {
      tni: "Kapten s.d. Mayor",
      pns: "Penata Muda Tk. I III/b s.d. Penata III/c",
      rankTni: "Kapten - Mayor",
      rankPns: "III/b - III/c",
      minEducation: "TNI: Diklapa I | PNS: S1",
      maxAge: 53,
      specialRequirements: ["Diutamakan personel yang membidangi urusan kepegawaian/pers di Kemhan dan TNI"]
    },
    objectives: {
      general: "Peserta mampu memahami dan menerapkan manajemen kepegawaian berbasis kompetensi secara efektif dan profesional.",
      specific: [
        "Menguasai regulasi kepegawaian ASN dan pembinaan personel Kemhan/TNI.",
        "Mengoperasikan SIMPEG dan menyusun Sasaran Kinerja Pegawai (SKP) sesuai PermenPAN-RB terbaru.",
        "Memahami dasar-dasar teknik observasi Assessor SDM Aparatur."
      ]
    },
    competency: "Mampu menyusun SKP, mengelola administrasi pembinaan karier pegawai, dan mengoperasikan sistem informasi kepegawaian secara akuntabel.",
    curriculum: {
      basic: [
        "06_01 - [Bidang Studi Dasar] Kebijakan Manajemen ASN",
        "06_02 - [Bidang Studi Dasar] Kebijakan Pembinaan Karier PNS dalam Jabatan Assessor SDM Aparatur",
        "06_03 - [Bidang Studi Dasar] Kode Etik PNS dan Kode Etik Assessor SDM Aparatur",
        "06_04 - [Bidang Studi Dasar] Manajemen SDM Berbasis Kompetensi",
        "06_05 - [Bidang Studi Dasar] Organisasi Pemerintah Pusat dan Daerah"
      ],
      core: [
        "06_06 - [Bidang Studi Inti] Pengantar Assessment Center dan Psikologi",
        "06_07 - [Bidang Studi Inti] Keterampilan Assessor Dasar Teknik Observasi",
        "06_08 - [Bidang Studi Inti] Review Kompetensi",
        "06_09 - [Bidang Studi Inti] Administrasi dan Skoring Simulasi LGD (Leaderless Group Discussion), Presentasi, Case Analysis",
        "06_10 - [Bidang Studi Inti] Wawancara Kompetensi",
        "06_11 - [Bidang Studi Inti] Integrasi Data Assessment",
        "06_12 - [Bidang Studi Inti] Penulisan Laporan",
        "06_13 - [Bidang Studi Inti] Feedback Assessment",
        "06_14 - [Bidang Studi Inti] Evaluasi Kegiatan Assessment",
        "06_15 - [Bidang Studi Inti] Rancangan dan Administrasi Assessment Center"
      ],
      supporting: [
        "06_16 - [Bidang Studi Inti] Ujian/Tes Tulis",
        "06_17 - [Bidang Studi Inti] Persiapan Pemagangan",
        "06_18 - [Bidang Studi Inti] Pemagangan",
        "06_19 - [Bidang Studi Inti] Uji Kompetensi",
        "06_20 - [Bidang Studi Inti] Pengembangan Karier Jabatan Fungsional Assessor SDM Aparatur",
        "06_21 - [Bidang Studi Inti] Tim Penilaian",
        "06_22 - [Bidang Studi Inti] Karya Tulis Ilmiah"
      ]
    }
  },
  {
    id: 7,
    code: "DIKLAT-07",
    name: "Workshop Persamaan Persepsi Pelatihan Kepemimpinan Pengawas (PKP)",
    shortDescription: "Workshop penyamaan persepsi kurikulum, metode pembelajaran, dan strategi delivery bagi para Widyaiswara dan fasilitator PKP.",
    category: "Workshop & TOT",
    method: "Klasikal",
    durationDays: 10,
    durationLabel: "10 Hari",
    startDate: "2027-02-08",
    endDate: "2027-02-19",
    displayDate: "8 s.d. 19 Februari 2027",
    capacity: 30,
    boarding: "Tidak Diasramakan",
    location: "Kampus Puspimjemenhan Salemba",
    targetParticipants: {
      tni: "Mayor s.d. Kolonel",
      pns: "Penata III/c s.d. Pembina Utama Muda IV/c",
      rankTni: "Mayor - Kolonel",
      rankPns: "III/c - IV/c",
      minEducation: "TNI: Diklapa II/Setingkat | PNS: S1 / Alumni PKP",
      maxAge: 56,
      specialRequirements: ["Tenaga pengajar / fasilitator yang diproyeksikan mengampu diklat PKP"]
    },
    objectives: {
      general: "Menyamakan pemahaman mengenai kurikulum, metode, evaluasi, dan mekanisme PKP agar tercipta standar pengajaran berkualitas seragam.",
      specific: [
        "Memahami kurikulum Agenda I, II, dan III PKP.",
        "Menguasai teknik coaching dan mentoring pada aktualisasi aksi perubahan pelayanan publik.",
        "Menyusun Rancang Bangun Pembelajaran Mata Pelatihan (RBPMP) dan skenario workshop."
      ]
    },
    competency: "Mampu memfasilitasi dan mengajar pada Pelatihan Kepemimpinan Pengawas (PKP) sesuai standar kurikulum LAN RI dan Kemhan.",
    curriculum: {
      basic: [
        "07_01 - Pembelajaran Agenda I, II, dan III",
        "07_02 - Ceramah Kebijakan PKP"
      ],
      core: [
        "07_03 - Manajemen Penyelenggaraan PKP, Manajemen Workshop, dan Manajemen LMS",
        "07_04 - Aktualisasi Kepemimpinan Pelayanan Coaching dan Mentoring",
        "07_05 - Penyusunan Produk Pembelajaran Workshop"
      ],
      supporting: [
        "07_06 - Evaluasi"
      ]
    }
  },
  {
    id: 8,
    code: "DIKLAT-08",
    name: "Pelatihan Fungsional Penguatan Widyaiswara",
    shortDescription: "Penguatan kompetensi pedagogik, andragogi, perancangan kurikulum, dan penyusunan bahan ajar inovatif bagi pejabat Fungsional Widyaiswara.",
    category: "Fungsional",
    method: "Klasikal",
    durationDays: 26,
    durationLabel: "1 Bulan",
    startDate: "2027-02-08",
    endDate: "2027-03-05",
    displayDate: "8 Februari s.d. 5 Maret 2027",
    capacity: 30,
    boarding: "Diasramakan",
    location: "Pusdiklat Badiklat Kemhan RI",
    targetParticipants: {
      pns: "Minimal Penata Muda Tingkat I, Golongan III/b",
      rankPns: "III/b ke atas",
      minEducation: "Minimal Pascasarjana (S2) dari perguruan tinggi terakreditasi",
      maxAge: 50,
      specialRequirements: [
        "Pengalaman di bidang Dikjartih minimal 2 tahun",
        "Lulus Diklat Pembentukan Calon Widyaiswara",
        "Tersedia formasi Jabatan Fungsional WI di Satker"
      ]
    },
    objectives: {
      general: "Meningkatkan kompetensi dan profesionalisme Widyaiswara dalam merancang, melaksanakan, dan mengevaluasi pembelajaran aparatur pertahanan.",
      specific: [
        "Menyusun GBPP/RBPMP dan SAP/RP berbasis teknologi interaktif.",
        "Menerapkan strategi pembelajaran orang dewasa (andragogi) dan media digital.",
        "Menguasai tata cara penilaian angka kredit Widyaiswara dan DUPAK."
      ]
    },
    competency: "Mampu merencanakan, melaksanakan praktik mengajar (micro-teaching), dan mengevaluasi transfer of learning dengan standar mutu tinggi.",
    curriculum: {
      basic: [
        "08_01 - [Bidang Studi Dasar] Pengetahuan Bela Negara",
        "08_02 - [Bidang Studi Dasar] Tata Kelola Kepemerintahan yang Baik / Good Governance"
      ],
      core: [
        "08_03 - [Bidang Studi Inti] Kebijakan Pembinaan Widyaiswara dan Angka Kreditnya",
        "08_04 - [Bidang Studi Inti] Standar Kompetensi dan Sertifikasi Widyaiswara",
        "08_05 - [Bidang Studi Inti] Rancang Bangun Pembelajaran Mata Diklat dan Rencana Pembelajaran",
        "08_06 - [Bidang Studi Inti] Komunikasi dalam Pembelajaran",
        "08_07 - [Bidang Studi Inti] Pembelajaran Orang Dewasa",
        "08_08 - [Bidang Studi Inti] Metode Pembelajaran",
        "08_09 - [Bidang Studi Inti] Penyusunan Media Pembelajaran",
        "08_10 - [Bidang Studi Inti] Manajemen Kelas",
        "08_11 - [Bidang Studi Inti] Evaluasi Pembelajaran dan Tindak Lanjut (Transfer of Learning)",
        "08_12 - [Bidang Studi Inti] Praktik Mengajar"
      ],
      supporting: [
        "08_13 - [Bidang Studi Pendukung] Pengarahan Program, Penjelasan Tata Tertib & Pengarahan Pimpinan",
        "08_14 - [Bidang Studi Pendukung] Tata Cara Penilaian Daftar Usulan Penetapan Angka Kredit (DUPAK)",
        "08_15 - [Bidang Studi Pendukung] Dinamika Kelompok & Kebugaran Jasmani",
        "08_16 - [Lain-Lain] Pemeriksaan Administrasi & Evaluasi Penyelenggaraan"
      ]
    }
  },
  {
    id: 9,
    code: "DIKLAT-09",
    name: "Kursus Manajemen Perencanaan dan Penganggaran Pertahanan (Susjemen Rengar Han)",
    shortDescription: "Pelatihan komprehensif bagi perencana program dan anggaran satuan kerja Kemhan/TNI (SPP Hanneg, Renstra, Renja, RKA-KL, DIPA, dan SAKIP).",
    category: "Manajemen",
    method: "Klasikal",
    durationDays: 90,
    durationLabel: "3 Bulan (2 Gelombang)",
    startDate: "2027-02-15",
    endDate: "2027-09-23",
    displayDate: "Gel I: 15 Feb-25 Mei 2027 | Gel II: 1 Jul-23 Sep 2027",
    waves: [
      { wave: 1, name: "Gelombang I", startDate: "2027-02-15", endDate: "2027-05-25", displayDate: "15 Februari s.d. 25 Mei 2027" },
      { wave: 2, name: "Gelombang II", startDate: "2027-07-01", endDate: "2027-09-23", displayDate: "1 Juli s.d. 23 September 2027" }
    ],
    capacity: 30,
    boarding: "Diasramakan",
    location: "Pusdiklat Badiklat Kemhan Pondok Labu",
    targetParticipants: {
      tni: "Mayor s.d. Letkol",
      pns: "Penata III/c s.d. Penata Tk. I III/d",
      rankTni: "Mayor - Letkol",
      rankPns: "III/c - III/d",
      minEducation: "TNI: Diklapa II/Setingkat | PNS: S1/PKP",
      maxAge: 55,
      specialRequirements: ["Sedang atau dipersiapkan menduduki jabatan perencana program & anggaran"]
    },
    objectives: {
      general: "Meningkatkan kemampuan aparatur dalam menyusun, mengendalikan, dan mengevaluasi dokumen perencanaan program dan anggaran satker Kemhan dan TNI.",
      specific: [
        "Memahami sistem perencanaan pembangunan pertahanan (SPP Hanneg).",
        "Menyusun Rencana Kebutuhan, Renstra, Renja, dan RKA-KL/DIPA.",
        "Melakukan pengendalian anggaran, E-Monev, serta penyusunan LKjIP dan SAKIP."
      ]
    },
    competency: "Mampu menyusun dan menelaah dokumen perencanaan program serta anggaran satuan kerja pertahanan secara akuntabel dan transparan.",
    curriculum: {
      basic: [
        "09_01 - [Bidang Studi Dasar] Pengetahuan Bela Negara",
        "09_02 - [Bidang Studi Dasar] Kebijakan Umum Pertahanan Negara",
        "09_03 - [Bidang Studi Dasar] Manajemen Perencanaan Strategis Sektor Publik",
        "09_04 - [Bidang Studi Dasar] Good Governance"
      ],
      core: [
        "09_05 - [SBS Sistem Perencanaan Pembangunan] Sistem Perencanaan Pembangunan Pertahanan Negara (SPP Hanneg)",
        "09_06 - [SBS Sistem Perencanaan Pembangunan] Pengelolaan Program dan Anggaran (PPA)",
        "09_07 - [SBS Sistem Perencanaan Pembangunan] Perencanaan dan Anggaran melalui Sumber Pinjaman (PLN, PDN dan SBSN)",
        "09_08 - [SBS Sistem Perencanaan Pembangunan] Sistem Akuntabilitas Kinerja Instansi Pemerintah (SAKIP)",
        "09_09 - [SBS Sistem Perencanaan Pembangunan] Sistem Pembinaan Keuangan Sektor Pertahanan",
        "09_10 - [SBS Perencanaan & Pelaksanaan] Pengantar Manajemen Perencanaan dan Anggaran",
        "09_11 - [SBS Perencanaan & Pelaksanaan] Indikator Kinerja",
        "09_12 - [SBS Perencanaan & Pelaksanaan] Penyusunan Rencana Kebutuhan",
        "09_13 - [SBS Perencanaan & Pelaksanaan] Penyusunan Rencana Strategis (Renstra)",
        "09_14 - [SBS Perencanaan & Pelaksanaan] Penyusunan Rencana Kerja (Renja)",
        "09_15 - [SBS Perencanaan & Pelaksanaan] Penyusunan Rencana Kerja Anggaran/Kementerian Lembaga (RKA/KL) dan Daftar Isian Pelaksanaan Anggaran (DIPA)",
        "09_16 - [SBS Perencanaan & Pelaksanaan] Penyusunan Perjanjian Kinerja",
        "09_17 - [SBS Perencanaan & Pelaksanaan] Penyusunan Program Kerja Satker/Sub Satker",
        "09_18 - [SBS Perencanaan & Pelaksanaan] Penerimaan Negara Bukan Pajak (PNBP) Yanmasum",
        "09_19 - [SBS Pengendalian & Evaluasi] Pengendalian Anggaran",
        "09_20 - [SBS Pengendalian & Evaluasi] E-Monev Pelaksanaan Rencana Pembangunan",
        "09_21 - [SBS Pengendalian & Evaluasi] Analisis dan Evaluasi Pelaksanaan Program dan Anggaran",
        "09_22 - [SBS Pengendalian & Evaluasi] Laporan Realisasi Anggaran",
        "09_23 - [SBS Pengendalian & Evaluasi] Laporan Kinerja Instansi Pemerintah (LKjIP)",
        "09_24 - [SBS Pengendalian & Evaluasi] Evaluasi Akuntabilitas Kinerja Instansi Pemerintah (AKIP)",
        "09_25 - [SBS Pengendalian & Evaluasi] Evaluasi Rencana Kerja (Renja) dan Evaluasi Rencana Strategis (Renstra)",
        "09_26 - [SBS Pengendalian & Evaluasi] Reviu dan Evaluasi Kinerja"
      ],
      supporting: [
        "09_27 - [SBS Aplikasi] Latihan Praktik Penyusunan Perencanaan Program dan Anggaran Pertahanan Negara",
        "09_28 - [SBS Aplikasi] Karya Tulis Ilmiah/Esai & Kunjungan Kerja",
        "09_29 - [Bidang Studi Pendukung] Perbendaharaan Keuangan Negara, Moneter dan Perbankan",
        "09_30 - [Bidang Studi Pendukung] Aplikasi Komputer (Microsoft Office) & Teknik Pengambilan Keputusan",
        "09_31 - [Bidang Studi Pendukung] Standar Audit APIP & Tuntutan Perbendaharaan dan Tuntutan Ganti Rugi (TP/TGR)",
        "09_32 - [Bidang Studi Pendukung] Ceramah (SPPN, Waslakat, Kebijakan Perencanaan TNI/Pertahanan, Manajemen ASN)"
      ]
    }
  },
  {
    id: 10,
    code: "DIKLAT-10",
    name: "Kursus Manajemen Penelitian dan Pengembangan Pertahanan (Susjemen Litbang Han) Tingkat Muda",
    shortDescription: "Membekali kandidat peneliti pertahanan mengenai metodologi riset, statistika, ORSA, etika ilmiah, dan manajemen kerja sama industri pertahanan.",
    category: "Manajemen",
    method: "Blended Learning",
    durationDays: 90,
    durationLabel: "3 Bulan (2 Gelombang)",
    startDate: "2027-02-15",
    endDate: "2027-09-23",
    displayDate: "Gel I: 15 Feb-25 Mei 2027 | Gel II: 1 Jul-23 Sep 2027",
    waves: [
      { wave: 1, name: "Gelombang I", startDate: "2027-02-15", endDate: "2027-05-25", displayDate: "15 Februari s.d. 25 Mei 2027" },
      { wave: 2, name: "Gelombang II", startDate: "2027-07-01", endDate: "2027-09-23", displayDate: "1 Juli s.d. 23 September 2027" }
    ],
    capacity: 60,
    boarding: "Diasramakan",
    location: "Puspimjemenhan & Balitbang Kemhan RI",
    targetParticipants: {
      tni: "Mayor s.d. Letkol",
      pns: "Penata III/c s.d. Penata Tk. I III/d",
      rankTni: "Mayor - Letkol",
      rankPns: "III/c - III/d",
      minEducation: "TNI: Diklapa II | PNS: S1",
      maxAge: 55,
      specialRequirements: ["Diarahkan berdinas di litbang TNI/Kemhan, diutamakan lulusan Litbang Pertama"]
    },
    objectives: {
      general: "Peserta mampu memahami dan menerapkan prinsip manajemen penelitian dan pengembangan pertahanan mulai dari proposal hingga alih teknologi.",
      specific: [
        "Menyusun proposal, desain eksperimen, dan instrumen pengumpulan data riset pertahanan.",
        "Mengolah data kuantitatif menggunakan statistika dan Operations Research System Analysis (ORSA).",
        "Menyusun laporan hasil litbang dan mempresentasikan dalam forum ilmiah."
      ]
    },
    competency: "Mampu merancang dan memimpin riset ilmiah pertahanan sesuai kaidah dan etika keilmuan mutakhir.",
    curriculum: {
      basic: [
        "10_01 - [Bidang Studi Dasar] Pengetahuan Bela Negara & Kebijakan Pertahanan Negara",
        "10_02 - [Bidang Studi Dasar] Sistem Nasional Ilmu Pengetahuan dan Teknologi & Kelembagaan Litbang Kemhan/TNI"
      ],
      core: [
        "10_03 - [SBS Pengetahuan & Etika Penelitian] Manajemen Penelitian",
        "10_04 - [SBS Pengetahuan & Etika Penelitian] Etika Keilmuan dan Penelitian",
        "10_05 - [SBS Pengetahuan & Etika Penelitian] Penelusuran Informasi Ilmiah",
        "10_06 - [SBS Penelitian] Metodologi Penelitian",
        "10_07 - [SBS Penelitian] Penyusunan Proposal dan Usulan Penelitian",
        "10_08 - [SBS Penelitian] Rancangan Penelitian",
        "10_09 - [SBS Penelitian] Sumber dan Koleksi Data",
        "10_10 - [SBS Penelitian] Penyusunan Instrumen Penelitian",
        "10_11 - [SBS Penelitian] Teknik dan Praktik Pengumpulan Data Lapangan",
        "10_12 - [SBS Penelitian] Pengolahan dan Analisis Data",
        "10_13 - [SBS Penelitian] Teknik Penulisan dan Penyusunan Laporan Penelitian",
        "10_14 - [SBS Perangkat Analisis] Statistik Penelitian",
        "10_15 - [SBS Perangkat Analisis] Probability Litbang",
        "10_16 - [SBS Perangkat Analisis] Operations Research System Analysis (ORSA)",
        "10_17 - [SBS Perangkat Analisis] Analisis Pengambilan Keputusan",
        "10_18 - [SBS Pembinaan & Wawasan Litbang] Pembinaan Litbang Materiil dan Nonmateriil",
        "10_19 - [SBS Pembinaan & Wawasan Litbang] Prosedur dan Mekanisme Kerja Sama Penelitian, Pengkajian dan Pengembangan (Litjianbang)",
        "10_20 - [SBS Pembinaan & Wawasan Litbang] Teknologi dan Industri Pertahanan"
      ],
      supporting: [
        "10_21 - [SBS Pembinaan & Wawasan Litbang] Ceramah (Daya Saing IPTEK, Industri Strategis, Integritas Peneliti)",
        "10_22 - [SBS Aplikasi] Tugas Akhir, Seminar Penelitian & Kunjungan Kerja",
        "10_23 - [Bidang Studi Pendukung] Manajemen Mutu, Hak Kekayaan Intelektual (HKI), Aplikasi Komputer & Teknik Presentasi"
      ]
    }
  },
  {
    id: 11,
    code: "DIKLAT-11",
    name: "Kursus Kepemimpinan dan Manajemen Tingkat II",
    shortDescription: "Pengembangan kapasitas kepemimpinan manajerial aparatur untuk penyiapan bahan rumusan kebijakan dan kesiapan menduduki jabatan Eselon IV/setingkat.",
    category: "Kepemimpinan",
    method: "Blended Learning",
    durationDays: 90,
    durationLabel: "3 Bulan (2 Gelombang)",
    startDate: "2027-02-15",
    endDate: "2027-09-23",
    displayDate: "Gel I: 15 Feb-25 Mei 2027 | Gel II: 1 Jul-23 Sep 2027",
    waves: [
      { wave: 1, name: "Gelombang I", startDate: "2027-02-15", endDate: "2027-05-25", displayDate: "15 Februari s.d. 25 Mei 2027" },
      { wave: 2, name: "Gelombang II", startDate: "2027-07-01", endDate: "2027-09-23", displayDate: "1 Juli s.d. 23 September 2027" }
    ],
    capacity: 60,
    boarding: "Diasramakan",
    location: "Pusdiklat Badiklat Kemhan",
    targetParticipants: {
      tni: "Kapten s.d. Mayor",
      pns: "Penata Muda Tk. I III/b s.d. Penata III/c",
      rankTni: "Kapten - Mayor",
      rankPns: "III/b - III/c",
      minEducation: "TNI: Selapa I/Setingkat | PNS: S1",
      maxAge: 45,
      specialRequirements: ["Potensial untuk menduduki jabatan Eselon IV/setingkat di Kemhan/TNI"]
    },
    objectives: {
      general: "Membekali kompetensi manajerial dalam merumuskan bahan kebijakan sumber daya pertahanan dan memimpin tim kerja yang produktif.",
      specific: [
        "Menerapkan pola kepemimpinan Pancasila, inovasi, dan etika kerja.",
        "Menguasai wawasan manajemen kebijakan publik, manajemen perubahan, dan konflik.",
        "Memahami fungsi pertahanan, anggaran, tata naskah, dan pengawasan internal."
      ]
    },
    competency: "Mampu memimpin tim kerja bawahan, menyusun telaahan staf pimpinan, dan mengelola sumber daya satker secara optimal.",
    curriculum: {
      basic: [
        "11_01 - [Bidang Studi Dasar] Ketahanan Nasional, Bela Negara, Wawasan Kebangsaan & Kebijakan Penyelenggaraan Hanneg"
      ],
      core: [
        "11_02 - [SBS Kepemimpinan] Pengantar Kepemimpinan, Karakter dan Kompetensi Pemimpin",
        "11_03 - [SBS Kepemimpinan] Membangun Tim Efektif & Kepemimpinan dan Membangun Budaya Inovasi",
        "11_04 - [SBS Kepemimpinan] Etika dan Integritas Kepemimpinan Pancasila & Kepemimpinan Berwawasan Bela Negara",
        "11_05 - [SBS Wawasan Manajemen] Pengantar Manajemen, Pengantar Organisasi & Pengantar Manajemen Kebijakan Publik",
        "11_06 - [SBS Wawasan Manajemen] Manajemen Perubahan & Manajemen Konflik",
        "11_07 - [SBS Pengembangan Manajerial] Teknik Koordinasi, Teknik Komunikasi dan Human Relations",
        "11_08 - [SBS Pengembangan Manajerial] Teknik Presentasi, Teknik Penulisan Laporan & Inovasi Kreativitas Organisasi",
        "11_09 - [SBS Analisis Kuantitatif] Dasar-Dasar Penalaran, Network Planning, Teknik Analisis Manajemen & Pengambilan Keputusan",
        "11_10 - [SBS Reformasi Birokrasi] Budaya Kerja Produktif, Good Governance, Pengetahuan Reformasi Birokrasi",
        "11_11 - [SBS Reformasi Birokrasi] Operasional Pelayanan Prima & Teknologi Informasi Komunikasi dalam Pelayanan",
        "11_12 - [SBS Manajemen Sumber Daya Han] Manajemen Wilayah Pertahanan, Teknologi dan Industri Pertahanan",
        "11_13 - [SBS Manajemen Sumber Daya Han] Manajemen SDM Pertahanan & Manajemen Materiil, Fasilitas dan Jasa Pertahanan",
        "11_14 - [SBS Manajemen Fungsi Han] OTK Kemhan/TNI, SPP Hanneg & PPA Hanneg",
        "11_15 - [SBS Manajemen Fungsi Han] Pembinaan Kepegawaian, Pembinaan Keuangan & Administrasi Umum Kemhan/TNI",
        "11_16 - [SBS Manajemen Fungsi Han] Prosedur Pengadaan Barang/Jasa, Penatausahaan BMN & Sistem Pengawasan Pemeriksaan"
      ],
      supporting: [
        "11_17 - [Studi Pendukung] Hukum Humaniter dan HAM, Keamanan Siber, Pengetahuan Tipikor & Pengenalan AI"
      ]
    }
  },
  {
    id: 12,
    code: "DIKLAT-12",
    name: "Workshop Persamaan Persepsi Pelatihan Kepemimpinan Administrator (PKA)",
    shortDescription: "Workshop penyelarasan substansi kurikulum, modul manajemen kinerja, dan evaluasi bagi Widyaiswara dan fasilitator PKA.",
    category: "Workshop & TOT",
    method: "Klasikal",
    durationDays: 10,
    durationLabel: "10 Hari",
    startDate: "2027-02-22",
    endDate: "2027-03-05",
    displayDate: "22 Februari s.d. 5 Maret 2027",
    capacity: 30,
    boarding: "Tidak Diasramakan",
    location: "Puspimjemenhan Salemba",
    targetParticipants: {
      tni: "Mayor s.d. Kolonel",
      pns: "Penata III/c s.d. Pembina Utama Muda IV/c",
      rankTni: "Mayor - Kolonel",
      rankPns: "III/c - IV/c",
      minEducation: "TNI: Diklapa III | PNS: S2/Alumni PKA",
      maxAge: 56,
      specialRequirements: ["Pejabat Struktural min administrator/JF Ahli Madya yang sudah lulus PKA"]
    },
    objectives: {
      general: "Menyamakan pemahaman mengenai kurikulum, metode, serta mekanisme PKA agar pelatihan administrator menghasilkan inovasi kepemimpinan prima.",
      specific: [
        "Membedah Agenda I, II, dan III PKA.",
        "Mengembangkan format pembimbingan aksi perubahan kinerja organisasi.",
        "Menstandarisasi evaluasi akademik dan sosiometri peserta."
      ]
    },
    competency: "Mampu menjadi pengajar/fasilitator PKA yang kompeten dalam mentransfer ilmu manajemen kepemimpinan administrator.",
    curriculum: {
      basic: [
        "12_01 - Pembelajaran Agenda I, II, dan III",
        "12_02 - Ceramah Kebijakan PKA"
      ],
      core: [
        "12_03 - Manajemen Penyelenggaraan PKA, Manajemen Workshop, dan Manajemen LMS",
        "12_04 - Aktualisasi Kepemimpinan Pelayanan Coaching dan Mentoring",
        "12_05 - Penyusunan Produk Pembelajaran Workshop"
      ],
      supporting: [
        "12_06 - Evaluasi"
      ]
    }
  },
  {
    id: 13,
    code: "DIKLAT-13",
    name: "Workshop Penyamaan Persepsi Penguatan Agenda Bagi Calon Fasilitator Latsar CPNS",
    shortDescription: "Workshop online untuk membekali calon pengampu Latsar CPNS dengan pemahaman kurikulum Agenda I, II, III, IV (Habituasi), dan LMS terintegrasi.",
    category: "Workshop & TOT",
    method: "Daring (PJJ)",
    durationDays: 10,
    durationLabel: "10 Hari",
    startDate: "2027-02-22",
    endDate: "2027-03-05",
    displayDate: "22 Februari s.d. 5 Maret 2027",
    capacity: 30,
    boarding: "Daring / Online (Zoom)",
    location: "LMS Badiklat Kemhan / Virtual Zoom",
    targetParticipants: {
      tni: "Kapten s.d. Kolonel",
      pns: "Penata Muda Tk. I III/b s.d. Pembina Tk. I IV/b",
      rankTni: "Kapten - Kolonel",
      rankPns: "III/b - IV/b",
      minEducation: "TNI: Diklapa I | PNS: S1",
      maxAge: 56,
      specialRequirements: ["Widyaiswara atau fasilitator internal BPSDM Pertahanan"]
    },
    objectives: {
      general: "Membekali kompetensi calon fasilitator Latsar CPNS dalam membentuk karakter PNS profesional berakhlak di lingkungan pertahanan.",
      specific: [
        "Memahami kurikulum Agenda I (Sikap Perilaku Bela Negara), Agenda II (Nilai-Nilai Dasar PNS BerAKHLAK), Agenda III (Kedudukan & Peran PNS).",
        "Menguasai teknik bimbingan Agenda IV (Habituasi & Rancangan Aktualisasi).",
        "Mengoperasikan LMS terpadu pembelajaran mandiri & e-learning."
      ]
    },
    competency: "Mampu memfasilitasi seluruh tahapan Latsar CPNS secara interaktif, beretika, dan inspiratif.",
    curriculum: {
      basic: [
        "13_01 - Pembelajaran Agenda I, II, dan III",
        "13_02 - Kebijakan Pelatihan Dasar CPNS"
      ],
      core: [
        "13_03 - Manajemen Penyelenggaraan Pelatihan Dasar CPNS, Manajemen LMS, Manajemen Workshop",
        "13_04 - Pembelajaran Agenda Habituasi",
        "13_05 - Coaching, Mentoring dan Pola Pendampingan",
        "13_06 - Penajaman Mata Pelatihan Agenda I, Agenda II, Agenda III"
      ],
      supporting: [
        "13_07 - Evaluasi Agenda I, II, dan III"
      ]
    }
  },
  {
    id: 14,
    code: "DIKLAT-14",
    name: "Pelatihan Manajemen Perubahan",
    shortDescription: "Membekali peserta kemampuan menganalisis faktor pendorong, mengatasi resistensi, dan menerapkan model manajemen perubahan di satuan kerja.",
    category: "Manajemen",
    method: "Klasikal",
    durationDays: 5,
    durationLabel: "5 Hari",
    startDate: "2027-02-22",
    endDate: "2027-02-26",
    displayDate: "22 s.d. 26 Februari 2027",
    capacity: 30,
    boarding: "Tidak Diasramakan",
    location: "Kampus Salemba Kemhan RI",
    targetParticipants: {
      tni: "Kapten s.d. Mayor",
      pns: "Penata III/a s.d. Penata Tk. I III/d",
      rankTni: "Kapten - Mayor",
      rankPns: "III/a - III/d",
      minEducation: "TNI/Polri: Diklapa I | PNS: S1",
      maxAge: 55,
      specialRequirements: ["Personel dari lingkungan Kemhan, TNI, Polri, dan K/L"]
    },
    objectives: {
      general: "Peserta mampu memahami dan menerapkan strategi manajemen perubahan secara efektif guna mendorong kinerja dan inovasi organisasi.",
      specific: [
        "Menjelaskan konsep dasar dan kerangka kerja manajemen perubahan pemerintahan.",
        "Menganalisis resistensi (resistance to change) dan drivers inovasi.",
        "Menyusun action plan perubahan dan pemanfaatan teknologi digital."
      ]
    },
    competency: "Mampu mengidentifikasi kebutuhan perubahan, merancang strategi komunikasi perubahan, dan mengawal keberhasilan implementasi.",
    curriculum: {
      basic: [
        "14_01 - Kebijakan Pembangunan dan Reformasi Birokrasi",
        "14_02 - Mindset dan Orientasi Pelayanan Publik"
      ],
      core: [
        "14_03 - Konsep Dasar & Kerangka Kerja Manajemen Perubahan",
        "14_04 - Perencanaan dan Strategi Komunikasi Perubahan",
        "14_05 - Implementasi dan Pengukuran Keberhasilan Perubahan",
        "14_06 - Pemanfaatan Teknologi dan Inovasi Digital dalam Perubahan"
      ],
      supporting: [
        "14_07 - Evaluasi dan Rencana Tindak Lanjut (Action Plan)"
      ]
    }
  },
  {
    id: 15,
    code: "DIKLAT-15",
    name: "Pelatihan Kepemimpinan Administrator (PKA)",
    shortDescription: "Pelatihan struktural kepemimpinan administrator resmi untuk mengembangkan kompetensi manajerial dalam memimpin aksi perubahan kinerja organisasi.",
    category: "Kepemimpinan",
    method: "Blended Learning",
    durationDays: 90,
    durationLabel: "3 Bulan (Tahap Daring & Tatap Muka)",
    startDate: "2027-03-31",
    endDate: "2027-07-30",
    displayDate: "31 Maret s.d. 30 Juli 2027",
    capacity: 20,
    boarding: "Diasramakan",
    location: "Badiklat Kemhan Pondok Labu",
    targetParticipants: {
      pns: "Pejabat Administrator / JF Ahli Madya / Pengawas min III/c masa kerja 3,5 thn",
      rankPns: "III/c ke atas",
      minEducation: "S1 / S2, Telah lulus seleksi calon peserta Biro Kepegawaian",
      maxAge: 54,
      specialRequirements: ["Lulus tes TPA, Pengetahuan Akademik, TOEFL, Keswa, dan Kesamaptaan Jasmani"]
    },
    objectives: {
      general: "Mengembangkan kompetensi kepemimpinan manajemen kinerja akuntabel dalam rangka penyelenggaraan pemerintahan di Kemhan dan TNI.",
      specific: [
        "Mengaktualisasikan kepemimpinan Pancasila dan Nasionalisme bela negara.",
        "Memimpin jejaring kerja dan komunikasi transformasional.",
        "Menghasilkan dokumen dan implementasi Aksi Perubahan Kinerja Organisasi."
      ]
    },
    competency: "Mampu mengelola akuntabilitas jabatan administrator, memimpin bawahan, dan menggerakkan inovasi pelayanan publik berkesinambungan.",
    curriculum: {
      basic: [
        "15_05 - [Mata Pelatihan Dasar] Self Resilience, Berpikir Kritis & Digital Skill dalam Pembuatan Kebijakan"
      ],
      core: [
        "15_01 - [Agenda I] Kepemimpinan Pancasila dan Nasionalisme",
        "15_02 - [Agenda II] Kepemimpinan Kinerja",
        "15_03 - [Agenda III] Manajemen Kinerja (Manajemen Risiko, Akuntabilitas, Standar Pelayanan, Penganggaran)",
        "15_04 - [Agenda IV] Aktualisasi Kepemimpinan Kinerja Organisasi"
      ],
      supporting: [
        "15_06 - [Klasikal] Ceramah Isu Strategis, Integritas Pancasila, Manajemen Perubahan & Manajemen Kinerja Sektor Publik",
        "15_07 - [Klasikal] Studi Lapangan Kinerja Organisasi (Pembekalan, Pelaksanaan, Berbagi Pengalaman)",
        "15_08 - [Klasikal] Rancangan, Pembimbingan, Implementasi dan Seminar Aksi Perubahan Kinerja Organisasi"
      ]
    }
  },
  {
    id: 16,
    code: "DIKLAT-16",
    name: "Pelatihan Cyber Defence",
    shortDescription: "Pelatihan pertahanan siber tingkat lanjut, incident response, penetration testing (JPT), dan penanganan bukti elektronik (ADEFR).",
    category: "Teknis & Siber",
    method: "Klasikal",
    durationDays: 60,
    durationLabel: "2 Bulan (2 Gelombang)",
    startDate: "2027-04-05",
    endDate: "2027-08-20",
    displayDate: "Gel I: 5 Apr-4 Jun 2027 | Gel II: 28 Jun-20 Agt 2027",
    waves: [
      { wave: 1, name: "Gelombang I", startDate: "2027-04-05", endDate: "2027-06-04", displayDate: "5 April s.d. 4 Juni 2027" },
      { wave: 2, name: "Gelombang II", startDate: "2027-06-28", endDate: "2027-08-20", displayDate: "28 Juni s.d. 20 Agustus 2027" }
    ],
    capacity: 50,
    boarding: "Tidak Diasramakan",
    location: "Laboratorium Cyber Security Badiklat Kemhan Salemba",
    targetParticipants: {
      tni: "Minimal Bintara",
      pns: "Minimal Pengatur Muda II/a",
      rankTni: "Bintara - Pamen",
      rankPns: "II/a ke atas",
      minEducation: "Minimal SLTA (Diutamakan D3/S1 bidang Komputer/TI)",
      maxAge: 48,
      specialRequirements: ["Diutamakan berpengalaman dalam bidang pengelolaan TIK/jaringan"]
    },
    objectives: {
      general: "Peserta mampu menangani dan merespons insiden serangan siber pada infrastruktur strategis pertahanan negara.",
      specific: [
        "Menggunakan sistem dan tools Cyber Defence (Wireshark, Kali Linux, Kriptografi).",
        "Melakukan penetration testing sistematis sesuai profesi Junior Penetration Tester (JPT).",
        "Melakukan first response bukti digital (ADEFR) dan simulasi Cyber Attack & Defense."
      ]
    },
    competency: "Mampu memitigasi serangan siber, melakukan triase insiden, serta menguji ketahanan sistem informasi Kemhan/TNI.",
    curriculum: {
      basic: [
        "16_01 - [Bidang Studi Dasar] Pengetahuan Bela Negara, Manajemen Infrastruktur TI & Manajemen Risiko TI"
      ],
      core: [
        "16_02 - [Bidang Studi Inti] Pengenalan Keamanan Siber, Jaringan Komputer, Enkripsi & OS Security",
        "16_03 - [Dasar Cyber Defence] Identifikasi Ancaman, Analisis Trafik (Wireshark), Windows & Linux Security",
        "16_04 - [Dasar Cyber Defence] Kriptografi, Pengantar Digital Forensik, CSIRT & Security Operations Center (SOC)",
        "16_05 - [Junior Penetration Tester / JPT] Information Gathering, Vulnerability Assessment, Exploitation & Reporting",
        "16_06 - [Associate Digital Evidence First Responder / ADEFR] Penanganan Bukti Elektronik (Stand Alone, Networked, Live/Dead, CCTV)"
      ],
      supporting: [
        "16_07 - [Kebijakan & Simulasi] Kebijakan Siber Nasional, ISMS ISO 27001, Perang Informasi & Cyber Attack Defense Simulation"
      ]
    }
  },
  {
    id: 17,
    code: "DIKLAT-17",
    name: "Pelatihan Alih Golongan dari Golongan II ke Golongan III Bagi PNS",
    shortDescription: "Program wajib bagi PNS Golongan II yang akan naik pangkat ke Golongan III untuk meningkatkan kompetensi manajerial, pelayanan publik, dan kepemimpinan.",
    category: "Fungsional",
    method: "Blended Learning",
    durationDays: 60,
    durationLabel: "2 Bulan (2 Gelombang)",
    startDate: "2027-04-05",
    endDate: "2027-08-20",
    displayDate: "Gel I: 5 Apr-4 Jun 2027 | Gel II: 28 Jun-20 Agt 2027",
    waves: [
      { wave: 1, name: "Gelombang I", startDate: "2027-04-05", endDate: "2027-06-04", displayDate: "5 April s.d. 4 Juni 2027" },
      { wave: 2, name: "Gelombang II", startDate: "2027-06-28", endDate: "2027-08-20", displayDate: "28 Juni s.d. 20 Agustus 2027" }
    ],
    capacity: 60,
    boarding: "Diasramakan",
    location: "Pusdiklat Badiklat Kemhan Pondok Labu",
    targetParticipants: {
      pns: "Pengatur II/c Penyesuaian Ijazah s.d. Pengatur Tk. I II/d",
      rankPns: "II/c - II/d",
      minEducation: "Minimal SLTA / Penyesuaian Ijazah S1",
      maxAge: 53,
      specialRequirements: ["Telah dinyatakan lulus Ujian Dinas Tk. I atau Ujian Penyesuaian Kenaikan Pangkat (UPKP)"]
    },
    objectives: {
      general: "Mempersiapkan PNS Golongan II untuk menjalankan tugas dan tanggung jawab profesional pada jenjang Golongan III.",
      specific: [
        "Memahami etika profesi ASN, akuntabilitas, dan disiplin PNS.",
        "Menguasai pengelolaan tata naskah dinas, SKP, dan pelayanan publik.",
        "Menguasai pemanfaatan teknologi informasi dan teknik presentasi kedinasan."
      ]
    },
    competency: "Mampu menerapkan kompetensi manajerial dan administrasi yang dipersyaratkan pada jenjang Golongan III di lingkungan Kemhan/TNI.",
    curriculum: {
      basic: [
        "17_01 - [Bidang Studi Dasar] Bela Negara dalam Sistem Pertahanan Negara, Anti Korupsi & Reformasi Birokrasi Kemhan/TNI"
      ],
      core: [
        "17_02 - [Bidang Studi Inti] Sasaran Kinerja Pegawai (SKP), Pelayanan Publik & Pengelolaan Administrasi Umum Kemhan/TNI",
        "17_03 - [Bidang Studi Inti] Etika Profesi ASN, Akuntabilitas Kinerja, Disiplin PNS & Manajemen Kepegawaian Negara",
        "17_04 - [Bidang Studi Inti] Manajemen Perkantoran Modern, Komunikasi dalam Organisasi & Pemanfaatan Teknologi Informasi",
        "17_05 - [Bidang Studi Inti] Teknik Presentasi, Dasar-Dasar Kepemimpinan & Peraturan Baris Berbaris (PBB)"
      ],
      supporting: [
        "17_06 - [Pendukung] Outbound & Ujian Komprehensif"
      ]
    }
  },
  {
    id: 18,
    code: "DIKLAT-18",
    name: "Pelatihan Administrasi Umum",
    shortDescription: "Pelatihan tata persuratan dinas, korespondensi militer/ASN, pengendalian naskah dinas, dan kearsipan bagi pegawai baru.",
    category: "Teknis & Siber",
    method: "Blended Learning",
    durationDays: 30,
    durationLabel: "1 Bulan (2 Gelombang)",
    startDate: "2027-04-05",
    endDate: "2027-08-13",
    displayDate: "Gel I: 5-30 Apr 2027 | Gel II: 19 Jul-13 Agt 2027",
    waves: [
      { wave: 1, name: "Gelombang I", startDate: "2027-04-05", endDate: "2027-04-30", displayDate: "5 s.d. 30 April 2027" },
      { wave: 2, name: "Gelombang II", startDate: "2027-07-19", endDate: "2027-08-13", displayDate: "19 Juli s.d. 13 Agustus 2027" }
    ],
    capacity: 60,
    boarding: "Diasramakan",
    location: "Badiklat Kemhan Salemba",
    targetParticipants: {
      tni: "Minimal Bintara",
      pns: "Minimal Pengatur II/c",
      pppk: "Minimal Golongan V",
      rankTni: "Bintara - Pama",
      rankPns: "II/c ke atas",
      rankPppk: "Golongan V ke atas",
      minEducation: "Minimal SLTA/Sederajat",
      maxAge: 45,
      specialRequirements: ["Dikhususkan bagi pegawai baru ASN / personel staf administrasi di lingkungan Kemhan dan TNI"]
    },
    objectives: {
      general: "Peserta mampu menyusun, mengendalikan, dan mengarsipkan naskah dinas sesuai jukminu Kemhan dan TNI.",
      specific: [
        "Mengenal bentuk naskah arahan, dinas khusus, telaahan staf, dan laporan.",
        "Mempraktikkan pembuatan dan penandatanganan naskah dinas secara digital/konvensional.",
        "Mengelola kearsipan dinas dan pemanfaatan sistem persuratan elektronik."
      ]
    },
    competency: "Mampu mengelola tata naskah dinas secara tertib, tepat format, dan rapi sesuai regulasi Minu Kemhan/TNI.",
    curriculum: {
      basic: [
        "18_01 - [Bidang Studi Dasar] Bela Negara, Organisasi Kemhan dan TNI, Manajemen Perkantoran Modern & Anti Korupsi"
      ],
      core: [
        "18_02 - [Bidang Studi Inti] Jenis, Bentuk dan Format Naskah Dinas (Arahan, Korespondensi, Khusus, Umum, Laporan, Telaahan Staf, Ralat)",
        "18_03 - [Bidang Studi Inti] Pembuatan Naskah Dinas, Penandatanganan dan Pengendalian Naskah Dinas",
        "18_04 - [Bidang Studi Inti] Tata Naskah, Pemanfaatan Teknologi Informasi & Manajemen Kearsipan"
      ],
      supporting: [
        "18_05 - [Bidang Studi Inti & Pendukung] Simulasi Administrasi Umum, Administrasi Perkantoran dan Koordinasi"
      ]
    }
  },
  {
    id: 19,
    code: "DIKLAT-19",
    name: "Pelatihan Kesehatan Keselamatan Kerja Rumah Sakit (K3RS)",
    shortDescription: "Peningkatan keterampilan tenaga kerja kesehatan dalam pengendalian potensi bahaya, manajemen risiko ergonomi, B3, dan tanggap darurat di RS Kemhan/TNI.",
    category: "Kesehatan",
    method: "Klasikal",
    durationDays: 14,
    durationLabel: "14 Hari",
    startDate: "2027-04-26",
    endDate: "2027-05-07",
    displayDate: "26 April s.d. 7 Mei 2027",
    capacity: 25,
    boarding: "Diasramakan",
    location: "RSPAD Gatot Soebroto / Fasilitas Diklat Kemhan",
    targetParticipants: {
      tni: "Bintara s.d. Pama",
      pns: "Pengatur II/c s.d. Penata III/c",
      rankTni: "Bintara - Pama",
      rankPns: "II/c - III/c",
      minEducation: "D3/S1 di bidang Kesehatan / K3",
      maxAge: 45,
      specialRequirements: ["Bertugas di Rumah Sakit atau Lembaga Pelayanan Medis Kemhan/TNI"]
    },
    objectives: {
      general: "Peserta mampu mengidentifikasi, mencegah, dan mengendalikan risiko kerja serta mewujudkan rumah sakit yang aman dan sehat.",
      specific: [
        "Menerapkan Sistem Manajemen K3 di fasilitas layanan kesehatan.",
        "Mengelola limbah medis berbahaya (B3) dan proteksi kebakaran/bencana.",
        "Menerapkan ergonomi dan keselamatan kerja peralatan medis."
      ]
    },
    competency: "Mampu menjalankan prosedur keselamatan kerja, mitigasi risiko B3, dan simulasi code red darurat rumah sakit.",
    curriculum: {
      basic: [
        "19_01 - [Bidang Studi Dasar] Bela Negara Hanneg, Etika & Perlindungan Hukum Nakes, Kebijakan K3 & Akreditasi"
      ],
      core: [
        "19_02 - [Bidang Studi Inti] Penerapan Sistem Manajemen K3 di Fasyankes",
        "19_03 - [Bidang Studi Inti] Identifikasi Potensi Bahaya dan Manajemen Risiko K3",
        "19_04 - [Bidang Studi Inti] Upaya Promotif Preventif Kesehatan Kerja bagi SDM & Penerapan Sistem Ergonomi",
        "19_05 - [Bidang Studi Inti] Pengelolaan Sarana, Prasarana dan Peralatan Medis dari Aspek K3",
        "19_06 - [Bidang Studi Inti] Pengelolaan B3, Limbah B3, dan Limbah Domestik dari Aspek K3"
      ],
      supporting: [
        "19_07 - [Bidang Studi Inti] Kesiapsiagaan Menghadapi Kondisi Darurat atau Bencana, Termasuk Kebakaran"
      ]
    }
  },
  {
    id: 20,
    code: "DIKLAT-20",
    name: "Pelatihan Kepemimpinan Pengawas (PKP)",
    shortDescription: "Pelatihan kepemimpinan struktural pengawas untuk menjamin akuntabilitas pelayanan publik dan memimpin inovasi kerja tim bawahan.",
    category: "Kepemimpinan",
    method: "Blended Learning",
    durationDays: 120,
    durationLabel: "4 Bulan (2 Gelombang)",
    startDate: "2027-04-26",
    endDate: "2027-12-03",
    displayDate: "Gel I: 26 Apr-27 Agt 2027 | Gel II: 9 Agt-3 Des 2027",
    waves: [
      { wave: 1, name: "Gelombang I", startDate: "2027-04-26", endDate: "2027-08-27", displayDate: "26 April s.d. 27 Agustus 2027" },
      { wave: 2, name: "Gelombang II", startDate: "2027-08-09", endDate: "2027-12-03", displayDate: "9 Agustus s.d. 3 Desember 2027" }
    ],
    capacity: 80,
    boarding: "Diasramakan",
    location: "Kampus Badiklat Kemhan Pondok Labu",
    targetParticipants: {
      pns: "Minimal Penata Muda Tk. I III/b masa kerja min 2 tahun",
      rankPns: "III/b ke atas",
      minEducation: "Minimal S1/D4, Memiliki min 2 sertifikat diklat dalam 3 tahun terakhir",
      maxAge: 54,
      specialRequirements: ["Lulus seleksi TPA, Pengetahuan Akademik, Bahasa Inggris, Keswa, dan Kesamaptaan"]
    },
    objectives: {
      general: "Mengembangkan kompetensi kepemimpinan melayani dalam memimpin pengendalian pelayanan publik berstandar SOP.",
      specific: [
        "Menginternalisasi etika dan integritas kepemimpinan Pancasila.",
        "Mendiagnosa masalah organisasi dan merancang solusi aksi perubahan pelayanan.",
        "Mengendalikan perencanaan anggaran dan pelayanan publik digital."
      ]
    },
    competency: "Mampu memimpin tim efektif, melakukan diagnosa organisasi, dan mewujudkan Aksi Perubahan Kualitas Pelayanan Publik.",
    curriculum: {
      basic: [
        "20_06 - [Pelatihan Dasar & Pilihan] Resiliensi Diri, GEDSI, Digital Skill Kebijakan & Mata Pelatihan Pilihan (PBJ, Ekonomi Hijau, Risiko, dll.)"
      ],
      core: [
        "20_01 - [Agenda I] Kepemimpinan Pancasila dan Bela Negara (Etika & Integritas Kepemimpinan Pancasila)",
        "20_02 - [Agenda II] Kepemimpinan Pelayanan (Diagnosa Organisasi, Berpikir Kreatif, Membangun Tim Efektif, Kepemimpinan Pekerjaan)",
        "20_03 - [Agenda III] Pengendalian Pekerjaan (Komunikasi Pelayanan Publik, Perencanaan Kegiatan, Penyusunan RKA, Pelayanan Publik Digital)",
        "20_04 - [Agenda III] Pengendalian Pekerjaan (Manajemen Mutu, Manajemen Pengawasan & Pengendalian Pelaksanaan Kegiatan)",
        "20_05 - [Agenda IV] Aktualisasi Kepemimpinan Pelayanan (Studi Lapangan & Aksi Perubahan Kualitas Pelayanan Publik)"
      ],
      supporting: [      ]
    }
  },
  {
    id: 21,
    code: "DIKLAT-21",
    name: "Pelatihan Manajemen Kinerja",
    shortDescription: "Merancang KPI SMART, evaluasi kinerja aparatur berkelanjutan, teknik coaching & feedback konstruktif, serta penyelarasan sasaran strategis.",
    category: "Manajemen",
    method: "Klasikal",
    durationDays: 5,
    durationLabel: "5 Hari",
    startDate: "2027-05-10",
    endDate: "2027-05-14",
    displayDate: "10 s.d. 14 Mei 2027",
    capacity: 30,
    boarding: "Tidak Diasramakan",
    location: "Puspimjemenhan Salemba",
    targetParticipants: {
      tni: "Kapten s.d. Mayor",
      pns: "Penata III/a s.d. Penata Tk. I III/d",
      rankTni: "Kapten - Mayor",
      rankPns: "III/a - III/d",
      minEducation: "TNI: Diklapa I | PNS: S1",
      maxAge: 55,
      specialRequirements: ["Personel dari lingkungan Kemhan dan TNI"]
    },
    objectives: {
      general: "Peserta mampu merancang, memantau, dan mengevaluasi manajemen kinerja berbasis data objektif di unit kerja.",
      specific: [
        "Menyusun KPI berstandar SMART selaras strategi unit kerja.",
        "Mempraktikkan teknik coaching dan feedback konstruktif saat pemantauan.",
        "Mengelola penilaian objektif E-Kinerja tanpa bias personal."
      ]
    },
    competency: "Mampu menyusun sasaran kinerja individu, mengevaluasi pencapaian target, dan merumuskan tindak lanjut reward & punishment.",
    curriculum: {
      basic: [
        "21_01 - Pengetahuan Bela Negara dalam Sishanneg & Good Governance"
      ],
      core: [
        "21_02 - Keselarasan Strategis Organisasi (Strategic Alignment)",
        "21_03 - Manajemen Siklus Kinerja (Performance Management Cycle)",
        "21_04 - Penilaian Kinerja Objektif (E-Kinerja & Dokumen Penilaian)"
      ],
      supporting: [
        "21_05 - Tindak Lanjut Hasil Penilaian (Reward & Punishment)"
      ]
    }
  },
  {
    id: 22,
    code: "DIKLAT-22",
    name: "Pelatihan Security Operations Center Analyst (Level 1)",
    shortDescription: "Pelatihan teknis bagi personel SOC untuk melakukan pemantauan log keamanan, deteksi kerentanan aset TI, ticketing, dan mitigasi awal insiden siber.",
    category: "Teknis & Siber",
    method: "Klasikal",
    durationDays: 10,
    durationLabel: "10 Hari",
    startDate: "2027-06-07",
    endDate: "2027-06-18",
    displayDate: "7 s.d. 18 Juni 2027",
    capacity: 25,
    boarding: "Tidak Diasramakan",
    location: "Lab Cyber Security Salemba",
    targetParticipants: {
      tni: "Minimal Bintara",
      pns: "Minimal Pengatur Muda II/a",
      rankTni: "Bintara - Pamen",
      rankPns: "II/a ke atas",
      minEducation: "Minimal SLTA (Diutamakan D3/S1 TI)",
      maxAge: 48,
      specialRequirements: ["Diutamakan memiliki pengalaman bertugas di bidang TIK / jaringan"]
    },
    objectives: {
      general: "Meningkatkan kompetensi operasional dalam memantau sistem informasi dan menganalisis alert keamanan SOC Level 1.",
      specific: [
        "Menganalisis log keamanan pada SIEM/SOC platform.",
        "Melakukan deteksi kerentanan aset TI dan penilaian dampak insiden.",
        "Memberikan tiket insiden dan melakukan triase penanganan awal."
      ]
    },
    competency: "Mampu mengoperasikan dashboard SOC, mendeteksi intrusi jaringan, dan menyusun laporan insiden keamanan siber.",
    curriculum: {
      basic: [
        "22_01 - Ceramah Substantif, Pengarahan Program & Etika Profesi SOC"
      ],
      core: [
        "22_02 - Melakukan Analisis Keamanan Siber terhadap Insiden untuk Menentukan Kendali",
        "22_03 - Melakukan Deteksi Kerentanan Aset Teknologi Informasi (TI)",
        "22_04 - Melakukan Pemantauan Aset TI terhadap Aktivitas Ancaman Siber",
        "22_05 - Memberikan Tiket terhadap Insiden Keamanan Siber",
        "22_06 - Menganalisis Log pada Security Operations Center (SOC)"
      ],
      supporting: [
        "22_07 - Menganalisis Dampak Insiden Keamanan Siber & Workshop Uji Kompetensi"
      ]
    }
  },
  {
    id: 23,
    code: "DIKLAT-23",
    name: "Training Of Trainer (TOT) Substansi Diklat Teknis Alih Golongan II ke III Bagi PNS",
    shortDescription: "Pelatihan instruktur/fasilitator untuk menguasai substansi materi, andragogi, dan teknik micro-teaching pada Diklat Alih Golongan II ke III.",
    category: "Workshop & TOT",
    method: "Klasikal",
    durationDays: 10,
    durationLabel: "10 Hari",
    startDate: "2027-06-14",
    endDate: "2027-06-25",
    displayDate: "14 s.d. 25 Juni 2027",
    capacity: 30,
    boarding: "Tidak Diasramakan",
    location: "Kampus Puspimjemenhan Salemba",
    targetParticipants: {
      tni: "Lettu s.d. Kolonel (Prioritas lulus Susgadik)",
      pns: "Minimal Penata Muda Tk. I III/b (Pendidikan min S2)",
      rankTni: "Lettu - Kolonel",
      rankPns: "III/b ke atas",
      minEducation: "TNI: Susgadik | PNS: S2",
      maxAge: 55,
      specialRequirements: ["Diusulkan Kasatker untuk menjadi pengampu Diklat Alih Golongan"]
    },
    objectives: {
      general: "Menyiapkan tenaga pengajar/Widyaiswara yang menguasai substansi dan desain instruksional Diklat Alih Golongan secara profesional.",
      specific: [
        "Menguasai materi regulasi PNS, etos kerja, dan administrasi umum.",
        "Menyusun Rancang Bangun Pembelajaran Mata Pelatihan (RBPMP).",
        "Mahir melaksanakan praktik micro-teaching."
      ]
    },
    competency: "Mampu menyampaikan materi diklat dengan metode andragogi yang komunikatif, menarik, dan berstandar akademik tinggi.",
    curriculum: {
      basic: [
        "23_01 - [Bidang Studi Dasar] Pengetahuan Kewarganegaraan Indonesia dan Pertahanan Negara"
      ],
      core: [
        "23_02 - [Substansi Design Pembelajaran] Rancang Bangun Pembelajaran, Metode Pembelajaran & Pembelajaran Orang Dewasa",
        "23_03 - [Substansi Manajemen PNS] Jabatan PNS, Teknik Penyusunan SKP, Disiplin/Kinerja Pegawai & Etika Profesi PNS",
        "23_04 - [Substansi Tata Kelola Pemerintahan] Manajemen Perkantoran Modern, Sistem NKRI, Dasar Kepemimpinan & Anti Korupsi",
        "23_05 - [Substansi Etos Kerja PNS] Team Building, Komunikasi Organisasi, Budaya Kerja Berorientasi Mutu & Pelayanan Publik",
        "23_06 - [Substansi Minu & TI] Pengelolaan Naskah Dinas Kemhan/TNI, Min-Keu & Mat, Keterampilan TI & Presentasi"
      ],
      supporting: [
        "23_07 - [Aplikasi] Praktik Mengajar (Micro Teaching)"
      ]
    }
  },
  {
    id: 24,
    code: "DIKLAT-24",
    name: "Pelatihan Jarak Jauh Mastering Effective Communication",
    shortDescription: "Pelatihan daring untuk membangun budaya komunikasi adaptif, inklusif, dan future-ready di lingkungan birokrasi pertahanan.",
    category: "Manajemen",
    method: "Daring (PJJ)",
    durationDays: 4,
    durationLabel: "4 Hari",
    startDate: "2027-06-22",
    endDate: "2027-06-25",
    displayDate: "22 s.d. 25 Juni 2027",
    capacity: 100,
    boarding: "Daring / Online (Zoom)",
    location: "Virtual Classroom Puspimjemenhan",
    targetParticipants: {
      tni: "Serda s.d. Mayor",
      pns: "Pengatur Muda II/a s.d. Penata Tk. I III/d",
      pppk: "Golongan VI s.d. X",
      rankTni: "Serda - Mayor",
      rankPns: "II/a - III/d",
      rankPppk: "VI - X",
      minEducation: "SLTA / D3 / S1",
      maxAge: 55,
      specialRequirements: ["Personel TNI dan ASN Kemhan dengan fasilitas video conference memadai"]
    },
    objectives: {
      general: "Peserta mampu menerapkan teknik dan strategi komunikasi efektif dalam lingkungan kerja untuk mendukung kolaborasi modern.",
      specific: [
        "Menjelaskan konsep dasar Mastering Effective Communication.",
        "Membangun Future-Ready Workplace Culture berbasis empati dan keterbukaan.",
        "Menerapkan komunikasi lisan dan tulisan dalam koordinasi tim lintas fungsi."
      ]
    },
    competency: "Mampu berkomunikasi secara konstruktif untuk meningkatkan produktivitas dan kelancaran pencapaian sasaran kerja.",
    curriculum: {
      basic: [
        "24_01 - Konsep Dasar Mastering Effective Communication"
      ],
      core: [
        "24_02 - Future-Ready Workplace Culture (Budaya Kerja Siap Masa Depan)",
        "24_03 - Hubungan antara Komunikasi Efektif dan Budaya Kerja Future-Ready",
        "24_04 - Strategi Membangun Future-Ready Workplace Culture"
      ],
      supporting: [
        "24_05 - Implementasi Mastering Effective Communication: Building a Future-Ready Workplace Culture"
      ]
    }
  },
  {
    id: 25,
    code: "DIKLAT-25",
    name: "Pelatihan Manajemen Data Statistik Sektoral",
    shortDescription: "Pelatihan komprehensif siklus data statistik: perencanaan, pengumpulan, validasi (GSBPM), analisis, visualisasi, dan diseminasi Satu Data Indonesia.",
    category: "Teknis & Siber",
    method: "Klasikal",
    durationDays: 5,
    durationLabel: "5 Hari",
    startDate: "2027-07-12",
    endDate: "2027-07-16",
    displayDate: "12 s.d. 16 Juli 2027",
    capacity: 30,
    boarding: "Tidak Diasramakan",
    location: "Puspimjemenhan Salemba",
    targetParticipants: {
      tni: "Minimal Serda",
      pns: "Minimal Pengatur II/c",
      rankTni: "Serda - Pamen",
      rankPns: "II/c ke atas",
      minEducation: "Minimal D3",
      maxAge: 50,
      specialRequirements: ["Pemangku jabatan fungsional Statistisi atau staf yang membidangi data/perencanaan di Kemhan/TNI"]
    },
    objectives: {
      general: "Peserta mampu mengelola data statistik sektoral pertahanan secara sistematis, akurat, terpadu, dan akuntabel sesuai Satu Data Indonesia.",
      specific: [
        "Memahami Generic Statistical Business Process Model (GSBPM).",
        "Menerapkan standar data, metadata, dan kode referensi nasional.",
        "Mengolah, memvalidasi, menganalisis, serta menyajikan visualisasi data pertahanan."
      ]
    },
    competency: "Mampu menyajikan statistik sektoral pertahanan berkualitas tinggi untuk mendukung perumusan kebijakan pimpinan.",
    curriculum: {
      basic: [
        "25_01 - Kebijakan Statistik Sektoral dan Satu Data Indonesia",
        "25_02 - Konsep Dasar dan Proses Bisnis Statistik (GSBPM)"
      ],
      core: [
        "25_03 - Perencanaan dan Pengumpulan Data Statistik",
        "25_04 - Standar Data, Metadata, dan Kode Referensi",
        "25_05 - Pengolahan, Validasi, dan Pemeriksaan Kualitas Data",
        "25_06 - Analisis dan Interpretasi Data Statistik",
        "25_07 - Visualisasi, Penyajian, dan Diseminasi Data"
      ],
      supporting: [
        "25_08 - Praktik Pengelolaan Data Statistik Sektoral & Evaluasi Hasil Praktik"
      ]
    }
  },
  {
    id: 26,
    code: "DIKLAT-26",
    name: "Pelatihan Teknis Keamanan Siber",
    shortDescription: "Pelatihan perlindungan jaringan, kriptografi data, hardening sistem operasi Windows/Linux, serta tanggap penanganan insiden siber.",
    category: "Teknis & Siber",
    method: "Klasikal",
    durationDays: 14,
    durationLabel: "14 Hari",
    startDate: "2027-07-19",
    endDate: "2027-07-30",
    displayDate: "19 s.d. 30 Juli 2027",
    capacity: 30,
    boarding: "Tidak Diasramakan",
    location: "Lab Komputer Badiklat Kemhan Salemba",
    targetParticipants: {
      tni: "Minimal Bintara",
      pns: "Minimal Pengda II/a",
      rankTni: "Bintara - Pamen",
      rankPns: "II/a ke atas",
      minEducation: "SLTA (Diutamakan D3/S1 bidang TI)",
      maxAge: 48,
      specialRequirements: ["Pengalaman bertugas di bidang pengelolaan TIK/jaringan"]
    },
    objectives: {
      general: "Meningkatkan kemampuan teknis peserta dalam mengamankan sistem informasi, jaringan, dan data instansi pertahanan.",
      specific: [
        "Mengidentifikasi vektor ancaman siber dan manajemen risiko TI.",
        "Menerapkan enkripsi data/kriptografi dan proteksi endpoint OS.",
        "Melakukan tindakan respon insiden pertama saat terjadi kebocoran data."
      ]
    },
    competency: "Mampu melakukan deteksi anomali jaringan, konfigurasi pengamanan OS, dan prosedur penanganan ancaman siber.",
    curriculum: {
      basic: [
        "26_01 - Pengantar Keamanan Jaringan & Konsep Pertahanan dan Tipe Serangan Siber"
      ],
      core: [
        "26_02 - Manajemen Risiko Keamanan Siber & Kriptografi",
        "26_03 - Tanggapan Insiden Siber (Incident Response)",
        "26_04 - Keamanan Sistem Operasi Windows dan Linux"
      ],
      supporting: [
        "26_05 - Visitasi, Materi Substantif & Review Penyelenggaraan Pelatihan"
      ]
    }
  },
  {
    id: 27,
    code: "DIKLAT-27",
    name: "Kursus Manajemen Pengadaan Barang/Jasa Pertahanan",
    shortDescription: "Pelatihan sertifikasi keahlian PBJP Level-1 LKPP: perencanaan, pemilihan penyedia, kontrak kerja, swakelola, dan administrasi materiil pertahanan.",
    category: "Manajemen",
    method: "Blended Learning",
    durationDays: 60,
    durationLabel: "2 Bulan",
    startDate: "2027-08-04",
    endDate: "2027-09-28",
    displayDate: "4 Agustus s.d. 28 September 2027",
    capacity: 30,
    boarding: "Diasramakan",
    location: "Pusdiklat Badiklat Kemhan Pondok Labu",
    targetParticipants: {
      tni: "Mayor s.d. Letkol",
      pns: "Penata III/c s.d. Penata Tk. I III/d",
      rankTni: "Mayor - Letkol",
      rankPns: "III/c - III/d",
      minEducation: "TNI: Diklapa II | PNS: S1/PKP",
      maxAge: 55,
      specialRequirements: ["Sedang/dipersiapkan menjadi PPK, Pokja Pemilihan, atau Pejabat Pengadaan di satker"]
    },
    objectives: {
      general: "Menghasilkan pengelola pengadaan barang/jasa pemerintah di lingkungan Kemhan/TNI yang berintegritas, transparan, dan bersertifikat LKPP.",
      specific: [
        "Menguasai perencanaan, pemilihan, dan manajemen kontrak PBJP Level-1.",
        "Memahami pengadaan khusus alutsista, kepabeanan, dan tata kelola BMN.",
        "Lulus Ujian Sertifikasi Keahlian Pengadaan Barang/Jasa Nasional LKPP."
      ]
    },
    competency: "Mampu menyusun HPS, dokumen pemilihan, mengelola kontrak penyedia, dan mematuhi etika anti korupsi pengadaan.",
    curriculum: {
      basic: [
        "27_01 - [Bidang Studi Dasar] Bela Negara, Pertahanan Negara, RUP PBJ Kemhan/TNI & Good Governance"
      ],
      core: [
        "27_02 - [SBS Manajemen Penganggaran] Perencanaan Kebutuhan PBJ Han, Akuntansi Akrual, RKA-K/L & Pengelolaan Keuangan Negara",
        "27_03 - [SBS Manajemen PBJP Level-1] Pengantar, Perencanaan, Pemilihan Penyedia & Pengelolaan Kontrak PBJP Level-1",
        "27_04 - [SBS Manajemen PBJP Level-1] Pengelolaan PBJP secara Swakelola Level-1 & Supply Chain Management",
        "27_05 - [SBS Administrasi Materiil] Verifikasi, Penerimaan, Penyimpanan BMN & Pemeliharaan Khusus Materiil Pertahanan",
        "27_06 - [SBS Administrasi Materiil] Aspek Perpajakan PBJ, Tatalaksana Ekspor-Impor, Kepabeanan & Pengadaan Khusus"
      ],
      supporting: [
        "27_07 - [SBS Aplikasi & Pendukung] Simulasi PBJP, Ujian Sertifikasi LKPP, SIMAN, Manajemen Risiko PBJ, Ceramah KPK/APIP"
      ]
    }
  },
  {
    id: 28,
    code: "DIKLAT-28",
    name: "Diklat Teknis Emergency Nursing Basic Level",
    shortDescription: "Pelatihan keterampilan perawat dalam penanganan pasien gawat darurat: initial assessment, BHD, jalan napas, syok hipovolemik, ACS, dan trauma.",
    category: "Kesehatan",
    method: "Klasikal",
    durationDays: 14,
    durationLabel: "14 Hari",
    startDate: "2027-08-10",
    endDate: "2027-08-27",
    displayDate: "10 s.d. 27 Agustus 2027",
    capacity: 25,
    boarding: "Diasramakan",
    location: "Fasilitas Simulasi Kesehatan Badiklat Kemhan",
    targetParticipants: {
      tni: "Minimal Bintara",
      pns: "Minimal Pengatur II/c",
      pppk: "Minimal Golongan VII",
      rankTni: "Bintara - Pama",
      rankPns: "II/c ke atas",
      rankPppk: "Golongan VII ke atas",
      minEducation: "Minimal D3 Keperawatan",
      maxAge: 48,
      specialRequirements: ["Memiliki STR Perawat aktif, bertugas di IGD/ICU/Klinik Kemhan-TNI"]
    },
    objectives: {
      general: "Mampu memberikan asuhan keperawatan gawat darurat dasar di fasilitas kesehatan militer dan pertahanan sesuai SOP.",
      specific: [
        "Melakukan initial assessment dengan cepat dan akurat.",
        "Mengelola airway and breathing serta resusitasi jantung paru (BHD).",
        "Menangani syok, sindrom koroner akut (ACS), serta stabilisasi fraktur dan trauma."
      ]
    },
    competency: "Mampu melakukan triase darurat dan tindakan stabilisasi hidup dasar pada korban bencana/gawat darurat.",
    curriculum: {
      basic: [
        "28_01 - [Bidang Studi Dasar] Kebijakan Kemenkes Kegawatdaruratan, PKB Perawat & Konsep Kegawatdaruratan"
      ],
      core: [
        "28_02 - [Bidang Studi Inti] Asuhan Keperawatan Gawat Darurat & Initial Assessment",
        "28_03 - [Bidang Studi Inti] Pengelolaan Jalan Nafas dan Pernafasan pada Kondisi Gawat Darurat",
        "28_04 - [Bidang Studi Inti] Bantuan Hidup Dasar (BHD)",
        "28_05 - [Bidang Studi Inti] Asuhan Keperawatan Gawat Darurat Dasar Syok Hipovolemik",
        "28_06 - [Bidang Studi Inti] Asuhan Keperawatan Gawat Darurat Dasar Sindrom Koroner Akut (SKA/ACS) & Trauma"
      ],
      supporting: [      ]
    }
  },
  {
    id: 29,
    code: "DIKLAT-29",
    name: "Pelatihan Metadata Statistik dan Standarisasi Data",
    shortDescription: "Pelatihan menyusun metadata statistik kegiatan (MS-Keg), variabel (MS-Var), indikator (MS-Ind), dan penerapan Standar Data Statistik (SDS).",
    category: "Teknis & Siber",
    method: "Klasikal",
    durationDays: 5,
    durationLabel: "5 Hari",
    startDate: "2027-09-06",
    endDate: "2027-09-10",
    displayDate: "6 s.d. 10 September 2027",
    capacity: 30,
    boarding: "Tidak Diasramakan",
    location: "Puspimjemenhan Salemba",
    targetParticipants: {
      tni: "Minimal Serda",
      pns: "Minimal Pengatur II/c",
      rankTni: "Serda - Pamen",
      rankPns: "II/c ke atas",
      minEducation: "Minimal D3",
      maxAge: 50,
      specialRequirements: ["Pemangku JF Statistisi / Staf data perencanaan di satker Kemhan/TNI"]
    },
    objectives: {
      general: "Peserta mampu menyusun dan mengelola metadata serta standarisasi data statistik sesuai prinsip Satu Data Indonesia.",
      specific: [
        "Menyusun instrumen MS-Keg, MS-Var, dan MS-Ind.",
        "Menerapkan konsep, klasifikasi, ukuran, dan satuan data terstandarisasi.",
        "Melakukan verifikasi dan validasi kualitas metadata pertahanan."
      ]
    },
    competency: "Mampu merancang katalog metadata yang siap diintegrasikan pada portal Satu Data Kemhan RI.",
    curriculum: {
      basic: [
        "29_01 - Kebijakan Satu Data Indonesia dan Tata Kelola Statistik Sektoral",
        "29_02 - Konsep, Fungsi, dan Prinsip Metadata Statistik"
      ],
      core: [
        "29_03 - Penyusunan Metadata Kegiatan Statistik (MS-Keg)",
        "29_04 - Penyusunan Metadata Variabel Statistik (MS-Var)",
        "29_05 - Penyusunan Metadata Indikator Statistik (MS-Ind)",
        "29_06 - Konsep dan Penerapan Standar Data Statistik (SDS)",
        "29_07 - Standardisasi Konsep, Definisi, Klasifikasi, Ukuran, dan Satuan"
      ],
      supporting: [
        "29_08 - Validasi, Verifikasi, dan Pengelolaan Kualitas Metadata",
        "29_09 - Praktik Penyusunan Metadata dan Standardisasi Data"
      ]
    }
  },
  {
    id: 30,
    code: "DIKLAT-30",
    name: "Kursus Singkat Manajemen Peningkatan Kompetensi Mengajar",
    shortDescription: "Pengembangan metode andragogi, manajemen kelas interaktif, video pembelajaran, dan micro-teaching bagi instruktur/Widyaiswara Kemhan.",
    category: "Workshop & TOT",
    method: "Klasikal",
    durationDays: 10,
    durationLabel: "10 Hari",
    startDate: "2027-09-06",
    endDate: "2027-09-17",
    displayDate: "6 s.d. 17 September 2027",
    capacity: 30,
    boarding: "Tidak Diasramakan",
    location: "Puspimjemenhan Salemba",
    targetParticipants: {
      tni: "Mayor s.d. Kolonel",
      pns: "Penata III/b s.d. Pembina Tk. I IV/a",
      rankTni: "Mayor - Kolonel",
      rankPns: "III/b - IV/a",
      minEducation: "TNI: Diklapa/Setingkat | PNS: S1",
      maxAge: 55,
      specialRequirements: ["Tenaga pendidik, Gadik, atau Widyaiswara di lingkungan Kemhan dan TNI"]
    },
    objectives: {
      general: "Peserta mampu menerapkan manajemen pembelajaran secara efektif guna meningkatkan kompetensi mengajar dan mutu kelas diklat.",
      specific: [
        "Mengelola psikologi belajar orang dewasa (andragogi).",
        "Menyusun bahan ajar, RBPMP, dan Rencana Pembelajaran (RP).",
        "Mempraktikkan teknik presentasi visual dan video pembelajaran."
      ]
    },
    competency: "Mampu tampil profesional dalam memfasilitasi diklat, menguasai kelas, dan menggunakan media pembelajaran modern.",
    curriculum: {
      basic: [
        "30_01 - [Bidang Studi Dasar] Kebijakan Diklat Aparatur, Widyaiswara dan Peranannya & Psikologi Belajar Orang Dewasa"
      ],
      core: [
        "30_02 - [Bidang Studi Inti] Manajemen Kelas, Media Pembelajaran & Metode Pembelajaran",
        "30_03 - [Bidang Studi Inti] Pengembangan Bahan Ajar, GBPP/RBPMD dan SAP/RP",
        "30_04 - [Bidang Studi Inti] Evaluasi Pembelajaran Diklat, Komunikasi dan Teknik Presentasi & Pelayanan Prima"
      ],
      supporting: [
        "30_05 - [Bidang Studi Pendukung] Ceramah Integritas/Etos Kerja & Praktik Mengajar (Micro Teaching)"
      ]
    }
  },
  {
    id: 31,
    code: "DIKLAT-31",
    name: "Kursus Manajemen Administrasi Pelaksanaan Anggaran Pertahanan",
    shortDescription: "Membekali staf administrasi keuangan satker tentang penatabukuan, SPAN/SAKTI, SAIBA, SIMAK BMN, perpajakan, dan pertanggungjawaban APBN.",
    category: "Manajemen",
    method: "Klasikal",
    durationDays: 90,
    durationLabel: "3 Bulan",
    startDate: "2027-09-08",
    endDate: "2027-11-03",
    displayDate: "8 September s.d. 3 November 2027",
    capacity: 30,
    boarding: "Diasramakan",
    location: "Pusdiklat Badiklat Kemhan Pondok Labu",
    targetParticipants: {
      tni: "Letda s.d. Kapten",
      pns: "Penata Muda III/a s.d. Penata III/c",
      rankTni: "Letda - Kapten",
      rankPns: "III/a - III/c",
      minEducation: "TNI: Kursus Dasar Kecabangan | PNS: S1",
      maxAge: 40,
      specialRequirements: ["Personel staf umum administrasi keuangan/keuangan satuan kerja Kemhan dan TNI"]
    },
    objectives: {
      general: "Meningkatkan kompetensi peserta dalam mengelola administrasi keuangan pertahanan secara tertib, efisien, dan transparan.",
      specific: [
        "Memahami SPP Hanneg, DIPA, dan sistem pelaksanaan anggaran.",
        "Menguasai penatabukuan, SAIBA, SIMAK BMN, dan rekonsiliasi.",
        "Menyusun laporan realisasi dan evaluasi kinerja anggaran."
      ]
    },
    competency: "Mampu menyusun pertanggungjawaban keuangan satker sesuai peraturan perbendaharaan negara tanpa temuan audit.",
    curriculum: {
      basic: [
        "31_01 - [Bidang Studi Dasar] Bela Negara, Kebijakan Umum Hanneg, Kebijakan Keuangan Negara & Reformasi Birokrasi"
      ],
      core: [
        "31_02 - [SBS Perencanaan Anggaran] SPP Hanneg, Struktur Program dan Anggaran (SPA) & RKA-K/L",
        "31_03 - [SBS Pelaksanaan Anggaran] Sistem Pelaksanaan Anggaran, Pembiayaan & Kredit Ekspor (KE)/Devisa",
        "31_04 - [SBS Laporan Anggaran] SAKIP/LAKIP & Laporan Pelaksanaan Anggaran",
        "31_05 - [SBS Pelaksanaan & Pembinaan Keuangan] Perpajakan, Penghasilan, Perjalanan Dinas, Kelengkapan SPJ, PNBP & PBJ",
        "31_06 - [SBS Penatabukuan] Dasar-Dasar Akuntansi, Sistem Akuntansi Instansi (SAI), SAIBA & SIMAK BMN",
        "31_07 - [SBS Pengendalian & Evaluasi] Pengendalian Keuangan, Laporan Keuangan (LRA, CaLK, Neraca) & Evaluasi Kinerja"
      ],
      supporting: [
        "31_08 - [SBS Aplikasi & Pendukung] Aplikasi Penyelenggaraan Administrasi Keuangan & Siskomlapku"
      ]
    }
  },
  {
    id: 32,
    code: "DIKLAT-32",
    name: "Kursus Manajemen Bendahara Keuangan Pertahanan",
    shortDescription: "Pelatihan khusus bendahara pengeluaran/penerimaan: SAKTI, SPAN, LPJ Bendahara, rekening pemerintah, rekonsiliasi bank, dan perpajakan.",
    category: "Manajemen",
    method: "Klasikal",
    durationDays: 90,
    durationLabel: "3 Bulan",
    startDate: "2027-09-08",
    endDate: "2027-11-03",
    displayDate: "8 September s.d. 3 November 2027",
    capacity: 30,
    boarding: "Diasramakan",
    location: "Pusdiklat Badiklat Kemhan Pondok Labu",
    targetParticipants: {
      tni: "Letda s.d. Kapten",
      pns: "Penata Muda III/a s.d. Penata III/c",
      rankTni: "Letda - Kapten",
      rankPns: "III/a - III/c",
      minEducation: "TNI: Suscarcab | PNS: S1",
      maxAge: 40,
      specialRequirements: ["Ditugaskan atau dipersiapkan menjadi Bendahara Pengeluaran / Penerimaan Satker"]
    },
    objectives: {
      general: "Menyiapkan bendahara yang cakap, teliti, dan berintegritas dalam menatausahakan kas negara.",
      specific: [
        "Mengoperasikan modul SPAN dan SAKTI bendahara.",
        "Menyusun Laporan Pertanggungjawaban (LPJ) Bendahara dan rekonsiliasi KPPN.",
        "Menghitung dan memotong pajak penghasilan/PPN belanja satker."
      ]
    },
    competency: "Mampu mengelola kas perbendaharaan satker, membuat LPJ Bendahara, dan menutup buku kas secara akurat.",
    curriculum: {
      basic: [
        "32_01 - [Bidang Studi Dasar] Bela Negara, Kebijakan Umum Hanneg, Kebijakan Keuangan Negara & Reformasi Birokrasi"
      ],
      core: [
        "32_02 - [SBS Manajemen Perbendaharaan] SPAN dan SAKTI, Pelaksanaan Anggaran Belanja Kemhan/TNI & RKA-KL/DIPA",
        "32_03 - [SBS Manajemen Perbendaharaan] Manajemen Pembayaran (Modul PPK dan PPSPM), PNBP & Pengeluaran Negara",
        "32_04 - [SBS Akuntansi Instansi] Sistem Akuntansi Instansi (SAI) & SIMAK BMN / SABMN (Modul Persediaan dan Aset)",
        "32_05 - [SBS Akuntansi Instansi] Akuntansi Bendahara Penerimaan, Pengeluaran, BPP, LPJ Bendahara & Rekonsiliasi",
        "32_06 - [SBS Pembinaan Keuangan] Analisa Laporan Keuangan, Standarisasi SPJ, Perpajakan, Penghasilan & Biaya Jaldis DN/LN"
      ],
      supporting: [
        "32_07 - [SBS Aplikasi & Pendukung] Latihan Praktik Aplikasi SAIBA & SAS, Keuangan BLU, Perbankan & TP/TGR"
      ]
    }
  },
  {
    id: 33,
    code: "DIKLAT-33",
    name: "Kursus Manajemen Perencanaan dan Strategis Pertahanan",
    shortDescription: "Pendidikan tingkat strategis perumusan RPJPN/RPJMN, Renstra UO Kemhan/Mabes TNI/Angkatan, evaluasi teknokratik, dan postur pertahanan negara.",
    category: "Kepemimpinan",
    method: "Klasikal",
    durationDays: 90,
    durationLabel: "3 Bulan",
    startDate: "2027-09-13",
    endDate: "2027-12-03",
    displayDate: "13 September s.d. 3 Desember 2027",
    capacity: 30,
    boarding: "Diasramakan",
    location: "Pusdiklat Badiklat Kemhan Pondok Labu",
    targetParticipants: {
      tni: "Kolonel",
      pns: "Pembina IV/a s.d. Pembina Tingkat I IV/b",
      rankTni: "Kolonel",
      rankPns: "IV/a - IV/b",
      minEducation: "TNI: Sesko TNI / Sesko Angkatan | PNS: S2 / PKA",
      maxAge: 53,
      specialRequirements: ["Pejabat perencana strategis di lingkungan Kemhan, Mabes TNI, dan Mabes Angkatan"]
    },
    objectives: {
      general: "Peserta mampu menganalisis, merencanakan, dan merumuskan strategi pertahanan negara secara terintegrasi dan berkelanjutan.",
      specific: [
        "Menyelaraskan perencanaan Satker dengan RPJPN dan RPJMN nasional.",
        "Menyusun rancangan teknokratik Renstra UO Kemhan, Mabes TNI, AD, AL, AU.",
        "Mengembangkan postur pertahanan, integrasi komponen pertahanan, dan manajemen risiko."
      ]
    },
    competency: "Mampu menyusun dokumen Renstra 5 tahunan dan evaluasi kinerja program pembangunan pertahanan negara.",
    curriculum: {
      basic: [
        "33_01 - [Bidang Studi Dasar] Hakikat Pembangunan Nasional, Doktrin, Strategi & Isu Strategis Pertahanan Negara"
      ],
      core: [
        "33_02 - [SBS Perencanaan Program] SPPN, SPP Hanneg, Penataan Wilhan, Pembinaan Komduk/Komcad & Postur Pertahanan",
        "33_03 - [SBS Jangka Panjang & Menengah] Rancangan RPJPN, RPJMN, Kebijakan Strategis & Rancangan Teknokratik Renstra",
        "33_04 - [SBS Jangka Panjang & Menengah] Rancangan Renstra UO (Kemhan, Mabes TNI, Angkatan), Renkebut Materiil & Evaluasi Renstra",
        "33_05 - [SBS Jangka Pendek] Renkebut, Renja, RKA-K/L, DIPA, RAPBN/APBN & Sumber Pinjaman (PLN, PDN, SBSN)",
        "33_06 - [SBS Jangka Pendek] SAKIP, Indikator Kinerja Utama (IKU), Perjanjian Kinerja (Perkin) & Program Kerja"
      ],
      supporting: [
        "33_07 - [SBS Aplikasi & Pendukung] Praktik Penyusunan Dokumen Renstra, Ekonomi Pertahanan & Manajemen Risiko"
      ]
    }
  },
  {
    id: 34,
    code: "DIKLAT-34",
    name: "Diklat Fungsional Analis Pertahanan Negara (APN) Ahli Madya",
    shortDescription: "Pelatihan jenjang analis pertahanan tingkat strategis: analisis ancaman, manajemen krisis, intelijen strategis, dan rekomendasi kebijakan menteri.",
    category: "Fungsional",
    method: "Klasikal",
    durationDays: 26,
    durationLabel: "1 Bulan",
    startDate: "2027-10-04",
    endDate: "2027-10-29",
    displayDate: "4 s.d. 29 Oktober 2027",
    capacity: 25,
    boarding: "Diasramakan",
    location: "Pusdiklat Badiklat Kemhan Pondok Labu",
    targetParticipants: {
      tni: "Letkol s.d. Kolonel",
      pns: "Penata Tk. I III/d s.d. Pembina Tk. I IV/b",
      rankTni: "Letkol - Kolonel",
      rankPns: "III/d - IV/b",
      minEducation: "Minimal S1/S2 Sederajat",
      maxAge: 56,
      specialRequirements: ["Telah atau diarahkan menduduki Jabatan Fungsional Analis Pertahanan Negara (APN) Ahli Madya"]
    },
    objectives: {
      general: "Peserta mampu menyusun bahan analisis tingkat strategis dan rekomendasi perumusan kebijakan di bidang pertahanan negara.",
      specific: [
        "Menganalisis dinamika lingkungan strategis global, regional, dan nasional.",
        "Menggunakan teknik analisis intelijen dan pengumpulan data strategis.",
        "Menyusun policy paper, telaahan strategis, dan karya tulis ilmiah."
      ]
    },
    competency: "Mampu memformulasikan opsi kebijakan pertahanan negara berdasarkan riset intelijen strategis yang komprehensif.",
    curriculum: {
      basic: [
        "34_01 - [Bidang Studi Dasar] Kebijakan Pertahanan Negara, Perkembangan Lingkungan Strategis, Pembinaan & Kode Etik APN"
      ],
      core: [
        "34_02 - [Bidang Studi Inti] Pengelolaan Sumber Daya Nasional & Pengintegrasian Komponen Pertahanan",
        "34_03 - [Bidang Studi Inti] Manajemen Strategi Pertahanan, Manajemen Krisis dan Konflik",
        "34_04 - [Bidang Studi Inti] Ancaman dan Risiko terhadap Pertahanan Negara",
        "34_05 - [Bidang Studi Inti] Kerja Sama di Bidang Pertahanan & Pengelolaan Industri Pertahanan"
      ],
      supporting: [
        "34_06 - [Bidang Studi Inti] Teknik Pengumpulan & Analisis Data, Analisis Intelijen, Karya Tulis Ilmiah & Seminar"
      ]
    }
  },
  {
    id: 35,
    code: "DIKLAT-35",
    name: "Pelatihan Jarak Jauh Strategic Management And Creative Thinking",
    shortDescription: "Pelatihan daring untuk memadukan analisis strategi jangka panjang dengan ide-ide kreatif dan inovasi pemecahan masalah.",
    category: "Manajemen",
    method: "Daring (PJJ)",
    durationDays: 4,
    durationLabel: "4 Hari",
    startDate: "2027-10-04",
    endDate: "2027-10-07",
    displayDate: "4 s.d. 7 Oktober 2027",
    capacity: 100,
    boarding: "Daring / Online (Zoom)",
    location: "Zoom Virtual Badiklat Kemhan",
    targetParticipants: {
      tni: "Serda s.d. Mayor",
      pns: "Pengatur Muda II/a s.d. Penata Tk. I III/d",
      pppk: "Golongan VI s.d. X",
      rankTni: "Serda - Mayor",
      rankPns: "II/a - III/d",
      rankPppk: "VI - X",
      minEducation: "SLTA / D3 / S1",
      maxAge: 55,
      specialRequirements: ["Personel TNI dan ASN Kemhan dengan perangkat laptop berkamera"]
    },
    objectives: {
      general: "Mampu memadukan pemikiran strategis dan kreativitas dalam menyelesaikan masalah serta merumuskan inovasi unit kerja.",
      specific: [
        "Menjelaskan konsep dasar Strategic Management.",
        "Menerapkan teknik Creative Thinking dalam mengatasi kebuntuan organisasi.",
        "Mengintegrasikan strategi dan kreativitas untuk inovasi berkelanjutan."
      ]
    },
    competency: "Mampu menghasilkan alternatif solusi kreatif yang aplikatif untuk mendukung efektivitas pengambilan keputusan strategis.",
    curriculum: {
      basic: [
        "35_01 - Konsep Dasar Strategic Management",
        "35_02 - Konsep Creative Thinking dalam Manajemen"
      ],
      core: [
        "35_03 - Integrasi Strategic Management dan Creative Thinking",
        "35_04 - Tantangan Integrasi Strategi dan Kreativitas"
      ],
      supporting: [
        "35_05 - Implementasi Strategic Management and Creative Thinking dalam Organisasi"
      ]
    }
  },
  {
    id: 36,
    code: "DIKLAT-36",
    name: "Diklat Fungsional Assessor Sumber Daya Manusia Aparatur",
    shortDescription: "Pelatihan pembentukan jabatan fungsional assessor: metode assessment center, teknik observasi, wawancara kompetensi, LGD, dan pelaporan.",
    category: "Fungsional",
    method: "Klasikal",
    durationDays: 60,
    durationLabel: "2 Bulan",
    startDate: "2027-10-11",
    endDate: "2027-12-03",
    displayDate: "11 Oktober s.d. 3 Desember 2027",
    capacity: 25,
    boarding: "Tidak Diasramakan",
    location: "Assessment Center Badiklat Kemhan Salemba",
    targetParticipants: {
      pns: "Minimal Penata Muda III/a",
      rankPns: "III/a ke atas",
      minEducation: "Minimal S1",
      maxAge: 45,
      specialRequirements: ["PNS yang akan diangkat menduduki Jabatan Fungsional Assessor SDM Aparatur"]
    },
    objectives: {
      general: "Menyiapkan Assessor SDM Aparatur yang kompeten dalam menyelenggarakan penilaian kompetensi pegawai sesuai NSPK BKN.",
      specific: [
        "Menyusun rencana asesmen dan memilih instrumen psikometri/simulasi.",
        "Melakukan observasi LGD, presentasi, wawancara kompetensi, dan case analysis.",
        "Mengintegrasikan data hasil asesmen dan menyusun laporan individual."
      ]
    },
    competency: "Mampu bertindak sebagai assessor independen dan menyusun profil kompetensi ASN untuk talent management.",
    curriculum: {
      basic: [
        "36_01 - [Bidang Studi Dasar] Kebijakan Manajemen ASN, Pembinaan Karier Assessor SDM & Kode Etik Assessor",
        "36_02 - [Bidang Studi Dasar] Manajemen SDM Berbasis Kompetensi & Organisasi Pemerintah Pusat dan Daerah"
      ],
      core: [
        "36_03 - [Bidang Studi Inti] Pengantar Assessment Center dan Psikologi, Keterampilan Observasi & Review Kompetensi",
        "36_04 - [Bidang Studi Inti] Administrasi & Skoring Simulasi LGD, Presentasi, Case Analysis & Wawancara Kompetensi",
        "36_05 - [Bidang Studi Inti] Integrasi Data Assessment, Penulisan Laporan, Feedback & Evaluasi Kegiatan Assessment"
      ],
      supporting: [
        "36_06 - [Bidang Studi Inti] Rancangan Assessment Center, Pemagangan, Uji Kompetensi, Tim Penilai & KTI"
      ]
    }
  },
  {
    id: 37,
    code: "DIKLAT-37",
    name: "Pelatihan Fungsional Pranata Komputer Kategori Keahlian",
    shortDescription: "Pelatihan pembentukan JF Pranata Komputer Tingkat Ahli: manajemen layanan IT, jaringan, keamanan info, enterprise architecture, dan audit sistem.",
    category: "Fungsional",
    method: "Klasikal",
    durationDays: 60,
    durationLabel: "2 Bulan",
    startDate: "2027-10-11",
    endDate: "2027-12-03",
    displayDate: "11 Oktober s.d. 3 Desember 2027",
    capacity: 25,
    boarding: "Diasramakan",
    location: "Pusdiklat Badiklat Kemhan Salemba / Pondok Labu",
    targetParticipants: {
      tni: "Minimal Letda (S1 Informatika/Komputer)",
      pns: "Minimal Penata Muda III/a (S1 TI/Komputer)",
      rankTni: "Letda ke atas",
      rankPns: "III/a ke atas",
      minEducation: "S1 Bidang Teknologi Informasi / Ilmu Komputer",
      maxAge: 45,
      specialRequirements: ["PNS menduduki JF Prakom Ahli Pertama maks 3 tahun / TNI di bidang TIK"]
    },
    objectives: {
      general: "Memenuhi kompetensi teknis teknologi informasi sebagai syarat memangku Jabatan Fungsional Pranata Komputer Tingkat Ahli.",
      specific: [
        "Menguasai tata kelola IT Service Management dan arsitektur enterprise.",
        "Mengelola basis data, sistem jaringan, dan manajemen risiko infrastruktur IT.",
        "Menyusun dokumentasi sistem dan pelaporan angka kredit fungsional."
      ]
    },
    competency: "Mampu mengelola siklus pengembangan perangkat lunak, infrastruktur server, dan audit sistem informasi instansi.",
    curriculum: {
      basic: [
        "37_01 - [Bidang Studi Dasar] Bela Negara dalam Perspektif Pertahanan, Standar Manajemen Keamanan Informasi & Etika Profesi TI"
      ],
      core: [
        "37_02 - [Bidang Studi Inti] Sistem Penilaian dan Administrasi Pranata Komputer & Manajemen Layanan IT",
        "37_03 - [Bidang Studi Inti] Pengelolaan Data, Sistem Jaringan Komputer & Manajemen Infrastruktur IT",
        "37_04 - [Bidang Studi Inti] Audit IT, Sistem Informasi & Pengolahan Data",
        "37_05 - [Bidang Studi Inti] Area TI Spesial, IT Enterprise & Manajemen Risiko IT"
      ],
      supporting: [
        "37_06 - [Bidang Studi Inti & Pendukung] Dokumentasi Laporan, Implementasi Kerja & Laboratorium Pranata Komputer"
      ]
    }
  },
  {
    id: 38,
    code: "DIKLAT-38",
    name: "Kursus Manajemen Penatausahaan Barang Milik Negara Pertahanan",
    shortDescription: "Pengelolaan aset negara: perencanaan kebutuhan, inventarisasi SIMAN, aplikasi SIMAK BMN, hibah, pemindahtanganan, dan pengamanan aset militer.",
    category: "Manajemen",
    method: "Klasikal",
    durationDays: 45,
    durationLabel: "1.5 Bulan",
    startDate: "2027-10-25",
    endDate: "2027-12-03",
    displayDate: "25 Oktober s.d. 3 Desember 2027",
    capacity: 30,
    boarding: "Diasramakan",
    location: "Pusdiklat Badiklat Kemhan Pondok Labu",
    targetParticipants: {
      tni: "Mayor s.d. Letkol",
      pns: "Penata Muda III/a s.d. Penata III/c",
      rankTni: "Mayor - Letkol",
      rankPns: "III/a - III/c",
      minEducation: "TNI: Diklapa II/Suslapa | PNS: S1/Diklatpim Tk. IV",
      maxAge: 53,
      specialRequirements: ["Personel yang membidangi pengelolaan logistik dan Barang Milik Negara"]
    },
    objectives: {
      general: "Meningkatkan kemampuan personel dalam menatausahakan BMN bidang pertahanan secara tertib, akuntabel, dan transparan.",
      specific: [
        "Mengoperasikan SIMAN (Sistem Informasi Manajemen Aset Negara) dan SIMAK BMN.",
        "Memahami prosedur penilaian, pemindahtanganan, hibah, dan penghapusan BMN.",
        "Melakukan pengamanan hukum dan fisik terhadap tanah/bangunan/materiil TNI-Kemhan."
      ]
    },
    competency: "Mampu menyajikan laporan BMN yang valid dan terintegrasi dengan laporan keuangan instansi pemerintah.",
    curriculum: {
      basic: [
        "38_01 - [Bidang Studi Dasar] Bela Negara, Kebijakan Umum Hanneg, Kebijakan APBN & Kebijakan Penatausahaan BMN"
      ],
      core: [
        "38_02 - [SBS Manajemen Keuangan] Pengelolaan dan Tanggung Jawab Keuangan Negara, Perbendaharaan Negara & SAI",
        "38_03 - [SBS Manajemen BMN] Perencanaan Kebutuhan BMN, Penggunaan, Pemanfaatan & Penatausahaan BMN",
        "38_04 - [SBS Manajemen BMN] Kodefikasi, Registrasi, Pengamanan, Pemeliharaan & Penilaian Barang Milik Negara",
        "38_05 - [SBS Manajemen BMN] SIMAK BMN, Hibah BMN, Penghapusan, Pemindahtanganan & Pengawasan Pengendalian BMN"
      ],
      supporting: [
        "38_06 - [SBS Aplikasi & Pendukung] Latihan Praktik Aplikasi Persediaan, SIMAK BMN & Sistem Informasi Manajemen Aset Negara (SIMAN)"
      ]
    }
  },
  {
    id: 39,
    code: "DIKLAT-39",
    name: "Diklat Fungsional Pengangkatan Arsiparis Tingkat Ahli",
    shortDescription: "Pelatihan pengangkatan jabatan fungsional arsiparis: arsip dinamis, arsip statis, arsip vital/terjaga, alih media digital, dan sistem kearsipan militer.",
    category: "Fungsional",
    method: "Klasikal",
    durationDays: 60,
    durationLabel: "2 Bulan",
    startDate: "2027-10-25",
    endDate: "2027-12-03",
    displayDate: "25 Oktober s.d. 3 Desember 2027",
    capacity: 25,
    boarding: "Diasramakan",
    location: "Pusdiklat Badiklat Kemhan Salemba",
    targetParticipants: {
      tni: "Kolonel",
      pns: "Pembina IV/a s.d. Pembina Tingkat I IV/b",
      rankTni: "Kolonel",
      rankPns: "IV/a - IV/b",
      minEducation: "TNI: Sesko TNI/Angkatan | PNS: S1",
      maxAge: 53,
      specialRequirements: ["Personel yang akan diangkat dalam Jabatan Fungsional Arsiparis Tingkat Ahli"]
    },
    objectives: {
      general: "Membekali peserta kemampuan profesional dalam pengelolaan arsip dinamis, statis, dan elektronik di lingkungan Kemhan dan TNI.",
      specific: [
        "Mengelola arsip dinamis aktif, inaktif, vital, dan berkas terjaga.",
        "Melakukan akuisisi, preservasi, dan penataan arsip statis.",
        "Menerapkan alih media arsip digital dan tata naskah kearsipan militer."
      ]
    },
    competency: "Mampu menyusun jadwal retensi arsip, mengamankan arsip rahasia negara, dan mengelola arsip digital modern.",
    curriculum: {
      basic: [
        "39_01 - [Bidang Studi Dasar] Kebijakan Kearsipan Nasional, Pengantar, Penyelenggaraan, Sejarah & Aspek Hukum Kearsipan"
      ],
      core: [
        "39_02 - [Tata Kelola Arsip Dinamis] Tata Naskah Dinas, Klasifikasi Arsip, Sistem Keamanan/Akses & Jadwal Retensi Arsip (JRA)",
        "39_03 - [Tata Kelola Arsip Dinamis] Manajemen Persuratan, Pengelolaan Arsip Aktif/Inaktif, Penyusutan, Arsip Vital & Terjaga",
        "39_04 - [Tata Kelola Arsip Statis] Penilaian, Akuisisi, Deskripsi, Penataan, Penyimpanan & Preservasi Arsip Statis",
        "39_05 - [Tata Kelola Arsip Statis] Layanan Kearsipan, Diseminasi Publikasi & Literasi Arsip sebagai Memori Kolektif Bangsa",
        "39_06 - [Arsip Elektronik & Pengawasan] Pengelolaan Arsip Elektronik, Alih Media Arsip, Pembinaan & Pengawasan Kearsipan"
      ],
      supporting: [
        "39_07 - [Pendukung & PKL] Jabatan Fungsional Arsiparis, Wawasan Kearsipan & Praktik Kerja Lapangan (PKL/Magang)"
      ]
    }
  },
  {
    id: 40,
    code: "DIKLAT-40",
    name: "Pelatihan Manajemen Risiko",
    shortDescription: "Identifikasi potensi risiko, analisis likelihood & impact, penyusunan risk register, strategi mitigasi, dan rencana kontinjensi bagi kader Eselon II.",
    category: "Manajemen",
    method: "Klasikal",
    durationDays: 5,
    durationLabel: "5 Hari",
    startDate: "2027-11-01",
    endDate: "2027-11-05",
    displayDate: "1 s.d. 5 November 2027",
    capacity: 30,
    boarding: "Tidak Diasramakan",
    location: "Puspimjemenhan Salemba",
    targetParticipants: {
      tni: "Kapten s.d. Mayor",
      pns: "Penata III/a s.d. Penata Tk. I III/d",
      rankTni: "Kapten - Mayor",
      rankPns: "III/a - III/d",
      minEducation: "TNI: Diklapa I | PNS: S1",
      maxAge: 55,
      specialRequirements: ["Diarahkan untuk menduduki Jabatan Eselon II / Pimpinan unit kerja masa depan"]
    },
    objectives: {
      general: "Menghasilkan aparatur yang memiliki kompetensi sistematis dalam mengidentifikasi, mengukur, dan memitigasi risiko kedinasan.",
      specific: [
        "Menjelaskan kerangka kerja manajemen risiko SNI ISO 31000.",
        "Menyusun matriks profil risiko (risk assessment matrix) satker.",
        "Merumuskan strategi perlakuan risiko dan crisis & contingency planning."
      ]
    },
    competency: "Mampu menyusun dokumen pelaporan manajemen risiko sebagai bahan pengambilan keputusan pimpinan.",
    curriculum: {
      basic: [
        "40_01 - Pengantar dan Kerangka Kerja Manajemen Risiko"
      ],
      core: [
        "40_02 - Metodologi Identifikasi Risiko (Risk Identification)",
        "40_03 - Analisis dan Penilaian Risiko (Risk Analysis & Evaluation)",
        "40_04 - Strategi Mitigasi dan Respons Risiko",
        "40_05 - Manajemen Krisis dan Perencanaan Kontinjensi (Crisis & Contingency Planning)"
      ],
      supporting: [
        "40_06 - Monitoring, Evaluasi, dan Pelaporan Kinerja Risiko"
      ]
    }
  },
  {
    id: 41,
    code: "DIKLAT-41",
    name: "Pelatihan Big Data Analysis",
    shortDescription: "Pengolahan dataset pertahanan dengan bahasa pemrograman R: data cleansing, visualisasi eksploratif, prediktif analytics, dan machine learning dasar.",
    category: "Teknis & Siber",
    method: "Klasikal",
    durationDays: 14,
    durationLabel: "14 Hari",
    startDate: "2027-11-08",
    endDate: "2027-11-25",
    displayDate: "8 s.d. 25 November 2027",
    capacity: 25,
    boarding: "Diasramakan",
    location: "Lab Komputer Badiklat Kemhan Pondok Labu",
    targetParticipants: {
      tni: "Sertu s.d. Mayor",
      pns: "Pengatur II/c s.d. Penata Tk. I III/d",
      rankTni: "Sertu - Mayor",
      rankPns: "II/c - III/d",
      minEducation: "Minimal D3 Bidang Komputer/IT atau statistik",
      maxAge: 45,
      specialRequirements: ["Mampu mengoperasikan komputer, Excel mahir, dan staf data unit kerja"]
    },
    objectives: {
      general: "Peserta mampu mengimplementasikan analisis big data untuk mendukung intelijen data dan pengambilan keputusan pertahanan.",
      specific: [
        "Menghimpun dan mengelola data berukuran besar menggunakan software R.",
        "Melakukan Analisis Data Eksploratif (EDA) dan visualisasi grafik tingkat lanjut.",
        "Menerapkan algoritma machine learning prediktif untuk tren pertahanan."
      ]
    },
    competency: "Mampu menghasilkan insight analitik dari data mentah pertahanan melalui pipeline data science.",
    curriculum: {
      basic: [
        "41_01 - [Bidang Studi Dasar] Pengetahuan Bela Negara dalam Sishanneg & Cyber Security Awareness"
      ],
      core: [
        "41_02 - [Bidang Studi Inti] Pengenalan Big Data dan R",
        "41_03 - [Bidang Studi Inti] Manajemen Data dengan R",
        "41_04 - [Bidang Studi Inti] Analisis Data Eksploratif (EDA)",
        "41_05 - [Bidang Studi Inti] Pengenalan Analisis Prediktif",
        "41_06 - [Bidang Studi Inti] Teknik-Teknik Machine Learning & Teknik-Teknik Lanjutan Machine Learning"
      ],
      supporting: [
        "41_07 - [Bidang Studi Inti] Proyek Akhir Praktik Big Data"
      ]
    }
  },
  {
    id: 42,
    code: "DIKLAT-42",
    name: "Pelatihan Jarak Jauh Digital Innovation and ASN Core Values for Modern Defense Governance",
    shortDescription: "Pelatihan online akselerasi inovasi birokrasi pertahanan: transformasi digital, AI governance, serta internalisasi nilai BerAKHLAK.",
    category: "Manajemen",
    method: "Daring (PJJ)",
    durationDays: 4,
    durationLabel: "4 Hari",
    startDate: "2027-11-08",
    endDate: "2027-11-11",
    displayDate: "8 s.d. 11 November 2027",
    capacity: 100,
    boarding: "Daring / Online (Zoom)",
    location: "Virtual Zoom Class Puspimjemenhan",
    targetParticipants: {
      tni: "Serda s.d. Mayor",
      pns: "Pengatur Muda II/a s.d. Penata Tk. I III/d",
      pppk: "Golongan VI s.d. X",
      rankTni: "Serda - Mayor",
      rankPns: "II/a - III/d",
      rankPppk: "VI - X",
      minEducation: "SLTA / D3 / S1",
      maxAge: 55,
      specialRequirements: ["Personel TNI, PNS, dan PPPK Kemhan"]
    },
    objectives: {
      general: "Meningkatkan kompetensi ASN dalam inovasi digital dan internalisasi nilai BerAKHLAK untuk tata kelola pertahanan modern.",
      specific: [
        "Memahami pilar transformasi digital tata kelola pertahanan.",
        "Menginternalisasi core values BerAKHLAK di era digital.",
        "Merancang gagasan inovasi digital administrasi di satker masing-masing."
      ]
    },
    competency: "Mampu menunjukkan sikap adaptif terhadap digitalisasi dan berintegritas tinggi dalam pelayanan pertahanan.",
    curriculum: {
      basic: [
        "42_01 - Digital Transformation in Defense Governance"
      ],
      core: [
        "42_02 - Digital Innovation for Modern Defense Administration",
        "42_03 - ASN Core Values (BerAKHLAK) in the Digital Era",
        "42_04 - Digital Mindset and Adaptive ASN"
      ],
      supporting: [
        "42_05 - Data-Driven Defense Governance"
      ]
    }
  },
  {
    id: 43,
    code: "DIKLAT-43",
    name: "Pelatihan Pembuatan Video Pembelajaran",
    shortDescription: "Pelatihan praktis editing video multimedia untuk widyaiswara/pengajar: Adobe Premiere, penulisan storyboard naskah, audio mixing, dan visual effect.",
    category: "Teknis & Siber",
    method: "Klasikal",
    durationDays: 10,
    durationLabel: "10 Hari",
    startDate: "2027-11-08",
    endDate: "2027-11-19",
    displayDate: "8 s.d. 19 November 2027",
    capacity: 25,
    boarding: "Diasramakan",
    location: "Lab Multimedia Badiklat Kemhan Pondok Labu",
    targetParticipants: {
      tni: "Minimal Perwira",
      pns: "Minimal Penata Muda Tk. I III/b",
      rankTni: "Letda - Kolonel",
      rankPns: "III/b ke atas",
      minEducation: "Minimal S2",
      maxAge: 55,
      specialRequirements: ["Diutamakan tenaga pengajar / Widyaiswara Puspimjemenhan BPSDM Kemhan"]
    },
    objectives: {
      general: "Peserta mampu merancang, memproduksi, dan menyunting video pembelajaran berkualitas tinggi untuk materi e-learning pertahanan.",
      specific: [
        "Mengoperasikan perangkat lunak video editing (Adobe Premiere Pro).",
        "Menguasai transisi video, titling, mixing audio, dan efek visual.",
        "Memproduksi video pembelajaran interaktif berdurasi 5-10 menit."
      ]
    },
    competency: "Mampu mempublikasikan video konten edukasi yang menarik, komunikatif, dan sesuai standar pedagogi digital.",
    curriculum: {
      basic: [      ],
      core: [
        "43_01 - [Bidang Studi Inti] Pengenalan Adobe Premiere",
        "43_02 - [Bidang Studi Inti] Mengenal dan Menggunakan Transisi dan Teks",
        "43_03 - [Bidang Studi Inti] Mengenal dan Menggunakan Efek Video",
        "43_04 - [Bidang Studi Inti] Membuat Title",
        "43_05 - [Bidang Studi Inti] Mengedit Audio & Export Movie",
        "43_06 - [Bidang Studi Inti] Praktik Editing Video & Praktik Editing Video Tahap Lanjut"
      ],
      supporting: [
        "43_07 - [Bidang Studi Pendukung] Dinamika Kelompok & Evaluasi Penyelenggaraan Pelatihan"
      ]
    }
  }
];
