import React, { useState, useMemo } from 'react';
import { TranslationType } from '../lib/translations';
import { Bill, Product } from '../types';
import { Plus, Trash2, Printer, Share2, Save, X, Search } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';

interface BillingProps {
  t: TranslationType;
  onSave: (bill: Bill) => void;
  onPrint: (bill: Bill) => void;
  onShare: (bill: Bill) => void;
  lastBillNumber: string;
}

export const Billing: React.FC<BillingProps> = ({ t, onSave, onPrint, onShare, lastBillNumber }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online' | 'udhar'>('cash');
  
  // Current item being added
  const [currentItem, setCurrentItem] = useState({ name: '', price: '', quantity: '1' });

  const totalAmount = useMemo(() => 
    products.reduce((sum, item) => sum + item.total, 0), 
  [products]);

  const finalAmount = totalAmount - discount;

  const handleAddItem = () => {
    if (!currentItem.name || !currentItem.price) return;
    
    const price = parseFloat(currentItem.price);
    const quantity = parseFloat(currentItem.quantity);
    
    const newProduct: Product = {
      id: Date.now().toString(),
      name: currentItem.name,
      price,
      quantity,
      total: price * quantity
    };
    
    setProducts([...products, newProduct]);
    setCurrentItem({ name: '', price: '', quantity: '1' });
  };

  const removeItem = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const getCurrentBill = (newBillNumber: string) => ({
    id: Date.now().toString(),
    billNumber: newBillNumber,
    customerName,
    customerMobile,
    products,
    totalAmount,
    discount,
    finalAmount,
    paymentMethod,
    date: new Date().toISOString()
  });

  const handleShare = () => {
    if (products.length === 0) return;
    const newBillNumber = (parseInt(lastBillNumber) + 1).toString().padStart(6, '0');
    onShare(getCurrentBill(newBillNumber));
  };

  const handlePrint = () => {
    if (products.length === 0) return;
    const newBillNumber = (parseInt(lastBillNumber) + 1).toString().padStart(6, '0');
    onPrint(getCurrentBill(newBillNumber));
  };

  const handleSave = () => {
    if (products.length === 0) return;
    const newBillNumber = (parseInt(lastBillNumber) + 1).toString().padStart(6, '0');
    onSave(getCurrentBill(newBillNumber));
    // Reset form
    setCustomerName('');
    setCustomerMobile('');
    setProducts([]);
    setDiscount(0);
    setPaymentMethod('cash');
  };

  return (
    <div className="p-4 pb-24 space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 card-shadow border border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold text-brand-700 dark:text-brand-400 mb-4 flex items-center">
          <span className="w-8 h-8 bg-brand-100 dark:bg-brand-900/30 text-brand-600 rounded-lg flex items-center justify-center mr-2">
            <Plus size={20} />
          </span>
          {t.createBill}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase ml-1">{t.customerName}</label>
            <input 
              type="text" 
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder={t.customerName}
              className="w-full h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase ml-1">{t.customerMobile}</label>
            <input 
              type="tel" 
              value={customerMobile}
              onChange={e => setCustomerMobile(e.target.value)}
              placeholder={t.customerMobile}
              className="w-full h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 card-shadow border border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-200">{t.productName}</h3>
          <span className="text-sm text-slate-500">{products.length} Items</span>
        </div>

        {/* Add Product Line */}
        <div className="grid grid-cols-12 gap-2 mb-4">
          <input 
            type="text" 
            placeholder={t.productName}
            value={currentItem.name}
            onChange={e => setCurrentItem({...currentItem, name: e.target.value})}
            className="col-span-12 md:col-span-5 h-11 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 focus:ring-2 focus:ring-brand-500 outline-none"
          />
          <input 
            type="number" 
            placeholder={t.price}
            value={currentItem.price}
            onChange={e => setCurrentItem({...currentItem, price: e.target.value})}
            className="col-span-5 md:col-span-3 h-11 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 focus:ring-2 focus:ring-brand-500 outline-none"
          />
          <input 
            type="number" 
            placeholder={t.quantity}
            value={currentItem.quantity}
            onChange={e => setCurrentItem({...currentItem, quantity: e.target.value})}
            className="col-span-4 md:col-span-2 h-11 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 focus:ring-2 focus:ring-brand-500 outline-none"
          />
          <button 
            onClick={handleAddItem}
            className="col-span-3 md:col-span-2 h-11 bg-brand-600 active:scale-95 text-white rounded-xl flex items-center justify-center transition-transform"
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Products List */}
        <div className="space-y-3 mt-4 max-h-[300px] overflow-y-auto pr-1">
          {products.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{item.name}</p>
                <p className="text-xs text-slate-500">{item.quantity} x {formatCurrency(item.price)}</p>
              </div>
              <div className="text-right mx-4">
                <p className="font-bold text-slate-900 dark:text-white">{formatCurrency(item.total)}</p>
              </div>
              <button 
                onClick={() => removeItem(item.id)}
                className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          
          {products.length === 0 && (
            <div className="text-center py-10 opacity-40">
              <Search className="mx-auto mb-2" size={40} />
              <p>कोई आइटम नहीं जोड़ा गया</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 card-shadow border border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
          <span>{t.total}</span>
          <span className="font-medium">{formatCurrency(totalAmount)}</span>
        </div>
        <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
          <span>{t.discount}</span>
          <input 
            type="number" 
            value={discount}
            onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
            className="w-24 text-right bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-2 h-8 focus:ring-1 focus:ring-brand-500 outline-none"
          />
        </div>
        <div className="h-px bg-slate-100 dark:bg-slate-800" />
        <div className="flex justify-between items-center text-xl font-bold text-slate-900 dark:text-white">
          <span>{t.finalAmount}</span>
          <span className="text-brand-600">{formatCurrency(finalAmount)}</span>
        </div>

        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-slate-500 uppercase ml-1">{t.paymentMethod}</label>
          <div className="grid grid-cols-3 gap-2">
            {(['cash', 'online', 'udhar'] as const).map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={cn(
                  "h-10 rounded-xl text-sm font-medium transition-all border",
                  paymentMethod === method 
                    ? "bg-brand-600 text-white border-brand-600 shadow-md transform scale-105" 
                    : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-800"
                )}
              >
                {t[method]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4">
          <button 
            onClick={handleShare}
            disabled={products.length === 0}
            className="h-14 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl font-bold flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Share2 size={20} />
            <span>{t.shareBill}</span>
          </button>
          <button 
            onClick={handlePrint}
            disabled={products.length === 0}
            className="h-14 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-2xl font-bold flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Printer size={20} />
            <span>{t.printBill}</span>
          </button>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={products.length === 0}
          className="w-full h-14 bg-brand-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-brand-500/20 active:scale-95 transition-transform disabled:opacity-50"
        >
          <Save size={20} />
          <span>{t.saveBill}</span>
        </button>
      </div>
    </div>
  );
};
