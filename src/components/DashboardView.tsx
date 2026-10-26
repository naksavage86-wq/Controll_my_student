import React from 'react';
import {
  Users,
  Award,
  CalendarCheck,
  CreditCard,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Student, GradeClass, ExamTermScore, DailyAttendance, TuitionFee } from '../types';
import { Language, translations } from '../utils/i18n';
import { calculateClassRanks, calculateAttendanceSummary, formatSchoolFee } from '../utils/academic';

interface DashboardViewProps {
  students: Student[];
  classes: GradeClass[];
  examScores: ExamTermScore[];
  attendance: DailyAttendance[];
  tuitionFees: TuitionFee[];
  lang: Language;
  onNavigate: (tab: any) => void;
  onSelectStudent: (studentId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  classes,
  examScores,
  attendance,
  tuitionFees,
  lang,
  onNavigate,
  onSelectStudent,
}) => {
  const t = translations[lang];

  // Stats
  const totalStudents = students.length;
  const femaleCount = students.filter((s) => s.gender === 'female').length;
  const maleCount = students.filter((s) => s.gender === 'male').length;
  const femalePercentage = totalStudents > 0 ? Math.round((femaleCount / totalStudents) * 100) : 0;

  // Ranked students for Honor Roll
  const rankedExams = calculateClassRanks(examScores);
  const topHonorStudents = rankedExams.slice(0, 5).map((exam) => {
    const student = students.find((s) => s.id === exam.studentId);
    return {
      exam,
      student,
    };
  }).filter((item) => item.student !== undefined);

  // Today or latest attendance
  const latestAttendance = attendance[attendance.length - 1];
  let todayPresent = 0;
  let todayPermission = 0;
  let todayAbsent = 0;
  let todayLate = 0;

  if (latestAttendance) {
    Object.values(latestAttendance.records).forEach((status) => {
      if (status === 'present') todayPresent++;
      else if (status === 'permission') todayPermission++;
      else if (status === 'absent') todayAbsent++;
      else if (status === 'late') todayLate++;
    });
  }
  const totalAttendanceRecorded = todayPresent + todayPermission + todayAbsent + todayLate;
  const todayRate = totalAttendanceRecorded > 0 ? Math.round((todayPresent / totalAttendanceRecorded) * 100) : 98;

  // Tuition stats
  const totalTuitionAmount = tuitionFees.reduce((acc, curr) => acc + curr.amount, 0);
  const totalCollected = tuitionFees.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalPending = totalTuitionAmount - totalCollected;
  const overdueCount = tuitionFees.filter((f) => f.status === 'overdue').length;

  // Grade letters breakdown (A, B, C, D, E, F)
  const letterCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
  rankedExams.forEach((e) => {
    if (e.gradeLetter && letterCounts[e.gradeLetter] !== undefined) {
      letterCounts[e.gradeLetter]++;
    }
  });

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'km' ? 'ប្រព័ន្ធគ្រប់គ្រងសាលាគំរូ ២០២៤-២០២៥' : 'Academic Year 2024-2025'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
            {lang === 'km'
              ? 'សូមស្វាគមន៍មកកាន់ប្រព័ន្ធគ្រប់គ្រងទិន្នន័យសិស្សានុសិស្ស'
              : 'Welcome to SchoolPro Information System'}
          </h2>
          <p className="text-blue-100/90 text-sm leading-relaxed mb-6">
            {lang === 'km'
              ? 'តាមដានព័ត៌មានសិស្ស វត្តមានប្រចាំថ្ងៃ លទ្ធផលប្រឡង ចំណាត់ថ្នាក់ និងថ្លៃសិក្សាដោយរលូន និងមានតម្លាភាពខ្ពស់។'
              : 'Seamlessly track student profiles, daily attendance records, exam gradebooks, and financial receipts with high efficiency.'}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('attendance')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-medium rounded-xl transition-all shadow-md cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>{lang === 'km' ? 'កត់ត្រាវត្តមានថ្ងៃនេះ' : 'Take Daily Attendance'}</span>
            </button>
            <button
              onClick={() => onNavigate('grades')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>{lang === 'km' ? 'បញ្ចូលពិន្ទុ & ចំណាត់ថ្នាក់' : 'Manage Gradebook'}</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative background shapes */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-20 top-4 w-48 h-48 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t.totalStudents}
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{totalStudents}</span>
            <span className="text-xs text-slate-500">{lang === 'km' ? 'នាក់' : 'students'}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
            <span className="flex items-center gap-1 text-pink-600">
              <span className="w-2 h-2 rounded-full bg-pink-500" />
              {t.femaleCount}: {femaleCount} ({femalePercentage}%)
            </span>
            <span className="flex items-center gap-1 text-blue-600">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              {t.maleCount}: {maleCount}
            </span>
          </div>
        </div>

        {/* Card 2: Classes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t.classesCount}
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{classes.length}</span>
            <span className="text-xs text-slate-500">{lang === 'km' ? 'ថ្នាក់រៀន' : 'classes'}</span>
          </div>
          <div className="text-xs text-slate-500 border-t border-slate-100 pt-2.5 flex items-center justify-between">
            <span>{lang === 'km' ? 'កម្រិតថ្នាក់' : 'Levels'}: ៧, ៩, ១២</span>
            <span className="text-emerald-600 font-medium">100% {lang === 'km' ? 'ដំណើរការ' : 'Active'}</span>
          </div>
        </div>

        {/* Card 3: Today's Attendance Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t.attendanceRate}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{todayRate}%</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              {lang === 'km' ? 'ទៀងទាត់' : 'Good'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 border-t border-slate-100 pt-2.5">
            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              {t.present}: {todayPresent}
            </span>
            <span className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
              {t.permission}: {todayPermission}
            </span>
            <span className="text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
              {t.absent}: {todayAbsent}
            </span>
          </div>
        </div>

        {/* Card 4: Tuition Collection */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t.tuitionCollected}
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">${totalCollected}</span>
            <span className="text-xs text-slate-500">/ ${totalTuitionAmount}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
            <span className="text-amber-700 font-medium">
              {t.pending}: ${totalPending}
            </span>
            {overdueCount > 0 && (
              <span className="text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {overdueCount} {t.overdue}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Honor Roll & Academic Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Honor Roll (Top Students) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{t.honorRoll}</h3>
                <p className="text-xs text-slate-500">
                  {lang === 'km' ? 'សិស្សដែលមានមធ្យមភាគពិន្ទុខ្ពស់ជាងគេប្រចាំឆមាស' : 'Top academic achievers of the semester'}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('grades')}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>{lang === 'km' ? 'មើលទាំងអស់' : 'View All'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {topHonorStudents.map(({ exam, student }, index) => {
              if (!student) return null;
              const medal =
                index === 0
                  ? '🥇'
                  : index === 1
                  ? '🥈'
                  : index === 2
                  ? '🥉'
                  : `#${index + 1}`;

              return (
                <div
                  key={student.id}
                  onClick={() => onSelectStudent(student.id)}
                  className="py-3 px-2 flex items-center justify-between hover:bg-slate-50/80 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 text-center text-lg font-bold shrink-0">{medal}</div>
                    <img
                      src={student.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                      alt={student.khmerName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
                    />
                    <div>
                      <div className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                        {student.khmerName}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span>{student.latinName}</span>
                        <span>•</span>
                        <span className="font-medium text-slate-600">{student.code}</span>
                        <span>•</span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[11px]">
                          {student.gradeId}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900">
                      {exam.averageScore?.toFixed(2)} <span className="text-xs font-normal text-slate-500">/ 100</span>
                    </div>
                    <div className="inline-block mt-0.5">
                      <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {lang === 'km' ? `និទ្ទេស ${exam.gradeLetter}` : `Grade ${exam.gradeLetter}`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grade Distribution & Quick Tasks */}
        <div className="space-y-6">
          {/* Grade Distribution Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              {lang === 'km' ? 'ស្ថិតិលទ្ធផលសិក្សា (និទ្ទេស)' : 'Grade Distribution'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {lang === 'km' ? 'ការបែងចែកនិទ្ទេសសិស្សទូទាំងសាលា' : 'Distribution of letter grades (A to F)'}
            </p>

            <div className="space-y-2.5">
              {[
                { letter: 'A', label: 'A (៩០-១០០ ពិន្ទុ)', count: letterCounts.A, color: 'bg-emerald-500' },
                { letter: 'B', label: 'B (៨០-៨៩ ពិន្ទុ)', count: letterCounts.B, color: 'bg-blue-500' },
                { letter: 'C', label: 'C (៧០-៧៩ ពិន្ទុ)', count: letterCounts.C, color: 'bg-indigo-500' },
                { letter: 'D', label: 'D (៦០-៦៩ ពិន្ទុ)', count: letterCounts.D, color: 'bg-amber-500' },
                { letter: 'E', label: 'E (៥០-៥៩ ពិន្ទុ)', count: letterCounts.E, color: 'bg-orange-500' },
                { letter: 'F', label: 'F (ក្រោម ៥០)', count: letterCounts.F, color: 'bg-rose-500' },
              ].map((item) => {
                const totalEvaluated = rankedExams.length || 1;
                const percentage = Math.round((item.count / totalEvaluated) * 100);
                return (
                  <div key={item.letter}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{item.label}</span>
                      <span className="text-slate-500 font-medium text-xs">
                        {item.count} {lang === 'km' ? 'នាក់' : 'stu'} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`${item.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-5 shadow-xs">
            <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>{lang === 'km' ? 'ផ្លូវកាត់ការងាររហ័ស' : 'Quick Actions'}</span>
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('reportCard')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors cursor-pointer text-left"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  {lang === 'km' ? 'ចេញព្រឹត្តិបត្រពិន្ទុផ្លូវការ' : 'Generate Student Report Cards'}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
              </button>
              <button
                onClick={() => onNavigate('tuition')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors cursor-pointer text-left"
              >
                <span className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  {lang === 'km' ? 'ចេញបង្កាន់ដៃទទួលប្រាក់' : 'Tuition Invoice & Receipts'}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
              </button>
              <button
                onClick={() => onNavigate('timetable')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors cursor-pointer text-left"
              >
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-400" />
                  {lang === 'km' ? 'ពិនិត្យកាលវិភាគបង្រៀន' : 'View Class Timetables'}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
