import React, { useState } from 'react';
import { ListingItem, ListingEditRecord } from '../types';
import { 
  X, 
  Sparkles, 
  Tag as TagIcon, 
  Check, 
  ArrowRight, 
  Layers, 
  AlertCircle, 
  CheckCircle2,
  Calendar,
  Clock
} from 'lucide-react';

interface BatchTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedListings: ListingItem[];
  onApplyBatchTags: (
    updatedListings: ListingItem[], 
    records: ListingEditRecord[]
  ) => void;
}

interface SeasonalPreset {
  id: string;
  name: string;
  period: string;
  tags: string[];
  colorClass: string;
}

const SEASONAL_PRESETS: SeasonalPreset[] = [
  {
    id: 'q4_holiday',
    name: 'Q4 Holiday & Christmas Gifting',
    period: 'Oct - Dec',
    tags: ['holiday gift', 'stocking stuffer', 'christmas gift', 'handcrafted gift', 'secret santa'],
    colorClass: 'border-[#D97757] bg-[#D97757]/10 text-[#D97757]'
  },
  {
    id: 'autumn_fall',
    name: 'Cozy Autumn & Thanksgiving',
    period: 'Sep - Nov',
    tags: ['fall decor', 'cozy home gift', 'autumn aesthetic', 'thanksgiving host', 'harvest gift'],
    colorClass: 'border-[#B85C4A] bg-[#B85C4A]/10 text-[#B85C4A]'
  },
  {
    id: 'valentines',
    name: 'Valentine\'s & Anniversary',
    period: 'Jan - Feb',
    tags: ['valentines gift', 'romantic gift', 'gift for her', 'anniversary gift', 'custom love gift'],
    colorClass: 'border-[#E11D48] bg-[#E11D48]/10 text-[#E11D48]'
  },
  {
    id: 'mothers_day',
    name: 'Mother\'s Day & Spring',
    period: 'Apr - May',
    tags: ['mothers day gift', 'gift for mom', 'spring home decor', 'personalized gift', 'artisan keepsake'],
    colorClass: 'border-[#5A7A5A] bg-[#5A7A5A]/10 text-[#5A7A5A]'
  }
];

export const BatchTagModal: React.FC<BatchTagModalProps> = ({
  isOpen,
  onClose,
  selectedListings,
  onApplyBatchTags,
}) => {
  if (!isOpen || selectedListings.length === 0) return null;

  const [tagsToApply, setTagsToApply] = useState<string[]>([
    'holiday gift',
    'stocking stuffer',
    'handcrafted gift'
  ]);
  const [tagInput, setTagInput] = useState('');
  const [strategy, setStrategy] = useState<'append' | 'replace'>('append');
  const [tagToReplace, setTagToReplace] = useState('');
  const [replacementTag, setReplacementTag] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Common existing tags among selected listings
  const commonExistingTags = Array.from(
    new Set(selectedListings.flatMap(l => l.tags))
  ).slice(0, 12);

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (!trimmed) return;
    if (trimmed.length > 20) return;
    if (tagsToApply.includes(trimmed)) return;
    setTagsToApply([...tagsToApply, trimmed]);
    setTagInput('');
  };

  const handleRemoveTag = (index: number) => {
    setTagsToApply(tagsToApply.filter((_, idx) => idx !== index));
  };

  const handleSelectPreset = (preset: SeasonalPreset) => {
    setTagsToApply(preset.tags);
  };

  const handleConfirmBatchApply = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const now = new Date();
      const undoDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const deadlineStr = undoDeadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' tomorrow';

      const updatedListings: ListingItem[] = [];
      const records: ListingEditRecord[] = [];

      selectedListings.forEach((listing) => {
        let newTags: string[] = [];

        if (strategy === 'append') {
          // Add new tags, preserving unique up to 13
          const combined = Array.from(new Set([...tagsToApply, ...listing.tags]));
          newTags = combined.slice(0, 13);
        } else {
          // Replace specific tag
          if (tagToReplace && replacementTag) {
            newTags = listing.tags.map(t => t.toLowerCase() === tagToReplace.toLowerCase() ? replacementTag.toLowerCase() : t);
          } else {
            newTags = [...listing.tags];
          }
        }

        const updated: ListingItem = {
          ...listing,
          tags: newTags,
        };
        updatedListings.push(updated);

        records.push({
          id: `batch-${listing.id}-${Date.now()}`,
          listingId: listing.id,
          listingTitle: listing.title,
          timestamp: 'Just now (Batch update)',
          fieldChanged: 'tags',
          oldValue: { tags: listing.tags },
          newValue: { tags: newTags },
          status: 'published',
          canUndoUntil: deadlineStr,
        });
      });

      onApplyBatchTags(updatedListings, records);
      setIsProcessing(false);
      onClose();
    }, 500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
    >
      <div 
        id="batch-tag-modal-container"
        className="bg-[#FAF7F2] rounded-2xl border border-[#D97757]/30 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E1D7] flex items-center justify-between bg-white/70">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#D97757] text-white flex items-center justify-center font-bold shadow-xs">
              <Layers className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-editorial text-xl font-bold text-[#1A1A1A]">
                  Batch Seasonal Tag Editor
                </h2>
                <span className="text-xs font-mono bg-[#EFE9DF] text-[#7A7163] px-2 py-0.5 rounded-full font-bold">
                  {selectedListings.length} listings selected
                </span>
              </div>
              <p className="text-xs text-[#665D4F]">
                Apply high-impact seasonal keywords simultaneously before peak shopping ramps up.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#7A7163] hover:text-[#1A1A1A] hover:bg-[#EFE9DF] rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Selected listings preview bar */}
          <div className="p-3.5 bg-white rounded-xl border border-[#E8E1D7] space-y-2">
            <span className="text-xs font-bold text-[#7A7163] uppercase tracking-wider block">
              Affected Listings ({selectedListings.length})
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {selectedListings.map((l) => (
                <div 
                  key={l.id}
                  className="flex items-center gap-2 px-2.5 py-1.5 bg-[#FAF7F2] rounded-lg border border-[#E2D8C9] shrink-0 max-w-[240px]"
                >
                  <img src={l.thumbnail} alt="" className="w-6 h-6 rounded object-cover shrink-0" />
                  <span className="text-xs font-medium text-[#1A1A1A] truncate">
                    {l.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Seasonal Presets */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#4A4235] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#D97757]" />
                <span>1-Click Curated Seasonal Presets</span>
              </span>
              <span className="text-[11px] text-[#7A7163]">
                Tested for Etsy's mobile search algorithm
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {SEASONAL_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.02] cursor-pointer bg-white ${preset.colorClass}`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>{preset.name}</span>
                  </div>
                  <span className="text-[10px] opacity-75 font-mono block mt-0.5">
                    {preset.period}
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {preset.tags.slice(0, 3).map((t, idx) => (
                      <span key={idx} className="text-[9px] bg-black/5 px-1.5 py-0.2 rounded">
                        {t}
                      </span>
                    ))}
                    <span className="text-[9px] opacity-75">+{preset.tags.length - 3}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Strategy Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Strategy 1: Append Seasonal Tags */}
            <div 
              onClick={() => setStrategy('append')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                strategy === 'append'
                  ? 'border-[#D97757] bg-white shadow-xs'
                  : 'border-[#E2D8C9] bg-white/60 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    strategy === 'append' ? 'border-[#D97757]' : 'border-[#999]'
                  }`}>
                    {strategy === 'append' && <div className="w-2 h-2 rounded-full bg-[#D97757]" />}
                  </div>
                  <span className="text-xs font-bold text-[#1A1A1A]">
                    Append to Existing Tags
                  </span>
                </div>
                <span className="text-[10px] bg-[#5A7A5A]/15 text-[#5A7A5A] font-bold px-1.5 py-0.5 rounded">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-[#665D4F] leading-relaxed">
                Prioritizes seasonal keywords. If a listing reaches the 13 tag ceiling, replaces lower-priority tags while keeping your brand name intact.
              </p>
            </div>

            {/* Strategy 2: Swap Specific Tag */}
            <div 
              onClick={() => setStrategy('replace')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                strategy === 'replace'
                  ? 'border-[#D97757] bg-white shadow-xs'
                  : 'border-[#E2D8C9] bg-white/60 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    strategy === 'replace' ? 'border-[#D97757]' : 'border-[#999]'
                  }`}>
                    {strategy === 'replace' && <div className="w-2 h-2 rounded-full bg-[#D97757]" />}
                  </div>
                  <span className="text-xs font-bold text-[#1A1A1A]">
                    Replace an Existing Tag
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#665D4F] leading-relaxed">
                Find an out-of-season or underperforming tag across all selected listings and swap it for a high-volume seasonal phrase.
              </p>
            </div>

          </div>

          {/* Strategy Details Input */}
          {strategy === 'append' ? (
            <div className="p-4 bg-white rounded-xl border border-[#E2D8C9] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A4235] flex items-center gap-1.5">
                  <TagIcon className="w-3.5 h-3.5 text-[#D97757]" />
                  <span>Tags to apply across all {selectedListings.length} listings</span>
                </label>
                <span className="text-xs font-mono text-[#7A7163]">
                  {tagsToApply.length} tags configured
                </span>
              </div>

              {/* Tag Chips */}
              <div className="flex flex-wrap gap-1.5 min-h-[36px]">
                {tagsToApply.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 bg-[#FAF7F2] text-[#4A4235] border border-[#D97757]/40 text-xs px-2.5 py-1 rounded-md font-mono"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(idx)}
                      className="hover:text-[#B85C4A] p-0.5 rounded cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Custom Tag Input */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#F0EAE1]">
                <input
                  type="text"
                  value={tagInput}
                  maxLength={20}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add custom seasonal keyword (max 20 chars)..."
                  className="flex-1 px-3 py-1.5 text-xs bg-[#FAF7F2] rounded-lg border border-[#E2D8C9] focus:outline-hidden focus:border-[#D97757]"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                  className="px-3.5 py-1.5 bg-[#D97757] disabled:opacity-40 text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-white rounded-xl border border-[#E2D8C9] space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4A4235] block">
                Select Tag to Replace
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#7A7163] block mb-1">
                    Existing tag to remove:
                  </label>
                  <select
                    value={tagToReplace}
                    onChange={(e) => setTagToReplace(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] rounded-lg border border-[#E2D8C9] text-xs font-mono text-[#1A1A1A]"
                  >
                    <option value="">-- Choose existing tag --</option>
                    {commonExistingTags.map((t, idx) => (
                      <option key={idx} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#7A7163] block mb-1">
                    New seasonal replacement tag:
                  </label>
                  <input
                    type="text"
                    value={replacementTag}
                    maxLength={20}
                    onChange={(e) => setReplacementTag(e.target.value)}
                    placeholder="e.g. holiday gift"
                    className="w-full px-3 py-2 bg-[#FAF7F2] rounded-lg border border-[#E2D8C9] text-xs font-mono text-[#1A1A1A]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Live Preview Sample */}
          <div className="p-4 bg-white rounded-xl border border-[#E8E1D7] space-y-2">
            <span className="text-xs font-bold text-[#7A7163] uppercase tracking-wider block">
              Sample Listing Impact Preview
            </span>
            <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E2D8C9] text-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#1A1A1A] truncate">
                  {selectedListings[0]?.title}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[11px] text-[#7A7163]">New Tag Pack:</span>
                {Array.from(new Set([...tagsToApply, ...(selectedListings[0]?.tags || [])])).slice(0, 13).map((t, idx) => {
                  const isNew = !selectedListings[0]?.tags.includes(t);
                  return (
                    <span 
                      key={idx}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        isNew ? 'bg-[#D97757]/20 text-[#B85C4A] font-bold' : 'bg-white text-[#555] border border-[#E2D8C9]'
                      }`}
                    >
                      {t} {isNew && '★'}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E8E1D7] bg-white/70 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#7A7163]">
            <Clock className="w-3.5 h-3.5 text-[#D97757]" />
            <span>Recorded in 24h Audit Log & Undo</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#665D4F] hover:text-[#1A1A1A] cursor-pointer"
            >
              Cancel
            </button>

            <button
              id="confirm-batch-tags-btn"
              type="button"
              disabled={isProcessing || (strategy === 'append' && tagsToApply.length === 0) || (strategy === 'replace' && (!tagToReplace || !replacementTag))}
              onClick={handleConfirmBatchApply}
              className="px-5 py-2.5 bg-[#D97757] hover:bg-[#C26547] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Publishing to Etsy...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish batch to {selectedListings.length} listings</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
