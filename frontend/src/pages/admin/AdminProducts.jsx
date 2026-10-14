import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon.jsx';
import { apiRequest } from '../../utils/api.js';

const productFormSnapshot = values => JSON.stringify({
  title: values.title,
  description: values.description,
  category: values.category,
  subcategorySlug: values.subcategorySlug,
  brand: values.brand,
  pricePKR: values.pricePKR,
  stockQuantity: values.stockQuantity,
  sku: values.sku,
  images: values.images,
  specsText: values.specsText,
});

export default function AdminProducts({ drawerOpen, onCloseDrawer, initialEditProduct = null }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [categoryRecords, setCategoryRecords] = useState([]);
  const [brandRecords, setBrandRecords] = useState([]);

  // Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(drawerOpen);
  const [editingProduct, setEditingProduct] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Laptops');
  const [subcategorySlug, setSubcategorySlug] = useState('');
  const [brand, setBrand] = useState('ASUS');
  const [pricePKR, setPricePKR] = useState('');
  const [stockQuantity, setStockQuantity] = useState('5');
  const [sku, setSku] = useState('');
  const [images, setImages] = useState(['']);
  const [specsText, setSpecsText] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [initialFormSnapshot, setInitialFormSnapshot] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    apiRequest('/api/products')
      .then(res => res.json())
      .then(d => {
        if (d.success && Array.isArray(d.data)) setProducts(d.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
    Promise.all([
      apiRequest('/api/categories').then(response => response.json()),
      apiRequest('/api/categories/brands').then(response => response.json()),
    ]).then(([categoryData, brandData]) => {
      if (categoryData.success && Array.isArray(categoryData.data)) setCategoryRecords(categoryData.data);
      if (brandData.success && Array.isArray(brandData.data)) setBrandRecords(brandData.data);
    }).catch(err => console.error('Failed to load product taxonomy:', err));
  }, []);

  useEffect(() => {
    if (drawerOpen) {
      if (initialEditProduct) {
        startEdit(initialEditProduct);
      } else {
        startNew();
      }
    } else {
      setIsDrawerOpen(false);
    }
  }, [drawerOpen, initialEditProduct]);

  const startNew = () => {
    const newSku = `SKU-${Date.now().toString().slice(-6)}`;
    setInitialFormSnapshot(productFormSnapshot({ title: '', description: '', category: 'Laptops', subcategorySlug: '', brand: 'ASUS', pricePKR: '', stockQuantity: '10', sku: newSku, images: [''], specsText: '' }));
    setEditingProduct(null);
    setTitle('');
    setDescription('');
    setCategory('Laptops');
    setSubcategorySlug('');
    setBrand('ASUS');
    setPricePKR('');
    setStockQuantity('10');
    setSku(newSku);
    setImages(['']);
    setSpecsText('');
    setFormError('');
    setIsDrawerOpen(true);
  };

  const startEdit = (prod) => {
    const formValues = {
      title: prod.title || '',
      description: prod.description || '',
      category: prod.category || 'Laptops',
      subcategorySlug: prod.subcategorySlug || '',
      brand: prod.brand || 'ASUS ROG',
      pricePKR: (prod.pricePKR || '').toString(),
      stockQuantity: prod.stockQuantity?.toString() || '0',
      sku: prod.sku || '',
      images: Array.isArray(prod.images) && prod.images.length > 0 ? [...prod.images] : [''],
      specsText: Array.isArray(prod.specs) ? prod.specs.map(spec => (typeof spec === 'string' ? spec : spec.value)).join(', ') : '',
    };
    setInitialFormSnapshot(productFormSnapshot(formValues));
    setEditingProduct(prod);
    setTitle(formValues.title);
    setDescription(formValues.description);
    setCategory(formValues.category);
    setSubcategorySlug(formValues.subcategorySlug);
    setBrand(formValues.brand);
    setPricePKR(formValues.pricePKR);
    setStockQuantity(formValues.stockQuantity);
    setSku(formValues.sku);
    setImages(formValues.images);
    setSpecsText(formValues.specsText);
    setFormError('');
    setIsDrawerOpen(true);
  };

  const handleImageChange = (index, value) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };

  const addImageField = () => {
    if (images.length < 5) {
      setImages([...images, '']);
    }
  };

  const removeImageField = (index) => {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length) return;

    const currentImages = images.filter(Boolean);
    if (currentImages.length + files.length > 5) {
      setFormError('Maximum 5 images allowed per product');
      return;
    }

    setUploadingImages(true);
    setFormError('');
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
      const response = await apiRequest('/api/products/images', { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Image upload failed');
      const uploadedUrls = data.data.map(image => image.url);
      setImages([...currentImages, ...uploadedUrls]);
    } catch (error) {
      setFormError(error.message || 'Could not upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setFormError('');

    const cleanImages = images.filter(img => img && img.trim());
    if (cleanImages.length < 1) {
      setFormError('At least 1 product image URL is required');
      return;
    }
    if (cleanImages.length > 5) {
      setFormError('Maximum 5 images allowed per product');
      return;
    }
    if (!title.trim()) {
      setFormError('Product title is required');
      return;
    }
    if (!pricePKR || isNaN(Number(pricePKR))) {
      setFormError('Valid price in PKR is required');
      return;
    }

    const specsArray = specsText
      ? specsText.split(',').map(s => s.trim()).filter(Boolean).map(s => ({ label: 'Spec', value: s }))
      : [];

    setSaving(true);
    try {
      const payload = {
        title,
        description,
        category,
        subcategorySlug,
        brand,
        pricePKR: Number(pricePKR),
        stockQuantity: Number(stockQuantity),
        sku,
        images: cleanImages,
        specs: specsArray
      };

      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await apiRequest(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setIsDrawerOpen(false);
        if (onCloseDrawer) onCloseDrawer();
        fetchProducts();
      } else {
        setFormError(data.error || 'Failed to save product');
      }
    } catch (err) {
      setFormError(err.message || 'Error communicating with server');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id, prodTitle) => {
    if (!confirm(`Are you sure you want to delete ${prodTitle} from inventory?`)) return;
    try {
      const res = await apiRequest(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filtered = products.filter(p => {
    const matchCat = filterCat === 'all' || p.category?.toLowerCase() === filterCat.toLowerCase();
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });
  const selectedCategory = categoryRecords.find(item => (item.value || item.name) === category);
  const subcategoryOptions = selectedCategory?.subcategories || [];
  const currentFormSnapshot = productFormSnapshot({ title, description, category, subcategorySlug, brand, pricePKR, stockQuantity, sku, images, specsText });
  const hasProductChanges = currentFormSnapshot !== initialFormSnapshot;

  return (
    <div className="p-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A] uppercase tracking-wider block mb-1">
            INVENTORY MANAGEMENT
          </span>
          <h1 className="font-['Space_Grotesk'] text-[28px] font-bold text-white tracking-tight uppercase">
            Products & Inventory Management
          </h1>
          <p className="font-['Inter'] text-[13px] text-[#71717A]">
            Manage hardware catalog items, set stock bounds, upload 1 to 5 images, and update live prices.
          </p>
        </div>

        <button
          onClick={startNew}
          className="px-4 py-2.5 bg-white text-black hover:bg-neutral-200 font-['Space_Grotesk'] text-[12px] font-bold uppercase rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Icon className="text-[18px]">add</Icon>
          <span>Add New Product</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-[#09090B] border border-[#27272A] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Icon className="absolute left-3 top-2.5 text-[#71717A] text-[18px]">search</Icon>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products by title or SKU..."
            className="w-full bg-[#18181B] border border-[#27272A] rounded-lg pl-9 pr-4 py-2 text-[13px] font-['Inter'] text-white placeholder:text-[#71717A] focus:outline-none focus:border-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
            className="bg-[#18181B] border border-[#27272A] text-white text-[12px] font-['JetBrains_Mono'] px-3 py-2 rounded-lg focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categoryRecords.map(item => <option key={item.id} value={item.value || item.name}>{item.name}</option>)}
          </select>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-[#09090B] border border-[#27272A] rounded-xl overflow-hidden shadow-xl flex flex-col">
        {loading ? (
          <div className="p-16 text-center text-[#71717A] font-['JetBrains_Mono'] text-[13px]">
            Loading inventory products...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center gap-3">
            <Icon className="text-[42px] text-[#71717A]">inventory_2</Icon>
            <h3 className="font-['Space_Grotesk'] text-[18px] font-bold text-white">No Products in Inventory</h3>
            <p className="font-['Inter'] text-[13px] text-[#71717A] max-w-md">
              Start by clicking the "Add New Product" button above to list hardware items with 1 to 5 images.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-['Inter'] text-[13px]">
              <thead className="bg-[#121215] text-[#71717A] font-['Space_Grotesk'] text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-5">Product Details</th>
                  <th className="py-3 px-5">Category</th>
                  <th className="py-3 px-5 text-right">Price (PKR)</th>
                  <th className="py-3 px-5 text-center">Stock</th>
                  <th className="py-3 px-5">Images</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A] font-['JetBrains_Mono'] text-[12px] text-white">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-[#121215] transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded bg-[#18181B] p-1 flex items-center justify-center shrink-0 border border-[#27272A]">
                          <img
                            src={Array.isArray(p.images) && p.images[0] ? p.images[0] : ''}
                            alt={p.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-['Space_Grotesk'] text-[14px] font-bold text-white truncate">{p.title}</span>
                          <span className="text-[11px] text-[#71717A]">{p.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-[#A1A1AA]">{p.category}</td>
                    <td className="py-3.5 px-5 text-right font-bold font-['Space_Grotesk'] text-[15px]">
                      Rs. {Number(p.pricePKR).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-5 text-center font-bold">
                      {p.stockQuantity} units
                    </td>
                    <td className="py-3.5 px-5 text-[#A1A1AA]">
                      {p.images?.length || 0} / 5 photos
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#18181B] border border-[#3F3F46] text-white">
                        {p.status || (p.stockQuantity > 0 ? 'ACTIVE' : 'OUT_OF_STOCK')}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(p)}
                          className="p-1.5 rounded hover:bg-[#18181B] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Icon className="text-[18px]">edit</Icon>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.title)}
                          className="p-1.5 rounded hover:bg-[#18181B] text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Icon className="text-[18px]">delete</Icon>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT PRODUCT SLIDEOVER DRAWER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#09090B] border-l border-[#27272A] h-full overflow-y-auto p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#27272A] pb-4">
              <div className="flex flex-col">
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#71717A] uppercase">
                  {editingProduct ? 'EDIT INVENTORY SKU' : 'CREATE INVENTORY SKU'}
                </span>
                <h2 className="font-['Space_Grotesk'] text-[20px] font-bold text-white uppercase">
                  {editingProduct ? 'Edit Hardware Product' : 'Add New Hardware Product'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  if (onCloseDrawer) onCloseDrawer();
                }}
                className="p-1.5 text-[#71717A] hover:text-white rounded hover:bg-[#18181B] cursor-pointer"
              >
                <Icon className="text-[20px]">close</Icon>
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-[#93000A]/40 border border-[#93000A] rounded-lg text-white font-['Inter'] text-[12px] flex items-center gap-2">
                <Icon className="text-[16px] text-red-400">error</Icon>
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#A1A1AA]">
                  Product Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. ASUS ROG Strix SCAR 18 (2025)"
                  required
                  className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3.5 py-2.5 font-['Inter'] text-[13px] text-white focus:outline-none focus:border-white"
                />
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#A1A1AA]">Description</span>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full resize-y rounded-lg border border-[#27272A] bg-[#18181B] px-3.5 py-2.5 font-['Inter'] text-[13px] text-white focus:border-white focus:outline-none" placeholder="Product information; avoid unverified specifications." />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#A1A1AA]">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={e => { setCategory(e.target.value); setSubcategorySlug(''); }}
                    className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2 font-['Inter'] text-[13px] text-white focus:outline-none cursor-pointer"
                  >
                    {categoryRecords.map(item => <option key={item.id} value={item.value || item.name}>{item.name}</option>)}
                    {!categoryRecords.some(item => (item.value || item.name) === category) && <option value={category}>{category}</option>}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#A1A1AA]">Subcategory</label>
                  <select value={subcategorySlug} onChange={e => setSubcategorySlug(e.target.value)} className="w-full rounded-lg border border-[#27272A] bg-[#18181B] px-3 py-2 font-['Inter'] text-[13px] text-white focus:outline-none">
                    <option value="">Select subcategory (optional)</option>
                    {subcategoryOptions.map(item => <option key={typeof item === 'string' ? item : item.slug} value={typeof item === 'string' ? item : item.slug}>{typeof item === 'string' ? item : item.name}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#A1A1AA]">
                    Brand Partner
                  </label>
                  <select
                    value={brand}
                    onChange={e => setBrand(e.target.value)}
                    className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3.5 py-2 font-['Inter'] text-[13px] text-white focus:outline-none focus:border-white"
                  >
                    {brandRecords.filter(item => item.managed !== false).map(item => <option key={item.id} value={item.name}>{item.name}</option>)}
                    {!brandRecords.some(item => item.name === brand) && <option value={brand}>{brand} (existing)</option>}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#A1A1AA]">
                    Price in PKR *
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={pricePKR}
                    onChange={e => setPricePKR(e.target.value)}
                    placeholder="e.g. 985000"
                    required
                    className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3.5 py-2 font-['JetBrains_Mono'] text-[13px] text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#A1A1AA]">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={stockQuantity}
                    onChange={e => setStockQuantity(e.target.value)}
                    placeholder="e.g. 10"
                    required
                    className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3.5 py-2 font-['JetBrains_Mono'] text-[13px] text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              {/* Multi-Image Inputs (Min 1, Max 5) */}
              <div className="flex flex-col gap-2 pt-2 border-t border-[#27272A]">
                <div className="flex items-center justify-between">
                  <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-white tracking-wider">
                    Product Images (Min 1, Max 5) *
                  </label>
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A]">
                    {images.length} of 5 slots
                  </span>
                </div>

                <label className="flex flex-col gap-1.5 text-[12px] text-[#A1A1AA]">
                  Upload images to Cloudinary (up to 5 MB each)
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={uploadingImages || images.filter(Boolean).length >= 5}
                    onChange={handleImageUpload}
                    className="w-full rounded-lg border border-[#27272A] bg-[#18181B] p-2 text-white file:mr-3 file:rounded file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-black disabled:opacity-50"
                  />
                  {uploadingImages && <span>Uploading images...</span>}
                </label>

                <div className="flex flex-col gap-2.5">
                  {images.map((img, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded bg-[#18181B] border border-[#27272A] flex items-center justify-center shrink-0 overflow-hidden">
                        {img ? (
                          <img src={img} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <Icon className="text-[16px] text-[#71717A]">image</Icon>
                        )}
                      </div>
                      <input
                        type="url"
                        value={img}
                        onChange={e => handleImageChange(idx, e.target.value)}
                        placeholder={`Image ${idx + 1} URL (https://...)`}
                        required={idx === 0}
                        className="flex-1 bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2 font-['JetBrains_Mono'] text-[12px] text-white focus:outline-none focus:border-white"
                      />
                      {images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField(idx)}
                          className="p-1.5 text-red-400 hover:text-red-300 cursor-pointer"
                        >
                          <Icon className="text-[18px]">remove_circle</Icon>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {images.length < 5 && (
                  <button
                    type="button"
                    onClick={addImageField}
                    className="self-start text-[11px] font-['Space_Grotesk'] text-white hover:underline uppercase font-bold flex items-center gap-1 mt-1 cursor-pointer"
                  >
                    <Icon className="text-[16px]">add</Icon>
                    <span>+ Add Another Image Slot ({images.length}/5)</span>
                  </button>
                )}
              </div>

              {/* Specs comma separated */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-[#27272A]">
                <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#A1A1AA]">
                  Key Technical Specifications (Comma separated)
                </label>
                <textarea
                  rows={2}
                  value={specsText}
                  onChange={e => setSpecsText(e.target.value)}
                  placeholder="e.g. CPU, memory, storage, graphics"
                  className="w-full bg-[#18181B] border border-[#27272A] rounded-lg p-3 font-['JetBrains_Mono'] text-[12px] text-white focus:outline-none focus:border-white resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#27272A]">
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    if (onCloseDrawer) onCloseDrawer();
                  }}
                  className="flex-1 py-3 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-white font-['Space_Grotesk'] text-[12px] font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                {hasProductChanges && <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-lg bg-white hover:bg-neutral-200 text-black font-['Space_Grotesk'] text-[12px] font-bold uppercase cursor-pointer"
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
