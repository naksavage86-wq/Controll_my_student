/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, TabType } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { StudentDirectoryView } from './components/StudentDirectoryView';
import { StudentModal } from './components/StudentModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { AttendanceView } from './components/AttendanceView';
import { GradebookView } from './components/GradebookView';
import { ReportCardView } from './components/ReportCardView';
import { TuitionView } from './components/TuitionView';
import { TimetableView } from './components/TimetableView';
import { SchoolSettingsView } from './components/SchoolSettingsView';

import { Student, GradeClass, ExamTermScore, DailyAttendance, TuitionFee } from './types';
import { Language } from './utils/i18n';
import {
  INITIAL_STUDENTS,
  INITIAL_CLASSES,
  INITIAL_EXAM_SCORES,
  INITIAL_ATTENDANCE,
  INITIAL_FEES,
} from './data/mockData';

const STORAGE_KEYS = {
  STUDENTS: 'schoolpro_students_v1',
  EXAM_SCORES: 'schoolpro_exam_scores_v1',
  ATTENDANCE: 'schoolpro_attendance_v1',
  FEES: 'schoolpro_fees_v1',
  LANG: 'schoolpro_lang_v1',
};

export default function App() {
  // Language State
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG);
    return (saved as Language) || 'km';
  });

  const toggleLanguage = () => {
    setLang((prev) => {
      const next = prev === 'km' ? 'en' : 'km';
      localStorage.setItem(STORAGE_KEYS.LANG, next);
      return next;
    });
  };

  // Classes State
  const [classes] = useState<GradeClass[]>(INITIAL_CLASSES);

  // Students State
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  // Exam Scores State
  const [examScores, setExamScores] = useState<ExamTermScore[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXAM_SCORES);
      return saved ? JSON.parse(saved) : INITIAL_EXAM_SCORES;
    } catch {
      return INITIAL_EXAM_SCORES;
    }
  });

  // Attendance State
  const [attendance, setAttendance] = useState<DailyAttendance[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
    } catch {
      return INITIAL_ATTENDANCE;
    }
  });

  // Tuition Fees State
  const [tuitionFees, setTuitionFees] = useState<TuitionFee[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FEES);
      return saved ? JSON.parse(saved) : INITIAL_FEES;
    } catch {
      return INITIAL_FEES;
    }
  });

  // Active Tab
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');

  // Selected Student for Profile Modal
  const [selectedProfileStudent, setSelectedProfileStudent] = useState<Student | null>(null);

  // Selected Student for Report Card
  const [reportCardStudentId, setReportCardStudentId] = useState<string>('');

  // Add / Edit Student Modal State
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Save to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXAM_SCORES, JSON.stringify(examScores));
  }, [examScores]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(tuitionFees));
  }, [tuitionFees]);

  // Reset to initial demo data
  const handleResetData = () => {
    setStudents(INITIAL_STUDENTS);
    setExamScores(INITIAL_EXAM_SCORES);
    setAttendance(INITIAL_ATTENDANCE);
    setTuitionFees(INITIAL_FEES);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.EXAM_SCORES);
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
    localStorage.removeItem(STORAGE_KEYS.FEES);
  };

  // Student CRUD operations
  const handleSaveStudent = (data: Partial<Student>) => {
    if (editingStudent) {
      // Update
      setStudents((prev) =>
        prev.map((s) => (s.id === editingStudent.id ? ({ ...s, ...data } as Student) : s))
      );
    } else {
      // Create new
      const newStudent: Student = {
        id: `stu-${Date.now()}`,
        code: data.code || `STU-2025-${String(students.length + 1).padStart(3, '0')}`,
        khmerName: data.khmerName || '',
        latinName: data.latinName || '',
        gender: data.gender || 'male',
        dob: data.dob || '2012-01-01',
        pob: data.pob || 'ភ្នំពេញ',
        gradeId: data.gradeId || '7A',
        phone: data.phone || '',
        address: data.address || '',
        status: data.status || 'active',
        enrollDate: new Date().toISOString().slice(0, 10),
        parentName: data.parentName || '',
        parentPhone: data.parentPhone || '',
        parentRelationship: data.parentRelationship || 'ឪពុក',
        parentOccupation: data.parentOccupation || '',
        emergencyContact: data.emergencyContact || '',
        notes: data.notes || '',
        avatarUrl:
          data.gender === 'female'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      };
      setStudents((prev) => [newStudent, ...prev]);
    }
    setEditingStudent(null);
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  const handleImportStudents = (imported: Student[]) => {
    setStudents((prev) => [...imported, ...prev]);
  };

  // Attendance update
  const handleSaveDailyAttendance = (record: DailyAttendance) => {
    setAttendance((prev) => {
      const idx = prev.findIndex((r) => r.date === record.date && r.gradeId === record.gradeId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = record;
        return copy;
      }
      return [...prev, record];
    });
  };

  // Scores update
  const handleSaveScores = (updatedScores: ExamTermScore[]) => {
    setExamScores((prev) => {
      const map = new Map<string, ExamTermScore>();
      prev.forEach((s) => map.set(`${s.studentId}-${s.term}`, s));
      updatedScores.forEach((s) => map.set(`${s.studentId}-${s.term}`, s));
      return Array.from(map.values());
    });
  };

  // Tuition updates
  const handleAddFee = (fee: TuitionFee) => {
    setTuitionFees((prev) => [fee, ...prev]);
  };

  const handleUpdateFee = (fee: TuitionFee) => {
    setTuitionFees((prev) => prev.map((f) => (f.id === fee.id ? fee : f)));
  };

  // Navigations
  const handleOpenReportCard = (studentId: string) => {
    setReportCardStudentId(studentId);
    setCurrentTab('reportCard');
  };

  const handleSelectStudentForProfile = (studentId: string) => {
    const s = students.find((item) => item.id === studentId);
    if (s) {
      setSelectedProfileStudent(s);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navbar */}
      <Navbar
        lang={lang}
        onToggleLang={toggleLanguage}
        onOpenAddStudent={() => {
          setEditingStudent(null);
          setIsStudentModalOpen(true);
        }}
        onResetData={handleResetData}
        onSelectStudent={handleSelectStudentForProfile}
        activeTab={currentTab}
      />

      {/* Main Body */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onChangeTab={setCurrentTab}
          lang={lang}
          studentCount={students.length}
        />

        {/* Dynamic Main Workspace View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {currentTab === 'dashboard' && (
            <DashboardView
              students={students}
              classes={classes}
              examScores={examScores}
              attendance={attendance}
              tuitionFees={tuitionFees}
              lang={lang}
              onNavigate={setCurrentTab}
              onSelectStudent={handleSelectStudentForProfile}
            />
          )}

          {currentTab === 'students' && (
            <StudentDirectoryView
              students={students}
              classes={classes}
              lang={lang}
              onOpenAddModal={() => {
                setEditingStudent(null);
                setIsStudentModalOpen(true);
              }}
              onEditStudent={(s) => {
                setEditingStudent(s);
                setIsStudentModalOpen(true);
              }}
              onDeleteStudent={handleDeleteStudent}
              onViewStudent={setSelectedProfileStudent}
              onViewReportCard={handleOpenReportCard}
              onImportStudents={handleImportStudents}
            />
          )}

          {currentTab === 'attendance' && (
            <AttendanceView
              students={students}
              classes={classes}
              attendanceRecords={attendance}
              onSaveDailyAttendance={handleSaveDailyAttendance}
              lang={lang}
            />
          )}

          {currentTab === 'grades' && (
            <GradebookView
              students={students}
              classes={classes}
              examScores={examScores}
              onSaveScores={handleSaveScores}
              onViewReportCard={handleOpenReportCard}
              lang={lang}
            />
          )}

          {currentTab === 'reportCard' && (
            <ReportCardView
              students={students}
              classes={classes}
              examScores={examScores}
              selectedStudentId={reportCardStudentId}
              onBack={() => setCurrentTab('students')}
              lang={lang}
            />
          )}

          {currentTab === 'tuition' && (
            <TuitionView
              students={students}
              tuitionFees={tuitionFees}
              onAddFee={handleAddFee}
              onUpdateFee={handleUpdateFee}
              lang={lang}
            />
          )}

          {currentTab === 'timetable' && (
            <TimetableView classes={classes} lang={lang} />
          )}

          {currentTab === 'settings' && (
            <SchoolSettingsView
              classes={classes}
              onResetData={handleResetData}
              lang={lang}
            />
          )}
        </main>
      </div>

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => {
          setIsStudentModalOpen(false);
          setEditingStudent(null);
        }}
        onSave={handleSaveStudent}
        initialStudent={editingStudent}
        classes={classes}
        existingStudentsCount={students.length}
        lang={lang}
      />

      {/* Student Profile Modal */}
      <StudentProfileModal
        student={selectedProfileStudent}
        gradeClass={classes.find((c) => c.id === selectedProfileStudent?.gradeId)}
        examScore={examScores.find((e) => e.studentId === selectedProfileStudent?.id)}
        attendanceRecords={attendance}
        tuitionFees={tuitionFees}
        isOpen={Boolean(selectedProfileStudent)}
        onClose={() => setSelectedProfileStudent(null)}
        onEdit={(s) => {
          setSelectedProfileStudent(null);
          setEditingStudent(s);
          setIsStudentModalOpen(true);
        }}
        onViewReportCard={handleOpenReportCard}
        lang={lang}
      />
    </div>
  );
}
