import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateStudentTotal,
  calculateStudentAverage,
  determineGradeLetter,
  calculateClassRanks,
  calculateAttendanceSummary,
  filterStudents,
  generateStudentCode,
  DEFAULT_SUBJECTS,
} from './academic';
import { ExamTermScore, Student, DailyAttendance } from '../types';

test('calculateStudentTotal handles coefficients accurately', () => {
  // Khmer(coef 2)=80, Math(coef 2)=90, Physics(coef 1)=70, others 0
  const scores = {
    khmer: 80, // 160
    math: 90,  // 180
    phys: 70,  // 70
  };
  const total = calculateStudentTotal(scores, DEFAULT_SUBJECTS);
  assert.equal(total, 410);
});

test('calculateStudentAverage computes weighted average correctly', () => {
  // Total coef in DEFAULT_SUBJECTS: 2 + 2 + 1 + 1 + 1 + 1 + 1 + 1 + 1 = 11
  // If student scores 100 on everything:
  const perfectScores: Record<string, number> = {};
  DEFAULT_SUBJECTS.forEach((sub) => {
    perfectScores[sub.id] = 100;
  });
  const avg = calculateStudentAverage(perfectScores, DEFAULT_SUBJECTS);
  assert.equal(avg, 100);

  // If student scores 50 on everything:
  const halfScores: Record<string, number> = {};
  DEFAULT_SUBJECTS.forEach((sub) => {
    halfScores[sub.id] = 50;
  });
  assert.equal(calculateStudentAverage(halfScores, DEFAULT_SUBJECTS), 50);
});

test('determineGradeLetter assigns correct Cambodian letters and mentions', () => {
  const gradeA = determineGradeLetter(95);
  assert.equal(gradeA.letter, 'A');
  assert.equal(gradeA.passed, true);
  assert.equal(gradeA.khmerMention, 'ល្អប្រសើរ');

  const gradeB = determineGradeLetter(82);
  assert.equal(gradeB.letter, 'B');
  assert.equal(gradeB.passed, true);

  const gradeE = determineGradeLetter(51);
  assert.equal(gradeE.letter, 'E');
  assert.equal(gradeE.passed, true);

  const gradeF = determineGradeLetter(45);
  assert.equal(gradeF.letter, 'F');
  assert.equal(gradeF.passed, false);
});

test('calculateClassRanks orders descending and handles ties correctly', () => {
  const exams: ExamTermScore[] = [
    { studentId: 's1', term: 'term1', scores: { khmer: 70, math: 70 }, conduct: 'ល្អ' },
    { studentId: 's2', term: 'term1', scores: { khmer: 95, math: 95 }, conduct: 'ល្អណាស់' },
    { studentId: 's3', term: 'term1', scores: { khmer: 70, math: 70 }, conduct: 'ល្អ' },
    { studentId: 's4', term: 'term1', scores: { khmer: 50, math: 50 }, conduct: 'មធ្យម' },
  ];

  const ranked = calculateClassRanks(exams, DEFAULT_SUBJECTS);

  // Top score is s2
  assert.equal(ranked[0].studentId, 's2');
  assert.equal(ranked[0].rank, 1);

  // s1 and s3 have identical average, so both should have rank 2
  assert.equal(ranked[1].rank, 2);
  assert.equal(ranked[2].rank, 2);

  // s4 should have rank 4 (standard competition ranking 1, 2, 2, 4)
  assert.equal(ranked[3].studentId, 's4');
  assert.equal(ranked[3].rank, 4);
});

test('calculateAttendanceSummary calculates rates and warning flags', () => {
  const dailyRecords: DailyAttendance[] = [
    { id: 'd1', date: '2024-10-01', gradeId: '7A', records: { stu1: 'present' } },
    { id: 'd2', date: '2024-10-02', gradeId: '7A', records: { stu1: 'present' } },
    { id: 'd3', date: '2024-10-03', gradeId: '7A', records: { stu1: 'absent' } },
    { id: 'd4', date: '2024-10-04', gradeId: '7A', records: { stu1: 'absent' } },
    { id: 'd5', date: '2024-10-05', gradeId: '7A', records: { stu1: 'absent' } },
  ];

  const summary = calculateAttendanceSummary(dailyRecords, 'stu1');
  assert.equal(summary.totalRecordedDays, 5);
  assert.equal(summary.present, 2);
  assert.equal(summary.absent, 3);
  assert.equal(summary.statusWarning, true); // >= 3 absents triggers warning
});

test('filterStudents filters by query and criteria', () => {
  const sampleStudents: Student[] = [
    {
      id: '1',
      code: 'STU-001',
      khmerName: 'សុខ ចាន់ដារ៉ា',
      latinName: 'Sok Chandara',
      gender: 'male',
      dob: '2010-05-12',
      gradeId: '7A',
      phone: '012345678',
      address: 'ភ្នំពេញ',
      status: 'active',
      enrollDate: '2024-09-01',
      parentName: 'សុខ វិបុល',
      parentPhone: '098765432',
      parentRelationship: 'ឪពុក',
    },
    {
      id: '2',
      code: 'STU-002',
      khmerName: 'កែវ មុនីនាថ',
      latinName: 'Keo Monineath',
      gender: 'female',
      dob: '2010-08-20',
      gradeId: '7A',
      phone: '098111222',
      address: 'កណ្តាល',
      status: 'active',
      enrollDate: '2024-09-01',
      parentName: 'កែវ សម្បត្តិ',
      parentPhone: '099333444',
      parentRelationship: 'ឪពុក',
    },
  ];

  // Search by Khmer partial
  assert.equal(filterStudents(sampleStudents, 'ចាន់').length, 1);
  // Search by Latin partial
  assert.equal(filterStudents(sampleStudents, 'moni').length, 1);
  // Search by gender
  assert.equal(filterStudents(sampleStudents, '', 'all', 'female').length, 1);
  assert.equal(filterStudents(sampleStudents, '', 'all', 'female')[0].khmerName, 'កែវ មុនីនាថ');
});

test('generateStudentCode formats sequential ID properly', () => {
  assert.equal(generateStudentCode(0, 2025), 'STU-2025-001');
  assert.equal(generateStudentCode(14, 2025), 'STU-2025-015');
});
