import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Room } from '../../types';
import { BedDouble, CheckCircle2, AlertTriangle, Sparkles, Wrench, Ban, User, ShieldAlert } from 'lucide-react';

export const RoomsView: React.FC = () => {
  const { rooms, updateRoomStatus } = useHotel();
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(rooms[0] || null);

  const floors = Array.from(new Set(rooms.map((r) => r.floor))).sort();

  const filteredRooms = rooms.filter(
    (r) => selectedFloor === 'all' || r.floor === selectedFloor
  );

  const getStatusBadge = (status: Room['status']) => {
    switch (status) {
      case 'available':
        return { label: 'Available', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'occupied':
        return { label: 'Occupied', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'reserved':
        return { label: 'Reserved', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'cleaning':
        return { label: 'Cleaning', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'maintenance':
        return { label: 'Maintenance', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'out_of_order':
        return { label: 'Out of Order', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
      default:
        return { label: status, bg: 'bg-slate-100 text-slate-700' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Rooms & Visual Floor Plan Grid</h1>
          <p className="text-xs text-slate-500">Real-time room occupancy, housekeeping readiness, and maintenance statuses.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Filter Floor:</span>
          <button
            onClick={() => setSelectedFloor('all')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
              selectedFloor === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Floors
          </button>
          {floors.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFloor(f)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                selectedFloor === f ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Floor {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Room Grid (Left 8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredRooms.map((room) => {
              const badge = getStatusBadge(room.status);
              const isSelected = selectedRoom?.id === room.id;

              return (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`relative flex flex-col justify-between rounded-xl border p-3.5 transition cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20 shadow-md'
                      : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold text-slate-900">Room {room.number}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1">
                    <div className="text-xs font-semibold text-slate-800">{room.roomTypeName}</div>
                    <div className="text-[11px] text-slate-500">₹{(room?.price ?? 0).toLocaleString()} / night</div>
                    {room.currentGuestName && (
                      <div className="text-[11px] font-medium text-indigo-700 truncate flex items-center gap-1 mt-1">
                        <User className="h-3 w-3" /> {room.currentGuestName}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Floor {room.floor}</span>
                    <span className="capitalize font-semibold text-slate-600">{room.housekeepingStatus}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Room Inspector (Right 4 cols) */}
        <div className="lg:col-span-4">
          {selectedRoom ? (
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-5 sticky top-20">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-slate-900">Room {selectedRoom.number} Details</h3>
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${getStatusBadge(selectedRoom.status).bg}`}>
                    {getStatusBadge(selectedRoom.status).label}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{selectedRoom.roomTypeName} • Floor {selectedRoom.floor}</p>
              </div>

              {/* Guest / Reservation status */}
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 space-y-1.5 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Occupant</span>
                {selectedRoom.currentGuestName ? (
                  <div className="font-bold text-indigo-900">{selectedRoom.currentGuestName}</div>
                ) : (
                  <div className="text-slate-500 font-medium">No guest currently checked in</div>
                )}
                <div className="text-[11px] text-slate-600">Rate: ₹{(selectedRoom?.price ?? 0).toLocaleString()} / night</div>
              </div>

              {/* Features */}
              <div>
                <span className="text-xs font-bold uppercase text-slate-700 block mb-2">Amenities & Features</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRoom.features.map((feat, i) => (
                    <span key={i} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status Manager Controls */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <span className="text-xs font-bold uppercase text-slate-700 block">Override Operational Status</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => updateRoomStatus(selectedRoom.id, 'available', 'clean')}
                    className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 font-semibold text-emerald-800 hover:bg-emerald-100"
                  >
                    Mark Available & Clean
                  </button>
                  <button
                    onClick={() => updateRoomStatus(selectedRoom.id, 'cleaning', 'dirty')}
                    className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 font-semibold text-amber-800 hover:bg-amber-100"
                  >
                    Mark Dirty / Cleaning
                  </button>
                  <button
                    onClick={() => updateRoomStatus(selectedRoom.id, 'maintenance', 'inspecting')}
                    className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 font-semibold text-rose-800 hover:bg-rose-100"
                  >
                    Mark Maintenance
                  </button>
                  <button
                    onClick={() => updateRoomStatus(selectedRoom.id, 'out_of_order')}
                    className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1.5 font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    Out of Order
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs border rounded-xl bg-white">
              Select a room card to view features and override operational status.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
