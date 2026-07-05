import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import { Spinner } from './components/ui';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import VendorsPage from './pages/VendorsPage';
import VendorProfilePage from './pages/VendorProfilePage';
import ItemsPage from './pages/ItemsPage';
import PurchaseRequestsPage from './pages/PurchaseRequestsPage';
import PurchaseRequestDetailPage from './pages/PurchaseRequestDetailPage';
import RfqsPage from './pages/RfqsPage';
import RfqDetailPage from './pages/RfqDetailPage';
import QuoteInboxPage from './pages/QuoteInboxPage';
import QuoteDetailPage from './pages/QuoteDetailPage';
import ComparisonPage from './pages/ComparisonPage';
import ApprovalsPage from './pages/ApprovalsPage';
import PurchaseOrdersPage from './pages/PurchaseOrdersPage';
import PurchaseOrderDetailPage from './pages/PurchaseOrderDetailPage';
import GoodsReceiptsPage from './pages/GoodsReceiptsPage';
import InvoicesPage from './pages/InvoicesPage';
import InvoiceDetailPage from './pages/InvoiceDetailPage';
import InventoryPage from './pages/InventoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotificationsPage from './pages/NotificationsPage';
import AuditLogsPage from './pages/AuditLogsPage';
import SettingsPage from './pages/SettingsPage';
import AiAssistantPage from './pages/AiAssistantPage';
import UsersPage from './pages/UsersPage';
import VendorQuotePage from './pages/VendorQuotePage';
import VendorPortalLoginPage from './pages/VendorPortalLoginPage';
import VendorPortalDashboard from './pages/VendorPortalDashboard';
import VendorPortalCatalogPage from './pages/VendorPortalCatalogPage';
import VendorPortalProfilePage from './pages/VendorPortalProfilePage';
import FindVendorPage from './pages/FindVendorPage';
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><Spinner size="lg" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><Spinner size="lg" /></div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/vendor/quote/:token" element={<VendorQuotePage />} />

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/vendors" element={<ProtectedRoute><VendorsPage /></ProtectedRoute>} />
        <Route path="/vendors/:id" element={<ProtectedRoute><VendorProfilePage /></ProtectedRoute>} />
        <Route path="/items" element={<ProtectedRoute><ItemsPage /></ProtectedRoute>} />
        <Route path="/purchase-requests" element={<ProtectedRoute><PurchaseRequestsPage /></ProtectedRoute>} />
        <Route path="/purchase-requests/:id" element={<ProtectedRoute><PurchaseRequestDetailPage /></ProtectedRoute>} />
        <Route path="/rfqs" element={<ProtectedRoute><RfqsPage /></ProtectedRoute>} />
        <Route path="/rfqs/:id" element={<ProtectedRoute><RfqDetailPage /></ProtectedRoute>} />
        <Route path="/rfqs/:id/comparison" element={<ProtectedRoute><ComparisonPage /></ProtectedRoute>} />
        <Route path="/quotes" element={<ProtectedRoute><QuoteInboxPage /></ProtectedRoute>} />
        <Route path="/quotes/:id" element={<ProtectedRoute><QuoteDetailPage /></ProtectedRoute>} />
        <Route path="/approvals" element={<ProtectedRoute><ApprovalsPage /></ProtectedRoute>} />
        <Route path="/purchase-orders" element={<ProtectedRoute><PurchaseOrdersPage /></ProtectedRoute>} />
        <Route path="/purchase-orders/:id" element={<ProtectedRoute><PurchaseOrderDetailPage /></ProtectedRoute>} />
        <Route path="/goods-receipts" element={<ProtectedRoute><GoodsReceiptsPage /></ProtectedRoute>} />
        <Route path="/invoices" element={<ProtectedRoute><InvoicesPage /></ProtectedRoute>} />
        <Route path="/invoices/:id" element={<ProtectedRoute><InvoiceDetailPage /></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/audit-logs" element={<ProtectedRoute><AuditLogsPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/ai-assistant" element={<ProtectedRoute><AiAssistantPage /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />

        {/* Vendor Portal — completely separate from company-user routes */}
        <Route path="/vendor-portal/login" element={<VendorPortalLoginPage />} />
        <Route path="/vendor-portal/dashboard" element={<VendorPortalDashboard />} />
        <Route path="/vendor-portal/catalog" element={<VendorPortalCatalogPage />} />
        <Route path="/vendor-portal/profile" element={<VendorPortalProfilePage />} />

{/* Buyer-facing vendor discovery — inside company ProtectedRoute */}
        <Route path="/find-vendor" element={<ProtectedRoute><FindVendorPage /></ProtectedRoute>} />
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
