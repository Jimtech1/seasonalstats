import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ActiveTab } from '../types';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  X, 
  Compass, 
  ExternalLink,
  Bookmark,
  BookOpen
} from 'lucide-react';

export interface TourStep {
  stepNumber: number;
  chapter: 'Intelligence' | 'Financials' | 'Conversion' | 'Catalog' | 'Integration';
  chapterColor: string;
  tab: ActiveTab;
  targetId: string;
  fallbackTargetId?: string;
  title: string;
  description: string;
  whyItMatters: string;
  proTip: string;
  actionButton?: {
    label: string;
    action: 'connect_etsy';
  };
}

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  onSwitchTab: (tab: ActiveTab) => void;
  onOpenConnectEtsy?: () => void;
  onOpenRegionalCalendar?: () => void;
  onOpenPackingSheets?: () => void;
  onOpenWeeklyPlan?: () => void;
}

type CardPlacement = 'bottom' | 'top' | 'right' | 'left' | 'center';

export const GuidedTour: React.FC<GuidedTourProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSwitchTab,
  onOpenConnectEtsy,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [cardPlacement, setCardPlacement] = useState<CardPlacement>('bottom');
  const [cardCoords, setCardCoords] = useState<{ top: number; left: number; arrowX: number; arrowY: number }>({
    top: 100,
    left: 100,
    arrowX: 50,
    arrowY: 50,
  });

  const cardRef = useRef<HTMLDivElement>(null);

  // 7 Core High-Impact Steps
  const steps: TourStep[] = [
    {
      stepNumber: 1,
      chapter: 'Intelligence',
      chapterColor: 'bg-[#5A7A5A]/15 text-[#2E472E] border-[#5A7A5A]/30',
      tab: 'overview',
      targetId: 'tour-kpi-season-badge',
      fallbackTargetId: 'where-to-look-callout',
      title: 'Seasonality Index (1.00× Baseline Engine)',
      description: 'SeasonalStat normalizes every metric against your shop’s 13-month historical curve. 1.00× means you are performing exactly on pace for this time of year. Values above 1.00× mean you beat seasonal expectations.',
      whyItMatters: 'Protects you from making desperate discounts when sales dip due to normal platform-wide seasonal rhythms.',
      proTip: 'Check the Seasonality index before reacting to raw month-over-month visitor drops.'
    },
    {
      stepNumber: 2,
      chapter: 'Intelligence',
      chapterColor: 'bg-[#5A7A5A]/15 text-[#2E472E] border-[#5A7A5A]/30',
      tab: 'overview',
      targetId: 'where-to-look-callout',
      fallbackTargetId: 'tour-where-to-look-first',
      title: '"Where to Look First" Bottleneck Callout',
      description: 'Diagnoses your single highest-leverage constraint in clear artisan language. If search impressions are healthy but visits dropped, it immediately identifies thumbnail click-through friction.',
      whyItMatters: 'Pinpoints the one action item that will actually move revenue this week instead of guessing across 20+ charts.',
      proTip: 'Click "Open funnel diagnosis" right in the callout for an end-to-end waterfall breakdown.'
    },
    {
      stepNumber: 3,
      chapter: 'Financials',
      chapterColor: 'bg-[#5A7A5A]/15 text-[#2E472E] border-[#5A7A5A]/30',
      tab: 'overview',
      targetId: 'gross-revenue-trend-section',
      title: '6-Month Revenue Curve & Fee Audit',
      description: 'Tracks monthly gross sales against last year’s trajectory leading into peak Q4 gifting. Click "Etsy Fee Breakdown" anytime to audit your true take-home pay after 6.5% transaction fees, renewals, and offsite ads ($789).',
      whyItMatters: 'Shows what actually lands in your bank account, not just misleading top-line Etsy gross sales receipts.',
      proTip: 'Auditing your fee deduction percentage (15.2%) helps price products accurately for target margins.'
    },
    {
      stepNumber: 4,
      chapter: 'Conversion',
      chapterColor: 'bg-[#D97757]/15 text-[#D97757] border-[#D97757]/30',
      tab: 'funnel',
      targetId: 'funnel-stage-1',
      fallbackTargetId: 'funnel-stage-2',
      title: '4-Stage Conversion Waterfall',
      description: 'Traces shoppers from Search Impressions → Listing Visits → Cart Adds → Completed Orders. Each stage is benchmarked against last year to isolate where buyers drop off.',
      whyItMatters: 'If cart adds are high but checkouts drop, the problem is shipping fees or delivery dates—not your craftsmanship.',
      proTip: 'Color-coded health indicators (Green / Amber / Red) spotlight where revenue leaks.'
    },
    {
      stepNumber: 5,
      chapter: 'Catalog',
      chapterColor: 'bg-[#D97757]/15 text-[#D97757] border-[#D97757]/30',
      tab: 'listings',
      targetId: 'filter-pill-flagged',
      title: 'Smart Diagnostic Catalog Filters',
      description: 'Instantly isolates listings that need attention: 🔴 "Seen, never bought" (high impressions, zero sales), 🟡 "Declining momentum" (past seasonal peak), and 🔵 "High cart, low checkout" (abandonment candidates).',
      whyItMatters: 'Focuses your valuable studio time on the 20% of listings causing 80% of missed revenue.',
      proTip: 'Select flagged items with checkboxes to push seasonal tags across multiple listings in one click.'
    },
    {
      stepNumber: 6,
      chapter: 'Catalog',
      chapterColor: 'bg-[#D97757]/15 text-[#D97757] border-[#D97757]/30',
      tab: 'listings',
      targetId: 'tour-edit-listing-btn',
      title: 'Listing Editor & 24h Rollback Safety',
      description: 'Update listing titles, all 13 Etsy search tags, and descriptions with write-safety logging. Every change is snapshotted to your Audit Log with a 24-hour single-click revert guarantee and 14-day performance lift tracking.',
      whyItMatters: 'Experiment with high-ranking seasonal keywords with zero fear of ruining proven listings.',
      proTip: 'The integrated AI Tag Generator analyzes current seasonal shopper trends to craft high-intent search terms.'
    },
    {
      stepNumber: 7,
      chapter: 'Integration',
      chapterColor: 'bg-[#3E5C76]/15 text-[#1D2D44] border-[#3E5C76]/30',
      tab: 'overview',
      targetId: 'connect-etsy-header-btn',
      fallbackTargetId: 'connect-etsy-banner-btn',
      title: 'Etsy Open API v3 Connection & Live Sync',
      description: 'Connect your active Etsy shop using official OAuth2 PKCE protocols with read/write listing permissions. Toggle seamlessly between demonstration data and your live store numbers with complete security.',
      whyItMatters: 'Zero security risk to your master Etsy credentials; real-time synchronization of live inventory, orders, and search tags.',
      proTip: 'Connect now to start building your shop’s personalized seasonal baseline curves!',
      actionButton: {
        label: 'Connect Etsy Shop Now',
        action: 'connect_etsy'
      }
    }
  ];

  const currentStep = steps[currentStepIndex];

  // Auto-switch tab if current step requires a different tab
  useEffect(() => {
    if (!isOpen) return;
    if (activeTab !== currentStep.tab) {
      onSwitchTab(currentStep.tab);
    }
  }, [currentStepIndex, isOpen, currentStep.tab, activeTab, onSwitchTab]);

  // Measure and position card adjacent to spotlight
  const updatePosition = useCallback(() => {
    if (!isOpen) return;

    let el: HTMLElement | null = null;
    if (currentStep.targetId) {
      el = document.getElementById(currentStep.targetId);
    }
    if (!el && currentStep.fallbackTargetId) {
      el = document.getElementById(currentStep.fallbackTargetId);
    }
    if (!el) {
      if (currentStep.targetId === 'tour-edit-listing-btn') {
        el = document.querySelector('[data-tour="edit-listing-btn"]');
      }
    }

    if (!el) {
      setTargetRect(null);
      setCardPlacement('center');
      return;
    }

    // Scroll element into comfortable view
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const rect = el.getBoundingClientRect();
    setTargetRect(rect);

    // Dynamic Card Anchoring calculation
    const padding = 6;
    const gap = 16;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const cardWidth = Math.min(480, viewportWidth - 32);
    const cardHeight = cardRef.current ? cardRef.current.offsetHeight : 360;

    const targetTop = rect.top - padding;
    const targetBottom = rect.bottom + padding;
    const targetCenterX = rect.left + rect.width / 2;
    const targetCenterY = rect.top + rect.height / 2;

    const spaceBelow = viewportHeight - targetBottom;
    const spaceAbove = targetTop;

    let chosenPlacement: CardPlacement = 'bottom';
    let top = 0;
    let left = 0;
    let arrowX = cardWidth / 2;
    let arrowY = 24;

    // Determine vertical placement: below vs above
    if (spaceBelow >= cardHeight + gap + 16) {
      chosenPlacement = 'bottom';
      top = targetBottom + gap;
    } else if (spaceAbove >= cardHeight + gap + 16) {
      chosenPlacement = 'top';
      top = targetTop - gap - cardHeight;
    } else {
      // If vertical space is tight, pick whichever has more room
      if (spaceBelow >= spaceAbove) {
        chosenPlacement = 'bottom';
        top = Math.max(16, Math.min(viewportHeight - cardHeight - 16, targetBottom + gap));
      } else {
        chosenPlacement = 'top';
        top = Math.max(16, targetTop - gap - cardHeight);
      }
    }

    // Horizontal centering relative to target, clamped to screen edges
    const idealLeft = targetCenterX - cardWidth / 2;
    left = Math.max(16, Math.min(viewportWidth - cardWidth - 16, idealLeft));
    
    // Calculate arrow position along card edge
    arrowX = Math.max(28, Math.min(cardWidth - 28, targetCenterX - left));

    setCardPlacement(chosenPlacement);
    setCardCoords({ top, left, arrowX, arrowY });
  }, [currentStep, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(updatePosition, 260);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [currentStepIndex, isOpen, activeTab, updatePosition]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('seasonalstat_tour_completed', 'true');
    onClose();
  };

  const handleActionButton = () => {
    if (!currentStep.actionButton) return;
    onClose();
    if (currentStep.actionButton.action === 'connect_etsy' && onOpenConnectEtsy) {
      onOpenConnectEtsy();
    }
  };

  const padding = 6;
  const cutoutX = targetRect ? Math.max(0, targetRect.left - padding) : 0;
  const cutoutY = targetRect ? Math.max(0, targetRect.top - padding) : 0;
  const cutoutW = targetRect ? targetRect.width + padding * 2 : 0;
  const cutoutH = targetRect ? targetRect.height + padding * 2 : 0;

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto">
      {/* 
        LAYER 2 & 3: SVG Mask for Transparent Spotlight Cutout 
        Backdrop opacity is set to 0.58 (rgba(26, 26, 26, 0.58))
        The dashboard underneath remains clearly visible and readable.
        The spotlight rectangle is 100% transparent.
      */}
      <svg 
        className="fixed inset-0 w-full h-full pointer-events-auto transition-opacity duration-300"
        style={{ width: '100vw', height: '100vh' }}
        onClick={onClose}
      >
        <defs>
          <mask id="tour-coachmark-mask">
            {/* White fills entire viewport with the 0.58 veil */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black cuts out the spotlight hole, making it 100% crystal-clear transparent */}
            {targetRect && (
              <rect
                x={cutoutX}
                y={cutoutY}
                width={cutoutW}
                height={cutoutH}
                rx="10"
                ry="10"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(24, 21, 17, 0.58)"
          mask="url(#tour-coachmark-mask)"
        />
      </svg>

      {/* 
        Spotlight Terracotta Highlight Ring & Pulse Glow
        2px solid border in terracotta (#D97757) with soft ring glow
      */}
      {targetRect && (
        <div 
          className="fixed pointer-events-none rounded-xl border-2 border-[#D97757] ring-4 ring-[#D97757]/30 transition-all duration-300 z-50 shadow-[0_0_24px_rgba(217,119,87,0.4)]"
          style={{
            top: `${cutoutY}px`,
            left: `${cutoutX}px`,
            width: `${cutoutW}px`,
            height: `${cutoutH}px`,
            borderRadius: '10px'
          }}
        />
      )}

      {/* 
        LAYER 4: Tour Card Anchored Adjacent to Target (Never covering it)
      */}
      <div 
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Product Tour Step ${currentStep.stepNumber}: ${currentStep.title}`}
        className={`fixed z-50 w-[calc(100vw-32px)] max-w-[480px] bg-white rounded-2xl border border-[#E2D8C9] shadow-2xl overflow-visible transition-all duration-300 animate-scaleUp ${
          cardPlacement === 'center' ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : ''
        }`}
        style={
          cardPlacement !== 'center'
            ? {
                top: `${cardCoords.top}px`,
                left: `${cardCoords.left}px`,
              }
            : undefined
        }
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pointer Arrow Chevron pointing at the spotlighted element */}
        {targetRect && cardPlacement === 'bottom' && (
          <div 
            className="absolute -top-2 w-4 h-4 bg-[#FAF7F2] border-t border-l border-[#E2D8C9] rotate-45 pointer-events-none transform -translate-x-1/2 shadow-xs"
            style={{ left: `${cardCoords.arrowX}px` }}
          />
        )}
        {targetRect && cardPlacement === 'top' && (
          <div 
            className="absolute -bottom-2 w-4 h-4 bg-[#FAF7F2] border-b border-r border-[#E2D8C9] rotate-45 pointer-events-none transform -translate-x-1/2 shadow-xs"
            style={{ left: `${cardCoords.arrowX}px` }}
          />
        )}

        {/* Card Header Bar */}
        <div className="bg-[#FAF7F2] px-5 py-3 rounded-t-2xl border-b border-[#E8E1D7] flex items-center justify-between gap-3 relative">
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-1 rounded-md bg-[#D97757]/15 text-[#D97757] shrink-0">
              <Compass className="w-4 h-4" />
            </span>
            <div className="flex items-center gap-2 text-xs">
              <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] border ${currentStep.chapterColor}`}>
                {currentStep.chapter}
              </span>
              <span className="font-bold text-[#7A7163]">
                · Step {currentStep.stepNumber} of {steps.length}
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#8C8375] hover:text-[#1A1A1A] rounded-lg transition-colors cursor-pointer"
            aria-label="Exit product tour"
            title="Exit Tour (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar Line */}
        <div className="w-full bg-[#EFE9DF] h-1">
          <div 
            className="bg-[#D97757] h-1 transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Body Content Area */}
        <div className="p-5 space-y-3.5 max-h-[60vh] overflow-y-auto">
          {/* Title & Core Description */}
          <div className="space-y-1.5">
            <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#1A1A1A] tracking-tight leading-snug">
              {currentStep.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#4A4337] leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Why It Matters Callout */}
          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E4DCD0] space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A]">
              <Bookmark className="w-3.5 h-3.5 text-[#5A7A5A]" />
              <span>Why this matters for your shop:</span>
            </div>
            <p className="text-xs text-[#5C5549] leading-relaxed pl-5">
              {currentStep.whyItMatters}
            </p>
          </div>

          {/* Pro Seller Tip */}
          <div className="p-2.5 bg-[#FAF3EA] rounded-xl border border-[#E8DFC8] text-xs text-[#665D4F] flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D97757] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-[#7A4B29] block text-[10px] uppercase tracking-wider">
                Pro Seller Tip
              </span>
              <span className="text-[#5C5549] text-[11px] leading-relaxed">{currentStep.proTip}</span>
            </div>
          </div>

          {/* Contextual Action Button (Step 7 Connect Etsy CTA) */}
          {currentStep.actionButton && (
            <div className="pt-1">
              <button
                type="button"
                onClick={handleActionButton}
                className="w-full py-2.5 px-4 bg-[#D97757] hover:bg-[#C26547] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <span>{currentStep.actionButton.label}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-85" />
              </button>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="bg-[#FAF7F2] px-5 py-3 rounded-b-2xl border-t border-[#E8E1D7] flex items-center justify-between gap-3 relative">
          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentStepIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIndex
                    ? 'w-5 bg-[#D97757]'
                    : idx < currentStepIndex
                    ? 'bg-[#5A7A5A]'
                    : 'bg-[#D6CEBF]'
                }`}
                title={`Jump to step ${idx + 1}`}
                aria-label={`Step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-3 py-1.5 rounded-xl border border-[#E2D8C9] bg-white text-xs font-semibold text-[#665D4F] hover:bg-[#EFE9DF] transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-1.5 rounded-xl bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>{currentStepIndex === steps.length - 1 ? 'Finish Tour' : 'Next'}</span>
              {currentStepIndex === steps.length - 1 ? (
                <Check className="w-3.5 h-3.5 text-[#5A7A5A]" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
