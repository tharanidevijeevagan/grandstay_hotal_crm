import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { InboxMessage } from '../../types';
import { Mail, MessageSquare, PhoneCall, Sparkles, Send, User, Search } from 'lucide-react';

export const UnifiedInboxView: React.FC = () => {
  const { inboxMessages = [], addInboxMessage } = useHotel();
  const [selectedMsg, setSelectedMsg] = useState<InboxMessage | null>((inboxMessages && inboxMessages[0]) || null);
  const [replyText, setReplyText] = useState('');
  const [loadingAiReply, setLoadingAiReply] = useState(false);

  const handleGenerateAiReply = async () => {
    if (!selectedMsg) return;
    setLoadingAiReply(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Draft a professional hotel staff response to this inquiry from ${selectedMsg.senderName} (${selectedMsg.channel}): "${selectedMsg.content}"`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setReplyText(data.reply);
          return;
        }
      }
      setReplyText(`Dear ${selectedMsg.senderName},\n\nThank you for reaching out to Grand Horizon Resort. We would be delighted to assist you with your inquiry regarding room availability and corporate packages.\n\nWarm regards,\nReservations Team`);
    } catch (e) {
      console.error(e);
      setReplyText(`Dear ${selectedMsg.senderName},\n\nThank you for reaching out to Grand Horizon Resort. We would be delighted to assist you with your inquiry regarding room availability and corporate packages.\n\nWarm regards,\nReservations Team`);
    } finally {
      setLoadingAiReply(false);
    }
  };

  const handleSendReply = () => {
    if (!selectedMsg || !replyText) return;
    addInboxMessage({
      senderName: 'Hotel Staff (You)',
      senderContact: 'reservations@grandhorizon.com',
      channel: selectedMsg.channel,
      content: replyText,
      status: 'replied',
      sentiment: 'positive',
    });
    setReplyText('');
  };

  const getChannelBadge = (ch: InboxMessage['channel']) => {
    switch (ch) {
      case 'WhatsApp': return 'bg-emerald-100 text-emerald-800';
      case 'Email': return 'bg-indigo-100 text-indigo-800';
      case 'Website Chat':
      case 'Website chat': return 'bg-purple-100 text-purple-800';
      case 'SMS': return 'bg-blue-100 text-blue-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Unified Communication Inbox</h1>
          <p className="text-xs text-slate-500">Consolidated guest messages from WhatsApp, Email, Web Chat, and SMS with AI drafting.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-16rem)]">
        {/* Messages List (Left 5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm space-y-2 overflow-y-auto">
          <div className="space-y-2">
            {inboxMessages.map((msg) => {
              const isSelected = selectedMsg?.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMsg(msg)}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                      : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{msg.senderName}</span>
                    <span className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${getChannelBadge(msg.channel)}`}>
                      {msg.channel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">{msg.content}</p>
                  <div className="text-[10px] text-slate-400 mt-2 flex justify-between">
                    <span>{msg.timestamp}</span>
                    <span className="capitalize font-semibold text-indigo-600">{msg.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Message Inspector & AI Drafter (Right 7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          {selectedMsg ? (
            <div className="flex flex-col h-full justify-between space-y-4">
              {/* Message Header */}
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">{selectedMsg.senderName}</h3>
                  <span className={`rounded px-2 py-0.5 text-xs font-bold ${getChannelBadge(selectedMsg.channel)}`}>
                    {selectedMsg.channel}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{selectedMsg.senderContact}</p>
              </div>

              {/* Message Bubble */}
              <div className="flex-1 overflow-y-auto bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Received Inquiry</span>
                <p className="text-slate-800 leading-relaxed font-medium">{selectedMsg.content}</p>
              </div>

              {/* AI Draft & Reply Box */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Draft Staff Response</span>
                  <button
                    onClick={handleGenerateAiReply}
                    disabled={loadingAiReply}
                    className="flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                    <span>{loadingAiReply ? 'Drafting with AI...' : 'Draft Response with AI'}</span>
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type message or click 'Draft Response with AI'..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleSendReply}
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Reply</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs my-auto">
              Select a conversation to reply or generate AI responses.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
