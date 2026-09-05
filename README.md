# KelseTS Talks

> **Move the next inch. Change the whole game.**

KelseTS es una empresa ficticia que conecta deporte, cultura, tecnología y desarrollo profesional. **KelseTS Talks** es su plataforma de charlas motivacionales y experiencias de aprendizaje para speakers, líderes, profesionales y equipos.

Este repositorio contiene la plataforma full stack con la que KelseTS publica su agenda, gestiona asistentes y permite que nuevos organizadores creen experiencias.

## La empresa

KelseTS traslada al mundo profesional valores del deporte de equipo:

- Resiliencia cuando el marcador va en contra.
- Liderazgo que ayuda a avanzar bajo presión.
- Confianza construida entrenamiento a entrenamiento.
- Talento individual al servicio de un objetivo común.
- Acción concreta frente a la motivación pasajera.

Su narrativa toma como punto de partida el espíritu del discurso del entrenador Tony D'Amato en la película *Any Given Sunday*: el progreso se gana en distancias pequeñas y se consigue en equipo. La aplicación utiliza una identidad y mensajes propios; no reproduce el guion de la película.

## Funcionalidades

- Registro con inicio de sesión automático y login mediante JWT.
- Catálogo de talks con búsqueda, categorías y criterios de ordenación.
- Ficha completa de cada experiencia, aforo y listado de asistentes.
- Creación protegida de eventos con subida de carteles.
- Confirmación o cancelación de asistencia en un solo paso.
- Gestión de avatar y permisos de creadora o administradora.
- Estados accesibles de carga, error, éxito y contenido vacío.
- Diseño responsive alineado con la identidad visual de KelseTS.

## Tecnologías

**Frontend:** React, React Router, Vite, Vitest y CSS.  
**Backend:** Node.js, Express, Mongoose, JSON Web Token, Bcrypt, Multer, Cloudinary y CORS.  
**Base de datos:** MongoDB Atlas.  
**Despliegue:** Vercel.

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

La web estará en `http://localhost:5173` y la API en `http://localhost:3000`.

## Variables de entorno

| Aplicación | Variable | Uso |
| --- | --- | --- |
| Backend | `MONGODB_URI` | Conexión con MongoDB Atlas |
| Backend | `JWT_SECRET` | Firma de tokens de sesión |
| Backend | `FRONTEND_URL` | Orígenes CORS separados por comas |
| Backend | `CLOUDINARY_CLOUD_NAME` | Espacio Cloudinary |
| Backend | `CLOUDINARY_API_KEY` | Identificador de la API de imágenes |
| Backend | `CLOUDINARY_API_SECRET` | Secreto de la API de imágenes |
| Backend | `SEED_PASSWORD` | Contraseña de la cuenta organizadora de demostración |
| Frontend | `VITE_API_URL` | URL pública de la API terminada en `/api` |

## Scripts

```bash
npm run dev      # frontend y backend en paralelo
npm test         # pruebas de ambos proyectos
npm run build    # build de producción del frontend
npm run seed --prefix backend # cargar la agenda de demostración
```

Para cargar las ocho experiencias iniciales, configura `MONGODB_URI` y una contraseña de al menos ocho caracteres en `SEED_PASSWORD`. El proceso puede repetirse sin duplicar los eventos.

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

## Universo KelseTS

| Proyecto | Enfoque | Web |
| --- | --- | --- |
| KelseTS Lifestyle | Movimiento, cultura pop y estilo de vida | [Visitar](https://kelset-slanding.vercel.app/) |
| KelseTS Store | Tienda de zapatillas | [Visitar](https://proyecto-landing-page-2.vercel.app/) |
| KelseTS Business School | IA, innovación y liderazgo | [Visitar](https://kelse-ts-business-school-landing.vercel.app/) |
| KelseTS Talks | Charlas motivacionales y eventos | Próximamente |

## Redes sociales

[GitHub](https://github.com/AraceliFradejas) · [LinkedIn](https://www.linkedin.com/in/araceli-fradejas-munoz-transformaciondigital/) · [X](https://x.com/AraceliFradejas) · [Medium](https://medium.com/@araceli.fradejas) · [YouTube](https://www.youtube.com/@aracelifradejasmunoz2758)

## Aviso legal

KelseTS es una marca ficticia creada por Araceli Fradejas Muñoz con fines exclusivamente educativos, académicos y de portfolio. Este proyecto se inspira creativamente en la cultura pop, la música y el deporte, pero no está afiliado, patrocinado, autorizado ni respaldado por Taylor Swift, Travis Kelce, los Kansas City Chiefs, la National Football League, sus representantes ni ninguna entidad relacionada. Los eventos, productos, speakers, testimonios y servicios mostrados son ficticios.

Los recursos visuales son creaciones originales para este proyecto. Se han seleccionado escenas y equipaciones genéricas, sin emplear fotografías oficiales, escudos de equipos ni imágenes promocionales de celebridades.

## Autora

**Araceli Fradejas Muñoz**

---

# KelseTS Talks · English

> **Move the next inch. Change the whole game.**

KelseTS is a fictional company connecting sport, culture, technology and professional development. **KelseTS Talks** is its platform for motivational talks and sport-inspired learning experiences.

KelseTS translates resilience, leadership, preparation, teamwork and purposeful action into workplace experiences. Its programme **The Next Inch** is inspired by the team-first, incremental-progress spirit of coach Tony D'Amato's speech in *Any Given Sunday*, using entirely original brand language.

The repository includes a React SPA and an Express/MongoDB REST API. Users can sign up, log in, discover talks, publish events, upload artwork and manage attendance. Every asynchronous journey provides clear feedback.

Technical architecture, product decisions, accessibility and deployment are documented in [`MEMORIA.md`](./MEMORIA.md).

## KelseTS universe

[KelseTS Lifestyle](https://kelset-slanding.vercel.app/) · [KelseTS Store](https://proyecto-landing-page-2.vercel.app/) · [KelseTS Business School](https://kelse-ts-business-school-landing.vercel.app/)

## Social profiles

[GitHub](https://github.com/AraceliFradejas) · [LinkedIn](https://www.linkedin.com/in/araceli-fradejas-munoz-transformaciondigital/) · [X](https://x.com/AraceliFradejas) · [Medium](https://medium.com/@araceli.fradejas) · [YouTube](https://www.youtube.com/@aracelifradejasmunoz2758)

## Legal notice

KelseTS is a fictional brand created by Araceli Fradejas Muñoz solely for educational, academic and portfolio purposes. It is creatively inspired by pop culture, music and sport, but is not affiliated with, sponsored, authorised or endorsed by Taylor Swift, Travis Kelce, the Kansas City Chiefs, the National Football League, their representatives or any related organisation. All events, products, speakers, testimonials and services shown are fictional.

## Author

**Araceli Fradejas Muñoz**
