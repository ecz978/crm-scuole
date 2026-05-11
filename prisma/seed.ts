// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding...");

  // Crea scuola CALAM
  const scuola = await prisma.scuola.upsert({
    where: { id: "CALAM" },
    update: {},
    create: {
      id: "CALAM",
      nome: "CFP CALAM",
      codiceMeccanog: "LO-CFP-001",
      sedi: ["Lodi", "Codogno"],
      percorsi: ["Informatica", "Cucina", "Acconciatura", "Estetica", "Moda"],
      annoScolastico: "2024/25",
      piano: "MEDIA",
      stato: "ATTIVA",
    },
  });

  console.log("✅ Scuola CALAM creata:", scuola.id);

  // Password hash
  const pwd = await bcrypt.hash("Calam2024!", 12);

  // Crea utente dirigente
  const dirigente = await prisma.utente.upsert({
    where: { email: "dirigente@calamcfp.it" },
    update: {},
    create: {
      email: "dirigente@calamcfp.it",
      password: pwd,
      nome: "Dirigente",
      cognome: "CALAM",
      ruolo: "DIRIGENTE",
      sede: null,
      attivo: true,
      scuolaId: "CALAM",
    },
  });

  console.log("✅ Utente dirigente creato:", dirigente.email);

  // Crea utente segreteria Lodi
  const segLodi = await prisma.utente.upsert({
    where: { email: "segreteria.lodi@calamcfp.it" },
    update: {},
    create: {
      email: "segreteria.lodi@calamcfp.it",
      password: pwd,
      nome: "Segreteria",
      cognome: "Lodi",
      ruolo: "SEGRETERIA",
      sede: "Lodi",
      attivo: true,
      scuolaId: "CALAM",
    },
  });

  console.log("✅ Utente segreteria Lodi creato:", segLodi.email);

  console.log("\n🎉 Seed completato!");
  console.log("\n📋 Credenziali:");
  console.log("   Dirigente:  dirigente@calamcfp.it  /  Calam2024!");
  console.log("   Segreteria: segreteria.lodi@calamcfp.it  /  Calam2024!");
  console.log("\n⚠️  Cambiare le password dopo il primo accesso!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
