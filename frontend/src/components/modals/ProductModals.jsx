import { X, Pencil } from 'lucide-react';

export function AddProductModal({
  setAddProductOpen,
  prodFormError,
  newProdName, setNewProdName,
  newProdCategory, setNewProdCategory,
  newProdType, setNewProdType,
  newProdPrice, setNewProdPrice,
  newProdQty, setNewProdQty,
  newProdUnit, setNewProdUnit,
  newProdHarvestDate, setNewProdHarvestDate,
  newProdLocation, setNewProdLocation,
  newProdDesc, setNewProdDesc,
  setNewProdImage,
  handleAddProduct,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      <div className="w-full max-w-md overflow-y-auto max-h-[90vh] relative bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl shadow-slate-900/20">
        <button onClick={() => setAddProductOpen(false)} className="absolute right-4.5 top-4.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors">
          <X className="w-4 h-4" />
        </button>
        <div className="px-6 py-8">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">List New Agricultural Product</h3>
          <p className="text-xs text-slate-400 mb-6">List crops or livestock for marketplace bidding.</p>
          {prodFormError && <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/20 text-red-600 text-xs font-bold">{prodFormError}</div>}
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Product Title</label><input type="text" required value={newProdName} onChange={(e) => setNewProdName(e.target.value)} placeholder="e.g. Harar Coffee Beans" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Category</label><select value={newProdCategory} onChange={(e) => setNewProdCategory(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none cursor-pointer"><option value="Crops">Crops</option><option value="Livestock">Livestock</option></select></div>
              <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Crop/Breed Type</label><input type="text" required value={newProdType} onChange={(e) => setNewProdType(e.target.value)} placeholder="e.g. Coffee, Bull" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none" /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2"><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Unit Price (ETB)</label><input type="number" required value={newProdPrice} onChange={(e) => setNewProdPrice(e.target.value)} placeholder="e.g. 350" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none" /></div>
              <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Unit</label><input type="text" required value={newProdUnit} onChange={(e) => setNewProdUnit(e.target.value)} placeholder="e.g. kg" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Quantity Stock</label><input type="number" required value={newProdQty} onChange={(e) => setNewProdQty(e.target.value)} placeholder="e.g. 500" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none" /></div>
              <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Harvest Date</label><input type="date" required value={newProdHarvestDate} onChange={(e) => setNewProdHarvestDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none cursor-pointer" /></div>
            </div>
            <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Location / Hub Point</label><input type="text" required value={newProdLocation} onChange={(e) => setNewProdLocation(e.target.value)} placeholder="e.g. Alem Maya, Babille" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
            <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Product Image</label><input type="file" accept="image/*" onChange={(e) => setNewProdImage(e.target.files[0])} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-650 dark:text-slate-450" /></div>
            <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Short Description</label><textarea value={newProdDesc} onChange={(e) => setNewProdDesc(e.target.value)} rows="3" placeholder="Product details..." className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"></textarea></div>
            <div className="flex justify-end pt-4 space-x-2">
              <button type="button" onClick={() => setAddProductOpen(false)} className="px-4.5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-450 font-bold text-xs rounded-xl">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-500/20 transition-all">Post Listing</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function EditProductModal({
  setEditProductOpen,
  editingProduct, editProdFormError,
  editProdName, setEditProdName,
  editProdCategory, setEditProdCategory,
  editProdType, setEditProdType,
  editProdPrice, setEditProdPrice,
  editProdQty, setEditProdQty,
  editProdUnit, setEditProdUnit,
  editProdHarvestDate, setEditProdHarvestDate,
  editProdLocation, setEditProdLocation,
  editProdDesc, setEditProdDesc,
  editProdImage, setEditProdImage,
  handleUpdateProduct,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      <div className="w-full max-w-md overflow-y-auto max-h-[90vh] relative bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl shadow-slate-900/20">
        <button onClick={() => setEditProductOpen(false)} className="absolute right-4 top-4 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-500 transition-colors z-10">
          <X className="w-4 h-4" />
        </button>
        <div className="px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Pencil className="w-5 h-5 text-blue-600" /></div>
            <div><h3 className="text-xl font-black text-slate-900 dark:text-white">Edit Product</h3><p className="text-xs text-slate-400">Update your listing details</p></div>
          </div>
          {editProdFormError && <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/20 text-red-600 text-xs font-bold">{editProdFormError}</div>}
          <form onSubmit={handleUpdateProduct} className="space-y-4">
            <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Product Title</label><input type="text" required value={editProdName} onChange={(e) => setEditProdName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Category</label><select value={editProdCategory} onChange={(e) => setEditProdCategory(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none cursor-pointer"><option value="Crops">Crops</option><option value="Livestock">Livestock</option></select></div>
              <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Crop/Breed Type</label><input type="text" required value={editProdType} onChange={(e) => setEditProdType(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none" /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2"><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Unit Price (ETB)</label><input type="number" required value={editProdPrice} onChange={(e) => setEditProdPrice(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none" /></div>
              <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Unit</label><input type="text" required value={editProdUnit} onChange={(e) => setEditProdUnit(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Quantity Stock</label><input type="number" required value={editProdQty} onChange={(e) => setEditProdQty(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none" /></div>
              <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Harvest Date</label><input type="date" required value={editProdHarvestDate} onChange={(e) => setEditProdHarvestDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none cursor-pointer" /></div>
            </div>
            <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Location / Hub Point</label><input type="text" required value={editProdLocation} onChange={(e) => setEditProdLocation(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Replace Image (optional)</label>
              <input type="file" accept="image/*" onChange={(e) => setEditProdImage(e.target.files[0])} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs focus:outline-none" />
              {editingProduct?.imageUrl && !editProdImage && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={editingProduct.imageUrl} alt="current" className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                  <p className="text-[10px] text-slate-400">Current image — upload a new one to replace</p>
                </div>
              )}
            </div>
            <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Short Description</label><textarea value={editProdDesc} onChange={(e) => setEditProdDesc(e.target.value)} rows="3" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div className="flex justify-end pt-2 space-x-2">
              <button type="button" onClick={() => setEditProductOpen(false)} className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs rounded-xl">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
