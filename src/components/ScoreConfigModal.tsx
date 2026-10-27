import React, { useState, useEffect } from 'react';
import {
  X,
  Sliders,
  Settings2,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Award,
  Info,
  BookOpen,
  ArrowRight,
  Save,
  Check,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Eye,
  EyeOff,
  Filter,
} from 'lucide-react';
import { Subject, GradeClass } from '../types';
import { Language } from '../utils/i18n';
import { DEFAULT_SUBJECTS, calculateMaxPossibleTotal } from '../utils/academic';

interface ScoreConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentClass?: GradeClass;
  classes?: GradeClass[];
  currentSubjects: Subject[];
  onSaveSubjects: (updatedSubjects: Subject[], applyToAllClasses: boolean) => void;
  lang: Language;
}

export const ScoreConfigModal: React.FC<ScoreConfigModalProps> = ({
  isOpen,
  onClose,
  currentClass,
  classes,
  currentSubjects,
  onSaveSubjects,
  lang,
}) => {
  const isKhmer = lang === 'km';

  // Merge with DEFAULT_SUBJECTS to ensure all standard subjects are available even if previously missing
  const initializeSubjects = (): Subject[] => {
    const existingMap = new Map<string, Subject>();
    currentSubjects.forEach((s) => existingMap.set(s.id, s));

    // Combine standard subjects with any custom subjects
    const merged: Subject[] = [];
    DEFAULT_SUBJECTS.forEach((def) => {
      if (existingMap.has(def.id)) {
        merged.push({ ...def, ...existingMap.get(def.id) });
        existingMap.delete(def.id);
      } else {
        merged.push({ ...def, isActive: false });
      }
    });

    // Add remaining custom subjects
    existingMap.forEach((cust) => {
      merged.push(cust);
    });

    return merged;
  };

  const [subjects, setSubjects] = useState<Subject[]>(initializeSubjects);
  const [applyToAll, setApplyToAll] = useState(false);
  const [customBulkMax, setCustomBulkMax] = useState<string>('50');
  const [saveToast, setSaveToast] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // New subject form state
  const [newKhmerName, setNewKhmerName] = useState('');
  const [newEnglishName, setNewEnglishName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newCoefficient, setNewCoefficient] = useState(1);
  const [newMaxScore, setNewMaxScore] = useState(100);

  useEffect(() => {
    setSubjects(initializeSubjects());
  }, [currentSubjects, isOpen]);

  if (!isOpen) return null;

  // Toggle active/inactive for a subject
  const handleToggleSubject = (id: string) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const currentActive = s.isActive !== false;
        return {
          ...s,
          isActive: !currentActive,
        };
      })
    );
  };

  // Handle single subject field change
  const handleChangeSubject = (id: string, field: 'coefficient' | 'maxScore', val: number) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        return {
          ...s,
          [field]: Math.max(1, Math.round(val)),
        };
      })
    );
  };

  // Quick preset applied to all active subjects
  const handleApplyPresetMax = (maxVal: number) => {
    setSubjects((prev) =>
      prev.map((s) => ({
        ...s,
        maxScore: maxVal,
      }))
    );
  };

  // Presets for Curriculum Tracks
  const handleApplyTrackPreset = (track: 'all' | 'science' | 'social' | 'core') => {
    if (track === 'all') {
      setSubjects((prev) =>
        prev.map((s) => ({
          ...s,
          isActive: true,
        }))
      );
    } else if (track === 'science') {
      // Science Track: Math, Phys, Chem, Bio, Earth, Khmer, English
      setSubjects((prev) =>
        prev.map((s) => {
          if (['math', 'phys', 'chem', 'bio', 'earth', 'khmer', 'english'].includes(s.id)) {
            const coef = s.id === 'math' ? 3 : ['phys', 'chem', 'bio', 'khmer'].includes(s.id) ? 2 : 1;
            return { ...s, isActive: true, coefficient: coef };
          }
          return { ...s, isActive: false };
        })
      );
    } else if (track === 'social') {
      // Social Track: Khmer, Math, History, Geo, Civics, English
      setSubjects((prev) =>
        prev.map((s) => {
          if (['khmer', 'math', 'history', 'geo', 'civics', 'english'].includes(s.id)) {
            const coef = s.id === 'khmer' ? 3 : ['history', 'geo', 'civics', 'math'].includes(s.id) ? 2 : 1;
            return { ...s, isActive: true, coefficient: coef };
          }
          return { ...s, isActive: false };
        })
      );
    } else if (track === 'core') {
      // Basic 5 Core subjects: Khmer, Math, Science/Phys, English, Civics
      setSubjects((prev) =>
        prev.map((s) => {
          if (['khmer', 'math', 'phys', 'english', 'civics'].includes(s.id)) {
            return { ...s, isActive: true };
          }
          return { ...s, isActive: false };
        })
      );
    }
  };

  // Reset to Ministry standard
  const handleResetMinistry = () => {
    setSubjects(DEFAULT_SUBJECTS);
  };

  // Add custom subject
  const handleAddCustomSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKhmerName.trim()) return;

    const customId = `custom_${Date.now()}`;
    const newSubject: Subject = {
      id: customId,
      khmerName: newKhmerName.trim(),
      englishName: newEnglishName.trim() || newKhmerName.trim(),
      code: newCode.trim().toUpperCase() || 'SUB',
      coefficient: Math.max(1, newCoefficient),
      maxScore: Math.max(1, newMaxScore),
      isActive: true,
    };

    setSubjects((prev) => [...prev, newSubject]);
    setNewKhmerName('');
    setNewEnglishName('');
    setNewCode('');
    setNewCoefficient(1);
    setNewMaxScore(100);
    setShowAddForm(false);
  };

  // Delete custom subject
  const handleDeleteCustomSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  // Calculate stats considering ONLY active subjects
  const activeSubjects = subjects.filter((s) => s.isActive !== false);
  const totalCoefficients = activeSubjects.reduce((acc, curr) => acc + (curr.coefficient || 1), 0);
  const maxPossibleTotal = calculateMaxPossibleTotal(subjects);
  const passingTotal = Math.round((maxPossibleTotal / 2) * 10) / 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSubjects(subjects, applyToAll);
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 p-5 sm:p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center ring-2 ring-white/30 shrink-0">
              <Sliders className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-100 text-xs font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {isKhmer
                    ? `កម្រិតថ្នាក់ ៖ ${currentClass?.name || 'ថ្នាក់ទូទៅ'}`
                    : `Class Level: ${currentClass?.name || 'General'}`}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                {isKhmer ? 'កំណត់មុខវិជ្ជារៀន ពិន្ទុពេញ & មេគុណ' : 'Configure Active Subjects, Max Scores & Coefficients'}
              </h2>
              <p className="text-xs text-blue-100/90 mt-0.5">
                {isKhmer
                  ? 'បើក/បិទមុខវិជ្ជាដែលរៀនក្នុងថ្នាក់នេះ កំណត់ពិន្ទុពេញ (Max Score) និងមេគុណតាមមុខវិជ្ជា'
                  : 'Toggle active subjects taught in this class, customize max score limit and coefficients'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Toast */}
        {saveToast && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold rounded-2xl flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              {isKhmer
                ? 'បានរក្សាទុកការកំណត់មុខវិជ្ជា និងពិន្ទុពេញដោយជោគជ័យ!'
                : 'Subject and max score configuration saved successfully!'}
            </span>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Track Presets & Quick Actions */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                <span>{isKhmer ? 'ជ្រើសរើសតាមកម្រិត ឬផ្នែកសិក្សា (Track Presets)' : 'Curriculum Track Presets'}</span>
              </span>
              <button
                type="button"
                onClick={handleResetMinistry}
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isKhmer ? 'កំណត់ឡើងវិញស្តង់ដារក្រសួង' : 'Reset to Standard'}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleApplyTrackPreset('all')}
                className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-800 hover:text-blue-700 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
              >
                {isKhmer ? '✓ រៀនទាំងអស់' : '✓ All Subjects'}
              </button>
              <button
                type="button"
                onClick={() => handleApplyTrackPreset('science')}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
              >
                🔬 {isKhmer ? 'ផ្នែកវិទ្យាសាស្ត្រពិត' : 'Science Track'}
              </button>
              <button
                type="button"
                onClick={() => handleApplyTrackPreset('social')}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
              >
                📚 {isKhmer ? 'ផ្នែកវិទ្យាសាស្ត្រសង្គម' : 'Social Science Track'}
              </button>
              <button
                type="button"
                onClick={() => handleApplyTrackPreset('core')}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
              >
                ⭐ {isKhmer ? 'មុខវិជ្ជាស្នូល ៥' : 'Core 5 Subjects'}
              </button>
            </div>

            {/* Quick Bulk Max Score */}
            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">
                {isKhmer ? 'ពិន្ទុពេញរួមរហ័ស:' : 'Quick Max Score:'}
              </span>
              <button
                type="button"
                onClick={() => handleApplyPresetMax(50)}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
              >
                {isKhmer ? '៥០' : '50'}
              </button>
              <button
                type="button"
                onClick={() => handleApplyPresetMax(60)}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
              >
                {isKhmer ? '៦០' : '60'}
              </button>
              <button
                type="button"
                onClick={() => handleApplyPresetMax(100)}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
              >
                {isKhmer ? '១០០' : '100'}
              </button>
              <button
                type="button"
                onClick={() => handleApplyPresetMax(20)}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
              >
                {isKhmer ? '២០ (ប្រឡងខែ)' : '20 (Monthly)'}
              </button>

              <div className="flex items-center gap-1.5 ml-auto">
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={customBulkMax}
                  onChange={(e) => setCustomBulkMax(e.target.value)}
                  className="w-16 px-2 py-1 text-xs font-bold border border-slate-300 rounded-lg text-center bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    const n = Number(customBulkMax) || 50;
                    handleApplyPresetMax(n);
                  }}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  {isKhmer ? 'អនុវត្ត' : 'Apply'}
                </button>
              </div>
            </div>
          </div>

          {/* Add Custom Subject Button & Form */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-600 font-medium flex items-center gap-2">
              <span className="font-bold text-slate-900">{activeSubjects.length}</span>
              <span>{isKhmer ? 'មុខវិជ្ជាត្រូវបានជ្រើសរើសរៀន' : 'active subjects selected'}</span>
              <span className="text-slate-400">({isKhmer ? 'នៃសរុប' : 'of'} {subjects.length})</span>
            </div>

            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isKhmer ? 'បន្ថែមមុខវិជ្ជាថ្មី' : 'Add Custom Subject'}</span>
            </button>
          </div>

          {/* Inline Add Subject Form */}
          {showAddForm && (
            <form
              onSubmit={handleAddCustomSubject}
              className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-3 animate-in fade-in"
            >
              <div className="text-xs font-bold text-blue-900 flex items-center justify-between">
                <span>{isKhmer ? 'ព័ត៌មានមុខវិជ្ជាថ្មី' : 'New Subject Details'}</span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {isKhmer ? 'ឈ្មោះមុខវិជ្ជា (ខ្មែរ)*' : 'Khmer Name*'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isKhmer ? 'ឧ. ភាសាបារាំង' : 'e.g. French'}
                    value={newKhmerName}
                    onChange={(e) => setNewKhmerName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {isKhmer ? 'ឈ្មោះឡាតាំង' : 'English Name'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. French"
                    value={newEnglishName}
                    onChange={(e) => setNewEnglishName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {isKhmer ? 'កូដកាត់' : 'Code'}
                  </label>
                  <input
                    type="text"
                    placeholder="FRE"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {isKhmer ? 'ពិន្ទុពេញ' : 'Max Score'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newMaxScore}
                    onChange={(e) => setNewMaxScore(Number(e.target.value) || 100)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-blue-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  {isKhmer ? 'បោះបង់' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer shadow-xs"
                >
                  {isKhmer ? 'បញ្ចូលមុខវិជ្ជា' : 'Add Subject'}
                </button>
              </div>
            </form>
          )}

          {/* Subjects Table with Active/Inactive Toggles */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-800 font-bold">
                    <th className="py-2.5 px-3 w-12 text-center">#</th>
                    <th className="py-2.5 px-3 w-32 text-center">
                      {isKhmer ? 'ស្ថានភាពរៀន' : 'Status'}
                    </th>
                    <th className="py-2.5 px-3">{isKhmer ? 'មុខវិជ្ជា' : 'Subject'}</th>
                    <th className="py-2.5 px-3 text-center w-24">
                      {isKhmer ? 'មេគុណ' : 'Coefficient'}
                    </th>
                    <th className="py-2.5 px-3 text-center w-36 bg-blue-50/70 text-blue-900">
                      {isKhmer ? 'ពិន្ទុពេញ (Max)' : 'Max Score'}
                    </th>
                    <th className="py-2.5 px-3 text-center w-28 text-slate-600">
                      {isKhmer ? 'ពិន្ទុជាប់ (>= 50%)' : 'Pass Mark'}
                    </th>
                    <th className="py-2.5 px-3 text-center w-28 font-mono text-indigo-900 bg-indigo-50/40">
                      {isKhmer ? 'ពិន្ទុពេញមេគុណ' : 'Weighted Max'}
                    </th>
                    <th className="py-2.5 px-2 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subjects.map((sub, idx) => {
                    const isActive = sub.isActive !== false;
                    const weightedMax = (sub.maxScore || 100) * (sub.coefficient || 1);
                    const passMark = Math.round(((sub.maxScore || 100) / 2) * 10) / 10;
                    const isCustom = sub.id.startsWith('custom_');

                    return (
                      <tr
                        key={sub.id}
                        className={`transition-colors ${
                          isActive
                            ? 'hover:bg-slate-50/70 bg-white'
                            : 'bg-slate-50/60 opacity-60'
                        }`}
                      >
                        {/* Index */}
                        <td className="py-2.5 px-3 text-center font-mono text-slate-400">
                          {idx + 1}
                        </td>

                        {/* Active / Inactive Toggle Switch */}
                        <td className="py-2 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleSubject(sub.id)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                              isActive
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300 border border-slate-300'
                            }`}
                            title={
                              isActive
                                ? isKhmer
                                  ? 'ចុចដើម្បីបិទមុខវិជ្ជានេះ (មិនរៀនក្នុងថ្នាក់នេះ)'
                                  : 'Click to disable (not studied)'
                                : isKhmer
                                ? 'ចុចដើម្បីបើកមុខវិជ្ជានេះ (រៀនក្នុងថ្នាក់នេះ)'
                                : 'Click to enable'
                            }
                          >
                            {isActive ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-700" />
                                <span>{isKhmer ? 'រៀន' : 'Active'}</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3 text-slate-500" />
                                <span>{isKhmer ? 'មិនរៀន' : 'Excluded'}</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Subject Details */}
                        <td className="py-2.5 px-3">
                          <div className={`font-bold ${isActive ? 'text-slate-900' : 'text-slate-500 line-through'}`}>
                            {sub.khmerName}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {sub.englishName} ({sub.code})
                          </div>
                        </td>

                        {/* Coefficient Input */}
                        <td className="py-2 px-3 text-center">
                          <input
                            type="number"
                            min="1"
                            max="10"
                            disabled={!isActive}
                            value={sub.coefficient}
                            onChange={(e) =>
                              handleChangeSubject(sub.id, 'coefficient', Number(e.target.value) || 1)
                            }
                            className={`w-16 text-center px-2 py-1.5 font-bold font-mono rounded-xl border transition-all ${
                              isActive
                                ? 'text-slate-900 bg-white border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                : 'text-slate-400 bg-slate-100 border-slate-200 cursor-not-allowed'
                            }`}
                          />
                        </td>

                        {/* Max Score Input */}
                        <td className="py-2 px-3 text-center bg-blue-50/20">
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="text-xs font-semibold text-blue-600 font-mono">/</span>
                            <input
                              type="number"
                              min="1"
                              max="1000"
                              required
                              disabled={!isActive}
                              value={sub.maxScore}
                              onChange={(e) =>
                                handleChangeSubject(sub.id, 'maxScore', Number(e.target.value) || 1)
                              }
                              className={`w-20 text-center px-2 py-1.5 font-bold font-mono rounded-xl border-2 transition-all ${
                                isActive
                                  ? 'text-blue-700 bg-white border-blue-400 shadow-2xs focus:border-blue-600 focus:ring-2 focus:ring-blue-200'
                                  : 'text-slate-400 bg-slate-100 border-slate-200 cursor-not-allowed'
                              }`}
                            />
                          </div>
                        </td>

                        {/* Passing mark */}
                        <td className="py-2.5 px-3 text-center font-mono text-slate-600 font-medium">
                          {isActive ? passMark : '—'}
                        </td>

                        {/* Weighted Max */}
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-indigo-700 bg-indigo-50/20">
                          {isActive ? weightedMax : '—'}
                        </td>

                        {/* Delete button for custom subjects */}
                        <td className="py-2 px-1 text-center">
                          {isCustom && (
                            <button
                              type="button"
                              onClick={() => handleDeleteCustomSubject(sub.id)}
                              className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title={isKhmer ? 'លុបមុខវិជ្ជានេះ' : 'Delete subject'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Statistics Summary Cards (Active Subjects Only) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-[11px] text-slate-500 font-medium">
                {isKhmer ? 'មុខវិជ្ជារៀនជាក់ស្តែង' : 'Active Subjects'}
              </div>
              <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                {activeSubjects.length} <span className="text-xs text-slate-400 font-normal">/ {subjects.length}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-[11px] text-slate-500 font-medium">
                {isKhmer ? 'មេគុណសរុប' : 'Total Coefficients'}
              </div>
              <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                x{totalCoefficients}
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200">
              <div className="text-[11px] text-blue-700 font-bold uppercase tracking-wider">
                {isKhmer ? 'ពិន្ទុពេញសរុប (Max Total)' : 'Max Weighted Total'}
              </div>
              <div className="text-xl font-black text-blue-900 font-mono mt-0.5">
                {maxPossibleTotal}
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <div className="text-[11px] text-emerald-700 font-bold uppercase tracking-wider">
                {isKhmer ? 'ពិន្ទុជាប់សរុប (>= 50%)' : 'Passing Mark Total'}
              </div>
              <div className="text-xl font-black text-emerald-900 font-mono mt-0.5">
                {passingTotal}
              </div>
            </div>
          </div>

          {/* Application Scope Options */}
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-2">
            <div className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-600" />
              <span>{isKhmer ? 'វិសាលភាពនៃការអនុវត្ត (Application Scope)' : 'Application Scope'}</span>
            </div>
            <div className="space-y-2 text-xs sm:text-sm">
              <label className="flex items-center gap-2.5 cursor-pointer text-slate-800">
                <input
                  type="radio"
                  name="config-scope"
                  checked={!applyToAll}
                  onChange={() => setApplyToAll(false)}
                  className="text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <span>
                  {isKhmer ? (
                    <span>
                      អនុវត្តចំពោះតែ <strong className="text-blue-700">{currentClass?.name || 'ថ្នាក់នេះ'}</strong> ប៉ុណ្ណោះ (ព្រោះថ្នាក់នីមួយៗអាចរៀនមុខវិជ្ជា និងពិន្ទុពេញខុសគ្នា)
                    </span>
                  ) : (
                    <span>Apply only to {currentClass?.name || 'this class'}</span>
                  )}
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-slate-800">
                <input
                  type="radio"
                  name="config-scope"
                  checked={applyToAll}
                  onChange={() => setApplyToAll(true)}
                  className="text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <span>
                  {isKhmer
                    ? 'អនុវត្តចំពោះគ្រប់ថ្នាក់ទាំងអស់ក្នុងសាលា (Apply to all classes)'
                    : 'Apply to all classes in the school'}
                </span>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              {isKhmer ? 'បោះបង់' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isKhmer ? 'រក្សាទុកការកំណត់មុខវិជ្ជា & ពិន្ទុពេញ' : 'Save Subject & Score Configuration'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
