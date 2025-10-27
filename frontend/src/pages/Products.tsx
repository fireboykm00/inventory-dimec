import React, { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI, suppliersAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  AlertTriangle,
  Package,
  DollarSign,
  Layers
} from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  productId: number;
  name: string;
  categoryId: number;
  categoryName: string;
  supplierId: number;
  supplierName: string;
  quantity: number;
  unitPrice: number;
  reorderLevel: number;
  description: string;
  lowStock: boolean;
}

interface Category {
  categoryId: number;
  name: string;
  description: string;
}

interface Supplier {
  supplierId: number;
  name: string;
  contact: string;
  email: string;
  address: string;
}

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    supplierId: '',
    quantity: '',
    unitPrice: '',
    reorderLevel: '',
    description: '',
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSuppliers();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await suppliersAPI.getAll();
      setSuppliers(response.data);
    } catch (error) {
      toast.error('Failed to fetch suppliers');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        supplierId: parseInt(formData.supplierId),
        quantity: parseInt(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
        reorderLevel: parseInt(formData.reorderLevel),
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct.productId, productData);
        toast.success('Product updated successfully');
      } else {
        await productsAPI.create(productData);
        toast.success('Product created successfully');
      }

      fetchProducts();
      resetForm();
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      categoryId: product.categoryId.toString(),
      supplierId: product.supplierId.toString(),
      quantity: product.quantity.toString(),
      unitPrice: product.unitPrice.toString(),
      reorderLevel: product.reorderLevel.toString(),
      description: product.description,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(productId);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      categoryId: '',
      supplierId: '',
      quantity: '',
      unitPrice: '',
      reorderLevel: '',
      description: '',
    });
    setEditingProduct(null);
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="mt-2 text-gray-600">Manage your inventory products</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingProduct ? 'Update the product information.' : 'Create a new product for your inventory.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Category</Label>
                    <Select 
                      value={formData.categoryId} 
                      onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.categoryId} value={category.categoryId.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="supplierId">Supplier</Label>
                    <Select 
                      value={formData.supplierId} 
                      onValueChange={(value) => setFormData({ ...formData, supplierId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.supplierId} value={supplier.supplierId.toString()}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        required
                        min="0"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="unitPrice">Unit Price</Label>
                      <Input
                        id="unitPrice"
                        type="number"
                        step="0.01"
                        value={formData.unitPrice}
                        onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                        required
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reorderLevel">Reorder Level</Label>
                    <Input
                      id="reorderLevel"
                      type="number"
                      value={formData.reorderLevel}
                      onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                      required
                      min="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingProduct ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.productId} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="secondary">{product.categoryName}</Badge>
                    <Badge variant="outline">{product.supplierName}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="text-sm font-medium">Stock:</span>
                      </div>
                      <span className={`font-bold ${
                        product.lowStock ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {product.quantity}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                        <span className="text-sm font-medium">Price:</span>
                      </div>
                      <span className="font-bold">${product.unitPrice}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Layers className="h-4 w-4 mr-2 text-purple-600" />
                        <span className="text-sm font-medium">Reorder:</span>
                      </div>
                      <span className="font-bold">{product.reorderLevel}</span>
                    </div>
                    
                    {product.lowStock && (
                      <Alert className="mt-3">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          Low stock - needs restocking
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {product.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first product'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
