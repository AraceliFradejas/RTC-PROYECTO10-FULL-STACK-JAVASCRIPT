# Despliegue de frontend y backend en Vercel

Se utiliza el mismo repositorio con dos proyectos, publicados el 13/09/2026 desde el commit `da840d2`:

- Frontend: https://kelse-ts-talks.vercel.app
- Backend: https://kelse-ts-talks-api.vercel.app/api
- Código frontend: https://github.com/AraceliFradejas/RTC-PROYECTO10-FULL-STACK-JAVASCRIPT/tree/main/frontend
- Código backend: https://github.com/AraceliFradejas/RTC-PROYECTO10-FULL-STACK-JAVASCRIPT/tree/main/backend

La API responde 200 en `/api/health` y devuelve 13 eventos en `/api/events`; CORS admite el dominio público de la web. La ruta directa `/events` del frontend devuelve 200. La ficha de liderazgo se ha revisado en Chrome en ES/EN, con 173 plazas ocupadas de 180. El detalle de evento devuelve 200, el perfil sin token devuelve 401 y un ID malformado devuelve 400. La API de GitHub confirma que el repositorio es público. Estas comprobaciones no sustituyen repetir el recorrido autenticado completo en producción.

## Acceso de Atlas y entrega privada

El primer despliegue devolvía 503 porque Atlas solo admitía la IP doméstica. Con autorización de Araceli se añadió `0.0.0.0/0` sin caducidad para la demostración y corrección, de acuerdo con las indicaciones de entrega que aportó. La API pasó a responder 200 tras aplicar la regla. Esta configuración permite intentos de conexión desde cualquier IPv4; la autenticación de la base de datos sigue siendo obligatoria.

`backend/.env.entrega` es un archivo local ignorado por Git, preparado para la corrección privada. Incluye únicamente las variables de esta aplicación, no las claves de herramientas audiovisuales. Al usarlo en local, copiarlo a `backend/.env`. No publicarlo ni adjuntarlo a un issue o README. Las variables `VITE_` del frontend son públicas y su ejemplo incluye la alternativa de producción.

## Backend

1. Importar el repositorio desde GitHub y seleccionar `backend` como Root Directory. Vercel reconoce Express. El archivo `backend/vercel.json` dirige las rutas a `src/server.js` e incluye los recursos de correo.
2. Configurar las variables privadas del servidor: `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` y `CLOUDINARY_API_SECRET`.
3. Establecer `FRONTEND_URL` y `PUBLIC_APP_URL` con el dominio HTTPS definitivo de la web. El primero controla CORS; el segundo construye los enlaces del correo. `FRONTEND_URL` acepta varios orígenes separados por comas.
4. Para conservar el correo en Sandbox, configurar `MAIL_ENABLED`, `MAIL_FROM`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER` y `SMTP_PASSWORD` con la configuración de Mailtrap. Sandbox no entrega mensajes en bandejas personales.
5. Desplegar y abrir `/api/health`: debe responder 200 con `success: true`. La respuesta comprueba también que MongoDB esté disponible. Revisar los logs si devuelve 503.

Las credenciales solo se almacenan en las variables del proyecto backend. No configurar `SEED_PASSWORD` ni ejecutar los scripts de carga durante el build. Los datos existentes de Atlas se conservan. No copiar secretos a variables con prefijo `VITE_`, al README ni a capturas.

## Frontend

1. Importar de nuevo el mismo repositorio, con Root Directory `frontend` y preset Vite.
2. Configurar `VITE_API_URL` con `https://<dominio-api>/api` y `VITE_PREVIEW_MODE=false` antes de compilar.
3. Desplegar y verificar que el dominio coincide con `FRONTEND_URL` y `PUBLIC_APP_URL` del backend. Si cambia una variable del backend, volver a desplegarlo. Los cambios `VITE_` también requieren una nueva compilación.
4. Abrir la agenda y una ficha mediante su URL directa, recargar y cambiar entre ES/EN. Verificar imágenes, navegación, login y la conexión con la API.

## Comprobación y capturas

Conservar las evidencias en `docs/screenshots/Vercel/`, siguiendo [la guía de capturas](GUIA-CAPTURAS.md). Capturar el estado Ready y el dominio de cada proyecto, la respuesta de salud y el flujo de reserva en la web pública. No mostrar valores de variables, tokens ni contraseñas.

Repetir los casos de Insomnia usando la URL pública. Las imágenes se limitan a 4 MB para dejar margen al multipart dentro del límite de 4,5 MB de las funciones. La prueba adicional de transacciones se ejecuta en una base temporal, no sobre los eventos del catálogo.

Los originales y montajes MP4 permanecen en las carpetas locales de producción. Las páginas HTML de revisión de vídeo no forman parte del frontend desplegado.

## Actualización publicada — 19/09/2026

Commit `ccdb145`: correcciones de accesibilidad y mejoras de SEO/GEO, bajo autoría de Araceli Fradejas Muñoz. Frontend y API desplegados correctamente mediante la integración de GitHub con Vercel.

Las [18 comprobaciones públicas](VERIFICACION-PRODUCCION-2026-09-19.json) verifican las diez rutas prerenderizadas, la ruta protegida de creación con noindex, una ruta inexistente con HTTP 404, robots, sitemap de nueve URLs, CSS corregido, salud de API, agenda de 13 eventos y acceso directo a una ficha dinámica. Contraste del login revisado visualmente en Chrome. Esta comprobación no sustituye el recorrido autenticado pendiente.
