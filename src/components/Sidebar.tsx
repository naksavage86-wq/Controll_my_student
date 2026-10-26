import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Award,
  FileText,
  CreditCard,
  Clock,
  School,
  ChevronRight,
} from 'lucide-react';
import { Language, translations } from '../utils/i18n';

export type TabType =
  | 'dashboard'
  | 'students'
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
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onChangeTab,
  lang,
  studentCount,
}) => {
  const t = translations[lang];

  const menuItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number | string }[] = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'students', label: t.students, icon: Users, badge: studentCount },
    { id: 'attendance', label: t.attendance, icon: CalendarCheck },
    { id: 'grades', label: t.grades, icon: Award },
    { id: 'reportCard', label: t.reportCard, icon: FileText },
    { id: 'tuition', label: t.tuition, icon: CreditCard },
    { id: 'timetable', label: t.timetable, icon: Clock },
    { id: 'settings', label: t.settings, icon: School },
  ];

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

      {/* Footer Info in Sidebar */}
      <div className="hidden lg:block mt-auto p-4 border-t border-slate-100">
        <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl border border-blue-100/60 text-xs text-slate-600">
          <p className="font-semibold text-blue-900 mb-1">
            {lang === 'km' ? 'ជំនួយការរដ្ឋបាល' : 'Admin Support'}
          </p>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            {lang === 'km'
              ? 'ទិន្នន័យត្រូវបានរក្សាទុកដោយស្វ័យប្រវត្តិក្នងប្រព័ន្ធ'
              : 'Local data autosaved securely in browser memory.'}
          </p>
        </div>
      </div>
    </aside>
  );
};
