# Lúmina Madrid · Gestor de eventos

Aplicación full stack para descubrir, crear y gestionar encuentros culturales y creativos en Madrid. Las personas registradas pueden publicar eventos, confirmar su asistencia y conocer a la comunidad que participará en cada experiencia.

> Proyecto 10 del módulo **Backend to Frontend Web Design**.

## Funcionalidades

- Registro con inicio de sesión automático y login mediante JWT.
- Catálogo público con búsqueda, categorías y tres criterios de ordenación.
- Detalle de evento, aforo y listado de asistentes.
- Creación protegida de eventos y subida de carteles a Cloudinary.
- Confirmación o cancelación de asistencia en un solo paso.
- Perfil preparado para avatar y permisos de creadora o administradora.
- Estados de carga, error, éxito y contenido vacío accesibles.

## Objetivos

- Construir una API REST con Express y MongoDB.
- Implementar autenticación segura mediante JWT y contraseñas cifradas.
- Relacionar usuarios y eventos mediante confirmaciones de asistencia.
- Permitir la subida de avatares y carteles.
- Crear una interfaz accesible, responsive y con feedback constante.
- Mantener una arquitectura modular y reutilizable en frontend y backend.

## Tecnologías

**Frontend:** React, React Router, Vite, Vitest y CSS.  
**Backend:** Node.js, Express, Mongoose, JSON Web Token, Bcrypt, Multer, Cloudinary y CORS.  
**Base de datos:** MongoDB Atlas.  
**Despliegue:** Vercel.

## Autora

**Araceli Fradejas Muñoz**

## Instalación local

Requisitos: Node.js 20 o superior y una base de datos MongoDB.

```bash
git clone https://github.com/AraceliFradejas/RTC-PROYECTO10-FULL-STACK-JAVASCRIPT.git
cd RTC-PROYECTO10-FULL-STACK-JAVASCRIPT
npm install
npm run install:all
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
npm run dev
```

La web estará disponible en `http://localhost:5173` y la API en `http://localhost:3000`.

## Variables de entorno

| Aplicación | Variable | Uso |
| --- | --- | --- |
| Backend | `MONGODB_URI` | Conexión con MongoDB Atlas |
| Backend | `JWT_SECRET` | Firma de los tokens de sesión |
| Backend | `FRONTEND_URL` | Orígenes CORS, separados por comas |
| Backend | `CLOUDINARY_*` | Credenciales para carteles y avatares |
| Frontend | `VITE_API_URL` | URL pública de la API terminada en `/api` |

## Scripts

```bash
npm run dev      # frontend y backend en paralelo
npm test         # pruebas de ambos proyectos
npm run build    # compilación de producción del frontend
```

## API

| Método | Ruta | Acceso | Acción |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Público | Crear cuenta y obtener sesión |
| `POST` | `/api/auth/login` | Público | Iniciar sesión |
| `GET/PATCH` | `/api/auth/me` | Privado | Consultar o actualizar perfil |
| `GET` | `/api/events` | Público | Buscar, filtrar y ordenar eventos |
| `GET` | `/api/events/:id` | Público | Consultar detalle y asistentes |
| `POST` | `/api/events` | Privado | Crear evento |
| `PATCH/DELETE` | `/api/events/:id` | Creadora/admin | Editar o eliminar evento |
| `POST` | `/api/events/:id/attendance` | Privado | Alternar asistencia |

---

# Lúmina Madrid · Event manager

A full-stack application to discover, create and manage cultural and creative gatherings in Madrid. Registered users can publish events, confirm attendance and meet the community joining each experience.

> Project 10 from the **Backend to Frontend Web Design** module.

## Features

JWT authentication with automatic login after sign-up, public searchable event catalogue, detailed attendee lists, protected event creation, Cloudinary image uploads and one-step attendance management. Every asynchronous journey includes loading, success, empty and error feedback.

## Goals

- Build a REST API with Express and MongoDB.
- Implement secure authentication using JWT and hashed passwords.
- Connect users and events through attendance confirmations.
- Support avatar and event poster uploads.
- Create an accessible, responsive interface with continuous feedback.
- Keep both frontend and backend modular and reusable.

## Stack

**Frontend:** React, React Router, Vite, Vitest and CSS.  
**Backend:** Node.js, Express, Mongoose, JSON Web Token, Bcrypt, Multer, Cloudinary and CORS.  
**Database:** MongoDB Atlas.  
**Deployment:** Vercel.

## Author

**Araceli Fradejas Muñoz**

For local setup, environment variables, scripts and the complete endpoint reference, see the Spanish sections above. The architecture and product decisions are documented in [`MEMORIA.md`](./MEMORIA.md).
