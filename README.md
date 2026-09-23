# 🚀 Plan de Trabajo DevOps — Zupply (Hackathon-Xupply)

Este documento explica en detalle **qué vamos a hacer en la rama de DevOps**, por qué lo vamos a hacer y cómo esta infraestructura asegurará que el proyecto **Zupply** esté 100% operativo, estable y desplegado para la presentación de la Hackathon

---

## 🎯 ¿Cuál es el objetivo de esta rama?

El objetivo principal de esta rama es **liberar al equipo de desarrollo de los problemas de configuración, entorno y despliegue**. Nos encargaremos de que el código que cada compañero escriba en su máquina funcione exactamente igual en internet y esté disponible en un enlace público para mostrar al jurado.

---

## 📋 ¿Qué vamos a hacer exactamente? (Paso a Paso)

### 1. Estandarizar el Entorno de Desarrollo (Dockerización)
* **¿Qué vamos a hacer?** Crearemos archivos de configuración (`Dockerfile` y `docker-compose.yml`) para empaquetar el Frontend, el Backend y la Base de Datos.
* **¿Por qué?** Para evitar el típico problema de *"en mi computador sí funciona, pero en el tuyo no"*. Cualquier integrante del equipo podrá levantar todo el proyecto localmente ejecutando un solo comando (`docker-compose up`).

---

### 2. Automatizar Pruebas y Validación de Código (Integración Continua - CI)
* **¿Qué vamos a hacer?** Configuraremos **GitHub Actions** para que, cada vez que alguien envíe un Pull Request o suba cambios a la rama de desarrollo/principal, el sistema automáticamente:
  1. Compruebe que no haya errores de sintaxis o compilación.
  2. Ejecute las pruebas del sistema.
  3. Verifique que la aplicación construya (*build*) sin fallos.
* **¿Por qué?** Evita que subamos código roto a la rama principal que pueda dañar la demo antes de la presentación.

---

### 3. Configurar el Despliegue Automático en la Nube (Despliegue Continuo - CD)
* **¿Qué vamos a hacer?** Conectaremos el repositorio con plataformas cloud gratuitas/rápidas para tener URLs públicas en vivo:
  * **Frontend:** Despliegue automático en Vercel.
  * **Backend:** Despliegue automático de APIs en Render o Railway.
  * **Base de Datos:** Aprovisionamiento y migración de esquemas en Supabase / PostgreSQL en la nube.
* **¿Por qué?** Necesitamos que el proyecto esté accesible en la web a través de un enlace real para la demo y evaluación del jurado.

---

### 4. Gestión de Seguridad y Variables de Entorno
* **¿Qué vamos a hacer?** 
  * Crear un archivo `.env.example` con la estructura de credenciales necesarias.
  * Configurar los **GitHub Secrets** y las variables de entorno en los paneles de Vercel/Render para resguardar las API Keys, credenciales de base de datos y tokens de autenticación.
  * Ajustar las políticas de **CORS** para que el Frontend pueda comunicarse sin bloqueos de seguridad con el Backend.
* **¿Por qué?** No debemos exponer credenciales privadas ni claves secretas en el código público de GitHub.

---

### 5. Preparación y Aseguramiento para el "Demo Day" (Presentación)
* **¿Qué vamos a hacer?**
  * **Poblar la Base de Datos (Seeding):** Preparar scripts de datos de prueba realistas para que durante la presentación de Zupply la interfaz no se vea vacía.
  * **Monitoreo y Calentamiento de Servidores:** Configurar *healthchecks* para asegurar que los servidores en la nube no entren en suspensión justo antes de exponer el proyecto ante el jurado.
  * **Plan de Contingencia:** Tener listo un plan de respaldo local o de entorno espejo por si falla la conexión a internet durante el evento.

---

## 🛠️ Flujo de Trabajo que Sopesará el Equipo

1. **Desarrolladores:** Trabajan en sus funciones en ramas `feature/nombre-funcionalidad`.
2. **Integración:** Crean Pull Request hacia la rama de integración.
3. **DevOps (Esta rama):**
   * El pipeline automático valida el código.
   * Si todo está correcto, se fusiona a `main`.
   * La infraestructura despliega los cambios en vivo en cuestión de minutos.

---

## 📌 Resumen de Entregables de DevOps

| Entregable | Herramienta / Tecnología | Resultado Esperado |
| :--- | :--- | :--- |
| **Contenedores** | Docker & Docker Compose | Proyecto ejecutable en 1 comando local |
| **Pipeline CI/CD** | GitHub Actions | Pruebas y compilación automatizadas |
| **Hosting Frontend** | Vercel | URL pública para la interfaz de Zupply |
| **Hosting Backend** | Render | API activa en la nube |
| **Base de Datos** | Supabase (PostgreSQL) | BD remota configurada y con datos de prueba |
