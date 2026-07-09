import React from 'react';
import { X, Loader2, Package, Search, AlertCircle, CheckCircle2, XCircle, Info } from 'lucide-react';

// ── Spinner ─────────────────────────────────────────────────────────
export const Spinner = ({ size = 'md' }) => {
  const s = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : 'w-6 h-6';
  return <Loader2 className={`${s} animate-spin text-brand-600`} />;
};

export const PageLoader = () => (
  <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>
);

// ── Status badge ────────────────────────────────────────────────────
const STATUS_MAP = {
  draft: 'badge-gray', pending_approval: 'badge-amber', pending: 'badge-amber',
  approved: 'badge-green', active: 'badge-green', matched: 'badge-green', accepted: 'badge-green',
  sent: 'badge-blue', processing: 'badge-blue', responded: 'badge-blue',
  rejected: 'badge-red', mismatched: 'badge-red', failed: 'badge-red', stockout: 'badge-red',
  needs_review: 'badge-amber', reorder_now: 'badge-amber', low: 'badge-amber',
  selected: 'badge-green', closed: 'badge-gray', cancelled: 'badge-gray',
  converted_to_rfq: 'badge-blue', done: 'badge-green', received: 'badge-green', ok: 'badge-green',
  partially_received: 'badge-amber', unpaid: 'badge-gray', paid: 'badge-green',
  payment_queued: 'badge-amber', queued: 'badge-amber', executed: 'badge-blue',
  confirmed: 'badge-green', issued: 'badge-blue',
};

export const StatusBadge = ({ status }) => {
  const cls = STATUS_MAP[status] || 'badge-gray';
  return <span className={cls}>{status?.replace(/_/g, ' ')}</span>;
};

// ── Empty state ──────────────────────────────────────────────────────
export const EmptyState = ({ title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
      <Package className="w-6 h-6 text-gray-400" />
    </div>
    <h3 className="text-base font-semibold text-gray-800 mb-1">{title}</h3>
    {description && <p className="text-sm text-gray-500 mb-4 max-w-xs">{description}</p>}
    {action}
  </div>
);

// ── Modal ────────────────────────────────────────────────────────────
export const Modal = ({ open, onClose, title, children, size = 'md' }) => {
  if (!open) return null;
  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-[2px]" onClick={onClose}>
      <div className={`bg-white rounded-2xl shadow-popover w-full ${widths[size]} max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

// ── Form field ───────────────────────────────────────────────────────
export const Field = ({ label, error, children, required }) => (
  <div>
    <label className="label">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
    {children}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

// ── Table wrapper ────────────────────────────────────────────────────
export const Table = ({ headers, children, loading, empty }) => (
  <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-card">
    <table className="min-w-full divide-y divide-gray-200 bg-white">
      <thead className="bg-gray-50/80">
        <tr>{headers.map((h) => <th key={h} className="table-th">{h}</th>)}</tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {loading ? (
          <tr><td colSpan={headers.length} className="py-12 text-center"><Spinner /></td></tr>
        ) : (Array.isArray(children) ? children.length > 0 : children) ? children : (
        <tr><td colSpan={headers.length}>{empty}</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

// ── Confirm dialog ───────────────────────────────────────────────────
export const Confirm = ({ open, onClose, onConfirm, title, message, danger }) => (
  <Modal open={open} onClose={onClose} title={title} size="sm">
    <p className="text-sm text-gray-600 mb-6">{message}</p>
    <div className="flex justify-end gap-3">
      <button className="btn-secondary" onClick={onClose}>Cancel</button>
      <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm}>Confirm</button>
    </div>
  </Modal>
);

// ── Stat card ────────────────────────────────────────────────────────
export const StatCard = ({ title, value, sub, icon: Icon, color = 'blue' }) => {
  const colors = {
    blue: 'bg-brand-50 text-brand-600', green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600', red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600', gold: 'bg-accent-50 text-accent-600',
  };
  return (
    <div className="card card-hover flex items-start gap-4">
      {Icon && <div className={`p-2.5 rounded-xl ${colors[color]}`}><Icon className="w-5 h-5" /></div>}
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium truncate">{title}</p>
        <p className="text-2xl font-bold text-ink mt-0.5 tracking-tight">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
};

// ── Search input ─────────────────────────────────────────────────────
export const SearchInput = ({ value, onChange, placeholder = 'Search...' }) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    <input className="input pl-9" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
  </div>
);

// ── Alert banner ─────────────────────────────────────────────────────
export const Alert = ({ type = 'info', message }) => {
  const styles = {
    info: { cls: 'bg-blue-50 text-blue-700 border-blue-200', Icon: Info },
    error: { cls: 'bg-red-50 text-red-700 border-red-200', Icon: XCircle },
    success: { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', Icon: CheckCircle2 },
    warning: { cls: 'bg-amber-50 text-amber-700 border-amber-200', Icon: AlertCircle },
  };
  const { cls, Icon } = styles[type] || styles.info;
  return (
    <div className={`flex items-start gap-2.5 p-3.5 rounded-xl border text-sm ${cls}`}>
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
};

// ── Pagination ───────────────────────────────────────────────────────
export const Pagination = ({ page, total, perPage, onPage }) => {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
      <span>{(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}</span>
      <div className="flex gap-2">
        <button className="btn-secondary py-1.5" disabled={page === 1} onClick={() => onPage(page - 1)}>Prev</button>
        <button className="btn-secondary py-1.5" disabled={page === pages} onClick={() => onPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};
