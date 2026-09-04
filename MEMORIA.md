# Memoria del proyecto · Lúmina Madrid

## 1. Introducción

Lúmina Madrid nace como una plataforma para reunir en un mismo espacio eventos culturales, talleres y encuentros creativos. El proyecto resuelve la gestión de dos colecciones relacionadas —usuarios y eventos— y prioriza una experiencia clara antes, durante y después de cada acción.

## 2. Alcance

La primera versión incluirá:

- Registro e inicio de sesión con acceso inmediato tras el alta.
- Perfil de usuario con avatar.
- Catálogo de eventos ordenable y filtrable.
- Detalle del evento y listado de asistentes.
- Creación y edición de eventos con cartel.
- Confirmación y cancelación de asistencia.
- Estados de carga, vacíos, confirmaciones y errores accesibles.

## 3. Arquitectura implementada

El repositorio se organiza como un monorepo con dos aplicaciones independientes:

- `backend`: API REST por capas (configuración, modelos, controladores, rutas, middlewares y utilidades).
- `frontend`: SPA organizada por funcionalidades, componentes compartidos, contextos, servicios y vistas.

Las peticiones del frontend pasan por `apiRequest`, un único cliente HTTP que resuelve serialización, autorización y errores. La API responde siempre con `{ success, data }` o `{ success, error }`. Los controladores asíncronos comparten un wrapper para delegar cualquier excepción al middleware central.

## 4. Modelo de datos

### Usuario

Nombre, correo electrónico único, contraseña cifrada, avatar, rol y eventos a los que asistirá.

### Evento

Título, fecha, ubicación, descripción, categoría, cartel, aforo, persona creadora y lista de asistentes referenciada por identificadores de usuario.

La acción de asistencia usa `$addToSet` y `$pull` para evitar duplicados y actualiza las dos colecciones. La eliminación de un evento limpia también las referencias de sus asistentes.

## 5. Experiencia y diseño

La identidad visual combinará una base editorial cálida con acentos luminosos. La interfaz explicará cada estado mediante texto y recursos visuales, sin depender solo del color. La navegación será responsive y operable con teclado.

## 6. Seguridad y calidad

- Contraseñas cifradas antes de persistirlas.
- Tokens con expiración y rutas privadas protegidas.
- Validación y normalización de entradas.
- Restricción del tipo y tamaño de archivos.
- Autorización por propiedad para modificar eventos.
- Pruebas automatizadas de los recorridos críticos.

Las contraseñas se cifran con un factor de coste 12 y nunca se devuelven por defecto. Los tokens caducan a los siete días. Multer limita cada imagen a 5 MB y admite únicamente JPG, PNG o WebP. La edición y eliminación comparan la propiedad del evento, salvo para el rol administrador.

## 7. Interfaz y accesibilidad

La SPA utiliza HTML semántico, enlace para saltar al contenido, etiquetas visibles, avisos con `aria-live`, mensajes asociados a cada campo y foco perceptible. Respeta `prefers-reduced-motion` y adapta navegación, tarjetas, formularios y detalles a móvil. Los procesos asíncronos bloquean el control correspondiente y explican qué está ocurriendo.

## 8. Puesta en marcha y despliegue

Cada aplicación incluye su propio `.env.example` y configuración de Vercel. En producción se deben crear dos proyectos con directorios raíz `backend` y `frontend`. Tras desplegar el backend, su URL se asigna a `VITE_API_URL`; la URL definitiva del frontend se añade a `FRONTEND_URL`.

Comprobaciones locales:

```bash
npm test
npm run build
```

## 9. Decisiones y mejoras futuras

Se eligió una única acción idempotente para alternar asistencia porque reduce pasos y evita controladores duplicados. Cloudinary permite que los archivos sobrevivan a entornos serverless. Como siguientes mejoras quedan la edición visual de eventos, recuperación de contraseña, paginación para agendas extensas y pruebas de integración conectadas a una base de datos efímera.

## 10. Evolución del documento

Esta memoria se actualizará durante el desarrollo con la implementación final, decisiones, pruebas, accesibilidad, variables de entorno y proceso de despliegue.

---

# Project report · Lúmina Madrid

## Overview

Lúmina Madrid is a platform for cultural events, workshops and creative gatherings. It manages two related collections—users and events—while prioritising clear feedback throughout every user journey.

The repository will contain an Express and MongoDB REST API plus a React single-page application. Authentication, uploads, attendance management, reusable requests, consistent error handling and accessible loading states are part of the core scope.

This report is a living document. It will be expanded with final architecture, implementation decisions, tests, accessibility notes, environment variables and deployment instructions as development progresses.
