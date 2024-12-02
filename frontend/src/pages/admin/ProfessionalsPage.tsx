import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaEye, FaEyeSlash } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Modal from '../../components/Modal';
import SearchBar from '../../components/SearchBar';
import adminService from '../../services/adminService';
import { Professional, ProfessionalFormData, provincias } from '../../types/user';

const ProfessionalsPage: React.FC = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña

  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<ProfessionalFormData>();

  useEffect(() => {
    loadProfessionals();
  }, []);

  useEffect(() => {
    filterProfessionals();
  }, [professionals, searchTerm, statusFilter]);

  const loadProfessionals = async () => {
    try {
      const data = await adminService.getProfessionals();
      setProfessionals(data);
    } catch (error) {
      toast.error('Error al cargar los profesionales');
    }
  };

  const filterProfessionals = () => {
    let filtered = professionals;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => 
        statusFilter === 'active' ? p.isActive : !p.isActive
      );
    }

    setFilteredProfessionals(filtered);
  };

  const onSubmit = async (data: ProfessionalFormData) => {
    try {
      if (editingProfessional) {
        // Al editar, no se espera la contraseña
        const { password, ...updateData } = data;
        await adminService.updateProfessional(editingProfessional.id, updateData);
        toast.success('Profesional actualizado exitosamente');
      } else {
        await adminService.createProfessional(data);
        toast.success('Profesional creado exitosamente');
      }
      loadProfessionals();
      closeModal();
    } catch (error) {
      toast.error('Error al guardar el profesional');
    }
  };

  const toggleStatus = async (professional: Professional) => {
    try {
      await adminService.toggleProfessionalStatus(professional.id);
      loadProfessionals();
      toast.success(`Profesional ${professional.isActive ? 'desactivado' : 'activado'} exitosamente`);
    } catch (error) {
      toast.error('Error al cambiar el estado del profesional');
    }
  };

  const deleteProfessional = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este profesional?')) {
      try {
        await adminService.deleteProfessional(id);
        loadProfessionals();
        toast.success('Profesional eliminado exitosamente');
      } catch (error) {
        toast.error('Error al eliminar el profesional');
      }
    }
  };

  const openModal = (professional?: Professional) => {
    if (professional) {
      setEditingProfessional(professional);
      reset({
        email: professional.email,
        firstName: professional.firstName,
        lastName: professional.lastName,
        phoneNumber: professional.phoneNumber,
        speciality: professional.speciality,
        province: professional.province,
        locality: professional.locality
      });
    } else {
      setEditingProfessional(null);
      reset({});
    }
    setShowPassword(false); // Resetear la visibilidad de la contraseña al abrir el modal
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProfessional(null);
    reset({});
    setShowPassword(false); // Resetear la visibilidad de la contraseña al cerrar el modal
  };

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="flex-1 min-h-screen flex flex-col">
        <Navbar />

        <main className="p-6 bg-gray-100 flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Gestión de Profesionales</h1>
            <button
              onClick={() => openModal()}
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-dark transition-colors"
            >
              <FaPlus className="mr-2" />
              Añadir Profesional
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Buscar por nombre, apellido o email..."
              />
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Apellido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Especialidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provincia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Localidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProfessionals.map((professional) => (
                    <tr key={professional.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{professional.firstName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{professional.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{professional.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{professional.phoneNumber || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{professional.speciality || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{professional.province}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{professional.locality}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          professional.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {professional.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal(professional)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => toggleStatus(professional)}
                            className={`${
                              professional.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {professional.isActive ? <FaToggleOn /> : <FaToggleOff />}
                          </button>
                          <button
                            onClick={() => deleteProfessional(professional.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingProfessional ? 'Editar Profesional' : 'Añadir Profesional'}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                {...register('email', { 
                  required: 'El email es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                })}
                type="email"
                className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {!editingProfessional && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                <div className="mt-1 relative">
                  <input
                    {...register('password', { 
                      required: 'La contraseña es requerida',
                      minLength: {
                        value: 6,
                        message: 'La contraseña debe tener al menos 6 caracteres'
                      }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                {...register('firstName', { required: 'El nombre es requerido' })}
                className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Apellido</label>
              <input
                {...register('lastName', { required: 'El apellido es requerido' })}
                className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Número de Teléfono (Opcional)</label>
              <input
                type="tel"
                {...register('phoneNumber', { 
                  pattern: {
                    value: /^\+?[1-9]\d{1,14}$/,
                    message: 'Número de teléfono inválido'
                  }
                })}
                className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Especialidad (Opcional)</label>
              <input
                {...register('speciality')}
                className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Campo Provincia */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Provincia</label>
              <select
                {...register('province', { required: 'La provincia es requerida' })}
                className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="">Selecciona una provincia</option>
                {provincias.map((provincia) => (
                  <option key={provincia} value={provincia}>{provincia}</option>
                ))}
              </select>
              {errors.province && (
                <p className="mt-1 text-sm text-red-600">{errors.province.message}</p>
              )}
            </div>

            {/* Campo Localidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Localidad</label>
              <input
                {...register('locality', { required: 'La localidad es requerida' })}
                className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
              />
              {errors.locality && (
                <p className="mt-1 text-sm text-red-600">{errors.locality.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                {editingProfessional ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default ProfessionalsPage;