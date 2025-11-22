import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supplierService } from "../../services/supplierService";
import { medicineService } from "../../services/medicineService";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
  });

  // Fetch suppliers and medicines from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const [suppliersData, medicinesData] = await Promise.all([
        supplierService.getAllSuppliers(),
        medicineService.getAllMedicines(),
      ]);
      setSuppliers(suppliersData);
      setMedicines(medicinesData);
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

  // Add new supplier to backend
  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      await supplierService.createSupplier(newSupplier);

      // Refresh the suppliers list
      await fetchData();

      // Reset form
      setNewSupplier({
        name: "",
        contact: "",
        email: "",
        address: "",
      });
      setShowAddForm(false);

      alert("Supplier added successfully to database!");
    } catch (error) {
      console.error("Error adding supplier:", error);
      alert("Failed to add supplier. Please try again.");
    }
  };

  // Delete supplier from backend
  const deleteSupplier = async (id, supplierName) => {
    // Check if supplier has medicines
    const supplierMedicines = medicines.filter(
      (med) => med.supplier && med.supplier._id === id
    );

    if (supplierMedicines.length > 0) {
      alert(
        `Cannot delete ${supplierName}. This supplier has ${supplierMedicines.length} medicine(s) associated. Please reassign or delete those medicines first.`
      );
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${supplierName}?`)) {
      try {
        await supplierService.deleteSupplier(id);
        await fetchData(); // Refresh list
        alert("Supplier deleted successfully from database!");
      } catch (error) {
        console.error("Error deleting supplier:", error);
        alert("Failed to delete supplier. Please try again.");
      }
    }
  };

  // Count medicines for each supplier
  const getMedicineCount = (supplierId) => {
    return medicines.filter(
      (med) => med.supplier && med.supplier._id === supplierId
    ).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading suppliers data...</p>
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
                Supplier Management
              </h1>
              <p className="text-gray-600">Manage your medicine suppliers</p>
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
                Add Supplier
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No suppliers yet
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by adding your first supplier.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Add First Supplier
              </button>
            </div>
          ) : (
            suppliers.map((supplier) => {
              const medicineCount = supplier.suppliedMedicines
                ? supplier.suppliedMedicines.length
                : 0;

              return (
                <div
                  key={supplier._id}
                  className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {supplier.name}
                    </h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {medicineCount}{" "}
                      {medicineCount === 1 ? "medicine" : "medicines"}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {supplier.contact}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {supplier.email}
                    </div>

                    <div className="flex items-start text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="break-words">{supplier.address}</span>
                    </div>
                  </div>

                  {/* Supplier Medicines Preview */}
                  {/* Supplier Medicines Preview */}
                  {supplier.suppliedMedicines &&
                    supplier.suppliedMedicines.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Supplied Medicines:
                        </h4>
                        <div className="space-y-1">
                          {supplier.suppliedMedicines
                            .slice(0, 3)
                            .map((medicine) => (
                              <div
                                key={medicine._id}
                                className="flex justify-between items-center text-xs bg-gray-50 px-2 py-1 rounded"
                              >
                                <span className="text-gray-600">
                                  {medicine.name}
                                </span>
                                <span className="text-green-600 font-medium">
                                  ${medicine.sellingPrice}
                                </span>
                              </div>
                            ))}
                          {supplier.suppliedMedicines.length > 3 && (
                            <div className="text-xs text-gray-500 text-center">
                              +{supplier.suppliedMedicines.length - 3} more
                              medicines
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        deleteSupplier(supplier._id, supplier.name)
                      }
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add Supplier Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Add New Supplier
                </h3>

                <form onSubmit={handleAddSupplier} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supplier Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newSupplier.name}
                      onChange={(e) =>
                        setNewSupplier({ ...newSupplier, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., MediCorp Pharmaceuticals"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={newSupplier.contact}
                      onChange={(e) =>
                        setNewSupplier({
                          ...newSupplier,
                          contact: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., +1234567890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={newSupplier.email}
                      onChange={(e) =>
                        setNewSupplier({
                          ...newSupplier,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., contact@medicorp.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <textarea
                      required
                      value={newSupplier.address}
                      onChange={(e) =>
                        setNewSupplier({
                          ...newSupplier,
                          address: e.target.value,
                        })
                      }
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Full business address"
                    />
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
                      Add Supplier
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

export default Suppliers;
