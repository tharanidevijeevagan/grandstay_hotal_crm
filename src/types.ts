export type UserRole = 'admin' | 'manager' | 'receptionist' | 'sales' | 'housekeeping';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  address: string;
  idType: string;
  idNumber: string;
  vipStatus: boolean;
  totalStays: number;
  lifetimeSpend: number;
  roomPreferences: string[];
  bedPreferences: string;
  foodPreferences: string[];
  specialRequests?: string;
  aiSummary?: string;
  lastStayDate?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: 'Website' | 'WhatsApp' | 'Phone' | 'Walk-in' | 'OTA' | 'Corporate';
  requirement: string; // e.g. "2 Deluxe Rooms for 3 Nights"
  guestCount: number;
  expectedCheckIn: string;
  expectedCheckOut: string;
  estimatedValue: number;
  leadScore: number; // 0-100
  qualification: 'HOT' | 'WARM' | 'COLD';
  scoreReasons?: string[];
  assignedStaff: string;
  status: 'new' | 'contacted' | 'interested' | 'quotation_sent' | 'negotiation' | 'won' | 'lost';
  notes: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone: string;
  corporateRateCode: string;
  activeContracts: number;
  totalBookings: number;
  revenueGenerated: number;
  discountPercentage: number;
}

export interface Deal {
  id: string;
  title: string;
  companyName?: string;
  leadName?: string;
  value: number;
  stage: 'New' | 'Contacted' | 'Quotation' | 'Negotiation' | 'Won' | 'Lost';
  probability: number;
  closeDate: string;
  assignedTo: string;
}

export interface RoomType {
  id: string;
  name: string;
  basePrice: number;
  capacity: number;
  amenities: string[];
  description: string;
  totalRooms: number;
}

export interface Room {
  id: string;
  number: string;
  floor: number;
  roomTypeId: string;
  roomTypeName: string;
  price: number;
  capacity: number;
  status: 'available' | 'reserved' | 'occupied' | 'cleaning' | 'maintenance' | 'out_of_order';
  housekeepingStatus: 'clean' | 'dirty' | 'inspecting';
  currentGuestName?: string;
  currentReservationId?: string;
  features: string[];
}

export interface Reservation {
  id: string;
  guestId: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  nightlyRate: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'paid' | 'partial' | 'pending';
  bookingSource: string;
  status: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  specialRequests?: string;
  createdAt: string;
}

export interface HousekeepingTask {
  id: string;
  roomNumber: string;
  taskType: 'Full Clean' | 'Touch Up' | 'Deep Clean' | 'Linen Change' | 'Inspection';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'inspection' | 'ready';
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

export interface ServiceRequest {
  id: string;
  guestName: string;
  roomNumber: string;
  type: 'AC Repair' | 'Plumbing' | 'Extra Towels' | 'Room Cleaning' | 'Room Service' | 'Airport Transfer' | 'Wi-Fi Issue' | 'Other';
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedStaff?: string;
  assignedTo?: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
}

export interface Message {
  id: string;
  sender: 'guest' | 'hotel' | 'system';
  senderName: string;
  channel: 'Email' | 'WhatsApp' | 'Website chat' | 'Website Chat' | 'SMS';
  text: string;
  timestamp: string;
}

export interface InboxMessage {
  id: string;
  senderName: string;
  senderContact: string;
  channel: 'WhatsApp' | 'Email' | 'Website Chat' | 'Website chat' | 'SMS';
  content: string;
  timestamp: string;
  status: 'unread' | 'read' | 'replied' | 'pending';
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface Conversation {
  id: string;
  guestId?: string;
  leadId?: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  channel: 'Email' | 'WhatsApp' | 'Website chat' | 'SMS';
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: Message[];
}

export interface FeedbackReview {
  id: string;
  guestName: string;
  roomNumber?: string;
  rating: number; // 1 to 5
  source: 'Google' | 'TripAdvisor' | 'Booking.com' | 'Direct Survey';
  reviewText: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  date: string;
  category: 'Cleanliness' | 'Staff' | 'Amenities' | 'Food & Beverage' | 'Wi-Fi' | 'Value';
  status: 'Reviewed' | 'Action Needed' | 'Resolved';
}

export interface LoyaltyMember {
  id: string;
  guestId: string;
  guestName: string;
  tier: 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  pointsBalance: number;
  joinDate: string;
  perksUsed: string[];
}

export interface HotelActivity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'booking' | 'checkin' | 'checkout' | 'lead' | 'servicerequest' | 'ai' | 'system';
  user?: string;
}

export interface HotelMetrics {
  revenueToday: number;
  occupancyRate: number;
  newLeadsToday: number;
  confirmedBookingsToday: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  pendingServiceRequests: number;
  availableRoomsCount: number;
}
