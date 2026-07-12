import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPayPalOrder } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.attemptId || !body?.locale) return NextResponse.json({ error: "invalid_request" }, { status: 400 });

  const attempt = await prisma.testAttempt.findUnique({ where: { id: body.attemptId } });
  if (!attempt || attempt.status === "IN_PROGRESS") return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (attempt.status === "PAID") return NextResponse.json({ error: "already_paid" }, { status: 409 });

  const amountCents = Number(process.env.TEST_REPORT_PRICE_CENTS ?? 100);
  const currency = process.env.TEST_REPORT_CURRENCY ?? "eur";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  // PayPal appends its own "?token=<orderId>&PayerID=..." query params to this URL on redirect.
  const returnUrl = `${appUrl}/${body.locale}/test/result/${attempt.id}?payment=paypal_return`;
  const cancelUrl = `${appUrl}/${body.locale}/test/result/${attempt.id}?payment=cancelled`;

  const order = await createPayPalOrder(amountCents, currency, attempt.id, returnUrl, cancelUrl);

  await prisma.payment.upsert({
    where: { attemptId: attempt.id },
    update: { provider: "PAYPAL", providerRef: order.id, amountCents, currency, status: "PENDING" },
    create: { attemptId: attempt.id, provider: "PAYPAL", providerRef: order.id, amountCents, currency, status: "PENDING" },
  });

  return NextResponse.json({ orderId: order.id });
}
