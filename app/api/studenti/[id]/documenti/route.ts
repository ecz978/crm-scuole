// app/api/studenti/[id]/documenti/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const user = session.user as any;

  // Verifica che lo studente appartenga alla scuola
  const studente = await prisma.studente.findFirst({
    where: { id: params.id, scuolaId: user.scuolaId },
  });
  if (!studente) return NextResponse.json({ error: "Non trovato" }, { status: 404 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "File mancante" }, { status: 400 });

  // Valida tipo
  const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Tipo file non supportato. Usa PDF, JPG, DOC." }, { status: 400 });
  }

  // Valida size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File troppo grande. Max 10MB." }, { status: 400 });
  }

  // Upload su Vercel Blob
  const blob = await put(
    `${user.scuolaId}/${params.id}/${Date.now()}-${file.name}`,
    file,
    {
      access: "public", // Private per GDPR
      addRandomSuffix: false,
    }
  );

  // Salva nel DB
  const doc = await prisma.documento.create({
    data: {
      studenteId: params.id,
      nome: file.name,
      tipo: file.type.includes("pdf") ? "PDF" : file.type.includes("image") ? "JPG" : "DOC",
      blobUrl: blob.url,
      size: file.size,
      createdBy: user.id,
    },
  });

  return NextResponse.json(doc, { status: 201 });
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const user = session.user as any;

  const studente = await prisma.studente.findFirst({
    where: { id: params.id, scuolaId: user.scuolaId },
  });
  if (!studente) return NextResponse.json({ error: "Non trovato" }, { status: 404 });

  const documenti = await prisma.documento.findMany({
    where: { studenteId: params.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(documenti);
}
