import React, { useState, useMemo, useRef } from 'react';
import {
  Printer,
  ChevronLeft,
  ChevronRight,
  School,
  Award,
  CheckCircle,
  FileCheck,
  User,
  ExternalLink,
  Download,
  Loader2,
} from 'lucide-react';
import { Student, GradeClass, ExamTermScore, Subject } from '../types';
import { Language, translations } from '../utils/i18n';
import {
  DEFAULT_SUBJECTS,
  calculateClassRanks,
  calculateMaxPossibleTotal,
  determineGradeLetter,
} from '../utils/academic';
import { SCHOOL_INFO } from '../data/mockData';
import { printElement, openPrintWindow, exportAsHtmlFile } from '../utils/printHelper';

interface ReportCardViewProps {
  students: Student[];
  classes: GradeClass[];
  examScores: ExamTermScore[];
  classSubjectsMap?: Record<string, Subject[]>;
  selectedStudentId?: string;
  onBack: () => void;
  lang: Language;
}

export const ReportCardView: React.FC<ReportCardViewProps> = ({
  students,
  classes,
  examScores,
  classSubjectsMap,
  selectedStudentId,
  onBack,
  lang,
}) => {
  const t = translations[lang];

  // Active student selection
  const [currentStudentId, setCurrentStudentId] = useState<string>(
    selectedStudentId || students[0]?.id || ''
  );
  const [selectedTerm, setSelectedTerm] = useState<string>('ឆមាសទី ១ (២០២៤-២០២៥)');

  const student = students.find((s) => s.id === currentStudentId) || students[0];
  const gradeClass = classes.find((c) => c.id === student?.gradeId);

  // Dynamic subjects for student's class level
  const studentSubjects: Subject[] = useMemo(() => {
    if (!student) return DEFAULT_SUBJECTS;
    if (classSubjectsMap && classSubjectsMap[student.gradeId]) {
      return classSubjectsMap[student.gradeId];
    }
    if (classSubjectsMap && classSubjectsMap['default']) {
      return classSubjectsMap['default'];
    }
    return DEFAULT_SUBJECTS;
  }, [student, classSubjectsMap]);

  // Active subjects studied in this student's class
  const activeStudentSubjects = useMemo(() => {
    return studentSubjects.filter((s) => s.isActive !== false);
  }, [studentSubjects]);

  // Max possible total score for current class
  const maxPossibleTotal = useMemo(() => {
    return calculateMaxPossibleTotal(studentSubjects);
  }, [studentSubjects]);

  // Compute ranks for the class
  const classScores = useMemo(() => {
    if (!student) return [];
    const gradeScores = examScores.filter((e) => {
      const s = students.find((st) => st.id === e.studentId);
      return s?.gradeId === student.gradeId && e.term === selectedTerm;
    });
    return calculateClassRanks(gradeScores, studentSubjects);
  }, [examScores, students, student, selectedTerm, studentSubjects]);

  const studentExam = classScores.find((e) => e.studentId === student?.id);
  const evaluation = determineGradeLetter(studentExam?.averageScore ?? 0);

  // Navigation between students in the same class
  const classStudents = useMemo(() => {
    return students.filter((s) => s.gradeId === student?.gradeId);
  }, [students, student]);

  const currentIndex = classStudents.findIndex((s) => s.id === student?.id);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentStudentId(classStudents[currentIndex - 1].id);
    }
  };

  const reportCardRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const handleNext = () => {
    if (currentIndex < classStudents.length - 1) {
      setCurrentStudentId(classStudents[currentIndex + 1].id);
    }
  };

  const cardTitle = `ព្រឹត្តិបត្រពិន្ទុ_${student?.khmerName || 'សិស្ស'}_${student?.gradeId || ''}`;

  const handlePrint = async () => {
    if (!reportCardRef.current) return;
    setIsPrinting(true);
    try {
      await printElement(reportCardRef.current, {
        title: cardTitle,
        orientation: 'portrait',
      });
    } finally {
      setIsPrinting(false);
    }
  };

  const handleOpenCleanWindow = () => {
    if (!reportCardRef.current) return;
    openPrintWindow(reportCardRef.current, cardTitle, 'portrait');
  };

  const handleExportHtml = () => {
    if (!reportCardRef.current) return;
    exportAsHtmlFile(reportCardRef.current, `${cardTitle}.html`, 'portrait');
  };

  if (!student) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500">{lang === 'km' ? 'មិនមានទិន្នន័យសិស្ស' : 'No student selected'}</p>
        <button onClick={onBack} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
          {lang === 'km' ? 'ត្រឡប់ក្រោយ' : 'Back'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar (hidden when printing) */}
      <div className="no-print bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-base font-bold text-slate-900">
              {lang === 'km' ? 'ព្រឹត្តិបត្រពិន្ទុផ្លូវការ' : 'Official Student Report Card'}
            </h2>
            <p className="text-xs text-slate-500">
              {lang === 'km' ? 'អាចបោះពុម្ព ឬរក្សាទុកជា PDF បានយ៉ាងស្អាតតាមខ្នាត A4' : 'Formatted for standard A4 browser print & PDF'}
            </p>
          </div>
        </div>

        {/* Student Selector & Paging */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handlePrev}
            disabled={currentIndex <= 0}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-30 cursor-pointer"
            title="Previous Student"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <select
            value={currentStudentId}
            onChange={(e) => setCurrentStudentId(e.target.value)}
            className="px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg font-semibold"
          >
            {classStudents.map((s) => (
              <option key={s.id} value={s.id}>
                {s.khmerName} ({s.code}) - {s.gradeId}
              </option>
            ))}
          </select>

          <button
            onClick={handleNext}
            disabled={currentIndex >= classStudents.length - 1}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-30 cursor-pointer"
            title="Next Student"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-60"
          >
            {isPrinting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
            <span>{isPrinting ? (lang === 'km' ? 'កំពុងរៀបចំ...' : 'Preparing...') : t.print}</span>
          </button>

          <button
            onClick={handleOpenCleanWindow}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            title={lang === 'km' ? 'បើកផ្ទាំងដាច់ដោយឡែក' : 'Open in separate tab'}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'km' ? 'បើកផ្ទាំងថ្មី' : 'New Tab'}</span>
          </button>

          <button
            onClick={handleExportHtml}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            title={lang === 'km' ? 'ទាញយក HTML' : 'Download HTML'}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'km' ? 'ទាញយក HTML' : 'Download'}</span>
          </button>
        </div>
      </div>

      {/* Official Khmer Report Card Document Sheet (Paper container) */}
      <div ref={reportCardRef} id="printable-report-card" className="max-w-[850px] mx-auto bg-white p-8 sm:p-12 rounded-2xl border border-slate-300 shadow-md print:shadow-none print:border-none print:p-0 print:m-0 text-slate-900">
        {/* National Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5 mb-6">
          {/* Left School Info */}
          <div className="text-xs leading-relaxed">
            <p className="font-bold text-sm text-slate-900">{SCHOOL_INFO.ministrySub.split('\n')[0]}</p>
            <p className="text-slate-700">{SCHOOL_INFO.ministrySub.split('\n')[1]}</p>
            <p className="font-bold text-slate-900 mt-1">{SCHOOL_INFO.nameKhmer}</p>
            <p className="text-[11px] text-slate-600 font-sans">{SCHOOL_INFO.nameEnglish}</p>
            <p className="text-[11px] text-slate-600 font-mono mt-0.5">Tel: {SCHOOL_INFO.phone}</p>
          </div>

          {/* Right Kingdom Motto */}
          <div className="text-center">
            <h3 className="font-moul text-sm sm:text-base text-slate-900 tracking-wide">
              ព្រះរាជាណាចក្រកម្ពុជា
            </h3>
            <h4 className="font-moul text-xs sm:text-sm text-slate-900 mt-1">
              ជាតិ សាសនា ព្រះមហាក្សត្រ
            </h4>
            <div className="w-20 h-0.5 bg-slate-900 mx-auto mt-2 opacity-60" />
          </div>
        </div>

        {/* Certificate Title */}
        <div className="text-center my-6">
          <h2 className="font-moul text-lg sm:text-xl text-blue-950">
            ព្រឹត្តិបត្រពិន្ទុការសិក្សា
          </h2>
          <p className="text-xs font-semibold text-slate-700 mt-1">
            ឆមាសទី ១ • ឆ្នាំសិក្សា {SCHOOL_INFO.academicYear}
          </p>
        </div>

        {/* Student Profile Info Grid */}
        <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 mb-6 text-xs sm:text-sm">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4">
            <div>
              <span className="text-slate-500">{t.khmerName}:</span>{' '}
              <span className="font-bold text-slate-900 text-sm">{student.khmerName}</span>
            </div>
            <div>
              <span className="text-slate-500">{t.latinName}:</span>{' '}
              <span className="font-semibold text-slate-900">{student.latinName}</span>
            </div>
            <div>
              <span className="text-slate-500">{t.code}:</span>{' '}
              <span className="font-mono font-bold text-blue-700">{student.code}</span>
            </div>
            <div>
              <span className="text-slate-500">{t.gender}:</span>{' '}
              <span className="font-medium text-slate-900">
                {student.gender === 'female' ? 'ស្រី' : 'ប្រុស'}
              </span>
            </div>
            <div>
              <span className="text-slate-500">{t.dob}:</span>{' '}
              <span className="font-medium text-slate-900">{student.dob}</span>
            </div>
            <div>
              <span className="text-slate-500">{t.grade}:</span>{' '}
              <span className="font-bold text-slate-900">{gradeClass?.name}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-500">{t.parent}:</span>{' '}
              <span className="font-medium text-slate-900">
                {student.parentName} ({student.parentRelationship}) • {student.parentPhone}
              </span>
            </div>
            <div>
              <span className="text-slate-500">{lang === 'km' ? 'គ្រូបន្ទុក' : 'Teacher'}:</span>{' '}
              <span className="font-medium text-slate-900">{gradeClass?.homeroomTeacher}</span>
            </div>
          </div>
        </div>

        {/* Detailed Subject Score Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-slate-300 text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold">
                <th className="border border-slate-300 p-2 text-center w-10">ល.រ</th>
                <th className="border border-slate-300 p-2 text-left">មុខវិជ្ជា (Subjects)</th>
                <th className="border border-slate-300 p-2 text-center w-16">មេគុណ</th>
                <th className="border border-slate-300 p-2 text-center w-20">ពិន្ទុពេញ</th>
                <th className="border border-slate-300 p-2 text-center w-24">ពិន្ទុទទួលបាន</th>
                <th className="border border-slate-300 p-2 text-center w-24">ពិន្ទុមេគុណ</th>
                <th className="border border-slate-300 p-2 text-center w-20">និទ្ទេស</th>
              </tr>
            </thead>
            <tbody>
              {activeStudentSubjects.map((sub, i) => {
                const rawScore = studentExam?.scores[sub.id] ?? 0;
                const weighted = rawScore * sub.coefficient;
                const subEval = determineGradeLetter((rawScore / (sub.maxScore || 100)) * 100);

                return (
                  <tr key={sub.id} className="border-b border-slate-200">
                    <td className="border border-slate-300 p-2 text-center font-mono">{i + 1}</td>
                    <td className="border border-slate-300 p-2">
                      <span className="font-semibold text-slate-900">{sub.khmerName}</span>
                      <span className="text-[11px] text-slate-500 ml-1">({sub.englishName})</span>
                    </td>
                    <td className="border border-slate-300 p-2 text-center font-mono font-medium">
                      {sub.coefficient}
                    </td>
                    <td className="border border-slate-300 p-2 text-center font-mono font-bold text-blue-800 bg-blue-50/30">
                      {sub.maxScore || 100}
                    </td>
                    <td className="border border-slate-300 p-2 text-center font-mono font-bold text-slate-900">
                      {rawScore}
                    </td>
                    <td className="border border-slate-300 p-2 text-center font-mono font-bold text-blue-900 bg-slate-50/50">
                      {weighted}
                    </td>
                    <td className="border border-slate-300 p-2 text-center font-bold">
                      <span className={subEval.letter === 'F' ? 'text-rose-600' : 'text-slate-800'}>
                        {subEval.letter}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Evaluation & Class Standing Summary Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* Left summary numbers */}
          <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/50 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 font-medium">{t.totalScore}:</span>
              <span className="font-bold font-mono text-slate-900">
                {studentExam?.totalScore ?? 0} <span className="text-xs text-slate-500 font-normal">/ {maxPossibleTotal}</span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 font-medium">{t.averageScore}:</span>
              <span className="font-bold font-mono text-blue-700 text-base">
                {studentExam?.averageScore?.toFixed(2) ?? '0.00'} <span className="text-xs text-slate-500 font-normal">/ 100</span>
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2">
              <span className="text-slate-600 font-medium">{t.rank}:</span>
              <span className="font-bold text-amber-800">
                ចំណាត់ថ្នាក់លេខ {studentExam?.rank ?? '—'} (នៃ {classStudents.length} នាក់)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 font-medium">{t.mention}:</span>
              <span className="font-bold text-emerald-800">
                និទ្ទេស {evaluation.letter} ({evaluation.khmerMention})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 font-medium">{t.conduct}:</span>
              <span className="font-semibold text-slate-800">{studentExam?.conduct || 'ល្អណាស់'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 font-medium">លទ្ធផលរួម:</span>
              <span className={`font-bold ${evaluation.passed ? 'text-emerald-700' : 'text-rose-700'}`}>
                {evaluation.passed ? 'ជាប់ជាស្ថាពរ (PASSED)' : 'ធ្លាក់ (FAILED)'}
              </span>
            </div>
          </div>

          {/* Right teacher remarks */}
          <div className="border border-slate-300 rounded-xl p-4 flex flex-col justify-between text-xs sm:text-sm">
            <div>
              <h5 className="font-bold text-slate-900 mb-2">
                មតិយោបល់របស់លោកគ្រូ/អ្នកគ្រូបន្ទុកថ្នាក់៖
              </h5>
              <p className="text-slate-700 italic leading-relaxed">
                "{studentExam?.teacherRemark || 'សិស្សមានការខិតខំប្រឹងប្រែងរៀនសូត្របានយ៉ាងល្អប្រសើរ និងមានអាកប្បកិរិយាថ្លៃថ្នូរ គួរបន្តរក្សាភាពឆ្នើមនេះបន្តទៀត។'}"
              </p>
            </div>
            <div className="text-[11px] text-slate-500 mt-4 border-t border-slate-200 pt-2">
              សេចក្តីជូនដំណឹង៖ អាណាព្យាបាលសូមចុះហត្ថលេខាបញ្ជាក់ការទទួលជ្រាប។
            </div>
          </div>
        </div>

        {/* Official Signatures & School Stamp Date */}
        <div className="grid grid-cols-2 text-center text-xs sm:text-sm pt-6 mt-8 border-t border-slate-200">
          <div>
            <p className="text-slate-600">បានឃើញ និងឯកភាព</p>
            <p className="font-bold text-slate-900 mt-0.5">នាយកសាលា</p>
            <div className="h-20 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-red-300 text-red-400 flex items-center justify-center text-[10px] transform -rotate-12 select-none opacity-80">
                [ ត្រាសាលា ]
              </div>
            </div>
            <p className="font-bold text-slate-800">{SCHOOL_INFO.principal}</p>
          </div>

          <div>
            <p className="text-slate-600">
              រាជធានីភ្នំពេញ, ថ្ងៃទី ២៤ ខែ តុលា ឆ្នាំ ២០២៤
            </p>
            <p className="font-bold text-slate-900 mt-0.5">គ្រូបន្ទុកថ្នាក់</p>
            <div className="h-20 flex items-center justify-center">
              <span className="font-serif italic text-blue-900 opacity-70 text-sm select-none">
                {gradeClass?.homeroomTeacher.replace('លោកគ្រូ ', '').replace('អ្នកគ្រូ ', '')}
              </span>
            </div>
            <p className="font-bold text-slate-800">{gradeClass?.homeroomTeacher}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
