import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { FeedbackReview } from '../../types';
import {
  Star,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  Info,
  CheckCircle2,
  AlertCircle,
  Filter,
  Search,
  Plus,
  UserCheck,
  Utensils,
  Building,
  Wifi,
  Tag,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  XCircle,
  Calendar,
  MessageCircle,
  Globe
} from 'lucide-react';

export interface CategoryInfo {
  key: FeedbackReview['category'];
  title: string;
  icon: React.ReactNode;
  description: string;
  scopeDetails: string[];
  benchmarkTarget: string;
  badgeBg: string;
  badgeText: string;
  cardBg: string;
  borderColor: string;
}

export const CATEGORIES_CONFIG: Record<FeedbackReview['category'], CategoryInfo> = {
  Cleanliness: {
    key: 'Cleanliness',
    title: 'Cleanliness & Hygiene',
    icon: <Sparkles className="h-4 w-4 text-emerald-600" />,
    description: 'Evaluates guest satisfaction with room hygiene, bed linen freshness, bathroom sanitation, public space cleanliness, and daily housekeeping thoroughness.',
    scopeDetails: [
      'Room & bathroom deep sanitation standards',
      'Linen, towel & bedding freshness',
      'Public lobby, elevator & hallway tidiness',
      'Turn-down service quality and odor-free room environment'
    ],
    benchmarkTarget: 'Target >= 4.8 / 5.0 Rating',
    badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    badgeText: 'text-emerald-700',
    cardBg: 'bg-emerald-50/50',
    borderColor: 'border-emerald-200'
  },
  Staff: {
    key: 'Staff',
    title: 'Staff & Service Hospitality',
    icon: <UserCheck className="h-4 w-4 text-purple-600" />,
    description: 'Assesses front desk check-in speed, concierge helpfulness, butler attentiveness, staff friendliness, multi-lingual support, and issue resolution speed.',
    scopeDetails: [
      'Front desk warmth, speed & welcoming greeting',
      'Concierge local recommendations & tour bookings',
      'Proactive issue resolution & guest empathy',
      'Staff grooming, courtesy & personalized care'
    ],
    benchmarkTarget: 'Target >= 4.9 / 5.0 Rating',
    badgeBg: 'bg-purple-50 border-purple-200 text-purple-800',
    badgeText: 'text-purple-700',
    cardBg: 'bg-purple-50/50',
    borderColor: 'border-purple-200'
  },
  'Food & Beverage': {
    key: 'Food & Beverage',
    title: 'Food, Dining & Bar',
    icon: <Utensils className="h-4 w-4 text-amber-600" />,
    description: 'Measures breakfast buffet quality, live kitchen station variety, room service delivery promptness, food temperature, dietary care, and bar service.',
    scopeDetails: [
      'Breakfast buffet diversity & live cooking stations',
      'In-room dining speed & hot meal temperature',
      'Dietary choices (gluten-free, vegan, allergen safety)',
      'Bar & restaurant ambiance, taste & presentation'
    ],
    benchmarkTarget: 'Target >= 4.7 / 5.0 Rating',
    badgeBg: 'bg-amber-50 border-amber-200 text-amber-800',
    badgeText: 'text-amber-700',
    cardBg: 'bg-amber-50/50',
    borderColor: 'border-amber-200'
  },
  Amenities: {
    key: 'Amenities',
    title: 'Amenities & Facilities',
    icon: <Building className="h-4 w-4 text-blue-600" />,
    description: 'Monitors guest satisfaction with swimming pool upkeep, fitness center equipment, spa therapies, air conditioning cooling, and room facilities.',
    scopeDetails: [
      'Air conditioning cooling efficiency & quiet operation',
      'Rooftop swimming pool hygiene & lounger availability',
      'Fitness center equipment state & spa wellness',
      'Hot water pressure, smart TV casting & minibar stock'
    ],
    benchmarkTarget: 'Target >= 4.6 / 5.0 Rating',
    badgeBg: 'bg-blue-50 border-blue-200 text-blue-800',
    badgeText: 'text-blue-700',
    cardBg: 'bg-blue-50/50',
    borderColor: 'border-blue-200'
  },
  'Wi-Fi': {
    key: 'Wi-Fi',
    title: 'Wi-Fi & Connectivity',
    icon: <Wifi className="h-4 w-4 text-indigo-600" />,
    description: 'Tracks wireless internet uptime, signal coverage across all guest rooms, floor-to-floor roaming, video conference bandwidth, and TV casting.',
    scopeDetails: [
      'High-speed bandwidth for video calls & streaming',
      'Seamless floor-to-floor Wi-Fi roaming without drops',
      'Smart TV internet pairing & casting support',
      'In-room charging outlets & desk workstation power'
    ],
    benchmarkTarget: 'Target >= 4.5 / 5.0 Rating',
    badgeBg: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    badgeText: 'text-indigo-700',
    cardBg: 'bg-indigo-50/50',
    borderColor: 'border-indigo-200'
  },
  Value: {
    key: 'Value',
    title: 'Value for Money',
    icon: <Tag className="h-4 w-4 text-rose-600" />,
    description: 'Measures guest perception of room rates relative to room size, complimentary inclusions (breakfast, airport shuttle), package offers, and loyalty perks.',
    scopeDetails: [
      'Perceived rate fairness relative to room luxury',
      'Inclusion value (complimentary breakfast, Wi-Fi, transfers)',
      'Loyalty points earning & perks satisfaction',
      'Invoice clarity & transparent billing'
    ],
    benchmarkTarget: 'Target >= 4.6 / 5.0 Rating',
    badgeBg: 'bg-rose-50 border-rose-200 text-rose-800',
    badgeText: 'text-rose-700',
    cardBg: 'bg-rose-50/50',
    borderColor: 'border-rose-200'
  }
};

export const FeedbackView: React.FC = () => {
  const { feedback = [], reviews = [] } = useHotel();
  const allReviewsList: FeedbackReview[] = reviews.length ? reviews : feedback;

  const [selectedCategory, setSelectedCategory] = useState<FeedbackReview['category'] | 'all'>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [activeCategoryModal, setActiveCategoryModal] = useState<FeedbackReview['category'] | null>(null);

  // Add review modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [localReviews, setLocalReviews] = useState<FeedbackReview[]>(allReviewsList);
  const [newReviewForm, setNewReviewForm] = useState<{
    guestName: string;
    roomNumber: string;
    rating: number;
    category: FeedbackReview['category'];
    source: FeedbackReview['source'];
    reviewText: string;
    sentiment: FeedbackReview['sentiment'];
  }>({
    guestName: '',
    roomNumber: '201',
    rating: 5,
    category: 'Cleanliness',
    source: 'Direct Survey',
    reviewText: '',
    sentiment: 'Positive'
  });

  const [aiThemes, setAiThemes] = useState<{
    positiveThemes: string[];
    negativeThemes: string[];
    actionPlan: string;
  } | null>({
    positiveThemes: ['Attentive Front Desk Staff & Butler Service', 'Spacious Sea View Rooms & Clean Linen', 'Rich Breakfast Buffet Variety'],
    negativeThemes: ['Room 204 Wi-Fi Disconnecting during calls', 'Pool lounger availability during peak afternoon hours'],
    actionPlan: 'Upgrade Access Point firmware on Floor 2 and add 6 additional sun loungers near the rooftop pool area.',
  });

  const handleRunAiSentiment = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/ai/review-sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback: localReviews }),
      });
      const data = await res.json();
      if (data.positiveThemes) setAiThemes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewForm.guestName || !newReviewForm.reviewText) return;

    const newRev: FeedbackReview = {
      id: `REV-${Date.now().toString().slice(-4)}`,
      guestName: newReviewForm.guestName,
      roomNumber: newReviewForm.roomNumber,
      rating: newReviewForm.rating,
      source: newReviewForm.source,
      reviewText: newReviewForm.reviewText,
      sentiment: newReviewForm.sentiment,
      date: new Date().toISOString().split('T')[0],
      category: newReviewForm.category,
      status: 'Reviewed'
    };

    setLocalReviews([newRev, ...localReviews]);
    setShowAddModal(false);
    setNewReviewForm({
      guestName: '',
      roomNumber: '201',
      rating: 5,
      category: 'Cleanliness',
      source: 'Direct Survey',
      reviewText: '',
      sentiment: 'Positive'
    });
  };

  // Filtered reviews
  const filteredReviews = localReviews.filter((r) => {
    const matchesCat = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesSent = selectedSentiment === 'all' || r.sentiment.toLowerCase() === selectedSentiment.toLowerCase();
    const matchesSearch =
      r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reviewText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.roomNumber && r.roomNumber.includes(searchQuery));
    return matchesCat && matchesSent && matchesSearch;
  });

  const avgRating = localReviews.length
    ? (localReviews.reduce((sum, f) => sum + f.rating, 0) / localReviews.length).toFixed(1)
    : '4.8';

  // Category statistics helper
  const getCategoryStats = (catKey: FeedbackReview['category']) => {
    const catReviews = localReviews.filter((r) => r.category === catKey);
    const count = catReviews.length;
    const catAvg = count ? (catReviews.reduce((s, r) => s + r.rating, 0) / count).toFixed(1) : '5.0';
    return { count, avg: catAvg };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Guest Reviews & Feedback Intelligence</h1>
            <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-700">
              {localReviews.length} Total Reviews
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor overall guest satisfaction, category descriptions, evaluation metrics, and AI sentiment themes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-2xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Review / Survey</span>
          </button>

          <button
            onClick={handleRunAiSentiment}
            disabled={analyzing}
            className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-purple-700 transition shadow-2xs"
          >
            {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            <span>Run AI Sentiment Analysis</span>
          </button>
        </div>
      </div>

      {/* CATEGORY EVALUATION MATRIX - CLEAR CATEGORY DESCRIPTIONS & METRICS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              <span>Feedback Categories & Scope Descriptions</span>
            </h2>
            <p className="text-xs text-slate-500">
              Detailed breakdown of what operational metrics are evaluated under each feedback category.
            </p>
          </div>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Reset Category Filter
            </button>
          )}
        </div>

        {/* 6 Category Cards Grid with Full Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(Object.keys(CATEGORIES_CONFIG) as FeedbackReview['category'][]).map((catKey) => {
            const config = CATEGORIES_CONFIG[catKey];
            const stats = getCategoryStats(catKey);
            const isSelected = selectedCategory === catKey;

            return (
              <div
                key={catKey}
                onClick={() => setSelectedCategory(isSelected ? 'all' : catKey)}
                className={`group cursor-pointer rounded-xl p-4 transition duration-150 space-y-3 border ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-sm ring-2 ring-indigo-500/20'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                {/* Top Row: Icon, Title & Rating */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${config.badgeBg}`}>
                      {config.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs group-hover:text-indigo-600 transition">
                        {config.title}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {stats.count} {stats.count === 1 ? 'review' : 'reviews'} logged
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1 justify-end">
                      {stats.avg} <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    </span>
                    <span className="text-[9px] font-extrabold text-emerald-600 block uppercase">
                      Active Benchmark
                    </span>
                  </div>
                </div>

                {/* CATEGORY DESCRIPTION BOX */}
                <div className="rounded-lg bg-slate-50 p-2.5 text-[11px] text-slate-600 leading-relaxed border border-slate-100">
                  <span className="font-semibold text-slate-800 block text-[10px] uppercase tracking-wide mb-0.5 text-indigo-700">
                    Category Scope:
                  </span>
                  {config.description}
                </div>

                {/* Scope Details / Key focus list preview */}
                <div className="space-y-1 pt-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Key Evaluation Scope:</span>
                  <div className="flex flex-wrap gap-1">
                    {config.scopeDetails.map((detail, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-white px-2 py-0.5 text-[10px] text-slate-600 border border-slate-200/60 font-medium truncate max-w-full"
                      >
                        • {detail}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                  <span className="font-semibold text-slate-400">{config.benchmarkTarget}</span>
                  <span className="font-bold text-indigo-600 flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                    <span>{isSelected ? 'Viewing Category' : 'Filter Reviews'}</span>
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Sentiment Synthesis Banner */}
      {aiThemes && (
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 p-5 text-white shadow-md space-y-4 border border-purple-900/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-300" />
              <h2 className="font-bold text-xs uppercase tracking-wider text-purple-200">
                AI Synthesized Sentiment Analysis Across All Categories
              </h2>
            </div>
            <span className="text-xl font-extrabold text-amber-300 flex items-center gap-1">
              {avgRating} <Star className="h-5 w-5 fill-amber-300 text-amber-300 inline" />
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl bg-emerald-950/40 border border-emerald-500/30 p-3 space-y-2">
              <span className="font-bold text-emerald-300 flex items-center gap-1">
                <ThumbsUp className="h-4 w-4 text-emerald-400" /> Top Guest Praises
              </span>
              <ul className="space-y-1 text-emerald-100 list-disc list-inside">
                {aiThemes.positiveThemes.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-rose-950/40 border border-rose-500/30 p-3 space-y-2">
              <span className="font-bold text-rose-300 flex items-center gap-1">
                <ThumbsDown className="h-4 w-4 text-rose-400" /> Key Areas for Improvement
              </span>
              <ul className="space-y-1 text-rose-100 list-disc list-inside">
                {aiThemes.negativeThemes.map((nt, i) => (
                  <li key={i}>{nt}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl bg-white/10 p-3 border border-white/10 text-xs">
            <span className="font-bold text-amber-300 block mb-1">Recommended Managerial Action Plan:</span>
            <p className="text-slate-200">{aiThemes.actionPlan}</p>
          </div>
        </div>
      )}

      {/* FILTER TOOLBAR & REVIEWS LIST */}
      <div className="space-y-4">
        {/* Active Category Detail Spotlight Banner */}
        {selectedCategory !== 'all' && (
          <div className={`rounded-xl p-4 border ${CATEGORIES_CONFIG[selectedCategory].borderColor} ${CATEGORIES_CONFIG[selectedCategory].cardBg} space-y-2`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {CATEGORIES_CONFIG[selectedCategory].icon}
                <h3 className="font-bold text-slate-900 text-sm">
                  Active Filter: {CATEGORIES_CONFIG[selectedCategory].title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Clear Filter
              </button>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Category Operational Description: </strong>
              {CATEGORIES_CONFIG[selectedCategory].description}
            </p>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by guest name, room number, or review keyword..."
              className="w-full rounded-lg bg-slate-50 border-0 pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="rounded-lg bg-slate-50 border-0 px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="all">Category: All ({localReviews.length})</option>
              {Object.keys(CATEGORIES_CONFIG).map((cat) => (
                <option key={cat} value={cat}>
                  {cat} ({localReviews.filter((r) => r.category === cat).length})
                </option>
              ))}
            </select>

            {/* Sentiment Filter */}
            <select
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="rounded-lg bg-slate-50 border-0 px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="all">Sentiment: All</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>
        </div>

        {/* Reviews Cards List */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Guest Feedback Logs ({filteredReviews.length})
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              Hover category badge for operational scope description
            </span>
          </div>

          {filteredReviews.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 font-medium space-y-2">
              <AlertCircle className="h-6 w-6 text-slate-300 mx-auto" />
              <p>No guest reviews found matching your selected filters.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReviews.map((r) => {
                const categoryConfig = CATEGORIES_CONFIG[r.category] || CATEGORIES_CONFIG['Cleanliness'];

                return (
                  <div
                    key={r.id}
                    className="group rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-3 text-xs hover:bg-white hover:border-slate-200 transition shadow-2xs"
                  >
                    {/* Top Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs">
                          {r.guestName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            <span>{r.guestName}</span>
                            {r.roomNumber && (
                              <span className="text-[10px] text-slate-400 font-normal">
                                (Room {r.roomNumber})
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Globe className="h-3 w-3 text-slate-400" />
                              {r.source}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-slate-400" />
                              {r.date}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Rating & Sentiment Badges */}
                      <div className="flex items-center gap-2">
                        {/* Rating Stars */}
                        <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-1 rounded-md border border-amber-200/60">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="text-amber-800 font-bold ml-1 text-[11px]">{r.rating}.0</span>
                        </div>

                        {/* Category Badge with Info Button */}
                        <div className="relative group/badge">
                          <button
                            onClick={() => setActiveCategoryModal(r.category)}
                            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold border transition ${categoryConfig.badgeBg}`}
                          >
                            {categoryConfig.icon}
                            <span>Category: {r.category}</span>
                            <Info className="h-3 w-3 opacity-60 group-hover/badge:opacity-100" />
                          </button>

                          {/* Hover Tooltip with Category Description */}
                          <div className="absolute right-0 bottom-full mb-2 hidden group-hover/badge:block w-64 z-30 rounded-xl bg-slate-900 p-3 text-[11px] text-white shadow-xl space-y-1">
                            <span className="font-bold text-amber-300 block">{categoryConfig.title} Description:</span>
                            <p className="text-slate-200 text-[10px] leading-relaxed">{categoryConfig.description}</p>
                            <span className="text-[9px] text-slate-400 block pt-1 border-t border-slate-800">
                              {categoryConfig.benchmarkTarget}
                            </span>
                          </div>
                        </div>

                        {/* Sentiment Tag */}
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            r.sentiment === 'Positive'
                              ? 'bg-emerald-100 text-emerald-800'
                              : r.sentiment === 'Negative'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {r.sentiment}
                        </span>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="rounded-lg bg-white p-3 text-slate-800 leading-relaxed font-medium border border-slate-100 italic">
                      "{r.reviewText}"
                    </div>

                    {/* Category Operational Scope Banner inline */}
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <Info className="h-3 w-3 text-indigo-500" />
                        <strong className="text-slate-700">Category Focus:</strong> {categoryConfig.description}
                      </span>
                      <span className="font-bold text-slate-600">Status: {r.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* CATEGORY INFO DIALOG MODAL */}
      {activeCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${CATEGORIES_CONFIG[activeCategoryModal].badgeBg}`}>
                  {CATEGORIES_CONFIG[activeCategoryModal].icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Category: {CATEGORIES_CONFIG[activeCategoryModal].title}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Operational Evaluation & Quality Scope
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveCategoryModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 uppercase text-[10px] block text-indigo-700">
                  Full Category Description:
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {CATEGORIES_CONFIG[activeCategoryModal].description}
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-900 block">
                  Detailed Operational Checklist Items Tracked:
                </span>
                <ul className="space-y-1.5 text-slate-600">
                  {CATEGORIES_CONFIG[activeCategoryModal].scopeDetails.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-purple-50 p-3 border border-purple-100 flex items-center justify-between">
                <span className="font-bold text-purple-900">Hotel Operational Target:</span>
                <span className="font-extrabold text-purple-700">
                  {CATEGORIES_CONFIG[activeCategoryModal].benchmarkTarget}
                </span>
              </div>
            </div>

            <div className="text-right border-t border-slate-100 pt-3">
              <button
                onClick={() => setActiveCategoryModal(null)}
                className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-900"
              >
                Close Description
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW REVIEW MODAL - Dynamic Category Description Display */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <form
            onSubmit={handleAddReview}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4 border border-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Add New Guest Review / Survey</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Guest Name</label>
                <input
                  type="text"
                  required
                  value={newReviewForm.guestName}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, guestName: e.target.value })}
                  placeholder="e.g. Ananya Roy"
                  className="w-full rounded-lg bg-slate-50 border-0 px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Room Number</label>
                  <input
                    type="text"
                    value={newReviewForm.roomNumber}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, roomNumber: e.target.value })}
                    className="w-full rounded-lg bg-slate-50 border-0 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Source Channel</label>
                  <select
                    value={newReviewForm.source}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, source: e.target.value as any })}
                    className="w-full rounded-lg bg-slate-50 border-0 px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Direct Survey">Direct Survey</option>
                    <option value="Google">Google Review</option>
                    <option value="TripAdvisor">TripAdvisor</option>
                    <option value="Booking.com">Booking.com</option>
                  </select>
                </div>
              </div>

              {/* CATEGORY SELECTOR WITH DYNAMIC DESCRIPTION */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Feedback Category</label>
                <select
                  value={newReviewForm.category}
                  onChange={(e) =>
                    setNewReviewForm({
                      ...newReviewForm,
                      category: e.target.value as FeedbackReview['category']
                    })
                  }
                  className="w-full rounded-lg bg-slate-50 border-0 px-3 py-2 text-xs font-bold text-slate-800"
                >
                  <option value="Cleanliness">Cleanliness & Room Hygiene</option>
                  <option value="Staff">Staff & Service Hospitality</option>
                  <option value="Food & Beverage">Food, Dining & Bar</option>
                  <option value="Amenities">Amenities & Facilities</option>
                  <option value="Wi-Fi">Wi-Fi & Connectivity</option>
                  <option value="Value">Value for Money</option>
                </select>

                {/* DYNAMIC CATEGORY DESCRIPTION PREVIEW BOX */}
                <div className="mt-2 rounded-lg bg-indigo-50/70 p-2.5 text-[11px] text-indigo-900 border border-indigo-100 leading-snug">
                  <span className="font-bold block text-[10px] text-indigo-700 uppercase">
                    Category Description:
                  </span>
                  {CATEGORIES_CONFIG[newReviewForm.category].description}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Rating (1 - 5 Stars)</label>
                  <select
                    value={newReviewForm.rating}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, rating: Number(e.target.value) })}
                    className="w-full rounded-lg bg-slate-50 border-0 px-3 py-2 text-xs font-bold"
                  >
                    <option value={5}>5 Stars - Excellent</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Average</option>
                    <option value={2}>2 Stars - Poor</option>
                    <option value={1}>1 Star - Terrible</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Sentiment</label>
                  <select
                    value={newReviewForm.sentiment}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, sentiment: e.target.value as any })}
                    className="w-full rounded-lg bg-slate-50 border-0 px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Positive">Positive</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Negative">Negative</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Guest Comment / Review Text</label>
                <textarea
                  required
                  rows={3}
                  value={newReviewForm.reviewText}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, reviewText: e.target.value })}
                  placeholder="Enter guest feedback details..."
                  className="w-full rounded-lg bg-slate-50 border-0 px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 shadow-2xs"
              >
                Save Review
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
