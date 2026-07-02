import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prApi, itemsApi, rfqApi, vendorsApi } from '../api/services';
import { Table, EmptyState, StatusBadge, Modal, Field, Pagination, Alert } from '../components/ui';
import { Plus, Trash2, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';

// ── LIST PAGE ──────────────────────────────────────────────────────────────
export function PurchaseRequestsPage() {
  const { can } = useAuth();
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const qc = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['prs', page],
    queryFn: () => prApi.list({ page, per_page: 20 }).then((r) => r.data),
  });

  const { data: itemsData } = useQuery({ queryKey: ['items-all'], queryFn: () => itemsApi.list({ per_page: 100 }).then((r) => r.data.data) });

  const [form, setForm] = useState({ department: '', required_date: '', priority: 'medium', notes: '', items: [{ item_id: '', item_name_freetext: '', quantity: '', estimated_unit_price: '' }] });

  const addLine = () => setForm({ ...form, items: [...form.items, { item_id: '', item_name_freetext: '', quantity: '', estimated_unit_price: '' }] });
  const removeLine = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });
  const updateLine = (i, field, val) => setForm({ ...form, items: form.items.map((it, idx) => idx === i ? { ...it, [field]: val } : it) });

  const createMutation = useMutation({
    mutationFn: prApi.create,
    onSuccess: (res) => { toast.success('Purchase request created'); qc.invalidateQueries(['prs']); setCreateOpen(false); navigate(`/purchase-requests/${res.data.data.id}`); },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed'),
  });

  const prs = data?.data || [];
  const meta = data?.meta || {};
  const totalEstimate = form.items.reduce((s, i) => s + ((Number(i.quantity) || 0) * (Number(i.estimated_unit_price) || 0)), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1>Purchase Requests</h1>
        {can('pr.create') && <button className="btn-primary flex items-center gap-2" onClick={() => setCreateOpen(true)}><Plus className="w-4 h-4" /> New Request</button>}
      </div>

      <Table headers={['PR Number', 'Department', 'Priority', 'Amount', 'Date', 'Status']} loading={isLoading}
        empty={<EmptyState title="No purchase requests" description="Create your first purchase request" action={can('pr.create') && <button className="btn-primary mt-2" onClick={() => setCreateOpen(true)}>New Request</button>} />}>
        {prs.map((pr) => (
          <tr key={pr.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/purchase-requests/${pr.id}`)}>
            <td className="table-td"><Link to={`/purchase-requests/${pr.id}`} className="text-brand-600 hover:underline font-medium">{pr.pr_number}</Link></td>
            <td className="table-td">{pr.department || '—'}</td>
            <td className="table-td"><span className={`badge-${pr.priority === 'urgent' ? 'red' : pr.priority === 'high' ? 'amber' : 'gray'}`}>{pr.priority}</span></td>
            <td className="table-td font-semibold">₹{Number(pr.total_estimated_amount).toLocaleString('en-IN')}</td>
            <td className="table-td text-xs text-gray-500">{formatDistanceToNow(new Date(pr.created_at), { addSuffix: true })}</td>
            <td className="table-td"><StatusBadge status={pr.status} /></td>
          </tr>
        ))}
      </Table>
      <Pagination page={page} total={meta.total || 0} perPage={20} onPage={setPage} />

      {/* Create PR Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Purchase Request" size="xl">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Field label="Department"><input className="input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /></Field>
          <Field label="Required Date"><input className="input" type="date" value={form.required_date} onChange={(e) => setForm({ ...form, required_date: e.target.value })} /></Field>
          <Field label="Priority">
            <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              {['low', 'medium', 'high', 'urgent'].map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
        </div>

        <div className="mb-2 flex items-center justify-between">
          <label className="label mb-0">Items</label>
          <button className="text-xs text-brand-600 hover:underline flex items-center gap-1" onClick={addLine}><Plus className="w-3 h-3" /> Add line</button>
        </div>
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50"><tr><th className="table-th">Item</th><th className="table-th">Qty</th><th className="table-th">Est. Unit Price</th><th className="table-th">Total</th><th /></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {form.items.map((it, i) => (
                <tr key={i}>
                  <td className="px-3 py-2">
                    <select className="input text-sm" value={it.item_id} onChange={(e) => { const sel = itemsData?.find((x) => x.id === e.target.value); updateLine(i, 'item_id', e.target.value); if (sel) updateLine(i, 'item_name_freetext', sel.name); }}>
                      <option value="">— Select item or type —</option>
                      {itemsData?.map((item) => <option key={item.id} value={item.id}>{item.name} ({item.item_code})</option>)}
                    </select>
                    {!it.item_id && <input className="input text-sm mt-1" placeholder="Or type item name" value={it.item_name_freetext} onChange={(e) => updateLine(i, 'item_name_freetext', e.target.value)} />}
                  </td>
                  <td className="px-3 py-2"><input className="input w-20 text-sm" type="number" min="0" value={it.quantity} onChange={(e) => updateLine(i, 'quantity', e.target.value)} /></td>
                  <td className="px-3 py-2"><input className="input w-28 text-sm" type="number" min="0" value={it.estimated_unit_price} onChange={(e) => updateLine(i, 'estimated_unit_price', e.target.value)} /></td>
                  <td className="px-3 py-2 text-sm font-medium">₹{((Number(it.quantity) || 0) * (Number(it.estimated_unit_price) || 0)).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2"><button className="text-red-400 hover:text-red-600" onClick={() => removeLine(i)}><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-right text-sm font-semibold mb-4">Estimated Total: ₹{totalEstimate.toLocaleString('en-IN')}</div>
        <Field label="Notes"><textarea className="input" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
        <div className="flex justify-end gap-3 mt-4">
          <button className="btn-secondary" onClick={() => setCreateOpen(false)}>Cancel</button>
          <button className="btn-primary" disabled={!form.items.some((i) => i.quantity) || createMutation.isPending} onClick={() => createMutation.mutate(form)}>{createMutation.isPending ? 'Creating…' : 'Create Request'}</button>
        </div>
      </Modal>
    </div>
  );
}

// ── DETAIL PAGE ─────────────────────────────────────────────────────────────
export function PurchaseRequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { can } = useAuth();
  const [rfqOpen, setRfqOpen] = useState(false);
  const [rfqForm, setRfqForm] = useState({ vendor_ids: [], deadline: '', delivery_location: '', terms: '' });

  const { data: pr, isLoading } = useQuery({
    queryKey: ['pr', id],
    queryFn: () => prApi.getOne(id).then((r) => r.data.data),
  });

  const { data: vendors } = useQuery({ queryKey: ['vendors-all'], queryFn: () => vendorsApi.list({ per_page: 100 }).then((r) => r.data.data) });

  const submitMutation = useMutation({
    mutationFn: () => prApi.submit(id),
    onSuccess: () => { toast.success('Submitted for approval'); qc.invalidateQueries(['pr', id]); },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed'),
  });

  const rfqMutation = useMutation({
    mutationFn: (data) => rfqApi.create({ purchase_request_id: id, ...data }),
    onSuccess: (res) => { toast.success('RFQ created'); navigate(`/rfqs/${res.data.data.id}`); },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed'),
  });

  if (isLoading) return <div className="card animate-pulse h-32" />;
  if (!pr) return <div className="card text-gray-500">Not found</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/purchase-requests" className="hover:text-brand-600">Purchase Requests</Link>
        <span>/</span><span className="text-gray-900 font-medium">{pr.pr_number}</span>
      </div>

      <div className="card">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
          <div>
            <h1 className="mb-1">{pr.pr_number}</h1>
            <p className="text-sm text-gray-500">By {pr.Requester?.name} · {pr.department} · {pr.priority} priority</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={pr.status} />
            {pr.status === 'draft' && can('pr.create') && <button className="btn-primary flex items-center gap-2" onClick={() => submitMutation.mutate()} disabled={submitMutation.isPending}><Send className="w-4 h-4" />{submitMutation.isPending ? 'Submitting…' : 'Submit for Approval'}</button>}
            {pr.status === 'approved' && can('rfq.create') && <button className="btn-primary flex items-center gap-2" onClick={() => setRfqOpen(true)}><Send className="w-4 h-4" /> Create RFQ</button>}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
          <div><p className="text-gray-400 text-xs">Required Date</p><p className="font-medium">{pr.required_date || '—'}</p></div>
          <div><p className="text-gray-400 text-xs">Estimated Total</p><p className="font-semibold">₹{Number(pr.total_estimated_amount).toLocaleString('en-IN')}</p></div>
          <div><p className="text-gray-400 text-xs">Branch</p><p className="font-medium">{pr.branch || '—'}</p></div>
          <div><p className="text-gray-400 text-xs">Notes</p><p>{pr.notes || '—'}</p></div>
        </div>

        <table className="min-w-full divide-y divide-gray-100 border border-gray-200 rounded-lg">
          <thead className="bg-gray-50"><tr><th className="table-th">Item</th><th className="table-th">Qty</th><th className="table-th">Est. Unit Price</th><th className="table-th">Budget</th></tr></thead>
          <tbody className="divide-y divide-gray-50">
            {pr.items?.map((it) => (
              <tr key={it.id}>
                <td className="table-td">{it.Item?.name || it.item_name_freetext}</td>
                <td className="table-td">{it.quantity}</td>
                <td className="table-td">₹{Number(it.estimated_unit_price || 0).toLocaleString('en-IN')}</td>
                <td className="table-td font-medium">₹{Number(it.budget_amount || 0).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pr.Approvals?.length > 0 && (
        <div className="card">
          <h2 className="text-base mb-3">Approval History</h2>
          {pr.Approvals.map((ap) => (
            <div key={ap.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm">Level {ap.level} — {ap.approver_id}</span>
              <div className="flex items-center gap-2"><StatusBadge status={ap.status} />{ap.comments && <span className="text-xs text-gray-400">"{ap.comments}"</span>}</div>
            </div>
          ))}
        </div>
      )}

      {/* Create RFQ Modal */}
      <Modal open={rfqOpen} onClose={() => setRfqOpen(false)} title="Create RFQ" size="lg">
        <div className="space-y-4">
          <Field label="Select Vendors" required>
            <div className="border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto space-y-1">
              {vendors?.map((v) => (
                <label key={v.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
                  <input type="checkbox" checked={rfqForm.vendor_ids.includes(v.id)} onChange={(e) => setRfqForm({ ...rfqForm, vendor_ids: e.target.checked ? [...rfqForm.vendor_ids, v.id] : rfqForm.vendor_ids.filter((x) => x !== v.id) })} />
                  {v.name} <span className="text-gray-400 text-xs">({v.email})</span>
                </label>
              ))}
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Quote Deadline" required><input className="input" type="datetime-local" value={rfqForm.deadline} onChange={(e) => setRfqForm({ ...rfqForm, deadline: e.target.value })} /></Field>
            <Field label="Delivery Location"><input className="input" value={rfqForm.delivery_location} onChange={(e) => setRfqForm({ ...rfqForm, delivery_location: e.target.value })} /></Field>
          </div>
          <Field label="Terms & Conditions"><textarea className="input" rows={3} value={rfqForm.terms} onChange={(e) => setRfqForm({ ...rfqForm, terms: e.target.value })} /></Field>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button className="btn-secondary" onClick={() => setRfqOpen(false)}>Cancel</button>
          <button className="btn-primary" disabled={!rfqForm.vendor_ids.length || !rfqForm.deadline || rfqMutation.isPending} onClick={() => rfqMutation.mutate(rfqForm)}>{rfqMutation.isPending ? 'Creating…' : 'Create RFQ'}</button>
        </div>
      </Modal>
    </div>
  );
}

export default PurchaseRequestsPage;
