import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Download,
  Upload,
  UserCheck,
  Eye,
  Edit2,
  Trash2,
  FileText,
  Filter,
  Users,
} from 'lucide-react';
import { Student, GradeClass } from '../types';
import { Language, translations } from '../utils/i18n';
import { filterStudents } from '../utils/academic';

interface StudentDirectoryViewProps {
  students: Student[];
  classes: GradeClass[];
  lang: Language;
  onOpenAddModal: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onViewStudent: (student: Student) => void;
  onViewReportCard: (studentId: string) => void;
  onImportStudents: (newStudents: Student[]) => void;
}

export const StudentDirectoryView: React.FC<StudentDirectoryViewProps> = ({
  students,
  classes,
  lang,
  onOpenAddModal,
  onEditStudent,
  onDeleteStudent,
  onViewStudent,
  onViewReportCard,
  onImportStudents,
}) => {
  const t = translations[lang];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filtered = useMemo(() => {
    return filterStudents(students, searchQuery, selectedGrade, selectedGender, selectedStatus);
  }, [students, searchQuery, selectedGrade, selectedGender, selectedStatus]);

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Code',
      'KhmerName',
      'LatinName',
      'Gender',
      'DOB',
      'Grade',
      'Phone',
      'Address',
      'ParentName',
      'ParentPhone',
      'Status',
    ];
    const rows = filtered.map((s) => [
      `"${s.code}"`,
      `"${s.khmerName}"`,
      `"${s.latinName}"`,
      `"${s.gender}"`,
      `"${s.dob}"`,
      `"${s.gradeId}"`,
      `"${s.phone}"`,
      `"${s.address.replace(/"/g, '""')}"`,
      `"${s.parentName}"`,
      `"${s.parentPhone}"`,
      `"${s.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Students_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import (dummy/quick parser)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = content.split('\n').filter((l) => l.trim().length > 0);
      if (lines.length <= 1) return;

      const imported: Student[] = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map((p) => p.replace(/^"|"$/g, '').trim());
        if (parts.length >= 3 && parts[1]) {
          imported.push({
            id: `stu-imp-${Date.now()}-${i}`,
            code: parts[0] || `STU-2025-${String(students.length + i).padStart(3, '0')}`,
            khmerName: parts[1],
            latinName: parts[2] || parts[1],
            gender: parts[3] === 'female' ? 'female' : 'male',
            dob: parts[4] || '2012-01-01',
            gradeId: parts[5] || '7A',
            phone: parts[6] || '',
            address: parts[7] || '',
            parentName: parts[8] || 'អាណាព្យាបាល',
            parentPhone: parts[9] || '',
            parentRelationship: 'ឪពុក',
            status: 'active',
            enrollDate: new Date().toISOString().slice(0, 10),
          });
        }
      }
      if (imported.length > 0) {
        onImportStudents(imported);
        alert(lang === 'km' ? `បាននាំចូលសិស្សចំនួន ${imported.length} នាក់ដោយជោគជ័យ!` : `Imported ${imported.length} students successfully!`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>{t.students}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
              {filtered.length} {lang === 'km' ? 'នាក់' : 'students'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'km' ? 'គ្រប់គ្រងបញ្ជីឈ្មោះ ព័ត៌មានលម្អិត និងអាណាព្យាបាលសិស្ស' : 'Manage student database, profiles and parent contacts'}
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
            title={t.exportCSV}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.exportCSV}</span>
          </button>

          {/* Import CSV */}
          <label className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.importCSV}</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>

          {/* Add Student */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addStudent}</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Grade Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-2.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{t.allGrades}</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Gender Filter */}
        <select
          value={selectedGender}
          onChange={(e) => setSelectedGender(e.target.value)}
          className="px-2.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">{t.allGenders}</option>
          <option value="male">{lang === 'km' ? 'ប្រុស' : 'Male'}</option>
          <option value="female">{lang === 'km' ? 'ស្រី' : 'Female'}</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-2.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">{t.allStatus}</option>
          <option value="active">{lang === 'km' ? 'កំពុងរៀន' : 'Active'}</option>
          <option value="suspended">{lang === 'km' ? 'ព្យួរការសិក្សា' : 'Suspended'}</option>
          <option value="graduated">{lang === 'km' ? 'បានបញ្ចប់' : 'Graduated'}</option>
        </select>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">{t.code}</th>
                <th className="py-3 px-4">{lang === 'km' ? 'សិស្ស (ឈ្មោះខ្មែរ / ឡាតាំង)' : 'Student Name'}</th>
                <th className="py-3 px-3">{t.gender}</th>
                <th className="py-3 px-3">{t.grade}</th>
                <th className="py-3 px-4">{t.parent}</th>
                <th className="py-3 px-3">{t.status}</th>
                <th className="py-3 px-4 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <UserCheck className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="font-medium text-slate-600">
                      {lang === 'km' ? 'មិនមានទិន្នន័យសិស្សត្រូវនឹងលក្ខខណ្ឌស្វែងរកទេ' : 'No students found matching your criteria'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {lang === 'km' ? 'សូមសាកល្បងផ្លាស់ប្តូរពាក្យគន្លឹះ ឬជ្រើសរើសថ្នាក់ផ្សេង' : 'Try adjusting your filters or search keywords'}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((student) => {
                  const studentClass = classes.find((c) => c.id === student.gradeId);

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      {/* Code */}
                      <td className="py-3 px-4 font-mono font-medium text-slate-700 whitespace-nowrap">
                        {student.code}
                      </td>

                      {/* Name & Photo */}
                      <td className="py-3 px-4">
                        <div
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => onViewStudent(student)}
                        >
                          <img
                            src={student.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                            alt={student.khmerName}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {student.khmerName}
                            </div>
                            <div className="text-xs text-slate-500">{student.latinName}</div>
                          </div>
                        </div>
                      </td>

                      {/* Gender */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                            student.gender === 'female'
                              ? 'bg-pink-50 text-pink-700 border border-pink-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {student.gender === 'female' ? (lang === 'km' ? 'ស្រី' : 'F') : (lang === 'km' ? 'ប្រុស' : 'M')}
                        </span>
                      </td>

                      {/* Grade */}
                      <td className="py-3 px-3 whitespace-nowrap font-medium text-slate-700">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-xs">
                          {studentClass?.name || student.gradeId}
                        </span>
                      </td>

                      {/* Parent & Phone */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{student.parentName}</div>
                        <div className="text-xs text-slate-500 font-mono">{student.parentPhone}</div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                            student.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {student.status === 'active' ? (lang === 'km' ? 'កំពុងរៀន' : 'Active') : student.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onViewStudent(student)}
                            title={t.view}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onViewReportCard(student.id)}
                            title={t.reportCard}
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditStudent(student)}
                            title={t.edit}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(lang === 'km' ? `តើអ្នកប្រាកដថាចង់លុបទិន្នន័យសិស្ស ${student.khmerName} ទេ?` : `Delete student ${student.latinName}?`)) {
                                onDeleteStudent(student.id);
                              }
                            }}
                            title={t.delete}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
