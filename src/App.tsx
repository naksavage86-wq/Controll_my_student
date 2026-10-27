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
import { DeveloperProfileModal } from './components/DeveloperProfileModal';
import { TeacherManagementView } from './components/TeacherManagementView';
import { AuthView } from './components/AuthView';

import {
  Student,
  GradeClass,
  ExamTermScore,
  DailyAttendance,
  TuitionFee,
  TimetableSlot,
  ClassPricing,
  DeveloperProfile,
  Teacher,
  UserAccount,
  Subject,
} from './types';
import { Language } from './utils/i18n';
import {
  INITIAL_STUDENTS,
  INITIAL_CLASSES,
  INITIAL_EXAM_SCORES,
  INITIAL_ATTENDANCE,
  INITIAL_FEES,
  INITIAL_TIMETABLE,
  INITIAL_PRICING,
  INITIAL_DEVELOPER,
  INITIAL_TEACHERS,
  INITIAL_USERS,
} from './data/mockData';

const STORAGE_KEYS = {
  STUDENTS: 'schoolpro_students_v2',
  CLASSES: 'schoolpro_classes_v2',
  PRICING: 'schoolpro_pricing_v2',
  TIMETABLE: 'schoolpro_timetable_v2',
  EXAM_SCORES: 'schoolpro_exam_scores_v2',
  ATTENDANCE: 'schoolpro_attendance_v2',
  FEES: 'schoolpro_fees_v2',
  LANG: 'schoolpro_lang_v2',
  DEVELOPER: 'schoolpro_developer_profile_v2',
  TEACHERS: 'schoolpro_teachers_v2',
  USERS: 'schoolpro_users_v2',
  CURRENT_USER: 'schoolpro_current_user_v2',
  CLASS_SUBJECTS: 'schoolpro_class_subjects_v2',
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

  // User Accounts State (for shared login & registration)
  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Current Logged In User State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Teachers State
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEACHERS);
      return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
    } catch {
      return INITIAL_TEACHERS;
    }
  });

  // Classes State
  const [classes, setClasses] = useState<GradeClass[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLASSES);
      return saved ? JSON.parse(saved) : INITIAL_CLASSES;
    } catch {
      return INITIAL_CLASSES;
    }
  });

  // Tuition Pricing State
  const [classPricing, setClassPricing] = useState<Record<string, ClassPricing>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRICING);
      return saved ? JSON.parse(saved) : INITIAL_PRICING;
    } catch {
      return INITIAL_PRICING;
    }
  });

  // Timetable State
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TIMETABLE);
      return saved ? JSON.parse(saved) : INITIAL_TIMETABLE;
    } catch {
      return INITIAL_TIMETABLE;
    }
  });

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

  // Customized Subjects and Max Scores per Class level
  const [classSubjectsMap, setClassSubjectsMap] = useState<Record<string, Subject[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLASS_SUBJECTS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
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

  // Developer Profile State
  const [developerProfile, setDeveloperProfile] = useState<DeveloperProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEVELOPER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.avatarUrl?.includes('photo-1534528741775-53994a69daeb')) {
          parsed.avatarUrl = INITIAL_DEVELOPER.avatarUrl;
        }
        return parsed;
      }
      return INITIAL_DEVELOPER;
    } catch {
      return INITIAL_DEVELOPER;
    }
  });
  const [isDevProfileOpen, setIsDevProfileOpen] = useState(false);

  // Save to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEVELOPER, JSON.stringify(developerProfile));
  }, [developerProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(classPricing));
  }, [classPricing]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(timetableSlots));
  }, [timetableSlots]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXAM_SCORES, JSON.stringify(examScores));
  }, [examScores]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(tuitionFees));
  }, [tuitionFees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLASS_SUBJECTS, JSON.stringify(classSubjectsMap));
  }, [classSubjectsMap]);

  // Auth Operations
  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);
  };

  const handleRegister = (newUser: UserAccount) => {
    setUsers((prev) => [newUser, ...prev]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Reset to initial demo data
  const handleResetData = () => {
    setStudents(INITIAL_STUDENTS);
    setTeachers(INITIAL_TEACHERS);
    setUsers(INITIAL_USERS);
    setClasses(INITIAL_CLASSES);
    setClassPricing(INITIAL_PRICING);
    setTimetableSlots(INITIAL_TIMETABLE);
    setExamScores(INITIAL_EXAM_SCORES);
    setAttendance(INITIAL_ATTENDANCE);
    setTuitionFees(INITIAL_FEES);
    setClassSubjectsMap({});
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.TEACHERS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CLASSES);
    localStorage.removeItem(STORAGE_KEYS.PRICING);
    localStorage.removeItem(STORAGE_KEYS.TIMETABLE);
    localStorage.removeItem(STORAGE_KEYS.EXAM_SCORES);
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
    localStorage.removeItem(STORAGE_KEYS.FEES);
    localStorage.removeItem(STORAGE_KEYS.CLASS_SUBJECTS);
  };

  const handleUpdateCurrentUser = (updatedUser: UserAccount) => {
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  // Teacher CRUD operations
  const handleAddTeacher = (data: Partial<Teacher>) => {
    const newTeacher: Teacher = {
      id: `tch-${Date.now()}`,
      nameKhmer: data.nameKhmer || '',
      nameLatin: data.nameLatin || '',
      gender: data.gender || 'male',
      subject: data.subject || 'ភាសាខ្មែរ',
      phone: data.phone || '',
      email: data.email || '',
      homeroomGradeId: data.homeroomGradeId || undefined,
      avatarUrl:
        data.avatarUrl ||
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      qualification: data.qualification || 'បរិញ្ញាបត្រគរុកោសល្យ',
      bio: data.bio || '',
      joinDate: data.joinDate || new Date().toISOString().slice(0, 10),
      status: data.status || 'active',
    };
    setTeachers((prev) => [newTeacher, ...prev]);
  };

  const handleUpdateTeacher = (updated: Teacher) => {
    setTeachers((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));

    // Synchronize with currentUser and users list if this is the logged-in teacher
    if (
      currentUser &&
      (currentUser.teacherId === updated.id ||
        (currentUser.email && updated.email && currentUser.email.toLowerCase() === updated.email.toLowerCase()) ||
        (currentUser.role === 'teacher' && currentUser.name === updated.nameKhmer))
    ) {
      const updatedUser: UserAccount = {
        ...currentUser,
        name: updated.nameKhmer,
        avatarUrl: updated.avatarUrl || currentUser.avatarUrl,
        phone: updated.phone || currentUser.phone,
        email: updated.email || currentUser.email,
        teacherId: updated.id,
      };
      setCurrentUser(updatedUser);
      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    }
  };

  const handleDeleteTeacher = (teacherId: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
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
        gradeId: data.gradeId || classes[0]?.id || '7A',
        phone: data.phone || '',
        address: data.address || '',
        status: data.status || 'active',
        enrollDate: new Date().toISOString().slice(0, 10),
        parentName: data.parentName || '',
        parentPhone: data.parentPhone || '',
        parentRelationship: data.parentRelationship || 'ឪពុក',
        parentOccupation: data.parentOccupation || '',
        emergencyContact: data.emergencyContact || '',
        bloodType: data.bloodType || 'O+',
        heightCm: data.heightCm || 155,
        weightKg: data.weightKg || 48,
        allergies: data.allergies || '',
        chronicCondition: data.chronicCondition || '',
        merits: data.merits || [],
        warnings: data.warnings || [],
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

  // Class CRUD
  const handleAddClass = (newClass: GradeClass) => {
    setClasses((prev) => [...prev, newClass]);
    // Set default pricing
    setClassPricing((prev) => ({
      ...prev,
      [newClass.id]: { gradeId: newClass.id, monthlyFee: 130, currency: 'USD', registrationFee: 20, materialFee: 30 },
    }));
  };

  const handleUpdateClass = (updatedClass: GradeClass) => {
    setClasses((prev) => prev.map((c) => (c.id === updatedClass.id ? updatedClass : c)));
  };

  const handleDeleteClass = (classId: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== classId));
  };

  // Timetable Operations
  const handleSaveSlot = (slot: TimetableSlot) => {
    setTimetableSlots((prev) => {
      const idx = prev.findIndex(
        (s) => s.gradeId === slot.gradeId && s.dayOfWeek === slot.dayOfWeek && s.timeSlot === slot.timeSlot
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = slot;
        return copy;
      }
      return [...prev, slot];
    });
  };

  const handleDeleteSlot = (slotId: string) => {
    setTimetableSlots((prev) => prev.filter((s) => s.id !== slotId));
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

  // Subject max scores & coefficients configuration
  const handleUpdateClassSubjects = (
    gradeId: string,
    updatedSubjects: Subject[],
    applyToAll: boolean
  ) => {
    setClassSubjectsMap((prev) => {
      if (applyToAll) {
        const next: Record<string, Subject[]> = {
          ...prev,
          default: updatedSubjects,
        };
        classes.forEach((c) => {
          next[c.id] = updatedSubjects;
        });
        return next;
      }
      return {
        ...prev,
        [gradeId]: updatedSubjects,
      };
    });
  };

  // Tuition updates
  const handleAddFee = (fee: TuitionFee) => {
    setTuitionFees((prev) => [fee, ...prev]);
  };

  const handleUpdateFee = (fee: TuitionFee) => {
    setTuitionFees((prev) => prev.map((f) => (f.id === fee.id ? fee : f)));
  };

  const handleDeleteFee = (feeId: string) => {
    setTuitionFees((prev) => prev.filter((f) => f.id !== feeId));
  };

  const handleUpdatePricing = (pricing: Record<string, ClassPricing>) => {
    setClassPricing(pricing);
  };

  const handleBatchGenerateFees = (newFees: TuitionFee[]) => {
    setTuitionFees((prev) => [...newFees, ...prev]);
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

  // If not logged in, show Auth Gate (Login / Register screen)
  if (!currentUser) {
    return (
      <AuthView
        users={users}
        onLogin={handleLogin}
        onRegister={handleRegister}
        classes={classes}
        lang={lang}
      />
    );
  }

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
        onOpenDeveloperProfile={() => setIsDevProfileOpen(true)}
        developerAvatar={developerProfile.avatarUrl}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Body */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onChangeTab={setCurrentTab}
          lang={lang}
          studentCount={students.length}
          teacherCount={teachers.length}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenDeveloperProfile={() => setIsDevProfileOpen(true)}
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
              teachers={teachers}
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

          {currentTab === 'teachers' && (
            <TeacherManagementView
              teachers={teachers}
              classes={classes}
              timetableSlots={timetableSlots}
              currentUser={currentUser}
              onAddTeacher={handleAddTeacher}
              onUpdateTeacher={handleUpdateTeacher}
              onDeleteTeacher={handleDeleteTeacher}
              onUpdateCurrentUser={handleUpdateCurrentUser}
              lang={lang}
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
              classSubjectsMap={classSubjectsMap}
              onSaveScores={handleSaveScores}
              onUpdateClassSubjects={handleUpdateClassSubjects}
              onViewReportCard={handleOpenReportCard}
              lang={lang}
            />
          )}

          {currentTab === 'reportCard' && (
            <ReportCardView
              students={students}
              classes={classes}
              examScores={examScores}
              classSubjectsMap={classSubjectsMap}
              selectedStudentId={reportCardStudentId}
              onBack={() => setCurrentTab('students')}
              lang={lang}
            />
          )}

          {currentTab === 'tuition' && (
            <TuitionView
              students={students}
              classes={classes}
              tuitionFees={tuitionFees}
              classPricing={classPricing}
              onAddFee={handleAddFee}
              onUpdateFee={handleUpdateFee}
              onDeleteFee={handleDeleteFee}
              onUpdatePricing={handleUpdatePricing}
              onBatchGenerateFees={handleBatchGenerateFees}
              lang={lang}
            />
          )}

          {currentTab === 'timetable' && (
            <TimetableView
              classes={classes}
              timetableSlots={timetableSlots}
              onSaveSlot={handleSaveSlot}
              onDeleteSlot={handleDeleteSlot}
              lang={lang}
            />
          )}

          {currentTab === 'settings' && (
            <SchoolSettingsView
              classes={classes}
              onAddClass={handleAddClass}
              onUpdateClass={handleUpdateClass}
              onDeleteClass={handleDeleteClass}
              onResetData={handleResetData}
              lang={lang}
              onOpenDeveloperProfile={() => setIsDevProfileOpen(true)}
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

      {/* Developer Profile Modal (ប្រវត្តិរូបអ្នកបង្កើតកម្មវិធី) */}
      <DeveloperProfileModal
        isOpen={isDevProfileOpen}
        onClose={() => setIsDevProfileOpen(false)}
        developer={developerProfile}
        onSaveProfile={(updated) => setDeveloperProfile(updated)}
        lang={lang}
      />
    </div>
  );
}
