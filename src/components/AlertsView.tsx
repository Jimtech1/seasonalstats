import React, { useState } from 'react';
import { AlertItem } from '../types';
import { 
  Bell, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  Mail, 
  Sliders, 
  Calendar, 
  ArrowRight, 
  Check, 
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface AlertsViewProps {
  alerts: AlertItem[];
  onResolveAlert: (id: string) => void;
  onNavigateToListing: (listingId: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  onResolveAlert,
  onNavigateToListing,
}) => {
  // Alert settings state
  const [threshold, setThreshold] = useState<number>(0.70);
  const [emailDigestEnabled, setEmailDigestEnabled] = useState(true);
  const [cartAbandonmentAlerts, setCartAbandonmentAlerts] = useState(true);
  const [listingImpressionAlerts, setListingImpressionAlerts] = useState(true);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  const handleSaveSettings = () => {
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="pb-2 border-b border-[#E8E1D7]">
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
          Shop alerts & diagnostics
        </h1>
        <p className="mt-1 text-sm sm:text-base text-[#665D4F] max-w-3xl leading-relaxed">
          Automated anomaly detection scans your shop daily against historical seasonal curves.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Weekly Digest Preview + Active Alerts (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Weekly Digest Preview Card */}
          <div 
            id="weekly-digest-card"
            className="p-5 sm:p-6 bg-gradient-to-br from-[#FAF3EA] to-white rounded-xl border border-[#D97757]/35 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-[#D97757]/15 text-[#D97757]">
                  <Mail className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-editorial text-lg font-bold text-[#1A1A1A]">
                    Weekly Monday Digest Preview
                  </h3>
                  <span className="text-xs text-[#7A7163]">
                    Sent every Monday at 8:00 AM to shop owner
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold bg-[#5A7A5A]/15 text-[#355235] px-2.5 py-1 rounded-full">
                Active Digest
              </span>
            </div>

            <div className="p-4 bg-white rounded-lg border border-[#E2D8C9] space-y-2 text-xs text-[#4A4235] leading-relaxed">
              <p className="font-semibold text-[#1A1A1A] text-sm">
                Good morning! Here are your top 3 changes vs your seasonal baseline this week:
              </p>
              <ul className="space-y-1.5 pl-3 list-disc marker:text-[#D97757]">
                <li>
                  <strong>Clicks bottleneck:</strong> Stage 2 is at <strong>0.74×</strong> pace. 2 listings need thumbnail replacement.
                </li>
                <li>
                  <strong>High cart abandonment:</strong> 52 shoppers added Wool Felt Slippers to cart with 0 checkouts.
                </li>
                <li>
                  <strong>Keyword shifts:</strong> "personalised cutting board" queries down 36% compared to same week last year.
                </li>
              </ul>
            </div>
          </div>

          {/* Threshold Alerts List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-editorial text-xl font-bold text-[#1A1A1A]">
                Active Threshold Alerts ({alerts.filter(a => !a.resolved).length})
              </h3>
              <span className="text-xs text-[#7A7163]">
                Threshold: Seasonality Index &lt; {threshold.toFixed(2)}×
              </span>
            </div>

            <div className="space-y-3">
              {alerts.map((alert) => {
                const isRed = alert.type === 'red';

                return (
                  <div
                    key={alert.id}
                    id={`alert-item-${alert.id}`}
                    className={`p-4 sm:p-5 rounded-xl border transition-all ${
                      alert.resolved
                        ? 'bg-white/50 border-[#E8E1D7] opacity-60'
                        : isRed
                        ? 'bg-white border-[#B85C4A]/40 shadow-xs'
                        : 'bg-white border-[#D97757]/40 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                          alert.resolved
                            ? 'bg-gray-100 text-gray-500'
                            : isRed
                            ? 'bg-[#B85C4A]/12 text-[#B85C4A]'
                            : 'bg-[#D97757]/12 text-[#D97757]'
                        }`}>
                          {isRed ? (
                            <AlertOctagon className="w-5 h-5" />
                          ) : (
                            <AlertTriangle className="w-5 h-5" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <h4 className={`text-sm font-bold ${alert.resolved ? 'line-through text-gray-500' : 'text-[#1A1A1A]'}`}>
                            {alert.title}
                          </h4>
                          <p className="text-xs text-[#5C5549] leading-relaxed">
                            {alert.message}
                          </p>
                          <div className="flex items-center flex-wrap gap-2 pt-1 text-[11px] text-[#7A7163]">
                            <span className="font-mono font-semibold text-[#1A1A1A] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E4DCD0]">
                              {alert.metricInfo}
                            </span>
                            <span>•</span>
                            <span>{alert.timeAgo}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                        {alert.listingId && !alert.resolved && (
                          <button
                            type="button"
                            onClick={() => onNavigateToListing(alert.listingId!)}
                            className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#1A1A1A] border border-[#E2D8C9] rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>Fix Listing</span>
                            <ArrowRight className="w-3 h-3 text-[#D97757]" />
                          </button>
                        )}

                        {!alert.resolved ? (
                          <button
                            type="button"
                            onClick={() => onResolveAlert(alert.id)}
                            className="px-3 py-1.5 bg-white hover:bg-gray-50 text-[#5C5549] hover:text-[#1A1A1A] border border-[#E2D8C9] rounded-lg text-xs font-medium cursor-pointer transition-colors"
                          >
                            Dismiss
                          </button>
                        ) : (
                          <span className="text-xs text-[#5A7A5A] font-semibold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            Resolved
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Alert Threshold & Preferences Settings (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="p-5 bg-white rounded-xl border border-[#E8E1D7] shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8E1D7]">
              <Sliders className="w-4 h-4 text-[#D97757]" />
              <h3 className="font-editorial text-lg font-bold text-[#1A1A1A]">
                Alert Sensitivity
              </h3>
            </div>

            {/* Threshold Slider (default 0.70x) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#4A4235]">Trigger Threshold</span>
                <span className="font-mono font-bold text-[#D97757] text-sm">
                  {threshold.toFixed(2)}× pace
                </span>
              </div>
              <input
                id="alert-threshold-slider"
                type="range"
                min="0.50"
                max="0.95"
                step="0.05"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full accent-[#D97757] cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] text-[#8C8375]">
                <span>0.50× (Only severe drops)</span>
                <span>0.95× (Very sensitive)</span>
              </div>
              <p className="text-[11px] text-[#7A7163] leading-relaxed pt-1">
                Trigger alerts when a metric or search term falls below this fraction of its seasonal baseline.
              </p>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2 border-t border-[#F0EAE1]">
              <label className="flex items-center justify-between text-xs cursor-pointer">
                <div>
                  <span className="font-semibold text-[#1A1A1A] block">Email Monday Digest</span>
                  <span className="text-[11px] text-[#7A7163]">Weekly summary with action links</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailDigestEnabled}
                  onChange={(e) => setEmailDigestEnabled(e.target.checked)}
                  className="accent-[#D97757] w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between text-xs cursor-pointer">
                <div>
                  <span className="font-semibold text-[#1A1A1A] block">Cart Abandonment Cues</span>
                  <span className="text-[11px] text-[#7A7163]">Flag listings with &gt;20 carts and 0 orders</span>
                </div>
                <input
                  type="checkbox"
                  checked={cartAbandonmentAlerts}
                  onChange={(e) => setCartAbandonmentAlerts(e.target.checked)}
                  className="accent-[#D97757] w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between text-xs cursor-pointer">
                <div>
                  <span className="font-semibold text-[#1A1A1A] block">Listing CTR Drops</span>
                  <span className="text-[11px] text-[#7A7163]">Flag listings with CTR &lt; 0.60%</span>
                </div>
                <input
                  type="checkbox"
                  checked={listingImpressionAlerts}
                  onChange={(e) => setListingImpressionAlerts(e.target.checked)}
                  className="accent-[#D97757] w-4 h-4 cursor-pointer"
                />
              </label>
            </div>

            <button
              id="save-alert-settings-btn"
              type="button"
              onClick={handleSaveSettings}
              className="w-full py-2.5 bg-[#1A1A1A] hover:bg-[#333] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {settingsSavedToast ? (
                <>
                  <Check className="w-4 h-4 text-[#5A7A5A]" />
                  <span>Preferences Saved!</span>
                </>
              ) : (
                <span>Save Alert Preferences</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
