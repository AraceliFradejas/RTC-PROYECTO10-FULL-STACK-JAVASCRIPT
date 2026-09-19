# Recursos visuales y audiovisuales

KelseTS Talks es un proyecto académico de Araceli Fradejas Muñoz. Los ponentes, biografías y experiencias de demostración son ficticios. Las imágenes y piezas audiovisuales se han elaborado con herramientas de IA; no representan grabaciones de actos reales ni testimonios de asistentes reales. La web conserva los avisos de recreación educativa.

## Recursos incluidos en la aplicación

- `frontend/public/images/`: carteles, retratos, portadas y elementos visuales utilizados por la web.
- `frontend/src/data/speakerVideos.json` y `speakerTalks.json`: imágenes de presentación, transcripciones y posibles enlaces a YouTube.
- `backend/src/emails/assets/`: copias de distribución de los recursos incrustados en los correos. Su duplicación es necesaria para empaquetar la función backend de manera independiente.
- Los carteles subidos desde el formulario se almacenan en Cloudinary y sus URLs se guardan en MongoDB.

Se empleó generación de imágenes asistida por IA para las escenas y retratos. Las invitaciones audiovisuales se produjeron con voces de ElevenLabs y animación de HeyGen. Los borradores, prompts, originales de audio/vídeo y exportaciones se conservan localmente en `production/` y `output/`, excluidos del seguimiento actual de Git. No se necesitan para instalar, ejecutar o desplegar la aplicación. Su retirada de la versión actual no elimina los commits históricos.

## Fuente de ambiente sonoro

Las piezas audiovisuales de producción utilizaron un fragmento de **quietlecturehall**, de **klangfabrik**, publicado en [Freesound](https://freesound.org/people/klangfabrik/sounds/182312/) bajo [CC0](https://creativecommons.org/publicdomain/zero/1.0/). Se utilizó un fragmento de 10 a 25,89 segundos, filtrado, normalizado y con fundidos. Este audio no se carga en la web publicada mientras no se enlace una pieza externa.

Las referencias conceptuales del proyecto se documentan en la memoria. No se atribuye afiliación ni respaldo a las personas, marcas o entidades citadas.
