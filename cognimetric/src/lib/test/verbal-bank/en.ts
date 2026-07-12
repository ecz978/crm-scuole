import type { VerbalBankItem } from "./types";

const bank: VerbalBankItem[] = [
  { id: "v1", prompt: "Hot is to Cold as Day is to ___?", options: ["Night", "Sun", "Bright", "Morning"], correctIndex: 0, difficulty: -1.5 },
  { id: "v2", prompt: "Which word does not belong: Apple, Banana, Carrot, Orange, Grape?", options: ["Apple", "Banana", "Carrot", "Grape"], correctIndex: 2, difficulty: -1.3 },
  { id: "v3", prompt: "Dog is to Puppy as Cat is to ___?", options: ["Kitten", "Cub", "Foal", "Calf"], correctIndex: 0, difficulty: -1.1 },
  { id: "v4", prompt: "Which word does not belong: Piano, Guitar, Violin, Drum, Painting?", options: ["Guitar", "Drum", "Painting", "Violin"], correctIndex: 2, difficulty: -0.9 },
  { id: "v5", prompt: "Author is to Book as Composer is to ___?", options: ["Symphony", "Orchestra", "Piano", "Concert"], correctIndex: 0, difficulty: -0.5 },
  { id: "v6", prompt: "Which word does not belong: Whale, Dolphin, Seal, Otter, Trout?", options: ["Seal", "Otter", "Trout", "Whale"], correctIndex: 2, difficulty: -0.2 },
  { id: "v7", prompt: "Thermometer is to Temperature as Scale is to ___?", options: ["Weight", "Height", "Length", "Volume"], correctIndex: 0, difficulty: 0.4 },
  { id: "v8", prompt: "Frugal is to Wasteful as Timid is to ___?", options: ["Bold", "Shy", "Careful", "Quiet"], correctIndex: 0, difficulty: 0.9 },
  { id: "v9", prompt: "Which word does not belong: Sonnet, Haiku, Novel, Limerick, Ballad?", options: ["Sonnet", "Haiku", "Novel", "Limerick"], correctIndex: 2, difficulty: 1.0 },
  { id: "v10", prompt: "Ephemeral is to Permanent as Transparent is to ___?", options: ["Opaque", "Clear", "Fragile", "Visible"], correctIndex: 0, difficulty: 1.3 },
  { id: "v11", prompt: "Cacophony is to Harmony as Chaos is to ___?", options: ["Order", "Noise", "Confusion", "Disarray"], correctIndex: 0, difficulty: 1.6 },
  { id: "v12", prompt: "Which word does not belong: Meander, Wander, Roam, Sprint, Stroll?", options: ["Meander", "Sprint", "Roam", "Stroll"], correctIndex: 1, difficulty: 1.4 },
];

export default bank;
