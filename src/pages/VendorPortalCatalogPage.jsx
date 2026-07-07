import React, { useState, useEffect } from 'react';
import { VendorPortalLayout } from './VendorPortalDashboard';
import api from '../api/client';
import { Plus, Trash2, Edit3, CheckCircle, X, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const CATS = ['Raw Materials', 'Electrical', 'Mechanical', 'Civil', 'Plumbing',
  'Safety Equipment', 'Tools', 'Office Supplies', 'IT Hardware', 'Services', 'Other'];

const emptyForm = { name: '', category: '', unit: '', price: '', min_order_qty: '1', lead_time_days: '', description: '' };

export default function VendorPortalCatalogPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/vendor-portal/catalog')
      .then((r) => setItems(r.data.data))
      .catch(() => toast.error('Failed to load catalog'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };
  const openEdit = (it) => {
    setForm({ name: it.name, category: it.category, unit: it.unit || '',
      price: it.price || '', min_order_qty: it.min_order_qty || '1',
      lead_time_days: it.lead_time_days || '', description: it.description || '' });
    setEditingId(it.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.category) return toast.error('Name and category are required');
    setSaving(true);
    try {
      if (editingId) {
        await api.patch(`/vendor-portal/catalog/${editingId}`, form);
        toast.success('Item updated');
      } else {
        await api.post('/vendor-portal/catalog', form);
        toast.success('Item added to catalog');
      }
      setShowForm(false);
      load();
    } catch (e) {
      toast.error(e.response?.data?.error?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove "${name}" from your catalog?`)) return;
    try {
      await api.delete(`/vendor-portal/catalog/${id}`);
      toast.success('Item removed');
      load();
    } catch { toast.error('Delete failed'); }
  };

  const toggleActive = async (it) => {
    await api.patch(`/vendor-portal/catalog/${it.id}`, { is_active: !it.is_active });
    load();
  };

  return (
    <VendorPortalLayout title="My Product Catalog">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">Add the materials and products you supply. Buyers will search your catalog when creating purchase requests.</p>
        <button className="btn-primary flex items-center gap-2" onClick={openAdd}>
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card mb-4 border-brand-200 border-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">{editingId ? 'Edit Item' : 'Add New Item'}</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="label">Material / Item Name *</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Steel Pipe (MS) 20mm" />
            </div>
            <div>
              <label className="label">Category *</label>
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="">Select…</option>
                {CATS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Unit (kg / pcs / box…)</label>
              <input className="input" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="kg" />
            </div>
            <div>
              <label className="label">Price per unit (₹)</label>
              <input className="input" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="480" />
            </div>
            <div>
              <label className="label">Min Order Qty</label>
              <input className="input" type="number" value={form.min_order_qty} onChange={(e) => setForm({ ...form, min_order_qty: e.target.value })} />
            </div>
            <div>
              <label className="label">Lead Time (days)</label>
              <input className="input" type="number" value={form.lead_time_days} onChange={(e) => setForm({ ...form, lead_time_days: e.target.value })} placeholder="5" />
            </div>
            <div className="col-span-2 md:col-span-3">
              <label className="label">Description / Notes</label>
              <textarea className="input" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Specifications, brand, grade, etc." />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Update Item' : 'Add to Catalog'}
            </button>
          </div>
        </div>
      )}

      {/* Catalog Table */}
      {loading ? (
        <div className="card text-center py-8 text-gray-400">Loading…</div>
      ) : items.length === 0 ? (
        <div className="card text-center py-12">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-600 mb-1">No items in your catalog yet</p>
          <p className="text-sm text-gray-400 mb-4">Add the materials you supply so buyers can find you</p>
          <button className="btn-primary" onClick={openAdd}>Add First Item</button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-50">
              <tr>
                {['Item Name', 'Category', 'Unit', 'Price (₹)', 'Min Qty', 'Lead Time', 'Active', 'Actions'].map((h) => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((it) => (
                <tr key={it.id} className={`hover:bg-gray-50 ${!it.is_active ? 'opacity-50' : ''}`}>
                  <td className="table-td font-medium">{it.name}</td>
                  <td className="table-td"><span className="badge-gray">{it.category}</span></td>
                  <td className="table-td text-sm text-gray-500">{it.unit || '—'}</td>
                  <td className="table-td font-semibold text-brand-700">{it.price ? `₹${Number(it.price).toLocaleString('en-IN')}` : '—'}</td>
                  <td className="table-td">{it.min_order_qty}</td>
                  <td className="table-td">{it.lead_time_days ? `${it.lead_time_days}d` : '—'}</td>
                  <td className="table-td">
                    <button onClick={() => toggleActive(it)}
                      className={`text-xs px-2 py-1 rounded-full font-medium ${it.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {it.is_active ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td className="table-td">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(it)} className="text-brand-600 hover:text-brand-800 p-1"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(it.id, it.name)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </VendorPortalLayout>
  );
}
