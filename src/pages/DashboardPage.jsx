import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi, prApi, approvalsApi } from '../api/services';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StatCard, StatusBadge, PageLoader, EmptyState } from '../components/ui';
import { ClipboardList, AlertTriangle, Clock, FileText, Plus, TrendingUp, Bell, CheckCircle } from 'lucide-react';
import { safeFormatDistanceToNow } from '../utils/date';

export default function DashboardPage() {
  const { user, can } = useAuth();

  const { data: kpis, isLoading: kpiLoading } = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: () => analyticsApi.getDashboard().then((r) => r.data.data),
  });

  const { data: recentPRs } = useQuery({
    queryKey: ['recent-prs'],
    queryFn: () => prApi.list({ per_page: 5 }).then((r) => r.data.data),
  });

  const { data: pendingApprovals } = useQuery({
    queryKey: ['pending-approvals'],
    queryFn: () => approvalsApi.getPending({ per_page: 5 }).then((r) => r.data.data),
  });

  if (kpiLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">Here's what's happening in procurement today</p>
        </div>
        {can('pr.create') && (
          <Link to="/purchase-requests" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Request
          </Link>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Open Requests" value={kpis?.open_requests ?? 0} icon={ClipboardList} color="blue" />
        <StatCard title="Pending Approvals" value={kpis?.pending_approvals ?? 0} icon={Clock} color="amber" />
        <StatCard title="Awaiting Quotes" value={kpis?.awaiting_quotes ?? 0} icon={FileText} color="purple" />
        <StatCard title="Reorder Alerts" value={kpis?.reorder_alerts ?? 0} icon={AlertTriangle} color="red" />
        <StatCard title="Invoice Mismatches" value={kpis?.invoice_mismatches ?? 0} icon={Bell} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent PRs */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base">Recent Purchase Requests</h2>
            <Link to="/purchase-requests" className="text-xs text-brand-600 hover:underline">View all</Link>
          </div>
          {recentPRs?.length ? (
            <div className="space-y-2">
              {recentPRs.map((pr) => (
                <Link key={pr.id} to={`/purchase-requests/${pr.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition border border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{pr.pr_number}</p>
                    <p className="text-xs text-gray-500">{pr.department} · {safeFormatDistanceToNow(pr.created_at, { addSuffix: true })}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-700">₹{Number(pr.total_estimated_amount).toLocaleString('en-IN')}</span>
                    <StatusBadge status={pr.status} />
                  </div>
                </Link>
              ))}
            </div>
          ) : <EmptyState title="No purchase requests yet" description="Create your first purchase request to get started" action={can('pr.create') && <Link to="/purchase-requests" className="btn-primary text-sm">Create Request</Link>} />}
        </div>

        {/* Pending Approvals */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base">Pending Your Approval</h2>
            <Link to="/approvals" className="text-xs text-brand-600 hover:underline">View all</Link>
          </div>
          {pendingApprovals?.length ? (
            <div className="space-y-2">
              {pendingApprovals.map((ap) => (
                <div key={ap.id} className="flex items-center justify-between p-3 rounded-lg border border-amber-100 bg-amber-50">
                  <div>
                    <p className="text-sm font-medium text-gray-800 capitalize">{ap.approvable_type?.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-gray-500">Level {ap.level} · {safeFormatDistanceToNow(ap.created_at, { addSuffix: true })}</p>
                  </div>
                  <Link to="/approvals" className="text-xs text-brand-600 font-medium hover:underline">Review →</Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle className="w-10 h-10 text-green-400 mb-3" />
              <p className="text-sm text-gray-500">All caught up! Nothing pending your approval.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { to: '/rfqs', label: 'Manage RFQs', icon: FileText },
          { to: '/vendors', label: 'Vendor List', icon: ClipboardList },
          { to: '/inventory', label: 'Stock Levels', icon: AlertTriangle },
          { to: '/analytics', label: 'Analytics', icon: TrendingUp },
        ].map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className="card flex items-center gap-3 hover:shadow-md transition p-4 cursor-pointer">
            <Icon className="w-5 h-5 text-brand-600" />
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
