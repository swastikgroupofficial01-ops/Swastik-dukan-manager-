import React, { useState } from 'react';
import { TranslationType } from '../lib/translations';
import { Card } from './Card';
import { Search, Calendar, ChevronRight, ArrowUpRight, ArrowDownRight, Receipt, User, ShoppingBag } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { DailyEntry, Bill } from '../types';

interface HistoryProps {
  t: TranslationType;
  entries: DailyEntry[];
  bills: Bill[];
}

export const History: React.FC<HistoryProps> = ({ t, entries, bills }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'entries' | 'bills'>('entries');

  const filteredEntries = entries
    .filter(entry => entry.date.includes(searchTerm))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredBills = bills
    .filter(bill => 
      bill.billNumber.includes(searchTerm) || 
      bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.customerMobile.includes(searchTerm)
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-4 space-y-4 pb-24 max-w-3xl mx-auto">
      <div className="flex flex-col gap-1 mb-2">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t.history}</h2>
        
        <div className="flex bg-slate-100 dark:bg-slate-900 rounded-2xl p-1 mt-3">
          <button 
            onClick={() => setActiveSubTab('entries')}
            className={cn(
              "flex-1 py-2 text-sm font-bold rounded-xl transition-all",
              activeSubTab === 'entries' ? "bg-white dark:bg-slate-800 text-brand-600 shadow-sm" : "text-slate-500"
            )}
          >
            {t.dashboard}
          </button>
          <button 
            onClick={() => setActiveSubTab('bills')}
            className={cn(
              "flex-1 py-2 text-sm font-bold rounded-xl transition-all",
              activeSubTab === 'bills' ? "bg-white dark:bg-slate-800 text-brand-600 shadow-sm" : "text-slate-500"
            )}
          >
            {t.billing}
          </button>
        </div>

        <div className="relative group mt-3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={18} />
          <input
            type="text"
            placeholder={activeSubTab === 'entries' ? t.searchDate : "नाम या नंबर से खोजें..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium card-shadow"
          />
        </div>
      </div>

      {activeSubTab === 'entries' ? (
        filteredEntries.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <Calendar className="mx-auto text-slate-200 dark:text-slate-800" size={80} />
            <p className="text-slate-500 font-medium">कोई डेटा नहीं मिला</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEntries.map((entry) => (
              <Card key={entry.id || entry.date} className="p-0 overflow-hidden border-l-4 border-l-brand-600">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-brand-50 dark:bg-brand-900/10 p-2.5 rounded-xl text-brand-600">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white">
                        {new Date(entry.date).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{entry.notes || 'Accounts Entry'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-brand-600 tabular-nums">
                      {formatCurrency(entry.closingBalance)}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">{t.closingBalance}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 bg-slate-50/50 dark:bg-slate-800/20 px-4 py-2 gap-2 border-t border-slate-100 dark:border-slate-800">
                   <div className="flex items-center gap-1">
                     <ArrowUpRight size={12} className="text-emerald-500" />
                     <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 tabular-nums">{formatCurrency(entry.sales)}</span>
                   </div>
                   <div className="flex items-center gap-1">
                     <ArrowDownRight size={12} className="text-orange-500" />
                     <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 tabular-nums">{formatCurrency(entry.purchase)}</span>
                   </div>
                   <div className="flex items-center gap-1">
                     <Receipt size={12} className="text-rose-500" />
                     <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 tabular-nums">{formatCurrency(entry.expense)}</span>
                   </div>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : (
        filteredBills.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <Receipt className="mx-auto text-slate-200 dark:text-slate-800" size={80} />
            <p className="text-slate-500 font-medium">कोई बिल नहीं मिला</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBills.map((bill) => (
              <Card key={bill.id} className="p-4 flex items-center justify-between border-l-4 border-l-indigo-500">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 dark:bg-indigo-900/10 p-2.5 rounded-xl text-indigo-600">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white">#{bill.billNumber}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <User size={12} /> {bill.customerName || 'Cash Customer'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{new Date(bill.date).toLocaleString('hi-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric' })}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-indigo-600 tabular-nums">
                    {formatCurrency(bill.finalAmount)}
                  </div>
                  <span className={cn(
                    "text-[10px] font-black uppercase px-2 py-0.5 rounded-md",
                    bill.paymentMethod === 'cash' ? "bg-emerald-100 text-emerald-700" :
                    bill.paymentMethod === 'online' ? "bg-blue-100 text-blue-700" :
                    "bg-rose-100 text-rose-700"
                  )}>
                    {t[bill.paymentMethod]}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  );
};
