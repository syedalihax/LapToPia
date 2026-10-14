const slugify = value => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const categoryImages = {
  laptops: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80',
  desktops: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80',
  servers: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
  miners: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1000&q=80',
  displays: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1000&q=80',
  components: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1000&q=80',
  memory: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1000&q=80',
  storage: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1000&q=80',
  accessories: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1000&q=80',
};

const categoryDefinitions = [
  { name: 'Laptops', slug: 'laptops', icon: 'laptop_chromebook', imageGroup: 'laptops', subcategories: ['Business Laptops', 'Gaming Laptops', 'Student & Everyday Laptops'] },
  { name: 'Desktop PCs', slug: 'desktop-pcs', icon: 'desktop_windows', imageGroup: 'desktops', subcategories: ['Office PCs', 'Gaming PCs', 'Workstation PCs'] },
  { name: 'Servers & Workstations', slug: 'servers-workstations', icon: 'dns', imageGroup: 'servers', subcategories: ['Tower Servers', 'Rack Servers', 'Professional Workstations'] },
  { name: 'Miner Machines & Mining Hardware', slug: 'miner-machines-mining-hardware', icon: 'memory', imageGroup: 'miners', subcategories: ['Bitcoin ASIC Miners', 'Hydro-Cooled ASIC Miners', 'Mining Power Supplies & Accessories'] },
  { name: 'Monitors & Displays', slug: 'monitors-displays', icon: 'desktop_windows', imageGroup: 'displays', subcategories: ['Office Monitors', 'Gaming Monitors', 'Professional 4K Monitors'] },
  { name: 'Processors (CPU)', slug: 'processors-cpu', icon: 'memory', imageGroup: 'components', subcategories: ['Intel Desktop CPUs', 'AMD Desktop CPUs', 'Server CPUs'] },
  { name: 'Graphics Cards (GPU)', slug: 'graphics-cards-gpu', icon: 'memory', imageGroup: 'components', subcategories: ['NVIDIA Gaming GPUs', 'AMD Gaming GPUs', 'Professional GPUs'] },
  { name: 'RAM & Memory', slug: 'ram-memory', icon: 'memory', imageGroup: 'memory', subcategories: ['DDR4 Desktop RAM', 'DDR5 Desktop RAM', 'Server Memory'] },
  { name: 'SSD, HDD & Storage', slug: 'ssd-hdd-storage', icon: 'dns', imageGroup: 'storage', subcategories: ['NVMe SSDs', 'SATA SSDs', 'Internal Hard Drives'] },
  { name: 'Computer Accessories & Peripherals', slug: 'computer-accessories-peripherals', icon: 'category', imageGroup: 'accessories', subcategories: ['Keyboards & Mice', 'Laptop Hubs & Adapters', 'Webcams & Headsets'] },
].map(category => ({
  ...category,
  value: category.name,
  catalogMain: true,
  subcategories: category.subcategories.map(name => ({
    name,
    slug: `${category.slug}-${slugify(name)}`,
  })),
}));

const brandNames = [
  'Dell', 'ASUS', 'HP', 'Lenovo', 'Bitmain', 'Compatible', 'Samsung', 'Intel', 'AMD',
  'MSI', 'Sapphire', 'NVIDIA', 'Kingston', 'Corsair', 'Crucial', 'Seagate', 'Logitech', 'UGREEN',
];

const catalogRows = [
  ['dell-latitude-5450', 'Dell Latitude 5450', 'Dell', 389000, 8, 0, 0],
  ['asus-rog-strix-g16', 'ASUS ROG Strix G16', 'ASUS', 689000, 5, 0, 1],
  ['hp-pavilion-15', 'HP Pavilion 15', 'HP', 229000, 12, 0, 2],
  ['dell-optiplex-desktop', 'Dell OptiPlex Desktop', 'Dell', 315000, 7, 1, 0],
  ['lenovo-legion-tower', 'Lenovo Legion Tower', 'Lenovo', 625000, 4, 1, 1],
  ['hp-z2-tower-workstation', 'HP Z2 Tower Workstation', 'HP', 749000, 3, 1, 2],
  ['dell-poweredge-t360', 'Dell PowerEdge T360', 'Dell', 1190000, 3, 2, 0],
  ['dell-poweredge-r360', 'Dell PowerEdge R360', 'Dell', 1380000, 2, 2, 1],
  ['lenovo-thinkstation-p3-tower', 'Lenovo ThinkStation P3 Tower', 'Lenovo', 925000, 3, 2, 2],
  ['bitmain-antminer-s21', 'Bitmain Antminer S21', 'Bitmain', 1550000, 2, 3, 0],
  ['bitmain-antminer-s21-xp-hyd', 'Bitmain Antminer S21 XP Hyd', 'Bitmain', 7850000, 1, 3, 1],
  ['compatible-asic-miner-power-supply', 'Compatible ASIC Miner Power Supply', 'Compatible', 85000, 6, 3, 2],
  ['dell-p2425h', 'Dell P2425H', 'Dell', 92000, 10, 4, 0],
  ['asus-tuf-gaming-vg27aq', 'ASUS TUF Gaming VG27AQ', 'ASUS', 169000, 6, 4, 1],
  ['dell-ultrasharp-u2723qe', 'Dell UltraSharp U2723QE', 'Dell', 249000, 4, 4, 2],
  ['intel-core-ultra-7-265k', 'Intel Core Ultra 7 265K', 'Intel', 195000, 5, 5, 0],
  ['amd-ryzen-7-9700x', 'AMD Ryzen 7 9700X', 'AMD', 159000, 5, 5, 1],
  ['intel-xeon-6-processor', 'Intel Xeon 6 Processor', 'Intel', 625000, 2, 5, 2],
  ['msi-geforce-rtx-5070', 'MSI GeForce RTX 5070', 'MSI', 285000, 4, 6, 0],
  ['sapphire-radeon-rx-9070-xt', 'Sapphire Radeon RX 9070 XT', 'Sapphire', 345000, 3, 6, 1],
  ['nvidia-rtx-4000-ada-generation', 'NVIDIA RTX 4000 Ada Generation', 'NVIDIA', 1180000, 2, 6, 2],
  ['kingston-fury-beast-ddr4-16gb', 'Kingston FURY Beast DDR4 16GB', 'Kingston', 12500, 14, 7, 0],
  ['corsair-vengeance-ddr5-32gb-kit', 'Corsair Vengeance DDR5 32GB Kit', 'Corsair', 28500, 10, 7, 1],
  ['samsung-ddr5-ecc-rdimm', 'Samsung DDR5 ECC RDIMM', 'Samsung', 65000, 6, 7, 2],
  ['samsung-990-pro-1tb', 'Samsung 990 PRO 1TB', 'Samsung', 32500, 9, 8, 0],
  ['crucial-mx500-1tb', 'Crucial MX500 1TB', 'Crucial', 24500, 8, 8, 1],
  ['seagate-barracuda-2tb', 'Seagate BarraCuda 2TB', 'Seagate', 19500, 11, 8, 2],
  ['logitech-mk270-wireless-combo', 'Logitech MK270 Wireless Combo', 'Logitech', 8500, 16, 9, 0],
  ['ugreen-usb-c-hub', 'UGREEN USB-C Hub', 'UGREEN', 12500, 13, 9, 1],
  ['logitech-brio-webcam', 'Logitech Brio Webcam', 'Logitech', 39500, 7, 9, 2],
];

const demoDescription = 'Demo catalog listing and sample PKR price, not a verified market quote. Confirm the exact regional SKU, configuration, included accessories, compatibility, and warranty with the seller before purchase; specifications may vary by configuration.';

const products = catalogRows.map(([slug, title, brand, pricePKR, stockQuantity, categoryIndex, subcategoryIndex], index) => {
  const category = categoryDefinitions[categoryIndex];
  const subcategory = category.subcategories[subcategoryIndex];
  return {
    slug,
    title,
    description: demoDescription,
    category: category.value,
    subcategory: subcategory.name,
    subcategorySlug: subcategory.slug,
    brand,
    pricePKR,
    originalPricePKR: pricePKR,
    stockQuantity,
    sku: `LAP-CAT-${String(index + 1).padStart(3, '0')}`,
    images: [categoryImages[category.imageGroup]],
    specs: [],
    isFeatured: index < 6,
    status: stockQuantity > 0 ? 'ACTIVE' : 'OUT_OF_STOCK',
  };
});

export { brandNames, categoryDefinitions, products };
