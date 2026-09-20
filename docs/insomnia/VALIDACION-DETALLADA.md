# Validación detallada en Insomnia · revisión del 13 de septiembre de 2026

Se revisaron las 28 capturas aportadas de Insomnia 13.2.0, tomadas durante el recorrido local del 12–13 de septiembre, contra `http://127.0.0.1:3000/api` y MongoDB Atlas. **Los 28 casos muestran el resultado esperado, tras repetir la prueba 27 con un archivo real y verificar la URL de Cloudinary.** Los códigos 400, 401, 403, 404 y 409 de los casos negativos son resultados esperados. Todas las capturas muestran Tests 1/1, pero ese indicador corresponde a la aserción HTTP y no basta para validar una subida de archivo.

La [colección importable](../insomnia/kelsets-talks.json) conserva los cuerpos y scripts para reproducir las peticiones. Las rutas siguientes son relativas a `/api`. `token` identifica al organizador, `other_token` al asistente y `event_id` al evento temporal creado en 12. Usar emails nuevos en cada ejecución completa; los registros anteriores causarían 409. La comprobación HTTP previa mediante Node se documenta por separado en [RESULTADO-HTTP.md](../insomnia/RESULTADO-HTTP.md).

### Prueba 01 · Salud

**Objetivo.** Comprobar que Express responde antes de empezar el recorrido.

**Petición y preparación.** `GET /health`. Sin cuerpo ni autenticación.

**Resultado observado frente al esperado.** 200; success=true y «KelseTS Talks API está lista.».

**Interpretación.** Permite distinguir una API accesible de un error de conexión; no prueba por sí sola todas las integraciones.

**Evidencia.** [Ver captura 01](../screenshots/Insomnia/insomnia-01-inicio.png).

### Prueba 02 · Registro organizador e inicio automático

**Objetivo.** Crear la cuenta organizadora y obtener la sesión en la misma operación.

**Petición y preparación.** `POST /auth/register`. name=Organizador Insomnia, email de prueba y password del entorno; acceso público.

**Resultado observado frente al esperado.** 201; data contiene token y user con nombre, email y role=user, sin contraseña.

**Interpretación.** El registro devuelve los datos necesarios para iniciar sesión automáticamente. El script guarda token para las siguientes peticiones.

**Evidencia.** [Ver captura 02](../screenshots/Insomnia/insomnia-02%20-%20registro.png).

### Prueba 03 · Registro duplicado

**Objetivo.** Impedir cuentas duplicadas.

**Petición y preparación.** `POST /auth/register`. Repetir exactamente el email de la prueba 02.

**Resultado observado frente al esperado.** 409; success=false y mensaje de email ya registrado.

**Interpretación.** El conflicto se comunica al cliente sin crear otra cuenta con el mismo correo.

**Evidencia.** [Ver captura 03](../screenshots/Insomnia/Insomnia-03%20%C2%B7%20Registro%20duplicado.png).

### Prueba 04 · Inicio de sesión incorrecto

**Objetivo.** Rechazar credenciales incorrectas.

**Petición y preparación.** `POST /auth/login`. Email registrado y contraseña deliberadamente incorrecta; sin sesión.

**Resultado observado frente al esperado.** 401; «El email o la contraseña no son correctos.».

**Interpretación.** El backend no autentica al usuario con una contraseña errónea y devuelve un mensaje comprensible.

**Evidencia.** [Ver captura 04](../screenshots/Insomnia/Insomnia-04-login-incorrecto.png).

### Prueba 05 · Inicio de sesión correcto

**Objetivo.** Autenticar una cuenta existente.

**Petición y preparación.** `POST /auth/login`. Email y password del entorno usados en el registro.

**Resultado observado frente al esperado.** 200; token y datos del mismo organizador.

**Interpretación.** El script actualiza token; las peticiones protegidas posteriores utilizan esa sesión.

**Evidencia.** [Ver captura 05](../screenshots/Insomnia/Insomnia-05%20%C2%B7%20Login%20correcto.png).

### Prueba 06 · Perfil privado

**Objetivo.** Consultar el perfil con una sesión válida.

**Petición y preparación.** `GET /auth/me`. Bearer token del organizador; sin cuerpo.

**Resultado observado frente al esperado.** 200; identificador, nombre, email, avatar y role del organizador.

**Interpretación.** La respuesta pública del perfil no incluye contraseña ni hash.

**Evidencia.** [Ver captura 06](../screenshots/Insomnia/insomnia-06-perfil-privado.png).

### Prueba 07 · Perfil sin token

**Objetivo.** Verificar la protección del perfil.

**Petición y preparación.** `GET /auth/me`. La misma consulta que en 06, eliminando la autenticación.

**Resultado observado frente al esperado.** 401; success=false y mensaje que requiere iniciar sesión.

**Interpretación.** Distingue acceso autenticado y acceso anónimo a la misma ruta.

**Evidencia.** [Ver captura 07](../screenshots/Insomnia/insomnia-07-sin-token.png).

### Prueba 08 · Agenda por fecha

**Objetivo.** Consultar la agenda ordenada por fecha.

**Petición y preparación.** `GET /events?sort=soonest`. Query sort=soonest; consulta pública.

**Resultado observado frente al esperado.** 200; lista de eventos y Tests 1/1.

**Interpretación.** La captura muestra el inicio de la lista. El script adicional recorre las fechas y exige orden ascendente; la imagen no muestra todos los elementos.

**Evidencia.** [Ver captura 08](../screenshots/Insomnia/insomnia-08-agenda-fecha.png).

### Prueba 09 · Agenda por popularidad

**Objetivo.** Consultar la agenda por popularidad.

**Petición y preparación.** `GET /events?sort=popular`. Query sort=popular; consulta pública.

**Resultado observado frente al esperado.** 200; lista de eventos con attendees y Tests 1/1.

**Interpretación.** El criterio es el número de asistentes descendente. La comprobación adicional de la colección recorre la lista completa; la captura muestra solo parte.

**Evidencia.** [Ver captura 09](../screenshots/Insomnia/Insomnia%20-09%20%C2%B7%20Agenda%20por%20popularidad.png).

### Prueba 10 · Búsqueda traducida y categoría

**Objetivo.** Combinar búsqueda de contenido traducido y categoría.

**Petición y preparación.** `GET /events?search=remontada&category=Resiliencia`. search=remontada y category=Resiliencia; sin token.

**Resultado observado frente al esperado.** 200; aparece «La mentalidad de la remontada», con traducciones ES/EN y categoría Resiliencia.

**Interpretación.** La búsqueda encuentra contenido editorial traducido y respeta el filtro de categoría. Este caso no cubre todas las combinaciones ni todos los idiomas.

**Evidencia.** [Ver captura 10](../screenshots/Insomnia/insomnia-10-busqueda.png).

### Prueba 11 · Crear evento sin sesión

**Objetivo.** Impedir la creación de eventos sin sesión.

**Petición y preparación.** `POST /events`. JSON de una charla válida, sin Bearer token.

**Resultado observado frente al esperado.** 401; mensaje que requiere iniciar sesión.

**Interpretación.** Un cuerpo válido no sustituye la autenticación necesaria para escribir.

**Evidencia.** [Ver captura 11](../screenshots/Insomnia/Insomnia-11%20%C2%B7%20Crear%20evento%20sin%20sesi%C3%B3n.png).

### Prueba 12 · Crear evento de prueba

**Objetivo.** Crear un evento temporal con el organizador.

**Petición y preparación.** `POST /events`. Bearer token; título Charla temporal Insomnia, fecha 2030-06-15T18:00:00Z, Madrid · Pruebas, categoría Liderazgo, speakerId=alison-patrick y capacity=1.

**Resultado observado frente al esperado.** 201; evento con _id, creador, ponente, aforo 1 y attendees vacío.

**Interpretación.** El script guarda event_id para aislar las pruebas. Se usa JSON sin cartel: esta prueba no demuestra subida de ficheros.

**Evidencia.** [Ver captura 12](../screenshots/Insomnia/Insomnia-12%20%C2%B7%20Crear%20evento%20de%20prueba%C2%BB.png).

### Prueba 13 · Detalle y asistentes

**Objetivo.** Consultar el evento y su estructura de asistentes.

**Petición y preparación.** `GET /events/{{ _.event_id }}`. event_id obtenido en 12; lectura pública.

**Resultado observado frente al esperado.** 200; mismo evento, información del creador y attendees=[].

**Interpretación.** El detalle permite explorar los datos y la lista de asistentes antes de reservar.

**Evidencia.** [Ver captura 13](../screenshots/Insomnia/insomnia-13-detalle.png).

### Prueba 14 · Editar evento propio

**Objetivo.** Permitir al creador editar su evento.

**Petición y preparación.** `PATCH /events/{{ _.event_id }}`. Bearer token del organizador; title=Charla temporal Insomnia editada.

**Resultado observado frente al esperado.** 200; título actualizado conservando el identificador del evento.

**Interpretación.** Demuestra edición autorizada del recurso creado en 12.

**Evidencia.** [Ver captura 14](../screenshots/Insomnia/Insomnia-14%20%C2%B7%20Editar%20evento%20propio.png).

### Prueba 15 · Registro segundo usuario

**Objetivo.** Crear una identidad distinta para comprobar autorización.

**Petición y preparación.** `POST /auth/register`. name=Asistente Insomnia, other_email y password del entorno; registro público.

**Resultado observado frente al esperado.** 201; segundo usuario con identificador distinto, role=user y token.

**Interpretación.** El script guarda other_token. La captura se revisó de nuevo después de ocultar el token.

**Evidencia.** [Ver captura 15](../screenshots/Insomnia/Imsomnia-15%20%C2%B7%20Registro%20segundo%20usuario.png). Oculté el token antes de incorporarla al repositorio.

### Prueba 16 · Edición ajena denegada

**Objetivo.** Impedir que otro usuario edite el evento.

**Petición y preparación.** `PATCH /events/{{ _.event_id }}`. Bearer other_token; title=Cambio no autorizado sobre event_id.

**Resultado observado frente al esperado.** 403; «Solo la persona creadora puede modificar este evento.».

**Interpretación.** La sesión es válida, pero no tiene permiso sobre ese recurso. No debe confundirse con el 401 de ausencia de sesión.

**Evidencia.** [Ver captura 16](../screenshots/Insomnia/Insomnia-16%20%C2%B7%20Edici%C3%B3n%20ajena%20denegada.png).

### Prueba 17 · Borrado ajeno denegado

**Objetivo.** Impedir el borrado por un usuario ajeno.

**Petición y preparación.** `DELETE /events/{{ _.event_id }}`. Bearer other_token sobre el evento del organizador.

**Resultado observado frente al esperado.** 403; mismo mensaje de restricción por creador.

**Interpretación.** El evento sigue disponible para la reserva posterior; la autenticación por sí sola no autoriza el borrado.

**Evidencia.** [Ver captura 17](../screenshots/Insomnia/Insomnia-17%20%C2%B7%20Borrado%20ajeno%20denegado.png).

### Prueba 18 · Reservar única plaza

**Objetivo.** Insertar al asistente en la única plaza disponible.

**Petición y preparación.** `POST /events/{{ _.event_id }}/attendance`. Bearer other_token; language=es; evento con capacity=1 y sin asistentes.

**Resultado observado frente al esperado.** 200; attendees contiene a Asistente Insomnia, mensaje de plaza confirmada y email.status=sent.

**Interpretación.** Demuestra la relación de asistencia en la respuesta del evento. sent indica aceptación SMTP de Mailtrap Sandbox, no entrega a Gmail ni prueba visual del email.

**Evidencia.** [Ver captura 18](../screenshots/Insomnia/insomnia-18-reserva.png).

### Prueba 19 · Aforo completo

**Objetivo.** Evitar superar el aforo.

**Petición y preparación.** `POST /events/{{ _.event_id }}/attendance`. Bearer token del organizador; intentar reservar después de 18.

**Resultado observado frente al esperado.** 409; «El evento ya está completo.».

**Interpretación.** El límite de una plaza impide incorporar al segundo usuario. Es una prueba secuencial; no demuestra comportamiento bajo solicitudes concurrentes.

**Evidencia.** [Ver captura 19](../screenshots/Insomnia/insomnia-19-aforo-completo.png).

### Prueba 20 · Cancelar reserva

**Objetivo.** Cancelar la asistencia y liberar la plaza.

**Petición y preparación.** `POST /events/{{ _.event_id }}/attendance`. Bearer other_token; repetir la operación de asistencia con language=es.

**Resultado observado frente al esperado.** 200; attendees=[], «Tu asistencia se ha cancelado.» y email.status=sent.

**Interpretación.** La ruta alterna reserva/cancelación. La aceptación del correo corresponde al Sandbox. La relación inversa en users requiere evidencia de MongoDB aparte.

**Evidencia.** [Ver captura 20](../screenshots/Insomnia/insomnia-20-cancelacion.png).

### Prueba 21 · ID malformado

**Objetivo.** Rechazar un identificador malformado.

**Petición y preparación.** `GET /events/no-es-un-id`. ID literal no-es-un-id; consulta pública.

**Resultado observado frente al esperado.** 400; «El identificador del evento no es válido.».

**Interpretación.** El formato inválido se trata como error del cliente con mensaje legible, sin exponer un error interno.

**Evidencia.** [Ver captura 21](../screenshots/Insomnia/insomnia-21-id-malformado.png).

### Prueba 22 · ID inexistente

**Objetivo.** Distinguir un ID válido que no existe.

**Petición y preparación.** `GET /events/000000000000000000000000`. ID 000000000000000000000000; consulta pública.

**Resultado observado frente al esperado.** 404; «No hemos encontrado ese evento.».

**Interpretación.** El recurso inexistente devuelve 404, a diferencia del formato inválido de 21.

**Evidencia.** [Ver captura 22](../screenshots/Insomnia/Insomnia-22%20%C2%B7%20ID%20inexistente.png).

### Prueba 23 · Ponente inválido

**Objetivo.** Validar el catálogo de ponentes desde el backend.

**Petición y preparación.** `PATCH /events/{{ _.event_id }}`. Bearer token del creador; speakerId=inventado.

**Resultado observado frente al esperado.** 400; «Elige un ponente válido.».

**Interpretación.** La API rechaza un valor fuera del catálogo aunque se envíe sin pasar por el formulario.

**Evidencia.** [Ver captura 23](../screenshots/Insomnia/insomnia-23-ponente-invalido.png).

### Prueba 24 · Aforo inválido

**Objetivo.** Validar el límite mínimo del aforo.

**Petición y preparación.** `PATCH /events/{{ _.event_id }}`. Bearer token del creador; capacity=0.

**Resultado observado frente al esperado.** 400; «El aforo debe ser un número entero entre 1 y 10000.».

**Interpretación.** La validación del servidor complementa la del frontend. Esta captura verifica el cero, no todos los valores límite.

**Evidencia.** [Ver captura 24](../screenshots/Insomnia/insomnia-24-aforo-invalido..png).

### Prueba 25 · Eliminar evento temporal

**Objetivo.** Eliminar el evento temporal con autorización.

**Petición y preparación.** `DELETE /events/{{ _.event_id }}`. Bearer token de su creador y event_id de esta ejecución.

**Resultado observado frente al esperado.** 204 No Content; cuerpo vacío, 0 B.

**Interpretación.** La ausencia de JSON es correcta para 204. Se elimina solo el evento de pruebas y se verifica su ausencia en 26.

**Evidencia.** [Ver captura 25](../screenshots/Insomnia/Insomnia-25%20%C2%B7%20Eliminar%20evento%20temporal.png).

### Prueba 26 · Confirmar eliminación

**Objetivo.** Comprobar que el borrado se ha aplicado.

**Petición y preparación.** `GET /events/{{ _.event_id }}`. Consultar event_id después de 25; sin autenticación.

**Resultado observado frente al esperado.** 404; «No hemos encontrado ese evento.».

**Interpretación.** La secuencia 25–26 demuestra que el recurso eliminado deja de estar disponible. Las dos cuentas de prueba permanecen.

**Evidencia.** [Ver captura 26](../screenshots/Insomnia/insomnia-26-evento-eliminado.png).

### Prueba 27 · Subir avatar (manual)

**Objetivo.** Comprobar la subida multipart de un avatar a Cloudinary.

**Petición y preparación.** `PATCH /auth/me`. Bearer token; campo avatar de tipo File. Debe seleccionarse una imagen real JPG/PNG/WebP, de hasta 4 MB (límite ajustado al preparar Vercel).

**Resultado observado frente al esperado.** La nueva ejecución devuelve 200, success=true y data.avatar con URL HTTPS de res.cloudinary.com, dentro de kelsets-talks/avatars. En el formulario multipart se ve un archivo JPEG seleccionado. Coincide con el resultado esperado.

**Interpretación.** La primera ejecución devolvió avatar vacío: un 200 por sí solo no acreditaba la subida. Se repitió seleccionando un JPEG real y la nueva captura demuestra que la API devuelve el recurso alojado en Cloudinary. La colección versionada exige también una URL válida para evitar ese falso positivo. Esta captura no acredita sustitución de un avatar previo ni limpieza tras un fallo.

**Evidencia.** [Ver captura 27](../screenshots/Insomnia/insomnia-27-avatar.png).

### Prueba 28 · Email inválido

**Objetivo.** Rechazar un correo con formato inválido.

**Petición y preparación.** `POST /auth/register`. Registro con name=Validación, email=correo-sin-formato y contraseña del entorno.

**Resultado observado frente al esperado.** 400; «Escribe un email válido.».

**Interpretación.** La API aplica validación de email independientemente de los controles del navegador.

**Evidencia.** [Ver captura 28](../screenshots/Insomnia/insomnia-28-email-invalido.png).

### Alcance y siguientes evidencias

Estas pruebas cubren el recorrido local de autenticación, CRUD, permisos, ordenación, asistencia y validación de entrada. No sustituyen las pruebas de concurrencia, la revisión de todos los estados del frontend ni la repetición sobre las URLs desplegadas. Para la entrega hay que añadir las capturas de MongoDB (referencias de usuario/evento sin secretos), Cloudinary, Mailtrap HTML ES/EN y Vercel siguiendo la [guía de capturas](../GUIA-CAPTURAS.md). Las dos cuentas de demostración permanecen en Atlas; el evento temporal se eliminó en 25.

