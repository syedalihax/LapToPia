import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_PATH = path.resolve(__dirname, '../data/store.json');

function readStore() {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      return { products: [], categories: [], brands: [], orders: [], customers: [], settings: {} };
    }
    const data = fs.readFileSync(STORE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading store.json:', err);
    return { products: [], categories: [], brands: [], orders: [], customers: [], settings: {} };
  }
}

function writeStore(store) {
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing store.json:', err);
    return false;
  }
}

// Product Operations
export function getProducts(filters = {}) {
  const store = readStore();
  let list = store.products || [];

  if (filters.category) {
    list = list.filter(p => p.category?.toLowerCase() === filters.category.toLowerCase());
  }
  if (filters.brand) {
    list = list.filter(p => p.brand?.toLowerCase() === filters.brand.toLowerCase());
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q)
    );
  }
  if (filters.minPrice) {
    list = list.filter(p => p.pricePKR >= Number(filters.minPrice));
  }
  if (filters.maxPrice) {
    list = list.filter(p => p.pricePKR <= Number(filters.maxPrice));
  }
  if (filters.status) {
    list = list.filter(p => p.status === filters.status);
  }

  return list;
}

export function getProductById(id) {
  const store = readStore();
  return (store.products || []).find(p => p.id === id) || null;
}

export function addProduct(productData) {
  const store = readStore();
  const newProduct = {
    id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    title: productData.title || 'Untitled Hardware',
    category: productData.category || 'Laptops',
    brand: productData.brand || 'Custom Build',
    pricePKR: Number(productData.pricePKR) || 0,
    originalPricePKR: Number(productData.originalPricePKR) || Number(productData.pricePKR) || 0,
    stockQuantity: Math.max(0, Number(productData.stockQuantity) || 0),
    sku: productData.sku || `SKU-${Date.now().toString().slice(-6)}`,
    images: Array.isArray(productData.images) && productData.images.length > 0 ? productData.images.slice(0, 5) : ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80'],
    specs: Array.isArray(productData.specs) ? productData.specs : [],
    variants: Array.isArray(productData.variants) ? productData.variants : [],
    isFeatured: Boolean(productData.isFeatured),
    status: Number(productData.stockQuantity) > 0 ? 'ACTIVE' : 'OUT_OF_STOCK',
    createdAt: new Date().toISOString()
  };

  store.products = store.products || [];
  store.products.unshift(newProduct);
  writeStore(store);
  return newProduct;
}

export function updateProduct(id, updates) {
  const store = readStore();
  const index = (store.products || []).findIndex(p => p.id === id);
  if (index === -1) return null;

  const existing = store.products[index];
  const newStock = updates.stockQuantity !== undefined ? Math.max(0, Number(updates.stockQuantity)) : existing.stockQuantity;

  const updated = {
    ...existing,
    ...updates,
    stockQuantity: newStock,
    status: newStock > 0 ? (updates.status || 'ACTIVE') : 'OUT_OF_STOCK',
    updatedAt: new Date().toISOString()
  };

  if (updates.images && Array.isArray(updates.images)) {
    updated.images = updates.images.slice(0, 5);
  }

  store.products[index] = updated;
  writeStore(store);
  return updated;
}

export function deleteProduct(id) {
  const store = readStore();
  const beforeLen = (store.products || []).length;
  store.products = (store.products || []).filter(p => p.id !== id);
  if (store.products.length !== beforeLen) {
    writeStore(store);
    return true;
  }
  return false;
}

// Order Operations with Auto Stock Deduction
export function getOrders() {
  const store = readStore();
  return store.orders || [];
}

export function getOrderById(id) {
  const store = readStore();
  return (store.orders || []).find(o => o.id === id || o.orderNumber === id) || null;
}

export function addOrder(orderData) {
  const store = readStore();
  const now = new Date();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const cityCode = (orderData.customer?.city || 'KHI').slice(0, 3).toUpperCase();
  const orderNumber = `LP-${randomSuffix}-${cityCode}`;

  const newOrder = {
    id: `ord-${Date.now()}-${randomSuffix}`,
    orderNumber,
    customer: {
      fullName: orderData.customer?.fullName || 'Anonymous Customer',
      email: orderData.customer?.email || '',
      phone: orderData.customer?.phone || '',
      province: orderData.customer?.province || 'Sindh',
      city: orderData.customer?.city || 'Karachi',
      area: orderData.customer?.area || '',
      streetAddress: orderData.customer?.streetAddress || '',
      landmark: orderData.customer?.landmark || ''
    },
    items: Array.isArray(orderData.items) ? orderData.items : [],
    grossTotalPKR: Number(orderData.grossTotalPKR) || 0,
    paymentMethod: 'CASH_ON_DELIVERY',
    orderStatus: 'PENDING_COD',
    courier: orderData.courier || 'TCS_EXPRESS',
    createdAt: now.toISOString()
  };

  // Automated Stock Deduction
  if (Array.isArray(newOrder.items) && store.products) {
    for (const item of newOrder.items) {
      const prodIndex = store.products.findIndex(p => p.id === item.productId || p.sku === item.sku);
      if (prodIndex !== -1) {
        const prod = store.products[prodIndex];
        const newStock = Math.max(0, (prod.stockQuantity || 0) - (Number(item.qty) || 1));
        store.products[prodIndex] = {
          ...prod,
          stockQuantity: newStock,
          status: newStock > 0 ? 'ACTIVE' : 'OUT_OF_STOCK'
        };
      }
    }
  }

  store.orders = store.orders || [];
  store.orders.unshift(newOrder);

  // Update or insert customer history
  if (newOrder.customer.phone || newOrder.customer.email) {
    store.customers = store.customers || [];
    const existingCustIndex = store.customers.findIndex(c =>
      (newOrder.customer.phone && c.phone === newOrder.customer.phone) ||
      (newOrder.customer.email && c.email === newOrder.customer.email)
    );
    if (existingCustIndex !== -1) {
      const cust = store.customers[existingCustIndex];
      store.customers[existingCustIndex] = {
        ...cust,
        ordersCount: (cust.ordersCount || 0) + 1,
        totalSpentPKR: (cust.totalSpentPKR || 0) + newOrder.grossTotalPKR
      };
    } else {
      store.customers.push({
        id: `cust-${Date.now()}`,
        name: newOrder.customer.fullName,
        email: newOrder.customer.email,
        phone: newOrder.customer.phone,
        city: newOrder.customer.city,
        province: newOrder.customer.province,
        address: `${newOrder.customer.streetAddress}, ${newOrder.customer.area}`,
        totalSpentPKR: newOrder.grossTotalPKR,
        ordersCount: 1,
        tier: 'FIRST TIME'
      });
    }
  }

  writeStore(store);
  return newOrder;
}

export function updateOrderStatus(orderId, newStatus) {
  const store = readStore();
  const index = (store.orders || []).findIndex(o => o.id === orderId || o.orderNumber === orderId);
  if (index === -1) return null;

  store.orders[index].orderStatus = newStatus;
  store.orders[index].updatedAt = new Date().toISOString();
  writeStore(store);
  return store.orders[index];
}

// Categories & Brands
export function getCategories() {
  const store = readStore();
  return store.categories || [];
}

export function getBrands() {
  const store = readStore();
  return store.brands || [];
}

// Store Settings
export function getSettings() {
  const store = readStore();
  return store.settings || {};
}

export function updateSettings(updates) {
  const store = readStore();
  store.settings = { ...store.settings, ...updates };
  writeStore(store);
  return store.settings;
}

// Customer Directory
export function getCustomers() {
  const store = readStore();
  return store.customers || [];
}
