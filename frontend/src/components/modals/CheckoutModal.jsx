import { useState, useEffect } from 'react';
import { X, AlertTriangle, Wallet, Landmark, Phone, Smartphone, ClipboardCheck, Info, MapPin, Building2 } from 'lucide-react';

export default function CheckoutModal({
  user,
  checkoutProduct, setCheckoutProduct,
  checkoutQuantity, setCheckoutQuantity,
  checkoutPaymentMethod, setCheckoutPaymentMethod,
  checkoutPhone, setCheckoutPhone,
  checkoutAddress, setCheckoutAddress,
  paymentConfig, paymentError, t,
  handleCheckoutSubmit,
  checkoutWalletType, setCheckoutWalletType,
  checkoutCbeAccount, setCheckoutCbeAccount,
  checkoutSecurityPin, setCheckoutSecurityPin,
  checkoutTelebirrFlow, setCheckoutTelebirrFlow,
  checkoutFtCode, setCheckoutFtCode,
  checkoutAwashPhone, setCheckoutAwashPhone,
  checkoutAwashPin, setCheckoutAwashPin,
  checkoutFarmerPayments = {},
  farmerBankAccounts = [],
  checkoutBankAccount, setCheckoutBankAccount,
  checkoutBankPin, setCheckoutBankPin,
  banks = [],
  onPlaceBid, bidAmount, setBidAmount,
  onAcceptContract, onRejectContract,
}) {
  const [localError, setLocalError] = useState('');

  const basePrice = checkoutProduct.price * checkoutQuantity;
  
  // Advanced selling mode-specific pricing calculations
  const isPreHarvest = checkoutProduct.sellingMode === 'pre-harvest';
  const isAuction = checkoutProduct.sellingMode === 'auction';
  const isContract = checkoutProduct.sellingMode === 'contract';
  const hasBulkDiscount = checkoutProduct.bulkDiscount && checkoutProduct.bulkDiscount.active;
  
  // Calculate final selling price considering all modes
  let finalPrice = basePrice;
  let discountedPrice = checkoutProduct.price;
  
  if (isAuction) {
    finalPrice = (checkoutProduct.currentBid || checkoutProduct.startingPrice) * checkoutQuantity;
  } else if (isContract) {
    finalPrice = (checkoutProduct.agreedPrice || checkoutProduct.price) * checkoutQuantity;
  } else if (hasBulkDiscount) {
    const { discountPercent, minQuantity } = checkoutProduct.bulkDiscount;
    const productPrice = checkoutProduct.price;
    const newQuantity = parseInt(checkoutQuantity) || 1;
    
    // Validate minimum quantity requirement for bulk discount
    if (newQuantity >= minQuantity) {
      discountedPrice = Math.round(productPrice * (1 - discountPercent / 100) * 100) / 100;
      finalPrice = discountedPrice * newQuantity;
    } else {
      finalPrice = productPrice * newQuantity;
    }
  } else if (isPreHarvest) {
    // For pre-harvest, buyer pays deposit now, balance later
    finalPrice = checkoutProduct.price * checkoutQuantity; // Will be split in payment
  }
  
  // Calculate pre-harvest deposit if applicable
  const depositAmount = isPreHarvest && checkoutProduct.depositPercent 
    ? (checkoutProduct.depositPercent / 100) * (checkoutProduct.price * checkoutQuantity)
    : 0;
  const balanceAmount = isPreHarvest && checkoutProduct.depositPercent 
    ? (checkoutProduct.price * checkoutQuantity) - depositAmount
    : 0;
  
  // Calculate dynamic fees on finalPrice (not basePrice for pre-harvest)
  let fee = 0;
  if (checkoutPaymentMethod === 'CBE_BIRR') {
    fee = 1.50;
  } else if (checkoutPaymentMethod === 'TELEBIRR') {
    fee = checkoutTelebirrFlow === 'app' ? 1.00 : 0.00;
  } else if (checkoutPaymentMethod === 'AWASH') {
    fee = 1.50;
  } else if (checkoutPaymentMethod.startsWith('BANK_')) {
    fee = 1.50;
  }
  const grandTotal = finalPrice + fee;

  // Extract farmer payment configs
  const cbeConfig = checkoutFarmerPayments?.cbe || { enabled: false };
  const teleConfig = checkoutFarmerPayments?.telebirr || { enabled: false };
  const awashConfig = checkoutFarmerPayments?.awash || { enabled: false };
  const hasMobilePayments = cbeConfig.enabled || teleConfig.enabled || awashConfig.enabled;

  // Extract bank account details for display
  const [selectedBankAccountId, setSelectedBankAccountId] = useState('');
  const bankAccountDetails = checkoutFarmerPayments?.bankAccountDetails || {};
  
  useEffect(() => {
    if (farmerBankAccounts && farmerBankAccounts.length > 0) {
      setSelectedBankAccountId(farmerBankAccounts[0]);
    }
  }, [farmerBankAccounts]);

  // Get bank name from bank ID
  const getBankName = (bankId) => {
    const bank = banks.find(b => b.id === bankId);
    return bank ? bank.name : 'Bank Account';
  };

  // Set default payment method if the current selection is not available for this farmer
  useEffect(() => {
    if (checkoutPaymentMethod === 'CBE_BIRR' && !cbeConfig.enabled) {
      if (teleConfig.enabled) setCheckoutPaymentMethod('TELEBIRR');
      else if (awashConfig.enabled) setCheckoutPaymentMethod('AWASH');
      else setCheckoutPaymentMethod('COD');
    } else if (checkoutPaymentMethod === 'TELEBIRR' && !teleConfig.enabled) {
      if (cbeConfig.enabled) setCheckoutPaymentMethod('CBE_BIRR');
      else if (awashConfig.enabled) setCheckoutPaymentMethod('AWASH');
      else setCheckoutPaymentMethod('COD');
    } else if (checkoutPaymentMethod === 'AWASH' && !awashConfig.enabled) {
      if (cbeConfig.enabled) setCheckoutPaymentMethod('CBE_BIRR');
      else if (teleConfig.enabled) setCheckoutPaymentMethod('TELEBIRR');
      else setCheckoutPaymentMethod('COD');
    }
  }, [checkoutFarmerPayments]);

  // Nearby agent calculation based on the buyer location/address
  const agentMap = {
    'alem maya': {
      name: 'Alem Maya Central Hub Cooperative Agent',
      address: 'Alem Maya Market Center, Block A, Agent Desk 2',
      phone: '0911001122'
    },
    'babille': {
      name: 'Babille Cooperative Union Agent',
      address: 'Babille Town Cooperatives Depot, Bypass Junction',
      phone: '0911334455'
    },
    'harar city': {
      name: 'Harar Gate Cooperative Agent',
      address: 'Harar Gate Road, near main Agricultural Union Warehouse',
      phone: '0911667788'
    },
    'harar': {
      name: 'Harar Gate Cooperative Agent',
      address: 'Harar Gate Road, near main Agricultural Union Warehouse',
      phone: '0911667788'
    }
  };
  const addressLower = (checkoutAddress || user?.location || '').trim().toLowerCase();
  let matchedAgentKey = '';
  if (addressLower.includes('alem maya') || addressLower.includes('maya')) {
    matchedAgentKey = 'alem maya';
  } else if (addressLower.includes('babille')) {
    matchedAgentKey = 'babille';
  } else if (addressLower.includes('harar')) {
    matchedAgentKey = 'harar';
  }
  const agentInfo = agentMap[matchedAgentKey] || {
    name: 'Hararghe Central Cooperative Union Agent',
    address: 'Central Hub Headquarters, Main Terminal, Harar Road',
    phone: '0911999999'
  };

  // Validation
  const validateForm = (e) => {
    e.preventDefault();
    setLocalError('');

    if (checkoutPaymentMethod === 'CBE_BIRR') {
      if (!checkoutPhone || !checkoutPhone.match(/^(09|\+2519)\d{8}$/)) {
        setLocalError('Please enter a valid CBE Birr registered phone number (e.g. 0912345678)');
        return;
      }
      if (checkoutWalletType === 'savings' && (!checkoutCbeAccount || checkoutCbeAccount.length < 13)) {
        setLocalError('Please enter a valid 13-digit CBE Savings Account Number');
        return;
      }
      if (!checkoutSecurityPin || checkoutSecurityPin.length !== 4) {
        setLocalError('Please enter your 4-digit CBE Birr security PIN');
        return;
      }
    } else if (checkoutPaymentMethod === 'TELEBIRR') {
      if (!checkoutPhone || !checkoutPhone.match(/^(09|\+2519)\d{8}$/)) {
        setLocalError('Please enter a valid Telebirr registered phone number (e.g. 0912345678)');
        return;
      }
      if (checkoutTelebirrFlow === 'app' && (!checkoutSecurityPin || checkoutSecurityPin.length !== 5)) {
        setLocalError('Please enter your 5-digit Telebirr transaction PIN');
        return;
      }
      if (checkoutTelebirrFlow === 'manual') {
        if (!checkoutFtCode || !checkoutFtCode.toUpperCase().startsWith('FT')) {
          setLocalError('Please enter a valid transaction reference code starting with FT (e.g., FT260628)');
          return;
        }
      }
    } else if (checkoutPaymentMethod === 'AWASH') {
      if (!checkoutAwashPhone || !checkoutAwashPhone.match(/^(09|\+2519)\d{8}$/)) {
        setLocalError('Please enter your valid Awash Birr phone number (e.g. 0912345678)');
        return;
      }
      if (!checkoutAwashPin || checkoutAwashPin.length !== 4) {
        setLocalError('Please enter your 4-digit Awash Birr transaction PIN');
        return;
      }
    } else if (checkoutPaymentMethod.startsWith('BANK_')) {
      if (!checkoutBankAccount || !checkoutBankAccount.match(/^\d{10,18}$/)) {
        setLocalError('Please enter a valid Bank Account Number (10 to 18 digits)');
        return;
      }
      if (!checkoutBankPin || checkoutBankPin.length !== 4) {
        setLocalError('Please enter your 4-digit bank security PIN');
        return;
      }
    }

    if (!checkoutAddress.trim()) {
      setLocalError('Shipping address or pickup point is required');
      return;
    }

    // Call app-level submit
    handleCheckoutSubmit(e);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      <div className="w-full max-w-lg overflow-y-auto max-h-[90vh] relative animate-in fade-in zoom-in-95 duration-200 glass-card rounded-[24px] shadow-2xl">
        <button onClick={() => setCheckoutProduct(null)} className="absolute right-4 top-4 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors">
          <X className="w-4 h-4" />
        </button>
        
        <div className="px-6 py-6 sm:p-8">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">Complete Your Purchase</h3>
          <p className="text-xs text-slate-400 mb-5">Confirm quantities, view farmer accounts, and complete simulated payment.</p>
          
          {(paymentError || localError) && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/20 text-red-600 text-xs font-bold flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{localError || paymentError}</span>
            </div>
          )}
          
          <form onSubmit={validateForm} className="space-y-5">
            {/* Product Summary */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{checkoutProduct.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{checkoutProduct.price} ETB/{checkoutProduct.unit}</p>
                <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold mt-1">Farmer: {checkoutProduct.farmerName}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button type="button" onClick={() => setCheckoutQuantity(Math.max(1, checkoutQuantity - 1))} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50">-</button>
                <span className="text-sm font-bold w-6 text-center text-slate-800 dark:text-slate-200">{checkoutQuantity}</span>
                <button type="button" onClick={() => setCheckoutQuantity(Math.min(checkoutProduct.quantity, checkoutQuantity + 1))} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50">+</button>
              </div>
            </div>

            {/* Provider Tabs */}
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-2">Farmer Accepted Methods</label>
              
              {!hasMobilePayments && (
                <div className="mb-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-700 dark:text-amber-400 font-bold">
                  ⚠️ This farmer has not configured mobile accounts. Only Cash on Delivery (COD) is available.
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {cbeConfig.enabled && (
                  <button
                    type="button"
                    onClick={() => { setCheckoutPaymentMethod('CBE_BIRR'); setLocalError(''); }}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${checkoutPaymentMethod === 'CBE_BIRR' ? 'border-purple-500 bg-purple-500/5 text-purple-700 dark:text-purple-300' : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'}`}
                  >
                    <Landmark className="w-4 h-4" />
                    <span className="text-[9px] font-extrabold">CBE Birr</span>
                  </button>
                )}
                
                {teleConfig.enabled && (
                  <button
                    type="button"
                    onClick={() => { setCheckoutPaymentMethod('TELEBIRR'); setLocalError(''); }}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${checkoutPaymentMethod === 'TELEBIRR' ? 'border-pink-500 bg-pink-500/5 text-pink-700 dark:text-pink-300' : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'}`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="text-[9px] font-extrabold">telebirr</span>
                  </button>
                )}

                {awashConfig.enabled && (
                  <button
                    type="button"
                    onClick={() => { setCheckoutPaymentMethod('AWASH'); setLocalError(''); }}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${checkoutPaymentMethod === 'AWASH' ? 'border-teal-500 bg-teal-500/5 text-teal-700 dark:text-teal-300' : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'}`}
                  >
                    <Landmark className="w-4 h-4" />
                    <span className="text-[9px] font-extrabold">Awash Birr</span>
                  </button>
                )}

                {farmerBankAccounts && farmerBankAccounts.length > 0 && farmerBankAccounts.map((bankAccountId) => {
                  const isSelected = checkoutPaymentMethod === `BANK_${bankAccountId}`;
                  return (
                    <button
                      key={bankAccountId}
                      type="button"
                      onClick={() => { 
                        setCheckoutPaymentMethod(`BANK_${bankAccountId}`); 
                        setSelectedBankAccountId(bankAccountId);
                        setLocalError(''); 
                      }}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${isSelected ? 'border-teal-500 bg-teal-500/5 text-teal-700 dark:text-teal-300' : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'}`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span className="text-[9px] font-extrabold truncate max-w-[60px]">{getBankName(bankAccountId)}</span>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => { setCheckoutPaymentMethod('COD'); setLocalError(''); }}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${checkoutPaymentMethod === 'COD' ? 'border-amber-500 bg-amber-500/5 text-amber-700 dark:text-amber-300' : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'}`}
                >
                  <Wallet className="w-4 h-4" />
                  <span className="text-[9px] font-extrabold">COD (Cash)</span>
                </button>
              </div>
            </div>

            {/* Bank Account Details - Shown when bank account is selected */}
            {checkoutPaymentMethod.startsWith('BANK_') && selectedBankAccountId && bankAccountDetails?.[selectedBankAccountId] && (
              <div className="space-y-3.5 p-4 rounded-2xl bg-teal-500/5 border border-teal-500/10">
                <div className="flex justify-between items-center border-b border-teal-500/10 pb-2.5">
                  <span className="text-[10px] font-extrabold uppercase text-teal-700 dark:text-teal-400">Bank Account Details</span>
                  <span className="text-[9px] font-extrabold uppercase text-teal-600 px-2 py-0.5 rounded bg-teal-500/10">{getBankName(selectedBankAccountId)}</span>
                </div>
                
                {/* Read-only Farmer Target Account */}
                <div className="p-2.5 rounded-lg bg-teal-500/10 text-[10px] text-teal-950 dark:text-teal-300 space-y-1">
                  <p className="font-bold">Target Account Details (Read-only):</p>
                  <p>• Account Number: <span className="font-mono font-bold">{bankAccountDetails[selectedBankAccountId].accountNumber}</span></p>
                  {bankAccountDetails[selectedBankAccountId].phone && (
                    <p>• Phone: <span className="font-mono font-bold">{bankAccountDetails[selectedBankAccountId].phone}</span></p>
                  )}
                  {bankAccountDetails[selectedBankAccountId].email && (
                    <p>• Email: <span className="font-mono font-bold">{bankAccountDetails[selectedBankAccountId].email}</span></p>
                  )}
                  <p className="text-[9px] text-teal-600 dark:text-teal-400 font-semibold italic">*Buyer cannot edit farmer destination accounts.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-extrabold uppercase text-teal-700 dark:text-teal-400 mb-1">Your Bank Account Number</label>
                    <input
                      type="text"
                      required
                      value={checkoutBankAccount}
                      onChange={(e) => setCheckoutBankAccount(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 1000123456789"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-extrabold uppercase text-teal-700 dark:text-teal-400 mb-1">Your Bank Security PIN</label>
                    <input
                      type="password"
                      maxLength="4"
                      required
                      value={checkoutBankPin}
                      onChange={(e) => setCheckoutBankPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-center tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CBE Birr Settings */}
            {checkoutPaymentMethod === 'CBE_BIRR' && cbeConfig.enabled && (
              <div className="space-y-3.5 p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10">
                <div className="flex justify-between items-center border-b border-purple-500/10 pb-2.5">
                  <span className="text-[10px] font-extrabold uppercase text-purple-700 dark:text-purple-400">CBE Account Details</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      disabled
                      onClick={() => setCheckoutWalletType('wallet')}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold ${checkoutWalletType === 'wallet' ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                    >
                      CBE Wallet
                    </button>
                    {cbeConfig.accountNumber && (
                      <button
                        type="button"
                        onClick={() => setCheckoutWalletType('savings')}
                        className={`px-2 py-0.5 rounded text-[9px] font-bold ${checkoutWalletType === 'savings' ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                      >
                        Savings Account
                      </button>
                    )}
                  </div>
                </div>

                {/* Read-only Farmer Target Accounts */}
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-[10px] text-purple-950 dark:text-purple-300 space-y-1">
                  <p className="font-bold">Target Account Details (Read-only):</p>
                  {cbeConfig.accountNumber && checkoutWalletType === 'savings' && (
                    <p>• CBE Savings Account: <span className="font-mono font-bold">{cbeConfig.accountNumber}</span></p>
                  )}
                  {cbeConfig.walletPhone && checkoutWalletType === 'wallet' && (
                    <p>• CBE Wallet Phone: <span className="font-mono font-bold">{cbeConfig.walletPhone}</span></p>
                  )}
                  <p className="text-[9px] text-purple-600 dark:text-purple-400 font-semibold italic">*Buyer cannot edit farmer destination accounts.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-extrabold uppercase text-purple-700 dark:text-purple-400 mb-1">Your (Buyer) CBE phone</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={checkoutPhone}
                        onChange={(e) => setCheckoutPhone(e.target.value)}
                        placeholder="e.g. 0912345678"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 dark:text-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-extrabold uppercase text-purple-700 dark:text-purple-400 mb-1">Your CBE Birr PIN</label>
                    <input
                      type="password"
                      maxLength="4"
                      required
                      value={checkoutSecurityPin}
                      onChange={(e) => setCheckoutSecurityPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-center tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                {checkoutWalletType === 'savings' && (
                  <div>
                    <label className="block text-[9px] font-extrabold uppercase text-purple-700 dark:text-purple-400 mb-1">Confirm Savings Target Account</label>
                    <input
                      type="text"
                      readOnly
                      value={cbeConfig.accountNumber}
                      className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-500 cursor-not-allowed"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Telebirr Settings */}
            {checkoutPaymentMethod === 'TELEBIRR' && teleConfig.enabled && (
              <div className="space-y-3.5 p-4 rounded-2xl bg-pink-500/5 border border-pink-500/10">
                <div className="flex justify-between items-center border-b border-pink-500/10 pb-2.5">
                  <span className="text-[10px] font-extrabold uppercase text-pink-700 dark:text-pink-400">telebirr Payment Flow</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => { setCheckoutTelebirrFlow('app'); setLocalError(''); }}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold ${checkoutTelebirrFlow === 'app' ? 'bg-pink-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                    >
                      In-App / PIN
                    </button>
                    {teleConfig.merchantCode && (
                      <button
                        type="button"
                        onClick={() => { setCheckoutTelebirrFlow('manual'); setLocalError(''); }}
                        className={`px-2 py-0.5 rounded text-[9px] font-bold ${checkoutTelebirrFlow === 'manual' ? 'bg-pink-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                      >
                        USSD Merchant
                      </button>
                    )}
                  </div>
                </div>

                {checkoutTelebirrFlow === 'app' ? (
                  <div className="space-y-3">
                    <div className="p-2.5 rounded-lg bg-pink-500/10 text-[10px] text-pink-950 dark:text-pink-300 space-y-0.5">
                      <p className="font-bold">Target Farmer Telebirr Phone (Read-only):</p>
                      <p className="font-mono font-bold">{teleConfig.walletPhone || checkoutProduct.farmerPhone || 'N/A'}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-extrabold uppercase text-pink-700 dark:text-pink-400 mb-1">Your Telebirr Mobile Number</label>
                        <div className="relative">
                          <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={checkoutPhone}
                            onChange={(e) => setCheckoutPhone(e.target.value)}
                            placeholder="e.g. 0912345678"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800 dark:text-slate-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-extrabold uppercase text-pink-700 dark:text-pink-400 mb-1">Your Telebirr PIN</label>
                        <input
                          type="password"
                          maxLength="5"
                          required
                          value={checkoutSecurityPin}
                          onChange={(e) => setCheckoutSecurityPin(e.target.value.replace(/\D/g, ''))}
                          placeholder="•••••"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-center tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800 dark:text-slate-200"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-pink-500/10 rounded-xl border border-pink-500/15 text-[10px] text-pink-900 dark:text-pink-300 font-semibold space-y-1">
                      <p className="flex items-center gap-1 font-bold text-xs text-pink-700 dark:text-pink-400">
                        <Info className="w-3.5 h-3.5" /> Instructions:
                      </p>
                      <ol className="list-decimal pl-4 space-y-0.5">
                        <li>Dial <span className="font-bold text-teal-600 dark:text-teal-400">*127#</span> on your mobile device.</li>
                        <li>Select Pay Merchant and use Merchant ID: <span className="font-mono font-bold text-teal-600 dark:text-teal-400">{teleConfig.merchantCode}</span> ({checkoutProduct.farmerName}).</li>
                        <li>Transfer precisely <span className="font-bold text-teal-600 dark:text-teal-400">{basePrice} ETB</span>.</li>
                        <li>Copy the transaction code (FT...) from the Ethio Telecom SMS receipt and paste it below.</li>
                      </ol>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-extrabold uppercase text-pink-700 dark:text-pink-400 mb-1">Your Telebirr Phone Number</label>
                        <div className="relative">
                          <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={checkoutPhone}
                            onChange={(e) => setCheckoutPhone(e.target.value)}
                            placeholder="e.g. 0912345678"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800 dark:text-slate-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-extrabold uppercase text-pink-700 dark:text-pink-400 mb-1">Receipt FT Reference Code</label>
                        <div className="relative">
                          <ClipboardCheck className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={checkoutFtCode}
                            onChange={(e) => setCheckoutFtCode(e.target.value.toUpperCase())}
                            placeholder="e.g. FT260628.223.A"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800 dark:text-slate-200"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Awash Birr Settings */}
            {checkoutPaymentMethod === 'AWASH' && awashConfig.enabled && (
              <div className="space-y-3.5 p-4 rounded-2xl bg-teal-500/5 border border-teal-500/10">
                <div className="flex justify-between items-center border-b border-teal-500/10 pb-2.5">
                  <span className="text-[10px] font-extrabold uppercase text-teal-700 dark:text-teal-400">Awash Birr Account Details</span>
                  <span className="text-[9px] font-extrabold uppercase text-teal-600 px-2 py-0.5 rounded bg-teal-500/10">Awash Bank</span>
                </div>

                {/* Read-only Farmer Target Account */}
                <div className="p-2.5 rounded-lg bg-teal-500/10 text-[10px] text-teal-950 dark:text-teal-300 space-y-1">
                  <p className="font-bold">Target Farmer Awash details (Read-only):</p>
                  {awashConfig.accountNumber && (
                    <p>• Awash Account: <span className="font-mono font-bold">{awashConfig.accountNumber}</span></p>
                  )}
                  {awashConfig.walletPhone && (
                    <p>• Awash Wallet Phone: <span className="font-mono font-bold">{awashConfig.walletPhone}</span></p>
                  )}
                  <p className="text-[9px] text-teal-600 dark:text-teal-400 font-semibold italic">*Buyer cannot edit farmer destination accounts.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-extrabold uppercase text-teal-700 dark:text-teal-400 mb-1">Your Awash Wallet Phone</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={checkoutAwashPhone}
                        onChange={(e) => setCheckoutAwashPhone(e.target.value)}
                        placeholder="e.g. 0912345678"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-extrabold uppercase text-teal-700 dark:text-teal-400 mb-1">Your Awash Security PIN</label>
                    <input
                      type="password"
                      maxLength="4"
                      required
                      value={checkoutAwashPin}
                      onChange={(e) => setCheckoutAwashPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-center tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* COD Settings */}
            {checkoutPaymentMethod === 'COD' && (
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-3">
                <p className="text-[10px] font-extrabold uppercase text-amber-700 dark:text-amber-400 mb-0.5 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 shrink-0" /> Cash Payment Hub Agent Location
                </p>
                
                {/* Dynamically calculated agent based on location */}
                <div className="p-3 bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/15 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-extrabold text-slate-800 dark:text-slate-200">{agentInfo.name}</p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">{agentInfo.address}</p>
                      <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold mt-1">📞 Hub Agent Contact: {agentInfo.phone}</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  No advance mobile transfer is required. You will complete your payment in cash directly to the cooperative transport provider when your products arrive at your shipping address/pickup hub, or pay at the nearest agent hub identified above.
                </p>
              </div>
            )}

            {/* Shipping Address */}
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Shipping Address / Pickup Hub</label>
              <input
                type="text"
                required
                value={checkoutAddress}
                onChange={(e) => setCheckoutAddress(e.target.value)}
                placeholder="e.g. Alem Maya Cooperatives Hub"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Pricing Details & Grand Total */}
            <div className="border-t border-slate-100 dark:border-slate-850 pt-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <span>Items Subtotal:</span>
                <span>{basePrice.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <span>Transaction Gateway Fee:</span>
                <span>{fee > 0 ? `${fee.toFixed(2)} ETB` : 'Free'}</span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-200 dark:border-slate-800">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">{t('totalPrice')}</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white">{grandTotal.toLocaleString()} ETB</p>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-500/20 transition-all flex items-center gap-1.5"
                >
                  {isAuction ? 'Buy at Current Bid' : 'Confirm Order'}
                </button>
              </div>
            </div>
            
            {/* Selling mode-specific pricing information */}
            {(isPreHarvest || hasBulkDiscount || isAuction || isContract) && (
              <div className="space-y-3.5 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50">
                <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-800/50 pb-2.5">
                  <span className="text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400">Pricing Details</span>
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">Advanced Mode</span>
                </div>
                
                  {/* Direct pricing calculation - display actual final price in main pricing section */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-600 dark:text-slate-300">Pricing Summary:</span>
                      <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">
                        {(isPreHarvest ? (checkoutProduct.price * checkoutQuantity).toLocaleString() :
                          isAuction ? (checkoutProduct.currentBid || checkoutProduct.startingPrice) * checkoutQuantity :
                          isContract ? (checkoutProduct.agreedPrice * checkoutQuantity).toLocaleString() :
                          hasBulkDiscount && parseInt(checkoutQuantity) >= checkoutProduct.bulkDiscount.minQuantity ? 
                            Math.round(checkoutProduct.price * (1 - checkoutProduct.bulkDiscount.discountPercent / 100) * checkoutQuantity) : 
                            (checkoutProduct.price * checkoutQuantity).toLocaleString()
                        )} ETB
                      </span>
                    </div>
                    
                    {isPreHarvest && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-green-600 dark:text-green-400">Deposit ({checkoutProduct.depositPercent}% now):</span>
                          <span className="text-[10px] font-bold text-green-600 dark:text-green-400">{(depositAmount || 0).toLocaleString()} ETB</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-amber-600 dark:text-amber-400">Balance due on delivery:</span>
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">{(balanceAmount || 0).toLocaleString()} ETB</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/15 text-[9px] text-green-700 dark:text-green-300">
                          <span className="font-semibold">💰 Deposit Payment Required:</span> You will pay {checkoutProduct.depositPercent}% now, remaining balance on delivery.
                        </div>
                        <div className="p-2.5 rounded-lg bg-green-500/5 border border-green-500/10 text-[9px] text-green-600 dark:text-green-400">
                          <span className="font-semibold">📦 Reservation:</span> By confirming, you reserve {checkoutQuantity} {checkoutProduct.unit} for harvest on {checkoutProduct.harvestDate}. The farmer will be notified.
                        </div>
                      </div>
                    )}
                    
                    {hasBulkDiscount && parseInt(checkoutQuantity) >= checkoutProduct.bulkDiscount.minQuantity && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-rose-600 dark:text-rose-400">Discount Applied ({checkoutProduct.bulkDiscount.discountPercent}% off):</span>
                          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
                            Save: {( (checkoutProduct.price * checkoutQuantity) - (Math.round(checkoutProduct.price * (1 - checkoutProduct.bulkDiscount.discountPercent / 100) * checkoutQuantity)) ).toLocaleString()} ETB
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/15 text-[9px] text-rose-700 dark:text-rose-300">
                          <span className="font-semibold">🎉 Bulk Discount Applied!</span> You meet the minimum quantity requirement.
                        </div>
                      </div>
                    )}
                    
                    {hasBulkDiscount && parseInt(checkoutQuantity) < checkoutProduct.bulkDiscount.minQuantity && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-red-600 dark:text-red-400">Minimum Quantity Not Met:</span>
                          <span className="text-[10px] font-bold text-red-600 dark:text-red-400">
                            Need {checkoutProduct.bulkDiscount.minQuantity - checkoutQuantity} more {checkoutProduct.unit}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/15 text-[9px] text-red-700 dark:text-red-300">
                          <span className="font-semibold">⚠️ Bulk Discount Not Applied:</span> You must purchase at least {checkoutProduct.bulkDiscount.minQuantity} {checkoutProduct.unit} to get the {checkoutProduct.bulkDiscount.discountPercent}% discount.
                        </div>
                      </div>
                    )}
                    
                    {isAuction && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-purple-600 dark:text-purple-400">Current Highest Bid:</span>
                          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                            {(checkoutProduct.currentBid || checkoutProduct.startingPrice).toLocaleString()} ETB
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-purple-600 dark:text-purple-400">Minimum Bid Increment:</span>
                          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                            {checkoutProduct.minBid || 50} ETB
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/15">
                          <label className="block text-[10px] font-extrabold uppercase text-purple-700 dark:text-purple-400 mb-1.5">Your Bid Amount (ETB)</label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              min={(checkoutProduct.currentBid || checkoutProduct.startingPrice) + (checkoutProduct.minBid || 50)}
                              step={checkoutProduct.minBid || 50}
                              value={bidAmount}
                              onChange={(e) => setBidAmount(e.target.value)}
                              placeholder={`Min: ${(checkoutProduct.currentBid || checkoutProduct.startingPrice) + (checkoutProduct.minBid || 50)} ETB`}
                              className="flex-1 bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 dark:text-slate-200"
                            />
                            <button
                              type="button"
                              onClick={onPlaceBid}
                              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all"
                            >
                              Place Bid
                            </button>
                          </div>
                          <p className="text-[9px] text-purple-600 dark:text-purple-400 mt-1">
                            Your bid must be at least {(checkoutProduct.currentBid || checkoutProduct.startingPrice) + (checkoutProduct.minBid || 50)} ETB
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {isContract && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-blue-600 dark:text-blue-400">Contract Terms:</span>
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Qty: {checkoutProduct.contractQuantity} | Price: {checkoutProduct.agreedPrice} ETB/unit</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-blue-600 dark:text-blue-400">Delivery Schedule:</span>
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Due: {checkoutProduct.deliveryDate}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/15 text-[9px] text-blue-700 dark:text-blue-300">
                          <span className="font-semibold">📋 Contract Agreement:</span> Review terms and accept to finalize this contract farming arrangement.
                        </div>
                        {checkoutProduct.contractStatus !== 'accepted' && checkoutProduct.contractStatus !== 'completed' && (
                          <div className="flex gap-2 mt-1">
                            <button type="button" onClick={() => onAcceptContract && onAcceptContract(checkoutProduct)}
                              className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-xl transition-all">
                              Accept Contract
                            </button>
                            <button type="button" onClick={() => onRejectContract && onRejectContract(checkoutProduct)}
                              className="flex-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-[10px] font-bold rounded-xl transition-all border border-red-200">
                              Decline
                            </button>
                          </div>
                        )}
                        {checkoutProduct.contractStatus === 'accepted' && (
                          <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/15 text-[9px] text-green-700 dark:text-green-300 font-semibold">
                            ✅ Contract Accepted — Proceed with order to finalize.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
