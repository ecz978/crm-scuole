import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Stores the report-delivery email on the attempt. Actual sending is wired up
// separately once RESEND_API_KEY is configured (see .env.example) — until then
// this just persists the request so nothing is lost.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.attemptId || typeof body?.email !== "string" || !body.email.includes("@")) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const attempt = await prisma.testAttempt.findUnique({ where: { id: body.attemptId } });
  if (!attempt || attempt.status !== "PAID") return NextResponse.json({ error: "not_found" }, { status: 404 });

  await prisma.testAttempt.update({ where: { id: attempt.id }, data: { email: body.email } });

  return NextResponse.json({ ok: true });
}
