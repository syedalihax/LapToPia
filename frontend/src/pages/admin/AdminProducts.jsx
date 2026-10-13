import React, { useState, useEffect } from 'react';

export default function AdminProducts({ drawerOpen, onCloseDrawer, initialEditProduct = null }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');

  // Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(drawerOpen);
  const [editingProduct, setEditingProduct] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Laptops');
  const [brand, setBrand] = useState('ASUS ROG');
  const [pricePKR, setPricePKR] = useState('');
  const [stockQuantity, setStockQuantity] = useState('5');
  const [sku, setSku] = useState('');
  const [images, setImages] = useState(['']);
  const [specsText, setSpecsText] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    fetch('/api/products')
      .then(res => res.json())
      .then(d => {
        if (d.success && Array.isArray(d.data)) setProducts(d.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
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
    setEditingProduct(null);
    setTitle('');
    setCategory('Laptops');
    setBrand('ASUS ROG');
    setPricePKR('');
    setStockQuantity('10');
    setSku(`SKU-${Date.now().toString().slice(-6)}`);
    setImages(['https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80']);
    setSpecsText('i9-14900HX, RTX 4090 16GB, 64GB DDR5, 2TB NVMe');
    setFormError('');
    setIsDrawerOpen(true);
  };

  const startEdit = (prod) => {
    setEditingProduct(prod);
    setTitle(prod.title || '');
    setCategory(prod.category || 'Laptops');
    setBrand(prod.brand || 'ASUS ROG');
    setPricePKR(prod.pricePKR || '');
    setStockQuantity(prod.stockQuantity?.toString() || '0');
    setSku(prod.sku || '');
    setImages(Array.isArray(prod.images) && prod.images.length > 0 ? [...prod.images] : ['']);
    setSpecsText(
      Array.isArray(prod.specs)
        ? prod.specs.map(s => (typeof s === 'string' ? s : s.value)).join(', ')
        : ''
    );
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
        category,
        brand,
        pricePKR: Number(pricePKR),
        stockQuantity: Number(stockQuantity),
        sku,
        images: cleanImages,
        specs: specsArray
      };

      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
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
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
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

  return (
    <div className="p-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A] uppercase tracking-wider block mb-1">
            INVENTORY ENGINE // MERN PERSISTENCE
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
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add New Product</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-[#09090B] border border-[#27272A] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#71717A] text-[18px]">search</span>
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
            <option value="Laptops">Laptops</option>
            <option value="Components & GPUs">Components & GPUs</option>
            <option value="Custom Rigs">Custom Rigs</option>
            <option value="Monitors">Monitors</option>
            <option value="Sim Gear">Sim Gear</option>
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
            <span className="material-symbols-outlined text-[42px] text-[#71717A]">inventory_2</span>
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
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.title)}
                          className="p-1.5 rounded hover:bg-[#18181B] text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
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
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-[#93000A]/40 border border-[#93000A] rounded-lg text-white font-['Inter'] text-[12px] flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-red-400">error</span>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#A1A1AA]">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2 font-['Inter'] text-[13px] text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Laptops">Laptops</option>
                    <option value="Components & GPUs">Components & GPUs</option>
                    <option value="Custom Rigs">Custom Rigs</option>
                    <option value="Monitors">Monitors</option>
                    <option value="Sim Gear">Sim Gear</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#A1A1AA]">
                    Brand Partner
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={e => setBrand(e.target.value)}
                    placeholder="e.g. ASUS ROG, MSI, Razer"
                    className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3.5 py-2 font-['Inter'] text-[13px] text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#A1A1AA]">
                    Price in PKR *
                  </label>
                  <input
                    type="number"
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

                <div className="flex flex-col gap-2.5">
                  {images.map((img, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded bg-[#18181B] border border-[#27272A] flex items-center justify-center shrink-0 overflow-hidden">
                        {img ? (
                          <img src={img} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <span className="material-symbols-outlined text-[16px] text-[#71717A]">image</span>
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
                          <span className="material-symbols-outlined text-[18px]">remove_circle</span>
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
                    <span className="material-symbols-outlined text-[16px]">add</span>
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
                  placeholder="e.g. i9-14900HX, RTX 4090 16GB, 64GB DDR5, 2TB NVMe"
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
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-lg bg-white hover:bg-neutral-200 text-black font-['Space_Grotesk'] text-[12px] font-bold uppercase cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Commit Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
