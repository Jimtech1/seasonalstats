import React, { useState } from 'react';
import { ArtisanOrderBatchSlip, MaterialReplenishmentItem } from '../types';
import { 
  Printer, 
  Package, 
  Clock, 
  AlertCircle, 
  CheckSquare, 
  Square, 
  MapPin, 
  Calendar, 
  FileText, 
  Boxes, 
  DollarSign, 
  Truck, 
  X,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface PackingSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderSlips: ArtisanOrderBatchSlip[];
  materialItems: MaterialReplenishmentItem[];
  onToggleChecklistItem: (orderId: string, checklistId: string) => void;
  onMarkPacked: (orderId: string) => void;
  carrierCutoffTime?: string;
  onOpenSettings?: () => void;
}

export const PackingSheetsModal: React.FC<PackingSheetsModalProps> = ({
  isOpen,
  onClose,
  orderSlips,
  materialItems,
  onToggleChecklistItem,
  onMarkPacked,
  carrierCutoffTime = '5:00 PM EST',
  onOpenSettings,
}) => {
  const [activeSheetTab, setActiveSheetTab] = useState<'slips' | 'materials'>('slips');
  const [carrierFilter, setCarrierFilter] = useState<string>('all');

  if (!isOpen) return null;

  const filteredSlips = orderSlips.filter(slip => {
    if (carrierFilter === 'all') return true;
    return slip.shippingMethod.toLowerCase().includes(carrierFilter.toLowerCase());
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#FAF7F2] rounded-2xl border border-[#E2D8C9] shadow-2xl w-full max-w-5xl my-4 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:border-none print:shadow-none print:rounded-none print:bg-white">
        
        {/* Modal Header (Hidden on Print) */}
        <div className="p-4 sm:p-6 bg-white border-b border-[#E8E1D7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5A7A5A]/15 text-[#5A7A5A] flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-editorial text-2xl font-bold text-[#1A1A1A]">
                Printable Artisan Production & Packing Sheets
              </h2>
              <p className="text-xs text-[#665D4F]">
                Batch slips and material replenishment sheets sorted by regional postal shipping cutoff deadlines.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              id="print-packing-sheet-btn"
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#333333] text-[#FAF7F2] text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Workshop Sheets</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#7A7163] hover:text-[#1A1A1A] rounded-xl hover:bg-[#FAF7F2] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Switcher & Filters (Hidden on Print) */}
        <div className="px-6 py-3 bg-[#FAF7F2] border-b border-[#E8E1D7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSheetTab('slips')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSheetTab === 'slips'
                  ? 'bg-white text-[#1A1A1A] shadow-xs border border-[#E2D8C9]'
                  : 'text-[#7A7163] hover:text-[#1A1A1A]'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-[#D97757]" />
              <span>Order Packing Slips ({orderSlips.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSheetTab('materials')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSheetTab === 'materials'
                  ? 'bg-white text-[#1A1A1A] shadow-xs border border-[#E2D8C9]'
                  : 'text-[#7A7163] hover:text-[#1A1A1A]'
              }`}
            >
              <Boxes className="w-3.5 h-3.5 text-[#5A7A5A]" />
              <span>Material Replenishment Sheet</span>
            </button>
          </div>

          {activeSheetTab === 'slips' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#7A7163] font-medium">Filter Carrier:</span>
              <select
                value={carrierFilter}
                onChange={(e) => setCarrierFilter(e.target.value)}
                className="px-2.5 py-1 bg-white border border-[#E2D8C9] rounded-lg text-xs font-medium text-[#1A1A1A]"
              >
                <option value="all">All Carriers</option>
                <option value="usps">USPS (Domestic)</option>
                <option value="royal">Royal Mail (UK)</option>
                <option value="dhl">DHL Express (Intl)</option>
              </select>
            </div>
          )}
        </div>

        {/* Scrollable Printable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 print:p-0 print:overflow-visible">
          
          {/* Fallback alert if carrier cutoff not configured in seller settings */}
          {!carrierCutoffTime && (
            <div className="p-3.5 bg-[#FAF3EA] border border-[#D97757]/40 rounded-xl flex items-center justify-between text-xs print:hidden">
              <div className="flex items-center gap-2 text-[#4D4539]">
                <AlertCircle className="w-4 h-4 text-[#D97757] shrink-0" />
                <span>
                  <strong>Carrier cutoff not configured in seller settings:</strong> Orders are sorted by default receipt date. Configure your dispatch cutoff in Settings to calculate hourly shipping countdowns.
                </span>
              </div>
              {onOpenSettings && (
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="text-xs font-semibold text-[#D97757] hover:underline shrink-0 ml-3 cursor-pointer"
                >
                  Configure in Settings
                </button>
              )}
            </div>
          )}

          {/* Printable Sheet Title (Only visible in Print) */}
          <div className="hidden print:block pb-4 border-b border-black mb-6">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-serif font-bold text-black">The Woodland Artisan Studio</h1>
                <p className="text-sm text-gray-700">Daily Workshop Batch Slip & Packing Verification</p>
              </div>
              <div className="text-right text-xs text-gray-600">
                <p>Printed: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                <p>Regional Shipping Cutoff Batch</p>
              </div>
            </div>
          </div>

          {activeSheetTab === 'slips' ? (
            <div className="space-y-6">
              {filteredSlips.map((slip) => {
                const completedItemsCount = slip.packagingChecklist.filter(c => c.completed).length;
                const allChecklistCompleted = completedItemsCount === slip.packagingChecklist.length;

                return (
                  <div 
                    key={slip.orderId}
                    className="bg-white rounded-2xl border border-[#E2D8C9] p-5 sm:p-6 shadow-xs space-y-4 print:border-black print:rounded-none print:shadow-none print:break-inside-avoid print:mb-8"
                  >
                    {/* Order Slip Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0EAE1] print:border-gray-400">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm font-bold text-[#1A1A1A] print:text-black">
                            {slip.orderId}
                          </span>
                          <span className="font-editorial text-lg font-bold text-[#1A1A1A]">
                            {slip.customerName}
                          </span>
                          <span className="text-xs text-[#7A7163] flex items-center gap-1 bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8E1D7]">
                            <MapPin className="w-3 h-3 text-[#D97757]" />
                            <span>{slip.destinationCity}, {slip.destinationCountry}</span>
                          </span>
                        </div>
                        <span className="text-xs text-[#8C8375] block mt-0.5">
                          Order received: {slip.orderDate}
                        </span>
                      </div>

                      {/* Cutoff and carrier badge */}
                      <div className="flex items-center gap-3">
                        <div className="text-left sm:text-right">
                          {carrierCutoffTime ? (
                            <>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B85C4A] block flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>Carrier Cutoff: {carrierCutoffTime}</span>
                              </span>
                              <span className="text-xs font-semibold text-[#1A1A1A] block">
                                {slip.shippingMethod} ({slip.carrierCutoffHoursLeft}h window)
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-[10px] font-bold text-[#8C8375] block flex items-center gap-1">
                                <Clock className="w-3 h-3 text-[#8C8375]" />
                                <span>Cutoff not configured</span>
                              </span>
                              <span className="text-xs text-[#665D4F] block">
                                {slip.shippingMethod} (Standard dispatch)
                              </span>
                            </>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => onMarkPacked(slip.orderId)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-xs cursor-pointer print:hidden ${
                            slip.isPacked
                              ? 'bg-[#5A7A5A] text-white'
                              : allChecklistCompleted
                              ? 'bg-[#D97757] hover:bg-[#C26547] text-white animate-pulse'
                              : 'bg-[#FAF7F2] text-[#7A7163] border border-[#E2D8C9]'
                          }`}
                        >
                          <CheckSquare className="w-3.5 h-3.5" />
                          <span>{slip.isPacked ? 'Packed' : 'Mark Packed'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#4A4235] block">
                        Artisan Items to Pack ({slip.items.reduce((sum, i) => sum + i.quantity, 0)} total units)
                      </span>

                      <div className="border border-[#E2D8C9] rounded-xl overflow-hidden print:border-black">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-[#FAF7F2] text-[#665D4F] border-b border-[#E2D8C9] print:bg-gray-100 print:text-black">
                              <th className="py-2 px-3 font-semibold w-12 text-center">Qty</th>
                              <th className="py-2 px-3 font-semibold">Artisan Listing & Materials</th>
                              <th className="py-2 px-3 font-semibold">Selected Variation</th>
                              <th className="py-2 px-3 font-semibold">Customization / Note</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E2D8C9] print:divide-gray-300">
                            {slip.items.map((item, idx) => (
                              <tr key={idx} className="hover:bg-[#FAF7F2]/50">
                                <td className="py-2.5 px-3 font-bold text-center font-mono text-sm text-[#1A1A1A]">
                                  {item.quantity}x
                                </td>
                                <td className="py-2.5 px-3">
                                  <div className="font-semibold text-[#1A1A1A]">{item.title}</div>
                                  <div className="text-[11px] text-[#7A7163]">{item.materials}</div>
                                </td>
                                <td className="py-2.5 px-3 font-mono text-[11px] text-[#4A4235]">
                                  {item.variation || 'Standard Studio Craft'}
                                </td>
                                <td className="py-2.5 px-3">
                                  {item.personalizationNote ? (
                                    <div className="p-1.5 bg-[#FFF9F6] border border-[#F0D5CA] rounded text-[11px] text-[#8C4328] font-medium print:border-gray-400 print:text-black">
                                      {item.personalizationNote}
                                    </div>
                                  ) : (
                                    <span className="text-[11px] text-[#8C8375] italic">None</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Packaging Quality & Protection Checklist */}
                    <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E2D8C9] space-y-2 print:bg-white print:border-black">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#2E472E] flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#5A7A5A]" />
                          <span>Artisan Studio Quality & Packaging Protocol</span>
                        </span>
                        <span className="text-xs text-[#7A7163] font-mono print:text-black">
                          {completedItemsCount}/{slip.packagingChecklist.length} Verified
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {slip.packagingChecklist.map((check) => (
                          <div 
                            key={check.id}
                            onClick={() => onToggleChecklistItem(slip.orderId, check.id)}
                            className="flex items-start gap-2 text-xs text-[#1A1A1A] cursor-pointer select-none p-1.5 rounded hover:bg-white/80 transition-colors"
                          >
                            <span className="mt-0.5 text-[#5A7A5A] shrink-0">
                              {check.completed ? (
                                <CheckSquare className="w-4 h-4 text-[#5A7A5A]" />
                              ) : (
                                <Square className="w-4 h-4 text-[#8C8375] print:text-black" />
                              )}
                            </span>
                            <span className={check.completed ? 'line-through text-[#8C8375] print:text-black' : ''}>
                              {check.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            /* Material Replenishment Sheet */
            <div className="bg-white rounded-2xl border border-[#E2D8C9] p-5 sm:p-6 shadow-xs space-y-4 print:border-black print:rounded-none">
              <div className="space-y-1">
                <h3 className="font-editorial text-xl font-bold text-[#1A1A1A]">
                  Workshop Material Replenishment Requisition
                </h3>
                <p className="text-xs text-[#665D4F]">
                  Estimated raw material consumption for pending holiday batch orders, factoring in artisan studio supplier lead times.
                </p>
              </div>

              <div className="border border-[#E2D8C9] rounded-xl overflow-hidden print:border-black">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF7F2] text-[#665D4F] border-b border-[#E2D8C9] print:bg-gray-100 print:text-black">
                      <th className="py-2.5 px-3 font-semibold">Material / Studio Supply</th>
                      <th className="py-2.5 px-3 font-semibold">Category</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Required</th>
                      <th className="py-2.5 px-3 font-semibold text-right">In Studio</th>
                      <th className="py-2.5 px-3 font-semibold">Inventory Status</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Supplier Lead Time</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Est. Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2D8C9] print:divide-gray-300">
                    {materialItems.map((mat) => {
                      const isShortage = mat.status === 'critical_shortage';
                      const isOrderSoon = mat.status === 'order_soon';

                      return (
                        <tr key={mat.id} className="hover:bg-[#FAF7F2]/50">
                          <td className="py-3 px-3 font-bold text-[#1A1A1A]">
                            {mat.material}
                          </td>
                          <td className="py-3 px-3 text-[#7A7163]">
                            {mat.category}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-[#1A1A1A]">
                            {mat.requiredUnits} {mat.unit}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-[#4A4235]">
                            {mat.inWorkshopStock} {mat.unit}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isShortage
                                ? 'bg-[#B85C4A]/15 text-[#B85C4A]'
                                : isOrderSoon
                                ? 'bg-[#D97757]/15 text-[#C26547]'
                                : 'bg-[#5A7A5A]/15 text-[#2E472E]'
                            }`}>
                              {isShortage ? 'Critical Shortage' : isOrderSoon ? 'Order Soon' : 'Sufficient Stock'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-[#7A7163]">
                            {mat.supplierLeadDays} days
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-semibold text-[#1A1A1A]">
                            ${mat.estimatedCost.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E2D8C9] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <span className="text-xs text-[#7A7163]">
                  Total Batch Replenishment Expenditure:
                </span>
                <span className="font-editorial text-2xl font-bold text-[#1A1A1A]">
                  ${materialItems.reduce((acc, m) => acc + m.estimatedCost, 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
