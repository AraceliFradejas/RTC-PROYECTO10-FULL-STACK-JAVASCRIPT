# Imágenes del carrusel

El carrusel de portada contiene siete diapositivas. Cuatro muestran a los ponentes ficticios en situaciones deportivas relacionadas con su perfil. Son recreaciones generadas con IA; no documentan encuentros ni participantes reales. Véase [Recursos y atribuciones](RECURSOS.md).

## Archivos finales

Estas cuatro imágenes se encuentran en `frontend/public/images/hero-carousel/`, en formato JPEG de 1536 × 1024 píxeles:

| Archivo | Escena |
| --- | --- |
| `hero-alison-basketball.jpg` | Alison conversa con una jugadora de baloncesto. |
| `hero-jude-football.jpg` | Jude acompaña a una futbolista en un campo de entrenamiento. |
| `hero-anna-cycling.jpg` | Anna revisa datos de entrenamiento con ciclistas. |
| `hero-travis-football.jpg` | Travis conversa con un jugador de fútbol americano junto al campo. |

## Mantenimiento

Las diapositivas se configuran en [visualContent.js](../frontend/src/data/visualContent.js). Los textos alternativos están disponibles en castellano e inglés.

Al sustituir una imagen, comprobar el recorte en móvil y escritorio, mantener visibles los rostros y reservar espacio para los textos superpuestos. Actualizar el texto alternativo si cambia la escena y verificar el contraste del contenido sobre la imagen.

Los originales y las instrucciones de producción se conservan localmente, fuera del repositorio de entrega. La aplicación utiliza únicamente los archivos finales.
