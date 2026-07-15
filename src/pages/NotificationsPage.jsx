// ── NOTIFICATIONS ─────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi, auditApi, usersApi, settingsApi } from '../api/services';
import { PageLoader, EmptyState, StatusBadge, Modal, Field } from '../components/ui';
import { Bell, Bot, Users, Plus, Trash2, Shield, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { safeFormatDistanceToNow } from '../utils/date';
import { useAuth } from '../context/AuthContext';

export function NotificationsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['notifications'], queryFn: () => notificationsApi.list({ per_page: 50 }).then((r) => r.data) });
  const markRead = useMutation({ mutationFn: (id) => notificationsApi.markRead(id), onSuccess: () => qc.invalidateQueries(['notifications']) });

  const notifs = data?.data || [];

  return (
    <div className="space-y-4">
      <h1>Notifications</h1>
      {isLoading ? <PageLoader /> : notifs.length === 0 ? (
        <div className="card"><EmptyState title="All caught up" description="You have no notifications" action={<Bell className="w-10 h-10 text-gray-300 mx-auto mt-2" />} /></div>
      ) : (
        <div className="space-y-2">
          {notifs.map((n) => (
            <div key={n.id} className={`card flex items-start gap-3 ${n.status !== 'read' ? 'border-l-4 border-l-brand-400' : ''}`}>
              <div className={`p-2 rounded-lg ${n.status !== 'read' ? 'bg-brand-50' : 'bg-gray-50'}`}><Bell className={`w-4 h-4 ${n.status !== 'read' ? 'text-brand-600' : 'text-gray-400'}`} /></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{n.payload?.title || n.type?.replace(/_/g, ' ')}</p>
                <p className="text-xs text-gray-500 mt-0.5">{n.payload?.message || ''}</p>
                <p className="text-xs text-gray-400 mt-1">{safeFormatDistanceToNow(n.created_at)}</p>
              </div>
              {n.status !== 'read' && <button className="text-xs text-brand-600 hover:underline shrink-0" onClick={() => markRead.mutate(n.id)}>Mark read</button>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── AUDIT LOGS ──────────────────────────────────────────────────────────────
export function AuditLogsPage() {
  const [filters, setFilters] = useState({ entity_type: '', user_id: '', page: 1 });
  const { data, isLoading } = useQuery({ queryKey: ['audit-logs', filters], queryFn: () => auditApi.list({ ...filters, per_page: 25 }).then((r) => r.data) });
  const logs = data?.data || [];

  return (
    <div className="space-y-4">
      <h1>Audit Log</h1>
      <div className="card">
        <div className="flex gap-3 mb-4 flex-wrap">
          <select className="input w-48" value={filters.entity_type} onChange={(e) => setFilters({ ...filters, entity_type: e.target.value, page: 1 })}>
            <option value="">All entities</option>
            {['PurchaseRequest', 'Rfq', 'Quote', 'PurchaseOrder', 'Invoice', 'Vendor', 'User', 'Company'].map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          {isLoading ? <PageLoader /> : logs.length === 0 ? (
            <EmptyState title="No audit records" description="All actions will appear here" />
          ) : logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
              <div className="w-2 h-2 bg-brand-400 rounded-full mt-2 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-mono font-medium text-gray-700">{log.action}</span>
                  <span className="badge-gray">{log.entity_type}</span>
                  {log.User && <span className="text-xs text-gray-500">by {log.User.name}</span>}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{safeFormatDistanceToNow(log.created_at)} · {log.ip_address}</p>
              </div>
              {log.after_value && (
                <details className="text-xs text-gray-400 cursor-pointer">
                  <summary>Details</summary>
                  <pre className="mt-1 bg-gray-50 p-2 rounded text-xs overflow-auto max-w-xs">{JSON.stringify(log.after_value, null, 2)}</pre>
                </details>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SETTINGS PAGE ────────────────────────────────────────────────────────────
export function SettingsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['settings'], queryFn: () => settingsApi.get().then((r) => r.data.data) });
  const [tab, setTab] = useState('company');
  const TABS = ['company', 'approvals', 'roles', 'plan'];

  const company = data?.company;

  // ── Company profile form ──────────────────────────────────────────────
  const [companyForm, setCompanyForm] = useState(null);
  useEffect(() => { if (company && !companyForm) setCompanyForm({ name: company.name || '', legal_name: company.legal_name || '', gstin: company.gstin || '', industry: company.industry || '', currency: company.currency || 'INR', timezone: company.timezone || 'Asia/Kolkata' }); }, [company]); // eslint-disable-line

  const saveCompanyMutation = useMutation({
    mutationFn: () => settingsApi.update({ company: companyForm }),
    onSuccess: () => { toast.success('Company profile saved'); qc.invalidateQueries(['settings']); },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed to save'),
  });

  // ── Approval thresholds ────────────────────────────────────────────────
  const [thresholds, setThresholds] = useState(null);
  useEffect(() => { if (company && !thresholds) setThresholds(company.approval_thresholds?.length ? company.approval_thresholds : [{ amount: '', levels: 1 }]); }, [company]); // eslint-disable-line

  const saveThresholdsMutation = useMutation({
    mutationFn: () => settingsApi.updateApprovalThresholds(thresholds.filter((t) => t.amount !== '').map((t) => ({ amount: Number(t.amount), levels: Number(t.levels) || 1 }))),
    onSuccess: () => { toast.success('Approval thresholds saved'); qc.invalidateQueries(['settings']); },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed to save'),
  });

  const addThreshold = () => setThresholds([...(thresholds || []), { amount: '', levels: 1 }]);
  const removeThreshold = (i) => setThresholds(thresholds.filter((_, idx) => idx !== i));
  const updateThreshold = (i, field, val) => setThresholds(thresholds.map((t, idx) => idx === i ? { ...t, [field]: val } : t));

  return (
    <div className="space-y-4">
      <h1>Settings</h1>
      <div className="flex gap-2 border-b border-gray-200">
        {TABS.map((t) => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition ${tab === t ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{t}</button>)}
      </div>

      {tab === 'company' && (
        <div className="card space-y-4">
          <h2 className="text-base">Company Profile</h2>
          {isLoading || !companyForm ? <PageLoader /> : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Company Name</label><input className="input" value={companyForm.name} onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })} /></div>
                <div><label className="label">Legal Name</label><input className="input" value={companyForm.legal_name} onChange={(e) => setCompanyForm({ ...companyForm, legal_name: e.target.value })} /></div>
                <div><label className="label">GSTIN</label><input className="input" value={companyForm.gstin} onChange={(e) => setCompanyForm({ ...companyForm, gstin: e.target.value })} /></div>
                <div><label className="label">Industry</label><input className="input" value={companyForm.industry} onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })} /></div>
                <div><label className="label">Currency</label><input className="input" value={companyForm.currency} onChange={(e) => setCompanyForm({ ...companyForm, currency: e.target.value })} /></div>
                <div><label className="label">Timezone</label><input className="input" value={companyForm.timezone} onChange={(e) => setCompanyForm({ ...companyForm, timezone: e.target.value })} /></div>
              </div>
              <button className="btn-primary" disabled={saveCompanyMutation.isPending} onClick={() => saveCompanyMutation.mutate()}>{saveCompanyMutation.isPending ? 'Saving…' : 'Save Changes'}</button>
            </>
          )}
        </div>
      )}

      {tab === 'approvals' && (
        <div className="card">
          <h2 className="text-base mb-3">Approval Thresholds</h2>
          <p className="text-sm text-gray-500 mb-4">Set the amount above which multi-level approvals are triggered. E.g. above ₹25,000 needs 1 approval level, above ₹1,00,000 needs 2.</p>
          {isLoading || !thresholds ? <PageLoader /> : (
            <>
              <div className="space-y-3">
                {thresholds.map((t, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <span className="text-sm text-gray-500">Above ₹</span>
                    <input className="input w-40" type="number" min="0" placeholder="Amount (₹)" value={t.amount} onChange={(e) => updateThreshold(i, 'amount', e.target.value)} />
                    <span className="text-sm text-gray-500">→ requires</span>
                    <input className="input w-20" type="number" min="1" placeholder="Levels" value={t.levels} onChange={(e) => updateThreshold(i, 'levels', e.target.value)} />
                    <span className="text-sm text-gray-500">approval level(s)</span>
                    <button type="button" className="text-gray-400 hover:text-red-500 ml-auto" onClick={() => removeThreshold(i)} title="Remove"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
              <button type="button" className="btn-secondary flex items-center gap-2 mt-3 text-sm" onClick={addThreshold}><Plus className="w-4 h-4" /> Add Threshold</button>
              <div><button className="btn-primary mt-4" disabled={saveThresholdsMutation.isPending} onClick={() => saveThresholdsMutation.mutate()}>{saveThresholdsMutation.isPending ? 'Saving…' : 'Save Thresholds'}</button></div>
            </>
          )}
        </div>
      )}

      {tab === 'roles' && <div className="card"><h2 className="text-base mb-2">Roles & Permissions</h2><p className="text-sm text-gray-500">Manage user roles from the <a href="/users" className="text-brand-600 hover:underline">Users page</a>.</p></div>}

      {tab === 'plan' && (
        <div className="card">
          <h2 className="text-base mb-3">Billing & Plan</h2>
          <div className="p-4 bg-brand-50 rounded-lg border border-brand-200">
            <p className="font-semibold text-brand-700 capitalize">{company?.plan || 'Starter'} Plan</p>
            <p className="text-sm text-gray-500 mt-1">To upgrade, contact support@procureai.app</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── AI ASSISTANT PAGE ─────────────────────────────────────────────────────
export function AiAssistantPage() {
  return (
    <div className="space-y-4">
      <h1>AI Assistant</h1>
      <div className="card text-center py-16">
        <Bot className="w-16 h-16 text-brand-300 mx-auto mb-4" />
        <h2 className="text-lg font-semibold mb-2">AI Procurement Copilot</h2>
        <p className="text-gray-500 max-w-md mx-auto text-sm mb-6">Ask anything about your procurement data — vendor performance, spend trends, pending approvals, reorder status, and more. Coming in Phase 2.</p>
        <span className="badge-blue">Coming Soon</span>
      </div>
    </div>
  );
}

// ── USERS PAGE ───────────────────────────────────────────────────────────────
export function UsersPage() {
  const qc = useQueryClient();
  const { can } = useAuth();
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role_id: '', department: '', phone: '' });

  // Role editor modal state. `editingRole: null` means "create a new role";
  // otherwise it holds the role being edited (name shown read-only, its
  // permission_ids pre-checked).
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleName, setRoleName] = useState('');
  const [selectedPermIds, setSelectedPermIds] = useState(new Set());

  const { data } = useQuery({ queryKey: ['users'], queryFn: () => usersApi.list({ per_page: 50 }).then((r) => r.data) });
  const { data: roles } = useQuery({ queryKey: ['roles'], queryFn: () => usersApi.listRoles().then((r) => r.data.data) });
  const { data: permissions } = useQuery({ queryKey: ['permissions'], queryFn: () => usersApi.listPermissions().then((r) => r.data.data) });

  const addMutation = useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => { toast.success('User invited'); qc.invalidateQueries(['users']); setAddOpen(false); setForm({ name: '', email: '', role_id: '', department: '', phone: '' }); },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed'),
  });

  const createRoleMutation = useMutation({
    mutationFn: usersApi.createRole,
    onSuccess: () => { toast.success('Role created'); qc.invalidateQueries(['roles']); closeRoleModal(); },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed to create role'),
  });

  const updatePermsMutation = useMutation({
    mutationFn: ({ id, permission_ids }) => usersApi.updateRolePermissions(id, { permission_ids }),
    onSuccess: () => { toast.success('Permissions updated'); qc.invalidateQueries(['roles']); closeRoleModal(); },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed to update permissions'),
  });

  const deleteRoleMutation = useMutation({
    mutationFn: usersApi.removeRole,
    onSuccess: () => { toast.success('Role deleted'); qc.invalidateQueries(['roles']); },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed to delete role'),
  });

  const users = data?.data || [];
  const canManageRoles = can('settings.edit');

  const openCreateRole = () => { setEditingRole(null); setRoleName(''); setSelectedPermIds(new Set()); setRoleModalOpen(true); };
  const openEditRole = (role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setSelectedPermIds(new Set((role.Permissions || []).map((p) => p.id)));
    setRoleModalOpen(true);
  };
  const closeRoleModal = () => { setRoleModalOpen(false); setEditingRole(null); };
  const togglePerm = (id) => {
    setSelectedPermIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const saveRole = () => {
    const permission_ids = Array.from(selectedPermIds);
    if (editingRole) updatePermsMutation.mutate({ id: editingRole.id, permission_ids });
    else createRoleMutation.mutate({ name: roleName, permission_ids });
  };

  // Groups permission codes by their prefix ("pr.view" -> "pr") so the
  // checkbox grid reads as one section per module instead of one long list.
  const permGroups = (permissions || []).reduce((acc, p) => {
    const group = p.code.split('.')[0];
    (acc[group] = acc[group] || []).push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Users</h1>
        <button className="btn-primary flex items-center gap-2" onClick={() => setAddOpen(true)}><Users className="w-4 h-4" /> Invite User</button>
      </div>
      <div className="card overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50"><tr><th className="table-th">Name</th><th className="table-th">Email</th><th className="table-th">Role</th><th className="table-th">Department</th><th className="table-th">Status</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="table-td font-medium">{u.name}</td>
                <td className="table-td text-sm text-gray-500">{u.email}</td>
                <td className="table-td"><span className="badge-blue">{u.Role?.name || '—'}</span></td>
                <td className="table-td">{u.department || '—'}</td>
                <td className="table-td"><StatusBadge status={u.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Roles & Permissions — lets an admin create custom roles (beyond the
          starter set every company now gets on signup) and adjust any
          role's permissions, so segregation of duties (Requester vs
          Approver vs Finance vs Warehouse, etc.) is actually configurable
          instead of everyone being stuck on one role. */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-lg font-semibold flex items-center gap-2"><Shield className="w-5 h-5 text-brand-600" /> Roles & Permissions</h2>
        {canManageRoles && (
          <button className="btn-secondary flex items-center gap-2" onClick={openCreateRole}><Plus className="w-4 h-4" /> New Role</button>
        )}
      </div>
      <div className="card overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50"><tr><th className="table-th">Role</th><th className="table-th">Type</th><th className="table-th">Permissions</th><th className="table-th"></th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {(roles || []).map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="table-td font-medium">{r.name}</td>
                <td className="table-td">{r.is_system ? <span className="badge-blue">Built-in</span> : <span className="badge-gray">Custom</span>}</td>
                <td className="table-td text-sm text-gray-500">{(r.Permissions || []).length} of {(permissions || []).length}</td>
                <td className="table-td text-right">
                  {canManageRoles && (
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-brand-600 hover:underline text-sm" onClick={() => openEditRole(r)}>Manage</button>
                      {!r.is_system && (
                        <button
                          className="text-red-500 hover:text-red-700"
                          title="Delete role"
                          onClick={() => { if (window.confirm(`Delete role "${r.name}"? This only works if no users currently hold it.`)) deleteRoleMutation.mutate(r.id); }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {!(roles || []).length && <tr><td colSpan={4} className="text-center py-6 text-sm text-gray-400">No roles yet</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Invite User" size="md">
        <div className="space-y-4">
          <Field label="Name" required><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Email" required><input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Role" required>
            <select className="input" value={form.role_id} onChange={(e) => setForm({ ...form, role_id: e.target.value })}>
              <option value="">Select role…</option>
              {roles?.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </Field>
          <Field label="Department"><input className="input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /></Field>
          <p className="text-xs text-gray-400">A temporary password (Temp@1234) will be set. User should change on first login.</p>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button className="btn-secondary" onClick={() => setAddOpen(false)}>Cancel</button>
          <button className="btn-primary" disabled={!form.name || !form.email || !form.role_id || addMutation.isPending} onClick={() => addMutation.mutate(form)}>{addMutation.isPending ? 'Inviting…' : 'Invite User'}</button>
        </div>
      </Modal>

      <Modal open={roleModalOpen} onClose={closeRoleModal} title={editingRole ? `Manage "${editingRole.name}" permissions` : 'New Role'} size="lg">
        <div className="space-y-4">
          {!editingRole && (
            <Field label="Role Name" required>
              <input className="input" value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="e.g. Regional Approver" />
            </Field>
          )}
          <div>
            <p className="text-xs text-gray-400 mb-2">Select every permission this role should have. Grouped by module.</p>
            <div className="max-h-96 overflow-y-auto space-y-4 border border-gray-100 rounded-lg p-3">
              {Object.keys(permGroups).sort().map((group) => (
                <div key={group}>
                  <p className="text-xs font-semibold uppercase text-gray-400 mb-1">{group}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {permGroups[group].map((p) => (
                      <label key={p.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={selectedPermIds.has(p.id)} onChange={() => togglePerm(p.id)} />
                        <span>{p.description || p.code}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              {!Object.keys(permGroups).length && <p className="text-sm text-gray-400 text-center py-4">No permissions loaded</p>}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button className="btn-secondary" onClick={closeRoleModal}>Cancel</button>
          <button
            className="btn-primary"
            disabled={(!editingRole && !roleName.trim()) || createRoleMutation.isPending || updatePermsMutation.isPending}
            onClick={saveRole}
          >
            {createRoleMutation.isPending || updatePermsMutation.isPending ? 'Saving…' : (editingRole ? 'Save Permissions' : 'Create Role')}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default NotificationsPage;
