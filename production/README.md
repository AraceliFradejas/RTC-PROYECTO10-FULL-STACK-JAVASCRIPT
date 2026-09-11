# Producción audiovisual · KelseTS

Los 16 vídeos publicados (8 invitaciones y 8 charlas, ES/EN) están en `frontend/public/videos/`.

- `talk-excerpts/ver-charlas.html`: página de revisión de las ocho charlas.
- `talk-excerpts/final-videos.json`: catálogo de charlas y comprobaciones.
- `talk-excerpts/*/`: guiones, voces fuente, imágenes finales, subtítulos y registros de producción.
- `speaker-videos/*/`: retratos y voces aprobadas para las invitaciones.

Los MP4 finales del catálogo de producción enlazan mediante symlinks a los archivos del frontend para evitar duplicados. Las pruebas y versiones descartadas se han eliminado; los originales de audio e imagen aprobados permanecen disponibles.

Los personajes y las charlas son ficticios. El ambiente de sala es CC0; su procedencia está en `talk-excerpts/ambience/SOURCE.md`. Las claves de servicios se leen exclusivamente desde los archivos `.env` locales ignorados por Git.
