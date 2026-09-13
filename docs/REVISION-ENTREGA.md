# Revisión frente al enunciado del máster

Revisión de código y de las comprobaciones realizadas en local. No equivale a una validación completa de producción.

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
3. Desplegar frontend y backend y repetir el recorrido de usuario y pruebas sobre las URLs públicas. Configurar VITE_API_URL, FRONTEND_URL, MongoDB, JWT y Cloudinary por proyecto.
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
