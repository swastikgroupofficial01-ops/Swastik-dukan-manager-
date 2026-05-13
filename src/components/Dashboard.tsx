import React from 'react';
import { Card } from './Card';
import { 
  TrendingUp, 
  TrendingDown, 
  Receipt, 
  Wallet, 
  ArrowUpRight, 
  Calculator,
  HandCoins,
  CreditCard,
  Users
} from 'lucide-react';
import { TranslationType } from '../lib/translations';
import { formatCurrency, cn } from '../lib/utils';
import { motion } from 'motion/react';

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: React.ElementType;
  color: string;
  subValue?: string;
  delay?: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, icon: Icon, color, subValue, delay = 0 }) => (
  <Card className="flex flex-col gap-2 relative overflow-hidden group">
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="z-10"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">{title}</span>
        <div className={cn("p-1.5 rounded-lg", color)}>
          <Icon size={16} className="text-white" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-white tabular-nums">
        {formatCurrency(amount)}
      </h3>
      {subValue && (
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase">{subValue}</span>
      )}
    </motion.div>
    <div className={cn("absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity", color)}>
      <Icon size={80} />
    </div>
  </Card>
);

interface DashboardProps {
  t: TranslationType;
  stats: {
    opening: number;
    sales: number;
    purchase: number;
    expense: number;
    closing: number;
    profit: number;
    cashInHand: number;
    onlinePayments: number;
    udharAmount: number;
    hasEntryToday: boolean;
  };
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ t, stats, onNavigate }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="p-4 space-y-4 pb-24 max-w-3xl mx-auto">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t.dashboard}</h2>
        <p className="text-slate-500 text-sm">{new Date().toLocaleDateString('hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {!stats.hasEntryToday && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900 p-3 rounded-xl flex items-center gap-3"
        >
          <div className="bg-orange-500 text-white p-1.5 rounded-full animate-pulse">
            <TrendingUp size={16} />
          </div>
          <span className="text-xs font-bold text-orange-700 dark:text-orange-300">{t.dailyReminder}</span>
        </motion.div>
      )}

      <Card className="bg-brand-600 dark:bg-brand-700 text-white border-none shadow-brand-500/30 overflow-hidden group">
        <div className="relative z-10 flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-brand-100 text-sm font-medium">{t.closingBalance}</span>
            <div className="text-4xl font-bold tabular-nums">
              {formatCurrency(stats.closing)}
            </div>
          </div>
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <HandCoins size={32} />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs font-medium text-brand-50">
          <div className="flex items-center gap-1">
            <ArrowUpRight size={14} className="text-brand-200" />
            <span>{t.openingBalance}: {formatCurrency(stats.opening)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calculator size={14} className="text-brand-200" />
            <span>{t.cashInHand}: {formatCurrency(stats.cashInHand)}</span>
          </div>
        </div>
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
      </Card>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3"
      >
        <SummaryCard 
          title={t.sales} 
          amount={stats.sales} 
          icon={TrendingUp} 
          color="bg-emerald-500 shadow-emerald-500/20 shadow-md"
          delay={0.1}
        />
        <SummaryCard 
          title={t.purchase} 
          amount={stats.purchase} 
          icon={TrendingDown} 
          color="bg-orange-500 shadow-orange-500/20 shadow-md"
          delay={0.2}
        />
        <SummaryCard 
          title={t.expense} 
          amount={stats.expense} 
          icon={Receipt} 
          color="bg-rose-500 shadow-rose-500/20 shadow-md"
          delay={0.3}
        />
        <SummaryCard 
          title={t.totalProfit} 
          amount={stats.profit} 
          icon={TrendingUp} 
          color="bg-blue-500 shadow-blue-500/20 shadow-md"
          subValue={stats.profit >= 0 ? "Profit" : "Loss"}
          delay={0.4}
        />
        <SummaryCard 
          title={t.onlinePayments} 
          amount={stats.onlinePayments} 
          icon={CreditCard} 
          color="bg-indigo-500 shadow-indigo-500/20 shadow-md"
          delay={0.5}
        />
        <SummaryCard 
          title={t.udharAmount} 
          amount={stats.udharAmount} 
          icon={Users} 
          color="bg-purple-500 shadow-purple-500/20 shadow-md"
          delay={0.6}
        />
      </motion.div>

      <div className="grid grid-cols-2 gap-3 pb-4">
        <button 
          onClick={() => onNavigate('billing')}
          className="h-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center space-x-3 active:scale-95 transition-transform card-shadow"
        >
          <div className="bg-brand-100 dark:bg-brand-900/30 text-brand-600 p-2 rounded-xl">
            <Receipt size={24} />
          </div>
          <span className="font-bold text-slate-800 dark:text-white uppercase tracking-tight">{t.billing}</span>
        </button>
        <button 
          onClick={() => onNavigate('udhar')}
          className="h-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center space-x-3 active:scale-95 transition-transform card-shadow"
        >
          <div className="bg-rose-100 dark:bg-rose-900/30 text-rose-600 p-2 rounded-xl">
            <Users size={24} />
          </div>
          <span className="font-bold text-slate-800 dark:text-white uppercase tracking-tight">{t.udharSystem}</span>
        </button>
      </div>

      <Card className="flex items-center justify-between p-3 bg-brand-50 dark:bg-brand-900/20 border-brand-100 dark:border-brand-800/50">
        <div className="flex items-center gap-3">
          <div className="bg-brand-600 p-2 rounded-lg text-white">
            <Wallet size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-tight">{t.cashInHand}</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{t.closingReminder}</p>
          </div>
        </div>
        <div className="text-xl font-bold text-brand-700 dark:text-brand-400 tabular-nums">
          {formatCurrency(stats.cashInHand)}
        </div>
      </Card>
    </div>
  );
};
