import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, BookOpen, GraduationCap, School, FileText, Image as ImageIcon, Upload } from 'lucide-react';
import { Teacher, GradeClass } from '../types';
import { Language } from '../utils/i18n';

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Teacher>) => void;
  initialTeacher?: Teacher | null;
  classes: GradeClass[];
  lang: Language;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
];

const COMMON_SUBJECTS = [
  'ភាសាខ្មែរ',
  'គណិតវិទ្យា',
  'រូបវិទ្យា',
  'គីមីវិទ្យា',
  'ជីវវិទ្យា',
  'ភាសាអង់គ្លេស',
  'ប្រវត្តិវិទ្យា',
  'ភូមិវិទ្យា',
  'សីលធម៌-ពលរដ្ឋ',
  'ព័ត៌មានវិទ្យា (ICT)',
  'កីឡា & អប់រំកាយ',
];

export const TeacherModal: React.FC<TeacherModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTeacher,
  classes,
  lang,
}) => {
  const isKhmer = lang === 'km';

  const [formData, setFormData] = useState<Partial<Teacher>>({
    nameKhmer: '',
    nameLatin: '',
    gender: 'male',
    subject: 'ភាសាខ្មែរ',
    homeroomGradeId: '',
    phone: '',
    email: '',
    qualification: '',
    bio: '',
    joinDate: new Date().toISOString().slice(0, 10),
    status: 'active',
    avatarUrl: PRESET_AVATARS[0],
  });

  useEffect(() => {
    if (initialTeacher) {
      setFormData(initialTeacher);
    } else {
      setFormData({
        nameKhmer: '',
        nameLatin: '',
        gender: 'male',
        subject: 'ភាសាខ្មែរ',
        homeroomGradeId: '',
        phone: '',
        email: '',
        qualification: 'បរិញ្ញាបត្រគរុកោសល្យ',
        bio: '',
        joinDate: new Date().toISOString().slice(0, 10),
        status: 'active',
        avatarUrl: PRESET_AVATARS[0],
      });
    }
  }, [initialTeacher, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({ ...prev, avatarUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameKhmer?.trim() && !formData.nameLatin?.trim()) {
      alert(isKhmer ? 'សូមបញ្ចូលឈ្មោះគ្រូបង្រៀន' : 'Please enter teacher name');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {initialTeacher
                  ? isKhmer ? 'កែប្រែប្រវត្តិរូបគ្រូបង្រៀន' : 'Edit Teacher Profile'
                  : isKhmer ? 'បន្ថែមគ្រូបង្រៀនថ្មី' : 'Add New Teacher'}
              </h2>
              <p className="text-xs text-blue-100">
                {isKhmer ? 'បញ្ចូលព័ត៌មានលម្អិត បទពិសោធន៍ និងមុខវិជ្ជាបង្រៀន' : 'Enter teaching subject, homeroom, credentials and contact'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Avatar Selection */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>{isKhmer ? 'រូបថតផ្ទាល់ខ្លួន (រូបមនុស្សពិត - Human Avatar)' : 'Human Profile Photo'}</span>
              </label>
              <label className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg cursor-pointer transition-colors shadow-2xs">
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>{isKhmer ? 'ផ្ទុកឡើងរូបថត' : 'Upload Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex items-center gap-4">
              <img
                src={formData.avatarUrl || PRESET_AVATARS[0]}
                alt="Teacher Avatar"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-sm shrink-0"
              />
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {PRESET_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatarUrl: url })}
                      className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        formData.avatarUrl === url
                          ? 'border-blue-600 scale-105 shadow-sm ring-2 ring-blue-300'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="Preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder={isKhmer ? 'ឬបញ្ចូលតំណភ្ជាប់ URL រូបថតផ្ទាល់...' : 'Or enter custom image URL...'}
                  value={formData.avatarUrl || ''}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Names & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isKhmer ? 'ឈ្មោះជាភាសាខ្មែរ' : 'Khmer Name'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. លោកគ្រូ សេង វិបុល"
                  value={formData.nameKhmer || ''}
                  onChange={(e) => setFormData({ ...formData, nameKhmer: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isKhmer ? 'ឈ្មោះជាអក្សរឡាតាំង' : 'Latin Name'}
              </label>
              <input
                type="text"
                placeholder="e.g. Seng Vibol"
                value={formData.nameLatin || ''}
                onChange={(e) => setFormData({ ...formData, nameLatin: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isKhmer ? 'ភេទ' : 'Gender'}
              </label>
              <select
                value={formData.gender || 'male'}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="male">{isKhmer ? 'ប្រុស' : 'Male'}</option>
                <option value="female">{isKhmer ? 'ស្រី' : 'Female'}</option>
              </select>
            </div>
          </div>

          {/* Subject & Homeroom Class */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>{isKhmer ? 'មុខវិជ្ជាបង្រៀន' : 'Teaching Subject'}</span> <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                list="subjects-list"
                required
                placeholder="e.g. គណិតវិទ្យា"
                value={formData.subject || ''}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <datalist id="subjects-list">
                {COMMON_SUBJECTS.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-blue-600" />
                <span>{isKhmer ? 'គ្រូបន្ទុកថ្នាក់ (បើមាន)' : 'Homeroom Class'}</span>
              </label>
              <select
                value={formData.homeroomGradeId || ''}
                onChange={(e) => setFormData({ ...formData, homeroomGradeId: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">{isKhmer ? '-- គ្មាន (គ្រូបង្រៀនមុខវិជ្ជា) --' : '-- None (Subject Teacher) --'}</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{isKhmer ? 'លេខទូរស័ព្ទ' : 'Phone Number'}</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 012 888 111"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{isKhmer ? 'អ៊ីមែល' : 'Email Address'}</span>
              </label>
              <input
                type="email"
                placeholder="e.g. teacher@school.edu.kh"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Qualification & Join Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                <span>{isKhmer ? 'កម្រិតវប្បធម៌ / សញ្ញាបត្រ' : 'Degree / Qualification'}</span>
              </label>
              <input
                type="text"
                placeholder="e.g. បរិញ្ញាបត្រគរុកោសល្យ / អនុបណ្ឌិត"
                value={formData.qualification || ''}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isKhmer ? 'កាលបរិច្ឆេទចូលបម្រើការងារ' : 'Join Date'}
              </label>
              <input
                type="date"
                value={formData.joinDate || ''}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isKhmer ? 'ស្ថានភាពការងារ' : 'Employment Status'}
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="teacher-status"
                  value="active"
                  checked={formData.status !== 'leave'}
                  onChange={() => setFormData({ ...formData, status: 'active' })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  {isKhmer ? 'កំពុងបង្រៀន (Active)' : 'Active'}
                </span>
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="teacher-status"
                  value="leave"
                  checked={formData.status === 'leave'}
                  onChange={() => setFormData({ ...formData, status: 'leave' })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  {isKhmer ? 'ព្យួរការងារ / ឈប់សម្រាក' : 'On Leave'}
                </span>
              </label>
            </div>
          </div>

          {/* Bio / Experience */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>{isKhmer ? 'ជីវប្រវត្តិសង្ខេប / បទពិសោធន៍បង្រៀន' : 'Biography / Teaching Experience'}</span>
            </label>
            <textarea
              rows={3}
              placeholder={isKhmer ? 'បញ្ជាក់ពីបទពិសោធន៍ ការបណ្តុះបណ្តាល ឬសមិទ្ធផលការងារ...' : 'Notes about teaching experience, awards, achievements...'}
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              {isKhmer ? 'បោះបង់' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              {initialTeacher
                ? isKhmer ? 'រក្សាទុកការកែប្រែ' : 'Save Changes'
                : isKhmer ? 'រក្សាទុកគ្រូថ្មី' : 'Save Teacher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
