import React from 'react';
import {
  X,
  User,
  Phone,
  MapPin,
  Calendar,
  Award,
  CalendarCheck,
  CreditCard,
  FileText,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { Student, GradeClass, ExamTermScore, DailyAttendance, TuitionFee } from '../types';
import { Language, translations } from '../utils/i18n';
import { calculateAttendanceSummary, formatSchoolFee } from '../utils/academic';

interface StudentProfileModalProps {
  student: Student | null;
  gradeClass?: GradeClass;
  examScore?: ExamTermScore;
  attendanceRecords: DailyAttendance[];
  tuitionFees: TuitionFee[];
  isOpen: boolean;
  onClose: () => void;
  onEdit: (student: Student) => void;
  onViewReportCard: (studentId: string) => void;
  lang: Language;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  gradeClass,
  examScore,
  attendanceRecords,
  tuitionFees,
  isOpen,
  onClose,
  onEdit,
  onViewReportCard,
  lang,
}) => {
  const t = translations[lang];

  if (!isOpen || !student) return null;

  const attendanceSummary = calculateAttendanceSummary(attendanceRecords, student.id);
  const studentFees = tuitionFees.filter((f) => f.studentId === student.id);
  const totalPaid = studentFees.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalOwed = studentFees.reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Top Header Card with Banner */}
        <div className="relative bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-6 pb-16">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs text-blue-200 uppercase tracking-wider mb-1 font-semibold">
            <span>{gradeClass?.name || student.gradeId}</span>
            <span>•</span>
            <span>{gradeClass?.room}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">{student.khmerName}</h2>
          <p className="text-sm text-blue-100">{student.latinName} • <span className="font-mono">{student.code}</span></p>
        </div>

        {/* Floating Avatar & Quick Badge */}
        <div className="px-6 -mt-10 flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            <img
              src={student.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
              alt={student.khmerName}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-lg shrink-0 bg-white"
            />
            <div className="pb-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                student.status === 'active'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-800'
              }`}>
                {student.status === 'active' ? (lang === 'km' ? 'កំពុងរៀន' : 'Active') : student.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pb-1">
            <button
              onClick={() => onEdit(student)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              {t.edit}
            </button>
            <button
              onClick={() => {
                onClose();
                onViewReportCard(student.id);
              }}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t.reportCard}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Key Metrics row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-center">
              <div className="text-xs text-slate-500 mb-0.5">{lang === 'km' ? 'វត្តមានសរុប' : 'Attendance'}</div>
              <div className="text-lg font-bold text-slate-900">{attendanceSummary.attendanceRate}%</div>
              <div className="text-[11px] text-slate-500">
                {attendanceSummary.present} {lang === 'km' ? 'ថ្ងៃមានវត្តមាន' : 'days present'}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-center">
              <div className="text-xs text-slate-500 mb-0.5">{t.averageScore}</div>
              <div className="text-lg font-bold text-blue-700">
                {examScore?.averageScore ? examScore.averageScore.toFixed(1) : '—'}
              </div>
              <div className="text-[11px] text-slate-500">
                {lang === 'km' ? 'ចំណាត់ថ្នាក់លេខ' : 'Rank'}: #{examScore?.rank ?? '—'}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-center">
              <div className="text-xs text-slate-500 mb-0.5">{t.mention}</div>
              <div className="text-lg font-bold text-emerald-700">{examScore?.gradeLetter ?? '—'}</div>
              <div className="text-[11px] text-slate-500">{examScore?.conduct || (lang === 'km' ? 'ល្អ' : 'Good')}</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-center">
              <div className="text-xs text-slate-500 mb-0.5">{lang === 'km' ? 'ជំពាក់ថ្លៃសិក្សា' : 'Unpaid Fees'}</div>
              <div className={`text-lg font-bold ${totalOwed > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                ${totalOwed}
              </div>
              <div className="text-[11px] text-slate-500">
                {lang === 'km' ? 'បានបង់' : 'Paid'}: ${totalPaid}
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Bio Card */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>{lang === 'km' ? 'ព័ត៌មានលម្អិតសិស្ស' : 'Personal Profile'}</span>
              </h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">{t.gender}:</span>
                  <span className="font-medium text-slate-900">
                    {student.gender === 'female' ? (lang === 'km' ? 'ស្រី' : 'Female') : (lang === 'km' ? 'ប្រុស' : 'Male')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">{t.dob}:</span>
                  <span className="font-medium text-slate-900">{student.dob}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">{t.pob}:</span>
                  <span className="font-medium text-slate-900">{student.pob || '—'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">{t.phone}:</span>
                  <span className="font-medium text-slate-900 font-mono">{student.phone || '—'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">{lang === 'km' ? 'គ្រូបន្ទុកថ្នាក់' : 'Homeroom Teacher'}:</span>
                  <span className="font-medium text-slate-900">{gradeClass?.homeroomTeacher}</span>
                </div>
                <div className="py-1">
                  <span className="text-slate-500 block mb-1">{t.address}:</span>
                  <span className="font-medium text-slate-900 text-xs">{student.address || '—'}</span>
                </div>
              </div>
            </div>

            {/* Guardian & Emergency */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>{lang === 'km' ? 'អាណាព្យាបាល & សុខភាព' : 'Guardian & Health'}</span>
              </h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">{t.parent}:</span>
                  <span className="font-bold text-slate-900">{student.parentName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">{lang === 'km' ? 'ត្រូវជា' : 'Relation'}:</span>
                  <span className="font-medium text-slate-900">{student.parentRelationship}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">{lang === 'km' ? 'លេខទូរស័ព្ទ' : 'Phone'}:</span>
                  <span className="font-bold text-blue-600 font-mono">{student.parentPhone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">{lang === 'km' ? 'មុខរបរ' : 'Occupation'}:</span>
                  <span className="font-medium text-slate-900">{student.parentOccupation || '—'}</span>
                </div>
                {student.notes && (
                  <div className="py-2 bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/50 mt-2">
                    <span className="text-[11px] font-bold text-amber-800 block mb-0.5">
                      {lang === 'km' ? 'កំណត់សម្គាល់ពិសេស' : 'Special Remarks'}:
                    </span>
                    <p className="text-xs text-amber-900">{student.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {lang === 'km' ? 'បិទ' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
