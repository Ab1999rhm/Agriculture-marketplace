export default function OTPModal({
  setOtpModalOpen,
  otpCode, setOtpCode,
  checkoutPhone,
  paymentError, setPaymentError,
  processingPayment,
  submitOrder,
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
      <div className="w-full max-w-sm overflow-hidden relative p-6 text-center animate-in fade-in zoom-in-95 duration-200"
        style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.2)' }}>
        <h3 className="text-lg font-black mb-2">CBE Birr Security Verification</h3>
        <p className="text-xs text-slate-400 mb-6">A secure OTP transfer authorization was dispatched to <b>{checkoutPhone}</b>. Enter <b>123456</b> to authorize the simulated payment transaction.</p>
        {paymentError && <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/20 text-red-600 text-xs font-bold">{paymentError}</div>}
        <div className="space-y-4">
          <input
            type="text" maxLength="6" value={otpCode} onChange={(e) => setOtpCode(e.target.value)}
            placeholder="Enter 6-digit OTP"
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-center tracking-[1em] text-lg font-extrabold focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <div className="flex space-x-2">
            <button onClick={() => setOtpModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs">Cancel</button>
            <button
              onClick={async () => {
                if (otpCode !== '123456') { setPaymentError('Invalid authentication code. Please try again.'); return; }
                await submitOrder();
              }}
              disabled={processingPayment}
              className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex justify-center items-center"
            >
              {processingPayment ? 'Processing...' : 'Authorize Pay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
