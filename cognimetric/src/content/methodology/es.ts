import type { MethodologyContent } from "./types";

const content: MethodologyContent = [
  {
    heading: "Visión general",
    body: "CogniMetric mide seis dominios cognitivos —razonamiento lógico, numérico, verbal y espacial, memoria de trabajo y velocidad de procesamiento— mediante ítems originales, la mayoría generados algorítmicamente en cada intento. Las respuestas se combinan en una estimación de la habilidad ponderada por dificultad para cada dominio, mediante un modelo logístico de un parámetro (estilo Rasch), y se convierten en una puntuación estandarizada con media 100 y desviación estándar 15, la misma convención de escala que usan la mayoría de los test de inteligencia publicados.",
  },
  {
    heading: "Los seis dominios",
    body: "El razonamiento lógico utiliza secuencias abstractas de completar patrones construidas con figuras cuya rotación, cantidad y relleno varían según una o varias reglas simultáneas.\n\nEl razonamiento numérico utiliza secuencias numéricas regidas por reglas aritméticas, geométricas, alternas, cuadráticas o similares a Fibonacci.\n\nEl razonamiento verbal utiliza analogías e ítems de identificar el intruso extraídos de un banco específico por idioma, ya que las relaciones verbales no se traducen directamente entre idiomas.\n\nEl razonamiento espacial utiliza ítems de rotación mental construidos con figuras poliominó quirales (asimétricas), con imágenes especulares como distractor clásico.\n\nLa memoria de trabajo utiliza una tarea de amplitud de dígitos con longitud de secuencia creciente entre pruebas.\n\nLa velocidad de procesamiento utiliza pruebas rápidas de emparejamiento igual/diferente de símbolos dentro de un tiempo fijo.",
  },
  {
    heading: "Generación de ítems y dificultad",
    body: "La mayoría de los ítems se generan bajo demanda a partir de una semilla aleatoria específica de cada intento, en lugar de extraerse de un conjunto fijo y reutilizable. Esto limita los efectos de memorización en intentos repetidos y nos permite escalar la variedad de ítems sin redactar manualmente miles de ellos.\n\nCada ítem lleva un parámetro de dificultad asignado por diseño —por ejemplo, el número de reglas que varían simultáneamente en un ítem lógico, el ángulo de rotación en un ítem espacial o la longitud de la secuencia en una prueba de memoria— en lugar de uno estimado empíricamente a partir de una gran muestra piloto. Esta es una diferencia importante respecto a los instrumentos baremados profesionalmente, que declaramos aquí con total transparencia.",
  },
  {
    heading: "Modelo de puntuación",
    body: "Para los ítems lógicos, numéricos, verbales, espaciales y de memoria, estimamos tu habilidad (theta) con un modelo logístico de un parámetro: P(correcto) = 1 / (1 + e^-(theta − b)), donde b es la dificultad del ítem. Theta se estima mediante un breve procedimiento de máxima verosimilitud (Newton-Raphson) y se convierte en una puntuación estandarizada como 100 + 15 × theta.\n\nTu puntuación compuesta promedia las estimaciones de theta de los seis dominios antes de la conversión, y tu percentil se deriva de la función de distribución acumulada normal estándar aplicada a ese promedio.",
  },
  {
    heading: "Puntuación de la velocidad de procesamiento",
    body: "El dominio de velocidad de procesamiento mide el rendimiento bajo presión de tiempo en lugar de la dificultad del ítem (cada prueba tiene, por diseño, una dificultad baja y similar), por lo que se puntúa de forma distinta: las respuestas correctas netas (correctas menos incorrectas) se estandarizan frente a una media y desviación estándar de referencia que hemos definido nosotros mismos, no derivadas de una muestra de baremación clínica. Lo indicamos explícitamente porque afecta de forma sustancial a cómo debe interpretarse esa subpuntuación.",
  },
  {
    heading: "Comprobaciones de fiabilidad",
    body: "Cada informe incluye una comprobación básica de fiabilidad. Si más del 30% de tus respuestas de opción múltiple se dieron en menos de 900 milisegundos —mucho más rápido de lo que suele permitir una lectura y un razonamiento genuinos—, tu informe se marca en consecuencia, ya que este patrón suele indicar respuestas apresuradas o poco atentas más que una verdadera estimación de la habilidad.",
  },
  {
    heading: "Qué es —y qué no es— este test",
    body: "CogniMetric es un instrumento autoadministrado y autocalibrado. No ha sido validado frente a baterías consolidadas y baremadas profesionalmente (como las escalas Wechsler o las Matrices Progresivas de Raven), y no ha sido objeto de estudios publicados de fiabilidad o validez sobre una muestra de población representativa.\n\nPor ello, tu puntuación debe considerarse una estimación informativa y recreativa, no una medición clínica, diagnóstica o con validez legal. No debe utilizarse como base para decisiones de orientación educativa, laborales, clínicas o legales. Si necesitas una evaluación validada para alguno de estos fines, consulta a un psicólogo colegiado.",
  },
  {
    heading: "Seguridad de los datos y de los ítems",
    body: "El contenido de los ítems y las respuestas correctas se generan de forma determinista a partir de una semilla almacenada junto con tu intento, y se recalculan en el servidor en el momento del envío para calificar tus respuestas. Esto significa que la clave de respuestas nunca se envía a tu navegador y que el contenido de los ítems no necesita almacenarse permanentemente; solo se almacenan tu semilla, tus respuestas y tus tiempos de respuesta.",
  },
];

export default content;
