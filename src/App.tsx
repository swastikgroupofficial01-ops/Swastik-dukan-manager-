import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { History } from './components/History';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { EntryForm } from './components/EntryForm';
import { AuthScreen } from './components/AuthScreen';
import { Billing } from './components/Billing';
import { UdharSystem } from './components/UdharSystem';
import { jsPDF } from 'jspdf';
import { formatCurrency } from './lib/utils';
import { translations, Language } from './lib/translations';
import { DailyEntry, Bill, UdharAccount } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lang, setLang] = useState<Language>('hi');
  const [darkMode, setDarkMode] = useState(false);
  const [shopName, setShopName] = useState('स्वस्तिक स्टोर');
  const [isEntryOpen, setIsEntryOpen] = useState(false);
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [udharAccounts, setUdharAccounts] = useState<UdharAccount[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[lang];

  // Load initial state
  useEffect(() => {
    const savedEntries = localStorage.getItem('swastik_entries');
    if (savedEntries) setEntries(JSON.parse(savedEntries));
    
    const savedBills = localStorage.getItem('swastik_bills');
    if (savedBills) setBills(JSON.parse(savedBills));

    const savedUdhar = localStorage.getItem('swastik_udhar');
    if (savedUdhar) setUdharAccounts(JSON.parse(savedUdhar));

    const savedUser = localStorage.getItem('swastik_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedSettings = localStorage.getItem('swastik_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setLang(settings.language);
      setDarkMode(settings.darkMode);
      if (settings.shopName) setShopName(settings.shopName);
    }
  }, []);

  // Save state on changes
  useEffect(() => {
    localStorage.setItem('swastik_entries', JSON.stringify(entries));
    localStorage.setItem('swastik_bills', JSON.stringify(bills));
    localStorage.setItem('swastik_udhar', JSON.stringify(udharAccounts));
  }, [entries, bills, udharAccounts]);

  useEffect(() => {
    localStorage.setItem('swastik_settings', JSON.stringify({ language: lang, darkMode, shopName }));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [lang, darkMode]);

  const handleLogin = (mobile: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const newUser = { mobile, id: 'user_' + mobile };
      setUser(newUser);
      localStorage.setItem('swastik_user', JSON.stringify(newUser));
      setIsLoading(false);
    }, 1500);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('swastik_user');
  };

  const handleReset = () => {
    if (window.confirm('क्या आप सचमें सारा डेटा मिटाना चाहते हैं?')) {
      setEntries([]);
      localStorage.removeItem('swastik_entries');
    }
  };

  const handleAddEntry = (newEntry: DailyEntry) => {
    setEntries(prev => [...prev.filter(e => e.date !== newEntry.date), newEntry]);
    setActiveTab('dashboard');
  };

  const handleAddBill = (bill: Bill) => {
    setBills(prev => [bill, ...prev]);
    
    // Update daily sales for today if applicable
    const today = new Date().toISOString().split('T')[0];
    if (bill.date.split('T')[0] === today) {
      const existingEntry = entries.find(e => e.date === today);
      if (existingEntry) {
        const updatedEntry = {
          ...existingEntry,
          sales: existingEntry.sales + bill.finalAmount,
          closingBalance: existingEntry.closingBalance + bill.finalAmount
        };
        setEntries(prev => [...prev.filter(e => e.date !== today), updatedEntry]);
      }
    }

    // Handle Udhar addition
    if (bill.paymentMethod === 'udhar') {
      const existingAccount = udharAccounts.find(a => a.mobile === bill.customerMobile);
      if (existingAccount) {
        handleUpdateUdhar({
          ...existingAccount,
          remainingAmount: existingAccount.remainingAmount + bill.finalAmount,
          totalUdhar: existingAccount.totalUdhar + bill.finalAmount,
          history: [{
            id: Date.now().toString(),
            amount: bill.finalAmount,
            date: bill.date,
            type: 'debit',
            note: `Bill #${bill.billNumber}`
          }, ...existingAccount.history]
        });
      } else {
        handleAddUdharAccount(bill.customerName, bill.customerMobile, bill.finalAmount, `Bill #${bill.billNumber}`);
      }
    }
    
    setActiveTab('dashboard');
  };

  const handleUpdateUdhar = (account: UdharAccount) => {
    setUdharAccounts(prev => [account, ...prev.filter(a => a.id !== account.id)]);
  };

  const handleAddUdharAccount = (name: string, mobile: string, initialAmount = 0, note = 'Account Created') => {
    const newAccount: UdharAccount = {
      id: Date.now().toString(),
      customerName: name,
      mobile,
      totalUdhar: initialAmount,
      paidAmount: 0,
      remainingAmount: initialAmount,
      history: initialAmount > 0 ? [{
        id: Date.now().toString(),
        amount: initialAmount,
        date: new Date().toISOString(),
        type: 'debit',
        note
      }] : []
    };
    setUdharAccounts(prev => [newAccount, ...prev]);
  };

  const handleShareBill = (bill: Bill) => {
    const productList = bill.products.map(p => `${p.name} (${p.quantity} x ${formatCurrency(p.price)}) = ${formatCurrency(p.total)}`).join('\n');
    const text = `*${shopName}*\nबिल नंबर: #${bill.billNumber}\nग्राहक: ${bill.customerName}\nतारीख: ${new Date(bill.date).toLocaleString()}\n\n*सामान:*\n${productList}\n\n*कुल राशि: ${formatCurrency(bill.finalAmount)}*\nभुगतान: ${t[bill.paymentMethod]}\n\nधन्यवाद! 🙏`;
    const url = `https://wa.me/${bill.customerMobile ? '91' + bill.customerMobile : ''}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handlePrintBill = (bill: Bill) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text(shopName, 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Bill No: #${bill.billNumber}`, 20, 35);
    doc.text(`Date: ${new Date(bill.date).toLocaleString()}`, 20, 40);
    doc.text(`Customer: ${bill.customerName || 'Cash'}`, 20, 45);
    doc.text(`Mobile: ${bill.customerMobile || '-'}`, 20, 50);

    doc.line(20, 55, 190, 55);
    doc.text("Product", 25, 62);
    doc.text("Qty", 100, 62);
    doc.text("Price", 130, 62);
    doc.text("Total", 165, 62);
    doc.line(20, 65, 190, 65);

    let y = 72;
    bill.products.forEach(p => {
      doc.text(p.name, 25, y);
      doc.text(p.quantity.toString(), 100, y);
      doc.text(p.price.toString(), 130, y);
      doc.text(p.total.toString(), 165, y);
      y += 8;
    });

    doc.line(20, y, 190, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Total Amount: ${formatCurrency(bill.totalAmount)}`, 130, y);
    y += 8;
    doc.text(`Discount: ${formatCurrency(bill.discount)}`, 130, y);
    y += 10;
    doc.setFontSize(14);
    doc.text(`Final Amount: ${formatCurrency(bill.finalAmount)}`, 130, y);

    doc.setFontSize(10);
    doc.text("Thank you for shopping!", 105, y + 20, { align: 'center' });
    
    doc.save(`Bill_${bill.billNumber}.pdf`);
  };

  const shareOnWhatsApp = () => {
    const today = new Date().toLocaleDateString('hi-IN');
    const text = `*${shopName}*\nतारीख: ${today}\n\nआज की बिक्री: ${formatCurrency(dashboardStats.sales)}\nआज की खरीदारी: ${formatCurrency(dashboardStats.purchase)}\nआज के खर्चे: ${formatCurrency(dashboardStats.expense)}\n\n*क्लोजिंग बैलेंस: ${formatCurrency(dashboardStats.closing)}*\n*कुल लाभ: ${formatCurrency(dashboardStats.profit)}*\n\nसफलतापूर्वक जनरेट किया गया। 🙏`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const dashboardStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = entries.find(e => e.date === today);
    const todayBills = bills.filter(b => b.date.split('T')[0] === today);
    
    const onlinePayments = todayBills
      .filter(b => b.paymentMethod === 'online')
      .reduce((sum, b) => sum + b.finalAmount, 0);

    const udharAmount = todayBills
      .filter(b => b.paymentMethod === 'udhar')
      .reduce((sum, b) => sum + b.finalAmount, 0);

    if (todayEntry) {
      return {
        opening: todayEntry.openingBalance,
        sales: todayEntry.sales,
        purchase: todayEntry.purchase,
        expense: todayEntry.expense,
        closing: todayEntry.closingBalance,
        profit: todayEntry.sales - todayEntry.purchase - todayEntry.expense,
        cashInHand: todayEntry.closingBalance,
        onlinePayments,
        udharAmount,
        hasEntryToday: true
      };
    }

    const lastEntry = entries.length > 0 
      ? [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
      : null;

    const opening = lastEntry ? lastEntry.closingBalance : 0;
    
    return {
      opening,
      sales: 0,
      purchase: 0,
      expense: 0,
      closing: opening,
      profit: 0,
      cashInHand: opening,
      onlinePayments: 0,
      udharAmount: 0,
      hasEntryToday: false
    };
  }, [entries, bills]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(shopName, 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text(`Daily Cash Report - ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
    
    let y = 50;
    doc.setFontSize(10);
    doc.text("Date", 10, y);
    doc.text("Opening", 40, y);
    doc.text("Sales", 70, y);
    doc.text("Expense", 100, y);
    doc.text("Closing", 130, y);
    doc.text("Profit", 160, y);
    
    doc.line(10, y + 2, 200, y + 2);
    y += 10;

    entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).forEach(entry => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(entry.date, 10, y);
      doc.text(entry.openingBalance.toString(), 40, y);
      doc.text(entry.sales.toString(), 70, y);
      doc.text(entry.expense.toString(), 100, y);
      doc.text(entry.closingBalance.toString(), 130, y);
      doc.text((entry.sales - entry.purchase - entry.expense).toString(), 160, y);
      y += 8;
    });

    doc.save(`Swastik_Report_${new Date().getTime()}.pdf`);
  };

  if (!user) {
    return <AuthScreen t={t} onLogin={handleLogin} isLoading={isLoading} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Header 
        t={t} 
        lang={lang} 
        setLang={setLang} 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
      />

      <main className="max-w-screen-md mx-auto">
        {activeTab === 'dashboard' && (
          <Dashboard t={t} stats={dashboardStats} onNavigate={setActiveTab} />
        )}

        {activeTab === 'billing' && (
          <Billing 
            t={t} 
            onSave={handleAddBill} 
            onPrint={handlePrintBill}
            onShare={handleShareBill}
            lastBillNumber={bills.length > 0 ? bills[0].billNumber : '000000'} 
          />
        )}

        {activeTab === 'udhar' && (
          <UdharSystem 
            t={t} 
            accounts={udharAccounts} 
            onUpdate={handleUpdateUdhar} 
            onAddAccount={handleAddUdharAccount} 
          />
        )}
        
        {activeTab === 'history' && (
          <History t={t} entries={entries} bills={bills} />
        )}
        
        {activeTab === 'reports' && (
          <Reports t={t} entries={entries} bills={bills} />
        )}
        
        {activeTab === 'settings' && (
          <Settings 
            t={t} 
            lang={lang} 
            setLang={setLang} 
            darkMode={darkMode} 
            setDarkMode={setDarkMode}
            onReset={handleReset}
            onLogout={handleLogout}
            onExport={exportToPDF}
            onShare={shareOnWhatsApp}
            userEmail={user.mobile}
            isCloudSynced={false} // Placeholder for firebase
            shopName={shopName}
            onShopNameChange={setShopName}
          />
        )}
      </main>

      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        t={t}
        onAddClick={() => setIsEntryOpen(true)}
      />

      <EntryForm 
        t={t}
        isOpen={isEntryOpen} 
        onClose={() => setIsEntryOpen(false)}
        onSave={handleAddEntry}
        initialOpeningBalance={dashboardStats.opening}
      />
    </div>
  );
}
