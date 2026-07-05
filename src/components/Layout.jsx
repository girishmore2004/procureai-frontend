import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Package, ShoppingCart, FileText, BarChart2,
  Bell, Settings, LogOut, ChevronDown, Truck, Receipt, Warehouse,
  Boxes, ClipboardList, Building2, Menu, X, Bot,
} from 'lucide-react';

// Order matches the specified procurement workflow: Dashboard, Inventory,
// Item Master, Vendor, Purchase Request, Approvals, RFQ, Purchase Order,
// Goods Receipt, Invoice, AI Recommendation, Analytics, Settings.
// perm can be a single code (string) or an array — arrays mean "visible if
// the user has ANY of these" (used for Approvals, since pr/po/invoice
// approvers are different roles but all belong on the same nav item).
const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', perm: null },
  { to: '/inventory', icon: Boxes, label: 'Inventory', perm: 'items.view' },
  { to: '/items', icon: Package, label: 'Item Master', perm: 'items.view' },
  { to: '/vendors', icon: Building2, label: 'Vendor', perm: 'vendors.view' },
  { to: '/purchase-requests', icon: ClipboardList, label: 'Purchase Request', perm: 'pr.view' },
  { to: '/approvals', icon: ShoppingCart, label: 'Approvals', perm: ['pr.approve', 'po.approve', 'invoices.approve'] },
  { to: '/rfqs', icon: FileText, label: 'RFQ', perm: 'rfq.view' },
  { to: '/purchase-orders', icon: Receipt, label: 'Purchase Order', perm: 'po.view' },
  { to: '/goods-receipts', icon: Warehouse, label: 'Goods Receipt', perm: 'grn.view' },
  { to: '/invoices', icon: FileText, label: 'Invoice', perm: 'invoices.view' },
  { to: '/ai-assistant', icon: Bot, label: 'AI Recommendation', perm: null },
  { to: '/analytics', icon: BarChart2, label: 'Analytics / Reports', perm: 'analytics.view' },
  { to: '/settings', icon: Settings, label: 'Settings', perm: 'settings.view' },
  // Utility items — not part of the 13-step workflow, kept below a divider.
  { to: '/notifications', icon: Bell, label: 'Notifications', perm: null, utility: true },
  { to: '/audit-logs', icon: ClipboardList, label: 'Audit Logs', perm: 'audit.view', utility: true },
];

export default function Layout({ children }) {
  const { user, logout, can, canAny } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const hasAccess = (n) => !n.perm || (Array.isArray(n.perm) ? canAny(...n.perm) : can(n.perm));
  const visibleNav = NAV.filter(hasAccess);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg">ProcureAI</span>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {visibleNav.map(({ to, icon: Icon, label, utility }, idx) => {
          const prevUtility = idx > 0 ? visibleNav[idx - 1].utility : false;
          return (
            <React.Fragment key={to}>
              {utility && !prevUtility && <div className="my-2 border-t border-gray-200" />}
              <NavLink to={to} onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}>
                <Icon className="w-4 h-4 shrink-0" />
                <span>{label}</span>
              </NavLink>
            </React.Fragment>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-semibold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="sidebar-link w-full text-red-600 hover:bg-red-50 hover:text-red-700">
          <LogOut className="w-4 h-4" /><span>Sign out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 md:flex-col bg-white border-r border-gray-200 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar - mobile only */}
        <div className="md:hidden flex items-center px-4 h-14 bg-white border-b border-gray-200 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5" />
          </button>
          <span className="ml-3 font-bold text-gray-900">ProcureAI</span>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
