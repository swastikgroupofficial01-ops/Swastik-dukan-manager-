import React, { useState } from 'react';
import { TranslationType } from '../lib/translations';
import { Card } from './Card';
import { WalletMinimal, Smartphone, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthScreenProps {
  t: TranslationType;
  onLogin: (mobile: string) => void;
  isLoading?: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ t, onLogin, isLoading = false }) => {
  const [mobile, setMobile] = useState('');
  const [remember, setRemember] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length >= 10) {
      onLogin(mobile);
    }
  };

  return (
    <div className="min-h-screen bg-brand-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8 text-center"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-brand-600 shadow-brand-500/40 shadow-2xl rounded-[28px] flex items-center justify-center text-white transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <WalletMinimal size={40} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              {t.appName.split(' ').slice(0, 2).join(' ')}
              <span className="text-brand-600 block">{t.appName.split(' ').slice(2).join(' ')}</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium italic">
              आपका व्यापार, आपकी समृद्धि 🙏
            </p>
          </div>
        </div>

        <Card className="p-8 space-y-6 text-left border-none shadow-2xl dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t.login}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">
                  {t.mobileNumber}
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors">
                    <Smartphone size={20} />
                  </div>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="99999 99999"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent font-bold text-lg tracking-widest placeholder:tracking-normal placeholder:font-medium"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 px-1">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={remember} 
                    onChange={() => setRemember(!remember)} 
                    className="sr-only peer" 
                  />
                  <div className="w-10 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                </label>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{t.rememberMe}</span>
              </div>

              <button
                type="submit"
                disabled={isLoading || mobile.length < 10}
                className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 active:scale-95 transition-all text-lg"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <span>{t.login}</span>
                    <ChevronRight size={20} />
                  </>
                )}
              </button>
            </form>
          </div>
        </Card>

        <p className="text-xs text-slate-400 dark:text-slate-600 px-6">
          लोगिन करके आप हमारे नियमों और शर्तों से सहमत होते हैं। सुरक्षित और क्लाउड बैकअप के साथ।
        </p>
      </motion.div>
    </div>
  );
};
