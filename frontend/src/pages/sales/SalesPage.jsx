import { useState } from 'react';
import { useSales, useCreateSale } from '../../hooks/useSales';
import { useProducts } from '../../hooks/useProducts';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import SaleForm from './SaleForm';
import { Plus, Search } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const SalesPage = () => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: salesData, isLoading: salesLoading } = useSales({ search });
  const { data: productsData } = useProducts();
  const createMutation = useCreateSale();

  const handleCreateSale = async (formData) => {
    await createMutation.mutateAsync(formData);
    setIsModalOpen(false);
  };

  const columns = [
    { key: 'productId', header: 'Product', render: (s) => s.productId?.name || 'N/A' },
    { key: 'quantity', header: 'Qty' },
    { key: 'unitPrice', header: 'Price', render: (s) => formatCurrency(s.unitPrice) },
    { key: 'totalAmount', header: 'Total', render: (s) => formatCurrency(s.totalAmount) },
    { key: 'saleDate', header: 'Date', render: (s) => new Date(s.saleDate).toLocaleDateString() },
    { key: 'note', header: 'Note', render: (s) => s.note || '-' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search sales..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="h-4 w-4" />}>
          Record Sale
        </Button>
      </div>

      <Table 
        columns={columns} 
        data={salesData?.sales || []} 
        loading={salesLoading} 
        emptyMessage="No sales found." 
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Record New Sale"
      >
        <SaleForm 
          products={productsData?.products} 
          onSubmit={handleCreateSale} 
          onCancel={() => setIsModalOpen(false)} 
          isLoading={createMutation.isPending}
        />
      </Modal>
    </div>
  );
};

export default SalesPage;
