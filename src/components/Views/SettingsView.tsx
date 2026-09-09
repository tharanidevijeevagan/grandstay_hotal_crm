import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Building, ShieldCheck, Users, Sliders, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentUser = { name: 'Active User', role: 'admin' }, switchUserRole = () => {} } = useHotel();
  const [saved, setSaved] = useState(false);

  const [hotelSettings, setHotelSettings] = useState({
    hotelName: 'Grand Horizon Resort & Spa',
    address: '42 Beach Road, ECR, Chennai - 600041',
    currency: 'INR (₹)',
    checkoutTime: '11:00 AM',
    checkinTime: '02:00 PM',
    taxRate: 18,
    geminiApiKeyStatus: 'Active (Environment Secret Injected)',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Hotel & Role Configuration Settings</h1>
          <p className="text-xs text-slate-500">Configure property parameters, staff role access control, and AI integration parameters.</p>
        </div>
      </div>

      {/* Role Switcher Test Panel */}
      <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-indigo-600" />
          <div>
            <h3 className="font-bold text-slate-900 text-xs">Simulate Role Access Control</h3>
            <p className="text-[11px] text-slate-500">Switch active user role to verify menu permissions and view restrictions.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { role: 'admin', name: 'Rajesh Sharma (Admin)' },
            { role: 'manager', name: 'Ananya Roy (Manager)' },
            { role: 'receptionist', name: 'Vikram Singh (Receptionist)' },
            { role: 'sales', name: 'Priya Sharma (Sales)' },
            { role: 'housekeeping', name: 'Ramesh Kumar (Housekeeping)' },
          ].map((item) => (
            <button
              key={item.role}
              onClick={() => switchUserRole(item.role as any)}
              className={`rounded-lg px-3 py-1.5 font-bold transition ${
                currentUser.role === item.role
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Hotel Property Settings */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-slate-900 text-sm">Property Profile Settings</h2>

        <div className="space-y-3 text-xs max-w-xl">
          <div>
            <label className="font-semibold text-slate-700">Hotel Property Name</label>
            <input
              type="text"
              value={hotelSettings.hotelName}
              onChange={(e) => setHotelSettings({ ...hotelSettings, hotelName: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700">Property Address</label>
            <input
              type="text"
              value={hotelSettings.address}
              onChange={(e) => setHotelSettings({ ...hotelSettings, address: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700">Check-in Time</label>
              <input
                type="text"
                value={hotelSettings.checkinTime}
                onChange={(e) => setHotelSettings({ ...hotelSettings, checkinTime: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700">Check-out Time</label>
              <input
                type="text"
                value={hotelSettings.checkoutTime}
                onChange={(e) => setHotelSettings({ ...hotelSettings, checkoutTime: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
          <button
            onClick={handleSave}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition"
          >
            Save Settings
          </button>
          {saved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Property settings saved successfully.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
