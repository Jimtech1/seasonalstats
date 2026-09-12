import React, { useState, useMemo } from 'react';
import { ListingItem, ListingFlag, ListingEditRecord } from '../types';
import { SeasonIndexBadge } from './SeasonIndexBadge';
import { EditListingModal } from './EditListingModal';
import { BatchTagModal } from './BatchTagModal';
import { PricingElasticityModal } from './PricingElasticityModal';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Edit3, 
  AlertCircle, 
  TrendingDown, 
  TrendingUp, 
  Minus, 
  ShoppingCart, 
  Check, 
  Sparkles,
  Layers,
  ChevronDown,
  Tag as TagIcon,
  XSquare,
  CheckSquare,
  Square,
  DollarSign,
  Truck,
  Calculator,
  Flame
} from 'lucide-react';

interface ListingsViewProps {
  listings: ListingItem[];
  onUpdateListing: (updated: ListingItem, editRecord: ListingEditRecord) => void;
  onBatchUpdateListings?: (updatedListings: ListingItem[], records: ListingEditRecord[]) => void;
  initialFlagFilter?: ListingFlag | 'all' | 'flagged';
}

type SortField = 
  | 'title' 
  | 'impressions' 
  | 'visits' 
  | 'addToCart' 
  | 'orders' 
  | 'revenue' 
  | 'netRevenue' 
  | 'ctr' 
  | 'listingAgeDays' 
  | 'seasonIndex';

export const ListingsView: React.FC<ListingsViewProps> = ({
  listings,
  onUpdateListing,
  onBatchUpdateListings,
  initialFlagFilter = 'all',
  onOpenInventoryForecaster,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFlagFilter, setActiveFlagFilter] = useState<string>(initialFlagFilter);
  const [sortField, setSortField] = useState<SortField>('impressions');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedListingForEdit, setSelectedListingForEdit] = useState<ListingItem | null>(null);
  const [selectedListingForPricing, setSelectedListingForPricing] = useState<ListingItem | null>(null);

  // Batch selection states
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  const handleToggleSelectAll = () => {
    if (selectedIds.size === filteredListings.length && filteredListings.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredListings.map(l => l.id)));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleSelectAllFlagged = () => {
    const flaggedIds = listings.filter(l => l.flags.length > 0).map(l => l.id);
    setSelectedIds(new Set(flaggedIds));
  };

  const selectedListingsList = useMemo(() => {
    return listings.filter(l => selectedIds.has(l.id));
  }, [listings, selectedIds]);

  // Sorting handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filtered & sorted listings
  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchTags = item.tags.some(t => t.toLowerCase().includes(q));
          if (!matchTitle && !matchTags) return false;
        }

        // Flag filter
        if (activeFlagFilter === 'flagged') {
          return item.flags.length > 0;
        }
        if (activeFlagFilter === 'seen_never_bought') {
          return item.flags.includes('seen_never_bought');
        }
        if (activeFlagFilter === 'declining_momentum') {
          return item.flags.includes('declining_momentum');
        }
        if (activeFlagFilter === 'high_cart_low_checkout') {
          return item.flags.includes('high_cart_low_checkout');
        }

        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === 'string') {
          return sortDirection === 'asc' 
            ? (valA as string).localeCompare(valB as string)
            : (valB as string).localeCompare(valA as string);
        }

        return sortDirection === 'asc' 
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      });
  }, [listings, searchQuery, activeFlagFilter, sortField, sortDirection]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#E8E1D7]">
        <div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
            Listing performance
          </h1>
          <p className="mt-1 text-sm sm:text-base text-[#665D4F] max-w-3xl leading-relaxed">
            Sort by any column. Listings that get plenty of impressions but no orders are flagged — that is usually a thumbnail or a listing-page problem, not a seasonal one.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#7A7163]">
          <span className="font-mono font-bold text-[#1A1A1A] bg-[#FAF7F2] px-2.5 py-1 rounded border border-[#E2D8C9]">
            {filteredListings.length} of {listings.length} listings shown
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8C8375] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="listings-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by listing name, keyword, or tag..."
            className="w-full pl-9 pr-3 py-2 bg-white rounded-lg border border-[#E2D8C9] text-xs sm:text-sm focus:outline-hidden focus:border-[#D97757] text-[#1A1A1A]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8C8375] hover:text-[#1A1A1A]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Flag filter pills & Quick Tools */}
        <div className="flex items-center flex-wrap gap-2 justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: 'All listings' },
              { id: 'flagged', label: 'All Flagged (3)' },
              { id: 'seen_never_bought', label: '🔴 Seen, never bought' },
              { id: 'declining_momentum', label: '🟡 Declining' },
              { id: 'high_cart_low_checkout', label: '🔵 High cart, low checkout' },
            ].map((pill) => (
              <button
                key={pill.id}
                id={`filter-pill-${pill.id}`}
                type="button"
                onClick={() => setActiveFlagFilter(pill.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeFlagFilter === pill.id
                    ? 'bg-[#1A1A1A] text-white shadow-xs'
                    : 'bg-white border border-[#E2D8C9] text-[#6B6356] hover:bg-[#F2ECE2]'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Batch Action Bar when listings are selected */}
      {selectedIds.size > 0 && (
        <div className="p-3.5 bg-gradient-to-r from-[#FAF3EA] to-[#F5ECE0] border border-[#D97757]/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-scaleUp shadow-xs">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#D97757] text-white flex items-center justify-center text-xs font-bold font-mono shadow-xs">
              {selectedIds.size}
            </span>
            <div>
              <span className="text-xs font-bold text-[#1A1A1A]">
                {selectedIds.size} {selectedIds.size === 1 ? 'listing' : 'listings'} selected
              </span>
              <p className="text-[11px] text-[#665D4F]">
                Apply high-converting holiday keywords or swap tags across all chosen listings in one click.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="batch-season-tags-btn"
              type="button"
              onClick={() => setIsBatchModalOpen(true)}
              className="px-4 py-2 bg-[#D97757] hover:bg-[#C26547] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <TagIcon className="w-3.5 h-3.5" />
              <span>Batch Season Tags ({selectedIds.size})</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="px-3 py-2 text-xs font-medium text-[#7A7163] hover:text-[#1A1A1A] cursor-pointer"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* Listings Table */}
      <div className="bg-white rounded-xl border border-[#E8E1D7] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F4EE] border-b border-[#E8E1D7] text-[#665D4F] font-bold uppercase tracking-wider select-none text-[11px]">
                
                {/* Select All Checkbox - Sticky Column 1 */}
                <th className="py-3.5 pl-4 pr-2 w-12 text-center sticky left-0 z-20 bg-[#F8F4EE] border-r border-[#E8E1D7]">
                  <input
                    type="checkbox"
                    aria-label="Select all listings in view"
                    checked={filteredListings.length > 0 && selectedIds.size === filteredListings.length}
                    onChange={handleToggleSelectAll}
                    className="rounded border-[#C8BFB0] text-[#D97757] focus:ring-[#D97757] cursor-pointer h-3.5 w-3.5"
                  />
                </th>

                {/* Column: Listing - Sticky Column 2 */}
                <th 
                  onClick={() => handleSort('title')}
                  className="py-3.5 px-4 cursor-pointer hover:text-[#1A1A1A] min-w-[280px] sticky left-12 z-20 bg-[#F8F4EE] border-r border-[#E8E1D7] shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Listing</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>

                {/* Impressions */}
                <th 
                  onClick={() => handleSort('impressions')}
                  className="py-3.5 px-3 cursor-pointer hover:text-[#1A1A1A] text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Impressions</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>

                {/* Visits */}
                <th 
                  onClick={() => handleSort('visits')}
                  className="py-3.5 px-3 cursor-pointer hover:text-[#1A1A1A] text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Visits</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>

                {/* Add to Cart */}
                <th 
                  onClick={() => handleSort('addToCart')}
                  className="py-3.5 px-3 cursor-pointer hover:text-[#1A1A1A] text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Add to Cart</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>

                {/* Orders */}
                <th 
                  onClick={() => handleSort('orders')}
                  className="py-3.5 px-3 cursor-pointer hover:text-[#1A1A1A] text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Orders</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>

                {/* Gross Revenue */}
                <th 
                  onClick={() => handleSort('revenue')}
                  className="py-3.5 px-3 cursor-pointer hover:text-[#1A1A1A] text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Gross</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>

                {/* Net Revenue */}
                <th 
                  onClick={() => handleSort('netRevenue')}
                  className="py-3.5 px-3 cursor-pointer hover:text-[#1A1A1A] text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Net Rev</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>

                {/* CTR */}
                <th 
                  onClick={() => handleSort('ctr')}
                  className="py-3.5 px-3 cursor-pointer hover:text-[#1A1A1A] text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>CTR</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>

                {/* Age */}
                <th 
                  onClick={() => handleSort('listingAgeDays')}
                  className="py-3.5 px-3 cursor-pointer hover:text-[#1A1A1A] text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Age</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>

                {/* Momentum */}
                <th className="py-3.5 px-3 text-center">
                  <span>Momentum</span>
                </th>

                {/* Season index */}
                <th 
                  onClick={() => handleSort('seasonIndex')}
                  className="py-3.5 px-4 cursor-pointer hover:text-[#1A1A1A] text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Season index</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>

                {/* Actions */}
                <th className="py-3.5 px-4 text-center">
                  <span>Actions</span>
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-[#EFE9DF]">
              {filteredListings.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-[#7A7163]">
                    No listings found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredListings.map((listing, idx) => {
                  return (
                    <tr
                      key={listing.id}
                      id={`listing-row-${listing.id}`}
                      className={`hover:bg-[#FAF7F2]/80 transition-colors group ${
                        selectedIds.has(listing.id) ? 'bg-[#FAF3EA]/60' : ''
                      }`}
                    >
                      {/* Checkbox cell - Sticky */}
                      <td className={`py-3 pl-4 pr-2 w-12 text-center sticky left-0 z-10 border-r border-[#E8E1D7] ${
                        selectedIds.has(listing.id) ? 'bg-[#FAF3EA]' : 'bg-white group-hover:bg-[#FAF7F2]'
                      }`}>
                        <input
                          type="checkbox"
                          aria-label={`Select ${listing.title}`}
                          checked={selectedIds.has(listing.id)}
                          onChange={() => handleToggleSelectOne(listing.id)}
                          className="rounded border-[#C8BFB0] text-[#D97757] focus:ring-[#D97757] cursor-pointer h-3.5 w-3.5"
                        />
                      </td>

                      {/* Listing Cell: Thumbnail + Name + Badges - Sticky */}
                      <td className={`py-3 px-4 sticky left-12 z-10 border-r border-[#E8E1D7] shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)] ${
                        selectedIds.has(listing.id) ? 'bg-[#FAF3EA]' : 'bg-white group-hover:bg-[#FAF7F2]'
                      }`}>
                        <div className="flex items-center gap-3">
                          <img
                            src={listing.thumbnail}
                            alt=""
                            className="w-11 h-11 object-cover rounded-md border border-[#E2D8C9] shrink-0"
                          />
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center flex-wrap gap-1.5">
                              <span className="font-medium text-[#1A1A1A] text-xs line-clamp-1 group-hover:text-[#D97757] transition-colors">
                                {listing.title}
                              </span>
                            </div>

                            {/* Row Flags */}
                            <div className="flex items-center flex-wrap gap-1">
                              {listing.flags.includes('seen_never_bought') && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#B85C4A]/15 text-[#B85C4A] px-2 py-0.5 rounded-full whitespace-nowrap">
                                  🔴 Seen, never bought
                                </span>
                              )}
                              {listing.flags.includes('declining_momentum') && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#D97757]/15 text-[#D97757] px-2 py-0.5 rounded-full whitespace-nowrap">
                                  🟡 Declining momentum
                                </span>
                              )}
                              {listing.flags.includes('high_cart_low_checkout') && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#3B82F6]/15 text-[#1D4ED8] px-2 py-0.5 rounded-full whitespace-nowrap">
                                  🔵 High cart, low checkout
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Impressions */}
                      <td className="py-3 px-3 text-right font-mono text-[#4D4539]">
                        {listing.impressions.toLocaleString()}
                      </td>

                      {/* Visits */}
                      <td className="py-3 px-3 text-right font-mono font-medium text-[#1A1A1A]">
                        {listing.visits.toLocaleString()}
                      </td>

                      {/* Add to Cart */}
                      <td className="py-3 px-3 text-right font-mono text-[#4D4539]">
                        {listing.addToCart}
                      </td>

                      {/* Orders */}
                      <td className="py-3 px-3 text-right font-mono font-bold text-[#1A1A1A]">
                        {listing.orders}
                      </td>

                      {/* Gross Revenue */}
                      <td className="py-3 px-3 text-right font-mono font-semibold text-[#1A1A1A]">
                        ${listing.revenue}
                      </td>

                      {/* Net Revenue */}
                      <td className="py-3 px-3 text-right font-mono text-[#5A7A5A] font-semibold">
                        ${listing.netRevenue}
                      </td>

                      {/* CTR */}
                      <td className={`py-3 px-3 text-right font-mono font-semibold ${
                        listing.ctr < 1.0 ? 'text-[#B85C4A]' : 'text-[#4D4539]'
                      }`}>
                        {listing.ctr.toFixed(2)}%
                      </td>

                      {/* Age */}
                      <td className="py-3 px-3 text-right font-mono text-[#7A7163]">
                        {listing.listingAgeDays}d
                      </td>

                      {/* Momentum */}
                      <td className="py-3 px-3 text-center">
                        {listing.momentum === 'improving' && (
                          <span className="inline-flex items-center gap-1 text-[#5A7A5A] font-medium" title="Improving momentum">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span className="text-[11px]">improving</span>
                          </span>
                        )}
                        {listing.momentum === 'declining' && (
                          <span className="inline-flex items-center gap-1 text-[#D97757] font-medium" title="Declining momentum">
                            <TrendingDown className="w-3.5 h-3.5" />
                            <span className="text-[11px]">declining</span>
                          </span>
                        )}
                        {listing.momentum === 'stable' && (
                          <span className="inline-flex items-center gap-1 text-[#7A7163]" title="Stable momentum">
                            <Minus className="w-3.5 h-3.5" />
                            <span className="text-[11px]">stable</span>
                          </span>
                        )}
                      </td>

                      {/* Season index */}
                      <td className="py-3 px-4 text-center">
                        <SeasonIndexBadge index={listing.seasonIndex} size="sm" />
                      </td>

                      {/* Actions Column: Edit listing & Elasticity buttons */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 mx-auto">
                          <button
                            id={idx === 0 ? 'tour-edit-listing-btn' : `edit-listing-btn-${listing.id}`}
                            data-tour="edit-listing-btn"
                            type="button"
                            onClick={() => setSelectedListingForEdit(listing)}
                            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs ${
                              listing.flags.length > 0
                                ? 'bg-[#D97757] hover:bg-[#C26547] text-white'
                                : 'bg-[#FAF7F2] hover:bg-[#EFE9DF] border border-[#E2D8C9] text-[#1A1A1A]'
                            }`}
                            title="Edit title, tags, and description"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          <button
                            id={idx === 0 ? 'tour-pricing-elasticity-btn' : `pricing-elasticity-btn-${listing.id}`}
                            data-tour="pricing-elasticity-btn"
                            type="button"
                            onClick={() => setSelectedListingForPricing(listing)}
                            className={`px-2 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs ${
                              listing.flags.includes('high_cart_low_checkout')
                                ? 'bg-[#EAF2EA] border-[#5A7A5A] text-[#355235] hover:bg-[#D9EAD9]'
                                : 'bg-white border-[#E2D8C9] text-[#6B6356] hover:text-[#1A1A1A] hover:bg-[#FAF7F2]'
                            }`}
                            title="Simulate price and shipping elasticity ($35 free shipping impact)"
                          >
                            <Calculator className="w-3 h-3 text-[#5A7A5A]" />
                            <span className="hidden xl:inline">Pricing</span>
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Listing Modal when open */}
      {selectedListingForEdit && (
        <EditListingModal
          listing={selectedListingForEdit}
          isOpen={!!selectedListingForEdit}
          onClose={() => setSelectedListingForEdit(null)}
          onSave={onUpdateListing}
        />
      )}

      {/* Pricing & Shipping Elasticity Modal */}
      {selectedListingForPricing && (
        <PricingElasticityModal
          listing={selectedListingForPricing}
          isOpen={!!selectedListingForPricing}
          onClose={() => setSelectedListingForPricing(null)}
          onApplyPricing={(listingId, newPrice, newShipping, note) => {
            const currentItem = listings.find(l => l.id === listingId);
            if (!currentItem) return;

            const updatedItem: ListingItem = {
              ...currentItem,
              price: newPrice,
              shippingCost: newShipping,
              // If free shipping applied to high cart item, clear that friction flag!
              flags: newShipping === 0 
                ? currentItem.flags.filter(f => f !== 'high_cart_low_checkout')
                : currentItem.flags
            };

            const record: ListingEditRecord = {
              id: `pricing-edit-${Date.now()}`,
              listingId,
              listingTitle: currentItem.title,
              timestamp: 'Just now',
              fieldChanged: 'price',
              oldValue: {
                price: currentItem.price,
                shippingCost: currentItem.shippingCost
              },
              newValue: {
                price: newPrice,
                shippingCost: newShipping
              },
              status: 'published',
              canUndoUntil: 'Tomorrow at this time',
              postEditPerformance: {
                daysTracked: 1,
                preEditMetrics: {
                  visits: currentItem.visits,
                  ctr: currentItem.ctr,
                  orders: currentItem.orders,
                  revenue: currentItem.revenue
                },
                postEditMetrics: {
                  visits: Math.round(currentItem.visits * 1.12),
                  ctr: currentItem.ctr,
                  orders: currentItem.orders + Math.round((currentItem.addToCart || 10) * 0.2),
                  revenue: Math.round(currentItem.revenue + (newPrice * 2))
                },
                rawLiftPct: 24.5,
                categorySeasonLiftPct: 4.0,
                netAttributedLiftPct: 20.5,
                status: 'collecting_data',
                verdict: note
              }
            };

            onUpdateListing(updatedItem, record);
          }}
        />
      )}

      {/* Batch Tag Editor Modal */}
      {isBatchModalOpen && (
        <BatchTagModal
          isOpen={isBatchModalOpen}
          onClose={() => setIsBatchModalOpen(false)}
          selectedListings={selectedListingsList}
          onApplyBatchTags={(updatedListings, records) => {
            if (onBatchUpdateListings) {
              onBatchUpdateListings(updatedListings, records);
            } else {
              updatedListings.forEach((u, i) => onUpdateListing(u, records[i]));
            }
            setSelectedIds(new Set());
          }}
        />
      )}
    </div>
  );
};
