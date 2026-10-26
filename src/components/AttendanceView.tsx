import React, { useState, useMemo } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserX,
  FileCheck,
  Save,
  Calendar as CalendarIcon,
  Filter,
  Check,
  PhoneCall,
} from 'lucide-react';
import { Student, GradeClass, DailyAttendance, AttendanceStatus } from '../types';
import { Language, translations } from '../utils/i18n';
import { calculateAttendanceSummary } from '../utils/academic';

interface AttendanceViewProps {
  students: Student[];
  classes: GradeClass[];
  attendanceRecords: DailyAttendance[];
  onSaveDailyAttendance: (record: DailyAttendance) => void;
  lang: Language;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  students,
  classes,
  attendanceRecords,
  onSaveDailyAttendance,
  lang,
}) => {
  const t = translations[lang];

  const [selectedGrade, setSelectedGrade] = useState<string>(classes[0]?.id || '7A');
  const [selectedDate, setSelectedDate] = useState<string>('2025-10-24');
  const [selectedSession, setSelectedSession] = useState<'morning' | 'afternoon' | 'full'>('morning');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter students by selected grade
  const gradeStudents = useMemo(() => {
    return students.filter((s) => s.gradeId === selectedGrade && s.status === 'active');
  }, [students, selectedGrade]);

  // Find existing record for this date, grade, and session or initialize
  const existingRecord = useMemo(() => {
    return attendanceRecords.find(
      (r) =>
        r.date === selectedDate &&
        r.gradeId === selectedGrade &&
        (r.session || 'morning') === selectedSession
    );
  }, [attendanceRecords, selectedDate, selectedGrade, selectedSession]);

  // Current working statuses
  const [currentStatuses, setCurrentStatuses] = useState<Record<string, AttendanceStatus>>({});
  const [note, setNote] = useState<string>('');

  // Sync state when date, grade, or session changes
  React.useEffect(() => {
    if (existingRecord) {
      setCurrentStatuses(existingRecord.records);
      setNote(existingRecord.note || '');
    } else {
      // Default all to 'present'
      const initial: Record<string, AttendanceStatus> = {};
      gradeStudents.forEach((s) => {
        initial[s.id] = 'present';
      });
      setCurrentStatuses(initial);
      setNote('');
    }
    setSaveSuccess(false);
  }, [existingRecord, selectedDate, selectedGrade, selectedSession, gradeStudents]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setCurrentStatuses((prev) => ({
      ...prev,
      [studentId]: status,
    }));
    setSaveSuccess(false);
  };

  const handleMarkAllPresent = () => {
    const allPresent: Record<string, AttendanceStatus> = {};
    gradeStudents.forEach((s) => {
      allPresent[s.id] = 'present';
    });
    setCurrentStatuses(allPresent);
    setSaveSuccess(false);
  };

  const handleSave = () => {
    const record: DailyAttendance = {
      id: existingRecord?.id || `att-${Date.now()}`,
      date: selectedDate,
      gradeId: selectedGrade,
      session: selectedSession,
      records: currentStatuses,
      note: note.trim() || undefined,
    };
    onSaveDailyAttendance(record);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Compute live count stats
  const total = gradeStudents.length;
  let presentCount = 0;
  let permissionCount = 0;
  let absentCount = 0;
  let lateCount = 0;

  gradeStudents.forEach((s) => {
    const st = currentStatuses[s.id] || 'present';
    if (st === 'present') presentCount++;
    else if (st === 'permission') permissionCount++;
    else if (st === 'absent') absentCount++;
    else if (st === 'late') lateCount++;
  });

  const presentPercent = total > 0 ? Math.round((presentCount / total) * 100) : 100;

  // Identify students in this class with attendance warnings (>= 3 absents overall)
  const warningStudents = useMemo(() => {
    return gradeStudents.filter((s) => {
      const summary = calculateAttendanceSummary(attendanceRecords, s.id);
      return summary.statusWarning;
    });
  }, [gradeStudents, attendanceRecords]);

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-blue-600" />
            <span>{t.attendance}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'km' ? 'កត់ត្រាវត្តមាន សុំច្បាប់ និងអវត្តមានប្រចាំថ្ងៃតាមថ្នាក់' : 'Daily roll call, permissions, and absence tracking by class'}
          </p>
        </div>

        {/* Date, Grade and Session Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Shift / Session Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedSession('morning')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedSession === 'morning'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>☀️</span>
              <span>{lang === 'km' ? 'វេនព្រឹក' : 'Morning'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedSession('afternoon')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedSession === 'afternoon'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🌤️</span>
              <span>{lang === 'km' ? 'វេនរសៀល' : 'Afternoon'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedSession('full')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedSession === 'full'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>📅</span>
              <span>{lang === 'km' ? 'ពេញមួយថ្ងៃ' : 'Full Day'}</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <CalendarIcon className="w-4 h-4 text-slate-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs sm:text-sm font-medium text-slate-800 bg-transparent focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="text-xs sm:text-sm font-medium text-slate-800 bg-transparent focus:outline-none"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-emerald-50 border border-emerald-200/80 p-3.5 rounded-xl text-emerald-900 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-emerald-700">{t.present}</div>
            <div className="text-xl font-bold">{presentCount} <span className="text-xs font-normal opacity-80">({presentPercent}%)</span></div>
          </div>
          <CheckCircle2 className="w-7 h-7 text-emerald-500 opacity-60" />
        </div>

        <div className="bg-blue-50 border border-blue-200/80 p-3.5 rounded-xl text-blue-900 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-blue-700">{t.permission} (ច្បាប់)</div>
            <div className="text-xl font-bold">{permissionCount}</div>
          </div>
          <FileCheck className="w-7 h-7 text-blue-500 opacity-60" />
        </div>

        <div className="bg-rose-50 border border-rose-200/80 p-3.5 rounded-xl text-rose-900 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-rose-700">{t.absent} (ឥតច្បាប់)</div>
            <div className="text-xl font-bold">{absentCount}</div>
          </div>
          <UserX className="w-7 h-7 text-rose-500 opacity-60" />
        </div>

        <div className="bg-amber-50 border border-amber-200/80 p-3.5 rounded-xl text-amber-900 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-amber-700">{t.late} (មកយឺត)</div>
            <div className="text-xl font-bold">{lateCount}</div>
          </div>
          <Clock className="w-7 h-7 text-amber-500 opacity-60" />
        </div>
      </div>

      {/* Warning banner if students exceed absence limit */}
      {warningStudents.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <span className="font-bold">
              {lang === 'km' ? 'ការជូនដំណឹងពីអវត្តមានសិស្ស៖' : 'Attendance Follow-up Alert:'}
            </span>{' '}
            {lang === 'km'
              ? `មានសិស្សចំនួន ${warningStudents.length} នាក់អវត្តមានចាប់ពី ៣ ដងឡើងទៅក្នុងឆមាសនេះ (គួរទាក់ទងទៅអាណាព្យាបាល)៖`
              : `There are ${warningStudents.length} student(s) with 3+ absences this semester:`}{' '}
            <span className="font-semibold underline">
              {warningStudents.map((s) => `${s.khmerName} (${s.parentPhone})`).join(', ')}
            </span>
          </div>
        </div>
      )}

      {/* Main Roll Call Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table top action bar */}
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm font-semibold text-slate-700">
            <span>{lang === 'km' ? 'បញ្ជីវត្តមានសិស្ស' : 'Student Roll Call'}: {classes.find((c) => c.id === selectedGrade)?.name} ({gradeStudents.length} {lang === 'km' ? 'នាក់' : 'students'})</span>
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
              selectedSession === 'morning'
                ? 'bg-amber-100 text-amber-800'
                : selectedSession === 'afternoon'
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {selectedSession === 'morning'
                ? (lang === 'km' ? '☀️ វេនព្រឹក (០៧:០០ - ១១:៣០)' : '☀️ Morning Shift')
                : selectedSession === 'afternoon'
                ? (lang === 'km' ? '🌤️ វេនរសៀល (១៣:០០ - ១៧:៣០)' : '🌤️ Afternoon Shift')
                : (lang === 'km' ? '📅 ពេញមួយថ្ងៃ' : '📅 Full Day')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllPresent}
              className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{t.markAllPresent}</span>
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'រក្សាទុកវត្តមាន' : 'Save Attendance'}</span>
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="bg-emerald-50 text-emerald-800 text-xs px-4 py-2 border-b border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'km' ? 'បានរក្សាទុកវត្តមានដោយជោគជ័យ!' : 'Attendance saved successfully!'}</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 w-28">{t.code}</th>
                <th className="py-3 px-4">{t.name}</th>
                <th className="py-3 px-4">{t.parent} & {t.phone}</th>
                <th className="py-3 px-4 text-center">{lang === 'km' ? 'ស្ថានភាពវត្តមាន' : 'Attendance Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {gradeStudents.map((student, idx) => {
                const currentStatus = currentStatuses[student.id] || 'present';
                const summary = calculateAttendanceSummary(attendanceRecords, student.id);

                return (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">{student.code}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{student.khmerName}</div>
                      <div className="text-xs text-slate-500">{student.latinName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{student.parentName}</div>
                      <div className="text-xs text-slate-500 font-mono flex items-center gap-1">
                        <PhoneCall className="w-3 h-3 text-slate-400" />
                        <span>{student.parentPhone}</span>
                      </div>
                    </td>

                    {/* Quick 4-button Status Selector */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {/* Present */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'present')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                            currentStatus === 'present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t.present}</span>
                        </button>

                        {/* Permission */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'permission')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                            currentStatus === 'permission'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          }`}
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>{t.permission}</span>
                        </button>

                        {/* Absent */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'absent')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                            currentStatus === 'absent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                          }`}
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>{t.absent}</span>
                        </button>

                        {/* Late */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'late')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                            currentStatus === 'late'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{t.late}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Note */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-200">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {lang === 'km' ? 'កំណត់សម្គាល់អំពីវត្តមានថ្ងៃនេះ' : 'Attendance Notes for Today'}
          </label>
          <input
            type="text"
            placeholder={lang === 'km' ? 'ឧ. មានសិស្សសុំច្បាប់ ឬអវត្តមានដោយមូលហេតុអ្វី...' : 'e.g. Flu leave note, school excursion...'}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
