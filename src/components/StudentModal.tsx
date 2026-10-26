import React, { useState, useEffect } from 'react';
import { X, User, Phone, MapPin, Calendar, BookOpen, ShieldAlert } from 'lucide-react';
import { Student, GradeClass, Gender, StudentStatus } from '../types';
import { Language, translations } from '../utils/i18n';
import { generateStudentCode } from '../utils/academic';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentData: Partial<Student>) => void;
  initialStudent?: Student | null;
  classes: GradeClass[];
  existingStudentsCount: number;
  lang: Language;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialStudent,
  classes,
  existingStudentsCount,
  lang,
}) => {
  const t = translations[lang];

  const [formData, setFormData] = useState<Partial<Student>>({
    code: '',
    khmerName: '',
    latinName: '',
    gender: 'male',
    dob: '2012-01-01',
    pob: 'ភ្នំពេញ',
    gradeId: classes[0]?.id || '7A',
    phone: '',
    address: '',
    status: 'active',
    parentName: '',
    parentPhone: '',
    parentRelationship: 'ឪពុក',
    parentOccupation: '',
    emergencyContact: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialStudent) {
      setFormData(initialStudent);
    } else {
      setFormData({
        code: generateStudentCode(existingStudentsCount),
        khmerName: '',
        latinName: '',
        gender: 'male',
        dob: '2012-01-01',
        pob: 'ភ្នំពេញ',
        gradeId: classes[0]?.id || '7A',
        phone: '',
        address: '',
        status: 'active',
        parentName: '',
        parentPhone: '',
        parentRelationship: 'ឪពុក',
        parentOccupation: '',
        emergencyContact: '',
        notes: '',
      });
    }
    setErrors({});
  }, [initialStudent, existingStudentsCount, isOpen, classes]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.khmerName?.trim()) {
      errs.khmerName = lang === 'km' ? 'សូមបញ្ចូលឈ្មោះខ្មែរ' : 'Khmer name is required';
    }
    if (!formData.latinName?.trim()) {
      errs.latinName = lang === 'km' ? 'សូមបញ្ចូលឈ្មោះឡាតាំង' : 'Latin name is required';
    }
    if (!formData.parentName?.trim()) {
      errs.parentName = lang === 'km' ? 'សូមបញ្ចូលឈ្មោះអាណាព្យាបាល' : 'Guardian name is required';
    }
    if (!formData.parentPhone?.trim()) {
      errs.parentPhone = lang === 'km' ? 'សូមបញ្ចូលលេខទូរស័ព្ទអាណាព្យាបាល' : 'Guardian phone is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {initialStudent
                  ? (lang === 'km' ? 'កែប្រែព័ត៌មានសិស្ស' : 'Edit Student Details')
                  : (lang === 'km' ? 'បញ្ចូលសិស្សថ្មី' : 'Register New Student')}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'km' ? 'បំពេញព័ត៌មានផ្ទាល់ខ្លួន និងអាណាព្យាបាល' : 'Fill personal and guardian info'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Academic & ID */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/60 space-y-4">
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>{lang === 'km' ? 'ព័ត៌មានសិក្សា & អត្តលេខ' : 'Academic & Identity'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.code} *
                </label>
                <input
                  type="text"
                  value={formData.code || ''}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.grade} *
                </label>
                <select
                  value={formData.gradeId}
                  onChange={(e) => setFormData({ ...formData, gradeId: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.status}
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as StudentStatus })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">{lang === 'km' ? 'កំពុងរៀន' : 'Active'}</option>
                  <option value="suspended">{lang === 'km' ? 'ព្យួរការសិក្សា' : 'Suspended'}</option>
                  <option value="transferred">{lang === 'km' ? 'ផ្ទេរការសិក្សា' : 'Transferred'}</option>
                  <option value="graduated">{lang === 'km' ? 'បានបញ្ចប់' : 'Graduated'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Personal Profile */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {lang === 'km' ? 'ព័ត៌មានផ្ទាល់ខ្លួនរបស់សិស្ស' : 'Student Personal Details'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.khmerName} *
                </label>
                <input
                  type="text"
                  placeholder="ឧ. សុខ ចាន់ដារ៉ា"
                  value={formData.khmerName || ''}
                  onChange={(e) => setFormData({ ...formData, khmerName: e.target.value })}
                  className={`w-full px-3 py-2 text-xs sm:text-sm bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.khmerName ? 'border-rose-500' : 'border-slate-300'
                  }`}
                />
                {errors.khmerName && <p className="text-[11px] text-rose-500 mt-1">{errors.khmerName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.latinName} *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sok Chandara"
                  value={formData.latinName || ''}
                  onChange={(e) => setFormData({ ...formData, latinName: e.target.value })}
                  className={`w-full px-3 py-2 text-xs sm:text-sm bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.latinName ? 'border-rose-500' : 'border-slate-300'
                  }`}
                />
                {errors.latinName && <p className="text-[11px] text-rose-500 mt-1">{errors.latinName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.gender} *
                </label>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm">
                    <input
                      type="radio"
                      name="gender"
                      checked={formData.gender === 'male'}
                      onChange={() => setFormData({ ...formData, gender: 'male' })}
                      className="text-blue-600"
                    />
                    <span>{lang === 'km' ? 'ប្រុស' : 'Male'}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm">
                    <input
                      type="radio"
                      name="gender"
                      checked={formData.gender === 'female'}
                      onChange={() => setFormData({ ...formData, gender: 'female' })}
                      className="text-pink-600"
                    />
                    <span>{lang === 'km' ? 'ស្រី' : 'Female'}</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.dob}
                </label>
                <input
                  type="date"
                  value={formData.dob || '2012-01-01'}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.phone} ({lang === 'km' ? 'ផ្ទាល់ខ្លួន' : 'Student Phone'})
                </label>
                <input
                  type="tel"
                  placeholder="012 345 678"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.pob} ({lang === 'km' ? 'ខេត្ត/ក្រុង' : 'Birthplace'})
                </label>
                <input
                  type="text"
                  placeholder="ឧ. រាជធានីភ្នំពេញ"
                  value={formData.pob || ''}
                  onChange={(e) => setFormData({ ...formData, pob: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.address}
              </label>
              <input
                type="text"
                placeholder="ផ្ទះលេខ, ផ្លូវ, សង្កាត់, ខណ្ឌ/ស្រុក, ខេត្ត/រាជធានី"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Section 3: Guardian Details */}
          <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-200/60 space-y-4">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === 'km' ? 'ព័ត៌មានអាណាព្យាបាល & ទំនាក់ទំនងបន្ទាន់' : 'Guardian & Emergency Contacts'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'km' ? 'ឈ្មោះអាណាព្យាបាល' : 'Guardian Name'} *
                </label>
                <input
                  type="text"
                  placeholder="ឧ. សុខ វិបុល"
                  value={formData.parentName || ''}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  className={`w-full px-3 py-2 text-xs sm:text-sm bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.parentName ? 'border-rose-500' : 'border-slate-300'
                  }`}
                />
                {errors.parentName && <p className="text-[11px] text-rose-500 mt-1">{errors.parentName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'km' ? 'ត្រូវជា' : 'Relationship'}
                </label>
                <select
                  value={formData.parentRelationship}
                  onChange={(e) => setFormData({ ...formData, parentRelationship: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ឪពុក">{lang === 'km' ? 'ឪពុក' : 'Father'}</option>
                  <option value="ម្តាយ">{lang === 'km' ? 'ម្តាយ' : 'Mother'}</option>
                  <option value="អាណាព្យាបាល">{lang === 'km' ? 'អាណាព្យាបាលផ្សេងទៀត' : 'Guardian'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'km' ? 'លេខទូរស័ព្ទអាណាព្យាបាល' : 'Guardian Phone'} *
                </label>
                <input
                  type="tel"
                  placeholder="098 765 432"
                  value={formData.parentPhone || ''}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  className={`w-full px-3 py-2 text-xs sm:text-sm bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.parentPhone ? 'border-rose-500' : 'border-slate-300'
                  }`}
                />
                {errors.parentPhone && <p className="text-[11px] text-rose-500 mt-1">{errors.parentPhone}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'km' ? 'មុខរបរ' : 'Occupation'}
                </label>
                <input
                  type="text"
                  placeholder="ឧ. ពាណិជ្ជករ, មន្ត្រីរាជការ..."
                  value={formData.parentOccupation || ''}
                  onChange={(e) => setFormData({ ...formData, parentOccupation: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Health & Biometrics */}
          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200/60 space-y-3">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>🩺 {lang === 'km' ? 'ព័ត៌មានសុខភាព & កាយសម្បទា' : 'Health & Biometrics'}</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'km' ? 'ក្រុមឈាម' : 'Blood Type'}
                </label>
                <select
                  value={formData.bloodType || 'O+'}
                  onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                >
                  <option value="O+">O+</option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                  <option value="O-">O-</option>
                  <option value="A-">A-</option>
                  <option value="B-">B-</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'km' ? 'កម្ពស់ (cm)' : 'Height (cm)'}
                </label>
                <input
                  type="number"
                  placeholder="155"
                  value={formData.heightCm || ''}
                  onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'km' ? 'ទម្ងន់ (kg)' : 'Weight (kg)'}
                </label>
                <input
                  type="number"
                  placeholder="48"
                  value={formData.weightKg || ''}
                  onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'km' ? 'អាឡែកហ្ស៊ី' : 'Allergies'}
                </label>
                <input
                  type="text"
                  placeholder="ឧ. គ្រឿងសមុទ្រ..."
                  value={formData.allergies || ''}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'km' ? 'ជំងឺប្រចាំកាយ (បើមាន)' : 'Chronic Condition / Medications'}
              </label>
              <input
                type="text"
                placeholder="ឧ. ជំងឺហឺត ឬអាឡែកហ្ស៊ីធូលី..."
                value={formData.chronicCondition || ''}
                onChange={(e) => setFormData({ ...formData, chronicCondition: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Section 5: Discipline & Achievements */}
          <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-200/60 space-y-3">
            <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>🎖️ {lang === 'km' ? 'ស្នាដៃកិត្តិយស & ការកត់ត្រាវិន័យ' : 'Merits & Discipline'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'km' ? 'ស្នាដៃ / លិខិតសរសើរ' : 'Merits & Honors'}
                </label>
                <input
                  type="text"
                  placeholder="ឧ. ជ័យលាភីគណិតវិទ្យា, សិស្សគំរូ..."
                  value={Array.isArray(formData.merits) ? formData.merits.join(', ') : formData.merits || ''}
                  onChange={(e) => setFormData({ ...formData, merits: e.target.value ? e.target.value.split(',').map((s) => s.trim()) : [] })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'km' ? 'ការព្រមានវិន័យ (បើមាន)' : 'Disciplinary Warnings'}
                </label>
                <input
                  type="text"
                  placeholder="ឧ. មកយឺតញឹកញាប់, មិនធ្វើកិច្ចការ..."
                  value={Array.isArray(formData.warnings) ? formData.warnings.join(', ') : formData.warnings || ''}
                  onChange={(e) => setFormData({ ...formData, warnings: e.target.value ? e.target.value.split(',').map((s) => s.trim()) : [] })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-rose-700"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {lang === 'km' ? 'កំណត់សម្គាល់បន្ថែម (Special Notes)' : 'Special Notes'}
            </label>
            <textarea
              rows={2}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={lang === 'km' ? 'ឧ. មានទេពកោសល្យពិសេស ឬត្រូវការការយកចិត្តទុកដាក់...' : 'Notes...'}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
