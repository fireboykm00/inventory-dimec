import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Products } from '@/pages/Products';
import { Categories } from '@/pages/Categories';
import { Suppliers } from '@/pages/Suppliers';
import { Issuance } from '@/pages/Issuance';
import { Reports } from '@/pages/Reports';
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={['ADMIN', 'INVENTORY_CLERK', 'VIEWER']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Products Routes */}
            <Route
              path="/products"
              element={
                <ProtectedRoute roles={['ADMIN', 'INVENTORY_CLERK', 'VIEWER']}>
                  <Products />
                </ProtectedRoute>
              }
            />
            
            {/* Categories Routes */}
            <Route
              path="/categories"
              element={
                <ProtectedRoute roles={['ADMIN', 'INVENTORY_CLERK']}>
                  <Categories />
                </ProtectedRoute>
              }
            />
            
            {/* Suppliers Routes */}
            <Route
              path="/suppliers"
              element={
                <ProtectedRoute roles={['ADMIN', 'INVENTORY_CLERK']}>
                  <Suppliers />
                </ProtectedRoute>
              }
            />
            
            {/* Issuance Routes */}
            <Route
              path="/issuance"
              element={
                <ProtectedRoute roles={['ADMIN', 'INVENTORY_CLERK']}>
                  <Issuance />
                </ProtectedRoute>
              }
            />
            
            {/* Reports Routes */}
            <Route
              path="/reports"
              element={
                <ProtectedRoute roles={['ADMIN', 'INVENTORY_CLERK']}>
                  <Reports />
                </ProtectedRoute>
              }
            />
            
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
