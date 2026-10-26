import React, { useState } from 'react';
import { Clock, Calendar, Plus, BookOpen, User, MapPin } from 'lucide-react';
import { GradeClass, TimetableSlot } from '../types';
import { Language, translations } from '../utils/i18n';
import { INITIAL_TIMETABLE } from '../data/mockData';

interface TimetableViewProps {
  classes: GradeClass[];
  lang: Language;
}

export const TimetableView: React.FC<TimetableViewProps> = ({ classes, lang }) => {
  const t = translations[lang];

  const [selectedGrade, setSelectedGrade] = useState<string>(classes[0]?.id || '7A');
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>(INITIAL_TIMETABLE);

  const days: ('ចន្ទ' | 'អង្គារ' | 'ពុធ' | 'ព្រហស្បតិ៍' | 'សុក្រ' | 'សៅរ៍')[] = [
    'ចន្ទ',
    'អង្គារ',
    'ពុធ',
    'ព្រហស្បតិ៍',
    'សុក្រ',
    'សៅរ៍',
  ];

  const timeSlots = [
    '07:30 - 08:20',
    '08:25 - 09:15',
    '09:30 - 10:20',
    '10:25 - 11:15',
    '13:30 - 14:20',
    '14:25 - 15:15',
  ];

  const currentClass = classes.find((c) => c.id === selectedGrade);

  return (
    <div className="space-y-6">
      {/* Header and Class Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>{t.timetable}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'km'
              ? 'កាលវិភាគបង្រៀន និងរៀនប្រចាំសប្តាហ៍តាមថ្នាក់នីមួយៗ'
              : 'Weekly teaching and study schedule per class'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.room})
              </option>
            ))}
          </select>
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
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
                <th className="py-3 px-4 w-32 border-r border-slate-200 text-center">
                  {lang === 'km' ? 'ម៉ោងសិក្សា' : 'Time Slot'}
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
              {timeSlots.map((time, idx) => (
                <tr key={time} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3 border-r border-slate-200 text-center font-mono font-medium text-slate-600 bg-slate-50/50 whitespace-nowrap">
                    {time}
                  </td>
                  {days.map((day) => {
                    const slot = timetableSlots.find(
                      (s) => s.gradeId === selectedGrade && s.dayOfWeek === day && s.timeSlot === time
                    );

                    return (
                      <td
                        key={day}
                        className="py-2.5 px-2.5 border-r border-slate-100 last:border-r-0 align-top min-w-[120px]"
                      >
                        {slot ? (
                          <div className="p-2 rounded-xl bg-blue-50/80 border border-blue-200/70 text-blue-950 hover:bg-blue-100/70 transition-colors">
                            <div className="font-bold text-xs text-blue-900 mb-0.5">{slot.subject}</div>
                            <div className="text-[11px] text-slate-600 line-clamp-1">{slot.teacher}</div>
                            <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-1">
                              <MapPin className="w-2.5 h-2.5 text-blue-500" />
                              <span>{slot.room}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-14 rounded-lg border border-dashed border-slate-200/80 flex items-center justify-center text-slate-300 text-[10px]">
                            {idx >= 4 ? (lang === 'km' ? 'ស្វ័យសិក្សា' : 'Free') : '—'}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
