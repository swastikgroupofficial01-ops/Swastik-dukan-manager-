import React, { useState, useMemo } from 'react';
import { TranslationType } from '../lib/translations';
import { UdharAccount, UdharPayment } from '../types';
import { Plus, User, Phone, ChevronRight, Search, TrendingUp, TrendingDown, ArrowLeft, X } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';

interface UdharSystemProps {
  t: TranslationType;
  accounts: UdharAccount[];
  onUpdate: (account: UdharAccount) => void;
  onAddAccount: (name: string, mobile: string) => void;
}

export const UdharSystem: React.FC<UdharSystemProps> = ({ t, accounts, onUpdate, onAddAccount }) => {
  const [search, setSearch] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({ name: '', mobile: '' });
  
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');

  const filteredAccounts = useMemo(() => 
    accounts.filter(a => 
      a.customerName.toLowerCase().includes(search.toLowerCase()) || 
      a.mobile.includes(search)
    ),
  [accounts, search]);

  const selectedAccount = useMemo(() => 
    accounts.find(a => a.id === selectedAccountId),
  [accounts, selectedAccountId]);

  const stats = useMemo(() => {
    const total = accounts.reduce((sum, a) => sum + a.remainingAmount, 0);
    return { total };
  }, [accounts]);

  const handleAddAccount = () => {
    if (!newAccount.name || !newAccount.mobile) return;
    onAddAccount(newAccount.name, newAccount.mobile);
    setNewAccount({ name: '', mobile: '' });
    setIsAddingAccount(false);
  };

  const handlePayment = (type: 'debit' | 'credit') => {
    if (!selectedAccount || !paymentAmount) return;
    
    const amount = parseFloat(paymentAmount);
    const newPayment: UdharPayment = {
      id: Date.now().toString(),
      amount,
      date: new Date().toISOString(),
      type,
      note: paymentNote
    };
    
    const updatedAccount: UdharAccount = {
      ...selectedAccount,
      remainingAmount: type === 'debit' 
        ? selectedAccount.remainingAmount + amount 
        : selectedAccount.remainingAmount - amount,
      totalUdhar: type === 'debit' 
        ? selectedAccount.totalUdhar + amount 
        : selectedAccount.totalUdhar,
      paidAmount: type === 'credit' 
        ? selectedAccount.paidAmount + amount 
        : selectedAccount.paidAmount,
      history: [newPayment, ...selectedAccount.history]
    };
    
    onUpdate(updatedAccount);
    setPaymentAmount('');
    setPaymentNote('');
  };

  if (selectedAccount) {
    return (
      <div className="p-4 pb-24 space-y-6">
        <button 
          onClick={() => setSelectedAccountId(null)}
          className="flex items-center text-slate-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft size={20} className="mr-1" />
          {t.allCustomers}
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 card-shadow border border-slate-100 dark:border-slate-800">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedAccount.customerName}</h2>
              <div className="flex items-center text-slate-500 mt-1">
                <Phone size={14} className="mr-1" />
                <span className="text-sm">{selectedAccount.mobile}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-400 uppercase">{t.remainingAmount}</p>
              <p className="text-2xl font-bold text-rose-500">{formatCurrency(selectedAccount.remainingAmount)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs text-slate-400 uppercase">{t.totalUdhar}</p>
              <p className="font-bold text-slate-800 dark:text-slate-200">{formatCurrency(selectedAccount.totalUdhar)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase">{t.paidAmount}</p>
              <p className="font-bold text-brand-600">{formatCurrency(selectedAccount.paidAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 card-shadow border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-200">{t.addEntry}</h3>
          
          <div className="space-y-3">
            <input 
              type="number" 
              placeholder={t.finalAmount}
              value={paymentAmount}
              onChange={e => setPaymentAmount(e.target.value)}
              className="w-full h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 focus:ring-2 focus:ring-brand-500 outline-none"
            />
            <input 
              type="text" 
              placeholder={t.notes}
              value={paymentNote}
              onChange={e => setPaymentNote(e.target.value)}
              className="w-full h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 focus:ring-2 focus:ring-brand-500 outline-none"
            />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={() => handlePayment('debit')}
                className="h-12 bg-rose-500 text-white rounded-xl font-bold active:scale-95 transition-transform"
              >
                {t.addUdhar}
              </button>
              <button 
                onClick={() => handlePayment('credit')}
                className="h-12 bg-brand-600 text-white rounded-xl font-bold active:scale-95 transition-transform"
              >
                {t.receivePayment}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 card-shadow border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">{t.paymentHistory}</h3>
          <div className="space-y-4">
            {selectedAccount.history.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between py-2 border-b last:border-0 border-slate-50 dark:border-slate-800">
                <div className="flex items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                    payment.type === 'debit' ? "bg-rose-100 text-rose-600" : "bg-brand-100 text-brand-600"
                  )}>
                    {payment.type === 'debit' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {payment.type === 'debit' ? t.addUdhar : t.receivePayment}
                    </p>
                    <p className="text-xs text-slate-400">{new Date(payment.date).toLocaleDateString()} • {payment.note || 'No notes'}</p>
                  </div>
                </div>
                <div className={cn(
                  "font-bold",
                  payment.type === 'debit' ? "text-rose-500" : "text-brand-600"
                )}>
                  {payment.type === 'debit' ? '+' : '-'}{formatCurrency(payment.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 space-y-6">
      <div className="bg-brand-600 rounded-3xl p-6 text-white card-shadow shadow-brand-500/30">
        <p className="text-brand-100 uppercase text-xs font-bold tracking-widest mb-1">{t.totalUdhar}</p>
        <h2 className="text-3xl font-bold">{formatCurrency(stats.total)}</h2>
      </div>

      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="ग्राहक खोजें..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-4 focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
        <button 
          onClick={() => setIsAddingAccount(true)}
          className="w-12 h-12 bg-brand-600 text-white rounded-2xl flex items-center justify-center active:scale-95 transition-transform shadow-lg shadow-brand-500/20"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-3">
        {filteredAccounts.map((account) => (
          <button
            key={account.id}
            onClick={() => setSelectedAccountId(account.id)}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 card-shadow transition-all active:scale-[0.98]"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full flex items-center justify-center mr-3">
                <User size={24} />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-800 dark:text-slate-100">{account.customerName}</p>
                <p className="text-xs text-slate-400">{account.mobile}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-right mr-3">
                <p className="font-bold text-rose-500">{formatCurrency(account.remainingAmount)}</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Remaining</p>
              </div>
              <ChevronRight size={20} className="text-slate-300" />
            </div>
          </button>
        ))}
      </div>

      {isAddingAccount && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[32px] p-6 space-y-6 motion-preset-bounce">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">नया ग्राहक जोड़ें</h2>
              <button 
                onClick={() => setIsAddingAccount(false)}
                className="w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase ml-1">ग्राहक का नाम</label>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="e.g. Rahul Sharma"
                  value={newAccount.name}
                  onChange={e => setNewAccount({...newAccount, name: e.target.value})}
                  className="w-full h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase ml-1">मोबाइल नंबर</label>
                <input 
                  type="tel" 
                  placeholder="e.g. 9876543210"
                  value={newAccount.mobile}
                  onChange={e => setNewAccount({...newAccount, mobile: e.target.value})}
                  className="w-full h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>
            <button 
              onClick={handleAddAccount}
              className="w-full h-14 bg-brand-600 text-white rounded-2xl font-bold shadow-lg shadow-brand-500/20 active:scale-95 transition-transform"
            >
              ग्राहक सुरक्षित करें
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
