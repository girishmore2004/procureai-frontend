// ── ITEMS PAGE ────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemsApi } from '../api/services';
import { Table, EmptyState, StatusBadge, SearchInput, Modal, Field, Pagination, Confirm } from '../components/ui';
import { Plus, Upload, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function ItemsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name: '', category: '', unit: '', brand: '', hsn_sac: '', tax_rate: '', reorder_level: '', safety_stock: '', avg_usage_per_month: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['items', search, page],
    queryFn: () => itemsApi.list({ search, page, per_page: 20 }).then((r) => r.data),
  });

  const addMutation = useMutation({
  mutationFn: itemsApi.create,
  onSuccess: () => {
    toast.success('Item added');
    qc.invalidateQueries({ queryKey: ['items'] });
    setAddOpen(false);
    setForm({ name: '', category: '', unit: '', brand: '', hsn_sac: '', tax_rate: '', reorder_level: '', safety_stock: '', avg_usage_per_month: '' });
  },
  onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed'),
});

  const deleteMutation = useMutation({
    mutationFn: (id) => itemsApi.remove(id),
    onSuccess: () => { toast.success('Item archived'); qc.invalidateQueries({ queryKey: ['items'] }); setDeleteTarget(null); },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed to delete item'),
  });

  const handleImport = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    try {
      const { data: d } = await itemsApi.importCsv(file);
      const { created, total, errors } = d.data;
      if (errors?.length) {
        toast.error(`Imported ${created} of ${total}. ${errors.length} row(s) failed — first issue: ${errors[0].message}`, { duration: 8000 });
      } else {
        toast.success(`Imported ${created} items`);
      }
      qc.invalidateQueries({ queryKey: ['items'] });
      setImportOpen(false);
    } catch (err) { toast.error(err.response?.data?.error?.message || 'Import failed'); }
  };

  const items = data?.data || [];
  const meta = data?.meta || {};

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1>Item Master</h1>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2" onClick={() => setImportOpen(true)}><Upload className="w-4 h-4" /> Import</button>
          <button className="btn-primary flex items-center gap-2" onClick={() => setAddOpen(true)}><Plus className="w-4 h-4" /> Add Item</button>
        </div>
      </div>
      <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search items…" />
      <Table headers={['Name / Code', 'Category', 'Unit', 'HSN/SAC', 'Tax %', 'Reorder Level', 'Status', '']} loading={isLoading}
        empty={<EmptyState title="No items yet" description="Add items to your catalog" action={<button className="btn-primary mt-2" onClick={() => setAddOpen(true)}>Add Item</button>} />}>
        {items.map((it) => (
          <tr key={it.id} className="hover:bg-gray-50">
            <td className="table-td"><p className="font-medium">{it.name}</p><p className="text-xs text-gray-400">{it.item_code}</p></td>
            <td className="table-td">{it.category || '—'}</td>
            <td className="table-td">{it.unit || '—'}</td>
            <td className="table-td text-xs">{it.hsn_sac || '—'}</td>
            <td className="table-td">{it.tax_rate != null ? `${it.tax_rate}%` : '—'}</td>
            <td className="table-td">{it.reorder_level ?? '—'}</td>
            <td className="table-td"><StatusBadge status={it.status} /></td>
            <td className="table-td"><button className="text-xs text-red-500 hover:text-red-700" onClick={() => setDeleteTarget(it)}><Trash2 className="w-3.5 h-3.5" /></button></td>
          </tr>
        ))}
      </Table>
      <Pagination page={page} total={meta.total || 0} perPage={20} onPage={setPage} />

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Item" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Field label="Item Name" required><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field></div>
          <Field label="Category"><input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></Field>
          <Field label="Unit (pcs/kg/box…)"><input className="input" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} /></Field>
          <Field label="Brand"><input className="input" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></Field>
          <Field label="HSN/SAC"><input className="input" value={form.hsn_sac} onChange={(e) => setForm({ ...form, hsn_sac: e.target.value })} /></Field>
          <Field label="Tax Rate (%)"><input className="input" type="number" value={form.tax_rate} onChange={(e) => setForm({ ...form, tax_rate: e.target.value })} /></Field>
          <Field label="Reorder Level"><input className="input" type="number" value={form.reorder_level} onChange={(e) => setForm({ ...form, reorder_level: e.target.value })} /></Field>
          <Field label="Safety Stock"><input className="input" type="number" value={form.safety_stock} onChange={(e) => setForm({ ...form, safety_stock: e.target.value })} /></Field>
          <Field label="Avg Usage/Month"><input className="input" type="number" value={form.avg_usage_per_month} onChange={(e) => setForm({ ...form, avg_usage_per_month: e.target.value })} /></Field>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button className="btn-secondary" onClick={() => setAddOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={() => addMutation.mutate(form)} disabled={!form.name || addMutation.isPending}>{addMutation.isPending ? 'Adding…' : 'Add Item'}</button>
        </div>
      </Modal>

      <Modal open={importOpen} onClose={() => setImportOpen(false)} title="Import Items" size="sm">
        <p className="text-sm text-gray-500 mb-4">Upload CSV/Excel. Column headers can be named flexibly — e.g. "Item Name", "HSN Code", "Reorder Point" are all recognized.</p>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-brand-400">
          <Upload className="w-6 h-6 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">Click to upload</span>
          <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleImport} />
        </label>
      </Modal>

      <Confirm open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => deleteMutation.mutate(deleteTarget?.id)} title="Delete Item" message={`Archive ${deleteTarget?.name}? It will no longer appear in searches or vendor matching.`} danger />
    </div>
  );
}

export default ItemsPage;
