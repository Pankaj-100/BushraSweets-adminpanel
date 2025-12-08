import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ContentProvider } from "./components/ContentContext";
import { Toaster } from "./components/ui/sonner";
import Layout from "./Layout";
import AdminDashboard from "./AdminDashboard";
import LoginPage from "./LoginPage";
import ProtectedRoute from "./ProtectedRoute";
// Add this import
import { AdminDeliveryChargesManager } from './components/admin/AdminDeliveryChargesManager';

// Add this route in the admin routes section
function AdminRouterWrapper() {
  return <AdminDashboard />;
}

export default function App() {
  return (
  
  
        <ContentProvider>
          <Router>
            <Routes>
              {/* Default → redirect to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Login page */}
              <Route path="/login" element={<LoginPage />} />

              {/* Admin routes (protected) */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<AdminRouterWrapper />} />
                        <Route path="/dashboard" element={<AdminRouterWrapper />} />
                        <Route path="/desserts" element={<AdminRouterWrapper />} />
                        <Route path="/hero" element={<AdminRouterWrapper />} />
                        <Route path="/about" element={<AdminRouterWrapper />} />
                        <Route path="/serving-ideas" element={<AdminRouterWrapper />} />
                        <Route path="/delivery-charges" element={<AdminRouterWrapper />} />

                        <Route path="/testimonials" element={<AdminRouterWrapper />} />
                        <Route path="/orders" element={<AdminRouterWrapper />} />
                        <Route path="/settings" element={<AdminRouterWrapper />} />
                        <Route path="/payments" element={<AdminRouterWrapper />} />
                        <Route path="/inquiries" element={<AdminRouterWrapper />} />
                        <Route path="/privacy-policy" element={<AdminRouterWrapper />} />
                        <Route path="/food-safety" element={<AdminRouterWrapper />} />
                        <Route path="/terms-of-service" element={<AdminRouterWrapper />} />
                        <Route path="/refund-policy" element={<AdminRouterWrapper />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
          <Toaster />
        </ContentProvider>
  
 
  );
}
