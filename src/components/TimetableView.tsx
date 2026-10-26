import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Calendar,
  Plus,
  BookOpen,
  User,
  MapPin,
  Edit2,
  Trash2,
  X,
  Save,
  Printer,
  CheckCircle2,
  Settings2,
  Sun,
  Sunset,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { GradeClass, TimetableSlot } from '../types';
import { Language, translations } from '../utils/i18n';
import { DEFAULT_SUBJECTS } from '../utils/academic';

export interface TimePeriod {
  id: string;
  label: string;
  timeSlot: string;
  session: 'morning' | 'afternoon';
}

const DEFAULT_PERIODS: TimePeriod[] = [
  // វេនព្រឹក (Morning: 07:00 - 11:15)
  { id: 'p-m1', label: 'ម៉ោងទី ១', timeSlot: '07:00 - 07:45', session: 'morning' },
  { id: 'p-m2', label: 'ម៉ោងទី ២', timeSlot: '07:50 - 08:35', session: 'morning' },
  { id: 'p-m3', label: 'ម៉ោងទី ៣', timeSlot: '08:45 - 09:30', session: 'morning' },
  { id: 'p-m4', label: 'ម៉ោងទី ៤', timeSlot: '09:40 - 10:25', session: 'morning' },
  { id: 'p-m5', label: 'ម៉ោងទី ៥', timeSlot: '10:30 - 11:15', session: 'morning' },

  // វេនរសៀល/ល្ងាច (Afternoon: 13:00 - 17:15)
  { id: 'p-a1', label: 'ម៉ោងទី ១ រសៀល', timeSlot: '13:00 - 13:45', session: 'afternoon' },
  { id: 'p-a2', label: 'ម៉ោងទី ២ រសៀល', timeSlot: '13:50 - 14:35', session: 'afternoon' },
  { id: 'p-a3', label: 'ម៉ោងទី ៣ រសៀល', timeSlot: '14:45 - 15:30', session: 'afternoon' },
  { id: 'p-a4', label: 'ម៉ោងទី ៤ រសៀល', timeSlot: '15:40 - 16:25', session: 'afternoon' },
  { id: 'p-a5', label: 'ម៉ោងទី ៥ រសៀល', timeSlot: '16:30 - 17:15', session: 'afternoon' },
];

const PERIODS_STORAGE_KEY = 'schoolpro_time_periods_v2';

interface TimetableViewProps {
  classes: GradeClass[];
  timetableSlots: TimetableSlot[];
  onSaveSlot: (slot: TimetableSlot) => void;
  onDeleteSlot: (slotId: string) => void;
  lang: Language;
}

export const TimetableView: React.FC<TimetableViewProps> = ({
  classes,
  timetableSlots,
  onSaveSlot,
  onDeleteSlot,
  lang,
}) => {
  const t = translations[lang];

  const [selectedGrade, setSelectedGrade] = useState<string>(classes[0]?.id || '7A');
  const [selectedSessionTab, setSelectedSessionTab] = useState<'all' | 'morning' | 'afternoon'>('all');
  const [editingSlot, setEditingSlot] = useState<Partial<TimetableSlot> | null>(null);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [isPeriodManagerOpen, setIsPeriodManagerOpen] = useState(false);
  const [isAddPeriodModalOpen, setIsAddPeriodModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Time periods state (customizable: add / reduce periods)
  const [periods, setPeriods] = useState<TimePeriod[]>(() => {
    try {
      const saved = localStorage.getItem(PERIODS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PERIODS;
    } catch {
      return DEFAULT_PERIODS;
    }
  });

  const savePeriods = (updated: TimePeriod[]) => {
    setPeriods(updated);
    localStorage.setItem(PERIODS_STORAGE_KEY, JSON.stringify(updated));
  };

  const days: ('ចន្ទ' | 'អង្គារ' | 'ពុធ' | 'ព្រហស្បតិ៍' | 'សុក្រ' | 'សៅរ៍')[] = [
    'ចន្ទ',
    'អង្គារ',
    'ពុធ',
    'ព្រហស្បតិ៍',
    'សុក្រ',
    'សៅរ៍',
  ];

  const currentClass = classes.find((c) => c.id === selectedGrade);

  // Filter periods based on selected session tab
  const visiblePeriods = useMemo(() => {
    if (selectedSessionTab === 'morning') {
      return periods.filter((p) => p.session === 'morning');
    }
    if (selectedSessionTab === 'afternoon') {
      return periods.filter((p) => p.session === 'afternoon');
    }
    return periods;
  }, [periods, selectedSessionTab]);

  // Open modal to add or edit slot
  const handleCellClick = (
    day: 'ចន្ទ' | 'អង្គារ' | 'ពុធ' | 'ព្រហស្បតិ៍' | 'សុក្រ' | 'សៅរ៍',
    period: TimePeriod
  ) => {
    const existing = timetableSlots.find(
      (s) => s.gradeId === selectedGrade && s.dayOfWeek === day && s.timeSlot === period.timeSlot
    );

    if (existing) {
      setEditingSlot({ ...existing, session: period.session });
    } else {
      setEditingSlot({
        id: `tt-${Date.now()}`,
        gradeId: selectedGrade,
        dayOfWeek: day,
        timeSlot: period.timeSlot,
        session: period.session,
        subject: DEFAULT_SUBJECTS[0].khmerName,
        teacher: currentClass?.homeroomTeacher || 'លោកគ្រូ',
        room: currentClass?.room || 'បន្ទប់ ១០១',
      });
    }
    setIsSlotModalOpen(true);
  };

  const handleAddNewSlot = () => {
    const defaultPeriod = visiblePeriods[0] || periods[0];
    setEditingSlot({
      id: `tt-${Date.now()}`,
      gradeId: selectedGrade,
      dayOfWeek: 'ចន្ទ',
      timeSlot: defaultPeriod?.timeSlot || '07:00 - 07:45',
      session: defaultPeriod?.session || 'morning',
      subject: DEFAULT_SUBJECTS[0].khmerName,
      teacher: currentClass?.homeroomTeacher || 'លោកគ្រូ',
      room: currentClass?.room || 'បន្ទប់ ១០១',
    });
    setIsSlotModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot?.subject || !editingSlot?.teacher) return;

    const slotToSave: TimetableSlot = {
      id: editingSlot.id || `tt-${Date.now()}`,
      gradeId: selectedGrade,
      dayOfWeek: editingSlot.dayOfWeek as any,
      timeSlot: editingSlot.timeSlot || '07:00 - 07:45',
      session: editingSlot.session || 'morning',
      subject: editingSlot.subject,
      teacher: editingSlot.teacher,
      room: editingSlot.room || currentClass?.room || 'បន្ទប់ ១០១',
    };

    onSaveSlot(slotToSave);
    setIsSlotModalOpen(false);
    setEditingSlot(null);
    setSuccessMessage(lang === 'km' ? 'បានរក្សាទុកកាលវិភាគជោគជ័យ!' : 'Timetable slot saved successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleDeleteCurrentSlot = () => {
    if (editingSlot?.id) {
      onDeleteSlot(editingSlot.id);
      setIsSlotModalOpen(false);
      setEditingSlot(null);
      setSuccessMessage(lang === 'km' ? 'បានលុបម៉ោងបង្រៀនចេញជោគជ័យ!' : 'Timetable slot deleted!');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // Add a new period (បន្ថែមម៉ោងរៀន)
  const [newPeriodForm, setNewPeriodForm] = useState<{
    label: string;
    startTime: string;
    endTime: string;
    session: 'morning' | 'afternoon';
  }>({
    label: '',
    startTime: '11:15',
    endTime: '12:00',
    session: 'morning',
  });

  const handleCreatePeriod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPeriodForm.startTime || !newPeriodForm.endTime) return;

    const timeSlotStr = `${newPeriodForm.startTime} - ${newPeriodForm.endTime}`;
    const newP: TimePeriod = {
      id: `p-${Date.now()}`,
      label: newPeriodForm.label.trim() || `${lang === 'km' ? 'ម៉ោងបន្ថែម' : 'Period'} (${timeSlotStr})`,
      timeSlot: timeSlotStr,
      session: newPeriodForm.session,
    };

    const updated = [...periods, newP];
    savePeriods(updated);
    setIsAddPeriodModalOpen(false);
    setNewPeriodForm({ label: '', startTime: '11:15', endTime: '12:00', session: 'morning' });
    setSuccessMessage(lang === 'km' ? `បានបន្ថែមម៉ោងរៀន "${newP.label}" ជោគជ័យ!` : `Time period "${newP.label}" added!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Delete a period (បន្ថយម៉ោងរៀន)
  const handleDeletePeriod = (periodId: string) => {
    const toDelete = periods.find((p) => p.id === periodId);
    if (!toDelete) return;

    const msg =
      lang === 'km'
        ? `តើអ្នកពិតជាចង់បន្ថយ/លុប "${toDelete.label}" (${toDelete.timeSlot}) ចេញពីកាលវិភាគមែនទេ?`
        : `Are you sure you want to delete period "${toDelete.label}"?`;

    if (window.confirm(msg)) {
      const updated = periods.filter((p) => p.id !== periodId);
      savePeriods(updated);
      setSuccessMessage(lang === 'km' ? 'បានបន្ថយម៉ោងរៀនចេញជោគជ័យ!' : 'Time period removed!');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // Reset to default standard periods
  const handleResetDefaultPeriods = () => {
    if (window.confirm(lang === 'km' ? 'តើអ្នកចង់កំណត់ម៉ោងសិក្សាទាំងអស់ឡើងវិញតាមស្តង់ដារក្រសួងមែនទេ?' : 'Reset to default periods?')) {
      savePeriods(DEFAULT_PERIODS);
      setSuccessMessage(lang === 'km' ? 'បានកំណត់ម៉ោងសិក្សាឡើងវិញជោគជ័យ!' : 'Reset to default periods!');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs no-print">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>{t.timetable}</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {lang === 'km' ? 'រៀនព្រឹក-ល្ងាច' : 'Morning & Afternoon Shifts'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'km'
              ? 'កាលវិភាគសិក្សាវេនព្រឹក និងវេនរសៀល/ល្ងាច • អាចបន្ថែម ឬបន្ថយម៉ោងរៀនតាមតម្រូវការជាក់ស្តែងរបស់សាលា'
              : 'Cambodian school shift schedule • Dynamically add or reduce periods per institutional needs'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Class selector */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.room})
              </option>
            ))}
          </select>

          {/* Add Period / Slot Button */}
          <button
            onClick={() => setIsAddPeriodModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
            title="បន្ថែមម៉ោងរៀនថ្មី"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'km' ? '+ បន្ថែមម៉ោង' : '+ Add Period'}</span>
          </button>

          {/* Manage Periods (បន្ថយម៉ោង) */}
          <button
            onClick={() => setIsPeriodManagerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            title="បន្ថយ ឬគ្រប់គ្រងម៉ោងរៀន"
          >
            <Settings2 className="w-4 h-4 text-slate-600" />
            <span>{lang === 'km' ? 'បន្ថយ/គ្រប់គ្រងម៉ោង' : 'Manage Periods'}</span>
          </button>

          {/* Add/Edit Slot Button */}
          <button
            onClick={handleAddNewSlot}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
            <span>{lang === 'km' ? 'ដាក់មុខវិជ្ជា' : 'Assign Subject'}</span>
          </button>

          {/* Print button */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            title="Print Timetable"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">{t.print}</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 text-emerald-800 text-xs px-4 py-2.5 rounded-xl border border-emerald-200 flex items-center gap-2 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Shifts Tabs (វេនព្រឹក vs វេនរសៀល) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs no-print">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setSelectedSessionTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              selectedSessionTab === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'km' ? 'ទាំងអស់ (ព្រឹក & រសៀល)' : 'All Shifts'}
          </button>
          <button
            type="button"
            onClick={() => setSelectedSessionTab('morning')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedSessionTab === 'morning'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'វេនព្រឹក (០៧:០០ - ១១:១៥)' : 'Morning Shift'}</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedSessionTab('afternoon')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedSessionTab === 'afternoon'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sunset className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'វេនរសៀល/ល្ងាច (១៣:០០ - ១៧:១៥)' : 'Afternoon Shift'}</span>
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500 px-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>{lang === 'km' ? 'វេនព្រឹក' : 'Morning'} ({periods.filter((p) => p.session === 'morning').length} ម៉ោង)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span>{lang === 'km' ? 'វេនរសៀល' : 'Afternoon'} ({periods.filter((p) => p.session === 'afternoon').length} ម៉ោង)</span>
          </div>
        </div>
      </div>

      {/* Class Meta Box */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-800">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-slate-900">{currentClass?.name}</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600">{currentClass?.room}</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-600" />
          <span className="text-slate-600">{lang === 'km' ? 'គ្រូបន្ទុកថ្នាក់' : 'Homeroom Teacher'}:</span>
          <span className="font-semibold text-slate-900">{currentClass?.homeroomTeacher}</span>
        </div>
      </div>

      {/* Weekly Schedule Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
                <th className="py-3 px-4 w-40 border-r border-slate-200 text-center">
                  {lang === 'km' ? 'ម៉ោងសិក្សា' : 'Time & Period'}
                </th>
                {days.map((day) => (
                  <th key={day} className="py-3 px-3 text-center border-r border-slate-200 last:border-r-0">
                    <div className="font-bold text-slate-900">{day}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {day === 'ចន្ទ'
                        ? 'Mon'
                        : day === 'អង្គារ'
                        ? 'Tue'
                        : day === 'ពុធ'
                        ? 'Wed'
                        : day === 'ព្រហស្បតិ៍'
                        ? 'Thu'
                        : day === 'សុក្រ'
                        ? 'Fri'
                        : 'Sat'}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {visiblePeriods.map((period, idx) => {
                const isMorning = period.session === 'morning';
                const showDivider =
                  selectedSessionTab === 'all' &&
                  idx > 0 &&
                  period.session === 'afternoon' &&
                  visiblePeriods[idx - 1]?.session === 'morning';

                return (
                  <React.Fragment key={period.id}>
                    {/* Shift Separator Banner */}
                    {showDivider && (
                      <tr className="bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 border-y-2 border-indigo-200">
                        <td
                          colSpan={7}
                          className="py-2.5 px-4 text-center font-bold text-indigo-900 text-xs tracking-wide"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <Sunset className="w-4 h-4 text-indigo-600" />
                            <span>{lang === 'km' ? '--- វេនរសៀល/ល្ងាច (១៣:០០ - ១៧:១៥) ---' : '--- AFTERNOON SHIFT (13:00 - 17:15) ---'}</span>
                          </div>
                        </td>
                      </tr>
                    )}

                    <tr className="hover:bg-slate-50/50 group/row">
                      {/* Period Header Column */}
                      <td className="py-3 px-3 border-r border-slate-200 bg-slate-50/60 align-middle">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isMorning ? 'bg-amber-400' : 'bg-indigo-500'
                              }`}
                            />
                            <span className="font-bold text-slate-800 text-[11px]">{period.label}</span>
                          </div>
                          <span className="font-mono text-slate-500 text-[11px]">{period.timeSlot}</span>
                        </div>
                      </td>

                      {/* Day Columns */}
                      {days.map((day) => {
                        const slot = timetableSlots.find(
                          (s) =>
                            s.gradeId === selectedGrade &&
                            s.dayOfWeek === day &&
                            s.timeSlot === period.timeSlot
                        );

                        return (
                          <td
                            key={day}
                            onClick={() => handleCellClick(day, period)}
                            className="py-2.5 px-2.5 border-r border-slate-100 last:border-r-0 align-top min-w-[125px] cursor-pointer hover:bg-blue-50/40 transition-colors group"
                          >
                            {slot ? (
                              <div
                                className={`p-2.5 rounded-xl border text-slate-900 transition-all shadow-2xs relative ${
                                  isMorning
                                    ? 'bg-amber-50/60 border-amber-200/80 group-hover:border-amber-400 group-hover:bg-amber-100/70'
                                    : 'bg-indigo-50/60 border-indigo-200/80 group-hover:border-indigo-400 group-hover:bg-indigo-100/70'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span className="font-bold text-xs text-slate-900">{slot.subject}</span>
                                  <Edit2 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="text-[11px] text-slate-600 line-clamp-1">{slot.teacher}</div>
                                <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                                  <MapPin className="w-2.5 h-2.5 text-blue-500" />
                                  <span>{slot.room}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="h-16 rounded-xl border border-dashed border-slate-200/80 group-hover:border-blue-400 group-hover:bg-blue-50/20 flex flex-col items-center justify-center text-slate-300 group-hover:text-blue-500 text-[11px] transition-all">
                                <Plus className="w-3.5 h-3.5 mb-0.5 opacity-0 group-hover:opacity-100" />
                                <span>{lang === 'km' ? '+ ដាក់ម៉ោង' : '+ Add'}</span>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Slot Modal */}
      {isSlotModalOpen && editingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>{lang === 'km' ? 'កែសម្រួល / ដាក់ម៉ោងបង្រៀន' : 'Edit Timetable Slot'}</span>
              </h3>
              <button
                onClick={() => setIsSlotModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'km' ? 'ថ្ងៃនៃសប្តាហ៍' : 'Day of Week'} *
                  </label>
                  <select
                    value={editingSlot.dayOfWeek}
                    onChange={(e) => setEditingSlot({ ...editingSlot, dayOfWeek: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'km' ? 'ម៉ោងសិក្សា' : 'Time Slot'} *
                  </label>
                  <select
                    value={editingSlot.timeSlot}
                    onChange={(e) => {
                      const selPeriod = periods.find((p) => p.timeSlot === e.target.value);
                      setEditingSlot({
                        ...editingSlot,
                        timeSlot: e.target.value,
                        session: selPeriod?.session || 'morning',
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono"
                  >
                    {periods.map((p) => (
                      <option key={p.id} value={p.timeSlot}>
                        {p.session === 'morning' ? '☀️ ព្រឹក' : '🌤️ រសៀល'} • {p.label} ({p.timeSlot})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'km' ? 'មុខវិជ្ជា' : 'Subject'} *
                </label>
                <select
                  value={editingSlot.subject}
                  onChange={(e) => setEditingSlot({ ...editingSlot, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-medium"
                >
                  {DEFAULT_SUBJECTS.map((sub) => (
                    <option key={sub.id} value={sub.khmerName}>
                      {sub.khmerName} ({sub.englishName})
                    </option>
                  ))}
                  <option value="កីឡា & សកម្មភាពសង្គម">កីឡា & សកម្មភាពសង្គម (Physical Ed)</option>
                  <option value="គំនូរ & សិល្បៈ">គំនូរ & សិល្បៈ (Arts)</option>
                  <option value="ស្វ័យសិក្សា / ស្រាវជ្រាវ">ស្វ័យសិក្សា / ស្រាវជ្រាវ (Self-Study)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'km' ? 'ឈ្មោះគ្រូបង្រៀន' : 'Teacher Name'} *
                </label>
                <input
                  type="text"
                  placeholder="ឧ. លោកគ្រូ សេង វិបុល"
                  value={editingSlot.teacher || ''}
                  onChange={(e) => setEditingSlot({ ...editingSlot, teacher: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'km' ? 'បន្ទប់រៀន / ទីកន្លែង' : 'Room / Location'}
                </label>
                <input
                  type="text"
                  placeholder="ឧ. បន្ទប់ ១០១, បន្ទប់កុំព្យូទ័រ, ទីលាន..."
                  value={editingSlot.room || ''}
                  onChange={(e) => setEditingSlot({ ...editingSlot, room: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                {editingSlot.id && timetableSlots.some((s) => s.id === editingSlot.id) ? (
                  <button
                    type="button"
                    onClick={handleDeleteCurrentSlot}
                    className="px-3 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t.delete}</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSlotModalOpen(false)}
                    className="px-3.5 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-medium cursor-pointer"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{t.save}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Period Modal (បន្ថែមម៉ោងរៀន) */}
      {isAddPeriodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'km' ? 'បន្ថែមម៉ោងសិក្សាថ្មី (Add Time Period)' : 'Add New Time Period'}</span>
              </h3>
              <button
                onClick={() => setIsAddPeriodModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePeriod} className="p-5 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'km' ? 'វេនសិក្សា' : 'Shift / Session'} *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPeriodForm({ ...newPeriodForm, session: 'morning' })}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      newPeriodForm.session === 'morning'
                        ? 'border-amber-500 bg-amber-50 text-amber-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>{lang === 'km' ? 'វេនព្រឹក' : 'Morning Shift'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPeriodForm({ ...newPeriodForm, session: 'afternoon' })}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      newPeriodForm.session === 'afternoon'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Sunset className="w-4 h-4 text-indigo-500" />
                    <span>{lang === 'km' ? 'វេនរសៀល/ល្ងាច' : 'Afternoon Shift'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'km' ? 'ឈ្មោះសម្គាល់ម៉ោង (Label)' : 'Period Label'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'km' ? 'ឧ. ម៉ោងទី ៦ ឬ ម៉ោងស្រាវជ្រាវ' : 'e.g. Period 6'}
                  value={newPeriodForm.label}
                  onChange={(e) => setNewPeriodForm({ ...newPeriodForm, label: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'km' ? 'ម៉ោងចាប់ផ្តើម' : 'Start Time'} *
                  </label>
                  <input
                    type="time"
                    required
                    value={newPeriodForm.startTime}
                    onChange={(e) => setNewPeriodForm({ ...newPeriodForm, startTime: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'km' ? 'ម៉ោងបញ្ចប់' : 'End Time'} *
                  </label>
                  <input
                    type="time"
                    required
                    value={newPeriodForm.endTime}
                    onChange={(e) => setNewPeriodForm({ ...newPeriodForm, endTime: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddPeriodModalOpen(false)}
                  className="px-3.5 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-medium cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{lang === 'km' ? 'យល់ព្រមបន្ថែម' : 'Add Period'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Periods Modal (បន្ថយ ឬលុបម៉ោងរៀន) */}
      {isPeriodManagerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-blue-600" />
                <span>{lang === 'km' ? 'គ្រប់គ្រង និងបន្ថយម៉ោងរៀន (Manage / Reduce Periods)' : 'Manage & Reduce Periods'}</span>
              </h3>
              <button
                onClick={() => setIsPeriodManagerOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <p className="text-xs text-slate-500">
                {lang === 'km'
                  ? 'អ្នកអាចលុប/បន្ថយម៉ោងរៀនដែលមិនត្រូវការចេញពីកាលវិភាគ ឬកំណត់ម៉ោងដើមឡើងវិញ៖'
                  : 'Delete or remove unnecessary periods from your school timetable, or reset to defaults:'}
              </p>

              {/* List of periods */}
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {periods.map((period) => (
                  <div
                    key={period.id}
                    className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          period.session === 'morning' ? 'bg-amber-400' : 'bg-indigo-500'
                        }`}
                      />
                      <div>
                        <div className="font-bold text-xs text-slate-800">{period.label}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {period.session === 'morning' ? 'វេនព្រឹក' : 'វេនរសៀល'} • {period.timeSlot}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeletePeriod(period.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title={lang === 'km' ? 'បន្ថយម៉ោងនេះចេញ' : 'Delete this period'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
              <button
                onClick={handleResetDefaultPeriods}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'km' ? 'កំណត់ម៉ោងស្តង់ដារឡើងវិញ' : 'Reset Defaults'}</span>
              </button>

              <button
                onClick={() => setIsPeriodManagerOpen(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                {lang === 'km' ? 'រួចរាល់' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
