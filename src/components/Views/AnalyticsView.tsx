import React from 'react';
import { useHotel } from '../../context/HotelContext';
import { IndianRupee, TrendingUp, BedDouble, Users, ArrowUpRight, PieChart, BarChart3 } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { metrics } = useHotel();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Hotel Performance Analytics & Reports</h1>
          <p className="text-xs text-slate-500">Comprehensive overview of revenue trends, average daily rate (ADR), RevPAR, and lead conversion rates.</p>
        </div>
      </div>

      {/* Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Total Monthly Revenue</span>
          <div className="mt-2 text-xl font-extrabold text-slate-900">₹{(metrics?.totalMonthlyRevenue ?? 0).toLocaleString()}</div>
          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3.5 w-3.5" /> +18.4% MoM
          </span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Average Daily Rate (ADR)</span>
          <div className="mt-2 text-xl font-extrabold text-slate-900">₹{(metrics?.adr ?? 0).toLocaleString()}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Average room charge per night</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Revenue Per Available Room (RevPAR)</span>
          <div className="mt-2 text-xl font-extrabold text-slate-900">₹{(metrics?.revpar ?? 0).toLocaleString()}</div>
          <span className="text-[11px] font-bold text-indigo-600 mt-1 block">Optimal yield performance</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Lead Conversion Rate</span>
          <div className="mt-2 text-xl font-extrabold text-slate-900">38.5%</div>
          <span className="text-[11px] font-bold text-purple-600 mt-1 block">+4.2% AI Lead Scoring boost</span>
        </div>
      </div>

      {/* Booking Sources Distribution & Monthly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="h-4 w-4 text-indigo-600" />
            Booking Source Channel Breakdown
          </h2>
          <div className="space-y-3 pt-2 text-xs">
            {[
              { source: 'Direct Website', percentage: 42, color: 'bg-indigo-600' },
              { source: 'OTA (Booking.com / MakeMyTrip)', percentage: 30, color: 'bg-blue-500' },
              { source: 'Corporate Contracts', percentage: 18, color: 'bg-purple-600' },
              { source: 'Walk-ins & Telephone', percentage: 10, color: 'bg-emerald-500' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>{item.source}</span>
                  <span>{item.percentage}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-purple-600" />
            Room Type Revenue Contribution
          </h2>
          <div className="space-y-3 pt-2 text-xs">
            {[
              { type: 'Deluxe Room', revenue: '₹14,50,000', percentage: 45 },
              { type: 'Executive Suite', revenue: '₹9,80,000', percentage: 30 },
              { type: 'Presidential Suite', revenue: '₹8,20,000', percentage: 25 },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>{item.type}</span>
                  <span className="font-bold text-slate-900">{item.revenue} ({item.percentage}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-purple-600" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
