import confetti from 'canvas-confetti';

export function useBuyerHandlers({
  token, user,
  wishlist, setWishlist,
  supplierReviews, setSupplierReviews,
  allReviews, setAllReviews,
}) {
  const handleAddToWishlist = async (product) => {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          buyerId: user.id,
          productId: product.id,
          productName: product.name,
          price: product.price,
          farmerId: product.farmerId,
          farmerName: product.farmerName,
        }),
      });
      if (res.ok) {
        const newItem = await res.json();
        setWishlist((prev) => [...prev, newItem]);
        confetti({ particleCount: 20, spread: 30 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFromWishlist = async (id) => {
    try {
      const res = await fetch(`/api/wishlist/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setWishlist(wishlist.filter((w) => w.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddReview = async (reviewData) => {
    try {
      const res = await fetch('/api/supplier-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          ...reviewData, 
          buyerId: user.id,
          buyerName: user.name,
          supplierId: reviewData.farmerId,
          supplierName: reviewData.farmerName
        }),
      });
      if (res.ok) {
        const newReview = await res.json();
        setSupplierReviews((prev) => [...prev, newReview]);
        if (setAllReviews) {
          setAllReviews((prev) => [...prev, newReview]);
        }
        confetti({ particleCount: 20, spread: 30 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateReview = async (id, reviewData) => {
    try {
      const res = await fetch(`/api/supplier-reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(reviewData),
      });
      if (res.ok) {
        setSupplierReviews(supplierReviews.map((r) => (r.id === id ? { ...r, ...reviewData } : r)));
        if (setAllReviews) {
          setAllReviews(allReviews.map((r) => (r.id === id ? { ...r, ...reviewData } : r)));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      const res = await fetch(`/api/supplier-reviews/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSupplierReviews(supplierReviews.filter((r) => r.id !== id));
        if (setAllReviews) {
          setAllReviews(allReviews.filter((r) => r.id !== id));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return {
    handleAddToWishlist, handleRemoveFromWishlist,
    handleAddReview, handleUpdateReview, handleDeleteReview,
  };
}
