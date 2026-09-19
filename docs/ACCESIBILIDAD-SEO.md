# Revisión de accesibilidad, SEO y GEO — 19/09/2026

Cambios revisados en código, HTML compilado y Chrome; publicados en Vercel desde el commit `ccdb145`. Esta revisión no certifica conformidad completa WCAG ni garantiza indexación o aparición en respuestas de IA. El despliegue actualizado se ha comprobado con 18 verificaciones HTTP y revisión visual del login en Chrome.

## Problemas detectados y correcciones

| Área | Hallazgo | Corrección |
| --- | --- | --- |
| Login | «Una mentalidad en movimiento» heredaba gris sobre un degradado oscuro. | Texto claro explícito. En los extremos del degradado, pasa de aproximadamente 1,06–1,07:1 a 5,48–6,19:1. |
| Contraste compartido | Texto sobre fotografías o fondos dorados y violetas dependía de la zona de fondo. | Superficies opacas para textos del carrusel y tarjetas de ponentes; ajuste de tarjetas del ecosistema, cabecera de portada y rótulos oscuros. |
| Teclado | Los filtros anulaban el contorno; la subida de archivos tenía un control visualmente oculto sin foco evidente. | Foco de dos colores y contorno en el contenedor de búsqueda, selección y subida. |
| Navegación | El menú móvil no declaraba qué controlaba ni gestionaba Escape. | `aria-controls`, cierre con Escape y devolución del foco al botón. Foco en el contenido principal al cambiar de ruta. |
| Formularios | Errores sin asociación explícita a campos y sin resumen enfocado. | Resumen bilingüe con enlaces a campos, `aria-describedby`, `aria-invalid`, campos obligatorios y `aria-busy`. Contraseña con etiqueta separada del botón de visibilidad. |
| Estados | Filtros sin estado seleccionado comunicado; avisos con tiempo limitado. | `aria-pressed`, resultados con `role=status` y un único aviso, que permanece hasta cerrarlo o hasta que otro nuevo lo sustituye. Región `aria-live=polite` y `aria-atomic=true`. |
| Lectura | Salto de h1 a h3 en agenda y directorio de ponentes. | Nivel de encabezado acorde a la página; jerarquía conservada en portada y fichas. |
| Móvil | «Remontadas» se cortaba en la página de empresa a 320 px. | Escala de títulos ajustada y división de palabras largas; botones y acciones pueden pasar a otra línea. |
| Movimiento | El efecto de aparición estaba definido después de la preferencia de movimiento reducido. | Regla final que desactiva animaciones y transiciones, incluidos pseudoelementos. |
| SEO | Todas las rutas compartían título y descripción; no había canonical, Open Graph ni sitemap. | Metadatos por ruta e idioma, canonical, tarjetas sociales, sitemap y robots. Login y creación excluidos con noindex. |
| Lectura sin JS | El HTML inicial estaba vacío. | Prerender de 10 rutas: portada, agenda (estructura), empresa, aviso legal, directorio, cuatro biografías y login. Las páginas de contenido incluyen texto y transcripciones en el HTML. |
| GEO | El contexto ficticio y la autoría necesitaban quedar claros al extraer contenido. | Contexto académico explícito en empresa y descripciones; JSON-LD WebPage/WebSite coherente con el contenido. No se declaran ponentes ficticios como personas reales ni charlas ficticias como eventos reales para rich results. |
| Fuentes | Carga de tipografías mediante `@import` en CSS. | Enlace directo en el documento y preconexión a los servidores de fuentes, manteniendo `display=swap`. |

## Evidencia obtenida

- Pruebas: 19 backend y 45 frontend correctas. La integración Atlas no se ejecuta en esta revisión.
- Compilación correcta. `npm run check:build --prefix frontend` revisa los 12 documentos resultantes (10 rutas, fallback y 404): título y descripción únicos por documento, jerarquía de encabezados, IDs, referencias ARIA, alt de imágenes, JSON-LD y sitemap de 9 rutas públicas.
- Chrome: login corregido, envío vacío, foco del resumen, enlace al correo y tabulación posterior hacia contraseña.
- Chrome: agenda ES/EN, búsqueda de «resilience» con dos resultados de muestra y metadatos de ficha en inglés.
- Chrome con vista responsive de 320 px: login, portada, agenda, directorio, biografía de Alison, transcripción desplegada, empresa y aviso legal. Se detectó y corrigió el título que se cortaba en empresa.
- Menú móvil: apertura y cierre con Escape, con foco devuelto al botón.
- La revisión de agenda y fichas usa `VITE_PREVIEW_MODE=true` en desarrollo. No modifica usuarios, reservas, carteles ni Atlas.

## Alcance y comprobaciones pendientes

1. Completado: publicación y verificación en Vercel de rutas directas, `robots.txt`, `sitemap.xml`, respuesta 404 de una ruta desconocida y cabeceras noindex. La reescritura de `/events/:id` usa `/200` porque `cleanUrls` elimina la extensión `.html`.
2. Agenda y fichas de eventos siguen obteniendo los datos vivos mediante JavaScript. No se publican instantáneas de asistentes en HTML ni se precargan reservas en el build. Un rastreador sin JS podrá leer los contenidos editoriales prerenderizados, pero no el catálogo vivo completo ni las fichas dinámicas. Las vistas sociales de fichas dinámicas son genéricas hasta ejecutar JS.
3. ES/EN comparten URL y guardan la preferencia en el navegador. El HTML de build es ES. No se añaden `hreflang` ficticios: una indexación independiente EN requeriría rutas de idioma y prerender propio.
4. La página desconocida está generada en `404.html`; un ID de evento inexistente necesita consultar la API y queda con noindex en el cliente. Un estado HTTP 404 específico para cada ID exigiría resolverlo en el servidor.
5. Falta auditoría con lector de pantalla real y Lighthouse/axe sobre producción. La inspección del árbol accesible de Chrome no sustituye esas pruebas ni acredita todos los criterios WCAG. Tampoco se ha completado una prueba al 200/400 % de zoom ni de todos los estados autenticados.
6. Rendimiento: el logo PNG existente pesa aproximadamente 1,43 MB pese a mostrarse pequeño. Conviene exportar una variante optimizada para web y favicon. No se han medido Core Web Vitals de usuarios reales ni se declara una puntuación Lighthouse.
7. GEO se apoya en contenido comprensible, rastreable y fiel al proyecto. No se prometen posiciones, citas de asistentes ni resultados enriquecidos.

## Referencias

- [W3C: contraste mínimo](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html): 4,5:1 para texto normal y 3:1 para texto grande.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/): foco visible, teclado, reflujo, tamaño de controles y errores.
- [Google: funciones de IA y sitios web](https://developers.google.com/search/docs/appearance/ai-features): prácticas SEO fundamentales, texto accesible y datos estructurados coherentes con lo visible.
- [Vercel: configuración de rutas](https://vercel.com/docs/project-configuration/vercel-json): `cleanUrls`, reescrituras y cabeceras.

## Publicación comprobada

El commit `ccdb145` está publicado en frontend y API; ambos despliegues figuran completados en los estados de GitHub/Vercel. [Resultado de las 18 comprobaciones públicas](VERIFICACION-PRODUCCION-2026-09-19.json). Se verifican también el CSS con la corrección de contraste y una ficha dinámica mediante acceso directo. El login publicado se revisó visualmente en Chrome. No se iniciaron sesiones ni se modificaron reservas durante esta comprobación.
