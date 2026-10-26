import React, { useState } from 'react';
import { School, BookOpen, Users, Save, CheckCircle2, RotateCcw, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { GradeClass, Subject } from '../types';
import { Language, translations } from '../utils/i18n';
import { DEFAULT_SUBJECTS } from '../utils/academic';
import { SCHOOL_INFO } from '../data/mockData';

interface SchoolSettingsViewProps {
  classes: GradeClass[];
  onResetData: () => void;
  lang: Language;
}

export const SchoolSettingsView: React.FC<SchoolSettingsViewProps> = ({
  classes,
  onResetData,
  lang,
}) => {
  const t = translations[lang];

  const [schoolProfile, setSchoolProfile] = useState(SCHOOL_INFO);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
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
              ? 'ព័ត៌មានទូទៅរបស់សាលា បញ្ជីថ្នាក់រៀន និងកម្រិតមេគុណមុខវិជ្ជា'
              : 'School institution profile, grade structures, and subject coefficients'}
          </p>
        </div>

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

      {savedSuccess && (
        <div className="bg-emerald-50 text-emerald-800 text-xs px-4 py-2.5 rounded-xl border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{lang === 'km' ? 'បានរក្សាទុកព័ត៌មានដោយជោគជ័យ!' : 'Settings updated successfully!'}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Profile */}
        <form onSubmit={handleSave} className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
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

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{t.save}</span>
            </button>
          </div>
        </form>

        {/* Right: Classes & Subjects overview */}
        <div className="space-y-6">
          {/* Classes list */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>{lang === 'km' ? 'បញ្ជីថ្នាក់រៀនសកម្ម' : 'Active Classes'}</span>
            </h4>
            <div className="space-y-2.5">
              {classes.map((c) => (
                <div key={c.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{c.name}</div>
                    <div className="text-slate-500">{c.homeroomTeacher} • {c.room}</div>
                  </div>
                  <span className="font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                    {c.capacity} {lang === 'km' ? 'កៅអី' : 'seats'}
                  </span>
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
                  <span className="font-mono font-bold text-blue-700">
                    មេគុណ x{sub.coefficient}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
