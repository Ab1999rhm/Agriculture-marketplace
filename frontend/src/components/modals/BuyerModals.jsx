import { X } from 'lucide-react';
import confetti from 'canvas-confetti';

export function BudgetModal({
  setBudgetModalOpen,
  budgetAmount, setBudgetAmount,
  buyerBudgets, setBuyerBudgets,
  user,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      <div className="w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
        style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)' }}>
        <button onClick={() => setBudgetModalOpen(false)} className="absolute right-4.5 top-4.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"><X className="w-4 h-4" /></button>
        <div className="px-6 py-8">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-6">Set Monthly Budget</h3>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const newBudget = { id: 'budget_' + Date.now(), buyerId: user.id, amount: parseInt(budgetAmount), month: new Date().toISOString().slice(0, 7), createdAt: new Date().toISOString() };
            setBuyerBudgets([...buyerBudgets, newBudget]);
            setBudgetModalOpen(false);
            setBudgetAmount('');
            confetti({ particleCount: 30, spread: 40 });
          }} className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Budget Amount (ETB)</label>
              <input type="number" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)} required placeholder="e.g. 50000" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div className="flex justify-end pt-4 space-x-2">
              <button type="button" onClick={() => setBudgetModalOpen(false)} className="px-4.5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-450 font-bold text-xs rounded-xl">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-500/20 transition-all">Set Budget</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function ReviewModal({
  setReviewModalOpen,
  reviewFarmerName,
  reviewOrderId, reviewFarmerId,
  reviewRating, setReviewRating,
  reviewComment, setReviewComment,
  handleAddReview,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      <div className="w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
        style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)' }}>
        <button onClick={() => setReviewModalOpen(false)} className="absolute right-4.5 top-4.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"><X className="w-4 h-4" /></button>
        <div className="px-6 py-8">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-6">Review Supplier</h3>
          <form onSubmit={async (e) => {
            e.preventDefault();
            await handleAddReview({ orderId: reviewOrderId, farmerId: reviewFarmerId, farmerName: reviewFarmerName, rating: reviewRating, comment: reviewComment });
            setReviewModalOpen(false);
            setReviewRating(5);
            setReviewComment('');
          }} className="space-y-4">
            <div><label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Farmer: {reviewFarmerName}</label></div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-2">Rating</label>
              <div className="flex space-x-2">
                {[1,2,3,4,5].map((star) => (
                  <button key={star} type="button" onClick={() => setReviewRating(star)} className={`text-2xl ${star <= reviewRating ? 'text-amber-500' : 'text-slate-300'}`}>★</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Your Review</label>
              <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows="4" required placeholder="Share your experience with this supplier..." className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"></textarea>
            </div>
            <div className="flex justify-end pt-4 space-x-2">
              <button type="button" onClick={() => setReviewModalOpen(false)} className="px-4.5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-450 font-bold text-xs rounded-xl">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-500/20 transition-all">Submit Review</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
