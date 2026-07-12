import type { BlogContent } from "./types";

const content: BlogContent = [
  {
    slug: "interpreter-votre-score",
    title: "Comment interpréter votre score CogniMetric",
    excerpt:
      "Votre score composite n'est pas une étiquette figée : voici ce que signifient réellement les chiffres de votre rapport CogniMetric, et ce qu'ils ne signifient pas.",
    publishedAt: "2026-06-02",
    paragraphs: [
      "Si vous venez de terminer un test CogniMetric, vous consultez un score composite construit autour d'une moyenne de 100 et d'un écart-type de 15 — la même convention que celle utilisée par la plupart des échelles de capacité cognitive publiées. Un score de 100 se situe exactement au centre de la distribution de référence ; un score de 115 se situe un écart-type au-dessus, et ainsi de suite.",
      "Le percentile affiché à côté de votre score composite répond à une question plus intuitive : parmi toutes les personnes de la distribution de référence, quelle proportion a obtenu un score inférieur au vôtre ? Un percentile de 84 signifie que votre estimation composite vous situe au-dessus d'environ 84 % de cette distribution — pas que vous avez répondu correctement à 84 % des items.",
      "Il convient de répéter ce que précise déjà l'avertissement de votre rapport : cette distribution de référence est une construction mathématique fondée sur notre propre conception de la difficulté des items, et non un échantillon empirique de milliers de personnes ayant réellement passé le test. Les instruments étalonnés professionnellement consacrent des années à collecter des échantillons représentatifs par âge, niveau d'études et zone géographique avant de publier leurs normes. CogniMetric n'a pas cela derrière lui, et nous pensons que vous méritez de le savoir clairement.",
      "Cela ne rend pas le chiffre dénué de sens : l'estimation sous-jacente de type Rasch est une technique psychométrique légitime et largement utilisée, et vos six scores de domaine reflètent bien de véritables différences dans vos performances sur les items logiques, numériques, verbaux, spatiaux, de mémoire et de vitesse. Cela signifie simplement que ce chiffre se lit mieux comme une estimation structurée et auto-référentielle de votre performance sur cet instrument précis, et non comme un score de QI certifié.",
      "Quelques remarques pratiques : la performance peut varier sensiblement selon le sommeil, le stress, l'heure de la journée et la simple familiarisation avec les formats d'items — c'est précisément pourquoi nous suggérons d'attendre quelques mois entre deux passations plutôt que d'interpréter de petites fluctuations quotidiennes comme un changement réel. Et si le score d'un seul domaine semble atypique par rapport au reste de votre profil, il est souvent plus instructif de réfléchir à ce qui s'est passé dans cette section précise que de surinterpréter ce chiffre isolé.",
    ],
  },
  {
    slug: "intelligence-fluide-et-cristallisee",
    title: "Intelligence fluide et cristallisée : ce que signifient vraiment vos six scores de domaine",
    excerpt:
      "Pourquoi CogniMetric ne vous donne pas un seul chiffre, mais six — et comment les scores logique, numérique, verbal, spatial, de mémoire et de vitesse se rattachent à une idée bien plus ancienne en psychologie.",
    publishedAt: "2026-06-16",
    paragraphs: [
      "Bien avant l'existence des tests en ligne adaptatifs, les psychologues Raymond Cattell et John Horn ont proposé de diviser l'intelligence en deux grandes catégories : l'intelligence fluide — la capacité à raisonner et à résoudre des problèmes inédits sans s'appuyer sur des connaissances préalables — et l'intelligence cristallisée — le savoir accumulé et les compétences verbales construites tout au long d'une vie. John Carroll a ensuite intégré ces deux notions dans un modèle plus large à trois strates, qui sous-tend encore la plupart des batteries de tests cognitifs modernes.",
      "Les domaines logique, numérique et spatial de CogniMetric reposent fortement sur le raisonnement fluide : aucun d'eux ne nécessite de vocabulaire spécialisé ni de connaissances culturelles, seulement la capacité à repérer une règle dans un motif inconnu et à l'appliquer. Notre domaine verbal, en revanche, repose sur l'aptitude cristallisée — il dépend directement du vocabulaire et des relations déjà appris dans votre langue, ce qui explique aussi pourquoi nous n'avons pas pu simplement traduire les mêmes items dans cinq langues et avons dû rédiger une banque distincte et spécifique à chaque langue.",
      "La mémoire de travail et la vitesse de traitement se situent légèrement à l'écart de cette distinction fluide/cristallisée. La mémoire de travail — votre capacité à retenir et manipuler brièvement quelques éléments, testée ici par une tâche d'empan de chiffres — est souvent considérée comme une ressource fondamentale sur laquelle s'appuient à la fois les performances fluides et cristallisées. La vitesse de traitement, testée par un appariement rapide de symboles, capture quelque chose d'encore plus élémentaire : la rapidité avec laquelle vous pouvez exécuter des décisions perceptives simples sous contrainte de temps, indépendamment de la difficulté de la décision elle-même.",
      "Voir vos résultats ainsi détaillés est plus utile qu'un simple chiffre composite, car les profils cognitifs réels sont rarement uniformes. Il est courant d'être nettement plus fort en raisonnement fluide fondé sur des motifs qu'en empan de mémoire de travail, ou l'inverse — et c'est précisément ce type d'hétérogénéité qu'un score global unique masquerait.",
      "Rien de tout cela ne fait de CogniMetric un instrument diagnostique — consultez notre page Méthodologie pour connaître les limites importantes — mais le cadre fluide/cristallisé constitue une grille de lecture réellement utile pour comprendre pourquoi vos six scores de domaine n'évoluent pas toujours ensemble.",
    ],
  },
];

export default content;
