import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Brand from '../models/Brand.js';
import Product from '../models/Product.js';
import Setting from '../models/Setting.js';
import User from '../models/User.js';

const defaultCategories = [
  {
    name: 'Laptops',
    slug: 'laptops',
    value: 'Laptops',
    icon: 'laptop_chromebook',
    subcategories: ['Gaming', 'Student', 'Office', 'Normal'].map(name => ({ name, slug: name.toLowerCase() }))
  },
  {
    name: 'PC',
    slug: 'pc',
    value: 'PC',
    icon: 'desktop_windows',
    subcategories: ['Gaming', 'Student', 'Office', 'Normal'].map(name => ({ name, slug: name.toLowerCase() }))
  },
  {
    name: 'Servers',
    slug: 'servers',
    value: 'Servers',
    icon: 'dns',
    subcategories: ['Gaming', 'Student', 'Office', 'Normal'].map(name => ({ name, slug: name.toLowerCase() }))
  },
  {
    name: 'Miner Machines',
    slug: 'miner-machines',
    value: 'Miner Machines',
    icon: 'memory',
    subcategories: ['Gaming', 'Student', 'Office', 'Normal'].map(name => ({ name, slug: name.toLowerCase() }))
  }
];

const defaultSettings = {
  storeName: 'LAPTOPIA Hardware Lab PK',
  baseCurrency: 'PKR',
  currencySymbol: 'Rs.',
  supportPhone: '+92 345 800 5566',
  whatsappPhone: '+92 345 800 5566',
  supportEmail: 'orders@laptopia.com.pk',
  warehouseAddress: 'Commercial Area, Phase 6, DHA, Karachi, Sindh',
  lahoreAddress: 'Suite 402, Precision Tech Tower, Main Boulevard, Gulberg III, Lahore',
  maxCodLimitPKR: 500000,
  otpVerificationEnabled: true,
  maintenanceMode: false
};

export async function connectDB() {
  const configuredMongoUri = process.env.MONGODB_URI;
  if (!configuredMongoUri) {
    throw new Error('MONGODB_URI is missing. Add it to backend/.env');
  }
  const mongoUri = configuredMongoUri.replace(/([?&])databasessl=(true|false)(?=&|$)/i, '$1tls=$2');

  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
  await seedDefaults();
}

async function seedDefaults() {
  for (const category of defaultCategories) {
    await Category.updateOne(
      { slug: category.slug },
      { $setOnInsert: category },
      { upsert: true }
    );
  }

  const rawCategories = await Category.collection.find({}).toArray();
  rawCategories.sort((left, right) => left.slug.localeCompare(right.slug));
  const usedSlugs = new Set(rawCategories.map(category => category.slug));
  for (const category of rawCategories) {
    const subcategories = (category.subcategories || []).map(item => {
      const name = (typeof item === 'string' ? item : item?.name || '').trim();
      if (!name) return null;
      const baseSlug = `${category.slug}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
      let slug = item?.slug || baseSlug;
      if (usedSlugs.has(slug)) slug = baseSlug;
      let suffix = 2;
      while (usedSlugs.has(slug)) slug = `${baseSlug}-${suffix++}`;
      usedSlugs.add(slug);
      return typeof item === 'string' || item.slug !== slug ? { name, slug } : item;
    }).filter(Boolean);
    if (JSON.stringify(category.subcategories || []) !== JSON.stringify(subcategories)) {
      await Category.collection.updateOne({ _id: category._id }, { $set: { subcategories } });
    }
  }

  await Product.updateMany({ category: 'Personal Computer' }, { $set: { category: 'PC' } });

  const productBrandNames = await Product.distinct('brand');
  for (const name of productBrandNames.filter(Boolean)) {
    await Brand.updateOne(
      { name },
      { $setOnInsert: { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), tier: 'VERIFIED OEM' } },
      { upsert: true }
    );
  }

  const settingsCount = await Setting.countDocuments();
  if (settingsCount === 0) {
    await Setting.create(defaultSettings);
  }

  await ensureAdminAccount();
}

async function ensureAdminAccount() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn('Admin account not provisioned: set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env');
    return;
  }
  if (password.length < 12) {
    console.warn('Admin account not provisioned: ADMIN_PASSWORD must be at least 12 characters');
    return;
  }

  const name = process.env.ADMIN_NAME?.trim() || 'LAPTOPIA Admin';
  const existingAdmin = await User.findOne({ email });
  if (!existingAdmin) {
    await User.create({ name, email, password, role: 'admin' });
    console.log(`Admin account provisioned for ${email}`);
    return;
  }

  if (existingAdmin.role !== 'admin') {
    console.warn(`Admin account not provisioned: ${email} belongs to a non-admin user. Use a trusted admin account to resolve the conflict.`);
  }
}
