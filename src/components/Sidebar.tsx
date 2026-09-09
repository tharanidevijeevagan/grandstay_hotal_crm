import React from 'react';
import { useHotel } from '../context/HotelContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building,
  Target,
  CalendarCheck,
  BedDouble,
  KeyRound,
  Sparkles,
  MessageSquare,
  Star,
  Award,
  BarChart3,
  Settings,
  ClipboardList,
  Wrench,
  ChevronRight,
  LogOut,
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'leads'
  | 'guests'
  | 'companies'
  | 'deals'
  | 'reservations'
  | 'rooms'
  | 'checkin_checkout'
  | 'housekeeping'
  | 'service_requests'
  | 'inbox'
  | 'feedback'
  | 'loyalty'
  | 'ai_hub'
  | 'analytics'
  | 'settings';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  badgeColor?: string;
  highlight?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { role, logout, metrics } = useHotel();

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const isRoleAllowed = (tab: TabType): boolean => {
    if (role === 'admin' || role === 'manager') return true;
    if (role === 'receptionist') {
      return ['dashboard', 'guests', 'reservations', 'rooms', 'checkin_checkout', 'service_requests', 'inbox', 'feedback'].includes(tab);
    }
    if (role === 'sales') {
      return ['dashboard', 'leads', 'guests', 'companies', 'deals', 'inbox', 'analytics', 'ai_hub'].includes(tab);
    }
    if (role === 'housekeeping') {
      return ['dashboard', 'rooms', 'housekeeping', 'service_requests'].includes(tab);
    }
    return true;
  };

  const navGroups: NavGroup[] = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'CRM',
      items: [
        { id: 'leads', label: 'Leads & Inquiries', icon: Users, badge: metrics.newLeadsToday },
        { id: 'guests', label: 'Guests Directory', icon: UserCheck },
        { id: 'companies', label: 'Corporate Accounts', icon: Building },
        { id: 'deals', label: 'Deals Pipeline', icon: Target },
      ],
    },
    {
      title: 'HOTEL OPERATIONS',
      items: [
        { id: 'reservations', label: 'Reservations', icon: CalendarCheck, badge: metrics.confirmedBookingsToday },
        { id: 'rooms', label: 'Rooms & Availability', icon: BedDouble },
        { id: 'checkin_checkout', label: 'Check-in / Check-out', icon: KeyRound },
        { id: 'housekeeping', label: 'Housekeeping', icon: ClipboardList },
        { id: 'service_requests', label: 'Service Requests', icon: Wrench, badge: metrics.pendingServiceRequests, badgeColor: 'bg-rose-500 text-white' },
      ],
    },
    {
      title: 'ENGAGEMENT & AI',
      items: [
        { id: 'inbox', label: 'Unified Inbox', icon: MessageSquare },
        { id: 'feedback', label: 'Guest Reviews & Feedback', icon: Star },
        { id: 'loyalty', label: 'Loyalty Program', icon: Award },
        { id: 'ai_hub', label: 'GenAI Intelligence Hub', icon: Sparkles, highlight: true },
      ],
    },
    {
      title: 'MANAGEMENT',
      items: [
        { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
        { id: 'settings', label: 'Hotel Settings', icon: Settings },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-3 space-y-6 flex-1">
        {navGroups.map((group) => {
          const allowedItems = group.items.filter((item) => isRoleAllowed(item.id));
          if (allowedItems.length === 0) return null;

          return (
            <div key={group.title} className="space-y-1">
              <h2 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {group.title}
              </h2>

              <div className="space-y-0.5 mt-1.5">
                {allowedItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition duration-150 ${
                        isActive
                          ? item.highlight
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm font-semibold'
                            : 'bg-indigo-600 text-white shadow-sm font-semibold'
                          : item.highlight
                          ? 'text-purple-300 hover:bg-purple-950/40 hover:text-purple-200'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`h-4 w-4 ${
                            isActive
                              ? 'text-white'
                              : item.highlight
                              ? 'text-purple-400 group-hover:text-purple-300'
                              : 'text-slate-400 group-hover:text-slate-200'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {item.badge !== undefined && item.badge > 0 && (
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                              item.badgeColor || 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {isActive && <ChevronRight className="h-3 w-3 text-white/70" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Role Footer Info */}
      <div className="mt-auto border-t border-slate-800 p-3 bg-slate-950/60 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Active Role:</span>
          <span className="font-semibold text-slate-200 capitalize">{role}</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>Status: <span className="text-emerald-400 font-medium">● Online</span></span>
          <button
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              logout();
            }}
            className="flex items-center gap-1 text-[10px] font-bold text-rose-400 hover:text-rose-300 transition"
          >
            <LogOut className="h-3 w-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 border-r border-slate-200/80 bg-slate-900 text-slate-300 flex-col h-[calc(100vh-4rem)] sticky top-16 select-none overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Drawer Content */}
          <div className="relative w-72 max-w-[80vw] bg-slate-900 text-slate-300 h-full shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
