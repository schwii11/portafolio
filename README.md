# Portafolio — Katalina Ríos

Portafolio personal de Katalina Ríos, estudiante de Diseño con mención en Sistema Moda. Reúne proyectos de vestuario, materialidad y experiencias digitales en una publicación web editorial.

**Repositorio:** https://github.com/schwii11/portafolio

## Estado

La web incluye:

- Landing con statement, archivo de proyectos y contacto directo.
- Página About independiente con intereses, metodología, herramientas y trayectoria.
- Siete subpáginas: K’ero, Lacrima, Lithos, Aeris, Partitura Corporal, Infancias Interrumpidas y DESBORDE.
- Enlaces a repositorios y experiencias publicadas cuando están disponibles.
- Diseño responsive para teléfono y computador.
- Landing responsive.
- Archivo filtrable con siete proyectos identificados y explicados en la página principal.
- Siete páginas editoriales bilingües con navegación continua entre proyectos.

Las fotografías disponibles de K’ero, Lacrima, Lithos y Aeris están incorporadas sin filtros que alteren sus colores. Los tres proyectos digitales incluyen capturas reales, registros audiovisuales y enlaces a sus repositorios y experiencias.

## Ejecución local

No requiere instalación ni compilación. Abre `index.html` mediante Live Server o cualquier servidor estático.

## Estructura

```text
index.html
css/system.css
css/project.css
js/projects.js
js/app.js
js/project-content.js
js/project-shell.js
js/project-page.js
projects/{kero,lacrima,lithos,aeris,dos-realidades,escuchar-la-imagen,tocar-la-imagen}/index.html
assets/
```

## Componente externo

- **Componente:** Text Scramble.
- **Autor / proyecto:** Ibelick / Motion Primitives.
- **Fuente:** https://motion-primitives.com/docs/text-scramble
- **Licencia:** MIT.
- **Adaptación:** reimplementación ligera en JavaScript sin React para animar el descriptor del hero. Respeta `prefers-reduced-motion`.

La licencia del proyecto original fue verificada en https://github.com/ibelick/motion-primitives/blob/main/LICENCE.md.

## Referentes de dirección artística

Los siguientes sitios se utilizaron como referencias de principios, sin copiar composiciones ni recursos:

- Danilo De Marco — https://www.danilodemarco.com — tipografía como elemento dominante.
- Niccolò Miranda — https://www.niccolomiranda.com — estructura editorial, numeración y navegación entendida como publicación.
- Thibaut Crépelle — https://www.thibaut.cool — jerarquía entre selección de trabajos y desarrollo de procesos.
- 2xA Studio — https://2xa.studio — código como parte del lenguaje visual y no solo como herramienta técnica.

La versión actual combina estos principios en un sistema propio: archivo oscuro, titulares condensados, señalética roja, retícula asimétrica, proyectos numerados y gráficos generados con CSS.

## Tipografías

- Bodoni Moda — SIL Open Font License 1.1. Tipografía editorial principal.
- Inter — SIL Open Font License 1.1.
- DM Mono — SIL Open Font License 1.1.

Servidas mediante Google Fonts y acreditadas al final de este documento.

## Exploraciones de landing

La carpeta `exploraciones/` reúne tres propuestas deliberadamente distintas antes de intervenir la landing definitiva:

- **Archivo en tensión:** collage, recortes extremos y anotación manual.
- **Materia suspendida:** capas transparentes, tensión y un ritmo más silencioso.
- **Publicación mutable:** cada proyecto rompe la retícula de una manera diferente.

Las tres reinterpretan material de K’ero, Lacrima y Lithos; no reproducen literalmente las referencias visuales.

## Conceptos del semestre

### HTML

Lo entiendo como la base que ayuda a organizar la estructura y el contenido de un sitio. Ahí se agregan los textos, títulos, imágenes, botones y enlaces. Funciona mediante etiquetas bastante exactas y cada una cumple una función dentro de la página.

Este fragmento de *Partitura corporal* organiza los botones que permiten elegir una canción:

```html
<div class="difficulty" aria-label="Selección de canción">
  <span>Canción</span>
  <button class="song-button" data-song="do-for-love">Do For Love</button>
  <button class="song-button active" data-song="beat-it">Beat It</button>
  <button class="song-button" data-song="never-say-never">Never Say Never</button>
  <button class="song-button" data-song="back-in-black">Back in Black</button>
</div>
```

### CSS

Es la parte más gráfica del sitio y permite definir cómo se ven los elementos creados en HTML. Lo ocupé para trabajar colores, tipografías, tamaños, posiciones, espacios y animaciones. Siento que entrega más libertad porque un mismo contenido puede cambiar mucho dependiendo del diseño que se aplique.

En este fragmento del portafolio definí los colores principales que se repiten en toda la página:

```css
:root {
  --black: #101010;
  --paper: #f2f0eb;
  --red: #e12729;
  --display: 'Bodoni Moda', Georgia, serif;
  --body: Inter, Arial, sans-serif;
}
```

### JavaScript

Es el lenguaje que permite agregar interacciones y comportamientos a la página. Lo utilicé principalmente en *Partitura corporal*. MediaPipe analizaba la imagen de la cámara y JavaScript recibía los datos para relacionar la posición de la mano con distintas zonas de la pantalla y activar sonidos.

Aquí JavaScript revisa la imagen de la cámara, obtiene los puntos de la mano y actualiza la posición de la palma:

```js
const result = handLandmarker.detectForVideo(camera, now);
const landmarks = result.landmarks?.[0];

if (landmarks) {
  lastHandSeen = now;
  updatePalm(landmarks, now);
}
```

### MediaPipe

MediaPipe fue lo que ocupé en *Partitura corporal* para detectar la mano a través de la cámara. Entregaba distintos puntos de la mano y con ellos se podía saber dónde estaba la palma dentro de la pantalla.

Este fragmento configura la detección de una mano:

```js
handLandmarker = await HandLandmarker.createFromOptions(vision, {
  runningMode: "VIDEO",
  numHands: 1,
  minHandDetectionConfidence: 0.5,
  minTrackingConfidence: 0.35,
});
```

### OpenCV.js

OpenCV.js también fue utilizado en *Partitura corporal*. En este caso servía para comparar los píxeles de una imagen con la siguiente y medir cuánto movimiento estaba ocurriendo. Esa intensidad se combinaba con la posición de la mano para modificar la experiencia.

```js
cvApi.absdiff(grayFrame, previousGrayFrame, differenceFrame);
cvApi.threshold(differenceFrame, motionMask, 22, 255, cvApi.THRESH_BINARY);
```

### MQTT

Lo ocupé en *Desborde* para conectar el teléfono con la pantalla del computador. La interacción realizada desde el celular se enviaba a un broker, que funcionaba como intermediario, y después llegaba a la pantalla casi de inmediato. Esto permitía controlar la experiencia desde el teléfono y ver el resultado en el computador.

Este fragmento conecta el teléfono y envía cada interacción a la sala correspondiente:

```js
const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt');

const send = (type, data = {}) =>
  client.connected && client.publish(
    `${topic}/${type}`,
    JSON.stringify({ type, device, ...data })
  );
```

### GitHub Pages

Lo entiendo como una herramienta de GitHub que permite publicar como página web los archivos guardados en un repositorio. Me permitió subir mis proyectos de una manera más fácil y mantenerlos ordenados. Antes de publicarlos probaba que el código y las interacciones funcionaran correctamente.

También aprendí que se puede tomar como base un repositorio de otra persona, hacer una copia y transformarlo para crear algo propio. Este proceso se llama hacer un *fork* y siempre se deben mantener los créditos correspondientes.

## Reflexión personal del semestre

Uno de los aprendizajes más importantes que tuve durante el semestre fue aprender a trabajar con plataformas web y descubrir todas las posibilidades que ofrecen. Como diseñadora enfocada principalmente en moda, este proceso me permitió ampliar mi horizonte y comprender que es posible mezclar la moda con la tecnología de maneras que antes no imaginaba.

El proyecto que más me gustó fue *Infancias interrumpidas*. Quería construir una experiencia visual potente porque trabaja con escenas difíciles, pero también necesitaba representar la idea de una infancia interrumpida de manera respetuosa. Lo más complejo fue encontrar el límite para no pasar a llevar las experiencias de las personas afectadas y, al mismo tiempo, transmitir la interpretación que buscaba.

Otro desafío importante fue definir la estética y el diseño de las plataformas. Al principio me costaba encontrar una dirección visual clara. Para resolverlo, busqué y analicé distintos referentes hasta descubrir cuáles se relacionaban mejor con el concepto de cada proyecto.

Si volviera a realizar el semestre, no sé si cambiaría algo específico, pero sí me gustaría desarrollar más proyectos. Me gustó mucho trabajar en estas experiencias y descubrir nuevas posibilidades fuera del diseño de moda tradicional.

Después de estos proyectos cambió mi forma de ver las plataformas web y el trabajo digital. Antes pensaba que programar era algo demasiado complejo y que no se relacionaba mucho con mi área. Aunque aprendí que el código sí tiene su dificultad, también descubrí que es posible entenderlo y utilizarlo para desarrollar mis propias ideas.

Me gustó mucho crear mi página web porque siento que será una herramienta muy útil para mostrar mi trabajo. También descubrí que disfruto el desarrollo web y que todavía puedo crear muchas más cosas mezclando el diseño, la moda y la tecnología.

## Uso de inteligencia artificial

Durante el semestre utilicé principalmente Codex como apoyo para escribir y corregir código. Cuando aparecía un error, enviaba una captura y explicaba qué estaba ocurriendo para recibir instrucciones sobre cómo solucionarlo. También lo ocupé cuando una página no se veía como yo quería, preguntando qué cambios podía realizar en el código para acercarla a mi idea.

Aunque al comenzar no sabía de código, durante el proceso aprendí a publicar páginas web, ordenar archivos y entender cómo modificar distintos elementos para conseguir el resultado que buscaba. La IA fue un apoyo para comprender estos procesos de una manera más rápida y resolver problemas que probablemente me habrían tomado más tiempo.

Las decisiones sobre el concepto, la estética, las imágenes y la forma de presentar cada proyecto fueron tomadas por mí. La IA me ayudó principalmente a traducir esas decisiones a código, corregir problemas técnicos y ordenar la redacción final de este documento sin cambiar el contenido de mis respuestas.

## Créditos y fuentes

- Pinterest fue utilizado solamente como referencia e inspiración visual. No incorporé imágenes descargadas desde esa plataforma.
- En *Partitura corporal* trabajé con “Do for Love” de 2Pac, “Beat It” de Michael Jackson, “Never Say Never” de Justin Bieber y “Back in Black” de AC/DC.
- En *Infancias interrumpidas* utilicé extractos audiovisuales provenientes del Museo de la Memoria y los Derechos Humanos. Los fragmentos fueron seleccionados y editados para la experiencia. Las intervenciones sonoras fueron creadas por mí.
- Las tipografías Bodoni Moda, Inter y DM Mono se sirven mediante Google Fonts y utilizan SIL Open Font License 1.1.
- El efecto de texto fue adaptado desde Text Scramble de Motion Primitives / Ibelick, publicado con licencia MIT.

## Pendientes antes del examen

- Revisar que los enlaces publicados y los videos abran correctamente antes de la presentación.
- Confirmar que cada repositorio tenga su descripción, enlace de Pages y temas configurados en GitHub.
