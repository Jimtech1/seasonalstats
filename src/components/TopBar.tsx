import React, { useState } from 'react';
import { 
  Store, 
  ChevronDown, 
  Plus, 
  Globe, 
  Printer, 
  CheckSquare, 
  ExternalLink, 
  Compass, 
  Menu, 
  Check, 
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface TopBarProps {
  shopName: string;
  onSelectShop?: (name: string) => void;
  isSampleData: boolean;
  onToggleSampleData: () => void;
  isConnectedEtsy: boolean;
  onOpenConnectEtsy: () => void;
  onOpenRegionalCalendar: () => void;
  onOpenPackingSheets: () => void;
  onOpenWeeklyPlan: () => void;
  onOpenTour: () => void;
  onToggleMobileSidebar: () => void;
  openOrdersCount?: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  shopName,
  onSelectShop,
  isSampleData,
  onToggleSampleData,
  isConnectedEtsy,
  onOpenConnectEtsy,
  onOpenRegionalCalendar,
  onOpenPackingSheets,
  onOpenWeeklyPlan,
  onOpenTour,
  onToggleMobileSidebar,
  openOrdersCount = 4,
}) => {
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);

  const availableShops = [
    'The Woodland Artisan Studio',
    'Highland Glaze Pottery (Demo)',
  ];

  return (
    <header className="sticky top-0 z-20 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E1D7] transition-all">
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 flex-wrap">
        
        {/* Left: Mobile hamburger & Shop Switcher */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="p-2 md:hidden text-[#7A7163] hover:text-[#1A1A1A] hover:bg-[#EFE9DF] rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Shop Switcher Dropdown */}
          <div className="relative">
            <button
              id="shop-switcher-btn"
              type="button"
              onClick={() => setIsShopMenuOpen(!isShopMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs font-semibold text-[#1A1A1A] shadow-xs transition-colors cursor-pointer"
            >
              <div className="w-5 h-5 rounded-md bg-[#D97757]/15 text-[#D97757] flex items-center justify-center">
                <Store className="w-3 h-3" />
              </div>
              <span className="truncate max-w-[160px] sm:max-w-[220px]">
                {shopName}
              </span>
              <span className={`w-2 h-2 rounded-full ${isConnectedEtsy ? 'bg-[#5A7A5A]' : 'bg-[#D97757]'}`} title={isConnectedEtsy ? 'Etsy Connected' : 'Sample Data'} />
              <ChevronDown className="w-3.5 h-3.5 text-[#7A7163]" />
            </button>

            {isShopMenuOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-xl border border-[#E2D8C9] shadow-lg py-1.5 z-50 animate-fadeIn text-xs">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8C8375]">
                  Connected Shops (1 of 3)
                </div>
                {availableShops.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      if (onSelectShop) onSelectShop(s);
                      setIsShopMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-[#FAF7F2] flex items-center justify-between text-xs cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Store className="w-3.5 h-3.5 text-[#D97757]" />
                      <span className={s === shopName ? 'font-bold text-[#1A1A1A]' : 'text-[#5C5549]'}>
                        {s}
                      </span>
                    </div>
                    {s === shopName && <Check className="w-3.5 h-3.5 text-[#5A7A5A]" />}
                  </button>
                ))}
                <div className="border-t border-[#E8E1D7] my-1" />
                <button
                  type="button"
                  onClick={() => {
                    setIsShopMenuOpen(false);
                    onOpenConnectEtsy();
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs font-semibold text-[#D97757] hover:bg-[#FAF7F2] flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Connect another Etsy shop</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Operational Tool Actions, Sample Data Switch, Connect Etsy */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
          
          {/* Sample Data Toggle */}
          <div className="flex items-center gap-2 bg-[#EFE9DF] px-2.5 py-1 rounded-xl border border-[#E4DCD0]">
            <span className="text-xs font-semibold text-[#6B6356]">
              {isSampleData ? 'Sample Data' : 'Live Store'}
            </span>
            <button
              id="sample-data-toggle"
              type="button"
              role="switch"
              aria-checked={isSampleData}
              onClick={onToggleSampleData}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                isSampleData ? 'bg-[#D97757]' : 'bg-[#5A7A5A]'
              }`}
              title="Toggle between sample demonstration data and your active shop connection"
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  isSampleData ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Regional Holidays Button */}
          <button
            id="open-regional-calendar-btn"
            type="button"
            onClick={onOpenRegionalCalendar}
            className="px-3 py-1.5 bg-white hover:bg-[#EFE9DF] text-[#1A1A1A] border border-[#E2D8C9] text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Regional holiday timelines and postal shipping cutoffs (US, UK, CA, AU, DE, FR)"
          >
            <Globe className="w-3.5 h-3.5 text-[#D97757]" />
            <span className="hidden xl:inline">Regional Holidays</span>
            <span className="xl:hidden">Holidays</span>
          </button>

          {/* Packing Sheets Button */}
          <button
            id="open-packing-sheets-nav-btn"
            type="button"
            onClick={onOpenPackingSheets}
            className="px-3 py-1.5 bg-white hover:bg-[#EFE9DF] text-[#1A1A1A] border border-[#E2D8C9] text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Printable batch slips & material replenishment sorted by carrier cutoffs"
          >
            <Printer className="w-3.5 h-3.5 text-[#5A7A5A]" />
            <span className="hidden sm:inline">Packing Sheets</span>
            {openOrdersCount > 0 && (
              <span className="text-[10px] bg-[#5A7A5A] text-white px-1.5 py-0.2 rounded-full font-bold">
                {openOrdersCount}
              </span>
            )}
          </button>

          {/* Weekly Action Plan Button */}
          <button
            id="open-weekly-plan-btn"
            type="button"
            onClick={onOpenWeeklyPlan}
            className="px-3 py-1.5 bg-[#5A7A5A] hover:bg-[#4A684A] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Open printable 1-page weekly listing action plan"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Weekly Action Plan</span>
            <span className="lg:hidden">Plan</span>
          </button>

          {/* Guided Tour Trigger Button */}
          <button
            id="open-guided-onboarding-btn"
            type="button"
            onClick={onOpenTour}
            className="p-1.5 bg-white hover:bg-[#EFE9DF] text-[#7A7163] hover:text-[#1A1A1A] border border-[#E2D8C9] rounded-xl transition-colors shadow-xs cursor-pointer"
            title="Guided Product Tour (7 Core Steps)"
            aria-label="Guided Product Tour"
          >
            <Compass className="w-4 h-4 text-[#D97757]" />
          </button>

          {/* Connect Etsy Button */}
          <button
            id="connect-etsy-header-btn"
            type="button"
            onClick={onOpenConnectEtsy}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer ${
              isConnectedEtsy
                ? 'bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#FAF7F2]'
                : 'bg-[#D97757] hover:bg-[#C26547] text-white'
            }`}
          >
            {isConnectedEtsy ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#5A7A5A]" />
                <span>Etsy Connected</span>
                <Check className="w-3.5 h-3.5 text-[#5A7A5A]" />
              </>
            ) : (
              <>
                <span>Connect Etsy</span>
                <ExternalLink className="w-3 h-3 opacity-85" />
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
