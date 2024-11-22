# Project-Service

Servicio backend para la gestión de proyectos y presupuestos en la plataforma ChapuExpress.

## Características Principales

- Gestión completa de proyectos y presupuestos
- Autenticación mediante JWT
- Validación de datos con Express Validator
- Control de acceso basado en roles
- Rate limiting para prevención de ataques
- Manejo centralizado de errores
- Logging estructurado

## Stack Tecnológico

- Node.js (Runtime)
- TypeScript (Lenguaje)
- Express (Framework)
- Prisma (ORM)
- PostgreSQL (Base de datos)
- Jest (Testing)
- JWT (Autenticación)

## Requisitos Previos

- Node.js >= 14.x
- PostgreSQL >= 13
- npm >= 7.x

## Configuración Inicial

1. **Clonar el Repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/project-service.git
   cd project-service
   ```

2. **Instalar Dependencias:**
   ```bash
   npm install
   ```

3. **Variables de Entorno:**
   ```bash
   cp .env.example .env
   ```
   Configurar las siguientes variables:
   - `DATABASE_URL`: URL de conexión a PostgreSQL
   - `JWT_SECRET`: Clave secreta para JWT
   - `PORT`: Puerto del servidor (default: 5000)
   - `NODE_ENV`: Entorno de ejecución

4. **Base de Datos:**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

## Scripts Disponibles

- `npm run dev`: Inicia el servidor en modo desarrollo con hot-reload
- `npm run build`: Compila TypeScript a JavaScript
- `npm start`: Inicia el servidor en producción
- `npm test`: Ejecuta tests unitarios
- `npm run test:coverage`: Ejecuta tests con cobertura
- `npm run lint`: Ejecuta el linter
- `npm run format`: Formatea el código

## API Endpoints

### Proyectos
- `POST /projects`: Crear proyecto
- `PUT /projects/:id`: Actualizar proyecto
- `GET /projects/:id`: Obtener proyecto
- `GET /projects`: Listar proyectos del cliente
- `POST /projects/:id/assign`: Asignar profesional

### Presupuestos
- `POST /quotes`: Crear presupuesto
- `PUT /quotes/:id`: Actualizar presupuesto
- `POST /quotes/:id/retract`: Retirar presupuesto
- `GET /quotes/project/:projectId`: Listar presupuestos por proyecto
- `GET /quotes/professional`: Listar presupuestos por profesional

## Estructura del Proyecto
