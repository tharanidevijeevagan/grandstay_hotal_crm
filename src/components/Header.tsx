import React, { useState, useRef, useEffect } from 'react';
import { useHotel } from '../context/HotelContext';
import { UserRole } from '../types';
import { TabType } from './Sidebar';
import {
  Sparkles,
  Search,
  Bell,
  Building2,
  ShieldCheck,
  ChevronDown,
  Wrench,
  Flame,
  Star,
  CheckCheck,
  X,
  Clock,
  ArrowRight,
  BedDouble,
  CheckCircle2,
  AlertCircle,
  LogOut,
  User,
  Building,
  Users,
  Calendar,
  Target,
  MessageSquare,
  Menu
} from 'lucide-react';

interface HeaderProps {
  onOpenAiDrawer: () => void;
  setActiveTab?: (tab: TabType) => void;
  onToggleMobileSidebar?: () => void;
}

interface NotificationItem {
  id: string;
  type: 'service' | 'lead' | 'review' | 'housekeeping';
  title: string;
  subtitle: string;
  time: string;
  targetTab: TabType;
  badgeBg: string;
  badgeText: string;
  icon: React.ReactNode;
  urgent?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAiDrawer, setActiveTab, onToggleMobileSidebar }) => {
  const {
    role,
    setRole,
    currentUser,
    logout,
    metrics,
    guests = [],
    reservations = [],
    serviceRequests = [],
    leads = [],
    reviews = [],
    housekeeping = [],
  } = useHotel();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'requests' | 'leads' | 'reviews'>('all');
  const [readIds, setReadIds] = useState<string[]>([]);

  // Search Bar State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement !== searchInputRef.current &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter Search Data safely with optional chaining
  const q = searchQuery.trim().toLowerCase();

  const matchedGuests = q
    ? guests
        .filter(
          (g) =>
            g.name?.toLowerCase().includes(q) ||
            g.email?.toLowerCase().includes(q) ||
            g.phone?.toLowerCase().includes(q) ||
            g.address?.toLowerCase().includes(q)
        )
        .slice(0, 4)
    : [];

  const matchedReservations = q
    ? reservations
        .filter(
          (r) =>
            r.guestName?.toLowerCase().includes(q) ||
            r.roomNumber?.toLowerCase().includes(q) ||
            r.id?.toLowerCase().includes(q) ||
            r.status?.toLowerCase().includes(q) ||
            r.roomType?.toLowerCase().includes(q)
        )
        .slice(0, 4)
    : [];

  const matchedServiceRequests = q
    ? serviceRequests
        .filter(
          (sr) =>
            sr.type?.toLowerCase().includes(q) ||
            sr.roomNumber?.toLowerCase().includes(q) ||
            sr.guestName?.toLowerCase().includes(q) ||
            sr.description?.toLowerCase().includes(q)
        )
        .slice(0, 4)
    : [];

  const matchedLeads = q
    ? leads
        .filter(
          (l) =>
            l.name?.toLowerCase().includes(q) ||
            l.email?.toLowerCase().includes(q) ||
            l.phone?.toLowerCase().includes(q) ||
            l.requirement?.toLowerCase().includes(q) ||
            l.assignedStaff?.toLowerCase().includes(q)
        )
        .slice(0, 4)
    : [];

  const matchedHousekeeping = q
    ? housekeeping
        .filter(
          (h) =>
            h.roomNumber?.toLowerCase().includes(q) ||
            h.assignedTo?.toLowerCase().includes(q) ||
            h.taskType?.toLowerCase().includes(q) ||
            h.status?.toLowerCase().includes(q)
        )
        .slice(0, 4)
    : [];

  const matchedReviews = q
    ? reviews
        .filter(
          (r) =>
            r.guestName?.toLowerCase().includes(q) ||
            r.reviewText?.toLowerCase().includes(q) ||
            r.category?.toLowerCase().includes(q) ||
            r.source?.toLowerCase().includes(q)
        )
        .slice(0, 4)
    : [];

  const totalSearchCount =
    matchedGuests.length +
    matchedReservations.length +
    matchedServiceRequests.length +
    matchedLeads.length +
    matchedHousekeeping.length +
    matchedReviews.length;

  const handleResultClick = (targetTab: TabType) => {
    if (setActiveTab) {
      setActiveTab(targetTab);
    }
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const roleLabels: Record<UserRole, { label: string; badge: string; color: string }> = {
    admin: { label: 'Hotel Admin', badge: 'Full Access', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    manager: { label: 'Hotel Manager', badge: 'Operations & AI', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    receptionist: { label: 'Front Desk / Receptionist', badge: 'Guests & Check-in', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    sales: { label: 'Sales Manager', badge: 'Leads & Deals', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    housekeeping: { label: 'Housekeeping Staff', badge: 'Room Tasks', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  };

  // Build dynamic notifications array
  const notificationsList: NotificationItem[] = [
    ...serviceRequests
      .filter((sr) => sr.status === 'pending' || sr.status === 'in_progress')
      .map((sr) => ({
        id: `sr-${sr.id}`,
        type: 'service' as const,
        title: `Service Request: Room ${sr.roomNumber}`,
        subtitle: `${sr.type} (${sr.priority.toUpperCase()} Priority) - ${sr.guestName}`,
        time: 'Just now',
        targetTab: 'service_requests' as TabType,
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
        badgeText: 'Pending Service',
        icon: <Wrench className="h-3.5 w-3.5 text-amber-600" />,
        urgent: sr.priority === 'urgent' || sr.priority === 'high',
      })),
    ...leads
      .filter((l) => l.qualification === 'HOT' || l.status === 'new')
      .slice(0, 3)
      .map((l) => ({
        id: `lead-${l.id}`,
        type: 'lead' as const,
        title: `HOT Inquiry: ${l.name}`,
        subtitle: `${l.requirement} • Est. ₹${(l.estimatedValue || 0).toLocaleString()}`,
        time: '12m ago',
        targetTab: 'leads' as TabType,
        badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
        badgeText: 'Hot Lead',
        icon: <Flame className="h-3.5 w-3.5 text-rose-600" />,
        urgent: true,
      })),
    ...reviews
      .filter((r) => r.rating <= 3 || r.sentiment === 'Negative')
      .slice(0, 2)
      .map((r) => ({
        id: `rev-${r.id}`,
        type: 'review' as const,
        title: `Feedback Alert (${r.rating}★)`,
        subtitle: `Room ${r.roomNumber || 'Guest'}: "${r.reviewText.slice(0, 50)}..."`,
        time: r.date || 'Today',
        targetTab: 'feedback' as TabType,
        badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
        badgeText: 'Review Alert',
        icon: <Star className="h-3.5 w-3.5 text-purple-600" />,
        urgent: false,
      })),
    ...housekeeping
      .filter((h) => h.status === 'dirty' || h.priority === 'high')
      .slice(0, 2)
      .map((h) => ({
        id: `hk-${h.id}`,
        type: 'housekeeping' as const,
        title: `Housekeeping: Room ${h.roomNumber}`,
        subtitle: `Cleaning task assigned to ${h.assignedStaff || 'Staff'}`,
        time: '25m ago',
        targetTab: 'housekeeping' as TabType,
        badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
        badgeText: 'Room Cleaning',
        icon: <BedDouble className="h-3.5 w-3.5 text-blue-600" />,
        urgent: false,
      })),
  ];

  const unreadCount = notificationsList.filter((n) => !readIds.includes(n.id)).length;

  const filteredNotifications = notificationsList.filter((n) => {
    if (activeFilter === 'requests') return n.type === 'service';
    if (activeFilter === 'leads') return n.type === 'lead';
    if (activeFilter === 'reviews') return n.type === 'review';
    return true;
  });

  const handleNotificationClick = (notif: NotificationItem) => {
    if (!readIds.includes(notif.id)) {
      setReadIds((prev) => [...prev, notif.id]);
    }
    if (setActiveTab) {
      setActiveTab(notif.targetTab);
    }
    setIsNotificationsOpen(false);
  };

  const handleMarkAllRead = () => {
    setReadIds(notificationsList.map((n) => n.id));
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-3 md:px-6 backdrop-blur-md">
      {/* Search & Hotel Title */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          onClick={onToggleMobileSidebar}
          className="flex lg:hidden items-center justify-center h-9 w-9 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition focus:outline-none"
          title="Open Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-sm shadow-indigo-200 flex-shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold text-slate-900 leading-tight">GrandStay Hotel CRM</h1>
            <p className="text-xs text-slate-500">Boutique & Resort PMS</p>
          </div>
        </div>

        {/* Global Search Component */}
        <div className="relative hidden md:block w-80 lg:w-96">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              placeholder="Search guests, rooms, bookings, requests (Press '/' to focus)..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
            />
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="absolute right-2.5 rounded bg-slate-200/80 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 pointer-events-none">
                /
              </kbd>
            )}
          </div>

          {/* Search Results Dropdown Popover */}
          {isSearchOpen && searchQuery.trim().length > 0 && (
            <>
              <div
                className="fixed inset-0 z-40 bg-transparent"
                onClick={() => setIsSearchOpen(false)}
              />
              <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl z-50 max-h-[28rem] overflow-y-auto space-y-3 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                {totalSearchCount === 0 ? (
                  <div className="p-6 text-center text-slate-500 space-y-1">
                    <Search className="h-6 w-6 text-slate-300 mx-auto" />
                    <p className="font-bold text-slate-800">No matching records found</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Try searching by guest name, room number (e.g. 101, 304), phone number, or service type.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* GUESTS MATCHES */}
                    {matchedGuests.length > 0 && (
                      <div>
                        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-indigo-600" /> In-House Guests
                          </span>
                          <span className="text-slate-400 font-normal">{matchedGuests.length} results</span>
                        </div>
                        <div className="space-y-1 mt-1">
                          {matchedGuests.map((g) => (
                            <button
                              key={g.id}
                              onClick={() => handleResultClick('guests')}
                              className="w-full flex items-center justify-between rounded-xl p-2 text-left hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-slate-900 truncate flex items-center gap-2">
                                  <span>{g.name}</span>
                                  {g.vipStatus && (
                                    <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                                      ★ VIP
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-500 truncate">{g.email} • {g.phone}</p>
                              </div>
                              <ArrowRight className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 ml-2" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* RESERVATIONS MATCHES */}
                    {matchedReservations.length > 0 && (
                      <div>
                        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-emerald-600" /> Bookings & Reservations
                          </span>
                          <span className="text-slate-400 font-normal">{matchedReservations.length} results</span>
                        </div>
                        <div className="space-y-1 mt-1">
                          {matchedReservations.map((r) => (
                            <button
                              key={r.id}
                              onClick={() => handleResultClick('reservations')}
                              className="w-full flex items-center justify-between rounded-xl p-2 text-left hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-slate-900 truncate flex items-center gap-2">
                                  <span>{r.guestName}</span>
                                  <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                                    Room {r.roomNumber}
                                  </span>
                                  <span className="text-[10px] text-slate-400 uppercase font-mono">{r.id}</span>
                                </div>
                                <p className="text-[10px] text-slate-500 truncate">
                                  Status: <span className="font-semibold text-slate-700 uppercase">{r.status}</span> • Dates: {r.checkIn} to {r.checkOut}
                                </p>
                              </div>
                              <ArrowRight className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 ml-2" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SERVICE REQUESTS MATCHES */}
                    {matchedServiceRequests.length > 0 && (
                      <div>
                        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Wrench className="h-3 w-3 text-amber-600" /> Service Requests
                          </span>
                          <span className="text-slate-400 font-normal">{matchedServiceRequests.length} results</span>
                        </div>
                        <div className="space-y-1 mt-1">
                          {matchedServiceRequests.map((sr) => (
                            <button
                              key={sr.id}
                              onClick={() => handleResultClick('service_requests')}
                              className="w-full flex items-center justify-between rounded-xl p-2 text-left hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-slate-900 truncate flex items-center gap-2">
                                  <span>{sr.type}</span>
                                  <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                                    Room {sr.roomNumber}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-500 truncate">{sr.description} ({sr.guestName})</p>
                              </div>
                              <ArrowRight className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 ml-2" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* LEADS MATCHES */}
                    {matchedLeads.length > 0 && (
                      <div>
                        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3 text-purple-600" /> Sales & Corporate Leads
                          </span>
                          <span className="text-slate-400 font-normal">{matchedLeads.length} results</span>
                        </div>
                        <div className="space-y-1 mt-1">
                          {matchedLeads.map((l) => (
                            <button
                              key={l.id}
                              onClick={() => handleResultClick('leads')}
                              className="w-full flex items-center justify-between rounded-xl p-2 text-left hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-slate-900 truncate flex items-center gap-2">
                                  <span>{l.name}</span>
                                  <span className="rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-bold text-purple-700">
                                    {l.qualification}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-500 truncate">{l.requirement || l.email}</p>
                              </div>
                              <ArrowRight className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 ml-2" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* HOUSEKEEPING MATCHES */}
                    {matchedHousekeeping.length > 0 && (
                      <div>
                        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <BedDouble className="h-3 w-3 text-blue-600" /> Housekeeping Tasks
                          </span>
                          <span className="text-slate-400 font-normal">{matchedHousekeeping.length} results</span>
                        </div>
                        <div className="space-y-1 mt-1">
                          {matchedHousekeeping.map((h) => (
                            <button
                              key={h.id}
                              onClick={() => handleResultClick('housekeeping')}
                              className="w-full flex items-center justify-between rounded-xl p-2 text-left hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-slate-900 truncate flex items-center gap-2">
                                  <span>Room {h.roomNumber} ({h.taskType})</span>
                                  <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 uppercase">
                                    {h.status}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-500 truncate">Assigned: {h.assignedTo || 'Unassigned'}</p>
                              </div>
                              <ArrowRight className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 ml-2" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* REVIEWS MATCHES */}
                    {matchedReviews.length > 0 && (
                      <div>
                        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-amber-500" /> Guest Reviews
                          </span>
                          <span className="text-slate-400 font-normal">{matchedReviews.length} results</span>
                        </div>
                        <div className="space-y-1 mt-1">
                          {matchedReviews.map((rev) => (
                            <button
                              key={rev.id}
                              onClick={() => handleResultClick('feedback')}
                              className="w-full flex items-center justify-between rounded-xl p-2 text-left hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-slate-900 truncate flex items-center gap-2">
                                  <span>{rev.guestName}</span>
                                  <span className="text-[10px] text-amber-600 font-bold">★ {rev.rating}/5</span>
                                </div>
                                <p className="text-[10px] text-slate-500 truncate">"{rev.reviewText}"</p>
                              </div>
                              <ArrowRight className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 ml-2" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Role Switcher */}
        <div className="relative group">
          <div className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium cursor-pointer transition ${roleLabels[role].color}`}>
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{roleLabels[role].label}</span>
            <span className="sm:hidden">{role.toUpperCase()}</span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </div>

          <div className="absolute right-0 top-full mt-1.5 hidden w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg group-hover:block z-50">
            <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Switch Role Perspective
            </div>
            {(Object.keys(roleLabels) as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition ${
                  role === r ? 'bg-indigo-50 font-medium text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{roleLabels[r].label}</span>
                <span className="text-[10px] text-slate-400">{r}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Assistant Floating Action Button */}
        <button
          onClick={onOpenAiDrawer}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm shadow-purple-200 hover:shadow-md hover:brightness-105 active:scale-95 transition"
        >
          <Sparkles className="h-3.5 w-3.5 animate-pulse text-amber-300" />
          <span className="hidden sm:inline">Ask AI Assistant</span>
          <span className="sm:hidden">AI</span>
        </button>

        {/* Notifications Popover Dropdown Container */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`relative flex h-8 w-8 items-center justify-center rounded-lg border transition ${
              isNotificationsOpen
                ? 'border-indigo-500 bg-indigo-50 text-indigo-600 ring-2 ring-indigo-500/20'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
            title="Service & Operations Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Backdrop for closing popover */}
          {isNotificationsOpen && (
            <div
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setIsNotificationsOpen(false)}
            />
          )}

          {/* Notification Menu Popover */}
          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-2xl z-50 overflow-hidden space-y-0 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-indigo-600" />
                  <span className="font-bold text-slate-900 text-xs">Live Hotel Operations Alerts</span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-extrabold px-2 py-0.5">
                      {unreadCount} New
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <CheckCheck className="h-3 w-3" />
                      <span>Mark Read</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 border-b border-slate-100 bg-slate-50/40 px-3 py-1.5">
                {(['all', 'requests', 'leads', 'reviews'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`rounded-md px-2.5 py-1 text-[10px] font-bold capitalize transition ${
                      activeFilter === tab
                        ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/60'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 space-y-1">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto" />
                    <p className="font-semibold text-xs text-slate-700">All Clear!</p>
                    <p className="text-[11px]">No active operational notifications right now.</p>
                  </div>
                ) : (
                  filteredNotifications.map((notif) => {
                    const isRead = readIds.includes(notif.id);

                    return (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`group p-3.5 flex items-start justify-between gap-3 cursor-pointer transition hover:bg-slate-50 ${
                          isRead ? 'opacity-70 bg-white' : 'bg-indigo-50/30'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`p-2 rounded-lg border mt-0.5 flex-shrink-0 ${notif.badgeBg}`}>
                            {notif.icon}
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition">
                                {notif.title}
                              </span>
                              {!isRead && (
                                <span className="h-2 w-2 rounded-full bg-indigo-600 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-600 line-clamp-1">{notif.subtitle}</p>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Clock className="h-2.5 w-2.5" />
                              {notif.time}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0 self-center">
                          <span className="text-[10px] font-bold text-indigo-600 flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                            <span>View</span>
                            <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Popover Footer Action */}
              <div className="border-t border-slate-100 bg-slate-50/80 p-2 text-center">
                <button
                  onClick={() => {
                    if (setActiveTab) setActiveTab('service_requests');
                    setIsNotificationsOpen(false);
                  }}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition inline-flex items-center gap-1 py-1"
                >
                  <span>Go to Guest Service Requests Center</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Sign Out Control */}
        <div className="relative border-l border-slate-200 pl-3">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition focus:outline-none"
            title="User Account & Sign Out"
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
              alt={currentUser?.name || 'User'}
              className="h-8 w-8 rounded-full object-cover border border-slate-200"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-none">{currentUser?.name}</div>
              <div className="text-[10px] font-medium text-slate-500 mt-0.5">{roleLabels[role].label}</div>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400 hidden lg:block" />
          </button>

          {/* User Menu Dropdown */}
          {isUserMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-transparent"
                onClick={() => setIsUserMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl z-50 text-xs space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Profile Header */}
                <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="h-10 w-10 rounded-full object-cover border border-slate-200"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 truncate">{currentUser?.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{currentUser?.email}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold ${roleLabels[role].color}`}>
                      {roleLabels[role].label}
                    </span>
                  </div>
                </div>

                {/* Hotel Property Info */}
                <div className="p-2 text-[10px] text-slate-500 space-y-1">
                  <span className="font-bold text-slate-700 uppercase block tracking-wider">Active Property:</span>
                  <p className="font-semibold text-slate-900 flex items-center gap-1 text-xs">
                    <Building className="h-3.5 w-3.5 text-indigo-600 flex-shrink-0" />
                    <span className="truncate">{currentUser?.hotelProperty || 'GrandStay Resort & Spa'}</span>
                  </p>
                </div>

                {/* Account Actions */}
                <div className="border-t border-slate-100 pt-2 space-y-1">
                  {setActiveTab && (
                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 hover:bg-slate-50 transition"
                    >
                      <User className="h-3.5 w-3.5 text-slate-500" />
                      <span>Account Settings & Preferences</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center justify-between rounded-lg bg-rose-50 px-2.5 py-2 font-bold text-rose-700 hover:bg-rose-100 transition text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <LogOut className="h-3.5 w-3.5 text-rose-600" />
                      <span>Sign Out of Staff Account</span>
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-rose-600" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

