// ── GOODS RECEIPTS PAGE ─────────────────────────────────────────────────────
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { grnApi, poApi } from '../api/services';
import { Table, EmptyState, StatusBadge, Modal, Field, PageLoader } from '../components/ui';
import { Plus, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

export function GoodsReceiptsPage() {
  const qc = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [poId, setPoId] = useState('');
  const [lines, setLines] = useState([]);
  const [notes, setNotes] = useState('');

  const { data: pos } = useQuery({ queryKey: ['pos-grn'], queryFn: () => poApi.list({ status: 'sent', per_page: 50 }).then((r) => r.data.data) });

  const loadPoItems = async (id) => {
    setPoId(id);
    const po = pos?.find((p) => p.id === id);
    if (po?.items) setLines(po.items.map((i) => ({ po_item_id: i.id, item_name: i.item_name, expected: i.quantity, quantity_received: '', quantity_damaged: '0', quantity_shortage: '0' })));
  };

  const createMutation = useMutation({
    mutationFn: () => grnApi.create({ purchase_order_id: poId, notes, items: lines.map((l) => ({ po_item_id: l.po_item_id, quantity_received: parseFloat(l.quantity_received) || 0, quantity_damaged: parseFloat(l.quantity_damaged) || 0, quantity_shortage: parseFloat(l.quantity_shortage) || 0 })) }),
    onSuccess: () => { toast.success('GRN created'); qc.invalidateQueries(['grns']); setCreateOpen(false); },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed'),
  });

  const { data, isLoading } = useQuery({ queryKey: ['grns'], queryFn: () => grnApi.create.toString ? grnApi.getOne('list').catch(() => ({ data: { data: [] } })) : Promise.resolve({ data: { data: [] } }) });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1>Goods Receipts (GRN)</h1>
        <button className="btn-primary flex items-center gap-2" onClick={() => setCreateOpen(true)}><Plus className="w-4 h-4" /> Record Delivery</button>
      </div>

      <div className="card">
        <p className="text-sm text-gray-500">GRN records are linked to purchase orders. Select a sent PO to record delivery.</p>
        {pos?.length === 0 && <EmptyState title="No POs awaiting delivery" description="Send a PO first, then record delivery here" />}
        <div className="mt-4 space-y-2">
          {pos?.filter((p) => p.status === 'sent' || p.status === 'partially_received').map((po) => (
            <div key={po.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
              <div>
                <p className="font-medium text-sm">{po.po_number}</p>
                <p className="text-xs text-gray-500">{po.Vendor?.name} · ₹{Number(po.total_amount || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={po.status} />
                <button className="btn-primary text-xs py-1" onClick={() => { loadPoItems(po.id); setCreateOpen(true); }}>Record GRN</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Record Goods Receipt" size="xl">
        <div className="mb-4">
          <Field label="Purchase Order">
            <select className="input" value={poId} onChange={(e) => loadPoItems(e.target.value)}>
              <option value="">Select PO…</option>
              {pos?.filter((p) => ['sent', 'partially_received'].includes(p.status)).map((p) => <option key={p.id} value={p.id}>{p.po_number} — {p.Vendor?.name}</option>)}
            </select>
          </Field>
        </div>
        {lines.length > 0 && (
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full divide-y divide-gray-100 border border-gray-200 rounded-lg">
              <thead className="bg-gray-50"><tr><th className="table-th">Item</th><th className="table-th">Expected</th><th className="table-th">Received ✓</th><th className="table-th">Damaged</th><th className="table-th">Shortage</th></tr></thead>
              <tbody className="divide-y divide-gray-50">
                {lines.map((l, i) => (
                  <tr key={l.po_item_id}>
                    <td className="table-td">{l.item_name}</td>
                    <td className="table-td">{l.expected}</td>
                    {['quantity_received', 'quantity_damaged', 'quantity_shortage'].map((f) => (
                      <td key={f} className="px-3 py-2">
                        <input type="number" min="0" className="input w-20 text-sm" value={l[f]} onChange={(e) => setLines(lines.map((x, idx) => idx === i ? { ...x, [f]: e.target.value } : x))} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Field label="Notes"><textarea className="input" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
        <div className="flex justify-end gap-3 mt-4">
          <button className="btn-secondary" onClick={() => setCreateOpen(false)}>Cancel</button>
          <button className="btn-primary" disabled={!poId || createMutation.isPending || !lines.some((l) => l.quantity_received)} onClick={() => createMutation.mutate()}>{createMutation.isPending ? 'Saving…' : 'Submit GRN'}</button>
        </div>
      </Modal>
    </div>
  );
}

export default GoodsReceiptsPage;
