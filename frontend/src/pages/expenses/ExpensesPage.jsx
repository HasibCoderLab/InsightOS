import { useState } from 'react';
import { useExpenses, useCreateExpense, useExpenseSummary } from '../../hooks/useExpenses';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import ExpenseForm from './ExpenseForm';
import Card from '../../components/ui/Card';
import { Wallet, Tag, Plus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const ExpensesPage = () => {
  const [category, setCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: expensesData, isLoading: expensesLoading } = useExpenses({ category });
  const { data: summaryData } = useExpenseSummary({ category });
  const createMutation = useCreateExpense();

  const handleCreateExpense = async (formData) => {
    await createMutation.mutateAsync(formData);
    setIsModalOpen(false);
  };

  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'category', header: 'Category' },
    { key: 'amount', header: 'Amount', render: (e) => formatCurrency(e.amount) },
    { key: 'date', header: 'Date', render: (e) => new Date(e.date).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card 
          title="Total Expenses" 
          value={formatCurrency(summaryData?.totalExpense || 0)} 
          icon={Wallet} 
        />
        <Card 
          title="Top Category" 
          value={summaryData?.byCategory?.[0]?.category || 'N/A'} 
          subtitle={formatCurrency(summaryData?.byCategory?.[0]?.total || 0)}
          icon={Tag} 
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <select
            className="rounded-md border-gray-700 text-sm focus:ring-violet-500
                       bg-gray-800 text-gray-100"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="rent">Rent</option>
            <option value="salary">Salary</option>
            <option value="utilities">Utilities</option>
            <option value="marketing">Marketing</option>
            <option value="supplies">Supplies</option>
            <option value="transport">Transport</option>
            <option value="maintenance">Maintenance</option>
            <option value="other">Other</option>
          </select>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="h-4 w-4" />}>
          Add Expense
        </Button>
      </div>

      <Table 
        columns={columns} 
        data={expensesData?.expenses || []} 
        loading={expensesLoading} 
        emptyMessage="No expenses found." 
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add New Expense"
      >
        <ExpenseForm 
          onSubmit={handleCreateExpense} 
          onCancel={() => setIsModalOpen(false)} 
          isLoading={createMutation.isPending}
        />
      </Modal>
    </div>
  );
};

export default ExpensesPage;
