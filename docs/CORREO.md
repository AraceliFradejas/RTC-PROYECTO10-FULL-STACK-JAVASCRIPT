# Correo de asistencia: validación en Mailtrap Sandbox

Las plantillas HTML y texto de confirmación/cancelación en ES/EN y la integración SMTP ya están incluidas en el commit 60654e2. Se ha configurado y probado el envío local con Mailtrap Sandbox.

## Evidencia de la comprobación

- Autenticación SMTP con TLS correcta.
- Confirmación en castellano y cancelación en inglés aceptadas por Mailtrap. La cancelación necesitó un reintento.
- La usuaria confirma que ambas plantillas se ven correctamente en la bandeja de Mailtrap.
- Los mensajes se generaron como muestras, sin modificar reservas reales.
- Queda pendiente probar el recorrido completo de reserva/cancelación desde la web con SMTP activo y documentarlo con capturas.

## Configuración local

En backend/.env, que está excluido de Git:

```dotenv
MAIL_ENABLED=true
MAIL_FROM="KelseTS Talks <reservas@kelsets.example>"
PUBLIC_APP_URL=http://127.0.0.1:5173
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=usuario-del-sandbox
SMTP_PASSWORD=contraseña-del-sandbox
```

Los valores de usuario y contraseña anteriores son marcadores, no credenciales. SMTP_SECURE=false en este puerto utiliza STARTTLS obligatorio en nuestro servicio. Al cambiar el .env, reiniciar la API.

Sandbox captura los correos en Mailtrap; no los entrega a Gmail ni a otros destinatarios reales. El remitente .example se utiliza solo para estas pruebas. El enunciado del máster no exige el envío real: documentar esta funcionalidad como un extra en modo de pruebas.

## Antes del despliegue

Configurar las variables en el proyecto backend de Vercel y cambiar PUBLIC_APP_URL a la dirección pública del frontend para que funcionen los botones y carteles fuera del ordenador. Mantener el host Sandbox si se conserva el modo de pruebas. La web no debe prometer entrega a una bandeja personal.

El botón del correo abre la ficha: cancelar requiere una sesión válida y una acción explícita. Abrir un enlace no altera la reserva. Un fallo de correo no revierte la asistencia; actualmente no hay reintentos automáticos.

## Capturas para la memoria

En My Sandbox, abrir la confirmación ES y seleccionar la vista HTML; repetir con la cancelación EN. Capturar el diseño, el cartel y el botón, sin mostrar Integration/Credentials. Guardar como 14-mailtrap-confirmacion-es.png y 15-mailtrap-cancelacion-en.png. Indicar en el pie que son correos recibidos en Sandbox. Las capturas revisadas se enlazan al final de este documento.

## Imágenes incluidas en el mensaje

El envío SMTP incorpora el logo y los carteles del catálogo local como adjuntos inline con identificadores `cid:`. Los bytes viajan en el correo: esas imágenes no necesitan que el destinatario pueda acceder a localhost. Los carteles con URL pública de Cloudinary conservan su URL HTTPS. Se mantiene desactivado el acceso automático a ficheros y URLs de Nodemailer; solo se leen buffers de una lista cerrada de recursos aprobados.

`src/emails/assets/` contiene copias finales de distribución del logo y de los 12 carteles. Deben sincronizarse si se cambia el original correspondiente en `frontend/public/images/`; no son nuevas versiones de diseño. `backend/vercel.json` incluye esos recursos en la función. Su empaquetado en Vercel queda pendiente de comprobar durante el despliegue.

Las vistas HTML locales generadas con `email:preview` conservan URLs normales para que puedan abrirse en un navegador. El envío SMTP añade las referencias CID, según el mecanismo de [imágenes incrustadas de Nodemailer](https://nodemailer.com/message/embedded-images). Los correos ya recibidos no cambian: para revisar la corrección hay que abrir un mensaje nuevo. Los botones siguen usando PUBLIC_APP_URL; habrá que actualizarlo con la URL de Vercel. Algunos clientes pueden aplicar sus propias restricciones de visualización; las capturas de los mensajes nuevos se han revisado y se enlazan abajo.

## Capturas verificadas tras incluir las imágenes

Revisadas la [confirmación ES en escritorio](screenshots/Mailtrap/Mailtrap%20-2%20email%20confirmacion%20sandbox.png) y su [vista móvil](screenshots/Mailtrap/Mailtrap%20-3%20email%20confirmacion%20responsive%20sandbox.png): logo y cartel visibles. La imagen móvil solo muestra la parte superior. La captura 01 de bandeja es anterior a la corrección y muestra imágenes rotas; no se usa como evidencia del resultado final. Cancelación EN revisada en la captura siguiente.

[Cancelación EN en vista de tableta](screenshots/Mailtrap/Mailtrap%20-4%20email%20responsive%20english%20version%20sandbox.png): logo, encabezado de cancelación, texto inglés y cartel visibles. La imagen no incluye el botón inferior ni el pie. Confirmación ES y cancelación EN cuentan ya con evidencia visual en Sandbox; quedan pendientes la revisión de avisos HTML Check y la comprobación tras desplegar.
