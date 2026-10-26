import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  Award,
  FileText,
  CreditCard,
  Clock,
  School,
  ChevronRight,
  Code2,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { Language, translations } from '../utils/i18n';
import { UserAccount } from '../types';

export type TabType =
  | 'dashboard'
  | 'students'
  | 'teachers'
  | 'attendance'
  | 'grades'
  | 'reportCard'
  | 'tuition'
  | 'timetable'
  | 'settings';

interface SidebarProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  lang: Language;
  studentCount: number;
  teacherCount: number;
  currentUser?: UserAccount | null;
  onLogout?: () => void;
  onOpenDeveloperProfile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onChangeTab,
  lang,
  studentCount,
  teacherCount,
  currentUser,
  onLogout,
  onOpenDeveloperProfile,
}) => {
  const t = translations[lang];

  const menuItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number | string }[] = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'students', label: t.students, icon: Users, badge: studentCount },
    { id: 'teachers', label: t.teachers, icon: GraduationCap, badge: teacherCount },
    { id: 'attendance', label: t.attendance, icon: CalendarCheck },
    { id: 'grades', label: t.grades, icon: Award },
    { id: 'reportCard', label: t.reportCard, icon: FileText },
    { id: 'tuition', label: t.tuition, icon: CreditCard },
    { id: 'timetable', label: t.timetable, icon: Clock },
    { id: 'settings', label: t.settings, icon: School },
  ];

  const getRoleLabel = (role?: string) => {
    if (role === 'admin') return lang === 'km' ? 'នាយកសាលា' : 'Admin';
    if (role === 'teacher') return lang === 'km' ? 'គ្រូបង្រៀន' : 'Teacher';
    if (role === 'staff') return lang === 'km' ? 'បុគ្គលិក' : 'Staff';
    return role || '';
  };

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-slate-200/80 flex lg:flex-col shrink-0 no-print">
      {/* Mobile Horizontal Tabs or Desktop Vertical Menu */}
      <div className="w-full overflow-x-auto lg:overflow-y-auto p-2 lg:p-4 flex lg:flex-col gap-1 scrollbar-none">
        <div className="hidden lg:block px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {lang === 'km' ? 'មុខងារគ្រប់គ្រងសាលា' : 'Management Modules'}
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-mono shrink-0 ml-2 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {isActive && <ChevronRight className="w-4 h-4 hidden lg:block opacity-60 ml-auto" />}
            </button>
          );
        })}
      </div>

      {/* Footer Info & Current User in Sidebar */}
      <div className="hidden lg:block mt-auto p-4 border-t border-slate-100 space-y-2.5">
        {/* Current Logged In User Widget */}
        {currentUser && (
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={
                  currentUser.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                }
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
                <div className="text-[10px] text-blue-600 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                  <span>{getRoleLabel(currentUser.role)}</span>
                </div>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                title={lang === 'km' ? 'ចាកចេញពីគណនី' : 'Sign Out'}
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Developer Profile Button */}
        {onOpenDeveloperProfile && (
          <button
            onClick={onOpenDeveloperProfile}
            className="w-full p-2.5 bg-gradient-to-r from-slate-900 to-blue-950 text-white hover:from-slate-800 hover:to-blue-900 rounded-xl text-left transition-all shadow-xs cursor-pointer group flex items-center gap-2.5"
            title="ប្រវត្តិរូបអ្នកបង្កើតប្រព័ន្ធ"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 ring-1 ring-white/20 flex items-center justify-center shrink-0">
              <Code2 className="w-4 h-4 text-blue-300" />
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-[10px] text-blue-300 font-medium">
                {lang === 'km' ? 'អ្នកបង្កើតប្រព័ន្ធ' : 'System Creator'}
              </div>
              <div className="text-xs font-bold truncate">Nak Savage</div>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-200">
              {lang === 'km' ? 'មើល' : 'View'}
            </span>
          </button>
        )}
      </div>
    </aside>
  );
};
