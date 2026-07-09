import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from '../api/services';
import { Table, EmptyState, StatusBadge, Modal, Field } from '../components/ui';
import { Wallet, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { safeFormatDistanceToNow } from '../utils/date';

// Payment sequence lives here: a queued payment (created from an invoice's
// "Queue Payment" button) is executed here, which generates a reference/UTR
// and marks the invoice paid. The order only closes once the vendor confirms
// receipt from their portal (see VendorPortalPaymentsPage).
export default function PaymentsPage() {
  const qc = useQueryClient();
  const [executeTarget, setExecuteTarget] = useState(null);
  const [method, setMethod] = useState('bank_transfer');
  const [reference, setReference] = useState('');

  const { data, isLoading } = useQuery({ queryKey: ['payments'], queryFn: () => paymentsApi.list({ per_page: 50 }).then((r) => r.data) });

  const executeMutation = useMutation({
    mutationFn: () => paymentsApi.execute(executeTarget.id, { method, reference_number: reference || undefined }),
    onSuccess: (res) => {
      toast.success(`Payment executed — reference ${res.data.data.reference_number}`);
      qc.invalidateQueries(['payments']);
      qc.invalidateQueries(['invoices']);
      setExecuteTarget(null);
      setReference('');
    },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed to execute payment'),
  });

  const payments = data?.data || [];

  return (
    <div className="space-y-4">
      <div>
        <h1>Payments</h1>
        <p className="text-sm text-gray-500 mt-0.5">Queued payments waiting to be executed, and payment history</p>
      </div>

      <Table headers={['Vendor', 'Invoice', 'Amount', 'Method', 'Status', 'Reference', 'Queued', 'Action']} loading={isLoading}
        empty={<EmptyState title="No payments yet" description="Payments appear here once an approved invoice is queued for payment" />}>
        {payments.map((p) => (
          <tr key={p.id} className="hover:bg-gray-50">
            <td className="table-td">{p.Vendor?.name || p.vendor_id?.slice(-6)}</td>
            <td className="table-td text-xs">{p.Invoice?.invoice_number || p.invoice_id?.slice(-6)}</td>
            <td className="table-td font-semibold">₹{Number(p.amount || 0).toLocaleString('en-IN')}</td>
            <td className="table-td capitalize">{p.method?.replace(/_/g, ' ')}</td>
            <td className="table-td"><StatusBadge status={p.status} /></td>
            <td className="table-td text-xs">{p.reference_number || '—'}</td>
            <td className="table-td text-xs text-gray-500">{safeFormatDistanceToNow(p.created_at, { addSuffix: true })}</td>
            <td className="table-td">
              {p.status === 'queued' && (
                <button className="btn-primary text-xs flex items-center gap-1.5" onClick={() => { setExecuteTarget(p); setMethod(p.method || 'bank_transfer'); }}>
                  <Wallet className="w-3.5 h-3.5" /> Execute
                </button>
              )}
              {p.status === 'confirmed' && <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Vendor confirmed</span>}
            </td>
          </tr>
        ))}
      </Table>

      <Modal open={!!executeTarget} onClose={() => setExecuteTarget(null)} title="Execute Payment" size="sm">
        {executeTarget && (
          <>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Executing payment of <strong>₹{Number(executeTarget.amount || 0).toLocaleString('en-IN')}</strong> to <strong>{executeTarget.Vendor?.name}</strong>.</p>
              <Field label="Payment Method" required>
                <select className="input" value={method} onChange={(e) => setMethod(e.target.value)}>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="neft">NEFT</option>
                  <option value="rtgs">RTGS</option>
                  <option value="upi">UPI</option>
                  <option value="ach">ACH</option>
                  <option value="cheque">Cheque</option>
                  <option value="card">Virtual Card</option>
                </select>
              </Field>
              <Field label="Reference / UTR (optional — auto-generated if left blank)">
                <input className="input" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="e.g. bank UTR number" />
              </Field>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button className="btn-secondary" onClick={() => setExecuteTarget(null)}>Cancel</button>
              <button className="btn-primary" disabled={executeMutation.isPending} onClick={() => executeMutation.mutate()}>{executeMutation.isPending ? 'Executing…' : 'Execute Payment'}</button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
