import React, { useState } from 'react';
import { ScheduledTagRule, ListingItem, ListingEditRecord } from '../types';
import { 
  CalendarClock, 
  Sparkles, 
  Play, 
  Pause, 
  Plus, 
  Check, 
  Clock, 
  ArrowRight, 
  RotateCcw, 
  Trash2, 
  Edit3, 
  AlertCircle, 
  ShieldCheck, 
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';

interface SeasonalSchedulerViewProps {
  rules: ScheduledTagRule[];
  listings: ListingItem[];
  onExecuteRule: (ruleId: string) => void;
  onCreateRule: (newRule: ScheduledTagRule) => void;
  onToggleRuleStatus: (ruleId: string) => void;
  onDeleteRule: (ruleId: string) => void;
}

export const SeasonalSchedulerView: React.FC<SeasonalSchedulerViewProps> = ({
  rules,
  listings,
  onExecuteRule,
  onCreateRule,
  onToggleRuleStatus,
  onDeleteRule,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [executingRuleId, setExecutingRuleId] = useState<string | null>(null);
  const [ruleSearch, setRuleSearch] = useState('');

  // Form states
  const [formName, setFormName] = useState('');
  const [formHoliday, setFormHoliday] = useState('Christmas & Winter Holiday Gifting');
  const [formDate, setFormDate] = useState('2026-11-01');
  const [formTagsToRemove, setFormTagsToRemove] = useState('autumn decor, fall table, halloween gift');
  const [formTagsToAdd, setFormTagsToAdd] = useState('christmas gift 2026, cozy holiday gift, artisan stocking stuffer, gifts for her');
  const [formTitlePrefix, setFormTitlePrefix] = useState('Holiday Gift - ');
  const [formDescription, setFormDescription] = useState('');
  const [formTargetAll, setFormTargetAll] = useState(true);

  const handleExecute = (rule: ScheduledTagRule) => {
    setExecutingRuleId(rule.id);
    setTimeout(() => {
      onExecuteRule(rule.id);
      setExecutingRuleId(null);
    }, 1200);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const tagsToRemove = formTagsToRemove
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    const tagsToAdd = formTagsToAdd
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    const newRule: ScheduledTagRule = {
      id: `rule-${Date.now()}`,
      name: formName.trim(),
      targetHoliday: formHoliday,
      scheduledDate: formDate,
      status: 'scheduled',
      targetListingIds: formTargetAll ? ['all'] : listings.slice(0, 3).map(l => l.id),
      tagsToRemove,
      tagsToAdd,
      titlePrefix: formTitlePrefix.trim() || undefined,
      affectedListingsCount: formTargetAll ? listings.length : 3,
      description: formDescription.trim() || `Automated tag shift for ${formHoliday} executing on ${formDate}.`
    };

    onCreateRule(newRule);
    setIsCreateModalOpen(false);

    // Reset
    setFormName('');
    setFormDescription('');
  };

  const filteredRules = rules.filter(r => 
    r.name.toLowerCase().includes(ruleSearch.toLowerCase()) ||
    r.targetHoliday.toLowerCase().includes(ruleSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-[#E2D8C9] p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#D97757]/15 text-[#D97757]">
              <CalendarClock className="w-5 h-5" />
            </span>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
              Automated Seasonal Tag Scheduler
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#665D4F] max-w-2xl leading-relaxed">
            Eliminate manual tag editing before holiday peaks. Schedule automated tag and title shifts ahead of seasonal search trends, sunset decaying keywords, and rollback any shift within 24 hours.
          </p>
        </div>

        <button
          id="create-schedule-rule-btn"
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 bg-[#D97757] hover:bg-[#C26547] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Scheduled Shift</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-[#E2D8C9] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A7163]">
            Active Scheduled Shifts
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-editorial text-2xl font-bold text-[#1A1A1A]">
              {rules.filter(r => r.status === 'scheduled' || r.status === 'active').length}
            </span>
            <span className="text-xs text-[#5A7A5A] font-semibold">Rules Ready</span>
          </div>
          <p className="text-[11px] text-[#8C8375]">Monitored against Etsy seasonal curve</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E2D8C9] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A7163]">
            Next Upcoming Shift
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-editorial text-xl font-bold text-[#D97757]">
              Nov 01, 2026
            </span>
            <span className="text-[11px] bg-[#D97757]/15 text-[#D97757] font-semibold px-2 py-0.5 rounded">
              Holiday Rush
            </span>
          </div>
          <p className="text-[11px] text-[#8C8375]">Automated 8 listings update</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E2D8C9] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A7163]">
            Protected Listings
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-editorial text-2xl font-bold text-[#1A1A1A]">
              {listings.length}
            </span>
            <span className="text-xs text-[#5A7A5A] font-semibold">100% Coverage</span>
          </div>
          <p className="text-[11px] text-[#8C8375]">All active inventory covered</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E2D8C9] shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A7163]">
            Rollback Safety Window
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-editorial text-2xl font-bold text-[#5A7A5A]">
              24 Hours
            </span>
            <span className="text-xs text-[#5A7A5A] font-semibold">Guaranteed</span>
          </div>
          <p className="text-[11px] text-[#8C8375]">Every execution logs pre-edit snapshot</p>
        </div>
      </div>

      {/* Scheduled Rules Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="font-editorial text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
            <span>Seasonal Tag Rules & Transition Pipeline</span>
            <span className="text-xs font-mono font-medium text-[#7A7163] bg-[#EFE9DF] px-2 py-0.5 rounded-full">
              {filteredRules.length} rules
            </span>
          </h2>

          <input
            type="text"
            value={ruleSearch}
            onChange={(e) => setRuleSearch(e.target.value)}
            placeholder="Search holiday rules..."
            className="px-3.5 py-1.5 bg-white rounded-lg border border-[#E2D8C9] text-xs focus:outline-hidden focus:border-[#D97757] text-[#1A1A1A] w-full sm:w-64"
          />
        </div>

        {/* Rules Grid */}
        <div className="space-y-4">
          {filteredRules.map((rule) => {
            const isExecuting = executingRuleId === rule.id;
            const isExecuted = rule.status === 'executed';
            const isPaused = rule.status === 'paused';

            return (
              <div 
                key={rule.id}
                className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-xs transition-all space-y-4 ${
                  isExecuted 
                    ? 'border-[#5A7A5A]/50 bg-[#FBFDFB]' 
                    : isPaused 
                    ? 'border-[#E2D8C9] opacity-75' 
                    : 'border-[#E2D8C9] hover:border-[#D97757]/60'
                }`}
              >
                {/* Rule Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0EAE1]">
                  <div className="space-y-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <h3 className="font-editorial text-lg font-bold text-[#1A1A1A]">
                        {rule.name}
                      </h3>

                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        rule.status === 'executed'
                          ? 'bg-[#5A7A5A]/15 text-[#2E472E]'
                          : rule.status === 'paused'
                          ? 'bg-[#8C8375]/15 text-[#5C5549]'
                          : 'bg-[#D97757]/15 text-[#C26547]'
                      }`}>
                        {rule.status === 'executed' ? '✓ Executed & Live' : rule.status === 'paused' ? 'Paused' : 'Scheduled'}
                      </span>

                      <span className="text-[11px] font-medium text-[#7A7163] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8E1D7]">
                        {rule.targetHoliday}
                      </span>
                    </div>

                    <p className="text-xs text-[#665D4F]">
                      {rule.description}
                    </p>
                  </div>

                  {/* Top Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onToggleRuleStatus(rule.id)}
                      className="p-2 text-[#7A7163] hover:text-[#1A1A1A] hover:bg-[#FAF7F2] rounded-lg border border-[#E2D8C9] transition-colors cursor-pointer"
                      title={rule.status === 'paused' ? 'Resume scheduled shift' : 'Pause scheduled shift'}
                    >
                      {rule.status === 'paused' ? <Play className="w-4 h-4 text-[#5A7A5A]" /> : <Pause className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      disabled={isExecuting}
                      onClick={() => handleExecute(rule)}
                      className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50 ${
                        isExecuted
                          ? 'bg-[#FAF7F2] border border-[#5A7A5A] text-[#2E472E] hover:bg-[#EAF2EA]'
                          : 'bg-[#D97757] hover:bg-[#C26547] text-white'
                      }`}
                    >
                      {isExecuting ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                          <span>Applying to Listings...</span>
                        </>
                      ) : isExecuted ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Re-Run Transition</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>Execute Shift Now</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteRule(rule.id)}
                      className="p-2 text-[#8C8375] hover:text-[#B85C4A] hover:bg-[#FAF7F2] rounded-lg transition-colors cursor-pointer"
                      title="Delete rule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Tag Shift Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  
                  {/* Left: Tags to Remove (Sunset) */}
                  <div className="md:col-span-5 p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E2D8C9] space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#B85C4A] flex items-center gap-1.5">
                      <span>1. Tags to Sunset (Remove)</span>
                      <span className="text-[10px] font-mono bg-[#B85C4A]/10 px-1.5 py-0.2 rounded font-semibold">
                        {rule.tagsToRemove.length} tags
                      </span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {rule.tagsToRemove.map((tag, idx) => (
                        <span 
                          key={idx}
                          className="text-[11px] font-mono px-2 py-0.5 bg-white text-[#B85C4A] rounded border border-[#E8D0CC] line-through opacity-80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Center Arrow */}
                  <div className="md:col-span-2 flex justify-center py-1 md:py-0">
                    <div className="w-8 h-8 rounded-full bg-[#EFE9DF] text-[#7A7163] flex items-center justify-center">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Right: Target Seasonal Tags to Inject */}
                  <div className="md:col-span-5 p-3.5 bg-[#F4F8F4] rounded-xl border border-[#D0E2D0] space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#355235] flex items-center gap-1.5">
                      <span>2. Seasonal Tags to Inject</span>
                      <span className="text-[10px] font-mono bg-[#5A7A5A]/15 px-1.5 py-0.2 rounded font-semibold">
                        +{rule.tagsToAdd.length} tags
                      </span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {rule.tagsToAdd.map((tag, idx) => (
                        <span 
                          key={idx}
                          className="text-[11px] font-mono px-2 py-0.5 bg-white text-[#2E472E] rounded border border-[#C5DDC5] font-medium"
                        >
                          +{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Rule Execution Meta Footer */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#7A7163] gap-2">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#D97757]" />
                      <span>Scheduled: <strong>{rule.scheduledDate}</strong></span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#5A7A5A]" />
                      <span>Targeting: <strong>{rule.affectedListingsCount} shop listings</strong></span>
                    </span>
                    {rule.titlePrefix && (
                      <span className="font-mono text-[11px] bg-[#EFE9DF] px-2 py-0.5 rounded text-[#4A4235]">
                        Title prefix: "{rule.titlePrefix}"
                      </span>
                    )}
                  </div>

                  {rule.lastExecuted && (
                    <span className="text-[11px] text-[#5A7A5A] font-medium">
                      Last executed on {rule.lastExecuted} (Logged in Audit Log)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Rule Modal */}
      {isCreateModalOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#FAF7F2] rounded-2xl border border-[#D97757]/30 shadow-2xl w-full max-w-2xl p-6 space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D7]">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-[#D97757]/15 text-[#D97757]">
                  <CalendarClock className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-editorial text-xl font-bold text-[#1A1A1A]">
                    Schedule Seasonal Tag Shift
                  </h3>
                  <span className="text-xs text-[#7A7163]">
                    Automates tag and title updates before buyer search volume shifts
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[#7A7163] hover:text-[#1A1A1A] p-1.5 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRule} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#4A4235] uppercase tracking-wider block">
                  Rule Name
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Christmas & Holiday Gift Surge Kickoff"
                  className="w-full px-3.5 py-2 bg-white rounded-lg border border-[#E2D8C9] text-xs sm:text-sm focus:outline-hidden focus:border-[#D97757]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#4A4235] uppercase tracking-wider block">
                    Target Holiday / Season
                  </label>
                  <select
                    value={formHoliday}
                    onChange={(e) => setFormHoliday(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2D8C9] text-xs sm:text-sm focus:outline-hidden focus:border-[#D97757]"
                  >
                    <option value="Christmas & Winter Holiday Gifting">Christmas & Winter Holiday Gifting</option>
                    <option value="Cyber Week & Black Friday">Cyber Week & Black Friday</option>
                    <option value="Valentine's Romantic Push">Valentine's Romantic Push</option>
                    <option value="Mother's Day Artisan Gifts">Mother's Day Artisan Gifts</option>
                    <option value="Spring Garden & Home Refresh">Spring Garden & Home Refresh</option>
                    <option value="New Year & Mindful Living Reset">New Year & Mindful Living Reset</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#4A4235] uppercase tracking-wider block">
                    Execution Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2D8C9] text-xs sm:text-sm focus:outline-hidden focus:border-[#D97757]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#B85C4A] uppercase tracking-wider block">
                  Tags to Sunset (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formTagsToRemove}
                  onChange={(e) => setFormTagsToRemove(e.target.value)}
                  placeholder="e.g. autumn decor, fall centerpiece, halloween gift"
                  className="w-full px-3.5 py-2 bg-white rounded-lg border border-[#E2D8C9] text-xs sm:text-sm focus:outline-hidden focus:border-[#D97757]"
                />
                <span className="text-[11px] text-[#7A7163] block">
                  These keywords will be cleanly excised from targeted listing tags.
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#355235] uppercase tracking-wider block">
                  Seasonal Tags to Inject (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formTagsToAdd}
                  onChange={(e) => setFormTagsToAdd(e.target.value)}
                  placeholder="e.g. christmas gift 2026, holiday artisan gift, cozy winter gift, stocking stuffer"
                  className="w-full px-3.5 py-2 bg-white rounded-lg border border-[#E2D8C9] text-xs sm:text-sm focus:outline-hidden focus:border-[#D97757]"
                />
                <span className="text-[11px] text-[#7A7163] block">
                  Up to 13 total tags will be preserved adhering to Etsy's 20-character tag limit.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#4A4235] uppercase tracking-wider block">
                    Optional Title Prefix
                  </label>
                  <input
                    type="text"
                    value={formTitlePrefix}
                    onChange={(e) => setFormTitlePrefix(e.target.value)}
                    placeholder="e.g. Holiday Gift - "
                    className="w-full px-3 py-2 bg-white rounded-lg border border-[#E2D8C9] text-xs focus:outline-hidden focus:border-[#D97757]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#4A4235] uppercase tracking-wider block">
                    Target Listings
                  </label>
                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 text-xs text-[#1A1A1A] cursor-pointer">
                      <input
                        type="radio"
                        checked={formTargetAll}
                        onChange={() => setFormTargetAll(true)}
                        className="text-[#D97757]"
                      />
                      <span>All {listings.length} Active Listings</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[#1A1A1A] cursor-pointer">
                      <input
                        type="radio"
                        checked={!formTargetAll}
                        onChange={() => setFormTargetAll(false)}
                        className="text-[#D97757]"
                      />
                      <span>Flagged Listings Only</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#EAF2EA] border border-[#5A7A5A]/30 rounded-xl text-xs text-[#2E472E] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#5A7A5A]" />
                <span>
                  <strong>24-Hour Rollback Safety:</strong> Once this shift executes, a full snapshot of your previous titles and tags is saved to the Audit Log, allowing instant one-click rollback if needed.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#7A7163] hover:text-[#1A1A1A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#D97757] hover:bg-[#C26547] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Schedule Shift Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
