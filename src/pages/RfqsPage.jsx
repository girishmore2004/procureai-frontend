import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rfqApi, quotesApi } from '../api/services';
import { Table, EmptyState, StatusBadge, Modal, Field, Alert, PageLoader, Spinner } from '../components/ui';
import { Send, Bell, Star, CheckCircle, AlertTriangle, Bot, ThumbsUp, Copy, ExternalLink, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { safeFormatDistanceToNow, safeToLocaleDateString, safeToLocaleString } from '../utils/date';

// Extraction states that mean "AI is still working" — keep polling while any quote is in one of these.
const IN_PROGRESS_STATUSES = ['pending', 'processing'];

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Link copied to clipboard');
  } catch {
    toast.error('Could not copy — copy it manually');
  }
};

// ── RFQ LIST ──────────────────────────────────────────────────────────────
export function RfqsPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({ queryKey: ['rfqs'], queryFn: () => rfqApi.list().then((r) => r.data) });
  const rfqs = data?.data || [];

  return (
    <div className="space-y-4">
      <h1>RFQs</h1>
      <Table headers={['RFQ Number', 'PR', 'Vendors', 'Deadline', 'Status']} loading={isLoading}
        empty={<EmptyState title="No RFQs yet" description="Create an RFQ from an approved purchase request" />}>
        {rfqs.map((rfq) => (
          <tr key={rfq.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/rfqs/${rfq.id}`)}>
            <td className="table-td"><Link to={`/rfqs/${rfq.id}`} className="text-brand-600 hover:underline font-medium">{rfq.rfq_number}</Link></td>
            <td className="table-td text-xs">{rfq.purchase_request_id?.slice(-8)}</td>
            <td className="table-td">{rfq.rfqVendors?.length || 0} vendors</td>
            <td className="table-td text-xs">{safeToLocaleDateString(rfq.deadline)}</td>
            <td className="table-td"><StatusBadge status={rfq.status} /></td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

// ── RFQ DETAIL ─────────────────────────────────────────────────────────────
export function RfqDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  // Poll while any vendor's quote is still being extracted by AI, so the status
  // updates on screen without the user needing to refresh the page.
  const { data: rfq, isLoading } = useQuery({
    queryKey: ['rfq', id],
    queryFn: () => rfqApi.getOne(id).then((r) => r.data.data),
    refetchInterval: (query) => {
      const rv = query.state.data?.rfqVendors || [];
      const anyExtracting = rv.some((v) => (v.Quotes || []).some((q) => IN_PROGRESS_STATUSES.includes(q.extraction_status)));
      return anyExtracting ? 4000 : false;
    },
  });

  const sendMutation = useMutation({
    mutationFn: () => rfqApi.send(id),
    onSuccess: (res) => { toast.success(`RFQ sent to ${res.data.data.results?.length} vendors`); qc.invalidateQueries(['rfq', id]); },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed to send'),
  });

  const remindMutation = useMutation({
    mutationFn: () => rfqApi.remind(id),
    onSuccess: (res) => toast.success(`Reminder sent to ${res.data.data.reminded} vendors`),
  });

  if (isLoading) return <PageLoader />;
  if (!rfq) return <div className="card text-gray-500">RFQ not found</div>;

  const responded = rfq.rfqVendors?.filter((rv) => rv.status === 'responded').length || 0;
  const total = rfq.rfqVendors?.length || 0;
  const anyResponded = responded > 0;

  const vendorLink = (rv) => `${window.location.origin}/vendor/quote/${rv.access_token}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/rfqs" className="hover:text-brand-600">RFQs</Link>
        <span>/</span><span className="text-gray-900 font-medium">{rfq.rfq_number}</span>
      </div>

      <div className="card">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
          <div>
            <h1 className="mb-1">{rfq.rfq_number}</h1>
            <p className="text-sm text-gray-500">Deadline: {safeToLocaleString(rfq.deadline)} · {rfq.delivery_location}</p>
          </div>
          <div className="flex gap-2">
            <StatusBadge status={rfq.status} />
            {rfq.status === 'draft' && <button className="btn-primary flex items-center gap-2" onClick={() => sendMutation.mutate()} disabled={sendMutation.isPending}><Send className="w-4 h-4" />{sendMutation.isPending ? 'Sending…' : 'Send to Vendors'}</button>}
            {rfq.status === 'sent' && (
              <>
                <button className="btn-secondary flex items-center gap-2" onClick={() => remindMutation.mutate()} disabled={remindMutation.isPending}><Bell className="w-4 h-4" /> Remind</button>
                <Link to={`/rfqs/${id}/comparison`} className={`btn-primary flex items-center gap-2 ${!anyResponded ? 'opacity-50 pointer-events-none' : ''}`}><Star className="w-4 h-4" /> Compare Quotes</Link>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 mb-4 text-sm">
          <div><span className="text-gray-400">Responded:</span> <span className="font-semibold text-green-600">{responded}/{total}</span></div>
          {rfq.terms && <div><span className="text-gray-400">Terms:</span> {rfq.terms}</div>}
        </div>

        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Vendor Responses</h2>
        <div className="space-y-2">
          {rfq.rfqVendors?.map((rv) => {
            const extracting = (rv.Quotes || []).some((q) => IN_PROGRESS_STATUSES.includes(q.extraction_status));
            return (
              <div key={rv.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50 flex-wrap gap-2">
                <div>
                  <p className="text-sm font-medium">{rv.Vendor?.name}</p>
                  <p className="text-xs text-gray-400">{rv.Vendor?.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  {extracting && <span className="flex items-center gap-1 text-xs text-brand-600"><Loader2 className="w-3.5 h-3.5 animate-spin" /> AI extracting…</span>}
                  <StatusBadge status={rv.status} />
                  {rv.access_token && (
                    <>
                      <button type="button" className="text-xs text-gray-500 hover:text-brand-600 flex items-center gap-1" title="Copy vendor quote link" onClick={() => copyToClipboard(vendorLink(rv))}>
                        <Copy className="w-3.5 h-3.5" /> Copy Link
                      </button>
                      <a href={vendorLink(rv)} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-brand-600 flex items-center gap-1" title="Open vendor quote link">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </>
                  )}
                  {rv.Quotes?.length > 0 && <Link to={`/quotes/${rv.Quotes[0].id}`} className="text-xs text-brand-600 hover:underline">View Quote</Link>}
                </div>
              </div>
            );
          })}
        </div>

        {rfq.PurchaseRequest?.items?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Items Requested</h2>
            <div className="space-y-1">
              {rfq.PurchaseRequest.items.map((it) => (
                <div key={it.id} className="flex justify-between text-sm py-1">
                  <span>{it.Item?.name || it.item_name_freetext}</span>
                  <span className="text-gray-500">Qty: {it.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── QUOTE INBOX ─────────────────────────────────────────────────────────────
export function QuoteInboxPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['quotes-inbox'],
    queryFn: () => rfqApi.list({ per_page: 100 }).then((r) => r.data),
    // Keep polling while at least one quote anywhere in the inbox is still extracting.
    refetchInterval: (query) => {
      const rfqs = query.state.data?.data || [];
      const anyExtracting = rfqs.some((rfq) => (rfq.rfqVendors || []).some((rv) => (rv.Quotes || []).some((q) => IN_PROGRESS_STATUSES.includes(q.extraction_status))));
      return anyExtracting ? 4000 : false;
    },
  });

  // Flatten all quotes across RFQs, carrying the parent RFQ id/status so we can
  // deep-link straight into the comparison page for that RFQ.
  const allQuotes = (data?.data || []).flatMap((rfq) =>
    (rfq.rfqVendors || []).flatMap((rv) => (rv.Quotes || []).map((q) => ({
      ...q,
      rfq_id: rfq.id,
      rfq_number: rfq.rfq_number,
      rfq_status: rfq.status,
      vendor_name: rv.Vendor?.name,
    })))
  );

  return (
    <div className="space-y-4">
      <h1>Quote Inbox</h1>
      <Table headers={['RFQ', 'Vendor', 'Source', 'Extraction', 'Total', 'Received', '']} loading={isLoading}
        empty={<EmptyState title="No quotes yet" description="Quotes from vendors will appear here after RFQs are sent" />}>
        {allQuotes.map((q) => {
          const extracting = IN_PROGRESS_STATUSES.includes(q.extraction_status);
          return (
            <tr key={q.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/quotes/${q.id}`)}>
              <td className="table-td text-xs font-mono"><Link to={`/rfqs/${q.rfq_id}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>{q.rfq_number}</Link></td>
              <td className="table-td font-medium">{q.vendor_name}</td>
              <td className="table-td"><span className="badge-gray">{q.source_type}</span></td>
              <td className="table-td">
                <div className="flex items-center gap-1.5">
                  {extracting && <Loader2 className="w-3.5 h-3.5 text-brand-500 animate-spin" />}
                  {q.extraction_status === 'needs_review' && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                  {q.extraction_status === 'done' && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
                  <StatusBadge status={q.extraction_status} />
                </div>
              </td>
              <td className="table-td font-semibold">{q.total_amount ? `₹${Number(q.total_amount).toLocaleString('en-IN')}` : '—'}</td>
              <td className="table-td text-xs text-gray-500">{safeFormatDistanceToNow(q.created_at)}</td>
              <td className="table-td text-right">
                <Link to={`/rfqs/${q.rfq_id}/comparison`} className="text-xs text-brand-600 hover:underline flex items-center gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
                  <Star className="w-3.5 h-3.5" /> Compare
                </Link>
              </td>
            </tr>
          );
        })}
      </Table>
    </div>
  );
}

// ── QUOTE DETAIL ─────────────────────────────────────────────────────────────
export function QuoteDetailPage() {
  const { id } = useParams();
  const qc = useQueryClient();

  // Auto-refresh while this quote's AI extraction is still running so the
  // extracted line items appear the moment the background job finishes.
  const { data: quote, isLoading } = useQuery({
    queryKey: ['quote', id],
    queryFn: () => quotesApi.getOne(id).then((r) => r.data.data),
    refetchInterval: (query) => (IN_PROGRESS_STATUSES.includes(query.state.data?.extraction_status) ? 3000 : false),
  });

  const reviewMutation = useMutation({
    mutationFn: () => quotesApi.reviewComplete(id),
    onSuccess: () => { toast.success('Quote marked as reviewed'); qc.invalidateQueries(['quote', id]); },
  });

  const reprocessMutation = useMutation({
    mutationFn: () => quotesApi.reprocess(id),
    onSuccess: () => { toast.success('Reprocessing queued'); qc.invalidateQueries(['quote', id]); },
  });

  if (isLoading) return <PageLoader />;
  if (!quote) return <div className="card text-gray-500">Quote not found</div>;

  const needsReview = quote.extraction_status === 'needs_review';
  const extracting = IN_PROGRESS_STATUSES.includes(quote.extraction_status);
  const failed = quote.extraction_status === 'failed';
  const lowConfidence = quote.AiExtractions?.[0]?.confidence_overall < 0.75;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/quotes" className="hover:text-brand-600">Quote Inbox</Link>
        <span>/</span><span className="text-gray-900 font-medium">{quote.Vendor?.name}</span>
      </div>

      {extracting && (
        <Alert type="info" message="AI is still extracting this quote — this page will refresh automatically when it's done." />
      )}
      {failed && (
        <Alert type="error" message="AI extraction failed for this quote. Try Re-extract, or enter values manually below." />
      )}
      {needsReview && (
        <Alert type="warning" message="AI confidence is low on some fields. Please review and correct extracted values before marking complete." />
      )}

      <div className="card">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
          <div>
            <h1 className="mb-1">{quote.Vendor?.name}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>Delivery: {quote.delivery_time_days ? `${quote.delivery_time_days} days` : '—'}</span>
              <span>Terms: {quote.payment_terms || '—'}</span>
              <span>Valid till: {quote.validity_date || '—'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {extracting && <Spinner size="sm" />}
            <StatusBadge status={quote.extraction_status} />
            {quote.ai_confidence && <span className="badge-gray">AI Confidence: {(quote.ai_confidence * 100).toFixed(0)}%</span>}
            {quote.source_file_url && <a href={quote.source_file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 hover:underline">View Source File</a>}
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-100 border border-gray-200 rounded-lg mb-4">
          <thead className="bg-gray-50"><tr><th className="table-th">Item</th><th className="table-th">Qty</th><th className="table-th">Unit Price</th><th className="table-th">Total</th><th className="table-th">Tax</th><th className="table-th">Confidence</th></tr></thead>
          <tbody className="divide-y divide-gray-50">
            {quote.items?.map((it) => (
              <tr key={it.id} className={it.confidence_score < 0.7 ? 'bg-amber-50' : ''}>
                <td className="table-td">{it.item_name_raw}</td>
                <td className="table-td">{it.quantity}</td>
                <td className="table-td">₹{Number(it.unit_price || 0).toLocaleString('en-IN')}</td>
                <td className="table-td font-medium">₹{Number(it.total_price || 0).toLocaleString('en-IN')}</td>
                <td className="table-td">{it.tax ? `₹${Number(it.tax).toLocaleString('en-IN')}` : '—'}</td>
                <td className="table-td">
                  <span className={`text-xs font-semibold ${it.confidence_score >= 0.8 ? 'text-green-600' : it.confidence_score >= 0.6 ? 'text-amber-600' : 'text-red-600'}`}>
                    {it.confidence_score ? `${(it.confidence_score * 100).toFixed(0)}%` : '—'}
                  </span>
                </td>
              </tr>
            ))}
            {(!quote.items || quote.items.length === 0) && (
              <tr><td colSpan={6} className="table-td text-center text-gray-400 py-6">{extracting ? 'Waiting for AI extraction…' : 'No line items yet'}</td></tr>
            )}
          </tbody>
          <tfoot className="bg-gray-50"><tr><td colSpan={3} className="table-td text-right font-semibold">Total</td><td className="table-td font-bold text-brand-700">₹{Number(quote.total_amount || 0).toLocaleString('en-IN')}</td><td colSpan={2} /></tr></tfoot>
        </table>

        <div className="flex gap-3 justify-end">
          <button className="btn-secondary" onClick={() => reprocessMutation.mutate()} disabled={reprocessMutation.isPending || extracting}>Re-extract</button>
          {quote.extraction_status !== 'done' && <button className="btn-primary flex items-center gap-2" onClick={() => reviewMutation.mutate()} disabled={reviewMutation.isPending || extracting}><CheckCircle className="w-4 h-4" /> Mark Reviewed & Complete</button>}
        </div>
      </div>
    </div>
  );
}

export default RfqsPage;
