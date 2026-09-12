import React, { useState, useEffect } from 'react';
import { ListingItem, ListingEditRecord } from '../types';
import { SeasonIndexBadge } from './SeasonIndexBadge';
import { 
  X, 
  Upload, 
  Check, 
  Sparkles, 
  AlertTriangle, 
  Search, 
  ExternalLink, 
  Tag as TagIcon, 
  Eye, 
  ArrowLeft, 
  Save, 
  ShieldAlert, 
  Clock, 
  CheckCircle2,
  Image as ImageIcon,
  RotateCcw
} from 'lucide-react';

interface EditListingModalProps {
  listing: ListingItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedListing: ListingItem, editRecord: ListingEditRecord) => void;
}

export const EditListingModal: React.FC<EditListingModalProps> = ({
  listing,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  // Form states
  const [title, setTitle] = useState(listing.title);
  const [description, setDescription] = useState(listing.description);
  const [tags, setTags] = useState<string[]>([...listing.tags]);
  const [tagInput, setTagInput] = useState('');
  const [thumbnail, setThumbnail] = useState(listing.thumbnail);
  const [previewNewThumbnail, setPreviewNewThumbnail] = useState<string | null>(null);

  // Modal mode: 'edit' or 'preview'
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [showDescriptionRaw, setShowDescriptionRaw] = useState(false);
  const [tagError, setTagError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gemini AI Optimization States
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<{
    suggestedTitle: string;
    suggestedTags: string[];
    rationale: string;
    primaryKeyword?: string;
  } | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleGenerateAi = async () => {
    setIsGeneratingAi(true);
    setAiError(null);
    setAppliedNotification(null);
    try {
      const response = await fetch('/api/gemini/optimize-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        setAiResult(data.data);
      } else {
        setAiError(data.error || 'Failed to generate recommendations.');
      }
    } catch (err: any) {
      setAiError(err.message || 'Error communicating with AI service');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleApplyAiTitle = () => {
    if (aiResult?.suggestedTitle) {
      setTitle(aiResult.suggestedTitle);
      setAppliedNotification('Applied Gemini-optimized title to input!');
      setTimeout(() => setAppliedNotification(null), 4000);
    }
  };

  const handleApplyAiTags = () => {
    if (aiResult?.suggestedTags) {
      setTags(aiResult.suggestedTags);
      setTagError(null);
      setAppliedNotification('Applied 13 high-traffic tags to inputs!');
      setTimeout(() => setAppliedNotification(null), 4000);
    }
  };

  const handleApplyBoth = () => {
    if (aiResult) {
      setTitle(aiResult.suggestedTitle);
      setTags(aiResult.suggestedTags);
      setTagError(null);
      setAppliedNotification('Applied! Title (under 140 chars) and 13 high-traffic tags populated into inputs.');
      setTimeout(() => setAppliedNotification(null), 5000);
    }
  };

  // Sample curated artisan thumbnails for easy testing
  const alternateThumbnails = [
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=800&q=80'
  ];

  // Tag management
  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (!trimmed) return;
    if (tags.length >= 13) {
      setTagError('Etsy allows a maximum of 13 tags per listing.');
      return;
    }
    if (trimmed.length > 20) {
      setTagError('Each tag must be 20 characters or fewer.');
      return;
    }
    if (tags.includes(trimmed)) {
      setTagError('Tag already exists on this listing.');
      return;
    }
    setTags([...tags, trimmed]);
    setTagInput('');
    setTagError(null);
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, idx) => idx !== indexToRemove));
    setTagError(null);
  };

  const handleKeyDownTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Thumbnail file upload mock
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewNewThumbnail(url);
      setThumbnail(url);
    }
  };

  // Check what has changed
  const titleChanged = title !== listing.title;
  const descriptionChanged = description !== listing.description;
  const tagsChanged = JSON.stringify(tags) !== JSON.stringify(listing.tags);
  const thumbnailChanged = thumbnail !== listing.thumbnail;
  const hasChanges = titleChanged || descriptionChanged || tagsChanged || thumbnailChanged;

  const handleConfirmPublish = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const now = new Date();
      const undoDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const updatedListing: ListingItem = {
        ...listing,
        title,
        description,
        tags,
        thumbnail,
        // If it was seen-never-bought and user improved title/thumbnail, soften the warning
        whyFlagged: listing.whyFlagged ? `${listing.whyFlagged} (Changes recently applied to improve conversion)` : undefined,
      };

      const record: ListingEditRecord = {
        id: `edit-${Date.now()}`,
        listingId: listing.id,
        listingTitle: listing.title,
        timestamp: 'Just now',
        fieldChanged: 'all',
        oldValue: {
          title: listing.title,
          description: listing.description,
          tags: listing.tags,
          thumbnail: listing.thumbnail,
        },
        newValue: {
          title,
          description,
          tags,
          thumbnail,
        },
        status: 'published',
        canUndoUntil: undoDeadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' tomorrow',
      };

      onSave(updatedListing, record);
      setIsSubmitting(false);
      onClose();
    }, 450);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
    >
      <div 
        id="edit-listing-modal-container"
        className="bg-[#FAF7F2] rounded-2xl border border-[#D97757]/30 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E8E1D7] flex items-center justify-between bg-white/60">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#D97757]/15 text-[#D97757] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-editorial text-xl font-bold text-[#1A1A1A]">
                  {mode === 'preview' ? 'Preview Etsy Changes' : 'Edit listing'}
                </h2>
                <span className="text-[11px] font-mono bg-[#EFE9DF] text-[#7A7163] px-2 py-0.5 rounded-full font-medium">
                  Etsy Write API (listings_w)
                </span>
              </div>
              <p className="text-xs text-[#6B6356] truncate max-w-lg">
                {listing.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="modal-header-gemini-btn"
              type="button"
              disabled={isGeneratingAi}
              onClick={handleGenerateAi}
              className="px-3 py-1.5 bg-[#D97757] hover:bg-[#C26547] text-white text-xs font-semibold rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Use Gemini to analyze search performance and optimize title & 13 tags"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGeneratingAi ? 'Analyzing Search...' : '✨ Optimize with Gemini'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#7A7163] hover:text-[#1A1A1A] hover:bg-[#EFE9DF] rounded-lg transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {mode === 'edit' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Form Fields (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Applied Notification Toast Banner */}
                {appliedNotification && (
                  <div className="p-3 bg-[#EAF2EA] border border-[#5A7A5A]/40 rounded-xl text-xs font-medium text-[#2E472E] flex items-center justify-between shadow-xs animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#5A7A5A] shrink-0" />
                      <span>{appliedNotification}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAppliedNotification(null)}
                      className="text-[#5A7A5A] hover:text-[#1A1A1A] p-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* AI Search Performance Optimizer Trigger Banner */}
                <div className="p-4.5 bg-gradient-to-r from-[#FAF3EA] to-[#F5ECE0] rounded-xl border border-[#D97757]/40 shadow-xs space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-[#D97757] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                        <Sparkles className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                            Gemini Search Performance Optimizer
                          </h3>
                          <span className="text-[10px] font-mono bg-[#D97757]/15 text-[#D97757] px-2 py-0.5 rounded font-bold">
                            Gemini 3.8 Flash
                          </span>
                        </div>
                        <p className="text-[11px] text-[#665D4F] mt-0.5">
                          Analyzes {listing.impressions.toLocaleString()} search impressions, {listing.ctr}% CTR, and {listing.topSearchTerms.length} shopper queries to generate an Etsy title under 140 chars and 13 high-traffic tags.
                        </p>
                      </div>
                    </div>

                    <button
                      id="generate-ai-optimizations-btn"
                      type="button"
                      disabled={isGeneratingAi}
                      onClick={handleGenerateAi}
                      className="px-4 py-2.5 bg-[#D97757] hover:bg-[#C26547] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0 hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <Sparkles className={`w-4 h-4 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                      <span>{isGeneratingAi ? 'Analyzing Queries & CTR...' : 'Analyze Search Performance with Gemini'}</span>
                    </button>
                  </div>

                  {/* AI Error display */}
                  {aiError && (
                    <div className="p-2.5 bg-[#B85C4A]/10 border border-[#B85C4A]/30 rounded-lg text-xs text-[#B85C4A] flex items-center justify-between">
                      <span>{aiError}</span>
                      <button 
                        type="button" 
                        onClick={handleGenerateAi} 
                        className="font-bold underline cursor-pointer"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {/* AI Generated Recommendation Panel */}
                  {aiResult && (
                    <div className="p-4 bg-white rounded-xl border border-[#D97757]/50 shadow-sm space-y-3.5 animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#5A7A5A]" />
                          <span className="text-xs font-bold text-[#1A1A1A]">
                            Gemini Search Optimization Ready
                          </span>
                          {aiResult.primaryKeyword && (
                            <span className="text-[10px] font-mono bg-[#5A7A5A]/15 text-[#5A7A5A] px-2 py-0.5 rounded font-bold">
                              Front-loaded Focus: "{aiResult.primaryKeyword}"
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setAiResult(null)}
                          className="text-xs text-[#8C8375] hover:text-[#1A1A1A] cursor-pointer"
                        >
                          Dismiss
                        </button>
                      </div>

                      {/* Search Performance Rationale explanation */}
                      <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E8E1D7] space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7163] block">
                          Search Diagnostic & Algorithmic Rationale
                        </span>
                        <p className="text-xs text-[#4A4235] leading-relaxed italic">
                          "{aiResult.rationale}"
                        </p>
                      </div>

                      {/* Suggested Title */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A7163] flex items-center gap-1.5">
                            <span>Etsy-Optimized Title</span>
                            <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded ${
                              aiResult.suggestedTitle.length <= 140 
                                ? 'bg-[#5A7A5A]/15 text-[#355235]' 
                                : 'bg-[#B85C4A]/15 text-[#B85C4A]'
                            }`}>
                              {aiResult.suggestedTitle.length} / 140 chars (Etsy compliant)
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={handleApplyAiTitle}
                            className="text-xs font-semibold text-[#D97757] hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Apply Title</span>
                          </button>
                        </div>
                        <div className="p-2.5 bg-[#FAF7F2] rounded-lg border border-[#E2D8C9] text-xs font-medium text-[#1A1A1A]">
                          {aiResult.suggestedTitle}
                        </div>
                      </div>

                      {/* Suggested 13 Tags */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A7163] flex items-center gap-1.5">
                            <span>13 Relevant High-Traffic Tags</span>
                            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-[#5A7A5A]/15 text-[#355235]">
                              {aiResult.suggestedTags.length} / 13 slots used
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={handleApplyAiTags}
                            className="text-xs font-semibold text-[#D97757] hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Apply 13 Tags</span>
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 p-2.5 bg-[#FAF7F2] rounded-lg border border-[#E2D8C9]">
                          {aiResult.suggestedTags.map((tag, idx) => (
                            <span 
                              key={idx}
                              className="text-[11px] font-mono px-2 py-1 bg-white text-[#4A4235] rounded-md border border-[#E2D8C9] font-medium flex items-center gap-1"
                            >
                              <span className="text-[#8C8375] text-[9px]">#{idx + 1}</span>
                              <span>{tag}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Prominent Primary Apply Button */}
                      <div className="pt-2 border-t border-[#F0EAE1] flex flex-col sm:flex-row items-center justify-between gap-2.5">
                        <p className="text-[11px] text-[#665D4F]">
                          Click <strong>Apply</strong> to immediately populate your listing title and all 13 tag inputs.
                        </p>
                        <button
                          id="gemini-apply-optimizations-btn"
                          type="button"
                          onClick={handleApplyBoth}
                          className="w-full sm:w-auto px-5 py-2.5 bg-[#5A7A5A] hover:bg-[#486348] text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <Check className="w-4 h-4" />
                          <span>Apply (Populate Title & 13 Tags)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Title input with character counter (Etsy allows 140) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label 
                      htmlFor="listing-title-input"
                      className="text-xs font-bold uppercase tracking-wider text-[#4A4235]"
                    >
                      Listing Title
                    </label>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={aiResult ? handleApplyAiTitle : handleGenerateAi}
                        disabled={isGeneratingAi}
                        className="text-[11px] text-[#D97757] hover:text-[#C26547] font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        title="Use Gemini to generate or apply title"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{aiResult ? 'Apply Gemini Title' : 'AI Title with Gemini'}</span>
                      </button>
                      <span 
                        className={`text-xs font-mono font-medium ${
                          title.length > 140 ? 'text-[#B85C4A] font-bold' : 'text-[#7A7163]'
                        }`}
                      >
                        {title.length} / 140 chars
                      </span>
                    </div>
                  </div>
                  <input
                    id="listing-title-input"
                    type="text"
                    value={title}
                    maxLength={140}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-[#E2D8C9] focus:outline-hidden focus:border-[#D97757] focus:ring-1 focus:ring-[#D97757] text-sm text-[#1A1A1A] transition-all"
                    placeholder="e.g. Hand-poured soy candle, fig & cedarwood..."
                  />
                  <p className="text-[11px] text-[#7A7163]">
                    Tip: Front-load your most important search keyword into the first 40 characters for mobile display.
                  </p>
                </div>

                {/* Thumbnail upload & preview */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#4A4235] block">
                    Primary Thumbnail (Etsy search result image)
                  </label>
                  
                  <div className="flex flex-col sm:flex-row items-start gap-4 p-3.5 bg-white rounded-xl border border-[#E2D8C9]">
                    <div className="relative group shrink-0">
                      <img
                        src={thumbnail}
                        alt="Current listing thumbnail"
                        className="w-28 h-28 object-cover rounded-lg border border-[#E8E1D7] shadow-xs"
                      />
                      {thumbnailChanged && (
                        <span className="absolute top-1 right-1 bg-[#D97757] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          Modified
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 flex-1">
                      <p className="text-xs text-[#6B6356]">
                        Etsy recommends 2000px on the longest side, well-lit, uncluttered background.
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <label 
                          htmlFor="thumbnail-file-upload"
                          className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#EFE9DF] border border-[#D97757]/40 text-[#D97757] font-semibold text-xs rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Photo</span>
                          <input
                            id="thumbnail-file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>

                        {thumbnailChanged && (
                          <button
                            type="button"
                            onClick={() => setThumbnail(listing.thumbnail)}
                            className="px-2.5 py-1.5 text-xs text-[#7A7163] hover:text-[#1A1A1A] flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset</span>
                          </button>
                        )}
                      </div>

                      {/* Alternate curated shots */}
                      <div className="pt-1">
                        <span className="text-[11px] text-[#8C8375] block mb-1">
                          Or pick from studio alternate camera angles:
                        </span>
                        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                          {alternateThumbnails.map((altUrl, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setThumbnail(altUrl)}
                              className={`w-9 h-9 rounded-md overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                                thumbnail === altUrl ? 'border-[#D97757] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                              }`}
                            >
                              <img src={altUrl} alt="" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags (up to 13 tags, each max 20 chars) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#4A4235] flex items-center gap-1.5">
                      <TagIcon className="w-3.5 h-3.5 text-[#D97757]" />
                      <span>Etsy Tags</span>
                    </label>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={aiResult ? handleApplyAiTags : handleGenerateAi}
                        disabled={isGeneratingAi}
                        className="text-[11px] text-[#D97757] hover:text-[#C26547] font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        title="Use Gemini to generate or apply 13 tags"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{aiResult ? 'Apply Gemini 13 Tags' : 'AI 13 Tags with Gemini'}</span>
                      </button>
                      <span 
                        className={`text-xs font-mono font-medium ${
                          tags.length === 13 ? 'text-[#5A7A5A] font-bold' : 'text-[#7A7163]'
                        }`}
                      >
                        {tags.length} / 13 tags used
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#E2D8C9] space-y-2.5">
                    {/* Tag chips */}
                    <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                      {tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 bg-[#FAF7F2] text-[#4A4235] border border-[#E4DCD0] text-xs px-2.5 py-1 rounded-md font-mono"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(idx)}
                            className="hover:text-[#B85C4A] p-0.5 rounded cursor-pointer"
                            aria-label={`Remove tag ${tag}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Tag input */}
                    {tags.length < 13 && (
                      <div className="flex items-center gap-2 pt-1 border-t border-[#F0EAE1]">
                        <input
                          id="new-tag-input"
                          type="text"
                          value={tagInput}
                          maxLength={20}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleKeyDownTag}
                          placeholder="Type tag and press Enter (max 20 chars)..."
                          className="flex-1 px-3 py-1.5 text-xs bg-[#FAF7F2] rounded-lg border border-[#E4DCD0] focus:outline-hidden focus:border-[#D97757]"
                        />
                        <button
                          type="button"
                          onClick={handleAddTag}
                          disabled={!tagInput.trim()}
                          className="px-3 py-1.5 bg-[#D97757] disabled:opacity-40 text-white text-xs font-medium rounded-lg cursor-pointer"
                        >
                          Add tag
                        </button>
                      </div>
                    )}

                    {tagError && (
                      <p className="text-[11px] text-[#B85C4A] font-medium">
                        {tagError}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description with rich/raw preview toggle */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label 
                      htmlFor="listing-description-input"
                      className="text-xs font-bold uppercase tracking-wider text-[#4A4235]"
                    >
                      Listing Description
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowDescriptionRaw(!showDescriptionRaw)}
                      className="text-xs text-[#D97757] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Eye className="w-3 h-3" />
                      <span>{showDescriptionRaw ? 'Switch to formatted' : 'View preview format'}</span>
                    </button>
                  </div>

                  {!showDescriptionRaw ? (
                    <textarea
                      id="listing-description-input"
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-[#E2D8C9] focus:outline-hidden focus:border-[#D97757] focus:ring-1 focus:ring-[#D97757] text-xs sm:text-sm text-[#1A1A1A] leading-relaxed"
                      placeholder="Enter full item description..."
                    />
                  ) : (
                    <div className="p-3.5 bg-white rounded-lg border border-[#E2D8C9] text-xs text-[#333] whitespace-pre-line max-h-36 overflow-y-auto leading-relaxed">
                      {description}
                    </div>
                  )}
                  <p className="text-[11px] text-[#7A7163]">
                    Ensure materials, sizing, and package specifications are written in the first 2 paragraphs.
                  </p>
                </div>

              </div>

              {/* Right Column: Read-Only Diagnostic Panel (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Diagnostic Card: Why this listing is flagged */}
                <div className="p-4 bg-white rounded-xl border border-[#E8E1D7] shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7A7163] uppercase tracking-wider">
                      Listing Seasonality
                    </span>
                    <SeasonIndexBadge index={listing.seasonIndex} size="sm" showLabel />
                  </div>

                  {listing.whyFlagged && (
                    <div className="p-3 bg-[#FAF3EA] rounded-lg border border-[#D97757]/30 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#D97757]">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>Why this listing is flagged</span>
                      </div>
                      <p className="text-xs text-[#4A4235] leading-relaxed">
                        {listing.whyFlagged}
                      </p>
                    </div>
                  )}

                  {listing.cartToOrderRatio && (
                    <div className="p-2.5 bg-[#EAF2FA] rounded-lg border border-[#3B82F6]/30 text-xs text-[#1E40AF] font-medium flex items-center justify-between">
                      <span>Cart-to-Order Conversion:</span>
                      <span className="font-mono font-bold">{listing.cartToOrderRatio}</span>
                    </div>
                  )}

                  {/* Performance quick metrics */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#F0EAE1] text-center">
                    <div className="p-2 bg-[#FAF7F2] rounded-lg">
                      <span className="text-[10px] text-[#7A7163] uppercase block">Impressions</span>
                      <span className="font-mono font-bold text-xs text-[#1A1A1A]">
                        {listing.impressions.toLocaleString()}
                      </span>
                    </div>
                    <div className="p-2 bg-[#FAF7F2] rounded-lg">
                      <span className="text-[10px] text-[#7A7163] uppercase block">CTR</span>
                      <span className={`font-mono font-bold text-xs ${listing.ctr < 1.0 ? 'text-[#B85C4A]' : 'text-[#1A1A1A]'}`}>
                        {listing.ctr}%
                      </span>
                    </div>
                    <div className="p-2 bg-[#FAF7F2] rounded-lg">
                      <span className="text-[10px] text-[#7A7163] uppercase block">Orders</span>
                      <span className="font-mono font-bold text-xs text-[#1A1A1A]">
                        {listing.orders}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Top Search Terms Bringing Traffic */}
                <div className="p-4 bg-white rounded-xl border border-[#E8E1D7] shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7A7163] uppercase tracking-wider flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-[#D97757]" />
                      <span>Top Incoming Search Terms</span>
                    </span>
                    <span className="text-[11px] text-[#8C8375]">Last 30d</span>
                  </div>

                  <div className="space-y-1.5">
                    {listing.topSearchTerms.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-[#FAF7F2] rounded-lg text-xs"
                      >
                        <span className="font-mono text-[#333] truncate max-w-[200px]">
                          "{item.term}"
                        </span>
                        <span className="font-mono font-semibold text-[#1A1A1A]">
                          {item.visits} visits
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-[#8C8375] pt-1">
                    Check if your 13 tags reflect these real search terms shoppers use.
                  </p>
                </div>

                {/* Safety Protocol Reminder */}
                <div className="p-3.5 rounded-xl border border-[#5A7A5A]/30 bg-[#5A7A5A]/8 text-xs text-[#355235] space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldAlert className="w-4 h-4 text-[#5A7A5A]" />
                    <span>SeasonalStat Write-Safety Guarantee</span>
                  </div>
                  <p className="leading-relaxed">
                    Changes are pushed to Etsy immediately. You can revert any edit with 1 click within 24 hours via the <strong>Audit Log & Undo</strong> tab.
                  </p>
                </div>

              </div>

            </div>
          ) : (
            /* PREVIEW VIEW (Diff and Etsy Mock Preview) */
            <div className="space-y-6">
              <div className="p-4 bg-[#FAF3EA] rounded-xl border border-[#D97757]/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-[#D97757]" />
                  <span className="text-sm font-semibold text-[#1A1A1A]">
                    Reviewing changes before publishing to Etsy
                  </span>
                </div>
                <span className="text-xs text-[#7A7163]">
                  Double check spelling, tags, and image quality
                </span>
              </div>

              {/* Etsy Search Card Live Mock */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B6356] block">
                  How your item will appear in Etsy Search Results
                </span>
                <div className="max-w-sm p-3 bg-white rounded-xl border border-[#E8E1D7] shadow-sm space-y-2">
                  <div className="aspect-square w-full rounded-lg overflow-hidden bg-[#FAF7F2]">
                    <img src={thumbnail} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <h4 className="text-xs font-semibold text-[#1A1A1A] line-clamp-2 leading-snug">
                    {title}
                  </h4>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1A1A1A]">${(listing.revenue / (listing.orders || 1) || 28).toFixed(2)}</span>
                    <span className="text-[10px] text-[#5A7A5A] font-semibold bg-[#5A7A5A]/10 px-1.5 py-0.5 rounded">
                      FREE shipping
                    </span>
                  </div>
                </div>
              </div>

              {/* Diff Viewer */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B6356] block">
                  Field-by-Field Audit Diff
                </span>

                {/* Title Diff */}
                <div className="p-3 bg-white rounded-lg border border-[#E2D8C9] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span>Title</span>
                    <span className={titleChanged ? 'text-[#D97757]' : 'text-[#7A7163]'}>
                      {titleChanged ? 'Modified' : 'Unchanged'}
                    </span>
                  </div>
                  {titleChanged ? (
                    <div className="space-y-1">
                      <p className="text-[#B85C4A] line-through bg-[#B85C4A]/10 p-1.5 rounded">
                        {listing.title}
                      </p>
                      <p className="text-[#5A7A5A] font-semibold bg-[#5A7A5A]/10 p-1.5 rounded">
                        {title}
                      </p>
                    </div>
                  ) : (
                    <p className="text-[#6B6356]">{title}</p>
                  )}
                </div>

                {/* Tags Diff */}
                <div className="p-3 bg-white rounded-lg border border-[#E2D8C9] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span>Tags ({tags.length} active)</span>
                    <span className={tagsChanged ? 'text-[#D97757]' : 'text-[#7A7163]'}>
                      {tagsChanged ? 'Modified' : 'Unchanged'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {tags.map((t, i) => {
                      const isNew = !listing.tags.includes(t);
                      return (
                        <span 
                          key={i} 
                          className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                            isNew ? 'bg-[#5A7A5A]/20 text-[#355235] font-bold' : 'bg-[#FAF7F2] text-[#666]'
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
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-[#E8E1D7] bg-white/60 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#7A7163]">
            <Clock className="w-3.5 h-3.5 text-[#D97757]" />
            <span>24-hour instant rollback window</span>
          </div>

          <div className="flex items-center gap-3">
            {mode === 'edit' ? (
              <>
                <button
                  id="cancel-edit-listing-btn"
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-[#665D4F] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="preview-changes-btn"
                  type="button"
                  onClick={() => setMode('preview')}
                  className="px-5 py-2.5 bg-[#D97757] hover:bg-[#C26547] text-[#FAF7F2] text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview changes</span>
                </button>
              </>
            ) : (
              <>
                <button
                  id="back-to-edit-btn"
                  type="button"
                  onClick={() => setMode('edit')}
                  className="px-4 py-2 text-xs font-semibold text-[#665D4F] hover:text-[#1A1A1A] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to edit</span>
                </button>
                <button
                  id="confirm-publish-etsy-btn"
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmPublish}
                  className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#333] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Publishing to Etsy...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#5A7A5A]" />
                      <span>Confirm and publish</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
