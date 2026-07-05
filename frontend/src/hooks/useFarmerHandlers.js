import confetti from 'canvas-confetti';

export function useFarmerHandlers({
  token, user,
  products, setProducts,
  cropPlans, setCropPlans,
  inventoryItems, setInventoryItems,
  equipmentList, setEquipmentList,
  storageFacilities, setStorageFacilities,
  batchLots, setBatchLots,
  qualityGrades, setQualityGrades,
  certifications, setCertifications,
  labTests, setLabTests,
  loanApplications, setLoanApplications,
  productionCosts, setProductionCosts,
  insurancePolicies, setInsurancePolicies,
  subsidyApplications, setSubsidyApplications,
  auctionBids, setAuctionBids,
  contractFarming, setContractFarming,
  bulkDiscounts, setBulkDiscounts,
  advanceBookings, setAdvanceBookings,
}) {
  const authHeaders = (extra = {}) => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...extra,
  });

  // ── Crop Plans ──────────────────────────────────────────────
  const handleAddCropPlan = async (planData) => {
    try {
      const res = await fetch('/api/crop-plans', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ ...planData, farmerId: user.id }),
      });
      if (res.ok) {
        const newPlan = await res.json();
        setCropPlans((prev) => [...prev, newPlan]);
        confetti({ particleCount: 30, spread: 40 });
      }
    } catch (err) { console.error(err); }
  };

  const handleUpdateCropPlan = async (id, planData) => {
    try {
      const res = await fetch(`/api/crop-plans/${id}`, {
        method: 'PUT', headers: authHeaders(), body: JSON.stringify(planData),
      });
      if (res.ok) setCropPlans(cropPlans.map((p) => (p.id === id ? { ...p, ...planData } : p)));
    } catch (err) { console.error(err); }
  };

  const handleDeleteCropPlan = async (id) => {
    try {
      const res = await fetch(`/api/crop-plans/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setCropPlans(cropPlans.filter((p) => p.id !== id));
    } catch (err) { console.error(err); }
  };

  // ── Inventory ────────────────────────────────────────────────
  const handleAddInventory = async (inventoryData) => {
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST', headers: authHeaders(), body: JSON.stringify({ ...inventoryData, farmerId: user.id }),
      });
      if (res.ok) {
        const newItem = await res.json();
        setInventoryItems((prev) => [...prev, newItem]);
        confetti({ particleCount: 30, spread: 40 });
      }
    } catch (err) { console.error(err); }
  };

  const handleUpdateInventory = async (id, inventoryData) => {
    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: 'PUT', headers: authHeaders(), body: JSON.stringify(inventoryData),
      });
      if (res.ok) setInventoryItems(inventoryItems.map((i) => (i.id === id ? { ...i, ...inventoryData } : i)));
    } catch (err) { console.error(err); }
  };

  const handleDeleteInventory = async (id) => {
    try {
      const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setInventoryItems(inventoryItems.filter((i) => i.id !== id));
    } catch (err) { console.error(err); }
  };

  // ── Equipment ────────────────────────────────────────────────
  const handleAddEquipment = async (equipmentData) => {
    try {
      const res = await fetch('/api/equipment', {
        method: 'POST', headers: authHeaders(), body: JSON.stringify({ ...equipmentData, farmerId: user.id }),
      });
      if (res.ok) {
        const newEquipment = await res.json();
        setEquipmentList((prev) => [...prev, newEquipment]);
        confetti({ particleCount: 30, spread: 40 });
      }
    } catch (err) { console.error(err); }
  };

  const handleUpdateEquipment = async (id, equipmentData) => {
    try {
      const res = await fetch(`/api/equipment/${id}`, {
        method: 'PUT', headers: authHeaders(), body: JSON.stringify(equipmentData),
      });
      if (res.ok) setEquipmentList(equipmentList.map((e) => (e.id === id ? { ...e, ...equipmentData } : e)));
    } catch (err) { console.error(err); }
  };

  const handleDeleteEquipment = async (id) => {
    try {
      const res = await fetch(`/api/equipment/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setEquipmentList(equipmentList.filter((e) => e.id !== id));
    } catch (err) { console.error(err); }
  };

  // ── Storage Facilities ───────────────────────────────────────
  const handleAddStorageFacility = async (data) => {
    try {
      const res = await fetch('/api/storage', {
        method: 'POST', headers: authHeaders(), body: JSON.stringify({ ...data, farmerId: user.id }),
      });
      const item = res.ok ? await res.json() : { ...data, id: Date.now().toString(), farmerId: user.id };
      setStorageFacilities((prev) => [...prev, item]);
      confetti({ particleCount: 30, spread: 40 });
    } catch (err) { console.error(err); }
  };

  const handleUpdateStorageFacility = async (id, data) => {
    try {
      const res = await fetch(`/api/storage/${id}`, {
        method: 'PUT', headers: authHeaders(), body: JSON.stringify(data),
      });
      if (res.ok) setStorageFacilities(storageFacilities.map((s) => (s.id === id ? { ...s, ...data } : s)));
    } catch (err) { console.error(err); }
  };

  const handleDeleteStorageFacility = async (id) => {
    try { await fetch(`/api/storage/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); } catch (e) {}
    setStorageFacilities((prev) => prev.filter((i) => i.id !== id));
  };

  // ── Batch Lots ───────────────────────────────────────────────
  const handleAddBatchLot = async (data) => {
    try {
      const res = await fetch('/api/batch-lots', {
        method: 'POST', headers: authHeaders(), body: JSON.stringify({ ...data, farmerId: user.id }),
      });
      const item = res.ok ? await res.json() : { ...data, id: Date.now().toString(), farmerId: user.id };
      setBatchLots((prev) => [...prev, item]);
      confetti({ particleCount: 30, spread: 40 });
    } catch (err) { console.error(err); }
  };

  const handleUpdateBatchLot = async (id, data) => {
    try {
      const res = await fetch(`/api/batch-lots/${id}`, {
        method: 'PUT', headers: authHeaders(), body: JSON.stringify(data),
      });
      if (res.ok) setBatchLots(batchLots.map((b) => (b.id === id ? { ...b, ...data } : b)));
    } catch (err) { console.error(err); }
  };

  const handleDeleteBatchLot = async (id) => {
    try { await fetch(`/api/batch-lots/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); } catch (e) {}
    setBatchLots((prev) => prev.filter((i) => i.id !== id));
  };

  // ── Quality Grades ───────────────────────────────────────────
  const handleAddQualityGrade = async (gradeData) => {
    try {
      const res = await fetch('/api/quality-grades', {
        method: 'POST', headers: authHeaders(), body: JSON.stringify({ ...gradeData, farmerId: user.id }),
      });
      if (res.ok) {
        const newGrade = await res.json();
        setQualityGrades((prev) => [...prev, newGrade]);
        confetti({ particleCount: 30, spread: 40 });
      }
    } catch (err) { console.error(err); }
  };

  const handleUpdateQualityGrade = async (id, gradeData) => {
    try {
      const res = await fetch(`/api/quality-grades/${id}`, {
        method: 'PUT', headers: authHeaders(), body: JSON.stringify(gradeData),
      });
      if (res.ok) setQualityGrades(qualityGrades.map((g) => (g.id === id ? { ...g, ...gradeData } : g)));
    } catch (err) { console.error(err); }
  };

  const handleDeleteQualityGrade = async (id) => {
    try {
      const res = await fetch(`/api/quality-grades/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setQualityGrades(qualityGrades.filter((g) => g.id !== id));
    } catch (err) { console.error(err); }
  };

  // ── Certifications ───────────────────────────────────────────
  const handleAddCertification = async (certData) => {
    try {
      const res = await fetch('/api/certifications', {
        method: 'POST', headers: authHeaders(), body: JSON.stringify({ ...certData, farmerId: user.id }),
      });
      if (res.ok) {
        const newCert = await res.json();
        setCertifications((prev) => [...prev, newCert]);
        confetti({ particleCount: 30, spread: 40 });
      }
    } catch (err) { console.error(err); }
  };

  const handleUpdateCertification = async (id, certData) => {
    try {
      const res = await fetch(`/api/certifications/${id}`, {
        method: 'PUT', headers: authHeaders(), body: JSON.stringify(certData),
      });
      if (res.ok) setCertifications(certifications.map((c) => (c.id === id ? { ...c, ...certData } : c)));
    } catch (err) { console.error(err); }
  };

  const handleDeleteCertification = async (id) => {
    try {
      const res = await fetch(`/api/certifications/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setCertifications(certifications.filter((c) => c.id !== id));
    } catch (err) { console.error(err); }
  };

  // ── Lab Tests ────────────────────────────────────────────────
  const handleAddLabTest = async (data) => {
    try {
      const res = await fetch('/api/lab-tests', {
        method: 'POST', headers: authHeaders(), body: JSON.stringify({ ...data, farmerId: user.id }),
      });
      const item = res.ok ? await res.json() : { ...data, id: Date.now().toString(), farmerId: user.id };
      setLabTests((prev) => [...prev, item]);
      confetti({ particleCount: 30, spread: 40 });
    } catch (err) { console.error(err); }
  };

  const handleUpdateLabTest = async (id, data) => {
    try {
      const res = await fetch(`/api/lab-tests/${id}`, {
        method: 'PUT', headers: authHeaders(), body: JSON.stringify(data),
      });
      if (res.ok) setLabTests(labTests.map((t) => (t.id === id ? { ...t, ...data } : t)));
    } catch (err) { console.error(err); }
  };

  const handleDeleteLabTest = async (id) => {
    try { await fetch(`/api/lab-tests/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); } catch (e) {}
    setLabTests((prev) => prev.filter((i) => i.id !== id));
  };

  // ── Loans ────────────────────────────────────────────────────
  const handleAddLoanApplication = async (loanData) => {
    try {
      const res = await fetch('/api/loans', {
        method: 'POST', headers: authHeaders(), body: JSON.stringify({ ...loanData, farmerId: user.id }),
      });
      if (res.ok) {
        const newLoan = await res.json();
        setLoanApplications((prev) => [...prev, newLoan]);
        confetti({ particleCount: 30, spread: 40 });
      }
    } catch (err) { console.error(err); }
  };

  const handleUpdateLoanApplication = async (id, loanData) => {
    try {
      const res = await fetch(`/api/loans/${id}`, {
        method: 'PUT', headers: authHeaders(), body: JSON.stringify(loanData),
      });
      if (res.ok) setLoanApplications(loanApplications.map((l) => (l.id === id ? { ...l, ...loanData } : l)));
    } catch (err) { console.error(err); }
  };

  const handleDeleteLoanApplication = async (id) => {
    try {
      const res = await fetch(`/api/loans/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setLoanApplications(loanApplications.filter((l) => l.id !== id));
    } catch (err) { console.error(err); }
  };

  // ── Production Costs ─────────────────────────────────────────
  const handleAddProductionCost = async (data) => {
    try {
      const res = await fetch('/api/production-costs', {
        method: 'POST', headers: authHeaders(), body: JSON.stringify({ ...data, farmerId: user.id }),
      });
      const item = res.ok ? await res.json() : { ...data, id: Date.now().toString(), farmerId: user.id };
      setProductionCosts((prev) => [...prev, item]);
    } catch (err) { console.error(err); }
  };

  const handleUpdateProductionCost = async (id, data) => {
    try {
      const res = await fetch(`/api/production-costs/${id}`, {
        method: 'PUT', headers: authHeaders(), body: JSON.stringify(data),
      });
      if (res.ok) setProductionCosts(productionCosts.map((c) => (c.id === id ? { ...c, ...data } : c)));
    } catch (err) { console.error(err); }
  };

  const handleDeleteProductionCost = async (id) => {
    try { await fetch(`/api/production-costs/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); } catch (e) {}
    setProductionCosts((prev) => prev.filter((i) => i.id !== id));
  };

  // ── Insurance ────────────────────────────────────────────────
  const handleAddInsurance = async (data) => {
    try {
      const res = await fetch('/api/insurance', {
        method: 'POST', headers: authHeaders(), body: JSON.stringify({ ...data, farmerId: user.id }),
      });
      const item = res.ok ? await res.json() : { ...data, id: Date.now().toString(), farmerId: user.id };
      setInsurancePolicies((prev) => [...prev, item]);
      confetti({ particleCount: 30, spread: 40 });
    } catch (err) { console.error(err); }
  };

  const handleUpdateInsurance = async (id, data) => {
    try {
      const res = await fetch(`/api/insurance/${id}`, {
        method: 'PUT', headers: authHeaders(), body: JSON.stringify(data),
      });
      if (res.ok) setInsurancePolicies(insurancePolicies.map((i) => (i.id === id ? { ...i, ...data } : i)));
    } catch (err) { console.error(err); }
  };

  const handleDeleteInsurance = async (id) => {
    try { await fetch(`/api/insurance/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); } catch (e) {}
    setInsurancePolicies((prev) => prev.filter((i) => i.id !== id));
  };

  // ── Subsidies ────────────────────────────────────────────────
  const handleAddSubsidy = async (data) => {
    try {
      const res = await fetch('/api/subsidies', {
        method: 'POST', headers: authHeaders(), body: JSON.stringify({ ...data, farmerId: user.id }),
      });
      const item = res.ok ? await res.json() : { ...data, id: Date.now().toString(), farmerId: user.id };
      setSubsidyApplications((prev) => [...prev, item]);
      confetti({ particleCount: 30, spread: 40 });
    } catch (err) { console.error(err); }
  };

  const handleUpdateSubsidy = async (id, data) => {
    try {
      const res = await fetch(`/api/subsidies/${id}`, {
        method: 'PUT', headers: authHeaders(), body: JSON.stringify(data),
      });
      if (res.ok) setSubsidyApplications(subsidyApplications.map((s) => (s.id === id ? { ...s, ...data } : s)));
    } catch (err) { console.error(err); }
  };

  const handleDeleteSubsidy = async (id) => {
    try { await fetch(`/api/subsidies/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); } catch (e) {}
    setSubsidyApplications((prev) => prev.filter((i) => i.id !== id));
  };

  // ── Auctions ─────────────────────────────────────────────────
  const handleAddAuction = async (data) => {
    try {
      const product = products.find(p => p.id === data.productId);
      const productName = product ? product.name : data.product;
      
      const res = await fetch('/api/auctions', {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ 
          ...data, 
          farmerId: user.id, 
          status: 'active', 
          bids: [],
          product: productName,
          auctionStatus: 'live'
        }),
      });
      if (res.ok) {
        const newAuction = await res.json();
        setAuctionBids((prev) => [...prev, newAuction]);
        confetti({ particleCount: 50, spread: 60 });
      }
    } catch (err) { console.error(err); }
  };

  const handleUpdateAuction = async (id, data) => {
    try {
      const product = products.find(p => p.id === data.productId);
      const productName = product ? product.name : data.product;
      
      const res = await fetch(`/api/auctions/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          ...data,
          product: productName,
          auctionStatus: data.auctionStatus || 'live'
        }),
      });
      if (res.ok) {
        setAuctionBids((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteAuction = async (id) => {
    try { 
      await fetch(`/api/auctions/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); 
    } catch (e) {}
    setAuctionBids((prev) => prev.filter((a) => a.id !== id));
  };

  // ── Contracts ────────────────────────────────────────────────
  const handleAddContract = async (data) => {
    try {
      const product = products.find(p => p.id === data.productId);
      const productName = product ? product.name : data.product;
      
      const res = await fetch('/api/contracts', {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ 
          ...data, 
          farmerId: user.id, 
          status: 'pending', 
          product: productName 
        }),
      });
      if (res.ok) {
        const newContract = await res.json();
        setContractFarming((prev) => [...prev, newContract]);
        confetti({ particleCount: 50, spread: 60 });
      }
    } catch (err) { console.error(err); }
  };

  const handleUpdateContract = async (id, data) => {
    try {
      const res = await fetch(`/api/contracts/${id}`, {
        method: 'PUT', headers: authHeaders(), body: JSON.stringify(data),
      });
      if (res.ok) {
        setContractFarming((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteContract = async (id) => {
    try {
      await fetch(`/api/contracts/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {}
    setContractFarming((prev) => prev.filter((c) => c.id !== id));
  };

  // ── Bulk Discounts ───────────────────────────────────────────
  const handleAddBulkDiscount = async (data) => {
    try {
      const product = products.find(p => p.id === data.productId);
      const productName = product ? product.name : data.product;
      const originalPrice = product ? product.price : data.originalPrice;
      
      console.log('handleAddBulkDiscount - Input data:', data);
      console.log('handleAddBulkDiscount - Found product:', product);
      console.log('handleAddBulkDiscount - Sending to backend:', {
        ...data,
        farmerId: user.id,
        active: data.active !== undefined ? data.active : true,
        product: productName,
        originalPrice
      });
      
      const res = await fetch('/api/bulk-discounts', {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ 
          ...data, 
          farmerId: user.id, 
          active: data.active !== undefined ? data.active : true,
          product: productName,
          originalPrice
        }),
      });
      
      console.log('handleAddBulkDiscount - Response status:', res.status);
      
      if (res.ok) {
        const newDiscount = await res.json();
        console.log('handleAddBulkDiscount - New discount from server:', newDiscount);
        setBulkDiscounts((prev) => [...prev, newDiscount]);
        
        // Re-fetch products to get updated discount info merged in
        const prodRes = await fetch(`/api/products?farmerId=${user.id}`);
        if (prodRes.ok) {
          const updatedProducts = await prodRes.json();
          console.log('handleAddBulkDiscount - Updated products:', updatedProducts);
          setProducts(updatedProducts);
        }
        
        confetti({ particleCount: 30, spread: 40 });
      } else {
        const errorData = await res.json();
        console.error('handleAddBulkDiscount - Server error:', errorData);
      }
    } catch (err) { 
      console.error('handleAddBulkDiscount - Network error:', err); 
    }
  };

   const handleUpdateBulkDiscount = async (id, data) => {
     try {
       const product = products.find(p => p.id === data.productId);
       const productName = product ? product.name : data.product;
       const originalPrice = product ? product.price : data.originalPrice;
       
       const res = await fetch(`/api/bulk-discounts/${id}`, {
         method: 'PUT',
         headers: authHeaders(),
         body: JSON.stringify({
           ...data,
           product: productName,
           originalPrice
         }),
       });
       if (res.ok) {
         const updatedDiscount = await res.json();
         setBulkDiscounts((prev) => prev.map((d) => (d.id === id ? updatedDiscount : d)));
         
         // Re-fetch products to get updated discount info merged in
         const prodRes = await fetch(`/api/products?farmerId=${user.id}`);
         if (prodRes.ok) {
           const updatedProducts = await prodRes.json();
           setProducts(updatedProducts);
         }
       }
     } catch (err) { console.error(err); }
   };

  const handleDeleteBulkDiscount = async (id) => {
    try {
      await fetch(`/api/bulk-discounts/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {}
    setBulkDiscounts((prev) => prev.filter((d) => d.id !== id));
  };

  // ── Pre-Harvest Sales ────────────────────────────────────────
  const handleAddPreHarvest = async (data) => {
    try {
      const res = await fetch('/api/pre-harvest', {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ ...data, farmerId: user.id, status: 'open' }),
      });
      if (res.ok) {
        const newPreHarvest = await res.json();
        setAdvanceBookings((prev) => [...prev, newPreHarvest]);
        confetti({ particleCount: 50, spread: 60 });
      }
    } catch (err) { console.error(err); }
  };

  const handleUpdatePreHarvest = async (id, data) => {
    try {
      const res = await fetch(`/api/pre-harvest/${id}`, {
        method: 'PUT', headers: authHeaders(), body: JSON.stringify(data),
      });
      if (res.ok) {
        setAdvanceBookings((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
      }
    } catch (err) { console.error(err); }
  };

  const handleDeletePreHarvest = async (id) => {
    try {
      await fetch(`/api/pre-harvest/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {}
    setAdvanceBookings((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    handleAddCropPlan, handleUpdateCropPlan, handleDeleteCropPlan,
    handleAddInventory, handleUpdateInventory, handleDeleteInventory,
    handleAddEquipment, handleUpdateEquipment, handleDeleteEquipment,
    handleAddStorageFacility, handleUpdateStorageFacility, handleDeleteStorageFacility,
    handleAddBatchLot, handleUpdateBatchLot, handleDeleteBatchLot,
    handleAddQualityGrade, handleUpdateQualityGrade, handleDeleteQualityGrade,
    handleAddCertification, handleUpdateCertification, handleDeleteCertification,
    handleAddLabTest, handleUpdateLabTest, handleDeleteLabTest,
    handleAddLoanApplication, handleUpdateLoanApplication, handleDeleteLoanApplication,
    handleAddProductionCost, handleUpdateProductionCost, handleDeleteProductionCost,
    handleAddInsurance, handleUpdateInsurance, handleDeleteInsurance,
    handleAddSubsidy, handleUpdateSubsidy, handleDeleteSubsidy,
    handleAddAuction, handleUpdateAuction, handleDeleteAuction,
    handleAddContract, handleUpdateContract, handleDeleteContract,
    handleAddBulkDiscount, handleUpdateBulkDiscount, handleDeleteBulkDiscount,
    handleAddPreHarvest, handleUpdatePreHarvest, handleDeletePreHarvest,
  };
}
