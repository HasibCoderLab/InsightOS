import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const expenseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  amount: z.coerce.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  note: z.string().max(200).optional(),
  date: z.string().optional(),
});

const ExpenseForm = ({ onSubmit, onCancel, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: '',
      amount: 0,
      category: 'other',
      note: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Title"
        {...register('title')}
        error={errors.title?.message}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Amount"
          type="number"
          step="0.01"
          {...register('amount')}
          error={errors.amount?.message}
        />
        <Input
          label="Date"
          type="date"
          {...register('date')}
          error={errors.date?.message}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
        <select
          {...register('category')}
          className="block w-full rounded-md border-gray-700 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm bg-gray-800 text-gray-100"
        >
          <option value="rent">Rent</option>
          <option value="salary">Salary</option>
          <option value="utilities">Utilities</option>
          <option value="marketing">Marketing</option>
          <option value="supplies">Supplies</option>
          <option value="transport">Transport</option>
          <option value="maintenance">Maintenance</option>
          <option value="other">Other</option>
        </select>
        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
      </div>
      <Input
        label="Note"
        {...register('note')}
        error={errors.note?.message}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" loading={isLoading}>
          Save Expense
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
