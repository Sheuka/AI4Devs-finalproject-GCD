> Detalla en esta sección los prompts principales utilizados durante la creación del proyecto, que justifiquen el uso de asistentes de código en todas las fases del ciclo de vida del desarrollo. Esperamos un máximo de 3 por sección, principalmente los de creación inicial o  los de corrección o adición de funcionalidades que consideres más relevantes.
Puedes añadir adicionalmente la conversación completa como link o archivo adjunto si así lo consideras


## Índice

1. [Descripción general del producto](#1-descripción-general-del-producto)
2. [Arquitectura del sistema](#2-arquitectura-del-sistema)
3. [Modelo de datos](#3-modelo-de-datos)
4. [Especificación de la API](#4-especificación-de-la-api)
5. [Historias de usuario](#5-historias-de-usuario)
6. [Tickets de trabajo](#6-tickets-de-trabajo)
7. [Pull requests](#7-pull-requests)

---

## 1. Descripción general del producto

**Prompt 1:**
Ahora vamos a pasar al apartado 1 Descripción general del proyecto y sus subpuntos. Para ello vamos hagamos un brainstorming sobre qué funcionalidades serían fundamentales, cuáles aportarían valor al proyecto y cuáles lo harían más atractivo que la competencia. Por mi parte he pensado que en éstas:
- Los clientes podrían darse de alta de forma gratuita. Y optar por un plan de pago mensual para acceder a funcionalidades avanzadas.
- Los clientes tendrían un chatbot para ayudarles a describir sus necesidades de forma intuitiva.
- El chatbot, una vez ha recopilado la información necesaria, crearía una hoja de trabajo con la descripción del proyecto.
- Los profesionales podrían darse de alta para poder ofrecer sus servicios pagando una cuota mensual.
- Los profesionales deberán acreditar su identidad, experiencia y campo profesional.
- Los profesionales podrían ofrecer presupuestos para proyectos publicados por los clientes.
- Los clientes verían los presupuestos y podrían elegir el que mejor se adapte a sus necesidades.
- Una vez elegido el presupuesto, el cliente y el profesional podrían ponerse en contacto para finalizar los detalles del proyecto.
- El cliente podría valorar al profesional una vez finalice el proyecto.
- El profesional podría valorar al cliente una vez finalice el proyecto.

Aparte de éstas, ¿consideras que habría alguna otra funcionalidad que deberíamos añadir?
-------------------------------------------------------------------------------------------
Tus ideas son muy completas y aportan mucho valor. Aquí van algunas funcionalidades adicionales que podrían hacer la plataforma más atractiva y competitiva:

Sistema de Protección de Pagos: Integrar un sistema de pago seguro en el que el cliente pueda depositar el pago al aceptar un presupuesto. El dinero se libera al profesional solo cuando el cliente confirma que el trabajo se ha completado satisfactoriamente. Esto genera confianza tanto para el cliente como para el profesional.

Sistema de Verificación y Certificación: Ofrecer un sistema de verificación adicional o de certificación de habilidades para los profesionales. Podrían acceder a sellos de calidad o insignias según su nivel de experiencia o especializaciones, aumentando su credibilidad ante los clientes.

Galería de Proyectos Realizados: Permitir a los profesionales subir fotos de proyectos anteriores para que los clientes puedan ver ejemplos de su trabajo. Esto ayuda a que los clientes puedan evaluar mejor las habilidades del profesional y tomar decisiones informadas.

Soporte de Seguimiento de Proyectos: Incluir una sección de “seguimiento de progreso” donde el profesional pueda compartir actualizaciones y fotos del avance del proyecto. Esto permite al cliente supervisar el progreso y también brinda un espacio seguro para discutir cambios o ajustes.

Sistema de Match Automático: Implementar un algoritmo de “matching” que sugiera profesionales relevantes para el proyecto del cliente, basado en la ubicación, el tipo de proyecto y las habilidades del profesional. El cliente podría así reducir el tiempo de búsqueda.

Notificaciones y Recordatorios: Enviar notificaciones automáticas tanto a clientes como a profesionales para recordarles plazos, fechas de pago, o pasos importantes en el proceso de contratación y ejecución del proyecto.

Historial de Proyectos y Contratos: Para clientes y profesionales, mantener un historial de proyectos anteriores, contratos y pagos. Esto permite llevar un registro de trabajos pasados, especialmente útil para clientes recurrentes o para referencias futuras de los profesionales.

Opciones de Seguro o Garantía: Ofrecer seguros opcionales o garantías de los trabajos para casos donde se necesiten garantías adicionales sobre el trabajo realizado. Esto puede ser atractivo para clientes que buscan mayor seguridad en el resultado final.

Integración con Plataformas de Comunicación: Permitir que los usuarios puedan comunicarse a través de la plataforma o integrar herramientas como videollamadas o mensajes para discutir detalles del proyecto.

Sistema de Referidos: Para aumentar la base de usuarios, podríamos implementar un sistema de referidos, donde tanto clientes como profesionales obtienen beneficios si recomiendan a otros usuarios y estos se registran y completan un proyecto en la plataforma.

Funcionalidades de Filtrado Avanzado: Para facilitar la búsqueda de profesionales, permitir a los clientes aplicar filtros como ubicación, rango de precios, tiempo de respuesta, valoraciones, y especializaciones. Esto ayuda a personalizar la búsqueda según sus necesidades específicas.

Consejos y Asistencia Técnica: Proporcionar un centro de ayuda con consejos, artículos y tutoriales sobre cómo definir proyectos de bricolaje y construcción, guías de precios, o pasos clave a seguir en los proyectos. Esto sería de gran ayuda para clientes con poca experiencia.

Estas funcionalidades pueden hacer que la plataforma sea más versátil y confiable para ambas partes, aportando ventajas competitivas respecto a otras plataformas similares.
**Prompt 2:**
Me gustan mucho tus ideas. Quiero aclarar que el cliente sólo verá los profesionales que hayan enviado algún presupuesto para su proyecto. No habrá una búsqueda directa de profesionales. Por lo demás, creo que estamos listos para completar los puntos del apartado 1. Comienza con el punto 1.1. Objetivo
**Prompt 3:**
Perfecto. Ahora continua con el punto 1.2. Características y funcionalidades principales. Separalas por ejemplo en categorías como:
- Funcionalidades de la plataforma
- Funcionalidades del perfil del cliente
- Funcionalidades del perfil del profesional
Por último, define las funcionalidades mínimas para crear un MVP del proyecto.
---

## 2. Arquitectura del Sistema

### **2.1. Diagrama de arquitectura:**

**Prompt 1:**
Vamos a pasar al apartado 2. Arquitectura del sistema. Empecemos con el punto 2.1. Diagrama de arquitectura. Para ello, haz un estudio de las tecnologías que podríamos usar y cómo podríamos integrarlas. Dame varias opciones y explicame los pros y contras de cada una y ten en cuenta los costes de implementación. Quiero que se base en una arquitectura de microservicios, separando el frontend del backend. No crees ningún diagrama por ahora. Sólo el estudio de las tecnologías. Se bastante detallado para que podamos elegir la mejor opción.

---

Aquí tienes un análisis detallado de tecnologías y arquitecturas para la plataforma en base a una arquitectura de microservicios, separando frontend y backend:

---

#### Opciones de Tecnologías y Arquitectura para la Plataforma

Para una arquitectura basada en microservicios, es fundamental elegir tecnologías que faciliten la escalabilidad, el despliegue independiente y la comunicación entre servicios. La separación entre frontend y backend permitirá una mayor flexibilidad en la implementación y futuras mejoras. A continuación, se presentan varias opciones detalladas para cada componente de la arquitectura.

---

#### **Opción 1: Arquitectura basada en Node.js y React con AWS**

**Frontend**: React.js  
**Backend**: Node.js con Express o NestJS  
**Bases de datos**: Amazon RDS (Relacional), DynamoDB (NoSQL)  
**Infraestructura en la nube**: Amazon Web Services (AWS) con servicios como ECS para contenedores, API Gateway, y Lambda  
**Comunicación entre microservicios**: AWS API Gateway con RESTful o gRPC

##### **Detalles**

- **Frontend (React.js)**: 
  - React es popular para interfaces interactivas y puede trabajar bien con AWS Amplify para desplegar directamente en AWS. La integración con servicios como AWS S3 (para servir archivos estáticos) y CloudFront (CDN) ayuda a mejorar el rendimiento global y reducir la latencia.
  
- **Backend (Node.js con Express o NestJS)**:
  - **Express**: Un framework minimalista y flexible para Node.js que permite crear API RESTful de manera rápida.
  - **NestJS**: Una opción más estructurada que sigue el modelo de inyección de dependencias de Angular, ideal para microservicios. Facilita la organización de servicios y mejora la escalabilidad del backend.

- **Base de datos**:
  - **Amazon RDS**: Un servicio de base de datos relacional gestionado que ofrece compatibilidad con MySQL, PostgreSQL y otras bases de datos SQL. Ideal para almacenar datos estructurados como perfiles de usuarios, valoraciones, y transacciones.
  - **DynamoDB**: Base de datos NoSQL para manejar grandes volúmenes de datos no estructurados, como el historial de conversaciones y mensajes.

- **Comunicación entre microservicios**:
  - **API Gateway**: Proporciona una capa de API para exponer microservicios, mejorando la seguridad y gestionando el tráfico.
  - **AWS Lambda**: Permite ejecutar pequeñas funciones de microservicios sin necesidad de servidores dedicados, ideal para tareas independientes.

##### **Pros y Contras**

- **Pros**:
  - **Escalabilidad**: AWS ECS y Lambda permiten escalar cada microservicio de forma independiente.
  - **Despliegue rápido**: AWS Amplify y Lambda facilitan la configuración y el despliegue continuo.
  - **Seguridad**: AWS proporciona autenticación y permisos avanzados mediante IAM.

- **Contras**:
  - **Costes**: AWS, si bien es una solución completa, puede resultar costosa a largo plazo, especialmente para tráfico y almacenamiento de datos.
  - **Complejidad en la configuración inicial**: Configurar todos los servicios puede llevar tiempo y conocimiento especializado.

---

#### **Opción 2: Arquitectura basada en .NET y Angular con Microsoft Azure**

**Frontend**: Angular  
**Backend**: ASP.NET Core con microservicios en contenedores  
**Bases de datos**: Azure SQL Database, Cosmos DB (NoSQL)  
**Infraestructura en la nube**: Microsoft Azure (AKS para Kubernetes, App Service, API Management)  
**Comunicación entre microservicios**: RESTful API con API Management y gRPC para comunicación rápida entre servicios

##### **Detalles**

- **Frontend (Angular)**: 
  - Angular, al ser un framework robusto, es ideal para aplicaciones empresariales con componentes complejos. Azure Static Web Apps permite un despliegue sencillo y conectado con funciones de backend.

- **Backend (ASP.NET Core)**:
  - ASP.NET Core es ideal para microservicios debido a su robustez y compatibilidad con gRPC. Además, ofrece soporte nativo para aplicaciones en contenedores y facilita el despliegue en Azure Kubernetes Service (AKS).

- **Base de datos**:
  - **Azure SQL Database**: Para datos relacionales, como usuarios, transacciones, y contratos.
  - **Cosmos DB**: Una base de datos NoSQL con baja latencia, ideal para datos no estructurados como mensajes y actualizaciones en tiempo real.

- **Comunicación entre microservicios**:
  - **API Management**: Gestiona las API y permite autenticar, enrutar y monitorear las solicitudes.
  - **gRPC**: Una opción eficiente para la comunicación interna entre servicios.

##### **Pros y Contras**

- **Pros**:
  - **Integración con Azure DevOps**: Facilita la automatización del CI/CD para la plataforma.
  - **Escalabilidad**: Azure Kubernetes Service permite escalar microservicios en contenedores de manera eficiente.
  - **Reducción de costes iniciales**: Azure tiene opciones de facturación flexibles, especialmente útiles en la fase de desarrollo.

- **Contras**:
  - **Curva de aprendizaje**: ASP.NET Core y Azure pueden tener una curva de aprendizaje elevada si el equipo no está familiarizado.
  - **Costes a largo plazo**: Aunque Azure ofrece planes accesibles inicialmente, los costes pueden aumentar a medida que la plataforma crece en tráfico y almacenamiento.

---

#### **Opción 3: Arquitectura basada en Spring Boot y Vue.js con Google Cloud Platform**

**Frontend**: Vue.js  
**Backend**: Spring Boot con microservicios en contenedores  
**Bases de datos**: Cloud SQL (relacional), Firestore (NoSQL)  
**Infraestructura en la nube**: Google Cloud Platform (GKE para Kubernetes, Cloud Functions, Cloud Endpoints)  
**Comunicación entre microservicios**: Cloud Endpoints con RESTful API o Pub/Sub para eventos y notificaciones

##### **Detalles**

- **Frontend (Vue.js)**: 
  - Vue es un framework ligero y fácil de integrar, ideal para aplicaciones rápidas y eficientes. Puede desplegarse mediante Cloud Storage o Firebase Hosting para una mayor rapidez de carga.

- **Backend (Spring Boot)**:
  - Spring Boot es excelente para desarrollar microservicios en Java, con integración nativa para contenedores y soporte de Google Kubernetes Engine (GKE).

- **Base de datos**:
  - **Cloud SQL**: Servicio de base de datos relacional que facilita la gestión de datos estructurados.
  - **Firestore**: Base de datos NoSQL en tiempo real que permite manejar datos como mensajes y actualizaciones en vivo.

- **Comunicación entre microservicios**:
  - **Cloud Endpoints**: Gestiona las API y controla el acceso a los servicios.
  - **Pub/Sub**: Utilizado para manejar la comunicación entre microservicios mediante eventos, ideal para notificaciones en tiempo real.

##### **Pros y Contras**

- **Pros**:
  - **Integración con herramientas de IA**: GCP ofrece acceso a servicios de machine learning que pueden ser útiles para funciones como el chatbot.
  - **Escalabilidad**: GKE permite una gestión eficaz de contenedores y se ajusta fácilmente a los picos de demanda.
  - **Costo-beneficio**: GCP es competitiva en cuanto a costes, especialmente para proyectos de crecimiento inicial.

- **Contras**:
  - **Soporte**: La documentación y soporte de GCP puede no ser tan detallada como en AWS o Azure.
  - **Curva de aprendizaje**: Spring Boot y GCP requieren experiencia para gestionar la configuración y optimización.

---

### **Comparación de Costes de Implementación**

1. **AWS**: Coste moderado-alto para escalabilidad completa y herramientas adicionales como Lambda. La facturación es por uso, pero los servicios pueden resultar costosos en fases avanzadas de escalabilidad.
  
2. **Azure**: Coste inicial accesible, ideal para pequeñas empresas que planean escalar gradualmente. Los costes a largo plazo pueden crecer significativamente para grandes volúmenes de tráfico y datos.

3. **GCP**: En general, costos competitivos y flexibles. GCP es una buena opción para un proyecto en crecimiento que busca equilibrio entre funcionalidad y costos, pero la falta de servicios específicos puede requerir integraciones adicionales.

**Prompt 2:**
Vamos optar por la opción 1. Arquitectura basada en Node.js y React con AWS. Crea el diagrama de arquitectura para este caso en formato mermaid. Para una mayor comprensión, puedes crear un diagrama principal y varios diagramas de detalle para cada microservicio. También puedes crear un diagrama de despliegue para la plataforma en general. Trata de ser lo más preciso posible.

**Prompt 3:**
Para la parte de Chat y Mensajería, creo que estaría bien usar una architectura basada en eventos con colas para los chats y topics para las notificaciones, por ejemplo, notificaciones de nuevos proyectos para los profesionales o notificaciones de nuevos presupuestos para los clientes. Podrías adaptar los diagramas para que lo incorporen?

### **2.2. Descripción de componentes principales:**

**Prompt 1:**
Sigamos con el punto 2.2. Descripción de componentes principales. Haz una descripción detallada de los componentes más importantes, incluyendo la tecnología utilizada.

**Prompt 2:**

**Prompt 3:**

### **2.3. Descripción de alto nivel del proyecto y estructura de ficheros**

**Prompt 1:**
Sigamos con el punto 2.3. Descripción de alto nivel del proyecto y estructura de ficheros. Realiza una descripción de alto nivel del proyecto HLD.

**Prompt 2:**
Vamos a utilizar Typescript para el frontend y Node.js para el backend. Modifica la estructura de ficheros para que se ajuste a esta tecnología.

**Prompt 3:**

### **2.4. Infraestructura y despliegue**

**Prompt 1:**
Sigamos con el punto 2.4. Infraestructura y despliegue. Detalla la infraestructura del proyecto, incluyendo un diagrama en el formato que creas conveniente, y explica el proceso de despliegue que se sigue.

**Prompt 2:**

**Prompt 3:**

### **2.5. Seguridad**

**Prompt 1:**
Sigamos con el punto 2.5. Seguridad. Enumera y describe las prácticas de seguridad principales que se van a implementar en el proyecto, añadiendo ejemplos si procede.

**Prompt 2:**

**Prompt 3:**

### **2.6. Tests**

**Prompt 1:**
Sigamos con el punto 2.6. Tests. Describe brevemente los tests que se van a realizar para asegurar la calidad del MVP.

**Prompt 2:**

**Prompt 3:**

---

### 3. Modelo de Datos

**Prompt 1:**
Sigamos con el punto 3.1. Diagrama del modelo de datos. Crea el diagrama del modelo de datos para el proyecto en mermaid. Recuerda incluir el máximo detalle de cada entidad, como el nombre y tipo de cada atributo, descripción breve si procede, claves primarias y foráneas, relaciones y tipo de relación, restricciones (unique, not null…), etc. Por ahora vamos a centrarnos en los modelos utilizados en el MVP.

**Prompt 2:**

**Prompt 3:**

---

### 4. Especificación de la API

**Prompt 1:**
Sigamos con el punto 4. Especificación de la API. Describe los endpoints principales (máximo 3) en formato OpenAPI para el MVP. Incluye el esquema de autenticación y autorización y los parámetros de cada endpoint. Opcionalmente puedes añadir un ejemplo de petición y de respuesta para mayor claridad.

**Prompt 2:**

**Prompt 3:**

---

### 5. Historias de Usuario

**Prompt 1:**
Sigamos con el punto 5. Historias de Usuario. Documenta 3 de las historias de usuario principales para el MVP a utilizar para el desarrollo del proyecto, teniendo en cuenta las buenas prácticas de producto al respecto. Que formatos de historias de usuario son los más adecuados para este proyecto? Explica por qué.

---
Para documentar las historias de usuario del MVP, utilizaremos el **formato estándar de historias de usuario**: 

> **Como [rol de usuario], quiero [objetivo o acción] para [beneficio o valor agregado].**

Este formato es adecuado porque se centra en las necesidades y el valor para el usuario final, lo cual es fundamental en proyectos de plataformas de conexión como esta, donde la experiencia del usuario (clientes y profesionales) es clave para el éxito. Este enfoque permite al equipo de desarrollo comprender claramente **qué desea lograr el usuario y por qué es importante**, asegurando que el producto final esté alineado con los objetivos de los usuarios.

---

### **Historias de Usuario para el MVP**

#### **Historia de Usuario 1: Registro e Inicio de Sesión de Usuario**

> **Como** usuario (cliente o profesional), **quiero** poder registrarme e iniciar sesión en la plataforma **para** acceder a mis proyectos, presupuestos y funciones de comunicación de forma segura.

- **Criterios de Aceptación**:
  - El usuario puede registrarse proporcionando un correo electrónico único, nombre de usuario y una contraseña segura.
  - El sistema valida el correo electrónico antes de activar la cuenta del usuario.
  - Una vez registrado, el usuario puede iniciar sesión con sus credenciales.
  - Si el inicio de sesión es exitoso, el sistema proporciona un token de autenticación que permite el acceso a funcionalidades restringidas.
  - Si las credenciales son incorrectas, se muestra un mensaje de error claro.
  
- **Notas Técnicas**:
  - Implementar autenticación mediante AWS Cognito con generación de tokens JWT.
  - Validar la fuerza de la contraseña al momento de la creación.

---

#### **Historia de Usuario 2: Crear Proyecto y Solicitar Presupuestos**

> **Como** cliente, **quiero** poder crear un proyecto detallando mis necesidades de bricolaje o reforma **para** recibir presupuestos de profesionales interesados.

- **Criterios de Aceptación**:
  - El cliente puede crear un proyecto completando un formulario con título y descripción del proyecto.
  - El proyecto se marca como “abierto” al crearse, lo cual permite que los profesionales interesados lo vean.
  - El cliente puede ver una lista de presupuestos enviados por los profesionales interesados en su proyecto.
  - El proyecto está disponible para actualización (solo por el cliente) hasta que se seleccione un presupuesto.
  - La creación de proyectos está restringida a usuarios autenticados con rol de cliente.

- **Notas Técnicas**:
  - Utilizar validación en el frontend para garantizar que el título y la descripción del proyecto cumplan con los requisitos mínimos de caracteres.
  - Asegurar que el estado de un proyecto se actualice adecuadamente a medida que avanza.

---

#### **Historia de Usuario 3: Enviar Presupuesto a Proyecto**

> **Como** profesional, **quiero** poder enviar un presupuesto a un proyecto de cliente **para** ofrecer mis servicios y participar en la contratación.

- **Criterios de Aceptación**:
  - El profesional autenticado puede ver una lista de proyectos abiertos y enviar un presupuesto para aquellos que le interesen.
  - Al enviar un presupuesto, el profesional proporciona el monto y un mensaje opcional con detalles.
  - El sistema envía una notificación al cliente cuando un profesional envía un presupuesto.
  - El presupuesto se guarda con el estado “pendiente” y se muestra al cliente.
  - El profesional puede modificar o retirar su presupuesto hasta que el cliente lo acepte.

- **Notas Técnicas**:
  - Implementar una limitación de tasas en el envío de presupuestos para prevenir abusos o spam.
  - Configurar una notificación mediante SNS para notificar al cliente de cada nuevo presupuesto.

---

### **Justificación del Formato y Enfoque**

El formato estándar es adecuado porque:

1. **Claridad en los Objetivos**: Al expresar la historia en términos de necesidades específicas de los usuarios, se garantiza que el equipo de desarrollo comprenda el propósito detrás de cada funcionalidad.
2. **Foco en el Valor del Usuario**: Este formato destaca el beneficio o valor que el usuario obtiene al interactuar con la plataforma, alineando las funciones directamente con las expectativas y experiencias del usuario.
3. **Criterios de Aceptación Bien Definidos**: Permite definir criterios claros que facilitan la validación de cada historia y aseguran que cada funcionalidad esté alineada con los objetivos de la plataforma.

Este enfoque permite también un **desarrollo iterativo**, ideal para el MVP, ya que facilita el ajuste de prioridades y funcionalidades según el feedback de los usuarios iniciales y la evolución de las necesidades del proyecto.

**Prompt 2:**
Vuelve a crear las historias de usuario para el MVP, pero esta vez mas detalladas y separando mejor los casos de uso.

**Prompt 3:**

---

### 6. Tickets de Trabajo

**Prompt 1:**
Sigamos con el punto 6. Tickets de Trabajo. Documenta 3 de los tickets de trabajo principales del desarrollo del MVP, uno de backend, uno de frontend, y uno de bases de datos. Da todo el detalle requerido para desarrollar la tarea de inicio a fin teniendo en cuenta las buenas prácticas al respecto.

**Prompt 2:**

**Prompt 3:**

---

### 7. Pull Requests

**Prompt 1:**

**Prompt 2:**

**Prompt 3:**
