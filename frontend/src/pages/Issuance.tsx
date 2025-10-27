import React, { useState, useEffect } from 'react';
import { issuancesAPI, productsAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Trash2, FileText, Package, User, Calendar } from 'lucide-react';

interface IssuanceRecord {
  issuanceId: number;
  productId: number;
  productName: string;
  userId: number;
  userName: string;
  quantityIssued: number;
  issuedTo: string;
  issueDate: string;
  purpose: string;
}

interface Product {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  lowStock: boolean;
}

export const Issuance: React.FC = () => {
  const [issuances, setIssuances] = useState<IssuanceRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    quantityIssued: '',
    issuedTo: '',
    purpose: '',
  });

  useEffect(() => {
    fetchIssuances();
    fetchProducts();
  }, []);

  const fetchIssuances = async () => {
    try {
      const response = await issuancesAPI.getAll();
      setIssuances(response.data);
    } catch (error) {
      toast.error('Failed to fetch issuance records');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const issuanceData = {
        ...formData,
        productId: parseInt(formData.productId),
        quantityIssued: parseInt(formData.quantityIssued),
      };

      await issuancesAPI.create(issuanceData);
      toast.success('Issuance recorded successfully');
      
      fetchIssuances();
      fetchProducts(); // Refresh to update stock levels
      resetForm();
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to record issuance');
    }
  };

  const handleDelete = async (issuanceId: number) => {
    if (window.confirm('Are you sure you want to delete this issuance record?')) {
      try {
        await issuancesAPI.delete(issuanceId);
        toast.success('Issuance record deleted successfully');
        fetchIssuances();
        fetchProducts(); // Refresh to update stock levels
      } catch (error) {
        toast.error('Failed to delete issuance record');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      quantityIssued: '',
      issuedTo: '',
      purpose: '',
    });
  };

  const getSelectedProduct = () => {
    return products.find(p => p.productId === parseInt(formData.productId));
  };

  const selectedProduct = getSelectedProduct();
  const isQuantityValid = selectedProduct && parseInt(formData.quantityIssued) <= selectedProduct.quantity;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Issuance Records</h1>
              <p className="mt-2 text-gray-600">Manage product issuance to departments</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Record Issuance
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Record New Issuance</DialogTitle>
                  <DialogDescription>
                    Record the issuance of products to a department or individual.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="productId">Product</Label>
                    <Select 
                      value={formData.productId} 
                      onValueChange={(value) => setFormData({ ...formData, productId: value, quantityIssued: '' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.productId} value={product.productId.toString()}>
                            <div className="flex items-center justify-between w-full">
                              <span>{product.name}</span>
                              <Badge variant={product.lowStock ? "destructive" : "secondary"} className="ml-2">
                                Stock: {product.quantity}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quantityIssued">Quantity to Issue</Label>
                    <Input
                      id="quantityIssued"
                      type="number"
                      value={formData.quantityIssued}
                      onChange={(e) => setFormData({ ...formData, quantityIssued: e.target.value })}
                      required
                      min="1"
                      placeholder="Enter quantity"
                    />
                    {selectedProduct && (
                      <p className="text-sm text-gray-600">
                        Available stock: {selectedProduct.quantity}
                        {!isQuantityValid && parseInt(formData.quantityIssued) > 0 && (
                          <span className="text-red-600 ml-2">⚠️ Insufficient stock</span>
                        )}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="issuedTo">Issued To</Label>
                    <Input
                      id="issuedTo"
                      value={formData.issuedTo}
                      onChange={(e) => setFormData({ ...formData, issuedTo: e.target.value })}
                      required
                      placeholder="Department or individual name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose</Label>
                    <Textarea
                      id="purpose"
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      rows={3}
                      placeholder="Purpose of issuance (optional)"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={!isQuantityValid || !formData.productId || !formData.quantityIssued}
                    >
                      Record Issuance
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Issuance Records */}
          <div className="space-y-4">
            {issuances.map((issuance) => (
              <Card key={issuance.issuanceId} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <Package className="h-5 w-5 text-blue-600" />
                      <div>
                        <CardTitle className="text-lg">{issuance.productName}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <User className="h-4 w-4 mr-1" />
                          Issued by: {issuance.userName}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Qty: {issuance.quantityIssued}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(issuance.issuanceId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">To: {issuance.issuedTo}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">
                        Date: {new Date(issuance.issueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {issuance.purpose && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-700">
                        <strong>Purpose:</strong> {issuance.purpose}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {issuances.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No issuance records found</h3>
              <p className="text-gray-600">Get started by recording your first issuance</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
