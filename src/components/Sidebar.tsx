import React from 'react';
import { ActiveTab } from '../types';
import { 
  Sparkles, 
  LayoutDashboard, 
  Filter, 
  Tag, 
  Search, 
  Calendar, 
  Clock, 
  Heart, 
  Bell, 
  Target, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  HelpCircle, 
  LogOut,
  Sparkle
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  alertsCount: number;
  recentEditsCount: number;
  isConnectedEtsy: boolean;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onSignOut: () => void;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  requiresEtsy?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  alertsCount,
  recentEditsCount,
  isConnectedEtsy,
  onOpenSettings,
  onOpenHelp,
  onSignOut,
}) => {
  const sections: NavSection[] = [
    {
      title: 'Analytics',
      items: [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4 shrink-0" /> },
        { id: 'funnel', label: 'Funnel diagnosis', icon: <Filter className="w-4 h-4 shrink-0" /> },
        { id: 'listings', label: 'Listings', icon: <Tag className="w-4 h-4 shrink-0" /> },
        { id: 'search_terms', label: 'Search terms', icon: <Search className="w-4 h-4 shrink-0" /> },
        { id: 'history', label: 'History', icon: <Calendar className="w-4 h-4 shrink-0" /> },
      ],
    },
    {
      title: 'Operations',
      items: [
        { id: 'scheduler', label: 'Tag scheduler', icon: <Clock className="w-4 h-4 shrink-0" /> },
        { id: 'loyalty', label: 'Customer loyalty', icon: <Heart className="w-4 h-4 shrink-0" /> },
        { 
          id: 'alerts', 
          label: 'Alerts', 
          icon: <Bell className="w-4 h-4 shrink-0" />, 
          badge: alertsCount,
          requiresEtsy: true 
        },
      ],
    },
    {
      title: 'Planning',
      items: [
        { 
          id: 'goals', 
          label: 'Goals', 
          icon: <Target className="w-4 h-4 shrink-0" />,
          requiresEtsy: true 
        },
        { 
          id: 'audit_log', 
          label: 'Audit Log & Undo', 
          icon: <ShieldCheck className="w-4 h-4 shrink-0" />, 
          badge: recentEditsCount,
          requiresEtsy: true 
        },
      ],
    },
    {
      title: 'Resources',
      items: [
        { 
          id: 'help_docs', 
          label: 'Help & Docs', 
          icon: <HelpCircle className="w-4 h-4 shrink-0" /> 
        },
      ],
    },
  ];

  return (
    <aside 
      className={`bg-[#FAF7F2] border-r border-[#E8E1D7] flex flex-col justify-between transition-all duration-300 select-none z-30 shrink-0 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top section: Brand header */}
      <div className="flex flex-col">
        <div className="h-16 flex items-center justify-between px-3.5 border-b border-[#E8E1D7]/70">
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-[#D97757] text-[#FAF7F2] flex items-center justify-center shadow-xs shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-editorial text-xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
                    SeasonalStat
                  </span>
                  <span className="text-[10px] text-[#7A7163] font-medium tracking-wide">
                    Etsy Intelligence
                  </span>
                </div>
              </div>

              <button
                id="sidebar-collapse-btn-header"
                type="button"
                onClick={onToggleCollapse}
                className="p-1.5 rounded-lg border border-[#E8E1D7] bg-white hover:bg-[#FAF7F2] text-[#5C5549] hover:text-[#1A1A1A] transition-colors shadow-2xs cursor-pointer flex items-center justify-center shrink-0"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-full flex flex-col items-center gap-1.5 py-1">
              <div className="w-8 h-8 rounded-lg bg-[#D97757] text-[#FAF7F2] flex items-center justify-center shadow-xs" title="SeasonalStat">
                <Sparkles className="w-4 h-4" />
              </div>
              <button
                id="sidebar-expand-btn-header"
                type="button"
                onClick={onToggleCollapse}
                className="p-1 rounded-md border border-[#E8E1D7] bg-white hover:bg-[#FAF7F2] text-[#5C5549] hover:text-[#1A1A1A] transition-colors shadow-2xs cursor-pointer"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-14rem)]">
          {sections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8C8375]">
                  {sec.title}
                </div>
              )}

              {sec.items.map((item) => {
                const isActive = activeTab === item.id;
                const needsSetUp = item.requiresEtsy && !isConnectedEtsy;

                return (
                  <button
                    key={item.id}
                    id={`nav-tab-${item.id}`}
                    type="button"
                    onClick={() => onTabChange(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer relative group ${
                      isActive
                        ? 'bg-[#1A1A1A] text-white shadow-xs'
                        : 'text-[#5C5549] hover:bg-[#EFE9DF] hover:text-[#1A1A1A]'
                    }`}
                  >
                    <span className={isActive ? 'text-[#FAF7F2]' : 'text-[#7A7163] group-hover:text-[#1A1A1A]'}>
                      {item.icon}
                    </span>

                    {!isCollapsed && (
                      <span className="flex-1 text-left truncate">
                        {item.label}
                      </span>
                    )}

                    {/* Badge or Progressive disclosure 'Set up' dot */}
                    {!isCollapsed && (
                      <div className="flex items-center gap-1.5 ml-auto">
                        {isConnectedEtsy ? (
                          typeof item.badge === 'number' && item.badge > 0 ? (
                            <span 
                              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-2xs ${
                                item.id === 'alerts'
                                  ? 'bg-[#B85C4A] text-white'
                                  : 'bg-[#5A7A5A] text-white'
                              }`}
                              title={`${item.badge} active item${item.badge === 1 ? '' : 's'}`}
                            >
                              {item.badge}
                            </span>
                          ) : null
                        ) : (
                          needsSetUp && (
                            <span 
                              className="flex items-center gap-1 text-[10px] font-medium text-[#B85C4A] bg-[#B85C4A]/10 px-1.5 py-0.5 rounded-full"
                              title="Subtle Set Up dot: Connect Etsy to enable live trigger alerts"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#B85C4A]" />
                              <span>Set up</span>
                            </span>
                          )
                        )}
                      </div>
                    )}

                    {/* Dot indicator when collapsed */}
                    {isCollapsed && (
                      isConnectedEtsy && typeof item.badge === 'number' && item.badge > 0 ? (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B85C4A]" title={`${item.badge} alerts`} />
                      ) : needsSetUp ? (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B85C4A]/70" title="Set up required" />
                      ) : null
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="border-t border-[#E8E1D7] p-3 space-y-2 bg-[#F6F1E8]/60">
        {/* Subscription Tier & Usage */}
        {!isCollapsed ? (
          <div className="px-3 py-2 rounded-xl bg-white/70 border border-[#E8E1D7] text-xs">
            <div className="flex items-center justify-between text-[#1A1A1A] font-semibold">
              <span className="flex items-center gap-1.5 text-xs">
                <Sparkle className="w-3.5 h-3.5 text-[#D97757]" />
                Pro Tier
              </span>
              <span className="text-[11px] text-[#7A7163] font-mono">1 of 3 shops</span>
            </div>
            <div className="w-full bg-[#E8E1D7] h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-[#5A7A5A] h-full rounded-full w-1/3" />
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 mx-auto rounded-lg bg-white/80 border border-[#E8E1D7] flex items-center justify-center text-[#D97757]" title="Pro Tier (1 of 3 shops)">
            <Sparkle className="w-3.5 h-3.5" />
          </div>
        )}

        {/* Footer Quick Action Links */}
        <div className="space-y-0.5">
          <button
            type="button"
            onClick={onOpenSettings}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#5C5549] hover:bg-[#EFE9DF] hover:text-[#1A1A1A] transition-colors cursor-pointer ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title="Settings"
          >
            <Settings className="w-4 h-4 shrink-0 text-[#7A7163]" />
            {!isCollapsed && <span>Settings</span>}
          </button>

          <button
            type="button"
            onClick={() => onTabChange('help_docs')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'help_docs'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'text-[#5C5549] hover:bg-[#EFE9DF] hover:text-[#1A1A1A]'
            } ${isCollapsed ? 'justify-center' : ''}`}
            title="Help & Docs"
          >
            <HelpCircle className={`w-4 h-4 shrink-0 ${activeTab === 'help_docs' ? 'text-[#D97757]' : 'text-[#7A7163]'}`} />
            {!isCollapsed && <span>Help & Docs</span>}
          </button>

          <button
            type="button"
            onClick={onSignOut}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#B85C4A] hover:bg-[#B85C4A]/10 transition-colors cursor-pointer ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title="Sign out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Sign out</span>}
          </button>
        </div>

        {/* Dedicated collapse/expand button row in footer */}
        <button
          id="sidebar-collapse-btn-footer"
          type="button"
          onClick={onToggleCollapse}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2 rounded-xl text-xs font-semibold text-[#5C5549] hover:text-[#1A1A1A] hover:bg-[#EFE9DF] border border-[#E2D8C9] bg-white/70 shadow-2xs transition-colors cursor-pointer`}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {!isCollapsed && <span>Collapse sidebar</span>}
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-[#1A1A1A]" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-[#7A7163]" />
          )}
        </button>
      </div>
    </aside>
  );
};
