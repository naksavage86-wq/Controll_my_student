import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  BookOpen,
  GraduationCap,
  School,
  FileText,
  Image as ImageIcon,
  Upload,
  Save,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Teacher, GradeClass } from '../types';
import { Language } from '../utils/i18n';

interface TeacherSelfEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher;
  classes: GradeClass[];
  onSave: (updatedTeacher: Teacher) => void;
  lang: Language;
}

const HUMAN_AVATAR_PRESETS = [
  { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80', label: 'Male Teacher 1' },
  { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80', label: 'Female Teacher 1' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80', label: 'Male Teacher 2' },
  { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80', label: 'Female Teacher 2' },
  { url: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=300&auto=format&fit=crop&q=80', label: 'Female Teacher 3' },
  { url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80', label: 'Male Teacher 3' },
  { url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80', label: 'Male Teacher 4' },
  { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80', label: 'Female Teacher 4' },
];

export const TeacherSelfEditModal: React.FC<TeacherSelfEditModalProps> = ({
  isOpen,
  onClose,
  teacher,
  classes,
  onSave,
  lang,
}) => {
  const isKhmer = lang === 'km';
  const [formData, setFormData] = useState<Teacher>(teacher);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    setFormData(teacher);
  }, [teacher, isOpen]);

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
    onSave(formData);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center ring-2 ring-white/30">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-100 text-xs font-medium mb-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>{isKhmer ? 'កែប្រែប្រវត្តិរូបផ្ទាល់ខ្លួន' : 'Edit My Profile'}</span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {isKhmer ? 'កែសម្រួលព័ត៌មានប្រវត្តិរូបគ្រូបង្រៀន' : 'Teacher Profile Management'}
                </h2>
                <p className="text-xs text-blue-100/90 mt-0.5">
                  {isKhmer
                    ? 'កែប្រែជីវប្រវត្តិ លេខទូរស័ព្ទ អ៊ីមែល និងរូបថតផ្ទាល់ខ្លួន (រូបមនុស្សពិត)'
                    : 'Update your biography, phone, email, and human photo avatar'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isKhmer
                ? 'បានរក្សាទុកព័ត៌មានប្រវត្តិរូបគ្រូជោគជ័យ និងបានចងក្រងក្នុងប្រព័ន្ធ!'
                : 'Teacher profile updated successfully and persisted!'}
            </span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Avatar Section - Human Photos */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>{isKhmer ? 'រូបថតផ្ទាល់ខ្លួន (រូបមនុស្សពិត - Human Avatar)' : 'Human Profile Avatar'}</span>
              </label>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 text-blue-700 border border-slate-200 rounded-xl cursor-pointer transition-all shadow-2xs hover:shadow-xs active:scale-95">
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>{isKhmer ? 'ផ្ទុកឡើងរូបថតថ្មី' : 'Upload Human Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="relative group">
                <img
                  src={formData.avatarUrl || HUMAN_AVATAR_PRESETS[0].url}
                  alt="Teacher Preview"
                  className="w-20 h-20 rounded-2xl object-cover ring-3 ring-blue-500 shadow-md"
                />
                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-white font-medium text-center px-1">
                    {isKhmer ? 'រូបថតបច្ចុប្បន្ន' : 'Current'}
                  </span>
                </div>
              </div>

              <div className="flex-1 w-full space-y-2">
                <div className="text-[11px] text-slate-500 font-medium">
                  {isKhmer ? 'ជ្រើសរើសរូបថតមនុស្សពិតគំរូ:' : 'Choose a realistic human portrait preset:'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {HUMAN_AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatarUrl: preset.url })}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        formData.avatarUrl === preset.url
                          ? 'border-blue-600 ring-2 ring-blue-300 scale-105 shadow-sm'
                          : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                      title={preset.label}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  placeholder={isKhmer ? 'ឬបញ្ចូលតំណភ្ជាប់ URL រូបថតមនុស្សពិត...' : 'Or enter custom image URL...'}
                  value={formData.avatarUrl || ''}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isKhmer ? 'ឈ្មោះជាភាសាខ្មែរ' : 'Khmer Name'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={formData.nameKhmer}
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
                value={formData.nameLatin}
                onChange={(e) => setFormData({ ...formData, nameLatin: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Contact Details: Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isKhmer ? 'លេខទូរស័ព្ទផ្ទាល់ខ្លួន' : 'Phone Number'}</span> <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="012 888 111"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isKhmer ? 'អ៊ីមែលផ្ទាល់ខ្លួន' : 'Email Address'}</span>
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="teacher@sisowath.edu.kh"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Subject & Degree / Qualification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>{isKhmer ? 'មុខវិជ្ជាបង្រៀន' : 'Teaching Subject'}</span>
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                <span>{isKhmer ? 'កម្រិតវប្បធម៌ / សញ្ញាបត្រ' : 'Degree / Qualification'}</span>
              </label>
              <input
                type="text"
                value={formData.qualification || ''}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="e.g. បរិញ្ញាបត្រជាន់ខ្ពស់ / អនុបណ្ឌិត"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Homeroom Assignment (Read or Select) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-blue-600" />
              <span>{isKhmer ? 'បន្ទុកថ្នាក់' : 'Homeroom Assignment'}</span>
            </label>
            <select
              value={formData.homeroomGradeId || ''}
              onChange={(e) => setFormData({ ...formData, homeroomGradeId: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">{isKhmer ? '-- គ្មាន (គ្រូបង្រៀនមុខវិជ្ជា) --' : '-- None (Subject Teacher) --'}</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.room})
                </option>
              ))}
            </select>
          </div>

          {/* Biography / Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>{isKhmer ? 'ជីវប្រវត្តិសង្ខេប & បទពិសោធន៍បង្រៀន (Bio)' : 'Biography & Teaching Experience (Bio)'}</span>
            </label>
            <textarea
              rows={4}
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder={
                isKhmer
                  ? 'រៀបរាប់សង្ខេបអំពីបទពិសោធន៍បង្រៀន វិធីសាស្ត្រគរុកោសល្យ ស្នាដៃ និងសមិទ្ធផលការងារ...'
                  : 'Write a brief biography about your teaching journey, achievements, and pedagogy...'
              }
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 leading-relaxed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <span className="text-xs text-slate-400">
              {isKhmer ? 'ទិន្នន័យនឹងត្រូវរក្សាទុកដោយស្វ័យប្រវត្តក្នុងប្រព័ន្ធ' : 'Changes will be saved automatically'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                {isKhmer ? 'បោះបង់' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isKhmer ? 'រក្សាទុកប្រវត្តិរូប' : 'Save Profile'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
