import confetti from 'canvas-confetti';

export function useProductHandlers({
  token, user,
  products, setProducts,
  orders, setOrders,
  setEditProductOpen, setEditingProduct,
  setEditProdName, setEditProdCategory, setEditProdType,
  setEditProdPrice, setEditProdQty, setEditProdUnit,
  setEditProdHarvestDate, setEditProdLocation, setEditProdDesc,
  editingProduct,
  editProdName, editProdCategory, editProdType, editProdPrice, editProdQty,
  editProdUnit, editProdHarvestDate, editProdLocation, editProdDesc, editProdImage,
  setEditProdFormError,
  newProdName, newProdCategory, newProdType, newProdPrice, newProdQty,
  newProdUnit, newProdHarvestDate, newProdLocation, newProdDesc, newProdImage,
  setProdFormError, setAddProductOpen,
}) {
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdQty || !newProdLocation || !newProdHarvestDate) {
      setProdFormError('Please fill all required fields.');
      return;
    }
    setProdFormError('');
    const formData = new FormData();
    formData.append('name', newProdName);
    formData.append('category', newProdCategory);
    formData.append('type', newProdType);
    formData.append('price', newProdPrice);
    formData.append('quantity', newProdQty);
    formData.append('unit', newProdUnit);
    formData.append('harvestDate', newProdHarvestDate);
    formData.append('location', newProdLocation);
    formData.append('description', newProdDesc);
    formData.append('farmerId', user.id);
    formData.append('farmerName', user.name);
    if (newProdImage) formData.append('image', newProdImage);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        // Re-fetch products to get merged data from backend (only farmer's products)
        const prodRes = await fetch(`/api/products?farmerId=${user.id}`);
        if (prodRes.ok) {
          const updatedProducts = await prodRes.json();
          setProducts(updatedProducts);
        }
        setAddProductOpen(false);
        confetti({ particleCount: 30, spread: 40 });
      } else {
        setProdFormError(data.error || 'Failed to add product.');
      }
    } catch (err) {
      console.error(err);
      setProdFormError('Network error. Please try again.');
    }
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setEditProdName(prod.name || '');
    setEditProdCategory(prod.category || 'Crops');
    setEditProdType(prod.type || '');
    setEditProdPrice(prod.price || '');
    setEditProdQty(prod.quantity || '');
    setEditProdUnit(prod.unit || 'kg');
    setEditProdHarvestDate(prod.harvestDate || '');
    setEditProdLocation(prod.location || '');
    setEditProdDesc(prod.description || '');
    setEditProductOpen(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editProdName || !editProdPrice || !editProdQty || !editProdLocation || !editProdHarvestDate) {
      setEditProdFormError('Please fill all required fields.');
      return;
    }
    setEditProdFormError('');
    const formData = new FormData();
    formData.append('name', editProdName);
    formData.append('category', editProdCategory);
    formData.append('type', editProdType);
    formData.append('price', editProdPrice);
    formData.append('quantity', editProdQty);
    formData.append('unit', editProdUnit);
    formData.append('harvestDate', editProdHarvestDate);
    formData.append('location', editProdLocation);
    formData.append('description', editProdDesc);
    if (editProdImage) formData.append('image', editProdImage);

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        // Re-fetch products to get merged data from backend (only farmer's products)
        const prodRes = await fetch(`/api/products?farmerId=${user.id}`);
        if (prodRes.ok) {
          const updatedProducts = await prodRes.json();
          setProducts(updatedProducts);
        }
        setEditProductOpen(false);
      } else {
        setEditProdFormError(data.error || 'Failed to update product.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleVisibility = async (prod) => {
    const formData = new FormData();
    formData.append('hidden', !prod.hidden);
    try {
      const res = await fetch(`/api/products/${prod.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        setProducts(products.map((p) => (p.id === prod.id ? { ...p, hidden: !prod.hidden } : p)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      if (res.ok) {
        setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return {
    handleAddProduct, handleOpenEdit, handleUpdateProduct,
    handleDeleteProduct, handleToggleVisibility,
    handleUpdateOrderStatus, handleRejectOrder,
  };
}
