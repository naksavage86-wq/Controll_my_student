export type Gender = 'male' | 'female';
export type StudentStatus = 'active' | 'suspended' | 'graduated' | 'transferred';

export interface Student {
  id: string;
  code: string; // e.g. STU-2024-001 (អត្តលេខ)
  khmerName: string; // ឈ្មោះខ្មែរ e.g. សុខ ចាន់ដារ៉ា
  latinName: string; // ឈ្មោះឡាតាំង e.g. Sok Chandara
  gender: Gender; // ប្រុស / ស្រី
  dob: string; // ថ្ងៃខែឆ្នាំកំណើត YYYY-MM-DD
  pob?: string; // ទីកន្លែងកំណើត
  gradeId: string; // ថ្នាក់រៀន e.g. '7A', '9B', '12A'
  phone: string; // លេខទូរស័ព្ទផ្ទាល់ខ្លួន
  address: string; // អាសយដ្ឋានបច្ចុប្បន្ន
  status: StudentStatus;
  avatarUrl?: string;
  enrollDate: string; // ថ្ងៃចូលរៀន
  // ព័ត៌មានអាណាព្យាបាល
  parentName: string;
  parentPhone: string;
  parentRelationship: string; // ឪពុក, ម្តាយ, អាណាព្យាបាល
  parentOccupation?: string; // មុខរបរ
  // ព័ត៌មានសុខភាព និងកាយសម្បទា
  bloodType?: string; // e.g. 'O+', 'A+', 'B+', 'AB+'
  allergies?: string; // អាឡែកហ្ស៊ី
  chronicCondition?: string; // ជំងឺប្រចាំកាយ
  heightCm?: number; // កម្ពស់ (cm)
  weightKg?: number; // ទម្ងន់ (kg)
  // វិន័យ & ស្នាដៃ
  merits?: string[]; // ស្នាដៃ និងលិខិតសរសើរ
  warnings?: string[]; // ការព្រមានវិន័យ
  emergencyContact?: string;
  notes?: string;
}

export interface Teacher {
  id: string;
  nameKhmer: string;
  nameLatin: string;
  gender: Gender;
  subject: string;
  phone: string;
  email?: string;
  homeroomGradeId?: string; // e.g. '7A'
  avatarUrl?: string;
  qualification?: string; // កម្រិតវប្បធម៌/សញ្ញាបត្រ e.g. បរិញ្ញាបត្រគរុកោសល្យ
  bio?: string; // ជីវប្រវត្តិសង្ខេប
  joinDate?: string; // ថ្ងៃចូលបម្រើការងារ
  status?: 'active' | 'leave'; // ស្ថានភាពការងារ
}

export type UserRole = 'admin' | 'teacher' | 'staff' | 'student';

export interface UserAccount {
  id: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: UserRole;
  avatarUrl?: string;
  teacherId?: string;
  assignedGradeId?: string;
  createdAt: string;
}

export interface GradeClass {
  id: string; // e.g. '7A'
  name: string; // e.g. 'ថ្នាក់ទី ៧A'
  level: number; // 7, 8, 9, 10, 11, 12
  room: string; // បន្ទប់រៀន e.g. 'B-201'
  homeroomTeacher: string; // គ្រូបន្ទុកថ្នាក់
  academicYear: string; // e.g. '2024-2025'
  capacity: number;
}

export interface Subject {
  id: string;
  khmerName: string;
  englishName: string;
  code: string;
  coefficient: number; // មេគុណ (e.g. Khmer=2, Math=2, others=1)
  maxScore: number; // e.g. 50 or 100
}

export interface StudentSubjectScore {
  subjectId: string;
  score: number; // 0 to maxScore
}

export interface ExamTermScore {
  studentId: string;
  term: string; // e.g. "ខែតុលា 2024" or "ឆមាសទី ១"
  scores: Record<string, number>; // subjectId -> score
  conduct: 'ល្អណាស់' | 'ល្អ' | 'មធ្យម' | 'កែលម្អ'; // អាកប្បកិរិយា
  teacherRemark?: string; // មតិយោបល់គ្រូ
  totalScore?: number;
  averageScore?: number;
  rank?: number;
  gradeLetter?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  passed?: boolean;
}

export type AttendanceStatus = 'present' | 'permission' | 'absent' | 'late';

export interface DailyAttendance {
  id: string;
  date: string; // YYYY-MM-DD
  gradeId: string;
  session?: 'morning' | 'afternoon' | 'full'; // វេនព្រឹក / វេនរសៀល
  records: Record<string, AttendanceStatus>; // studentId -> status
  note?: string;
  recordedBy?: string;
}

export interface TuitionFee {
  id: string;
  studentId: string;
  invoiceNo: string; // e.g. INV-2024-101
  title: string; // e.g. ថ្លៃសិក្សាខែវិច្ឆិកា 2024
  amount: number;
  currency: 'USD' | 'KHR';
  paidAmount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
  paymentMethod?: 'ABA Pay' | 'Wing' | 'Cash' | 'Acleda';
  receiptNo?: string;
  notes?: string;
}

export interface TimetableSlot {
  id: string;
  gradeId: string;
  dayOfWeek: 'ចន្ទ' | 'អង្គារ' | 'ពុធ' | 'ព្រហស្បតិ៍' | 'សុក្រ' | 'សៅរ៍';
  timeSlot: string; // e.g. "07:30 - 08:20"
  session?: 'morning' | 'afternoon'; // ព្រឹក ឬ រសៀល/ល្ងាច
  subject: string;
  teacher: string;
  room: string;
}

export interface ClassPricing {
  gradeId: string;
  monthlyFee: number;
  currency: 'USD' | 'KHR';
  registrationFee?: number;
  materialFee?: number;
}

export interface DeveloperProfile {
  nameKhmer: string;
  nameLatin: string;
  role: string;
  email: string;
  phone?: string;
  bio: string;
  avatarUrl?: string;
  githubUrl?: string;
  telegram?: string;
  portfolio?: string;
  institution?: string;
  skills?: string[];
}


