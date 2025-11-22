import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { medicineService } from "../../services/medicineService";
import { supplierService } from "../../services/supplierService"; // ADD THIS IMPORT

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [suppliers, setSuppliers] = useState([]); // ADD SUPPLIERS STATE
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    category: "",
    description: "",
    manufacturer: "",
    purchasePrice: "",
    sellingPrice: "",
    stockQuantity: "",
    expiryDate: "",
    batchNumber: "",
    minStockThreshold: "10",
    supplier: "" // ADD SUPPLIER FIELD
  });

  // Fetch medicines and suppliers from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const [medicinesData, suppliersData] = await Promise.all([
        medicineService.getAllMedicines(),
        supplierService.getAllSuppliers()
      ]);
      setMedicines(medicinesData);
      setSuppliers(suppliersData);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load data. Please check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add new medicine to backend
  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      const medicineData = {
        name: newMedicine.name,
        category: newMedicine.category,
        description: newMedicine.description,
        manufacturer: newMedicine.manufacturer,
        purchasePrice: parseFloat(newMedicine.purchasePrice),
        sellingPrice: parseFloat(newMedicine.sellingPrice),
        stockQuantity: parseInt(newMedicine.stockQuantity),
        expiryDate: newMedicine.expiryDate,
        batchNumber: newMedicine.batchNumber,
        minStockThreshold: parseInt(newMedicine.minStockThreshold),
        supplier: newMedicine.supplier || undefined // Include supplier if selected
      };

      await medicineService.createMedicine(medicineData);

      // Refresh the medicines list
      await fetchData();

      // Reset form
      setNewMedicine({
        name: "",
        category: "",
        description: "",
        manufacturer: "",
        purchasePrice: "",
        sellingPrice: "",
        stockQuantity: "",
        expiryDate: "",
        batchNumber: "",
        minStockThreshold: "10",
        supplier: ""
      });
      setShowAddForm(false);

      alert("Medicine added successfully to database!");
    } catch (error) {
      console.error("Error adding medicine:", error);
      alert("Failed to add medicine. Please try again.");
    }
  };

  // Delete medicine from backend
  const deleteMedicine = async (id) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        await medicineService.deleteMedicine(id);
        await fetchData(); // Refresh list
        alert("Medicine deleted successfully from database!");
      } catch (error) {
        console.error("Error deleting medicine:", error);
        alert("Failed to delete medicine. Please try again.");
      }
    }
  };

  const getStockStatus = (quantity, threshold) => {
    if (quantity === 0)
      return { status: "Out of Stock", color: "bg-red-100 text-red-800" };
    if (quantity <= threshold)
      return { status: "Low Stock", color: "bg-orange-100 text-orange-800" };
    return { status: "In Stock", color: "bg-green-100 text-green-800" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Loading medicines from database...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Medicine Management
              </h1>
              <p className="text-gray-600">Connected to MongoDB - Real Data</p>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/admin/dashboard"
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Back to Dashboard
              </Link>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Medicine
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Medicines Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medicine
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {medicines.map((medicine) => {
                  const stockStatus = getStockStatus(
                    medicine.stockQuantity,
                    medicine.minStockThreshold
                  );
                  return (
                    <tr key={medicine._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {medicine.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {medicine.manufacturer}
                          </div>
                          <div className="text-xs text-gray-400">
                            Batch: {medicine.batchNumber}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {medicine.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {medicine.supplier ? medicine.supplier.name : "No Supplier"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          Sell: ${medicine.sellingPrice}
                        </div>
                        <div className="text-sm text-gray-500">
                          Cost: ${medicine.purchasePrice}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {medicine.stockQuantity}
                        <div className="text-xs text-gray-500">
                          Min: {medicine.minStockThreshold}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stockStatus.color}`}
                        >
                          {stockStatus.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(medicine.expiryDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          Edit
                        </button>
                        <button
                          onClick={() => deleteMedicine(medicine._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {medicines.length === 0 && (
              <div className="text-center py-8">
                <svg
                  className="w-12 h-12 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <p className="text-gray-500">No medicines found in database.</p>
                <p className="text-gray-400 text-sm mt-1">
                  Add your first medicine to get started.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Add Medicine Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Add New Medicine to Database
                </h3>

                <form onSubmit={handleAddMedicine} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medicine Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newMedicine.name}
                      onChange={(e) =>
                        setNewMedicine({ ...newMedicine, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Paracetamol 500mg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <input
                        type="text"
                        required
                        value={newMedicine.category}
                        onChange={(e) =>
                          setNewMedicine({
                            ...newMedicine,
                            category: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Pain Relief"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Manufacturer *
                      </label>
                      <input
                        type="text"
                        required
                        value={newMedicine.manufacturer}
                        onChange={(e) =>
                          setNewMedicine({
                            ...newMedicine,
                            manufacturer: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., MediCorp"
                      />
                    </div>
                  </div>

                  {/* ADD SUPPLIER SELECTION */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supplier
                    </label>
                    <select
                      value={newMedicine.supplier || ''}
                      onChange={(e) => setNewMedicine({...newMedicine, supplier: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Supplier</option>
                      {suppliers.map(supplier => (
                        <option key={supplier._id} value={supplier._id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={newMedicine.description}
                      onChange={(e) =>
                        setNewMedicine({
                          ...newMedicine,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Medicine description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Purchase Price ($) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={newMedicine.purchasePrice}
                        onChange={(e) =>
                          setNewMedicine({
                            ...newMedicine,
                            purchasePrice: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Selling Price ($) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={newMedicine.sellingPrice}
                        onChange={(e) =>
                          setNewMedicine({
                            ...newMedicine,
                            sellingPrice: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={newMedicine.stockQuantity}
                        onChange={(e) =>
                          setNewMedicine({
                            ...newMedicine,
                            stockQuantity: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Min Stock Threshold *
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={newMedicine.minStockThreshold}
                        onChange={(e) =>
                          setNewMedicine({
                            ...newMedicine,
                            minStockThreshold: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={newMedicine.expiryDate}
                        onChange={(e) =>
                          setNewMedicine({
                            ...newMedicine,
                            expiryDate: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Batch Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={newMedicine.batchNumber}
                        onChange={(e) =>
                          setNewMedicine({
                            ...newMedicine,
                            batchNumber: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., PC20241201"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      Add to Database
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Medicines;