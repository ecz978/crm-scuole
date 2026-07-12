import type { VerbalBankItem } from "./types";

const bank: VerbalBankItem[] = [
  { id: "v1", prompt: "Caldo sta a Freddo come Giorno sta a ___?", options: ["Notte", "Sole", "Luminoso", "Mattina"], correctIndex: 0, difficulty: -1.5 },
  { id: "v2", prompt: "Quale parola non appartiene al gruppo: Mela, Banana, Carota, Arancia, Uva?", options: ["Mela", "Banana", "Carota", "Uva"], correctIndex: 2, difficulty: -1.3 },
  { id: "v3", prompt: "Cane sta a Cucciolo come Gatto sta a ___?", options: ["Gattino", "Cucciolo", "Puledro", "Vitello"], correctIndex: 0, difficulty: -1.1 },
  { id: "v4", prompt: "Quale parola non appartiene al gruppo: Pianoforte, Chitarra, Violino, Tamburo, Dipinto?", options: ["Chitarra", "Tamburo", "Dipinto", "Violino"], correctIndex: 2, difficulty: -0.9 },
  { id: "v5", prompt: "Autore sta a Libro come Compositore sta a ___?", options: ["Sinfonia", "Orchestra", "Pianoforte", "Concerto"], correctIndex: 0, difficulty: -0.5 },
  { id: "v6", prompt: "Quale parola non appartiene al gruppo: Balena, Delfino, Foca, Lontra, Trota?", options: ["Foca", "Lontra", "Trota", "Balena"], correctIndex: 2, difficulty: -0.2 },
  { id: "v7", prompt: "Termometro sta a Temperatura come Bilancia sta a ___?", options: ["Peso", "Altezza", "Lunghezza", "Volume"], correctIndex: 0, difficulty: 0.4 },
  { id: "v8", prompt: "Parsimonioso sta a Sprecone come Timido sta a ___?", options: ["Audace", "Riservato", "Prudente", "Silenzioso"], correctIndex: 0, difficulty: 0.9 },
  { id: "v9", prompt: "Quale parola non appartiene al gruppo: Sonetto, Haiku, Romanzo, Limerick, Ballata?", options: ["Sonetto", "Haiku", "Romanzo", "Limerick"], correctIndex: 2, difficulty: 1.0 },
  { id: "v10", prompt: "Effimero sta a Permanente come Trasparente sta a ___?", options: ["Opaco", "Chiaro", "Fragile", "Visibile"], correctIndex: 0, difficulty: 1.3 },
  { id: "v11", prompt: "Cacofonia sta a Armonia come Caos sta a ___?", options: ["Ordine", "Rumore", "Confusione", "Disordine"], correctIndex: 0, difficulty: 1.6 },
  { id: "v12", prompt: "Quale parola non appartiene al gruppo: Vagare, Errare, Girovagare, Correre, Passeggiare?", options: ["Vagare", "Correre", "Errare", "Passeggiare"], correctIndex: 1, difficulty: 1.4 },
];

export default bank;
