import React, { useState, useEffect } from 'react';
import { TranslationType } from '../lib/translations';
import { Card } from './Card';
import { X, Save, Calendar, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency } from '../lib/utils';

interface EntryFormProps {
  t: TranslationType;
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: any) => void;
  initialOpeningBalance?: number;
}

export const EntryForm: React.FC<EntryFormProps> = ({ 
  t, 
  isOpen, 
  onClose, 
  onSave,
  initialOpeningBalance = 0 
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    openingBalance: initialOpeningBalance,
    sales: 0,
    purchase: 0,
    expense: 0,
    notes: ''
  });

  const closingBalance = formData.openingBalance + formData.sales - formData.purchase - formData.expense;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      closingBalance,
      cashInHand: closingBalance, // Simplified for this app version
      createdAt: new Date().toISOString()
    });
    onClose();
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white capitalize group flex items-center gap-2">
                <div className="w-1.5 h-6 bg-brand-600 rounded-full" />
                {t.addEntry}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 gap-5">
                {/* Date Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Calendar size={14} /> {t.date}
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Opening Balance */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.openingBalance}</label>
                    <input
                      type="number"
                      value={formData.openingBalance || ''}
                      onFocus={handleFocus}
                      onChange={(e) => setFormData({ ...formData, openingBalance: Number(e.target.value) })}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold text-lg"
                      required
                    />
                  </div>

                  {/* Sales */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{t.sales}</label>
                    <input
                      type="number"
                      value={formData.sales || ''}
                      onFocus={handleFocus}
                      onChange={(e) => setFormData({ ...formData, sales: Number(e.target.value) })}
                      className="w-full p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-lg text-emerald-700 dark:text-emerald-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Purchase */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-orange-600 uppercase tracking-wider">{t.purchase}</label>
                    <input
                      type="number"
                      value={formData.purchase || ''}
                      onFocus={handleFocus}
                      onChange={(e) => setFormData({ ...formData, purchase: Number(e.target.value) })}
                      className="w-full p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-lg text-orange-700 dark:text-orange-400"
                    />
                  </div>

                  {/* Expense */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-rose-600 uppercase tracking-wider">{t.expense}</label>
                    <input
                      type="number"
                      value={formData.expense || ''}
                      onFocus={handleFocus}
                      onChange={(e) => setFormData({ ...formData, expense: Number(e.target.value) })}
                      className="w-full p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-100 dark:border-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold text-lg text-rose-700 dark:text-rose-400"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Info size={14} /> {t.notes}
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="कोई विशेष विवरण..."
                  />
                </div>
              </div>

              {/* Automatic Calculation Card */}
              <div className="p-4 bg-brand-600 rounded-2xl text-white shadow-xl shadow-brand-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase opacity-80">{t.closingBalance}</span>
                  <div className="text-2xl font-bold">{formatCurrency(closingBalance)}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase opacity-80">{t.totalProfit}</span>
                  <div className="text-lg font-bold">{formatCurrency(formData.sales - formData.purchase - formData.expense)}</div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full p-5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <Save size={20} />
                {t.save}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
