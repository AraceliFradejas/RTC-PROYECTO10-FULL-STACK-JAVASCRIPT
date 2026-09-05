# Memoria del proyecto · KelseTS Talks

## 1. Resumen ejecutivo

KelseTS es una empresa ficticia que conecta deporte, cultura, tecnología y formación. KelseTS Talks es su línea de charlas motivacionales y experiencias de desarrollo profesional inspiradas en el deporte. La plataforma permite publicar, descubrir y gestionar eventos, además de relacionar usuarios y asistentes.

La propuesta amplía el universo empresarial iniciado en los proyectos KelseTS y KelseTS Business School. Esta nueva línea se centra en liderazgo, resiliencia, rendimiento y trabajo en equipo.

## 2. Identidad de empresa

**Propósito:** ayudar a personas y organizaciones a transformar la inspiración en una siguiente acción concreta.

**Posicionamiento:** KelseTS Talks no es una agenda genérica ni una consultora tradicional. Produce encuentros que utilizan historias y aprendizajes del deporte para abordar desafíos profesionales.

**Programa insignia:** *The Next Inch — Move the next inch. Change the whole game.*

La inspiración conceptual nace de la arenga de Tony D'Amato, personaje interpretado por Al Pacino en *Any Given Sunday* (Oliver Stone, 1999). De ella se extraen tres temas generales: progreso incremental, responsabilidad personal y esfuerzo colectivo. No se utiliza texto literal del guion ni material visual de la película.

## 3. Público y experiencias

La plataforma se dirige a profesionales, responsables de equipos, departamentos de personas, comunidades empresariales y speakers. La agenda agrupa los encuentros en Liderazgo, Resiliencia, Equipo, Rendimiento, Innovación, Bienestar y Otros.

Cada experiencia explica su propuesta, fecha, ubicación, aforo, persona organizadora y asistentes confirmados.

## 4. Alcance funcional

- Registro e inicio de sesión con acceso inmediato después del alta.
- Perfil de usuario con avatar.
- Agenda pública ordenable y filtrable.
- Detalle del talk y listado de asistentes.
- Creación y edición segura de eventos con cartel.
- Confirmación y cancelación de asistencia.
- Estados de carga, vacío, confirmación y error.

## 5. Arquitectura

El monorepo contiene dos aplicaciones independientes:

- `backend`: API REST organizada en configuración, modelos, controladores, rutas, middlewares y utilidades.
- `frontend`: SPA organizada mediante componentes compartidos, contextos, hooks, servicios y páginas.

Todas las peticiones pasan por `apiRequest`, que centraliza serialización, autorización y errores. La API devuelve `{ success, data }` o `{ success, error }`. Los controladores asíncronos comparten una utilidad para delegar excepciones al middleware central.

## 6. Modelo de datos

**Usuario:** nombre, email único, contraseña cifrada, avatar, rol y referencias a eventos confirmados.

**Evento:** título, fecha, ubicación, descripción, categoría, cartel, aforo, persona creadora y asistentes referenciados.

La asistencia utiliza `$addToSet` y `$pull` para evitar duplicados y mantener sincronizadas ambas colecciones. Al eliminar un evento también se limpian sus referencias en los usuarios.

## 7. Seguridad y archivos

- Bcrypt cifra contraseñas con factor de coste 12.
- Los JWT caducan a los siete días.
- Las rutas privadas verifican presencia y validez del token.
- La edición y eliminación comprueban propiedad o rol administrador.
- La creación utiliza una lista blanca de campos para impedir la inyección de asistentes, autoría o metadatos de archivos.
- La reserva de la última plaza se realiza mediante una actualización atómica para evitar superar el aforo.
- Multer limita imágenes a 5 MB y acepta JPG, PNG o WebP.
- Cloudinary almacena carteles y avatares fuera del entorno serverless.

## 8. UX, UI y accesibilidad

La dirección visual continúa el lenguaje de las webs anteriores de KelseTS: rojo `#DC2626`, dorado `#F59E0B`, negro `#1A1A1A`, blanco y lavanda `#9563FF` como acento cultural. Utiliza tipografía contundente y una colección visual propia formada por escenas deportivas, ocho carteles y cuatro retratos ficticios. Los recursos publicados se han revisado y retocado para eliminar logotipos, emblemas de equipos y marcas reconocibles.

El carrusel es deliberadamente manual e incluye controles, contador y selectores para que el contenido nunca se mueva sin intervención. La navegación es responsive y operable mediante teclado. Incluye enlace para saltar al contenido, textos alternativos, etiquetas visibles, foco perceptible, avisos `aria-live` y respeto por `prefers-reduced-motion`. Cada operación asíncrona comunica inmediatamente su estado.

## 9. Ecosistema KelseTS

KelseTS Talks se relaciona desde la página de inicio, la presentación corporativa y el footer con tres proyectos activos: KelseTS Lifestyle, como expresión motivacional y cultural; KelseTS Store, como tienda de zapatillas; y KelseTS Business School, como espacio de formación en IA y liderazgo. Los enlaces externos se identifican como tales y se abren de forma segura.

## 10. Aviso legal

La web muestra un disclaimer bilingüe completo y un resumen permanente en el footer. Declara el carácter ficticio, educativo y de portfolio del proyecto, así como la ausencia de afiliación o respaldo por parte de Taylor Swift, Travis Kelce, Kansas City Chiefs, NFL o entidades relacionadas. La inspiración cultural y deportiva no se presenta como colaboración comercial.

## 11. Pruebas y calidad

Los tests comprueban errores, firma y caducidad de tokens, serialización del cliente HTTP, autorización, respuestas fallidas y filtrado de campos editables.

```bash
npm test
npm run build
```

## 12. Despliegue

Frontend y backend incluyen `.env.example` y configuración de Vercel. Se crearán dos proyectos con directorios raíz `frontend` y `backend`. Tras desplegar la API, su dirección se asignará a `VITE_API_URL`; el dominio de la web se añadirá a `FRONTEND_URL`. También son necesarias una base MongoDB Atlas, un secreto JWT y credenciales de Cloudinary.

La orden `npm run seed --prefix backend` carga de forma idempotente las ocho experiencias y enlaza sus carteles locales. Requiere `MONGODB_URI` y `SEED_PASSWORD`.

## 13. Próximas mejoras

Perfiles públicos de speakers, eventos privados para empresas, recuperación de contraseña, agenda por ciudades, valoraciones posteriores y pruebas de integración con una base efímera.

---

# Project report · KelseTS Talks

KelseTS is a fictional company connecting sport, culture, technology and learning. KelseTS Talks is its motivational events platform for speakers, professionals and teams, with experiences about leadership, resilience, performance, innovation and wellbeing.

The product combines a React SPA with an Express/MongoDB REST API. It supports JWT authentication, automatic login after registration, protected event creation, Cloudinary uploads, reusable requests and two-way attendance relationships.

The brand draws on the broad themes of incremental progress and collective effort found in the coach's speech from *Any Given Sunday*. All copy, visual identity and product content are original.

**Author: Araceli Fradejas Muñoz**
