import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GDPR Art. 15/17 self-service intake: logs an access or deletion request for
// manual fulfilment (no automated account system exists to action it live from).
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.email || (body.type !== "ACCESS" && body.type !== "DELETE")) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  await prisma.dataRequest.create({
    data: { email: body.email, type: body.type, notes: typeof body.notes === "string" ? body.notes : undefined },
  });

  return NextResponse.json({ ok: true });
}
