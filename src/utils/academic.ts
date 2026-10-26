import { Student, Subject, ExamTermScore, AttendanceStatus, DailyAttendance } from '../types';

export const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'khmer', khmerName: 'ភាសាខ្មែរ', englishName: 'Khmer Literature', code: 'KHM', coefficient: 2, maxScore: 100 },
  { id: 'math', khmerName: 'គណិតវិទ្យា', englishName: 'Mathematics', code: 'MTH', coefficient: 2, maxScore: 100 },
  { id: 'phys', khmerName: 'រូបវិទ្យា', englishName: 'Physics', code: 'PHY', coefficient: 1, maxScore: 100 },
  { id: 'chem', khmerName: 'គីមីវិទ្យា', englishName: 'Chemistry', code: 'CHM', coefficient: 1, maxScore: 100 },
  { id: 'bio', khmerName: 'ជីវវិទ្យា', englishName: 'Biology', code: 'BIO', coefficient: 1, maxScore: 100 },
  { id: 'history', khmerName: 'ប្រវត្តិវិទ្យា', englishName: 'History', code: 'HIS', coefficient: 1, maxScore: 100 },
  { id: 'english', khmerName: 'ភាសាអង់គ្លេស', englishName: 'English', code: 'ENG', coefficient: 1, maxScore: 100 },
  { id: 'civics', khmerName: 'សីលធម៌-ពលរដ្ឋ', englishName: 'Moral & Civics', code: 'CIV', coefficient: 1, maxScore: 100 },
  { id: 'ict', khmerName: 'ព័ត៌មានវិទ្យា', englishName: 'ICT & Computer', code: 'ICT', coefficient: 1, maxScore: 100 },
];

/**
 * Calculates weighted total score for a student
 */
export function calculateStudentTotal(
  scores: Record<string, number>,
  subjects: Subject[] = DEFAULT_SUBJECTS
): number {
  let total = 0;
  for (const subject of subjects) {
    const rawScore = scores[subject.id] ?? 0;
    total += rawScore * subject.coefficient;
  }
  return Math.round(total * 100) / 100;
}

/**
 * Calculates weighted average out of 100
 */
export function calculateStudentAverage(
  scores: Record<string, number>,
  subjects: Subject[] = DEFAULT_SUBJECTS
): number {
  let totalWeightedScore = 0;
  let totalCoefficients = 0;

  for (const subject of subjects) {
    const rawScore = scores[subject.id] ?? 0;
    totalWeightedScore += rawScore * subject.coefficient;
    totalCoefficients += subject.coefficient;
  }

  if (totalCoefficients === 0) return 0;
  const avg = totalWeightedScore / totalCoefficients;
  return Math.round(avg * 100) / 100;
}

/**
 * Determine letter grade and appreciation according to Cambodian Education Standard
 */
export function determineGradeLetter(average: number): {
  letter: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  khmerMention: string;
  englishMention: string;
  passed: boolean;
  colorClass: string;
} {
  if (average >= 90) {
    return { letter: 'A', khmerMention: 'ល្អប្រសើរ', englishMention: 'Excellent', passed: true, colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
  } else if (average >= 80) {
    return { letter: 'B', khmerMention: 'ល្អណាស់', englishMention: 'Very Good', passed: true, colorClass: 'text-blue-700 bg-blue-50 border-blue-300' };
  } else if (average >= 70) {
    return { letter: 'C', khmerMention: 'ល្អ', englishMention: 'Good', passed: true, colorClass: 'text-indigo-700 bg-indigo-50 border-indigo-300' };
  } else if (average >= 60) {
    return { letter: 'D', khmerMention: 'ល្អបង្គួរ', englishMention: 'Fair', passed: true, colorClass: 'text-amber-700 bg-amber-50 border-amber-300' };
  } else if (average >= 50) {
    return { letter: 'E', khmerMention: 'មធ្យម', englishMention: 'Satisfactory / Pass', passed: true, colorClass: 'text-orange-700 bg-orange-50 border-orange-300' };
  } else {
    return { letter: 'F', khmerMention: 'ធ្លាក់ (ខ្សោយ)', englishMention: 'Unsatisfactory / Fail', passed: false, colorClass: 'text-rose-700 bg-rose-50 border-rose-300' };
  }
}

/**
 * Computes class rank and metrics for all students
 */
export function calculateClassRanks(
  examScores: ExamTermScore[],
  subjects: Subject[] = DEFAULT_SUBJECTS
): ExamTermScore[] {
  // First compute total, average, letter for each
  const withCalculations = examScores.map((item) => {
    const totalScore = calculateStudentTotal(item.scores, subjects);
    const averageScore = calculateStudentAverage(item.scores, subjects);
    const evaluation = determineGradeLetter(averageScore);

    return {
      ...item,
      totalScore,
      averageScore,
      gradeLetter: evaluation.letter,
      passed: evaluation.passed,
    };
  });

  // Sort descending by averageScore
  const sorted = [...withCalculations].sort((a, b) => (b.averageScore ?? 0) - (a.averageScore ?? 0));

  // Compute ranks with standard competition ranking (1224)
  let currentRank = 1;
  const ranked: ExamTermScore[] = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i].averageScore === sorted[i - 1].averageScore) {
      ranked.push({
        ...sorted[i],
        rank: ranked[i - 1].rank,
      });
    } else {
      ranked.push({
        ...sorted[i],
        rank: currentRank,
      });
    }
    currentRank++;
  }

  return ranked;
}

/**
 * Calculates attendance summary for a student given daily records
 */
export function calculateAttendanceSummary(
  dailyRecords: DailyAttendance[],
  studentId: string
): {
  totalRecordedDays: number;
  present: number;
  permission: number;
  absent: number;
  late: number;
  attendanceRate: number; // percentage
  statusWarning: boolean; // true if absent > 3 times
} {
  let present = 0;
  let permission = 0;
  let absent = 0;
  let late = 0;
  let totalRecordedDays = 0;

  for (const record of dailyRecords) {
    const status = record.records[studentId];
    if (status) {
      totalRecordedDays++;
      if (status === 'present') present++;
      else if (status === 'permission') permission++;
      else if (status === 'absent') absent++;
      else if (status === 'late') late++;
    }
  }

  const effectivePresence = present + permission * 0.9 + late * 0.8;
  const attendanceRate = totalRecordedDays > 0 ? Math.round((effectivePresence / totalRecordedDays) * 100) : 100;
  const statusWarning = absent >= 3;

  return {
    totalRecordedDays,
    present,
    permission,
    absent,
    late,
    attendanceRate,
    statusWarning,
  };
}

/**
 * Filter students by query (Khmer or Latin name or code), grade, gender, and status
 */
export function filterStudents(
  students: Student[],
  query: string,
  gradeId?: string,
  gender?: string,
  status?: string
): Student[] {
  const cleanQuery = query.trim().toLowerCase();

  return students.filter((s) => {
    // Search query matching Khmer name, Latin name, code, phone, or parent name
    if (cleanQuery) {
      const matchNameKh = s.khmerName.toLowerCase().includes(cleanQuery);
      const matchNameEn = s.latinName.toLowerCase().includes(cleanQuery);
      const matchCode = s.code.toLowerCase().includes(cleanQuery);
      const matchPhone = s.phone.includes(cleanQuery);
      const matchParent = s.parentName.toLowerCase().includes(cleanQuery);
      if (!matchNameKh && !matchNameEn && !matchCode && !matchPhone && !matchParent) {
        return false;
      }
    }

    if (gradeId && gradeId !== 'all' && s.gradeId !== gradeId) {
      return false;
    }

    if (gender && gender !== 'all' && s.gender !== gender) {
      return false;
    }

    if (status && status !== 'all' && s.status !== status) {
      return false;
    }

    return true;
  });
}

/**
 * Format currency with USD or KHR symbol
 */
export function formatSchoolFee(amount: number, currency: 'USD' | 'KHR'): string {
  if (currency === 'KHR') {
    return `${amount.toLocaleString()} ៛`;
  }
  return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Generate formatted new student code
 */
export function generateStudentCode(existingCount: number, year: number = 2025): string {
  const padded = String(existingCount + 1).padStart(3, '0');
  return `STU-${year}-${padded}`;
}
