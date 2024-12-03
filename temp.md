#### **Infraestructura del Proyecto**
#### **Diagrama de Infraestructura**
```mermaid
flowchart TD
    subgraph AWSRegion [AWS Región]
        subgraph VPC [VPC (Virtual Private Cloud)]
            subgraph PublicSubnet [Subred Pública]
                ALB[Application Load Balancer]
            end
            subgraph PrivateSubnet [Subred Privada]
                ECSCluster[AWS ECS Cluster]
                
                subgraph ECS [Servicios en Contenedores]
                    AuthService[Servicio de Autenticación]
                    UserService[Servicio de Usuarios]
                    ProjectService[Servicio de Proyectos]
                    ChatService[Servicio de Chat]
                    NotificationService[Servicio de Notificaciones]
                    PaymentService[Servicio de Pagos]
                    RatingService[Servicio de Valoraciones]
                end
                RDS[(Amazon RDS)]
                DynamoDB[(Amazon DynamoDB)]
                SQSQueue[SQS Cola de Mensajes]
                SNSChatTopic[SNS Tópico de Notificaciones de Chat]
                SNSNotificationTopic[SNS Tópico de Notificaciones Generales]
            end
            S3[AWS S3]
        end
        CloudFront[CloudFront CDN]
        Amplify[Amplify - Despliegue Frontend]
    end
    ReactClient[Cliente React] --> CloudFront
    CloudFront --> Amplify
    ReactClient --> ALB
    ALB --> ECSCluster
    ECSCluster --> RDS
    ECSCluster --> DynamoDB
    ECSCluster --> SQSQueue
    ECSCluster --> SNSNotificationTopic
    ECSCluster --> SNSChatTopic
    ECSCluster --> S3
```
---
#### **Descripción de Componentes de la Infraestructura**
1. **Amazon VPC (Virtual Private Cloud)**: Se configura una VPC privada para alojar los recursos del proyecto. Dentro de la VPC, se definen una 
**subred pública** y una **subred privada** para separar el tráfico y aumentar la seguridad.
   - **Subred Pública**: Aloja el **Application Load Balancer (ALB)**, que distribuye el tráfico entrante hacia los microservicios en el clúster ECS.
   - **Subred Privada**: Contiene el clúster de microservicios, bases de datos y colas de mensajería, protegidos de acceso directo desde internet.

2. **Amazon ECS (Elastic Container Service)**: Este servicio gestiona el clúster de contenedores donde se ejecutan los microservicios, cada uno 
desplegado en contenedores independientes para permitir escalabilidad y despliegue continuo. AWS Fargate puede ser una opción para ejecutar los 
contenedores sin necesidad de administrar instancias de servidor directamente.

3. **Application Load Balancer (ALB)**: El ALB distribuye las solicitudes entrantes desde los clientes hacia el clúster de ECS, balanceando el tráfico 
y asegurando la alta disponibilidad. También maneja la autenticación de usuarios y asegura que cada solicitud se redirija al microservicio 
correspondiente.

4. **Amazon RDS (Relational Database Service)**: Base de datos relacional que almacena datos estructurados, como perfiles de usuario, información de 
proyectos, transacciones y valoraciones. Configurada en una instancia privada dentro de la VPC, asegura la protección de los datos.

5. **Amazon DynamoDB**: Base de datos NoSQL utilizada para almacenar datos no estructurados, como historiales de mensajes de chat y registros de 
notificaciones.

6. **Amazon S3 (Simple Storage Service)**: Almacena archivos y recursos estáticos, como imágenes y documentos adjuntos a los proyectos. También sirve 
archivos multimedia mediante **Amazon CloudFront** para una entrega rápida.

7. **Amazon SQS y SNS**:
   - **SQS (Simple Queue Service)**: Utilizada para la cola de mensajes en el servicio de chat, permite procesar mensajes de manera asíncrona y 
   desacoplar la mensajería en tiempo real del resto de la infraestructura.
   - **SNS (Simple Notification Service)**: Distribuye notificaciones de eventos a los usuarios. Incluye un tópico para notificaciones de chat y otro 
   para notificaciones generales, como nuevos proyectos o presupuestos.

8. **Amazon CloudFront**: Una CDN (Content Delivery Network) que acelera la entrega de contenido estático de la aplicación frontend. Al distribuir el 
contenido globalmente, CloudFront mejora la velocidad de carga para usuarios de distintas ubicaciones geográficas.

9. **AWS Amplify**: Permite el despliegue y gestión del frontend en React, proporcionando integración continua (CI/CD) y herramientas de autenticación 
y autorización integradas con AWS Cognito.

---

#### **Proceso de Despliegue**

El proceso de despliegue se basa en principios de integración continua y despliegue continuo (CI/CD) para garantizar que cada componente del sistema se 
actualice de manera eficiente y sin interrupciones.

#### **1. Despliegue del Frontend (React en AWS Amplify)**

1. **CI/CD con AWS Amplify**: Amplify está conectado al repositorio de código (por ejemplo, GitHub, GitLab). Cada vez que se realiza un commit en la 
rama principal o en una rama de despliegue, Amplify ejecuta automáticamente el proceso de compilación y despliegue.
2. **CloudFront**: Amplify actualiza los archivos en Amazon S3 y CloudFront distribuye estos archivos a través de su CDN para una entrega rápida a los 
usuarios.

#### **2. Despliegue de Backend (Microservicios en ECS)**

1. **Build y Test en CI/CD**: Utilizamos una herramienta como AWS CodePipeline o GitHub Actions para ejecutar el pipeline de CI/CD. Cada microservicio 
tiene su propio archivo Dockerfile y configuración de TypeScript, por lo que cada cambio en el código fuente desencadena:
   - Compilación y validación de TypeScript.
   - Pruebas unitarias y de integración.
   - Generación de la imagen Docker.
   
2. **Almacenamiento en Amazon ECR (Elastic Container Registry)**: Las imágenes Docker de cada microservicio se almacenan en ECR, el registro de 
contenedores de AWS.

3. **Despliegue en AWS ECS (Elastic Container Service)**: ECS recupera las imágenes de ECR y despliega los contenedores de microservicios en el clúster.
   - **Rolling Updates**: ECS realiza actualizaciones de forma continua (rolling updates), lo que permite desplegar nuevas versiones sin interrumpir el 
   servicio para los usuarios.
   - **Auto Scaling**: ECS permite escalar automáticamente los contenedores según la carga de trabajo. AWS Fargate se puede utilizar para gestionar el 
   escalado y simplificar la gestión de servidores.

#### **3. Bases de Datos y Almacenamiento**

- **Amazon RDS** y **DynamoDB** están configurados y desplegados de forma independiente dentro de la infraestructura en AWS. Estos servicios se 
gestionan automáticamente mediante políticas de respaldo y recuperación de datos en AWS.
- **Amazon S3** almacena los archivos estáticos y multimedia. El acceso a estos recursos se controla mediante políticas de seguridad y se distribuye 
globalmente a través de CloudFront.

#### **4. Gestión de Eventos con SQS y SNS**

- **Configuración de colas y tópicos**: Las colas de SQS y los tópicos de SNS se configuran una vez y se integran con los microservicios 
correspondientes (Chat y Notificaciones).
- **Consumo de mensajes**: Los microservicios escuchan en SQS y SNS para procesar mensajes y notificaciones de forma asíncrona, asegurando una 
experiencia de usuario en tiempo real.

---

#### **Resumen del Proceso de Despliegue**

1. **Frontend**: Amplify se encarga del despliegue continuo de la aplicación en React. Los cambios en el código se reflejan de forma automática y se 
distribuyen a través de CloudFront.
2. **Backend**: Cada microservicio se construye y despliega en contenedores Docker mediante ECS, con imágenes almacenadas en ECR y gestionadas por 
CodePipeline.
3. **Bases de Datos**: RDS y DynamoDB están configurados para ser escalables y asegurar la disponibilidad y durabilidad de los datos.
4. **Mensajería y Notificaciones**: Los mensajes y notificaciones se gestionan mediante SQS y SNS, asegurando un flujo de datos en tiempo real y 
escalable para los servicios de chat y notificaciones.

Este enfoque de infraestructura y despliegue permite una escalabilidad horizontal y un proceso de actualización continua sin interrupciones, asegurando 
una plataforma robusta y adaptable a medida que crece el volumen de usuarios y proyectos en la plataforma.

### **2.5. Seguridad**

#### 1. **Autenticación y Autorización**

   - **Autenticación con AWS Cognito**: AWS Cognito se encargará de la autenticación de los usuarios, proporcionando un flujo seguro de inicio de 
   sesión y manejo de sesiones. Utiliza JSON Web Tokens (JWT) para verificar la identidad de los usuarios en cada solicitud.
   - **Autorización basada en roles**: El sistema implementa niveles de acceso en función de los roles (clientes, profesionales, administradores). AWS 
   Cognito y las políticas de IAM (Identity and Access Management) de AWS se utilizan para restringir el acceso a recursos y operaciones específicas 
   según el rol del usuario.
   
   **Ejemplo**: Solo los usuarios con el rol "profesional" podrán enviar presupuestos, mientras que solo los "clientes" podrán crear proyectos.

#### 2. **Comunicación Segura (HTTPS)**

   - **Certificado SSL**: Todo el tráfico entre el cliente (frontend) y el backend estará encriptado mediante HTTPS, utilizando un certificado SSL/TLS. 
   Esto asegura que los datos transmitidos, incluidos datos sensibles como contraseñas y detalles personales, estén protegidos de ataques de 
   intermediarios (man-in-the-middle).
   - **AWS Certificate Manager (ACM)**: Se utiliza ACM para gestionar los certificados SSL/TLS y aplicarlos al Application Load Balancer (ALB), 
   simplificando la configuración y renovación de los certificados.

#### 3. **Protección de API con AWS API Gateway**

   - **Control de acceso y autenticación**: El API Gateway de AWS se configurará para exigir tokens JWT en cada solicitud. Solo los usuarios 
   autenticados podrán acceder a los endpoints, y los tokens se verificarán en cada solicitud.
   - **Limitación de tasas (Rate Limiting)**: Para evitar ataques de denegación de servicio (DDoS), se establece una limitación de tasas en el API 
   Gateway que restringe la cantidad de solicitudes que un usuario o dirección IP puede realizar en un período específico.
   
   **Ejemplo**: Se limita a 100 solicitudes por minuto por usuario, de modo que si un usuario o un bot excede este límite, su acceso se restringe 
   temporalmente.

#### 4. **Seguridad de Bases de Datos**

   - **Control de Acceso a Nivel de Red**: Las bases de datos (Amazon RDS y DynamoDB) se configuran dentro de una subred privada, inaccesible desde 
   internet. Solo los microservicios dentro de la VPC pueden acceder a ellas.
   - **Cifrado en Tránsito y en Reposo**:
      - **Cifrado en tránsito**: La comunicación entre los microservicios y las bases de datos está encriptada usando SSL/TLS.
      - **Cifrado en reposo**: Amazon RDS y DynamoDB almacenan datos encriptados para proteger la información de usuarios, proyectos y transacciones. 
      AWS Key Management Service (KMS) se encarga de gestionar las claves de cifrado.
   
   **Ejemplo**: La información de perfiles de usuario y datos de proyectos se almacenan en Amazon RDS, y todos los datos están encriptados en reposo 
   para evitar la exposición en caso de un acceso no autorizado.

#### 5. **Seguridad de Datos en Amazon S3**

   - **Cifrado de Archivos en Reposo**: Todos los archivos cargados en Amazon S3, como imágenes de proyectos o documentos adjuntos, están encriptados 
   utilizando AES-256.
   - **Control de Acceso a Objetos**: Las políticas de IAM y las políticas de bucket de S3 limitan el acceso a los archivos solo a los usuarios o 
   microservicios que lo necesitan. El acceso público está completamente deshabilitado para evitar la exposición accidental de datos.
   - **AWS CloudFront para Control de Acceso**: Los archivos se distribuyen a través de CloudFront, donde se pueden configurar reglas para permitir el 
   acceso solo a usuarios autenticados, utilizando cookies o tokens de sesión.

#### 6. **Protección contra Ataques de Inyección y Validación de Datos**

   - **Sanitización y Validación de Entradas**: Todos los datos enviados por el usuario se sanitizan y validan tanto en el frontend como en el backend 
   para proteger contra ataques de inyección (como SQL Injection y NoSQL Injection). Esto incluye la validación de datos de formularios en el frontend 
   (React) y la verificación exhaustiva en el backend.
   - **Librerías de Seguridad**: Se utilizan librerías como `express-validator` en Node.js para verificar que los datos cumplan con el formato esperado 
   antes de procesarlos o almacenarlos.

   **Ejemplo**: Antes de guardar un mensaje de chat en la base de datos, el sistema valida que el mensaje no contenga secuencias que puedan 
   interpretarse como comandos de inyección.

#### 7. **Gestión de Secretos y Variables de Entorno**

   - **AWS Secrets Manager y Parameter Store**: Las credenciales sensibles (como claves de acceso a bases de datos, API keys de terceros, etc.) se 
   almacenan de forma segura en AWS Secrets Manager o AWS Parameter Store. Esto evita almacenar credenciales en el código fuente.
   - **Acceso Restringido mediante IAM**: Solo los microservicios que necesitan acceder a estos secretos tienen permisos específicos de IAM, reduciendo 
   el riesgo de exposición.

#### 8. **Monitoreo y Alerta de Seguridad**

   - **AWS CloudWatch**: Utilizado para monitorizar el tráfico, los errores y las métricas de rendimiento en tiempo real de los microservicios. Los 
   logs de acceso y de errores se envían a CloudWatch, lo que permite detectar patrones sospechosos.
   - **AWS GuardDuty**: Herramienta de seguridad que analiza los logs de tráfico y eventos de AWS en busca de comportamientos anómalos y amenazas 
   potenciales, como accesos inusuales o intentos de ataque.
   - **Alertas de Seguridad**: Se configuran alertas en CloudWatch para eventos críticos (como intentos de acceso fallidos repetidos, aumento de 
   errores 500, etc.), permitiendo la respuesta rápida a posibles incidentes.

#### 9. **Políticas de Seguridad de AWS IAM**

   - **Principio de Mínimo Privilegio**: Todos los roles y políticas de IAM siguen el principio de mínimo privilegio, asegurando que cada microservicio 
   y usuario solo tenga acceso a los recursos y acciones estrictamente necesarios.
   - **Rotación de Credenciales**: Las credenciales y claves de acceso de IAM se rotan regularmente, y se revisan los permisos de IAM para mantener la 
   seguridad y minimizar el riesgo de exposición.

#### 10. **Protección de Pagos y Datos Financieros**

   - **Integración con Pasarelas de Pago**: Las transacciones de pago se gestionan a través de pasarelas de pago seguras, como Stripe o PayPal, que 
   cumplen con los estándares de seguridad PCI-DSS.
   - **Tokenización de Pagos**: Los datos sensibles de tarjetas de crédito no se almacenan en el sistema; en su lugar, se utiliza tokenización para 
   proteger los datos financieros, enviando solo tokens de pago que pueden ser procesados de manera segura por la pasarela de pago.

### **2.6. Tests**

#### **1. Pruebas Unitarias**

Las pruebas unitarias se centran en la funcionalidad de componentes individuales, tanto en el frontend como en el backend.

- **Frontend (React con TypeScript)**:
  - **Pruebas de Componentes**: Verificación de que los componentes principales (como formularios, botones y modales) renderizan correctamente y 
  responden a eventos de usuario (clics, entradas de texto).
  - **Pruebas de Servicios**: Los servicios que se comunican con la API (como `authService`, `projectService`) serán probados de manera aislada para 
  garantizar que manejan las respuestas y errores de la API correctamente.

- **Backend (Node.js con TypeScript)**:
  - **Pruebas de Controladores**: Validación de los controladores de API en cada microservicio para verificar que responden adecuadamente a diferentes 
  tipos de solicitudes (GET, POST, PUT, DELETE).
  - **Pruebas de Servicios**: Los servicios internos de cada microservicio se prueban de manera aislada para asegurar que la lógica de negocio funciona 
  correctamente.
  - **Mocks de Dependencias**: Utilización de mocks para simular las interacciones con bases de datos y otros servicios externos.

**Herramientas**: Jest para pruebas en el frontend y backend, y React Testing Library para pruebas de componentes en React.

#### **2. Pruebas de Integración**

Las pruebas de integración garantizan que los diferentes componentes dentro de cada microservicio interactúen correctamente entre sí y que los 
microservicios funcionen bien en conjunto.

- **Frontend-Backend**: Verificación de que el frontend puede interactuar con los endpoints de la API. Esto incluye probar el flujo de autenticación, 
la creación de proyectos y el envío de mensajes de chat.
- **Integración de Microservicios**: Validación de la interacción entre microservicios, como:
  - El flujo entre el `auth-service` y `user-service` para validar y gestionar usuarios autenticados.
  - La comunicación entre el `project-service` y `notification-service` para enviar notificaciones cuando se crea o actualiza un proyecto.
  - El uso de colas de mensajes en el `chat-service` con SQS y el `notification-service` con SNS para notificaciones en tiempo real.

**Herramientas**: Jest para el backend, con supertest para pruebas de endpoints de API. En el caso del frontend, se integrarán tests simulando la API.

#### **3. Pruebas de End-to-End (E2E)**

Las pruebas E2E verifican flujos completos desde el punto de vista del usuario final, cubriendo el frontend y la interacción con el backend.

- **Escenarios de Usuario**: Se simulan escenarios clave de usuario, como:
  - Registro e inicio de sesión del usuario.
  - Creación de un proyecto y recepción de presupuestos.
  - Comunicación en tiempo real mediante el chat.
  - Flujo de pagos seguros y valoración de servicios.
- **Automatización de Pruebas E2E**: Utilización de herramientas de automatización para realizar pruebas de los flujos completos de usuario, cubriendo 
desde el frontend hasta la interacción con los microservicios backend.

**Herramientas**: Cypress para pruebas de E2E, ya que permite automatizar pruebas de frontend y simular las interacciones con el backend en un entorno 
controlado.

#### **4. Pruebas de Seguridad**

Las pruebas de seguridad son esenciales para identificar posibles vulnerabilidades y asegurar que la aplicación maneje correctamente el acceso y los 
datos sensibles.

- **Pruebas de Autenticación y Autorización**: Verificación de que solo los usuarios autenticados pueden acceder a los recursos y de que los roles de 
usuario restringen el acceso a las funcionalidades adecuadas.
- **Pruebas de Inyección y Validación de Entradas**: Pruebas contra vulnerabilidades comunes, como SQL Injection y Cross-Site Scripting (XSS), 
asegurando que la validación de entradas previene estos ataques.
- **Pruebas de Control de Acceso**: Verificación de que los datos de usuario y los recursos de proyecto están protegidos y solo accesibles a los 
usuarios autorizados.

**Herramientas**: OWASP ZAP para detectar vulnerabilidades de seguridad en la aplicación y Postman para verificar manualmente los permisos y el control 
de acceso.

#### **5. Pruebas de Rendimiento**

Las pruebas de rendimiento garantizan que el sistema funcione bien bajo carga y que mantenga tiempos de respuesta adecuados.

- **Pruebas de Carga en el Backend**: Se simula una carga alta de solicitudes para evaluar el rendimiento de los microservicios, especialmente en 
operaciones críticas como la mensajería y la creación de proyectos.
- **Pruebas de Estrés para el Chat y Notificaciones**: Evaluación del rendimiento del `chat-service` y `notification-service` bajo una carga alta de 
mensajes y notificaciones, asegurando que el sistema maneje picos de tráfico sin fallos.

**Herramientas**: Locust para pruebas de carga y estrés, y AWS CloudWatch para monitorizar métricas de rendimiento en tiempo real.

---

#### **Resumen de Tests para el MVP**

- **Pruebas Unitarias**: Aseguran que cada componente funcione correctamente de forma aislada.
- **Pruebas de Integración**: Verifican la interacción entre componentes y microservicios.
- **Pruebas de End-to-End (E2E)**: Simulan el flujo completo de usuario para validar la experiencia.
- **Pruebas de Seguridad**: Identifican vulnerabilidades y verifican el control de acceso y autenticación.
- **Pruebas de Rendimiento**: Evalúan la capacidad del sistema para manejar una alta carga y garantizar la eficiencia.

---

## 3. Modelo de Datos

### **3.1. Diagrama del modelo de datos:**

```mermaid
erDiagram

%% Entidad Usuario
USER {
    UUID user_id PK "Identificador único del usuario"
    VARCHAR(255) username UNIQUE NOT NULL "Nombre de usuario"
    VARCHAR(255) email UNIQUE NOT NULL "Correo electrónico del usuario"
    VARCHAR(255) password_hash NOT NULL "Hash de la contraseña del usuario"
    ENUM role NOT NULL "Rol del usuario: cliente o profesional"
    TIMESTAMP created_at DEFAULT CURRENT_TIMESTAMP "Fecha de creación del usuario"
}

%% Entidad Perfil de Usuario
USER_PROFILE {
    UUID profile_id PK "Identificador único del perfil"
    UUID user_id FK "Identificador del usuario"
    VARCHAR(255) full_name NOT NULL "Nombre completo del usuario"
    TEXT bio "Descripción breve o biografía del usuario"
    VARCHAR(255) phone_number UNIQUE "Número de teléfono del usuario"
    VARCHAR(255) location "Ubicación del usuario"
    TIMESTAMP updated_at DEFAULT CURRENT_TIMESTAMP "Fecha de última actualización del perfil"
}

%% Entidad Proyecto
PROJECT {
    UUID project_id PK "Identificador único del proyecto"
    UUID client_id FK "Identificador del cliente que crea el proyecto"
    VARCHAR(255) title NOT NULL "Título del proyecto"
    TEXT description NOT NULL "Descripción del proyecto"
    ENUM status DEFAULT 'open' "Estado del proyecto: abierto, en progreso, completado, cerrado"
    TIMESTAMP created_at DEFAULT CURRENT_TIMESTAMP "Fecha de creación del proyecto"
    TIMESTAMP updated_at DEFAULT CURRENT_TIMESTAMP "Fecha de última actualización del proyecto"
}

%% Entidad Presupuesto
QUOTE {
    UUID quote_id PK "Identificador único del presupuesto"
    UUID project_id FK "Identificador del proyecto"
    UUID professional_id FK "Identificador del profesional que envía el presupuesto"
    DECIMAL(10, 2) amount NOT NULL "Monto del presupuesto"
    ENUM status DEFAULT 'pending' "Estado del presupuesto: pendiente, aceptado, rechazado"
    TIMESTAMP created_at DEFAULT CURRENT_TIMESTAMP "Fecha de creación del presupuesto"
    TIMESTAMP updated_at DEFAULT CURRENT_TIMESTAMP "Fecha de última actualización del presupuesto"
}

%% Entidad Mensaje de Chat
CHAT_MESSAGE {
    UUID message_id PK "Identificador único del mensaje"
    UUID project_id FK "Identificador del proyecto asociado al mensaje"
    UUID sender_id FK "Identificador del usuario que envía el mensaje"
    TEXT content NOT NULL "Contenido del mensaje de chat"
    TIMESTAMP sent_at DEFAULT CURRENT_TIMESTAMP "Fecha y hora en que se envió el mensaje"
}

%% Entidad Valoración
RATING {
    UUID rating_id PK "Identificador único de la valoración"
    UUID project_id FK "Identificador del proyecto relacionado"
    UUID reviewer_id FK "Identificador del usuario que realiza la valoración"
    UUID reviewed_id FK "Identificador del usuario que recibe la valoración"
    INTEGER rating NOT NULL CHECK (rating >= 1 AND rating <= 5) "Calificación en una escala de 1 a 5"
    TEXT comment "Comentario adicional de la valoración"
    TIMESTAMP created_at DEFAULT CURRENT_TIMESTAMP "Fecha de creación de la valoración"
}

%% Relaciones
USER ||--o{ USER_PROFILE : has
USER ||--o{ PROJECT : owns
USER ||--o{ QUOTE : submits
USER ||--o{ CHAT_MESSAGE : sends
USER ||--o{ RATING : gives
PROJECT ||--o{ QUOTE : has
PROJECT ||--o{ CHAT_MESSAGE : includes
PROJECT ||--o{ RATING : receives
```

### **3.2. Descripción de entidades principales:**

#### **1. USER**
- **Descripción**: Representa a cada usuario registrado, ya sea cliente o profesional.
- **Atributos**:
  - `user_id`: UUID, clave primaria.
  - `username`: Nombre de usuario, único y no nulo.
  - `email`: Correo electrónico, único y no nulo.
  - `password_hash`: Hash de la contraseña, no nulo.
  - `role`: Rol del usuario (`cliente` o `profesional`), no nulo.
  - `created_at`: Fecha de creación, valor predeterminado es la fecha y hora actual.
- **Relaciones**:
  - Un usuario puede tener uno o varios perfiles (`USER_PROFILE`).
  - Un usuario puede crear uno o varios proyectos (`PROJECT`).
  - Un usuario puede enviar uno o varios presupuestos (`QUOTE`).
  - Un usuario puede enviar uno o varios mensajes de chat (`CHAT_MESSAGE`).
  - Un usuario puede dar y recibir valoraciones (`RATING`).

#### **2. USER_PROFILE**
- **Descripción**: Detalles adicionales del perfil del usuario, como nombre completo y ubicación.
- **Atributos**:
  - `profile_id`: UUID, clave primaria.
  - `user_id`: UUID, clave foránea que referencia a `USER`.
  - `full_name`: Nombre completo del usuario, no nulo.
  - `bio`: Descripción breve o biografía.
  - `phone_number`: Número de teléfono, único.
  - `location`: Ubicación del usuario.
  - `updated_at`: Fecha de última actualización.
- **Relaciones**:
  - Cada perfil pertenece a un usuario (`USER`).

#### **3. PROJECT**
- **Descripción**: Representa un proyecto creado por un cliente.
- **Atributos**:
  - `project_id`: UUID, clave primaria.
  - `client_id`: UUID, clave foránea que referencia a `USER` (cliente).
  - `title`: Título del proyecto, no nulo.
  - `description`: Descripción detallada del proyecto, no nulo.
  - `status`: Estado del proyecto (abierto, en progreso, completado, cerrado).
  - `created_at` y `updated_at`: Fechas de creación y actualización.
- **Relaciones**:
  - Un proyecto puede tener múltiples presupuestos (`QUOTE`).
  - Un proyecto puede incluir múltiples mensajes de chat (`CHAT_MESSAGE`).
  - Un proyecto puede recibir múltiples valoraciones (`RATING`).

#### **4. QUOTE**
- **Descripción**: Representa un presupuesto enviado por un profesional para un proyecto.
- **Atributos**:
  - `quote_id`: UUID, clave primaria.
  - `project_id`: UUID, clave foránea que referencia a `PROJECT`.
  - `professional_id`: UUID, clave foránea que referencia a `USER` (profesional).
  - `amount`: Monto del presupuesto, no nulo.
  - `status`: Estado del presupuesto (pendiente, aceptado, rechazado).
  - `created_at` y `updated_at`: Fechas de creación y actualización.
- **Relaciones**:
  - Cada presupuesto pertenece a un proyecto (`PROJECT`).
  - Un profesional envía múltiples presupuestos (`USER`).

#### **5. CHAT_MESSAGE**
- **Descripción**: Representa un mensaje de chat entre el cliente y los profesionales interesados en un proyecto.
- **Atributos**:
  - `message_id`: UUID, clave primaria.
  - `project_id`: UUID, clave foránea que referencia a `PROJECT`.
  - `sender_id`: UUID, clave foránea que referencia a `USER`.
  - `content`: Contenido del mensaje de chat, no nulo.
  - `sent_at`: Fecha y hora en que se envió el mensaje.
- **Relaciones**:
  - Cada mensaje está asociado a un proyecto (`PROJECT`).
  - Cada mensaje es enviado por un usuario (`USER`).

#### **6. RATING**
- **Descripción**: Representa una valoración de un usuario hacia otro al completar un proyecto.
- **Atributos**:
  - `rating_id`: UUID, clave primaria.
  - `project_id`: UUID, clave foránea que referencia a `PROJECT`.
  - `reviewer_id`: UUID, clave foránea que referencia a `USER` (quien realiza la valoración).
  - `reviewed_id`: UUID, clave foránea que referencia a `USER` (quien recibe la valoración).
  - `rating`: Calificación numérica (1 a 5), con restricción de rango.
  - `comment`: Comentario adicional de la valoración.
  - `created_at`: Fecha de creación de la valoración.
- **Relaciones**:
  - Cada valoración está asociada a un proyecto (`PROJECT`).
  - Un usuario puede realizar valoraciones hacia otros usuarios (`USER`).