/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header, ActiveTab } from './components/Header.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { CatalogView } from './components/CatalogView.tsx';
import { ProgramDetailModal } from './components/ProgramDetailModal.tsx';
import { EligibilityEngineView } from './components/EligibilityEngineView.tsx';
import { LecturersView } from './components/LecturersView.tsx';
import { AssignmentModal } from './components/AssignmentModal.tsx';
import { ScheduleCalendarView } from './components/ScheduleCalendarView.tsx';
import { AiAssistantView } from './components/AiAssistantView.tsx';
import { RegistrationSimView } from './components/RegistrationSimView.tsx';
import { OfficialPrintModal, PrintDocumentType } from './components/OfficialPrintModal.tsx';
import { GlobalSearchModal } from './components/GlobalSearchModal.tsx';
import { WiIdentificationFormView } from './components/WiIdentificationFormView.tsx';
import { TrainingProgram } from './data/programsData.ts';
import { Lecturer } from './data/lecturersData.ts';
import { 
  getStoredAssignments, 
  saveAssignments, 
  resetToBalancedAssignments,
  detectAllAssignmentConflicts, 
  getWorkloadDistributionSummary,
  AssignmentRecord 
} from './data/assignmentStore.ts';
import { Shield, Building, Phone, Mail, Award, CheckCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [presetProgramForEligibility, setPresetProgramForEligibility] = useState<TrainingProgram | null>(null);

  // Global Omnibar Search modal state
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Assignments & Conflicts state
  const [assignments, setAssignments] = useState<AssignmentRecord[]>(() => getStoredAssignments());
  const conflicts = useMemo(() => detectAllAssignmentConflicts(assignments), [assignments]);

  // Assignment Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState<{ lecturer?: Lecturer; program?: TrainingProgram }>({});

  // Print modal state
  const [printModalState, setPrintModalState] = useState<{
    open: boolean;
    type: PrintDocumentType;
    program?: TrainingProgram | null;
    eligibilityData?: any;
    proposalData?: any;
    workloadData?: any;
    specificLecturer?: Lecturer | null;
  }>({
    open: false,
    type: 'syllabus'
  });

  const handleOpenAssignModal = (lecturer?: Lecturer, program?: TrainingProgram) => {
    setAssignTarget({ lecturer, program });
    setAssignModalOpen(true);
  };

  const handleSaveAssignment = (newRecord: AssignmentRecord) => {
    // Strict validation: do not allow duplicate assignment for the same subject in the same program
    const duplicate = assignments.find(
      a => a.programId === newRecord.programId && 
           a.subject.trim().toLowerCase() === newRecord.subject.trim().toLowerCase()
    );

    if (duplicate && duplicate.lecturerId !== newRecord.lecturerId) {
      alert(`PENUGASAN DITOLAK!\n\nMata pelatihan "${newRecord.subject}" pada program ini sudah diampu oleh ${duplicate.lecturerName}.\nSistem mencegah tumpang tindih materi pada satu diklat.`);
      return;
    }

    const updated = [newRecord, ...assignments];
    setAssignments(updated);
    saveAssignments(updated);
  };

  const handleReassignAssignment = (existingId: string, newRecord: AssignmentRecord) => {
    const updated = assignments.map(a => a.id === existingId ? newRecord : a);
    setAssignments(updated);
    saveAssignments(updated);
  };

  const handleRemoveAssignment = (id: string) => {
    const updated = assignments.filter(a => a.id !== id);
    setAssignments(updated);
    saveAssignments(updated);
  };

  const handleCheckEligibilityForProgram = (prog: TrainingProgram) => {
    setPresetProgramForEligibility(prog);
    setActiveTab('eligibility');
  };

  const handlePrintSyllabus = (prog: TrainingProgram) => {
    setPrintModalState({
      open: true,
      type: 'syllabus',
      program: prog
    });
  };

  const handlePrintOfficialRecommendation = (profile: any, results: any) => {
    setPrintModalState({
      open: true,
      type: 'eligibility',
      eligibilityData: { profile, results }
    });
  };

  const handlePrintOfficialProposal = (letterPayload: any) => {
    setPrintModalState({
      open: true,
      type: 'proposal',
      proposalData: letterPayload
    });
  };

  const handleApplyBalancedSchedule = () => {
    const balanced = resetToBalancedAssignments();
    setAssignments(balanced);
  };

  const handlePrintWorkloadReport = (summary: any) => {
    setPrintModalState({
      open: true,
      type: 'workload-report',
      workloadData: summary
    });
  };

  const handleOpenWiPrintModal = (type: PrintDocumentType, specificLecturer?: Lecturer, program?: TrainingProgram) => {
    setPrintModalState({
      open: true,
      type: type,
      workloadData: getWorkloadDistributionSummary(assignments),
      specificLecturer: specificLecturer || null,
      program: program || null
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Header Bar */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        conflictCount={conflicts.length} 
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenPrintRecap={() => handleOpenWiPrintModal('workload-report')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardView 
            setActiveTab={setActiveTab} 
            onSelectProgram={setSelectedProgram}
            conflictCount={conflicts.length}
            onOpenPrintRecap={(docType) => handleOpenWiPrintModal(docType || 'workload-report')}
          />
        )}

        {activeTab === 'wi-form' && (
          <WiIdentificationFormView 
            assignments={assignments}
            onAssignmentsUpdated={(newAsgs) => {
              setAssignments(newAsgs);
            }}
            onOpenPrintModal={handleOpenWiPrintModal}
            onSelectProgram={setSelectedProgram}
          />
        )}

        {activeTab === 'catalog' && (
          <CatalogView 
            onSelectProgram={setSelectedProgram}
            onCheckEligibilityForProgram={handleCheckEligibilityForProgram}
          />
        )}

        {activeTab === 'eligibility' && (
          <EligibilityEngineView 
            onSelectProgram={setSelectedProgram}
            presetProgram={presetProgramForEligibility}
            onPrintOfficialRecommendation={handlePrintOfficialRecommendation}
          />
        )}

        {activeTab === 'lecturers' && (
          <LecturersView 
            assignments={assignments}
            conflicts={conflicts}
            onOpenAssignModal={handleOpenAssignModal}
            onRemoveAssignment={handleRemoveAssignment}
            onApplyBalancedSchedule={handleApplyBalancedSchedule}
            onPrintWorkloadReport={handlePrintWorkloadReport}
            onSelectProgramById={(id) => {
              // optional
            }}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleCalendarView 
            onSelectProgram={setSelectedProgram}
          />
        )}

        {activeTab === 'registration' && (
          <RegistrationSimView 
            onPrintOfficialProposal={handlePrintOfficialProposal}
          />
        )}

        {activeTab === 'ai-assistant' && (
          <AiAssistantView />
        )}
      </main>

      {/* Program Detail Modal */}
      <ProgramDetailModal 
        program={selectedProgram}
        onClose={() => setSelectedProgram(null)}
        onCheckEligibility={handleCheckEligibilityForProgram}
        onOpenAssignLecturer={(prog) => handleOpenAssignModal(undefined, prog)}
        onPrintSyllabus={handlePrintSyllabus}
      />

      {/* Assignment Modal */}
      {assignModalOpen && (
        <AssignmentModal 
          initialLecturer={assignTarget.lecturer}
          initialProgram={assignTarget.program}
          onClose={() => setAssignModalOpen(false)}
          onSaveAssignment={handleSaveAssignment}
          onReassignAssignment={handleReassignAssignment}
        />
      )}

      {/* Print Document Modal */}
      {printModalState.open && (
        <OfficialPrintModal 
          type={printModalState.type}
          program={printModalState.program}
          eligibilityData={printModalState.eligibilityData}
          proposalData={printModalState.proposalData}
          workloadData={printModalState.workloadData}
          specificLecturer={printModalState.specificLecturer}
          onClose={() => setPrintModalState(prev => ({ ...prev, open: false }))}
        />
      )}

      {/* Global Command / Omnibar Search Modal */}
      <GlobalSearchModal 
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectProgram={(prog) => {
          setSelectedProgram(prog);
        }}
        onNavigateToTab={(tab) => {
          setActiveTab(tab);
        }}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 py-8 px-4 sm:px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-200 text-sm">
                SIM-DIKLAT PUSPIMJEMENHAN BADIKLAT KEMHAN RI
              </p>
              <p className="text-slate-400 text-xs">
                Pusat Kepemimpinan dan Manajemen Pertahanan • Tahun Anggaran 2027
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px]">
            <span className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-amber-400" />
              <span>Kampus Salemba: Jl. Salemba Raya 14, Jakarta Pusat</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-amber-400" />
              <span>Kampus Pondok Labu: Jl. RS Fatmawati No. 1, Jakarta Selatan</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-500 text-center md:text-right">
            © 2027 Kementerian Pertahanan Republik Indonesia. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
