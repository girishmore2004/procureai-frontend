import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rfqApi, poApi } from '../api/services';
import { PageLoader, Alert, StatusBadge, Modal, Field } from '../components/ui';
import { Bot, CheckCircle, AlertTriangle, TrendingDown, Star, RefreshCw, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ComparisonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [overrideReason, setOverrideReason] = useState('');
  const [selectTarget, setSelectTarget] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['comparison', id],
    queryFn: () => rfqApi.getComparison(id).then((r) => r.data.data),
    // Auto-refresh if any quotes are still processing
    refetchInterval: (query) => {
      const quotes = query.state.data?.data?.data?.quotes || [];
      const hasProcessing = quotes.some((q) =>
        ['pending', 'processing'].includes(q.extraction_status)
      );
      return hasProcessing ? 5000 : false;
    },
  });

  const recommendMutation = useMutation({
    mutationFn: () => rfqApi.recommend(id),
    onSuccess: () => { toast.success('AI recommendation generated'); refetch(); },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed to generate recommendation'),
  });

  const selectMutation = useMutation({
    mutationFn: ({ quote_id, override_reason }) =>
      rfqApi.selectVendor(id, { quote_id, override_reason }),
    onSuccess: (res) => {
      toast.success(`Vendor selected! PO ${res.data.data.po_number} created.`);
      qc.invalidateQueries(['comparison', id]);
      setConfirmOpen(false);
      navigate(`/purchase-orders/${res.data.data.purchase_order_id}`);
    },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed'),
  });

  if (isLoading) return <PageLoader />;

  const quotes = data?.quotes || [];
  const rec = data?.recommendation;
  const failedVendors = data?.failed_vendors || [];
  const readyQuotes = quotes.filter((q) => q.extraction_status === 'done');
  const processingQuotes = quotes.filter((q) => ['pending', 'processing'].includes(q.extraction_status));
  const needsReviewQuotes = quotes.filter((q) => q.extraction_status === 'needs_review');
  const allDone = quotes.length > 0 && quotes.every((q) => q.extraction_status === 'done');

  if (!quotes.length && !failedVendors.length) {
    return (
      <div className="card text-center py-12">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
        <h2 className="font-semibold mb-1">No quotes available yet</h2>
        <p className="text-sm text-gray-500 mb-4">
          Vendors need to submit their quotes and AI extraction must complete before comparison is shown.
        </p>
        <Link to={`/rfqs/${id}`} className="btn-secondary inline-block">← Back to RFQ</Link>
      </div>
    );
  }

  // Check if selected target is an override (not the AI pick)
  const isOverride = selectTarget && rec && rec.recommended_quote_id !== selectTarget.quote_id;

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/rfqs" className="hover:text-brand-600">RFQs</Link>
        <span>/</span>
        <Link to={`/rfqs/${id}`} className="hover:text-brand-600">RFQ Detail</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Quote Comparison</span>
      </div>

      {/* Status alerts */}
      {processingQuotes.length > 0 && (
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
          <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
          {processingQuotes.length} quote(s) still being extracted — auto-refreshing every 5s
        </div>
      )}

      {needsReviewQuotes.length > 0 && (
        <Alert
          type="warning"
          message={`${needsReviewQuotes.length} quote(s) need manual review before they can be included in AI recommendation. Go to Quote Inbox to review.`}
        />
      )}

      {failedVendors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-red-600 shrink-0" />
            <p className="text-sm font-semibold text-red-700">Extraction failed for {failedVendors.length} vendor(s) — not shown in comparison</p>
          </div>
          {failedVendors.map((v, i) => (
            <div key={i} className="ml-6 text-xs text-red-600 mt-1">
              <strong>{v.vendor_name}:</strong> {v.extraction_note || 'Unknown error'}
            </div>
          ))}
          <p className="text-xs text-red-500 mt-2 ml-6">
            Go to <Link to="/quotes" className="underline font-medium">Quote Inbox</Link> → open these quotes → edit items manually → mark as reviewed.
          </p>
        </div>
      )}

      {/* AI Recommendation Banner */}
      {rec ? (
        <div className={`rounded-xl border-2 p-5 ${rec.overridden_by ? 'border-gray-200 bg-gray-50' : 'border-brand-300 bg-brand-50'}`}>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-brand-100 rounded-lg shrink-0"><Bot className="w-5 h-5 text-brand-600" /></div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h2 className="text-base text-brand-800">AI Recommendation</h2>
                <span className="badge-blue">Confidence: {(rec.confidence * 100).toFixed(0)}%</span>
                {rec.overridden_by && <span className="badge-gray">Overridden by manager</span>}
              </div>
              <p className="text-sm text-gray-700 mb-2">{rec.reasoning_text}</p>
              {rec.savings_estimate > 0 && (
                <div className="flex items-center gap-1 text-green-700 text-sm font-medium">
                  <TrendingDown className="w-4 h-4" />
                  Estimated savings vs average: ₹{Number(rec.savings_estimate).toLocaleString('en-IN')}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="card flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="font-medium text-gray-800">Get AI Vendor Recommendation</p>
            <p className="text-sm text-gray-500">
              AI scores each vendor on price (40%), delivery (25%), reliability (25%), payment (10%) and explains the pick.
              {!allDone && ' All quotes must be in "done" status first.'}
            </p>
          </div>
          <button
            className="btn-primary flex items-center gap-2 shrink-0"
            onClick={() => recommendMutation.mutate()}
            disabled={readyQuotes.length < 1 || recommendMutation.isPending}
            title={readyQuotes.length < 1 ? 'No done quotes available' : ''}
          >
            <Bot className="w-4 h-4" />
            {recommendMutation.isPending ? 'Analyzing…' : 'Get Recommendation'}
          </button>
        </div>
      )}

      {/* Comparison Table */}
      {quotes.length > 0 && (
        <div className="card overflow-x-auto">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-base">Side-by-Side Comparison</h2>
            {isFetching && !isLoading && (
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <RefreshCw className="w-3 h-3 animate-spin" /> Refreshing…
              </span>
            )}
          </div>
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 pr-4 text-sm font-semibold text-gray-500 w-40 min-w-[140px]">Criteria</th>
                {quotes.map((q) => (
                  <th key={q.quote_id} className={`text-center py-3 px-4 min-w-[180px] ${q.ai_recommended ? 'bg-brand-50 rounded-t-lg' : ''}`}>
                    <div className="flex flex-col items-center gap-1">
                      {q.ai_recommended && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                      <span className="text-sm font-semibold text-gray-800">{q.vendor?.name}</span>
                      <StatusBadge status={q.extraction_status} />
                      {q.ai_recommended && <span className="badge-blue text-xs">AI Pick</span>}
                      {q.extraction_note && (
                        <p className="text-xs text-amber-600 mt-1 max-w-[160px]">{q.extraction_note}</p>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                {
                  label: 'Total Amount',
                  key: 'total_amount',
                  format: (v) => v ? `₹${Number(v).toLocaleString('en-IN')}` : '—',
                  highlight: 'low',
                },
                {
                  label: 'Landed Cost',
                  key: 'landed_cost',
                  format: (v) => v ? `₹${Number(v).toLocaleString('en-IN')}` : '—',
                  highlight: 'low',
                },
                {
                  label: 'Delivery (days)',
                  key: 'delivery_time_days',
                  format: (v) => v ? `${v} days` : '—',
                  highlight: 'low',
                },
                { label: 'Payment Terms', key: 'payment_terms', format: (v) => v || '—' },
                { label: 'Valid Until', key: 'validity_date', format: (v) => v || '—' },
                {
                  label: 'Vendor Rating',
                  format: (_, q) => q.vendor?.rating ? `${Number(q.vendor.rating).toFixed(1)}/10` : 'New',
                },
              ].map((row) => {
                const numVals = quotes
                  .map((q) => row.key ? parseFloat(q[row.key]) : null)
                  .filter((v) => v !== null && !isNaN(v));
                const best = row.highlight === 'low'
                  ? Math.min(...numVals)
                  : row.highlight === 'high' ? Math.max(...numVals) : null;

                return (
                  <tr key={row.label} className="hover:bg-gray-50">
                    <td className="py-3 pr-4 text-sm font-medium text-gray-600">{row.label}</td>
                    {quotes.map((q) => {
                      const rawVal = row.key ? q[row.key] : null;
                      const numVal = parseFloat(rawVal) || null;
                      const isBest = best !== null && numVal === best && numVals.length > 1;
                      const isDone = q.extraction_status === 'done';
                      return (
                        <td
                          key={q.quote_id}
                          className={`py-3 px-4 text-center text-sm ${q.ai_recommended ? 'bg-brand-50' : ''}`}
                        >
                          {isDone || row.label === 'Delivery (days)' || row.label === 'Payment Terms' || row.label === 'Valid Until' || row.label === 'Vendor Rating' ? (
                            <span className={isBest ? 'font-bold text-green-600' : 'text-gray-700'}>
                              {row.format ? row.format(rawVal, q) : rawVal || '—'}
                              {isBest && <span className="ml-1 text-green-500">✓</span>}
                            </span>
                          ) : (
                            <span className="text-gray-300 italic text-xs">
                              {['pending', 'processing'].includes(q.extraction_status) ? 'Extracting…' : 'N/A'}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200">
                <td className="py-4 pr-4 text-sm font-semibold text-gray-600">Action</td>
                {quotes.map((q) => (
                  <td key={q.quote_id} className={`py-4 px-4 text-center ${q.ai_recommended ? 'bg-brand-50' : ''}`}>
                    {q.extraction_status === 'done' ? (
                      <button
                        className={`text-sm px-4 py-2 rounded-lg font-medium transition ${q.ai_recommended
                          ? 'bg-brand-600 text-white hover:bg-brand-700'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => { setSelectTarget(q); setOverrideReason(''); setConfirmOpen(true); }}
                      >
                        {q.ai_recommended ? '⭐ Select (AI Pick)' : 'Select Vendor'}
                      </button>
                    ) : q.extraction_status === 'needs_review' ? (
                      <Link to="/quotes" className="text-xs text-amber-600 hover:underline font-medium">
                        Review Required →
                      </Link>
                    ) : ['pending', 'processing'].includes(q.extraction_status) ? (
                      <span className="text-xs text-gray-400 flex items-center justify-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" /> Processing…
                      </span>
                    ) : (
                      <span className="text-xs text-red-400">Extraction failed</span>
                    )}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Item-Level Comparison */}
      {readyQuotes.length > 0 && (
        <div className="card">
          <h2 className="text-base mb-4">Item-Level Price Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 text-xs font-semibold text-gray-500 min-w-[180px]">Item</th>
                  {readyQuotes.map((q) => (
                    <th key={q.quote_id} className="text-center py-2 px-3 text-xs font-semibold text-gray-500 min-w-[120px]">
                      {q.vendor?.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(() => {
                  const allItemNames = [...new Set(
                    readyQuotes.flatMap((q) => (q.items || []).map((i) => i.item_name_raw))
                  )].filter(Boolean);

                  return allItemNames.map((itemName) => {
                    const prices = readyQuotes
                      .map((q) => parseFloat(q.items?.find((i) => i.item_name_raw === itemName)?.unit_price) || null)
                      .filter(Boolean);
                    const lowest = prices.length ? Math.min(...prices) : null;

                    return (
                      <tr key={itemName} className="hover:bg-gray-50">
                        <td className="py-2 pr-4 text-sm text-gray-700 font-medium">{itemName}</td>
                        {readyQuotes.map((q) => {
                          const match = q.items?.find((i) => i.item_name_raw === itemName);
                          const unitPrice = match ? parseFloat(match.unit_price) : null;
                          const isLowest = unitPrice && lowest && unitPrice === lowest && prices.length > 1;
                          return (
                            <td key={q.quote_id} className="py-2 px-3 text-center text-sm">
                              {match ? (
                                <div>
                                  <span className={isLowest ? 'font-bold text-green-600' : 'text-gray-700'}>
                                    ₹{Number(match.unit_price).toLocaleString('en-IN')}
                                    {isLowest && <span className="ml-1 text-green-500">✓</span>}
                                  </span>
                                  <p className="text-xs text-gray-400">Qty: {match.quantity}</p>
                                </div>
                              ) : (
                                <span className="text-gray-300 text-xs">Not quoted</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Select Vendor Confirm Modal */}
      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm Vendor Selection" size="md">
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-3">
            You are selecting <strong>{selectTarget?.vendor?.name}</strong> for this RFQ.
          </p>

          {isOverride && (
            <Alert
              type="warning"
              message="This is not the AI-recommended vendor. An override reason is required."
            />
          )}

          {isOverride && (
            <div className="mt-3">
              <Field label="Override Reason (required)">
                <textarea
                  className="input"
                  rows={2}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="e.g. Existing relationship, better credit terms negotiated offline, quality preference…"
                />
              </Field>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-3 text-sm mt-3 space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Vendor</span>
              <span className="font-semibold">{selectTarget?.vendor?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Amount</span>
              <span className="font-semibold">₹{Number(selectTarget?.total_amount || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Landed Cost</span>
              <span className="font-semibold">₹{Number(selectTarget?.landed_cost || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery</span>
              <span>{selectTarget?.delivery_time_days ? `${selectTarget.delivery_time_days} days` : '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Terms</span>
              <span>{selectTarget?.payment_terms || '—'}</span>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            A Purchase Order will be automatically created as a draft after selection.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <button className="btn-secondary" onClick={() => setConfirmOpen(false)}>Cancel</button>
          <button
            className="btn-primary flex items-center gap-2"
            disabled={
              selectMutation.isPending ||
              (isOverride && !overrideReason.trim())
            }
            onClick={() => selectMutation.mutate({
              quote_id: selectTarget.quote_id,
              override_reason: overrideReason || undefined,
            })}
          >
            <CheckCircle className="w-4 h-4" />
            {selectMutation.isPending ? 'Selecting…' : 'Confirm & Create PO'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
