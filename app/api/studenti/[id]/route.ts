// app/api/studenti/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const user = session.user as any;

  const studente = await prisma.studente.findFirst({
    where: { id: params.id, scuolaId: user.scuolaId },
    include: {
      genitori: {
        include: { genitore: true },
      },
      deleghe: true,
      documenti: true,
    },
  });

  if (!studente) return NextResponse.json({ error: "Non trovato" }, { status: 404 });

  await logAudit({
    scuolaId: user.scuolaId,
    userId: user.id,
    userEmail: user.email,
    azione: "READ",
    collezione: "studenti",
    documentoId: studente.id,
  });

  return NextResponse.json(studente);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const user = session.user as any;
  const body = await req.json();

  // Impedisci cambio scuolaId
  delete body.scuolaId;
  delete body.id;

  const studente = await prisma.studente.updateMany({
    where: { id: params.id, scuolaId: user.scuolaId },
    data: { ...body, updatedBy: user.id },
  });

  if (studente.count === 0) return NextResponse.json({ error: "Non trovato" }, { status: 404 });

  await logAudit({
    scuolaId: user.scuolaId,
    userId: user.id,
    userEmail: user.email,
    azione: "UPDATE",
    collezione: "studenti",
    documentoId: params.id,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const user = session.user as any;

  // Solo dirigente può eliminare
  if (user.ruolo !== "DIRIGENTE") {
    return NextResponse.json({ error: "Permesso negato" }, { status: 403 });
  }

  await prisma.studente.deleteMany({
    where: { id: params.id, scuolaId: user.scuolaId },
  });

  await logAudit({
    scuolaId: user.scuolaId,
    userId: user.id,
    userEmail: user.email,
    azione: "DELETE",
    collezione: "studenti",
    documentoId: params.id,
  });

  return NextResponse.json({ ok: true });
}
