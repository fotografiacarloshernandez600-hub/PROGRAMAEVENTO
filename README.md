# CIIIA 2026 — Programa interactivo

Sitio web estático con agenda del 1.er Congreso Internacional de Innovación e Inteligencia Artificial (11–13 de noviembre de 2026).

## Uso

Abrir `index.html` en un navegador o desplegar el repositorio en Vercel como proyecto estático, sin comando de compilación y con directorio raíz `.`.

Incluye búsqueda por actividad y ponente, filtros por día y categoría, favoritos guardados en el navegador, asistente de consultas basado en coincidencias del programa (no IA generativa) y el archivo `programa.pdf` original.

Los enlaces de Meet no están incluidos en el PDF suministrado. Verificar cambios de horario y sede con la organización.

## DACYT 5.0 — Asistente de voz e IA

La página permite hablar y escuchar respuestas mediante Web Speech API del navegador. El avatar se anima durante la lectura, pero la animación de boca es aproximada y no constituye sincronización labial facial real. La voz y el micrófono dependen del navegador y de sus permisos. El audio se inicia por interacción del usuario.

Para activar respuestas de IA generativa en Vercel, añade una variable de entorno **OPENAI_API_KEY** en Project Settings → Environment Variables y vuelve a desplegar. Opcional: **OPENAI_MODEL** (por defecto gpt-4.1-mini). No pongas la clave en archivos del repositorio ni en JavaScript del navegador. El endpoint /api/chat envía la pregunta y el programa oficial a la API de OpenAI. Sin clave, la web sigue funcionando con respuestas locales del programa. Configurar la API puede generar cargos por consumo; antes de publicar conviene añadir límites de uso y protección antiabuso al endpoint.

El PDF público se encuentra en `Programa version publica v2.pdf`.
