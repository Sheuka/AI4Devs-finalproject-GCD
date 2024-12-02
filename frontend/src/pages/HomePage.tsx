import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, FaTools, FaUserCheck, FaClipboardList, 
  FaHandshake, FaStar, FaFacebookF, FaTwitter, 
  FaInstagram, FaLinkedinIn 
} from 'react-icons/fa';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Fijo */}
      <header className="fixed w-full bg-white shadow-sm z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">ChapuExpress</h1>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#como-funciona" className="text-gray-600 hover:text-primary transition-colors">
              ¿Cómo funciona?
            </a>
            <a href="#contacto" className="text-gray-600 hover:text-primary transition-colors">
              Contáctanos
            </a>
            <Link 
              to="/login"
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-colors"
            >
              Iniciar Sesión
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              ¡Simplifica tus reformas con ChapuExpress!
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Encuentra al profesional ideal para tu proyecto en solo unos pasos.
            </p>
            <Link
              to="/projects/new"
              className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-lg text-lg font-semibold hover:bg-secondary transform hover:-translate-y-1 transition-all duration-200"
            >
              Empecemos
              <FaTools className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Beneficios Section */}
      <section className="py-20 bg-white" id="beneficios">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Por qué usar ChapuExpress?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {beneficios.map((beneficio) => (
              <div key={beneficio.title} className="text-center p-6">
                <div className="text-primary text-4xl mb-4 flex justify-center">
                  <beneficio.icon />
                </div>
                <h3 className="text-xl font-semibold mb-2">{beneficio.title}</h3>
                <p className="text-gray-600">{beneficio.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo Funciona Section */}
      <section className="py-20 bg-gray-50" id="como-funciona">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Cómo funciona ChapuExpress?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pasos.map((paso, index) => (
              <div key={paso.title} className="relative">
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{paso.title}</h3>
                  <p className="text-gray-600">{paso.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ChapuExpress</h3>
              <p className="text-gray-400">
                Conectando profesionales con clientes desde 2024
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Términos y Condiciones</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Política de Privacidad</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Soporte</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <p className="text-gray-400">info@chapuexpress.com</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Síguenos</h4>
              <div className="flex space-x-4">
                {redesSociales.map((red) => (
                  <a
                    key={red.name}
                    href={red.url}
                    className="text-gray-400 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <red.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2024 ChapuExpress. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const beneficios = [
  {
    title: 'Fácil de usar',
    description: 'Describe tus necesidades sin conocimientos técnicos.',
    icon: FaSearch
  },
  {
    title: 'Transparencia',
    description: 'Compara presupuestos y elige con confianza.',
    icon: FaClipboardList
  },
  {
    title: 'Profesionales verificados',
    description: 'Encuentra expertos confiables y certificados.',
    icon: FaUserCheck
  }
];

const pasos = [
  {
    title: 'Describe tu proyecto',
    description: 'Cuéntanos qué necesitas con nuestro formulario intuitivo.'
  },
  {
    title: 'Recibe presupuestos',
    description: 'Profesionales interesados te enviarán sus propuestas.'
  },
  {
    title: 'Elige y contrata',
    description: 'Selecciona al mejor profesional según tus necesidades.'
  }
];

const redesSociales = [
  { name: 'Facebook', icon: FaFacebookF, url: '#' },
  { name: 'Twitter', icon: FaTwitter, url: '#' },
  { name: 'Instagram', icon: FaInstagram, url: '#' },
  { name: 'LinkedIn', icon: FaLinkedinIn, url: '#' }
];

export default HomePage; 