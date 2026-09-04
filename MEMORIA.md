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

## 3. Arquitectura prevista

El repositorio se organizará como un monorepo con dos aplicaciones independientes:

- `backend`: API REST por capas (configuración, modelos, controladores, rutas, middlewares y utilidades).
- `frontend`: SPA organizada por funcionalidades, componentes compartidos, contextos, servicios y vistas.

Las peticiones del frontend pasarán por un único cliente HTTP reutilizable. Los errores tendrán un formato estable en toda la API.

## 4. Modelo de datos inicial

### Usuario

Nombre, correo electrónico único, contraseña cifrada, avatar y rol.

### Evento

Título, fecha, ubicación, descripción, categoría, cartel, persona creadora y lista de asistentes referenciada por identificadores de usuario.

## 5. Experiencia y diseño

La identidad visual combinará una base editorial cálida con acentos luminosos. La interfaz explicará cada estado mediante texto y recursos visuales, sin depender solo del color. La navegación será responsive y operable con teclado.

## 6. Seguridad y calidad

- Contraseñas cifradas antes de persistirlas.
- Tokens con expiración y rutas privadas protegidas.
- Validación y normalización de entradas.
- Restricción del tipo y tamaño de archivos.
- Autorización por propiedad para modificar eventos.
- Pruebas automatizadas de los recorridos críticos.

## 7. Evolución del documento

Esta memoria se actualizará durante el desarrollo con la implementación final, decisiones, pruebas, accesibilidad, variables de entorno y proceso de despliegue.

---

# Project report · Lúmina Madrid

## Overview

Lúmina Madrid is a platform for cultural events, workshops and creative gatherings. It manages two related collections—users and events—while prioritising clear feedback throughout every user journey.

The repository will contain an Express and MongoDB REST API plus a React single-page application. Authentication, uploads, attendance management, reusable requests, consistent error handling and accessible loading states are part of the core scope.

This report is a living document. It will be expanded with final architecture, implementation decisions, tests, accessibility notes, environment variables and deployment instructions as development progresses.
