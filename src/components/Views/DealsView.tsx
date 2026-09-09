import React from 'react';
import { useHotel } from '../../context/HotelContext';
import { Target, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

export const DealsView: React.FC = () => {
  const { deals = [] } = useHotel();

  const stages = ['New', 'Contacted', 'Quotation', 'Negotiation', 'Won', 'Lost'] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sales Deals & Opportunities Pipeline</h1>
          <p className="text-xs text-slate-500">Track high-value group bookings, wedding blocks, and corporate sales negotiations.</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-sm">
          <Plus className="h-4 w-4" />
          <span>New Deal Opportunity</span>
        </button>
      </div>

      {/* Kanban Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage);
          const totalVal = stageDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div key={stage} className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 flex flex-col space-y-3 min-w-[200px]">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-700">{stage}</span>
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                  {stageDeals.length}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold">₹{(totalVal ?? 0).toLocaleString()}</p>

              <div className="space-y-2.5 flex-1">
                {stageDeals.map((deal) => (
                  <div key={deal.id} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm space-y-2 hover:border-indigo-400 transition">
                    <div className="font-bold text-slate-900 text-xs leading-snug">{deal.title}</div>
                    <div className="text-[11px] text-slate-500">{deal.companyName || deal.leadName}</div>
                    
                    <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                      <span className="font-extrabold text-slate-900">₹{(deal?.value ?? 0).toLocaleString()}</span>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                        {deal.probability}% Prob
                      </span>
                    </div>
                  </div>
                ))}

                {stageDeals.length === 0 && (
                  <div className="p-4 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-lg">
                    No deals in {stage}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
