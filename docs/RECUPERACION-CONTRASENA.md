# Recuperación de contraseña y paso a correo real

## Alcance de la entrega

La pantalla de acceso incluye «¿Has olvidado tu contraseña?». `/forgot-password` solicita el correo y `/reset-password` permite elegir y confirmar una contraseña. Formularios, errores y mensajes de correo están disponibles en ES/EN. Las páginas de recuperación tienen `noindex`, `no-store` y `Referrer-Policy: no-referrer`; no aparecen en el sitemap. El aviso de la demo explica que los mensajes se capturan en Mailtrap Sandbox.

La configuración SMTP existente se reutiliza: no hacen falta nuevas claves ni instalar dependencias. En Vercel, `PUBLIC_APP_URL` debe apuntar a `https://kelse-ts-talks.vercel.app`. Sandbox no entrega mensajes a la bandeja personal. Quien tenga acceso al Sandbox puede ver los enlaces: este montaje se destina a la demostración educativa, no a usuarios reales.

## API y seguridad implementada

| Petición | Cuerpo JSON | Resultado |
| --- | --- | --- |
| `POST /api/auth/forgot-password` | `email`, `language` (`es` o `en`) | Respuesta neutra sin revelar si existe la cuenta, ni devolver el token |
| `POST /api/auth/reset-password` | `token`, `password` | Cambia la contraseña, consume el enlace e invalida las sesiones anteriores |

El servidor genera 32 bytes aleatorios y almacena exclusivamente su hash SHA-256 y la fecha de caducidad (30 minutos). Una nueva solicitud admitida sustituye el enlace anterior. Los campos se excluyen de las consultas ordinarias de usuarios. No se admiten cuentas de demostración. El enlace contiene el token en el fragmento `#token=…`, que el navegador no envía al servidor al cargar la página; React lo transmite únicamente al confirmar el cambio mediante POST HTTPS. Abrir el correo o visitar el enlace no cambia nada.

La actualización compara y consume el token de forma atómica en MongoDB: dos peticiones simultáneas no pueden usarlo dos veces. La nueva contraseña se almacena como hash con bcrypt, coste 12; admite al menos 8 caracteres y como máximo 72 bytes UTF-8. Se incrementa `sessionVersion` y el middleware rechaza los JWT anteriores. El cambio no inicia sesión automáticamente. Las sesiones antiguas sin versión se interpretan como versión cero hasta el primer cambio.

La colección `RecoveryLimit` comparte límites entre instancias de Vercel: tres solicitudes por correo y diez intentos por token en ventanas fijas de 15 minutos. Las claves contienen hashes y el índice TTL retira los registros caducados. Una ventana fija puede permitir ráfagas al cambiar de intervalo; no sustituye un control global por IP. La respuesta de solicitud espera un mínimo de 6,5 segundos; SMTP tiene un plazo máximo de 5 segundos. Una base de datos lenta puede superar ese mínimo. Un fallo de envío elimina el token pendiente si todavía corresponde a esa solicitud y devuelve el mismo mensaje neutro. La ausencia global de configuración devuelve 503 para todos los correos.

El transporte exige TLS, limita los tiempos de conexión y no carga ficheros ni URLs arbitrarios. No se escriben contraseñas, enlaces ni tokens en los logs de esta funcionalidad. Las medidas siguen las recomendaciones de [OWASP sobre recuperación de contraseña](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html). No hay cola ni reintentos automáticos, ni correo adicional notificando el cambio: son mejoras pendientes para un servicio real.

## Recorrido de demostración con Mailtrap

1. Abrir la web publicada y pulsar «¿Has olvidado tu contraseña?».
2. Introducir el correo de una cuenta registrada y solicitar un enlace una sola vez.
3. En Mailtrap, abrir **My Sandbox** y el mensaje nuevo de recuperación. Comprobar destinatario y hora; utilizar únicamente el más reciente.
4. Abrir el botón del mensaje. Debe llevar al frontend público por HTTPS.
5. La persona que recupera el acceso introduce la nueva contraseña, la confirma y envía el formulario.
6. Iniciar sesión con ella. El enlace utilizado debe quedar rechazado; la contraseña anterior ya no permite entrar.

Para las capturas de la memoria, ocultar dirección personal y barra de direcciones si contiene el token. No capturar credenciales SMTP ni guardar el enlace en el repositorio.

## Procedimiento exacto para activar correo real

1. Disponer de un dominio propio y acceso a su DNS. En Mailtrap, añadirlo en **Domains**. Copiar los registros y valores que Mailtrap entregue para ese dominio (verificación, DKIM, seguimiento y DMARC), sin inventar valores ni sustituir registros existentes a ciegas. Completar los datos del remitente, verificar DNS y esperar la aprobación del dominio. La propagación puede demorar el cambio. Véase [configuración oficial del dominio](https://docs.mailtrap.io/email-api-smtp/setup/sending-domain).
2. En **API/SMTP → Sending Setup**, elegir el dominio verificado, **Transactional Stream** y **SMTP**. Copiar las credenciales de ese dominio, distintas de Sandbox. La integración oficial utiliza `live.smtp.mailtrap.io`, puerto 587, usuario `api` y el token del dominio como contraseña. Confirmar los valores mostrados en la cuenta antes de aplicarlos. Véase [integración SMTP oficial](https://docs.mailtrap.io/email-api-smtp/setup/smtp-integration).
3. En Vercel, proyecto **kelse-ts-talks-api → Settings → Environment Variables → Production**, sustituir la configuración de Sandbox por:

```dotenv
MAIL_ENABLED=true
SMTP_HOST=live.smtp.mailtrap.io
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=api
SMTP_PASSWORD=<credencial privada del dominio verificado>
MAIL_FROM="KelseTS Talks <acceso@TU-DOMINIO-VERIFICADO>"
PUBLIC_APP_URL=https://kelse-ts-talks.vercel.app
```

`SMTP_SECURE=false` en el puerto 587 usa STARTTLS obligatorio en nuestro transporte; no desactiva TLS. Los marcadores anteriores no son valores válidos. Guardar los secretos solo en el backend, nunca en variables `VITE_*`, documentación, capturas o Git. Mantener `FRONTEND_URL` con el origen público permitido por CORS. Redeplegar la API para aplicar las variables. La configuración se comparte con los correos de reservas: también pasarán a envío real.

4. Antes de abrir el servicio a usuarios, desactivar el seguimiento de clics/aperturas para estos mensajes en la configuración del proveedor y comprobar que no reescribe ni registra enlaces de recuperación. Ajustar el frontend para retirar el aviso de Sandbox y volver a desplegarlo. Si cambia el dominio de la web, actualizar `PUBLIC_APP_URL`, CORS y metadatos/canonicals conjuntamente.
5. Con una cuenta controlada, solicitar recuperación y comprobar recepción real, remitente, SPF/DKIM/DMARC y enlace HTTPS correcto. Revisar Inbox y spam, además de los logs del proveedor; aceptación SMTP no equivale a entrega. Probar ES/EN, enlace caducado, enlace sustituido, reutilización rechazada, nueva contraseña y revocación de sesión previa. No habilitar públicamente hasta completar estas pruebas.
6. Añadir supervisión de errores y rebotes, límites globales de abuso, notificación del cambio de contraseña y una estrategia de cola/reintentos que respete caducidad y sustitución de tokens. Revisar acceso al proveedor, conservación de datos y retirada del acceso abierto de Atlas usado en la demostración. Estas mejoras no se presentan como implementadas en esta entrega.

## Validación realizada — 19/09/2026

- 24 pruebas backend y 49 frontend correctas: 73 pruebas ordinarias. Las dos integraciones de red se omiten en la ejecución ordinaria.
- Integración de recuperación ejecutada separadamente contra una base temporal de Atlas: enlace sustituido, caducidad, consumo concurrente de un solo uso, bcrypt, límite compartido y revocación de JWT. Correcta; elimina su base temporal al terminar y utiliza un emisor simulado, sin enviar correos.
- Comando desde `backend`: `RUN_DB_INTEGRATION=true node --test test/recovery.integration.test.js`. Requiere las credenciales locales de Atlas y permiso para crear/eliminar la base temporal.
- Compilación y comprobación de 14 documentos HTML, incluyendo las nuevas rutas privadas. Comprobación visual del formulario de solicitud y del resumen de errores con foco.
- Despliegue del commit `547235b` completado en los dos proyectos Vercel. Verificadas las páginas públicas (200, noindex, no-store y no-referrer), el rechazo de entradas inválidas (400) y la respuesta neutra para una dirección inexistente (200).
- He comprobado el recorrido manual en la web publicada: recuperación mediante el mensaje de Mailtrap, cambio de contraseña e inicio de sesión posterior satisfactorio. Prueba manual del 19/09/2026; no se han guardado contraseña, token ni captura de ese recorrido.
- Caducidad, reutilización y revocación de sesiones cuentan con la prueba de integración; no se atribuyen a esta comprobación manual. La recepción en Sandbox no acredita entrega a buzones reales.
