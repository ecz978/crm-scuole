import type { VerbalBankItem } from "./types";

const bank: VerbalBankItem[] = [
  { id: "v1", prompt: "Caliente es a Frío como Día es a ___?", options: ["Noche", "Sol", "Luminoso", "Mañana"], correctIndex: 0, difficulty: -1.5 },
  { id: "v2", prompt: "¿Qué palabra no pertenece al grupo: Manzana, Plátano, Zanahoria, Naranja, Uva?", options: ["Manzana", "Plátano", "Zanahoria", "Uva"], correctIndex: 2, difficulty: -1.3 },
  { id: "v3", prompt: "Perro es a Cachorro como Gato es a ___?", options: ["Gatito", "Cachorro", "Potro", "Ternero"], correctIndex: 0, difficulty: -1.1 },
  { id: "v4", prompt: "¿Qué palabra no pertenece al grupo: Piano, Guitarra, Violín, Tambor, Pintura?", options: ["Guitarra", "Tambor", "Pintura", "Violín"], correctIndex: 2, difficulty: -0.9 },
  { id: "v5", prompt: "Autor es a Libro como Compositor es a ___?", options: ["Sinfonía", "Orquesta", "Piano", "Concierto"], correctIndex: 0, difficulty: -0.5 },
  { id: "v6", prompt: "¿Qué palabra no pertenece al grupo: Ballena, Delfín, Foca, Nutria, Trucha?", options: ["Foca", "Nutria", "Trucha", "Ballena"], correctIndex: 2, difficulty: -0.2 },
  { id: "v7", prompt: "Termómetro es a Temperatura como Báscula es a ___?", options: ["Peso", "Altura", "Longitud", "Volumen"], correctIndex: 0, difficulty: 0.4 },
  { id: "v8", prompt: "Ahorrador es a Derrochador como Tímido es a ___?", options: ["Audaz", "Reservado", "Prudente", "Callado"], correctIndex: 0, difficulty: 0.9 },
  { id: "v9", prompt: "¿Qué palabra no pertenece al grupo: Soneto, Haiku, Novela, Limerick, Balada?", options: ["Soneto", "Haiku", "Novela", "Limerick"], correctIndex: 2, difficulty: 1.0 },
  { id: "v10", prompt: "Efímero es a Permanente como Transparente es a ___?", options: ["Opaco", "Claro", "Frágil", "Visible"], correctIndex: 0, difficulty: 1.3 },
  { id: "v11", prompt: "Cacofonía es a Armonía como Caos es a ___?", options: ["Orden", "Ruido", "Confusión", "Desorden"], correctIndex: 0, difficulty: 1.6 },
  { id: "v12", prompt: "¿Qué palabra no pertenece al grupo: Vagar, Errar, Deambular, Correr, Pasear?", options: ["Vagar", "Correr", "Errar", "Pasear"], correctIndex: 1, difficulty: 1.4 },
];

export default bank;
