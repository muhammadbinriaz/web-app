import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import MedicinesPage from './pages/admin/Medicines';
import PointOfSale from './pages/admin/PointOfSale';
import Suppliers from './pages/admin/Suppliers'; // Real component

// Temporary placeholder components for other pages
const SalesReport = () => <div className="p-8"><h1 className="text-2xl font-bold">Sales Report - Coming Soon</h1></div>;
// REMOVED the duplicate Suppliers placeholder

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/medicines" element={<MedicinesPage />} />
          <Route path="/admin/pos" element={<PointOfSale />} />
          <Route path="/admin/sales" element={<SalesReport />} />
          <Route path="/admin/suppliers" element={<Suppliers />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;