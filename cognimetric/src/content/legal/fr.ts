import type { LegalContent } from "./types";

const content: LegalContent = {
  privacy: {
    updated: "Dernière mise à jour : 12 juillet 2026",
    sections: [
      {
        heading: "Responsable du traitement",
        body: "Le responsable du traitement de CogniMetric est [raison sociale — à compléter avant le lancement], joignable à privacy@cognimetric.example. Cette section doit être complétée avec l'identité juridique réelle de l'exploitant, son siège social et, le cas échéant, son numéro de TVA avant la mise en ligne du site.",
      },
      {
        heading: "Données que nous collectons",
        body: "Pour faire fonctionner CogniMetric, nous collectons : (a) vos réponses et temps de réponse pendant le test ; (b) des données techniques telles qu'une adresse IP hachée et le user agent du navigateur, utilisées uniquement pour la sécurité de base et la prévention de la fraude ; (c) votre adresse e-mail, uniquement si vous choisissez de la fournir pour recevoir une copie de votre rapport ; (d) des métadonnées de paiement provenant de nos prestataires de paiement (Stripe et PayPal) — nous ne voyons ni ne conservons jamais les données de votre carte ou de votre compte PayPal ; (e) vos choix de consentement aux cookies.",
      },
      {
        heading: "Finalité et base juridique",
        body: "Nous traitons vos réponses au test et vos données de paiement pour l'exécution du contrat conclu avec vous (art. 6.1.b RGPD) : générer votre rapport de capacité cognitive et traiter votre paiement unique.\n\nNous traitons votre adresse e-mail et les cookies analytiques facultatifs uniquement avec votre consentement (art. 6.1.a RGPD), que vous pouvez retirer à tout moment.\n\nNous traitons les adresses IP hachées et les journaux techniques sur la base de notre intérêt légitime à prévenir les abus et à sécuriser le service (art. 6.1.f RGPD).",
      },
      {
        heading: "Conservation",
        body: "Les réponses et scores du test sont conservés 24 mois à compter de la date du test, puis supprimés, sauf demande de suppression anticipée de votre part. Les données de paiement sont conservées pendant la durée requise par la législation fiscale et comptable applicable (jusqu'à 10 ans) et sont détenues par nos prestataires de paiement. Les adresses IP hachées sont conservées 30 jours. Les registres de consentement aux cookies sont conservés 12 mois.",
      },
      {
        heading: "Destinataires et transferts internationaux",
        body: "Nous ne partageons des données qu'avec les sous-traitants strictement nécessaires au fonctionnement de CogniMetric : notre hébergeur et fournisseur de base de données, ainsi que nos prestataires de paiement Stripe et PayPal. Certains de ces prestataires peuvent traiter des données en dehors de l'Espace économique européen ; le cas échéant, nous nous appuyons sur des garanties appropriées telles que les clauses contractuelles types de la Commission européenne.",
      },
      {
        heading: "Vos droits",
        body: "En vertu du RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation et d'opposition au traitement de vos données, ainsi que d'un droit à la portabilité des données. Vous pouvez exercer ces droits en écrivant à privacy@cognimetric.example. Vous avez également le droit d'introduire une réclamation auprès de votre autorité nationale de protection des données.",
      },
      {
        heading: "Sécurité",
        body: "Nous appliquons la minimisation des données dès la conception : nous ne stockons jamais d'adresses IP en clair, de numéros de carte ni d'identifiants PayPal, et tout le trafic est chiffré en transit (HTTPS). L'accès à la base de données est restreint et les paiements sont intégralement gérés par des prestataires conformes à la norme PCI-DSS.",
      },
      {
        heading: "Condition d'âge",
        body: "CogniMetric est destiné aux utilisateurs âgés de 16 ans ou plus. Nous ne collectons pas sciemment de données auprès d'enfants de moins de 16 ans.",
      },
      {
        heading: "Modifications de cette politique",
        body: "Nous pouvons mettre à jour cette politique de temps à autre ; la date de 'dernière mise à jour' ci-dessus reflète la révision la plus récente. Les modifications substantielles seront signalées sur cette page.",
      },
    ],
  },
  cookies: {
    updated: "Dernière mise à jour : 12 juillet 2026",
    sections: [
      {
        heading: "Que sont les cookies",
        body: "Les cookies sont de petits fichiers texte stockés sur votre appareil qui aident les sites web à fonctionner et, en option, à comprendre leur utilisation.",
      },
      {
        heading: "Cookies que nous utilisons",
        body: "Strictement nécessaires : cm_locale (mémorise votre langue), un cookie de thème (mémorise le mode clair/sombre), cm_consent (mémorise vos choix de cookies), et un identifiant de session utilisé pour associer vos réponses à votre tentative de test et à votre paiement. Ils sont toujours actifs car le site ne peut pas fonctionner sans eux.\n\nAnalytiques : utilisés uniquement si vous y consentez via la bannière de cookies, pour comprendre l'utilisation agrégée et améliorer le site. Aucun n'est déposé tant que vous n'avez pas donné votre consentement.\n\nMarketing : non utilisés actuellement sur ce site.",
      },
      {
        heading: "Cookies tiers",
        body: "Lorsque vous choisissez de payer, Stripe ou PayPal peuvent déposer leurs propres cookies sur leurs pages de paiement hébergées, régis par leurs politiques respectives de confidentialité et de cookies.",
      },
      {
        heading: "Gérer vos préférences",
        body: "Vous pouvez modifier vos choix de cookies à tout moment en effaçant les cookies de votre navigateur pour ce site, ce qui affichera à nouveau la bannière de consentement, ou via les paramètres de votre navigateur.",
      },
    ],
  },
  terms: {
    updated: "Dernière mise à jour : 12 juillet 2026",
    sections: [
      {
        heading: "Le service",
        body: "CogniMetric propose une évaluation en ligne auto-administrée de la performance cognitive dans six domaines, à des fins d'information et de divertissement. Ce n'est pas un instrument clinique ou diagnostique.",
      },
      {
        heading: "Conditions d'éligibilité",
        body: "Vous devez avoir au moins 16 ans pour utiliser CogniMetric de manière autonome. En passant le test, vous confirmez remplir cette condition.",
      },
      {
        heading: "Prix et paiement",
        body: "Le rapport complet coûte 1,00 € en paiement unique (ou l'équivalent affiché au moment du paiement), payable par carte, Apple Pay, Google Pay ou PayPal via nos prestataires de paiement Stripe et PayPal. Le rapport étant un contenu numérique livré immédiatement après le paiement, vous reconnaissez perdre votre droit de rétractation légal dès que le rapport est débloqué, conformément à la réglementation européenne relative à la protection des consommateurs.",
      },
      {
        heading: "Remboursements",
        body: "Le rapport étant livré immédiatement, les paiements ne sont généralement pas remboursables une fois le rapport débloqué, sauf disposition impérative de la réglementation relative à la protection des consommateurs ou en cas de défaillance technique qui nous serait imputable. Contactez-nous si vous pensez avoir été facturé par erreur.",
      },
      {
        heading: "Utilisation autorisée",
        body: "Vous vous engagez à ne pas tenter de contourner le système de paiement, à ne pas automatiser ni générer en masse des tentatives de test, et à ne pas utiliser le service à des fins illicites.",
      },
      {
        heading: "Propriété intellectuelle",
        body: "Tous les items du test, la méthodologie de notation, les textes et le design sont la propriété de CogniMetric ou de ses concédants et ne peuvent être copiés ou redistribués sans autorisation.",
      },
      {
        heading: "Exclusion de garantie et limitation de responsabilité",
        body: "Le service est fourni 'en l'état', sans garantie d'aucune sorte. Le score de CogniMetric est une estimation statistique et ne doit pas être utilisé pour des décisions cliniques, d'orientation scolaire, professionnelles ou juridiques. Dans la limite autorisée par la loi, notre responsabilité est limitée au montant que vous avez payé pour le rapport.",
      },
      {
        heading: "Droit applicable",
        body: "Les présentes conditions sont régies par le droit italien, sans préjudice des droits impératifs de protection des consommateurs dont vous pourriez bénéficier en vertu du droit de votre pays de résidence.",
      },
      {
        heading: "Contact",
        body: "Toute question relative à ces conditions peut être adressée à privacy@cognimetric.example.",
      },
    ],
  },
};

export default content;
