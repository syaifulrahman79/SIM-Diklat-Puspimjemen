import { TRAINING_PROGRAMS, TrainingProgram } from './programsData.ts';

export interface ParticipantProfile {
  name: string;
  category: 'TNI' | 'PNS' | 'PPPK';
  serviceBranch?: 'TNI AD' | 'TNI AL' | 'TNI AU' | 'Kemhan RI' | 'Mabes TNI' | 'Polri' | 'Kementerian / Lembaga';
  rank: string; // e.g., 'Mayor', 'Letkol', 'Kolonel', 'Serda', 'Penata III/c', 'Pembina IV/a', 'Golongan VII'
  education: 'SLTA/Sederajat' | 'D3' | 'S1/D4' | 'S2' | 'S3';
  educationMajor?: string;
  militaryEducation?: string; // Diklapa I, Diklapa II, Sesko Angkatan, Sesko TNI, Susgadik, dll
  age: number;
  yearsInRank?: number;
  currentPosition?: string;
  hasMedicalSTR?: boolean;
  hasUjianDinas?: boolean;
  hasSusgadik?: boolean;
  hasDiklatWI?: boolean;
  hasPKA?: boolean;
  hasPKP?: boolean;
  specialNotes?: string;
}

export interface EligibilityResult {
  program: TrainingProgram;
  status: 'ELIGIBLE' | 'CONSIDERATION' | 'INELIGIBLE';
  score: number; // 0 to 100
  reasons: string[];
  recommendations: string[];
}

// Rank ordering weights for quick evaluation
const TNI_RANKS_ORDER: Record<string, number> = {
  'Tamtama': 10,
  'Prada': 11, 'Pratu': 12, 'Praka': 13, 'Kopda': 14, 'Koptu': 15, 'Kopka': 16,
  'Bintara': 20,
  'Serda': 21, 'Sertu': 22, 'Serka': 23, 'Serma': 24, 'Pelda': 25, 'Peltu': 26,
  'Pama': 30,
  'Letda': 31, 'Lettu': 32, 'Kapten': 33,
  'Pamen': 40,
  'Mayor': 41, 'Letkol': 42, 'Kolonel': 43,
  'Pati': 50,
  'Brigjen': 51, 'Mayjen': 52, 'Letjen': 53, 'Jenderal': 54
};

const PNS_RANKS_ORDER: Record<string, number> = {
  'Pengatur Muda (II/a)': 21,
  'Pengatur Muda Tk. I (II/b)': 22,
  'Pengatur (II/c)': 23,
  'Pengatur Tk. I (II/d)': 24,
  'Penata Muda (III/a)': 31,
  'Penata Muda Tk. I (III/b)': 32,
  'Penata (III/c)': 33,
  'Penata Tk. I (III/d)': 34,
  'Pembina (IV/a)': 41,
  'Pembina Tk. I (IV/b)': 42,
  'Pembina Utama Muda (IV/c)': 43,
  'Pembina Utama Madya (IV/d)': 44,
  'Pembina Utama (IV/e)': 45
};

const PPPK_RANKS_ORDER: Record<string, number> = {
  'Golongan V': 21,
  'Golongan VI': 22,
  'Golongan VII': 23,
  'Golongan VIII': 24,
  'Golongan IX': 31,
  'Golongan X': 32,
  'Golongan XI': 33,
  'Golongan XII': 34
};

export function evaluateEligibility(profile: ParticipantProfile): EligibilityResult[] {
  return TRAINING_PROGRAMS.map((program) => {
    const reasons: string[] = [];
    const recommendations: string[] = [];
    let isEligible = true;
    let isConsideration = false;
    let score = 70;

    // 1. Age Check
    if (program.targetParticipants.maxAge) {
      if (profile.age > program.targetParticipants.maxAge) {
        isEligible = false;
        reasons.push(`Usia ${profile.age} tahun melampaui batas maksimal program (${program.targetParticipants.maxAge} tahun).`);
      } else {
        score += 10;
        reasons.push(`Usia ${profile.age} tahun memenuhi kriteria (maks. ${program.targetParticipants.maxAge} thn).`);
      }
    }

    // 2. Category & Rank Check
    if (profile.category === 'TNI') {
      if (!program.targetParticipants.tni) {
        isEligible = false;
        reasons.push(`Program ini dikhususkan bagi ASN / PNS dan tidak mengalokasikan peserta TNI.`);
      } else {
        const reqStr = program.targetParticipants.tni.toLowerCase();
        const pRank = profile.rank.toLowerCase();

        if (reqStr.includes('kolonel') && !reqStr.includes('mayor') && !pRank.includes('kolonel')) {
          isEligible = false;
          reasons.push(`Dikhususkan untuk Perwira Menengah berpangkat Kolonel.`);
        } else if (reqStr.includes('mayor s.d. letkol') && !pRank.includes('mayor') && !pRank.includes('letkol')) {
          if (pRank.includes('kolonel') || pRank.includes('kapten')) {
            isConsideration = true;
            score -= 15;
            reasons.push(`Pangkat ${profile.rank} di luar target ideal (Mayor s.d. Letkol), dapat diusulkan melalui dispensasi pimpinan.`);
          } else {
            isEligible = false;
            reasons.push(`Persyaratan kepangkatan TNI adalah Mayor s.d. Letkol.`);
          }
        } else if (reqStr.includes('kapten s.d. mayor') && !pRank.includes('kapten') && !pRank.includes('mayor')) {
          if (pRank.includes('letkol') || pRank.includes('lettu')) {
            isConsideration = true;
            score -= 15;
            reasons.push(`Pangkat ${profile.rank} di luar rentang Kapten - Mayor.`);
          } else {
            isEligible = false;
            reasons.push(`Persyaratan pangkat TNI adalah Kapten s.d. Mayor.`);
          }
        } else if (reqStr.includes('letda s.d. kapten') && !pRank.includes('letda') && !pRank.includes('lettu') && !pRank.includes('kapten')) {
          isEligible = false;
          reasons.push(`Persyaratan pangkat TNI adalah Pama (Letda s.d. Kapten).`);
        } else if (reqStr.includes('minimal bintara') && pRank.includes('tamtama')) {
          isEligible = false;
          reasons.push(`Pangkat minimal Bintara (Serda ke atas).`);
        } else {
          score += 15;
          reasons.push(`Pangkat ${profile.rank} sesuai target sasaran peserta TNI.`);
        }
      }
    } else if (profile.category === 'PNS') {
      if (!program.targetParticipants.pns) {
        isEligible = false;
        reasons.push(`Program tidak dialokasikan untuk PNS.`);
      } else {
        const pnsReq = program.targetParticipants.pns.toLowerCase();
        const pRank = profile.rank.toLowerCase();

        if (pnsReq.includes('pembina iv') && !pRank.includes('iv/')) {
          isEligible = false;
          reasons.push(`Dikhususkan bagi PNS Golongan IV (Pembina).`);
        } else if (pnsReq.includes('iii/c s.d. iii/d') && !pRank.includes('iii/c') && !pRank.includes('iii/d')) {
          if (pRank.includes('iii/b') || pRank.includes('iv/a')) {
            isConsideration = true;
            score -= 15;
            reasons.push(`Pangkat Anda mendekati syarat (III/c - III/d), berpotensi diusulkan dengan surat pertimbangan.`);
          } else {
            isEligible = false;
            reasons.push(`Syarat pangkat PNS minimal Penata III/c s.d. III/d.`);
          }
        } else if (pnsReq.includes('pengatur ii/c') && pRank.includes('ii/a') && !pRank.includes('ii/c') && !pRank.includes('ii/d') && !pRank.includes('iii/')) {
          isEligible = false;
          reasons.push(`Syarat pangkat PNS minimal Pengatur II/c.`);
        } else {
          score += 15;
          reasons.push(`Pangkat/Golongan ${profile.rank} memenuhi syarat PNS.`);
        }
      }
    } else if (profile.category === 'PPPK') {
      if (!program.targetParticipants.pppk) {
        isEligible = false;
        reasons.push(`Program ini belum membuka formasi untuk PPPK.`);
      } else {
        score += 15;
        reasons.push(`Tersedia kuota untuk PPPK (${program.targetParticipants.pppk}).`);
      }
    }

    // 3. Education Check
    const minEdu = program.targetParticipants.minEducation.toLowerCase();
    if (minEdu.includes('s2') && profile.education !== 'S2' && profile.education !== 'S3') {
      isEligible = false;
      reasons.push(`Pendidikan minimal S2/Pascasarjana (saat ini ${profile.education}).`);
    } else if (minEdu.includes('s1') && (profile.education === 'SLTA/Sederajat' || profile.education === 'D3')) {
      isEligible = false;
      reasons.push(`Pendidikan minimal S1/D4 (saat ini ${profile.education}).`);
    } else if (minEdu.includes('d3') && profile.education === 'SLTA/Sederajat') {
      isEligible = false;
      reasons.push(`Pendidikan minimal D3 (saat ini ${profile.education}).`);
    } else {
      score += 10;
      reasons.push(`Pendidikan (${profile.education}) memenuhi ketentuan.`);
    }

    // 4. Special program checks
    // BNLS / K3RS / Emergency Nursing (Health)
    if (program.id === 4 || program.id === 28) {
      if (!profile.hasMedicalSTR) {
        isEligible = false;
        reasons.push(`Wajib memiliki STR (Surat Tanda Registrasi) Tenaga Keperawatan aktif.`);
      }
    }
    // Alih Golongan II ke III
    if (program.id === 17) {
      if (!profile.hasUjianDinas) {
        isConsideration = true;
        reasons.push(`Disyaratkan telah lulus Ujian Dinas Tk. I atau Ujian Penyesuaian Kenaikan Pangkat (UPKP).`);
      }
    }
    // Penguatan WI
    if (program.id === 8) {
      if (!profile.hasDiklatWI) {
        isEligible = false;
        reasons.push(`Wajib telah mengikuti dan lulus Diklat Pembentukan Calon Widyaiswara.`);
      }
    }
    // TOT Alih Golongan
    if (program.id === 23) {
      if (profile.category === 'TNI' && !profile.hasSusgadik) {
        recommendations.push(`Prioritas bagi perwira yang telah mengikuti Susgadik.`);
      }
    }
    // PKA / PKP
    if (program.id === 15 && !profile.hasPKP && !profile.hasPKA) {
      recommendations.push(`Diperuntukkan bagi pejabat administrator / JF madya atau pengawas berprestasi.`);
    }

    let finalStatus: 'ELIGIBLE' | 'CONSIDERATION' | 'INELIGIBLE' = 'ELIGIBLE';
    if (!isEligible) {
      finalStatus = 'INELIGIBLE';
      score = Math.min(score, 40);
    } else if (isConsideration) {
      finalStatus = 'CONSIDERATION';
      score = Math.min(score, 68);
    } else {
      finalStatus = 'ELIGIBLE';
      score = Math.min(100, score);
    }

    if (finalStatus === 'ELIGIBLE') {
      recommendations.push(`Segera ajukan usulan melalui Kasatker/Kasubsatker ke Biro Kepegawaian Setjen Kemhan.`);
    } else if (finalStatus === 'CONSIDERATION') {
      recommendations.push(`Konsultasikan dengan bagian kepegawaian satker untuk pengajuan dispensasi kualifikasi.`);
    } else {
      recommendations.push(`Pertimbangkan program pelatihan lain yang sesuai dengan jenjang kepangkatan dan kualifikasi Anda saat ini.`);
    }

    return {
      program,
      status: finalStatus,
      score,
      reasons,
      recommendations
    };
  });
}
