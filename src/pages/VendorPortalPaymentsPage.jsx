import React, { useEffect, useState } from 'react';
import { VendorPortalLayout } from './VendorPortalDashboard';
import api from '../api/client';
import { StatusBadge } from '../components/ui';
import { Wallet, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { safeFormatDistanceToNow } from '../utils/date';

// Final step of the payment sequence: the vendor confirms receipt of an
// executed payment here, which closes the linked order on the buyer side.
export default function VendorPortalPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/vendor-portal/payments')
      .then((r) => setPayments(r.data.data))
      .catch(() => toast.error('Failed to load payments'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const confirm = async (id) => {
    setConfirmingId(id);
    try {
      await api.post(`/vendor-portal/payments/${id}/confirm`);
      toast.success('Payment receipt confirmed — order closed');
      load();
    } catch (e) {
      toast.error(e.response?.data?.error?.message || 'Failed to confirm');
    } finally {
      setConfirmingId(null);
    }
  };

  return (
    <VendorPortalLayout title="Payment History">
      <div className="card overflow-x-auto">
        {loading ? (
          <p className="text-sm text-gray-400 text-center py-8">Loading…</p>
        ) : payments.length === 0 ? (
          <div className="text-center py-10">
            <Wallet className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No payments yet</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr>
                <th className="table-th">PO</th>
                <th className="table-th">Amount</th>
                <th className="table-th">Method</th>
                <th className="table-th">Reference</th>
                <th className="table-th">Status</th>
                <th className="table-th">Date</th>
                <th className="table-th"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="table-td text-xs">{p.PurchaseOrder?.po_number || p.purchase_order_id?.slice(-6) || '—'}</td>
                  <td className="table-td font-semibold">₹{Number(p.amount || 0).toLocaleString('en-IN')}</td>
                  <td className="table-td capitalize">{p.method?.replace(/_/g, ' ')}</td>
                  <td className="table-td text-xs">{p.reference_number || '—'}</td>
                  <td className="table-td"><StatusBadge status={p.status} /></td>
                  <td className="table-td text-xs text-gray-500">{safeFormatDistanceToNow(p.created_at, { addSuffix: true })}</td>
                  <td className="table-td">
                    {p.status === 'executed' && (
                      <button className="btn-primary text-xs flex items-center gap-1.5" disabled={confirmingId === p.id} onClick={() => confirm(p.id)}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> {confirmingId === p.id ? 'Confirming…' : 'Confirm Receipt'}
                      </button>
                    )}
                    {p.status === 'confirmed' && <span className="text-xs text-green-600">Confirmed</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </VendorPortalLayout>
  );
}
