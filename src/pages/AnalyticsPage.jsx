import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/services';
import { StatCard, PageLoader } from '../components/ui';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Clock, CheckCircle } from 'lucide-react';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AnalyticsPage() {
  const [spendGroup, setSpendGroup] = useState('vendor');

  const { data: spend, isLoading: spendLoading } = useQuery({ queryKey: ['spend', spendGroup], queryFn: () => analyticsApi.getSpend({ group_by: spendGroup }).then((r) => r.data.data) });
  const { data: cycle } = useQuery({ queryKey: ['cycle-times'], queryFn: () => analyticsApi.getCycleTimes().then((r) => r.data.data) });
  const { data: perf } = useQuery({ queryKey: ['vendor-perf'], queryFn: () => analyticsApi.getVendorPerformance().then((r) => r.data.data) });
  const { data: savings } = useQuery({ queryKey: ['savings'], queryFn: () => analyticsApi.getSavings().then((r) => r.data.data) });

  const spendData = (spend || []).map((r) => ({ name: r.vendor_name || r.category || '—', value: parseFloat(r.total_spend) || 0 })).slice(0, 10);
  const perfData = (perf || []).reduce((acc, r) => {
    const existing = acc.find((x) => x.vendor_name === r.vendor_name);
    if (!existing) acc.push({ vendor_name: r.vendor_name, overall_score: parseFloat(r.overall_score) });
    return acc;
  }, []).slice(0, 8);

  return (
    <div className="space-y-6">
      <h1>Analytics</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Savings (AI)" value={savings ? `₹${Number(savings.total_savings || 0).toLocaleString('en-IN')}` : '—'} icon={TrendingDown} color="green" sub={`${savings?.recommendation_count || 0} recommendations`} />
        <StatCard title="Avg PR→Approval" value={cycle ? `${Number(cycle.avg_pr_to_approval_hours || 0).toFixed(1)}h` : '—'} icon={Clock} color="blue" />
        <StatCard title="Avg Quote→PO" value={cycle ? `${Number(cycle.avg_quote_to_po_hours || 0).toFixed(1)}h` : '—'} icon={TrendingUp} color="purple" />
        <StatCard title="Total POs" value={cycle?.total_pos ?? '—'} icon={CheckCircle} color="green" />
      </div>

      {/* Spend Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base">Spend Analysis</h2>
          <div className="flex gap-2">
            <button className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${spendGroup === 'vendor' ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} onClick={() => setSpendGroup('vendor')}>By Vendor</button>
            <button className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${spendGroup === 'category' ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} onClick={() => setSpendGroup('category')}>By Category</button>
          </div>
        </div>
        {spendLoading ? <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Loading…</div> : spendData.length ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={spendData} margin={{ left: 20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} />
              <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} name="Spend" />
            </BarChart>
          </ResponsiveContainer>
        ) : <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No spend data yet</div>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendor Performance */}
        <div className="card">
          <h2 className="text-base mb-4">Vendor Scores</h2>
          {perfData.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={perfData} layout="vertical">
                <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 11 }} />
                <YAxis dataKey="vendor_name" type="category" tick={{ fontSize: 11 }} width={100} />
                <Tooltip />
                <Bar dataKey="overall_score" fill="#10b981" radius={[0, 4, 4, 0]} name="Score" />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No vendor scores yet. Run scoring from vendor list.</div>}
        </div>

        {/* Spend Distribution Pie */}
        <div className="card">
          <h2 className="text-base mb-4">Spend Distribution</h2>
          {spendData.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={spendData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {spendData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data yet</div>}
        </div>
      </div>
    </div>
  );
}
