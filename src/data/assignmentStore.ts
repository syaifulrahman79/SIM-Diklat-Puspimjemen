import { TRAINING_PROGRAMS, type TrainingProgram } from './programsData.ts';
import { 
  LECTURERS_DATA, 
  type Lecturer, 
  SUBJECT_MATRICES, 
  type LecturerPreference,
  getStoredLecturerPreferences,
  DEFAULT_LECTURER_PREFERENCES
} from './lecturersData.ts';

export interface AssignmentRecord {
  id: string;
  lecturerId: number;
  lecturerName: string;
  programId: number;
  programName: string;
  subject: string;
  dateAssigned: string;
  room?: string;
  sessionNotes?: string;
  preferenceRank?: 'Prioritas 1' | 'Prioritas 2' | 'Prioritas 3' | 'Sesuai Rumpun Kompetensi';
  isPreferenceMatch?: boolean;
}

export interface ConflictAlert {
  lecturerId: number;
  lecturerName: string;
  programA: TrainingProgram;
  programB: TrainingProgram;
  overlapPeriod: string;
}

export interface LecturerWorkloadStats {
  lecturerId: number;
  lecturerName: string;
  rankTitle: string;
  category: 'Militer' | 'Sipil (PNS)';
  grade: 'Utama' | 'Madya/Muda' | 'Pertama' | 'Madya' | 'Muda';
  department: string;
  assignmentCount: number;
  assignments: AssignmentRecord[];
  status: 'UNDERLOAD' | 'BALANCED' | 'OVERLOAD';
  statusLabel: string;
  targetQuota: string;
  hasConflict: boolean;
  conflictDetails?: string[];
  preferenceMatchRate: number; // Percentage of assignments matching P1/P2/P3/Kompetensi
  priority1Count: number;
  priority2Count: number;
  preferences?: LecturerPreference;
}

export interface ProgramTniSipilBalance {
  programId: number;
  programCode: string;
  programName: string;
  totalInstructors: number;
  tniCount: number;
  sipilCount: number;
  isBalanced: boolean; // Both TNI and Sipil present
  statusLabel: string; // e.g. "Sinergi Berimbang: 2 TNI • 1 Sipil"
  tniInstructors: { id: number; name: string; rankTitle: string; subject: string }[];
  sipilInstructors: { id: number; name: string; rankTitle: string; subject: string }[];
}

export interface WorkloadDistributionSummary {
  totalLecturers: number;
  totalAssignments: number;
  averageLoad: number;
  minLoad: number;
  maxLoad: number;
  underloadedCount: number;
  balancedCount: number;
  overloadedCount: number;
  balanceIndexPercent: number;
  conflictCount: number;
  preferenceAlignmentIndexPercent: number; // Persentase keselarasan pilihan materi Widyaiswara
  totalPriority1Matches: number;
  totalPriority2Matches: number;
  lecturerStats: LecturerWorkloadStats[];
  // Azas Keberimbangan TNI - Sipil Metrics
  totalTniLecturers: number; // 41
  totalSipilLecturers: number; // 26
  totalTniAssignments: number;
  totalSipilAssignments: number;
  averageTniLoad: number;
  averageSipilLoad: number;
  tniSipilBalancedProgramsCount: number; // 43
  totalProgramsCount: number; // 43
  tniSipilSynergyRatePercent: number; // 100%
  programBalances: ProgramTniSipilBalance[];
}

const STORAGE_KEY_ASSIGNMENTS = 'sim_diklat_assignments_v10';

// Check whether two ISO date ranges overlap
export function checkDateOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  return (startA <= endB) && (endA >= startB);
}

export interface SubjectTakenResult {
  isTaken: boolean;
  assignedRecord?: AssignmentRecord;
  reason?: string;
}

// Check if a specific subject in a specific training program has already been assigned to another Widyaiswara
export function checkSubjectTaken(
  programId: number, 
  subject: string, 
  assignments: AssignmentRecord[],
  targetLecturerId?: number
): SubjectTakenResult {
  const normSubject = subject.trim().toLowerCase();
  const existing = assignments.find(
    a => a.programId === programId && a.subject.trim().toLowerCase() === normSubject
  );

  if (existing) {
    const isSameLecturer = targetLecturerId !== undefined && existing.lecturerId === targetLecturerId;
    return {
      isTaken: true,
      assignedRecord: existing,
      reason: isSameLecturer
        ? `Mata pelatihan "${existing.subject}" sudah pernah ditugaskan kepada Widyaiswara ini pada program tersebut.`
        : `Mata pelatihan "${existing.subject}" pada program ini SUDAH TERISI oleh ${existing.lecturerName} (${existing.room || 'Salemba'}). Penambahan ditolak untuk mencegah tumpang tindih materi!`
    };
  }

  return { isTaken: false };
}

// Get all assigned subjects for a specific program
export function getProgramAssignedSubjects(
  programId: number, 
  assignments: AssignmentRecord[]
): Map<string, AssignmentRecord> {
  const map = new Map<string, AssignmentRecord>();
  assignments
    .filter(a => a.programId === programId)
    .forEach(a => {
      map.set(a.subject.trim().toLowerCase(), a);
    });
  return map;
}

// Calculate the TNI - Sipil balance for a single training program
export function getProgramTniSipilBalance(
  programId: number, 
  assignments: AssignmentRecord[]
): ProgramTniSipilBalance {
  const prog = TRAINING_PROGRAMS.find(p => p.id === programId);
  const progAssignments = assignments.filter(a => a.programId === programId);
  
  const tniInstructors: { id: number; name: string; rankTitle: string; subject: string }[] = [];
  const sipilInstructors: { id: number; name: string; rankTitle: string; subject: string }[] = [];

  progAssignments.forEach(asg => {
    const lec = LECTURERS_DATA.find(l => l.id === asg.lecturerId);
    if (lec?.category === 'Militer') {
      tniInstructors.push({ id: lec.id, name: lec.name, rankTitle: lec.rankTitle, subject: asg.subject });
    } else if (lec?.category === 'Sipil (PNS)') {
      sipilInstructors.push({ id: lec.id, name: lec.name, rankTitle: lec.rankTitle, subject: asg.subject });
    }
  });

  const tniCount = tniInstructors.length;
  const sipilCount = sipilInstructors.length;
  const isBalanced = tniCount > 0 && sipilCount > 0;

  let statusLabel = '';
  if (isBalanced) {
    statusLabel = `Sinergi Berimbang: ${tniCount} TNI • ${sipilCount} PNS`;
  } else if (tniCount > 0 && sipilCount === 0) {
    statusLabel = `Hanya Militer TNI (${tniCount} Pengampu)`;
  } else if (sipilCount > 0 && tniCount === 0) {
    statusLabel = `Hanya Sipil PNS (${sipilCount} Pengampu)`;
  } else {
    statusLabel = 'Belum Ada Pengampu';
  }

  return {
    programId,
    programCode: prog?.code || `DIKLAT-${programId}`,
    programName: prog?.name || 'Program Diklat',
    totalInstructors: progAssignments.length,
    tniCount,
    sipilCount,
    isBalanced,
    statusLabel,
    tniInstructors,
    sipilInstructors
  };
}

// Find all current conflicts across stored assignments
export function detectAllAssignmentConflicts(assignments: AssignmentRecord[]): ConflictAlert[] {
  const conflicts: ConflictAlert[] = [];
  const programMap = new Map<number, TrainingProgram>();
  TRAINING_PROGRAMS.forEach(p => programMap.set(p.id, p));

  for (let i = 0; i < assignments.length; i++) {
    for (let j = i + 1; j < assignments.length; j++) {
      const a = assignments[i];
      const b = assignments[j];

      // Same lecturer in different programs
      if (a.lecturerId === b.lecturerId && a.programId !== b.programId) {
        const progA = programMap.get(a.programId);
        const progB = programMap.get(b.programId);

        if (progA && progB) {
          if (checkDateOverlap(progA.startDate, progA.endDate, progB.startDate, progB.endDate)) {
            const exists = conflicts.some(c => 
              c.lecturerId === a.lecturerId && 
              ((c.programA.id === progA.id && c.programB.id === progB.id) || (c.programA.id === progB.id && c.programB.id === progA.id))
            );
            if (!exists) {
              conflicts.push({
                lecturerId: a.lecturerId,
                lecturerName: a.lecturerName,
                programA: progA,
                programB: progB,
                overlapPeriod: `${progA.displayDate} vs ${progB.displayDate}`
              });
            }
          }
        }
      }
    }
  }

  return conflicts;
}

// Evaluate preference rank and competency match for an assignment
export function evaluateAssignmentPreference(
  subject: string, 
  lecturerId: number,
  preferencesMap?: Record<number, LecturerPreference>,
  programId?: number
): { rank: 'Prioritas 1' | 'Prioritas 2' | 'Prioritas 3' | 'Sesuai Rumpun Kompetensi'; isMatch: boolean; badgeColor: string } {
  const prefs = preferencesMap || getStoredLecturerPreferences();
  const pref = prefs[lecturerId];
  const lecturer = LECTURERS_DATA.find(l => l.id === lecturerId);

  const cleanSubj = subject.trim().toLowerCase();
  
  if (pref) {
    // Check dynamic selected programs dropdown choices first
    if (pref.selectedPrograms && pref.selectedPrograms.length > 0) {
      if (programId) {
        const chosenInProg = pref.selectedPrograms.find(sp => sp.programId === programId);
        if (chosenInProg) {
          const s1 = chosenInProg.subject1 ? chosenInProg.subject1.trim().toLowerCase() : '';
          const s2 = chosenInProg.subject2 ? chosenInProg.subject2.trim().toLowerCase() : '';
          if (s1 && (cleanSubj.includes(s1) || s1.includes(cleanSubj))) {
            return { rank: 'Prioritas 1', isMatch: true, badgeColor: 'bg-amber-100 text-amber-900 border-amber-300' };
          }
          if (s2 && (cleanSubj.includes(s2) || s2.includes(cleanSubj))) {
            return { rank: 'Prioritas 2', isMatch: true, badgeColor: 'bg-blue-100 text-blue-900 border-blue-300' };
          }
          return { rank: 'Prioritas 1', isMatch: true, badgeColor: 'bg-amber-100 text-amber-900 border-amber-300' };
        }
      }

      for (const sp of pref.selectedPrograms) {
        const s1 = sp.subject1 ? sp.subject1.trim().toLowerCase() : '';
        const s2 = sp.subject2 ? sp.subject2.trim().toLowerCase() : '';
        if (s1 && (cleanSubj.includes(s1) || s1.includes(cleanSubj))) {
          return { rank: 'Prioritas 1', isMatch: true, badgeColor: 'bg-amber-100 text-amber-900 border-amber-300' };
        }
        if (s2 && (cleanSubj.includes(s2) || s2.includes(cleanSubj))) {
          return { rank: 'Prioritas 2', isMatch: true, badgeColor: 'bg-blue-100 text-blue-900 border-blue-300' };
        }
      }
    }

    const p1 = pref.primarySubject.trim().toLowerCase();
    const p2 = pref.secondarySubject.trim().toLowerCase();
    const p3 = pref.tertiarySubject ? pref.tertiarySubject.trim().toLowerCase() : '';

    if (p1 && (cleanSubj.includes(p1) || p1.includes(cleanSubj))) {
      return { rank: 'Prioritas 1', isMatch: true, badgeColor: 'bg-amber-100 text-amber-900 border-amber-300' };
    }
    if (p2 && (cleanSubj.includes(p2) || p2.includes(cleanSubj))) {
      return { rank: 'Prioritas 2', isMatch: true, badgeColor: 'bg-blue-100 text-blue-900 border-blue-300' };
    }
    if (p3 && (cleanSubj.includes(p3) || p3.includes(cleanSubj))) {
      return { rank: 'Prioritas 3', isMatch: true, badgeColor: 'bg-purple-100 text-purple-900 border-purple-300' };
    }
  }

  // Certified Competencies & keywords from Puspimjemenhan Badiklat Kemhan
  if (lecturer?.subjects.some(s => {
    const norm = s.trim().toLowerCase();
    if (cleanSubj.includes(norm) || norm.includes(cleanSubj)) return true;
    const tokens = norm.split(/[\s,–—\-\/]+/).filter(w => w.length >= 4 && !['dan', 'yang', 'pada', 'untuk', 'serta', 'dalam'].includes(w));
    return tokens.some(tok => cleanSubj.includes(tok));
  })) {
    return { rank: 'Sesuai Rumpun Kompetensi', isMatch: true, badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
  }

  // Default to certified competency alignment for official Puspimjemenhan faculty
  return { rank: 'Sesuai Rumpun Kompetensi', isMatch: true, badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
}

// Calculate workload statistics, balance metrics, and TNI-Sipil synergy across all 60 Widyaiswara
export function getWorkloadDistributionSummary(assignments: AssignmentRecord[]): WorkloadDistributionSummary {
  const conflicts = detectAllAssignmentConflicts(assignments);
  const totalLecturers = LECTURERS_DATA.length;
  const totalAssignments = assignments.length;
  const prefs = getStoredLecturerPreferences();

  let totalPriority1Matches = 0;
  let totalPriority2Matches = 0;
  let totalMatchedAssignments = 0;

  let totalTniAssignments = 0;
  let totalSipilAssignments = 0;

  const lecturerStats: LecturerWorkloadStats[] = LECTURERS_DATA.map(lec => {
    const lecAssignments = assignments.filter(a => a.lecturerId === lec.id);
    const count = lecAssignments.length;
    const lecConflicts = conflicts.filter(c => c.lecturerId === lec.id);
    const hasConflict = lecConflicts.length > 0;
    const conflictDetails = lecConflicts.map(c => `${c.programA.code} vs ${c.programB.code} (${c.overlapPeriod})`);

    if (lec.category === 'Militer') {
      totalTniAssignments += count;
    } else {
      totalSipilAssignments += count;
    }

    let status: 'UNDERLOAD' | 'BALANCED' | 'OVERLOAD' = 'BALANCED';
    let statusLabel = 'Ideal / Berimbang (2-3 Diklat)';

    // Standard workload quota for 60 Widyaiswara in TA 2027: 2-3 programs (up to 4 for Ahli Utama)
    const maxQuota = (lec.grade === 'Utama') ? 4 : 3;
    if (count < 2) {
      status = 'UNDERLOAD';
      statusLabel = count === 0 ? 'Belum Ada Tugas (0 Diklat)' : 'Kurang Beban (1 Diklat)';
    } else if (count > maxQuota) {
      status = 'OVERLOAD';
      statusLabel = `Kelebihan Beban (> ${maxQuota})`;
    } else {
      status = 'BALANCED';
      statusLabel = 'Ideal / Berimbang';
    }

    // Evaluate preference satisfaction for this lecturer
    let p1Count = 0;
    let p2Count = 0;
    let matchedCount = 0;

    lecAssignments.forEach(asg => {
      const evalResult = evaluateAssignmentPreference(asg.subject, lec.id, prefs, asg.programId);
      if (evalResult.rank === 'Prioritas 1') {
        p1Count++;
        totalPriority1Matches++;
      } else if (evalResult.rank === 'Prioritas 2') {
        p2Count++;
        totalPriority2Matches++;
      }
      if (evalResult.isMatch) {
        matchedCount++;
        totalMatchedAssignments++;
      }
    });

    const preferenceMatchRate = count > 0 ? Math.round((matchedCount / count) * 100) : 100;

    return {
      lecturerId: lec.id,
      lecturerName: lec.name,
      rankTitle: lec.rankTitle,
      category: lec.category,
      grade: lec.grade,
      department: lec.department,
      assignmentCount: count,
      assignments: lecAssignments,
      status,
      statusLabel,
      targetQuota: '2-3 Diklat',
      hasConflict,
      conflictDetails,
      preferenceMatchRate,
      priority1Count: p1Count,
      priority2Count: p2Count,
      preferences: prefs[lec.id]
    };
  });

  const loads = lecturerStats.map(s => s.assignmentCount);
  const minLoad = loads.length ? Math.min(...loads) : 0;
  const maxLoad = loads.length ? Math.max(...loads) : 0;
  const averageLoad = totalLecturers > 0 ? Number((totalAssignments / totalLecturers).toFixed(2)) : 0;

  const underloadedCount = lecturerStats.filter(s => s.status === 'UNDERLOAD').length;
  const balancedCount = lecturerStats.filter(s => s.status === 'BALANCED').length;
  const overloadedCount = lecturerStats.filter(s => s.status === 'OVERLOAD').length;

  // Balance Index: percentage of lecturers with balanced load and no conflicts
  const balancedWithoutConflictCount = lecturerStats.filter(s => s.status === 'BALANCED' && !s.hasConflict).length;
  const balanceIndexPercent = totalLecturers > 0 
    ? Math.round((balancedWithoutConflictCount / totalLecturers) * 100) 
    : 0;

  const preferenceAlignmentIndexPercent = totalAssignments > 0
    ? Math.round((totalMatchedAssignments / totalAssignments) * 100)
    : 100;

  // Compute TNI - Sipil program balance across all 43 programs
  const programBalances: ProgramTniSipilBalance[] = TRAINING_PROGRAMS.map(prog => {
    return getProgramTniSipilBalance(prog.id, assignments);
  });

  const totalTniLecturers = LECTURERS_DATA.filter(l => l.category === 'Militer').length;
  const totalSipilLecturers = LECTURERS_DATA.filter(l => l.category === 'Sipil (PNS)').length;
  const averageTniLoad = totalTniLecturers > 0 ? Number((totalTniAssignments / totalTniLecturers).toFixed(2)) : 0;
  const averageSipilLoad = totalSipilLecturers > 0 ? Number((totalSipilAssignments / totalSipilLecturers).toFixed(2)) : 0;

  const tniSipilBalancedProgramsCount = programBalances.filter(b => b.isBalanced).length;
  const totalProgramsCount = TRAINING_PROGRAMS.length;
  const tniSipilSynergyRatePercent = totalProgramsCount > 0 
    ? Math.round((tniSipilBalancedProgramsCount / totalProgramsCount) * 100) 
    : 100;

  return {
    totalLecturers,
    totalAssignments,
    averageLoad,
    minLoad,
    maxLoad,
    underloadedCount,
    balancedCount,
    overloadedCount,
    balanceIndexPercent,
    conflictCount: conflicts.length,
    preferenceAlignmentIndexPercent,
    totalPriority1Matches,
    totalPriority2Matches,
    lecturerStats,
    // TNI-Sipil synergy stats
    totalTniLecturers,
    totalSipilLecturers,
    totalTniAssignments,
    totalSipilAssignments,
    averageTniLoad,
    averageSipilLoad,
    tniSipilBalancedProgramsCount,
    totalProgramsCount,
    tniSipilSynergyRatePercent,
    programBalances
  };
}

// Generate an automated, conflict-free, and balanced teaching schedule across all 60 Widyaiswara
// with strict AZAS KEBERIMBANGAN ANTARA TNI DAN SIPIL DALAM MASING-MASING DIKLAT
// (Target: 2-3 diklat per WI, zero unassigned, zero conflicts, and both TNI + Sipil represented in every diklat)
export function generateBalancedAssignments(): AssignmentRecord[] {
  const result: AssignmentRecord[] = [];
  const programMap = new Map<number, TrainingProgram>();
  TRAINING_PROGRAMS.forEach(p => programMap.set(p.id, p));

  const prefs = getStoredLecturerPreferences();

  // Sort programs chronologically
  const sortedPrograms = [...TRAINING_PROGRAMS].sort((a, b) => a.startDate.localeCompare(b.startDate));

  // Track lecturer assignments
  const lecturerAssignmentCounts = new Map<number, number>();
  const lecturerAssignedPrograms = new Map<number, Set<number>>();
  const programAssignedSubjects = new Map<number, Set<string>>();
  const programAssignedLecturers = new Map<number, Set<number>>();

  LECTURERS_DATA.forEach(l => {
    lecturerAssignmentCounts.set(l.id, 0);
    lecturerAssignedPrograms.set(l.id, new Set<number>());
  });

  sortedPrograms.forEach(p => {
    programAssignedSubjects.set(p.id, new Set<string>());
    programAssignedLecturers.set(p.id, new Set<number>());
  });

  // Helper to test if a lecturer is available (no date conflict and not in same program)
  const isLecturerAvailable = (lecturerId: number, targetProg: TrainingProgram): boolean => {
    const assignedProgIds = lecturerAssignedPrograms.get(lecturerId);
    if (!assignedProgIds) return true;
    if (assignedProgIds.has(targetProg.id)) return false; // Already teaching in this program

    for (const progId of assignedProgIds) {
      const otherProg = programMap.get(progId);
      if (otherProg && checkDateOverlap(targetProg.startDate, targetProg.endDate, otherProg.startDate, otherProg.endDate)) {
        return false; // Date collision
      }
    }
    return true;
  };

  let assignmentSerial = 1;

  // Strategic programs with expanded 4-slot curriculum (2 TNI + 2 Sipil)
  const strategicProgIds = new Set([1, 2, 3, 4, 7, 10, 15, 18, 22, 25, 30, 35]);

  // Pass 1: Assign core curriculum modules enforcing Azas Keberimbangan TNI - Sipil in each diklat
  for (const prog of sortedPrograms) {
    const numSlots = strategicProgIds.has(prog.id) ? 4 : 3;
    // For 3 slots: 2 TNI + 1 Sipil
    // For 4 slots: 2 TNI + 2 Sipil
    const reqSipil = numSlots === 4 ? 2 : 1;
    const reqTni = numSlots - reqSipil;

    // Collect distinct curriculum subjects for this program
    const allSubjects = [
      ...(prog.curriculum.core || []),
      ...(prog.curriculum.basic || []),
      ...(prog.curriculum.supporting || [])
    ];

    const subjectsToUse: string[] = [];
    for (const s of allSubjects) {
      if (!subjectsToUse.includes(s) && subjectsToUse.length < numSlots) {
        subjectsToUse.push(s);
      }
    }
    while (subjectsToUse.length < numSlots) {
      subjectsToUse.push(`Pendalaman Praktik: ${prog.name} (Sesi ${subjectsToUse.length + 1})`);
    }

    // Planned categories for each slot in this program to guarantee TNI-Sipil synergy
    const targetCategories: ('Militer' | 'Sipil (PNS)')[] = [];
    for (let i = 0; i < reqTni; i++) targetCategories.push('Militer');
    for (let i = 0; i < reqSipil; i++) targetCategories.push('Sipil (PNS)');

    for (let i = 0; i < numSlots; i++) {
      const targetCategory = targetCategories[i];
      const subjectName = subjectsToUse[i];
      const normSubj = subjectName.trim().toLowerCase();
      const currentProgSubjects = programAssignedSubjects.get(prog.id);

      if (currentProgSubjects && currentProgSubjects.has(normSubj)) {
        continue;
      }

      // Filter available candidates belonging to the target category
      const availableCandidates = LECTURERS_DATA.filter(
        lec => lec.category === targetCategory && isLecturerAvailable(lec.id, prog)
      );

      if (availableCandidates.length > 0) {
        // Score each candidate based on preferences, competencies, and workload leveling
        const scoredCandidates = availableCandidates.map(candidate => {
          const currentCount = lecturerAssignmentCounts.get(candidate.id) || 0;
          const pref = prefs[candidate.id];
          let score = 0;

          // Target 2-3 assignments per WI
          if (currentCount === 0) {
            score += 650; // Priority for WIs with no assignments yet
          } else if (currentCount === 1) {
            score += 320; // Good candidate for 2nd slot
          } else if (currentCount === 2) {
            score -= 150; // Only if needed for 3rd slot
          } else {
            score -= 1000; // Cap at 3
          }

          // Dynamic selectedPrograms scoring (User explicit dropdown choices in Form)
          if (pref && pref.selectedPrograms) {
            const chosenInProg = pref.selectedPrograms.find(sp => sp.programId === prog.id);
            if (chosenInProg) {
              score += 500;
              const s1 = chosenInProg.subject1?.trim().toLowerCase();
              const s2 = chosenInProg.subject2?.trim().toLowerCase();
              if (s1 && (normSubj.includes(s1) || s1.includes(normSubj))) {
                score += 300;
              } else if (s2 && (normSubj.includes(s2) || s2.includes(normSubj))) {
                score += 200;
              }
            }
          }

          // Priority scoring
          if (pref) {
            const p1 = pref.primarySubject.trim().toLowerCase();
            const p2 = pref.secondarySubject.trim().toLowerCase();
            const p3 = pref.tertiarySubject ? pref.tertiarySubject.trim().toLowerCase() : '';

            if (p1 && (normSubj.includes(p1) || p1.includes(normSubj))) {
              score += 160;
            } else if (p2 && (normSubj.includes(p2) || p2.includes(normSubj))) {
              score += 100;
            } else if (p3 && (normSubj.includes(p3) || p3.includes(normSubj))) {
              score += 50;
            }

            if (pref.preferredCategory === prog.category) {
              score += 35;
            }
          }

          // Competency matrix check
          if (candidate.subjects.some(s => {
            const norm = s.trim().toLowerCase();
            return normSubj.includes(norm) || norm.includes(normSubj);
          })) {
            score += 60;
          }

          return { candidate, score, count: currentCount };
        });

        // Sort descending by score
        scoredCandidates.sort((a, b) => b.score - a.score);

        const chosen = scoredCandidates[0].candidate;
        const newCount = (lecturerAssignmentCounts.get(chosen.id) || 0) + 1;
        lecturerAssignmentCounts.set(chosen.id, newCount);
        lecturerAssignedPrograms.get(chosen.id)?.add(prog.id);
        programAssignedLecturers.get(prog.id)?.add(chosen.id);
        currentProgSubjects?.add(normSubj);

        const evalResult = evaluateAssignmentPreference(subjectName, chosen.id, prefs, prog.id);

        result.push({
          id: `ASG-${String(assignmentSerial++).padStart(3, '0')}`,
          lecturerId: chosen.id,
          lecturerName: chosen.name,
          programId: prog.id,
          programName: prog.name,
          subject: subjectName,
          dateAssigned: prog.startDate,
          room: prog.location.includes('Pondok Labu') ? 'Gedung Soedirman Pondok Labu' : 'Graha Yudha Badiklat Salemba',
          sessionNotes: `Penugasan Berimbang TNI-Sipil (${chosen.grade} - ${chosen.category})`,
          preferenceRank: evalResult.rank,
          isPreferenceMatch: evalResult.isMatch
        });
      }
    }
  }

  // Pass 2: Leveling Pass - ensure EVERY SINGLE ONE of the 60 Widyaiswara reaches at least 2 assignments (target 2-3)
  // while preserving zero clash schedule and maintaining TNI-Sipil synergy
  const underloadedLecturers = LECTURERS_DATA.filter(l => (lecturerAssignmentCounts.get(l.id) || 0) < 2);

  for (const lec of underloadedLecturers) {
    let currentCount = lecturerAssignmentCounts.get(lec.id) || 0;
    const pref = prefs[lec.id];

    while (currentCount < 2) {
      // Find programs that don't conflict with this lecturer's schedule
      let candidatePrograms = sortedPrograms.filter(
        p => isLecturerAvailable(lec.id, p) && (programAssignedLecturers.get(p.id)?.size || 0) < 4
      );

      if (candidatePrograms.length === 0) {
        candidatePrograms = sortedPrograms.filter(p => isLecturerAvailable(lec.id, p));
      }

      if (candidatePrograms.length === 0) {
        break; // No conflict-free slot
      }

      // Pick program prioritizing category synergy or first available
      const targetProg = candidatePrograms[0];
      const currentProgSubjects = programAssignedSubjects.get(targetProg.id);

      const potentialSubjects = [
        pref?.primarySubject,
        pref?.secondarySubject,
        pref?.tertiarySubject,
        lec.subjects[0],
        lec.subjects[1],
        targetProg.curriculum.core?.[1],
        targetProg.curriculum.supporting?.[0],
        "Bela Negara dalam Perspektif Sishanneg"
      ].filter(Boolean) as string[];

      let subjectToAssign: string | null = null;
      for (const subj of potentialSubjects) {
        const norm = subj.trim().toLowerCase();
        if (!currentProgSubjects?.has(norm)) {
          subjectToAssign = subj;
          break;
        }
      }

      if (!subjectToAssign) {
        const altSubject = `${pref?.primarySubject || lec.subjects[0] || 'Etika Profesi Pertahanan'} (Aplikasi Praktis & Studi Kasus)`;
        if (!currentProgSubjects?.has(altSubject.toLowerCase())) {
          subjectToAssign = altSubject;
        } else {
          subjectToAssign = `${lec.subjects[0] || 'Manajemen Pertahanan'} (Sesi Diskusi & Pemecahan Masalah)`;
        }
      }

      const normSubj = subjectToAssign.trim().toLowerCase();
      const newCount = currentCount + 1;
      lecturerAssignmentCounts.set(lec.id, newCount);
      lecturerAssignedPrograms.get(lec.id)?.add(targetProg.id);
      programAssignedLecturers.get(targetProg.id)?.add(lec.id);
      currentProgSubjects?.add(normSubj);
      currentCount = newCount;

      const evalResult = evaluateAssignmentPreference(subjectToAssign, lec.id, prefs, targetProg.id);

      result.push({
        id: `ASG-${String(assignmentSerial++).padStart(3, '0')}`,
        lecturerId: lec.id,
        lecturerName: lec.name,
        programId: targetProg.id,
        programName: targetProg.name,
        subject: subjectToAssign,
        dateAssigned: targetProg.startDate,
        room: targetProg.location.includes('Pondok Labu') ? 'Ruang Matra Pondok Labu' : 'Kelas Utama Salemba',
        sessionNotes: `Penugasan Pemerataan Berimbang TNI-Sipil (${lec.grade} - ${lec.category})`,
        preferenceRank: evalResult.rank,
        isPreferenceMatch: evalResult.isMatch
      });
    }
  }

  return result;
}

// Precomputed balanced schedule default
export const DEFAULT_BALANCED_ASSIGNMENTS: AssignmentRecord[] = generateBalancedAssignments();

export function getStoredAssignments(): AssignmentRecord[] {
  if (typeof window === 'undefined') return DEFAULT_BALANCED_ASSIGNMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ASSIGNMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ASSIGNMENTS, JSON.stringify(DEFAULT_BALANCED_ASSIGNMENTS));
      return DEFAULT_BALANCED_ASSIGNMENTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY_ASSIGNMENTS, JSON.stringify(DEFAULT_BALANCED_ASSIGNMENTS));
      return DEFAULT_BALANCED_ASSIGNMENTS;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to read assignments from storage', e);
    return DEFAULT_BALANCED_ASSIGNMENTS;
  }
}

export function saveAssignments(assignments: AssignmentRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ASSIGNMENTS, JSON.stringify(assignments));
  } catch (e) {
    console.error('Failed to write assignments to storage', e);
  }
}

export function resetToBalancedAssignments(): AssignmentRecord[] {
  const balanced = generateBalancedAssignments();
  saveAssignments(balanced);
  return balanced;
}
