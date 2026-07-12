import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.consentId) return NextResponse.json({ error: "invalid_request" }, { status: 400 });

  await prisma.cookieConsent.upsert({
    where: { consentId: body.consentId },
    update: { analytics: !!body.analytics, marketing: !!body.marketing },
    create: { consentId: body.consentId, analytics: !!body.analytics, marketing: !!body.marketing },
  });

  return NextResponse.json({ ok: true });
}
