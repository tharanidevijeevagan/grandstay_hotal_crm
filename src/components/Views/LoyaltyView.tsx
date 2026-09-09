import React from 'react';
import { useHotel } from '../../context/HotelContext';
import { Award, Gift, Sparkles, Shield, User } from 'lucide-react';

export const LoyaltyView: React.FC = () => {
  const { guests } = useHotel();

  const tiers = [
    { name: 'Silver Tier', minSpend: 10000, perks: '5% Room Discount, Late Check-out' },
    { name: 'Gold Tier', minSpend: 50000, perks: '10% Room Discount, Free Breakfast, Room Upgrade' },
    { name: 'Platinum Tier', minSpend: 150000, perks: '15% Room Discount, Free Airport Transfer, Lounge Access' },
    { name: 'Diamond VIP', minSpend: 300000, perks: '20% Off, Dedicated Butler, Unlimited Spa Access' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Guest Loyalty & Rewards Program</h1>
          <p className="text-xs text-slate-500">Tiered rewards, point balances, VIP perks, and recognition history.</p>
        </div>
      </div>

      {/* Tier Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map((t, idx) => (
          <div key={idx} className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-2 hover:shadow-md transition">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-sm">{t.name}</h3>
            </div>
            <p className="text-xs text-slate-500 font-semibold">Spend ₹{(t?.minSpend ?? 0).toLocaleString()}+</p>
            <div className="rounded bg-slate-50 p-2 text-[11px] text-slate-600 font-medium">
              {t.perks}
            </div>
          </div>
        ))}
      </div>

      {/* Top Loyalty Guests */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-900">Enrolled Loyalty Members</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Guest</th>
                <th className="py-2.5 px-3">Total Stays</th>
                <th className="py-2.5 px-3">Lifetime Spend</th>
                <th className="py-2.5 px-3">Loyalty Points</th>
                <th className="py-2.5 px-3">Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {guests.map((g) => {
                const tier =
                  g.lifetimeSpend > 150000
                    ? 'Platinum VIP'
                    : g.lifetimeSpend > 50000
                    ? 'Gold'
                    : 'Silver';
                return (
                  <tr key={g.id}>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{g.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{g.totalStays} Stays</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">₹{(g?.lifetimeSpend ?? 0).toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">
                      {((g?.lifetimeSpend ?? 0) / 10).toLocaleString()} pts
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-300">
                        {tier}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
