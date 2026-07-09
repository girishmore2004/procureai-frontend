import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billingApi, itemsApi, inventoryApi } from '../api/services';
import { Table, EmptyState, StatusBadge, Modal, Field } from '../components/ui';
import { Plus, Trash2, Receipt } from 'lucide-react';
import toast from 'react-hot-toast';
import { safeFormatDistanceToNow } from '../utils/date';

const emptyLine = { item_id: '', quantity: '', unit_price: '' };

export default function BillingPage() {
  const qc = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [customer, setCustomer] = useState({ customer_name: '', customer_contact: '' });
  const [lines, setLines] = useState([{ ...emptyLine }]);

  const { data, isLoading } = useQuery({ queryKey: ['bills'], queryFn: () => billingApi.list({ per_page: 50 }).then((r) => r.data) });
  const { data: items } = useQuery({ queryKey: ['items-all'], queryFn: () => itemsApi.list({ per_page: 200 }).then((r) => r.data.data) });
  const { data: inventory } = useQuery({ queryKey: ['inventory'], queryFn: () => inventoryApi.getAll().then((r) => r.data.data) });

  const stockFor = (itemId) => inventory?.find((i) => i.Item?.id === itemId)?.current_stock;

  const createMutation = useMutation({
    mutationFn: () => billingApi.create({
      ...customer,
      items: lines.filter((l) => l.item_id && l.quantity).map((l) => ({ item_id: l.item_id, quantity: l.quantity, unit_price: l.unit_price || 0 })),
    }),
    onSuccess: () => {
      toast.success('Bill created — inventory updated');
      qc.invalidateQueries(['bills']);
      qc.invalidateQueries(['inventory']);
      setCreateOpen(false);
      setCustomer({ customer_name: '', customer_contact: '' });
      setLines([{ ...emptyLine }]);
    },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed to create bill'),
  });

  const updateLine = (idx, field, value) => setLines((ls) => ls.map((l, i) => i === idx ? { ...l, [field]: value } : l));
  const addLine = () => setLines((ls) => [...ls, { ...emptyLine }]);
  const removeLine = (idx) => setLines((ls) => ls.filter((_, i) => i !== idx));

  const bills = data?.data || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1>Billing</h1>
          <p className="text-sm text-gray-500 mt-0.5">Sell item-master items to a customer — inventory reduces automatically</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setCreateOpen(true)}><Plus className="w-4 h-4" /> New Bill</button>
      </div>

      <Table headers={['Bill No.', 'Customer', 'Items', 'Total', 'Status', 'Date']} loading={isLoading}
        empty={<EmptyState title="No bills yet" description="Create a bill to sell item-master items and reduce stock" />}>
        {bills.map((b) => (
          <tr key={b.id} className="hover:bg-gray-50">
            <td className="table-td font-medium">{b.bill_number}</td>
            <td className="table-td">{b.customer_name}</td>
            <td className="table-td text-xs text-gray-500">{b.items?.length || 0} line(s)</td>
            <td className="table-td font-semibold">₹{Number(b.total_amount || 0).toLocaleString('en-IN')}</td>
            <td className="table-td"><StatusBadge status={b.status} /></td>
            <td className="table-td text-xs text-gray-500">{safeFormatDistanceToNow(b.created_at, { addSuffix: true })}</td>
          </tr>
        ))}
      </Table>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Bill" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Customer Name" required>
              <input className="input" value={customer.customer_name} onChange={(e) => setCustomer({ ...customer, customer_name: e.target.value })} />
            </Field>
            <Field label="Customer Contact">
              <input className="input" value={customer.customer_contact} onChange={(e) => setCustomer({ ...customer, customer_contact: e.target.value })} />
            </Field>
          </div>

          <div>
            <label className="label">Items (from Item Master)</label>
            <div className="space-y-2">
              {lines.map((line, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select className="input flex-1" value={line.item_id} onChange={(e) => updateLine(idx, 'item_id', e.target.value)}>
                    <option value="">Select item…</option>
                    {items?.map((it) => <option key={it.id} value={it.id}>{it.name} ({it.item_code || it.unit})</option>)}
                  </select>
                  <input className="input w-24" type="number" placeholder="Qty" value={line.quantity} onChange={(e) => updateLine(idx, 'quantity', e.target.value)} />
                  <input className="input w-28" type="number" placeholder="Unit Price" value={line.unit_price} onChange={(e) => updateLine(idx, 'unit_price', e.target.value)} />
                  {line.item_id && <span className="text-xs text-gray-400 w-20">Stock: {stockFor(line.item_id) ?? '—'}</span>}
                  <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg" onClick={() => removeLine(idx)} disabled={lines.length === 1}><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            <button className="text-sm text-brand-600 hover:underline mt-2 flex items-center gap-1" onClick={addLine}><Plus className="w-3.5 h-3.5" /> Add line</button>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button className="btn-secondary" onClick={() => setCreateOpen(false)}>Cancel</button>
          <button className="btn-primary flex items-center gap-2" disabled={createMutation.isPending || !customer.customer_name || !lines.some((l) => l.item_id && l.quantity)} onClick={() => createMutation.mutate()}>
            <Receipt className="w-4 h-4" />{createMutation.isPending ? 'Creating…' : 'Create Bill'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
