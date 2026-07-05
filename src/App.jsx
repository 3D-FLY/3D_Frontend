import "./App.css";
import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import Home from "./pages/Home";
import About from "./pages/About";
import Explore from "./pages/Explore";
import FAQ from "./pages/FAQ";
import Store from "./pages/Store";
import Blog from "./pages/Blog";
import STLPricing from "./pages/STLPricing";
import JoinAsPartnerPage from "./pages/JoinAsPartnerPage.jsx";
import RegistrationForm from "./features/auth/RegistrationForm.tsx";
import LoginForm from "./features/auth/LoginForm.tsx";
import ScrollToTop from "./components/ui/ScrollToTop.tsx";
import MyStore from "./pages/dashboard/seller/MyStore.tsx";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard.tsx";
import LoadingPage from "./pages/LoadingPage.tsx";
import AdminDashboardShell from "./features/dashboard/AdminDashboardShell.tsx";
import SupplierMapPage from "./pages/dashboard/admin/SupplierMapPage.jsx";
import PaymentsPage from "./pages/dashboard/admin/FinancePage.tsx";
import PartnerMapPage from "./pages/PartnerMapPage.jsx";
import { PartnerLocationsProvider } from "./features/network/PartnerLocationsContext.jsx";

const SuppliersPage          = lazy(() => import("./pages/dashboard/admin/SuppliersPage.jsx"));
const SellerOrdersPage        = lazy(() => import("./pages/dashboard/seller/Orders.tsx"));
const SellerBillingPage       = lazy(() => import("./pages/dashboard/seller/Billing.tsx"));
const SellerSettingsPage      = lazy(() => import("./pages/dashboard/seller/Settings.tsx"));
const SellerIntegrationPage   = lazy(() => import("./pages/dashboard/seller/Integration.tsx"));
const SellerAddProductPage    = lazy(() => import("./pages/dashboard/seller/AddProduct.tsx"));
const SellerProductsPage      = lazy(() => import("./pages/dashboard/seller/Products.tsx"));
const SellerProductDetailPage  = lazy(() => import("./pages/dashboard/seller/ProductDetail.tsx"));
const SellerOrderDetailPage    = lazy(() => import("./pages/dashboard/seller/OrderDetail.tsx"));
const OrdersPage      = lazy(() => import("./pages/dashboard/admin/OrdersPage.jsx"));
const SettingsPage    = lazy(() => import("./pages/dashboard/admin/SettingsPage.jsx"));
const UsersPage       = lazy(() => import("./pages/dashboard/admin/UsersPage.tsx"));
const UserDetailPage    = lazy(() => import("./pages/dashboard/admin/UserDetailPage.tsx"));
const SupplierDetailPage = lazy(() => import("./pages/dashboard/admin/SupplierDetailPage.jsx"));
const StoresPage         = lazy(() => import("./pages/dashboard/admin/StoresPage.tsx"));
const StoreDetailPage    = lazy(() => import("./pages/dashboard/admin/StoreDetailPage.tsx"));
/** Layout wrapper for pages that include the global Navbar + Footer. */
function MainLayout() {
  return (
    <div className="App font-sans flex min-h-screen flex-col">
      <Navbar />
      <main className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Dashboard routes — no landing Navbar/Footer */}
        <Route
          path="/dashboard/seller/orders/:id"
          element={
            <Suspense fallback={null}>
              <SellerOrderDetailPage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/seller/orders"
          element={
            <Suspense fallback={null}>
              <SellerOrdersPage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/seller/billing"
          element={
            <Suspense fallback={null}>
              <SellerBillingPage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/seller/settings"
          element={
            <Suspense fallback={null}>
              <SellerSettingsPage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/seller/integration"
          element={
            <Suspense fallback={null}>
              <SellerIntegrationPage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/seller/products/new"
          element={
            <Suspense fallback={null}>
              <SellerAddProductPage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/seller/products/edit/:id"
          element={
            <Suspense fallback={null}>
              <SellerAddProductPage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/seller/products/:id"
          element={
            <Suspense fallback={null}>
              <SellerProductDetailPage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/seller/products"
          element={
            <Suspense fallback={null}>
              <SellerProductsPage />
            </Suspense>
          }
        />
        <Route path="/dashboard/seller/*" element={<MyStore />} />
        <Route path="/dashboard/store" element={<MyStore />} />
        <Route
          path="/dashboard/admin/suppliers/:id"
          element={
            <Suspense fallback={null}>
              <SupplierDetailPage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/admin/suppliers"
          element={
            <Suspense fallback={null}>
              <SuppliersPage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/admin/supplier-map"
          element={
            <AdminDashboardShell>
              <SupplierMapPage />
            </AdminDashboardShell>
          }
        />
        <Route
          path="/dashboard/admin/orders"
          element={
            <Suspense fallback={null}>
              <OrdersPage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/admin/settings"
          element={
            <Suspense fallback={null}>
              <SettingsPage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/admin/users"
          element={
            <Suspense fallback={null}>
              <UsersPage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/admin/users/:id"
          element={
            <Suspense fallback={null}>
              <UserDetailPage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/admin/stores"
          element={
            <Suspense fallback={null}>
              <StoresPage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/admin/stores/:id"
          element={
            <Suspense fallback={null}>
              <StoreDetailPage />
            </Suspense>
          }
        />
        <Route path="/dashboard/admin/payments" element={<PaymentsPage />} />
        <Route path="/dashboard/admin/*" element={<AdminDashboard />} />

        <Route path="/loading-preview" element={<LoadingPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/store" element={<Store />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/stl-pricing" element={<STLPricing />} />
          <Route path="/join-as-partner" element={<JoinAsPartnerPage />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/partner-map"
            element={
              <PartnerLocationsProvider>
                <div className="flex min-h-0 flex-1 flex-col bg-dark">
                  <PartnerMapPage />
                </div>
              </PartnerLocationsProvider>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
