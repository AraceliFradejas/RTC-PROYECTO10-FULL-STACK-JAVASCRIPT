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
- Multer limita imágenes a 4 MB y acepta JPG, PNG o WebP.
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

**Petición y preparación.** `PATCH /auth/me`. Bearer token; campo avatar de tipo File. Debe seleccionarse una imagen real JPG/PNG/WebP, de hasta 4 MB (límite ajustado al preparar Vercel).

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

## MongoDB: asistentes y ocupación de demostración

La agenda editorial de 2027 incorpora asistentes ficticios para mostrar el recorrido completo de reservas, la ordenación por popularidad y los distintos estados de disponibilidad. No son registros de clientes ni testimonios de asistencia real. La interfaz ES/EN identifica los eventos precargados con «Incluye asistentes ficticios · Proyecto académico».

### Carga reproducible y relaciones

`npm run seed:attendance --prefix backend -- --dry-run` muestra la distribución sin conectar a MongoDB. Sin `--dry-run`, el script utiliza la conexión local configurada y modifica exclusivamente los eventos con `seedKey` del catálogo editorial. Debe ejecutarse después de cargar las 12 charlas. No se ejecuta durante el arranque de la API ni durante la compilación de Vercel.

Los usuarios de muestra tienen `isDemo: true`, nombres inventados y emails del dominio reservado `demo.kelsets.invalid`. Su contraseña se almacena con bcrypt a partir de un secreto aleatorio que no se guarda ni se publica. La carga no inicia sesión con esas cuentas y no envía correos. Las cuentas normales y los eventos creados por la usuaria se conservan.

Cada asistencia persiste como ObjectId en `Event.attendees` y su referencia inversa en `User.attendingEvents`. Se utiliza una transacción de MongoDB para confirmar conjuntamente la carga. `$addToSet` evita duplicados; se añaden únicamente las plazas necesarias para alcanzar el objetivo, contando también las reservas existentes. Repetir la carga no elimina asistentes ni reduce el aforo. Si nuevas reservas superan el objetivo, se conservan. El indicador `demoAttendance` permite informar en la interfaz sobre el origen ficticio de parte de los datos.

### Distribución y mensajes

| Periodo editorial | Ocupación inicial buscada | Mensaje ES / EN |
| --- | --- | --- |
| Hasta el 31/03/2027 | Quedan 5, 7 o 9 plazas según la charla | Últimas plazas · ¡No te quedes sin la tuya! / Last few places · Book yours! |
| Abril–junio de 2027 | Aproximadamente 63–74 % ocupado | No te quedes sin tu plaza / Secure your place |
| Julio–diciembre de 2027 | Aproximadamente 19–31 % ocupado | Plazas disponibles / Places available |

Las fechas determinan la distribución inicial, pero el banner se calcula a partir del aforo y los asistentes actuales. Así no promete escasez si realmente quedan muchas plazas. Muestra la cantidad exacta disponible; al alcanzar el aforo indica «Aforo completo» y, pasada la fecha, «Evento finalizado». La reserva y cancelación actualizan los datos que utiliza el mismo componente, reutilizado en tarjetas y fichas. El banner está en el bloque de texto, sin superponerse a los carteles. La lista extensa de asistentes tiene desplazamiento propio.

### Evidencia que recoger en MongoDB y en la web

Plan de capturas en `docs/screenshots/MongoDB/`. Las evidencias revisadas y sus nombres definitivos se enumeran al final de este bloque; siguen pendientes la versión EN y la reserva posterior a la precarga:

1. **mongodb-01-demo-events.png**: Atlas → Browse Collections → events. Filtrar `{ "seedKey": "leadership" }` y mostrar `seedKey`, `capacity`, `demoAttendance` y el array `attendees`. No mostrar credenciales ni URI.
2. **mongodb-02-demo-user.png**: users, filtrar `{ "email": "attendee-001@demo.kelsets.invalid" }`. Mostrar `_id`, `name`, `isDemo` y `attendingEvents`; ocultar el hash de `password`. El ObjectId del usuario debe estar en los asistentes del evento y el del evento en su lista inversa.
3. **mongodb-03-occupancy.png**: en Aggregations sobre events, usar el pipeline de abajo. Mostrar aforo, confirmadas y libres de las 12 charlas; comprobar que no hay valores negativos ni aforo superado.
4. **web-ocupacion-es.png / web-ocupacion-en.png**: mostrar las tarjetas de distintos periodos y sus banners en ambos idiomas. Los números deben coincidir con la agregación de MongoDB.
5. **mongodb-04-reserva-real.png**: con una cuenta de prueba normal, reservar una charla y comprobar ambas referencias y el incremento de asistentes. Cancelar después y verificar que se libera una plaza sin borrar los asistentes ficticios.

```json
[
  { "$match": { "demoAttendance": true } },
  { "$project": { "_id": 0, "seedKey": 1, "date": 1, "capacity": 1,
    "confirmadas": { "$size": "$attendees" },
    "libres": { "$subtract": ["$capacity", { "$size": "$attendees" }] } } },
  { "$sort": { "date": 1 } }
]
```

Validación de código: 17 pruebas backend y 42 frontend correctas, más build de producción. Se comprueban distribución trimestral, planificación repetible sin duplicados, conservación de reservas existentes y cambios de estado al llenarse o finalizar un evento. Las transacciones de esta carga no sustituyen la revisión pendiente de concurrencia del controlador público de reservas.

### Resultado de la carga local · 13/09/2026

Carga realizada en Atlas: 240 perfiles ficticios disponibles y 1.049 relaciones de asistencia distribuidas entre las 12 charlas editoriales. La comprobación posterior en lectura verifica que ningún evento supera el aforo, que no hay asistentes duplicados y que cada asistente ficticio de un evento conserva la referencia inversa. La API devuelve los recuentos y la marca de demostración. La charla creada manualmente se conserva con su reserva existente.

| Charla (`seedKey`) | Confirmadas | Libres |
| --- | ---: | ---: |
| leadership | 173 | 7 |
| data-questions | 131 | 9 |
| comeback | 135 | 5 |
| teamwork | 126 | 74 |
| pressure | 81 | 39 |
| last-quarter | 177 | 63 |
| small-experiments | 33 | 107 |
| trust | 30 | 130 |
| shared-decisions | 43 | 97 |
| innovation | 36 | 114 |
| resilience | 58 | 132 |
| team-agreements | 26 | 114 |

[Vista real de la agenda en castellano](docs/screenshots/MongoDB/web-ocupacion-es.png), revisada en navegador a 1440 px: los banners aparecen junto al texto, sin tapar las imágenes. Esta captura corresponde a la web, no a la consola de Atlas. Las capturas de Atlas revisadas se describen a continuación. La versión inglesa y el recorrido de reserva posterior a la precarga quedan pendientes de captura.

Se repitió la carga contra Atlas y las 12 charlas conservaron exactamente los mismos recuentos: no se añadieron reservas duplicadas. La creación de usuarios consulta los emails estables antes de insertar.

### Capturas de Atlas revisadas · 13/09/2026

| Evidencia | Qué demuestra |
| --- | --- |
| [01 · Proyecto y clúster](docs/screenshots/MongoDB/MongoDBAtlas-1.png) | Proyecto del máster y clúster kelsets-talks configurado. No acredita por sí sola las relaciones. |
| [02 · Colecciones](docs/screenshots/MongoDB/MongoDBAtlas-2%20kelsets%20talks.png) | Data Explorer muestra 13 eventos y 244 usuarios: 12 charlas editoriales más la creada en la web; 240 perfiles ficticios más cuatro cuentas existentes. |
| [03 · Filtro del evento](docs/screenshots/MongoDB/MongoDBAtlas-3%20events%20filter.png) | leadership: aforo 180, 173 asistentes, demoAttendance=true, fecha y ponente. Quedan 7 plazas, como en la web. |
| [04 · Asistentes desplegados](docs/screenshots/MongoDB/MongoDBAtlas-4%20asistentes.png) | Array de 173 referencias ObjectId, con las primeras 25 visibles y acceso a las 148 restantes. |
| [06 · Usuario ficticio](docs/screenshots/MongoDB/MongoDBAtlas-6%20usuario.png) | Lucía Vega, email de demostración, isDemo=true y 12 eventos; hash oculto en la versión publicada. |
| [07 · Referencias del usuario](docs/screenshots/MongoDB/MongoDBAtlas-7%20usuario%20detalles.png) | Los 12 ObjectId de attendingEvents desplegados, con hash oculto. |
| [08 · Editor de agregaciones](docs/screenshots/MongoDB/MongoDBAtlas-8%20events%20agregations.png) | Preparación de la consulta en events. El pipeline está vacío: esta captura es de contexto, no de resultados calculados. |
| [09 · Resultado de la agregación](docs/screenshots/MongoDB/MongoDBAtlas-9%20ocupacion.png) | Pipeline y vista previa de aforo, confirmadas y libres calculados desde los documentos. |

**Relación en ambos sentidos.** El identificador de Lucía Vega en la captura 07 coincide con el primer ObjectId de attendees del evento leadership (04). El primer identificador de attendingEvents de Lucía coincide con el _id de leadership (03–04). La evidencia acredita referencias persistidas entre las colecciones, no un contador independiente de la interfaz.

**Interpretación de la agregación.** La captura 09 filtra demoAttendance=true, ordena por fecha y proyecta charla, aforo, confirmadas y libres. Se ven completos leadership (180/173/7), data-questions (140/131/9), comeback (140/135/5), teamwork (200/126/74) y pressure (120/81/39). Los tres números expresan aforo/confirmadas/libres. Atlas muestra «Sample of 10 documents» y el panel tiene desplazamiento: la captura es una vista previa parcial, no una imagen de las 12 filas completas. La tabla completa anterior procede de la comprobación directa en Atlas mediante el script, que revisó las 12 charlas, duplicados, aforo y referencias inversas.

La consulta es de lectura y no modifica datos. Los totales reflejan el momento de la revisión y pueden cambiar con nuevas reservas. La captura 05 se descartó porque mostraba hashes de varias cuentas; no se publica. Las versiones iniciales sin ocultar el hash fueron sustituidas antes de añadir las capturas a Git.

Bloque de evidencia inicial de MongoDB completado. Siguen pendientes las capturas de Cloudinary, Mailtrap, la vista de banners EN, la reserva posterior a la precarga y el recorrido sobre las URLs desplegadas; no se consideran verificadas por estas imágenes.

## Evidencia visual de Cloudinary · 13/09/2026

La [captura del cartel en Cloudinary](docs/screenshots/Cloudinary/Cloudinary%20-1cartel%20charla.png) muestra el recurso deportivo utilizado para la charla «Liderazgo en entornos convulsos», dentro de `kelsets-talks/events`. En el panel Summary se observan formato JPG, tamaño 142.49 KB y dimensiones 1122 × 1402 píxeles. El recurso figura con acceso Public y creación mediante API el 12 de septiembre de 2026.

Esta evidencia acredita que el cartel está alojado en Cloudinary y permite reconocer el mismo recurso mostrado en la agenda. El Public ID identifica la imagen y no es una credencial. La captura no muestra API Key, API Secret ni tokens, por lo que es apta para el repositorio. Complementa la creación desde el formulario y la prueba 27 de Insomnia, que acredita por separado la respuesta de subida de un avatar con URL de Cloudinary. No demuestra por sí sola los casos de eliminación o sustitución de archivos ni el funcionamiento del despliegue.

## Corrección de imágenes en los correos de prueba

La plantilla construía las URLs del logo y de los carteles locales a partir de PUBLIC_APP_URL. Con una dirección localhost esas imágenes dependen del servidor del ordenador y no son accesibles desde servicios externos. El envío SMTP ahora adjunta el logo y el cartel editorial como buffers inline y los referencia mediante CID; los carteles públicos de Cloudinary mantienen su URL. Se conserva el diseño ES/EN y los enlaces autenticados para gestionar la reserva.

Los recursos finales se empaquetan en el backend para independizar el correo del servidor del frontend. Solo se admite la lista de carteles del catálogo, sin permitir que una ruta enviada por el usuario seleccione archivos arbitrarios. Pruebas backend: 18 correctas, incluida la comprobación de buffers, correspondencia CID, ausencia de localhost en src y conservación de URLs Cloudinary. La inclusión de archivos se ha declarado en Vercel; falta comprobar el despliegue. Los mensajes anteriores no se actualizan; la evidencia visual debe tomarse de mensajes nuevos.

Mailtrap Sandbox aceptó las nuevas muestras de confirmación ES y cancelación EN con logo y cartel incluidos. La cancelación necesitó un reintento. Se enviaron a una dirección ficticia del Sandbox sin modificar reservas. La aceptación SMTP no sustituye la revisión visual del HTML por la usuaria.

### Confirmación ES revisada visualmente en Mailtrap

- [Confirmación en escritorio](docs/screenshots/Mailtrap/Mailtrap%20-2%20email%20confirmacion%20sandbox.png): se ven el logo, el cartel completo, el título, fecha del 18/02/2027 a las 19:00 Europe/Madrid, ubicación y botón para gestionar la reserva. Confirma que las imágenes incluidas en el nuevo mensaje se visualizan en Mailtrap.
- [Confirmación en vista móvil](docs/screenshots/Mailtrap/Mailtrap%20-3%20email%20confirmacion%20responsive%20sandbox.png): cabecera, texto e imagen se adaptan al ancho del dispositivo simulado. La captura muestra la parte superior; no acredita por sí sola el pie y el botón inferior ni todos los clientes de correo.
- La captura 01 de la bandeja corresponde a un mensaje anterior con imágenes sin cargar. Se conserva como evidencia del problema inicial, no como resultado de la corrección.

Las muestras se identifican como «Araceli · muestra del proyecto» y se reciben en Sandbox, sin representar una reserva nueva ni entrega a un destinatario externo. La captura HTML de cancelación EN se revisó posteriormente y se describe a continuación.

### Cancelación EN revisada visualmente en Mailtrap

La [captura de cancelación en inglés](docs/screenshots/Mailtrap/Mailtrap%20-4%20email%20responsive%20english%20version%20sandbox.png) muestra el mensaje nuevo seleccionado en My Sandbox y su vista HTML con simulación de tableta. Se ven el logo, el encabezado «Your booking has been cancelled», el texto explicativo en inglés, la etiqueta BOOKING CANCELLED, el título traducido y la parte superior del cartel cargado. El destinatario es una dirección ficticia del Sandbox. El nombre de muestra conserva el texto en castellano porque es un dato del usuario, no una etiqueta de la plantilla.

La captura cubre la parte superior del mensaje; no muestra el botón inferior ni el pie. Junto a la confirmación ES en escritorio y móvil, completa la evidencia visual básica de ambos estados e idiomas. El indicador HTML Check visible contiene avisos que no se han analizado; no se presenta esta revisión como compatibilidad universal con todos los clientes de correo. No hay credenciales visibles.

Validación final antes del commit de correo y evidencias: 18 pruebas backend y 42 frontend correctas (60 en total), compilación de producción correcta y enlaces locales de documentación comprobados. Las copias del logo y los 12 carteles incluidas en el backend coinciden byte a byte con los recursos finales del frontend.

## Publicación en Vercel — 13/09/2026

Se han creado dos proyectos desde el mismo repositorio y el commit `da840d2`: frontend en https://kelse-ts-talks.vercel.app y backend en https://kelse-ts-talks-api.vercel.app/api. El frontend usa Vite, raíz `frontend`, `VITE_API_URL` apuntando a la API publicada y `VITE_PREVIEW_MODE=false`. El backend usa Express, raíz `backend`, con credenciales y configuración SMTP en variables privadas de Vercel. Los enlaces de correo y CORS apuntan al dominio público de la web.

El primer acceso a la API devolvió 503: Atlas solo admitía la IP doméstica. Tras autorización expresa de la usuaria, se añadió la regla `0.0.0.0/0` sin caducidad para la demostración y corrección. Esta regla admite intentos de conexión desde cualquier IPv4 y mantiene la autenticación obligatoria. Una vez aplicada, `/api/health` respondió 200; `/api/events` devolvió las 13 charlas con CORS correcto. La home pública muestra la agenda de Atlas y la ruta directa `/events` responde 200.

Se ha preparado `backend/.env.entrega`, ignorado por Git, para enviarlo por el canal privado de corrección solicitado en las indicaciones aportadas por la usuaria. El repositorio conserva `.env.example` con marcadores y referencias a las URLs públicas. El archivo privado no contiene claves de HeyGen ni ElevenLabs. Pendientes: repetir el recorrido autenticado completo sobre producción, comprobar el correo desde ese flujo y recoger capturas de Vercel. Ver [guía de despliegue](docs/DESPLIEGUE.md).

## Preparación de Vercel y consistencia de reservas — 13/09/2026

Cada petición de la API espera a MongoDB. Las peticiones concurrentes reutilizan una única promesa de conexión; si falla, se permite un nuevo intento y se devuelve un error 503 comprensible. En Vercel se exporta Express sin arrancar un servidor con `listen`; el arranque local sigue esperando a MongoDB.

La reserva y la cancelación escriben `Event.attendees` y `User.attendingEvents` dentro de una transacción. Así, un fallo en la segunda colección no deja una plaza ocupada sin su referencia inversa. La eliminación también retira conjuntamente el evento y las referencias de usuarios. Los correos se envían después del commit, para no duplicarlos durante los reintentos de MongoDB. La retirada de Cloudinary ocurre después del borrado confirmado; un fallo de ese servicio puede dejar una imagen pendiente de limpieza.

El control de versiones del evento evita guardar una edición basada en un aforo o una lista de asistentes obsoletos: se devuelve 409 y se solicita recargar la ficha. El límite de carteles y avatares se reduce a 4 MB, dejando margen al multipart dentro del [límite de 4,5 MB de Vercel](https://vercel.com/docs/functions/limitations). Los mensajes nuevos se ofrecen en castellano e inglés.

Validación: 19 pruebas backend y 42 frontend, más una prueba de integración real contra una base temporal de Atlas. Esta última comprueba dos usuarios compitiendo por una plaza, cancelación, rechazo de edición obsoleta, reversión ante un fallo simulado de escritura y eliminación de referencias. No envía correos y elimina su base temporal al terminar. Se ejecuta desde `backend` con `RUN_DB_INTEGRATION=true node --test test/attendance.integration.test.js`; requiere `MONGODB_URI` y permiso para crear y eliminar esa base de pruebas. En `npm test` se omite para no depender de la red. Compilación de producción correcta. Queda por verificar el despliegue público y añadir sus capturas.

## Recuperación de contraseña con Mailtrap — 19/09/2026

Se incorpora «¿Has olvidado tu contraseña?» al acceso, con solicitud de enlace y formulario de nueva contraseña en castellano e inglés. El montaje de entrega utiliza Mailtrap Sandbox: el mensaje se consulta allí y no llega a la bandeja personal. El aviso está visible en la pantalla de recuperación.

El enlace caduca en 30 minutos, se almacena como hash SHA-256 y se consume mediante una actualización atómica. Solicitar otro sustituye el anterior. La contraseña se guarda con bcrypt y el cambio invalida las sesiones previas mediante una versión de sesión. La API no revela si el correo existe. Los límites se persisten en MongoDB para funcionar entre instancias de Vercel. Las páginas no se indexan y el token se transporta en el fragmento del enlace y después mediante POST HTTPS.

La [guía de recuperación de contraseña](docs/RECUPERACION-CONTRASENA.md) recoge el flujo completo, los límites y las pruebas, además del procedimiento exacto para pasar a correo real: dominio y DNS, aprobación en Mailtrap, credenciales SMTP transaccionales, variables privadas de Vercel, redepliegue, retirada del aviso de Sandbox y validación de entrega. También identifica las mejoras pendientes (notificación de cambio, supervisión, límites globales y cola/reintentos). No se declara implementada ni probada la entrega a buzones reales.

Validación: 73 pruebas ordinarias correctas y una integración adicional de recuperación en una base temporal real de Atlas, con dos cambios concurrentes y revocación de sesión. Build y verificación de 14 documentos HTML correctos. La prueba automatizada de integración no envía correo. Tras el despliegue del commit `547235b` en ambos proyectos Vercel, se verificaron por HTTP las páginas y los endpoints de recuperación. La titular confirmó haber recuperado su contraseña mediante Mailtrap y haber iniciado sesión correctamente en la web publicada. Esta evidencia es su confirmación en la sesión del 19/09/2026, sin captura; no se incluyen enlaces de recuperación, contraseñas ni secretos. La caducidad, el uso único y la revocación de sesiones se acreditan mediante la integración automatizada, no mediante esa confirmación manual.


## Reserva y cancelación en producción — 19/09/2026

Tras recuperar el acceso, la titular reservó «The Next Inch: liderazgo» en la web publicada. Se comprobó directamente en Chrome su nombre en la lista de participantes y el aviso «¡Tu plaza está confirmada!». La ficha mostraba 174 de 180 plazas confirmadas y seis disponibles. La titular confirmó la recepción del correo de reserva en Mailtrap Sandbox.

A continuación, la titular confirmó haber cancelado desde la web: la asistencia quedó desmarcada, aumentó el contador de plazas disponibles, apareció el mensaje de cancelación y recibió el correo correspondiente en Mailtrap. La cancelación y la recepción de los dos correos se acreditan mediante su confirmación en la sesión de trabajo; no se guardaron capturas nuevas de estos pasos. Esta comprobación corresponde a Sandbox, no a entrega en un buzón personal. No acredita todavía la creación/edición de eventos ni la subida de ficheros en producción.

## Edición desde la web — 19/09/2026

La prueba de entrega detectó que la API admitía editar eventos, pero faltaban el botón y la pantalla en el frontend. Se añade «Editar experiencia» para creadores y administradores, con ruta protegida, datos precargados, PATCH, estados de carga y errores ES/EN. La API conserva su control de permisos. El formulario mantiene el cartel y la fecha original si no se modifican; las fechas nuevas se envían como ISO con zona horaria. Vercel admite el enlace directo y noindex.

52 pruebas frontend, build y comprobación de 14 documentos HTML correctos. Corrección publicada en `f249d31`, con autoría y committer de Araceli Fradejas Muñoz y ambos despliegues Vercel correctos.

La titular confirma la creación de «Tu mente y la presión» para el 15/03/2027 y el cambio satisfactorio de descripción y hora. Se observan en Chrome «Editar experiencia», «Cambios guardados» y el texto que comienza «Pedir apoyo también es avanzar». Una consulta independiente a la API pública confirma el texto persistido, el ponente Travis Wood y la URL del cartel. La fecha almacenada es `2027-03-15T18:30:00.000Z`, mostrada como 19:30 en Madrid. Queda verificado el guardado de texto y hora en producción; no se ha probado sustituir el cartel durante una edición.

## Avisos sin acumulación — 19/09/2026

La titular detectó que los mensajes de acciones sucesivas se acumulaban en la esquina inferior derecha. Se modifica el proveedor común para mostrar únicamente el aviso más reciente: cada nuevo mensaje sustituye al anterior, tanto en confirmaciones como en errores. El aviso puede cerrarse manualmente y no tiene temporizador de lectura. Se conserva la región accesible `aria-live=polite` y se añade `aria-atomic=true` para anunciar el mensaje completo. Compilación de producción y verificación de 14 documentos HTML correctas.

La titular también confirma que, tras seleccionar de nuevo el cartel de «Tu mente y la presión», guardar y recargar, la imagen permanece visible. Queda comprobada esta operación de imagen en producción mediante su confirmación.

## Capturas finales guardadas — 19/09/2026

Se incorporan [nueve capturas reales de producción](docs/screenshots/entrega-2026-09-19/README.md): los dos despliegues Vercel Ready del commit d549df9, charla con cartel y botón de edición, descripción guardada, formulario precargado, correos de confirmación y cancelación en Mailtrap y pantalla de recuperación. Los mensajes observados corresponden a «Tu mente y la presión», con fecha 15/03/2027 a las 19:30. Se guardaron después de las comprobaciones manuales: las referencias anteriores a ausencia de capturas describen el momento de aquellas pruebas.

Las vistas de correo omiten la dirección personal. No se incluyen credenciales, contraseñas ni enlaces de recuperación. La titular confirma también que la sustitución de avisos funciona correctamente y sin acumulación; no se reproduce artificialmente ese estado para una captura.


## Contraste final con el enunciado — 19/09/2026

Se revisó el texto íntegro de la actividad aportado por la titular, con [trazabilidad de cada requisito a su implementación](docs/COMPROBACION-ENUNCIADO.md). No se identifican funcionalidades obligatorias ausentes. Se refuerzan dos estados asíncronos: indicador de sesión en la cabecera y estado ocupado del botón de compartir. Pruebas ordinarias: 76 correctas; build y 14 documentos HTML correctos.

Se conserva el monorepo con enlaces independientes a frontend y backend: el enunciado pide ambos enlaces de GitHub, sin imponer dos repositorios. Los carteles acreditan el requisito de subida de ficheros; una pantalla de avatar no es obligatoria. La entrega se realiza en la actividad y la corrección por mensaje privado en el foro.
