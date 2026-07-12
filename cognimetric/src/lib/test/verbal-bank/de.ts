import type { VerbalBankItem } from "./types";

const bank: VerbalBankItem[] = [
  { id: "v1", prompt: "Heiß verhält sich zu Kalt wie Tag zu ___?", options: ["Nacht", "Sonne", "Hell", "Morgen"], correctIndex: 0, difficulty: -1.5 },
  { id: "v2", prompt: "Welches Wort gehört nicht dazu: Apfel, Banane, Karotte, Orange, Traube?", options: ["Apfel", "Banane", "Karotte", "Traube"], correctIndex: 2, difficulty: -1.3 },
  { id: "v3", prompt: "Hund verhält sich zu Welpe wie Katze zu ___?", options: ["Kätzchen", "Welpe", "Fohlen", "Kalb"], correctIndex: 0, difficulty: -1.1 },
  { id: "v4", prompt: "Welches Wort gehört nicht dazu: Klavier, Gitarre, Violine, Trommel, Gemälde?", options: ["Gitarre", "Trommel", "Gemälde", "Violine"], correctIndex: 2, difficulty: -0.9 },
  { id: "v5", prompt: "Autor verhält sich zu Buch wie Komponist zu ___?", options: ["Sinfonie", "Orchester", "Klavier", "Konzert"], correctIndex: 0, difficulty: -0.5 },
  { id: "v6", prompt: "Welches Wort gehört nicht dazu: Wal, Delfin, Robbe, Otter, Forelle?", options: ["Robbe", "Otter", "Forelle", "Wal"], correctIndex: 2, difficulty: -0.2 },
  { id: "v7", prompt: "Thermometer verhält sich zu Temperatur wie Waage zu ___?", options: ["Gewicht", "Höhe", "Länge", "Volumen"], correctIndex: 0, difficulty: 0.4 },
  { id: "v8", prompt: "Sparsam verhält sich zu Verschwenderisch wie Schüchtern zu ___?", options: ["Mutig", "Zurückhaltend", "Vorsichtig", "Still"], correctIndex: 0, difficulty: 0.9 },
  { id: "v9", prompt: "Welches Wort gehört nicht dazu: Sonett, Haiku, Roman, Limerick, Ballade?", options: ["Sonett", "Haiku", "Roman", "Limerick"], correctIndex: 2, difficulty: 1.0 },
  { id: "v10", prompt: "Vergänglich verhält sich zu Dauerhaft wie Transparent zu ___?", options: ["Undurchsichtig", "Klar", "Zerbrechlich", "Sichtbar"], correctIndex: 0, difficulty: 1.3 },
  { id: "v11", prompt: "Kakophonie verhält sich zu Harmonie wie Chaos zu ___?", options: ["Ordnung", "Lärm", "Verwirrung", "Unordnung"], correctIndex: 0, difficulty: 1.6 },
  { id: "v12", prompt: "Welches Wort gehört nicht dazu: Umherziehen, Schlendern, Wandern, Rennen, Spazieren?", options: ["Umherziehen", "Rennen", "Wandern", "Spazieren"], correctIndex: 1, difficulty: 1.4 },
];

export default bank;
