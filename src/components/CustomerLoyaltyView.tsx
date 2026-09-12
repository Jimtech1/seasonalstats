import React, { useState } from 'react';
import { 
  LoyaltyCustomer, 
  LoyaltyMetrics, 
  CareInsertTemplate, 
  CustomerSegmentType 
} from '../types';
import { 
  Heart, 
  Printer, 
  Sparkles, 
  Calendar, 
  Tag, 
  QrCode, 
  Copy, 
  Check, 
  Gift, 
  Clock, 
  UserCheck, 
  MessageSquare, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  Flame,
  Award,
  Edit3
} from 'lucide-react';

interface CustomerLoyaltyViewProps {
  metrics: LoyaltyMetrics;
  customers: LoyaltyCustomer[];
  templates: CareInsertTemplate[];
  onUpdateTemplate: (updated: CareInsertTemplate) => void;
  onSendReengagementNote?: (customerName: string, coupon: string) => void;
}

export const CustomerLoyaltyView: React.FC<CustomerLoyaltyViewProps> = ({
  metrics,
  customers,
  templates,
  onUpdateTemplate,
  onSendReengagementNote,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'segments' | 'inserts'>('segments');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || 'insert-pottery');
  const [editingTemplate, setEditingTemplate] = useState<CareInsertTemplate>(
    templates.find(t => t.id === selectedTemplateId) || templates[0]
  );
  const [isCopiedNote, setIsCopiedNote] = useState<string | null>(null);
  const [activeCustomerNoteModal, setActiveCustomerNoteModal] = useState<LoyaltyCustomer | null>(null);

  const filteredCustomers = customers.filter(c => {
    if (selectedSegment !== 'all' && c.segment !== selectedSegment) return false;
    return true;
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleTemplateSelect = (id: string) => {
    setSelectedTemplateId(id);
    const found = templates.find(t => t.id === id);
    if (found) {
      setEditingTemplate(found);
    }
  };

  const handlePrintCard = () => {
    window.print();
  };

  const segmentLabels: Record<CustomerSegmentType, { label: string; badgeColor: string; description: string }> = {
    vip_artisan: {
      label: 'VIP Artisan Patron',
      badgeColor: 'bg-[#5A7A5A]/15 text-[#2E472E] border border-[#5A7A5A]/30',
      description: '3+ studio orders, high LTV, frequent feedback and photo reviews'
    },
    holiday_gifter: {
      label: 'Holiday Gifter',
      badgeColor: 'bg-[#D97757]/15 text-[#D97757] border border-[#D97757]/30',
      description: 'Purchases gift sets in Nov/Dec, reorder window peaks mid-autumn'
    },
    collector_repeat: {
      label: 'Craft Collector',
      badgeColor: 'bg-[#6A7B8C]/15 text-[#2E4057] border border-[#6A7B8C]/30',
      description: 'Follows kiln drops and new product launches across categories'
    },
    at_risk: {
      label: 'At-Risk Past Buyer',
      badgeColor: 'bg-[#B85C4A]/15 text-[#B85C4A] border border-[#B85C4A]/30',
      description: 'Single purchase >120 days ago, ripe for autumn win-back note'
    }
  };

  return (
    <div id="tour-customer-loyalty-container" className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
              Seasonal Customer Loyalty & Packaging Inserts
            </h1>
            <span className="text-[11px] font-mono font-bold bg-[#5A7A5A]/15 text-[#2E472E] px-2.5 py-0.5 rounded-full">
              Repeat Buyer Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#665D4F] mt-1">
            Turn one-time Etsy shoppers into lifelong collectors with seasonal re-order forecasting and printable craft care inserts.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center p-1 bg-[#EAE5DC] rounded-xl border border-[#DCD5C9]">
          <button
            type="button"
            onClick={() => setActiveSubTab('segments')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'segments'
                ? 'bg-white text-[#1A1A1A] shadow-xs'
                : 'text-[#665D4F] hover:text-[#1A1A1A]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#5A7A5A]" />
            <span>Buyer Segments ({customers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('inserts')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'inserts'
                ? 'bg-white text-[#1A1A1A] shadow-xs'
                : 'text-[#665D4F] hover:text-[#1A1A1A]'
            }`}
          >
            <Printer className="w-3.5 h-3.5 text-[#D97757]" />
            <span>Printable Care Cards</span>
          </button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-[#E2D8C9] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#7A7163] block">Repeat Buyer Rate</span>
          <span className="text-lg sm:text-xl font-bold text-[#2E472E] mt-1 block">
            {metrics.repeatBuyerRate}%
          </span>
          <span className="text-[11px] text-[#5A7A5A] font-semibold mt-0.5 block">
            vs 18% Etsy craft avg
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-[#E2D8C9] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#7A7163] block">Repeat Revenue</span>
          <span className="text-lg sm:text-xl font-bold text-[#1A1A1A] mt-1 block">
            ${metrics.totalRepeatRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-[#7A7163] mt-0.5 block">
            34% of total shop income
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-[#E2D8C9] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#7A7163] block">Reorder Velocity</span>
          <span className="text-lg sm:text-xl font-bold text-[#1A1A1A] mt-1 block">
            {metrics.avgDaysBetweenOrders} days
          </span>
          <span className="text-[11px] text-[#7A7163] mt-0.5 block">
            Avg window between orders
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-[#E2D8C9] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[#7A7163] block">Holiday Gifter Retention</span>
          <span className="text-lg sm:text-xl font-bold text-[#D97757] mt-1 block">
            {metrics.holidayGiftRetentionRate}%
          </span>
          <span className="text-[11px] text-[#5A7A5A] font-semibold mt-0.5 block">
            Return within 12 months
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-[#E2D8C9] shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-[#7A7163] block">VIP Coupon Uses</span>
          <span className="text-lg sm:text-xl font-bold text-[#1A1A1A] mt-1 block">
            {metrics.activeCouponRedemptions}
          </span>
          <span className="text-[11px] text-[#5A7A5A] font-semibold mt-0.5 block">
            From package care cards
          </span>
        </div>
      </div>

      {activeSubTab === 'segments' ? (
        /* Buyer Segments & Reorder Forecasting */
        <div className="space-y-4">
          {/* Segment Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A7163] mr-1">
              Segment:
            </span>
            <button
              type="button"
              onClick={() => setSelectedSegment('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedSegment === 'all'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-white text-[#665D4F] hover:bg-[#FAF7F2] border border-[#E2D8C9]'
              }`}
            >
              All Patrons ({customers.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedSegment('vip_artisan')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                selectedSegment === 'vip_artisan'
                  ? 'bg-[#2E472E] text-white'
                  : 'bg-white text-[#2E472E] hover:bg-[#FAF7F2] border border-[#E2D8C9]'
              }`}
            >
              <Award className="w-3 h-3" />
              <span>VIP Artisan Patrons</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedSegment('holiday_gifter')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                selectedSegment === 'holiday_gifter'
                  ? 'bg-[#D97757] text-white'
                  : 'bg-white text-[#D97757] hover:bg-[#FAF7F2] border border-[#E2D8C9]'
              }`}
            >
              <Gift className="w-3 h-3" />
              <span>Holiday Gifters</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedSegment('collector_repeat')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                selectedSegment === 'collector_repeat'
                  ? 'bg-[#2E4057] text-white'
                  : 'bg-white text-[#2E4057] hover:bg-[#FAF7F2] border border-[#E2D8C9]'
              }`}
            >
              <ShoppingBag className="w-3 h-3" />
              <span>Repeat Collectors</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedSegment('at_risk')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                selectedSegment === 'at_risk'
                  ? 'bg-[#B85C4A] text-white'
                  : 'bg-white text-[#B85C4A] hover:bg-[#FAF7F2] border border-[#E2D8C9]'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>At-Risk Past Buyers</span>
            </button>
          </div>

          {/* Customer Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCustomers.map((cust) => {
              const segInfo = segmentLabels[cust.segment];

              return (
                <div 
                  key={cust.id}
                  className="bg-white rounded-xl border border-[#E2D8C9] p-4 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {/* Customer Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-[#1A1A1A]">
                            {cust.customerName}
                          </h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${segInfo.badgeColor}`}>
                            {segInfo.label}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#7A7163] font-mono">
                          {cust.emailMasked} · Member since {cust.firstOrderDate}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-[#7A7163] block">Lifetime Value</span>
                        <span className="font-bold text-sm text-[#1A1A1A]">${cust.lifetimeValue.toFixed(2)}</span>
                        <span className="text-[10px] text-[#5A7A5A] block">({cust.totalOrders} orders)</span>
                      </div>
                    </div>

                    {/* Order Details & Category */}
                    <div className="p-2.5 bg-[#FAF7F2] rounded-lg border border-[#E8E1D7] text-xs space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#7A7163]">Favorite Craft Category:</span>
                        <span className="font-semibold text-[#1A1A1A]">{cust.favoriteCategory}</span>
                      </div>
                      <div className="text-[11px] text-[#6B6356] truncate">
                        <span className="text-[#7A7163]">Purchased: </span>
                        {cust.lastPurchasedItems.join(', ')}
                      </div>
                      <div className="text-[11px] text-[#8C8375] italic pt-1 border-t border-[#E8E1D7]">
                        "{cust.notes}"
                      </div>
                    </div>

                    {/* Predicted Re-order Window Callout */}
                    <div className="p-2.5 bg-[#5A7A5A]/10 rounded-lg border border-[#5A7A5A]/25 text-xs flex items-start gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#5A7A5A] shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <span className="text-[10px] uppercase font-bold text-[#2E472E]">
                            Predicted Re-Order Window
                          </span>
                          <span 
                            className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/80 border border-[#5A7A5A]/20 text-[#2E472E] cursor-help"
                            title={
                              cust.totalOrders <= 1 
                                ? 'Category estimate: Based on aggregate repeat purchase intervals for this craft category. Personalized pacing requires 2+ orders.' 
                                : `Personal history: Calculated from this customer's historical purchase cadence across ${cust.totalOrders} past orders.`
                            }
                          >
                            {cust.totalOrders <= 1 ? 'Category estimate (1 order)' : `Personal history (${cust.totalOrders} orders)`}
                          </span>
                        </div>
                        <span className="font-semibold text-[#1A1A1A] text-xs block mt-0.5">
                          {cust.nextPredictedReorderWindow}
                        </span>
                        <span className="text-[11px] text-[#4A634A] block mt-0.5">
                          Last purchased {cust.daysSinceLastOrder} days ago · {cust.totalOrders <= 1 ? 'Estimated from category benchmarks' : 'Derived from individual buyer history'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[#F0EAE1]">
                    <button
                      type="button"
                      onClick={() => setActiveCustomerNoteModal(cust)}
                      className="flex-1 py-1.5 bg-white hover:bg-[#FAF7F2] text-[#1A1A1A] border border-[#E2D8C9] rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#D97757]" />
                      <span>Re-engagement Note</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy('STUDIOVIP15')}
                      className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#2E472E] border border-[#5A7A5A]/30 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      title="Copy VIP 15% Discount Code"
                    >
                      {copiedCode === 'STUDIOVIP15' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#5A7A5A]" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>VIP15 Code</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Printable Packaging & Care Inserts Studio */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Customizer Sidebar */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 bg-white rounded-xl border border-[#E2D8C9] shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4A4235] block">
                Select Care Card Template
              </span>

              <div className="grid grid-cols-2 gap-2">
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleTemplateSelect(tpl.id)}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                      selectedTemplateId === tpl.id
                        ? 'bg-[#FAF7F2] border-[#D97757] text-[#1A1A1A] font-semibold ring-1 ring-[#D97757]'
                        : 'bg-white border-[#E2D8C9] text-[#665D4F] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <span className="font-bold block truncate">{tpl.name.split(' ')[0]} Care</span>
                    <span className="text-[10px] text-[#8C8375] block mt-0.5 truncate">{tpl.category}</span>
                  </button>
                ))}
              </div>

              {/* Editable Fields */}
              <div className="space-y-3 pt-2 border-t border-[#F0EAE1] text-xs">
                <div>
                  <label htmlFor="care-card-headline" className="font-bold text-[#4A4235] block mb-1">
                    Card Title / Headline
                  </label>
                  <input
                    id="care-card-headline"
                    type="text"
                    value={editingTemplate.headline}
                    onChange={(e) => {
                      const updated = { ...editingTemplate, headline: e.target.value };
                      setEditingTemplate(updated);
                      onUpdateTemplate(updated);
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-[#E2D8C9] rounded-lg text-xs focus:outline-hidden focus:border-[#D97757] text-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label htmlFor="care-card-artisan-note" className="font-bold text-[#4A4235] block mb-1">
                    Handwritten Artisan Note
                  </label>
                  <textarea
                    id="care-card-artisan-note"
                    rows={2}
                    value={editingTemplate.personalArtisanNote}
                    onChange={(e) => {
                      const updated = { ...editingTemplate, personalArtisanNote: e.target.value };
                      setEditingTemplate(updated);
                      onUpdateTemplate(updated);
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-[#E2D8C9] rounded-lg text-xs focus:outline-hidden focus:border-[#D97757] text-[#1A1A1A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="care-card-coupon-code" className="font-bold text-[#4A4235] block mb-1">
                      VIP Coupon Code
                    </label>
                    <input
                      id="care-card-coupon-code"
                      type="text"
                      value={editingTemplate.couponCode}
                      onChange={(e) => {
                        const updated = { ...editingTemplate, couponCode: e.target.value.toUpperCase() };
                        setEditingTemplate(updated);
                        onUpdateTemplate(updated);
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-[#E2D8C9] rounded-lg font-mono text-xs focus:outline-hidden focus:border-[#D97757] text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label htmlFor="care-card-discount-percent" className="font-bold text-[#4A4235] block mb-1">
                      Discount %
                    </label>
                    <input
                      id="care-card-discount-percent"
                      type="number"
                      value={editingTemplate.discountPercent}
                      onChange={(e) => {
                        const updated = { ...editingTemplate, discountPercent: Number(e.target.value) };
                        setEditingTemplate(updated);
                        onUpdateTemplate(updated);
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-[#E2D8C9] rounded-lg text-xs focus:outline-hidden focus:border-[#D97757] text-[#1A1A1A]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="care-card-social-handle" className="font-bold text-[#4A4235] block mb-1">
                    Studio Social Handle
                  </label>
                  <input
                    id="care-card-social-handle"
                    type="text"
                    value={editingTemplate.includeSocialHandle}
                    onChange={(e) => {
                      const updated = { ...editingTemplate, includeSocialHandle: e.target.value };
                      setEditingTemplate(updated);
                      onUpdateTemplate(updated);
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-[#E2D8C9] rounded-lg font-mono text-xs focus:outline-hidden focus:border-[#D97757] text-[#1A1A1A]"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePrintCard}
                className="flex-1 py-2.5 bg-[#D97757] hover:bg-[#C26547] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Physical Care Inserts (4" × 6")</span>
              </button>
            </div>
          </div>

          {/* Physical Linen Card Preview Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-[#FAF7F0] border-2 border-[#D4C8B8] rounded-2xl shadow-xl p-6 sm:p-8 space-y-5 text-[#2C261E] relative overflow-hidden">
              {/* Subtle Deckle-Edge Craft Border Texture */}
              <div className="absolute inset-1.5 border border-dashed border-[#D4C8B8]/60 rounded-xl pointer-events-none" />

              {/* Studio Header & Wax Stamp Simulation */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC8]">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#D97757]/20 text-[#D97757] flex items-center justify-center text-xs font-serif font-bold">
                    W
                  </span>
                  <span className="font-editorial text-sm font-bold tracking-wide uppercase text-[#1A1A1A]">
                    The Woodland Artisan Studio
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase text-[#7A7163]">
                  Handmade in Batch
                </span>
              </div>

              {/* Main Headline */}
              <div className="text-center space-y-1">
                <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#1A1A1A] leading-tight">
                  {editingTemplate.headline}
                </h2>
                <p className="text-xs text-[#7A7163] italic font-serif">
                  Crafted with patience and natural earth materials
                </p>
              </div>

              {/* Care Instructions Bullets */}
              <div className="space-y-2.5 py-1">
                {editingTemplate.careInstructions.map((instruction, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#4A4036] leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D97757] shrink-0 mt-1.5" />
                    <span>{instruction}</span>
                  </div>
                ))}
              </div>

              {/* Artisan Note */}
              <div className="p-3 bg-white/70 rounded-xl border border-[#E2D8C9] text-xs italic font-serif text-[#4A4036] text-center leading-relaxed">
                "{editingTemplate.personalArtisanNote}"
              </div>

              {/* QR Code & VIP Coupon Voucher Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[#E8DFC8] gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7163] block">
                    VIP Collector Privilege
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs sm:text-sm font-bold bg-[#1A1A1A] text-white px-2 py-0.5 rounded">
                      {editingTemplate.couponCode}
                    </span>
                    <span className="text-xs font-semibold text-[#2E472E]">
                      {editingTemplate.discountPercent}% OFF Next Order
                    </span>
                  </div>
                  <span className="text-[10px] text-[#7A7163] block">
                    Tag your setup on IG {editingTemplate.includeSocialHandle}
                  </span>
                </div>

                {/* Simulated QR Code */}
                <div className="p-2 bg-white rounded-lg border border-[#D4C8B8] flex flex-col items-center shrink-0">
                  <QrCode className="w-10 h-10 text-[#1A1A1A]" />
                  <span className="text-[8px] font-mono uppercase tracking-tighter text-[#7A7163] mt-0.5">
                    Scan for Kiln Drops
                  </span>
                </div>
              </div>
            </div>

            <span className="text-[11px] text-[#8C8375] mt-3">
              Standard 4" × 6" heavy textured cardstock layout · Optimized for thermal or inkjet studio printing
            </span>
          </div>
        </div>
      )}

      {/* Customer Note Modal */}
      {activeCustomerNoteModal && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div 
            id="reengagement-note-modal"
            className="bg-[#FAF7F2] rounded-2xl border border-[#E2D8C9] shadow-2xl w-full max-w-lg p-6 space-y-4 animate-scaleUp"
          >
            <div className="flex items-center justify-between border-b border-[#E8E1D7] pb-3">
              <div>
                <h3 className="font-editorial text-lg font-bold text-[#1A1A1A]">
                  Personal Re-engagement Note for {activeCustomerNoteModal.customerName}
                </h3>
                <span className="text-xs text-[#7A7163]">
                  Scheduled for optimal re-order window ({activeCustomerNoteModal.nextPredictedReorderWindow})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveCustomerNoteModal(null)}
                className="text-[#7A7163] hover:text-[#1A1A1A] text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-[#E2D8C9] text-xs font-serif text-[#3A332A] leading-relaxed space-y-2">
              <p>
                Hi {activeCustomerNoteModal.customerName.split(' ')[0]},
              </p>
              <p>
                We hope you’re continuing to enjoy your handcrafted piece from our workshop ({activeCustomerNoteModal.lastPurchasedItems[0]}).
              </p>
              <p>
                As an early patron of our studio, we’ve reserved a private 15% VIP discount code (<span className="font-mono font-bold text-[#D97757]">STUDIOVIP15</span>) for your autumn table settings or early holiday gifting before our holiday kiln slots fill up!
              </p>
              <p className="italic text-[#7A7163]">
                Warm regards from the wheel & workshop,<br />
                The Woodland Artisan Studio
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const text = `Hi ${activeCustomerNoteModal.customerName.split(' ')[0]},\nWe hope you’re continuing to enjoy your handcrafted piece from our workshop (${activeCustomerNoteModal.lastPurchasedItems[0]}). As an early patron, enjoy 15% off with code STUDIOVIP15 for early holiday orders!\n\nWarm regards,\nThe Woodland Artisan Studio`;
                  navigator.clipboard.writeText(text);
                  setIsCopiedNote(activeCustomerNoteModal.id);
                  setTimeout(() => setIsCopiedNote(null), 2000);
                }}
                className="px-4 py-2 bg-white hover:bg-[#FAF7F2] text-[#1A1A1A] border border-[#E2D8C9] rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {isCopiedNote === activeCustomerNoteModal.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#5A7A5A]" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Message</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onSendReengagementNote) {
                    onSendReengagementNote(activeCustomerNoteModal.customerName, 'STUDIOVIP15');
                  }
                  setActiveCustomerNoteModal(null);
                }}
                className="px-4 py-2 bg-[#D97757] hover:bg-[#C26547] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Queue for Etsy Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
