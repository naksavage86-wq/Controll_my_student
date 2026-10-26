import React from 'react';
import { X, User, Phone, Mail, BookOpen, GraduationCap, School, Calendar, Printer, Edit2 } from 'lucide-react';
import { Teacher, GradeClass, TimetableSlot } from '../types';
import { Language } from '../utils/i18n';

interface TeacherProfileModalProps {
  teacher: Teacher | null;
  classes: GradeClass[];
  timetableSlots: TimetableSlot[];
  isOpen: boolean;
  onClose: () => void;
  onEdit: (teacher: Teacher) => void;
  lang: Language;
}

export const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({
  teacher,
  classes,
  timetableSlots,
  isOpen,
  onClose,
  onEdit,
  lang,
}) => {
  if (!isOpen || !teacher) return null;

  const isKhmer = lang === 'km';
  const homeroomClass = classes.find((c) => c.id === teacher.homeroomGradeId);

  // Filter slots where this teacher teaches
  const teachingSlots = timetableSlots.filter((slot) => {
    return (
      slot.teacher?.toLowerCase().includes(teacher.nameKhmer.toLowerCase()) ||
      slot.teacher?.toLowerCase().includes(teacher.nameLatin.toLowerCase()) ||
      (slot.subject && slot.subject === teacher.subject)
    );
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-blue-800 via-indigo-800 to-sky-700 text-white p-6 sm:p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <img
                src={
                  teacher.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                }
                alt={teacher.nameKhmer}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white/20 shadow-lg ring-2 ring-white/40"
              />
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-xs text-white mb-2">
                  {teacher.subject}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{teacher.nameKhmer}</h2>
                <p className="text-sm text-blue-200 font-mono">{teacher.nameLatin}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-white">
                    {teacher.gender === 'female' ? (isKhmer ? 'អ្នកគ្រូ (ស្រី)' : 'Female') : (isKhmer ? 'លោកគ្រូ (ប្រុស)' : 'Male')}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                      teacher.status === 'leave'
                        ? 'bg-amber-400 text-amber-950'
                        : 'bg-emerald-400 text-emerald-950'
                    }`}
                  >
                    {teacher.status === 'leave' ? (isKhmer ? 'ឈប់សម្រាក' : 'On Leave') : (isKhmer ? 'សកម្ម' : 'Active')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(teacher)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title={isKhmer ? 'កែប្រែ' : 'Edit'}
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handlePrint}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title={isKhmer ? 'បោះពុម្ព' : 'Print'}
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Key Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-blue-600" />
                <span>{isKhmer ? 'ថ្នាក់បន្ទុក' : 'Homeroom Class'}</span>
              </div>
              <div className="text-sm font-bold text-slate-800">
                {homeroomClass ? `${homeroomClass.name} (${homeroomClass.room})` : isKhmer ? 'គ្មាន (គ្រូបង្រៀនមុខវិជ្ជា)' : 'None'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                <span>{isKhmer ? 'កម្រិតវប្បធម៌ / សញ្ញាបត្រ' : 'Qualification'}</span>
              </div>
              <div className="text-sm font-bold text-slate-800">
                {teacher.qualification || (isKhmer ? 'បរិញ្ញាបត្រគរុកោសល្យ' : 'Bachelor of Education')}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isKhmer ? 'លេខទូរស័ព្ទ' : 'Phone'}</span>
              </div>
              <div className="text-sm font-mono font-medium text-slate-800">
                {teacher.phone || (isKhmer ? 'មិនមាន' : 'N/A')}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isKhmer ? 'អ៊ីមែល' : 'Email'}</span>
              </div>
              <div className="text-sm font-mono text-slate-800 truncate">
                {teacher.email || (isKhmer ? 'មិនមាន' : 'N/A')}
              </div>
            </div>
          </div>

          {/* Bio / Experience */}
          {teacher.bio && (
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
              <h4 className="text-xs font-bold uppercase text-blue-900 tracking-wider mb-1.5">
                {isKhmer ? 'ជីវប្រវត្តិ & បទពិសោធន៍ការងារ' : 'Biography & Teaching Experience'}
              </h4>
              <p className="text-sm text-blue-950 leading-relaxed">{teacher.bio}</p>
            </div>
          )}

          {/* Timetable / Classes Taught Summary */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>{isKhmer ? 'ម៉ោងបង្រៀនក្នុងកាលវិភាគ' : 'Scheduled Teaching Slots'}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {teachingSlots.length} {isKhmer ? 'ម៉ោង' : 'slots'}
                </span>
              </h4>
            </div>

            {teachingSlots.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
                {isKhmer ? 'មិនទាន់មានម៉ោងបង្រៀនត្រូវបានកំណត់នៅក្នុងកាលវិភាគនៅឡើយទេ' : 'No timetable slots assigned yet.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {teachingSlots.slice(0, 8).map((slot) => {
                  const c = classes.find((cl) => cl.id === slot.gradeId);
                  return (
                    <div
                      key={slot.id}
                      className="p-2.5 rounded-lg border border-slate-200/80 bg-white flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-slate-900">{slot.dayOfWeek}</span>
                        <span className="text-slate-400 mx-1.5">•</span>
                        <span className="font-mono text-slate-600">{slot.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium font-mono text-[11px]">
                          {c ? c.name : slot.gradeId}
                        </span>
                        <span className="text-slate-400 text-[11px]">{slot.room}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <span className="text-xs text-slate-500">
            {isKhmer ? 'អត្តលេខគ្រូ:' : 'Teacher ID:'} <span className="font-mono font-medium">{teacher.id}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(teacher)}
              className="px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-100/80 hover:bg-blue-200/80 rounded-xl transition-colors cursor-pointer"
            >
              {isKhmer ? 'កែប្រែប្រវត្តិរូប' : 'Edit Profile'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              {isKhmer ? 'បិទ' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
