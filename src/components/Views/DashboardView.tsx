import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { TabType } from '../Sidebar';
import {
  IndianRupee,
  BedDouble,
  Users,
  CalendarCheck,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Wrench,
  KeyRound,
  UserPlus,
  PlusCircle,
  TrendingUp,
  Activity,
} from 'lucide-react';

interface DashboardViewProps {
  setActiveTab: (tab: TabType) => void;
  onOpenAiDrawer: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab, onOpenAiDrawer }) => {
  const { metrics, reservations = [], serviceRequests = [], leads = [], activities = [] } = useHotel();
  const [briefing, setBriefing] = useState<string>(
    "Occupancy is expected to reach 85% this weekend. Arjun Kumar (VIP) arrives tomorrow for his 5th stay in Deluxe Room 301. Seven pending service requests require attention, including urgent AC repair in Room 304."
  );
  const [loadingBriefing, setLoadingBriefing] = useState(false);

  const refreshAiBriefing = async () => {
    setLoadingBriefing(true);
    try {
      const res = await fetch('/api/ai/daily-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics }),
      });
      const data = await res.json();
      if (data.briefing) setBriefing(data.briefing);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBriefing(false);
    }
  };

  const todayCheckIns = reservations.filter((r) => r.status === 'confirmed');
  const activeOccupied = reservations.filter((r) => r.status === 'checked_in');
  const openRequests = serviceRequests.filter((s) => s.status !== 'resolved');

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Hotel Performance Dashboard</h1>
          <p className="text-xs text-slate-500">Real-time overview of revenue, occupancy, guests, and operational alerts.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('checkin_checkout')}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 transition shadow-sm"
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>Check-in Guest</span>
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            <UserPlus className="h-3.5 w-3.5 text-indigo-600" />
            <span>Add New Lead</span>
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            <PlusCircle className="h-3.5 w-3.5 text-emerald-600" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* AI Daily Briefing Header Widget */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 p-5 text-white shadow-md border border-indigo-900/40">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300">
              <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">AI Daily Briefing</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-400/30">
                  Live Insights
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
                {briefing}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={refreshAiBriefing}
              disabled={loadingBriefing}
              className="flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-1.5 text-xs font-medium text-purple-200 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{loadingBriefing ? 'Generating...' : 'Refresh AI'}</span>
            </button>
            <button
              onClick={onOpenAiDrawer}
              className="text-[11px] text-purple-300 hover:underline text-right"
            >
              Ask AI Assistant →
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards (4 Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Today's Revenue</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <IndianRupee className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">₹{(metrics?.revenueToday ?? 0).toLocaleString()}</span>
            <span className="flex items-center text-[11px] font-semibold text-emerald-600">
              <ArrowUpRight className="h-3 w-3" /> +14% vs yesterday
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Includes Room rates & F&B</p>
        </div>

        {/* Occupancy */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Occupancy Rate</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <BedDouble className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">{metrics.occupancyRate}%</span>
            <span className="text-[11px] font-semibold text-indigo-600">
              {metrics.availableRoomsCount} Rooms Available
            </span>
          </div>
          {/* Progress bar */}
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-600"
              style={{ width: `${metrics.occupancyRate}%` }}
            />
          </div>
        </div>

        {/* New Leads */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Pipeline Leads</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">{leads.length} Leads</span>
            <span className="text-[11px] font-semibold text-purple-600">
              {leads.filter((l) => l.qualification === 'HOT').length} HOT Leads
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Est. Pipeline: ₹{(leads.reduce((sum, l) => sum + l.estimatedValue, 0) / 100000).toFixed(2)}L</p>
        </div>

        {/* Bookings & Check-ins */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Check-ins / Check-outs</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <CalendarCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">{metrics.todayCheckIns} / {metrics.todayCheckOuts}</span>
            <span className="text-[11px] font-semibold text-rose-500">
              {metrics.pendingServiceRequests} Alerts
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Check-ins complete: {activeOccupied.length} active stay</p>
        </div>
      </div>

      {/* Main Grid: Revenue Trend & Today's Operational Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Occupancy Weekly Trend */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-600" />
                Revenue & Occupancy Performance (Weekly)
              </h2>
              <p className="text-xs text-slate-500">Daily financial breakdown and room utilization rate</p>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              Aug 02 - Aug 08, 2026
            </span>
          </div>

          {/* Bar Chart Representation */}
          <div className="space-y-3 pt-2">
            {[
              { day: 'Mon 03', rev: 98000, occ: 65 },
              { day: 'Tue 04', rev: 110000, occ: 72 },
              { day: 'Wed 05', rev: 105000, occ: 70 },
              { day: 'Thu 06', rev: 118000, occ: 75 },
              { day: 'Fri 07', rev: 132000, occ: 82 },
              { day: 'Sat 08 (Today)', rev: 124500, occ: 78, isToday: true },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-700">
                  <span className={item.isToday ? 'font-bold text-indigo-600' : ''}>{item.day}</span>
                  <span>₹{(item?.rev ?? 0).toLocaleString()} • {item.occ}% Occupancy</span>
                </div>
                <div className="flex h-3.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.isToday ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-indigo-500/80'
                    }`}
                    style={{ width: `${item.occ}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" /> Actual Occupancy
            </span>
            <button
              onClick={() => setActiveTab('analytics')}
              className="text-indigo-600 font-semibold hover:underline"
            >
              View Detailed Analytics →
            </button>
          </div>
        </div>

        {/* Pending Service Requests & VIP Arrivals Alert */}
        <div className="space-y-4">
          {/* Urgent Service Requests */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Wrench className="h-4 w-4 text-rose-500" />
                Pending Service Requests ({openRequests.length})
              </h2>
              <button
                onClick={() => setActiveTab('service_requests')}
                className="text-[11px] font-semibold text-indigo-600 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {openRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-xs space-y-1 hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span>Room {req.roomNumber} ({req.type})</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        req.priority === 'urgent'
                          ? 'bg-rose-100 text-rose-700'
                          : req.priority === 'high'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {req.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-tight">{req.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Guest: {req.guestName}</span>
                    <span>Assigned: {req.assignedStaff}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Activity className="h-4 w-4 text-indigo-600" />
              Live Hotel Activity Feed
            </h2>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {activities.slice(0, 5).map((act) => (
                <div key={act.id} className="flex items-start gap-2 text-xs">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{act.title}</p>
                    <p className="text-[11px] text-slate-500">{act.description}</p>
                    <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Expected Arrivals & Check-in Queue Table */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Today's Confirmed Arrival Queue</h2>
            <p className="text-xs text-slate-500">Guests arriving today requiring check-in key issuing</p>
          </div>
          <button
            onClick={() => setActiveTab('checkin_checkout')}
            className="text-xs font-semibold text-indigo-600 hover:underline"
          >
            Launch Guided Check-in →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Res ID</th>
                <th className="py-2.5 px-3">Guest Name</th>
                <th className="py-2.5 px-3">Room Assigned</th>
                <th className="py-2.5 px-3">Nights</th>
                <th className="py-2.5 px-3">Total Folio</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reservations.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{res.id}</td>
                  <td className="py-2.5 px-3">
                    <div className="font-medium text-slate-900">{res.guestName}</div>
                    <div className="text-[10px] text-slate-400">{res.guestPhone}</div>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-700">
                    Room {res.roomNumber} ({res.roomType})
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{res.checkIn} to {res.checkOut}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">₹{(res?.totalAmount ?? 0).toLocaleString()}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        res.status === 'checked_in'
                          ? 'bg-emerald-100 text-emerald-800'
                          : res.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {res.status === 'checked_in' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {res.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {res.status === 'confirmed' && (
                      <button
                        onClick={() => setActiveTab('checkin_checkout')}
                        className="rounded bg-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-indigo-700 transition"
                      >
                        Check-in
                      </button>
                    )}
                    {res.status === 'checked_in' && (
                      <button
                        onClick={() => setActiveTab('checkin_checkout')}
                        className="rounded border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        Check-out
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
