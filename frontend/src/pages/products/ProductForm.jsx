import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  category: z.string().min(1, 'Category is required'),
  price: z.coerce.number().positive('Price must be positive'),
  stock: z.coerce.number().int().nonnegative('Stock must be non-negative'),
  lowStockThreshold: z.coerce.number().int().nonnegative().default(10),
});

const ProductForm = ({ initialData, onSubmit, onCancel, isLoading, error }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: '',
      category: '',
      price: 0,
      stock: 0,
      lowStockThreshold: 10,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md">
            {error}
          </div>
        )}
        <Input
          label="Product Name"
          {...register('name')}
          error={errors.name?.message}
        />
        <Input
          label="Category"
          {...register('category')}
          error={errors.category?.message}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price"
            type="number"
            step="0.01"
            {...register('price')}
            error={errors.price?.message}
          />
          <Input
            label="Stock"
            type="number"
            {...register('stock')}
            error={errors.stock?.message}
          />
        </div>
        <Input
          label="Low Stock Threshold"
          type="number"
          {...register('lowStockThreshold')}
          error={errors.lowStockThreshold?.message}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" loading={isLoading}>
          {initialData ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
