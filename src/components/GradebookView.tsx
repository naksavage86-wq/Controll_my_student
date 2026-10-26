import React, { useState, useMemo } from 'react';
import {
  Award,
  Save,
  Download,
  Filter,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Student, GradeClass, ExamTermScore, Subject } from '../types';
import { Language, translations } from '../utils/i18n';
import {
  DEFAULT_SUBJECTS,
  calculateClassRanks,
  determineGradeLetter,
} from '../utils/academic';

interface GradebookViewProps {
  students: Student[];
  classes: GradeClass[];
  examScores: ExamTermScore[];
  onSaveScores: (updatedScores: ExamTermScore[]) => void;
  onViewReportCard: (studentId: string) => void;
  lang: Language;
}

export const GradebookView: React.FC<GradebookViewProps> = ({
  students,
  classes,
  examScores,
  onSaveScores,
  onViewReportCard,
  lang,
}) => {
  const t = translations[lang];

  const [selectedGrade, setSelectedGrade] = useState<string>(classes[0]?.id || '7A');
  const [selectedTerm, setSelectedTerm] = useState<string>('ឆមាសទី ១ (២០២៤-២០២៥)');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter students by selected grade
  const gradeStudents = useMemo(() => {
    return students.filter((s) => s.gradeId === selectedGrade && s.status === 'active');
  }, [students, selectedGrade]);

  // Working scores map: studentId -> ExamTermScore
  const [localScores, setLocalScores] = useState<Record<string, ExamTermScore>>({});

  // Initialize or sync localScores
  React.useEffect(() => {
    const map: Record<string, ExamTermScore> = {};
    gradeStudents.forEach((student) => {
      const existing = examScores.find(
        (e) => e.studentId === student.id && e.term === selectedTerm
      );
      if (existing) {
        map[student.id] = { ...existing };
      } else {
        map[student.id] = {
          studentId: student.id,
          term: selectedTerm,
          scores: {
            khmer: 75,
            math: 75,
            phys: 75,
            chem: 75,
            bio: 75,
            history: 75,
            english: 75,
            civics: 75,
            ict: 75,
          },
          conduct: 'ល្អ',
          teacherRemark: '',
        };
      }
    });
    setLocalScores(map);
  }, [gradeStudents, examScores, selectedTerm]);

  // Handle score change
  const handleScoreChange = (studentId: string, subjectId: string, value: string) => {
    const num = Math.max(0, Math.min(100, Number(value) || 0));
    setLocalScores((prev) => {
      const current = prev[studentId] || {
        studentId,
        term: selectedTerm,
        scores: {},
        conduct: 'ល្អ',
      };
      return {
        ...prev,
        [studentId]: {
          ...current,
          scores: {
            ...current.scores,
            [subjectId]: num,
          },
        },
      };
    });
    setSaveSuccess(false);
  };

  const handleConductChange = (studentId: string, conduct: any) => {
    setLocalScores((prev) => {
      const current = prev[studentId];
      if (!current) return prev;
      return {
        ...prev,
        [studentId]: {
          ...current,
          conduct,
        },
      };
    });
    setSaveSuccess(false);
  };

  // Compute calculated list with ranks
  const computedRankedList = useMemo(() => {
    const list = Object.values(localScores);
    return calculateClassRanks(list, DEFAULT_SUBJECTS);
  }, [localScores]);

  // Map studentId to its computed rank item
  const computedMap = useMemo(() => {
    const m = new Map<string, ExamTermScore>();
    computedRankedList.forEach((item) => {
      m.set(item.studentId, item);
    });
    return m;
  }, [computedRankedList]);

  const handleSave = () => {
    onSaveScores(computedRankedList);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Export CSV of Gradebook
  const handleExportCSV = () => {
    const headers = [
      'Rank',
      'Code',
      'Name',
      ...DEFAULT_SUBJECTS.map((s) => `${s.khmerName}(x${s.coefficient})`),
      'Total',
      'Average',
      'Grade',
      'Conduct',
    ];

    const rows = gradeStudents.map((student) => {
      const computed = computedMap.get(student.id);
      const subScores = DEFAULT_SUBJECTS.map((s) => computed?.scores[s.id] ?? 0);
      return [
        `"#${computed?.rank ?? ''}"`,
        `"${student.code}"`,
        `"${student.khmerName}"`,
        ...subScores,
        computed?.totalScore ?? 0,
        computed?.averageScore?.toFixed(2) ?? 0,
        `"${computed?.gradeLetter ?? ''}"`,
        `"${computed?.conduct ?? ''}"`,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Gradebook_${selectedGrade}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span>{t.grades}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'km'
              ? 'បញ្ចូលពិន្ទុតាមមុខវិជ្ជា គណនាមធ្យមភាគស្វ័យប្រវត្តិ ចំណាត់ថ្នាក់ និងនិទ្ទេស'
              : 'Enter subject scores, auto-calculate weighted average, class ranks, and evaluations'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Term selector */}
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-medium"
          >
            <option value="ឆមាសទី ១ (២០២៤-២០២៥)">{lang === 'km' ? 'ឆមាសទី ១ (២០២៤-២០២៥)' : 'Semester 1 (2024-2025)'}</option>
            <option value="ឆមាសទី ២ (២០២៤-២០២៥)">{lang === 'km' ? 'ឆមាសទី ២ (២០២៤-២០២៥)' : 'Semester 2 (2024-2025)'}</option>
            <option value="ប្រចាំខែវិច្ឆិកា ២០២៤">{lang === 'km' ? 'ប្រចាំខែវិច្ឆិកា ២០២៤' : 'Monthly Exam (Nov 2024)'}</option>
          </select>

          {/* Grade selector */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white font-medium"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.exportCSV}</span>
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{t.save}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 text-emerald-800 text-xs px-4 py-2.5 rounded-xl border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{lang === 'km' ? 'បានរក្សាទុកពិន្ទុ និងចំណាត់ថ្នាក់ដោយជោគជ័យ!' : 'Scores and class ranks saved successfully!'}</span>
        </div>
      )}

      {/* Grade Info notice */}
      <div className="bg-blue-50/70 border border-blue-200/80 p-3.5 rounded-xl flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            {lang === 'km'
              ? 'ស្តង់ដារក្រសួង៖ ភាសាខ្មែរ (មេគុណ ២) | គណិតវិទ្យា (មេគុណ ២) | មុខវិជ្ជាដទៃ (មេគុណ ១)។ មធ្យមភាគ >= ៥០ ជាប់។'
              : 'Official Standard: Khmer (Coef 2) | Math (Coef 2) | Others (Coef 1). Passing threshold >= 50.'}
          </span>
        </div>
        <span className="font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[11px]">
          {classes.find((c) => c.id === selectedGrade)?.name}
        </span>
      </div>

      {/* Main Gradebook Spreadsheet Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1050px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
                <th className="py-3 px-3 w-14 text-center sticky left-0 bg-slate-50 z-10 shadow-xs">
                  {t.rank}
                </th>
                <th className="py-3 px-3 w-44 sticky left-14 bg-slate-50 z-10 shadow-xs">
                  {t.name}
                </th>
                {DEFAULT_SUBJECTS.map((sub) => (
                  <th key={sub.id} className="py-3 px-2 text-center font-medium">
                    <div className="text-[11px] font-bold text-slate-800">{sub.khmerName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">x{sub.coefficient}</div>
                  </th>
                ))}
                <th className="py-3 px-3 text-center bg-blue-50/50 text-blue-900 font-bold">
                  {t.totalScore}
                </th>
                <th className="py-3 px-3 text-center bg-blue-50/70 text-blue-950 font-bold">
                  {t.averageScore}
                </th>
                <th className="py-3 px-3 text-center font-bold">{t.mention}</th>
                <th className="py-3 px-3 text-center font-bold">{t.conduct}</th>
                <th className="py-3 px-3 text-center w-20">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {gradeStudents.map((student) => {
                const computed = computedMap.get(student.id);
                const currentRecord = localScores[student.id];
                const avg = computed?.averageScore ?? 0;
                const evalResult = determineGradeLetter(avg);

                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Rank Badge */}
                    <td className="py-2.5 px-3 text-center sticky left-0 bg-white z-10 font-bold font-mono">
                      {computed?.rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-800 text-xs">
                          🥇 1
                        </span>
                      ) : computed?.rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 text-slate-800 text-xs">
                          🥈 2
                        </span>
                      ) : computed?.rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-50 text-amber-900 text-xs border border-amber-200">
                          🥉 3
                        </span>
                      ) : (
                        <span className="text-slate-600">#{computed?.rank ?? '—'}</span>
                      )}
                    </td>

                    {/* Name */}
                    <td className="py-2.5 px-3 sticky left-14 bg-white z-10">
                      <div className="font-bold text-slate-900">{student.khmerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{student.code}</div>
                    </td>

                    {/* Subject Score Inputs */}
                    {DEFAULT_SUBJECTS.map((sub) => {
                      const scoreVal = currentRecord?.scores[sub.id] ?? 0;
                      return (
                        <td key={sub.id} className="py-2 px-1 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={scoreVal === 0 ? '' : scoreVal}
                            placeholder="0"
                            onChange={(e) => handleScoreChange(student.id, sub.id, e.target.value)}
                            className={`w-14 text-center px-1 py-1 text-xs font-semibold rounded border transition-all ${
                              scoreVal < 50
                                ? 'bg-rose-50 text-rose-700 border-rose-300 focus:bg-white'
                                : scoreVal >= 85
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 focus:bg-white'
                                : 'bg-white text-slate-800 border-slate-200 focus:border-blue-500'
                            }`}
                          />
                        </td>
                      );
                    })}

                    {/* Total Score */}
                    <td className="py-2.5 px-3 text-center font-bold text-slate-900 bg-blue-50/30 font-mono">
                      {computed?.totalScore ?? 0}
                    </td>

                    {/* Average */}
                    <td className="py-2.5 px-3 text-center font-bold text-blue-700 bg-blue-50/50 font-mono text-sm">
                      {avg.toFixed(1)}
                    </td>

                    {/* Grade Mention */}
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold border ${evalResult.colorClass}`}>
                        {evalResult.letter}
                      </span>
                    </td>

                    {/* Conduct */}
                    <td className="py-2.5 px-3 text-center">
                      <select
                        value={currentRecord?.conduct || 'ល្អ'}
                        onChange={(e) => handleConductChange(student.id, e.target.value)}
                        className="text-xs bg-slate-50 border border-slate-200 rounded px-1.5 py-1 focus:bg-white font-medium"
                      >
                        <option value="ល្អណាស់">{lang === 'km' ? 'ល្អណាស់' : 'Very Good'}</option>
                        <option value="ល្អ">{lang === 'km' ? 'ល្អ' : 'Good'}</option>
                        <option value="មធ្យម">{lang === 'km' ? 'មធ្យម' : 'Medium'}</option>
                        <option value="កែលម្អ">{lang === 'km' ? 'កែលម្អ' : 'Improve'}</option>
                      </select>
                    </td>

                    {/* Action */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => onViewReportCard(student.id)}
                        title={t.reportCard}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 text-xs font-medium"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{lang === 'km' ? 'ព្រឹត្តិបត្រ' : 'Report'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
