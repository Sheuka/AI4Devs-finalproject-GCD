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

#### Notas Adicionales

- **Envío de Correos al Cliente:**
  - Cuando un profesional crea un presupuesto (`POST /quotes`), el cliente asociado al proyecto recibirá un correo notificando la creación del presupuesto.
  - Cuando un profesional actualiza un presupuesto (`PUT /quotes/:id`), el cliente asociado recibirá un correo notificando la actualización del presupuesto.

- **Envío de Correos al Profesional:**
  - Cuando el cliente acepta un presupuesto (`PUT /projects/:id/quotes/:quoteId` con acción `accept`), el profesional recibirá un correo notificando la aceptación de su presupuesto.
  - Cuando el cliente rechaza un presupuesto (`PUT /projects/:id/quotes/:quoteId` con acción `reject`), el profesional recibirá un correo notificando el rechazo de su presupuesto.

### Proyectos para Profesionales

- `GET /api/projects/expert`: Obtener proyectos para profesionales.

  **Descripción:**
  
  - Devuelve todos los proyectos en estado `open`.
  - Devuelve los proyectos en estados `in_progress` o `completed` en los que el profesional está asignado.
  - Si el proyecto tiene un presupuesto del profesional, este se incluye en la respuesta.

  **Respuesta:**
    ```json
  [
    {
      "projectId": "uuid",
      "clientId": "uuid",
      "professionalId": "uuid",
      "title": "Título del Proyecto",
      "description": "Descripción del proyecto",
      "type": "Tipo",
      "amount": 1000,
      "budget": 1200,
      "startDate": "2023-11-30",
      "status": "open",
      "createdAt": "2023-11-21T17:23:23.000Z",
      "updatedAt": "2023-11-21T17:23:23.000Z",
      "quote": {
        "quoteId": "uuid",
        "projectId": "uuid",
        "professionalId": "uuid",
        "amount": 1100,
        "message": "Mensaje del presupuesto",
        "status": "pending",
        "createdAt": "2023-11-21T17:23:23.000Z",
        "updatedAt": "2023-11-21T17:23:23.000Z"
      }
    }
    // ... otros proyectos
  ]  ```

### Chat de Proyecto

- `GET /projects/:id/chat`: Obtener mensajes de chat asociados a un proyecto.

  **Descripción:**
  
  - Devuelve una lista de mensajes de chat relacionados con el proyecto especificado.
  - Permitido para `CLIENT`, `PROFESSIONAL` y `ADMIN`.

  **Parámetros:**
  
  - `id` (path): ID del proyecto.

  **Respuesta:**

  ```json
  [
    {
      "id": "uuid",
      "projectId": "uuid",
      "userId": "uuid",
      "content": "Mensaje de chat",
      "timestamp": "2023-11-21T17:23:23.000Z"
    }
    // ... otros mensajes
  ]
  ```

  **Errores Comunes:**
  
  - `400 Bad Request`: ID del proyecto no proporcionado o inválido.
  - `401 Unauthorized`: Usuario no autenticado.
  - `403 Forbidden`: Usuario no tiene permisos para acceder al chat del proyecto.
  - `404 Not Found`: Proyecto no encontrado.
  - `500 Internal Server Error`: Error interno del servidor.

- `POST /projects/:id/chat`: Enviar un mensaje a un proyecto.

**Descripción:**

- Permite enviar un mensaje al chat de un proyecto.
- Permitido para `CLIENT`, `PROFESSIONAL` y `ADMIN`.

**Parámetros:**

- `id` (path): ID del proyecto.

**Cuerpo de la Solicitud:**

- `content` (body): Contenido del mensaje.

**Respuesta:**

```json
{
  "id": "uuid",
  "projectId": "uuid",
  "userId": "uuid",
  "content": "Mensaje de chat",
  "timestamp": "2023-11-21T17:23:23.000Z"
}
```

**Errores Comunes:**

- `400 Bad Request`: ID del proyecto no proporcionado o inválido.
- `401 Unauthorized`: Usuario no autenticado.
- `403 Forbidden`: Usuario no tiene permisos para enviar mensajes al chat del proyecto.
- `404 Not Found`: Proyecto no encontrado.
- `500 Internal Server Error`: Error interno del servidor.

## Estructura del Proyecto
