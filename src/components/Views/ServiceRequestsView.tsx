import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { ServiceRequest } from '../../types';
import { Wrench, Plus, CheckCircle2, Clock, AlertTriangle, User, Search, Filter } from 'lucide-react';

export const ServiceRequestsView: React.FC = () => {
  const { serviceRequests, addServiceRequest, resolveServiceRequest, rooms } = useHotel();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);

  const [newReq, setNewReq] = useState({
    guestName: 'Sophia Williams',
    roomNumber: '401',
    type: 'Extra Towels' as ServiceRequest['type'],
    description: '2 extra bath sheets requested',
    priority: 'medium' as ServiceRequest['priority'],
    assignedStaff: 'Ramesh (Housekeeping)',
  });

  const filtered = serviceRequests.filter(
    (s) => filterStatus === 'all' || (filterStatus === 'open' ? s.status !== 'resolved' : s.status === filterStatus)
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addServiceRequest(newReq);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Guest Service & Maintenance Requests</h1>
          <p className="text-xs text-slate-500">Track guest requests, maintenance issues, SLA response times, and staff resolution.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>New Service Request</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
        <Filter className="h-3.5 w-3.5 text-slate-400" />
        {['all', 'open', 'resolved'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition capitalize whitespace-nowrap ${
              filterStatus === st ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {st} Requests
          </button>
        ))}
      </div>

      {/* Service Request Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((req) => (
          <div key={req.id} className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-3 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-sm">Room {req.roomNumber} ({req.type})</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                  req.priority === 'urgent'
                    ? 'bg-rose-100 text-rose-800'
                    : req.priority === 'high'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {req.priority}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              "{req.description}"
            </p>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Guest: <strong className="text-slate-800">{req.guestName}</strong></span>
              <span>Assigned: <strong className="text-slate-800">{req.assignedStaff}</strong></span>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
              <span className="text-[10px] text-slate-400">Created: {req.createdAt}</span>
              {req.status !== 'resolved' ? (
                <button
                  onClick={() => resolveServiceRequest(req.id)}
                  className="flex items-center gap-1 rounded bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 transition"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Mark Resolved</span>
                </button>
              ) : (
                <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Resolved at {req.resolvedAt}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <form onSubmit={handleCreate} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm">Log Guest Service Request</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Guest Name</label>
                <input
                  type="text"
                  required
                  value={newReq.guestName}
                  onChange={(e) => setNewReq({ ...newReq, guestName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700">Room Number</label>
                  <select
                    value={newReq.roomNumber}
                    onChange={(e) => setNewReq({ ...newReq, roomNumber: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs"
                  >
                    {rooms.map((r) => (
                      <option key={r.id} value={r.number}>
                        Room {r.number}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Request Type</label>
                  <select
                    value={newReq.type}
                    onChange={(e) => setNewReq({ ...newReq, type: e.target.value as any })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs"
                  >
                    <option value="Extra Towels">Extra Towels</option>
                    <option value="AC Repair">AC Repair</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Room Cleaning">Room Cleaning</option>
                    <option value="Room Service">Room Service</option>
                    <option value="Wi-Fi Issue">Wi-Fi Issue</option>
                    <option value="Airport Transfer">Airport Transfer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Description</label>
                <input
                  type="text"
                  required
                  value={newReq.description}
                  onChange={(e) => setNewReq({ ...newReq, description: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                Log Request
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
