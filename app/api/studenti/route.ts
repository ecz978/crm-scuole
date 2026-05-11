// app/api/studenti/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { studenteSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const user = session.user as any;
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const classe = searchParams.get("classe") || "";
  const sede = searchParams.get("sede") || "";
  const percorso = searchParams.get("percorso") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const skip = (page - 1) * limit;

  const where: any = { scuolaId: user.scuolaId };

  // Segreteria: vede solo la sua sede
  if (user.ruolo === "SEGRETERIA" && user.sede) {
    where.sede = user.sede;
  }

  if (q) {
    where.OR = [
      { cognome: { contains: q, mode: "insensitive" } },
      { nome: { contains: q, mode: "insensitive" } },
      { codFiscale: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  if (classe) where.classe = classe;
  if (sede) where.sede = sede;
  if (percorso) where.percorso = percorso;

  const [studenti, total] = await Promise.all([
    prisma.studente.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ cognome: "asc" }, { nome: "asc" }],
      select: {
        id: true,
        cognome: true,
        nome: true,
        classe: true,
        percorso: true,
        sede: true,
        email: true,
        codFiscale: true,
        dataNascita: true,
        dsa: true,
        disabilita: true,
        annoScolastico: true,
      },
    }),
    prisma.studente.count({ where }),
  ]);

  return NextResponse.json({ studenti, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const user = session.user as any;
  const body = await req.json();

  const parsed = studenteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const studente = await prisma.studente.create({
    data: {
      ...body,
      scuolaId: user.scuolaId,
      createdBy: user.id,
      updatedBy: user.id,
    },
  });

  await logAudit({
    scuolaId: user.scuolaId,
    userId: user.id,
    userEmail: user.email,
    azione: "CREATE",
    collezione: "studenti",
    documentoId: studente.id,
  });

  return NextResponse.json(studente, { status: 201 });
}
