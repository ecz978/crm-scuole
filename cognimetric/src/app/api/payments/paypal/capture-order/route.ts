import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { capturePayPalOrder } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.orderId || !body?.attemptId) return NextResponse.json({ error: "invalid_request" }, { status: 400 });

  const capture = await capturePayPalOrder(body.orderId);
  const status = capture?.status;

  if (status === "COMPLETED") {
    await prisma.$transaction([
      prisma.payment.updateMany({ where: { providerRef: body.orderId }, data: { status: "PAID" } }),
      prisma.testAttempt.update({ where: { id: body.attemptId }, data: { status: "PAID" } }),
    ]);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, status }, { status: 402 });
}
