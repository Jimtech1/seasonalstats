import React, { useState } from 'react';
import { 
  Settings, 
  X, 
  Check, 
  Clock, 
  Truck, 
  Store, 
  Compass, 
  ShieldCheck, 
  ExternalLink,
  Sparkle,
  Trash2
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopName: string;
  carrierCutoffTime: string;
  onUpdateCarrierCutoff: (cutoff: string) => void;
  onLaunchTour: () => void;
  isConnectedEtsy: boolean;
  onOpenConnectEtsy: () => void;
  onDisconnectEtsy: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  shopName,
  carrierCutoffTime,
  onUpdateCarrierCutoff,
  onLaunchTour,
  isConnectedEtsy,
  onOpenConnectEtsy,
  onDisconnectEtsy,
}) => {
  const [cutoffInput, setCutoffInput] = useState(carrierCutoffTime);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveCutoff = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCarrierCutoff(cutoffInput.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleClearCutoff = () => {
    setCutoffInput('');
    onUpdateCarrierCutoff('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#FAF7F2] rounded-2xl border border-[#E2D8C9] shadow-2xl w-full max-w-xl overflow-hidden animate-scaleUp">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#E8E1D7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D97757]/15 text-[#D97757] flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-editorial text-2xl font-bold text-[#1A1A1A]">
                Shop & Platform Settings
              </h2>
              <p className="text-xs text-[#665D4F]">
                Configure fulfillment cutoffs, Etsy connection, and interface preferences.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#7A7163] hover:text-[#1A1A1A] rounded-xl hover:bg-[#FAF7F2] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Subscription & Shop Status */}
          <div className="p-4 bg-white rounded-xl border border-[#E2D8C9] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A7163]">
                Account & Subscription
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D97757]/15 text-[#D97757]">
                Pro Plan Active
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F0EAE1]">
              <span className="text-[#6B6356]">Active Shop:</span>
              <span className="font-bold text-[#1A1A1A]">{shopName}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6B6356]">Multi-shop Allowance:</span>
              <span className="font-mono text-[#1A1A1A]">1 of 3 shops connected</span>
            </div>
          </div>

          {/* Section 4.6: Carrier Cutoff Seller Settings */}
          <div className="p-4 bg-white rounded-xl border border-[#E2D8C9] space-y-3">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#D97757]" />
              <h3 className="font-editorial text-lg font-bold text-[#1A1A1A]">
                Daily Postal Carrier Cutoff
              </h3>
            </div>
            <p className="text-xs text-[#665D4F] leading-relaxed">
              Packing Sheets sort artisan orders by carrier dispatch deadlines. Sourced directly from your local post office or courier pickup schedule.
            </p>

            <form onSubmit={handleSaveCutoff} className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={cutoffInput}
                  onChange={(e) => setCutoffInput(e.target.value)}
                  placeholder="e.g. 5:00 PM EST (or leave blank to test unconfigured)"
                  className="flex-1 px-3.5 py-2 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs text-[#1A1A1A] placeholder:text-[#9C9487] focus:outline-hidden focus:ring-2 focus:ring-[#D97757]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#8C8375]">
                  Status: {carrierCutoffTime ? <strong className="text-[#5A7A5A]">Configured ({carrierCutoffTime})</strong> : <strong className="text-[#B85C4A]">Not configured (Fallback active)</strong>}
                </span>
                {carrierCutoffTime && (
                  <button
                    type="button"
                    onClick={handleClearCutoff}
                    className="text-[11px] text-[#B85C4A] hover:underline cursor-pointer"
                  >
                    Clear configuration
                  </button>
                )}
              </div>

              {savedSuccess && (
                <div className="p-2.5 rounded-lg bg-[#5A7A5A]/15 text-[#2E472E] text-xs font-semibold flex items-center gap-2">
                  <Check className="w-3.5 h-3.5" />
                  <span>Carrier cutoff setting updated successfully!</span>
                </div>
              )}
            </form>
          </div>

          {/* Section 5.2: Product Tour Re-trigger */}
          <div className="p-4 bg-white rounded-xl border border-[#E2D8C9] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#D97757]" />
                <h3 className="font-editorial text-lg font-bold text-[#1A1A1A]">
                  Guided Product Tour
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLaunchTour();
                }}
                className="px-3.5 py-1.5 bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#1A1A1A] border border-[#E2D8C9] rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Compass className="w-3.5 h-3.5 text-[#D97757]" />
                <span>Re-launch Tour</span>
              </button>
            </div>
            <p className="text-xs text-[#665D4F]">
              Step through 7 essential coach marks highlighting seasonality index normalization, the root bottleneck callout, the 6-month revenue curve, conversion funnel diagnostics, flagged listing filters, and the 24-hour safety rollback layer.
            </p>
          </div>

          {/* Etsy Connection Management */}
          <div className="p-4 bg-white rounded-xl border border-[#E2D8C9] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#D97757]" />
                <h3 className="font-editorial text-lg font-bold text-[#1A1A1A]">
                  Etsy Open API v3
                </h3>
              </div>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                isConnectedEtsy ? 'bg-[#5A7A5A]/15 text-[#5A7A5A]' : 'bg-[#D97757]/15 text-[#D97757]'
              }`}>
                {isConnectedEtsy ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <p className="text-xs text-[#665D4F]">
              Scoped OAuth permissions: listings_r, listings_w, transactions_r, feedback_r.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {!isConnectedEtsy ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenConnectEtsy();
                  }}
                  className="px-4 py-2 bg-[#D97757] hover:bg-[#C26547] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Connect Etsy Shop
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onDisconnectEtsy}
                  className="px-3.5 py-2 bg-white hover:bg-[#FAF7F2] text-[#B85C4A] border border-[#B85C4A]/40 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Disconnect Shop</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#E8E1D7] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};
