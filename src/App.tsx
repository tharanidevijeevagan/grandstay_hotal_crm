import React, { useState } from 'react';
import { HotelProvider, useHotel } from './context/HotelContext';
import { Header } from './components/Header';
import { Sidebar, TabType } from './components/Sidebar';
import { AIAssistantDrawer } from './components/AI/AIAssistantDrawer';

// Views
import { DashboardView } from './components/Views/DashboardView';
import { LeadsView } from './components/Views/LeadsView';
import { GuestsView } from './components/Views/GuestsView';
import { CompaniesView } from './components/Views/CompaniesView';
import { DealsView } from './components/Views/DealsView';
import { ReservationsView } from './components/Views/ReservationsView';
import { RoomsView } from './components/Views/RoomsView';
import { CheckInOutView } from './components/Views/CheckInOutView';
import { HousekeepingView } from './components/Views/HousekeepingView';
import { ServiceRequestsView } from './components/Views/ServiceRequestsView';
import { UnifiedInboxView } from './components/Views/UnifiedInboxView';
import { FeedbackView } from './components/Views/FeedbackView';
import { LoyaltyView } from './components/Views/LoyaltyView';
import { AIHubView } from './components/Views/AIHubView';
import { AnalyticsView } from './components/Views/AnalyticsView';
import { SettingsView } from './components/Views/SettingsView';
import { SignInView } from './components/Views/SignInView';

function AppContent() {
  const { isAuthenticated } = useHotel();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  if (!isAuthenticated) {
    return <SignInView onSuccess={() => setActiveTab('dashboard')} />;
  }

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView setActiveTab={setActiveTab} onOpenAiDrawer={() => setIsAiDrawerOpen(true)} />;
      case 'leads':
        return <LeadsView setActiveTab={setActiveTab} />;
      case 'guests':
        return <GuestsView />;
      case 'companies':
        return <CompaniesView />;
      case 'deals':
        return <DealsView />;
      case 'reservations':
        return <ReservationsView />;
      case 'rooms':
        return <RoomsView />;
      case 'checkin_checkout':
        return <CheckInOutView />;
      case 'housekeeping':
        return <HousekeepingView />;
      case 'service_requests':
        return <ServiceRequestsView />;
      case 'inbox':
        return <UnifiedInboxView />;
      case 'feedback':
        return <FeedbackView />;
      case 'loyalty':
        return <LoyaltyView />;
      case 'ai_hub':
        return <AIHubView onOpenAiDrawer={() => setIsAiDrawerOpen(true)} />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView setActiveTab={setActiveTab} onOpenAiDrawer={() => setIsAiDrawerOpen(true)} />;
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100 font-sans text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      {/* High Density Top Navigation Header */}
      <Header
        onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
        setActiveTab={setActiveTab}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
      />

      {/* Main Container with Sidebar & Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Dense Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Center Main Scrollable View Surface */}
        <main className="flex-1 overflow-y-auto bg-slate-50/70 p-3 sm:p-5 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {renderView()}
          </div>
        </main>
      </div>

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer isOpen={isAiDrawerOpen} onClose={() => setIsAiDrawerOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <HotelProvider>
      <AppContent />
    </HotelProvider>
  );
}

