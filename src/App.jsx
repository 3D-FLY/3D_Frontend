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
import SellerDashboard from "./pages/SellerDashboard.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import LoadingPage from "./pages/LoadingPage.tsx";
import { PartnerLocationsProvider } from "./features/network/PartnerLocationsContext.jsx";
import LogoLoader from "./components/ui/LogoLoader.js";

const PartnerMapPage  = lazy(() => import("./pages/PartnerMapPage.jsx"));
const SuppliersPage   = lazy(() => import("./pages/dashboard/admin/SuppliersPage.jsx"));
const OrdersPage      = lazy(() => import("./pages/dashboard/admin/OrdersPage.jsx"));
const SettingsPage    = lazy(() => import("./pages/dashboard/admin/SettingsPage.jsx"));
const UsersPage       = lazy(() => import("./pages/dashboard/admin/UsersPage.tsx"));
const UserDetailPage    = lazy(() => import("./pages/dashboard/admin/UserDetailPage.tsx"));
const SupplierDetailPage = lazy(() => import("./pages/dashboard/admin/SupplierDetailPage.jsx"));
const StoresPage         = lazy(() => import("./pages/dashboard/admin/StoresPage.tsx"));
const StoreDetailPage    = lazy(() => import("./pages/dashboard/admin/StoreDetailPage.tsx"));
const SupplierMapPage    = lazy(() => import("./pages/dashboard/admin/SupplierMapPage.jsx"));

const partnerNetworkFallback = (
  <div className="flex min-h-[50vh] flex-1 items-center justify-center bg-[#0d1a10] font-mono text-sm font-bold tracking-[0.2em] text-[#5AC422]">
    LOADING…
  </div>
);

/** Map-area loader while PartnerMap chunk loads (not full-page). */
const partnerMapChunkFallback = (
  <div className="relative flex w-full flex-1 flex-col items-center bg-dark">
    <div className="relative mt-10 flex h-[88vh] min-h-[280px] w-full max-w-[1440px] items-center justify-center px-6 max-[1024px]:h-[56vh] max-[768px]:h-[42vh]">
      <LogoLoader size={90} gap={28} />
    </div>
  </div>
);

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
        <Route path="/dashboard/seller/*" element={<SellerDashboard />} />
        <Route
          path="/dashboard/admin/suppliers/:id"
          element={
            <Suspense fallback={partnerNetworkFallback}>
              <SupplierDetailPage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/admin/suppliers"
          element={
            <Suspense fallback={partnerNetworkFallback}>
              <SuppliersPage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/admin/supplier-map"
          element={
            <Suspense fallback={partnerNetworkFallback}>
              <SupplierMapPage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/admin/orders"
          element={
            <Suspense fallback={partnerNetworkFallback}>
              <OrdersPage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/admin/settings"
          element={
            <Suspense fallback={partnerNetworkFallback}>
              <SettingsPage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/admin/users"
          element={
            <Suspense fallback={partnerNetworkFallback}>
              <UsersPage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/admin/users/:id"
          element={
            <Suspense fallback={partnerNetworkFallback}>
              <UserDetailPage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/admin/stores"
          element={
            <Suspense fallback={partnerNetworkFallback}>
              <StoresPage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/admin/stores/:id"
          element={
            <Suspense fallback={partnerNetworkFallback}>
              <StoreDetailPage />
            </Suspense>
          }
        />
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
                <Suspense fallback={partnerMapChunkFallback}>
                  <PartnerMapPage />
                </Suspense>
              </PartnerLocationsProvider>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
