import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';

import HomePage from './pages/HomePage.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import SupportPage from './pages/SupportPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

// Admin Suite (Loaded on Secret Route)
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminOverview from './pages/admin/AdminOverview.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminCustomers from './pages/admin/AdminCustomers.jsx';
import AdminCategories from './pages/admin/AdminCategories.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';

export default function App() {
  const [route, setRoute] = useState(() => {
    const hash = window.location.hash.replace('#', '') || '';
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true' || hash.startsWith('/admin') || hash === 'admin-ops') {
      return 'admin-ops';
    }
    return hash || 'home';
  });

  const [routeParams, setRouteParams] = useState({});
  const [adminTab, setAdminTab] = useState('overview');
  const [adminNewProductDrawer, setAdminNewProductDrawer] = useState(false);

  // Sync browser hash for navigation and secret admin route
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true' || hash === 'admin-ops' || hash.startsWith('/admin')) {
        setRoute('admin-ops');
      } else if (hash) {
        setRoute(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (newRoute, params = {}) => {
    setRoute(newRoute);
    setRouteParams(params);
    window.location.hash = newRoute === 'home' ? '' : newRoute;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdminRoute = route === 'admin-ops' || route === 'admin' || route === '/admin';

  return (
    <ThemeProvider>
      <CartProvider>
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] text-[#09090B] dark:text-[#FAFAFA] flex flex-col font-['Inter',sans-serif] transition-colors duration-200">
          {/* Global Cart Notification Toast */}
          <Toast />

          {isAdminRoute ? (
            /* SECRET ADMIN CONSOLE */
            <AdminLayout
              activeTab={adminTab}
              onTabChange={setAdminTab}
              onNavigate={navigate}
              onOpenNewProduct={() => {
                setAdminTab('products');
                setAdminNewProductDrawer(true);
              }}
            >
              {adminTab === 'overview' && (
                <AdminOverview
                  onNavigateToTab={setAdminTab}
                  onOpenProductDrawer={() => {
                    setAdminTab('products');
                    setAdminNewProductDrawer(true);
                  }}
                />
              )}
              {adminTab === 'products' && (
                <AdminProducts
                  drawerOpen={adminNewProductDrawer}
                  onCloseDrawer={() => setAdminNewProductDrawer(false)}
                />
              )}
              {adminTab === 'orders' && <AdminOrders />}
              {adminTab === 'customers' && <AdminCustomers />}
              {adminTab === 'categories' && <AdminCategories />}
              {adminTab === 'settings' && <AdminSettings />}
            </AdminLayout>
          ) : (
            /* PUBLIC STOREFRONT */
            <>
              <Navbar currentPath={route} onNavigate={navigate} />

              {/* Top Padding: Adjusted to 80px (pt-20) now that second sub-bar is removed */}
              <main className="flex-1 w-full pt-20">
                {route === 'home' && <HomePage onNavigate={navigate} />}
                {route === 'catalog' && (
                  <CatalogPage
                    initialCategory={routeParams.category || ''}
                    initialSearch={routeParams.search || ''}
                    onNavigate={navigate}
                  />
                )}
                {route === 'product-detail' && (
                  <ProductDetailPage
                    productId={routeParams.id}
                    onNavigate={navigate}
                  />
                )}
                {route === 'cart' && <CartPage onNavigate={navigate} />}
                {route === 'checkout' && <CheckoutPage onNavigate={navigate} />}
                {route === 'support' && <SupportPage onNavigate={navigate} />}
                {route === 'login' && <LoginPage onNavigate={navigate} />}
                {route === 'register' && <RegisterPage onNavigate={navigate} />}
              </main>

              <Footer onNavigate={navigate} />
            </>
          )}
        </div>
      </CartProvider>
    </ThemeProvider>
  );
}
