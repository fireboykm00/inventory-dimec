import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Users, 
  FileText, 
  BarChart3,
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';
import { useState } from 'react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'INVENTORY_CLERK', 'VIEWER'] },
    { name: 'Products', href: '/products', icon: Package, roles: ['ADMIN', 'INVENTORY_CLERK', 'VIEWER'] },
    { name: 'Categories', href: '/categories', icon: Tags, roles: ['ADMIN', 'INVENTORY_CLERK'] },
    { name: 'Suppliers', href: '/suppliers', icon: Users, roles: ['ADMIN', 'INVENTORY_CLERK'] },
    { name: 'Issuance', href: '/issuance', icon: FileText, roles: ['ADMIN', 'INVENTORY_CLERK'] },
    { name: 'Reports', href: '/reports', icon: BarChart3, roles: ['ADMIN', 'INVENTORY_CLERK'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    user && item.roles.includes(user.role)
  );

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/dashboard" className="text-xl sm:text-2xl font-bold text-green-600 whitespace-nowrap">
                🧾 DIMEC Inventory
              </Link>
            </div>
            
            {/* Desktop Navigation - Hidden on small screens */}
            <div className="hidden lg:ml-8 lg:flex lg:space-x-4">
              {filteredNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive(item.href)
                        ? 'bg-green-50 text-green-700 border-green-500'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent'
                    } inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md transition-colors duration-200`}
                  >
                    <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="hidden xl:inline">{item.name}</span>
                    <span className="xl:hidden">{item.name.substring(0, 1)}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* Desktop User Info - Hidden on medium screens and below */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                  {user.name}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {user.role}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center hover:bg-red-50 hover:border-red-300 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden xl:inline">Logout</span>
                <span className="xl:hidden">Exit</span>
              </Button>
            </div>
          </div>
          
          {/* Mobile menu button - Visible on medium screens and below */}
          <div className="flex items-center lg:hidden">
            <div className="flex items-center space-x-2">
              {/* Compact User Info for Medium Screens */}
              <div className="hidden sm:flex items-center space-x-2 mr-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-medium text-gray-600 truncate max-w-[80px]">
                  {user.name}
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Mobile Navigation */}
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive(item.href)
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                  } group flex items-center px-3 py-2 text-base font-medium rounded-md border-l-4 transition-colors duration-200`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </div>
          
          {/* Mobile User Section */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 truncate max-w-[200px]">
                    {user.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {user.role}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 px-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start hover:bg-red-50 hover:border-red-300 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
