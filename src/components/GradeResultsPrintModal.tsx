import React, { useRef, useState } from 'react';
import { X, Printer, Award, FileSpreadsheet, Download, CheckCircle, XCircle, ExternalLink, Loader2 } from 'lucide-react';
import { Student, GradeClass, ExamTermScore, Subject } from '../types';
import { Language } from '../utils/i18n';
import { DEFAULT_SUBJECTS, calculateMaxPossibleTotal } from '../utils/academic';
import { SCHOOL_INFO } from '../data/mockData';
import { printElement, openPrintWindow, exportAsHtmlFile } from '../utils/printHelper';

interface GradeResultsPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentClass?: GradeClass;
  students: Student[];
  term: string;
  rankedScores: ExamTermScore[];
  subjects?: Subject[];
  lang: Language;
}

export const GradeResultsPrintModal: React.FC<GradeResultsPrintModalProps> = ({
  isOpen,
  onClose,
  currentClass,
  students,
  term,
  rankedScores,
  subjects = DEFAULT_SUBJECTS,
  lang,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  if (!isOpen) return null;

  const activeSubjects = subjects.filter((s) => s.isActive !== false);
  const maxPossibleTotal = calculateMaxPossibleTotal(activeSubjects);

  // Student mapping
  const studentMap = new Map<string, Student>();
  students.forEach((s) => studentMap.set(s.id, s));

  // Statistics
  const totalStudents = rankedScores.length;
  const femaleStudents = rankedScores.filter((r) => studentMap.get(r.studentId)?.gender === 'female').length;
  const passedStudents = rankedScores.filter((r) => (r.averageScore ?? 0) >= 50).length;
  const failedStudents = totalStudents - passedStudents;
  const passRate = totalStudents > 0 ? ((passedStudents / totalStudents) * 100).toFixed(1) : '0';
  const highestAvg = rankedScores.length > 0 ? Math.max(...rankedScores.map((r) => r.averageScore ?? 0)).toFixed(2) : '0';
  const classAvg =
    rankedScores.length > 0
      ? (rankedScores.reduce((acc, curr) => acc + (curr.averageScore ?? 0), 0) / rankedScores.length).toFixed(2)
      : '0';

  const docTitle = `តារាងលទ្ធផល_${currentClass?.name || 'ថ្នាក់'}_${term}`;

  const handlePrint = async () => {
    if (!printAreaRef.current) return;
    setIsPrinting(true);
    try {
      await printElement(printAreaRef.current, {
        title: docTitle,
        orientation: 'landscape',
      });
    } finally {
      setIsPrinting(false);
    }
  };

  const handleOpenCleanWindow = () => {
    if (!printAreaRef.current) return;
    openPrintWindow(printAreaRef.current, docTitle, 'landscape');
  };

  const handleExportHtml = () => {
    if (!printAreaRef.current) return;
    exportAsHtmlFile(printAreaRef.current, `${docTitle}.html`, 'landscape');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden print:max-h-none print:shadow-none print:border-none print:w-full print:rounded-none">
        {/* Modal Top Actions (Hidden when printing) */}
        <div className="flex flex-wrap items-center justify-between p-4 border-b border-slate-200 bg-slate-50 gap-2 no-print">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-tight">
                {lang === 'km' ? 'ទិដ្ឋភាពបោះពុម្ពតារាងលទ្ធផលប្រឡង' : 'Exam Results Print Preview'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {lang === 'km' ? 'ទម្រង់ផ្ដេក A4 (Landscape) ស្របតាមក្រសួងអប់រំ' : 'Official Ministry format in A4 Landscape'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-60"
              title="បោះពុម្ពភ្លាមៗ"
            >
              {isPrinting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
              <span>{isPrinting ? (lang === 'km' ? 'កំពុងរៀបចំ...' : 'Preparing...') : (lang === 'km' ? 'បោះពុម្ព (Print Now)' : 'Print Now')}</span>
            </button>

            <button
              onClick={handleOpenCleanWindow}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              title={lang === 'km' ? 'បើកផ្ទាំងដាច់ដោយឡែក' : 'Open in separate tab'}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'km' ? 'បើកផ្ទាំងថ្មី' : 'New Tab'}</span>
            </button>

            <button
              onClick={handleExportHtml}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              title={lang === 'km' ? 'ទាញយកទុកជាឯកសារ HTML' : 'Download HTML'}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'km' ? 'ទាញយក HTML' : 'Download'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer ml-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div ref={printAreaRef} id="printable-exam-results" className="p-6 sm:p-8 overflow-y-auto print:p-4 print:overflow-visible text-slate-900 font-sans">
          {/* Official Royal Header */}
          <div className="text-center mb-6">
            <div className="text-base sm:text-lg font-bold tracking-wider text-slate-900 mb-0.5">
              ព្រះរាជាណាចក្រកម្ពុជា
            </div>
            <div className="text-sm font-semibold text-slate-800 tracking-widest">
              ជាតិ សាសនា ព្រះមហាក្សត្រ
            </div>
            <div className="w-24 h-0.5 bg-slate-800 mx-auto my-2" />
          </div>

          {/* School & Department Header */}
          <div className="flex justify-between items-start text-xs sm:text-sm mb-6 border-b border-slate-200 pb-4">
            <div>
              <div className="font-semibold text-slate-700">ក្រសួងអប់រំ យុវជន និងកីឡា</div>
              <div className="font-semibold text-slate-700">មន្ទីរអប់រំ យុវជន និងកីឡា រាជធានីភ្នំពេញ</div>
              <div className="font-bold text-slate-900 text-sm mt-0.5">{SCHOOL_INFO.nameKhmer}</div>
            </div>
            <div className="text-right">
              <div className="text-slate-600">
                <span>ឆ្នាំសិក្សា ៖ </span>
                <span className="font-semibold text-slate-900">{currentClass?.academicYear || '២០២៤-២០២៥'}</span>
              </div>
              <div className="text-slate-600">
                <span>កាលបរិច្ឆេទ ៖ </span>
                <span className="font-semibold text-slate-900">{new Date().toLocaleDateString('km-KH')}</span>
              </div>
            </div>
          </div>

          {/* Title of Document */}
          <div className="text-center mb-6">
            <h2 className="text-base sm:text-xl font-bold uppercase text-slate-900">
              តារាងស្រង់ពិន្ទុ និងចំណាត់ថ្នាក់សិស្ស
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              {term} • {currentClass?.name} ({currentClass?.room}) • គ្រូបន្ទុកថ្នាក់ ៖ {currentClass?.homeroomTeacher}
            </p>
          </div>

          {/* Official Results Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-center border-collapse border border-slate-300 text-[11px] sm:text-xs">
              <thead>
                <tr className="bg-slate-100 font-bold text-slate-800">
                  <th className="border border-slate-300 py-2 px-1 w-10">ល.រ</th>
                  <th className="border border-slate-300 py-2 px-1 w-12">ចំណាត់ថ្នាក់</th>
                  <th className="border border-slate-300 py-2 px-2 text-left">គោត្តនាម និងនាម</th>
                  <th className="border border-slate-300 py-2 px-1 w-12">ភេទ</th>
                  {activeSubjects.map((sub) => (
                    <th key={sub.id} className="border border-slate-300 py-1 px-1 min-w-[42px]">
                      <div className="truncate max-w-[56px]">{sub.khmerName}</div>
                      <div className="text-[9px] text-blue-800 font-mono font-semibold">/{sub.maxScore || 100}</div>
                      <div className="text-[8px] text-slate-500 font-normal">x{sub.coefficient}</div>
                    </th>
                  ))}
                  <th className="border border-slate-300 py-2 px-1 w-16 bg-blue-50/50">
                    <div>សរុប</div>
                    <div className="text-[9px] text-blue-900 font-normal">/{maxPossibleTotal}</div>
                  </th>
                  <th className="border border-slate-300 py-2 px-1 w-14 bg-blue-50/50">មធ្យមភាគ</th>
                  <th className="border border-slate-300 py-2 px-1 w-12">និទ្ទេស</th>
                  <th className="border border-slate-300 py-2 px-1 w-14">អាកប្បកិរិយា</th>
                  <th className="border border-slate-300 py-2 px-1 w-14">លទ្ធផល</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rankedScores.map((score, index) => {
                  const student = studentMap.get(score.studentId);
                  const isPassed = (score.averageScore ?? 0) >= 50;

                  return (
                    <tr
                      key={score.studentId}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                    >
                      <td className="border border-slate-300 py-1.5 px-1 font-mono text-slate-600">
                        {index + 1}
                      </td>
                      <td className="border border-slate-300 py-1.5 px-1 font-bold text-blue-900">
                        #{score.rank ?? '-'}
                      </td>
                      <td className="border border-slate-300 py-1.5 px-2 text-left font-medium text-slate-900">
                        <div>{student?.khmerName || score.studentId}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{student?.code}</div>
                      </td>
                      <td className="border border-slate-300 py-1.5 px-1">
                        {student?.gender === 'female' ? 'ស្រី' : 'ប្រុស'}
                      </td>
                      {activeSubjects.map((sub) => {
                        const s = score.scores[sub.id] ?? 0;
                        const maxVal = sub.maxScore || 100;
                        return (
                          <td
                            key={sub.id}
                            className={`border border-slate-300 py-1.5 px-1 font-mono ${
                              s < maxVal * 0.5 ? 'text-rose-600 font-bold' : 'text-slate-800'
                            }`}
                          >
                            {s}
                          </td>
                        );
                      })}
                      <td className="border border-slate-300 py-1.5 px-1 font-bold text-slate-900 bg-blue-50/30 font-mono">
                        {score.totalScore ?? 0}
                      </td>
                      <td className="border border-slate-300 py-1.5 px-1 font-bold text-blue-700 bg-blue-50/30 font-mono">
                        {score.averageScore?.toFixed(2) ?? '0.00'}
                      </td>
                      <td className="border border-slate-300 py-1.5 px-1 font-bold">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                            score.gradeLetter === 'A'
                              ? 'bg-emerald-100 text-emerald-800'
                              : score.gradeLetter === 'F'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {score.gradeLetter || '-'}
                        </span>
                      </td>
                      <td className="border border-slate-300 py-1.5 px-1 text-[10px]">
                        {score.conduct}
                      </td>
                      <td className="border border-slate-300 py-1.5 px-1 font-semibold text-[10px]">
                        {isPassed ? (
                          <span className="text-emerald-700">ជាប់</span>
                        ) : (
                          <span className="text-rose-600">ធ្លាក់</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Statistics Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs mb-8">
            <div>
              <span className="text-slate-500 block text-[10px]">សិស្សសរុប</span>
              <span className="font-bold text-slate-800">{totalStudents} នាក់ (ស្រី {femaleStudents})</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">ប្រឡងជាប់</span>
              <span className="font-bold text-emerald-700">{passedStudents} នាក់</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">ធ្លាក់</span>
              <span className="font-bold text-rose-600">{failedStudents} នាក់</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">អត្រាជាប់</span>
              <span className="font-bold text-blue-700">{passRate}%</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">ពិន្ទុមធ្យមខ្ពស់បំផុត</span>
              <span className="font-bold text-slate-800 font-mono">{highestAvg}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">មធ្យមភាគរួមថ្នាក់</span>
              <span className="font-bold text-slate-800 font-mono">{classAvg}</span>
            </div>
          </div>

          {/* Official Signatures Blocks */}
          <div className="grid grid-cols-3 gap-6 text-center text-xs sm:text-sm pt-4">
            <div>
              <p className="font-semibold text-slate-700 mb-16">គ្រូបន្ទុកថ្នាក់</p>
              <p className="font-bold text-slate-900 border-t border-dashed border-slate-300 pt-2 inline-block min-w-[140px]">
                {currentClass?.homeroomTeacher}
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-700 mb-16">ប្រធានការិយាល័យសិក្សា</p>
              <p className="font-bold text-slate-900 border-t border-dashed border-slate-300 pt-2 inline-block min-w-[140px]">
                លោក ហេង វុទ្ធី
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-[11px] mb-1">
                រាជធានីភ្នំពេញ, ថ្ងៃទី....... ខែ....... ឆ្នាំ២០២...
              </p>
              <p className="font-semibold text-slate-700 mb-16">នាយកសាលា</p>
              <p className="font-bold text-slate-900 border-t border-dashed border-slate-300 pt-2 inline-block min-w-[140px]">
                {SCHOOL_INFO.principal}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
