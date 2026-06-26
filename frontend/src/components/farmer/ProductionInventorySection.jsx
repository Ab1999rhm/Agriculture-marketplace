import { Plus, X, Pencil } from "lucide-react";

const getCropStatusMeta = (plan) => {
  const today = new Date();
  const harvest = plan.harvestDate
    ? new Date(plan.harvestDate)
    : plan.expectedHarvest
      ? new Date(plan.expectedHarvest)
      : null;
  const planting = plan.plantingDate ? new Date(plan.plantingDate) : null;
  if (plan.status) {
    const s = plan.status;
    const color =
      s === "Harvested"
        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
        : s === "Growing"
          ? "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
    return { status: s, color };
  }
  const status =
    harvest && harvest < today
      ? "Harvested"
      : planting && planting > today
        ? "Planned"
        : "Growing";
  const color =
    status === "Harvested"
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      : status === "Growing"
        ? "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
  return { status, color };
};

const equipStatusClass = (status) =>
  ({
    operational:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    maintenance:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    retired: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  })[status] ||
  "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

const ActionButtons = ({ onEdit, onDelete }) => (
  <div className="flex items-center gap-1 shrink-0">
    {onEdit && (
      <button
        onClick={onEdit}
        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
      >
        <Pencil className="w-4 h-4" />
      </button>
    )}
    <button
      onClick={onDelete}
      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
    >
      <X className="w-4 h-4" />
    </button>
  </div>
);

export default function ProductionInventorySection({
  cropPlans,
  inventoryItems,
  equipmentList,
  storageFacilities,
  batchLots,
  onOpenCropPlan,
  onOpenInventory,
  onOpenEquipment,
  onOpenStorage,
  onOpenBatch,
  onDeleteCropPlan,
  onDeleteInventory,
  onDeleteEquipment,
  onDeleteStorage,
  onDeleteBatch,
  onEditCropPlan,
  onEditInventory,
  onEditEquipment,
  onEditStorage,
  onEditBatch,
}) {
  return (
    <div className="space-y-8">
      {/* Crop Plans */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Crop Planning & Scheduling
          </h3>
          <button
            onClick={onOpenCropPlan}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Crop Plan</span>
          </button>
        </div>
        {cropPlans.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p>No crop plans created yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cropPlans.map((plan) => {
              const { status, color } = getCropStatusMeta(plan);
              const harvestDate = plan.harvestDate || plan.expectedHarvest;
              const fieldSize = plan.fieldSize || plan.area;
              return (
                <div
                  key={plan.id}
                  className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-start gap-4"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {plan.cropType || plan.cropName}
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${color}`}
                      >
                        {status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Planting: {plan.plantingDate || "N/A"} → Harvest:{" "}
                      {harvestDate || "N/A"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Field Size: {fieldSize || "N/A"} {plan.fieldUnit || "ha"}{" "}
                      | Variety: {plan.seedVariety || "N/A"} | Irrigation:{" "}
                      {plan.irrigation || "N/A"}
                    </p>
                    <p className="text-xs text-teal-600 dark:text-teal-400 mt-0.5 font-semibold">
                      Expected Yield: {plan.expectedYield || "N/A"}{" "}
                      {plan.yieldUnit || "kg"}
                    </p>
                    {plan.notes && (
                      <p className="text-xs text-slate-500 mt-1">
                        Notes: {plan.notes}
                      </p>
                    )}
                  </div>
                  <ActionButtons
                    onEdit={onEditCropPlan ? () => onEditCropPlan(plan) : null}
                    onDelete={() => onDeleteCropPlan(plan.id)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Inventory */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Inventory Management
          </h3>
          <button
            onClick={onOpenInventory}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Inventory</span>
          </button>
        </div>
        {inventoryItems.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p>No inventory items tracked</p>
          </div>
        ) : (
          <div className="space-y-4">
            {inventoryItems.map((item) => {
              const qty = parseFloat(item.quantity) || 0;
              const isLowStock = qty < 10;
              const expiry = item.expiryDate ? new Date(item.expiryDate) : null;
              const today = new Date();
              const daysToExpiry = expiry
                ? Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
                : null;
              const isExpiringSoon =
                daysToExpiry !== null && daysToExpiry <= 7 && daysToExpiry >= 0;
              const isExpired = daysToExpiry !== null && daysToExpiry < 0;
              return (
                <div
                  key={item.id}
                  className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-start gap-4"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {item.itemName}
                      </h4>
                      {item.category && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {item.category}
                        </span>
                      )}
                      {isLowStock && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                          Low Stock
                        </span>
                      )}
                      {isExpired && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                          Expired
                        </span>
                      )}
                      {isExpiringSoon && !isExpired && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                          Expires in {daysToExpiry}d
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Quantity:{" "}
                      <span
                        className={
                          isLowStock
                            ? "text-red-600 font-bold dark:text-red-300"
                            : "font-semibold"
                        }
                      >
                        {item.quantity} {item.unit}
                      </span>{" "}
                      | Location: {item.location}
                    </p>
                    {item.expiryDate && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        Expiry: {item.expiryDate}
                      </p>
                    )}
                  </div>
                  <ActionButtons
                    onEdit={
                      onEditInventory ? () => onEditInventory(item) : null
                    }
                    onDelete={() => onDeleteInventory(item.id)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Equipment */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Equipment Tracking
          </h3>
          <button
            onClick={onOpenEquipment}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Equipment</span>
          </button>
        </div>
        {equipmentList.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p>No equipment tracked</p>
          </div>
        ) : (
          <div className="space-y-4">
            {equipmentList.map((equip) => {
              const nextMaintenance = equip.nextMaintenance
                ? new Date(equip.nextMaintenance)
                : null;
              const maintenanceDue =
                nextMaintenance && nextMaintenance <= new Date();
              return (
                <div
                  key={equip.id}
                  className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-start gap-4"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {equip.equipmentName}
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${equipStatusClass(equip.status)}`}
                      >
                        {equip.status}
                      </span>
                      {maintenanceDue && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                          Maintenance Due
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Type: {equip.type} | Purchased:{" "}
                      {equip.purchaseDate || "N/A"} | Last Maintenance:{" "}
                      {equip.lastMaintenance || "N/A"}
                    </p>
                    {equip.nextMaintenance && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        Next Maintenance: {equip.nextMaintenance}
                      </p>
                    )}
                    {equip.notes && (
                      <p className="text-xs text-slate-500 mt-1">
                        Notes: {equip.notes}
                      </p>
                    )}
                  </div>
                  <ActionButtons
                    onEdit={
                      onEditEquipment ? () => onEditEquipment(equip) : null
                    }
                    onDelete={() => onDeleteEquipment(equip.id)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Storage Facilities */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Storage Facilities
          </h3>
          <button
            onClick={onOpenStorage}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Storage</span>
          </button>
        </div>
        {storageFacilities.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p>No storage facilities added</p>
          </div>
        ) : (
          <div className="space-y-4">
            {storageFacilities.map((facility) => {
              const used = Number(facility.usedCapacity || 0);
              const total = Number(facility.totalCapacity || 0);
              const percent =
                total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
              return (
                <div
                  key={facility.id}
                  className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl"
                >
                  <div className="flex justify-between items-start mb-3 gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-900 dark:text-white">
                          {facility.name}
                        </h4>
                        {facility.status && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            {facility.status}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {facility.location} | Type: {facility.type}
                      </p>
                    </div>
                    <ActionButtons
                      onEdit={
                        onEditStorage ? () => onEditStorage(facility) : null
                      }
                      onDelete={() => onDeleteStorage(facility.id)}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Capacity Used</span>
                    <span>
                      {used} / {total} {facility.capacityUnit || "kg"} (
                      {percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${percent > 80 ? "bg-red-500" : percent > 50 ? "bg-amber-500" : "bg-teal-500"}`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Batch Lots */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Batch Lot Tracking
          </h3>
          <button
            onClick={onOpenBatch}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Batch</span>
          </button>
        </div>
        {batchLots.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p>No batch lots recorded</p>
          </div>
        ) : (
          <div className="space-y-4">
            {batchLots.map((batch) => (
              <div
                key={batch.id}
                className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-start gap-4"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {batch.batchId} — {batch.product}
                    </h4>
                    {batch.status && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                        {batch.status}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Qty: {batch.quantity} {batch.unit} | Harvested:{" "}
                    {batch.harvestDate}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Storage: {batch.storageLocation}
                  </p>
                </div>
                <ActionButtons
                  onEdit={onEditBatch ? () => onEditBatch(batch) : null}
                  onDelete={() => onDeleteBatch(batch.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
