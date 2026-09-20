# KelseTS Talks

Proyecto full stack del máster **Rock The Code** de [**The Power Tech School**](https://thepower.education/thepowermba/tech).

[Versión en castellano](#versión-en-castellano) · [English version](#english-version)

## Versión en castellano

> **Avanza un centímetro más. Cambia todo el partido.**

KelseTS es una empresa ficticia que conecta deporte, cultura, tecnología y desarrollo profesional. **KelseTS Talks** es su plataforma de charlas motivacionales y experiencias de aprendizaje para ponentes, líderes, profesionales y equipos.

Este repositorio contiene la plataforma full stack con la que KelseTS publica su agenda, gestiona asistentes y permite que nuevos organizadores creen experiencias.

## Contenido

- [Una historia personal](#una-historia-personal)

- [Estado actual](#estado-actual)
- [Funcionalidades](#funcionalidades)
- [Instalación local](#instalación-local)
- [Variables de entorno](#variables-de-entorno)
- [Ponentes y vídeos](#ponentes)
- [Idiomas](#idiomas)
- [API](#api)
- [Pruebas con Insomnia](#pruebas-del-backend-con-insomnia)
- [Ocupación de demostración](#ocupación-de-demostración)
- [Correos de asistencia](#correos-de-asistencia)
- [Aviso legal](#aviso-legal)

## Una historia personal

KelseTS es una marca ficticia inspirada en el universo swiftie. La idea nació cuando tuve que asistir a un curso de inteligencia artificial y no pude ir al concierto de Taylor Swift en Madrid. Convertí aquella ilusión en un universo creativo con el que seguir aprendiendo y dar una identidad propia a mis proyectos.

Lo he creado desde el cariño, la admiración y el respeto por Taylor Swift y su familia. Es un proyecto educativo, independiente y no oficial. Los personajes que aparecen en las imágenes de la web son ficticios: no son fotografías de la artista, de su familia ni de personas que hayan participado realmente en estos eventos. Los recursos visuales y audiovisuales son recreaciones generadas con IA; sus créditos se recogen en [Recursos y atribuciones](docs/RECURSOS.md).

## Estado actual

**Web pública:** [KelseTS Talks](https://kelse-ts-talks.vercel.app/). **API:** [comprobación de salud](https://kelse-ts-talks-api.vercel.app/api/health). Configuración y verificaciones en [la guía de despliegue](docs/DESPLIEGUE.md).

Frontend bilingüe ES/EN con 12 charlas (tres por ponente), carteles definitivos y una sección pedagógica de experiencias. La web utiliza imágenes estáticas y transcripciones, con enlaces opcionales a YouTube.

La conexión local con MongoDB Atlas está configurada. La agenda se carga desde `backend/src/data/events.json`, con `speakerId`, traducciones ES/EN e identificadores estables `seedKey`. Repetir la carga actualiza el contenido editorial sin duplicar charlas ni sustituir asistentes o creador.

El frontend utiliza la API real. Se han comprobado en local el registro, inicio y cierre de sesión, persistencia al recargar, rechazo de contraseña incorrecta, reserva y cancelación de asistencia. La búsqueda consulta también las traducciones ES/EN y admite palabras sin acentos. Cloudinary está conectado y se han comprobado la creación de eventos con cartel y la subida de avatar. Frontend y backend están publicados en Vercel; salud, agenda y CORS verificados en producción. Los secretos se guardan en variables privadas del backend y archivos locales ignorados por Git. El `.env` solicitado para la corrección se entrega por privado, separado del repositorio público.

La arquitectura, las decisiones de producto y las evidencias de validación se desarrollan en la [memoria del proyecto](MEMORIA.md). Los pendientes de entrega están en la [revisión del enunciado](docs/REVISION-ENTREGA.md).

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
- Catálogo de charlas con búsqueda, categorías y criterios de ordenación.
- Ficha completa de cada experiencia, aforo y listado de asistentes.
- Directorio de ponentes y biografías bilingües enlazadas desde las charlas asignadas.
- Creación y edición protegidas de eventos con subida de carteles.
- Recuperación de contraseña mediante enlaces temporales de un solo uso y Mailtrap Sandbox.
- Confirmación o cancelación de asistencia en un solo paso.
- Gestión de avatar mediante la API y permisos de creadora o administradora; no hay formulario de avatar en la web.
- Estados accesibles de carga, error, éxito y contenido vacío.
- Diseño adaptable a móvil, tableta y escritorio alineado con la identidad visual de KelseTS.
- Versiones completas de la interfaz en español e inglés con selector ES/EN y preferencia guardada.

## Accesibilidad y descubrimiento

Revisión del 19/09/2026: contraste, navegación por teclado, errores de formularios, títulos de página, metadatos para compartir y HTML prerenderizado de las páginas editoriales. El alcance, las pruebas y las limitaciones están en [la revisión de accesibilidad, SEO y GEO](docs/ACCESIBILIDAD-SEO.md). Mejoras publicadas en Vercel el 19/09/2026: 18 comprobaciones HTTP correctas y contraste del login revisado en Chrome.

## Estructura

```text
frontend/src/
  components/   # Componentes reutilizables y campos de formulario
  pages/        # Pantallas y recorridos
  context/      # Sesión, idioma y avisos
  services/     # Cliente HTTP único y consultas de eventos
  hooks/        # Carga de agenda y espera del buscador
  utils/        # Validaciones y reglas de presentación
backend/src/
  routes/       # Endpoints y protección de acceso
  controllers/  # Operaciones de usuarios, eventos y recuperación
  models/       # Esquemas Mongoose
  middlewares/  # JWT, límites de acceso, archivos y errores
  services/     # Correo y recuperación
backend/test/   # Pruebas unitarias e integraciones opcionales
```

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

Para cargar las 12 experiencias iniciales, configura `MONGODB_URI` y una contraseña de al menos ocho caracteres en `SEED_PASSWORD`. El proceso puede repetirse sin duplicar los eventos. Para validar el catálogo sin conectar con MongoDB, ejecuta `npm run seed --prefix backend -- --dry-run`. La cuenta organizadora inicial es `talks@kelsets.com`; su contraseña se configura con `SEED_PASSWORD` y no se cambia al repetir la carga.

## Ponentes

Los cuatro perfiles ficticios se definen en `frontend/src/data/speakers.js`, con biografías ES/EN. Cada ponente tiene tres charlas en 2027. MongoDB conserva la relación mediante `speakerId`, que coincide con el identificador de su perfil; la persona organizadora se guarda por separado en `creator`.

### Equipo docente e invitaciones

Alison Patrick forma parte del Comité de Dirección del grupo y es profesora titular de Innovación Empresarial en KelseTS School. Jude enseña Liderazgo e Innovación de Equipos; Anna, Inteligencia Artificial y Estrategia del Dato; y Travis, Resiliencia y Cambio Organizacional. Son cargos del universo ficticio del proyecto.

Las imágenes de presentación, transcripciones y enlaces opcionales se registran en `frontend/src/data/speakerVideos.json` y `speakerTalks.json`. Los recursos visuales y audiovisuales son recreaciones con IA de personajes ficticios; su procedencia se resume en [Recursos y atribuciones](docs/RECURSOS.md).

### Vídeos de ponentes y charlas

Cada biografía y evento con ponente asignado incluye un selector entre charla e invitación. El idioma sigue el selector ES/EN. Los originales de producción se conservan localmente; el repositorio de entrega contiene los recursos que necesita la web, sus transcripciones y las evidencias técnicas.

Para enlazar un vídeo, añade su URL HTTPS de YouTube a `youtubeUrl` en el idioma correspondiente de `speakerTalks.json` o `speakerVideos.json`. Mientras esté vacío, la imagen despliega la transcripción; con un enlace válido, abre el vídeo en otra pestaña. No hay reproducción ni conexión a YouTube antes de pulsar.

### Conoce la experiencia de nuestros alumnos

La portada incluye `LearningStories` después de las fichas originales de los ponentes, en español e inglés. Las cuatro reflexiones y los enlaces de presentación se editan en `frontend/src/data/learningStories.json`. Añadir la URL del montaje a `presentation.es.youtubeUrl` y `presentation.en.youtubeUrl` para cada idioma; mientras falte, se muestra «Próximamente» y se permite explorar los aprendizajes. Los fragmentos y sus posibles enlaces de YouTube se obtienen de `speakerTalks.json`. No hay reproducción ni conexión externa antes de pulsar. El aviso identifica expresamente la recreación pedagógica para el máster.

## Revisión visual sin backend

Para revisar la agenda y sus 12 fichas en local, crea `frontend/.env.local` con `VITE_PREVIEW_MODE=true` y ejecuta `npm run dev --prefix frontend`. La agenda de muestra permite buscar en el idioma elegido, filtrar categorías y ordenar eventos. No confirma reservas ni escribe datos. Solo se activa durante el desarrollo; la compilación de producción utiliza siempre la API. Para conectar el backend, elimina esta opción o cámbiala a `false`.

## Idiomas

El selector ES/EN cambia el idioma sin recargar la página ni borrar los formularios. Español es el idioma inicial; la selección se guarda en el navegador cuando su almacenamiento está disponible. También se actualizan el atributo `lang`, la descripción de la página, las fechas, los textos accesibles y los avisos.

Los textos están centralizados en `frontend/src/i18n/messages.json`. Las 12 experiencias editoriales tienen versiones en `frontend/src/i18n/events.json` y el catálogo inicial del backend conserva esas mismas traducciones. Los nombres propios se conservan. El contenido nuevo escrito por organizadores se muestra en su idioma original, salvo que el registro aporte `translations.es` o `translations.en`; la agenda inicial ya persiste esas traducciones en MongoDB; su edición desde formularios queda pendiente.

## Sesión y límites de acceso

El JWT se conserva en `localStorage` para recuperar la sesión al recargar. Un rechazo 401 autenticado limpia la sesión y muestra el acceso de nuevo; un error de red no borra el token. Este almacenamiento es accesible a JavaScript y requiere prevenir XSS. Una evolución posible es usar cookies `HttpOnly` junto con la configuración de CORS y protección CSRF correspondiente.

Login y registro tienen límites persistentes por correo (10 y 5 intentos respectivamente por cada ventana de 15 minutos). No sustituyen límites globales de infraestructura. `JWT_SECRET` debe tener al menos 32 caracteres. El borrado de eventos y la gestión de avatar están disponibles mediante la API; no tienen botones de gestión en la web.

## API

| Método | Ruta | Acceso | Acción |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Público | Crear cuenta y obtener sesión |
| `POST` | `/api/auth/login` | Público | Iniciar sesión |
| `POST` | `/api/auth/forgot-password` | Público | Solicitar enlace de recuperación |
| `POST` | `/api/auth/reset-password` | Enlace válido | Cambiar contraseña e invalidar sesiones anteriores |
| `GET/PATCH` | `/api/auth/me` | Privado | Consultar o actualizar perfil |
| `GET` | `/api/events` | Público | Buscar, filtrar y ordenar eventos |
| `GET` | `/api/events/:id` | Público | Consultar detalle y asistentes |
| `POST` | `/api/events` | Privado | Crear evento |
| `PATCH/DELETE` | `/api/events/:id` | Creadora/admin | Editar o eliminar evento |
| `POST` | `/api/events/:id/attendance` | Privado | Alternar asistencia |

## Pruebas del backend con Insomnia

Revisión de 28 capturas reales en local (12–13 de septiembre de 2026): **28 casos con resultado esperado**. La prueba 27 se repitió con una imagen real y devuelve 200 con la URL del avatar en Cloudinary. Su aserción se ha reforzado para exigir esa URL. Los errores de los casos negativos son respuestas esperadas.

- [Colección importable e instrucciones](docs/insomnia/README.md).
- [Anexo: objetivo, petición, resultado e interpretación de cada prueba](docs/insomnia/VALIDACION-DETALLADA.md).
- [Capturas de Insomnia](docs/screenshots/Insomnia).
- [Guía para completar evidencias de MongoDB, Cloudinary, correo y despliegue](docs/GUIA-CAPTURAS.md).

Creación autenticada: 201 y evento temporal con aforo 1.

![Prueba 12: Creación autenticada: 201 y evento temporal con aforo 1.](docs/screenshots/Insomnia/Insomnia-12%20%C2%B7%20Crear%20evento%20de%20prueba%C2%BB.png)

Permisos: el segundo usuario recibe 403 al editar un evento ajeno.

![Prueba 16: Permisos: el segundo usuario recibe 403 al editar un evento ajeno.](docs/screenshots/Insomnia/Insomnia-16%20%C2%B7%20Edici%C3%B3n%20ajena%20denegada.png)

Reserva: un asistente y correo aceptado en Mailtrap Sandbox.

![Prueba 18: Reserva: un asistente y correo aceptado en Mailtrap Sandbox.](docs/screenshots/Insomnia/insomnia-18-reserva.png)

Aforo completo: 409 al intentar ocupar una segunda plaza.

![Prueba 19: Aforo completo: 409 al intentar ocupar una segunda plaza.](docs/screenshots/Insomnia/insomnia-19-aforo-completo.png)

Subida multipart de avatar: 200 y URL de Cloudinary.

![Prueba 27: avatar subido a Cloudinary](docs/screenshots/Insomnia/insomnia-27-avatar.png)

El Sandbox no entrega mensajes a destinatarios reales. Las pruebas manuales sobre la web publicada y sus límites están documentados en las [evidencias finales de producción](docs/screenshots/entrega-2026-09-19/README.md).

## Ocupación de demostración

Las 12 charlas editoriales admiten una precarga de asistentes ficticios identificada en la interfaz ES/EN. Los avisos muestran las plazas disponibles según el aforo y las reservas actuales: últimas plazas, reserva abierta o plazas disponibles. Los eventos del primer trimestre de 2027 empiezan con pocas plazas; los posteriores tienen más disponibilidad.

```bash
npm run seed:attendance --prefix backend -- --dry-run # revisar distribución sin escribir
npm run seed:attendance --prefix backend             # tras cargar la agenda y configurar MongoDB
```

La carga es repetible, conserva reservas existentes, mantiene las referencias usuario–evento en una transacción y no envía correos. No se ejecuta automáticamente al desplegar. La [memoria documenta el modelo y las evidencias de MongoDB](MEMORIA.md#7-datos-y-normalización).

### Evidencias de las relaciones en MongoDB Atlas

La base de datos conserva referencias en ambos sentidos: `events.attendees` contiene IDs de usuarios y `users.attendingEvents` contiene IDs de eventos. Las capturas del mismo evento y de Lucía Vega, un perfil ficticio, permiten contrastar los identificadores. El evento tiene 173 asistentes de un aforo de 180; quedan 7 plazas.

![Evento leadership con referencias de asistentes](docs/screenshots/MongoDB/MongoDBAtlas-4%20asistentes.png)

![Usuario ficticio con referencias de sus eventos y hash oculto](docs/screenshots/MongoDB/MongoDBAtlas-7%20usuario%20detalles.png)

La agregación calcula la ocupación desde los arrays de asistentes. La captura muestra una vista previa parcial; la memoria incluye los resultados completos de las 12 charlas verificados mediante el script.

![Agregación de ocupación en Atlas](docs/screenshots/MongoDB/MongoDBAtlas-9%20ocupacion.png)

## Evidencia del cartel alojado en Cloudinary

Cartel de la charla creada desde la web, alojado en `kelsets-talks/events`: JPG, 1122 × 1402 píxeles y 142.49 KB. Cloudinary muestra creación mediante API y acceso público.

![Cartel y propiedades del recurso en Cloudinary](docs/screenshots/Cloudinary/Cloudinary%20-1cartel%20charla.png)

## Recuperación de contraseña

El login permite solicitar un enlace de recuperación en ES/EN. Caduca en 30 minutos, es de un solo uso y cambiar la contraseña invalida las sesiones anteriores. Esta entrega captura los mensajes en Mailtrap Sandbox. Endpoints: `POST /api/auth/forgot-password` y `POST /api/auth/reset-password`. Véase la [guía de funcionamiento, pruebas y activación de correo real](docs/RECUPERACION-CONTRASENA.md).

## Correos de asistencia

La API prepara un correo HTML y una alternativa de texto al confirmar o cancelar asistencia. Usa el idioma enviado por el frontend (ES/EN), el título traducido, el cartel y la fecha en Europe/Madrid. El botón abre la ficha; cancelar requiere iniciar sesión y pulsar el botón de asistencia. Abrir un enlace nunca modifica una reserva.

Generar cuatro vistas locales sin enviar mensajes:

```bash
npm run email:preview --prefix backend
```

Los archivos se guardan en `backend/.email-previews/` (ignorado por Git). Sus enlaces son de muestra.

El envío está desactivado por defecto. Para activarlo, configurar SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASSWORD, MAIL_FROM y PUBLIC_APP_URL en backend/.env. Utilizar un remitente autorizado por el proveedor y una URL pública de la web para que los enlaces y carteles funcionen fuera del ordenador. Activar `MAIL_ENABLED=true` solo después. Configuración SMTP mediante [Nodemailer](https://nodemailer.com/smtp).

La respuesta de asistencia incluye `email.status`: `disabled`, `unconfigured`, `sent` o `failed`. `sent` indica aceptación del servidor SMTP, no recepción garantizada. Los errores de correo no revierten una reserva y no se reintentan automáticamente; la entrega real a destinatarios externos sigue pendiente. La conexión local a Mailtrap Sandbox ya se ha verificado: confirmación ES y cancelación EN aceptadas y visualización confirmada. Ver [configuración, evidencia y capturas del correo](docs/CORREO.md).

### Correo de confirmación en Mailtrap Sandbox

El logo y el cartel editorial viajan incluidos en el mensaje. Confirmación ES revisada en escritorio y en la vista móvil de Mailtrap; no implica entrega a Gmail ni validación en todos los clientes de correo.

![Confirmación ES con logo, cartel y botón de gestión](docs/screenshots/Mailtrap/Mailtrap%20-2%20email%20confirmacion%20sandbox.png)

[Vista móvil de la confirmación](docs/screenshots/Mailtrap/Mailtrap%20-3%20email%20confirmacion%20responsive%20sandbox.png).

[Cancelación EN en Mailtrap, vista de tableta](docs/screenshots/Mailtrap/Mailtrap%20-4%20email%20responsive%20english%20version%20sandbox.png). Se ven el aviso de cancelación, el logo y el cartel; la captura muestra la parte superior del mensaje.

## Universo KelseTS

| Proyecto | Enfoque | Web |
| --- | --- | --- |
| KelseTS Lifestyle | Movimiento, cultura pop y estilo de vida | [Visitar](https://kelset-slanding.vercel.app/) |
| KelseTS Store | Tienda de zapatillas | [Visitar](https://proyecto-landing-page-2.vercel.app/) |
| KelseTS Business School | IA, innovación y liderazgo | [Visitar](https://kelse-ts-business-school-landing.vercel.app/) |
| KelseTS Talks | Charlas motivacionales y eventos | [Visitar](https://kelse-ts-talks.vercel.app/) |

## Redes sociales

[GitHub](https://github.com/AraceliFradejas) · [LinkedIn](https://www.linkedin.com/in/araceli-fradejas-munoz-transformaciondigital/) · [X](https://x.com/AraceliFradejas) · [Medium](https://medium.com/@araceli.fradejas) · [YouTube](https://www.youtube.com/@aracelifradejasmunoz2758)

## Aviso legal

KelseTS es una marca ficticia creada por Araceli Fradejas Muñoz con fines exclusivamente educativos, académicos y de portfolio. Este proyecto se inspira creativamente en la cultura pop, la música y el deporte, pero no está afiliado, patrocinado, autorizado ni respaldado por Taylor Swift, Travis Kelce, los Kansas City Chiefs, la National Football League, sus representantes ni ninguna entidad relacionada. Los eventos, productos, ponentes, testimonios y servicios mostrados son ficticios.

Los recursos visuales son creaciones originales para este proyecto. Se han seleccionado escenas y equipaciones genéricas, sin emplear fotografías oficiales, escudos de equipos ni imágenes promocionales de celebridades.

## Autora

**Araceli Fradejas Muñoz**

Proyecto académico del máster Rock The Code de [The Power Tech School](https://thepower.education/thepowermba/tech).

---

## English version

[Volver a la versión en castellano](#versión-en-castellano)

> **Move one more inch. Change the whole game.**

**KelseTS Talks** is a full-stack event and attendee management application developed for the **Rock The Code** master's programme at [**The Power Tech School**](https://thepower.education/thepowermba/tech). KelseTS is a fictional brand connecting sport, culture, technology and professional development.

### Contents

- [A personal story](#a-personal-story)
- [Current status](#current-status)
- [Features and technologies](#features-and-technologies)
- [Local setup](#local-setup)
- [Environment variables](#environment-variables)
- [Scripts and demonstration data](#scripts-and-demonstration-data)
- [Speakers, media and languages](#speakers-media-and-languages)
- [API endpoints](#api-endpoints)
- [Password recovery and email](#password-recovery-and-email)
- [Validation and evidence](#validation-and-evidence)
- [Academic notice and author](#academic-notice-and-author)

### A personal story

KelseTS is a fictional brand inspired by the swiftie universe. The idea came about when I had to attend an artificial intelligence course and could not go to Taylor Swift's concert in Madrid. I turned that excitement into a creative universe where I could keep learning and give my projects their own identity.

I created it with affection, admiration and respect for Taylor Swift and her family. This is an independent, unofficial educational project. The characters shown in the website's images are fictional: they are not photographs of the artist, her family or people who actually attended these events. The visual and audiovisual resources are AI-generated recreations; their credits are documented in [Resources and attribution](docs/RECURSOS.md) (in Spanish).

### Current status

**Live website:** [KelseTS Talks](https://kelse-ts-talks.vercel.app/). **API:** [health check](https://kelse-ts-talks-api.vercel.app/api/health). Both applications are deployed on Vercel from this monorepo: [frontend](frontend) and [backend](backend).

The initial catalogue contains 12 fictional talks, three per speaker, with Spanish and English content. Users can create additional events. The website uses the live API and MongoDB Atlas; uploaded posters are stored in Cloudinary. Static images and transcripts are available, with optional YouTube links.

Production checks include password recovery and subsequent login, booking and cancellation, Sandbox email, event creation with a poster, editing the description and time, and poster persistence after saving and reloading. Automated checks and manual evidence are distinguished in the [project report](MEMORIA.md), [requirements review](docs/COMPROBACION-ENUNCIADO.md) and [deployment guide](docs/DESPLIEGUE.md), all in Spanish.

KelseTS brings teamwork, resilience, trust and leadership into a fictional professional setting. Its narrative also draws on the teamwork theme of Tony D'Amato's speech in *Any Given Sunday*, using original messages rather than reproducing the film's script.

### Features and technologies

- Registration with automatic login, JWT authentication and password recovery.
- Event search, categories, sorting, detail pages, capacity and attendee lists.
- Bilingual speaker profiles linked to their talks.
- Protected event creation and editing with poster uploads.
- Booking and cancellation, with references in both user and event collections.
- Creator/admin permissions and avatar management through the API; the website does not include an avatar form.
- Responsive layouts and loading, error, success and empty states.
- Spanish/English interface with a saved language preference.

**Frontend:** React, React Router, Vite, Vitest and CSS.

**Backend:** Node.js, Express, Mongoose, JSON Web Token, Bcrypt, Multer, Cloudinary, CORS and Nodemailer.

**Database:** MongoDB Atlas. **Deployment:** Vercel.

The accessibility, SEO and GEO review covers contrast, keyboard navigation, form errors, page titles, sharing metadata and prerendered editorial pages. Its [scope and limitations](docs/ACCESIBILIDAD-SEO.md) are documented; it is not a comprehensive accessibility certification.

### Local setup

Requirements: Node.js 20 or later and a MongoDB database. Cloudinary is required for uploads.

```bash
git clone https://github.com/AraceliFradejas/RTC-PROYECTO10-FULL-STACK-JAVASCRIPT.git
cd RTC-PROYECTO10-FULL-STACK-JAVASCRIPT
npm install
npm run install:all
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Fill in the environment files before starting:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173` and the API at `http://localhost:3000/api`.

### Environment variables

| Application | Variable | Purpose |
| --- | --- | --- |
| Backend | `MONGODB_URI` | MongoDB connection |
| Backend | `JWT_SECRET` | Session token signing secret |
| Backend | `FRONTEND_URL` | Comma-separated CORS origins |
| Backend | `CLOUDINARY_CLOUD_NAME` | Cloudinary account |
| Backend | `CLOUDINARY_API_KEY` | Image API identifier |
| Backend | `CLOUDINARY_API_SECRET` | Image API secret |
| Backend | `SEED_PASSWORD` | Initial demonstration organiser password |
| Frontend | `VITE_API_URL` | Public API URL ending in `/api` |

Email additionally uses `MAIL_ENABLED`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM` and `PUBLIC_APP_URL`. See the example files in [backend](backend/.env.example) and [frontend](frontend/.env.example).

Real secrets belong in private backend environment variables or ignored local files. Any environment file required for assessment is supplied separately through the school's private channel.

### Scripts and demonstration data

```bash
npm run dev                                   # frontend and backend
npm test                                      # tests in both projects
npm run build                                 # production frontend build
npm run check:build --prefix frontend          # generated HTML checks
npm run seed --prefix backend -- --dry-run     # validate the initial catalogue
npm run seed --prefix backend                 # load the initial catalogue
npm run seed:attendance --prefix backend -- --dry-run
npm run seed:attendance --prefix backend
```

Configure `MONGODB_URI` and a `SEED_PASSWORD` of at least eight characters before loading the catalogue. The initial organiser is `talks@kelsets.com`; rerunning the seed does not change its password. Stable `seedKey` identifiers allow catalogue updates without duplicate events or replacement of existing attendees or creators.

The optional attendance seed runs after the catalogue seed. It adds fictional attendees, preserves existing bookings and maintains both sides of the user/event relationship in a MongoDB transaction. It sends no email and never runs automatically during deployment. Demonstration attendance is labelled in both languages.

For a local visual preview without the backend, set `VITE_PREVIEW_MODE=true` in `frontend/.env.local` and run `npm run dev --prefix frontend`. This mode supports browsing, filtering and sorting the sample catalogue, but cannot save bookings. It is development-only; production builds use the API.

### Speakers, media and languages

Four fictional profiles are defined in `frontend/src/data/speakers.js`. Each has three editorial talks in 2027. An event's `speakerId` identifies its speaker independently of its `creator`.

Alison Patrick teaches Business Innovation, Jude Becks teaches Leadership and Team Innovation, Anna Nasser teaches Artificial Intelligence and Data Strategy, and Travis Wood teaches Resilience and Organisational Change. These are fictional roles.

Presentation images, transcripts and optional links are configured in `frontend/src/data/speakerVideos.json` and `speakerTalks.json`. Add an HTTPS YouTube URL to the relevant language's `youtubeUrl` field to open that video in a new tab. Without a URL, the image opens the transcript. No YouTube connection or playback starts before a click. Production originals are kept locally; the repository contains the assets needed by the application.

The homepage's educational reflections use `frontend/src/data/learningStories.json`. Its `presentation.es.youtubeUrl` and `presentation.en.youtubeUrl` fields support a future presentation; while absent, the section displays “Coming soon”. These stories are educational recreations, not real attendee testimonials.

The ES/EN selector preserves forms, updates the document language, metadata, dates and accessible labels, and stores the preference when browser storage is available. Spanish is the default. Interface text is in `frontend/src/i18n/messages.json`; editorial event translations are in `frontend/src/i18n/events.json` and the backend seed. User-written content remains in its original language unless the record contains translations. Editing translations through the form is not implemented.

### Session and access limits

The JWT is stored in `localStorage` to restore the session after a reload. An authenticated 401 response clears that session and returns to sign-in; network errors do not delete the token. JavaScript can access this storage, so XSS prevention is necessary. A future alternative is an `HttpOnly` cookie with suitable CORS and CSRF protection.

Login and registration use persistent per-email limits of 10 and 5 attempts respectively per 15-minute window. These are not global infrastructure limits. `JWT_SECRET` must contain at least 32 characters. Event deletion and avatar management are API features without management buttons in the website.

Editing an editorial title or description replaces that field's existing translations with the newly entered text; untouched fields retain their translations. No automatic translation is performed. Past events can be edited without changing their date, but cannot accept new bookings; existing bookings can still be cancelled.

### API endpoints

| Method | Route | Access | Action |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Register and obtain a session |
| `POST` | `/api/auth/login` | Public | Sign in |
| `POST` | `/api/auth/forgot-password` | Public | Request a recovery link |
| `POST` | `/api/auth/reset-password` | Valid recovery link | Reset password and revoke previous sessions |
| `GET/PATCH` | `/api/auth/me` | Authenticated | Read or update profile |
| `GET` | `/api/events` | Public | Search, filter and sort events |
| `GET` | `/api/events/:id` | Public | Read event details and attendees |
| `POST` | `/api/events` | Authenticated | Create an event |
| `PATCH/DELETE` | `/api/events/:id` | Creator/admin | Edit or delete an event |
| `POST` | `/api/events/:id/attendance` | Authenticated | Toggle attendance |

The shared frontend `apiRequest` function handles requests and errors. The API returns `{ success, data }` or `{ success, error }`. Attendance references connect `Event.attendees` with `User.attendingEvents` in a transaction.

### Password recovery and email

Recovery links expire after 30 minutes, can be used once and revoke previous sessions when the password changes. This deployment captures messages in **Mailtrap Sandbox**, which does not deliver them to personal inboxes. The [recovery guide](docs/RECUPERACION-CONTRASENA.md) documents the implementation, tests and steps required to enable real email delivery.

Booking and cancellation messages include HTML and plain text, translated event information, a poster and the date in Europe/Madrid. Opening an email link never changes a booking: cancellation requires signing in and using the attendance button.

```bash
npm run email:preview --prefix backend
```

This creates four local previews in the ignored `backend/.email-previews/` directory without sending messages. Sending is disabled by default. Configure SMTP and a permitted sender before setting `MAIL_ENABLED=true`.

Attendance responses expose `email.status`: `disabled`, `unconfigured`, `sent` or `failed`. `sent` means SMTP acceptance, not guaranteed delivery. Email errors do not undo bookings and are not retried automatically. See [email configuration and evidence](docs/CORREO.md).

### Validation and evidence

Authentication and event pages compose smaller UI components and dedicated hooks. A shared asynchronous resource hook handles loading, cancellation and retries. Styles are split into base, component, theme and accessibility files, preserving their cascade. The existing logo is optimized for both the website and email.

The documented baseline contains **92 passing ordinary tests**: 28 backend and 64 frontend. The two Atlas integration tests are skipped by the ordinary test command and were run separately against temporary databases. Production builds and checks of 14 generated HTML documents passed. After the footer update, the 33 language tests and the build checks also passed.

The local Insomnia review covers 28 expected outcomes, including authentication, permissions, event operations, capacity limits and real Cloudinary uploads. Negative cases intentionally return errors. These local checks are separate from manual production checks.

- [Insomnia collection and instructions](docs/insomnia/README.md).
- [Detailed academic report and test interpretations](MEMORIA.md).
- [Insomnia screenshots](docs/screenshots/Insomnia).
- [MongoDB relationships and occupancy screenshots](docs/screenshots/MongoDB).
- [Cloudinary poster evidence](docs/screenshots/Cloudinary).
- [Email evidence](docs/screenshots/Mailtrap).
- [Nine final production screenshots](docs/screenshots/entrega-2026-09-19/README.md).

These linked technical documents are in Spanish. They distinguish screenshots, manual observations and automated checks. Sandbox email does not establish delivery to personal inboxes, and the complete Insomnia collection has not been repeated against production.

### KelseTS universe

| Project | Focus | Website |
| --- | --- | --- |
| KelseTS Lifestyle | Movement, pop culture and lifestyle | [Visit](https://kelset-slanding.vercel.app/) |
| KelseTS Store | Footwear store | [Visit](https://proyecto-landing-page-2.vercel.app/) |
| KelseTS Business School | AI, innovation and leadership | [Visit](https://kelse-ts-business-school-landing.vercel.app/) |
| KelseTS Talks | Motivational talks and events | [Visit](https://kelse-ts-talks.vercel.app/) |

### Academic notice and author

KelseTS is a fictional brand created by **Araceli Fradejas Muñoz** for educational, academic and portfolio purposes. This project draws creative inspiration from pop culture, music and sport, with affection and respect for Taylor Swift and her family. It is not affiliated with, sponsored, authorised or endorsed by Taylor Swift, Travis Kelce, the Kansas City Chiefs, the National Football League, their representatives or related organisations.

The depicted characters, events, speakers, testimonials, products and services are fictional. The website's character images are AI-generated recreations, not official photographs of celebrities or evidence of real events. [Resource credits](docs/RECURSOS.md) remain available.

**Araceli Fradejas Muñoz** · Rock The Code, [The Power Tech School](https://thepower.education/thepowermba/tech).

[GitHub](https://github.com/AraceliFradejas) · [LinkedIn](https://www.linkedin.com/in/araceli-fradejas-munoz-transformaciondigital/) · [X](https://x.com/AraceliFradejas) · [Medium](https://medium.com/@araceli.fradejas) · [YouTube](https://www.youtube.com/@aracelifradejasmunoz2758)

[Volver al inicio / Back to top](#kelsets-talks)
