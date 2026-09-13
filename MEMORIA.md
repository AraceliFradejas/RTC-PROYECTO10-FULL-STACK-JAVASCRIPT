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

### Referencias creativas de los ponentes

Por decisión editorial, las biografías ficticias toman temas generales de cuatro referencias públicas. Los episodios narrados, proyectos, entornos y aprendizajes de los personajes son creaciones originales; no describen la vida de esas personas ni una relación con KelseTS. Los perfiles públicos mantienen su identificación como ficción y las versiones española e inglesa cuentan la misma historia.

| Personaje | Referencia consultada | Eje de inspiración |
| --- | --- | --- |
| Alison Patrick | [Patricia Ayuela · Línea Directa](https://www.lineadirectaaseguradora.com/documents/1712153/1897558/NP%2BL%C3%8DNEA%2BDIRECTA%2BASEGURADORA%2B-%2BNombramiento%2BNuevo%2BCEO_DEF.pdf/feda6d34-7dbb-ed03-bb35-61810dda65f1?t=1645120415956) | Gestión, conocimiento operativo y transformación digital. |
| Jude Becks | [David Beckham · Biografía oficial](https://www.davidbeckham.com/about) | Fútbol, adaptación a distintos equipos y una segunda etapa más allá de la competición. |
| Anna Nasser | [Álex Rayón · Universidad de Deusto](https://www.deusto.es/es/inicio/vive/actualidad/noticias/alex-rayon-ha-participado-como-experto-en-la-comision-de-asuntos-economicos-y-transformacion-digital-del-senado/noticia) | Formación, datos, inteligencia artificial y transformación. |
| Travis Wood | [Travis Kelce · 87 & Running](https://87running.org/about/) | Deporte de equipo y oportunidades para jóvenes en la comunidad. |

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

Persistencia de la relación entre ponentes y eventos en la API, eventos privados para empresas, recuperación de contraseña, agenda por ciudades, valoraciones posteriores y pruebas de integración con una base efímera.

---

# Project report · KelseTS Talks

KelseTS is a fictional company connecting sport, culture, technology and learning. KelseTS Talks is its motivational events platform for speakers, professionals and teams, with experiences about leadership, resilience, performance, innovation and wellbeing.

The product combines a React SPA with an Express/MongoDB REST API. It supports JWT authentication, automatic login after registration, protected event creation, Cloudinary uploads, reusable requests and two-way attendance relationships.

The brand draws on the broad themes of incremental progress and collective effort found in the coach's speech from *Any Given Sunday*. All copy, visual identity and product content are original.

**Author: Araceli Fradejas Muñoz**


## Punto de continuación · frontend y agenda (12 de septiembre de 2026)

- Agenda de muestra: 12 charlas en 2027, tres por ponente, en `frontend/src/data/previewEvents.json`; traducciones en `frontend/src/i18n/events.json`.
- Tarjetas horizontales con fecha y categoría junto al texto. Los 12 carteles tienen 1200 × 1500 píxeles (4:5) y se muestran completos.
- Alison: baloncesto, remo y atletismo; imágenes variadas, mujeres y equipos protagonistas.
- Charlas e invitaciones: imágenes propias, naturales y diferentes de la ficha principal. Invitaciones con el mismo vestuario del perfil, proporción original y controles debajo.
- Enlaces `youtubeUrl` pendientes. Vídeos conservados en `production/media/`, fuera de la compilación pública.
- Limpieza de imágenes públicas descartadas registrada en `production/event-covers/cleanup.json`. Fuentes de los vídeos conservadas.
- Siguiente trabajo, cuando el usuario lo solicite: conectar la agenda al backend, trasladar las 12 charlas y sus asociaciones con los ponentes, y habilitar reservas. El seed actual sigue teniendo ocho eventos; solo se actualizó la ruta de la portada sustituida. No ejecutar el seed ni modificar una base de datos como parte de esta limpieza.

### Enfoque de los vídeos · aprendizaje

El selector de las charlas ahora dice «Así aprendemos» y la llamada a la acción «Descubre cómo aprendieron nuestros alumnos con nuestros ponentes», con traducción inglesa. Se mantiene el aviso de ficción. Propuesta del usuario para más adelante: combinar las charlas existentes con su propio avatar de Synthesia comentando los aprendizajes de los cuatro ponentes y publicar el resultado en YouTube. Pendientes guion, montaje y enlaces; no se han generado ni publicado esos vídeos. Presentar el montaje como recreación del proyecto y la opinión como valoración personal, sin atribuir asistencia o grabación presencial que no haya ocurrido.

El usuario confirma que se destacará expresamente que los vídeos son una recreación para un proyecto del máster, sin fines lucrativos y exclusivamente pedagógica. Aviso aplicado a las cuatro charlas, en español e inglés; mantenerlo también en el futuro montaje y su descripción de YouTube.

Sección «Así lo vivimos en KelseTS» implementada en la portada entre ponentes y agenda, en ES/EN. Incluye cuatro reflexiones editoriales con acciones prácticas, fragmentos desplegables de los textos existentes y un bloque de presentación con aviso «Próximamente». Configuración: `frontend/src/data/learningStories.json`, campos `presentation.es.youtubeUrl` y `presentation.en.youtubeUrl`. Pendiente recibir/publicar el montaje con el avatar; no se presenta como un testimonio real ya grabado. Se mantiene visible el aviso de recreación pedagógica sin fines lucrativos.

Corrección del usuario: la nueva sección debe titularse «Conoce la experiencia de nuestros alumnos» / «Discover our students’ experience». Se conserva el orden original de la home: agenda, fichas de ponentes con los retratos originales; a continuación la nueva sección de alumnos y el ecosistema. Verificadas visualmente las cuatro fotografías originales en Chrome.

## Backend: agenda inicial en MongoDB Atlas

- Conexión local a la base kelsets_talks; secretos excluidos de Git.
- Catálogo backend con las 12 charlas aprobadas, tres por ponente, carteles finales y traducciones ES/EN.
- Modelo Event ampliado con speakerId, translations y seedKey único y opcional.
- Carga repetible por seedKey: conserva IDs, asistentes y creador. Valida el catálogo antes de escribir y admite --dry-run.
- Cuenta organizadora inicial talks@kelsets.com; contraseña aleatoria solo en backend/.env, almacenada con hash en MongoDB.
- Seis pruebas backend correctas. Frontend continúa en modo de muestra; siguiente paso: conectar la web y comprobar autenticación y reservas. Cloudinary pendiente.

## Conexión del frontend y prueba de autenticación

- Frontend local conectado a http://127.0.0.1:3000/api con VITE_PREVIEW_MODE=false; API local en ejecución.
- Búsqueda backend ampliada a descripciones, categoría y traducciones ES/EN; búsqueda literal con equivalencia de acentos.
- Navegador: registro con inicio automático, sesión tras recargar, cierre de sesión, contraseña incorrecta y login correcto comprobados. Reserva, recarga y cancelación comprobadas en una charla real.
- Búsquedas en castellano e inglés y carga de los 12 carteles verificadas. Cuenta temporal retirada; quedan 12 charlas y la cuenta organizadora.
- Validación: 7 pruebas backend, 40 frontend y compilación correctas.
- Siguiente paso: configurar Cloudinary para subir carteles y avatares; después probar creación de eventos. Credenciales locales excluidas de Git.

## Correos HTML de confirmación y cancelación

- Plantillas ES/EN con cartel completo, fecha de Madrid, ubicación, texto alternativo y botón para gestionar la reserva autenticándose en la ficha.
- Integración SMTP con Nodemailer, desactivada hasta configurar proveedor y remitente. El usuario necesita guía para esa configuración. No se ha enviado ningún correo real.
- El frontend transmite el idioma al confirmar/cancelar. Un fallo de envío no revierte la asistencia.
- Vistas HTML locales generables con npm run email:preview --prefix backend; revisión móvil sin desbordamiento y cartel cargado.
- Validación: 10 tests backend, 40 frontend y build correctos. Pendiente: proveedor SMTP, remitente, URL pública y prueba real de entrega.

### Identidad visual del correo

Plantillas de confirmación/cancelación ES/EN ajustadas al sitio: logo original y cabecera blanca, franja roja con degradado, tarjeta con cartel completo a la izquierda y datos a la derecha en escritorio, botón rojo y pie oscuro. En móvil se apilan las columnas. Revisadas en navegador a 390 y 1000 px sin desbordamientos. Diez pruebas backend correctas; pendiente verificar clientes de correo reales al configurar SMTP.

## Cloudinary conectado

Credenciales locales verificadas sin mostrarlas. Prueba real con API temporal y Atlas: registro de usuario de prueba, creación de evento multipart con cartel, descarga pública, subida de avatar y eliminación de evento. Imágenes y usuario temporales retirados al terminar. La API de desarrollo se reinicia para cargar el .env actualizado.

## Selección de ponente al crear charlas

Formulario ES/EN con los cuatro ponentes y opción por confirmar. La API acepta y valida speakerId y MongoDB conserva la asignación, separada del creador. Imagen solicitada para la charla nueva pendiente de conocer su título/tema; no se ha podido acceder al formulario del navegador del usuario.

Cartel generado para «Liderar en entornos convulsos», dirigido a CEOs de entidades financieras. Alison con identidad y vestuario de su perfil en reunión corporativa natural. Archivo final en output/imagegen/alison-liderar-entornos-convulsos.png; prompt documentado junto al archivo. Pendiente que la usuaria lo seleccione en su formulario y elija a Alison; no se ha publicado la charla.

## Cierre: primera charla creada desde la web

La usuaria confirma que ha publicado «Liderar en entornos convulsos» desde el formulario. El cartel final es output/imagegen/cartel-liderar-entornos-convulsos-voleibol.png: equipo femenino durante un tiempo muerto. Las versiones corporativas de Alison quedan excluidas de Git. La charla nueva reside en MongoDB y no se incorpora al catálogo inicial de 12 eventos. El envío de correos sigue desactivado; siguiente paso propuesto: probarlo con Mailtrap y después preparar el despliegue.

## Auditoría frente al enunciado

Revisión documentada en docs/REVISION-ENTREGA.md. Colección Insomnia con 28 peticiones y aserciones en docs/insomnia/kelsets-talks.json; importación y ejecución en Insomnia pendientes. Detectadas mejoras de validación de email/tipos, errores de ficheros y coherencia de escrituras. Despliegue pendiente; correo extra pendiente de proveedor, sin credenciales Mailtrap configuradas.

## Mailtrap Sandbox verificado

Autenticación SMTP con TLS correcta. Confirmación ES y cancelación EN aceptadas por Mailtrap; la cancelación requirió reintento. Son muestras enviadas sin modificar reservas reales. MAIL_ENABLED=true únicamente en configuración local con host sandbox.smtp.mailtrap.io. Pendiente confirmación visual de los mensajes por la usuaria y prueba del recorrido completo desde la web. No es entrega real a Gmail; PUBLIC_APP_URL sigue siendo local.

## Guía de evidencias para la entrega (importante)

Seguir [la guía de capturas](docs/GUIA-CAPTURAS.md) junto a la usuaria: web ES/EN, registro, creación y reserva, MongoDB (users/events y relaciones), Cloudinary (cartel alojado), Mailtrap (confirmación/cancelación), Insomnia (200/400/401/403/409), tests, build y Vercel. Archivos previstos en docs/capturas/. Guiarla paso a paso y no marcar ninguna captura como hecha sin comprobar el archivo. Ocultar secretos, tokens, hashes completos y datos personales.

Validaciones reforzadas: email y tipos en credenciales, contraseña bcrypt de hasta 72 bytes en registro, aforo entero, fechas futuras al escribirlas y mensajes de errores JSON/ficheros. Guardado reutilizable de imágenes valida antes de subir y retira recursos sustituidos después de guardar. Frontend valida aforo y longitudes. Pruebas unitarias: 15 backend + 41 frontend y build correctos.

Comprobación adicional: 29 casos HTTP correctos contra Express y Atlas, reutilizando peticiones/aserciones de la colección exportada y añadiendo JSON malformado y archivo >5 MB. Datos temporales eliminados. Evidencia en docs/insomnia/RESULTADO-HTTP.md. Todavía hay que importar la colección y ejecutarla en Insomnia con la usuaria; no confundir ambas ejecuciones.

### Evidencia real en Insomnia: registro

La usuaria ha ejecutado «02 · Registro organizador e inicio automático» en Insomnia. Captura guardada en [insomnia-02-registro.png](docs/screenshots/Insomnia/insomnia-02%20-%20registro.png): HTTP 201 Created, success=true, usuario con role=user y Tests 1/1. El token está oculto en la captura. La respuesta de «01 · Salud» también fue confirmada por texto; su captura y estado HTTP quedan pendientes de aportar. Siguiente prueba guiada: registro duplicado, que debe devolver 409.


## Validación detallada en Insomnia · revisión del 13 de septiembre de 2026

Se revisaron las 28 capturas aportadas de Insomnia 13.2.0, tomadas durante el recorrido local del 12–13 de septiembre, contra `http://127.0.0.1:3000/api` y MongoDB Atlas. **Los 28 casos muestran el resultado esperado, tras repetir la prueba 27 con un archivo real y verificar la URL de Cloudinary.** Los códigos 400, 401, 403, 404 y 409 de los casos negativos son resultados esperados. Todas las capturas muestran Tests 1/1, pero ese indicador corresponde a la aserción HTTP y no basta para validar una subida de archivo.

La [colección importable](docs/insomnia/kelsets-talks.json) conserva los cuerpos y scripts para reproducir las peticiones. Las rutas siguientes son relativas a `/api`. `token` identifica al organizador, `other_token` al asistente y `event_id` al evento temporal creado en 12. Usar emails nuevos en cada ejecución completa; los registros anteriores causarían 409. La comprobación HTTP previa mediante Node se documenta por separado en [RESULTADO-HTTP.md](docs/insomnia/RESULTADO-HTTP.md).

### Prueba 01 · Salud

**Objetivo.** Comprobar que Express responde antes de empezar el recorrido.

**Petición y preparación.** `GET /health`. Sin cuerpo ni autenticación.

**Resultado observado frente al esperado.** 200; success=true y «KelseTS Talks API está lista.».

**Interpretación.** Permite distinguir una API accesible de un error de conexión; no prueba por sí sola todas las integraciones.

**Evidencia.** [Ver captura 01](docs/screenshots/Insomnia/insomnia-01-inicio.png).

### Prueba 02 · Registro organizador e inicio automático

**Objetivo.** Crear la cuenta organizadora y obtener la sesión en la misma operación.

**Petición y preparación.** `POST /auth/register`. name=Organizador Insomnia, email de prueba y password del entorno; acceso público.

**Resultado observado frente al esperado.** 201; data contiene token y user con nombre, email y role=user, sin contraseña.

**Interpretación.** El registro devuelve los datos necesarios para iniciar sesión automáticamente. El script guarda token para las siguientes peticiones.

**Evidencia.** [Ver captura 02](docs/screenshots/Insomnia/insomnia-02%20-%20registro.png).

### Prueba 03 · Registro duplicado

**Objetivo.** Impedir cuentas duplicadas.

**Petición y preparación.** `POST /auth/register`. Repetir exactamente el email de la prueba 02.

**Resultado observado frente al esperado.** 409; success=false y mensaje de email ya registrado.

**Interpretación.** El conflicto se comunica al cliente sin crear otra cuenta con el mismo correo.

**Evidencia.** [Ver captura 03](docs/screenshots/Insomnia/Insomnia-03%20%C2%B7%20Registro%20duplicado.png).

### Prueba 04 · Login incorrecto

**Objetivo.** Rechazar credenciales incorrectas.

**Petición y preparación.** `POST /auth/login`. Email registrado y contraseña deliberadamente incorrecta; sin sesión.

**Resultado observado frente al esperado.** 401; «El email o la contraseña no son correctos.».

**Interpretación.** El backend no autentica al usuario con una contraseña errónea y devuelve un mensaje comprensible.

**Evidencia.** [Ver captura 04](docs/screenshots/Insomnia/Insomnia-04-login-incorrecto.png).

### Prueba 05 · Login correcto

**Objetivo.** Autenticar una cuenta existente.

**Petición y preparación.** `POST /auth/login`. Email y password del entorno usados en el registro.

**Resultado observado frente al esperado.** 200; token y datos del mismo organizador.

**Interpretación.** El script actualiza token; las peticiones protegidas posteriores utilizan esa sesión.

**Evidencia.** [Ver captura 05](docs/screenshots/Insomnia/Insomnia-05%20%C2%B7%20Login%20correcto.png).

### Prueba 06 · Perfil privado

**Objetivo.** Consultar el perfil con una sesión válida.

**Petición y preparación.** `GET /auth/me`. Bearer token del organizador; sin cuerpo.

**Resultado observado frente al esperado.** 200; identificador, nombre, email, avatar y role del organizador.

**Interpretación.** La respuesta pública del perfil no incluye contraseña ni hash.

**Evidencia.** [Ver captura 06](docs/screenshots/Insomnia/insomnia-06-perfil-privado.png).

### Prueba 07 · Perfil sin token

**Objetivo.** Verificar la protección del perfil.

**Petición y preparación.** `GET /auth/me`. La misma consulta que en 06, eliminando la autenticación.

**Resultado observado frente al esperado.** 401; success=false y mensaje que requiere iniciar sesión.

**Interpretación.** Distingue acceso autenticado y acceso anónimo a la misma ruta.

**Evidencia.** [Ver captura 07](docs/screenshots/Insomnia/insomnia-07-sin-token.png).

### Prueba 08 · Agenda por fecha

**Objetivo.** Consultar la agenda ordenada por fecha.

**Petición y preparación.** `GET /events?sort=soonest`. Query sort=soonest; consulta pública.

**Resultado observado frente al esperado.** 200; lista de eventos y Tests 1/1.

**Interpretación.** La captura muestra el inicio de la lista. El script adicional recorre las fechas y exige orden ascendente; la imagen no muestra todos los elementos.

**Evidencia.** [Ver captura 08](docs/screenshots/Insomnia/insomnia-08-agenda-fecha.png).

### Prueba 09 · Agenda por popularidad

**Objetivo.** Consultar la agenda por popularidad.

**Petición y preparación.** `GET /events?sort=popular`. Query sort=popular; consulta pública.

**Resultado observado frente al esperado.** 200; lista de eventos con attendees y Tests 1/1.

**Interpretación.** El criterio es el número de asistentes descendente. La comprobación adicional de la colección recorre la lista completa; la captura muestra solo parte.

**Evidencia.** [Ver captura 09](docs/screenshots/Insomnia/Insomnia%20-09%20%C2%B7%20Agenda%20por%20popularidad.png).

### Prueba 10 · Búsqueda traducida y categoría

**Objetivo.** Combinar búsqueda de contenido traducido y categoría.

**Petición y preparación.** `GET /events?search=remontada&category=Resiliencia`. search=remontada y category=Resiliencia; sin token.

**Resultado observado frente al esperado.** 200; aparece «La mentalidad de la remontada», con traducciones ES/EN y categoría Resiliencia.

**Interpretación.** La búsqueda encuentra contenido editorial traducido y respeta el filtro de categoría. Este caso no cubre todas las combinaciones ni todos los idiomas.

**Evidencia.** [Ver captura 10](docs/screenshots/Insomnia/insomnia-10-busqueda.png).

### Prueba 11 · Crear evento sin sesión

**Objetivo.** Impedir la creación de eventos sin sesión.

**Petición y preparación.** `POST /events`. JSON de una charla válida, sin Bearer token.

**Resultado observado frente al esperado.** 401; mensaje que requiere iniciar sesión.

**Interpretación.** Un cuerpo válido no sustituye la autenticación necesaria para escribir.

**Evidencia.** [Ver captura 11](docs/screenshots/Insomnia/Insomnia-11%20%C2%B7%20Crear%20evento%20sin%20sesio%CC%81n.png).

### Prueba 12 · Crear evento de prueba

**Objetivo.** Crear un evento temporal con el organizador.

**Petición y preparación.** `POST /events`. Bearer token; título Charla temporal Insomnia, fecha 2030-06-15T18:00:00Z, Madrid · Pruebas, categoría Liderazgo, speakerId=alison-patrick y capacity=1.

**Resultado observado frente al esperado.** 201; evento con _id, creador, ponente, aforo 1 y attendees vacío.

**Interpretación.** El script guarda event_id para aislar las pruebas. Se usa JSON sin cartel: esta prueba no demuestra subida de ficheros.

**Evidencia.** [Ver captura 12](docs/screenshots/Insomnia/Insomnia-12%20%C2%B7%20Crear%20evento%20de%20prueba%C2%BB.png).

### Prueba 13 · Detalle y asistentes

**Objetivo.** Consultar el evento y su estructura de asistentes.

**Petición y preparación.** `GET /events/{{ _.event_id }}`. event_id obtenido en 12; lectura pública.

**Resultado observado frente al esperado.** 200; mismo evento, información del creador y attendees=[].

**Interpretación.** El detalle permite explorar los datos y la lista de asistentes antes de reservar.

**Evidencia.** [Ver captura 13](docs/screenshots/Insomnia/insomnia-13-detalle.png).

### Prueba 14 · Editar evento propio

**Objetivo.** Permitir al creador editar su evento.

**Petición y preparación.** `PATCH /events/{{ _.event_id }}`. Bearer token del organizador; title=Charla temporal Insomnia editada.

**Resultado observado frente al esperado.** 200; título actualizado conservando el identificador del evento.

**Interpretación.** Demuestra edición autorizada del recurso creado en 12.

**Evidencia.** [Ver captura 14](docs/screenshots/Insomnia/Insomnia-14%20%C2%B7%20Editar%20evento%20propio.png).

### Prueba 15 · Registro segundo usuario

**Objetivo.** Crear una identidad distinta para comprobar autorización.

**Petición y preparación.** `POST /auth/register`. name=Asistente Insomnia, other_email y password del entorno; registro público.

**Resultado observado frente al esperado.** 201; segundo usuario con identificador distinto, role=user y token.

**Interpretación.** El script guarda other_token. La captura se revisó de nuevo después de que la usuaria ocultase el token.

**Evidencia.** [Ver captura 15](docs/screenshots/Insomnia/Imsomnia-15%20%C2%B7%20Registro%20segundo%20usuario.png). Token oculto por la usuaria antes de incorporarla al repositorio.

### Prueba 16 · Edición ajena denegada

**Objetivo.** Impedir que otro usuario edite el evento.

**Petición y preparación.** `PATCH /events/{{ _.event_id }}`. Bearer other_token; title=Cambio no autorizado sobre event_id.

**Resultado observado frente al esperado.** 403; «Solo la persona creadora puede modificar este evento.».

**Interpretación.** La sesión es válida, pero no tiene permiso sobre ese recurso. No debe confundirse con el 401 de ausencia de sesión.

**Evidencia.** [Ver captura 16](docs/screenshots/Insomnia/Insomnia-16%20%C2%B7%20Edicio%CC%81n%20ajena%20denegada.png).

### Prueba 17 · Borrado ajeno denegado

**Objetivo.** Impedir el borrado por un usuario ajeno.

**Petición y preparación.** `DELETE /events/{{ _.event_id }}`. Bearer other_token sobre el evento del organizador.

**Resultado observado frente al esperado.** 403; mismo mensaje de restricción por creador.

**Interpretación.** El evento sigue disponible para la reserva posterior; la autenticación por sí sola no autoriza el borrado.

**Evidencia.** [Ver captura 17](docs/screenshots/Insomnia/Insomnia-17%20%C2%B7%20Borrado%20ajeno%20denegado.png).

### Prueba 18 · Reservar única plaza

**Objetivo.** Insertar al asistente en la única plaza disponible.

**Petición y preparación.** `POST /events/{{ _.event_id }}/attendance`. Bearer other_token; language=es; evento con capacity=1 y sin asistentes.

**Resultado observado frente al esperado.** 200; attendees contiene a Asistente Insomnia, mensaje de plaza confirmada y email.status=sent.

**Interpretación.** Demuestra la relación de asistencia en la respuesta del evento. sent indica aceptación SMTP de Mailtrap Sandbox, no entrega a Gmail ni prueba visual del email.

**Evidencia.** [Ver captura 18](docs/screenshots/Insomnia/insomnia-18-reserva.png).

### Prueba 19 · Aforo completo

**Objetivo.** Evitar superar el aforo.

**Petición y preparación.** `POST /events/{{ _.event_id }}/attendance`. Bearer token del organizador; intentar reservar después de 18.

**Resultado observado frente al esperado.** 409; «El evento ya está completo.».

**Interpretación.** El límite de una plaza impide incorporar al segundo usuario. Es una prueba secuencial; no demuestra comportamiento bajo solicitudes concurrentes.

**Evidencia.** [Ver captura 19](docs/screenshots/Insomnia/insomnia-19-aforo-completo.png).

### Prueba 20 · Cancelar reserva

**Objetivo.** Cancelar la asistencia y liberar la plaza.

**Petición y preparación.** `POST /events/{{ _.event_id }}/attendance`. Bearer other_token; repetir la operación de asistencia con language=es.

**Resultado observado frente al esperado.** 200; attendees=[], «Tu asistencia se ha cancelado.» y email.status=sent.

**Interpretación.** La ruta alterna reserva/cancelación. La aceptación del correo corresponde al Sandbox. La relación inversa en users requiere evidencia de MongoDB aparte.

**Evidencia.** [Ver captura 20](docs/screenshots/Insomnia/insomnia-20-cancelacion.png).

### Prueba 21 · ID malformado

**Objetivo.** Rechazar un identificador malformado.

**Petición y preparación.** `GET /events/no-es-un-id`. ID literal no-es-un-id; consulta pública.

**Resultado observado frente al esperado.** 400; «El identificador del evento no es válido.».

**Interpretación.** El formato inválido se trata como error del cliente con mensaje legible, sin exponer un error interno.

**Evidencia.** [Ver captura 21](docs/screenshots/Insomnia/insomnia-21-id-malformado.png).

### Prueba 22 · ID inexistente

**Objetivo.** Distinguir un ID válido que no existe.

**Petición y preparación.** `GET /events/000000000000000000000000`. ID 000000000000000000000000; consulta pública.

**Resultado observado frente al esperado.** 404; «No hemos encontrado ese evento.».

**Interpretación.** El recurso inexistente devuelve 404, a diferencia del formato inválido de 21.

**Evidencia.** [Ver captura 22](docs/screenshots/Insomnia/Insomnia-22%20%C2%B7%20ID%20inexistente.png).

### Prueba 23 · Ponente inválido

**Objetivo.** Validar el catálogo de ponentes desde el backend.

**Petición y preparación.** `PATCH /events/{{ _.event_id }}`. Bearer token del creador; speakerId=inventado.

**Resultado observado frente al esperado.** 400; «Elige un ponente válido.».

**Interpretación.** La API rechaza un valor fuera del catálogo aunque se envíe sin pasar por el formulario.

**Evidencia.** [Ver captura 23](docs/screenshots/Insomnia/insomnia-23-ponente-invalido.png).

### Prueba 24 · Aforo inválido

**Objetivo.** Validar el límite mínimo del aforo.

**Petición y preparación.** `PATCH /events/{{ _.event_id }}`. Bearer token del creador; capacity=0.

**Resultado observado frente al esperado.** 400; «El aforo debe ser un número entero entre 1 y 10000.».

**Interpretación.** La validación del servidor complementa la del frontend. Esta captura verifica el cero, no todos los valores límite.

**Evidencia.** [Ver captura 24](docs/screenshots/Insomnia/insomnia-24-aforo-invalido..png).

### Prueba 25 · Eliminar evento temporal

**Objetivo.** Eliminar el evento temporal con autorización.

**Petición y preparación.** `DELETE /events/{{ _.event_id }}`. Bearer token de su creador y event_id de esta ejecución.

**Resultado observado frente al esperado.** 204 No Content; cuerpo vacío, 0 B.

**Interpretación.** La ausencia de JSON es correcta para 204. Se elimina solo el evento de pruebas y se verifica su ausencia en 26.

**Evidencia.** [Ver captura 25](docs/screenshots/Insomnia/Insomnia-25%20%C2%B7%20Eliminar%20evento%20temporal.png).

### Prueba 26 · Confirmar eliminación

**Objetivo.** Comprobar que el borrado se ha aplicado.

**Petición y preparación.** `GET /events/{{ _.event_id }}`. Consultar event_id después de 25; sin autenticación.

**Resultado observado frente al esperado.** 404; «No hemos encontrado ese evento.».

**Interpretación.** La secuencia 25–26 demuestra que el recurso eliminado deja de estar disponible. Las dos cuentas de prueba permanecen.

**Evidencia.** [Ver captura 26](docs/screenshots/Insomnia/insomnia-26-evento-eliminado.png).

### Prueba 27 · Subir avatar (manual)

**Objetivo.** Comprobar la subida multipart de un avatar a Cloudinary.

**Petición y preparación.** `PATCH /auth/me`. Bearer token; campo avatar de tipo File. Debe seleccionarse una imagen real JPG/PNG/WebP, de hasta 5 MB.

**Resultado observado frente al esperado.** La nueva ejecución devuelve 200, success=true y data.avatar con URL HTTPS de res.cloudinary.com, dentro de kelsets-talks/avatars. En el formulario multipart se ve un archivo JPEG seleccionado. Coincide con el resultado esperado.

**Interpretación.** La primera ejecución devolvió avatar vacío: un 200 por sí solo no acreditaba la subida. Se repitió seleccionando un JPEG real y la nueva captura demuestra que la API devuelve el recurso alojado en Cloudinary. La colección versionada exige también una URL válida para evitar ese falso positivo. Esta captura no acredita sustitución de un avatar previo ni limpieza tras un fallo.

**Evidencia.** [Ver captura 27](docs/screenshots/Insomnia/insomnia-27-avatar.png).

### Prueba 28 · Email inválido

**Objetivo.** Rechazar un correo con formato inválido.

**Petición y preparación.** `POST /auth/register`. Registro con name=Validación, email=correo-sin-formato y contraseña del entorno.

**Resultado observado frente al esperado.** 400; «Escribe un email válido.».

**Interpretación.** La API aplica validación de email independientemente de los controles del navegador.

**Evidencia.** [Ver captura 28](docs/screenshots/Insomnia/insomnia-28-email-invalido.png).

### Alcance y siguientes evidencias

Estas pruebas cubren el recorrido local de autenticación, CRUD, permisos, ordenación, asistencia y validación de entrada. No sustituyen las pruebas de concurrencia, la revisión de todos los estados del frontend ni la repetición sobre las URLs desplegadas. Para la entrega hay que añadir las capturas de MongoDB (referencias de usuario/evento sin secretos), Cloudinary, Mailtrap HTML ES/EN y Vercel siguiendo la [guía de capturas](docs/GUIA-CAPTURAS.md). Las dos cuentas de demostración permanecen en Atlas; el evento temporal se eliminó en 25.
