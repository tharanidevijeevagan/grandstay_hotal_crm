import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Reservation } from '../../types';
import { CalendarCheck, Plus, Search, Filter, CheckCircle2, Clock, XCircle, IndianRupee } from 'lucide-react';

export const ReservationsView: React.FC = () => {
  const { reservations, addReservation, rooms } = useHotel();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    guestName: 'Kavita Nair',
    guestPhone: '+91 98765 00112',
    guestEmail: 'kavita.nair@gmail.com',
    roomNumber: '202',
    roomType: 'Deluxe Room',
    checkIn: '2026-08-10',
    checkOut: '2026-08-13',
    guestCount: 2,
    nightlyRate: 9500,
    paidAmount: 9500,
    paymentStatus: 'partial' as Reservation['paymentStatus'],
    bookingSource: 'Direct Website',
    specialRequests: 'High floor preferred',
  });

  const filtered = reservations.filter((r) => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchesSearch =
      r.guestName.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.roomNumber.includes(search);
    return matchesStatus && matchesSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const nights = 3;
    const totalAmount = form.nightlyRate * nights;

    addReservation({
      guestId: `G-${Math.floor(100 + Math.random() * 900)}`,
      guestName: form.guestName,
      guestPhone: form.guestPhone,
      guestEmail: form.guestEmail,
      roomNumber: form.roomNumber,
      roomType: form.roomType,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      guestCount: form.guestCount,
      nightlyRate: form.nightlyRate,
      totalAmount,
      paidAmount: form.paidAmount,
      paymentStatus: form.paymentStatus,
      bookingSource: form.bookingSource,
      status: 'confirmed',
      specialRequests: form.specialRequests,
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Reservations & Bookings</h1>
          <p className="text-xs text-slate-500">Manage individual and group room reservations, check-in dates, and payment status.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>New Booking Reservation</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guest name, room or Res ID..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          {['all', 'confirmed', 'checked_in', 'checked_out', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition capitalize whitespace-nowrap ${
                filterStatus === st ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations Table */}
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Res ID</th>
                <th className="py-3 px-4">Guest Info</th>
                <th className="py-3 px-4">Room & Type</th>
                <th className="py-3 px-4">Check-in / Check-out</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">{res.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{res.guestName}</div>
                    <div className="text-[11px] text-slate-400">{res.guestEmail} • {res.guestPhone}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    Room {res.roomNumber} ({res.roomType})
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {res.checkIn} to {res.checkOut}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    ₹{(res?.totalAmount ?? 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold capitalize ${
                        res.paymentStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {res.paymentStatus} (₹{(res?.paidAmount ?? 0).toLocaleString()})
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Reservation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <form onSubmit={handleCreate} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900">Create New Reservation</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Guest Name</label>
                <input
                  type="text"
                  required
                  value={form.guestName}
                  onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700">Select Room</label>
                  <select
                    value={form.roomNumber}
                    onChange={(e) => {
                      const sel = rooms.find((r) => r.number === e.target.value);
                      setForm({
                        ...form,
                        roomNumber: e.target.value,
                        roomType: sel ? sel.roomTypeName : 'Deluxe Room',
                        nightlyRate: sel ? sel.price : 9500,
                      });
                    }}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs"
                  >
                    {rooms.map((r) => (
                      <option key={r.id} value={r.number}>
                        Room {r.number} ({r.roomTypeName}) - ₹{r.price}/night
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Nightly Rate (₹)</label>
                  <input
                    type="number"
                    value={form.nightlyRate}
                    onChange={(e) => setForm({ ...form, nightlyRate: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700">Check-in Date</label>
                  <input
                    type="date"
                    value={form.checkIn}
                    onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Check-out Date</label>
                  <input
                    type="date"
                    value={form.checkOut}
                    onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs"
                  />
                </div>
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
                Confirm Reservation
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
