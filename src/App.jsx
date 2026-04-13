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
import { PartnerLocationsProvider } from "./features/network/PartnerLocationsContext.jsx";
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

const PartnerMapPage = lazy(() => import("./pages/PartnerMapPage.jsx"));
const PartnerLocationsPage = lazy(() =>
  import("./pages/PartnerLocationsPage.jsx"),
);

const partnerNetworkFallback = (
  <div className="flex min-h-[50vh] flex-1 items-center justify-center bg-[#0d1a10] font-mono text-sm font-bold tracking-[0.2em] text-[#5AC422]">
    LOADING…
  </div>
);

function PartnerLocationsLayout() {
  return (
    <PartnerLocationsProvider>
      <Outlet />
    </PartnerLocationsProvider>
  );
}

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
        <Route path="/dashboard/admin/*" element={<AdminDashboard />} />

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
          <Route element={<PartnerLocationsLayout />}>
            <Route
              path="/partner-map"
              element={
                <Suspense fallback={partnerNetworkFallback}>
                  <PartnerMapPage />
                </Suspense>
              }
            />
            <Route
              path="/partner-locations"
              element={
                <Suspense fallback={partnerNetworkFallback}>
                  <PartnerLocationsPage />
                </Suspense>
              }
            />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
