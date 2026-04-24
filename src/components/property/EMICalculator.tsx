import { useState, useEffect } from 'react';
import { Calculator, IndianRupee, Percent, Calendar } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface EMICalculatorProps {
  initialAmount: number;
}

export function EMICalculator({ initialAmount }: EMICalculatorProps) {
  const [amount, setAmount] = useState(initialAmount);
  const [interest, setInterest] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [emi, setEmi] = useState(0);

  useEffect(() => {
    const r = interest / 12 / 100;
    const n = tenure * 12;
    const emiValue = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setEmi(Math.round(emiValue) || 0);
  }, [amount, interest, tenure]);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="h-5 w-5 text-blue-600" />
        <h3 className="font-bold text-slate-900 dark:text-slate-100">EMI Calculator</h3>
      </div>

      <div className="space-y-4 mb-6">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Loan Amount (₹)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="w-full pl-7 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Interest Rate (%)</label>
            <div className="relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
              <input
                type="number"
                step="0.1"
                value={interest}
                onChange={e => setInterest(Number(e.target.value))}
                className="w-full pl-4 pr-8 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tenure (Years)</label>
            <input
              type="number"
              value={tenure}
              onChange={e => setTenure(Number(e.target.value))}
              className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-600 rounded-xl p-4 text-white shadow-lg shadow-blue-600/20">
        <p className="text-xs text-blue-100 mb-1 opacity-80 uppercase tracking-widest font-semibold">Monthly EMI</p>
        <p className="text-2xl font-bold">{formatINR(emi)}</p>
      </div>

      <p className="text-[10px] text-center text-slate-400 mt-4 leading-relaxed">
        *This is an estimate. Actual bank rates may vary. Figures based on monthly reducing balance.
      </p>
    </div>
  );
}
