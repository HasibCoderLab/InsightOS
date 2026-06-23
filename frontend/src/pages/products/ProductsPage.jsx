import { useState } from 'react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../hooks/useProducts';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import ProductForm from './ProductForm';
import { Badge } from '../../components/ui/Badge';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const ProductsPage = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState(null);

  const { data, isLoading } = useProducts({ search, category });
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const handleCreateOrUpdate = async (formData) => {
    setError(null);
    try {
      if (editingProduct) {
        await updateMutation.mutateAsync({ id: editingProduct._id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'category', header: 'Category' },
    { key: 'price', header: 'Price', render: (p) => formatCurrency(p.price) },
    { 
      key: 'stock', 
      header: 'Stock', 
      render: (p) => (
        <Badge 
          variant={p.stock <= p.lowStockThreshold ? 'warning' : 'success'}
        >
          {p.stock.toString()}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (p) => (
        <div className="flex space-x-2">
          <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} className="text-violet-400 hover:text-violet-300">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => handleDelete(p._id)} className="text-red-400 hover:text-red-300">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="rounded-md border-gray-700 text-sm focus:ring-violet-500
                       bg-gray-800 text-gray-100"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Food">Food</option>
          </select>
        </div>
        <Button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} icon={<Plus className="h-4 w-4 mr-2" />}>
          Add Product
        </Button>
      </div>

      <Table 
        columns={columns} 
        data={data?.products || []} 
        loading={isLoading} 
        emptyMessage="No products found." 
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingProduct(null); }} 
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <ProductForm 
          initialData={editingProduct} 
          onSubmit={handleCreateOrUpdate} 
          onCancel={() => { setIsModalOpen(false); setEditingProduct(null); setError(null); }}
          isLoading={createMutation.isPending || updateMutation.isPending}
          error={error}
        />
      </Modal>
    </div>
  );
};

export default ProductsPage;
