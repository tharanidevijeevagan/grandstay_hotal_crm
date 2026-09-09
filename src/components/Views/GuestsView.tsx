import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Guest } from '../../types';
import {
  Users,
  Search,
  Sparkles,
  Award,
  Phone,
  Mail,
  MapPin,
  Calendar,
  IndianRupee,
  Bed,
  Utensils,
  XCircle,
  Plus,
  Loader2,
  CheckCircle,
} from 'lucide-react';

export const GuestsView: React.FC = () => {
  const { guests, addGuest, reservations } = useHotel();
  const [searchQuery, setSearchQuery] = useState('');
  const [vipOnly, setVipOnly] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(guests[0] || null);

  // AI Summary generation state
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAiSummary, setLoadingAiSummary] = useState(false);

  // New Guest modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGuest, setNewGuest] = useState({
    name: '',
    email: '',
    phone: '',
    address: 'Bengaluru, India',
    idType: 'Aadhaar Card',
    idNumber: 'XXXX-XXXX-1234',
    vipStatus: false,
    totalStays: 1,
    lifetimeSpend: 25000,
    roomPreferences: ['Deluxe Room', 'Quiet Floor'],
    bedPreferences: 'King Size',
    foodPreferences: ['Vegetarian'],
    specialRequests: 'Prefers high floor',
  });

  const filteredGuests = guests.filter((g) => {
    const matchesVip = !vipOnly || g.vipStatus;
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.phone.includes(searchQuery);
    return matchesVip && matchesSearch;
  });

  const handleGenerateAiSummary = async (guest: Guest) => {
    setLoadingAiSummary(true);
    try {
      const res = await fetch('/api/ai/guest-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guest }),
      });
      const data = await res.json();
      if (data.summary) setAiSummary(data.summary);
    } catch (e) {
      console.error(e);
      setAiSummary(`${guest.name} is a valued guest with ${guest.totalStays} stays totaling ₹${(guest?.lifetimeSpend ?? 0).toLocaleString()}. Prefers ${guest.roomPreferences?.join(', ') || ''}.`);
    } finally {
      setLoadingAiSummary(false);
    }
  };

  const handleSaveGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuest.name) return;
    addGuest({
      ...newGuest,
      aiSummary: `Newly registered guest. Lifetime spend ₹${newGuest.lifetimeSpend}.`,
    });
    setShowAddModal(false);
  };

  const guestStays = reservations.filter((r) => selectedGuest && r.guestName.toLowerCase().includes(selectedGuest.name.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Guest Profile Directory</h1>
          <p className="text-xs text-slate-500">Comprehensive guest histories, preference management, stay analytics, and AI summaries.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Register Guest</span>
        </button>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Guest Directory Column */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search & VIP Toggle */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guest name or contact..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={vipOnly}
                  onChange={(e) => setVipOnly(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>VIP Guests Only</span>
              </label>
              <span className="text-slate-400 text-[11px]">{filteredGuests.length} Guests Listed</span>
            </div>
          </div>

          {/* Directory List */}
          <div className="space-y-2 max-h-[calc(100vh-18rem)] overflow-y-auto">
            {filteredGuests.map((guest) => {
              const isSelected = selectedGuest?.id === guest.id;
              return (
                <div
                  key={guest.id}
                  onClick={() => {
                    setSelectedGuest(guest);
                    setAiSummary(null);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                      : 'border-slate-200/80 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={guest.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                      alt={guest.name}
                      className="h-10 w-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                        <span>{guest.name}</span>
                        {guest.vipStatus && (
                          <span className="rounded-full bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-800 flex items-center gap-0.5 border border-amber-300">
                            <Award className="h-2.5 w-2.5 text-amber-600" /> VIP
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">{guest.email}</p>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <div className="font-bold text-slate-900">₹{(guest?.lifetimeSpend ?? 0).toLocaleString()}</div>
                    <span className="text-[10px] text-slate-400">{guest.totalStays} Stays</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detailed Guest Profile View */}
        <div className="lg:col-span-7">
          {selectedGuest ? (
            <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-6">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedGuest.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                    alt={selectedGuest.name}
                    className="h-16 w-16 rounded-2xl object-cover border-2 border-indigo-100 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">{selectedGuest.name}</h2>
                      {selectedGuest.vipStatus && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800 border border-amber-300">
                          VIP GUEST
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span><MapPin className="h-3 w-3 inline mr-1" />{selectedGuest.address}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-right space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lifetime Spend</span>
                  <span className="text-lg font-extrabold text-slate-900">₹{(selectedGuest?.lifetimeSpend ?? 0).toLocaleString()}</span>
                  <span className="text-[11px] text-indigo-600 font-semibold block">{selectedGuest.totalStays} Completed Stays</span>
                </div>
              </div>

              {/* AI Guest Executive Summary Box */}
              <div className="rounded-xl bg-gradient-to-r from-purple-900 to-indigo-950 p-4 text-white shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-300" /> AI Executive Guest Summary
                  </span>
                  <button
                    onClick={() => handleGenerateAiSummary(selectedGuest)}
                    disabled={loadingAiSummary}
                    className="rounded bg-white/10 hover:bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-purple-200 transition"
                  >
                    {loadingAiSummary ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Re-generate AI Summary'}
                  </button>
                </div>
                <p className="text-xs text-purple-100 leading-relaxed">
                  {aiSummary || selectedGuest.aiSummary || "Click 'Re-generate AI Summary' to query Gemini for an instant operational guest summary."}
                </p>
              </div>

              {/* Preferences Cards */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                  Guest Preferences & Special Requirements
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <Bed className="h-3.5 w-3.5 text-indigo-600" /> Room & Bed
                    </span>
                    <p className="font-semibold text-slate-800">{selectedGuest.bedPreferences}</p>
                    <p className="text-[11px] text-slate-500">{selectedGuest.roomPreferences?.join(', ') || ''}</p>
                  </div>

                  <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <Utensils className="h-3.5 w-3.5 text-emerald-600" /> Food & Dining
                    </span>
                    <p className="font-semibold text-slate-800">{selectedGuest.foodPreferences?.join(', ') || ''}</p>
                  </div>

                  <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-purple-600" /> Special Instructions
                    </span>
                    <p className="font-semibold text-slate-800">{selectedGuest.specialRequests || 'None'}</p>
                  </div>
                </div>
              </div>

              {/* Stay History Table */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                  Reservation Stay History
                </h3>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Reservation</th>
                        <th className="py-2.5 px-3">Room</th>
                        <th className="py-2.5 px-3">Dates</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {guestStays.map((s) => (
                        <tr key={s.id}>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{s.id}</td>
                          <td className="py-2.5 px-3">Room {s.roomNumber} ({s.roomType})</td>
                          <td className="py-2.5 px-3 text-slate-600">{s.checkIn} to {s.checkOut}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">₹{(s?.totalAmount ?? 0).toLocaleString()}</td>
                          <td className="py-2.5 px-3">
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                              {s.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {guestStays.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-4 text-center text-slate-400 text-xs">
                            No active stay history found for this profile.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200/80 bg-white p-12 text-center text-slate-400 text-xs">
              Select a guest from the directory to inspect profile & AI summary.
            </div>
          )}
        </div>
      </div>

      {/* Add New Guest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <form onSubmit={handleSaveGuest} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900">Register New Guest</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={newGuest.name}
                  onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700">Email</label>
                  <input
                    type="email"
                    required
                    value={newGuest.email}
                    onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Phone</label>
                  <input
                    type="text"
                    required
                    value={newGuest.phone}
                    onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700">ID Type</label>
                  <select
                    value={newGuest.idType}
                    onChange={(e) => setNewGuest({ ...newGuest, idType: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs"
                  >
                    <option value="Aadhaar Card">Aadhaar Card</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving License">Driving License</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700">ID Number</label>
                  <input
                    type="text"
                    value={newGuest.idNumber}
                    onChange={(e) => setNewGuest({ ...newGuest, idNumber: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="vip"
                  checked={newGuest.vipStatus}
                  onChange={(e) => setNewGuest({ ...newGuest, vipStatus: e.target.checked })}
                  className="rounded text-indigo-600"
                />
                <label htmlFor="vip" className="font-semibold text-slate-800">
                  Tag as VIP Guest
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-lg border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                Save Guest Profile
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
