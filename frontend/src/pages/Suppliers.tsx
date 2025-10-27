import React, { useState, useEffect } from 'react';
import { suppliersAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Users, Mail, MapPin } from 'lucide-react';

interface Supplier {
  supplierId: number;
  name: string;
  contact: string;
  email: string;
  address: string;
}

export const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await suppliersAPI.getAll();
      setSuppliers(response.data);
    } catch (error) {
      toast.error('Failed to fetch suppliers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await suppliersAPI.update(editingSupplier.supplierId, formData);
        toast.success('Supplier updated successfully');
      } else {
        await suppliersAPI.create(formData);
        toast.success('Supplier created successfully');
      }

      fetchSuppliers();
      resetForm();
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save supplier');
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contact: supplier.contact,
      email: supplier.email,
      address: supplier.address,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (supplierId: number) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await suppliersAPI.delete(supplierId);
        toast.success('Supplier deleted successfully');
        fetchSuppliers();
      } catch (error) {
        toast.error('Failed to delete supplier');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contact: '',
      email: '',
      address: '',
    });
    setEditingSupplier(null);
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
              <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
              <p className="mt-2 text-gray-600">Manage your product suppliers</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supplier
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingSupplier ? 'Update the supplier information.' : 'Create a new supplier for your inventory.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Supplier Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Enter supplier name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Person</Label>
                    <Input
                      id="contact"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      required
                      placeholder="Enter contact person name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      placeholder="Enter supplier address"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingSupplier ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Suppliers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((supplier) => (
              <Card key={supplier.supplierId} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-blue-600" />
                      <CardTitle className="text-lg">{supplier.name}</CardTitle>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(supplier)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(supplier.supplierId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{supplier.contact}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {supplier.email && (
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">{supplier.email}</span>
                      </div>
                    )}
                    
                    {supplier.address && (
                      <div className="flex items-start text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                        <span className="text-gray-600">{supplier.address}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {suppliers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
              <p className="text-gray-600">Get started by adding your first supplier</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
