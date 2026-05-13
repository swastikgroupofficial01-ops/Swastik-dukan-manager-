import React from 'react';
import { Moon, Sun, Languages, WalletMinimal } from 'lucide-react';
import { TranslationType } from '../lib/translations';

interface HeaderProps {
  t: TranslationType;
  lang: string;
  setLang: (lang: 'hi' | 'en') => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ t, lang, setLang, darkMode, setDarkMode }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
      <div className="px-4 h-16 flex items-center justify-between max-w-3xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-brand-600 p-2 rounded-xl text-white shadow-brand-500/20 shadow-lg">
            <WalletMinimal size={24} />
          </div>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
            {t.appName.split(' ').map((word, i) => (
              <span key={i} className={i === 0 ? "text-brand-600" : ""}>
                {word} {i === 0 && <br className="hidden sm:block" />}
              </span>
            ))}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="lang-toggle"
            onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
          >
            <Languages size={20} />
          </button>
          <button
            id="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};
