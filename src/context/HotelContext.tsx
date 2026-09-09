import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Guest,
  Lead,
  Company,
  Deal,
  Room,
  Reservation,
  HousekeepingTask,
  ServiceRequest,
  Conversation,
  InboxMessage,
  FeedbackReview,
  LoyaltyMember,
  HotelActivity,
  HotelMetrics,
} from '../types';
import {
  INITIAL_METRICS,
  INITIAL_GUESTS,
  INITIAL_LEADS,
  INITIAL_COMPANIES,
  INITIAL_DEALS,
  INITIAL_ROOMS,
  INITIAL_RESERVATIONS,
  INITIAL_HOUSEKEEPING,
  INITIAL_SERVICE_REQUESTS,
  INITIAL_CONVERSATIONS,
  INITIAL_INBOX_MESSAGES,
  INITIAL_REVIEWS,
  INITIAL_LOYALTY,
  INITIAL_ACTIVITIES,
} from '../data/mockData';

interface HotelContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  currentUser: { name: string; email: string; role: UserRole; avatar: string; hotelProperty: string };
  login: (email: string, password: string, role?: UserRole, name?: string, avatar?: string, property?: string) => boolean;
  logout: () => void;
  switchUserRole: (role: UserRole) => void;
  metrics: HotelMetrics;
  guests: Guest[];
  leads: Lead[];
  companies: Company[];
  deals: Deal[];
  rooms: Room[];
  reservations: Reservation[];
  housekeeping: HousekeepingTask[];
  serviceRequests: ServiceRequest[];
  conversations: Conversation[];
  inboxMessages: InboxMessage[];
  reviews: FeedbackReview[];
  feedback: FeedbackReview[];
  loyalty: LoyaltyMember[];
  activities: HotelActivity[];
  
  // Actions
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'leadScore' | 'qualification'>) => void;
  updateLeadStatus: (leadId: string, status: Lead['status']) => void;
  convertLeadToReservation: (leadId: string, roomNumber: string) => void;
  addGuest: (guest: Omit<Guest, 'id'>) => void;
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => void;
  performCheckIn: (reservationId: string) => void;
  performCheckOut: (reservationId: string, extraCharges?: number) => void;
  updateRoomStatus: (roomId: string, status: Room['status'], housekeepingStatus?: Room['housekeepingStatus']) => void;
  updateHousekeepingStatus: (taskId: string, status: HousekeepingTask['status']) => void;
  addHousekeepingTask: (task: Omit<HousekeepingTask, 'id' | 'createdAt'>) => void;
  addServiceRequest: (request: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>) => void;
  resolveServiceRequest: (requestId: string) => void;
  sendMessage: (conversationId: string, text: string) => void;
  addInboxMessage: (msg: Omit<InboxMessage, 'id' | 'timestamp'>) => void;
  resetAllData: () => void;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('admin');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const savedAuth = localStorage.getItem('hotel_is_auth');
    return savedAuth !== null ? savedAuth === 'true' : false;
  });

  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: UserRole;
    avatar: string;
    hotelProperty: string;
  }>(() => {
    const savedUser = localStorage.getItem('hotel_user');
    return savedUser
      ? JSON.parse(savedUser)
      : {
          name: 'Vikram Malhotra',
          email: 'admin@grandstay.com',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
          hotelProperty: 'GrandStay Resort & Spa - Main Palace',
        };
  });

  useEffect(() => {
    localStorage.setItem('hotel_is_auth', String(isAuthenticated));
    localStorage.setItem('hotel_user', JSON.stringify(currentUser));
  }, [isAuthenticated, currentUser]);

  const login = (
    email: string,
    password: string,
    newRole?: UserRole,
    userName?: string,
    userAvatar?: string,
    property?: string
  ) => {
    const effectiveRole = newRole || role;
    const effectiveName = userName || (email.split('@')[0].toUpperCase() + ' Staff');
    const effectiveAvatar =
      userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120';
    const effectiveProperty = property || 'GrandStay Resort & Spa - Main Palace';

    setRole(effectiveRole);
    setCurrentUser({
      name: effectiveName,
      email,
      role: effectiveRole,
      avatar: effectiveAvatar,
      hotelProperty: effectiveProperty,
    });
    setIsAuthenticated(true);
    addActivity('Staff Sign In', `${effectiveName} logged in as ${effectiveRole.toUpperCase()}`, 'system');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    addActivity('Staff Sign Out', `${currentUser.name} logged out from ${currentUser.hotelProperty}`, 'system');
  };
  
  const [metrics, setMetrics] = useState<HotelMetrics>(() => {
    const saved = localStorage.getItem('hotel_metrics');
    return saved ? JSON.parse(saved) : INITIAL_METRICS;
  });

  const [guests, setGuests] = useState<Guest[]>(() => {
    const saved = localStorage.getItem('hotel_guests');
    return saved ? JSON.parse(saved) : INITIAL_GUESTS;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('hotel_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('hotel_companies');
    return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
  });

  const [deals, setDeals] = useState<Deal[]>(() => {
    const saved = localStorage.getItem('hotel_deals');
    return saved ? JSON.parse(saved) : INITIAL_DEALS;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('hotel_rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('hotel_reservations');
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  const [housekeeping, setHousekeeping] = useState<HousekeepingTask[]>(() => {
    const saved = localStorage.getItem('hotel_housekeeping');
    return saved ? JSON.parse(saved) : INITIAL_HOUSEKEEPING;
  });

  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(() => {
    const saved = localStorage.getItem('hotel_service_requests');
    return saved ? JSON.parse(saved) : INITIAL_SERVICE_REQUESTS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('hotel_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [inboxMessages, setInboxMessages] = useState<InboxMessage[]>(() => {
    const saved = localStorage.getItem('hotel_inbox_messages');
    return saved ? JSON.parse(saved) : INITIAL_INBOX_MESSAGES;
  });

  const [reviews] = useState<FeedbackReview[]>(INITIAL_REVIEWS);
  const [loyalty] = useState<LoyaltyMember[]>(INITIAL_LOYALTY);

  const [activities, setActivities] = useState<HotelActivity[]>(() => {
    const saved = localStorage.getItem('hotel_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('hotel_metrics', JSON.stringify(metrics));
    localStorage.setItem('hotel_guests', JSON.stringify(guests));
    localStorage.setItem('hotel_leads', JSON.stringify(leads));
    localStorage.setItem('hotel_companies', JSON.stringify(companies));
    localStorage.setItem('hotel_deals', JSON.stringify(deals));
    localStorage.setItem('hotel_rooms', JSON.stringify(rooms));
    localStorage.setItem('hotel_reservations', JSON.stringify(reservations));
    localStorage.setItem('hotel_housekeeping', JSON.stringify(housekeeping));
    localStorage.setItem('hotel_service_requests', JSON.stringify(serviceRequests));
    localStorage.setItem('hotel_conversations', JSON.stringify(conversations));
    localStorage.setItem('hotel_inbox_messages', JSON.stringify(inboxMessages));
    localStorage.setItem('hotel_activities', JSON.stringify(activities));
  }, [metrics, guests, leads, companies, deals, rooms, reservations, housekeeping, serviceRequests, conversations, inboxMessages, activities]);

  const addActivity = (title: string, description: string, type: HotelActivity['type']) => {
    const newAct: HotelActivity = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      title,
      description,
      timestamp: 'Just now',
      type,
      user: role.toUpperCase(),
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 15)]);
  };

  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'leadScore' | 'qualification'>) => {
    const newId = `L-${Math.floor(300 + Math.random() * 100)}`;
    const newLead: Lead = {
      ...leadData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      leadScore: Math.floor(65 + Math.random() * 30),
      qualification: 'HOT',
      scoreReasons: ['Recent direct inquiry', 'High requirement value'],
    };
    setLeads((prev) => [newLead, ...prev]);
    setMetrics((prev) => ({ ...prev, newLeadsToday: prev.newLeadsToday + 1 }));
    addActivity('New Lead Captured', `Inquiry received from ${newLead.name}`, 'lead');
  };

  const updateLeadStatus = (leadId: string, status: Lead['status']) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status } : l))
    );
    addActivity('Lead Status Updated', `Lead ${leadId} moved to stage ${status.toUpperCase()}`, 'lead');
  };

  const convertLeadToReservation = (leadId: string, roomNumber: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    // Check if guest exists or create new guest
    let guest = guests.find((g) => g.email.toLowerCase() === lead.email.toLowerCase());
    if (!guest) {
      guest = {
        id: `G-${Math.floor(100 + Math.random() * 900)}`,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        address: 'Specified upon check-in',
        idType: 'Aadhaar / Passport',
        idNumber: 'Pending Verification',
        vipStatus: lead.estimatedValue > 100000,
        totalStays: 1,
        lifetimeSpend: lead.estimatedValue,
        roomPreferences: ['Deluxe'],
        bedPreferences: 'King Size',
        foodPreferences: ['Standard'],
        aiSummary: `New guest converted from lead ${lead.id}. First stay booked for ${lead.requirement}.`,
      };
      setGuests((prev) => [...prev, guest!]);
    }

    const targetRoom = rooms.find((r) => r.number === roomNumber);
    const newRes: Reservation = {
      id: `RES-${Math.floor(800 + Math.random() * 100)}`,
      guestId: guest.id,
      guestName: guest.name,
      guestPhone: guest.phone,
      guestEmail: guest.email,
      roomNumber,
      roomType: targetRoom ? targetRoom.roomTypeName : 'Deluxe Room',
      checkIn: lead.expectedCheckIn,
      checkOut: lead.expectedCheckOut,
      guestCount: lead.guestCount,
      nightlyRate: targetRoom ? targetRoom.price : 9500,
      totalAmount: lead.estimatedValue,
      paidAmount: Math.round(lead.estimatedValue * 0.25),
      paymentStatus: 'partial',
      bookingSource: `Converted Lead (${lead.source})`,
      status: 'confirmed',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setReservations((prev) => [newRes, ...prev]);
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: 'won' } : l)));
    setMetrics((prev) => ({
      ...prev,
      confirmedBookingsToday: prev.confirmedBookingsToday + 1,
    }));

    if (targetRoom) {
      setRooms((prev) =>
        prev.map((r) => (r.number === roomNumber ? { ...r, status: 'reserved' } : r))
      );
    }

    addActivity('Lead Converted to Booking', `Confirmed booking ${newRes.id} for ${guest.name} in Room ${roomNumber}`, 'booking');
  };

  const addGuest = (guestData: Omit<Guest, 'id'>) => {
    const newGuest: Guest = {
      ...guestData,
      id: `G-${Math.floor(100 + Math.random() * 900)}`,
    };
    setGuests((prev) => [newGuest, ...prev]);
  };

  const addReservation = (resData: Omit<Reservation, 'id' | 'createdAt'>) => {
    const newRes: Reservation = {
      ...resData,
      id: `RES-${Math.floor(800 + Math.random() * 100)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setReservations((prev) => [newRes, ...prev]);
    setMetrics((prev) => ({ ...prev, confirmedBookingsToday: prev.confirmedBookingsToday + 1 }));
    setRooms((prev) =>
      prev.map((r) => (r.number === resData.roomNumber ? { ...r, status: 'reserved' } : r))
    );
    addActivity('New Reservation Created', `Room ${resData.roomNumber} reserved for ${resData.guestName}`, 'booking');
  };

  const performCheckIn = (reservationId: string) => {
    const res = reservations.find((r) => r.id === reservationId);
    if (!res) return;

    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? { ...r, status: 'checked_in' } : r))
    );

    setRooms((prev) =>
      prev.map((r) =>
        r.number === res.roomNumber
          ? {
              ...r,
              status: 'occupied',
              currentGuestName: res.guestName,
              currentReservationId: res.id,
            }
          : r
      )
    );

    setMetrics((prev) => ({
      ...prev,
      todayCheckIns: prev.todayCheckIns + 1,
      occupancyRate: Math.min(100, prev.occupancyRate + 4),
    }));

    addActivity('Guest Checked In', `${res.guestName} checked into Room ${res.roomNumber}`, 'checkin');
  };

  const performCheckOut = (reservationId: string, extraCharges: number = 0) => {
    const res = reservations.find((r) => r.id === reservationId);
    if (!res) return;

    const finalTotal = res.totalAmount + extraCharges;

    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId
          ? {
              ...r,
              status: 'checked_out',
              totalAmount: finalTotal,
              paidAmount: finalTotal,
              paymentStatus: 'paid',
            }
          : r
      )
    );

    setRooms((prev) =>
      prev.map((r) =>
        r.number === res.roomNumber
          ? {
              ...r,
              status: 'cleaning',
              housekeepingStatus: 'dirty',
              currentGuestName: undefined,
              currentReservationId: undefined,
            }
          : r
      )
    );

    // Auto create housekeeping cleaning task
    const newHk: HousekeepingTask = {
      id: `HK-${Math.floor(200 + Math.random() * 800)}`,
      roomNumber: res.roomNumber,
      taskType: 'Full Clean',
      priority: 'high',
      assignedTo: 'Ramesh (Housekeeping)',
      status: 'pending',
      notes: `Checkout clean for Room ${res.roomNumber}`,
      createdAt: 'Just now',
    };
    setHousekeeping((prev) => [newHk, ...prev]);

    setMetrics((prev) => ({
      ...prev,
      todayCheckOuts: prev.todayCheckOuts + 1,
      revenueToday: prev.revenueToday + finalTotal,
      occupancyRate: Math.max(0, prev.occupancyRate - 4),
    }));

    addActivity('Guest Checked Out', `${res.guestName} checked out of Room ${res.roomNumber}. Total folio ₹${finalTotal}`, 'checkout');
  };

  const updateRoomStatus = (roomId: string, status: Room['status'], housekeepingStatus?: Room['housekeepingStatus']) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId
          ? {
              ...r,
              status,
              ...(housekeepingStatus ? { housekeepingStatus } : {}),
            }
          : r
      )
    );
  };

  const updateHousekeepingStatus = (taskId: string, status: HousekeepingTask['status']) => {
    setHousekeeping((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated = { ...t, status };
          if (status === 'ready') {
            // Update room to available / clean
            setRooms((rPrev) =>
              rPrev.map((rm) =>
                rm.number === t.roomNumber
                  ? { ...rm, status: 'available', housekeepingStatus: 'clean' }
                  : rm
              )
            );
          }
          return updated;
        }
        return t;
      })
    );
  };

  const addHousekeepingTask = (taskData: Omit<HousekeepingTask, 'id' | 'createdAt'>) => {
    const newTask: HousekeepingTask = {
      ...taskData,
      id: `HK-${Math.floor(200 + Math.random() * 800)}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setHousekeeping((prev) => [newTask, ...prev]);
  };

  const addServiceRequest = (reqData: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: ServiceRequest = {
      ...reqData,
      id: `SR-${Math.floor(500 + Math.random() * 400)}`,
      status: 'open',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setServiceRequests((prev) => [newReq, ...prev]);
    setMetrics((prev) => ({ ...prev, pendingServiceRequests: prev.pendingServiceRequests + 1 }));
    addActivity('New Service Request', `${reqData.type} logged for Room ${reqData.roomNumber}`, 'servicerequest');
  };

  const resolveServiceRequest = (requestId: string) => {
    setServiceRequests((prev) =>
      prev.map((sr) =>
        sr.id === requestId
          ? {
              ...sr,
              status: 'resolved',
              resolvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : sr
      )
    );
    setMetrics((prev) => ({
      ...prev,
      pendingServiceRequests: Math.max(0, prev.pendingServiceRequests - 1),
    }));
  };

  const sendMessage = (conversationId: string, text: string) => {
    const newMsg = {
      id: `M-${Date.now().toString().slice(-4)}`,
      sender: 'hotel' as const,
      senderName: 'GrandStay Staff',
      channel: 'WhatsApp' as const,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: text,
              lastTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              messages: [...c.messages, newMsg],
            }
          : c
      )
    );
  };

  const addInboxMessage = (msgData: Omit<InboxMessage, 'id' | 'timestamp'>) => {
    const newMsg: InboxMessage = {
      ...msgData,
      id: `MSG-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: 'Just now',
    };
    setInboxMessages((prev) => [newMsg, ...prev]);
  };

  const resetAllData = () => {
    localStorage.clear();
    setMetrics(INITIAL_METRICS);
    setGuests(INITIAL_GUESTS);
    setLeads(INITIAL_LEADS);
    setCompanies(INITIAL_COMPANIES);
    setDeals(INITIAL_DEALS);
    setRooms(INITIAL_ROOMS);
    setReservations(INITIAL_RESERVATIONS);
    setHousekeeping(INITIAL_HOUSEKEEPING);
    setServiceRequests(INITIAL_SERVICE_REQUESTS);
    setConversations(INITIAL_CONVERSATIONS);
    setInboxMessages(INITIAL_INBOX_MESSAGES);
    setActivities(INITIAL_ACTIVITIES);
  };

  return (
    <HotelContext.Provider
      value={{
        role,
        setRole,
        isAuthenticated,
        currentUser,
        login,
        logout,
        switchUserRole: setRole,
        metrics,
        guests,
        leads,
        companies,
        deals,
        rooms,
        reservations,
        housekeeping,
        serviceRequests,
        conversations,
        inboxMessages,
        reviews,
        feedback: reviews,
        loyalty,
        activities,
        addLead,
        updateLeadStatus,
        convertLeadToReservation,
        addGuest,
        addReservation,
        performCheckIn,
        performCheckOut,
        updateRoomStatus,
        updateHousekeepingStatus,
        addHousekeepingTask,
        addServiceRequest,
        resolveServiceRequest,
        sendMessage,
        addInboxMessage,
        resetAllData,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};
