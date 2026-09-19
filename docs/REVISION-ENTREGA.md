# Revisión frente al enunciado del máster

Revisión de código, pruebas y comprobaciones de producción. Las secciones fechadas conservan el historial; el estado final siguiente prevalece sobre sus pendientes antiguos.

## Estado final de la sesión — 19/09/2026

- Frontend y API publicados; salud comprobada. Memoria y nueve capturas finales subidas en `0df8d7e`.
- Recuperación de contraseña e inicio de sesión, reserva/cancelación y correos Sandbox comprobados con la titular.
- Creación con cartel, edición de descripción/hora y persistencia de imagen tras guardado y recarga comprobadas. Botón de edición corregido en `f249d31`.
- Avisos sustituidos por el mensaje más reciente; funcionamiento confirmado por la titular.
- 76 pruebas ordinarias correctas, build y comprobaciones HTML correctos. Integraciones de Atlas documentadas separadamente.
- Pendientes de entrega: enviar los enlaces en el apartado de la actividad y facilitar el archivo de entorno por el canal privado indicado. Enunciado completo revisado: se aportan ambos enlaces de carpetas del monorepo; no exige repositorios independientes. El envío al campus no se ha realizado.
- Límites: sustitución de avatar no repetida en producción y colección completa de Insomnia no repetida contra la API pública; existen sus evidencias locales. Correo probado en Sandbox, no en buzones reales. No se declara certificación integral de accesibilidad.

Texto y enlaces listos en [ENTREGA.md](ENTREGA.md); [capturas finales](screenshots/entrega-2026-09-19/README.md).

## Retoma y cierre de entrega — 19/09/2026

Comprobaciones repetidas en esta fecha:

- `npm test`: 19 pruebas backend y 42 frontend correctas. La prueba de integración con una base temporal de Atlas se omite en la ejecución ordinaria; no se ha repetido hoy.
- `npm run build`: compilación de producción correcta.
- Web pública y `/api/health`: HTTP 200; salud devuelve `success: true`.
- `/api/events`: HTTP 200 y 13 eventos. La cabecera CORS permite `https://kelse-ts-talks.vercel.app`.
- `backend/.env.entrega` está excluido de Git. No se han mostrado ni revisado sus valores en esta comprobación.

Estas comprobaciones HTTP no acreditan el recorrido visual ni autenticado. No había un navegador conectado en la sesión de revisión.

Revisión adicional de accesibilidad, SEO y GEO: [hallazgos, correcciones y límites](ACCESIBILIDAD-SEO.md). Tras esta revisión el frontend tiene 45 pruebas correctas (64 ordinarias entre ambos proyectos). Mejoras publicadas en Vercel: 18 comprobaciones HTTP correctas y login revisado visualmente en Chrome. Sigue pendiente el recorrido autenticado completo.

Orden de cierre para entregar hoy o, como máximo, mañana:

1. **Recorrido público autenticado:** registro con inicio automático, cierre e inicio de sesión, persistencia al recargar, reserva y cancelación. Comprobar el contador y recoger capturas sin tokens ni contraseñas.
2. **Formularios y ficheros:** crear una charla de prueba con cartel, editarla y comprobar avatar, errores de validación y estados de carga. Identificar los datos de prueba antes de limpiar; conservar las charlas existentes.
3. **Evidencia final:** capturas de los dos proyectos Vercel y una revisión móvil y ES/EN. Repetir los casos pendientes de Insomnia contra la API pública y registrar resultados reales.
4. **Paquete de entrega:** enlaces a web, API, repositorio y carpetas frontend/backend; README y memoria; archivo de entorno únicamente por el canal privado indicado por el máster. Texto preparado en [ENTREGA.md](ENTREGA.md).

El correo real y la publicación de vídeos en YouTube son extras y no bloquean los requisitos funcionales recogidos en esta revisión. El correo actual se documenta como Mailtrap Sandbox. Las secciones siguientes conservan el historial; las menciones a despliegue pendiente corresponden a comprobaciones anteriores.

| Requisito | Estado y evidencia |
| --- | --- |
| Express, JWT, Bcrypt, Mongoose, CORS, Nodemon | Implementados en backend/package.json y src. |
| Usuario con contraseña hashed | User.js usa bcrypt en pre-save; registro y login probados en navegador. Formato de email y tipos validados; caso negativo 28 revisado en Insomnia. |
| Evento y array de IDs de asistentes | Event.js y toggleAttendance. Reserva/cancelación probadas contra Atlas. |
| Middleware JWT y rutas privadas | auth.js y rutas auth/events. Casos 06–07 y 16–17 revisados en Insomnia con dos usuarios. |
| Subida de ficheros | Cartel y avatar probados mediante API con Cloudinary; creación desde la web confirmada por la usuaria. |
| Controladores de ordenación | Fecha, publicación y popularidad en listEvents. Evidencias locales 08–09 revisadas. |
| Inserción entre colecciones | Asistencia enlaza Event.attendees y User.attendingEvents en una transacción. Concurrencia, reversión ante fallos y eliminación de referencias verificadas en una base temporal de Atlas. |
| Registro con login automático | Probado en navegador. |
| Lista, creación y asistencia | Funcionan en local. |
| Detalle y asistentes | Implementado y comprobado en recorrido local. |
| Errores en todos los formularios | Validaciones reforzadas de tipos, email, aforo/longitudes y errores Multer/JSON. Casos negativos revisados en Insomnia; queda la auditoría completa de formularios y fallos de red. |
| Loading en procesos asíncronos | Formularios, agenda y reservas muestran estados. Completar revisión de sesión/carga y casos de red fallida antes de entregar. |
| Componentización y reutilización | Componentes, hooks, contextos y servicios separados. Revisar duplicación residual de catálogos/validaciones; no afirmar que es inexistente. |
| Fetch centralizado | Única llamada fetch de aplicación en frontend/src/services/api.js. |
| Backend y frontend desplegados | Publicados en Vercel: kelse-ts-talks.vercel.app y kelse-ts-talks-api.vercel.app. Salud, agenda de 13 eventos y CORS comprobados. Falta repetir el recorrido autenticado completo y recoger las capturas. |
| Enlaces GitHub | Monorepo existente. Facilitar enlaces directos a backend y frontend y confirmar si el profesor exige dos repositorios independientes. |

## Antes de entregar

1. Subida de avatar comprobada en la prueba 27. Ampliar evidencia de sustitución y fallos: el helper de imágenes retira el avatar anterior después de guardar.
2. Revisión local cerrada: 28 casos correctos, avatar con URL Cloudinary y captura 15 con token oculto. Repetir sobre producción antes de entregar.
3. Frontend y backend ya están desplegados. Completar el recorrido de usuario y las pruebas autenticadas sobre las URLs públicas.
4. Documentar instalación, variables sin secretos, arquitectura, pruebas y enlaces finales.

## Correo (extra, no exigido por el enunciado)

HTML y texto ES/EN implementados; Mailtrap Sandbox configurado en local y confirmación/cancelación verificadas. Mailtrap Sandbox permite verificar correos en su bandeja de pruebas; no implica entrega a Gmail ni otros destinatarios reales. Para envío real habrá que configurar un servicio y remitente autorizados.

El botón abre la ficha y requiere sesión para cancelar; no cancela al abrir el enlace. Antes de entrega, PUBLIC_APP_URL debe ser la URL pública de la web para que enlaces e imágenes funcionen desde otros dispositivos. Probar fallos de envío y comunicar su estado al usuario si el correo forma parte del flujo prometido.

Última validación completa previa a esta auditoría: 11 pruebas backend + 41 frontend y compilación correctas. No cubren todos los casos del enunciado.

## Actualización tras corregir validaciones

Se han corregido email y tipos de credenciales, aforo entero, fechas futuras en las escrituras, errores de JSON y Multer, mensajes internos no expuestos, y validación previa a subir imágenes. Un helper compartido gestiona cartel/avatar y la retirada del recurso sustituido. El frontend comprueba aforo y límites de longitud.

Resultado: 15 pruebas backend, 41 frontend y build correctos. Además, 29 comprobaciones HTTP reales correctas mediante el ejecutor de la colección (ver insomnia/RESULTADO-HTTP.md), incluyendo dos usuarios, permisos, aforo, email inválido, JSON malformado y fichero demasiado grande. La colección ya se ejecutó en Insomnia: 28 capturas revisadas con resultado esperado, incluida la repetición de la subida de avatar.

Mailtrap Sandbox ya acepta confirmación ES y cancelación EN, con capturas enlazadas en docs/CORREO.md. Queda la verificación con URLs públicas tras el despliegue.

## Preparación del despliegue — 13/09/2026

La API espera la conexión con MongoDB antes de atender peticiones y reutiliza una conexión compartida durante el arranque. Un fallo devuelve 503 sin exponer detalles internos. Las reservas, cancelaciones y eliminaciones usan transacciones; las ediciones detectan cambios concurrentes y devuelven 409. El correo se envía después de confirmar la transacción.

El límite de imágenes pasa a 4 MB en frontend y backend, por el límite de 4,5 MB por petición de Vercel. Las pruebas ordinarias pasan (19 backend y 42 frontend), además de una prueba de integración real en Atlas: aforo con dos reservas simultáneas, cancelación, edición obsoleta, reversión de una escritura fallida y borrado de referencias. La base temporal se elimina al terminar y no se envían correos. Compilación de producción correcta. El despliegue público aún no está verificado.

### Recuperación de acceso — 19/09/2026

Implementados solicitud y cambio de contraseña con Mailtrap Sandbox, ES/EN, enlaces temporales de un solo uso y revocación de sesiones. Pruebas ordinarias: 73 correctas; integración real de recuperación en Atlas: correcta. [Configuración y paso a correo real](RECUPERACION-CONTRASENA.md). Despliegue y comprobaciones HTTP correctos. La titular confirma haber recuperado su contraseña mediante Mailtrap e iniciado sesión en la web publicada. Quedan separados de esta validación los recorridos de reserva/cancelación y edición de eventos.


### Reserva y cancelación públicas — 19/09/2026

Reserva observada en Chrome: titular incluida en participantes y aviso de plaza confirmada. La titular confirma los correos de reserva y cancelación en Mailtrap y, al cancelar desde la web, asistencia desmarcada, aumento de plazas disponibles y mensaje de cancelación. Recorrido cerrado con confirmación de la titular, sin nuevas capturas guardadas. Continúan pendientes la creación/edición de eventos y subida de ficheros en producción, además del paquete final de entrega.

### Edición en la interfaz — 19/09/2026

Creación de «Tu mente y la presión» para el 15/03/2027 confirmada por la titular. Se detectó y corrigió la ausencia de edición en el frontend; la API ya la permitía. Añadidos botón y formulario protegido ES/EN, conservando cartel y fecha sin modificar. 52 pruebas frontend y build correctos. Corrección publicada en `f249d31` bajo autoría de la titular. Esta confirma el cambio de texto y hora; se observa «Cambios guardados» y una consulta independiente a la API verifica descripción y fecha persistidas, Travis Wood y URL del cartel. No se ha probado sustituir el cartel durante una edición.

## Contraste con el enunciado completo

[Revisión final requisito a requisito](COMPROBACION-ENUNCIADO.md): requisitos funcionales cubiertos; cabecera de sesión y acción compartir con feedback de carga reforzado. No se exige pantalla de avatar ni dos repositorios separados.
