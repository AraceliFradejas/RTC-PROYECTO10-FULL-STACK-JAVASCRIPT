# Validación HTTP de la colección

Fecha: 2026-09-12T16:47:15.000Z.

29 comprobaciones correctas: 27 peticiones de la colección (se excluye avatar manual), JSON malformado y archivo mayor de 5 MB. Ejecutadas contra Express real con MongoDB Atlas, mediante un ejecutor Node que interpola el entorno y evalúa los scripts de respuesta de la colección. Envío de correos desactivado en ese proceso.

Esta ejecución mediante Node es independiente de Insomnia. Sus cuentas/eventos temporales se eliminaron al terminar.

Actualización del 13 de septiembre: la usuaria ejecutó posteriormente la colección en Insomnia 13.2.0. Se revisaron sus 28 capturas: 28 resultados esperados, incluida la repetición del avatar con archivo real y URL Cloudinary. Ver la [memoria detallada](../../MEMORIA.md#validación-detallada-en-insomnia--revisión-del-13-de-septiembre-de-2026). Los datos temporales de esta segunda ejecución son distintos; las dos cuentas permanecen y su evento fue eliminado.
