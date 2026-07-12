import type { MethodologyContent } from "./types";

const content: MethodologyContent = [
  {
    heading: "Vue d'ensemble",
    body: "CogniMetric mesure six domaines cognitifs — raisonnement logique, numérique, verbal et spatial, mémoire de travail et vitesse de traitement — à travers des items originaux, pour la plupart générés algorithmiquement à chaque tentative. Les réponses sont combinées en une estimation de la capacité pondérée par la difficulté pour chaque domaine, à l'aide d'un modèle logistique à un paramètre (façon Rasch), puis converties en un score standardisé de moyenne 100 et d'écart-type 15, la même convention d'échelle que celle utilisée par la plupart des tests de QI publiés.",
  },
  {
    heading: "Les six domaines",
    body: "Le raisonnement logique utilise des séquences abstraites de complètement de motifs construites avec des formes dont la rotation, le nombre et le remplissage varient selon une ou plusieurs règles simultanées.\n\nLe raisonnement numérique utilise des suites numériques régies par des règles arithmétiques, géométriques, alternées, quadratiques ou de type Fibonacci.\n\nLe raisonnement verbal utilise des analogies et des items d'intrus tirés d'une banque spécifique à chaque langue, les relations verbales ne se traduisant pas directement d'une langue à l'autre.\n\nLe raisonnement spatial utilise des items de rotation mentale construits à partir de formes polyominos chirales (asymétriques), avec des images miroir comme distracteur classique.\n\nLa mémoire de travail utilise une tâche d'empan de chiffres dont la longueur de séquence augmente à chaque essai.\n\nLa vitesse de traitement utilise des essais rapides d'appariement identique/différent de symboles dans un temps imparti fixe.",
  },
  {
    heading: "Génération des items et difficulté",
    body: "La plupart des items sont générés à la demande à partir d'une graine aléatoire propre à chaque tentative, plutôt que puisés dans un ensemble fixe et réutilisable. Cela limite les effets de mémorisation lors de tentatives répétées et nous permet de faire varier les items sans en rédiger manuellement des milliers.\n\nChaque item porte un paramètre de difficulté attribué par conception — par exemple le nombre de règles variant simultanément dans un item logique, l'angle de rotation dans un item spatial, ou la longueur de la séquence dans un essai de mémoire — plutôt qu'un paramètre estimé empiriquement à partir d'un large échantillon de préparation. Il s'agit d'une différence importante avec les instruments étalonnés professionnellement, que nous indiquons ici en toute transparence.",
  },
  {
    heading: "Modèle de notation",
    body: "Pour les items logiques, numériques, verbaux, spatiaux et de mémoire, nous estimons votre capacité (thêta) à l'aide d'un modèle logistique à un paramètre : P(correct) = 1 / (1 + e^-(thêta − b)), où b est la difficulté de l'item. Thêta est estimé via une brève procédure de maximum de vraisemblance (Newton-Raphson) et converti en score standardisé selon 100 + 15 × thêta.\n\nVotre score composite fait la moyenne des estimations de thêta sur les six domaines avant conversion, et votre percentile est dérivé de la fonction de répartition de la loi normale centrée réduite appliquée à cette moyenne.",
  },
  {
    heading: "Notation de la vitesse de traitement",
    body: "Le domaine de la vitesse de traitement mesure le débit sous contrainte de temps plutôt que la difficulté des items (chaque essai est, par conception, d'une difficulté faible et similaire) ; il est donc noté différemment : les réponses correctes nettes (correctes moins incorrectes) sont standardisées par rapport à une moyenne et un écart-type de référence que nous avons définis nous-mêmes, non issus d'un échantillon d'étalonnage clinique. Cela est indiqué explicitement car cela affecte sensiblement la manière dont ce sous-score doit être interprété.",
  },
  {
    heading: "Contrôles de fiabilité",
    body: "Chaque rapport comprend un indicateur de fiabilité de base. Si plus de 30 % de vos réponses à choix multiple ont été données en moins de 900 millisecondes — bien plus rapide que ce que permettent généralement une lecture et un raisonnement authentiques —, votre rapport est signalé en conséquence, un tel schéma indiquant souvent des réponses précipitées ou inattentives plutôt qu'une véritable estimation de capacité.",
  },
  {
    heading: "Ce que ce test est — et n'est pas",
    body: "CogniMetric est un instrument auto-administré et auto-calibré. Il n'a pas été validé par rapport à des batteries reconnues et étalonnées professionnellement (comme les échelles de Wechsler ou les matrices progressives de Raven), et n'a fait l'objet d'aucune étude publiée de fiabilité ou de validité sur un échantillon représentatif de la population.\n\nPour cette raison, votre score doit être considéré comme une estimation informative et ludique — non comme une mesure clinique, diagnostique ou juridiquement recevable. Il ne doit pas servir de fondement à des décisions d'orientation scolaire, professionnelles, cliniques ou juridiques. Si vous avez besoin d'une évaluation validée à l'une de ces fins, consultez un psychologue agréé.",
  },
  {
    heading: "Sécurité des données et des items",
    body: "Le contenu des items et les bonnes réponses sont générés de manière déterministe à partir d'une graine enregistrée avec votre tentative, et sont recalculés côté serveur au moment de la soumission pour noter vos réponses. Cela signifie que la clé de correction n'est jamais envoyée à votre navigateur et que le contenu des items n'a pas besoin d'être stocké de façon permanente — seuls votre graine, vos réponses et vos temps de réponse le sont.",
  },
];

export default content;
