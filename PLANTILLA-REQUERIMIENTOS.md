# Plantilla de requerimientos del proyecto (Clase 06)

> 📋 **Este documento es la INSCRIPCIÓN al hackathon.** Cada equipo lo copia a su repositorio (como
> `REQUERIMIENTOS.md`) y lo entrega lleno en la **Clase 06**.
> **Equipo que no entregue sus requerimientos NO participa por el premio.**

El **PM lidera** esta reunión y es el canal con el instructor (que hace de cliente) para dudas.

---

## 1. Identidad del equipo

- **Nombre del equipo:*ZupplySquad*
- **Nombre del proyecto:*Zupply*
- **Integrantes y roles:**
  | Integrante | Rol | Responsable de |
  |-----------|-----|----------------|
  | Miguel Sarmiento | ⚙️ DevOps | Repo, Git, CI/CD, despliegue |
  | Fabio Chamorro | 🎨 Frontend | Interfaz, estilos, interacción |
  | Juan Berroteran | 🔧 Backend | Servidor, API, lógica + BD |
  | Kamilo Avendaño| 🔧 Backend | Servidor, API, lógica + BD |
  | Luis Florez| 🧭 PM | Canal con el cliente, QA, entregas, desbloquear al equipo |

> **Datos** y la **feature clave** las conoce y las trabaja **todo el equipo** (son la estructura del
> proyecto, no un rol aparte).

---

## 2. Visión del proyecto

**La idea en una frase:*Zupply es una plataforma B2B que conecta restaurantes y proveedores para centralizar y automatizar pedidos, inventario, facturación y logística en una sola plataforma.* _..._

- **¿Para quién es? (usuarios):*Restaurantes - Provedores - transportadores de alimentos*

- **¿Qué problema resuelve o qué permite hacer?:*Permite conectar digitalmente a los restaurantes con sus proveedores, facilitando la consulta de productos, generación de pedidos, confirmación, despacho, entrega y seguimiento. Además, centraliza inventario, facturación y logística, reemplazando procesos manuales por un flujo automatizado y trazable.*

- **Visión (a dónde quieren llevarlo):*Convertir Zupply en una plataforma escalable para la gestión integral de restaurantes y comercios de alimentos, permitiendo manejar múltiples sucursales y expandirse posteriormente a mercados regionales, incorporando cada vez más herramientas de inteligencia artificial.*

- **Modelo:*B2B (Business to Business), porque conecta empresas: principalmente restaurantes/comercios de alimentos con sus proveedores. El documento define explícitamente a Zupply como una plataforma B2B tipo ERP.* 

- **¿Cómo generaría valor o dinero?*Zupply manejará un modelo de ingresos híbrido. Inicialmente, se cobrará una tarifa por periódica por mantenimiento y soporte. La plataforma contará con tres planes de servicio: un Plan Básico, que incluirá las funcionalidades esenciales y una versión básica de Zupply IA; un Plan Medio, que ofrecerá mayores capacidades de gestión, análisis y uso de la inteligencia artificial; y un Plan Premium, que incluirá las funcionalidades más avanzadas de Zupply IA, como predicción de inventario, análisis avanzado, generación automatizada de reportes y asistencia inteligente. De esta manera, los clientes podrán elegir el plan que mejor se adapte a sus necesidades y aumentar su nivel de servicio a medida que crezca su operación.*

---

## 3. Funcionalidades (alcance)

Marca lo que SÍ entra en el MVP (lo mínimo para la Demo Day) y lo que sería "extra si da tiempo".

| Funcionalidad                                                    | ¿MVP? | ¿Extra? | Responsable        |
| ---------------------------------------------------------------- | :---: | :-----: | ------------------ |
| Registro e inicio de sesión                                      |   ✅   |         | Backend            |
| Gestión básica del perfil del restaurante                        |   ✅   |         | Backend            |
| Gestión básica del perfil del proveedor                          |   ✅   |         | Backend            |
| Formulario de registro de productos del proveedor                |   ✅   |         | Backend            |
| Catálogo digital de productos                                    |   ✅   |         | Frontend / Backend |
| Visualización de productos, precios y disponibilidad             |   ✅   |         | Frontend           |
| Carrito / selección de productos                                 |   ✅   |         | Frontend           |
| Creación de pedidos por parte del restaurante                    |   ✅   |         | Frontend / Backend |
| Recepción de pedidos por parte del proveedor                     |   ✅   |         | Backend            |
| Confirmación de pedidos                                          |   ✅   |         | Backend            |
| Cambio de estado del pedido                                      |   ✅   |         | Backend            |
| Consulta del estado del pedido                                   |   ✅   |         | Frontend / Backend |
| Historial de pedidos                                             |   ✅   |         | Backend            |
| Gestión básica de inventario                                     |   ✅   |         | Backend            |
| Notificaciones de cambios en los pedidos                         |       |    ✅    | Backend            |
| Calificación de proveedores                                      |       |    ✅    | Frontend / Backend |
| Facturación electrónica                                          |       |    ✅    | Backend            |
| Envío automático de facturas por correo                          |       |    ✅    | Backend            |
| Gestión avanzada de inventario y alertas de stock                |       |    ✅    | Backend            |
| Visualización de rutas de entrega                                |       |    ✅    | Frontend / Backend |
| Optimización de rutas                                            |       |    ✅    | Backend            |
| Zupply IA básica                                                 |       |    ✅    | Backend / IA       |
| Consultas al asistente Zupply IA                                 |       |    ✅    | Backend / IA       |
| Predicción de inventario con IA                                  |       |    ✅    | Backend / IA       |
| Generación de reportes con IA                                    |       |    ✅    | Backend / IA       |
| Plan Básico, Medio y Premium                                     |       |    ✅    | Backend / Frontend |


> Regla: si algo no está en el MVP, **no se construye hasta terminar el MVP**. Primero lo esencial.

---

## 4. Requerimientos técnicos (cómo lo van a hacer)

Deben cubrir **los mínimos del curso**. Marquen qué usarán:

- [X] **Frontend:** HTML5/TS, React 19 (Vite + Tailwind), Node.js + Express..
- [X] **Backend:** Node.js + Express + TypeScript: 13 routers, ~37 endpoints REST (server/src/routes/).
- [X] **Base de datos:** PostgreSQL (database/zupply_schema_postgresql.sql)
- [X] **Feature clave:** Websocket 
- [X] **Tiempo real (Socket.IO):** Sí. Se utilizará para actualizar en tiempo real los estados de los pedidos entre restaurante y proveedor.
- [X] **Autenticación:** AWS
- [X] **Otra técnica / API externa:** Se contempla EmailJS para envío de notificaciones y facturas por correo. Esto coincide con las integraciones previstas en el documento de Zupply.


---

## 5. Requerimientos de despliegue

- **Frontend se desplegará en:** Vercel
- **Backend se desplegará en:** SUPABASE
- **Base de datos:** SUPABASE
- **Dominio:** Subdominio gratuito proporcionado por Vercel
- **CI/CD:** Sí. Cada push a la rama configurada ejecutará automáticamente el proceso de despliegue.
- **Link del proyecto (cuando exista):** Pendiente de despliegue.

### Costos estimados de servidores
Aunque usemos capas gratuitas para el curso, estimen qué costaría en "producción real":

| Recurso              | Proveedor / plan                | Costo estimado (mes)         |
| -------------------- | ------------------------------- | ---------------------------- |
| Hosting del frontend | Vercel – Plan Pro               | ~10 USD/mes                  |
| Hosting del backend  | Render – servicio de producción | ~15 USD/mes                  |
| Base de datos        | postgres gestionado             | ~15 USD/mes                  |
| Dominio              | Dominio propio                  | ~10–20 USD/año               |
| **Total estimado**   |                                 | **50 USD/mes + dominio**  |


---

## 6. Plan de trabajo (grueso)

| Clases                                   | Qué esperamos terminar           |
| ---------------------------------------- | -------------------------------- |
| **07–08 (Backend)**                      | Configuración del servidor Node.js + Express, estructura del proyecto y API base.  |
| **09–10 (Datos)**                        | Configuración de postgres, creación de tablas, relaciones y persistencia de usuarios, restaurantes, proveedores, productos y pedidos. |
| **11–13 (Feature / Auth / tiempo real)** | Autenticación, catálogo B2B, creación de pedidos, estados de pedido y comunicación en tiempo real con Socket.IO.                   |
| **14–15 (Integración)**                  | Integración completa Frontend + Backend + BD, pruebas, corrección de errores y despliegue.                                         |
| **16**                                   | Demo final, pruebas del flujo completo y ensayo de presentación.                                                                   |


---

## 7. Riesgos y dudas para el cliente (las lleva el PM)

- **Lo que más nos preocupa:** _..._
- **Preguntas para el instructor (cliente):** 

¿El pedido debe llegar hasta el estado de “entregado” o para el Demo Day es suficiente demostrar hasta “despachado”?
¿La IA básica debe estar funcionando en el Demo Day o podemos dejarla como funcionalidad extra?
¿Se espera que el catálogo tenga productos reales o podemos trabajar con productos de demostración?
¿Para la autenticación es suficiente manejar correo + contraseña o se requiere algún método adicional?
¿Restaurante y proveedor son suficientes para el MVP p debemos incluir también transportadores?
¿Cual es el flujo minimo que esperan ver funcionando durante el Demo Day?
¿Cuantos tipos de usuarios debemos implementar obligatoriamente en el MVP?
¿El proveedor debe poder crear, editar y eliminar productos desde la plataforma?

---

> ✅ **Entregable de la Clase 06 (inscripción):** este archivo lleno y subido al repo del equipo
> (commit del PM o del DevOps). Sin él, el equipo no participa por el premio.
