import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const saleSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  note: z.string().max(200).optional(),
});

const SaleForm = ({ onSubmit, onCancel, isLoading, products }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      productId: '',
      quantity: 1,
      note: '',
    },
  });

  const selectedProductId = watch('productId');
  const selectedProduct = products?.find(p => p._id === selectedProductId);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Product</label>
        <select
          {...register('productId')}
          className="block w-full rounded-md border-gray-700 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm bg-gray-800 text-gray-100"
        >
          <option value="">Select a product</option>
          {products?.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name}
            </option>
          ))}
        </select>
        {errors.productId && <p className="mt-1 text-sm text-red-600">{errors.productId.message}</p>}
      </div>

      {selectedProduct && (
        <div className="text-sm text-gray-400 bg-gray-800/60 p-2 rounded">
          Current Stock: {selectedProduct.stock} | Price: ${selectedProduct.price}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Quantity"
          type="number"
          min="1"
          max={selectedProduct?.stock || 1}
          {...register('quantity')}
          error={errors.quantity?.message}
        />
        {selectedProduct && selectedProduct.stock < 1 && (
          <p className="text-xs text-red-600 mt-6">Out of stock!</p>
        )}
        {selectedProduct && watch('quantity') > selectedProduct.stock && (
          <p className="text-xs text-red-600 mt-6">Only {selectedProduct.stock} in stock!</p>
        )}
      </div>

      <Input
        label="Note (optional)"
        {...register('note')}
        error={errors.note?.message}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" loading={isLoading}>
          Record Sale
        </Button>
      </div>
    </form>
  );
};

export default SaleForm;
