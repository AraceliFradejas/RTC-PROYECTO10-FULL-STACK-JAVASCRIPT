# Capturas para la memoria del proyecto

Hacer las capturas después de verificar cada recorrido. En Mac: ⌘⇧4 para seleccionar una zona. Guardar las imágenes en `docs/capturas/` con estos nombres. Usar cuentas de demostración y ocultar cualquier información personal ajena al proyecto.

La memoria debe explicar qué demuestra cada captura. Una pantalla de configuración no sustituye una prueba de funcionamiento. Marcar la evidencia como local o desplegada y anotar la fecha.

| Archivo | Cómo obtenerla | Qué demuestra |
| --- | --- | --- |
| 01-home-es.png | Abrir la portada en castellano; capturar cabecera y contenido principal. | Identidad visual y navegación. |
| 02-agenda-en.png | Cambiar a EN y mostrar la agenda con carteles. | Interfaz bilingüe y datos reales. |
| 03-registro-error.png | Abrir Crear cuenta y enviar campos inválidos. | Validación y mensajes útiles. No mostrar contraseñas. |
| 04-sesion-iniciada.png | Registrarse con una cuenta de prueba; mostrar el saludo y Proponer charla. | Inicio automático tras registro y opciones privadas. |
| 05-formulario-evento.png | Completar título, fecha, lugar, ponente y cartel antes de publicar. | Creación de eventos y subida de ficheros. |
| 06-evento-publicado.png | Mostrar la ficha de la charla creada, con cartel y ponente. | Persistencia y detalle. |
| 07-reserva-confirmada.png | Reservar con una cuenta de prueba; mostrar Plaza confirmada y asistentes. | Relación usuario–evento. |
| 08-reserva-cancelada.png | Cancelar y mostrar el estado actualizado. | Liberación de plaza. |
| 09-mongodb-colecciones.png | Atlas → clúster → Browse Collections / Data Explorer → kelsets_talks. Mostrar users y events. | Dos colecciones persistidas. No abrir Connect ni mostrar la URI. |
| 10-mongodb-evento.png | En events, filtrar por el título de una charla de prueba con reserva; expandir title, date, speakerId, translations, creator y attendees. | Modelo de evento, traducciones y referencias ObjectId. |
| 11-mongodb-usuario.png | En users, buscar exclusivamente la cuenta de prueba; mostrar name, role y attendingEvents. Para ilustrar el hash, ocultar casi todo password y dejar solo el prefijo bcrypt visible. | Relación inversa y contraseña no almacenada en texto plano. No mostrar el hash completo, email personal o credenciales. |
| 12-cloudinary-biblioteca.png | Cloudinary → Media Library / Assets → carpeta kelsets-talks/events. Seleccionar el cartel de la charla creada. | Archivo realmente alojado en Cloudinary. No abrir API Keys. |
| 13-cloudinary-imagen.png | Mostrar la imagen y sus dimensiones/formato o abrir su URL pública. | Recurso servido y formato admitido. |
| 14-mailtrap-confirmacion-es.png | My Sandbox → correo de confirmación → vista HTML. | Plantilla ES recibida en pruebas. No capturar Integration/Credentials. |
| 15-mailtrap-cancelacion-en.png | Abrir correo de cancelación EN en vista HTML. | Segundo idioma y aviso de cancelación. Indicar que es Sandbox, no entrega real a Gmail. |
| 16-insomnia-agenda.png | Ejecutar GET /events y mostrar URL, 200 y parte del JSON. | Lectura y estructura de respuesta. |
| 17-insomnia-privado.png | GET /auth/me sin token; mostrar 401 y mensaje. | Protección de rutas. |
| 18-insomnia-permisos.png | PATCH de un evento ajeno con segunda cuenta; mostrar 403. | Autorización por propietario. Ocultar Authorization. |
| 19-insomnia-aforo.png | Con aforo 1 ocupado, intentar reservar con otro usuario; mostrar 409. | Control de capacidad. |
| 20-insomnia-validacion.png | Enviar aforo inválido o email incorrecto; mostrar 400 y mensaje. | Validación de backend. |
| 21-tests.png | Ejecutar npm test y mostrar los totales correctos. | Pruebas automatizadas reales. |
| 22-build.png | Ejecutar npm run build y mostrar resultado correcto. | Compilación de producción. |
| 23-vercel-frontend.png | Tras desplegar, mostrar el proyecto frontend Ready y su URL. | Despliegue frontend. No mostrar valores de variables. |
| 24-vercel-backend.png | Mostrar proyecto backend Ready y abrir /api/health en URL pública. | Despliegue backend operativo. |
| 25-flujo-produccion.png | Repetir una reserva desde la web pública. | Integración completa tras despliegue. |

## Orden guiado

1. Ahora: guardar las dos capturas de Mailtrap que ya se ven correctamente.
2. Insomnia: 28 capturas aportadas en `docs/screenshots/Insomnia/`; 28 casos correctos tras repetir 27 con archivo real; la captura 15 tiene el token oculto.
3. A continuación: reservar una charla de prueba y capturar esa misma relación en MongoDB; después cancelarla.
4. Mostrar en Cloudinary el cartel de esa misma charla, sin entrar en credenciales.
5. Al desplegar: sustituir o complementar las capturas locales por evidencia de producción.

## No capturar ni publicar

Archivos `.env`, contraseñas, tokens JWT, API Secret, claves SMTP, cadenas de conexión MongoDB, pantallas de credenciales ni hashes completos. En una captura de login/registro con respuesta JSON, ocultar el valor de `token`. Las imágenes deben ser evidencia real, sin inventar resultados.

Estado a 13 de septiembre de 2026: capturas de Insomnia revisadas en `docs/screenshots/Insomnia/` (28 casos correctos, incluida la subida real de avatar). Se conserva esa carpeta; `docs/capturas/` sigue siendo la propuesta para las otras evidencias pendientes. No marcar las demás como tomadas sin comprobar los archivos.
