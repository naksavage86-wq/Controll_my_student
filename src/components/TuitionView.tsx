import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Plus,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  DollarSign,
  Receipt,
  X,
  Edit2,
  Trash2,
  Settings,
  Layers,
  Save,
} from 'lucide-react';
import { Student, TuitionFee, GradeClass, ClassPricing } from '../types';
import { Language, translations } from '../utils/i18n';
import { formatSchoolFee } from '../utils/academic';
import { SCHOOL_INFO, INITIAL_PRICING } from '../data/mockData';

interface TuitionViewProps {
  students: Student[];
  classes: GradeClass[];
  tuitionFees: TuitionFee[];
  classPricing: Record<string, ClassPricing>;
  onAddFee: (fee: TuitionFee) => void;
  onUpdateFee: (fee: TuitionFee) => void;
  onDeleteFee: (feeId: string) => void;
  onUpdatePricing: (pricing: Record<string, ClassPricing>) => void;
  onBatchGenerateFees: (newFees: TuitionFee[]) => void;
  lang: Language;
}

export const TuitionView: React.FC<TuitionViewProps> = ({
  students,
  classes,
  tuitionFees,
  classPricing,
  onAddFee,
  onUpdateFee,
  onDeleteFee,
  onUpdatePricing,
  onBatchGenerateFees,
  lang,
}) => {
  const t = translations[lang];

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<TuitionFee | null>(null);
  const [editingFee, setEditingFee] = useState<TuitionFee | null>(null);

  // New or Edit Invoice Form state
  const [feeForm, setFeeForm] = useState<Partial<TuitionFee>>({
    studentId: students[0]?.id || '',
    invoiceNo: `INV-2025-${String(tuitionFees.length + 1001)}`,
    title: 'ថ្លៃសិក្សាប្រចាំខែវិច្ឆិកា ២០២៤',
    amount: 120,
    currency: 'USD',
    paidAmount: 0,
    dueDate: '2024-11-05',
    status: 'pending',
  });

  // Working copy for Pricing Settings modal
  const [tempPricing, setTempPricing] = useState<Record<string, ClassPricing>>(classPricing);

  // Batch invoicing state
  const [batchClassId, setBatchClassId] = useState<string>(classes[0]?.id || '7A');
  const [batchMonthTitle, setBatchMonthTitle] = useState<string>('ថ្លៃសិក្សាខែធ្នូ ២០២៤');
  const [batchDueDate, setBatchDueDate] = useState<string>('2024-12-05');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered tuition records
  const filteredFees = useMemo(() => {
    return tuitionFees.filter((f) => {
      if (statusFilter !== 'all' && f.status !== statusFilter) return false;
      if (searchQuery) {
        const student = students.find((s) => s.id === f.studentId);
        const matchName = student?.khmerName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCode = student?.code.toLowerCase().includes(searchQuery.toLowerCase());
        const matchInv = f.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchName && !matchCode && !matchInv) return false;
      }
      return true;
    });
  }, [tuitionFees, statusFilter, searchQuery, students]);

  // Totals
  const totalAmount = tuitionFees.reduce((a, b) => a + b.amount, 0);
  const totalPaid = tuitionFees.reduce((a, b) => a + b.paidAmount, 0);
  const totalPending = totalAmount - totalPaid;

  const handleOpenAdd = () => {
    setEditingFee(null);
    setFeeForm({
      studentId: students[0]?.id || '',
      invoiceNo: `INV-2025-${String(tuitionFees.length + 1001)}`,
      title: 'ថ្លៃសិក្សាប្រចាំខែវិច្ឆិកា ២០២៤',
      amount: classPricing['7A']?.monthlyFee || 120,
      currency: 'USD',
      paidAmount: 0,
      dueDate: '2024-11-05',
      status: 'pending',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (fee: TuitionFee) => {
    setEditingFee(fee);
    setFeeForm(fee);
    setIsAddModalOpen(true);
  };

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeForm.studentId || !feeForm.amount) return;

    if (editingFee) {
      // Update
      const updated: TuitionFee = {
        ...editingFee,
        ...feeForm,
        amount: Number(feeForm.amount),
        paidAmount: Number(feeForm.paidAmount || 0),
        status:
          Number(feeForm.paidAmount) >= Number(feeForm.amount)
            ? 'paid'
            : Number(feeForm.paidAmount) > 0
            ? 'partial'
            : 'pending',
      };
      onUpdateFee(updated);
      showToast(lang === 'km' ? 'បានកែសម្រួលវិក្កយបត្រដោយជោគជ័យ!' : 'Invoice updated!');
    } else {
      // Create new
      const record: TuitionFee = {
        id: `fee-${Date.now()}`,
        studentId: feeForm.studentId,
        invoiceNo: feeForm.invoiceNo || `INV-${Date.now()}`,
        title: feeForm.title || 'ថ្លៃសិក្សា',
        amount: Number(feeForm.amount),
        currency: 'USD',
        paidAmount: Number(feeForm.paidAmount || 0),
        dueDate: feeForm.dueDate || '2024-11-05',
        status:
          Number(feeForm.paidAmount) >= Number(feeForm.amount)
            ? 'paid'
            : Number(feeForm.paidAmount) > 0
            ? 'partial'
            : 'pending',
        paymentMethod: feeForm.paidAmount ? 'ABA Pay' : undefined,
        receiptNo: feeForm.paidAmount ? `REC-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
      };
      onAddFee(record);
      showToast(lang === 'km' ? 'បានចេញវិក្កយបត្រថ្មីដោយជោគជ័យ!' : 'New invoice created!');
    }
    setIsAddModalOpen(false);
  };

  const handleQuickPay = (fee: TuitionFee) => {
    const updated: TuitionFee = {
      ...fee,
      paidAmount: fee.amount,
      status: 'paid',
      paidDate: new Date().toISOString().slice(0, 10),
      paymentMethod: 'ABA Pay',
      receiptNo: fee.receiptNo || `REC-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    onUpdateFee(updated);
    showToast(lang === 'km' ? 'បានកត់ត្រាការបង់ប្រាក់ពេញលេញ!' : 'Payment recorded!');
  };

  // Save Pricing Settings
  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePricing(tempPricing);
    setIsPricingModalOpen(false);
    showToast(lang === 'km' ? 'បានរក្សាទុកតារាងតម្លៃសិក្សាថ្មី!' : 'Tuition pricing updated!');
  };

  // Batch generate invoices for class
  const handleBatchGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const classStudents = students.filter((s) => s.gradeId === batchClassId && s.status === 'active');
    const pricing = classPricing[batchClassId] || { monthlyFee: 120, currency: 'USD' };

    const newInvoices: TuitionFee[] = classStudents.map((s, idx) => ({
      id: `fee-batch-${Date.now()}-${s.id}`,
      studentId: s.id,
      invoiceNo: `INV-${batchClassId}-${Date.now().toString().slice(-4)}${idx + 1}`,
      title: batchMonthTitle,
      amount: pricing.monthlyFee,
      currency: 'USD',
      paidAmount: 0,
      dueDate: batchDueDate,
      status: 'pending',
    }));

    onBatchGenerateFees(newInvoices);
    setIsBatchModalOpen(false);
    showToast(
      lang === 'km'
        ? `បានចេញវិក្កយបត្រចំនួន ${newInvoices.length} សម្រាប់ថ្នាក់ ${batchClassId} រួចរាល់!`
        : `Generated ${newInvoices.length} invoices for grade ${batchClassId}!`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and Summary Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs no-print">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span>{t.tuition}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'km'
              ? 'កំណត់តម្លៃសិក្សា ចេញវិក្កយបត្រ តាមដានការបង់ប្រាក់ និងបោះពុម្ពបង្កាន់ដៃ'
              : 'Configure school fees, invoice students, track payments, and print receipts'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Configure Tuition Pricing button */}
          <button
            onClick={() => {
              setTempPricing(classPricing);
              setIsPricingModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4 text-blue-600" />
            <span>{lang === 'km' ? 'កំណត់តម្លៃសាលា' : 'Fee Settings'}</span>
          </button>

          {/* Batch invoice generator */}
          <button
            onClick={() => setIsBatchModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>{lang === 'km' ? 'ចេញវិក្កយបត្រទាំងថ្នាក់' : 'Batch Invoicing'}</span>
          </button>

          {/* New single invoice button */}
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-medium shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'km' ? 'ចេញវិក្កយបត្រថ្មី' : 'New Invoice'}</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-emerald-50 text-emerald-800 text-xs px-4 py-2.5 rounded-xl border border-emerald-200 flex items-center gap-2 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tuition Pricing Cards Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-sm no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span>{lang === 'km' ? 'តារាងតម្លៃសិក្សាស្តង់ដារតាមកម្រិតថ្នាក់ (School Tuition Rates)' : 'Standard Tuition Pricing'}</span>
            </h3>
            <p className="text-xs text-blue-200">
              {lang === 'km' ? 'តម្លៃសិក្សាប្រចាំខែត្រូវបានកំណត់តាមថ្នាក់នីមួយៗ' : 'Configured rates applied during monthly invoicing'}
            </p>
          </div>
          <button
            onClick={() => {
              setTempPricing(classPricing);
              setIsPricingModalOpen(true);
            }}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded-lg border border-white/20 transition-colors cursor-pointer"
          >
            {lang === 'km' ? 'កែប្រែតម្លៃ ✏️' : 'Edit Rates ✏️'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {classes.map((c) => {
            const pricing = classPricing[c.id] || { monthlyFee: 120, currency: 'USD' };
            return (
              <div key={c.id} className="bg-white/10 p-3.5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-white">{c.name}</span>
                  <span className="text-xs text-blue-200 font-medium">/ {lang === 'km' ? 'ខែ' : 'mo'}</span>
                </div>
                <div className="text-2xl font-bold text-amber-300 font-mono">
                  ${pricing.monthlyFee}
                </div>
                <div className="text-[11px] text-blue-200 mt-1 flex justify-between">
                  <span>{lang === 'km' ? 'សម្ភារៈ' : 'Materials'}: ${pricing.materialFee || 0}</span>
                  <span>{lang === 'km' ? 'ចុះឈ្មោះ' : 'Registration'}: ${pricing.registrationFee || 0}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Financial KPI stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 no-print">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">{lang === 'km' ? 'ចំនួនវិក្កយបត្រសរុប' : 'Total Invoiced'}</div>
          <div className="text-2xl font-bold text-slate-900">${totalAmount}</div>
          <div className="text-xs text-slate-400 mt-1">{tuitionFees.length} {lang === 'km' ? 'ប្រតិបត្តិការ' : 'transactions'}</div>
        </div>

        <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/80 shadow-xs">
          <div className="text-xs text-emerald-700 mb-1">{lang === 'km' ? 'ប្រាក់បានទទួល (Paid)' : 'Total Received'}</div>
          <div className="text-2xl font-bold text-emerald-800">${totalPaid}</div>
          <div className="text-xs text-emerald-600 mt-1">
            {totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0}% {lang === 'km' ? 'ប្រមូលបាន' : 'collected'}
          </div>
        </div>

        <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 shadow-xs">
          <div className="text-xs text-amber-700 mb-1">{lang === 'km' ? 'នៅជំពាក់ / ហួសកំណត់' : 'Pending & Overdue'}</div>
          <div className="text-2xl font-bold text-amber-800">${totalPending}</div>
          <div className="text-xs text-amber-600 mt-1">
            {tuitionFees.filter((f) => f.status === 'overdue').length} {lang === 'km' ? 'ហួសកាលកំណត់' : 'overdue'}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3 no-print">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={lang === 'km' ? 'ស្វែងរកឈ្មោះសិស្ស អត្តលេខ ឬលេខវិក្កយបត្រ...' : 'Search student, ID, invoice #...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white font-medium"
          >
            <option value="all">{lang === 'km' ? 'ស្ថានភាពទាំងអស់' : 'All Status'}</option>
            <option value="paid">{t.paid}</option>
            <option value="partial">{lang === 'km' ? 'បង់ខ្លះ' : 'Partial'}</option>
            <option value="pending">{t.pending}</option>
            <option value="overdue">{t.overdue}</option>
          </select>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                <th className="py-3 px-4">{t.invoiceNo}</th>
                <th className="py-3 px-4">{lang === 'km' ? 'សិស្ស' : 'Student'}</th>
                <th className="py-3 px-4">{lang === 'km' ? 'ការពិពណ៌នា' : 'Description'}</th>
                <th className="py-3 px-3 text-right">{t.amount}</th>
                <th className="py-3 px-3 text-right">{lang === 'km' ? 'បានបង់' : 'Paid'}</th>
                <th className="py-3 px-4 text-center">{t.status}</th>
                <th className="py-3 px-4 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFees.map((fee) => {
                const student = students.find((s) => s.id === fee.studentId);

                return (
                  <tr key={fee.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {fee.invoiceNo}
                      <div className="text-[11px] text-slate-400 font-sans">កំណត់: {fee.dueDate}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{student?.khmerName || '—'}</div>
                      <div className="text-xs text-slate-500 font-mono">{student?.code} • {student?.gradeId}</div>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-700">
                      {fee.title}
                      {fee.paymentMethod && (
                        <span className="ml-2 px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                          {fee.paymentMethod}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono">
                      ${fee.amount}
                    </td>

                    <td className="py-3 px-3 text-right font-bold font-mono text-emerald-700">
                      ${fee.paidAmount}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          fee.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : fee.status === 'partial'
                            ? 'bg-blue-100 text-blue-800'
                            : fee.status === 'overdue'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {fee.status === 'paid'
                          ? t.paid
                          : fee.status === 'partial'
                          ? (lang === 'km' ? 'បង់ខ្លះ' : 'Partial')
                          : fee.status === 'overdue'
                          ? t.overdue
                          : t.pending}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {fee.status !== 'paid' && (
                          <button
                            onClick={() => handleQuickPay(fee)}
                            className="px-2.5 py-1 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
                          >
                            {lang === 'km' ? 'កត់ត្រាបង់' : 'Pay'}
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedReceipt(fee)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Print Receipt"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(fee)}
                          className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Invoice"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(lang === 'km' ? 'តើអ្នកប្រាកដថាចង់លុបវិក្កយបត្រនេះទេ?' : 'Delete invoice?')) {
                              onDeleteFee(fee.id);
                            }
                          }}
                          className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Invoice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Add or Edit Invoice */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingFee
                  ? (lang === 'km' ? 'កែសម្រួលវិក្កយបត្រ' : 'Edit Fee Invoice')
                  : (lang === 'km' ? 'ចេញវិក្កយបត្រថ្មី' : 'Create Fee Invoice')}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveInvoice} className="p-5 space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{lang === 'km' ? 'ជ្រើសរើសសិស្ស' : 'Select Student'} *</label>
                <select
                  value={feeForm.studentId}
                  onChange={(e) => {
                    const st = students.find((s) => s.id === e.target.value);
                    const defaultFee = st ? classPricing[st.gradeId]?.monthlyFee || 120 : 120;
                    setFeeForm({ ...feeForm, studentId: e.target.value, amount: defaultFee });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-lg"
                  disabled={Boolean(editingFee)}
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.khmerName} ({s.code} - {s.gradeId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{lang === 'km' ? 'ចំណងជើងវិក្កយបត្រ' : 'Invoice Title'} *</label>
                <input
                  type="text"
                  value={feeForm.title}
                  onChange={(e) => setFeeForm({ ...feeForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.amount} ($) *</label>
                  <input
                    type="number"
                    value={feeForm.amount}
                    onChange={(e) => setFeeForm({ ...feeForm, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{lang === 'km' ? 'បានបង់ ($)' : 'Paid ($)'}</label>
                  <input
                    type="number"
                    value={feeForm.paidAmount}
                    onChange={(e) => setFeeForm({ ...feeForm, paidAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg font-mono font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{lang === 'km' ? 'កាលបរិច្ឆេទកំណត់បង់' : 'Due Date'} *</label>
                <input
                  type="date"
                  value={feeForm.dueDate}
                  onChange={(e) => setFeeForm({ ...feeForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg text-xs font-medium cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Edit Class Pricing Settings */}
      {isPricingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-600" />
                <span>{lang === 'km' ? 'កំណត់តម្លៃសិក្សាស្តង់ដារតាមកម្រិតថ្នាក់' : 'Configure Class Tuition Rates'}</span>
              </h3>
              <button onClick={() => setIsPricingModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSavePricing} className="p-5 space-y-4 text-xs sm:text-sm">
              <p className="text-xs text-slate-500">
                {lang === 'km'
                  ? 'កំណត់តម្លៃថ្លៃសិក្សាប្រចាំខែ ថ្លៃសម្ភារៈ និងថ្លៃចុះឈ្មោះសម្រាប់ថ្នាក់នីមួយៗ'
                  : 'Set standard monthly tuition, materials, and registration fees for each grade level'}
              </p>

              <div className="space-y-3">
                {classes.map((c) => {
                  const current = tempPricing[c.id] || { gradeId: c.id, monthlyFee: 120, currency: 'USD', materialFee: 30, registrationFee: 20 };
                  return (
                    <div key={c.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                      <div className="font-bold text-slate-900 text-sm">{c.name}</div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                            {lang === 'km' ? 'ថ្លៃប្រចាំខែ ($)' : 'Monthly ($)'} *
                          </label>
                          <input
                            type="number"
                            value={current.monthlyFee}
                            onChange={(e) =>
                              setTempPricing({
                                ...tempPricing,
                                [c.id]: { ...current, monthlyFee: Number(e.target.value) },
                              })
                            }
                            className="w-full px-2.5 py-1.5 bg-white border rounded-lg font-mono font-bold"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                            {lang === 'km' ? 'សម្ភារៈ ($)' : 'Materials ($)'}
                          </label>
                          <input
                            type="number"
                            value={current.materialFee || 0}
                            onChange={(e) =>
                              setTempPricing({
                                ...tempPricing,
                                [c.id]: { ...current, materialFee: Number(e.target.value) },
                              })
                            }
                            className="w-full px-2.5 py-1.5 bg-white border rounded-lg font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                            {lang === 'km' ? 'ចុះឈ្មោះ ($)' : 'Registration ($)'}
                          </label>
                          <input
                            type="number"
                            value={current.registrationFee || 0}
                            onChange={(e) =>
                              setTempPricing({
                                ...tempPricing,
                                [c.id]: { ...current, registrationFee: Number(e.target.value) },
                              })
                            }
                            className="w-full px-2.5 py-1.5 bg-white border rounded-lg font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsPricingModalOpen(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg text-xs font-medium cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{t.save}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Batch Class Invoicing */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>{lang === 'km' ? 'ចេញវិក្កយបត្រប្រចាំខែសម្រាប់ថ្នាក់ទាំងមូល' : 'Batch Class Invoicing'}</span>
              </h3>
              <button onClick={() => setIsBatchModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleBatchGenerate} className="p-5 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{lang === 'km' ? 'ជ្រើសរើសថ្នាក់' : 'Select Class'} *</label>
                <select
                  value={batchClassId}
                  onChange={(e) => setBatchClassId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-lg font-medium"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (តម្លៃ ${classPricing[c.id]?.monthlyFee || 120}/ខែ)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{lang === 'km' ? 'ចំណងជើងវិក្កយបត្រ' : 'Invoice Title'} *</label>
                <input
                  type="text"
                  value={batchMonthTitle}
                  onChange={(e) => setBatchMonthTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{lang === 'km' ? 'កាលបរិច្ឆេទកំណត់បង់' : 'Due Date'} *</label>
                <input
                  type="date"
                  value={batchDueDate}
                  onChange={(e) => setBatchDueDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="p-3 bg-blue-50 text-blue-900 rounded-xl text-xs">
                {lang === 'km'
                  ? `ប្រព័ន្ធនឹងបង្កើតវិក្កយបត្រស្វ័យប្រវត្តិតាមតម្លៃ $${classPricing[batchClassId]?.monthlyFee || 120} សម្រាប់សិស្សសកម្មទាំងអស់ក្នុងថ្នាក់នេះ។`
                  : `Invoices will be automatically created using the standard rate of $${classPricing[batchClassId]?.monthlyFee || 120} for all enrolled students.`}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsBatchModalOpen(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg text-xs font-medium cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  {lang === 'km' ? 'បង្កើតវិក្កយបត្រភ្លាម' : 'Generate Invoices'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-300 overflow-hidden">
            <div className="no-print p-4 bg-slate-50 border-b flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">
                {lang === 'km' ? 'បង្កាន់ដៃបង់ប្រាក់ផ្លូវការ' : 'Official Payment Receipt'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t.print}</span>
                </button>
                <button onClick={() => setSelectedReceipt(null)} className="p-1 text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Receipt Sheet */}
            <div className="p-6 text-slate-900 text-xs sm:text-sm">
              <div className="text-center border-b pb-4 mb-4">
                <h4 className="font-moul text-sm text-slate-900">{SCHOOL_INFO.nameKhmer}</h4>
                <p className="text-[11px] text-slate-500 font-sans">{SCHOOL_INFO.nameEnglish}</p>
                <h3 className="font-bold text-base mt-2 text-blue-900">
                  បង្កាន់ដៃទទួលប្រាក់ / OFFICIAL RECEIPT
                </h3>
                <p className="font-mono text-xs text-slate-600 mt-0.5">
                  លេខបង្កាន់ដៃ / No: {selectedReceipt.receiptNo || 'REC-0982'}
                </p>
              </div>

              {(() => {
                const student = students.find((s) => s.id === selectedReceipt.studentId);
                return (
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">ឈ្មោះសិស្ស (Student):</span>
                      <span className="font-bold text-slate-900">{student?.khmerName} ({student?.latinName})</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">អត្តលេខ (Student ID):</span>
                      <span className="font-mono font-bold text-blue-700">{student?.code}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">ថ្នាក់រៀន (Grade):</span>
                      <span className="font-bold text-slate-800">{student?.gradeId}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">ការពិពណ៌នា (Details):</span>
                      <span className="font-medium text-slate-800">{selectedReceipt.title}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">វិធីទូទាត់ (Payment Method):</span>
                      <span className="font-medium text-slate-800">{selectedReceipt.paymentMethod || 'ABA Pay'}</span>
                    </div>
                    <div className="flex justify-between py-2 bg-emerald-50 px-3 rounded-lg border border-emerald-200">
                      <span className="font-bold text-emerald-900">ទឹកប្រាក់បានបង់ (Amount Paid):</span>
                      <span className="font-mono font-bold text-base text-emerald-700">${selectedReceipt.paidAmount}</span>
                    </div>

                    <div className="pt-6 grid grid-cols-2 text-center text-[11px] text-slate-600">
                      <div>
                        <p>ហត្ថលេខាអ្នកបង់ប្រាក់</p>
                        <div className="h-12" />
                        <p className="font-medium">{student?.parentName}</p>
                      </div>
                      <div>
                        <p>ហត្ថលេខា និងត្រាបេឡា</p>
                        <div className="h-12" />
                        <p className="font-medium">បេឡាធិការសាលា</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
