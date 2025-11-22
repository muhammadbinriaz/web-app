import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { medicineService } from "../../services/medicineService";
import { saleService } from "../../services/saleService";

const PointOfSale = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);

  // Fetch medicines from backend
  const fetchMedicines = async () => {
    try {
      const data = await medicineService.getAllMedicines();
      setMedicines(data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      alert("Failed to load medicines. Please check if backend is running.");
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // Filter medicines based on search
  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add medicine to cart
  const addToCart = (medicine) => {
    const existingItem = cart.find(
      (item) => item.medicine._id === medicine._id
    );

    if (existingItem) {
      // Increase quantity if already in cart
      if (existingItem.quantity < medicine.stockQuantity) {
        setCart(
          cart.map((item) =>
            item.medicine._id === medicine._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        alert(`Only ${medicine.stockQuantity} items available in stock!`);
      }
    } else {
      // Add new item to cart
      if (medicine.stockQuantity > 0) {
        setCart([
          ...cart,
          {
            medicine,
            quantity: 1,
            price: medicine.sellingPrice,
          },
        ]);
      } else {
        alert("This medicine is out of stock!");
      }
    }
  };

  // Update cart item quantity
  const updateQuantity = (medicineId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(medicineId);
      return;
    }

    const medicine = medicines.find((m) => m._id === medicineId);
    if (newQuantity > medicine.stockQuantity) {
      alert(`Only ${medicine.stockQuantity} items available in stock!`);
      return;
    }

    setCart(
      cart.map((item) =>
        item.medicine._id === medicineId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (medicineId) => {
    setCart(cart.filter((item) => item.medicine._id !== medicineId));
  };

  // Calculate totals
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;

  // Process sale - NOW CONNECTED TO BACKEND!
  const processSale = async () => {
    if (cart.length === 0) {
      alert("Please add items to cart first!");
      return;
    }

    if (!customerName.trim()) {
      alert("Please enter customer name!");
      return;
    }

    setLoading(true);
    try {
      // Create sale data for backend
      const saleData = {
        customerName: customerName.trim(),
        paymentMethod,
        medicines: cart.map((item) => ({
          medicine: item.medicine._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: total,
      };

      console.log("Sending sale to backend:", saleData);

      // ACTUAL BACKEND CALL - Saves to MongoDB
      const createdSale = await saleService.createSale(saleData);

      console.log("Sale created in database:", createdSale);

      // Show success message
      alert(
        `✅ Sale completed successfully!\nReceipt #: ${
          createdSale._id
        }\nTotal: $${total.toFixed(2)}\nThank you, ${customerName}!`
      );

      // Reset form and refresh data
      setCart([]);
      setCustomerName("");
      setPaymentMethod("cash");
      await fetchMedicines(); // Refresh stock from backend
    } catch (error) {
      console.error("Error processing sale:", error);
      alert(
        `❌ Failed to process sale: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Point of Sale
              </h1>
              <p className="text-gray-600">
                Connected to Database - Real-time Updates
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/admin/dashboard"
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Medicine Search & Selection */}
          <div className="lg:col-span-2">
            {/* Search Bar */}
            <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search medicines by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg
                  className="absolute right-3 top-3 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Medicines Grid */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">
                  Available Medicines (Live from DB)
                </h3>
                <p className="text-sm text-gray-600">
                  Click to add to cart - Stock updates in real-time
                </p>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {filteredMedicines.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No medicines found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    {filteredMedicines.map((medicine) => {
                      const inCart = cart.find(
                        (item) => item.medicine._id === medicine._id
                      );
                      const stockStatus =
                        medicine.stockQuantity === 0
                          ? "Out of Stock"
                          : medicine.stockQuantity <= medicine.minStockThreshold
                          ? "Low Stock"
                          : "In Stock";
                      const stockColor =
                        medicine.stockQuantity === 0
                          ? "bg-red-100 text-red-800"
                          : medicine.stockQuantity <= medicine.minStockThreshold
                          ? "bg-orange-100 text-orange-800"
                          : "bg-green-100 text-green-800";

                      return (
                        <div
                          key={medicine._id}
                          onClick={() => addToCart(medicine)}
                          className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                            medicine.stockQuantity === 0
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:border-blue-500"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {medicine.name}
                            </h4>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${stockColor}`}
                            >
                              {stockStatus}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mb-2">
                            {medicine.category}
                          </p>

                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-green-600">
                              ${medicine.sellingPrice}
                            </span>
                            <span className="text-sm text-gray-500">
                              Stock: {medicine.stockQuantity}
                            </span>
                          </div>

                          {inCart && (
                            <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                              In cart: {inCart.quantity}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Cart & Checkout */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border sticky top-8">
              {/* Cart Header */}
              <div className="p-4 border-b bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">
                  Shopping Cart
                </h3>
                <p className="text-sm text-gray-600">{cart.length} items</p>
              </div>

              {/* Cart Items */}
              <div className="max-h-80 overflow-y-auto">
                {cart.length === 0 ? (
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
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <p className="text-gray-500">Cart is empty</p>
                    <p className="text-gray-400 text-sm">
                      Add medicines from the left
                    </p>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.medicine._id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {item.medicine.name}
                          </h4>
                          <p className="text-green-600 font-semibold">
                            ${item.price}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.medicine._id,
                                item.quantity - 1
                              )
                            }
                            className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                          >
                            -
                          </button>

                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(
                                item.medicine._id,
                                item.quantity + 1
                              )
                            }
                            className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                          >
                            +
                          </button>

                          <button
                            onClick={() => removeFromCart(item.medicine._id)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Customer Info & Totals */}
              {cart.length > 0 && (
                <div className="p-4 border-t">
                  {/* Customer Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter customer name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Payment Method */}
                  {/* Payment Method */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="online">Online</option>
                    </select>
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax (5%):</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span className="text-green-600">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={processSale}
                    disabled={loading || !customerName.trim()}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing Sale...
                      </>
                    ) : (
                      `Complete Sale - $${total.toFixed(2)}`
                    )}
                  </button>

                  <p className="text-xs text-gray-500 mt-2 text-center">
                    ✅ Sales save to database • Stock updates automatically
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointOfSale;
