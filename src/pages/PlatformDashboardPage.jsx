import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { platformApi } from '../api/services';
import { StatCard, PageLoader, StatusBadge, Table, Alert } from '../components/ui';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid,
} from 'recharts';
import {
  Building2, Truck, ShoppingCart, FileText, Receipt, Warehouse, ClipboardList,
  AlertTriangle, Clock, ShieldCheck,
} from 'lucide-react';

// Same palette family as StatusBadge's badge-* classes in components/ui.jsx,
// just as hex so recharts can use them directly.
const STATUS_COLORS = {
  draft: '#9ca3af', pending: '#f59e0b', pending_approval: '#f59e0b', waiting: '#f59e0b',
  processing: '#3b82f6', sent: '#3b82f6', done: '#10b981', approved: '#10b981',
  matched: '#10b981', active: '#10b981', paid: '#10b981',
  needs_review: '#f59e0b', failed: '#ef4444', mismatched: '#ef4444', rejected: '#ef4444',
  unpaid: '#9ca3af', closed: '#9ca3af', cancelled: '#9ca3af',
};
const FALLBACK_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0891b2'];
const colorFor = (status, i) => STATUS_COLORS[status] || FALLBACK_COLORS[i % FALLBACK_COLORS.length];

const Section = ({ title, explain, children }) => (
  <div className="card">
    <h2 className="text-base font-semibold mb-1">{title}</h2>
    {explain && <p className="text-sm text-gray-500 mb-4">{explain}</p>}
    {children}
  </div>
);

const StatusPie = ({ data, empty }) => {
  const entries = Object.entries(data || {}).filter(([, v]) => v > 0);
  if (!entries.length) return <p className="text-sm text-gray-400 text-center py-10">{empty}</p>;
  const chartData = entries.map(([status, count]) => ({ status, count }));
  return (
    <div>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={chartData} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2}>
            {chartData.map((d, i) => <Cell key={d.status} fill={colorFor(d.status, i)} />)}
          </Pie>
          <Tooltip formatter={(v, n) => [v, n.replace(/_/g, ' ')]} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1">
        {chartData.map((d, i) => (
          <div key={d.status} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: colorFor(d.status, i) }} />
            {d.status.replace(/_/g, ' ')} ({d.count})
          </div>
        ))}
      </div>
    </div>
  );
};

// Cross-company, read-only. Every number here comes straight from
// GET /platform/* (see backend controllers/platformController.js), which is
// gated server-side by requirePlatformAdmin — this page is a second,
// client-side layer of that same restriction, not the only one.
//
// This is the ONLY page a platform-admin account sees (see Layout.jsx —
// their sidebar is trimmed to just this one item, and LoginPage.jsx routes
// them straight here instead of the regular buyer /dashboard). So unlike
// the rest of the app, this page tries to be fully self-contained: every
// section carries a one-line plain-language explanation of what it's
// showing and why it matters, since there's no other page to cross-reference.
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
  const totalAlerts = (alerts?.overdue_approvals?.length || 0) + (alerts?.mismatched_invoices?.length || 0)
    + (alerts?.rejected_purchase_orders?.length || 0) + (alerts?.quote_extraction_issues?.length || 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1>Platform Overview</h1>
          <p className="text-sm text-gray-500">
            A single, cross-company view of how ProcureAI is running — every buyer and vendor, combined. Nothing here is scoped to one
            company; it's the operator's view, not a buyer's.
          </p>
        </div>
      </div>

      {loading ? <PageLoader /> : (
        <>
          {/* At a glance */}
          <Section title="At a Glance" explain="Raw counts across every company on the platform, right now.">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="Total Buyers" value={overview?.total_buyers ?? '—'} icon={Building2} color="blue" />
              <StatCard title="Total Vendors" value={overview?.total_vendors ?? '—'} icon={Truck} color="purple"
                sub={`${overview?.active_vendors ?? 0} active · ${overview?.pending_vendor_onboarding ?? 0} pending onboarding`} />
              <StatCard title="Total RFQs" value={overview?.total_rfqs ?? '—'} icon={FileText} color="blue" />
              <StatCard title="Pending Approvals" value={overview?.pending_approvals ?? '—'} icon={ClipboardList} color="amber" />
              <StatCard title="Total Purchase Orders" value={overview?.total_purchase_orders ?? '—'} icon={ShoppingCart} color="green" />
              <StatCard title="Total Goods Receipts" value={overview?.total_goods_receipts ?? '—'} icon={Warehouse} color="green" />
              <StatCard title="Total Invoices" value={overview?.total_invoices ?? '—'} icon={Receipt} color="purple" />
              <StatCard title="Flagged for AI Review" value={overview?.invoices_flagged_ai_review ?? '—'} icon={AlertTriangle} color="red"
                sub="Invoices whose OCR extraction hasn't been human-checked yet" />
            </div>
          </Section>

          {/* Pipeline health: OCR / matching / payment breakdowns as pies */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Section title="Quote OCR / Extraction" explain="How well AI is reading vendor quote files. 'done' = clean read; 'needs review' or 'failed' means a human had to step in.">
              <StatusPie data={overview?.quote_extraction_status} empty="No quotes submitted yet" />
            </Section>
            <Section title="Invoice Matching" explain="3-way match results (invoice vs PO vs goods receipt). 'mismatched' invoices need finance attention.">
              <StatusPie data={overview?.invoice_match_status} empty="No invoices yet" />
            </Section>
            <Section title="Invoice Payment" explain="Of matched/approved invoices, how many have actually been marked paid vs still owed.">
              <StatusPie data={overview?.invoice_payment_status} empty="No invoices yet" />
            </Section>
          </div>

          {/* Approval bottlenecks */}
          <Section title="Approval Bottlenecks" explain="How fast approvers (across every company) are acting on purchase requests, POs, and invoices — and where things are stuck.">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
              <StatCard title="Overdue (>48h pending)" value={approvals?.overdue_pending_count ?? '—'} icon={AlertTriangle} color="red" />
              <StatCard title="Avg Decision Time" value={approvals?.avg_decision_hours != null ? `${Number(approvals.avg_decision_hours).toFixed(1)}h` : '—'} icon={Clock} color="blue" />
              <StatCard title="Decided (Last 90 Days)" value={approvals?.decided_last_90_days ?? '—'} icon={ClipboardList} color="green" />
            </div>
            {approvals?.breakdown?.length ? (
              <ResponsiveContainer width="100%" height={Math.max(160, approvals.breakdown.length * 34)}>
                <BarChart data={approvals.breakdown.map((r) => ({ ...r, label: `${r.approvable_type?.replace(/_/g, ' ')} · ${r.status}` }))} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="label" width={180} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {approvals.breakdown.map((r, i) => <Cell key={i} fill={colorFor(r.status, i)} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-sm text-gray-400 text-center py-8">No approvals recorded yet</p>}
          </Section>

          {/* Usage trends */}
          <Section title="Platform Usage — Last 30 Days" explain="New RFQs, purchase orders, and invoices created each day across all companies. A quick read on whether platform activity is growing, flat, or dropping.">
            {trends?.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trends} margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
          </Section>

          {/* Top entities */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Section title="Top Vendors" explain="Ranked by total ₹ spent against them across all buyers, from purchase orders.">
              {topEntities?.top_vendors?.length ? (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={topEntities.top_vendors.slice(0, 5)} layout="vertical" margin={{ left: 10 }}>
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="vendor_name" width={100} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v) => money(v)} />
                      <Bar dataKey="total_spend" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <Table headers={['Vendor', 'Spend', 'Orders']}>
                    {topEntities.top_vendors.map((v) => (
                      <tr key={v.vendor_id}>
                        <td className="table-td">{v.vendor_name}</td>
                        <td className="table-td">{money(v.total_spend)}</td>
                        <td className="table-td">{v.order_count}</td>
                      </tr>
                    ))}
                  </Table>
                </>
              ) : <p className="py-8 text-center text-sm text-gray-400">No PO spend yet</p>}
            </Section>
            <Section title="Top Buyers" explain="Ranked by total ₹ spent, from purchase orders they've placed.">
              {topEntities?.top_buyers?.length ? (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={topEntities.top_buyers.slice(0, 5)} layout="vertical" margin={{ left: 10 }}>
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="company_name" width={100} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v) => money(v)} />
                      <Bar dataKey="total_spend" fill="#2563eb" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <Table headers={['Company', 'Spend', 'Orders']}>
                    {topEntities.top_buyers.map((b) => (
                      <tr key={b.company_id}>
                        <td className="table-td">{b.company_name}</td>
                        <td className="table-td">{money(b.total_spend)}</td>
                        <td className="table-td">{b.order_count}</td>
                      </tr>
                    ))}
                  </Table>
                </>
              ) : <p className="py-8 text-center text-sm text-gray-400">No PO spend yet</p>}
            </Section>
            <Section title="Top Categories" explain="Item categories with the most ₹ flowing through purchase orders.">
              {topEntities?.top_categories?.length ? (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={topEntities.top_categories.slice(0, 5)} layout="vertical" margin={{ left: 10 }}>
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="category" width={100} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v) => money(v)} />
                      <Bar dataKey="total_spend" fill="#10b981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <Table headers={['Category', 'Spend']}>
                    {topEntities.top_categories.map((c, i) => (
                      <tr key={i}>
                        <td className="table-td">{c.category}</td>
                        <td className="table-td">{money(c.total_spend)}</td>
                      </tr>
                    ))}
                  </Table>
                </>
              ) : <p className="py-8 text-center text-sm text-gray-400">No categorized spend yet</p>}
            </Section>
          </div>

          {/* Operational alerts */}
          <Section title="Operational Alerts" explain={`${totalAlerts} item${totalAlerts === 1 ? '' : 's'} across the platform currently need attention — approvals stuck too long, invoices that failed matching, rejected POs, and quotes AI couldn't read.`}>
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
          </Section>
        </>
      )}
    </div>
  );
}
