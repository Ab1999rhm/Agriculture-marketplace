import { Landmark, Smartphone, Info } from 'lucide-react';

export default function OTPModal({
  setOtpModalOpen,
  otpCode, setOtpCode,
  checkoutPhone,
  paymentError, setPaymentError,
  processingPayment,
  submitOrder,
  checkoutPaymentMethod = 'CBE_BIRR',
  checkoutWalletType = 'wallet',
  checkoutCbeAccount = '',
  checkoutTelebirrFlow = 'app',
  checkoutProduct = {},
  checkoutQuantity = 1,
  checkoutAwashPhone = '',
  checkoutAwashPin = '',
  checkoutFarmerPayments = {},
  checkoutBankAccount = '',
  checkoutBankPin = '',
  banks = [],
}) {
  const isCbe = checkoutPaymentMethod === 'CBE_BIRR';
  const isTele = checkoutPaymentMethod === 'TELEBIRR';
  const isAwash = checkoutPaymentMethod === 'AWASH';
  const isBank = checkoutPaymentMethod.startsWith('BANK_');
  const bankId = isBank ? checkoutPaymentMethod.replace('BANK_', '') : '';
  const bankName = isBank && banks ? (banks.find(b => b.id === bankId)?.name || 'Bank') : 'Bank';

  const basePrice = (checkoutProduct?.price || 0) * checkoutQuantity;
  
  // Calculate dynamic fees
  let fee = 0;
  if (isCbe) {
    fee = 1.50;
  } else if (isTele) {
    fee = checkoutTelebirrFlow === 'app' ? 1.00 : 0.00;
  } else if (isAwash) {
    fee = 1.50;
  } else if (isBank) {
    fee = 1.50;
  }
  const grandTotal = basePrice + fee;

  // Extract configs
  const cbeConfig = checkoutFarmerPayments?.cbe || {};
  const teleConfig = checkoutFarmerPayments?.telebirr || {};
  const awashConfig = checkoutFarmerPayments?.awash || {};

  // Styling properties
  let primaryBg = 'bg-purple-600 hover:bg-purple-700';
  let ringColor = 'focus:ring-purple-500';
  let headerTitle = 'CBE Birr Security Verification';
  let brandingColor = 'text-purple-600';
  
  if (isTele) {
    primaryBg = 'bg-pink-600 hover:bg-pink-700';
    ringColor = 'focus:ring-pink-500';
    headerTitle = 'telebirr Transaction Authorization';
    brandingColor = 'text-pink-600';
  } else if (isAwash) {
    primaryBg = 'bg-teal-600 hover:bg-teal-700';
    ringColor = 'focus:ring-teal-500';
    headerTitle = 'Awash E-Birr Authorization';
    brandingColor = 'text-teal-600';
  } else if (isBank) {
    primaryBg = 'bg-teal-600 hover:bg-teal-700';
    ringColor = 'focus:ring-teal-500';
    headerTitle = `${bankName} Transaction Authorization`;
    brandingColor = 'text-teal-600';
  }

  // Display details depending on method
  const buyerPhone = isAwash ? checkoutAwashPhone : (isBank ? checkoutBankAccount : checkoutPhone);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
      <div className="w-full max-w-sm overflow-hidden relative p-6 text-center animate-in fade-in zoom-in-95 duration-200 glass-card rounded-[24px] shadow-2xl">
        
        {/* Theme Icon */}
        <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          {isCbe && <Landmark className="w-6 h-6 text-purple-600" />}
          {isTele && <Smartphone className="w-6 h-6 text-pink-600" />}
          {(isAwash || isBank) && <Landmark className="w-6 h-6 text-teal-600" />}
        </div>

        <h3 className="text-lg font-black mb-1 text-slate-900 dark:text-white">{headerTitle}</h3>
        
        {/* Transaction Summary Card */}
        <div className="my-4 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl text-left space-y-1.5">
          <div className="flex justify-between text-[10px] font-bold text-slate-500">
            <span>Product:</span>
            <span className="text-slate-800 dark:text-slate-200 truncate max-w-[150px]">{checkoutProduct?.name} (x{checkoutQuantity})</span>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-slate-500">
            <span>Farmer Target:</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[150px]">
              {isCbe && checkoutWalletType === 'savings' && `CBE Savings: ${cbeConfig.accountNumber || 'N/A'}`}
              {isCbe && checkoutWalletType === 'wallet' && `CBE Wallet: ${cbeConfig.walletPhone || 'N/A'}`}
              {isTele && `telebirr: ${teleConfig.walletPhone || 'N/A'}`}
              {isAwash && `Awash Acct: ${awashConfig.accountNumber || 'N/A'}`}
              {isBank && `${bankName}: ${checkoutFarmerPayments?.bankAccountDetails?.[bankId]?.accountNumber || 'N/A'}`}
            </span>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-slate-500">
            <span>{isBank ? 'Debited Account:' : 'Debited Phone:'}</span>
            <span className="text-slate-800 dark:text-slate-200 font-mono">{buyerPhone}</span>
          </div>
          <div className="flex justify-between text-xs font-black border-t border-dashed border-slate-200 dark:border-slate-850 pt-1.5 text-slate-900 dark:text-white">
            <span>Total Debited:</span>
            <span>{grandTotal.toLocaleString()} ETB</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          A secure OTP authorization SMS was dispatched to your registered phone or account <b>{buyerPhone}</b>. Enter <b>123456</b> to authorize the simulated payment transaction.
        </p>

        {paymentError && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/20 text-red-600 text-xs font-bold">
            {paymentError}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            maxLength="6"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter 6-digit OTP"
            className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-center tracking-[1em] text-lg font-extrabold focus:outline-none focus:ring-2 ${ringColor} text-slate-900 dark:text-white`}
          />
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setOtpModalOpen(false);
                setOtpCode('');
                setPaymentError('');
              }}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                if (otpCode !== '123456') {
                  setPaymentError('Invalid authentication code. Please try again.');
                  return;
                }
                await submitOrder();
              }}
              disabled={processingPayment}
              className={`flex-1 py-2.5 rounded-xl text-white font-bold text-xs flex justify-center items-center ${primaryBg}`}
            >
              {processingPayment ? 'Processing...' : 'Authorize Pay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
