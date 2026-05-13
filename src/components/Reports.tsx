import React from 'react';
import { TranslationType } from '../lib/translations';
import { Card } from './Card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from 'recharts';
import { formatCurrency } from '../lib/utils';
import { DailyEntry, Bill } from '../types';
import { TrendingUp, TrendingDown, IndianRupee, CreditCard, Users } from 'lucide-react';

interface ReportsProps {
  t: TranslationType;
  entries: DailyEntry[];
  bills: Bill[];
}

export const Reports: React.FC<ReportsProps> = ({ t, entries, bills }) => {
  const chartData = entries
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7) // Last 7 entries
    .map(entry => ({
      name: new Date(entry.date).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' }),
      sales: entry.sales,
      expense: entry.expense,
      profit: entry.sales - entry.purchase - entry.expense
    }));

  const totalSales = entries.reduce((acc, curr) => acc + curr.sales, 0);
  const totalExpense = entries.reduce((acc, curr) => acc + curr.expense, 0);
  const totalProfit = entries.reduce((acc, curr) => acc + (curr.sales - curr.purchase - curr.expense), 0);
  
  const totalOnline = bills
    .filter(b => b.paymentMethod === 'online')
    .reduce((acc, curr) => acc + curr.finalAmount, 0);

  const totalUdhar = bills
    .filter(b => b.paymentMethod === 'udhar')
    .reduce((acc, curr) => acc + curr.finalAmount, 0);

  return (
    <div className="p-4 space-y-5 pb-24 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t.reports}</h2>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 bg-emerald-500 text-white border-none shadow-lg shadow-emerald-500/20">
          <p className="text-[10px] font-black uppercase opacity-80">{t.sales}</p>
          <p className="text-xl font-black tabular-nums">{formatCurrency(totalSales)}</p>
        </Card>
        <Card className="p-4 bg-rose-500 text-white border-none shadow-lg shadow-rose-500/20">
          <p className="text-[10px] font-black uppercase opacity-80">{t.expense}</p>
          <p className="text-xl font-black tabular-nums">{formatCurrency(totalExpense)}</p>
        </Card>
        <Card className="p-4 bg-blue-500 text-white border-none shadow-lg shadow-blue-500/20">
          <p className="text-[10px] font-black uppercase opacity-80">{t.totalProfit}</p>
          <p className="text-xl font-black tabular-nums">{formatCurrency(totalProfit)}</p>
        </Card>
        <Card className="p-4 bg-indigo-500 text-white border-none shadow-lg shadow-indigo-500/20">
          <p className="text-[10px] font-black uppercase opacity-80">{t.onlinePayments}</p>
          <p className="text-xl font-black tabular-nums">{formatCurrency(totalOnline)}</p>
        </Card>
      </div>

      <Card className="p-4 bg-slate-900 text-white border-none overflow-hidden relative">
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">{t.udharAmount}</p>
          <p className="text-3xl font-black tabular-nums text-rose-400">{formatCurrency(totalUdhar)}</p>
        </div>
        <Users className="absolute -right-4 -bottom-4 opacity-10 text-white" size={100} />
      </Card>

      <Card className="space-y-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <TrendingUp size={16} /> {t.weeklyReport}
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 600 }}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [formatCurrency(value), '']}
              />
              <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#10B981" />
                ))}
              </Bar>
              <Bar dataKey="expense" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#F43F5E" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <TrendingUp size={16} /> लाभ ट्रेंड (Profit Trend)
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 600 }}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [formatCurrency(value), '']}
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#3B82F6" 
                strokeWidth={3} 
                dot={{ r: 4, fill: "#3B82F6", strokeWidth: 0 }} 
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
