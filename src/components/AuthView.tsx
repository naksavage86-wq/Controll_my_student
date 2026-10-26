import React, { useState } from 'react';
import {
  GraduationCap,
  Lock,
  User,
  Mail,
  Phone,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  ShieldCheck,
  School,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { UserAccount, UserRole, GradeClass } from '../types';
import { Language } from '../utils/i18n';
import { SCHOOL_INFO } from '../data/mockData';

interface AuthViewProps {
  users: UserAccount[];
  onLogin: (user: UserAccount) => void;
  onRegister: (newUser: UserAccount) => void;
  classes: GradeClass[];
  lang: Language;
}

export const AuthView: React.FC<AuthViewProps> = ({
  users,
  onLogin,
  onRegister,
  classes,
  lang,
}) => {
  const isKhmer = lang === 'km';
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('teacher');
  const [regAssignedGrade, setRegAssignedGrade] = useState('');
  const [regError, setRegError] = useState('');

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const trimmedUser = loginUsername.trim().toLowerCase();
    const found = users.find(
      (u) =>
        (u.username.toLowerCase() === trimmedUser || u.email.toLowerCase() === trimmedUser) &&
        u.password === loginPassword
    );

    if (found) {
      onLogin(found);
    } else {
      setLoginError(
        isKhmer
          ? 'ឈ្មោះគណនី ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវឡើយ! សូមពិនិត្យម្តងទៀត។'
          : 'Invalid username/email or password! Please check again.'
      );
    }
  };

  // Quick One-Click Login
  const handleQuickLogin = (role: UserRole) => {
    const found = users.find((u) => u.role === role) || users[0];
    if (found) {
      onLogin(found);
    }
  };

  // Handle Register submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regUsername.trim() || !regPassword) {
      setRegError(isKhmer ? 'សូមបំពេញព័ត៌មានចាំបាច់ទាំងអស់' : 'Please fill all required fields');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError(isKhmer ? 'ពាក្យសម្ងាត់ទាំងពីរមិនដូចគ្នាទេ!' : 'Passwords do not match!');
      return;
    }

    if (regPassword.length < 4) {
      setRegError(isKhmer ? 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៤ តួអក្សរ' : 'Password must be at least 4 characters');
      return;
    }

    const usernameExists = users.some(
      (u) => u.username.toLowerCase() === regUsername.trim().toLowerCase()
    );
    if (usernameExists) {
      setRegError(isKhmer ? 'ឈ្មោះគណនីនេះត្រូវបានប្រើប្រាស់រួចហើយ!' : 'Username is already registered!');
      return;
    }

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      name: regName.trim(),
      username: regUsername.trim().toLowerCase(),
      email: regEmail.trim() || `${regUsername.trim().toLowerCase()}@school.edu.kh`,
      phone: regPhone.trim(),
      password: regPassword,
      role: regRole,
      assignedGradeId: regAssignedGrade || undefined,
      avatarUrl:
        regRole === 'admin'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
          : regRole === 'teacher'
          ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
    };

    onRegister(newUser);
    onLogin(newUser);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Brand Banner Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 px-6 sm:px-8 py-8 text-white text-center relative">
          <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mx-auto mb-3.5 shadow-lg border border-white/20">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {isKhmer ? 'ប្រព័ន្ធគ្រប់គ្រងសាលារៀន' : 'School Management System'}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 flex items-center justify-center gap-1.5 font-medium">
            <School className="w-3.5 h-3.5" />
            <span>{SCHOOL_INFO.nameKhmer}</span>
            <span className="opacity-50">|</span>
            <span>ឆ្នាំសិក្សា {SCHOOL_INFO.academicYear}</span>
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs text-white/90 font-mono mt-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isKhmer ? 'ចូលប្រើប្រាស់រួមគ្នា (Multi-User Portal)' : 'Shared Multi-User Access'}</span>
          </div>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 p-1.5 gap-1.5">
          <button
            onClick={() => {
              setActiveTab('login');
              setLoginError('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>{isKhmer ? 'ចូលប្រើប្រាស់ (Login)' : 'Log In'}</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setRegError('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>{isKhmer ? 'ចុះឈ្មោះគណនីថ្មី (Register)' : 'Register Account'}</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8">
          {activeTab === 'login' && (
            <div className="space-y-6">
              {/* Quick Demo Login Cards */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                  {isKhmer ? 'ចូលរហ័សដោយមិនបាច់វាយពាក្យសម្ងាត់ (Quick Demo Access):' : 'One-Click Quick Access:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin')}
                    className="p-3 rounded-xl border border-blue-200/80 bg-blue-50/50 hover:bg-blue-100/70 hover:border-blue-400 text-left transition-all group cursor-pointer"
                  >
                    <div className="text-xs font-bold text-blue-900 flex items-center justify-between">
                      <span>{isKhmer ? 'នាយកសាលា' : 'Principal'}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div className="text-[11px] text-blue-700 font-mono mt-0.5">Admin Full</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('teacher')}
                    className="p-3 rounded-xl border border-indigo-200/80 bg-indigo-50/50 hover:bg-indigo-100/70 hover:border-indigo-400 text-left transition-all group cursor-pointer"
                  >
                    <div className="text-xs font-bold text-indigo-900 flex items-center justify-between">
                      <span>{isKhmer ? 'គ្រូបង្រៀន' : 'Teacher'}</span>
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <div className="text-[11px] text-indigo-700 font-mono mt-0.5">សេង វិបុល (7A)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('staff')}
                    className="p-3 rounded-xl border border-emerald-200/80 bg-emerald-50/50 hover:bg-emerald-100/70 hover:border-emerald-400 text-left transition-all group cursor-pointer"
                  >
                    <div className="text-xs font-bold text-emerald-900 flex items-center justify-between">
                      <span>{isKhmer ? 'បុគ្គលិក' : 'Staff'}</span>
                      <User className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="text-[11px] text-emerald-700 font-mono mt-0.5">គណនេយ្យករ</div>
                  </button>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="flex-grow border-t border-slate-200" />
                <span className="flex-shrink mx-3 text-xs text-slate-400 uppercase font-medium">
                  {isKhmer ? 'ឬចូលដោយប្រើគណនីផ្ទាល់ខ្លួន' : 'Or with credentials'}
                </span>
                <div className="flex-grow border-t border-slate-200" />
              </div>

              {/* Login Error */}
              {loginError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Standard Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isKhmer ? 'ឈ្មោះគណនី ឬអ៊ីមែល' : 'Username or Email'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder={isKhmer ? 'e.g. admin ឬ teacher' : 'admin or teacher'}
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isKhmer ? 'ពាក្យសម្ងាត់' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {isKhmer ? 'គណនីគំរូ: admin/admin, teacher/teacher123, staff/staff123' : 'Sample: admin/admin, teacher/teacher123'}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isKhmer ? 'ចូលក្នុងប្រព័ន្ធ' : 'Log In to System'}</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {regError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isKhmer ? 'ឈ្មោះពេញ' : 'Full Name'} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder={isKhmer ? 'e.g. លោកគ្រូ ហេង សំណាង' : 'e.g. Heng Samnang'}
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isKhmer ? 'ឈ្មោះគណនី (Username)' : 'Username'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. teacher.samnang"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isKhmer ? 'តួនាទី (Role)' : 'Role'}
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="teacher">{isKhmer ? 'គ្រូបង្រៀន (Teacher)' : 'Teacher'}</option>
                    <option value="admin">{isKhmer ? 'នាយកសាលា/រដ្ឋបាល (Admin)' : 'Administrator'}</option>
                    <option value="staff">{isKhmer ? 'បុគ្គលិកគណនេយ្យ (Staff)' : 'Staff'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isKhmer ? 'លេខទូរស័ព្ទ' : 'Phone Number'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="012 345 678"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isKhmer ? 'អ៊ីមែល' : 'Email'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      placeholder="name@school.edu.kh"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {regRole === 'teacher' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isKhmer ? 'ថ្នាក់បន្ទុក (បើមាន)' : 'Assigned Class'}
                  </label>
                  <select
                    value={regAssignedGrade}
                    onChange={(e) => setRegAssignedGrade(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">{isKhmer ? '-- គ្មាន (គ្រូបង្រៀនទូទៅ) --' : '-- None --'}</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isKhmer ? 'ពាក្យសម្ងាត់' : 'Password'} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isKhmer ? 'ផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់' : 'Confirm Password'} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer mt-3"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isKhmer ? 'ចុះឈ្មោះ និងចូលប្រើប្រាស់' : 'Register & Enter'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 text-center text-xs text-slate-500">
          <span>{SCHOOL_INFO.nameKhmer}</span> • <span className="font-mono">v2.5 Shared Multi-User System</span>
        </div>
      </div>
    </div>
  );
};
