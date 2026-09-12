import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight } from 'lucide-react';

interface WaitlistModalProps {
  platform: string | null;
  onClose: () => void;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({ platform, onClose }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!platform) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setEmail('');
      }, 2000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div 
        id="waitlist-modal-container"
        className="bg-[#FAF7F2] rounded-2xl border border-[#D97757]/30 shadow-2xl w-full max-w-md p-6 space-y-4 animate-scaleUp"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#D97757]/15 text-[#D97757]">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="font-editorial text-xl font-bold text-[#1A1A1A]">
              {platform} Integration
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#7A7163] hover:text-[#1A1A1A] rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-[#665D4F] leading-relaxed">
          <strong>{platform}</strong> seasonal curve normalization is currently in private development. Join the early seller cohort to get priority access when multi-channel syncing opens.
        </p>

        {submitted ? (
          <div className="p-4 bg-[#5A7A5A]/15 border border-[#5A7A5A]/30 rounded-xl flex items-center gap-2 text-xs font-semibold text-[#355235]">
            <Check className="w-4 h-4 text-[#5A7A5A]" />
            <span>You're on the priority waitlist! We'll email you first.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your seller email address..."
              className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-[#E2D8C9] text-xs sm:text-sm focus:outline-hidden focus:border-[#D97757] text-[#1A1A1A]"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-[#D97757] hover:bg-[#C26547] text-[#FAF7F2] font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Join {platform} Waitlist</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <p className="text-[11px] text-[#8C8375] text-center pt-1">
          SeasonalStat currently natively connects to Etsy with full read & write listing controls.
        </p>
      </div>
    </div>
  );
};
