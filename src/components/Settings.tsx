import React from 'react';
import { TranslationType } from '../lib/translations';
import { Card } from './Card';
import { 
  Languages, 
  Moon, 
  Sun, 
  Trash2, 
  Cloud, 
  FileText, 
  Share2, 
  LogOut,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SettingsProps {
  t: TranslationType;
  lang: string;
  setLang: (lang: 'hi' | 'en') => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  onReset: () => void;
  onLogout: () => void;
  onExport: () => void;
  onShare: () => void;
  userEmail?: string;
  isCloudSynced: boolean;
  shopName: string;
  onShopNameChange: (name: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ 
  t, 
  lang, 
  setLang, 
  darkMode, 
  setDarkMode, 
  onReset, 
  onLogout,
  onExport,
  onShare,
  userEmail,
  isCloudSynced,
  shopName,
  onShopNameChange
}) => {
  return (
    <div className="p-4 space-y-6 pb-24 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t.settings}</h2>

      <div className="space-y-4">
        <h3 className="px-1 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{t.shopName}</h3>
        <Card className="p-4 bg-white dark:bg-slate-900 border-none shadow-sm flex items-center gap-3">
          <div className="bg-brand-50 dark:bg-brand-900/20 p-2 rounded-xl text-brand-600 dark:text-brand-400">
            <ShieldCheck size={20} />
          </div>
          <input 
            type="text" 
            value={shopName}
            onChange={(e) => onShopNameChange(e.target.value)}
            placeholder={t.shopName}
            className="flex-1 bg-transparent border-none outline-none font-bold text-slate-700 dark:text-slate-200"
          />
        </Card>
      </div>

      {/* User Info & Cloud Status */}
      <Card className="bg-gradient-to-br from-brand-600 to-brand-700 text-white border-none p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">{userEmail || 'Shop Owner'}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Cloud size={14} className={isCloudSynced ? "text-emerald-300" : "text-brand-200"} />
              <span className="text-xs font-medium text-brand-100">
                {isCloudSynced ? "क्लाउड बैकअप सक्रिय" : "केवल डिवाइस पर (Local Only)"}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="px-1 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{t.language} & प्रदर्शन</h3>
        
        <Card className="p-0 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 border-none shadow-lg">
          <button 
            onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-xl text-blue-600 dark:text-blue-400">
                <Languages size={20} />
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-300">{t.language}</span>
            </div>
            <span className="text-xs font-bold text-brand-600 bg-brand-50 dark:bg-brand-900/30 px-2 py-1 rounded-md uppercase">
              {lang === 'hi' ? 'हिंदी' : 'English'}
            </span>
          </button>

          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-xl text-purple-600 dark:text-purple-400">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-300">{t.darkMode}</span>
            </div>
            <div className={cn(
              "w-12 h-6 rounded-full transition-colors relative flex items-center px-1",
              darkMode ? "bg-brand-600" : "bg-slate-200 dark:bg-slate-700"
            )}>
              <div className={cn(
                "w-4 h-4 rounded-full bg-white transition-transform duration-300",
                darkMode ? "translate-x-6" : "translate-x-0"
              )} />
            </div>
          </button>
        </Card>

        <h3 className="px-1 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">डेटा मैनेजमेंट</h3>
        
        <Card className="p-0 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 border-none shadow-lg">
          <button 
            onClick={onExport}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-brand-50 dark:bg-brand-900/20 p-2 rounded-xl text-brand-600 dark:text-brand-400">
                <FileText size={20} />
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-300">{t.exportPdf}</span>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </button>

          <button 
            onClick={onShare}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-xl text-emerald-600 dark:text-emerald-400">
                <Share2 size={20} />
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-300">{t.shareWhatsapp}</span>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </button>

          <button 
            onClick={onReset}
            className="w-full p-4 flex items-center justify-between hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-rose-50 dark:bg-rose-900/20 p-2 rounded-xl text-rose-600 dark:text-rose-400">
                <Trash2 size={20} />
              </div>
              <span className="font-bold text-rose-600 dark:text-rose-400">{t.reset}</span>
            </div>
          </button>
        </Card>

        <button 
          onClick={onLogout}
          className="w-full p-4 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors mt-4"
        >
          <LogOut size={20} />
          <span>लॉगआउट (Logout)</span>
        </button>
      </div>

      <div className="text-center pt-4">
        <p className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">
          Version 1.0.0 • Made with ❤️ in India
        </p>
      </div>
    </div>
  );
};
