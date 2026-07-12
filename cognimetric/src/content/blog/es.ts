import type { BlogContent } from "./types";

const content: BlogContent = [
  {
    slug: "interpretar-tu-puntuacion",
    title: "Cómo interpretar tu puntuación de CogniMetric",
    excerpt:
      "Tu puntuación compuesta no es una etiqueta fija: esto es lo que realmente significan los números de tu informe de CogniMetric, y lo que no.",
    publishedAt: "2026-06-02",
    paragraphs: [
      "Si acabas de completar un test de CogniMetric, estás viendo una puntuación compuesta construida en torno a una media de 100 y una desviación estándar de 15 — la misma convención que usan la mayoría de las escalas de capacidad cognitiva publicadas. Una puntuación de 100 se sitúa exactamente en el centro de la distribución de referencia; una puntuación de 115 se sitúa una desviación estándar por encima, y así sucesivamente.",
      "La cifra de percentil junto a tu puntuación compuesta responde a una pregunta más intuitiva: de todas las personas en la distribución de referencia, ¿qué fracción obtuvo una puntuación inferior a la tuya? Un percentil de 84 significa que tu estimación compuesta te sitúa por encima de aproximadamente el 84% de esa distribución, no que respondiste correctamente al 84% de los ítems.",
      "Vale la pena repetir lo que ya indica el aviso de tu informe: esta distribución de referencia es una construcción matemática basada en nuestro propio diseño de dificultad de los ítems, no una muestra empírica de miles de personas que realizaron el test. Los instrumentos baremados profesionalmente dedican años a recopilar muestras representativas por edad, formación y geografía antes de publicar sus baremos. CogniMetric no cuenta con eso detrás, y creemos que mereces saberlo con claridad.",
      "Esto no hace que el número carezca de sentido: la estimación subyacente de estilo Rasch es una técnica psicométrica legítima y ampliamente utilizada, y tus seis puntuaciones de dominio reflejan diferencias genuinas en tu rendimiento en los ítems lógicos, numéricos, verbales, espaciales, de memoria y de velocidad. Simplemente significa que el número se interpreta mejor como una estimación estructurada y autorreferencial de tu rendimiento en este instrumento concreto, no como una puntuación de CI certificada.",
      "Algunas notas prácticas: el rendimiento puede variar de forma significativa según el sueño, el estrés, la hora del día y la simple práctica con los formatos de los ítems, por lo que sugerimos esperar unos meses entre repeticiones en lugar de interpretar pequeñas fluctuaciones diarias como un cambio real. Y si la puntuación de un solo dominio parece un valor atípico respecto al resto de tu perfil, suele ser más informativo pensar en qué ocurrió en esa sección concreta que dar demasiada importancia al número por sí solo.",
    ],
  },
  {
    slug: "inteligencia-fluida-y-cristalizada",
    title: "Inteligencia fluida y cristalizada: qué significan realmente tus seis puntuaciones de dominio",
    excerpt:
      "Por qué CogniMetric no te da un solo número, sino seis, y cómo las puntuaciones lógica, numérica, verbal, espacial, de memoria y de velocidad se relacionan con una idea mucho más antigua de la psicología.",
    publishedAt: "2026-06-16",
    paragraphs: [
      "Mucho antes de que existieran los test adaptativos en línea, los psicólogos Raymond Cattell y John Horn propusieron dividir la inteligencia en dos grandes categorías: la inteligencia fluida —la capacidad de razonar y resolver problemas nuevos sin depender de conocimientos previos— y la inteligencia cristalizada —el conocimiento acumulado y la habilidad verbal desarrollados a lo largo de la vida—. John Carroll integró después ambas en un modelo más amplio de tres estratos que aún hoy sustenta la mayoría de las baterías de test cognitivos modernas.",
      "Los dominios lógico, numérico y espacial de CogniMetric se apoyan fuertemente en el razonamiento fluido: ninguno de ellos requiere vocabulario especializado ni conocimiento cultural, solo la capacidad de detectar una regla en un patrón desconocido y aplicarla. Nuestro dominio verbal, en cambio, se apoya en la habilidad cristalizada: depende directamente del vocabulario y las relaciones que ya has aprendido en tu idioma, razón por la cual no pudimos simplemente traducir los mismos ítems a cinco idiomas y tuvimos que redactar un banco distinto y específico para cada uno.",
      "La memoria de trabajo y la velocidad de procesamiento se sitúan algo al margen de la división fluida/cristalizada. La memoria de trabajo —tu capacidad de retener y manipular brevemente unos pocos elementos, evaluada aquí con una tarea de amplitud de dígitos— suele considerarse un recurso básico del que dependen tanto el rendimiento fluido como el cristalizado. La velocidad de procesamiento, evaluada con el emparejamiento rápido de símbolos, capta algo aún más elemental: la rapidez con la que puedes ejecutar decisiones perceptivas simples bajo presión de tiempo, independientemente de lo difícil que sea la decisión en sí.",
      "Ver tus resultados desglosados de esta manera es más útil que un único número compuesto, porque los perfiles cognitivos reales rara vez son planos. Es habitual ser notablemente más fuerte en el razonamiento fluido basado en patrones que en la amplitud de la memoria de trabajo, o viceversa, y ese tipo de irregularidad es precisamente lo que ocultaría una única puntuación global.",
      "Nada de esto convierte a CogniMetric en un instrumento diagnóstico —consulta nuestra página de Metodología para conocer las limitaciones importantes—, pero el marco fluido/cristalizado es una perspectiva realmente útil para entender por qué tus seis puntuaciones de dominio no siempre se mueven juntas.",
    ],
  },
];

export default content;
