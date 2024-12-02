import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import { toast } from 'react-toastify';

interface IRecoverPasswordInputs {
  email: string;
}

const schema = yup.object({
  email: yup
    .string()
    .email('Correo inválido')
    .required('El correo es obligatorio'),
}).required();

const RecoverPasswordPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm<IRecoverPasswordInputs>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<IRecoverPasswordInputs> = async (data) => {
    try {
      await authService.recoverPassword(data.email);
      toast.success('Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.');
      reset();
    } catch (err: any) {
      toast.error('Hubo un problema al procesar tu solicitud. Por favor, intenta nuevamente más tarde.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Encabezado */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center mb-6">
          <h1 className="text-3xl font-bold text-primary">ChapuExpress</h1>
        </Link>
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          Recupera tu Contraseña
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Introduce tu correo electrónico para recibir un enlace de recuperación.
        </p>
      </div>

      {/* Formulario */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Correo Electrónico */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="off"
                className={`mt-1 block w-full rounded-md border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary`}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Botón Submit */}
            <div>
              <button
                type="submit"
                disabled={!isValid}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                  ${isValid 
                    ? 'bg-primary hover:bg-secondary' 
                    : 'bg-gray-300 cursor-not-allowed'
                  } transition-colors`}
              >
                Enviar Enlace
              </button>
            </div>
          </form>
        </div>

        {/* Enlace a Login */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-secondary">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center text-sm text-gray-500">
          <Link to="/terms" className="text-primary hover:text-secondary mx-2">
            Términos y Condiciones
          </Link>
          |
          <Link to="/privacy" className="text-primary hover:text-secondary mx-2">
            Política de Privacidad
          </Link>
          |
          <Link to="/support" className="text-primary hover:text-secondary mx-2">
            Soporte
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecoverPasswordPage;
