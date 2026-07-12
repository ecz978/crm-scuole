import type { VerbalBankItem } from "./types";

const bank: VerbalBankItem[] = [
  { id: "v1", prompt: "Chaud est à Froid ce que Jour est à ___ ?", options: ["Nuit", "Soleil", "Lumineux", "Matin"], correctIndex: 0, difficulty: -1.5 },
  { id: "v2", prompt: "Quel mot n'appartient pas au groupe : Pomme, Banane, Carotte, Orange, Raisin ?", options: ["Pomme", "Banane", "Carotte", "Raisin"], correctIndex: 2, difficulty: -1.3 },
  { id: "v3", prompt: "Chien est à Chiot ce que Chat est à ___ ?", options: ["Chaton", "Chiot", "Poulain", "Veau"], correctIndex: 0, difficulty: -1.1 },
  { id: "v4", prompt: "Quel mot n'appartient pas au groupe : Piano, Guitare, Violon, Tambour, Peinture ?", options: ["Guitare", "Tambour", "Peinture", "Violon"], correctIndex: 2, difficulty: -0.9 },
  { id: "v5", prompt: "Auteur est à Livre ce que Compositeur est à ___ ?", options: ["Symphonie", "Orchestre", "Piano", "Concert"], correctIndex: 0, difficulty: -0.5 },
  { id: "v6", prompt: "Quel mot n'appartient pas au groupe : Baleine, Dauphin, Phoque, Loutre, Truite ?", options: ["Phoque", "Loutre", "Truite", "Baleine"], correctIndex: 2, difficulty: -0.2 },
  { id: "v7", prompt: "Thermomètre est à Température ce que Balance est à ___ ?", options: ["Poids", "Hauteur", "Longueur", "Volume"], correctIndex: 0, difficulty: 0.4 },
  { id: "v8", prompt: "Économe est à Dépensier ce que Timide est à ___ ?", options: ["Audacieux", "Discret", "Prudent", "Silencieux"], correctIndex: 0, difficulty: 0.9 },
  { id: "v9", prompt: "Quel mot n'appartient pas au groupe : Sonnet, Haïku, Roman, Limerick, Ballade ?", options: ["Sonnet", "Haïku", "Roman", "Limerick"], correctIndex: 2, difficulty: 1.0 },
  { id: "v10", prompt: "Éphémère est à Permanent ce que Transparent est à ___ ?", options: ["Opaque", "Clair", "Fragile", "Visible"], correctIndex: 0, difficulty: 1.3 },
  { id: "v11", prompt: "Cacophonie est à Harmonie ce que Chaos est à ___ ?", options: ["Ordre", "Bruit", "Confusion", "Désordre"], correctIndex: 0, difficulty: 1.6 },
  { id: "v12", prompt: "Quel mot n'appartient pas au groupe : Errer, Flâner, Déambuler, Courir, Se promener ?", options: ["Errer", "Courir", "Déambuler", "Se promener"], correctIndex: 1, difficulty: 1.4 },
];

export default bank;
