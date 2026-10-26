import React, { useState } from 'react';
import {
  School,
  BookOpen,
  Users,
  Save,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  X,
  UserCheck,
  Code2,
} from 'lucide-react';
import { GradeClass, Subject, Teacher } from '../types';
import { Language, translations } from '../utils/i18n';
import { DEFAULT_SUBJECTS } from '../utils/academic';
import { SCHOOL_INFO, INITIAL_TEACHERS } from '../data/mockData';

interface SchoolSettingsViewProps {
  classes: GradeClass[];
  onAddClass: (newClass: GradeClass) => void;
  onUpdateClass: (updatedClass: GradeClass) => void;
  onDeleteClass: (classId: string) => void;
  onResetData: () => void;
  lang: Language;
  onOpenDeveloperProfile?: () => void;
}

export const SchoolSettingsView: React.FC<SchoolSettingsViewProps> = ({
  classes,
  onAddClass,
  onUpdateClass,
  onDeleteClass,
  onResetData,
  lang,
  onOpenDeveloperProfile,
}) => {
  const t = translations[lang];

  const [schoolProfile, setSchoolProfile] = useState(SCHOOL_INFO);
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Class Modal state
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<GradeClass | null>(null);
  const [classForm, setClassForm] = useState<Partial<GradeClass>>({
    id: '',
    name: '',
    level: 7,
    room: '',
    homeroomTeacher: '',
    academicYear: '២០២៤-២០២៥',
    capacity: 35,
  });

  const handleOpenAddClass = () => {
    setEditingClass(null);
    setClassForm({
      id: '',
      name: '',
      level: 7,
      room: 'អគារ A - បន្ទប់ ១០៣',
      homeroomTeacher: teachers[0]?.nameKhmer || 'លោកគ្រូ',
      academicYear: '២០២៤-២០២៥',
      capacity: 35,
    });
    setIsClassModalOpen(true);
  };

  const handleOpenEditClass = (c: GradeClass) => {
    setEditingClass(c);
    setClassForm(c);
    setIsClassModalOpen(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classForm.id || !classForm.name) return;

    if (editingClass) {
      onUpdateClass({
        ...editingClass,
        ...classForm,
      } as GradeClass);
    } else {
      onAddClass({
        id: classForm.id.trim(),
        name: classForm.name.trim(),
        level: Number(classForm.level) || 7,
        room: classForm.room || 'បន្ទប់ ១០១',
        homeroomTeacher: classForm.homeroomTeacher || 'លោកគ្រូ',
        academicYear: classForm.academicYear || '២០២៤-២០២៥',
        capacity: Number(classForm.capacity) || 35,
      });
    }
    setIsClassModalOpen(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <School className="w-5 h-5 text-blue-600" />
            <span>{t.settings}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'km'
              ? 'ព័ត៌មានទូទៅសាលា គ្រប់គ្រងថ្នាក់រៀន បញ្ជីគ្រូបង្រៀន និងមេគុណមុខវិជ្ជា'
              : 'School institution profile, manage classes, teacher faculty, and subject coefficients'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenDeveloperProfile && (
            <button
              onClick={onOpenDeveloperProfile}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Code2 className="w-3.5 h-3.5 text-blue-400" />
              <span>{lang === 'km' ? 'ប្រវត្តិរូបអ្នកបង្កើត (Nak)' : 'Developer Profile'}</span>
            </button>
          )}

          <button
            onClick={() => {
              if (window.confirm(lang === 'km' ? 'តើអ្នកពិតជាចង់កំណត់ឡើងវិញជាទិន្នន័យគំរូមែនទេ?' : 'Reset to default demo data?')) {
                onResetData();
              }
            }}
            className="px-3.5 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetDemo}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 text-emerald-800 text-xs px-4 py-2.5 rounded-xl border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{lang === 'km' ? 'បានរក្សាទុកព័ត៌មានដោយជោគជ័យ!' : 'Settings updated successfully!'}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Profile */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              {lang === 'km' ? 'ព័ត៌មានគ្រឹះស្ថានសិក្សា' : 'School Profile Details'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'km' ? 'ឈ្មោះសាលា (ភាសាខ្មែរ)' : 'School Name (Khmer)'}
                </label>
                <input
                  type="text"
                  value={schoolProfile.nameKhmer}
                  onChange={(e) => setSchoolProfile({ ...schoolProfile, nameKhmer: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'km' ? 'ឈ្មោះសាលា (អង់គ្លេស)' : 'School Name (English)'}
                </label>
                <input
                  type="text"
                  value={schoolProfile.nameEnglish}
                  onChange={(e) => setSchoolProfile({ ...schoolProfile, nameEnglish: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'km' ? 'នាយកសាលា' : 'Principal Name'}
                </label>
                <input
                  type="text"
                  value={schoolProfile.principal}
                  onChange={(e) => setSchoolProfile({ ...schoolProfile, principal: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.academicYear}
                </label>
                <input
                  type="text"
                  value={schoolProfile.academicYear}
                  onChange={(e) => setSchoolProfile({ ...schoolProfile, academicYear: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.phone}
                </label>
                <input
                  type="text"
                  value={schoolProfile.phone}
                  onChange={(e) => setSchoolProfile({ ...schoolProfile, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={schoolProfile.email}
                  onChange={(e) => setSchoolProfile({ ...schoolProfile, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t.address}</label>
              <input
                type="text"
                value={schoolProfile.addressKhmer}
                onChange={(e) => setSchoolProfile({ ...schoolProfile, addressKhmer: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-xs sm:text-sm"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{t.save}</span>
              </button>
            </div>
          </form>

          {/* Teacher Faculty Directory */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>{lang === 'km' ? 'បញ្ជីលោកគ្រូ-អ្នកគ្រូបង្រៀន (Faculty Directory)' : 'Teacher Directory'}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {lang === 'km' ? 'ព័ត៌មានទំនាក់ទំនងគ្រូ មុខវិជ្ជាឯកទេស និងបន្ទុកថ្នាក់' : 'Teacher contacts, subjects, and homeroom assignments'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
                  <img
                    src={teacher.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={teacher.nameKhmer}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-100 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-900 text-xs sm:text-sm truncate">{teacher.nameKhmer}</div>
                    <div className="text-[11px] text-blue-700 font-medium">{teacher.subject}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{teacher.phone}</span>
                      {teacher.homeroomGradeId && (
                        <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                          ថ្នាក់ {teacher.homeroomGradeId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Classes & Subjects overview */}
        <div className="space-y-6">
          {/* Classes list with Add/Edit */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>{lang === 'km' ? 'បញ្ជីថ្នាក់រៀនសកម្ម' : 'Active Classes'}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                  {classes.length}
                </span>
              </h4>
              <button
                onClick={handleOpenAddClass}
                className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'km' ? 'ថ្នាក់ថ្មី' : 'New'}</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {classes.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">{c.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{c.homeroomTeacher} • {c.room}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditClass(c)}
                        className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit Class"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {classes.length > 1 && (
                        <button
                          onClick={() => {
                            if (window.confirm(lang === 'km' ? `តើអ្នកប្រាកដថាចង់លុបថ្នាក់ ${c.name} ទេ?` : `Delete class ${c.name}?`)) {
                              onDeleteClass(c.id);
                            }
                          }}
                          className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete Class"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600 border-t border-slate-200/60 pt-1.5">
                    <span>កម្រិតទី {c.level}</span>
                    <span className="font-medium text-blue-700">{c.capacity} {lang === 'km' ? 'កៅអី' : 'seats'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subjects and Coefs */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'km' ? 'មេគុណមុខវិជ្ជាក្រសួង' : 'Ministry Subject Coefficients'}</span>
            </h4>
            <div className="divide-y divide-slate-100 text-xs">
              {DEFAULT_SUBJECTS.map((sub) => (
                <div key={sub.id} className="py-1.5 flex items-center justify-between">
                  <span className="font-medium text-slate-800">{sub.khmerName}</span>
                  <span className="font-bold text-blue-700">
                    មេគុណ x{sub.coefficient}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Class Modal */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>
                  {editingClass
                    ? (lang === 'km' ? 'កែសម្រួលថ្នាក់រៀន' : 'Edit Class')
                    : (lang === 'km' ? 'បង្កើតថ្នាក់រៀនថ្មី' : 'Create New Class')}
                </span>
              </h3>
              <button onClick={() => setIsClassModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="p-5 space-y-3.5 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'km' ? 'កូដថ្នាក់ (Class ID)' : 'Class ID'} *
                  </label>
                  <input
                    type="text"
                    placeholder="ឧ. 8B, 10B"
                    value={classForm.id || ''}
                    onChange={(e) => setClassForm({ ...classForm, id: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg font-mono font-bold"
                    disabled={Boolean(editingClass)}
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'km' ? 'កម្រិត (Grade Level)' : 'Level'} *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={classForm.level || 7}
                    onChange={(e) => setClassForm({ ...classForm, level: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'km' ? 'ឈ្មោះថ្នាក់ពេញ' : 'Class Name'} *
                </label>
                <input
                  type="text"
                  placeholder="ឧ. ថ្នាក់ទី ៨B"
                  value={classForm.name || ''}
                  onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'km' ? 'បន្ទប់រៀន / អគារ' : 'Room / Building'}
                </label>
                <input
                  type="text"
                  placeholder="ឧ. អគារ B - បន្ទប់ ២០៥"
                  value={classForm.room || ''}
                  onChange={(e) => setClassForm({ ...classForm, room: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'km' ? 'គ្រូបន្ទុកថ្នាក់' : 'Homeroom Teacher'}
                </label>
                <input
                  type="text"
                  placeholder="ឧ. លោកគ្រូ..."
                  value={classForm.homeroomTeacher || ''}
                  onChange={(e) => setClassForm({ ...classForm, homeroomTeacher: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'km' ? 'ចំនួនសិស្សអតិបរមា (Capacity)' : 'Capacity'}
                </label>
                <input
                  type="number"
                  value={classForm.capacity || 35}
                  onChange={(e) => setClassForm({ ...classForm, capacity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg text-xs font-medium cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
