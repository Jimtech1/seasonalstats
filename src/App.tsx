import React, { useState } from 'react';
import { 
  ActiveTab, 
  ListingItem, 
  ListingEditRecord, 
  ListingFlag,
  AlertItem,
  TargetRegion,
  ScheduledTagRule,
  ArtisanOrderBatchSlip,
  MaterialReplenishmentItem,
  EtsySyncStatus,
  LoyaltyCustomer,
  CareInsertTemplate,
  LoyaltyMetrics
} from './types';
import { 
  INITIAL_KPIS, 
  INITIAL_FUNNEL_STAGES, 
  INITIAL_LISTINGS, 
  INITIAL_SEARCH_TERMS, 
  INITIAL_HISTORICAL_MONTHS, 
  INITIAL_ALERTS, 
  INITIAL_AUDIT_LOG,
  INITIAL_SCHEDULED_RULES,
  INITIAL_ORDER_BATCH_SLIPS,
  INITIAL_MATERIALS_REPLENISHMENT,
  INITIAL_ETSY_SYNC_STATUS,
  INITIAL_LOYALTY_METRICS,
  INITIAL_LOYALTY_CUSTOMERS,
  INITIAL_CARE_TEMPLATES
} from './data/sampleData';

import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { OverviewView } from './components/OverviewView';
import { FunnelView } from './components/FunnelView';
import { ListingsView } from './components/ListingsView';
import { SearchTermsView } from './components/SearchTermsView';
import { HistoryView } from './components/HistoryView';
import { AlertsView } from './components/AlertsView';
import { GoalsView } from './components/GoalsView';
import { AuditLogView } from './components/AuditLogView';
import { SeasonalSchedulerView } from './components/SeasonalSchedulerView';
import { CustomerLoyaltyView } from './components/CustomerLoyaltyView';

import { PackingSheetsModal } from './components/PackingSheetsModal';
import { WaitlistModal } from './components/WaitlistModal';
import { ConnectEtsyModal } from './components/ConnectEtsyModal';
import { WeeklyActionPlanModal } from './components/WeeklyActionPlanModal';
import { RegionalCalendarModal } from './components/RegionalCalendarModal';
import { SettingsModal } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';
import { GuidedTour } from './components/GuidedTour';

import { Check, RotateCcw, X, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Core data states
  const [listings, setListings] = useState<ListingItem[]>(INITIAL_LISTINGS);
  const [kpis, setKpis] = useState(INITIAL_KPIS);
  const [funnelStages, setFunnelStages] = useState(INITIAL_FUNNEL_STAGES);
  const [searchTerms, setSearchTerms] = useState(INITIAL_SEARCH_TERMS);
  const [history, setHistory] = useState(INITIAL_HISTORICAL_MONTHS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [auditLog, setAuditLog] = useState<ListingEditRecord[]>(INITIAL_AUDIT_LOG);

  // Operational states
  const [scheduledRules, setScheduledRules] = useState<ScheduledTagRule[]>(INITIAL_SCHEDULED_RULES);
  const [orderSlips, setOrderSlips] = useState<ArtisanOrderBatchSlip[]>(INITIAL_ORDER_BATCH_SLIPS);
  const [materialItems, setMaterialItems] = useState<MaterialReplenishmentItem[]>(INITIAL_MATERIALS_REPLENISHMENT);
  const [etsySyncStatus, setEtsySyncStatus] = useState<EtsySyncStatus>(INITIAL_ETSY_SYNC_STATUS);
  const [carrierCutoffTime, setCarrierCutoffTime] = useState<string>('5:00 PM EST');

  // Customer Loyalty state
  const [loyaltyMetrics, setLoyaltyMetrics] = useState<LoyaltyMetrics>(INITIAL_LOYALTY_METRICS);
  const [loyaltyCustomers, setLoyaltyCustomers] = useState<LoyaltyCustomer[]>(INITIAL_LOYALTY_CUSTOMERS);
  const [careTemplates, setCareTemplates] = useState<CareInsertTemplate[]>(INITIAL_CARE_TEMPLATES);

  // Shop state
  const [shopName, setShopName] = useState('The Woodland Artisan Studio');
  const [isSampleData, setIsSampleData] = useState(true);
  const [isConnectedEtsy, setIsConnectedEtsy] = useState(false);
  const [currentRegion, setCurrentRegion] = useState<TargetRegion>('US');

  // Modals
  const [waitlistPlatform, setWaitlistPlatform] = useState<string | null>(null);
  const [isConnectEtsyOpen, setIsConnectEtsyOpen] = useState(false);
  const [isWeeklyPlanOpen, setIsWeeklyPlanOpen] = useState(false);
  const [isRegionalCalendarOpen, setIsRegionalCalendarOpen] = useState(false);
  const [isPackingSheetsOpen, setIsPackingSheetsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  // Guided Tour: auto-launch on first visit if not yet completed
  const [isTourOpen, setIsTourOpen] = useState<boolean>(() => {
    return !localStorage.getItem('seasonalstat_tour_completed');
  });

  // Listings filter shortcut state
  const [listingsInitialFilter, setListingsInitialFilter] = useState<ListingFlag | 'all' | 'flagged'>('all');

  // Notification toast state
  const [toast, setToast] = useState<{
    id: string;
    message: string;
    editRecord?: ListingEditRecord;
  } | null>(null);

  // Handle listing edit save
  const handleUpdateListing = (updatedListing: ListingItem, editRecord: ListingEditRecord) => {
    setListings(prev => prev.map(l => l.id === updatedListing.id ? updatedListing : l));
    setAuditLog(prev => [editRecord, ...prev]);

    // Show toast with undo button
    setToast({
      id: editRecord.id,
      message: 'Listing updated on Etsy',
      editRecord,
    });
  };

  // Handle batch listing update (e.g. holiday tags)
  const handleBatchUpdateListings = (newRecords: ListingEditRecord[], updatedListings: ListingItem[]) => {
    setListings(updatedListings);
    setAuditLog(prev => [...newRecords, ...prev]);

    setToast({
      id: `batch-${Date.now()}`,
      message: `Batch updated ${newRecords.length} listings with 24-hour rollback guarantee.`,
      editRecord: newRecords[0],
    });
  };

  // Revert listing change from audit log or toast (with 24hr enforcement)
  const handleRevertEdit = (editId: string) => {
    const record = auditLog.find(r => r.id === editId);
    if (!record) return;

    if (record.canUndoUntil.startsWith('Expired')) {
      setToast({
        id: `err-${Date.now()}`,
        message: 'Revert window expired (24h limit passed). Etsy ranking has settled.'
      });
      return;
    }

    setListings(prev => prev.map(l => {
      if (l.id === record.listingId) {
        if (record.fieldChanged === 'tags' && record.oldValue.tags) {
          return { ...l, tags: record.oldValue.tags };
        }
        if (record.fieldChanged === 'title' && record.oldValue.title) {
          return { ...l, title: record.oldValue.title };
        }
        if (record.fieldChanged === 'price' && record.oldValue.price) {
          return { ...l, price: record.oldValue.price };
        }
      }
      return l;
    }));

    setAuditLog(prev => prev.map(r => 
      r.id === editId ? { ...r, status: 'reverted' as const } : r
    ));

    setToast({
      id: `revert-${Date.now()}`,
      message: `Successfully reverted changes for "${record.listingTitle}"!`,
    });
  };

  // Resolve alert
  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, resolved: true } : a
    ));
    setToast({
      id: `alert-${Date.now()}`,
      message: 'Alert resolved.',
    });
  };

  // Tag rule automation handlers
  const handleExecuteScheduledRule = (ruleId: string) => {
    const rule = scheduledRules.find(r => r.id === ruleId);
    if (!rule) return;

    const targeted = listings.filter(l => rule.targetListingIds.includes(l.id));
    const newRecords: ListingEditRecord[] = [];

    const updatedListings = listings.map(l => {
      if (rule.targetListingIds.includes(l.id)) {
        let updatedTags = [...l.tags];
        if (rule.action === 'add') {
          const toAdd = rule.tags.filter(t => !updatedTags.includes(t));
          updatedTags = [...updatedTags, ...toAdd].slice(0, 13);
        } else {
          updatedTags = updatedTags.filter(t => !rule.tags.includes(t));
        }

        const editRecord: ListingEditRecord = {
          id: `sched-exec-${Date.now()}-${l.id}`,
          listingId: l.id,
          listingTitle: l.title,
          timestamp: 'Just now (Automated Schedule)',
          fieldChanged: 'tags',
          oldValue: { tags: l.tags },
          newValue: { tags: updatedTags },
          status: 'published',
          canUndoUntil: 'Active (24 hours remaining)'
        };
        newRecords.push(editRecord);

        return { ...l, tags: updatedTags };
      }
      return l;
    });

    setListings(updatedListings);
    setAuditLog(prev => [...newRecords, ...prev]);

    setScheduledRules(prev => prev.map(r => 
      r.id === ruleId 
        ? { ...r, status: 'executed', lastExecuted: new Date().toLocaleDateString() } 
        : r
    ));

    setToast({
      id: `exec-${Date.now()}`,
      message: `Executed "${rule.name}" across ${targeted.length} listings! 24h rollback logged.`,
      editRecord: newRecords[0]
    });
  };

  const handleCreateScheduledRule = (newRule: ScheduledTagRule) => {
    setScheduledRules(prev => [newRule, ...prev]);
    setToast({
      id: `rule-${Date.now()}`,
      message: `Scheduled "${newRule.name}" for ${newRule.scheduledDate}`
    });
  };

  const handleToggleRuleStatus = (ruleId: string) => {
    setScheduledRules(prev => prev.map(r => {
      if (r.id === ruleId) {
        const nextStatus = r.status === 'paused' ? 'scheduled' : 'paused';
        return { ...r, status: nextStatus };
      }
      return r;
    }));
  };

  const handleDeleteRule = (ruleId: string) => {
    setScheduledRules(prev => prev.filter(r => r.id !== ruleId));
  };

  // Packing Checklist handlers
  const handleToggleChecklistItem = (orderId: string, checklistId: string) => {
    setOrderSlips(prev => prev.map(slip => {
      if (slip.orderId === orderId) {
        return {
          ...slip,
          packagingChecklist: slip.packagingChecklist.map(c => 
            c.id === checklistId ? { ...c, completed: !c.completed } : c
          )
        };
      }
      return slip;
    }));
  };

  const handleMarkOrderPacked = (orderId: string) => {
    setOrderSlips(prev => prev.map(slip => 
      slip.orderId === orderId ? { ...slip, isPacked: !slip.isPacked } : slip
    ));
    setToast({
      id: `packed-${Date.now()}`,
      message: `Order ${orderId} marked as verified & packed for carrier cutoff pickup!`
    });
  };

  // Live Etsy API sync & Webhook simulation handlers
  const handleTriggerEtsySync = async () => {
    try {
      const res = await fetch('/api/etsy/sync', { method: 'POST' });
      const data = await res.json();
      setEtsySyncStatus(prev => ({
        ...prev,
        lastSyncedAt: 'Just now (Live Etsy Sync)',
        rateLimitRemaining: data.rateLimitRemaining || prev.rateLimitRemaining - 4
      }));
      setToast({
        id: `sync-${Date.now()}`,
        message: 'Synced active listings & inventory from Etsy Open API v3'
      });
    } catch {
      setEtsySyncStatus(prev => ({
        ...prev,
        lastSyncedAt: 'Just now (Etsy Sync)'
      }));
    }
  };

  const handleSimulateEtsyWebhook = async (
    eventType: 'shop.receipt.created' | 'listing.inventory.updated',
    itemTitle: string
  ) => {
    try {
      const res = await fetch('/api/etsy/webhooks/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, itemTitle, customerName: 'Hannah Miller' })
      });
      const data = await res.json();

      if (data.webhook) {
        setEtsySyncStatus(prev => ({
          ...prev,
          recentWebhooks: [data.webhook, ...prev.recentWebhooks.slice(0, 9)],
          openOrdersCount: prev.openOrdersCount + (eventType === 'shop.receipt.created' ? 1 : 0)
        }));

        if (eventType === 'shop.receipt.created') {
          const newOrderSlip: ArtisanOrderBatchSlip = {
            orderId: `ETSY-${Math.floor(29000 + Math.random() * 999)}`,
            customerName: 'Hannah Miller',
            destinationCity: 'Boston, MA',
            destinationCountry: 'US',
            orderDate: 'Just now (Webhook)',
            shippingCutoffDate: '2026-09-15 (Tue)',
            shippingMethod: 'USPS Priority',
            carrierCutoffHoursLeft: 42,
            urgencyStatus: 'urgent',
            isPacked: false,
            items: [
              {
                listingId: 'listing-1',
                title: 'Ceramic coffee mug, rustic speckled stoneware pottery cup',
                quantity: 1,
                variation: 'Warm Oatmeal / 12 oz',
                materials: 'Speckled stoneware clay, food-safe matte glaze'
              }
            ],
            packagingChecklist: [
              { id: `chk-${Date.now()}-1`, label: 'Inspect glaze and stoneware body for hairline crazing', completed: false },
              { id: `chk-${Date.now()}-2`, label: 'Triple wrap in embossed honeycomb paper cushion', completed: false },
              { id: `chk-${Date.now()}-3`, label: 'Print thermal shipping label and affix packing slip', completed: false }
            ]
          };
          setOrderSlips(prev => [newOrderSlip, ...prev]);
        } else if (eventType === 'listing.inventory.updated') {
          setListings(prev => prev.map(l => 
            l.id === 'listing-2' ? { ...l, stockLevel: Math.max(0, l.stockLevel - 1) } : l
          ));
        }

        setToast({
          id: `wh-toast-${Date.now()}`,
          message: `Etsy Webhook Received: ${eventType} (${data.webhook.payloadSummary})`
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDisconnectEtsy = async () => {
    try {
      await fetch('/api/etsy/disconnect', { method: 'POST' });
    } catch {
      // ignore
    }
    setIsConnectedEtsy(false);
    setEtsySyncStatus(prev => ({ ...prev, connected: false }));
    setToast({
      id: `disconnect-${Date.now()}`,
      message: 'Disconnected Etsy shop session. Switched to sample data mode.'
    });
  };

  // Customer Loyalty handlers
  const handleUpdateCareTemplate = (updated: CareInsertTemplate) => {
    setCareTemplates(prev => prev.map(t => t.id === updated.id ? updated : t));
    setToast({
      id: `tpl-update-${Date.now()}`,
      message: `Updated packaging insert: "${updated.name}"`
    });
  };

  const handleSendReengagementNote = (customerName: string, coupon: string) => {
    setToast({
      id: `reengage-${Date.now()}`,
      message: `Queued personalized note with code ${coupon} for ${customerName}`
    });
  };

  // Navigation shortcuts
  const navigateToFunnel = () => {
    setActiveTab('funnel');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToListingsFlagged = () => {
    setListingsInitialFilter('flagged');
    setActiveTab('listings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSpecificListing = (listingId: string) => {
    setListingsInitialFilter('all');
    setActiveTab('listings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A] flex flex-row selection:bg-[#D97757]/20 selection:text-[#1A1A1A]">
      
      {/* 1. Left Navigation Sidebar (Desktop) */}
      <div className="hidden md:flex flex-col shrink-0">
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          alertsCount={alerts.filter(a => !a.resolved).length}
          recentEditsCount={auditLog.filter(a => a.status === 'published').length}
          isConnectedEtsy={isConnectedEtsy}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
          onSignOut={() => {
            setToast({
              id: `signout-${Date.now()}`,
              message: 'Signed out of workspace session'
            });
          }}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs" 
            onClick={() => setIsMobileSidebarOpen(false)} 
          />
          <div className="relative flex-1 max-w-xs w-full bg-[#FAF7F2] flex flex-col z-50">
            <Sidebar
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                setIsMobileSidebarOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              isCollapsed={false}
              onToggleCollapse={() => setIsMobileSidebarOpen(false)}
              alertsCount={alerts.filter(a => !a.resolved).length}
              recentEditsCount={auditLog.filter(a => a.status === 'published').length}
              isConnectedEtsy={isConnectedEtsy}
              onOpenSettings={() => {
                setIsMobileSidebarOpen(false);
                setIsSettingsOpen(true);
              }}
              onOpenHelp={() => {
                setIsMobileSidebarOpen(false);
                setIsHelpOpen(true);
              }}
              onSignOut={() => {
                setIsMobileSidebarOpen(false);
                setToast({
                  id: `signout-${Date.now()}`,
                  message: 'Signed out of workspace session'
                });
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Bar with Shop Switcher, Actions, and Sample Data Switch */}
        <TopBar
          shopName={shopName}
          onSelectShop={(name) => setShopName(name)}
          isSampleData={isSampleData}
          onToggleSampleData={() => {
            if (!isConnectedEtsy && isSampleData) {
              setIsConnectEtsyOpen(true);
              setToast({
                id: `connect-prompt-${Date.now()}`,
                message: 'Connect your Etsy shop to toggle off sample data and view live store analytics.'
              });
              return;
            }
            setIsSampleData(!isSampleData);
          }}
          isConnectedEtsy={isConnectedEtsy}
          onOpenConnectEtsy={() => setIsConnectEtsyOpen(true)}
          onOpenRegionalCalendar={() => setIsRegionalCalendarOpen(true)}
          onOpenPackingSheets={() => setIsPackingSheetsOpen(true)}
          onOpenWeeklyPlan={() => setIsWeeklyPlanOpen(true)}
          onOpenTour={() => setIsTourOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          openOrdersCount={orderSlips.filter(s => !s.isPacked).length}
        />

        {/* State A / State B Consistent Banner */}
        {!isConnectedEtsy ? (
          <div className="bg-[#FAF3EA] border-b border-[#E8DFC8] px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs text-[#5C5549] gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D97757] animate-pulse shrink-0" />
              <span>
                Showing sample data for <strong>{shopName}</strong>. Connect your Etsy shop to see your real numbers.
              </span>
            </div>
            <button
              id="connect-etsy-banner-btn"
              type="button"
              onClick={() => setIsConnectEtsyOpen(true)}
              className="px-2.5 py-1 bg-[#D97757] hover:bg-[#C26547] text-white font-semibold rounded-lg shrink-0 flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
            >
              <span>Connect Etsy</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        ) : isSampleData ? (
          <div className="bg-[#FAF3EA] border-b border-[#E8DFC8] px-4 sm:px-8 py-2 flex items-center justify-between text-xs text-[#5C5549] gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D97757] shrink-0" />
              <span>
                Showing sample demonstration data. Toggle off to view live store numbers for <strong>{shopName}</strong>.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsSampleData(false)}
              className="px-2.5 py-1 bg-[#5A7A5A] hover:bg-[#4A684A] text-white font-semibold rounded-lg shrink-0 flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
            >
              <span>Switch to Live Store</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="bg-[#EEF4EE] border-b border-[#D3E3D3] px-4 sm:px-8 py-2 flex items-center justify-between text-xs text-[#2E472E]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#5A7A5A] shrink-0" />
              <span>
                Live Etsy sync active for <strong>{shopName}</strong> · API Quota remaining: {etsySyncStatus.rateLimitRemaining} / 10,000
              </span>
            </div>
            <span className="text-[11px] text-[#5A7A5A] font-mono">
              Last sync: {etsySyncStatus.lastSyncedAt}
            </span>
          </div>
        )}

        {/* Page Views Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          
          {activeTab === 'overview' && (
            <OverviewView
              kpis={kpis}
              history={history}
              onNavigateToFunnel={navigateToFunnel}
              onNavigateToListings={() => {
                setListingsInitialFilter('flagged');
                setActiveTab('listings');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeTab === 'funnel' && (
            <FunnelView
              stages={funnelStages}
              onNavigateToListingsFlagged={navigateToListingsFlagged}
            />
          )}

          {activeTab === 'listings' && (
            <ListingsView
              listings={listings}
              onUpdateListing={handleUpdateListing}
              onBatchUpdateListings={handleBatchUpdateListings}
              initialFlagFilter={listingsInitialFilter}
            />
          )}

          {activeTab === 'search_terms' && (
            <SearchTermsView
              terms={searchTerms}
              onNavigateToListings={() => {
                setActiveTab('listings');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeTab === 'scheduler' && (
            <SeasonalSchedulerView
              rules={scheduledRules}
              listings={listings}
              onExecuteRule={handleExecuteScheduledRule}
              onCreateRule={handleCreateScheduledRule}
              onToggleRuleStatus={handleToggleRuleStatus}
              onDeleteRule={handleDeleteRule}
            />
          )}

          {activeTab === 'loyalty' && (
            <CustomerLoyaltyView
              metrics={loyaltyMetrics}
              customers={loyaltyCustomers}
              templates={careTemplates}
              onUpdateTemplate={handleUpdateCareTemplate}
              onSendReengagementNote={handleSendReengagementNote}
            />
          )}

          {activeTab === 'history' && (
            <HistoryView history={history} />
          )}

          {activeTab === 'alerts' && (
            <AlertsView
              alerts={alerts}
              onResolveAlert={handleResolveAlert}
              onNavigateToListing={navigateToSpecificListing}
            />
          )}

          {activeTab === 'goals' && (
            <GoalsView
              currentGrossRevenue={5201}
              currentNetRevenue={4412}
            />
          )}

          {activeTab === 'audit_log' && (
            <AuditLogView
              records={auditLog}
              onRevertEdit={handleRevertEdit}
            />
          )}
        </main>
      </div>

      {/* Floating Success Toast with 24hr Undo Button */}
      {toast && (
        <div 
          id="action-success-toast"
          className="fixed bottom-5 right-5 z-50 bg-[#1A1A1A] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-white/10 animate-slideUp text-xs sm:text-sm"
          role="alert"
        >
          <div className="w-6 h-6 rounded-full bg-[#5A7A5A] flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>

          <div className="space-y-0.5">
            <p className="font-semibold text-white">{toast.message}</p>
            {toast.editRecord && (
              <p className="text-[11px] text-[#A8A29E]">
                Rollback window active (24h)
              </p>
            )}
          </div>

          {toast.editRecord && (
            <button
              type="button"
              onClick={() => handleRevertEdit(toast.editRecord!.id)}
              className="ml-2 px-2.5 py-1 bg-[#FAF7F2]/10 hover:bg-[#FAF7F2]/20 text-[#FAF7F2] rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Undo</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setToast(null)}
            className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Dismiss toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Guided Comprehensive Product Tour */}
      <GuidedTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        activeTab={activeTab}
        onSwitchTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenConnectEtsy={() => setIsConnectEtsyOpen(true)}
        onOpenRegionalCalendar={() => setIsRegionalCalendarOpen(true)}
        onOpenPackingSheets={() => setIsPackingSheetsOpen(true)}
        onOpenWeeklyPlan={() => setIsWeeklyPlanOpen(true)}
      />

      {/* Settings Modal (including Carrier Cutoff configuration & Tour re-trigger) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        shopName={shopName}
        carrierCutoffTime={carrierCutoffTime}
        onUpdateCarrierCutoff={(cutoff) => {
          setCarrierCutoffTime(cutoff);
          setToast({
            id: `cutoff-${Date.now()}`,
            message: cutoff ? `Carrier cutoff updated to ${cutoff}` : 'Carrier cutoff cleared (fallback active).'
          });
        }}
        onLaunchTour={() => setIsTourOpen(true)}
        isConnectedEtsy={isConnectedEtsy}
        onOpenConnectEtsy={() => setIsConnectEtsyOpen(true)}
        onDisconnectEtsy={handleDisconnectEtsy}
      />

      {/* Help & Methodology Transparency Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Platform Waitlist Modal */}
      <WaitlistModal
        platform={waitlistPlatform}
        onClose={() => setWaitlistPlatform(null)}
      />

      {/* Connect Etsy Modal (Live Open API v3 & Webhooks) */}
      <ConnectEtsyModal
        isOpen={isConnectEtsyOpen}
        onClose={() => setIsConnectEtsyOpen(false)}
        isConnected={isConnectedEtsy}
        syncStatus={etsySyncStatus}
        onTriggerSync={handleTriggerEtsySync}
        onSimulateWebhook={handleSimulateEtsyWebhook}
        onDisconnect={handleDisconnectEtsy}
        onConnectSuccess={(name) => {
          setShopName(name);
          setIsConnectedEtsy(true);
          setIsSampleData(false);
          setEtsySyncStatus(prev => ({
            ...prev,
            connected: true,
            shopName: name,
            lastSyncedAt: 'Just now (OAuth 2.0 PKCE)'
          }));
          setToast({
            id: `connect-${Date.now()}`,
            message: `Connected ${name} via Etsy OAuth 2.0 PKCE!`,
          });
        }}
      />

      {/* Printable Artisan Production & Packing Sheets Modal */}
      <PackingSheetsModal
        isOpen={isPackingSheetsOpen}
        onClose={() => setIsPackingSheetsOpen(false)}
        orderSlips={orderSlips}
        materialItems={materialItems}
        onToggleChecklistItem={handleToggleChecklistItem}
        onMarkPacked={handleMarkOrderPacked}
        carrierCutoffTime={carrierCutoffTime}
        onOpenSettings={() => {
          setIsPackingSheetsOpen(false);
          setIsSettingsOpen(true);
        }}
      />

      {/* Weekly Action Plan Modal */}
      <WeeklyActionPlanModal
        isOpen={isWeeklyPlanOpen}
        onClose={() => setIsWeeklyPlanOpen(false)}
        listings={listings}
        shopName={shopName}
        onNavigateToListing={navigateToSpecificListing}
      />

      {/* Regional Holiday & Shipping Cutoff Calendar Modal */}
      <RegionalCalendarModal
        isOpen={isRegionalCalendarOpen}
        onClose={() => setIsRegionalCalendarOpen(false)}
        currentRegion={currentRegion}
        onSelectRegion={(reg) => {
          setCurrentRegion(reg);
          setToast({
            id: `region-${Date.now()}`,
            message: `Target shipping & seasonal calendar switched to ${reg}`,
          });
        }}
      />
    </div>
  );
}
