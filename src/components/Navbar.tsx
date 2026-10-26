import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  Globe,
  Plus,
  RefreshCw,
  School,
  LogOut,
  User,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { Language, translations } from '../utils/i18n';
import { SCHOOL_INFO } from '../data/mockData';
import { UserAccount } from '../types';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  onOpenAddStudent: () => void;
  onResetData: () => void;
  onSelectStudent: (studentId: string) => void;
  activeTab: string;
  onOpenDeveloperProfile?: () => void;
  developerAvatar?: string;
  currentUser?: UserAccount | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  onOpenAddStudent,
  onResetData,
  onOpenDeveloperProfile,
  developerAvatar,
  currentUser,
  onLogout,
}) => {
  const t = translations[lang];
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'admin':
        return { label: lang === 'km' ? 'នាយកសាលា' : 'Principal', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'teacher':
        return { label: lang === 'km' ? 'គ្រូបង្រៀន' : 'Teacher', bg: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'staff':
        return { label: lang === 'km' ? 'បុគ្គលិក' : 'Staff', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      default:
        return { label: role || '', bg: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  const roleInfo = getRoleBadge(currentUser?.role);

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
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-lg shadow-sm transition-all cursor-pointer focus:ring-2 focus:ring-blue-400"
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

          {/* Developer / Creator Button */}
          {onOpenDeveloperProfile && (
            <button
              onClick={onOpenDeveloperProfile}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white hover:from-blue-800 hover:to-indigo-800 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer group"
              title={lang === 'km' ? 'ប្រវត្តិរូបអ្នកបង្កើតប្រព័ន្ធ' : 'System Creator Profile'}
            >
              <div className="relative">
                <img
                  src={
                    developerAvatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                  }
                  alt="Developer"
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-white/50"
                />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute -bottom-0.5 -right-0.5 ring-1 ring-slate-900" />
              </div>
              <span className="hidden md:inline">{lang === 'km' ? 'អ្នកបង្កើត' : 'Developer'}</span>
            </button>
          )}

          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors cursor-pointer"
            aria-label="Change Language"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold">{lang === 'km' ? 'EN' : 'ខ្មែរ'}</span>
          </button>

          {/* User Account Pill & Menu */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 transition-all cursor-pointer border border-slate-200/80"
              >
                <img
                  src={
                    currentUser.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                  }
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                />
                <div className="text-left hidden lg:block max-w-[120px]">
                  <div className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</div>
                  <div className="text-[10px] text-blue-600 font-medium truncate">{roleInfo.label}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono truncate">{currentUser.email}</div>
                      <div className="mt-1.5">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${roleInfo.bg}`}>
                          <ShieldCheck className="w-3 h-3" />
                          <span>{roleInfo.label}</span>
                        </span>
                      </div>
                    </div>

                    {onLogout && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{lang === 'km' ? 'ចាកចេញ / ប្តូរគណនី' : 'Sign Out / Switch Account'}</span>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
