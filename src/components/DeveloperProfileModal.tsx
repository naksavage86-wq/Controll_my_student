import React, { useState } from 'react';
import {
  X,
  Code2,
  Mail,
  Phone,
  Send,
  Github,
  Globe,
  Award,
  Sparkles,
  Edit3,
  Save,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { DeveloperProfile } from '../types';
import { Language } from '../utils/i18n';

interface DeveloperProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  developer: DeveloperProfile;
  onSaveProfile: (updated: DeveloperProfile) => void;
  lang: Language;
}

const HUMAN_AVATAR_PRESETS = [
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', label: 'Male 1 (Developer)' },
  { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80', label: 'Male 2 (Asian Tech Lead)' },
  { url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80', label: 'Male 3 (Architect)' },
  { url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80', label: 'Male 4 (Engineer)' },
  { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80', label: 'Female 1 (Lead)' },
  { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', label: 'Female 2 (Designer)' },
];

export const DeveloperProfileModal: React.FC<DeveloperProfileModalProps> = ({
  isOpen,
  onClose,
  developer,
  onSaveProfile,
  lang,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<DeveloperProfile>(developer);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
    onSaveProfile(formData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto no-print">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white overflow-hidden">
          {/* Subtle geometric background accents */}
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-20 -bottom-10 w-36 h-36 bg-indigo-500/15 rounded-full blur-xl pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Avatar / Photo */}
            <div className="relative">
              <img
                src={
                  formData.avatarUrl ||
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
                }
                alt={formData.nameLatin}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white/30 shadow-xl"
              />
              <span className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white p-1 rounded-full ring-2 ring-white shadow-xs" title="Verified Creator">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            {/* Profile Intro */}
            <div className="text-center sm:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-2 border border-blue-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{lang === 'km' ? 'អ្នកបង្កើតកម្មវិធី' : 'Application Creator & Architect'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center justify-center sm:justify-start gap-2">
                <span>{formData.nameKhmer}</span>
                <span className="text-sm font-normal text-blue-200 font-mono">({formData.nameLatin})</span>
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/90 mt-1">{formData.role}</p>
              <p className="text-xs text-blue-200/70 mt-0.5">{formData.institution || 'Cambodia Digital Education Solutions'}</p>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'km' ? 'បានរក្សាទុកព័ត៌មានអ្នកបង្កើតជោគជ័យ!' : 'Creator profile updated successfully!'}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6">
          {!isEditing ? (
            <div className="space-y-6">
              {/* Bio */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {lang === 'km' ? 'អំពីអ្នកបង្កើត' : 'About Creator'}
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                  {formData.bio}
                </p>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {lang === 'km' ? 'ព័ត៌មានទំនាក់ទំនងផ្ទាល់' : 'Contact Details'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Email */}
                  <a
                    href={`mailto:${formData.email}`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-[11px] text-slate-400 font-medium">Email</div>
                      <div className="text-xs font-semibold text-slate-800 truncate group-hover:text-blue-600">
                        {formData.email}
                      </div>
                    </div>
                  </a>

                  {/* Telegram */}
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                    <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                      <Send className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">Telegram</div>
                      <div className="text-xs font-semibold text-slate-800">{formData.telegram || '@naksavage'}</div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">{lang === 'km' ? 'លេខទូរស័ព្ទ' : 'Phone'}</div>
                      <div className="text-xs font-semibold text-slate-800">{formData.phone || '+855 12 345 678'}</div>
                    </div>
                  </div>

                  {/* GitHub */}
                  {formData.githubUrl && (
                    <a
                      href={formData.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                        <Github className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-[11px] text-slate-400 font-medium">GitHub Repository</div>
                        <div className="text-xs font-semibold text-slate-800 truncate group-hover:text-blue-600 flex items-center gap-1">
                          <span>{formData.githubUrl.replace('https://', '')}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </div>
                      </div>
                    </a>
                  )}
                </div>
              </div>

              {/* Skills & Architecture */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {lang === 'km' ? 'ជំនាញ និងបច្ចេកវិទ្យាបង្កើតកម្មវិធី' : 'Skills & Technologies'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(formData.skills || ['React 19', 'TypeScript', 'Tailwind CSS', 'Vite', 'School System Architecture', 'Khmer i18n']).map(
                    (skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-xs text-slate-400">
                  SchoolPro Management System • {new Date().getFullYear()}
                </span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{lang === 'km' ? 'កែសម្រួលព័ត៌មាន' : 'Edit Profile'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Edit Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'km' ? 'ឈ្មោះខ្មែរ' : 'Khmer Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameKhmer}
                    onChange={(e) => setFormData({ ...formData, nameKhmer: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'km' ? 'ឈ្មោះឡាតាំង' : 'Latin Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameLatin}
                    onChange={(e) => setFormData({ ...formData, nameLatin: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'km' ? 'តួនាទី' : 'Role / Title'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'km' ? 'លេខទូរស័ព្ទ' : 'Phone'}
                  </label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Telegram</label>
                  <input
                    type="text"
                    value={formData.telegram || ''}
                    onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Avatar Selector with Real Human Presets and Upload */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>{lang === 'km' ? 'រូបថតផ្ទាល់ខ្លួន (រូបមនុស្សពិត - Human Avatar)' : 'Human Avatar Photo'}</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg cursor-pointer transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>{lang === 'km' ? 'ផ្ទុកឡើងរូបថត' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={formData.avatarUrl || HUMAN_AVATAR_PRESETS[0].url}
                    alt="Current Avatar"
                    className="w-14 h-14 rounded-xl object-cover ring-2 ring-blue-500 shadow-sm shrink-0"
                  />
                  <div className="flex-1">
                    <div className="text-[11px] text-slate-500 mb-1.5 font-medium">
                      {lang === 'km' ? 'ជ្រើសរើសរូបថតមនុស្សពិតគំរូ ឬចុចផ្ទុកឡើង:' : 'Select a realistic human portrait preset:'}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {HUMAN_AVATAR_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, avatarUrl: preset.url }))}
                          className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                            formData.avatarUrl === preset.url
                              ? 'border-blue-600 ring-2 ring-blue-300 scale-105'
                              : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                          title={preset.label}
                        >
                          <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <input
                    type="url"
                    value={formData.avatarUrl || ''}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    placeholder={lang === 'km' ? 'ឬបិទភ្ជាប់តំណរូបភាព (Image URL)...' : 'Or enter custom image URL...'}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub URL</label>
                <input
                  type="url"
                  value={formData.githubUrl || ''}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'km' ? 'ជីវប្រវត្តិសង្ខេប (Bio)' : 'Bio / Description'}
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs sm:text-sm text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors cursor-pointer"
                >
                  {lang === 'km' ? 'បោះបង់' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{lang === 'km' ? 'រក្សាទុក' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
