import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import authService from '../services/authService';
import { toast } from 'react-toastify';

interface IResetPasswordInputs {
  newPassword: string;
  confirmPassword: string;
}

const schema = yup.object({
  newPassword: yup.string()
    .required('La nueva contraseña es obligatoria')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .matches(/\d/, 'La contraseña debe contener al menos un número')
    .matches(/[@$!%*?&]/, 'La contraseña debe contener al menos un carácter especial'),
  confirmPassword: yup.string()
    .required('Confirma tu contraseña')
    .oneOf([yup.ref('newPassword')], 'Las contraseñas no coinciden'),
}).required();

const ResetPasswordPage: React.FC = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extraer el token de los parámetros de la URL
  const query = new URLSearchParams(location.search);
  const token = query.get('token') || '';

  useEffect(() => {
    if (!token) {
      toast.error('Token inválido o ausente. Por favor, intenta el proceso de recuperación nuevamente.');
    }
  }, [token]);

  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm<IResetPasswordInputs>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<IResetPasswordInputs> = async (data) => {
    try {
      await authService.resetPassword(token, data.newPassword);
      toast.success('Tu contraseña ha sido actualizada con éxito. Ahora puedes iniciar sesión.');
      reset();
      // Redirigir automáticamente después de unos segundos
      navigate('/login');
    } catch (err: any) {
      toast.error('Hubo un problema al restablecer tu contraseña. Por favor, intenta nuevamente.');
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
          Establece una Nueva Contraseña
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Introduce y confirma tu nueva contraseña.
        </p>
      </div>

      {/* Formulario */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Nueva Contraseña */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                Nueva Contraseña
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('newPassword')}
                  type={showNewPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`block w-full appearance-none rounded-md border ${
                    errors.newPassword ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showNewPassword ? (
                    <FaEyeSlash className="text-gray-400" />
                  ) : (
                    <FaEye className="text-gray-400" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-2 text-sm text-red-600">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Contraseña
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`block w-full appearance-none rounded-md border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-gray-400" />
                  ) : (
                    <FaEye className="text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Botón Submit */}
            <div>
              <button
                type="submit"
                disabled={!isValid || !token}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                  ${isValid && token
                    ? 'bg-primary hover:bg-secondary'
                    : 'bg-gray-300 cursor-not-allowed'
                  } transition-colors`}
              >
                Restablecer Contraseña
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

export default ResetPasswordPage; 