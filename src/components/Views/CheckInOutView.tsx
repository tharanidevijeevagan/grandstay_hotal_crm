import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Reservation } from '../../types';
import { KeyRound, LogOut, CheckCircle2, FileText, IndianRupee, ShieldCheck, Printer, ArrowRight } from 'lucide-react';

export const CheckInOutView: React.FC = () => {
  const { reservations, performCheckIn, performCheckOut } = useHotel();
  const [activeTab, setActiveTab] = useState<'checkin' | 'checkout'>('checkin');

  // Check-in state
  const confirmedReservations = reservations.filter((r) => r.status === 'confirmed');
  const [selectedCheckInRes, setSelectedCheckInRes] = useState<Reservation | null>(
    confirmedReservations[0] || null
  );
  const [checkInStep, setCheckInStep] = useState<number>(1);
  const [idVerified, setIdVerified] = useState(true);

  // Check-out state
  const checkedInReservations = reservations.filter((r) => r.status === 'checked_in');
  const [selectedCheckOutRes, setSelectedCheckOutRes] = useState<Reservation | null>(
    checkedInReservations[0] || null
  );
  const [fnbCharges, setFnbCharges] = useState(1850);
  const [extraServiceCharges, setExtraServiceCharges] = useState(500);
  const [isInvoiceGenerated, setIsInvoiceGenerated] = useState(false);

  const handleCompleteCheckIn = () => {
    if (!selectedCheckInRes) return;
    performCheckIn(selectedCheckInRes.id);
    setCheckInStep(4);
  };

  const handleCompleteCheckOut = () => {
    if (!selectedCheckOutRes) return;
    const totalExtras = fnbCharges + extraServiceCharges;
    performCheckOut(selectedCheckOutRes.id, totalExtras);
    setIsInvoiceGenerated(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Front Desk Check-in & Check-out</h1>
          <p className="text-xs text-slate-500">Guided guest check-in workflow and automated checkout billing folio calculation.</p>
        </div>

        <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            onClick={() => setActiveTab('checkin')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeTab === 'checkin' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>Guided Check-in ({confirmedReservations.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('checkout')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeTab === 'checkout' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Check-out Folio ({checkedInReservations.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'checkin' ? (
        /* GUIDED CHECK-IN WORKFLOW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Select Reservation List (Left 4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Expected Arrivals Today</h2>
            <div className="space-y-2">
              {confirmedReservations.map((res) => {
                const isSelected = selectedCheckInRes?.id === res.id;
                return (
                  <div
                    key={res.id}
                    onClick={() => {
                      setSelectedCheckInRes(res);
                      setCheckInStep(1);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-900 text-xs">{res.guestName}</span>
                      <span className="font-mono text-[10px] text-slate-400 font-bold">{res.id}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      Room {res.roomNumber} ({res.roomType})
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                      <span>{res.checkIn} to {res.checkOut}</span>
                      <span className="font-bold text-indigo-700">₹{(res?.totalAmount ?? 0).toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}

              {confirmedReservations.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs border rounded-xl bg-white">
                  All expected check-ins for today have been completed.
                </div>
              )}
            </div>
          </div>

          {/* Guided Step Workflow (Right 8 cols) */}
          <div className="lg:col-span-8">
            {selectedCheckInRes ? (
              <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-6">
                {/* Step Indicators */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-xs font-bold">
                  {[
                    { num: 1, label: '1. Booking Verification' },
                    { num: 2, label: '2. Guest ID Check' },
                    { num: 3, label: '3. Room Key & Complete' },
                  ].map((s) => (
                    <div
                      key={s.num}
                      className={`flex items-center gap-1.5 ${
                        checkInStep >= s.num ? 'text-indigo-600' : 'text-slate-400'
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                          checkInStep >= s.num ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {s.num}
                      </span>
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* Step 1: Verification */}
                {checkInStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">Step 1: Verify Reservation Details</h3>
                    <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Guest Name</span>
                        <span className="font-bold text-slate-900 text-sm">{selectedCheckInRes.guestName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Room Assigned</span>
                        <span className="font-bold text-indigo-700 text-sm">Room {selectedCheckInRes.roomNumber}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Stay Dates</span>
                        <span className="font-medium text-slate-800">{selectedCheckInRes.checkIn} to {selectedCheckInRes.checkOut}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Status</span>
                        <span className="font-bold text-emerald-700 uppercase">{selectedCheckInRes.paymentStatus} (₹{(selectedCheckInRes?.paidAmount ?? 0).toLocaleString()})</span>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => setCheckInStep(2)}
                        className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                      >
                        <span>Proceed to ID Check</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: ID Check */}
                {checkInStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">Step 2: Guest ID Verification</h3>
                    <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50 text-xs">
                      <div className="flex items-center gap-2 text-slate-800 font-semibold">
                        <ShieldCheck className="h-5 w-5 text-indigo-600" />
                        <span>Government Photo ID Verification (Aadhaar / Passport)</span>
                      </div>
                      <p className="text-slate-500">
                        Please verify the original physical ID of {selectedCheckInRes.guestName} before handing over room keys.
                      </p>

                      <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 pt-2">
                        <input
                          type="checkbox"
                          checked={idVerified}
                          onChange={(e) => setIdVerified(e.target.checked)}
                          className="rounded text-indigo-600"
                        />
                        <span>I confirm guest ID and photo match database details.</span>
                      </label>
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={() => setCheckInStep(1)}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setCheckInStep(3)}
                        disabled={!idVerified}
                        className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50 hover:bg-indigo-700"
                      >
                        <span>Proceed to Key Issuance</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Key Issuance & Confirm */}
                {checkInStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">Step 3: Issue RFID Room Key & Check-in</h3>
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 space-y-2 text-xs text-emerald-900">
                      <div className="font-bold flex items-center gap-2 text-sm">
                        <KeyRound className="h-5 w-5 text-emerald-600" />
                        <span>Ready to Issue Keycard for Room {selectedCheckInRes.roomNumber}</span>
                      </div>
                      <p className="text-emerald-800">
                        Click 'Complete Check-in' below to activate room access, mark room as Occupied in PMS, and log check-in event.
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={() => setCheckInStep(2)}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleCompleteCheckIn}
                        className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                      >
                        Complete Guest Check-in
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Complete */}
                {checkInStep === 4 && (
                  <div className="p-8 text-center space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Guest Checked In Successfully!</h3>
                    <p className="text-xs text-slate-500">
                      {selectedCheckInRes.guestName} is now active in Room {selectedCheckInRes.roomNumber}.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 text-xs border rounded-xl bg-white">
                Select an expected arrival from the queue to start guided check-in.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* CHECK-OUT FOLIO CALCULATOR */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active Guests List */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Active Checked-in Guests</h2>
            <div className="space-y-2">
              {checkedInReservations.map((res) => {
                const isSelected = selectedCheckOutRes?.id === res.id;
                return (
                  <div
                    key={res.id}
                    onClick={() => {
                      setSelectedCheckOutRes(res);
                      setIsInvoiceGenerated(false);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-900 text-xs">{res.guestName}</span>
                      <span className="font-mono text-[10px] text-slate-400 font-bold">Room {res.roomNumber}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                      <span>{res.checkIn} to {res.checkOut}</span>
                      <span className="font-bold text-slate-900">₹{(res?.totalAmount ?? 0).toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Folio Calculator */}
          <div className="lg:col-span-8">
            {selectedCheckOutRes ? (
              <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Checkout Folio Calculation</h3>
                    <p className="text-xs text-slate-500">Room {selectedCheckOutRes.roomNumber} • {selectedCheckOutRes.guestName}</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
                    {selectedCheckOutRes.id}
                  </span>
                </div>

                {/* Calculation Breakdown Table */}
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-600">Base Room Charge ({selectedCheckOutRes.roomType}):</span>
                    <span className="font-bold text-slate-900">₹{(selectedCheckOutRes?.totalAmount ?? 0).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-slate-600">Food & Beverage (Room Service / Dining):</span>
                    <input
                      type="number"
                      value={fnbCharges}
                      onChange={(e) => setFnbCharges(Number(e.target.value))}
                      className="w-28 rounded border border-slate-200 px-2 py-1 text-right text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-slate-600">Extra Services (Laundry / Spa / Shuttle):</span>
                    <input
                      type="number"
                      value={extraServiceCharges}
                      onChange={(e) => setExtraServiceCharges(Number(e.target.value))}
                      className="w-28 rounded border border-slate-200 px-2 py-1 text-right text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div className="flex justify-between border-b border-slate-100 pb-2 text-rose-600">
                    <span>Less Advance / Pre-payments:</span>
                    <span className="font-bold">- ₹{(selectedCheckOutRes?.paidAmount ?? 0).toLocaleString()}</span>
                  </div>

                  {/* Final Payable */}
                  <div className="flex justify-between bg-slate-900 text-white p-4 rounded-xl text-sm font-bold">
                    <span>Final Balance Payable:</span>
                    <span className="text-emerald-400 font-mono text-base">
                      ₹{(
                        (selectedCheckOutRes?.totalAmount ?? 0) +
                        (fnbCharges || 0) +
                        (extraServiceCharges || 0) -
                        (selectedCheckOutRes?.paidAmount ?? 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print Invoice Folio</span>
                  </button>

                  <button
                    onClick={handleCompleteCheckOut}
                    disabled={isInvoiceGenerated}
                    className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-700 transition disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{isInvoiceGenerated ? 'Check-out Completed' : 'Confirm Check-out & Settle Balance'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 text-xs border rounded-xl bg-white">
                Select an active guest to calculate final invoice and complete check-out.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
