import type { LegalContent } from "./types";

const content: LegalContent = {
  privacy: {
    updated: "Última actualización: 12 de julio de 2026",
    sections: [
      {
        heading: "Responsable del tratamiento",
        body: "El responsable del tratamiento de CogniMetric es [razón social — completar antes del lanzamiento], contactable en privacy@cognimetric.example. Esta sección debe completarse con la identidad legal real del operador, su domicilio social y, en su caso, su NIF/CIF antes de que el sitio entre en funcionamiento.",
      },
      {
        heading: "Datos que recopilamos",
        body: "Para operar CogniMetric recopilamos: (a) tus respuestas y tiempos de respuesta durante el test; (b) datos técnicos como una dirección IP con hash y el user agent del navegador, utilizados solo para seguridad básica y prevención de fraude; (c) tu dirección de correo electrónico, solo si decides facilitarla para recibir una copia de tu informe; (d) metadatos de pago de nuestros procesadores de pago (Stripe y PayPal) — nunca vemos ni almacenamos los datos de tu tarjeta o de tu cuenta PayPal; (e) tus preferencias de consentimiento de cookies.",
      },
      {
        heading: "Finalidad y base jurídica",
        body: "Tratamos tus respuestas del test y los datos de pago para ejecutar el contrato contigo (art. 6.1.b RGPD): generar tu informe de capacidad cognitiva y procesar tu pago único.\n\nTratamos tu dirección de correo electrónico y las cookies analíticas opcionales solo con tu consentimiento (art. 6.1.a RGPD), que puedes retirar en cualquier momento.\n\nTratamos las direcciones IP con hash y los registros técnicos en base a nuestro interés legítimo en prevenir abusos y proteger el servicio (art. 6.1.f RGPD).",
      },
      {
        heading: "Conservación",
        body: "Las respuestas y puntuaciones del test se conservan durante 24 meses desde la fecha del test, tras lo cual se eliminan, salvo que solicites su eliminación anticipada. Los registros de pago se conservan durante el período exigido por la normativa fiscal y contable aplicable (hasta 10 años) y son custodiados por nuestros procesadores de pago. Las direcciones IP con hash se conservan durante 30 días. Los registros de consentimiento de cookies se conservan durante 12 meses.",
      },
      {
        heading: "Destinatarios y transferencias internacionales",
        body: "Compartimos datos únicamente con los encargados del tratamiento estrictamente necesarios para operar CogniMetric: nuestro proveedor de alojamiento y base de datos, y nuestros procesadores de pago Stripe y PayPal. Algunos de estos proveedores pueden tratar datos fuera del Espacio Económico Europeo; en tal caso, nos basamos en garantías adecuadas como las Cláusulas Contractuales Tipo de la Comisión Europea.",
      },
      {
        heading: "Tus derechos",
        body: "En virtud del RGPD tienes derecho a acceder, rectificar, suprimir, limitar u oponerte al tratamiento de tus datos, así como a la portabilidad de los datos. Puedes ejercer estos derechos escribiendo a privacy@cognimetric.example. También tienes derecho a presentar una reclamación ante tu autoridad nacional de protección de datos.",
      },
      {
        heading: "Seguridad",
        body: "Aplicamos la minimización de datos desde el diseño: nunca almacenamos direcciones IP en claro, números de tarjeta ni credenciales de PayPal, y todo el tráfico está cifrado en tránsito (HTTPS). El acceso a la base de datos está restringido y los pagos son gestionados íntegramente por procesadores conformes con PCI-DSS.",
      },
      {
        heading: "Requisito de edad",
        body: "CogniMetric está destinado a usuarios de 16 años o más. No recopilamos conscientemente datos de menores de 16 años.",
      },
      {
        heading: "Cambios en esta política",
        body: "Podemos actualizar esta política periódicamente; la fecha de 'última actualización' indicada arriba refleja la revisión más reciente. Los cambios sustanciales se destacarán en esta página.",
      },
    ],
  },
  cookies: {
    updated: "Última actualización: 12 de julio de 2026",
    sections: [
      {
        heading: "Qué son las cookies",
        body: "Las cookies son pequeños archivos de texto almacenados en tu dispositivo que ayudan a que los sitios web funcionen y, opcionalmente, a entender cómo se utilizan.",
      },
      {
        heading: "Cookies que utilizamos",
        body: "Estrictamente necesarias: cm_locale (recuerda tu idioma), una cookie de tema (recuerda el modo claro/oscuro), cm_consent (recuerda tus preferencias de cookies) y un identificador de sesión utilizado para asociar tus respuestas con tu intento de test y tu pago. Siempre están activas porque el sitio no puede funcionar sin ellas.\n\nAnalíticas: se utilizan solo si das tu consentimiento a través del banner de cookies, para entender el uso agregado y mejorar el sitio. No se activa ninguna hasta que das tu consentimiento.\n\nMarketing: actualmente no se utilizan en este sitio.",
      },
      {
        heading: "Cookies de terceros",
        body: "Cuando eliges pagar, Stripe o PayPal pueden establecer sus propias cookies en sus páginas de pago alojadas, regidas por sus respectivas políticas de privacidad y cookies.",
      },
      {
        heading: "Gestión de tus preferencias",
        body: "Puedes cambiar tus preferencias de cookies en cualquier momento borrando las cookies de tu navegador para este sitio, lo que volverá a mostrar el banner de consentimiento, o a través de la configuración de tu navegador.",
      },
    ],
  },
  terms: {
    updated: "Última actualización: 12 de julio de 2026",
    sections: [
      {
        heading: "El servicio",
        body: "CogniMetric ofrece una evaluación online autoadministrada del rendimiento cognitivo en seis dominios, con fines informativos y recreativos. No es un instrumento clínico ni diagnóstico.",
      },
      {
        heading: "Requisitos de acceso",
        body: "Debes tener al menos 16 años para utilizar CogniMetric de forma autónoma. Al realizar el test confirmas que cumples este requisito.",
      },
      {
        heading: "Precio y pago",
        body: "El informe completo tiene un coste único de 1,00 € (o el equivalente mostrado al pagar), abonable con tarjeta, Apple Pay, Google Pay o PayPal a través de nuestros procesadores de pago Stripe y PayPal. Dado que el informe es contenido digital que se entrega inmediatamente tras el pago, reconoces que pierdes tu derecho legal de desistimiento una vez desbloqueado el informe, de conformidad con la normativa de protección al consumidor de la UE.",
      },
      {
        heading: "Reembolsos",
        body: "Dado que el informe se entrega de forma inmediata, los pagos no son generalmente reembolsables una vez desbloqueado el informe, salvo que la normativa imperativa de protección al consumidor lo exija o en caso de fallo técnico imputable a nosotros. Contáctanos si crees que se te cobró por error.",
      },
      {
        heading: "Uso aceptable",
        body: "Te comprometes a no intentar eludir el sistema de pago, ni automatizar o generar intentos de test en masa, ni utilizar el servicio con fines ilícitos.",
      },
      {
        heading: "Propiedad intelectual",
        body: "Todos los ítems del test, la metodología de puntuación, los textos y el diseño son propiedad de CogniMetric o de sus licenciantes y no pueden copiarse ni redistribuirse sin autorización.",
      },
      {
        heading: "Exención de garantías y limitación de responsabilidad",
        body: "El servicio se presta 'tal cual', sin garantías de ningún tipo. La puntuación de CogniMetric es una estimación estadística y no debe utilizarse para decisiones clínicas, de orientación educativa, laborales o legales. En la medida máxima permitida por la ley, nuestra responsabilidad se limita al importe pagado por el informe.",
      },
      {
        heading: "Ley aplicable",
        body: "Estos términos se rigen por la legislación italiana, sin perjuicio de los derechos imperativos de protección al consumidor que puedas tener conforme a la ley de tu país de residencia.",
      },
      {
        heading: "Contacto",
        body: "Las preguntas sobre estos términos pueden enviarse a privacy@cognimetric.example.",
      },
    ],
  },
};

export default content;
