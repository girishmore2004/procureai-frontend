// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { vendorsApi } from '../api/services';
// import { Table, EmptyState, StatusBadge, SearchInput, Modal, Field, Pagination, Confirm } from '../components/ui';
// import { Plus, Upload, Star, Trash2 } from 'lucide-react';
// import toast from 'react-hot-toast';

// const CATEGORIES = ['Electronics', 'Electrical', 'Mechanical', 'Civil', 'Office Supplies', 'IT', 'Raw Materials', 'Packaging', 'Services', 'Other'];

// export default function VendorsPage() {
//   const qc = useQueryClient();
//   const [search, setSearch] = useState('');
//   const [page, setPage] = useState(1);
//   const [addOpen, setAddOpen] = useState(false);
//   const [importOpen, setImportOpen] = useState(false);
//   const [archiveTarget, setArchiveTarget] = useState(null);
//   const [form, setForm] = useState({ name: '', email: '', phone: '', contact_person: '', gstin: '', payment_terms: '', lead_time_days: '', categories: [] });

//   const { data, isLoading } = useQuery({
//     queryKey: ['vendors', search, page],
//     queryFn: () => vendorsApi.list({ search, page, per_page: 20 }).then((r) => r.data),
//   });

//   const addMutation = useMutation({
//     mutationFn: vendorsApi.create,
//     onSuccess: () => { toast.success('Vendor added'); qc.invalidateQueries(['vendors']); setAddOpen(false); setForm({ name: '', email: '', phone: '', contact_person: '', gstin: '', payment_terms: '', lead_time_days: '', categories: [] }); },
//     onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed to add vendor'),
//   });

//   const archiveMutation = useMutation({
//     mutationFn: (id) => vendorsApi.remove(id),
//     onSuccess: () => { toast.success('Vendor archived'); qc.invalidateQueries(['vendors']); setArchiveTarget(null); },
//   });

//   const handleImport = async (e) => {
//     const file = e.target.files[0]; if (!file) return;
//     try {
//       const { data: d } = await vendorsApi.importCsv(file);
//       const { created, total, errors } = d.data;
//       if (errors?.length) {
//         toast.error(`Imported ${created} of ${total}. ${errors.length} row(s) failed — first issue: ${errors[0].message}`, { duration: 8000 });
//       } else {
//         toast.success(`Imported ${created} vendors`);
//       }
//       qc.invalidateQueries(['vendors']);
//       setImportOpen(false);
//     } catch (err) { toast.error(err.response?.data?.error?.message || 'Import failed'); }
//   };

//   const vendors = data?.data || [];
//   const meta = data?.meta || {};

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <h1>Vendors</h1>
//         <div className="flex gap-2">
//           <button className="btn-secondary flex items-center gap-2" onClick={() => setImportOpen(true)}><Upload className="w-4 h-4" /> Import</button>
//           <button className="btn-primary flex items-center gap-2" onClick={() => setAddOpen(true)}><Plus className="w-4 h-4" /> Add Vendor</button>
//         </div>
//       </div>

//       <div className="flex gap-3">
//         <div className="flex-1"><SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search vendors…" /></div>
//       </div>

//       <Table headers={['Vendor', 'Contact', 'GSTIN', 'Lead Time', 'Rating', 'Status', '']} loading={isLoading}
//         empty={<EmptyState title="No vendors yet" description="Add vendors or import from CSV" action={<button className="btn-primary mt-2" onClick={() => setAddOpen(true)}>Add Vendor</button>} />}>
//         {vendors.map((v) => (
//           <tr key={v.id} className="hover:bg-gray-50">
//             <td className="table-td">
//               <div className="flex items-center gap-2">
//                 {v.preferred && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
//                 <Link to={`/vendors/${v.id}`} className="font-medium text-brand-600 hover:underline">{v.name}</Link>
//               </div>
//               <p className="text-xs text-gray-400">{v.vendor_code}</p>
//             </td>
//             <td className="table-td"><p>{v.contact_person}</p><p className="text-xs text-gray-400">{v.email}</p></td>
//             <td className="table-td text-xs">{v.gstin || '—'}</td>
//             <td className="table-td">{v.lead_time_days ? `${v.lead_time_days}d` : '—'}</td>
//             <td className="table-td">{v.rating ? <span className="font-semibold text-amber-600">{Number(v.rating).toFixed(1)}/10</span> : '—'}</td>
//             <td className="table-td"><StatusBadge status={v.status} /></td>
//             <td className="table-td">
//               <div className="flex items-center gap-2">
//                 <Link to={`/vendors/${v.id}`} className="text-xs text-brand-600 hover:underline">View</Link>
//                 <button className="text-xs text-red-500 hover:text-red-700" onClick={() => setArchiveTarget(v)}><Trash2 className="w-3.5 h-3.5" /></button>
//               </div>
//             </td>
//           </tr>
//         ))}
//       </Table>
//       <Pagination page={page} total={meta.total || 0} perPage={20} onPage={setPage} />

//       {/* Add Vendor Modal */}
//       <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Vendor" size="lg">
//         <div className="grid grid-cols-2 gap-4">
//           <div className="col-span-2"><Field label="Vendor Name" required><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field></div>
//           <Field label="Contact Person"><input className="input" value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} /></Field>
//           <Field label="Email"><input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
//           <Field label="Phone"><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
//           <Field label="GSTIN"><input className="input" value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} /></Field>
//           <Field label="Payment Terms"><input className="input" placeholder="e.g. Net 30" value={form.payment_terms} onChange={(e) => setForm({ ...form, payment_terms: e.target.value })} /></Field>
//           <Field label="Lead Time (days)"><input className="input" type="number" value={form.lead_time_days} onChange={(e) => setForm({ ...form, lead_time_days: e.target.value })} /></Field>
//           <div className="col-span-2"><Field label="Categories">
//             <div className="flex flex-wrap gap-2 mt-1">{CATEGORIES.map((c) => (
//               <label key={c} className="flex items-center gap-1 text-xs cursor-pointer">
//                 <input type="checkbox" checked={form.categories.includes(c)} onChange={(e) => setForm({ ...form, categories: e.target.checked ? [...form.categories, c] : form.categories.filter((x) => x !== c) })} />
//                 {c}
//               </label>))}
//             </div>
//           </Field></div>
//         </div>
//         <div className="flex justify-end gap-3 mt-6">
//           <button className="btn-secondary" onClick={() => setAddOpen(false)}>Cancel</button>
//           <button className="btn-primary" onClick={() => addMutation.mutate(form)} disabled={!form.name || addMutation.isPending}>{addMutation.isPending ? 'Adding…' : 'Add Vendor'}</button>
//         </div>
//       </Modal>

//       {/* Import Modal */}
//       <Modal open={importOpen} onClose={() => setImportOpen(false)} title="Import Vendors" size="sm">
//         <p className="text-sm text-gray-500 mb-4">Upload CSV/Excel. Column headers can be named flexibly — e.g. "Vendor Name", "GST No", "Mobile" are all recognized.</p>
//         <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-brand-400">
//           <Upload className="w-6 h-6 text-gray-400 mb-2" />
//           <span className="text-sm text-gray-500">Click to upload</span>
//           <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleImport} />
//         </label>
//       </Modal>

//       <Confirm open={!!archiveTarget} onClose={() => setArchiveTarget(null)} onConfirm={() => archiveMutation.mutate(archiveTarget?.id)} title="Archive Vendor" message={`Archive ${archiveTarget?.name}? They won't appear in new RFQs.`} danger />
//     </div>
//   );
// }







import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorsApi } from '../api/services';
import { Table, EmptyState, StatusBadge, SearchInput, Modal, Field, Pagination, Confirm } from '../components/ui';
import { Plus, Upload, Star, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'Electrical', 'Mechanical', 'Civil', 'Office Supplies', 'IT', 'Raw Materials', 'Packaging', 'Services', 'Other'];

export default function VendorsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', contact_person: '', gstin: '', payment_terms: '', lead_time_days: '', categories: [] });

  const { data, isLoading } = useQuery({
    queryKey: ['vendors', search, page],
    queryFn: () => vendorsApi.list({ search, page, per_page: 20 }).then((r) => r.data),
  });

  const addMutation = useMutation({
    mutationFn: vendorsApi.create,
    onSuccess: () => { toast.success('Vendor added'); qc.invalidateQueries(['vendors']); setAddOpen(false); setForm({ name: '', email: '', phone: '', contact_person: '', gstin: '', payment_terms: '', lead_time_days: '', categories: [] }); },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed to add vendor'),
  });

  const archiveMutation = useMutation({
    mutationFn: (id) => vendorsApi.remove(id),
    onSuccess: () => { toast.success('Vendor archived'); qc.invalidateQueries(['vendors']); setArchiveTarget(null); },
  });

  const handleImport = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    try {
      const { data: d } = await vendorsApi.importCsv(file);
      const { created, total, errors } = d.data;
      if (errors?.length) {
        toast.error(`Imported ${created} of ${total}. ${errors.length} row(s) failed — first issue: ${errors[0].message}`, { duration: 8000 });
      } else {
        toast.success(`Imported ${created} vendors`);
      }
      qc.invalidateQueries(['vendors']);
      setImportOpen(false);
    } catch (err) { toast.error(err.response?.data?.error?.message || 'Import failed'); }
  };

  const vendors = data?.data || [];
  const meta = data?.meta || {};

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1>Vendors</h1>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2" onClick={() => setImportOpen(true)}><Upload className="w-4 h-4" /> Import</button>
          <button className="btn-primary flex items-center gap-2" onClick={() => setAddOpen(true)}><Plus className="w-4 h-4" /> Add Vendor</button>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1"><SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search vendors…" /></div>
      </div>

      <Table headers={['Vendor', 'Contact', 'GSTIN', 'Lead Time', 'Rating', 'Status', '']} loading={isLoading}
        empty={<EmptyState title="No vendors yet" description="Add vendors or import from CSV" action={<button className="btn-primary mt-2" onClick={() => setAddOpen(true)}>Add Vendor</button>} />}>
        {vendors.map((v) => (
          <tr key={v.id} className="hover:bg-gray-50">
            <td className="table-td">
              <div className="flex items-center gap-2">
                {v.preferred && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                <Link to={`/vendors/${v.id}`} className="font-medium text-brand-600 hover:underline">{v.name}</Link>
                {v.is_portal_vendor && <span className="badge-blue text-xs" title="This vendor registered themselves via the Vendor Portal — you can select them for RFQs/invoices, but only they can edit their own profile.">Portal Vendor</span>}
              </div>
              <p className="text-xs text-gray-400">{v.vendor_code}</p>
            </td>
            <td className="table-td"><p>{v.contact_person}</p><p className="text-xs text-gray-400">{v.email}</p></td>
            <td className="table-td text-xs">{v.gstin || '—'}</td>
            <td className="table-td">{v.lead_time_days ? `${v.lead_time_days}d` : '—'}</td>
            <td className="table-td">{v.rating ? <span className="font-semibold text-amber-600">{Number(v.rating).toFixed(1)}/10</span> : '—'}</td>
            <td className="table-td"><StatusBadge status={v.status} /></td>
            <td className="table-td">
              <div className="flex items-center gap-2">
                <Link to={`/vendors/${v.id}`} className="text-xs text-brand-600 hover:underline">View</Link>
                {!v.is_portal_vendor && (
                  <button className="text-xs text-red-500 hover:text-red-700" onClick={() => setArchiveTarget(v)}><Trash2 className="w-3.5 h-3.5" /></button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </Table>
      <Pagination page={page} total={meta.total || 0} perPage={20} onPage={setPage} />

      {/* Add Vendor Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Vendor" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Field label="Vendor Name" required><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field></div>
          <Field label="Contact Person"><input className="input" value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} /></Field>
          <Field label="Email"><input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Phone"><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label="GSTIN"><input className="input" value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} /></Field>
          <Field label="Payment Terms"><input className="input" placeholder="e.g. Net 30" value={form.payment_terms} onChange={(e) => setForm({ ...form, payment_terms: e.target.value })} /></Field>
          <Field label="Lead Time (days)"><input className="input" type="number" value={form.lead_time_days} onChange={(e) => setForm({ ...form, lead_time_days: e.target.value })} /></Field>
          <div className="col-span-2"><Field label="Categories">
            <div className="flex flex-wrap gap-2 mt-1">{CATEGORIES.map((c) => (
              <label key={c} className="flex items-center gap-1 text-xs cursor-pointer">
                <input type="checkbox" checked={form.categories.includes(c)} onChange={(e) => setForm({ ...form, categories: e.target.checked ? [...form.categories, c] : form.categories.filter((x) => x !== c) })} />
                {c}
              </label>))}
            </div>
          </Field></div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button className="btn-secondary" onClick={() => setAddOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={() => addMutation.mutate(form)} disabled={!form.name || addMutation.isPending}>{addMutation.isPending ? 'Adding…' : 'Add Vendor'}</button>
        </div>
      </Modal>

      {/* Import Modal */}
      <Modal open={importOpen} onClose={() => setImportOpen(false)} title="Import Vendors" size="sm">
        <p className="text-sm text-gray-500 mb-4">Upload CSV/Excel. Column headers can be named flexibly — e.g. "Vendor Name", "GST No", "Mobile" are all recognized.</p>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-brand-400">
          <Upload className="w-6 h-6 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">Click to upload</span>
          <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleImport} />
        </label>
      </Modal>

      <Confirm open={!!archiveTarget} onClose={() => setArchiveTarget(null)} onConfirm={() => archiveMutation.mutate(archiveTarget?.id)} title="Archive Vendor" message={`Archive ${archiveTarget?.name}? They won't appear in new RFQs.`} danger />
    </div>
  );
}
