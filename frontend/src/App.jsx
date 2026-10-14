import React, { useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { StoreSettingsProvider } from './context/StoreSettingsContext.jsx';
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
import ProfilePage from './pages/ProfilePage.jsx';
import AboutPage from './pages/AboutPage.jsx';

// Admin Suite (Loaded on Secret Route)
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminOverview from './pages/admin/AdminOverview.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminCustomers from './pages/admin/AdminCustomers.jsx';
import AdminCategories from './pages/admin/AdminCategories.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';

function getRoutePath(route, params = {}) {
  const paths = {
    home: '/',
    catalog: '/catalog',
    cart: '/cart',
    checkout: '/checkout',
    support: '/support',
    login: '/login',
    register: '/register',
    profile: '/profile',
    about: '/about',
    admin: '/admin',
    'admin-ops': '/admin',
  };

  if (route === 'product-detail') {
    return params.id ? `/products/${encodeURIComponent(params.id)}` : '/catalog';
  }

  const path = paths[route] || `/${route}`;
  if (route === 'profile' && params.view) return `${path}?view=${encodeURIComponent(params.view)}`;
  if (route !== 'catalog') return path;

  const query = new URLSearchParams();
  if (params.category) query.set('category', params.category);
  if (params.subcategory) query.set('subcategory', params.subcategory);
  if (params.search) query.set('search', params.search);
  const queryString = query.toString();
  return queryString ? `${path}?${queryString}` : path;
}

function StorefrontLayout({ onNavigate, currentPath }) {
  return (
    <>
      <Navbar currentPath={currentPath} onNavigate={onNavigate} />
      <main className="flex-1 w-full pt-20">
        <Outlet />
      </main>
      <Footer onNavigate={onNavigate} />
    </>
  );
}

function RootRoute({ onNavigate }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const legacyHash = location.hash.replace(/^#\/?/, '');
  const legacyPaths = {
    home: '/', catalog: '/catalog', cart: '/cart', checkout: '/checkout',
    support: '/support', login: '/login', register: '/register',
  };

  if (params.get('admin') === 'true' || legacyHash === 'admin-ops' || legacyHash.startsWith('admin')) {
    return <Navigate to="/admin" replace />;
  }
  if (legacyPaths[legacyHash]) return <Navigate to={legacyPaths[legacyHash]} replace />;

  const currentPath = location.pathname.split('/')[1] || 'home';
  return <StorefrontLayout onNavigate={onNavigate} currentPath={currentPath} />;
}

function CatalogRoute({ onNavigate }) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  return (
    <CatalogPage
      key={location.search}
      initialCategory={searchParams.get('category') || ''}
      initialSubcategory={searchParams.get('subcategory') || ''}
      initialSearch={searchParams.get('search') || ''}
      onNavigate={onNavigate}
    />
  );
}

function ProductDetailRoute({ onNavigate }) {
  const { id } = useParams();
  return <ProductDetailPage productId={id} onNavigate={onNavigate} />;
}

function AdminRouteLayout({ onNavigate, onOpenNewProduct }) {
  const location = useLocation();
  const routerNavigate = useNavigate();
  const { user, logout } = useAuth();
  const requestedTab = location.pathname.split('/')[2] || 'overview';
  const validTabs = ['overview', 'products', 'orders', 'customers', 'categories', 'settings'];
  const activeTab = validTabs.includes(requestedTab) ? requestedTab : 'overview';

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={(tab) => routerNavigate(tab === 'overview' ? '/admin' : `/admin/${tab}`)}
      onNavigate={onNavigate}
      onOpenNewProduct={onOpenNewProduct}
      user={user}
      onLogout={logout}
    >
      <Outlet />
    </AdminLayout>
  );
}

function AdminAccessRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090B] text-white flex items-center justify-center font-['JetBrains_Mono'] text-sm">
        Verifying administrator access...
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (user.role !== 'admin') return <Navigate to="/" replace state={{ adminDenied: true }} />;

  return children;
}

function CustomerAccessRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <div className="p-16 text-center text-[#71717A]">Loading account…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

function AppRoutes() {
  const routerNavigate = useNavigate();
  const [adminNewProductDrawer, setAdminNewProductDrawer] = useState(false);
  const navigate = (newRoute, params = {}) => {
    routerNavigate(getRoutePath(newRoute, params));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openNewProduct = () => {
    setAdminNewProductDrawer(true);
    routerNavigate('/admin/products');
  };

  return (
    <ThemeProvider>
      <StoreSettingsProvider>
        <CartProvider>
          <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] text-[#09090B] dark:text-[#FAFAFA] flex flex-col font-['Inter',sans-serif] transition-colors duration-200">
            <Toast />
            <Routes>
            <Route path="/" element={<RootRoute onNavigate={navigate} />}>
              <Route index element={<HomePage onNavigate={navigate} />} />
              <Route path="catalog" element={<CatalogRoute onNavigate={navigate} />} />
              <Route path="products/:id" element={<ProductDetailRoute onNavigate={navigate} />} />
              <Route path="cart" element={<CartPage onNavigate={navigate} />} />
              <Route path="support" element={<SupportPage onNavigate={navigate} />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="profile" element={<CustomerAccessRoute><ProfilePage /></CustomerAccessRoute>} />
              <Route path="checkout" element={<CustomerAccessRoute><CheckoutPage onNavigate={navigate} /></CustomerAccessRoute>} />
            </Route>
            <Route path="/login" element={<LoginPage onNavigate={navigate} />} />
            <Route path="/register" element={<RegisterPage onNavigate={navigate} />} />
            <Route
              path="/admin"
              element={(
                <AdminAccessRoute>
                  <AdminRouteLayout onNavigate={navigate} onOpenNewProduct={openNewProduct} />
                </AdminAccessRoute>
              )}
            >
              <Route index element={<AdminOverview onNavigateToTab={(tab) => navigate(tab === 'overview' ? 'admin' : `admin/${tab}`)} onOpenProductDrawer={openNewProduct} />} />
              <Route path="products" element={<AdminProducts drawerOpen={adminNewProductDrawer} onCloseDrawer={() => setAdminNewProductDrawer(false)} />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </CartProvider>
      </StoreSettingsProvider>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
