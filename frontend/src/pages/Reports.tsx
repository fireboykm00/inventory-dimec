import React, { useState, useEffect } from 'react';
import { productsAPI, issuancesAPI, dashboardAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  AlertTriangle, 
  Package,
  DollarSign,
  FileText,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  productId: number;
  name: string;
  categoryName: string;
  supplierName: string;
  quantity: number;
  unitPrice: number;
  reorderLevel: number;
  lowStock: boolean;
}

interface IssuanceRecord {
  issuanceId: number;
  productName: string;
  userName: string;
  quantityIssued: number;
  issuedTo: string;
  issueDate: string;
  purpose: string;
}

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalSuppliers: number;
  lowStockProducts: number;
  totalInventoryValue: number;
  totalIssuances: number;
}

export const Reports: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [issuances, setIssuances] = useState<IssuanceRecord[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const [productsRes, issuancesRes, statsRes] = await Promise.all([
        productsAPI.getAll(),
        issuancesAPI.getAll(),
        dashboardAPI.getStats(),
      ]);
      
      setProducts(productsRes.data);
      setIssuances(issuancesRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to fetch report data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIssuancesByDateRange = async () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    try {
      const response = await issuancesAPI.getByDateRange(dateRange.startDate, dateRange.endDate);
      setIssuances(response.data);
      toast.success(`Found ${response.data.length} issuance records`);
    } catch (error) {
      toast.error('Failed to fetch issuances for selected date range');
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Report exported successfully');
  };

  const exportLowStockReport = () => {
    const lowStockProducts = products.filter(p => p.lowStock);
    const exportData = lowStockProducts.map(p => ({
      'Product Name': p.name,
      'Category': p.categoryName,
      'Supplier': p.supplierName,
      'Current Stock': p.quantity,
      'Reorder Level': p.reorderLevel,
      'Unit Price': p.unitPrice,
      'Total Value': p.quantity * p.unitPrice,
    }));
    
    exportToCSV(exportData, 'low-stock-report.csv');
  };

  const exportInventoryReport = () => {
    const exportData = products.map(p => ({
      'Product Name': p.name,
      'Category': p.categoryName,
      'Supplier': p.supplierName,
      'Quantity': p.quantity,
      'Unit Price': p.unitPrice,
      'Total Value': p.quantity * p.unitPrice,
      'Reorder Level': p.reorderLevel,
      'Status': p.lowStock ? 'Low Stock' : 'In Stock',
    }));
    
    exportToCSV(exportData, 'inventory-report.csv');
  };

  const exportIssuanceReport = () => {
    const exportData = issuances.map(i => ({
      'Product Name': i.productName,
      'Quantity Issued': i.quantityIssued,
      'Issued To': i.issuedTo,
      'Issued By': i.userName,
      'Issue Date': new Date(i.issueDate).toLocaleDateString(),
      'Purpose': i.purpose || 'N/A',
    }));
    
    exportToCSV(exportData, 'issuance-report.csv');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const lowStockProducts = products.filter(p => p.lowStock);
  const recentIssuances = issuances.slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="mt-2 text-gray-600">Generate and export inventory reports</p>
          </div>

          {/* Summary Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">Items in inventory</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.lowStockProducts}</div>
                  <p className="text-xs text-muted-foreground">Need restocking</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalInventoryValue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Total stock value</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Issuances</CardTitle>
                  <FileText className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalIssuances}</div>
                  <p className="text-xs text-muted-foreground">Items issued</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Export Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2 text-blue-600" />
                  Inventory Report
                </CardTitle>
                <CardDescription>
                  Complete inventory with stock levels and values
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={exportInventoryReport} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Inventory
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                  Low Stock Report
                </CardTitle>
                <CardDescription>
                  Products that need to be restocked
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={exportLowStockReport} 
                  className="w-full"
                  disabled={lowStockProducts.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Low Stock ({lowStockProducts.length})
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-purple-600" />
                  Issuance Report
                </CardTitle>
                <CardDescription>
                  Product issuance records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={exportIssuanceReport} 
                  className="w-full"
                  disabled={issuances.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Issuances ({issuances.length})
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Date Range Filter */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-green-600" />
                Date Range Filter
              </CardTitle>
              <CardDescription>
                Filter issuance records by date range
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={fetchIssuancesByDateRange} className="w-full">
                    Filter Records
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <Alert className="mb-8 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Attention:</strong> You have {lowStockProducts.length} products with low stock levels. 
                Consider placing orders for these items soon.
              </AlertDescription>
            </Alert>
          )}

          {/* Recent Issuances */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-purple-600" />
                Recent Issuances
              </CardTitle>
              <CardDescription>
                Latest 10 issuance records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentIssuances.map((issuance) => (
                  <div key={issuance.issuanceId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{issuance.productName}</p>
                      <p className="text-sm text-gray-600">
                        Issued to {issuance.issuedTo} by {issuance.userName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(issuance.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline">Qty: {issuance.quantityIssued}</Badge>
                  </div>
                ))}
              </div>
              
              {issuances.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No issuance records found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
