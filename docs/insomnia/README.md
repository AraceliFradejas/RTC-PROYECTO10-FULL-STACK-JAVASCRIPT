# Validación del backend con Insomnia

Importar `kelsets-talks.json` desde Import → File. El formato JSON v4 sigue siendo importable en Insomnia: https://developer.konghq.com/insomnia/import-export/

## Preparación

1. Arrancar la API con `npm run dev --prefix backend`.
2. Seleccionar el entorno de la colección y revisar `base_url`.
3. Cambiar `email`, `other_email` y `password` por datos exclusivamente de prueba. Cambiar los emails en cada ejecución completa para no chocar con usuarios existentes.
4. Mantener MAIL_ENABLED=false o conectar Mailtrap Sandbox. Las cuentas `.invalid` no reciben mensajes reales.

## Ejecución

Ejecutar las peticiones 01–26 en orden. Los scripts guardan `token`, `other_token` y `event_id` automáticamente. Insomnia muestra una aserción del estado HTTP para cada petición y comprobaciones adicionales de contenido en las operaciones principales.

Se comprueban registro con sesión automática, duplicados, login incorrecto, perfil protegido, ordenación por fecha/popularidad, búsqueda ES, creación, edición, permisos ajenos, reserva, aforo completo, cancelación, IDs inválidos, validación de ponente/aforo y eliminación. La reserva trabaja exclusivamente con el evento creado en esta colección.

La petición 27 es manual: seleccionar un archivo de imagen en Body para verificar el avatar. La 28 verifica que un email malformado se rechaza con 400.

Para completar ficheros: repetir Crear evento con Body → Multipart, los mismos campos de texto y `poster` de tipo File. Comprobar URL pública en la respuesta. Eliminar ese evento al terminar. Probar también un archivo no admitido y otro mayor de 4 MB; el segundo debe devolver 413 con un mensaje comprensible. En Vercel, usar un archivo entre 4 y 4,5 MB para comprobar el error de la aplicación: peticiones mayores pueden ser rechazadas por la plataforma antes de llegar a Express.

Las dos cuentas de prueba permanecen en MongoDB: la API no dispone de borrado público de usuarios. No borrar cuentas reales. Si una ejecución se interrumpe, eliminar únicamente el evento temporal de esa ejecución. No exportar tokens de sesión reales a GitHub.

## Evidencias revisadas el 13 de septiembre de 2026

Colección importada y ejecutada en Insomnia 13.2.0 contra `http://127.0.0.1:3000/api` (Express local y MongoDB Atlas). Se revisaron 28 capturas y los 28 casos muestran el resultado esperado. La prueba 27 se repitió seleccionando un JPEG real: devuelve 200 y avatar con URL HTTPS de Cloudinary. Su script se ha reforzado para comprobar también esa URL; la captura nueva sustituye a la ejecución inicial sin archivo.

Cada caso está detallado en la [memoria](../../MEMORIA.md#validación-detallada-en-insomnia--revisión-del-13-de-septiembre-de-2026), con referencia a su [captura](../screenshots/Insomnia). He ocultado el token de la captura 15; la versión corregida ya está revisada. Las capturas corresponden al código local revisado; las correcciones de validación y esta colección se incorporan juntas al siguiente commit.

En 18 y 20, email.status=sent indica aceptación de Mailtrap Sandbox. No acredita entrega externa. Repetir el recorrido sobre la API desplegada con cuentas y eventos de prueba antes de entregar.
