import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rfqApi, poApi } from '../api/services';
import { PageLoader, Alert, StatusBadge, Modal, Field } from '../components/ui';
import { Bot, CheckCircle, AlertTriangle, TrendingDown, Star, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ComparisonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [overrideReason, setOverrideReason] = useState('');
  const [selectTarget, setSelectTarget] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['comparison', id],
    queryFn: () => rfqApi.getComparison(id).then((r) => r.data.data),
  });

  const recommendMutation = useMutation({
    mutationFn: () => rfqApi.recommend(id),
    onSuccess: () => { toast.success('AI recommendation generated'); refetch(); },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed to generate recommendation'),
  });

  const selectMutation = useMutation({
    mutationFn: ({ quote_id, override_reason }) => rfqApi.selectVendor(id, { quote_id, override_reason }),
    onSuccess: (res) => {
      const { purchase_order_id, po_number } = res.data.data || {};
      toast.success(po_number ? `Vendor selected — Purchase Order ${po_number} created` : 'Vendor selected! Purchase Order created');
      qc.invalidateQueries(['comparison', id]);
      setConfirmOpen(false);
      navigate(purchase_order_id ? `/purchase-orders/${purchase_order_id}` : '/purchase-orders');
    },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed'),
  });

  if (isLoading) return <PageLoader />;

  const quotes = data?.quotes || [];
  const rec = data?.recommendation;
  const allDone = quotes.every((q) => q.extraction_status === 'done');

  if (!quotes.length) {
    return (
      <div className="card text-center py-12">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
        <h2 className="font-semibold mb-1">No processed quotes yet</h2>
        <p className="text-sm text-gray-500">Vendors need to submit their quotes and extraction must complete before comparison is available.</p>
        <Link to={`/rfqs/${id}`} className="btn-secondary mt-4 inline-block">← Back to RFQ</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/rfqs" className="hover:text-brand-600">RFQs</Link>
        <span>/</span>
        <Link to={`/rfqs/${id}`} className="hover:text-brand-600">RFQ Detail</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Quote Comparison</span>
      </div>

      {/* AI Recommendation Banner */}
      {rec ? (
        <div className={`rounded-xl border-2 p-5 ${rec.overridden_by ? 'border-gray-200 bg-gray-50' : 'border-brand-300 bg-brand-50'}`}>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-brand-100 rounded-lg shrink-0"><Bot className="w-5 h-5 text-brand-600" /></div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-base text-brand-800">AI Recommendation</h2>
                <span className="badge-blue">Confidence: {(rec.confidence * 100).toFixed(0)}%</span>
                {rec.overridden_by && <span className="badge-gray">Overridden by manager</span>}
              </div>
              <p className="text-sm text-gray-700 mb-2">{rec.reasoning_text}</p>
              {rec.savings_estimate > 0 && (
                <div className="flex items-center gap-1 text-green-700 text-sm font-medium">
                  <TrendingDown className="w-4 h-4" />
                  Estimated savings vs avg: ₹{Number(rec.savings_estimate).toLocaleString('en-IN')}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="card flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">Get AI Vendor Recommendation</p>
            <p className="text-sm text-gray-500">AI analyzes price, delivery, vendor reliability and generates a ranked recommendation with explanation.</p>
          </div>
          <button className="btn-primary flex items-center gap-2 shrink-0" onClick={() => recommendMutation.mutate()} disabled={!allDone || recommendMutation.isPending}>
            <Bot className="w-4 h-4" />
            {recommendMutation.isPending ? 'Analyzing…' : 'Get Recommendation'}
          </button>
        </div>
      )}

      {!allDone && <Alert type="warning" message="Some quotes are still processing. Comparison may be incomplete." />}

      {/* Comparison Table */}
      <div className="card overflow-x-auto">
        <h2 className="text-base mb-4">Side-by-Side Comparison</h2>
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 pr-4 text-sm font-semibold text-gray-500 w-40">Criteria</th>
              {quotes.map((q) => (
                <th key={q.quote_id} className={`text-center py-3 px-4 min-w-[160px] ${q.ai_recommended ? 'bg-brand-50 rounded-t-lg' : ''}`}>
                  <div className="flex flex-col items-center gap-1">
                    {q.ai_recommended && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                    <span className="text-sm font-semibold text-gray-800">{q.vendor?.name}</span>
                    <StatusBadge status={q.extraction_status} />
                    {q.ai_recommended && <span className="badge-blue text-xs">AI Pick</span>}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { label: 'Total Amount', key: 'total_amount', format: (v) => v ? `₹${Number(v).toLocaleString('en-IN')}` : '—', highlight: 'low' },
              { label: 'Landed Cost', key: 'landed_cost', format: (v) => v ? `₹${Number(v).toLocaleString('en-IN')}` : '—', highlight: 'low' },
              { label: 'Delivery Time', key: 'delivery_time_days', format: (v) => v ? `${v} days` : '—', highlight: 'low' },
              { label: 'Payment Terms', key: 'payment_terms', format: (v) => v || '—' },
              { label: 'Valid Until', key: 'validity_date', format: (v) => v || '—' },
              { label: 'Vendor Rating', key: 'vendor', format: (v) => v?.rating ? `${Number(v.rating).toFixed(1)}/10` : 'New' },
            ].map((row) => {
              const values = quotes.map((q) => row.key === 'vendor' ? q.vendor : q[row.key]);
              const numVals = values.map((v) => parseFloat(v) || null).filter(Boolean);
              const best = row.highlight === 'low' ? Math.min(...numVals) : Math.max(...numVals);

              return (
                <tr key={row.label} className="hover:bg-gray-50">
                  <td className="py-3 pr-4 text-sm font-medium text-gray-600">{row.label}</td>
                  {quotes.map((q) => {
                    const rawVal = row.key === 'vendor' ? q.vendor : q[row.key];
                    const numVal = parseFloat(rawVal) || null;
                    const isBest = numVal && numVal === best;
                    return (
                      <td key={q.quote_id} className={`py-3 px-4 text-center text-sm ${q.ai_recommended ? 'bg-brand-50' : ''}`}>
                        <span className={isBest ? 'font-bold text-green-600' : 'text-gray-700'}>
                          {row.format(rawVal)}
                          {isBest && <span className="ml-1 text-xs">✓</span>}
                        </span>
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
                      className={q.ai_recommended ? 'btn-primary text-sm' : 'btn-secondary text-sm'}
                      onClick={() => { setSelectTarget(q); setConfirmOpen(true); }}
                    >
                      {q.ai_recommended ? '⭐ Select (AI Pick)' : 'Select Vendor'}
                    </button>
                  ) : <span className="text-xs text-gray-400">Processing…</span>}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Item-Level Comparison */}
      <div className="card">
        <h2 className="text-base mb-4">Item-Level Price Comparison</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 text-xs font-semibold text-gray-500 w-48">Item</th>
                {quotes.map((q) => <th key={q.quote_id} className="text-center py-2 px-3 text-xs font-semibold text-gray-500">{q.vendor?.name}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(() => {
                const allItems = [...new Set(quotes.flatMap((q) => q.items?.map((i) => i.item_name_raw) || []))];
                return allItems.map((itemName) => (
                  <tr key={itemName} className="hover:bg-gray-50">
                    <td className="py-2 pr-4 text-sm text-gray-700">{itemName}</td>
                    {quotes.map((q) => {
                      const match = q.items?.find((i) => i.item_name_raw === itemName);
                      const prices = quotes.map((qq) => parseFloat(qq.items?.find((i) => i.item_name_raw === itemName)?.unit_price) || null).filter(Boolean);
                      const lowest = prices.length ? Math.min(...prices) : null;
                      const unitPrice = parseFloat(match?.unit_price);
                      return (
                        <td key={q.quote_id} className="py-2 px-3 text-center text-sm">
                          {match ? (
                            <span className={unitPrice === lowest ? 'font-bold text-green-600' : 'text-gray-700'}>
                              ₹{Number(match.unit_price).toLocaleString('en-IN')}
                            </span>
                          ) : <span className="text-gray-300">—</span>}
                        </td>
                      );
                    })}
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {/* Select Vendor Confirm Modal */}
      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm Vendor Selection" size="md">
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-3">
            You are selecting <strong>{selectTarget?.vendor?.name}</strong> for this RFQ.
            {rec && selectTarget && rec.recommended_quote_id !== selectTarget.quote_id && (
              <span className="block mt-2 text-amber-600 text-xs">⚠️ This is not the AI-recommended vendor. Please provide a reason for the override.</span>
            )}
          </p>
          {rec && selectTarget && rec.recommended_quote_id !== selectTarget.quote_id && (
            <Field label="Override Reason (required)">
              <textarea className="input" rows={2} value={overrideReason} onChange={(e) => setOverrideReason(e.target.value)} placeholder="e.g. Better delivery date, existing relationship, quality preference…" />
            </Field>
          )}
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-sm mb-4">
          <div className="flex justify-between"><span className="text-gray-500">Total Amount</span><span className="font-semibold">₹{Number(selectTarget?.total_amount || 0).toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between mt-1"><span className="text-gray-500">Delivery</span><span>{selectTarget?.delivery_time_days ? `${selectTarget.delivery_time_days} days` : '—'}</span></div>
        </div>
        <p className="text-xs text-gray-400 mb-4">A Purchase Order will be created automatically after selection.</p>
        <div className="flex justify-end gap-3">
          <button className="btn-secondary" onClick={() => setConfirmOpen(false)}>Cancel</button>
          <button
            className="btn-primary flex items-center gap-2"
            disabled={selectMutation.isPending || (!overrideReason && rec && selectTarget && rec.recommended_quote_id !== selectTarget.quote_id)}
            onClick={() => selectMutation.mutate({ quote_id: selectTarget.quote_id, override_reason: overrideReason })}
          >
            <CheckCircle className="w-4 h-4" />
            {selectMutation.isPending ? 'Selecting…' : 'Confirm Selection'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
