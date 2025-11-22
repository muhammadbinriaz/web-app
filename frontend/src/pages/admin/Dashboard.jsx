import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { medicineService } from "../../services/medicineService";
import { saleService } from "../../services/saleService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMedicines: 0,
    lowStockItems: 0,
    todaySales: 0,
    totalCustomers: 0,
  });
  const [lowStockMedicines, setLowStockMedicines] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch medicines for stats
      const medicines = await medicineService.getAllMedicines();
      const totalMedicines = medicines.length;
      const lowStockItems = medicines.filter(
        (med) => med.stockQuantity <= med.minStockThreshold
      ).length;

      // Fetch low stock medicines
      const lowStockData = await medicineService.getLowStockMedicines();
      setLowStockMedicines(lowStockData);

      // Fetch recent sales
      const sales = await saleService.getAllSales();
      const today = new Date().toDateString();
      const todaySalesData = sales.filter(
        (sale) => new Date(sale.createdAt).toDateString() === today
      );

      const todaySales = todaySalesData.reduce(
        (total, sale) => total + sale.totalAmount,
        0
      );

      // Calculate unique customers (simplified)
      const uniqueCustomers = [
        ...new Set(sales.map((sale) => sale.customerName)),
      ].length;

      // Get last 3 sales for recent sales
      const recentSalesData = sales
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

      setStats({
        totalMedicines,
        lowStockItems,
        todaySales,
        totalCustomers: uniqueCustomers,
      });

      setRecentSales(recentSalesData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      alert(
        "Failed to load dashboard data. Please check if backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
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
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Live Data from Database</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Admin User</span>
              <button
                onClick={() => {
                  localStorage.removeItem("pharma_token");
                  localStorage.removeItem("pharma_user");
                  window.location.href = "/login";
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Medicines */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
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
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Medicines
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalMedicines}
                </p>
              </div>
            </div>
          </div>

          {/* Low Stock Items */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Low Stock Items
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.lowStockItems}
                </p>
              </div>
            </div>
          </div>

          {/* Today's Sales */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0 6l-2.5 1.5M12 15l2.5 1.5M12 15v1m0-1v-1"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Today's Sales
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.todaySales.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Total Customers */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Customers
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalCustomers}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/admin/medicines"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-500 hover:bg-blue-50 transition-colors group"
              >
                <div className="text-blue-600 group-hover:text-blue-700 mb-2">
                  <svg
                    className="w-8 h-8 mx-auto"
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
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Add Medicine
                </p>
              </Link>

              <Link
                to="/admin/pos"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-green-500 hover:bg-green-50 transition-colors group"
              >
                <div className="text-green-600 group-hover:text-green-700 mb-2">
                  <svg
                    className="w-8 h-8 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Point of Sale
                </p>
              </Link>

              <Link
                to="/admin/sales"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-purple-500 hover:bg-purple-50 transition-colors group"
              >
                <div className="text-purple-600 group-hover:text-purple-700 mb-2">
                  <svg
                    className="w-8 h-8 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Sales Report
                </p>
              </Link>

              <Link
                to="/admin/suppliers"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-orange-500 hover:bg-orange-50 transition-colors group"
              >
                <div className="text-orange-600 group-hover:text-orange-700 mb-2">
                  <svg
                    className="w-8 h-8 mx-auto"
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
                </div>
                <p className="text-sm font-medium text-gray-700">Suppliers</p>
              </Link>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Low Stock Alerts
            </h2>
            <div className="space-y-3">
              {lowStockMedicines.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No low stock items 🎉
                </p>
              ) : (
                lowStockMedicines.slice(0, 3).map((medicine, index) => (
                  <div
                    key={medicine._id}
                    className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {medicine.name}
                      </p>
                      <p className="text-sm text-red-600">
                        Stock: {medicine.stockQuantity} (Threshold:{" "}
                        {medicine.minStockThreshold})
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                      Low Stock
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Sales
          </h2>
          <div className="space-y-3">
            {recentSales.length === 0 ? (
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <p className="text-gray-500">No sales yet</p>
                <p className="text-gray-400 text-sm">
                  Make your first sale to see data here
                </p>
              </div>
            ) : (
              recentSales.map((sale) => (
                <div
                  key={sale._id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {sale.customerName || "Walk-in Customer"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(sale.createdAt)} •{" "}
                      {formatTime(sale.createdAt)}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {sale.paymentMethod}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-green-600">
                    ${sale.totalAmount.toFixed(2)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
