import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Customer from '../models/Customer.js';
import Product from '../models/Product.js';
import Setting from '../models/Setting.js';

const defaultCategories = [
  {
    name: 'High-Performance Laptops',
    slug: 'laptops',
    icon: 'laptop_chromebook',
    subcategories: ['Gaming Enthusiast', 'Creator OLED', 'Apple Silicon']
  },
  {
    name: 'Graphics Cards & GPUs',
    slug: 'pc-components',
    icon: 'memory',
    subcategories: ['NVIDIA RTX 40-Series', 'AMD Radeon RX 7000', 'Workstation GPUs']
  },
  {
    name: 'Custom Gaming Rigs',
    slug: 'custom-pc',
    icon: 'desktop_windows',
    subcategories: ['Liquid Cooled Rigs', 'Dual-Chamber Builds', 'Compact ITX Rigs']
  },
  {
    name: 'Sim Racing & Pro Gear',
    slug: 'gaming-gear',
    icon: 'sports_motorsports',
    subcategories: ['Direct Drive Wheelbases', 'Load Cell Pedals', 'Cockpits & Rigs']
  },
  {
    name: 'OLED & Curved Monitors',
    slug: 'monitors-displays',
    icon: 'tv',
    subcategories: ['QD-OLED 240Hz+', '49" Ultrawide Panels', 'Color-Calibrated 4K']
  },
  {
    name: 'Enterprise & Storage',
    slug: 'networking-servers',
    icon: 'dns',
    subcategories: ['Gen5 NVMe Arrays', '10GbE Network Switches', 'Synology NAS']
  }
];

const defaultSettings = {
  storeName: 'LAPTOPIA Hardware Lab PK',
  baseCurrency: 'PKR',
  currencySymbol: 'Rs.',
  supportPhone: '+92 300 0000000',
  supportEmail: 'orders@laptops.pk',
  warehouseAddress: 'Commercial Area, Phase 6, DHA, Karachi, Sindh',
  lahoreAddress: 'Suite 402, Precision Tech Tower, Main Boulevard, Gulberg III, Lahore',
  maxCodLimitPKR: 500000,
  otpVerificationEnabled: true,
  maintenanceMode: false,
  adminSecretKey: 'laptopia2025'
};

const defaultProducts = [
  {
    title: 'ASUS ROG Zephyrus G14',
    category: 'Laptops',
    brand: 'ASUS ROG',
    pricePKR: 549000,
    originalPricePKR: 599000,
    stockQuantity: 12,
    sku: 'ASUS-G14-14',
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80'],
    specs: [
      { label: 'CPU', value: 'AMD Ryzen 9 7940HS' },
      { label: 'GPU', value: 'NVIDIA RTX 4060 8GB' },
      { label: 'RAM', value: '32GB DDR5' },
      { label: 'Storage', value: '1TB NVMe SSD' }
    ],
    isFeatured: true,
    status: 'ACTIVE'
  },
  {
    title: 'MSI Stealth 16 Studio',
    category: 'Laptops',
    brand: 'MSI Gaming',
    pricePKR: 639000,
    originalPricePKR: 689000,
    stockQuantity: 8,
    sku: 'MSI-STEALTH-16',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80'],
    specs: [
      { label: 'CPU', value: 'Intel Core i7-13700H' },
      { label: 'GPU', value: 'RTX 4070 8GB' },
      { label: 'RAM', value: '32GB DDR5' },
      { label: 'Display', value: '16" QHD+ 240Hz' }
    ],
    isFeatured: true,
    status: 'ACTIVE'
  },
  {
    title: 'NVIDIA RTX 4090 Founders Edition',
    category: 'Graphics Cards & GPUs',
    brand: 'NVIDIA',
    pricePKR: 420000,
    originalPricePKR: 470000,
    stockQuantity: 5,
    sku: 'NVIDIA-4090-FE',
    images: ['https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=80'],
    specs: [
      { label: 'GPU', value: 'RTX 4090' },
      { label: 'VRAM', value: '24GB GDDR6X' },
      { label: 'RTX', value: 'DLSS 3.5' },
      { label: 'Interface', value: 'PCIe 4.0' }
    ],
    isFeatured: false,
    status: 'ACTIVE'
  },
  {
    title: 'Samsung Odyssey OLED G9',
    category: 'OLED & Curved Monitors',
    brand: 'Samsung Electronics',
    pricePKR: 380000,
    originalPricePKR: 430000,
    stockQuantity: 4,
    sku: 'SAMSUNG-G9-OLED',
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80'],
    specs: [
      { label: 'Panel', value: '49" Dual QHD OLED' },
      { label: 'Refresh', value: '240Hz' },
      { label: 'HDR', value: 'HDR True Black 400' },
      { label: 'Curve', value: '1800R' }
    ],
    isFeatured: true,
    status: 'ACTIVE'
  }
];

const defaultCustomers = [
  {
    name: 'Tariq Mahmood',
    email: 'tariq.m@nexustech.pk',
    phone: '+92 300 8472910',
    city: 'Karachi',
    province: 'Sindh',
    address: 'DHA Phase 6, Khayaban-e-Shahbaz, Karachi',
    totalSpentPKR: 2450000,
    ordersCount: 8,
    tier: 'VIP ENTERPRISE'
  },
  {
    name: 'Bilal Ahmed',
    email: 'bilal.ahmed.dev@gmail.com',
    phone: '+92 321 4459812',
    city: 'Lahore',
    province: 'Punjab',
    address: 'Gulberg III, Near MM Alam Rd, Lahore',
    totalSpentPKR: 1840000,
    ordersCount: 4,
    tier: 'VIP BUYER'
  }
];

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is missing. Add it to backend/.env');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
  await seedDefaults();
}

async function seedDefaults() {
  const categoriesCount = await Category.countDocuments();
  if (categoriesCount === 0) {
    await Category.insertMany(defaultCategories);
  }

  const productsCount = await Product.countDocuments();
  if (productsCount === 0) {
    await Product.insertMany(defaultProducts);
  }

  const customersCount = await Customer.countDocuments();
  if (customersCount === 0) {
    await Customer.insertMany(defaultCustomers);
  }

  const settingsCount = await Setting.countDocuments();
  if (settingsCount === 0) {
    await Setting.create(defaultSettings);
  }
}
