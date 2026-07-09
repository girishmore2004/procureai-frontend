// // ── INVENTORY PAGE ───────────────────────────────────────────────────────────
// import React, { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { inventoryApi } from '../api/services';
// import { Table, EmptyState, StatusBadge, Alert, Modal, Field } from '../components/ui';
// import { AlertTriangle, TrendingDown, RefreshCw } from 'lucide-react';
// import toast from 'react-hot-toast';

// export function InventoryPage() {
//   const qc = useQueryClient();
//   const [ruleOpen, setRuleOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [ruleForm, setRuleForm] = useState({ reorder_point: '', reorder_quantity: '' });

//   const { data: inventory, isLoading } = useQuery({ queryKey: ['inventory'], queryFn: () => inventoryApi.getAll().then((r) => r.data.data) });
//   const { data: alerts } = useQuery({ queryKey: ['reorder-alerts'], queryFn: () => inventoryApi.getReorderAlerts().then((r) => r.data.data) });

//   const ruleMutation = useMutation({
//     mutationFn: () => inventoryApi.updateReorderRule(selectedItem.Item?.id, ruleForm),
//     onSuccess: () => { toast.success('Reorder rule updated'); qc.invalidateQueries(['inventory']); setRuleOpen(false); },
//     onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed'),
//   });

//   const openRule = (inv) => { setSelectedItem(inv); setRuleForm({ reorder_point: inv.Item?.ReorderRule?.reorder_point || '', reorder_quantity: inv.Item?.ReorderRule?.reorder_quantity || '' }); setRuleOpen(true); };

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <h1>Inventory</h1>
//         <button className="btn-secondary flex items-center gap-2" onClick={() => qc.invalidateQueries(['inventory'])}><RefreshCw className="w-4 h-4" /> Refresh</button>
//       </div>

//       {alerts?.length > 0 && (
//         <div className="bg-red-50 border border-red-200 rounded-xl p-4">
//           <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-5 h-5 text-red-500" /><h2 className="text-red-700 font-semibold">Reorder Alerts ({alerts.length})</h2></div>
//           <div className="space-y-2">
//             {alerts.map((a) => (
//               <div key={a.item_id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-red-100">
//                 <div>
//                   <p className="text-sm font-medium">{a.item_name} <span className="text-xs text-gray-400">({a.item_code})</span></p>
//                   <p className="text-xs text-gray-500">Stock: {a.current_stock} {a.unit} · Reorder Point: {a.reorder_point} {a.unit} · {a.days_until_stockout != null ? `~${a.days_until_stockout} days left` : ''}</p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <TrendingDown className="w-4 h-4 text-red-400" />
//                   <span className="text-xs text-red-600 font-medium">Order: {a.reorder_quantity} {a.unit}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <Table headers={['Item', 'Code', 'Category', 'Current Stock', 'Reorder Point', 'Status', '']} loading={isLoading}
//         empty={<EmptyState title="No inventory data" description="Add items with reorder levels to track stock" />}>
//         {inventory?.map((inv) => (
//           <tr key={inv.id} className="hover:bg-gray-50">
//             <td className="table-td font-medium">{inv.Item?.name}</td>
//             <td className="table-td text-xs text-gray-500">{inv.Item?.item_code}</td>
//             <td className="table-td">{inv.Item?.category || '—'}</td>
//             <td className="table-td font-semibold">{Number(inv.current_stock).toFixed(2)} <span className="text-xs text-gray-400">{inv.Item?.unit}</span></td>
//             <td className="table-td text-sm">{inv.Item?.ReorderRule?.reorder_point ?? '—'}</td>
//             <td className="table-td"><StatusBadge status={inv.stock_status} /></td>
//             <td className="table-td"><button className="text-xs text-brand-600 hover:underline" onClick={() => openRule(inv)}>Set Rule</button></td>
//           </tr>
//         ))}
//       </Table>

//       <Modal open={ruleOpen} onClose={() => setRuleOpen(false)} title={`Reorder Rule: ${selectedItem?.Item?.name}`} size="sm">
//         <div className="space-y-4">
//           <Field label="Reorder Point (trigger alert when stock falls below)"><input className="input" type="number" value={ruleForm.reorder_point} onChange={(e) => setRuleForm({ ...ruleForm, reorder_point: e.target.value })} /></Field>
//           <Field label="Reorder Quantity (suggested order qty)"><input className="input" type="number" value={ruleForm.reorder_quantity} onChange={(e) => setRuleForm({ ...ruleForm, reorder_quantity: e.target.value })} /></Field>
//         </div>
//         <div className="flex justify-end gap-3 mt-4">
//           <button className="btn-secondary" onClick={() => setRuleOpen(false)}>Cancel</button>
//           <button className="btn-primary" onClick={() => ruleMutation.mutate()} disabled={ruleMutation.isPending}>Save Rule</button>
//         </div>
//       </Modal>
//     </div>
//   );
// }

// export default InventoryPage;



// ── INVENTORY PAGE ───────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/services';
import { Table, EmptyState, StatusBadge, Alert, Modal, Field } from '../components/ui';
import { AlertTriangle, TrendingDown, RefreshCw, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export function InventoryPage() {
  const qc = useQueryClient();
  const [ruleOpen, setRuleOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [ruleForm, setRuleForm] = useState({ reorder_point: '', reorder_quantity: '' });

  const { data: inventory, isLoading } = useQuery({ queryKey: ['inventory'], queryFn: () => inventoryApi.getAll().then((r) => r.data.data) });
  const { data: alerts } = useQuery({ queryKey: ['reorder-alerts'], queryFn: () => inventoryApi.getReorderAlerts().then((r) => r.data.data) });

  const ruleMutation = useMutation({
    mutationFn: () => inventoryApi.updateReorderRule(selectedItem.Item?.id, ruleForm),
    onSuccess: () => { toast.success('Reorder rule updated'); qc.invalidateQueries(['inventory']); setRuleOpen(false); },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed'),
  });

  const openRule = (inv) => { setSelectedItem(inv); setRuleForm({ reorder_point: inv.Item?.ReorderRule?.reorder_point || '', reorder_quantity: inv.Item?.ReorderRule?.reorder_quantity || '' }); setRuleOpen(true); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1>Inventory</h1>
        <div className="flex gap-2">
          <Link to="/billing" className="btn-secondary flex items-center gap-2"><Receipt className="w-4 h-4" /> Billing</Link>
          <button className="btn-secondary flex items-center gap-2" onClick={() => qc.invalidateQueries(['inventory'])}><RefreshCw className="w-4 h-4" /> Refresh</button>
        </div>
      </div>

      {alerts?.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-5 h-5 text-red-500" /><h2 className="text-red-700 font-semibold">Reorder Alerts ({alerts.length})</h2></div>
          <div className="space-y-2">
            {alerts.map((a) => (
              <div key={a.item_id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-red-100">
                <div>
                  <p className="text-sm font-medium">{a.item_name} <span className="text-xs text-gray-400">({a.item_code})</span></p>
                  <p className="text-xs text-gray-500">Stock: {a.current_stock} {a.unit} · Reorder Point: {a.reorder_point} {a.unit} · {a.days_until_stockout != null ? `~${a.days_until_stockout} days left` : ''}</p>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <span className="text-xs text-red-600 font-medium">Order: {a.reorder_quantity} {a.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Table headers={['Item', 'Code', 'Category', 'Current Stock', 'Reorder Point', 'Status', '']} loading={isLoading}
        empty={<EmptyState title="No inventory data" description="Add items with reorder levels to track stock" />}>
        {inventory?.map((inv) => (
          <tr key={inv.id} className="hover:bg-gray-50">
            <td className="table-td font-medium">{inv.Item?.name}</td>
            <td className="table-td text-xs text-gray-500">{inv.Item?.item_code}</td>
            <td className="table-td">{inv.Item?.category || '—'}</td>
            <td className="table-td font-semibold">{Number(inv.current_stock).toFixed(2)} <span className="text-xs text-gray-400">{inv.Item?.unit}</span></td>
            <td className="table-td text-sm">{inv.Item?.ReorderRule?.reorder_point ?? '—'}</td>
            <td className="table-td"><StatusBadge status={inv.stock_status} /></td>
            <td className="table-td"><button className="text-xs text-brand-600 hover:underline" onClick={() => openRule(inv)}>Set Rule</button></td>
          </tr>
        ))}
      </Table>

      <Modal open={ruleOpen} onClose={() => setRuleOpen(false)} title={`Reorder Rule: ${selectedItem?.Item?.name}`} size="sm">
        <div className="space-y-4">
          <Field label="Reorder Point (trigger alert when stock falls below)"><input className="input" type="number" value={ruleForm.reorder_point} onChange={(e) => setRuleForm({ ...ruleForm, reorder_point: e.target.value })} /></Field>
          <Field label="Reorder Quantity (suggested order qty)"><input className="input" type="number" value={ruleForm.reorder_quantity} onChange={(e) => setRuleForm({ ...ruleForm, reorder_quantity: e.target.value })} /></Field>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button className="btn-secondary" onClick={() => setRuleOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={() => ruleMutation.mutate()} disabled={ruleMutation.isPending}>Save Rule</button>
        </div>
      </Modal>
    </div>
  );
}

export default InventoryPage;
