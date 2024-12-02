import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { QuoteFormData } from '../types/project';

interface QuoteFormProps {
  initialData?: Partial<QuoteFormData> | null;
  projectId: string;
  onSubmit: (data: QuoteFormData) => void;
  onCancel: () => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ initialData, projectId, onSubmit, onCancel }) => {
  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<QuoteFormData>({
    mode: 'onChange',
    defaultValues: {
      amount: initialData?.amount || 0,
      message: initialData?.message || '',
      estimatedDuration: initialData?.estimatedDuration || '',
      professionalId: initialData?.professionalId || '',
      projectId: initialData?.projectId || '',
    }
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        amount: 0,
        message: '',
        estimatedDuration: '',
        professionalId: '',
        projectId: projectId || '',
      });
    }
  }, [initialData, reset]);

  const submitHandler = (data: QuoteFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Monto</label>
        <input
          type="number"
          step="0.01"
          {...register('amount', { required: 'El monto es requerido', min: { value: 0, message: 'El monto debe ser positivo' } })}
          className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          {...register('message', { required: 'La descripción es requerida' })}
          className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
          rows={4}
        ></textarea>
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Duración Estimada</label>
        <input
          type="text"
          {...register('estimatedDuration', { required: 'La duración estimada es requerida' })}
          className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
          placeholder="e.g., 2 semanas"
        />
        {errors.estimatedDuration && (
          <p className="mt-1 text-sm text-red-600">{errors.estimatedDuration.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className={`px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors ${!isValid && 'opacity-50 cursor-not-allowed'}`}
        >
          {initialData ? 'Actualizar Presupuesto' : 'Crear Presupuesto'}
        </button>
      </div>
    </form>
  );
};

export default QuoteForm; 