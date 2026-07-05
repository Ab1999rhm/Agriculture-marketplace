import ModalShell from "../shared/ModalShell";

/* ── helpers ─────────────────────────────────────────── */
const inp =
  "w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500";
const lbl = "block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1";
const cancelBtn =
  "px-4.5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all";
const submitBtn =
  "px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-500/20 transition-all";

/* ── Each modal accepts an `editing` prop.
   When editing != null → pre-populate with defaultValue and call handleUpdate.
   Use key={editing?.id||'new'} on the <form> to force re-mount when item changes. ── */

export default function FarmerDashboardModals({
  /* open flags */
  cropPlanModalOpen,
  inventoryModalOpen,
  equipmentModalOpen,
  qualityGradeModalOpen,
  certificationModalOpen,
  loanModalOpen,
  auditModalOpen,
  storageFacilityModalOpen,
  batchLotModalOpen,
  labTestModalOpen,
  insuranceModalOpen,
  subsidyModalOpen,
  productionCostModalOpen,
  auctionModalOpen,
  contractModalOpen,
  bulkDiscountModalOpen,
  preHarvestModalOpen,
  addProductOpen,
  /* close setters */
  setCropPlanModalOpen,
  setInventoryModalOpen,
  setEquipmentModalOpen,
  setQualityGradeModalOpen,
  setCertificationModalOpen,
  setLoanModalOpen,
  setAuditModalOpen,
  setStorageFacilityModalOpen,
  setBatchLotModalOpen,
  setLabTestModalOpen,
  setInsuranceModalOpen,
  setSubsidyModalOpen,
  setProductionCostModalOpen,
  setAuctionModalOpen,
  setContractModalOpen,
  setBulkDiscountModalOpen,
  setPreHarvestModalOpen,
  setAddProductOpen,
  /* editing items (null = add mode) */
  editingCropPlan,
  editingInventory,
  editingEquipment,
  editingQualityGrade,
  editingCertification,
  editingLoan,
  editingStorageFacility,
  editingBatchLot,
  editingLabTest,
  editingInsurance,
  editingSubsidy,
  editingProductionCost,
  editingAuction,
  editingContract,
  editingBulkDiscount,
  editingPreHarvest,
  editingProduct,
  /* editing item clear setters */
  setEditingCropPlan,
  setEditingInventory,
  setEditingEquipment,
  setEditingQualityGrade,
  setEditingCertification,
  setEditingLoan,
  setEditingStorageFacility,
  setEditingBatchLot,
  setEditingLabTest,
  setEditingInsurance,
  setEditingSubsidy,
  setEditingProductionCost,
  setEditingAuction,
  setEditingContract,
  setEditingBulkDiscount,
  setEditingPreHarvest,
  setEditingProduct,
  /* add handlers */
  handleAddCropPlan,
  handleAddInventory,
  handleAddEquipment,
  handleAddQualityGrade,
  handleAddCertification,
  handleAddLoanApplication,
  handleAddQualityAudit,
  handleAddStorageFacility,
  handleAddBatchLot,
  handleAddLabTest,
  handleAddInsurance,
  handleAddSubsidy,
  handleAddProductionCost,
  handleAddAuction,
  handleAddContract,
  handleAddBulkDiscount,
  handleAddPreHarvest,
  handleAddProduct,
  /* update handlers */
  handleUpdateCropPlan,
  handleUpdateInventory,
  handleUpdateEquipment,
  handleUpdateQualityGrade,
  handleUpdateCertification,
  handleUpdateLoanApplication,
  handleUpdateStorageFacility,
  handleUpdateBatchLot,
  handleUpdateLabTest,
  handleUpdateInsurance,
  handleUpdateSubsidy,
  handleUpdateProductionCost,
  handleUpdateAuction,
  handleUpdateContract,
  handleUpdateBulkDiscount,
  handleUpdatePreHarvest,
  handleUpdateProduct,
  products,
}) {
  /* Helper to close a modal and clear its editing item */
  const close = (setOpen, setEditing) => () => {
    setOpen(false);
    if (setEditing) setEditing(null);
  };

  /* Generic submit: calls add or update depending on editing state */
  const submit = async (
    data,
    editing,
    handleAdd,
    handleUpdate,
    setOpen,
    setEditing,
  ) => {
    try {
      if (editing?.id) {
        await handleUpdate(editing.id, data);
      } else {
        await handleAdd(data);
      }
      setOpen(false);
      if (setEditing) setEditing(null);
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save. Please try again.');
    }
  };

  return (
    <>
      {/* ── Crop Plan ─────────────────────────────────────── */}
      {cropPlanModalOpen && (
        <ModalShell
          title={editingCropPlan ? "Edit Crop Plan" : "Add Crop Plan"}
          subtitle="Track field size, variety, yield, and irrigation"
          onClose={close(setCropPlanModalOpen, setEditingCropPlan)}
        >
          <form
            key={editingCropPlan?.id || "new"}
            onSubmit={async (e) => {
              e.preventDefault();
              const f = e.currentTarget;
              await submit(
                {
                  cropType: f.cropType.value,
                  plantingDate: f.plantingDate.value,
                  harvestDate: f.harvestDate.value,
                  fieldSize: f.fieldSize.value,
                  area: f.fieldSize.value,
                  fieldUnit: f.fieldUnit.value,
                  seedVariety: f.seedVariety.value,
                  expectedYield: f.expectedYield.value,
                  yieldUnit: f.yieldUnit.value,
                  irrigation: f.irrigation.value,
                  notes: f.notes.value,
                },
                editingCropPlan,
                handleAddCropPlan,
                handleUpdateCropPlan,
                setCropPlanModalOpen,
                setEditingCropPlan,
              );
            }}
            className="space-y-4"
          >
            <div>
              <label className={lbl}>Crop Type</label>
              <input
                name="cropType"
                required
                value={editingCropPlan?.cropType || ""}
                onChange={(e) => setEditingCropPlan({...editingCropPlan, cropType: e.target.value})}
                className={inp}
                placeholder="e.g. Coffee"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Planting Date</label>
                <input
                  name="plantingDate"
                  type="date"
                  required
                  value={editingCropPlan?.plantingDate || ""}
                  onChange={(e) => setEditingCropPlan({...editingCropPlan, plantingDate: e.target.value})}
                  className={inp}
                />
              </div>
              <div>
                <label className={lbl}>Harvest Date</label>
                <input
                  name="harvestDate"
                  type="date"
                  required
                  value={editingCropPlan?.harvestDate || ""}
                  onChange={(e) => setEditingCropPlan({...editingCropPlan, harvestDate: e.target.value})}
                  className={inp}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className={lbl}>Field Size</label>
                <input
                  name="fieldSize"
                  type="number"
                  required
                  min="0"
                  step="0.1"
                  value={
                    editingCropPlan?.fieldSize || editingCropPlan?.area || ""
                  }
                  onChange={(e) => setEditingCropPlan({...editingCropPlan, fieldSize: e.target.value})}
                  className={inp}
                  placeholder="e.g. 5"
                />
              </div>
              <div>
                <label className={lbl}>Unit</label>
                <select
                  name="fieldUnit"
                  value={editingCropPlan?.fieldUnit || "ha"}
                  onChange={(e) => setEditingCropPlan({...editingCropPlan, fieldUnit: e.target.value})}
                  className={inp}
                >
                  <option value="ha">ha</option>
                  <option value="acre">acre</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Seed Variety</label>
                <input
                  name="seedVariety"
                  required
                  value={editingCropPlan?.seedVariety || ""}
                  onChange={(e) => setEditingCropPlan({...editingCropPlan, seedVariety: e.target.value})}
                  className={inp}
                  placeholder="e.g. 74110"
                />
              </div>
              <div>
                <label className={lbl}>Irrigation</label>
                <select
                  name="irrigation"
                  value={editingCropPlan?.irrigation || "Rain-fed"}
                  onChange={(e) => setEditingCropPlan({...editingCropPlan, irrigation: e.target.value})}
                  className={inp}
                >
                  <option>Rain-fed</option>
                  <option>Drip</option>
                  <option>Sprinkler</option>
                  <option>Flood</option>
                  <option>Mixed</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className={lbl}>Expected Yield</label>
                <input
                  name="expectedYield"
                  type="number"
                  min="0"
                  step="0.1"
                  required
                  defaultValue={editingCropPlan?.expectedYield || ""}
                  className={inp}
                  placeholder="e.g. 2000"
                />
              </div>
              <div>
                <label className={lbl}>Unit</label>
                <select
                  name="yieldUnit"
                  defaultValue={editingCropPlan?.yieldUnit || "kg"}
                  className={inp}
                >
                  <option value="kg">kg</option>
                  <option value="quintal">quintal</option>
                  <option value="ton">ton</option>
                </select>
              </div>
            </div>
            <div>
              <label className={lbl}>Notes</label>
              <textarea
                name="notes"
                rows="3"
                value={editingCropPlan?.notes || ""}
                onChange={(e) => setEditingCropPlan({...editingCropPlan, notes: e.target.value})}
                className={inp}
              ></textarea>
            </div>
            <div className="flex justify-end pt-4 space-x-2">
              <button
                type="button"
                onClick={close(setCropPlanModalOpen, setEditingCropPlan)}
                className={cancelBtn}
              >
                Cancel
              </button>
              <button type="submit" className={submitBtn}>
                {editingCropPlan ? "Save Changes" : "Add Plan"}
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {/* ── Inventory ─────────────────────────────────────── */}
      {inventoryModalOpen && (
        <ModalShell
          title={
            editingInventory ? "Edit Inventory Item" : "Add Inventory Item"
          }
          subtitle="Track stock levels, categories, and expiry dates"
          onClose={close(setInventoryModalOpen, setEditingInventory)}
        >
          <form
            key={editingInventory?.id || "new"}
            onSubmit={async (e) => {
              e.preventDefault();
              const f = e.currentTarget;
              await submit(
                {
                  itemName: f.itemName.value,
                  category: f.category.value,
                  quantity: f.quantity.value,
                  unit: f.unit.value,
                  location: f.location.value,
                  expiryDate: f.expiryDate.value,
                },
                editingInventory,
                handleAddInventory,
                handleUpdateInventory,
                setInventoryModalOpen,
                setEditingInventory,
              );
            }}
            className="space-y-4"
          >
            <div>
              <label className={lbl}>Item Name</label>
              <input
                name="itemName"
                required
                defaultValue={editingInventory?.itemName || ""}
                className={inp}
                placeholder="e.g. Coffee Beans"
              />
            </div>
            <div>
              <label className={lbl}>Category</label>
              <input
                name="category"
                defaultValue={editingInventory?.category || ""}
                className={inp}
                placeholder="e.g. Produce, Seed, Fertilizer"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Quantity</label>
                <input
                  name="quantity"
                  type="number"
                  min="0"
                  step="0.1"
                  required
                  defaultValue={editingInventory?.quantity || ""}
                  className={inp}
                />
              </div>
              <div>
                <label className={lbl}>Unit</label>
                <input
                  name="unit"
                  required
                  defaultValue={editingInventory?.unit || ""}
                  className={inp}
                  placeholder="e.g. kg"
                />
              </div>
            </div>
            <div>
              <label className={lbl}>Location</label>
              <input
                name="location"
                required
                defaultValue={editingInventory?.location || ""}
                className={inp}
                placeholder="e.g. Warehouse A"
              />
            </div>
            <div>
              <label className={lbl}>Expiry Date</label>
              <input
                name="expiryDate"
                type="date"
                defaultValue={editingInventory?.expiryDate || ""}
                className={inp}
              />
            </div>
            <div className="flex justify-end pt-4 space-x-2">
              <button
                type="button"
                onClick={close(setInventoryModalOpen, setEditingInventory)}
                className={cancelBtn}
              >
                Cancel
              </button>
              <button type="submit" className={submitBtn}>
                {editingInventory ? "Save Changes" : "Add Item"}
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {/* ── Equipment ─────────────────────────────────────── */}
      {equipmentModalOpen && (
        <ModalShell
          title={editingEquipment ? "Edit Equipment" : "Add Equipment"}
          subtitle="Include maintenance scheduling and equipment status"
          onClose={close(setEquipmentModalOpen, setEditingEquipment)}
        >
          <form
            key={editingEquipment?.id || "new"}
            onSubmit={async (e) => {
              e.preventDefault();
              const f = e.currentTarget;
              await submit(
                {
                  equipmentName: f.equipmentName.value,
                  type: f.type.value,
                  status: f.status.value,
                  purchaseDate: f.purchaseDate.value,
                  lastMaintenance: f.lastMaintenance.value,
                  nextMaintenance: f.nextMaintenance.value,
                  notes: f.notes.value,
                },
                editingEquipment,
                handleAddEquipment,
                handleUpdateEquipment,
                setEquipmentModalOpen,
                setEditingEquipment,
              );
            }}
            className="space-y-4"
          >
            <div>
              <label className={lbl}>Equipment Name</label>
              <input
                name="equipmentName"
                required
                defaultValue={editingEquipment?.equipmentName || ""}
                className={inp}
                placeholder="e.g. Tractor"
              />
            </div>
            <div>
              <label className={lbl}>Type</label>
              <input
                name="type"
                required
                defaultValue={editingEquipment?.type || ""}
                className={inp}
                placeholder="e.g. Heavy Machinery"
              />
            </div>
            <div>
              <label className={lbl}>Status</label>
              <select
                name="status"
                required
                defaultValue={editingEquipment?.status || "operational"}
                className={inp}
              >
                <option value="operational">Operational</option>
                <option value="maintenance">Maintenance</option>
                <option value="retired">Retired</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Purchase Date</label>
                <input
                  name="purchaseDate"
                  type="date"
                  required
                  defaultValue={editingEquipment?.purchaseDate || ""}
                  className={inp}
                />
              </div>
              <div>
                <label className={lbl}>Last Maintenance</label>
                <input
                  name="lastMaintenance"
                  type="date"
                  defaultValue={editingEquipment?.lastMaintenance || ""}
                  className={inp}
                />
              </div>
            </div>
            <div>
              <label className={lbl}>Next Maintenance</label>
              <input
                name="nextMaintenance"
                type="date"
                defaultValue={editingEquipment?.nextMaintenance || ""}
                className={inp}
              />
            </div>
            <div>
              <label className={lbl}>Notes</label>
              <textarea
                name="notes"
                rows="3"
                defaultValue={editingEquipment?.notes || ""}
                className={inp}
              ></textarea>
            </div>
            <div className="flex justify-end pt-4 space-x-2">
              <button
                type="button"
                onClick={close(setEquipmentModalOpen, setEditingEquipment)}
                className={cancelBtn}
              >
                Cancel
              </button>
              <button type="submit" className={submitBtn}>
                {editingEquipment ? "Save Changes" : "Add Equipment"}
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {/* ── Storage Facility ──────────────────────────────── */}
      {storageFacilityModalOpen && (
        <ModalShell
          title={
            editingStorageFacility
              ? "Edit Storage Facility"
              : "Add Storage Facility"
          }
          subtitle="Track capacity and storage utilization"
          onClose={close(
            setStorageFacilityModalOpen,
            setEditingStorageFacility,
          )}
        >
          <form
            key={editingStorageFacility?.id || "new"}
            onSubmit={async (e) => {
              e.preventDefault();
              const f = e.currentTarget;
              await submit(
                {
                  name: f.name.value,
                  type: f.type.value,
                  location: f.location.value,
                  totalCapacity: f.totalCapacity.value,
                  usedCapacity: f.usedCapacity.value,
                  capacityUnit: f.capacityUnit.value,
                  status: f.status.value,
                },
                editingStorageFacility,
                handleAddStorageFacility,
                handleUpdateStorageFacility,
                setStorageFacilityModalOpen,
                setEditingStorageFacility,
              );
            }}
            className="space-y-4"
          >
            <div>
              <label className={lbl}>Facility Name</label>
              <input
                name="name"
                required
                defaultValue={editingStorageFacility?.name || ""}
                className={inp}
                placeholder="e.g. Main Warehouse"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Type</label>
                <input
                  name="type"
                  required
                  defaultValue={editingStorageFacility?.type || ""}
                  className={inp}
                  placeholder="e.g. Dry Storage"
                />
              </div>
              <div>
                <label className={lbl}>Status</label>
                <select
                  name="status"
                  defaultValue={editingStorageFacility?.status || "Active"}
                  className={inp}
                >
                  <option>Active</option>
                  <option>Maintenance</option>
                  <option>Full</option>
                </select>
              </div>
            </div>
            <div>
              <label className={lbl}>Location</label>
              <input
                name="location"
                required
                defaultValue={editingStorageFacility?.location || ""}
                className={inp}
                placeholder="e.g. Alem Maya Hub"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={lbl}>Total</label>
                <input
                  name="totalCapacity"
                  type="number"
                  min="0"
                  step="0.1"
                  required
                  defaultValue={editingStorageFacility?.totalCapacity || ""}
                  className={inp}
                />
              </div>
              <div>
                <label className={lbl}>Used</label>
                <input
                  name="usedCapacity"
                  type="number"
                  min="0"
                  step="0.1"
                  required
                  defaultValue={editingStorageFacility?.usedCapacity || ""}
                  className={inp}
                />
              </div>
              <div>
                <label className={lbl}>Unit</label>
                <input
                  name="capacityUnit"
                  defaultValue={editingStorageFacility?.capacityUnit || "kg"}
                  className={inp}
                />
              </div>
            </div>
            <div className="flex justify-end pt-4 space-x-2">
              <button
                type="button"
                onClick={close(
                  setStorageFacilityModalOpen,
                  setEditingStorageFacility,
                )}
                className={cancelBtn}
              >
                Cancel
              </button>
              <button type="submit" className={submitBtn}>
                {editingStorageFacility ? "Save Changes" : "Add Storage"}
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {/* ── Batch Lot ─────────────────────────────────────── */}
      {batchLotModalOpen && (
        <ModalShell
          title={editingBatchLot ? "Edit Batch Lot" : "Add Batch Lot"}
          subtitle="Track harvest lots and storage locations"
          onClose={close(setBatchLotModalOpen, setEditingBatchLot)}
        >
          <form
            key={editingBatchLot?.id || "new"}
            onSubmit={async (e) => {
              e.preventDefault();
              const f = e.currentTarget;
              await submit(
                {
                  batchId: f.batchId.value,
                  product: f.product.value,
                  quantity: f.quantity.value,
                  unit: f.unit.value,
                  harvestDate: f.harvestDate.value,
                  storageLocation: f.storageLocation.value,
                  status: f.status.value,
                },
                editingBatchLot,
                handleAddBatchLot,
                handleUpdateBatchLot,
                setBatchLotModalOpen,
                setEditingBatchLot,
              );
            }}
            className="space-y-4"
          >
            <div>
              <label className={lbl}>Batch ID</label>
              <input
                name="batchId"
                required
                defaultValue={editingBatchLot?.batchId || `LOT-${Date.now()}`}
                className={inp}
              />
            </div>
            <div>
              <label className={lbl}>Product</label>
              <input
                name="product"
                required
                defaultValue={editingBatchLot?.product || ""}
                className={inp}
                placeholder="e.g. Harar Coffee Beans"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Quantity</label>
                <input
                  name="quantity"
                  type="number"
                  min="0"
                  step="0.1"
                  required
                  defaultValue={editingBatchLot?.quantity || ""}
                  className={inp}
                />
              </div>
              <div>
                <label className={lbl}>Unit</label>
                <input
                  name="unit"
                  defaultValue={editingBatchLot?.unit || "kg"}
                  required
                  className={inp}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Harvest Date</label>
                <input
                  name="harvestDate"
                  type="date"
                  required
                  defaultValue={editingBatchLot?.harvestDate || ""}
                  className={inp}
                />
              </div>
              <div>
                <label className={lbl}>Status</label>
                <select
                  name="status"
                  defaultValue={editingBatchLot?.status || "Stored"}
                  className={inp}
                >
                  <option>Stored</option>
                  <option>In Transit</option>
                  <option>Sold</option>
                </select>
              </div>
            </div>
            <div>
              <label className={lbl}>Storage Location</label>
              <input
                name="storageLocation"
                required
                defaultValue={editingBatchLot?.storageLocation || ""}
                className={inp}
                placeholder="e.g. Main Warehouse Bin 3"
              />
            </div>
            <div className="flex justify-end pt-4 space-x-2">
              <button
                type="button"
                onClick={close(setBatchLotModalOpen, setEditingBatchLot)}
                className={cancelBtn}
              >
                Cancel
              </button>
              <button type="submit" className={submitBtn}>
                {editingBatchLot ? "Save Changes" : "Add Batch"}
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {/* ── Quality Grade ─────────────────────────────────── */}
      {qualityGradeModalOpen && (
        <ModalShell
          title={
            editingQualityGrade ? "Edit Quality Grade" : "Add Quality Grade"
          }
          onClose={close(setQualityGradeModalOpen, setEditingQualityGrade)}
        >
          <form
            key={editingQualityGrade?.id || "new"}
            onSubmit={async (e) => {
              e.preventDefault();
              const f = e.currentTarget;
              await submit(
                {
                  productName: f.productName.value,
                  grade: f.grade.value,
                  assessmentDate: f.assessmentDate.value,
                  inspector: f.inspector.value,
                  notes: f.notes.value,
                },
                editingQualityGrade,
                handleAddQualityGrade,
                handleUpdateQualityGrade,
                setQualityGradeModalOpen,
                setEditingQualityGrade,
              );
            }}
            className="space-y-4"
          >
            <div>
              <label className={lbl}>Product Name</label>
              <input
                name="productName"
                required
                defaultValue={editingQualityGrade?.productName || ""}
                className={inp}
                placeholder="e.g. Harar Coffee Beans"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Grade</label>
                <select
                  name="grade"
                  defaultValue={editingQualityGrade?.grade || "A"}
                  className={inp}
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Assessment Date</label>
                <input
                  name="assessmentDate"
                  type="date"
                  required
                  defaultValue={editingQualityGrade?.assessmentDate || ""}
                  className={inp}
                />
              </div>
            </div>
            <div>
              <label className={lbl}>Inspector</label>
              <input
                name="inspector"
                required
                defaultValue={editingQualityGrade?.inspector || ""}
                className={inp}
                placeholder="e.g. Cooperative Lab Team"
              />
            </div>
            <div>
              <label className={lbl}>Notes</label>
              <textarea
                name="notes"
                rows="3"
                defaultValue={editingQualityGrade?.notes || ""}
                className={inp}
              ></textarea>
            </div>
            <div className="flex justify-end pt-4 space-x-2">
              <button
                type="button"
                onClick={close(
                  setQualityGradeModalOpen,
                  setEditingQualityGrade,
                )}
                className={cancelBtn}
              >
                Cancel
              </button>
              <button type="submit" className={submitBtn}>
                {editingQualityGrade ? "Save Changes" : "Add Grade"}
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {/* ── Certification ─────────────────────────────────── */}
      {certificationModalOpen && (
        <ModalShell
          title={
            editingCertification ? "Edit Certification" : "Add Certification"
          }
          onClose={close(setCertificationModalOpen, setEditingCertification)}
        >
          <form
            key={editingCertification?.id || "new"}
            onSubmit={async (e) => {
              e.preventDefault();
              const f = e.currentTarget;
              await submit(
                {
                  certificationName: f.certificationName.value,
                  issuingAuthority: f.issuingAuthority.value,
                  issueDate: f.issueDate.value,
                  expiryDate: f.expiryDate.value,
                  certificateNumber: f.certificateNumber.value,
                },
                editingCertification,
                handleAddCertification,
                handleUpdateCertification,
                setCertificationModalOpen,
                setEditingCertification,
              );
            }}
            className="space-y-4"
          >
            <div>
              <label className={lbl}>Certification Name</label>
              <input
                name="certificationName"
                required
                defaultValue={editingCertification?.certificationName || ""}
                className={inp}
                placeholder="e.g. Organic Certification"
              />
            </div>
            <div>
              <label className={lbl}>Issuing Authority</label>
              <input
                name="issuingAuthority"
                required
                defaultValue={
                  editingCertification?.issuingAuthority ||
                  editingCertification?.issuingBody ||
                  ""
                }
                className={inp}
                placeholder="e.g. Ministry of Agriculture"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Issue Date</label>
                <input
                  name="issueDate"
                  type="date"
                  required
                  defaultValue={editingCertification?.issueDate || ""}
                  className={inp}
                />
              </div>
              <div>
                <label className={lbl}>Expiry Date</label>
                <input
                  name="expiryDate"
                  type="date"
                  required
                  defaultValue={editingCertification?.expiryDate || ""}
                  className={inp}
                />
              </div>
            </div>
            <div>
              <label className={lbl}>Certificate Number</label>
              <input
                name="certificateNumber"
                defaultValue={editingCertification?.certificateNumber || ""}
                className={inp}
                placeholder="e.g. CERT-2026-001"
              />
            </div>
            <div className="flex justify-end pt-4 space-x-2">
              <button
                type="button"
                onClick={close(
                  setCertificationModalOpen,
                  setEditingCertification,
                )}
                className={cancelBtn}
              >
                Cancel
              </button>
              <button type="submit" className={submitBtn}>
                {editingCertification ? "Save Changes" : "Add Certification"}
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {/* ── Lab Test ──────────────────────────────────────── */}
      {labTestModalOpen && (
        <ModalShell
          title={editingLabTest ? "Edit Lab Test" : "Add Lab Test"}
          onClose={close(setLabTestModalOpen, setEditingLabTest)}
        >
          <form
            key={editingLabTest?.id || "new"}
            onSubmit={async (e) => {
              e.preventDefault();
              const f = e.currentTarget;
              await submit(
                {
                  testType: f.testType.value,
                  laboratory: f.laboratory.value,
                  testedDate: f.testedDate.value,
                  result: f.result.value,
                  notes: f.notes.value,
                },
                editingLabTest,
                handleAddLabTest,
                handleUpdateLabTest,
                setLabTestModalOpen,
                setEditingLabTest,
              );
            }}
            className="space-y-4"
          >
            <div>
              <label className={lbl}>Test Type</label>
              <input
                name="testType"
                required
                defaultValue={editingLabTest?.testType || ""}
                className={inp}
                placeholder="e.g. Moisture Test"
              />
            </div>
            <div>
              <label className={lbl}>Laboratory</label>
              <input
                name="laboratory"
                required
                defaultValue={editingLabTest?.laboratory || ""}
                className={inp}
                placeholder="e.g. Harar Lab Center"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Tested Date</label>
                <input
                  name="testedDate"
                  type="date"
                  required
                  defaultValue={editingLabTest?.testedDate || ""}
                  className={inp}
                />
              </div>
              <div>
                <label className={lbl}>Result</label>
                <select
                  name="result"
                  defaultValue={editingLabTest?.result || "Pass"}
                  className={inp}
                >
                  <option>Pass</option>
                  <option>Fail</option>
                  <option>Pending</option>
                </select>
              </div>
            </div>
            <div>
              <label className={lbl}>Notes</label>
              <textarea
                name="notes"
                rows="3"
                defaultValue={editingLabTest?.notes || ""}
                className={inp}
              ></textarea>
            </div>
            <div className="flex justify-end pt-4 space-x-2">
              <button
                type="button"
                onClick={close(setLabTestModalOpen, setEditingLabTest)}
                className={cancelBtn}
              >
                Cancel
              </button>
              <button type="submit" className={submitBtn}>
                {editingLabTest ? "Save Changes" : "Add Lab Test"}
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {/* ── Loan ──────────────────────────────────────────── */}
      {loanModalOpen && (
        <ModalShell
          title={editingLoan ? "Edit Loan Application" : "Apply for Loan"}
          onClose={close(setLoanModalOpen, setEditingLoan)}
        >
          <form
            key={editingLoan?.id || "new"}
            onSubmit={async (e) => {
              e.preventDefault();
              const f = e.currentTarget;
              await submit(
                {
                  loanType: f.loanType.value,
                  amount: f.amount.value,
                  purpose: f.purpose.value,
                  repaymentPeriod: f.repaymentPeriod.value,
                  interestRate: f.interestRate.value,
                },
                editingLoan,
                handleAddLoanApplication,
                handleUpdateLoanApplication,
                setLoanModalOpen,
                setEditingLoan,
              );
            }}
            className="space-y-4"
          >
            <div>
              <label className={lbl}>Loan Type</label>
              <select
                name="loanType"
                required
                defaultValue={editingLoan?.loanType || "production"}
                className={inp}
              >
                <option value="production">Production Loan</option>
                <option value="equipment">Equipment Loan</option>
                <option value="operational">Operational Loan</option>
              </select>
            </div>
            <div>
              <label className={lbl}>Amount (ETB)</label>
              <input
                name="amount"
                type="number"
                required
                defaultValue={editingLoan?.amount || ""}
                className={inp}
                placeholder="e.g. 100000"
              />
            </div>
            <div>
              <label className={lbl}>Purpose</label>
              <textarea
                name="purpose"
                required
                defaultValue={editingLoan?.purpose || ""}
                className={inp}
                placeholder="Loan purpose..."
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Repayment Period (months)</label>
                <input
                  name="repaymentPeriod"
                  type="number"
                  required
                  defaultValue={editingLoan?.repaymentPeriod || ""}
                  className={inp}
                  placeholder="e.g. 12"
                />
              </div>
              <div>
                <label className={lbl}>Interest Rate (%)</label>
                <input
                  name="interestRate"
                  type="number"
                  min="0"
                  step="0.1"
                  defaultValue={editingLoan?.interestRate || ""}
                  className={inp}
                  placeholder="e.g. 12"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4 space-x-2">
              <button
                type="button"
                onClick={close(setLoanModalOpen, setEditingLoan)}
                className={cancelBtn}
              >
                Cancel
              </button>
              <button type="submit" className={submitBtn}>
                {editingLoan ? "Save Changes" : "Submit Application"}
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {/* ── Insurance ─────────────────────────────────────── */}
      {insuranceModalOpen && (
        <ModalShell
          title={
            editingInsurance ? "Edit Insurance Policy" : "Add Insurance Policy"
          }
          onClose={close(setInsuranceModalOpen, setEditingInsurance)}
        >
          <form
            key={editingInsurance?.id || "new"}
            onSubmit={async (e) => {
              e.preventDefault();
              const f = e.currentTarget;
              await submit(
                {
                  provider: f.provider.value,
                  policyType: f.policyType.value,
                  premium: f.premium.value,
                  coverage: f.coverage.value,
                  expiryDate: f.expiryDate.value,
                },
                editingInsurance,
                handleAddInsurance,
                handleUpdateInsurance,
                setInsuranceModalOpen,
                setEditingInsurance,
              );
            }}
            className="space-y-4"
          >
            <div>
              <label className={lbl}>Provider</label>
              <input
                name="provider"
                required
                defaultValue={editingInsurance?.provider || ""}
                className={inp}
                placeholder="e.g. Ethiopian Insurance"
              />
            </div>
            <div>
              <label className={lbl}>Policy Type</label>
              <input
                name="policyType"
                required
                defaultValue={editingInsurance?.policyType || ""}
                className={inp}
                placeholder="e.g. Crop Insurance"
              />
            </div>
            <div>
              <label className={lbl}>Premium (ETB)</label>
              <input
                name="premium"
                type="number"
                min="0"
                step="0.01"
                required
                defaultValue={editingInsurance?.premium || ""}
                className={inp}
              />
            </div>
            <div>
              <label className={lbl}>Coverage</label>
              <input
                name="coverage"
                defaultValue={editingInsurance?.coverage || ""}
                className={inp}
                placeholder="e.g. Drought + disease coverage"
              />
            </div>
            <div>
              <label className={lbl}>Expiry Date</label>
              <input
                name="expiryDate"
                type="date"
                defaultValue={editingInsurance?.expiryDate || ""}
                className={inp}
              />
            </div>
            <div className="flex justify-end pt-4 space-x-2">
              <button
                type="button"
                onClick={close(setInsuranceModalOpen, setEditingInsurance)}
                className={cancelBtn}
              >
                Cancel
              </button>
              <button type="submit" className={submitBtn}>
                {editingInsurance ? "Save Changes" : "Add Policy"}
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {/* ── Subsidy ───────────────────────────────────────── */}
      {subsidyModalOpen && (
        <ModalShell
          title={
            editingSubsidy ? "Edit Subsidy Application" : "Apply for Subsidy"
          }
          onClose={close(setSubsidyModalOpen, setEditingSubsidy)}
        >
          <form
            key={editingSubsidy?.id || "new"}
            onSubmit={async (e) => {
              e.preventDefault();
              const f = e.currentTarget;
              await submit(
                {
                  programName: f.programName.value,
                  amount: f.amount.value,
                  purpose: f.purpose.value,
                  status: editingSubsidy?.status || "pending",
                  applicationDate:
                    editingSubsidy?.applicationDate ||
                    new Date().toISOString().slice(0, 10),
                },
                editingSubsidy,
                handleAddSubsidy,
                handleUpdateSubsidy,
                setSubsidyModalOpen,
                setEditingSubsidy,
              );
            }}
            className="space-y-4"
          >
            <div>
              <label className={lbl}>Program Name</label>
              <input
                name="programName"
                required
                defaultValue={editingSubsidy?.programName || ""}
                className={inp}
                placeholder="e.g. Fertilizer Support Fund"
              />
            </div>
            <div>
              <label className={lbl}>Requested Amount (ETB)</label>
              <input
                name="amount"
                type="number"
                min="0"
                step="0.01"
                required
                defaultValue={editingSubsidy?.amount || ""}
                className={inp}
              />
            </div>
            <div>
              <label className={lbl}>Purpose</label>
              <textarea
                name="purpose"
                rows="3"
                required
                defaultValue={editingSubsidy?.purpose || ""}
                className={inp}
                placeholder="How the subsidy will be used"
              ></textarea>
            </div>
            <div className="flex justify-end pt-4 space-x-2">
              <button
                type="button"
                onClick={close(setSubsidyModalOpen, setEditingSubsidy)}
                className={cancelBtn}
              >
                Cancel
              </button>
              <button type="submit" className={submitBtn}>
                {editingSubsidy ? "Save Changes" : "Submit Application"}
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {/* ── Production Cost ───────────────────────────────── */}
      {productionCostModalOpen && (
        <ModalShell
          title={
            editingProductionCost
              ? "Edit Production Cost"
              : "Add Production Cost"
          }
          onClose={close(setProductionCostModalOpen, setEditingProductionCost)}
        >
          <form
            key={editingProductionCost?.id || "new"}
            onSubmit={async (e) => {
              e.preventDefault();
              const f = e.currentTarget;
              await submit(
                {
                  category: f.category.value,
                  item: f.item.value,
                  amount: f.amount.value,
                  date: f.date.value,
                  notes: f.notes.value,
                },
                editingProductionCost,
                handleAddProductionCost,
                handleUpdateProductionCost,
                setProductionCostModalOpen,
                setEditingProductionCost,
              );
            }}
            className="space-y-4"
          >
            <div>
              <label className={lbl}>Category</label>
              <select
                name="category"
                defaultValue={editingProductionCost?.category || "Seed"}
                className={inp}
              >
                <option>Seed</option>
                <option>Fertilizer</option>
                <option>Labor</option>
                <option>Equipment</option>
                <option>Transport</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className={lbl}>Item / Description</label>
              <input
                name="item"
                required
                defaultValue={
                  editingProductionCost?.item ||
                  editingProductionCost?.description ||
                  ""
                }
                className={inp}
                placeholder="e.g. Hybrid maize seed"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Amount (ETB)</label>
                <input
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  defaultValue={editingProductionCost?.amount || ""}
                  className={inp}
                />
              </div>
              <div>
                <label className={lbl}>Date</label>
                <input
                  name="date"
                  type="date"
                  required
                  defaultValue={editingProductionCost?.date || ""}
                  className={inp}
                />
              </div>
            </div>
            <div>
              <label className={lbl}>Notes</label>
              <textarea
                name="notes"
                rows="3"
                defaultValue={editingProductionCost?.notes || ""}
                className={inp}
              ></textarea>
            </div>
            <div className="flex justify-end pt-4 space-x-2">
              <button
                type="button"
                onClick={close(
                  setProductionCostModalOpen,
                  setEditingProductionCost,
                )}
                className={cancelBtn}
              >
                Cancel
              </button>
              <button type="submit" className={submitBtn}>
                {editingProductionCost ? "Save Changes" : "Add Cost"}
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {/* ── Auction ───────────────────────────────────────── */}
      {auctionModalOpen && (
        <ModalShell
          title={editingAuction ? "Edit Auction" : "Start Auction"}
          onClose={close(setAuctionModalOpen, setEditingAuction)}
        >
          <form
            key={editingAuction?.id || "new"}
            onSubmit={async (e) => {
              e.preventDefault();
              const f = e.currentTarget;
              await submit(
                {
                  productId: f.productId.value,
                  startingPrice: f.startingPrice.value,
                  duration: f.duration.value,
                  minBid: f.minBid.value,
                },
                editingAuction,
                handleAddAuction,
                handleUpdateAuction,
                setAuctionModalOpen,
                setEditingAuction,
              );
            }}
            className="space-y-4"
          >
            <div>
              <label className={lbl}>Product</label>
              <select
                name="productId"
                required
                value={editingAuction?.productId || ""}
                onChange={(e) => setEditingAuction({...editingAuction, productId: e.target.value})}
                className={inp}
              >
                <option value="">Select a product</option>
                {products.filter(p => p.name).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - {p.price} ETB/{p.unit}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Starting Price</label>
                <input
                  name="startingPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={editingAuction?.startingPrice || ""}
                  onChange={(e) => setEditingAuction({...editingAuction, startingPrice: e.target.value})}
                  className={inp}
                />
              </div>
              <div>
                <label className={lbl}>Min Bid</label>
                <input
                  name="minBid"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={editingAuction?.minBid || ""}
                  onChange={(e) => setEditingAuction({...editingAuction, minBid: e.target.value})}
                  className={inp}
                />
              </div>
            </div>
            <div>
              <label className={lbl}>Duration</label>
              <select
                name="duration"
                value={editingAuction?.duration || "7 days"}
                onChange={(e) => setEditingAuction({...editingAuction, duration: e.target.value})}
                className={inp}
              >
                <option>24 hours</option>
                <option>3 days</option>
                <option>7 days</option>
                <option>14 days</option>
              </select>
            </div>
            <div className="flex justify-end pt-4 space-x-2">
              <button
                type="button"
                onClick={close(setAuctionModalOpen, setEditingAuction)}
                className={cancelBtn}
              >
                Cancel
              </button>
              <button type="submit" className={submitBtn}>
                {editingAuction ? "Save Changes" : "Start Auction"}
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {/* ── Contract ──────────────────────────────────────── */}
      {contractModalOpen && (
        <ModalShell
          title={
            editingContract ? "Edit Contract" : "Create Contract Farming Deal"
          }
          onClose={close(setContractModalOpen, setEditingContract)}
        >
          <form
            key={editingContract?.id || "new"}
            onSubmit={async (e) => {
              e.preventDefault();
              const f = e.currentTarget;
              await submit(
                {
                  buyer: f.buyer.value,
                  productId: f.productId.value,
                  quantity: f.quantity.value,
                  agreedPrice: f.agreedPrice.value,
                  deliveryDate: f.deliveryDate.value,
                },
                editingContract,
                handleAddContract,
                handleUpdateContract,
                setContractModalOpen,
                setEditingContract,
              );
            }}
            className="space-y-4"
          >
            <div>
              <label className={lbl}>Buyer</label>
              <input
                name="buyer"
                required
                value={editingContract?.buyer || ""}
                onChange={(e) => setEditingContract({...editingContract, buyer: e.target.value})}
                className={inp}
                placeholder="Buyer or cooperative name"
              />
            </div>
            <div>
              <label className={lbl}>Product</label>
              <select
                name="productId"
                required
                value={editingContract?.productId || ""}
                onChange={(e) => setEditingContract({...editingContract, productId: e.target.value})}
                className={inp}
              >
                <option value="">Select a product</option>
                {products.filter(p => p.name).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - {p.price} ETB/{p.unit}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Quantity</label>
                <input
                  name="quantity"
                  type="number"
                  min="0"
                  step="0.1"
                  required
                  value={editingContract?.quantity || ""}
                  onChange={(e) => setEditingContract({...editingContract, quantity: e.target.value})}
                  className={inp}
                />
              </div>
              <div>
                <label className={lbl}>Agreed Price</label>
                <input
                  name="agreedPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={editingContract?.agreedPrice || ""}
                  onChange={(e) => setEditingContract({...editingContract, agreedPrice: e.target.value})}
                  className={inp}
                />
              </div>
            </div>
            <div>
              <label className={lbl}>Delivery Date</label>
              <input
                name="deliveryDate"
                type="date"
                required
                value={editingContract?.deliveryDate || ""}
                onChange={(e) => setEditingContract({...editingContract, deliveryDate: e.target.value})}
                className={inp}
              />
            </div>
            <div className="flex justify-end pt-4 space-x-2">
              <button
                type="button"
                onClick={close(setContractModalOpen, setEditingContract)}
                className={cancelBtn}
              >
                Cancel
              </button>
              <button type="submit" className={submitBtn}>
                {editingContract ? "Save Changes" : "Create Contract"}
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {/* ── Bulk Discount ─────────────────────────────────── */}
      {bulkDiscountModalOpen && (
        <ModalShell
          title={
            editingBulkDiscount
              ? "Edit Bulk Discount"
              : "Configure Bulk Discount"
          }
          onClose={close(setBulkDiscountModalOpen, setEditingBulkDiscount)}
        >
          <form
            key={editingBulkDiscount?.id || "new"}
            onSubmit={async (e) => {
              e.preventDefault();
              const f = e.currentTarget;
              const selectedProductId = f.productId.value;
              
              const selectedProduct = products.find(p => p.id === selectedProductId);
              if (!selectedProduct) {
                alert('Please select a valid product from the list.');
                return;
              }
              
              // Include product name and original price for the backend
              const submitData = {
                productId: selectedProductId,
                minQuantity: parseInt(f.minQuantity.value) || 0,
                discountPercent: parseFloat(f.discountPercent.value) || 0,
                active: f.active.checked,
                product: selectedProduct.name,
                originalPrice: selectedProduct.price,
              };
              
              await submit(
                submitData,
                editingBulkDiscount,
                handleAddBulkDiscount,
                handleUpdateBulkDiscount,
                setBulkDiscountModalOpen,
                setEditingBulkDiscount,
              );
            }}
            className="space-y-4"
          >
            <div>
              <label className={lbl}>Product</label>
              <select
                name="productId"
                required
                value={editingBulkDiscount?.productId || ""}
                onChange={(e) => setEditingBulkDiscount({...editingBulkDiscount, productId: e.target.value})}
                className={inp}
              >
                <option value="">Select a product</option>
                {products.filter(p => p.name && p.category === 'Crops').map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - {p.price} ETB/{p.unit}
                  </option>
                ))}
              </select>
              {editingBulkDiscount?.productId && !products.find(p => p.id === editingBulkDiscount.productId) && (
                <p className="text-xs text-red-600 mt-1">
                  ⚠️ Previously selected product no longer exists. Please select a different product.
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Minimum Quantity</label>
                <input
                  name="minQuantity"
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={editingBulkDiscount?.minQuantity || ""}
                  onChange={(e) => setEditingBulkDiscount({...editingBulkDiscount, minQuantity: e.target.value})}
                  className={inp}
                  placeholder="e.g. 10"
                />
              </div>
              <div>
                <label className={lbl}>Discount %</label>
                <input
                  name="discountPercent"
                  type="number"
                  min="1"
                  max="100"
                  step="0.1"
                  required
                  value={editingBulkDiscount?.discountPercent || ""}
                  onChange={(e) => setEditingBulkDiscount({...editingBulkDiscount, discountPercent: e.target.value})}
                  className={inp}
                  placeholder="e.g. 15"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                name="active"
                type="checkbox"
                id="active"
                checked={editingBulkDiscount?.active !== undefined ? editingBulkDiscount.active : true}
                onChange={(e) => setEditingBulkDiscount({...editingBulkDiscount, active: e.target.checked})}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <label htmlFor="active" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Active (show on marketplace)
              </label>
            </div>
            <div className="flex justify-end pt-4 space-x-2">
              <button
                type="button"
                onClick={close(
                  setBulkDiscountModalOpen,
                  setEditingBulkDiscount,
                )}
                className={cancelBtn}
              >
                Cancel
              </button>
              <button type="submit" className={submitBtn}>
                {editingBulkDiscount ? "Save Changes" : "Configure Discount"}
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {/* ── Pre-Harvest Sale ──────────────────────────────── */}
      {preHarvestModalOpen && (
        <ModalShell
          title={
            editingPreHarvest
              ? "Edit Pre-Harvest Sale"
              : "Create Pre-Harvest Sale"
          }
          onClose={close(setPreHarvestModalOpen, setEditingPreHarvest)}
        >
          <form
            key={editingPreHarvest?.id || "new"}
            onSubmit={async (e) => {
              e.preventDefault();
              const f = e.currentTarget;
              await submit(
                {
                  productId: f.productId.value,
                  crop: f.crop.value,
                  harvestDate: f.harvestDate.value,
                  quantity: f.quantity.value,
                  price: f.price.value,
                  depositPercent: f.depositPercent.value,
                },
                editingPreHarvest,
                handleAddPreHarvest,
                handleUpdatePreHarvest,
                setPreHarvestModalOpen,
                setEditingPreHarvest,
              );
            }}
            className="space-y-4"
          >
            <div>
              <label className={lbl}>Product</label>
              <select
                name="productId"
                required
                value={editingPreHarvest?.productId || ""}
                onChange={(e) => setEditingPreHarvest({...editingPreHarvest, productId: e.target.value})}
                className={inp}
              >
                <option value="">Select a product</option>
                {products.filter(p => p.name).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - {p.price} ETB/{p.unit}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={lbl}>Crop</label>
              <input
                name="crop"
                required
                value={editingPreHarvest?.crop || ""}
                onChange={(e) => setEditingPreHarvest({...editingPreHarvest, crop: e.target.value})}
                className={inp}
                placeholder="e.g. Coffee"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Harvest Date</label>
                <input
                  name="harvestDate"
                  type="date"
                  required
                  value={editingPreHarvest?.harvestDate || ""}
                  onChange={(e) => setEditingPreHarvest({...editingPreHarvest, harvestDate: e.target.value})}
                  className={inp}
                />
              </div>
              <div>
                <label className={lbl}>Quantity</label>
                <input
                  name="quantity"
                  type="number"
                  min="0"
                  step="0.1"
                  required
                  value={editingPreHarvest?.quantity || ""}
                  onChange={(e) => setEditingPreHarvest({...editingPreHarvest, quantity: e.target.value})}
                  className={inp}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Price (ETB)</label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={editingPreHarvest?.price || ""}
                  onChange={(e) => setEditingPreHarvest({...editingPreHarvest, price: e.target.value})}
                  className={inp}
                />
              </div>
              <div>
                <label className={lbl}>Deposit %</label>
                <input
                  name="depositPercent"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  required
                  value={editingPreHarvest?.depositPercent || ""}
                  onChange={(e) => setEditingPreHarvest({...editingPreHarvest, depositPercent: e.target.value})}
                  className={inp}
                />
              </div>
            </div>
            <div className="flex justify-end pt-4 space-x-2">
              <button
                type="button"
                onClick={close(setPreHarvestModalOpen, setEditingPreHarvest)}
                className={cancelBtn}
              >
                Cancel
              </button>
              <button type="submit" className={submitBtn}>
                {editingPreHarvest ? "Save Changes" : "Create Pre-Sale"}
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {/* ── Quality Audit ─────────────────────────────────── */}
      {auditModalOpen && (
        <ModalShell
          title="Schedule Quality Audit"
          onClose={() => setAuditModalOpen(false)}
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const f = e.currentTarget;
              await handleAddQualityAudit({
                target: f.target.value,
                type: f.type.value,
                scheduledDate: f.scheduledDate.value,
                auditor: f.auditor.value,
              });
              setAuditModalOpen(false);
            }}
            className="space-y-4"
          >
            <div>
              <label className={lbl}>Target (Farm / Batch / Product)</label>
              <input
                name="target"
                required
                className={inp}
                placeholder="e.g. Batch LOT-2026-01"
              />
            </div>
            <div>
              <label className={lbl}>Audit Type</label>
              <select name="type" required className={inp}>
                <option value="quality">Quality Check</option>
                <option value="safety">Safety Inspection</option>
                <option value="compliance">Compliance Audit</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Scheduled Date</label>
                <input
                  name="scheduledDate"
                  type="date"
                  required
                  className={inp}
                />
              </div>
              <div>
                <label className={lbl}>Auditor</label>
                <input
                  name="auditor"
                  required
                  className={inp}
                  placeholder="e.g. Audit Team A"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4 space-x-2">
              <button
                type="button"
                onClick={() => setAuditModalOpen(false)}
                className={cancelBtn}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/20 transition-all"
              >
                Schedule Audit
              </button>
            </div>
          </form>
        </ModalShell>
      )}
      
      {/* ── Add/Edit Product ────────────────────────────────────── */}
      {addProductOpen && (
        <ModalShell
          title={editingProduct ? "Edit Product" : "Add New Product"}
          subtitle="Enter product details for your marketplace listing"
          onClose={close(setAddProductOpen, setEditingProduct)}
        >
          <form
            key={editingProduct?.id || "new"}
            onSubmit={async (e) => {
              e.preventDefault();
              const f = e.currentTarget;
              
              // Validation
              if (!f.name.value.trim()) {
                alert('Product name is required');
                return;
              }
              if (!f.category.value) {
                alert('Please select a category');
                return;
              }
              if (!f.type.value.trim()) {
                alert('Product type is required');
                return;
              }
              if (!f.price.value || parseFloat(f.price.value) <= 0) {
                alert('Please enter a valid price');
                return;
              }
              if (!f.quantity.value || parseInt(f.quantity.value) <= 0) {
                alert('Please enter a valid quantity');
                return;
              }
              if (!f.unit.value.trim()) {
                alert('Unit is required');
                return;
              }
              if (!f.harvestDate.value) {
                alert('Harvest date is required');
                return;
              }
              if (!f.location.value.trim()) {
                alert('Location is required');
                return;
              }
              
              await submit(
                {
                  name: f.name.value.trim(),
                  category: f.category.value,
                  type: f.type.value.trim(),
                  price: parseFloat(f.price.value),
                  quantity: parseInt(f.quantity.value),
                  unit: f.unit.value.trim(),
                  harvestDate: f.harvestDate.value,
                  location: f.location.value.trim(),
                  description: f.description.value.trim() || '',
                },
                editingProduct,
                handleAddProduct,
                handleUpdateProduct,
                setAddProductOpen,
                setEditingProduct,
              );
            }}
            className="space-y-4"
          >
            <div>
              <label className={lbl}>Product Name</label>
              <input
                name="name"
                type="text"
                required
                className={inp}
                placeholder="e.g. Premium Coffee Beans"
                defaultValue={editingProduct?.name || ""}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Category</label>
                <select
                  name="category"
                  required
                  className={inp}
                  defaultValue={editingProduct?.category || "Crops"}
                >
                  <option value="Crops">🌾 Crops</option>
                  <option value="Livestock">🐂 Livestock</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Product Type</label>
                <input
                  name="type"
                  type="text"
                  required
                  className={inp}
                  placeholder="e.g. Coffee, Groundnuts, Cattle"
                  defaultValue={editingProduct?.type || ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Price (ETB)</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  className={inp}
                  placeholder="e.g. 350"
                  defaultValue={editingProduct?.price || ""}
                />
              </div>
              <div>
                <label className={lbl}>Quantity</label>
                <input
                  name="quantity"
                  type="number"
                  min="1"
                  step="1"
                  required
                  className={inp}
                  placeholder="e.g. 500"
                  defaultValue={editingProduct?.quantity || ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Unit</label>
                <input
                  name="unit"
                  type="text"
                  required
                  className={inp}
                  placeholder="e.g. kg, head, bag"
                  defaultValue={editingProduct?.unit || "kg"}
                />
              </div>
              <div>
                <label className={lbl}>Harvest Date</label>
                <input
                  name="harvestDate"
                  type="date"
                  required
                  className={inp}
                  defaultValue={editingProduct?.harvestDate || ""}
                />
              </div>
            </div>
            <div>
              <label className={lbl}>Location / Hub</label>
              <select
                name="location"
                required
                className={inp}
                defaultValue={editingProduct?.location || "Alem Maya"}
              >
                <option value="Alem Maya">Alem Maya</option>
                <option value="Babille">Babille</option>
                <option value="Harar City">Harar City</option>
                <option value="Dire Dawa">Dire Dawa</option>
              </select>
            </div>
            <div>
              <label className={lbl}>Description (Optional)</label>
              <textarea
                name="description"
                rows="3"
                className={inp}
                placeholder="Describe your product quality, variety, certifications..."
                defaultValue={editingProduct?.description || ""}
              />
            </div>
            <div className="flex justify-end pt-4 space-x-2">
              <button
                type="button"
                onClick={() => close(setAddProductOpen, setEditingProduct)}
                className={cancelBtn}
              >
                Cancel
              </button>
              <button type="submit" className={submitBtn}>
                {editingProduct ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </form>
        </ModalShell>
      )}
    </>
  );
}
