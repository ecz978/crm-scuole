import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.attemptId || !body?.locale) return NextResponse.json({ error: "invalid_request" }, { status: 400 });

  const attempt = await prisma.testAttempt.findUnique({ where: { id: body.attemptId } });
  if (!attempt || attempt.status === "IN_PROGRESS") return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (attempt.status === "PAID") return NextResponse.json({ error: "already_paid" }, { status: 409 });

  const amountCents = Number(process.env.TEST_REPORT_PRICE_CENTS ?? 100);
  const currency = process.env.TEST_REPORT_CURRENCY ?? "eur";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency,
          unit_amount: amountCents,
          product_data: { name: "CogniMetric — Full report" },
        },
        quantity: 1,
      },
    ],
    metadata: { attemptId: attempt.id },
    success_url: `${appUrl}/${body.locale}/test/result/${attempt.id}?payment=success`,
    cancel_url: `${appUrl}/${body.locale}/test/result/${attempt.id}?payment=cancelled`,
  });

  await prisma.payment.upsert({
    where: { attemptId: attempt.id },
    update: { provider: "STRIPE", providerRef: session.id, amountCents, currency, status: "PENDING" },
    create: { attemptId: attempt.id, provider: "STRIPE", providerRef: session.id, amountCents, currency, status: "PENDING" },
  });

  return NextResponse.json({ url: session.url });
}
