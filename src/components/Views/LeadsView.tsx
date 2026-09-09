import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Lead } from '../../types';
import {
  UserPlus,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  Filter,
  Search,
  ArrowRight,
  Flame,
  LayoutGrid,
  List,
  MessageSquare,
  TrendingUp,
  Copy,
  Check,
  User,
  Edit3,
  PhoneCall,
  DollarSign,
  Briefcase,
  Globe,
  Tag,
  Clock,
  Send,
  FileText,
  PieChart,
  BarChart3,
  ChevronRight,
  Plus,
  RefreshCw,
  Layers,
  Building2,
  CheckSquare
} from 'lucide-react';

type ViewFormat = 'split' | 'kanban' | 'table' | 'analytics';

const STAGES: { key: Lead['status']; title: string; color: string; badgeBg: string; dotColor: string }[] = [
  { key: 'new', title: 'New Inquiries', color: 'text-blue-700', badgeBg: 'bg-blue-50 text-blue-700 border-blue-200', dotColor: 'bg-blue-500' },
  { key: 'contacted', title: 'Contacted', color: 'text-purple-700', badgeBg: 'bg-purple-50 text-purple-700 border-purple-200', dotColor: 'bg-purple-500' },
  { key: 'interested', title: 'Interested', color: 'text-amber-700', badgeBg: 'bg-amber-50 text-amber-700 border-amber-200', dotColor: 'bg-amber-500' },
  { key: 'quotation_sent', title: 'Quotation Sent', color: 'text-indigo-700', badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200', dotColor: 'bg-indigo-500' },
  { key: 'negotiation', title: 'Negotiation', color: 'text-orange-700', badgeBg: 'bg-orange-50 text-orange-700 border-orange-200', dotColor: 'bg-orange-500' },
  { key: 'won', title: 'Won (Converted)', color: 'text-emerald-700', badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dotColor: 'bg-emerald-500' },
  { key: 'lost', title: 'Lost', color: 'text-slate-600', badgeBg: 'bg-slate-100 text-slate-600 border-slate-200', dotColor: 'bg-slate-400' },
];

export const LeadsView: React.FC = () => {
  const { leads, addLead, updateLeadStatus, convertLeadToReservation, rooms } = useHotel();

  // View format: split (Command Center split-pane), kanban (Pipeline board), table (Data Grid), analytics (Insights)
  const [viewFormat, setViewFormat] = useState<ViewFormat>('split');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [quickTab, setQuickTab] = useState<'all' | 'hot' | 'whatsapp' | 'corporate' | 'won' | 'lost'>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'value' | 'newest'>('score');

  // Selected lead for Master-Detail Command Center
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(leads[0]?.id || null);

  // Copilot Sub-tab state
  const [copilotTab, setCopilotTab] = useState<'response' | 'quote' | 'scoring' | 'notes'>('response');

  // AI Response Generator state
  const [replyChannel, setReplyChannel] = useState<'whatsapp' | 'email' | 'sms'>('whatsapp');
  const [aiResponseText, setAiResponseText] = useState<string>('');
  const [generatingAiResponse, setGeneratingAiResponse] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Custom Quote Builder State
  const [quoteDiscount, setQuoteDiscount] = useState<number>(5);
  const [includeBreakfast, setIncludeBreakfast] = useState<boolean>(true);
  const [includeAirportTransfer, setIncludeAirportTransfer] = useState<boolean>(true);
  const [quoteCustomNotes, setQuoteCustomNotes] = useState<string>('Includes complimentary late check-out till 2:00 PM upon availability.');

  // AI Score breakdown modal
  const [selectedLeadForScore, setSelectedLeadForScore] = useState<Lead | null>(null);
  const [aiScoreExplanation, setAiScoreExplanation] = useState<any | null>(null);
  const [loadingScore, setLoadingScore] = useState(false);

  // New Lead Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    source: 'Website' as Lead['source'],
    requirement: '2 Deluxe Rooms for 3 Nights',
    guestCount: 2,
    expectedCheckIn: '2026-08-20',
    expectedCheckOut: '2026-08-23',
    estimatedValue: 45000,
    assignedStaff: 'Priya Sharma (Sales Mgr)',
    notes: 'Direct inquiry requesting room rates.',
    status: 'new' as Lead['status'],
  });

  // Convert Lead Modal
  const [convertingLead, setConvertingLead] = useState<Lead | null>(null);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('202');

  // Notes addition state
  const [newNoteInput, setNewNoteInput] = useState('');

  // Selected lead reference
  const currentLead = leads.find((l) => l.id === selectedLeadId) || leads[0] || null;

  // Filter & Sort Logic
  const filteredLeads = leads
    .filter((l) => {
      // Quick tab filter
      if (quickTab === 'hot' && l.qualification !== 'HOT') return false;
      if (quickTab === 'whatsapp' && l.source !== 'WhatsApp') return false;
      if (quickTab === 'corporate' && l.source !== 'Corporate') return false;
      if (quickTab === 'won' && l.status !== 'won') return false;
      if (quickTab === 'lost' && l.status !== 'lost') return false;

      // Dropdown filters
      const matchesSource = filterSource === 'all' || l.source === filterSource;
      const matchesStage = filterStage === 'all' || l.status === filterStage;

      // Search query
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        l.name?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.phone?.includes(q) ||
        l.requirement?.toLowerCase().includes(q) ||
        l.assignedStaff?.toLowerCase().includes(q);

      return matchesSource && matchesStage && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.leadScore - a.leadScore;
      if (sortBy === 'value') return b.estimatedValue - a.estimatedValue;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Metrics
  const totalLeads = leads.length;
  const activeLeads = leads.filter((l) => l.status !== 'lost' && l.status !== 'won');
  const totalPipelineValue = activeLeads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0);
  const hotLeadsCount = leads.filter((l) => l.qualification === 'HOT' && l.status !== 'won' && l.status !== 'lost').length;
  const wonLeads = leads.filter((l) => l.status === 'won');
  const conversionRate = totalLeads ? Math.round((wonLeads.length / totalLeads) * 100) : 0;

  const handleAddNoteToLead = () => {
    if (!newNoteInput.trim() || !currentLead) return;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedNote = currentLead.notes
      ? `${currentLead.notes}\n[${timestamp}] ${newNoteInput.trim()}`
      : `[${timestamp}] ${newNoteInput.trim()}`;
    
    // update current lead notes in memory
    currentLead.notes = formattedNote;
    setNewNoteInput('');
  };

  // Handlers
  const handleGenerateAiResponse = async (lead: Lead) => {
    setGeneratingAiResponse(true);
    setAiResponseText('');
    try {
      const res = await fetch('/api/ai/suggest-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: lead.name,
          inquiry: lead.requirement,
          context: `Channel: ${replyChannel.toUpperCase()}. Lead estimated value: ₹${lead.estimatedValue}, Dates: ${lead.expectedCheckIn} to ${lead.expectedCheckOut}, Lead Score: ${lead.leadScore}/100.`
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setAiResponseText(data.reply);
          return;
        }
      }
      generateFallbackResponse(lead, replyChannel);
    } catch (e) {
      generateFallbackResponse(lead, replyChannel);
    } finally {
      setGeneratingAiResponse(false);
    }
  };

  const generateFallbackResponse = (lead: Lead, channel: 'whatsapp' | 'email' | 'sms') => {
    if (channel === 'whatsapp') {
      setAiResponseText(
        `Namaste ${lead.name}! 🙏\nThank you for reaching out to Grand Horizon Hotel regarding ${lead.requirement}.\n\nWe have held premium availability for your dates (${lead.expectedCheckIn} to ${lead.expectedCheckOut}) at an exclusive special rate of ₹${Math.round(lead.estimatedValue * 0.95).toLocaleString()} with complimentary breakfast included.\n\nWould you like me to send over the instant confirmation link? ✨`
      );
    } else if (channel === 'sms') {
      setAiResponseText(
        `Grand Horizon Hotel: Dear ${lead.name}, your rate hold of ₹${Math.round(lead.estimatedValue * 0.95).toLocaleString()} for ${lead.requirement} (${lead.expectedCheckIn}) is valid till 6 PM today. Reply YES to confirm!`
      );
    } else {
      setAiResponseText(
        `Dear ${lead.name},\n\nThank you for contacting Grand Horizon Hotel! We are delighted to assist with your stay inquiry for ${lead.requirement} from ${lead.expectedCheckIn} to ${lead.expectedCheckOut}.\n\nWe are pleased to offer you a special corporate rate option at ₹${Math.round(lead.estimatedValue * 0.95).toLocaleString()} including complimentary breakfast and airport transfers.\n\nPlease let us know if you would like us to block this room for you.\n\nWarm regards,\n${lead.assignedStaff || 'Hotel Sales Team'}`
      );
    }
  };

  const handleFetchAiScore = async (lead: Lead) => {
    setSelectedLeadForScore(lead);
    setLoadingScore(true);
    try {
      const res = await fetch('/api/ai/lead-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead }),
      });
      const data = await res.json();
      setAiScoreExplanation(data);
    } catch (e) {
      setAiScoreExplanation({
        score: lead.leadScore,
        qualification: lead.qualification,
        reasons: lead.scoreReasons || ['High requested booking value', 'Corporate customer history', 'Prompt response history'],
        recommendedAction: 'Schedule follow-up call immediately and offer 5% corporate rate incentive.',
      });
    } finally {
      setLoadingScore(false);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name) return;
    addLead(newLeadForm);
    setShowAddModal(false);
    setNewLeadForm({
      name: '',
      phone: '',
      email: '',
      source: 'Website',
      requirement: '2 Deluxe Rooms for 3 Nights',
      guestCount: 2,
      expectedCheckIn: '2026-08-20',
      expectedCheckOut: '2026-08-23',
      estimatedValue: 45000,
      assignedStaff: 'Priya Sharma (Sales Mgr)',
      notes: '',
      status: 'new',
    });
  };

  const handleConfirmConversion = () => {
    if (!convertingLead) return;
    convertLeadToReservation(convertingLead.id, selectedRoomNumber);
    setConvertingLead(null);
  };

  const generateQuoteText = (lead: Lead) => {
    const discountedVal = Math.round(lead.estimatedValue * (1 - quoteDiscount / 100));
    const inclusions = [
      includeBreakfast ? '✓ Complimentary Buffet Breakfast daily' : null,
      includeAirportTransfer ? '✓ Complimentary Airport Pick-up & Drop' : null,
      quoteCustomNotes ? `✓ ${quoteCustomNotes}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    return `OFFICIAL HOTEL QUOTATION - GRAND HORIZON HOTEL\n--------------------------------------------\nPrepared for: ${lead.name}\nContact: ${lead.email} | ${lead.phone}\nRequirement: ${lead.requirement}\nStay Dates: ${lead.expectedCheckIn} to ${lead.expectedCheckOut} (${lead.guestCount} Guests)\n\nOriginal Rate: ₹${lead.estimatedValue.toLocaleString()}\nSpecial Off-Peak Discount: ${quoteDiscount}%\nFinal Special Package Total: ₹${discountedVal.toLocaleString()}\n\nPackage Inclusions:\n${inclusions}\n\nTo confirm this reservation, please reply back or call us at +91 98765 43210.`;
  };

  const getSourceIcon = (source: Lead['source']) => {
    switch (source) {
      case 'WhatsApp':
        return <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />;
      case 'Website':
        return <Globe className="h-3.5 w-3.5 text-blue-600" />;
      case 'Corporate':
        return <Briefcase className="h-3.5 w-3.5 text-indigo-600" />;
      case 'Walk-in':
        return <User className="h-3.5 w-3.5 text-purple-600" />;
      case 'Phone':
        return <Phone className="h-3.5 w-3.5 text-amber-600" />;
      default:
        return <Tag className="h-3.5 w-3.5 text-slate-500" />;
    }
  };

  const getQualBadge = (qual: Lead['qualification'], score: number) => {
    if (qual === 'HOT') {
      return (
        <span className="inline-flex items-center gap-1 rounded-lg bg-rose-100/90 px-2.5 py-1 text-[11px] font-extrabold text-rose-800 shadow-2xs">
          <Flame className="h-3.5 w-3.5 fill-rose-600 text-rose-600 animate-pulse" />
          <span>{score} HOT</span>
        </span>
      );
    }
    if (qual === 'WARM') {
      return (
        <span className="inline-flex items-center gap-1 rounded-lg bg-amber-100/90 px-2.5 py-1 text-[11px] font-extrabold text-amber-800 shadow-2xs">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          <span>{score} WARM</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
        <span>❄️ {score} COLD</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header & View Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Leads & Inquiries Command Center</h1>
            <span className="rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-extrabold px-3 py-0.5">
              {totalLeads} Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Manage multi-channel guest inquiries, score conversion intent with Gemini AI, send instant WhatsApp/Email pitches, and turn leads into bookings.
          </p>
        </div>

        {/* View Format Segment Control */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-200/70 p-1 rounded-xl">
            <button
              onClick={() => setViewFormat('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewFormat === 'split' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Command View</span>
            </button>
            <button
              onClick={() => setViewFormat('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewFormat === 'kanban' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Pipeline</span>
            </button>
            <button
              onClick={() => setViewFormat('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewFormat === 'table' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>Data Grid</span>
            </button>
            <button
              onClick={() => setViewFormat('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewFormat === 'analytics' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PieChart className="h-3.5 w-3.5" />
              <span>Analytics</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-sm"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add New Lead</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl bg-white p-4 border border-slate-200/70 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Pipeline Value</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-1.5 text-xl font-black text-slate-900">
            ₹{(totalPipelineValue / 100000).toFixed(2)} Lakhs
          </div>
          <span className="text-[11px] text-slate-400 font-medium">{activeLeads.length} Active unclosed inquiries</span>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-rose-100 text-xs font-bold">
            <span>HOT Intent Leads</span>
            <Flame className="h-4 w-4 text-white fill-white" />
          </div>
          <div className="mt-1.5 text-xl font-black text-white">
            {hotLeadsCount} High-Priority
          </div>
          <span className="text-[11px] text-rose-100/90 font-medium">Require fast follow-up today</span>
        </div>

        <div className="rounded-2xl bg-white p-4 border border-slate-200/70 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Conversion Rate</span>
            <TrendingUp className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-1.5 text-xl font-black text-slate-900">
            {conversionRate}%
          </div>
          <span className="text-[11px] text-emerald-600 font-bold">{wonLeads.length} Converted Bookings</span>
        </div>

        <div className="rounded-2xl bg-white p-4 border border-slate-200/70 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Average Response</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-1.5 text-xl font-black text-slate-900">
            12 mins
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Target response &lt; 30 mins</span>
        </div>
      </div>

      {/* Quick Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/70 shadow-2xs">
        {/* Quick Tab Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setQuickTab('all')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap ${
              quickTab === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Inquiries ({totalLeads})
          </button>
          <button
            onClick={() => setQuickTab('hot')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition flex items-center gap-1 whitespace-nowrap ${
              quickTab === 'hot' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <Flame className="h-3.5 w-3.5 fill-current" />
            <span>🔥 Hot Leads ({leads.filter((l) => l.qualification === 'HOT').length})</span>
          </button>
          <button
            onClick={() => setQuickTab('whatsapp')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition flex items-center gap-1 whitespace-nowrap ${
              quickTab === 'whatsapp' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={() => setQuickTab('corporate')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition flex items-center gap-1 whitespace-nowrap ${
              quickTab === 'corporate' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            <span>Corporate</span>
          </button>
          <button
            onClick={() => setQuickTab('won')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition flex items-center gap-1 whitespace-nowrap ${
              quickTab === 'won' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Won ({wonLeads.length})</span>
          </button>
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lead, room, phone..."
              className="w-full rounded-xl bg-slate-50 border border-slate-200/80 pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-xl bg-slate-50 border border-slate-200/80 px-3 py-1.5 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="score">Sort: AI Score</option>
            <option value="value">Sort: Value (₹)</option>
            <option value="newest">Sort: Newest</option>
          </select>
        </div>
      </div>

      {/* FORMAT 1: SPLIT-PANE COMMAND CENTER (MASTER-DETAIL WORKSPACE) */}
      {viewFormat === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[650px]">
          {/* Left Lead List Queue (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/70 p-3 space-y-2 flex flex-col h-[650px] shadow-2xs">
            <div className="px-2 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Inquiry Queue ({filteredLeads.length})</span>
              <span className="text-[10px] font-normal text-slate-400">Click lead to open workspace</span>
            </div>

            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
              {filteredLeads.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No inquiries match your filter criteria.
                </div>
              ) : (
                filteredLeads.map((lead) => {
                  const isSelected = currentLead?.id === lead.id;
                  const stageInfo = STAGES.find((s) => s.key === lead.status);

                  return (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLeadId(lead.id)}
                      className={`group rounded-xl p-3.5 transition duration-150 cursor-pointer border ${
                        isSelected
                          ? 'bg-indigo-50/70 border-indigo-500 shadow-2xs'
                          : 'bg-white border-slate-200/70 hover:border-indigo-300 hover:bg-slate-50/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-xs truncate group-hover:text-indigo-600 transition">
                              {lead.name}
                            </h4>
                            <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 flex-shrink-0">
                              {getSourceIcon(lead.source)}
                              <span>{lead.source}</span>
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                            {lead.requirement}
                          </p>
                        </div>

                        {getQualBadge(lead.qualification, lead.leadScore)}
                      </div>

                      <div className="flex items-center justify-between mt-3 text-[11px] pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{lead.expectedCheckIn}</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${stageInfo?.badgeBg}`}>
                            {stageInfo?.title}
                          </span>
                          <span className="font-extrabold text-slate-900 text-xs">
                            ₹{(lead.estimatedValue || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Lead Workspace & AI Copilot (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/70 p-6 flex flex-col justify-between space-y-6 shadow-2xs h-[650px] overflow-y-auto">
            {currentLead ? (
              <div className="space-y-6">
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-extrabold text-lg shadow-sm">
                      {currentLead.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-900">{currentLead.name}</h2>
                        {getQualBadge(currentLead.qualification, currentLead.leadScore)}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3 text-slate-400" />{currentLead.email}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3 text-slate-400" />{currentLead.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${currentLead.phone}`}
                      className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                      title="Call Lead"
                    >
                      <PhoneCall className="h-4 w-4 text-indigo-600" />
                    </a>
                    <a
                      href={`https://wa.me/${currentLead.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                      title="WhatsApp Message"
                    >
                      <MessageSquare className="h-4 w-4 text-emerald-600" />
                    </a>
                    {currentLead.status !== 'won' && (
                      <button
                        onClick={() => setConvertingLead(currentLead)}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-2xs"
                      >
                        <CheckSquare className="h-4 w-4" />
                        <span>Convert to Booking</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Pipeline Stage Stepper */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Pipeline Progression Stage
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
                    {STAGES.map((st) => {
                      const isActive = currentLead.status === st.key;
                      return (
                        <button
                          key={st.key}
                          onClick={() => updateLeadStatus(currentLead.id, st.key)}
                          className={`rounded-xl py-2 px-1 text-center transition font-bold text-[10px] flex flex-col items-center justify-center gap-1 border ${
                            isActive
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-white' : st.dotColor}`} />
                          <span className="truncate w-full px-0.5">{st.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Requirement Overview Box */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl text-xs">
                  <div>
                    <span className="text-slate-400 font-bold text-[10px] uppercase block">Inquiry Request</span>
                    <span className="font-bold text-slate-900 block mt-0.5">{currentLead.requirement}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold text-[10px] uppercase block">Expected Check-In</span>
                    <span className="font-bold text-slate-900 block mt-0.5">{currentLead.expectedCheckIn}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold text-[10px] uppercase block">Guest Count</span>
                    <span className="font-bold text-slate-900 block mt-0.5">{currentLead.guestCount} Guests</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold text-[10px] uppercase block">Folio Estimate</span>
                    <span className="font-extrabold text-emerald-700 block mt-0.5">
                      ₹{(currentLead.estimatedValue || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Copilot Interactive Toolbar Tabs */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2">
                    <button
                      onClick={() => setCopilotTab('response')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        copilotTab === 'response' ? 'bg-purple-100 text-purple-900' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                      <span>AI Reply Generator</span>
                    </button>
                    <button
                      onClick={() => setCopilotTab('quote')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        copilotTab === 'quote' ? 'bg-indigo-100 text-indigo-900' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <FileText className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Quotation Builder</span>
                    </button>
                    <button
                      onClick={() => setCopilotTab('scoring')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        copilotTab === 'scoring' ? 'bg-amber-100 text-amber-900' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <TrendingUp className="h-3.5 w-3.5 text-amber-600" />
                      <span>AI Intent Breakdown</span>
                    </button>
                    <button
                      onClick={() => setCopilotTab('notes')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        copilotTab === 'notes' ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Edit3 className="h-3.5 w-3.5 text-slate-600" />
                      <span>Notes & History</span>
                    </button>
                  </div>

                  {/* TAB 1: AI REPLY GENERATOR */}
                  {copilotTab === 'response' && (
                    <div className="space-y-3 bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-purple-900">Choose Pitch Channel:</span>
                          <div className="flex bg-white rounded-lg p-0.5 border border-purple-200">
                            <button
                              onClick={() => setReplyChannel('whatsapp')}
                              className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                                replyChannel === 'whatsapp' ? 'bg-emerald-600 text-white' : 'text-slate-600'
                              }`}
                            >
                              WhatsApp
                            </button>
                            <button
                              onClick={() => setReplyChannel('email')}
                              className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                                replyChannel === 'email' ? 'bg-blue-600 text-white' : 'text-slate-600'
                              }`}
                            >
                              Email
                            </button>
                            <button
                              onClick={() => setReplyChannel('sms')}
                              className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                                replyChannel === 'sms' ? 'bg-slate-800 text-white' : 'text-slate-600'
                              }`}
                            >
                              SMS
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => handleGenerateAiResponse(currentLead)}
                          disabled={generatingAiResponse}
                          className="flex items-center gap-1 rounded-xl bg-purple-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-purple-700 transition shadow-2xs disabled:opacity-50"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>{generatingAiResponse ? 'Drafting...' : 'Generate Pitch'}</span>
                        </button>
                      </div>

                      {aiResponseText ? (
                        <div className="space-y-2">
                          <div className="rounded-xl bg-white p-3.5 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed border border-purple-200">
                            {aiResponseText}
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleCopyText(aiResponseText)}
                              className="flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800"
                            >
                              {copiedText ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                              <span>{copiedText ? 'Copied to Clipboard!' : 'Copy Draft'}</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-purple-700/80 leading-relaxed font-medium">
                          Click "Generate Pitch" to let Gemini compose a targeted offer including personalized pricing, room suggestions, and direct call-to-action!
                        </p>
                      )}
                    </div>
                  )}

                  {/* TAB 2: QUOTATION BUILDER */}
                  {copilotTab === 'quote' && (
                    <div className="space-y-4 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Discount %</label>
                          <input
                            type="number"
                            min={0}
                            max={30}
                            value={quoteDiscount}
                            onChange={(e) => setQuoteDiscount(Number(e.target.value))}
                            className="w-full rounded-xl bg-white border border-indigo-200 p-2 font-bold text-xs"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-5">
                          <input
                            type="checkbox"
                            id="bf"
                            checked={includeBreakfast}
                            onChange={(e) => setIncludeBreakfast(e.target.checked)}
                            className="rounded text-indigo-600"
                          />
                          <label htmlFor="bf" className="font-semibold text-slate-800">
                            Buffet Breakfast
                          </label>
                        </div>

                        <div className="flex items-center gap-2 pt-5">
                          <input
                            type="checkbox"
                            id="ap"
                            checked={includeAirportTransfer}
                            onChange={(e) => setIncludeAirportTransfer(e.target.checked)}
                            className="rounded text-indigo-600"
                          />
                          <label htmlFor="ap" className="font-semibold text-slate-800">
                            Airport Pickup
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="rounded-xl bg-white p-3.5 font-mono text-xs text-slate-800 whitespace-pre-wrap border border-indigo-200">
                          {generateQuoteText(currentLead)}
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleCopyText(generateQuoteText(currentLead))}
                            className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy Quotation</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: AI SCORING */}
                  {copilotTab === 'scoring' && (
                    <div className="space-y-3 bg-amber-50/50 p-4 rounded-2xl border border-amber-100 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-amber-800 font-bold block">AI Conversion Score</span>
                          <span className="text-2xl font-black text-amber-900">{currentLead.leadScore} / 100</span>
                        </div>

                        <button
                          onClick={() => handleFetchAiScore(currentLead)}
                          className="flex items-center gap-1 rounded-xl bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-amber-700"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          <span>Re-Analyze</span>
                        </button>
                      </div>

                      <div>
                        <span className="font-bold text-slate-800 block mb-1">Key Positive Signals:</span>
                        <ul className="space-y-1 text-slate-600">
                          {(currentLead.scoreReasons || ['High requested stay value', 'Direct contact provided', 'Corporate traveler profile']).map(
                            (r, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                                <span>{r}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: NOTES */}
                  {copilotTab === 'notes' && (
                    <div className="space-y-3 bg-slate-50 p-4 rounded-2xl text-xs">
                      <div className="space-y-2">
                        <label className="font-bold text-slate-800 block">Lead Notes & Internal Comments</label>
                        <div className="text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80 leading-relaxed font-medium whitespace-pre-wrap max-h-40 overflow-y-auto">
                          {currentLead.notes || 'No custom internal notes recorded yet.'}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          value={newNoteInput}
                          onChange={(e) => setNewNoteInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddNoteToLead()}
                          placeholder="Type internal note or follow-up status..."
                          className="flex-1 rounded-xl bg-white border border-slate-200 px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        <button
                          onClick={handleAddNoteToLead}
                          className="flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span>Add Note</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400">Select an inquiry from the queue to open the workspace.</div>
            )}
          </div>
        </div>
      )}

      {/* FORMAT 2: KANBAN PIPELINE BOARD */}
      {viewFormat === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage.key);
            const stageValue = stageLeads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0);

            return (
              <div
                key={stage.key}
                className="flex flex-col rounded-2xl bg-slate-100/80 p-3 min-w-[240px] max-w-[280px] space-y-3 min-h-[500px]"
              >
                <div className="flex items-center justify-between px-1 py-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${stage.dotColor}`} />
                    <span className="font-bold text-xs text-slate-800">{stage.title}</span>
                  </div>
                  <span className="rounded-full bg-white text-slate-600 font-extrabold text-[10px] px-2 py-0.5 shadow-2xs">
                    {stageLeads.length}
                  </span>
                </div>
                <div className="text-[10px] font-semibold text-slate-400 px-1 -mt-1">
                  Total: ₹{(stageValue / 1000).toFixed(0)}k
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto pr-0.5">
                  {stageLeads.length === 0 ? (
                    <div className="rounded-xl bg-white/60 p-4 text-center text-[11px] text-slate-400 font-medium">
                      No inquiries
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="group rounded-xl bg-white p-3.5 shadow-2xs hover:shadow-md transition duration-150 space-y-2.5 cursor-pointer border border-slate-200/60 hover:border-indigo-400"
                        onClick={() => {
                          setSelectedLeadId(lead.id);
                          setViewFormat('split');
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                            {getSourceIcon(lead.source)}
                            <span>{lead.source}</span>
                          </span>

                          {getQualBadge(lead.qualification, lead.leadScore)}
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-900 text-xs group-hover:text-indigo-600 transition truncate">
                            {lead.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug font-medium">
                            {lead.requirement}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            <span>{lead.expectedCheckIn}</span>
                          </span>
                          <span className="font-semibold text-slate-600">{lead.guestCount} guests</span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div>
                            <span className="text-[9px] text-slate-400 uppercase font-bold block">Est. Value</span>
                            <span className="text-xs font-extrabold text-slate-900">
                              ₹{(lead?.estimatedValue ?? 0).toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            {lead.status !== 'won' && (
                              <button
                                title="Convert to Reservation"
                                onClick={() => setConvertingLead(lead)}
                                className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 hover:bg-emerald-100 transition"
                              >
                                Convert
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                          <span className="text-[10px] text-slate-400 font-medium">Stage:</span>
                          <select
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                            className="text-[10px] font-bold text-slate-700 bg-slate-50 rounded px-1.5 py-0.5 focus:outline-none cursor-pointer border-0"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="interested">Interested</option>
                            <option value="quotation_sent">Quotation Sent</option>
                            <option value="negotiation">Negotiation</option>
                            <option value="won">Won (Converted)</option>
                            <option value="lost">Lost</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FORMAT 3: DATA GRID / TABLE */}
      {viewFormat === 'table' && (
        <div className="rounded-2xl bg-white shadow-2xs border border-slate-200/70 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200/70">
                <tr>
                  <th className="py-3.5 px-4">Lead Name & Contact</th>
                  <th className="py-3.5 px-4">Channel</th>
                  <th className="py-3.5 px-4">AI Score</th>
                  <th className="py-3.5 px-4">Requirement</th>
                  <th className="py-3.5 px-4">Stay Dates</th>
                  <th className="py-3.5 px-4">Est. Value</th>
                  <th className="py-3.5 px-4">Pipeline Stage</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No leads found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50/80 transition cursor-pointer"
                      onClick={() => {
                        setSelectedLeadId(lead.id);
                        setViewFormat('split');
                      }}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 hover:text-indigo-600 transition">{lead.name}</div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-medium">
                          <span>{lead.phone}</span>
                          <span>•</span>
                          <span>{lead.email}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">
                          {getSourceIcon(lead.source)}
                          <span>{lead.source}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => handleFetchAiScore(lead)}>
                          {getQualBadge(lead.qualification, lead.leadScore)}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-700 max-w-xs truncate">
                        {lead.requirement}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                        {lead.expectedCheckIn} to {lead.expectedCheckOut}
                      </td>

                      <td className="py-3.5 px-4 font-black text-slate-900 whitespace-nowrap">
                        ₹{(lead.estimatedValue || 0).toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                          className="rounded-xl bg-slate-100 border-0 px-2.5 py-1 text-[11px] font-bold text-slate-800 focus:outline-none"
                        >
                          <option value="new">NEW</option>
                          <option value="contacted">CONTACTED</option>
                          <option value="interested">INTERESTED</option>
                          <option value="quotation_sent">QUOTATION SENT</option>
                          <option value="negotiation">NEGOTIATION</option>
                          <option value="won">WON (CONVERTED)</option>
                          <option value="lost">LOST</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        {lead.status !== 'won' ? (
                          <button
                            onClick={() => setConvertingLead(lead)}
                            className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-indigo-700 transition"
                          >
                            <span>Convert</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        ) : (
                          <span className="text-emerald-600 font-bold text-[11px] inline-flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4" /> Converted
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FORMAT 4: ANALYTICS & SOURCE FUNNEL */}
      {viewFormat === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <PieChart className="h-4 w-4 text-indigo-600" />
              <span>Inquiry Channel Distribution</span>
            </h3>

            {['Website', 'WhatsApp', 'Phone', 'Corporate', 'Walk-in'].map((src) => {
              const srcLeads = leads.filter((l) => l.source === src);
              const percentage = totalLeads ? Math.round((srcLeads.length / totalLeads) * 100) : 0;
              return (
                <div key={src} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{src}</span>
                    <span>{srcLeads.length} leads ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-600" />
              <span>AI Lead Intent Classification</span>
            </h3>

            {['HOT', 'WARM', 'COLD'].map((q) => {
              const qLeads = leads.filter((l) => l.qualification === q);
              const percentage = totalLeads ? Math.round((qLeads.length / totalLeads) * 100) : 0;
              return (
                <div key={q} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{q} Qualification</span>
                    <span>{qLeads.length} leads ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        q === 'HOT' ? 'bg-rose-500' : q === 'WARM' ? 'bg-amber-500' : 'bg-slate-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Score Modal */}
      {selectedLeadForScore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <h3 className="font-bold text-slate-900">AI Conversion Breakdown</h3>
              </div>
              <button onClick={() => setSelectedLeadForScore(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {loadingScore ? (
              <div className="p-8 text-center text-xs text-purple-600 font-medium animate-pulse flex flex-col items-center justify-center gap-2">
                <Sparkles className="h-6 w-6 animate-spin text-purple-600" />
                <span>Analyzing conversion factors with Gemini...</span>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between rounded-xl bg-purple-50 p-4">
                  <div>
                    <span className="text-slate-500 block text-[11px]">AI Score</span>
                    <span className="text-2xl font-black text-purple-900">
                      {aiScoreExplanation?.score || selectedLeadForScore.leadScore} / 100
                    </span>
                  </div>
                  <span className="rounded-full bg-purple-600 text-white px-3 py-1 font-bold text-xs uppercase">
                    {aiScoreExplanation?.qualification || selectedLeadForScore.qualification} QUALIFIED
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Key Drivers:</h4>
                  <ul className="space-y-1.5 text-slate-600">
                    {(aiScoreExplanation?.reasons || selectedLeadForScore.scoreReasons || []).map((r: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add New Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <form onSubmit={handleCreateLead} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900">Add New Hotel Lead</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} type="button" className="text-slate-400 hover:text-slate-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Guest / Contact Name</label>
                <input
                  type="text"
                  required
                  value={newLeadForm.name}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                  placeholder="e.g. Vikram Sharma"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Source</label>
                  <select
                    value={newLeadForm.source}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, source: e.target.value as any })}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs"
                  >
                    <option value="Website">Website</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Phone">Phone</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Walk-in">Walk-in</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Est. Value (₹)</label>
                  <input
                    type="number"
                    value={newLeadForm.estimatedValue}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, estimatedValue: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Requirement</label>
                <input
                  type="text"
                  value={newLeadForm.requirement}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, requirement: e.target.value })}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
              >
                Save Lead
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Convert Lead Modal */}
      {convertingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Convert Lead to Confirmed Reservation</h3>
            <p className="text-xs text-slate-500">
              Converting lead <span className="font-semibold">{convertingLead.name}</span> for {convertingLead.requirement}.
            </p>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl">
              <div className="flex justify-between">
                <span className="text-slate-500">Dates:</span>
                <span className="font-semibold">{convertingLead.expectedCheckIn} to {convertingLead.expectedCheckOut}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Folio Total:</span>
                <span className="font-bold text-slate-900">₹{(convertingLead?.estimatedValue ?? 0).toLocaleString()}</span>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Assign Available Room:</label>
                <select
                  value={selectedRoomNumber}
                  onChange={(e) => setSelectedRoomNumber(e.target.value)}
                  className="w-full rounded-xl bg-white p-2 text-xs font-medium border border-slate-200"
                >
                  {rooms.map((rm) => (
                    <option key={rm.id} value={rm.number}>
                      Room {rm.number} - {rm.roomTypeName} (₹{rm.price}/night) - Status: {rm.status.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConvertingLead(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmConversion}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
              >
                Confirm & Create Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
