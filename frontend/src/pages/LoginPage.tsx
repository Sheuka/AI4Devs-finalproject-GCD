import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';
import authService from '../services/authService';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';

interface ILoginInputs {
  email: string;
  password: string;
  rememberMe: boolean;
}

const schema = yup.object({
  email: yup.string().email('Correo inválido').required('El correo es obligatorio'),
  password: yup.string().required('La contraseña es obligatoria'),
  rememberMe: yup.boolean().required(),
}).required();

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<ILoginInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      rememberMe: false,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    // Verificar si hay un mensaje pasado desde el registro exitoso
    const state = location.state as { message?: string };
    if (state && state.message) {
      toast.success(state.message);
    }
  }, [location.state]);

  const onSubmit: SubmitHandler<ILoginInputs> = async (data: ILoginInputs) => {
    try {
      const response = await authService.login({
        email: data.email,
        password: data.password
      });
      setUser(response);
      toast.success('¡Inicio de sesión exitoso!');
      switch (response.role) {
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'CLIENT':
          navigate('/projects');
          break;
        case 'PROFESSIONAL':
          navigate('/professional/projects');
          break;
        default:
          navigate('/'); // Ruta predeterminada si el rol no coincide con ninguno de los anteriores
      }
    } catch (error) {
      toast.error('Correo o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center mb-6">
          <h1 className="text-3xl font-bold text-primary">ChapuExpress</h1>
        </Link>
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          Inicia sesión en tu cuenta
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  {...register('email')}
                  type="email"
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Campo Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400" />
                  ) : (
                    <FaEye className="text-gray-400" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Opciones adicionales */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  {...register('rememberMe')}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Recuérdame
                </label>
              </div>
              <div className="text-sm">
                <Link to="/recover-password" className="font-medium text-primary hover:text-secondary">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            {/* Botón submit */}
            <div>
              <button
                type="submit"
                disabled={!isValid}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                  ${!isValid && 'bg-gray-300 cursor-not-allowed'}
                `}
              >
                Iniciar sesión
              </button>
            </div>
          </form>

          {/* Separador */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O continúa con</span>
              </div>
            </div>

            {/* Botones sociales */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <FaGoogle className="text-xl" />
              </button>
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <FaFacebook className="text-xl" />
              </button>
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <FaApple className="text-xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Enlace a registro */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="font-medium text-primary hover:text-secondary">
              Regístrate ahora
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
