import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { poApi } from '../api/services';
import { Table, EmptyState, StatusBadge, PageLoader } from '../components/ui';
import { Send, Download, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { safeFormatDistanceToNow } from '../utils/date';

export function PurchaseOrdersPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['pos'],
    queryFn: () => poApi.list({ per_page: 50 }).then((r) => r.data),
  });
  const pos = data?.data || [];

  return (
    <div className="space-y-4">
      <h1>Purchase Orders</h1>
      <Table headers={['PO Number', 'Vendor', 'Amount', 'Expected Delivery', 'Created', 'Status']} loading={isLoading}
        empty={<EmptyState title="No purchase orders yet" description="POs are created after vendor selection from a quote comparison" />}>
        {pos.map((po) => (
          <tr key={po.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/purchase-orders/${po.id}`)}>
            <td className="table-td"><Link to={`/purchase-orders/${po.id}`} className="text-brand-600 hover:underline font-medium">{po.po_number}</Link></td>
            <td className="table-td">{po.Vendor?.name || '—'}</td>
            <td className="table-td font-semibold">₹{Number(po.total_amount || 0).toLocaleString('en-IN')}</td>
            <td className="table-td text-xs">{po.expected_delivery_date || '—'}</td>
            <td className="table-td text-xs text-gray-500">{safeFormatDistanceToNow(po.created_at, { addSuffix: true })}</td>
            <td className="table-td"><StatusBadge status={po.status} /></td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

export function PurchaseOrderDetailPage() {
  const { id } = useParams();
  const qc = useQueryClient();

  const { data: po, isLoading } = useQuery({
    queryKey: ['po', id],
    queryFn: () => poApi.getOne(id).then((r) => r.data.data),
  });

  const sendMutation = useMutation({
    mutationFn: () => poApi.send(id),
    onSuccess: () => { toast.success('PO sent to vendor'); qc.invalidateQueries(['po', id]); },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed'),
  });

  const downloadPdf = async () => {
    try {
      const res = await poApi.downloadPdf(id);
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a'); a.href = url; a.download = `PO-${po.po_number}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error('Download failed'); }
  };

  if (isLoading) return <PageLoader />;
  if (!po) return <div className="card text-gray-500">PO not found</div>;

  const steps = ['draft', 'sent', 'partially_received', 'received', 'closed'];
  const currentStep = steps.indexOf(po.status);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/purchase-orders" className="hover:text-brand-600">Purchase Orders</Link>
        <span>/</span><span className="text-gray-900 font-medium">{po.po_number}</span>
      </div>

      <div className="card">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
          <div>
            <h1 className="mb-1">{po.po_number}</h1>
            <p className="text-sm text-gray-500">Vendor: <strong>{po.Vendor?.name}</strong> · {po.Vendor?.email}</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary flex items-center gap-2" onClick={downloadPdf}><Download className="w-4 h-4" /> PDF</button>
            {['draft', 'approved'].includes(po.status) && (
              <button className="btn-primary flex items-center gap-2" onClick={() => sendMutation.mutate()} disabled={sendMutation.isPending}>
                <Send className="w-4 h-4" />{sendMutation.isPending ? 'Sending…' : 'Send to Vendor'}
              </button>
            )}
          </div>
        </div>

        {/* Status timeline */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex flex-col items-center shrink-0 ${i <= currentStep ? 'text-brand-600' : 'text-gray-300'}`}>
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold ${i < currentStep ? 'bg-brand-600 border-brand-600 text-white' : i === currentStep ? 'border-brand-600 text-brand-600' : 'border-gray-200 text-gray-300'}`}>
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <span className="text-xs mt-1 capitalize">{s.replace(/_/g, ' ')}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 min-w-6 ${i < currentStep ? 'bg-brand-500' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4 pb-4 border-b border-gray-100">
          <div><p className="text-xs text-gray-400">Expected Delivery</p><p className="font-medium">{po.expected_delivery_date || '—'}</p></div>
          <div><p className="text-xs text-gray-400">Delivery Location</p><p className="font-medium">{po.delivery_location || '—'}</p></div>
          <div><p className="text-xs text-gray-400">Total Amount</p><p className="font-bold text-brand-700">₹{Number(po.total_amount || 0).toLocaleString('en-IN')}</p></div>
          <div><p className="text-xs text-gray-400">Status</p><StatusBadge status={po.status} /></div>
        </div>

        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Line Items</h2>
        <table className="min-w-full divide-y divide-gray-100 border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr><th className="table-th">Item</th><th className="table-th">Qty Ordered</th><th className="table-th">Qty Received</th><th className="table-th">Unit Price</th><th className="table-th">Total</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {po.items?.map((it) => (
              <tr key={it.id}>
                <td className="table-td">{it.item_name}</td>
                <td className="table-td">{it.quantity}</td>
                <td className="table-td">
                  <span className={parseFloat(it.received_quantity) >= parseFloat(it.quantity) ? 'text-green-600 font-medium' : parseFloat(it.received_quantity) > 0 ? 'text-amber-600' : 'text-gray-400'}>
                    {it.received_quantity || 0}
                  </span>
                </td>
                <td className="table-td">₹{Number(it.unit_price || 0).toLocaleString('en-IN')}</td>
                <td className="table-td font-medium">₹{Number(it.total_price || 0).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {po.status === 'sent' && (
          <div className="mt-4">
            <Link to="/goods-receipts" className="btn-secondary inline-flex items-center gap-2">
              <FileText className="w-4 h-4" /> Record Delivery (GRN)
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default PurchaseOrdersPage;
