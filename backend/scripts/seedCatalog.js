import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(scriptDirectory, '../.env') });

const [{ default: mongoose }, { connectDB }, { default: Brand }, { default: Category }, { default: Product }, seedData] = await Promise.all([
  import('mongoose'),
  import('../config/db.js'),
  import('../models/Brand.js'),
  import('../models/Category.js'),
  import('../models/Product.js'),
  import('../data/catalogSeed.js'),
]);
const { brandNames, categoryDefinitions, products } = seedData;

const slugify = value => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function seedCatalog() {
  await connectDB();

  for (const category of categoryDefinitions) {
    await Category.updateOne(
      { slug: category.slug },
      { $set: category },
      { upsert: true, runValidators: true }
    );
  }

  for (const name of brandNames) {
    await Brand.updateOne(
      { name },
      { $setOnInsert: { name, slug: slugify(name), tier: name === 'Compatible' ? 'GENERIC COMPATIBILITY' : 'VERIFIED OEM' } },
      { upsert: true, runValidators: true }
    );
  }

  for (const product of products) {
    await Product.updateOne(
      { slug: product.slug },
      { $set: product },
      { upsert: true, runValidators: true }
    );
  }

  const seededCategorySlugs = categoryDefinitions.map(category => category.slug);
  const seededProductSlugs = products.map(product => product.slug);
  const [categoryCount, categories, productCount] = await Promise.all([
    Category.countDocuments({ slug: { $in: seededCategorySlugs } }),
    Category.find({ slug: { $in: seededCategorySlugs } }).select('slug subcategories'),
    Product.countDocuments({ slug: { $in: seededProductSlugs } }),
  ]);
  const subcategoryCount = categories.reduce((total, category) => total + category.subcategories.length, 0);
  const productsBySubcategory = await Product.aggregate([
    { $match: { slug: { $in: seededProductSlugs } } },
    { $group: { _id: '$subcategorySlug', count: { $sum: 1 } } },
  ]);
  const coveredSubcategories = new Set(productsBySubcategory.map(item => item._id)).size;

  if (categoryCount !== 10 || subcategoryCount < 30 || productCount !== 30 || coveredSubcategories !== 30) {
    throw new Error(`Catalog verification failed: categories=${categoryCount}, subcategories=${subcategoryCount}, products=${productCount}, coveredSubcategories=${coveredSubcategories}`);
  }

  console.log(`Catalog verified: ${categoryCount} main categories, ${subcategoryCount} subcategories, ${productCount} products.`);
}

seedCatalog()
  .catch(error => {
    console.error('Catalog seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
