# Comprobación del enunciado

Revisión del 19/09/2026 contra el texto completo de la actividad. La revisión contrasta cada requisito con los modelos, rutas, controladores, formularios y pruebas del proyecto. No se equipara esta revisión a ausencia absoluta de errores.

## Correspondencia de requisitos

| Requisito del enunciado | Implementación y evidencia |
| --- | --- |
| Express, JWT, Bcrypt, Mongoose, CORS y Nodemon | Dependencias en `backend/package.json`; aplicación y conexión separadas del arranque. |
| Usuario con nombre, email y contraseña hashed | `backend/src/models/User.js`; bcrypt y contraseña excluida de consultas ordinarias. |
| Evento y asistentes como IDs de usuarios | `backend/src/models/Event.js`; título, fecha, ubicación, descripción y referencias a User. |
| Middleware de token y rutas protegidas | `middlewares/auth.js`, `authRoutes.js` y `eventRoutes.js`; JWT válido, usuario existente y versión de sesión. Edición limitada a creador o administrador. |
| Subida de ficheros | Carteles mediante Multer, Cloudinary y `saveWithImage`; creación y guardado desde la web confirmados en producción. El ejemplo de avatares es alternativo, no obliga a implementar una pantalla adicional. La API de avatar también existe. |
| Ordenación | `listEvents`: fecha, publicación y popularidad; selector en la agenda. |
| Inserción de una colección en otra | Asistencia añade el ID de usuario a Event y el de evento a User; transacción y comprobación de aforo. Cancelación retira ambos enlaces. |
| Login, registro e inicio automático | `AuthPage` y `AuthContext`; registro devuelve JWT y usuario y establece la sesión directamente. |
| Lista, creación y asistencia autenticada | Agenda pública, enlace de creación para autenticados, `ProtectedRoute` y control adicional en la API. Visitantes pueden explorar; reservar les dirige al acceso. |
| Detalle y lista de asistentes | `EventDetailPage`; datos, ponente, cartel, aforo y participantes. |
| Manejo de errores en frontend/backend | `apiRequest`, `ApiError`, `FormErrors`, avisos y middleware común; formularios de acceso, registro, creación/edición y recuperación con validación, captura de errores y respuesta visible. No se promete haber ensayado todos los fallos posibles. |
| Loading en operaciones asíncronas | Agenda y detalle, sesión, acceso/registro, creación/edición, recuperación, reservas/cancelación y compartir. Se refuerzan la cabecera durante comprobación de sesión y el botón de compartir en esta revisión. |
| Componentes y reutilización | Header, Footer, Layout, Loader, FormErrors, EventCard, EventAvailability, componentes de ponentes y medios; contextos de sesión/idioma/avisos; hook de agenda; un mismo formulario para crear/editar. Backend reutiliza errores, autenticación, validación e imágenes. |
| Fetch centralizado | Una única llamada `fetch` de aplicación en `frontend/src/services/api.js`; páginas, contextos y servicios utilizan `apiRequest`. |
| Despliegue de frontend y backend | Dos proyectos Vercel con dominios independientes; evidencias Ready y pruebas funcionales publicadas. |

La frase «no se repite código en ningún momento» expresa el objetivo de reutilización. No se declara duplicación cero: cliente y servidor validan entradas de forma independiente por responsabilidad, y existen catálogos/copias de recursos para traducción, demostración y empaquetado de correo, documentados. No se ha detectado un motivo para una reestructuración general antes de entregar.

## Repositorio y envío

El enunciado pide «ambos enlaces de github», pero no ordena dos repositorios independientes ni obliga a uno solo. Se entrega el monorepo existente, con enlaces separados y explícitos a las carpetas `frontend` y `backend`, además del enlace general. Es una interpretación del texto, no una confirmación adicional del profesorado. Ambos proyectos se instalan y despliegan por separado.

La entrega se presenta en el apartado de la actividad; la corrección se comunica por mensaje privado en el foro. El texto aportado no exige vídeos, correo real, recuperación de contraseña, pantalla de perfil ni borrado de eventos desde la interfaz. No se convierten esos extras en bloqueos de entrega. El archivo de entorno permanece fuera de Git y solo se facilita por el canal privado previamente indicado para la corrección.

## Resultado y límites

84 pruebas ordinarias correctas (28 backend y 56 frontend), build y comprobación de 14 documentos HTML correctos. Las dos integraciones con Atlas se omiten en `npm test`; sus ejecuciones separadas y alcance constan en la memoria. Los recorridos de recuperación, reserva/cancelación, creación, edición y cartel se comprobaron en las pruebas manuales del 19/09/2026; las nueve capturas finales están enlazadas en la documentación.

No se detectan funcionalidades obligatorias ausentes en el alcance descrito. Quedan mejoras de robustez y comprobaciones adicionales, como repetir toda la colección de Insomnia contra producción y ampliar la prueba de avatar, sin que el avatar sea necesario para cumplir la subida de ficheros ya demostrada con carteles. Mailtrap Sandbox no acredita entrega a buzones personales y la revisión visual no es una certificación integral de accesibilidad.
