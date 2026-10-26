import React from 'react';
import {
  GraduationCap,
  Calendar,
  Globe,
  Plus,
  RefreshCw,
  Search,
  School,
  Bell,
} from 'lucide-react';
import { Language, translations } from '../utils/i18n';
import { SCHOOL_INFO } from '../data/mockData';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  onOpenAddStudent: () => void;
  onResetData: () => void;
  onSelectStudent: (studentId: string) => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  onOpenAddStudent,
  onResetData,
  activeTab,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-6 py-2.5 transition-all shadow-xs no-print">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Branding & Academic Year */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-700 to-sky-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>{t.appTitle}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-mono">
                  v2.5
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 hidden sm:flex items-center gap-1">
              <School className="w-3.5 h-3.5 text-blue-600" />
              <span>{SCHOOL_INFO.nameKhmer}</span>
              <span className="text-slate-300">|</span>
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.academicYear} {SCHOOL_INFO.academicYear}</span>
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Add Student Button */}
          <button
            onClick={onOpenAddStudent}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-lg shadow-sm transition-all cursor-pointer focus:ring-2 focus:ring-blue-400"
            aria-label={t.addStudent}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t.addStudent}</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm(lang === 'km' ? 'តើអ្នកពិតជាចង់កំណត់ទិន្នន័យឡើងវិញជាទិន្នន័យគំរូមែនទេ?' : 'Reset to default seed data?')) {
                onResetData();
              }
            }}
            title={t.resetDemo}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label={t.resetDemo}
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors cursor-pointer"
            aria-label="Change Language"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold">{lang === 'km' ? 'EN' : 'ខ្មែរ'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
