// app/api/import/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { isValidCF } from "@/lib/validators";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const user = session.user as any;

  // Solo dirigente e vicepreside possono importare
  if (!["DIRIGENTE", "VICEPRESIDE"].includes(user.ruolo)) {
    return NextResponse.json({ error: "Permesso negato" }, { status: 403 });
  }

  const body = await req.json();
  const { righe, mapping, preview = false } = body;

  if (!righe || !Array.isArray(righe)) {
    return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
  }

  const errors: { riga: number; campo: string; messaggio: string }[] = [];
  const toInsert: any[] = [];

  for (let i = 0; i < righe.length; i++) {
    const riga = righe[i];
    const mapped: any = { scuolaId: user.scuolaId, createdBy: user.id };

    // Applica mapping (colonna Spaggiari → campo DB)
    for (const [colSpagg, campoDB] of Object.entries(mapping)) {
      const val = riga[colSpagg];
      if (val !== undefined && val !== null && val !== "") {
        // Gestisci nested paths (es. non servono con Prisma flat)
        mapped[campoDB as string] = String(val).trim();
      }
    }

    // Conversioni tipo
    if (mapped.dataNascita) {
      const d = new Date(mapped.dataNascita);
      if (!isNaN(d.getTime())) {
        mapped.dataNascita = d;
      } else {
        errors.push({ riga: i + 2, campo: "dataNascita", messaggio: "Data non valida" });
        delete mapped.dataNascita;
      }
    }

    // Validazioni obbligatorie
    if (!mapped.cognome || !mapped.nome) {
      errors.push({ riga: i + 2, campo: "cognome/nome", messaggio: "Cognome e nome obbligatori" });
      continue;
    }

    if (mapped.codFiscale && !isValidCF(mapped.codFiscale)) {
      errors.push({ riga: i + 2, campo: "codFiscale", messaggio: `CF non valido: ${mapped.codFiscale}` });
    }

    toInsert.push(mapped);
  }

  // Preview mode: ritorna solo statistiche
  if (preview) {
    return NextResponse.json({
      totale: righe.length,
      pronti: toInsert.length,
      errori: errors,
    });
  }

  // Import reale con upsert (se CF esiste → aggiorna, altrimenti → crea)
  let ok = 0;
  let fail = 0;

  for (const data of toInsert) {
    try {
      if (data.codFiscale) {
        await prisma.studente.upsert({
          where: { scuolaId_codFiscale: { scuolaId: user.scuolaId, codFiscale: data.codFiscale } },
          create: data,
          update: { ...data, updatedBy: user.id },
        });
      } else {
        await prisma.studente.create({ data });
      }
      ok++;
    } catch (e: any) {
      fail++;
      errors.push({ riga: -1, campo: "DB", messaggio: e.message });
    }
  }

  // Salva history
  await prisma.importHistory.create({
    data: {
      scuolaId: user.scuolaId,
      nomeFile: body.nomeFile || "import",
      totaleRighe: righe.length,
      importatiOk: ok,
      importatiFalliti: fail,
      errori: errors,
      createdBy: user.id,
    },
  });

  await logAudit({
    scuolaId: user.scuolaId,
    userId: user.id,
    userEmail: user.email,
    azione: "CREATE",
    collezione: "studenti",
    dettagli: { import: true, ok, fail },
  });

  return NextResponse.json({ ok, fail, errori: errors });
}
