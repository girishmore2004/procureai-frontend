import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { platformApi } from '../api/services';
import { StatCard, PageLoader, StatusBadge, Table, Alert } from '../components/ui';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import {
  Building2, Truck, ShoppingCart, FileText, Receipt, Warehouse, ClipboardList,
  AlertTriangle, Clock,
} from 'lucide-react';

// Cross-company, read-only. Every number here comes straight from
// GET /platform/* (see backend controllers/platformController.js), which is
// gated server-side by requirePlatformAdmin — this page is a second,
// client-side layer of that same restriction, not the only one.
export default function PlatformDashboardPage() {
  const { user } = useAuth();

  const enabled = !!user?.is_platform_admin;
  const { data: overview, isLoading: l1 } = useQuery({ queryKey: ['platform-overview'], queryFn: () => platformApi.getOverview().then((r) => r.data.data), enabled });
  const { data: approvals, isLoading: l2 } = useQuery({ queryKey: ['platform-approvals'], queryFn: () => platformApi.getApprovalBottlenecks().then((r) => r.data.data), enabled });
  const { data: trends, isLoading: l3 } = useQuery({ queryKey: ['platform-usage-trends'], queryFn: () => platformApi.getUsageTrends().then((r) => r.data.data), enabled });
  const { data: topEntities, isLoading: l4 } = useQuery({ queryKey: ['platform-top-entities'], queryFn: () => platformApi.getTopEntities().then((r) => r.data.data), enabled });
  const { data: alerts, isLoading: l5 } = useQuery({ queryKey: ['platform-alerts'], queryFn: () => platformApi.getAlerts().then((r) => r.data.data), enabled });

  if (!enabled) {
    return (
      <div className="max-w-lg mx-auto mt-12">
        <Alert type="error" message="This dashboard is restricted to platform-admin accounts. Contact ProcureAI ops if you believe you should have access." />
      </div>
    );
  }

  const loading = l1 || l2 || l3 || l4 || l5;
  const money = (v) => `₹${Number(v || 0).toLocaleString('en-IN')}`;

  return (
    <div className="space-y-6">
      <div>
        <h1>Platform Overview</h1>
        <p className="text-sm text-gray-500">Cross-company analytics — visible only to platform-admin accounts.</p>
      </div>

      {loading ? <PageLoader /> : (
        <>
          {/* Core counts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Total Buyers" value={overview?.total_buyers ?? '—'} icon={Building2} color="blue" />
            <StatCard title="Total Vendors" value={overview?.total_vendors ?? '—'} icon={Truck} color="purple"
              sub={`${overview?.active_vendors ?? 0} active · ${overview?.pending_vendor_onboarding ?? 0} pending onboarding`} />
            <StatCard title="Total RFQs" value={overview?.total_rfqs ?? '—'} icon={FileText} color="blue" />
            <StatCard title="Pending Approvals" value={overview?.pending_approvals ?? '—'} icon={ClipboardList} color="amber" />
            <StatCard title="Total Purchase Orders" value={overview?.total_purchase_orders ?? '—'} icon={ShoppingCart} color="green" />
            <StatCard title="Total Goods Receipts" value={overview?.total_goods_receipts ?? '—'} icon={Warehouse} color="green" />
            <StatCard title="Total Invoices" value={overview?.total_invoices ?? '—'} icon={Receipt} color="purple" />
            <StatCard title="Invoices Flagged for AI Review" value={overview?.invoices_flagged_ai_review ?? '—'} icon={AlertTriangle} color="red" />
          </div>

          {/* Pipeline health: OCR / matching / payment breakdowns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card">
              <h2 className="text-base mb-3">Quote OCR / Extraction Status</h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(overview?.quote_extraction_status || {}).length
                  ? Object.entries(overview.quote_extraction_status).map(([status, count]) => (
                    <div key={status} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <StatusBadge status={status} /><span className="text-sm font-semibold text-gray-700">{count}</span>
                    </div>
                  ))
                  : <p className="text-sm text-gray-400">No quotes yet</p>}
              </div>
            </div>
            <div className="card">
              <h2 className="text-base mb-3">Invoice Matching Status</h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(overview?.invoice_match_status || {}).length
                  ? Object.entries(overview.invoice_match_status).map(([status, count]) => (
                    <div key={status} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <StatusBadge status={status} /><span className="text-sm font-semibold text-gray-700">{count}</span>
                    </div>
                  ))
                  : <p className="text-sm text-gray-400">No invoices yet</p>}
              </div>
            </div>
            <div className="card">
              <h2 className="text-base mb-3">Invoice Payment Status</h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(overview?.invoice_payment_status || {}).length
                  ? Object.entries(overview.invoice_payment_status).map(([status, count]) => (
                    <div key={status} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <StatusBadge status={status} /><span className="text-sm font-semibold text-gray-700">{count}</span>
                    </div>
                  ))
                  : <p className="text-sm text-gray-400">No invoices yet</p>}
              </div>
            </div>
          </div>

          {/* Approval bottlenecks */}
          <div className="card">
            <h2 className="text-base mb-4">Approval Bottlenecks</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <StatCard title="Overdue Pending (&gt;48h)" value={approvals?.overdue_pending_count ?? '—'} icon={AlertTriangle} color="red" />
              <StatCard title="Avg Decision Time" value={approvals?.avg_decision_hours != null ? `${Number(approvals.avg_decision_hours).toFixed(1)}h` : '—'} icon={Clock} color="blue" />
              <StatCard title="Decided (Last 90 Days)" value={approvals?.decided_last_90_days ?? '—'} icon={ClipboardList} color="green" />
            </div>
            <Table headers={['Approvable Type', 'Status', 'Count']} empty={<p className="py-8 text-center text-sm text-gray-400">No approvals recorded yet</p>}>
              {(approvals?.breakdown || []).map((row, i) => (
                <tr key={i}>
                  <td className="table-td">{row.approvable_type?.replace(/_/g, ' ')}</td>
                  <td className="table-td"><StatusBadge status={row.status} /></td>
                  <td className="table-td">{row.count}</td>
                </tr>
              ))}
            </Table>
          </div>

          {/* Usage trends */}
          <div className="card">
            <h2 className="text-base mb-4">Platform Usage — Last 30 Days</h2>
            {trends?.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trends} margin={{ left: 10 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="rfqs" stroke="#2563eb" name="RFQs" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="purchase_orders" stroke="#10b981" name="Purchase Orders" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="invoices" stroke="#f59e0b" name="Invoices" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No activity in the last 30 days</div>}
          </div>

          {/* Top entities */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card">
              <h2 className="text-base mb-3">Top Vendors by Spend</h2>
              <Table headers={['Vendor', 'Spend', 'Orders']} empty={<p className="py-8 text-center text-sm text-gray-400">No PO spend yet</p>}>
                {(topEntities?.top_vendors || []).map((v) => (
                  <tr key={v.vendor_id}>
                    <td className="table-td">{v.vendor_name}</td>
                    <td className="table-td">{money(v.total_spend)}</td>
                    <td className="table-td">{v.order_count}</td>
                  </tr>
                ))}
              </Table>
            </div>
            <div className="card">
              <h2 className="text-base mb-3">Top Buyers by Spend</h2>
              <Table headers={['Company', 'Spend', 'Orders']} empty={<p className="py-8 text-center text-sm text-gray-400">No PO spend yet</p>}>
                {(topEntities?.top_buyers || []).map((b) => (
                  <tr key={b.company_id}>
                    <td className="table-td">{b.company_name}</td>
                    <td className="table-td">{money(b.total_spend)}</td>
                    <td className="table-td">{b.order_count}</td>
                  </tr>
                ))}
              </Table>
            </div>
            <div className="card">
              <h2 className="text-base mb-3">Top Categories by Spend</h2>
              <Table headers={['Category', 'Spend']} empty={<p className="py-8 text-center text-sm text-gray-400">No categorized spend yet</p>}>
                {(topEntities?.top_categories || []).map((c, i) => (
                  <tr key={i}>
                    <td className="table-td">{c.category}</td>
                    <td className="table-td">{money(c.total_spend)}</td>
                  </tr>
                ))}
              </Table>
            </div>
          </div>

          {/* Operational alerts */}
          <div className="card">
            <h2 className="text-base mb-4">Operational Alerts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Overdue Approvals ({alerts?.overdue_approvals?.length || 0})</h3>
                {alerts?.overdue_approvals?.length ? (
                  <ul className="space-y-1.5 text-sm">
                    {alerts.overdue_approvals.map((a) => (
                      <li key={a.id} className="flex justify-between border-b border-gray-100 pb-1.5">
                        <span className="text-gray-600">{a.company_name} · {a.approvable_type?.replace(/_/g, ' ')} (level {a.level})</span>
                        <span className="text-gray-400 text-xs">{new Date(a.created_at).toLocaleDateString('en-IN')}</span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-sm text-gray-400">None</p>}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Mismatched Invoices ({alerts?.mismatched_invoices?.length || 0})</h3>
                {alerts?.mismatched_invoices?.length ? (
                  <ul className="space-y-1.5 text-sm">
                    {alerts.mismatched_invoices.map((inv) => (
                      <li key={inv.id} className="flex justify-between border-b border-gray-100 pb-1.5">
                        <span className="text-gray-600">{inv.company_name} · {inv.invoice_number || '—'}</span>
                        <span className="text-gray-400 text-xs truncate max-w-[10rem]" title={inv.mismatch_reason}>{inv.mismatch_reason}</span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-sm text-gray-400">None</p>}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Rejected Purchase Orders ({alerts?.rejected_purchase_orders?.length || 0})</h3>
                {alerts?.rejected_purchase_orders?.length ? (
                  <ul className="space-y-1.5 text-sm">
                    {alerts.rejected_purchase_orders.map((po) => (
                      <li key={po.id} className="flex justify-between border-b border-gray-100 pb-1.5">
                        <span className="text-gray-600">{po.company_name} · {po.po_number}</span>
                        <span className="text-gray-400 text-xs">{new Date(po.created_at).toLocaleDateString('en-IN')}</span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-sm text-gray-400">None</p>}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Quote Extraction Issues ({alerts?.quote_extraction_issues?.length || 0})</h3>
                {alerts?.quote_extraction_issues?.length ? (
                  <ul className="space-y-1.5 text-sm">
                    {alerts.quote_extraction_issues.map((q) => (
                      <li key={q.id} className="flex justify-between border-b border-gray-100 pb-1.5">
                        <span className="text-gray-600">{q.company_name} · <StatusBadge status={q.extraction_status} /></span>
                        <span className="text-gray-400 text-xs truncate max-w-[10rem]" title={q.extraction_note}>{q.extraction_note}</span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-sm text-gray-400">None</p>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
