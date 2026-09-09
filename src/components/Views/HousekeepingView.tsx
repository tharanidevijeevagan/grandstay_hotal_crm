import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { HousekeepingTask } from '../../types';
import { ClipboardList, Plus, CheckCircle2, Clock, AlertTriangle, Sparkles, User, Filter } from 'lucide-react';

export const HousekeepingView: React.FC = () => {
  const { housekeeping, updateHousekeepingStatus, addHousekeepingTask, rooms } = useHotel();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);

  const [newTask, setNewTask] = useState({
    roomNumber: '202',
    taskType: 'Full Clean' as HousekeepingTask['taskType'],
    priority: 'high' as HousekeepingTask['priority'],
    assignedTo: 'Ramesh (Housekeeping)',
    notes: 'Check mini fridge and replenish towels',
  });

  const filtered = housekeeping.filter(
    (t) => filterStatus === 'all' || t.status === filterStatus
  );

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    addHousekeepingTask({
      roomNumber: newTask.roomNumber,
      taskType: newTask.taskType,
      priority: newTask.priority,
      assignedTo: newTask.assignedTo,
      status: 'pending',
      notes: newTask.notes,
    });
    setShowModal(false);
  };

  const getPriorityBadge = (p: HousekeepingTask['priority']) => {
    switch (p) {
      case 'urgent': return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'high': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Housekeeping Operations</h1>
          <p className="text-xs text-slate-500">Track room cleaning schedules, assignments, and supervisor readiness inspections.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Cleaning Task</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
        <Filter className="h-3.5 w-3.5 text-slate-400" />
        {['all', 'pending', 'assigned', 'in_progress', 'inspection', 'ready'].map((st) => (
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

      {/* Housekeeping Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((task) => (
          <div key={task.id} className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-3 hover:border-slate-300 transition">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-sm">Room {task.roomNumber}</span>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${getPriorityBadge(task.priority)}`}>
                {task.priority}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="font-semibold text-slate-800">{task.taskType}</div>
              <p className="text-[11px] text-slate-500">{task.notes}</p>
              <div className="text-[10px] text-slate-400 pt-1">
                Assigned: <span className="font-semibold text-slate-700">{task.assignedTo}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
              <span className="text-[10px] text-slate-400">{task.createdAt}</span>
              <select
                value={task.status}
                onChange={(e) => updateHousekeepingStatus(task.id, e.target.value as HousekeepingTask['status'])}
                className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-800"
              >
                <option value="pending">PENDING</option>
                <option value="in_progress">IN PROGRESS</option>
                <option value="inspection">INSPECTION</option>
                <option value="ready">READY (CLEAN)</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <form onSubmit={handleCreateTask} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm">Assign Housekeeping Task</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Select Room</label>
                <select
                  value={newTask.roomNumber}
                  onChange={(e) => setNewTask({ ...newTask, roomNumber: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.number}>
                      Room {r.number} ({r.roomTypeName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Task Type</label>
                <select
                  value={newTask.taskType}
                  onChange={(e) => setNewTask({ ...newTask, taskType: e.target.value as any })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs"
                >
                  <option value="Full Clean">Full Clean</option>
                  <option value="Touch Up">Touch Up</option>
                  <option value="Deep Clean">Deep Clean</option>
                  <option value="Linen Change">Linen Change</option>
                  <option value="Inspection">Inspection</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Notes / Instructions</label>
                <input
                  type="text"
                  value={newTask.notes}
                  onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
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
                Save Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
