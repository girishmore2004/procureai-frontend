import React from 'react';
import { X, Loader2, Package, Search, AlertCircle } from 'lucide-react';

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
};

export const StatusBadge = ({ status }) => {
  const cls = STATUS_MAP[status] || 'badge-gray';
  return <span className={cls}>{status?.replace(/_/g, ' ')}</span>;
};

// ── Empty state ──────────────────────────────────────────────────────
export const EmptyState = ({ title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <Package className="w-12 h-12 text-gray-300 mb-4" />
    <h3 className="text-base font-semibold text-gray-700 mb-1">{title}</h3>
    {description && <p className="text-sm text-gray-500 mb-4 max-w-xs">{description}</p>}
    {action}
  </div>
);

// ── Modal ────────────────────────────────────────────────────────────
export const Modal = ({ open, onClose, title, children, size = 'md' }) => {
  if (!open) return null;
  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className={`bg-white rounded-xl shadow-xl w-full ${widths[size]} max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 py-4">{children}</div>
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
  <div className="overflow-x-auto rounded-xl border border-gray-200">
    <table className="min-w-full divide-y divide-gray-200 bg-white">
      <thead className="bg-gray-50">
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
  const colors = { blue: 'bg-blue-50 text-blue-600', green: 'bg-green-50 text-green-600', amber: 'bg-amber-50 text-amber-600', red: 'bg-red-50 text-red-600', purple: 'bg-purple-50 text-purple-600' };
  return (
    <div className="card flex items-start gap-4">
      {Icon && <div className={`p-2.5 rounded-lg ${colors[color]}`}><Icon className="w-5 h-5" /></div>}
      <div>
        <p className="text-xs text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
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
  const styles = { info: 'bg-blue-50 text-blue-700 border-blue-200', error: 'bg-red-50 text-red-700 border-red-200', success: 'bg-green-50 text-green-700 border-green-200', warning: 'bg-amber-50 text-amber-700 border-amber-200' };
  return (
    <div className={`flex items-start gap-2 p-3 rounded-lg border text-sm ${styles[type]}`}>
      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
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
        <button className="btn-secondary py-1" disabled={page === 1} onClick={() => onPage(page - 1)}>Prev</button>
        <button className="btn-secondary py-1" disabled={page === pages} onClick={() => onPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};
