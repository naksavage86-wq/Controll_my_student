import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  Phone,
  Mail,
  School,
  GraduationCap,
  BookOpen,
  Edit2,
  Trash2,
  Eye,
  LayoutGrid,
  List,
  Sparkles,
  Edit3,
  CheckCircle2,
  Camera,
  Award,
} from 'lucide-react';
import { Teacher, GradeClass, TimetableSlot, UserAccount } from '../types';
import { Language } from '../utils/i18n';
import { TeacherModal } from './TeacherModal';
import { TeacherProfileModal } from './TeacherProfileModal';
import { TeacherSelfEditModal } from './TeacherSelfEditModal';

interface TeacherManagementViewProps {
  teachers: Teacher[];
  classes: GradeClass[];
  timetableSlots: TimetableSlot[];
  currentUser?: UserAccount | null;
  onAddTeacher: (teacher: Partial<Teacher>) => void;
  onUpdateTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (teacherId: string) => void;
  onUpdateCurrentUser?: (updated: UserAccount) => void;
  lang: Language;
}

export const TeacherManagementView: React.FC<TeacherManagementViewProps> = ({
  teachers,
  classes,
  timetableSlots,
  currentUser,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  onUpdateCurrentUser,
  lang,
}) => {
  const isKhmer = lang === 'km';

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);
  const [isSelfEditModalOpen, setIsSelfEditModalOpen] = useState(false);
  const [selfEditingTeacher, setSelfEditingTeacher] = useState<Teacher | null>(null);
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Match current user to their teacher profile
  const currentTeacher = useMemo(() => {
    if (!currentUser) return null;
    if (currentUser.teacherId) {
      const found = teachers.find((t) => t.id === currentUser.teacherId);
      if (found) return found;
    }
    if (currentUser.email) {
      const found = teachers.find(
        (t) => t.email && t.email.toLowerCase() === currentUser.email.toLowerCase()
      );
      if (found) return found;
    }
    const foundByName = teachers.find(
      (t) => t.nameKhmer === currentUser.name || t.nameLatin === currentUser.name
    );
    if (foundByName) return foundByName;

    if (currentUser.role === 'teacher' && teachers.length > 0) {
      return teachers[0];
    }
    return null;
  }, [currentUser, teachers]);

  const handleOpenSelfEdit = (t?: Teacher) => {
    const target = t || currentTeacher || teachers[0];
    if (target) {
      setSelfEditingTeacher(target);
      setIsSelfEditModalOpen(true);
    }
  };

  const handleSaveSelfEdit = (updatedTeacher: Teacher) => {
    onUpdateTeacher(updatedTeacher);
    if (
      currentUser &&
      (currentUser.teacherId === updatedTeacher.id ||
        (currentUser.email && updatedTeacher.email && currentUser.email.toLowerCase() === updatedTeacher.email.toLowerCase()) ||
        currentUser.role === 'teacher')
    ) {
      const updatedUser: UserAccount = {
        ...currentUser,
        name: updatedTeacher.nameKhmer,
        avatarUrl: updatedTeacher.avatarUrl || currentUser.avatarUrl,
        phone: updatedTeacher.phone || currentUser.phone,
        email: updatedTeacher.email || currentUser.email,
        teacherId: updatedTeacher.id,
      };
      onUpdateCurrentUser?.(updatedUser);
    }
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 3500);
  };

  // Unique list of subjects
  const subjectList = useMemo(() => {
    const set = new Set<string>();
    teachers.forEach((t) => {
      if (t.subject) set.add(t.subject);
    });
    return Array.from(set);
  }, [teachers]);

  // Filtered teachers
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchSearch =
        t.nameKhmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.nameLatin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.phone.includes(searchTerm);

      const matchSubject = selectedSubject === 'all' || t.subject === selectedSubject;
      const matchGrade = selectedGrade === 'all' || t.homeroomGradeId === selectedGrade;

      return matchSearch && matchSubject && matchGrade;
    });
  }, [teachers, searchTerm, selectedSubject, selectedGrade]);

  // Statistics
  const maleCount = teachers.filter((t) => t.gender === 'male').length;
  const femaleCount = teachers.filter((t) => t.gender === 'female').length;
  const homeroomCount = teachers.filter((t) => Boolean(t.homeroomGradeId)).length;

  const handleSaveModal = (data: Partial<Teacher>) => {
    if (editingTeacher) {
      onUpdateTeacher({ ...editingTeacher, ...data } as Teacher);
      setEditingTeacher(null);
    } else {
      onAddTeacher(data);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (
      window.confirm(
        isKhmer
          ? `តើអ្នកពិតជាចង់លុបប្រវត្តិរូប "${name}" ពីប្រព័ន្ធមែនទេ?`
          : `Are you sure you want to delete teacher "${name}"?`
      )
    ) {
      onDeleteTeacher(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            <span>{isKhmer ? 'ការគ្រប់គ្រងគ្រូបង្រៀន & បុគ្គលិកអប់រំ' : 'Teachers & Educational Staff'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isKhmer
              ? 'បន្ថែម កែប្រែព័ត៌មាន និងគ្រប់គ្រងប្រវត្តិរូបគ្រូបង្រៀនតាមមុខវិជ្ជា និងបន្ទុកថ្នាក់'
              : 'Add, update and oversee faculty profiles, subjects taught, and homeroom assignments'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleOpenSelfEdit()}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm font-semibold border border-indigo-200/80 transition-all cursor-pointer shadow-2xs"
            title={isKhmer ? 'កែប្រែប្រវត្តិរូបផ្ទាល់ខ្លួន' : 'Edit My Profile'}
          >
            <Edit3 className="w-4 h-4" />
            <span>{isKhmer ? 'កែប្រែប្រវត្តិរូបគ្រូ' : 'Edit Teacher Profile'}</span>
          </button>
          <button
            onClick={() => {
              setEditingTeacher(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isKhmer ? 'បន្ថែមគ្រូបង្រៀនថ្មី' : 'Add New Teacher'}</span>
          </button>
        </div>
      </div>

      {/* Profile Saved Toast Alert */}
      {profileSavedToast && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-100 shrink-0" />
            <span className="text-sm font-semibold">
              {isKhmer
                ? 'ព័ត៌មានប្រវត្តិរូបគ្រូបង្រៀន ទំនាក់ទំនង និងរូបថតមនុស្សពិតត្រូវបានរក្សាទុកជោគជ័យ!'
                : 'Teacher profile information, contact details, and human avatar updated and saved successfully!'}
            </span>
          </div>
        </div>
      )}

      {/* Dedicated "My Personal Teacher Profile" Banner */}
      {currentTeacher && (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-blue-800/60 relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* Avatar with quick camera edit */}
              <div className="relative group shrink-0">
                <img
                  src={
                    currentTeacher.avatarUrl ||
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
                  }
                  alt={currentTeacher.nameKhmer}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white/30 shadow-xl"
                />
                <button
                  onClick={() => handleOpenSelfEdit(currentTeacher)}
                  className="absolute -bottom-1 -right-1 p-1.5 bg-blue-500 hover:bg-blue-400 text-white rounded-xl ring-2 ring-slate-900 shadow-md transition-all cursor-pointer"
                  title={isKhmer ? 'ប្តូររូបថតមនុស្សពិត' : 'Change Human Avatar'}
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Teacher Info */}
              <div className="text-center sm:text-left space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-xs font-semibold border border-blue-400/30">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>{isKhmer ? 'ប្រវត្តិរូបផ្ទាល់ខ្លួនរបស់ខ្ញុំ' : 'My Teacher Profile'}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {currentTeacher.subject}
                  </span>
                  {currentTeacher.homeroomGradeId && (
                    <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                      {isKhmer ? 'ថ្នាក់បន្ទុក:' : 'Homeroom:'} {currentTeacher.homeroomGradeId}
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center justify-center sm:justify-start gap-2">
                  <span>{currentTeacher.nameKhmer}</span>
                  <span className="text-xs sm:text-sm font-normal text-blue-200 font-mono">
                    ({currentTeacher.nameLatin})
                  </span>
                </h3>

                <p className="text-xs text-blue-100/80">
                  {currentTeacher.qualification || (isKhmer ? 'បរិញ្ញាបត្រគរុកោសល្យ' : 'Faculty Member')}
                </p>

                {/* Contact links */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-blue-200/90 font-mono">
                  {currentTeacher.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{currentTeacher.phone}</span>
                    </span>
                  )}
                  {currentTeacher.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-sky-400" />
                      <span>{currentTeacher.email}</span>
                    </span>
                  )}
                </div>

                {/* Bio Excerpt */}
                {currentTeacher.bio && (
                  <p className="text-xs text-blue-100/90 italic bg-white/10 p-2.5 rounded-xl mt-1.5 max-w-xl line-clamp-2">
                    "{currentTeacher.bio}"
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 w-full md:w-auto justify-center sm:justify-end shrink-0">
              <button
                onClick={() => setViewingTeacher(currentTeacher)}
                className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>{isKhmer ? 'មើលលម្អិត' : 'View Profile'}</span>
              </button>
              <button
                onClick={() => handleOpenSelfEdit(currentTeacher)}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-white" />
                <span>{isKhmer ? 'កែប្រែប្រវត្តិរូបខ្ញុំ' : 'Edit My Profile'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">{isKhmer ? 'គ្រូបង្រៀនសរុប' : 'Total Teachers'}</div>
            <div className="text-xl font-bold text-slate-900 font-mono">{teachers.length}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">{isKhmer ? 'លោកគ្រូ (ប្រុស)' : 'Male Teachers'}</div>
            <div className="text-xl font-bold text-slate-900 font-mono">{maleCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">{isKhmer ? 'អ្នកគ្រូ (ស្រី)' : 'Female Teachers'}</div>
            <div className="text-xl font-bold text-slate-900 font-mono">{femaleCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <School className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">{isKhmer ? 'គ្រូបន្ទុកថ្នាក់' : 'Homeroom Teachers'}</div>
            <div className="text-xl font-bold text-slate-900 font-mono">{homeroomCount}</div>
          </div>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder={isKhmer ? 'ស្វែងរកតាមឈ្មោះ មុខវិជ្ជា ឬលេខទូរស័ព្ទ...' : 'Search by name, subject, or phone...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
          />
        </div>

        {/* Filters and View Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-700"
          >
            <option value="all">{isKhmer ? 'គ្រប់មុខវិជ្ជា' : 'All Subjects'}</option>
            {subjectList.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>

          {/* Grade Filter */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-700"
          >
            <option value="all">{isKhmer ? 'គ្រប់បន្ទុកថ្នាក់' : 'All Homerooms'}</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title={isKhmer ? 'ទម្រង់កាត' : 'Grid View'}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title={isKhmer ? 'ទម្រង់តារាង' : 'Table View'}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Teachers Directory: Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeachers.map((teacher) => {
            const homeroom = classes.find((c) => c.id === teacher.homeroomGradeId);
            return (
              <div
                key={teacher.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
              >
                {/* Header card with avatar & subject badge */}
                <div className="p-5 pb-3">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={
                        teacher.avatarUrl ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                      }
                      alt={teacher.nameKhmer}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 truncate">
                          {teacher.subject}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                            teacher.status === 'leave'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {teacher.status === 'leave' ? (isKhmer ? 'សម្រាក' : 'Leave') : (isKhmer ? 'សកម្ម' : 'Active')}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1 truncate group-hover:text-blue-600 transition-colors">
                        {teacher.nameKhmer}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono truncate">{teacher.nameLatin}</p>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="px-5 py-3 space-y-2 text-xs text-slate-600 border-t border-slate-100 bg-slate-50/40 flex-1">
                  <div className="flex items-center gap-2">
                    <School className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>
                      {isKhmer ? 'បន្ទុកថ្នាក់:' : 'Homeroom:'}{' '}
                      <strong className="text-slate-800 font-medium">
                        {homeroom ? `${homeroom.name}` : isKhmer ? 'គ្មាន' : 'None'}
                      </strong>
                    </span>
                  </div>

                  {teacher.qualification && (
                    <div className="flex items-center gap-2 truncate">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{teacher.qualification}</span>
                    </div>
                  )}

                  {teacher.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-mono">{teacher.phone}</span>
                    </div>
                  )}

                  {teacher.email && (
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-slate-500 truncate">{teacher.email}</span>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between gap-1">
                  <button
                    onClick={() => setViewingTeacher(teacher)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isKhmer ? 'មើលប្រវត្តិរូប' : 'Profile'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenSelfEdit(teacher)}
                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title={isKhmer ? 'កែប្រែប្រវត្តិរូប' : 'Edit Profile'}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(teacher.id, teacher.nameKhmer)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title={isKhmer ? 'លុប' : 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Teachers Directory: Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                <tr>
                  <th className="px-4 py-3">{isKhmer ? 'គ្រូបង្រៀន' : 'Teacher'}</th>
                  <th className="px-4 py-3">{isKhmer ? 'មុខវិជ្ជា' : 'Subject'}</th>
                  <th className="px-4 py-3">{isKhmer ? 'បន្ទុកថ្នាក់' : 'Homeroom'}</th>
                  <th className="px-4 py-3">{isKhmer ? 'កម្រិតវប្បធម៌' : 'Qualification'}</th>
                  <th className="px-4 py-3">{isKhmer ? 'ទំនាក់ទំនង' : 'Contact'}</th>
                  <th className="px-4 py-3 text-right">{isKhmer ? 'សកម្មភាព' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeachers.map((teacher) => {
                  const homeroom = classes.find((c) => c.id === teacher.homeroomGradeId);
                  return (
                    <tr key={teacher.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              teacher.avatarUrl ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                            }
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{teacher.nameKhmer}</div>
                            <div className="text-xs text-slate-400 font-mono">{teacher.nameLatin}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium text-xs">
                          {teacher.subject}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {homeroom ? homeroom.name : isKhmer ? 'គ្មាន' : '-'}
                      </td>
                      <td className="px-4 py-3 text-slate-600 truncate max-w-xs">
                        {teacher.qualification || '-'}
                      </td>
                      <td className="px-4 py-3 text-xs space-y-0.5">
                        <div className="font-mono text-slate-800">{teacher.phone || '-'}</div>
                        <div className="font-mono text-slate-400 truncate max-w-[140px]">{teacher.email || '-'}</div>
                      </td>
                      <td className="px-4 py-3 text-right space-x-1">
                        <button
                          onClick={() => setViewingTeacher(teacher)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title={isKhmer ? 'មើលប្រវត្តិរូប' : 'Profile'}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenSelfEdit(teacher)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title={isKhmer ? 'កែប្រែប្រវត្តិរូប' : 'Edit Profile'}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(teacher.id, teacher.nameKhmer)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title={isKhmer ? 'លុប' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredTeachers.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {isKhmer ? 'មិនមានទិន្នន័យគ្រូបង្រៀនឡើយ' : 'No Teachers Found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {isKhmer
              ? 'ពុំមានគ្រូបង្រៀនដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ។ សូមចុចប៊ូតុង "បន្ថែមគ្រូបង្រៀនថ្មី" ដើម្បីបញ្ចូលប្រវត្តិរូប។'
              : 'No teachers match your search filter. Click "Add New Teacher" to register a faculty member.'}
          </p>
          <button
            onClick={() => {
              setEditingTeacher(null);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-sm hover:bg-blue-700 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isKhmer ? 'បន្ថែមគ្រូបង្រៀនថ្មី' : 'Add New Teacher'}</span>
          </button>
        </div>
      )}

      {/* Dedicated Teacher Self-Edit Profile Modal */}
      {selfEditingTeacher && (
        <TeacherSelfEditModal
          isOpen={isSelfEditModalOpen}
          onClose={() => {
            setIsSelfEditModalOpen(false);
            setSelfEditingTeacher(null);
          }}
          teacher={selfEditingTeacher}
          classes={classes}
          onSave={handleSaveSelfEdit}
          lang={lang}
        />
      )}

      {/* Add / Edit Teacher Modal */}
      <TeacherModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTeacher(null);
        }}
        onSave={handleSaveModal}
        initialTeacher={editingTeacher}
        classes={classes}
        lang={lang}
      />

      {/* View Teacher Profile Modal */}
      <TeacherProfileModal
        teacher={viewingTeacher}
        classes={classes}
        timetableSlots={timetableSlots}
        isOpen={Boolean(viewingTeacher)}
        onClose={() => setViewingTeacher(null)}
        onEdit={(t) => {
          setViewingTeacher(null);
          handleOpenSelfEdit(t);
        }}
        lang={lang}
      />
    </div>
  );
};
