import confetti from 'canvas-confetti';

export function useBuyerHandlers({
  token, user,
  wishlist, setWishlist,
  supplierReviews, setSupplierReviews,
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
        body: JSON.stringify({ ...reviewData, buyerId: user.id }),
      });
      if (res.ok) {
        const newReview = await res.json();
        setSupplierReviews((prev) => [...prev, newReview]);
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
      if (res.ok) setSupplierReviews(supplierReviews.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return {
    handleAddToWishlist, handleRemoveFromWishlist,
    handleAddReview, handleUpdateReview, handleDeleteReview,
  };
}
