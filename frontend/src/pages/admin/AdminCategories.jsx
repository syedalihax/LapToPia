import React, { useCallback, useEffect, useState } from 'react';
import Icon from '../../components/Icon.jsx';
import { apiRequest, parseApiResponse } from '../../utils/api.js';

const inputClass = "w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2.5 text-[13px] text-white placeholder:text-[#71717A] focus:outline-none focus:border-white";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editor, setEditor] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', value: '', icon: 'category', image: '', subcategories: '', tier: 'VERIFIED OEM', website: '' });
  const [initialForm, setInitialForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadTaxonomy = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [categoryResponse, brandResponse] = await Promise.all([
        apiRequest('/api/categories'),
        apiRequest('/api/categories/brands'),
      ]);
      const [categoryData, brandData] = await Promise.all([
        parseApiResponse(categoryResponse),
        parseApiResponse(brandResponse),
      ]);
      setCategories(categoryData.data || []);
      setBrands(brandData.data || []);
    } catch (loadError) {
      setError(loadError.message || 'Unable to load categories and brands.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTaxonomy();
  }, [loadTaxonomy]);

  const openEditor = (type, item = null) => {
    setError('');
    setNotice('');
    setEditor({ type, id: item?.id || null });
    const nextForm = {
      name: item?.name || '',
      slug: item?.slug || '',
      value: item?.value || item?.name || '',
      icon: item?.icon || 'category',
      image: item?.image || '',
      subcategories: Array.isArray(item?.subcategories) ? item.subcategories.map(subcategory => typeof subcategory === 'string' ? subcategory : subcategory.name).join(', ') : '',
      tier: item?.tier || 'VERIFIED OEM',
      website: item?.website || '',
    };
    setForm(nextForm);
    setInitialForm(nextForm);
  };

  const closeEditor = () => setEditor(null);
  const hasFormChanges = initialForm && JSON.stringify(form) !== JSON.stringify(initialForm);

  const handleCategoryImageUpload = async event => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setError('');
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await apiRequest('/api/categories/images', {
        method: 'POST',
        body: formData,
      });
      const data = await parseApiResponse(response);
      setForm(prev => ({ ...prev, image: data.data.url }));
    } catch (uploadError) {
      setError(uploadError.message || 'Unable to upload category image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async event => {
    event.preventDefault();
    if (!editor || !form.name.trim()) return;
    setSaving(true);
    setError('');
    try {
      const isCategory = editor.type === 'category';
      const url = isCategory
        ? `/api/categories${editor.id ? `/${editor.id}` : ''}`
        : `/api/categories/brands${editor.id ? `/${editor.id}` : ''}`;
      const payload = isCategory
        ? { name: form.name.trim(), slug: form.slug.trim(), value: form.value.trim(), icon: form.icon.trim(), image: form.image.trim(), subcategories: form.subcategories }
        : { name: form.name.trim(), slug: form.slug.trim(), tier: form.tier.trim(), website: form.website.trim() };
      const response = await apiRequest(url, {
        method: editor.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      await parseApiResponse(response);
      setNotice(`${isCategory ? 'Category' : 'Brand'} ${editor.id ? 'updated' : 'added'}.`);
      closeEditor();
      await loadTaxonomy();
    } catch (saveError) {
      setError(saveError.message || 'Unable to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (type, item) => {
    if (!window.confirm(`Delete ${type} “${item.name}”? This cannot be undone.`)) return;
    setError('');
    setNotice('');
    try {
      const endpoint = type === 'category' ? `/api/categories/${item.id}` : `/api/categories/brands/${item.id}`;
      await parseApiResponse(await apiRequest(endpoint, { method: 'DELETE' }));
      setNotice(`${type === 'category' ? 'Category' : 'Brand'} deleted.`);
      await loadTaxonomy();
    } catch (deleteError) {
      setError(deleteError.message || `Unable to delete ${type}.`);
    }
  };

  const handleAdoptBrand = async brand => {
    setError('');
    setNotice('');
    try {
      await parseApiResponse(await apiRequest('/api/categories/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: brand.name, tier: 'VERIFIED OEM' }),
      }));
      setNotice(`${brand.name} added to managed brands.`);
      await loadTaxonomy();
    } catch (adoptError) {
      setError(adoptError.message || 'Unable to manage this brand.');
    }
  };

  return (
    <div className="p-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="font-['JetBrains_Mono'] text-[11px] text-[#71717A] uppercase tracking-wider block mb-1">
            PRODUCT CATEGORIES & BRANDS
          </span>
          <h1 className="font-['Space_Grotesk'] text-[28px] font-bold text-white tracking-tight uppercase">
            Categories & Brand Partners
          </h1>
          <p className="font-['Inter'] text-[13px] text-[#A1A1AA] mt-1">
            Add, edit, and remove categories and brands used in the store.
          </p>
        </div>
        <button onClick={loadTaxonomy} className="px-4 py-2 rounded-lg bg-[#18181B] border border-[#27272A] text-white flex items-center gap-2 text-sm hover:bg-[#27272A]">
          <Icon>sync</Icon> Refresh
        </button>
      </div>

      {error && <div role="alert" className="p-3 rounded-lg border border-red-900 bg-red-950/50 text-red-200 text-sm">{error}</div>}
      {notice && <div role="status" className="p-3 rounded-lg border border-emerald-900 bg-emerald-950/50 text-emerald-200 text-sm">{notice}</div>}

      {loading ? (
        <div className="p-16 text-center text-[#A1A1AA]">Loading categories and brands…</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          <section className="bg-[#09090B] border border-[#27272A] rounded-2xl p-5 sm:p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-['Space_Grotesk'] text-[18px] font-bold text-white">Categories</h2>
                <p className="text-xs text-[#71717A] mt-1">{categories.length} saved categories</p>
              </div>
              <button onClick={() => openEditor('category')} className="px-3 py-2 rounded-lg bg-white text-black flex items-center gap-1.5 text-xs font-bold uppercase hover:bg-neutral-200">
                <Icon>add</Icon> Add category
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {categories.length === 0 && <p className="text-sm text-[#71717A] py-6 text-center">No categories yet. Add your first category.</p>}
              {categories.map(category => (
                <article key={category.id} className="rounded-xl border border-[#27272A] bg-[#121215] p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-10 h-10 rounded-lg bg-[#222226] text-white flex items-center justify-center shrink-0 overflow-hidden">
                        <Icon className="text-xl">{category.icon || 'category'}</Icon>
                        {category.image && <img src={category.image} alt="" className="absolute inset-0 w-full h-full object-cover" onError={event => { event.currentTarget.style.display = 'none'; }} />}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-white truncate">{category.name}</h3>
                        <p className="text-xs text-[#71717A] font-mono">/{category.slug} · Product value: {category.value || category.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => openEditor('category', category)} title={`Edit ${category.name}`} className="p-2 rounded-md text-[#A1A1AA] hover:text-white hover:bg-[#27272A]"><Icon>edit</Icon></button>
                      <button onClick={() => handleDelete('category', category)} title={`Delete ${category.name}`} className="p-2 rounded-md text-red-400 hover:text-red-300 hover:bg-red-950/40"><Icon>delete</Icon></button>
                    </div>
                  </div>
                  {!!category.subcategories?.length && (
                    <div className="flex flex-wrap gap-1.5 border-t border-[#27272A] pt-3">
                      {category.subcategories.map(subcategory => {
                        const name = typeof subcategory === 'string' ? subcategory : subcategory.name;
                        const slug = typeof subcategory === 'string' ? '' : subcategory.slug;
                        return <span key={slug || name} title={slug || undefined} className="px-2 py-1 rounded bg-[#1A1A1E] text-[11px] text-[#A1A1AA]">{name}</span>;
                      })}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>

          <section className="bg-[#09090B] border border-[#27272A] rounded-2xl p-5 sm:p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-['Space_Grotesk'] text-[18px] font-bold text-white">Brands</h2>
                <p className="text-xs text-[#71717A] mt-1">{brands.length} saved or product-linked brands</p>
              </div>
              <button onClick={() => openEditor('brand')} className="px-3 py-2 rounded-lg bg-white text-black flex items-center gap-1.5 text-xs font-bold uppercase hover:bg-neutral-200">
                <Icon>add</Icon> Add brand
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {brands.length === 0 && <p className="text-sm text-[#71717A] py-6 text-center">No brands yet. Add your first brand.</p>}
              {brands.map(brand => (
                <article key={brand.id} className="rounded-xl border border-[#27272A] bg-[#121215] p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">{brand.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#202024] text-[#A1A1AA] uppercase">{brand.tier || 'VERIFIED OEM'}</span>
                      {brand.website && <a href={brand.website} target="_blank" rel="noreferrer" className="text-[11px] text-blue-300 truncate">{brand.website}</a>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {brand.managed === false ? (
                      <button onClick={() => handleAdoptBrand(brand)} className="text-[10px] text-blue-300 hover:text-white">Manage</button>
                    ) : (
                      <>
                        <button onClick={() => openEditor('brand', brand)} title={`Edit ${brand.name}`} className="p-2 rounded-md text-[#A1A1AA] hover:text-white hover:bg-[#27272A]"><Icon>edit</Icon></button>
                        <button onClick={() => handleDelete('brand', brand)} title={`Delete ${brand.name}`} className="p-2 rounded-md text-red-400 hover:text-red-300 hover:bg-red-950/40"><Icon>delete</Icon></button>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}

      {editor && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onMouseDown={event => { if (event.target === event.currentTarget) closeEditor(); }}>
          <form onSubmit={handleSave} className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#09090B] border border-[#3F3F46] rounded-2xl p-6 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] text-[#71717A] uppercase tracking-widest">{editor.type}</span>
                <h2 className="text-xl font-bold text-white mt-1">{editor.id ? 'Edit' : 'Add'} {editor.type}</h2>
              </div>
              <button type="button" onClick={closeEditor} aria-label="Close editor" className="p-2 text-[#A1A1AA] hover:text-white"><Icon>close</Icon></button>
            </div>
            <label className="flex flex-col gap-1.5 text-xs text-[#A1A1AA]">Name *
              <input autoFocus required value={form.name} onChange={event => setForm(prev => ({ ...prev, name: event.target.value }))} className={inputClass} placeholder={editor.type === 'category' ? 'e.g. Workstations' : 'e.g. Framework'} />
            </label>
            <label className="flex flex-col gap-1.5 text-xs text-[#A1A1AA]">Slug (optional)
              <input value={form.slug} onChange={event => setForm(prev => ({ ...prev, slug: event.target.value }))} className={inputClass} placeholder="Generated from name if blank" />
            </label>
            {editor.type === 'category' ? (
              <>
                <label className="flex flex-col gap-1.5 text-xs text-[#A1A1AA]">Product category value *
                  <input required value={form.value} onChange={event => setForm(prev => ({ ...prev, value: event.target.value }))} className={inputClass} placeholder="Must match product category values" />
                </label>
                <label className="flex flex-col gap-1.5 text-xs text-[#A1A1AA]">Icon key
                  <input value={form.icon} onChange={event => setForm(prev => ({ ...prev, icon: event.target.value }))} className={inputClass} placeholder="laptop_chromebook" />
                </label>
                <div className="flex flex-col gap-3 rounded-lg border border-[#27272A] bg-[#121215] p-3">
                  <label className="flex flex-col gap-1.5 text-xs text-[#A1A1AA]">
                    Upload category image (max 5 MB)
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={handleCategoryImageUpload}
                      className="w-full rounded-lg border border-[#27272A] bg-[#18181B] p-2 text-white file:mr-3 file:rounded file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-black disabled:opacity-50"
                    />
                    {uploadingImage && <span className="text-blue-300">Uploading image to Cloudinary…</span>}
                  </label>
                  <label className="flex flex-col gap-1.5 text-xs text-[#A1A1AA]">Or paste an image URL
                    <input
                      type="url"
                      value={form.image}
                      onChange={event => setForm(prev => ({ ...prev, image: event.target.value }))}
                      className={inputClass}
                      placeholder="https://example.com/category-image.jpg"
                    />
                  </label>
                  {form.image ? (
                    <div className="flex flex-col gap-2">
                      <img src={form.image} alt="Category preview" className="w-full h-36 object-cover rounded-lg border border-[#27272A]" onError={event => { event.currentTarget.style.display = 'none'; }} />
                      <button
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, image: '' }))}
                        className="self-start px-3 py-1.5 rounded-lg border border-red-900 text-red-300 text-xs hover:bg-red-950/40"
                      >
                        <Icon className="mr-1">delete</Icon> Remove category image
                      </button>
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#71717A]">No image selected. The category will show its icon instead of a default/fake image.</p>
                  )}
                </div>
                <label className="flex flex-col gap-1.5 text-xs text-[#A1A1AA]">Subcategories (comma-separated)
                  <textarea rows={3} value={form.subcategories} onChange={event => setForm(prev => ({ ...prev, subcategories: event.target.value }))} className={`${inputClass} resize-y`} placeholder="Gaming, Creator, Business" />
                </label>
              </>
            ) : (
              <>
                <label className="flex flex-col gap-1.5 text-xs text-[#A1A1AA]">Brand tier
                  <input value={form.tier} onChange={event => setForm(prev => ({ ...prev, tier: event.target.value }))} className={inputClass} placeholder="VERIFIED OEM" />
                </label>
                <label className="flex flex-col gap-1.5 text-xs text-[#A1A1AA]">Website (optional)
                  <input type="url" value={form.website} onChange={event => setForm(prev => ({ ...prev, website: event.target.value }))} className={inputClass} placeholder="https://brand.example" />
                </label>
              </>
            )}
            {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={closeEditor} className="px-4 py-2 rounded-lg border border-[#3F3F46] text-[#D4D4D8] text-sm hover:bg-[#18181B]">Cancel</button>
              {hasFormChanges && <button disabled={saving || uploadingImage} type="submit" className="px-4 py-2 rounded-lg bg-white text-black text-sm font-bold disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
