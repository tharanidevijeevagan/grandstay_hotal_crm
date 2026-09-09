import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Company } from '../../types';
import { Building, Phone, Mail, FileText, IndianRupee, Plus, Search } from 'lucide-react';

export const CompaniesView: React.FC = () => {
  const { companies } = useHotel();
  const [search, setSearch] = useState('');

  const filtered = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Corporate Accounts & Companies</h1>
          <p className="text-xs text-slate-500">Manage corporate agreements, negotiated rate codes, contracts, and revenue generated.</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-sm">
          <Plus className="h-4 w-4" />
          <span>Add Corporate Account</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search corporate client name or contact..."
          className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((company) => (
          <div key={company.id} className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-tight">{company.name}</h3>
                  <span className="text-[11px] text-slate-500">{company.industry}</span>
                </div>
              </div>
              <span className="rounded font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 text-[10px] font-bold">
                -{company.discountPercentage}% OFF
              </span>
            </div>

            <div className="space-y-1.5 text-xs border-y border-slate-100 py-3 text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Rate Code:</span>
                <span className="font-mono font-bold text-slate-800">{company.corporateRateCode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Primary Contact:</span>
                <span className="font-semibold text-slate-800">{company.contactPerson}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Active Contracts:</span>
                <span className="font-semibold text-emerald-600">{company.activeContracts} Active</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Revenue</span>
                <span className="font-extrabold text-slate-900 text-sm">₹{(company?.revenueGenerated ?? 0).toLocaleString()}</span>
              </div>
              <button className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                View Account
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
